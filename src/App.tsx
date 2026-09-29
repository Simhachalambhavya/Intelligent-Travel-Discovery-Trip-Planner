import React, { useState } from 'react';
import {
  Compass, Sparkles, Search, MapPin, Heart, ArrowRight, Sun, Calendar,
  ShieldCheck, DollarSign, Users, Filter, Check, Plane, Tag, HelpCircle
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { DestinationCard } from './components/DestinationCard';
import { DestinationDetail } from './components/DestinationDetail';
import { TripFinderModal } from './components/TripFinderModal';
import { AiChatAssistant } from './components/AiChatAssistant';
import { SavedTripsView } from './components/SavedTripsView';
import { UserProfileModal } from './components/UserProfileModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { POPULAR_DESTINATIONS } from './data/destinations';
import { Destination, TripPreferences, UserTripProfile, SavedTrip, GroupType, TravelStyle } from './types/travel';
import { formatCurrency, convertFromINR } from './utils/currency';
import { parsePromptClientFallback } from './utils/intentParser';

export default function App() {
  const [activeTab, setActiveTab] = useState<'explore' | 'plan' | 'saved' | 'profile'>('explore');
  const [currency, setCurrency] = useState<string>('INR');
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isFinderModalOpen, setIsFinderModalOpen] = useState<boolean>(false);
  const [isAiChatOpen, setIsAiChatOpen] = useState<boolean>(false);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string>('');
  const [selectedInterestFilter, setSelectedInterestFilter] = useState<string | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserTripProfile>({
    name: 'Bhavya',
    homeCity: 'Hyderabad, India',
    preferredCurrency: 'INR',
    typicalBudget: 80000,
    travelStyle: 'balanced',
    travelers: {
      total: 3,
      adults: 2,
      children: 1,
      groupType: 'family',
    },
    interests: ['History', 'Food', 'Nature'],
    favoriteDestinations: ['Kyoto', 'Rio de Janeiro'],
    favoriteCuisines: ['Local Cuisine', 'Seafood', 'Street Food'],
  });

  // Current Trip Preferences
  const [tripPreferences, setTripPreferences] = useState<TripPreferences>({
    budget: 80000,
    currency: 'INR',
    durationDays: 6,
    originCity: 'Hyderabad',
    travelers: {
      total: 3,
      adults: 2,
      children: 1,
      groupType: 'family',
    },
    domesticOrInternational: 'any',
    preferredWeather: 'Warm & Sunny',
    travelStyle: 'balanced',
    interests: ['History', 'Food', 'Nature'],
  });

  // Saved Trips Collection
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [savedDestinations, setSavedDestinations] = useState<string[]>([]);

  // Destinations list
  const [destinations, setDestinations] = useState<Destination[]>(POPULAR_DESTINATIONS);

  // Natural Language prompt analysis
  const handleConversationalPrompt = async (prompt: string) => {
    setIsAiGenerating(true);
    let resolvedPrefs: TripPreferences;

    try {
      const res = await fetch('/api/gemini/parse-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const parsed = await res.json();

      resolvedPrefs = {
        budget: parsed.budget || tripPreferences.budget,
        currency: parsed.currency || currency,
        durationDays: parsed.durationDays || tripPreferences.durationDays,
        originCity: parsed.originCity || tripPreferences.originCity,
        travelers: parsed.travelers || tripPreferences.travelers,
        domesticOrInternational: parsed.domesticOrInternational || tripPreferences.domesticOrInternational,
        preferredWeather: parsed.preferredWeather || tripPreferences.preferredWeather,
        travelStyle: parsed.travelStyle || tripPreferences.travelStyle,
        interests: parsed.interests || tripPreferences.interests,
      };
    } catch (err) {
      console.warn('Using client-side conversational parser fallback:', err);
      resolvedPrefs = parsePromptClientFallback(prompt, tripPreferences);
    }

    setTripPreferences(resolvedPrefs);
    if (resolvedPrefs.currency) setCurrency(resolvedPrefs.currency);

    // Request tailored AI recommendations
    await fetchAiRecommendations(resolvedPrefs);
    setIsAiGenerating(false);
  };

  const fetchAiRecommendations = async (prefs: TripPreferences) => {
    setIsAiGenerating(true);
    try {
      const res = await fetch('/api/gemini/recommend-destinations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs),
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();

      if (data.destinations && data.destinations.length > 0) {
        setDestinations(data.destinations);
      } else {
        // Filter or rank popular destinations based on preferences
        const ranked = [...POPULAR_DESTINATIONS].sort((a, b) => {
          const matchA = a.travelStyleTags.some((t) => prefs.interests.includes(t)) ? 1 : 0;
          const matchB = b.travelStyleTags.some((t) => prefs.interests.includes(t)) ? 1 : 0;
          return matchB - matchA;
        });
        setDestinations(ranked);
      }
    } catch (err) {
      console.warn('Using curated destination matching fallback:', err);
      const ranked = [...POPULAR_DESTINATIONS].sort((a, b) => {
        const matchA = a.travelStyleTags.some((t) => prefs.interests.includes(t)) ? 1 : 0;
        const matchB = b.travelStyleTags.some((t) => prefs.interests.includes(t)) ? 1 : 0;
        return matchB - matchA;
      });
      setDestinations(ranked);
    } finally {
      setIsFinderModalOpen(false);
      setActiveTab('explore');
      setIsAiGenerating(false);
    }
  };

  // Direct Search
  const handleDirectSearch = (query: string) => {
    const q = query.toLowerCase().trim();
    const matched = POPULAR_DESTINATIONS.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.travelStyleTags.some((t) => t.toLowerCase().includes(q)) ||
        d.mainAttractions.some((a) => a.toLowerCase().includes(q))
    );

    if (matched.length > 0) {
      setDestinations(matched);
      setSelectedDestination(matched[0]);
    } else {
      // Create on the fly destination entry
      const capitalQ = query.charAt(0).toUpperCase() + query.slice(1);
      const customDest: Destination = {
        id: q.replace(/\s+/g, '-'),
        name: capitalQ,
        country: 'Featured Global Destination',
        tagline: `Discover the unforgettable culture and wonders of ${capitalQ}`,
        description: `Explore historic landmarks, scenic landscapes, and authentic local cuisine in ${capitalQ}.`,
        image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
        estimatedCost: {
          min: 65000,
          max: 95000,
          currency: 'INR',
          breakdown: { flights: 30000, hotel: 25000, food: 15000, transport: 8000, activities: 10000 },
        },
        recommendedDays: 5,
        weatherSummary: 'Pleasant travel season with mild daylight temperatures.',
        bestMonths: ['Mar', 'Apr', 'May', 'Sep', 'Oct'],
        mainAttractions: [`${capitalQ} Old Town`, `${capitalQ} Iconic Landmark`, `${capitalQ} Panorama`],
        foodSpecialties: ['Regional Artisan Stew', 'Fresh Local Bread', 'Traditional Dessert'],
        travelStyleTags: ['Culture', 'History', 'Food', 'Photography'],
        matchScore: 92,
        whyMatchExplanation: `${capitalQ} offers rich exploration aligned with your budget and travel duration.`,
        coordinates: { lat: 25.0, lng: 55.0 },
      };
      setDestinations([customDest, ...POPULAR_DESTINATIONS]);
      setSelectedDestination(customDest);
    }
  };

  const handleToggleSaveDestination = (dest: Destination) => {
    setSavedDestinations((prev) =>
      prev.includes(dest.id) ? prev.filter((id) => id !== dest.id) : [...prev, dest.id]
    );
  };

  const handleSaveTrip = (tripData: SavedTrip) => {
    setSavedTrips((prev) => [tripData, ...prev]);
  };

  const handleDeleteTrip = (id: string) => {
    setSavedTrips((prev) => prev.filter((t) => t.id !== id));
  };

  const handleOpenAiChat = (initialMessage?: string) => {
    if (initialMessage) {
      setChatInitialPrompt(initialMessage);
    }
    setIsAiChatOpen(true);
  };

  // Filtered by interest
  const displayedDestinations = selectedInterestFilter
    ? destinations.filter((d) =>
        d.travelStyleTags.some((t) => t.toLowerCase() === selectedInterestFilter.toLowerCase())
      )
    : destinations;

  const interestPicks = [
    { label: 'Beaches', icon: '🏖', tag: 'Beaches' },
    { label: 'History', icon: '🏛', tag: 'History' },
    { label: 'Mountains', icon: '🏔', tag: 'Mountains' },
    { label: 'Food', icon: '🍜', tag: 'Food' },
    { label: 'Culture', icon: '🎨', tag: 'Culture' },
    { label: 'Romance', icon: '❤️', tag: 'Romantic' },
    { label: 'Adventure', icon: '🥾', tag: 'Adventure' },
    { label: 'Nature', icon: '🌿', tag: 'Nature' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-slate-900">
      {/* Top Bar Contract (1 Row, 3 Zones) */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedDestination(null);
          setActiveTab(tab);
        }}
        currency={currency}
        setCurrency={setCurrency}
        onOpenPlanModal={() => setIsFinderModalOpen(true)}
        savedCount={savedTrips.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {selectedDestination ? (
          <DestinationDetail
            destination={selectedDestination}
            currency={currency}
            userBudget={tripPreferences.budget}
            durationDays={tripPreferences.durationDays}
            travelStyle={tripPreferences.travelStyle}
            onBack={() => setSelectedDestination(null)}
            onSaveTrip={handleSaveTrip}
            isSaved={savedDestinations.includes(selectedDestination.id)}
            onOpenAiChat={handleOpenAiChat}
          />
        ) : activeTab === 'saved' ? (
          <SavedTripsView
            savedTrips={savedTrips}
            currency={currency}
            onSelectTrip={(trip) => {
              const matchedDest = POPULAR_DESTINATIONS.find((d) => d.name === trip.destinationName) || {
                id: trip.id,
                name: trip.destinationName,
                country: trip.country,
                tagline: 'Custom Saved Travel Plan',
                description: `Complete personalized itinerary for ${trip.destinationName}.`,
                image: trip.image,
                estimatedCost: {
                  min: trip.totalCost,
                  max: trip.totalCost * 1.2,
                  currency: trip.currency,
                  breakdown: { flights: 30000, hotel: 25000, food: 15000, transport: 8000, activities: 10000 },
                },
                recommendedDays: trip.itinerary?.length || 5,
                weatherSummary: 'Pleasant conditions for travel.',
                bestMonths: ['Mar', 'Apr', 'Oct', 'Nov'],
                mainAttractions: ['Key Landmark', 'Cultural Center', 'Scenic Viewpoint'],
                foodSpecialties: ['Local Specialty', 'Regional Cuisine'],
                travelStyleTags: ['Culture', 'Adventure'],
                matchScore: 95,
                whyMatchExplanation: 'Matches your saved custom preferences.',
                coordinates: { lat: 20, lng: 77 },
              };
              setSelectedDestination(matchedDest);
            }}
            onDeleteTrip={handleDeleteTrip}
            onOpenPlanModal={() => setIsFinderModalOpen(true)}
          />
        ) : activeTab === 'profile' ? (
          <UserProfileModal
            profile={userProfile}
            onUpdateProfile={(updated) => setUserProfile(updated)}
            currency={currency}
          />
        ) : (
          <div className="space-y-14 pb-20">
            {/* Hero Section with Conversational Search */}
            <HeroSection
              onSearch={handleDirectSearch}
              onConversationalSubmit={handleConversationalPrompt}
              onOpenDiscoveryWizard={() => setIsFinderModalOpen(true)}
              onSelectGroupType={(type: GroupType) => {
                setTripPreferences({
                  ...tripPreferences,
                  travelers: {
                    ...tripPreferences.travelers,
                    groupType: type,
                  },
                });
                setIsFinderModalOpen(true);
              }}
              selectedGroupType={tripPreferences.travelers.groupType}
            />

            {/* Section: Trips that fit your budget (Prompt Section 20) */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                    Value Curation
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
                    Trips That Fit Your Budget
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Realistic total cost estimates including round-trip flights, stays, food, and sightseeing.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">Current target:</span>
                  <span className="text-xs font-bold font-mono bg-slate-100 text-slate-800 px-3 py-1.5 rounded-lg border border-slate-200">
                    {formatCurrency(tripPreferences.budget, currency)}
                  </span>
                </div>
              </div>

              {/* Deal Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  {
                    name: 'Goa',
                    country: 'India',
                    days: 5,
                    costINR: 38000,
                    tags: 'Beach · Portuguese Heritage · Food',
                    destId: 'goa',
                  },
                  {
                    name: 'Dubai',
                    country: 'UAE',
                    days: 5,
                    costINR: 78000,
                    tags: 'Architecture · Desert Safari · Luxury',
                    destId: 'dubai',
                  },
                  {
                    name: 'Bali',
                    country: 'Indonesia',
                    days: 7,
                    costINR: 62000,
                    tags: 'Villas · Rice Terraces · Spiritual',
                    destId: 'bali',
                  },
                  {
                    name: 'Kyoto',
                    country: 'Japan',
                    days: 5,
                    costINR: 98000,
                    tags: 'Temples · Matcha · Ancient History',
                    destId: 'kyoto',
                  },
                ].map((deal) => {
                  const convertedCost = convertFromINR(deal.costINR, currency);
                  const matched = POPULAR_DESTINATIONS.find((d) => d.id === deal.destId);

                  return (
                    <div
                      key={deal.destId}
                      onClick={() => matched && setSelectedDestination(matched)}
                      className="cursor-pointer bg-white rounded-2xl border border-slate-200/80 p-5 hover:border-amber-400 hover:shadow-md transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                            {deal.days} Days Trip
                          </span>
                          <span className="text-[10px] uppercase font-bold text-slate-400">
                            {deal.country}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold font-display text-slate-900 group-hover:text-amber-600 transition-colors">
                          {deal.name}
                        </h3>

                        <p className="text-xs text-slate-500 mt-1">
                          {deal.tags}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-slate-400 block uppercase">Est. Total</span>
                          <span className="text-base font-extrabold font-mono text-slate-900">
                            {formatCurrency(convertedCost, currency)}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-slate-700 group-hover:text-amber-600 inline-flex items-center gap-1">
                          Explore <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section: Explore by Interest */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-6">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                  Travel By Passion
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
                  Explore Destinations by Interest
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select a category to filter destination recommendations.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                {interestPicks.map((cat) => {
                  const isSelected = selectedInterestFilter === cat.tag;
                  return (
                    <button
                      key={cat.tag}
                      onClick={() =>
                        setSelectedInterestFilter(isSelected ? null : cat.tag)
                      }
                      className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                        isSelected
                          ? 'bg-amber-600 border-amber-600 text-white shadow-md'
                          : 'bg-white border-slate-200/80 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <span className="text-2xl">{cat.icon}</span>
                      <span className="text-xs font-bold">{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Section: Main Destination Showcase Grid */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                    AI Curated Catalog
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
                    Recommended Destinations
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {displayedDestinations.length} destinations matching your travel style and budget parameters.
                  </p>
                </div>

                {selectedInterestFilter && (
                  <button
                    onClick={() => setSelectedInterestFilter(null)}
                    className="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    Clear Filter ({selectedInterestFilter})
                  </button>
                )}
              </div>

              {/* Destination Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayedDestinations.map((dest) => (
                  <DestinationCard
                    key={dest.id}
                    destination={dest}
                    currency={currency}
                    onExplore={(d) => setSelectedDestination(d)}
                    isSaved={savedDestinations.includes(dest.id)}
                    onToggleSave={handleToggleSaveDestination}
                  />
                ))}
              </div>
            </section>

            {/* Section: Seasonal Travel */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-700">
                <div className="space-y-2 max-w-xl">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
                    <Sun className="w-4 h-4" />
                    <span>Seasonal Travel Guide</span>
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
                    Where Should You Travel This Month?
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    September and October bring the golden foliage to Kyoto, warm pleasant coastal breezes to Rio, and ideal trekking weather to the Swiss Alps and Amalfi.
                  </p>
                </div>

                <button
                  onClick={() => setIsFinderModalOpen(true)}
                  className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-95 whitespace-nowrap shrink-0"
                >
                  Find My Seasonal Match
                </button>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Floating AI Chat Assistant */}
      <AiChatAssistant
        currentDestination={selectedDestination}
        budget={tripPreferences.budget}
        currency={currency}
        isOpen={isAiChatOpen}
        onToggle={() => setIsAiChatOpen(!isAiChatOpen)}
        initialPrompt={chatInitialPrompt}
      />

      {/* Trip Finder Preference Modal */}
      <TripFinderModal
        isOpen={isFinderModalOpen}
        onClose={() => setIsFinderModalOpen(false)}
        onSubmit={fetchAiRecommendations}
        initialPreferences={tripPreferences}
        isLoading={isAiGenerating}
      />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav
        activeTab={activeTab}
        setActiveTab={(t) => {
          setSelectedDestination(null);
          setActiveTab(t);
        }}
        onOpenAiChat={() => setIsAiChatOpen(true)}
        savedCount={savedTrips.length}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 font-display">TripWise AI</span>
            <span>·</span>
            <span>Intelligent Travel Discovery & Trip Planning</span>
          </div>

          <div className="flex items-center gap-6">
            <span>Live Weather Grounded via Open-Meteo</span>
            <span>·</span>
            <span>Verified Provider Booking Links</span>
            <span>·</span>
            <span>© {new Date().getFullYear()} TripWise</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
