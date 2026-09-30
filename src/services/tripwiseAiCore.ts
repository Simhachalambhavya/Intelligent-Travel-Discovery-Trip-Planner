/**
 * TripWise AI Core Engine & Verification Guardrails
 * 
 * Implements strict travel intelligence standards:
 * 1. Session memory across turns (destination, duration, budget, travelers, interests, history).
 * 2. 4-part clarity: Verified Information, General Travel Advice, Information That May Change, Information That Cannot Currently Be Verified.
 * 3. Strict truthfulness: Explicit statements when live travel data (real-time vacancy, tonight's rates, live bike docks) is required.
 * 4. Pop-culture & anime accuracy (Jujutsu Kaisen / Shibuya): Real locations vs fictional depictions, station commuter etiquette.
 * 5. Bicycle rental regulations: Verified apps (LUUP, Docomo Bike Share), Tokyo cycling laws, Scramble Crossing dismount rule.
 * 6. Hotel verification: Real established properties, estimated price ranges, no fabricated deep URLs or booking links.
 * 7. Travel planning flow: Ask only 1-2 key questions if destination-only, start practical day-by-day plan if enough info.
 * 8. Multi-tier resilience: n8n primary -> local Gemini backup -> deterministic domain expert fallback.
 */

export interface TripWiseSessionProfile {
  sessionId: string;
  destination?: string;
  durationDays?: number;
  budget?: string;
  travelers?: string;
  travelStyle?: string;
  interests: string[];
  conversationHistory: Array<{ role: 'user' | 'assistant'; text: string }>;
  lastUpdated: number;
}

// In-memory session profile cache
const sessionStore = new Map<string, TripWiseSessionProfile>();

export function getOrCreateSessionProfile(
  sessionId: string = 'tripwise-user-session',
  uiContext?: {
    destination?: string;
    budget?: number;
    currency?: string;
    travelers?: any;
    interests?: string[];
  }
): TripWiseSessionProfile {
  let profile = sessionStore.get(sessionId);
  if (!profile) {
    profile = {
      sessionId,
      interests: [],
      conversationHistory: [],
      lastUpdated: Date.now(),
    };
    sessionStore.set(sessionId, profile);
  }

  // Merge UI context if present
  if (uiContext) {
    if (uiContext.destination && !profile.destination) {
      profile.destination = uiContext.destination;
    }
    if (uiContext.budget && !profile.budget) {
      profile.budget = `${uiContext.currency || 'INR'} ${uiContext.budget.toLocaleString()}`;
    }
    if (uiContext.interests && uiContext.interests.length > 0) {
      profile.interests = Array.from(new Set([...profile.interests, ...uiContext.interests]));
    }
    if (uiContext.travelers && !profile.travelers) {
      if (typeof uiContext.travelers === 'string') {
        profile.travelers = uiContext.travelers;
      } else if (uiContext.travelers.groupType) {
        profile.travelers = `${uiContext.travelers.groupType} (${uiContext.travelers.total || 1} people)`;
      }
    }
  }

  return profile;
}

/**
 * Extracts and updates travel preferences from natural conversation
 */
