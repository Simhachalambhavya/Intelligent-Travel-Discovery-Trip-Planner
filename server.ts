import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import {
  getOrCreateSessionProfile,
  updateSessionFromMessage,
  recordConversationTurn,
  buildN8nAugmentedMessage,
  refineAndVerifyAiResponse,
  generateDomainFallbackResponse,
} from './src/services/tripwiseAiCore.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with required headers
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// 1. Natural Language Travel Intent Parser
app.post('/api/gemini/parse-prompt', async (req: Request, res: Response) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Regex and pattern fallback helper
  const extractFallback = (text: string) => {
    let budget: number | null = null;
    let currency = 'INR';

    // Currency check
    if (text.includes('$') || text.toLowerCase().includes('usd') || text.toLowerCase().includes('dollar')) currency = 'USD';
    else if (text.includes('€') || text.toLowerCase().includes('eur') || text.toLowerCase().includes('euro')) currency = 'EUR';
    else if (text.includes('£') || text.toLowerCase().includes('gbp') || text.toLowerCase().includes('pound')) currency = 'GBP';
    else if (text.includes('₹') || text.toLowerCase().includes('inr') || text.toLowerCase().includes('rupee')) currency = 'INR';

    // Budget check
    const budgetMatch = text.match(/(?:₹|\$|€|£|rs\.?|inr|usd)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|lakh|lakhs|thousand)?/i);
    if (budgetMatch) {
      let num = parseFloat(budgetMatch[1].replace(/,/g, ''));
      const unit = (budgetMatch[2] || '').toLowerCase();
      if (unit === 'k' || unit === 'thousand') num *= 1000;
      if (unit.startsWith('lakh')) num *= 100000;
      if (num >= 500) budget = num;
    }

    // Duration check
    let durationDays = 5;
    const daysMatch = text.match(/(\d+)\s*(?:days|day|nights|night)/i);
    if (daysMatch) {
      durationDays = parseInt(daysMatch[1], 10);
    }

    // Origin check
    let originCity = '';
    const fromMatch = text.match(/(?:from|starting in|departing from)\s+([A-Za-z\s]+?)(?:[,\.]|\s+with|\s+and|\s+we|\s+for|$)/i);
    if (fromMatch) {
      originCity = fromMatch[1].trim();
    }

    // Group check
    let groupType: 'solo' | 'couple' | 'family' | 'friends' = 'solo';
    let totalTravelers = 1;
    let adults = 1;
    let children = 0;

    const lower = text.toLowerCase();
    if (lower.includes('family') || lower.includes('kids') || lower.includes('children')) {
      groupType = 'family';
      totalTravelers = 4;
      adults = 2;
      children = 2;
    } else if (lower.includes('couple') || lower.includes('partner') || lower.includes('wife') || lower.includes('husband') || lower.includes('honeymoon')) {
      groupType = 'couple';
      totalTravelers = 2;
      adults = 2;
      children = 0;
    } else if (lower.includes('friends') || lower.includes('buddies') || lower.includes('group')) {
      groupType = 'friends';
      totalTravelers = 3;
      adults = 3;
      children = 0;
    }

    // Interests check
    const potentialInterests = [
      'history', 'beaches', 'mountains', 'nature', 'adventure', 'food',
      'shopping', 'nightlife', 'culture', 'architecture', 'photography',
      'museums', 'spiritual', 'luxury', 'budget travel', 'romantic', 'wildlife'
    ];
    const interests: string[] = [];
    potentialInterests.forEach(item => {
      if (lower.includes(item)) {
        interests.push(item.charAt(0).toUpperCase() + item.slice(1));
      }
    });

    if (interests.length === 0) {
      interests.push('Culture', 'Food', 'Nature');
    }

    return {
      budget: budget || 75000,
      currency,
      durationDays,
      originCity: originCity || 'Mumbai / Delhi',
      travelers: {
        total: totalTravelers,
        adults,
        children,
        groupType,
      },
      travelStyle: (budget && budget > 150000 ? 'premium' : budget && budget < 40000 ? 'budget' : 'balanced'),
      interests,
      domesticOrInternational: lower.includes('domestic') || lower.includes('india') ? 'domestic' : lower.includes('abroad') || lower.includes('international') ? 'international' : 'any',
      preferredWeather: lower.includes('snow') || lower.includes('cold') ? 'Cool / Alpine' : lower.includes('beach') || lower.includes('warm') ? 'Tropical / Warm' : 'Mild / Sunny',
    };
  };

  if (!ai) {
    return res.json(extractFallback(prompt));
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: `Extract travel parameters from this user query into a clean JSON object.
Query: "${prompt}"

Required JSON structure (do NOT use markdown fences or comments, just pure JSON):
{
  "budget": number or null,
  "currency": "INR" or "USD" or "EUR" or "GBP",
  "durationDays": number (default to 5 if unspecified),
  "originCity": string (e.g. "Hyderabad", "London", or "" if not mentioned),
  "travelers": {
    "total": number,
    "adults": number,
    "children": number,
    "groupType": "solo" | "couple" | "family" | "friends"
  },
  "travelStyle": "budget" | "balanced" | "premium",
  "interests": string[] (e.g. ["History", "Food", "Nature", "Beaches"]),
  "domesticOrInternational": "domestic" | "international" | "any",
  "preferredWeather": string (e.g. "Warm / Sunny", "Cool / Pleasant", "Snow"),
  "missingFields": string[] (list any key missing items such as budget or dates)
}`,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json({
      ...extractFallback(prompt),
      ...parsed,
    });
  } catch (err) {
    console.error('Gemini parse prompt error:', err);
    return res.json(extractFallback(prompt));
  }
});

