import { TripPreferences } from '../types/travel';

export function parsePromptClientFallback(text: string, currentDefaults?: Partial<TripPreferences>): TripPreferences {
  let budget: number | null = null;
  let currency = currentDefaults?.currency || 'INR';

  // Currency detection
  if (text.includes('$') || text.toLowerCase().includes('usd') || text.toLowerCase().includes('dollar')) currency = 'USD';
  else if (text.includes('€') || text.toLowerCase().includes('eur') || text.toLowerCase().includes('euro')) currency = 'EUR';
  else if (text.includes('£') || text.toLowerCase().includes('gbp') || text.toLowerCase().includes('pound')) currency = 'GBP';
  else if (text.includes('₹') || text.toLowerCase().includes('inr') || text.toLowerCase().includes('rupee')) currency = 'INR';

  // Budget detection
  const budgetMatch = text.match(/(?:₹|\$|€|£|rs\.?|inr|usd)?\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|lakh|lakhs|thousand)?/i);
  if (budgetMatch) {
    let num = parseFloat(budgetMatch[1].replace(/,/g, ''));
    const unit = (budgetMatch[2] || '').toLowerCase();
    if (unit === 'k' || unit === 'thousand') num *= 1000;
    if (unit.startsWith('lakh')) num *= 100000;
    if (num >= 500) budget = num;
  }

  // Duration detection
  let durationDays = currentDefaults?.durationDays || 5;
  const daysMatch = text.match(/(\d+)\s*(?:days|day|nights|night)/i);
  if (daysMatch) {
    durationDays = parseInt(daysMatch[1], 10);
  }

  // Origin detection
  let originCity = currentDefaults?.originCity || 'Hyderabad';
  const fromMatch = text.match(/(?:from|starting in|departing from)\s+([A-Za-z\s]+?)(?:[,\.]|\s+with|\s+and|\s+we|\s+for|$)/i);
  if (fromMatch) {
    originCity = fromMatch[1].trim();
  }

  // Group detection
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

  // Interests detection
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
    budget: budget || currentDefaults?.budget || 80000,
    currency,
    durationDays,
    originCity,
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
}