export function updateSessionFromMessage(
  profile: TripWiseSessionProfile,
  userMessage: string
): void {
  const lower = userMessage.toLowerCase();

  // Destination detection
  const destinations = [
    'tokyo', 'shibuya', 'kyoto', 'osaka', 'japan', 'akihabara', 'shinjuku', 'harajuku',
    'amalfi', 'rome', 'paris', 'london', 'bali', 'rio', 'dubai', 'bangkok', 'singapore',
    'new york', 'barcelona', 'iceland', 'switzerland', 'goa', 'kashmir', 'kerala'
  ];
  for (const dest of destinations) {
    if (lower.includes(dest)) {
      const formatted = dest.charAt(0).toUpperCase() + dest.slice(1);
      if (!profile.destination) {
        profile.destination = formatted;
      } else if (!profile.destination.toLowerCase().includes(dest)) {
        profile.destination = `${profile.destination} / ${formatted}`;
      }
      break;
    }
  }

  // Duration detection
  const daysMatch = userMessage.match(/(\d+)\s*(?:days|day|nights|night)/i);
  if (daysMatch) {
    profile.durationDays = parseInt(daysMatch[1], 10);
  } else if (lower.includes('a week') || lower.includes('one week')) {
    profile.durationDays = 7;
  } else if (lower.includes('weekend')) {
    profile.durationDays = 3;
  }

  // Travelers / Group detection
  if (lower.includes('solo') || lower.includes('alone') || lower.includes('by myself')) {
    profile.travelers = 'Solo Traveler';
  } else if (lower.includes('couple') || lower.includes('partner') || lower.includes('honeymoon') || lower.includes('with my wife') || lower.includes('with my husband')) {
    profile.travelers = 'Couple';
  } else if (lower.includes('family') || lower.includes('kids') || lower.includes('children')) {
    profile.travelers = 'Family';
  } else if (lower.includes('friends') || lower.includes('group') || lower.includes('buddies')) {
    profile.travelers = 'Group of Friends';
  }

  // Budget detection
  const budgetMatch = userMessage.match(/(?:₹|\$|€|£|rs\.?|inr|usd|yen|jpy)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|lakh|lakhs|thousand)?\s*(?:usd|inr|eur|gbp|yen|jpy|budget|per night|total)?/i);
  if (budgetMatch && !profile.budget) {
    const rawVal = budgetMatch[0].trim();
    if (rawVal.length > 2 && !rawVal.match(/^\d{1,2}$/)) {
      profile.budget = rawVal;
    }
  } else if (lower.includes('budget') || lower.includes('cheap') || lower.includes('hostel') || lower.includes('capsule')) {
    profile.travelStyle = 'Budget-conscious';
  } else if (lower.includes('luxury') || lower.includes('high-end') || lower.includes('5 star') || lower.includes('special grade')) {
    profile.travelStyle = 'Luxury / Premium';
  }

  // Interests detection
  const interestKeywords: Record<string, string> = {
    'jujutsu kaisen': 'Jujutsu Kaisen (JJK) anime locations',
    'jjk': 'Jujutsu Kaisen (JJK) anime locations',
    'anime': 'Anime & Pop Culture',
    'manga': 'Manga & Collectibles',
    'bicycle': 'Bicycle rentals & City cycling',
    'bike': 'Bicycle rentals & City cycling',
    'cycling': 'Bicycle rentals & City cycling',
    'luup': 'LUUP electric bike/scooter rentals',
    'docomo': 'Docomo Bike Share',
    'ramen': 'Ramen & Local Gastronomy',
    'food': 'Local cuisine & Street food',
    'photography': 'Scenic photography & Viewpoints',
    'shopping': 'Shopping & Boutiques',
    'hiking': 'Nature & Hiking',
    'beaches': 'Beaches & Coastal relaxation',
    'culture': 'Historic temples & Culture',
    'hotel': 'Central accommodations & Stays',
  };

  for (const [key, label] of Object.entries(interestKeywords)) {
    if (lower.includes(key) && !profile.interests.includes(label)) {
      profile.interests.push(label);
    }
  }

  profile.lastUpdated = Date.now();
}

/**
 * Record message turn in conversation memory
 */
export function recordConversationTurn(
  profile: TripWiseSessionProfile,
  role: 'user' | 'assistant',
  text: string
): void {
  profile.conversationHistory.push({ role, text });
  if (profile.conversationHistory.length > 12) {
    profile.conversationHistory.shift();
  }
}

/**
 * Determines if we already have sufficient information to build an itinerary
 */
export function hasEnoughInfoForItinerary(profile: TripWiseSessionProfile): boolean {
  if (!profile.destination) return false;
  return Boolean(
    profile.durationDays ||
    profile.interests.length >= 2 ||
    profile.budget ||
    profile.conversationHistory.length >= 2
  );
}

/**
 * Determines if the user query is solely a destination statement with no other criteria
 */
export function isDestinationOnlyQuery(profile: TripWiseSessionProfile, message: string): boolean {
  if (profile.durationDays || profile.budget || profile.interests.length > 1 || profile.conversationHistory.length > 1) {
    return false;
  }
  const words = message.trim().split(/\s+/);
  return words.length <= 6 && Boolean(profile.destination);
}

/**
 * Constructs the high-priority instruction prompt for the n8n AI webhook and backup engines
 */