// 2. Recommend Destinations using AI
app.post('/api/gemini/recommend-destinations', async (req: Request, res: Response) => {
  const prefs = req.body;

  if (!ai) {
    return res.status(200).json({
      note: 'Using curated knowledge base',
      destinations: [],
    });
  }

  try {
    const prompt = `You are TripWise AI, an expert travel planner. Recommend 4 specific destinations matching the traveler's criteria.
User criteria:
- Total Budget: ${prefs.currency || 'INR'} ${prefs.budget || 80000}
- Travel Duration: ${prefs.durationDays || 5} days
- Travelers: ${prefs.travelers?.groupType || 'solo'} (${prefs.travelers?.total || 1} travelers: ${prefs.travelers?.adults || 1} adults, ${prefs.travelers?.children || 0} children)
- Starting City/Airport: ${prefs.originCity || 'India'}
- Travel Style: ${prefs.travelStyle || 'balanced'}
- Interests: ${(prefs.interests || ['Culture', 'Food']).join(', ')}
- Weather Preference: ${prefs.preferredWeather || 'Mild / Sunny'}
- Scope: ${prefs.domesticOrInternational || 'any'}

IMPORTANT:
- Never simply list famous places. Provide an authentic, compelling "whyMatchExplanation" explaining WHY this destination matches their specific budget, time, and travel group.
- Provide estimated costs broken down realistically for this group size in ${prefs.currency || 'INR'}.
- Output JSON strictly matching this schema:
[
  {
    "id": "slug-name",
    "name": "City Name",
    "country": "Country",
    "region": "Continent or Region",
    "tagline": "Evocative short tagline",
    "description": "2-3 sentences overview",
    "image": "https://images.unsplash.com/...",
    "estimatedCost": {
      "min": number,
      "max": number,
      "currency": "${prefs.currency || 'INR'}",
      "breakdown": {
        "flights": number,
        "hotel": number,
        "food": number,
        "transport": number,
        "activities": number
      }
    },
    "recommendedDays": number,
    "weatherSummary": "Short weather summary",
    "bestMonths": ["Month1", "Month2", "Month3"],
    "mainAttractions": ["Attraction 1", "Attraction 2", "Attraction 3"],
    "foodSpecialties": ["Dish 1", "Dish 2", "Dish 3"],
    "travelStyleTags": ["Tag1", "Tag2", "Tag3"],
    "matchScore": number (between 85 and 98),
    "whyMatchExplanation": "Detailed 2-sentence explanation of why it fits this user's budget and interests",
    "coordinates": {
      "lat": number,
      "lng": number
    }
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const destinations = JSON.parse(response.text || '[]');
    return res.json({ destinations });
  } catch (err) {
    console.warn('Gemini recommend destinations error (using curated catalog fallback):', err);
    return res.json({ destinations: [], fallback: true });
  }
});

// 3. n8n AI Agent Webhook Proxy with Multi-Tier Resilience & Verification Guardrails
const N8N_PROD_WEBHOOK = 'https://bhavya-3004.app.n8n.cloud/webhook/tripwise-chat';

function extractN8nText(data: any): string {
  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      if (typeof parsed === 'object' && parsed !== null) {
        return extractN8nText(parsed);
      }
    } catch {
      return data;
    }
    return data;
  }
  if (!data) return '';
  if (Array.isArray(data) && data.length > 0) {
    return extractN8nText(data[0]);
  }
  if (typeof data === 'object') {
    if (typeof data.output === 'string') return data.output;
    if (typeof data.text === 'string') return data.text;
    if (typeof data.response === 'string') return data.response;
    if (typeof data.message === 'string') return data.message;
    if (typeof data.reply === 'string') return data.reply;
    if (typeof data.result === 'string') return data.result;
    if (data.data) return extractN8nText(data.data);
    for (const key of Object.keys(data)) {
      if (typeof data[key] === 'string' && data[key].trim().length > 0) {
        return data[key];
      }
    }
  }
  return typeof data === 'object' ? JSON.stringify(data) : String(data);
}

app.post('/api/n8n/chat', async (req: Request, res: Response) => {
  const { message, sessionId = 'tripwise-user-session', context } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  // 1. Maintain session memory across turns (destination, budget, travelers, interests, history)
  const profile = getOrCreateSessionProfile(sessionId, context);
  updateSessionFromMessage(profile, message);
  recordConversationTurn(profile, 'user', message);

  // 2. Build augmented prompt incorporating TripWise truthfulness & verification directives
  const augmentedMessage = buildN8nAugmentedMessage(message, profile);
  const payload = {
    message: augmentedMessage,
    sessionId: profile.sessionId,
  };

  // Tier 1: Try Primary n8n Webhook
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 22000); // 22s timeout for cloud response

    const prodRes = await fetch(N8N_PROD_WEBHOOK, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (prodRes.ok) {
      const contentType = prodRes.headers.get('content-type') || '';
      const data = contentType.includes('application/json')
        ? await prodRes.json()
        : await prodRes.text();
      const rawReply = extractN8nText(data);
      if (rawReply && rawReply.trim().length > 0) {
        const verifiedReply = refineAndVerifyAiResponse(rawReply, message, profile);
        recordConversationTurn(profile, 'assistant', verifiedReply);
        return res.json({ reply: verifiedReply, success: true });
      }
    } else {
      console.warn(`n8n webhook returned status ${prodRes.status}. Activating TripWise backup AI engine.`);
    }
  } catch (error: any) {
    console.warn('n8n webhook call failed or timed out:', error?.message || error);
  }

  // Tier 2: Local Gemini Engine Backup (gemini-3.1-flash-lite)
  if (ai) {
    try {
      const geminiPrompt = `${augmentedMessage}

Respond as the TripWise AI Concierge, adhering strictly to the operational directives above.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: geminiPrompt,
      });

      if (response.text && response.text.trim().length > 0) {
        const verifiedReply = refineAndVerifyAiResponse(response.text, message, profile);
        recordConversationTurn(profile, 'assistant', verifiedReply);
        return res.json({ reply: verifiedReply, success: true });
      }
    } catch (geminiErr) {
      console.warn('Backup Gemini AI generation failed (using domain expert fallback):', geminiErr);
    }
  }

  // Tier 3: Deterministic Domain Expert Fallback (guaranteed verified response)
  const fallbackReply = generateDomainFallbackResponse(message, profile);
  recordConversationTurn(profile, 'assistant', fallbackReply);
  return res.json({ reply: fallbackReply, success: true });
});

