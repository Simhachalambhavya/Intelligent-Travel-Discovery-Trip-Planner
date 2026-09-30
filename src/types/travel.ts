export type TravelStyle = 'budget' | 'balanced' | 'premium';
export type GroupType = 'solo' | 'couple' | 'family' | 'friends';

export interface TripPreferences {
  budget: number;
  currency: string;
  durationDays: number;
  travelDates?: string;
  originCity: string;
  travelers: {
    total: number;
    adults: number;
    children: number;
    groupType: GroupType;
  };
  domesticOrInternational: 'domestic' | 'international' | 'any';
  preferredWeather: string;
  travelStyle: TravelStyle;
  interests: string[];
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  region?: string;
  placeId?: string;
  formattedAddress?: string;
  types?: string[];
  tagline: string;
  description: string;
  image: string;
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
    breakdown: {
      flights: number;
      hotel: number;
      food: number;
      transport: number;
      activities: number;
    };
  };
  recommendedDays: number;
  weatherSummary: string;
  bestMonths: string[];
  mainAttractions: string[];
  foodSpecialties: string[];
  travelStyleTags: string[];
  matchScore: number;
  whyMatchExplanation: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface WeatherData {
  isLive: boolean;
  temperature: number;
  condition: string;
  weatherCode: number;
  humidity: number;
  rainProbability: number;
  windSpeed: number;
  localTime: string;
  forecast: Array<{
    date: string;
    dayName: string;
    minTemp: number;
    maxTemp: number;
    condition: string;
    rainProb: number;
  }>;
}

export interface Attraction {
  id: string;
  name: string;
  image: string;
  shortDescription: string;
  visitDuration: string;
  estTicketPrice: number;
  currency: string;
  distanceFromHotel: string;
  openingHours: string;
  aiRecommendationReason: string;
  historyAndSignificance?: string;
  googleQuery: string;
  coordinates?: { lat: number; lng: number };
}

export interface Hotel {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  totalStayPrice: number;
  location: string;
  distanceToAttractions: string;
  roomType: string;
  amenities: string[];
  cancellationPolicy: string;
  bookingQuery: string;
  suitability: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  priceRange: string;
  estCostPerPerson: number;
  distance: string;
  openingHours: string;
  popularDishes: string[];
  vegetarianFriendly: boolean;
  ambienceTags: string[];
  officialQuery: string;
}

export interface TourExperience {
  id: string;
  title: string;
  image: string;
  description: string;
  languages: string[];
  duration: string;
  price: number;
  currency: string;
  rating: number;
  meetingLocation: string;
  category: string;
  bookingQuery: string;
}

export interface TransportOption {
  mode: 'taxi' | 'ride_hailing' | 'metro' | 'bus' | 'train' | 'rental_car' | 'airport_transfer' | 'walking';
  title: string;
  description: string;
  estCostRange: string;
  typicalDuration: string;
  tip: string;
}

export interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  stops: string;
  baggage: string;
  price: number;
  currency: string;
  isRoundTrip: boolean;
  searchQuery: string;
}

export interface TrainOption {
  id: string;
  trainName: string;
  trainNumber: string;
  departureStation: string;
  arrivalStation: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  travelClass: string;
  availability: string;
  price: number;
  currency: string;
  searchQuery: string;
}

export interface ItineraryActivity {
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  title: string;
  description: string;
  duration: string;
  location: string;
  estCost: number;
  bookingType?: 'attraction' | 'meal' | 'transport' | 'leisure';
  tips?: string;
  isDone?: boolean;
}

export interface DayItinerary {
  day: number;
  date?: string;
  theme: string;
  activities: ItineraryActivity[];
}

export interface BudgetSummary {
  totalBudget: number;
  currency: string;
  estimatedTotal: number;
  remaining: number;
  items: {
    flights: number;
    hotel: number;
    food: number;
    localTransport: number;
    attractions: number;
    tours: number;
    miscellaneous: number;
    emergencyBuffer: number;
  };
  budgetStatus: 'under' | 'exact' | 'over';
}

export interface SavedTrip {
  id: string;
  title: string;
  destinationName: string;
  country: string;
  image: string;
  createdAt: string;
  dates: string;
  totalCost: number;
  currency: string;
  travelersCount: number;
  travelStyle: TravelStyle;
  itinerary: DayItinerary[];
  budgetSummary: BudgetSummary;
}

export interface UserTripProfile {
  name: string;
  homeCity: string;
  preferredCurrency: string;
  typicalBudget: number;
  travelStyle: TravelStyle;
  travelers: {
    total: number;
    adults: number;
    children: number;
    groupType: GroupType;
  };
  interests: string[];
  favoriteDestinations: string[];
  favoriteCuisines: string[];
}