export function buildN8nAugmentedMessage(
  userMessage: string,
  profile: TripWiseSessionProfile
): string {
  // Confirmed trip context summary
  const contextParts: string[] = [];
  if (profile.destination) contextParts.push(`Destination: ${profile.destination}`);
  if (profile.durationDays) contextParts.push(`Duration: ${profile.durationDays} days`);
  if (profile.travelers) contextParts.push(`Travelers: ${profile.travelers}`);
  if (profile.travelStyle) contextParts.push(`Style: ${profile.travelStyle}`);
  if (profile.budget) contextParts.push(`Budget: ${profile.budget}`);
  if (profile.interests.length > 0) contextParts.push(`Key Interests: ${profile.interests.join(', ')}`);

  const contextStr = contextParts.length > 0 ? contextParts.join(' | ') : 'Exploring travel options';

  const shouldBuildItinerary = hasEnoughInfoForItinerary(profile);
  const isDestinationOnly = isDestinationOnlyQuery(profile, userMessage);

  return `[TRIPWISE AI VERIFICATION & ACCURACY DIRECTIVES:
Role: You are TripWise AI Concierge, a highly knowledgeable, precise, and transparent travel advisor.

CRITICAL OPERATIONAL RULES:
1. 4-CATEGORY STRUCTURE:
   When advising the traveler, clearly distinguish between:
   - **Verified Information**: Confirmed geography, subway lines, verified real-world attractions, official apps (e.g. LUUP, Docomo Bike Share).
   - **General Travel Advice**: Neighborhood suggestions, walking sequence, transit etiquette, cycling laws.
   - **Information That May Change**: Estimated hotel prices, seasonal opening hours, rush hour demand.
   - **Information That Cannot Currently Be Verified**: Live room availability right now, tonight's exact vacancy, exact bikes at a specific dock right now.

2. TRUTHFULNESS & LIVE DATA POLICY:
   - You do NOT have live reservation access, real-time hotel vacancy feeds, or live bike dock telemetry.
   - If the user asks for a current price, current availability, tonight's rates, current weather, current transportation status, or current rental-bike availability, EXPLICITLY STATE that live data is required and that you cannot verify real-time status.
   - Provide realistic ESTIMATED price ranges only (e.g., "$120 – $200 USD/night estimate"), and explicitly instruct the traveler to check official apps or booking platforms before booking.

3. POP-CULTURE & ANIME INTEGRITY (Jujutsu Kaisen / Tokyo / Shibuya):
   - Clearly distinguish real-world locations from anime depictions.
   - Verified real-world places depicted in the series:
     * Shibuya Station Fukutoshin Line B5F platform (regular active Tokyo Metro subway platform; the curses/battles/curtains are fictional).
     * Shibuya Station Exit 13 & Miyashita Park area (perimeter and assembly area).
     * Shibuya Stream & Inaribashi Bridge (pedestrian area along Shibuya River).
     * Shibuya Scramble Crossing.
     * Harajuku Takeshita Street.
   - NEVER claim that an unverified spot is an exact anime location. Never invent fictional exits (such as "C9 exit").
   - Station & commuter etiquette: Shibuya Station is one of the world's busiest passenger transit hubs. Battles and curtains are fictional. Travelers must never block stairs, escalators, turnstiles, or commuter foot traffic for photos or cosplay.

4. BICYCLE RENTALS IN TOKYO:
   - Recommend real verified services: **LUUP** (app-based e-bikes & e-scooters with designated parking ports) and **Docomo Bike Share** (red e-assist city bikes).
   - Tokyo cycling regulations: Bicycles must ride on roadways or designated cycling paths on the left; riding on crowded sidewalks is prohibited; riding across Shibuya Scramble Crossing is strictly prohibited (must dismount and push); bikes must only be parked in designated ports or pay-parking lots to prevent municipal impoundment.
   - State that real-time dock availability must be checked in the respective LUUP or Docomo smartphone apps.

5. ACCOMMODATION & NO INVENTED URLS:
   - Recommend established, real hotels (e.g. The Millennials Shibuya, Shibuya Stream Excel Hotel Tokyu, Shibuya Excel Hotel Tokyu, All Day Place Shibuya, Sequence Miyashita Park).
   - Never invent URLs, deep booking links, or exact real-time prices. Recommend official booking platforms (Booking.com, Expedia, Agoda) and hotel apps by name.

6. PLANNING FLOW:
   ${isDestinationOnly 
     ? '- The user provided only a destination. Ask ONLY the 1-2 most important missing questions (how many days, preferred budget style) rather than bombarding them.'
     : shouldBuildItinerary 
       ? '- Enough information is already available. Start creating a practical, useful day-by-day plan with realistic pacing, transit methods, separated estimated costs, and pre-booking verification reminders instead of repeatedly asking questions.'
       : '- Provide clear, practical advice and ask only the most essential follow-up question.'}
   - Separate estimated costs from confirmed prices.
   - Mention what must be verified before booking.
   - Keep the conversation natural, warm, and personalized, continuing to remember all details from earlier in the conversation.]

Traveler Profile Context: [${contextStr}]
Traveler Message: ${userMessage}`;
}