// 4. AI Conversational Assistant & Itinerary modifier
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { message, context, sessionId = 'tripwise-user-session' } = req.body;

  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }

  const profile = getOrCreateSessionProfile(sessionId, context);
  updateSessionFromMessage(profile, message);
  recordConversationTurn(profile, 'user', message);

  if (!ai) {
    const fallbackReply = generateDomainFallbackResponse(message, profile);
    recordConversationTurn(profile, 'assistant', fallbackReply);
    return res.json({ reply: fallbackReply });
  }

  try {
    const prompt = buildN8nAugmentedMessage(message, profile);

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
    });

    const verified = refineAndVerifyAiResponse(response.text || '', message, profile);
    recordConversationTurn(profile, 'assistant', verified);
    return res.json({ reply: verified });
  } catch (err) {
    console.error('Gemini chat error:', err);
    const fallbackReply = generateDomainFallbackResponse(message, profile);
    recordConversationTurn(profile, 'assistant', fallbackReply);
    return res.json({ reply: fallbackReply });
  }
});

// 4. Live Weather Proxy using Open-Meteo API
app.get('/api/weather', async (req: Request, res: Response) => {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng coordinates required' });
  }

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const apiRes = await fetch(url);

    if (!apiRes.ok) {
      throw new Error(`Weather service returned ${apiRes.status}`);
    }

    const data = await apiRes.json();

    const wmoMap: Record<number, string> = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow fall',
      73: 'Moderate snow fall',
      75: 'Heavy snow fall',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
    };

    const currentCode = data.current?.weather_code ?? 0;
    const condition = wmoMap[currentCode] || 'Pleasant';

    const dailyForecast = (data.daily?.time || []).slice(0, 7).map((dateStr: string, idx: number) => {
      const code = data.daily?.weather_code?.[idx] ?? 0;
      const dateObj = new Date(dateStr);
      const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        date: dateStr,
        dayName,
        minTemp: Math.round(data.daily?.temperature_2m_min?.[idx] ?? 20),
        maxTemp: Math.round(data.daily?.temperature_2m_max?.[idx] ?? 28),
        condition: wmoMap[code] || 'Clear',
        rainProb: data.daily?.precipitation_probability_max?.[idx] ?? 10,
      };
    });

    return res.json({
      isLive: true,
      temperature: Math.round(data.current?.temperature_2m ?? 24),
      condition,
      weatherCode: currentCode,
      humidity: Math.round(data.current?.relative_humidity_2m ?? 65),
      windSpeed: Math.round(data.current?.wind_speed_10m ?? 12),
      rainProbability: data.daily?.precipitation_probability_max?.[0] ?? 15,
      localTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      forecast: dailyForecast,
    });
  } catch (err) {
    console.error('Weather API error:', err);
    // Graceful fallback with realistic estimate
    return res.json({
      isLive: false,
      temperature: 26,
      condition: 'Sunny with coastal breeze',
      weatherCode: 1,
      humidity: 62,
      windSpeed: 14,
      rainProbability: 10,
      localTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      forecast: [
        { date: 'Today', dayName: 'Today', minTemp: 22, maxTemp: 28, condition: 'Sunny', rainProb: 10 },
        { date: 'Tomorrow', dayName: 'Tomorrow', minTemp: 21, maxTemp: 29, condition: 'Clear', rainProb: 5 },
        { date: 'Day 3', dayName: 'Wed', minTemp: 20, maxTemp: 27, condition: 'Partly cloudy', rainProb: 15 },
        { date: 'Day 4', dayName: 'Thu', minTemp: 22, maxTemp: 28, condition: 'Sunny', rainProb: 10 },
        { date: 'Day 5', dayName: 'Fri', minTemp: 23, maxTemp: 30, condition: 'Sunny', rainProb: 5 },
        { date: 'Day 6', dayName: 'Sat', minTemp: 21, maxTemp: 28, condition: 'Partly cloudy', rainProb: 20 },
        { date: 'Day 7', dayName: 'Sun', minTemp: 22, maxTemp: 29, condition: 'Clear', rainProb: 10 },
      ],
    });
  }
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`TripWise AI server running on port ${PORT}`);
  });
}

startServer();