/**
 * Validates, sanitizes, and verifies AI responses (from n8n or backup engines)
 */
export function refineAndVerifyAiResponse(
  rawText: string,
  userMessage: string,
  profile: TripWiseSessionProfile
): string {
  if (!rawText || typeof rawText !== 'string') {
    return "I'm right here to help you customize your travel plans! What would you like to explore next?";
  }

  let text = rawText.trim();

  // 1. Strip any accidentally leaked system instruction wrappers if present
  text = text.replace(/^\[TRIPWISE AI VERIFICATION & ACCURACY DIRECTIVES:[\s\S]*?\]\s*/i, '');
  text = text.replace(/^Traveler Profile Context:[\s\S]*?\n/i, '');
  text = text.replace(/^Traveler Message:[\s\S]*?\n/i, '');

  // 2. Clean up known fictional / hallucinated anime locations (e.g., phantom "C9 exit")
  text = text.replace(/(?:the\s+)?["']?C9["']?\s+exit/gi, 'Exit 13 / Shibuya Stream exit');
  text = text.replace(/Exit\s+C9/gi, 'Exit 13');

  // 3. Sanitize hallucinated markdown URLs: replace unknown/suspicious deep links with safe reputable domains or bold text
  const trustedDomains = [
    'booking.com', 'expedia.com', 'agoda.com', 'hotels.com', 'tripadvisor.com',
    'google.com/maps', 'maps.google.com', 'tokyometro.jp', 'jreast.co.jp',
    'luup.sc', 'docomo-cycle.jp', 'tokyuhotelsjapan.com', 'japan.travel'
  ];

  text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/gi, (match, anchor, url) => {
    try {
      const parsedUrl = new URL(url);
      const isTrusted = trustedDomains.some(domain => parsedUrl.hostname.includes(domain));
      if (isTrusted) {
        return `[${anchor}](${url})`;
      }
      return `**${anchor}**`;
    } catch {
      return `**${anchor}**`;
    }
  });

  // 4. Check for Live Data Disclaimer when user asked about current availability, rates, tonight, or live bike counts
  const lowerUser = userMessage.toLowerCase();
  const asksForLiveData = 
    lowerUser.includes('current price') ||
    lowerUser.includes('current availability') ||
    lowerUser.includes('available right now') ||
    lowerUser.includes('tonight') ||
    lowerUser.includes('live data') ||
    lowerUser.includes('real-time') ||
    lowerUser.includes('bike availability') ||
    lowerUser.includes('are there bikes') ||
    lowerUser.includes('current weather') ||
    lowerUser.includes('current transportation');

  const textLower = text.toLowerCase();
  const hasLiveDataDisclaimer = 
    textLower.includes('do not have access to live') ||
    textLower.includes('cannot access real-time') ||
    textLower.includes('live data is required') ||
    textLower.includes('cannot verify real-time') ||
    textLower.includes('fluctuate based on') ||
    textLower.includes('rates fluctuate') ||
    textLower.includes('important note: as an ai') ||
    textLower.includes('check official') ||
    textLower.includes('check live') ||
    textLower.includes('real-time data disclaimer') ||
    textLower.includes('real-time data notice');

  if (asksForLiveData && !hasLiveDataDisclaimer) {
    const liveNotice = `\n\n> ℹ️ **Real-Time Data Notice:** As an AI travel concierge, I do not have direct access to live hotel booking engines or real-time bicycle dock telemetry. Availability and rates fluctuate continuously by season and demand. Please check official apps (e.g., LUUP, Docomo Bike Share) and verified booking portals for exact real-time confirmation.`;
    text = text + liveNotice;
  }

  // 5. Jujutsu Kaisen / Anime Travel clarity check:
  // If discussing JJK in Shibuya and missing the real vs fiction distinction or station courtesy, ensure clarity
  if (
    (lowerUser.includes('jujutsu') || lowerUser.includes('jjk')) &&
    (textLower.includes('shibuya') || textLower.includes('fukutoshin') || textLower.includes('station')) &&
    !textLower.includes('fictional') && !textLower.includes('anime depiction') && !textLower.includes('respect commuter')
  ) {
    const animeNotice = `\n\n*Pop-Culture Note:* While locations like Shibuya Station (Fukutoshin Line B5F, Exit 13) and Shibuya Stream are real public landmarks depicted in Jujutsu Kaisen, the battles and "curtains" are fictional. When visiting, please respect commuter flow and Japanese railway photography etiquette.`;
    text = text + animeNotice;
  }

  return text;
}

/**
 * Deterministic domain intelligence fallback generator
 * Strictly adheres to all 10 principles when external AI is temporarily offline or quota-limited.
 */
export function generateDomainFallbackResponse(
  userMessage: string,
  profile: TripWiseSessionProfile
): string {
  const lower = userMessage.toLowerCase();

  // Scenario A: Tokyo, Shibuya, Jujutsu Kaisen, Hotels, Bicycles
  if (
    lower.includes('tokyo') || lower.includes('shibuya') || lower.includes('jujutsu') ||
    lower.includes('jjk') || lower.includes('japan') || lower.includes('bike') || lower.includes('bicycle')
  ) {
    const asksLive = lower.includes('current') || lower.includes('availability') || lower.includes('price') || lower.includes('tonight');

    let reply = `Hello! I'm your **TripWise AI Concierge**. I'm here to help you plan your personalized Tokyo trip with realistic logistics, verified locations, and practical advice.\n\n`;

    if (asksLive) {
      reply += `> ℹ️ **Real-Time Data Disclaimer:** As an AI concierge, I do not have access to live reservation engines or real-time bicycle dock counts. Hotel rates and rental bike dock supply fluctuate hourly based on season, day of the week, and peak commuter hours. All prices below are realistic **estimates**—please check official apps and booking engines for live rates before booking.\n\n`;
    }

    reply += `### 1. Verified Information (Locations & Transit)\n` +
      `* **Jujutsu Kaisen Depicted Real-World Locations:**\n` +
      `  - **Shibuya Station Fukutoshin Line Platform (B5F):** The deep underground platform depicted during the pivotal fight in the *Shibuya Incident* arc. This is an active Tokyo Metro subway platform with platform screen doors.\n` +
      `  - **Shibuya Station Exit 13 / Miyashita Park:** The area shown during the Shibuya evacuation and perimeter deployment.\n` +
      `  - **Shibuya Stream & Inaribashi Bridge:** The modern pedestrian walkway along the Shibuya River where Nanami, Maki, and Naobito gathered.\n` +
      `  - **Shibuya Scramble Crossing:** Center of Shibuya, featured in key visual art.\n` +
      `  - **Harajuku Takeshita Street (1 stop north):** The real shopping street where the first-year students meet early in the series.\n` +
      `* **Bicycle Rental Systems in Tokyo:**\n` +
      `  - **LUUP:** Leading app-based e-bike and e-scooter sharing network in Tokyo with dense "ports" across Shibuya, Shinjuku, and Roppongi. Requires the LUUP smartphone app and credit card registration.\n` +
      `  - **Docomo Bike Share (Tokyo Community Cycle):** Widely available red electric-assist city bicycles with ports across Tokyo's 23 wards. Requires registration via app.\n\n` +

      `### 2. General Travel Advice & Etiquette\n` +
      `* **Station Courtesy:** Shibuya Station is one of the busiest passenger transit hubs in the world. The "Shibuya Incident" is entirely fictional—please never block escalators, turnstiles, or commuter foot traffic for photos or cosplay.\n` +
      `* **Cycling Rules in Tokyo:** Bicycles must be ridden on roadways or designated bike paths (not on crowded pedestrian sidewalks). Riding across Shibuya Scramble Crossing is strictly prohibited; cyclists must dismount and push their bikes. Park only in official rental ports to prevent municipal impoundment.\n\n` +

      `### 3. Information That May Change (Estimated Hotel Price Brackets)\n` +
      `* **Budget / Smart Pod:** *The Millennials Shibuya* (~$50 – $90 USD / night estimate)\n` +
      `* **Mid-Range Boutique:** *All Day Place Shibuya* (~$150 – $260 USD / night estimate, near Miyashita Park)\n` +
      `* **Station-Connected:** *Shibuya Excel Hotel Tokyu* (~$220 – $380 USD / night estimate, overlooks Scramble Crossing)\n` +
      `* **Upscale Landmark:** *Shibuya Stream Excel Hotel Tokyu* (~$250 – $420 USD / night estimate)\n` +
      `*(Note: Exact rates depend heavily on advance booking and tourist seasons like Cherry Blossom or Autumn Foliage.)*\n\n` +

      `### 4. Information That Cannot Currently Be Verified\n` +
      `* Exact room vacancy for tonight at individual Shibuya hotels.\n` +
      `* Live available bikes right now at specific LUUP or Docomo docking stations.\n\n` +

      `### 5. Practical 5-Day "Shibuya & Culture" Itinerary\n` +
      `* **Day 1: Arrival & The Shibuya Landmark Walk:** Check into your Shibuya stay. Walk Shibuya Stream, Miyashita Park, and cross the Scramble Crossing. Head up to **Shibuya Sky** for sunset.\n` +
      `* **Day 2: Under Shibuya & Anime Culture:** Visit Shibuya Station (Fukutoshin Line B5F concourse). Explore **Shibuya Parco (6th floor)** for the official Jump Shop and Nintendo Tokyo. Dinner at an izakaya on Nonbei Yokocho.\n` +
      `* **Day 3: City Cycling & Harajuku Greenery:** Unlock a **LUUP** or **Docomo** bike at a morning port. Cycle along the designated lanes to **Yoyogi Park** and Meiji Jingu shrine. Walk down Takeshita Street and Omotesando.\n` +
      `* **Day 4: Akihabara & Shinjuku:** Take the Yamanote Line to **Akihabara** for official manga, figurines, and collectibles (Radio Kaikan, AmiAmi). Evening in **Shinjuku** to view the massive Tokyo Metropolitan Government towers.\n` +
      `* **Day 5: Modern Architecture & Departure:** Morning stroll through Roppongi Hills or Daikanyama. Pick up souvenirs, savor a bowl of artisanal ramen, and head to Haneda/Narita airport.\n\n` +

      `### 6. Verification Checklist Before You Go\n` +
      `* **Hotels:** Check [Booking.com](https://www.booking.com) or [Expedia](https://www.expedia.com) for real-time room availability and confirmed rates.\n` +
      `* **Bike Sharing:** Install the **LUUP** and **Docomo Bike Share** apps in advance to complete ID verification before arriving.\n` +
      `* **Transit:** Pick up a digital **Welcome Suica** or **Pasmo** card on your smartphone for effortless subway and bus tapping.\n\n` +
      `What dates or season are you considering for your trip, and would you like tips on airport transport options?`;

    return reply;
  }

  // Scenario B: User provides only a destination (e.g., "I want to visit Paris", "Planning a trip to Bali")
  if (profile.destination && !profile.durationDays) {
    return `Hello! **${profile.destination}** is a phenomenal choice. To craft a tailored, practical day-by-day plan with realistic cost estimates, I just need two quick details from you:\n\n` +
      `1. **How many days** are you planning to stay?\n` +
      `2. **What is your preferred travel style or budget level** (e.g., budget backpacker, balanced mid-range, or luxury)?\n\n` +
      `Once you share those, I'll generate a complete, verified itinerary for you!`;
  }

  // Scenario C: General travel planning
  return `Hello! I'm your **TripWise AI Concierge**. I can help you build realistic itineraries, evaluate neighborhood hotel options, navigate public transit and bicycle rentals, and separate confirmed facts from estimated travel costs.\n\n` +
    `Tell me where you'd like to travel, your trip duration, and who you're traveling with, and we'll design your ideal adventure!`;
}
