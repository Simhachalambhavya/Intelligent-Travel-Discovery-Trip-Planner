import React, { useState, useEffect } from 'react';
import {
  ArrowLeft, Heart, Sparkles, MapPin, Calendar, Sun, Plane, Train, Hotel as HotelIcon,
  Utensils, Navigation, ExternalLink, ShieldCheck, Check, Clock, Users, Star,
  Compass, Share2, Info, ChevronRight, Bookmark, Search, X
} from 'lucide-react';
import { Destination, Attraction, Hotel, Restaurant, TourExperience, TransportOption, FlightOption, TrainOption, DayItinerary, WeatherData, TravelStyle } from '../types/travel';
import { WeatherWidget } from './WeatherWidget';
import { AttractionModal } from './AttractionModal';
import { BudgetCalculator } from './BudgetCalculator';
import { ItineraryView } from './ItineraryView';
import { DestinationSearchInput } from './DestinationSearchInput';
import { formatCurrency, convertFromINR } from '../utils/currency';
import { getOrCreateDestinationDetails } from '../data/destinations';

interface DestinationDetailProps {
  destination: Destination;
  currency: string;
  userBudget: number;
  durationDays: number;
  travelStyle: TravelStyle;
  onBack: () => void;
  onSelectDestination?: (dest: Destination) => void;
  onSaveTrip: (tripData: any) => void;
  isSaved?: boolean;
  onOpenAiChat: (initialMessage?: string) => void;
}

export const DestinationDetail: React.FC<DestinationDetailProps> = ({
  destination,
  currency,
  userBudget,
  durationDays,
  travelStyle,
  onBack,
  onSelectDestination,
  onSaveTrip,
  isSaved = false,
  onOpenAiChat,
}) => {
  const [selectedAttraction, setSelectedAttraction] = useState<Attraction | null>(null);
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'itinerary' | 'budget' | 'hotels' | 'food' | 'transport' | 'best-time'>('overview');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState<boolean>(true);
  const [currentStyle, setCurrentStyle] = useState<TravelStyle>(travelStyle);
  const [hotelFilter, setHotelFilter] = useState<'all' | 'budget' | 'luxury'>('all');
  const [saveSuccessNotice, setSaveSuccessNotice] = useState(false);
  const [isChangeModalOpen, setIsChangeModalOpen] = useState(false);

  const details = getOrCreateDestinationDetails(destination.id, destination.name, destination.country);

  // Fetch live weather from our server proxy
  useEffect(() => {
    let isMounted = true;
    setWeatherLoading(true);

    const lat = destination.coordinates?.lat || 0;
    const lng = destination.coordinates?.lng || 0;

    fetch(`/api/weather?lat=${lat}&lng=${lng}`)
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          setWeather(data);
          setWeatherLoading(false);
        }
      })
      .catch((err) => {
        console.error('Weather error:', err);
        if (isMounted) setWeatherLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [destination]);

  const handleSubTabClick = (tabId: string) => {
    setActiveSubTab(tabId as any);
    const targetMap: Record<string, string> = {
      overview: 'destination-overview',
      itinerary: 'personalized-itinerary',
      budget: 'budget-calculator',
      hotels: 'hotels-section',
      food: 'dining-section',
      transport: 'transport-section',
      'best-time': 'best-time-section',
    };
    const targetId = targetMap[tabId];
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleSave = () => {
    onSaveTrip({
      id: `${destination.id}-${Date.now()}`,
      title: `My ${destination.name} Trip`,
      destinationName: destination.name,
      country: destination.country,
      image: destination.image,
      createdAt: new Date().toLocaleDateString(),
      dates: `${durationDays} Days`,
      totalCost: userBudget,
      currency,
      travelersCount: 2,
      travelStyle: currentStyle,
      itinerary: details.itinerary,
      budgetSummary: {
        totalBudget: userBudget,
        currency,
        estimatedTotal: destination.estimatedCost.min,
        remaining: userBudget - destination.estimatedCost.min,
        items: destination.estimatedCost.breakdown,
        budgetStatus: 'under',
      },
    });
    setSaveSuccessNotice(true);
    setTimeout(() => setSaveSuccessNotice(false), 3000);
  };

  // Filtered hotels
  const filteredHotels = (details.hotels || []).filter((h) => {
    if (hotelFilter === 'budget') return h.pricePerNight < 6000;
    if (hotelFilter === 'luxury') return h.pricePerNight >= 15000;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Top Floating Back & Action Bar */}
      <div className="sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <span className="text-slate-300">|</span>

            <button
              onClick={() => setIsChangeModalOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors border border-amber-200/60"
            >
              <Compass className="w-3.5 h-3.5 text-amber-600" />
              <span>Change Destination</span>
            </button>
          </div>

          {/* Sub-tab Navigation */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'itinerary', label: 'Itinerary' },
              { id: 'budget', label: 'Budget Calculator' },
              { id: 'hotels', label: 'Hotels' },
              { id: 'food', label: 'Dining' },
              { id: 'transport', label: 'Getting Around' },
              { id: 'best-time', label: 'Best Time to Visit' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleSubTabClick(tab.id)}
                className={`py-2 transition-colors hover:text-slate-900 ${
                  activeSubTab === tab.id
                    ? 'text-amber-600 font-bold border-b-2 border-amber-600'
                    : ''
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                isSaved || saveSuccessNotice
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              {isSaved || saveSuccessNotice ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Trip Saved!</span>
                </>
              ) : (
                <>
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save This Trip</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Destination Hero Header */}
      <section className="relative h-[420px] sm:h-[480px] w-full bg-slate-900 overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent" />

        <div className="absolute bottom-8 left-0 right-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold text-amber-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{destination.matchScore}% Match for your preferences</span>
            </div>

            <p className="text-xs sm:text-sm uppercase tracking-widest font-bold text-amber-400">
              {destination.country} · {destination.region}
            </p>

            <h1 className="text-3xl sm:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
              {destination.name}
            </h1>

            <p className="text-sm sm:text-lg text-slate-200 font-normal leading-relaxed text-balance">
              "{destination.tagline}"
            </p>

            {/* Quick stats strip */}
            <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-slate-300">
              <div>
                <span className="text-slate-400 block text-[11px]">Recommended Duration</span>
                <strong className="text-white font-semibold">{destination.recommendedDays} Days</strong>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <span className="text-slate-400 block text-[11px]">Estimated Trip Cost</span>
                <strong className="text-white font-mono font-semibold">
                  {formatCurrency(convertFromINR(destination.estimatedCost.min, currency), currency)} – {formatCurrency(convertFromINR(destination.estimatedCost.max, currency), currency)}
                </strong>
              </div>
              <div className="h-6 w-px bg-white/20" />
              <div>
                <span className="text-slate-400 block text-[11px]">Prime Visiting Season</span>
                <strong className="text-white font-semibold">{destination.bestMonths.join(', ')}</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-12">
        {/* Live Weather Widget */}
        <section>
          <WeatherWidget
            weather={weather}
            destinationName={destination.name}
            loading={weatherLoading}
          />
        </section>

        {/* Why Visit & Famous For Section */}
        <section id="destination-overview" className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block">
                Destination Essence
              </span>
              <h2 className="text-2xl font-bold font-display text-slate-900">
                Why Visit {destination.name}?
              </h2>
              <div className="space-y-2.5">
                {details.whyVisit.map((reason, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {reason}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Famous For Cards */}
            <div className="space-y-3 bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                Famous For
              </span>
              <div className="grid grid-cols-2 gap-2">
                {details.famousFor.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200/60 flex items-center gap-2 text-xs font-semibold text-slate-800"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Section: Image-Based Discovery of Attractions */}
        <section className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                Visual Landmark Discovery
              </span>
              <h2 className="text-2xl font-bold font-display text-slate-900">
                Top Attractions & Experiences
              </h2>
              <p className="text-xs text-slate-500">
                Click any attraction to view visiting hours, tickets, history, and official Google Maps information.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              {details.attractions.length} Must-See Sights
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {details.attractions.map((attr) => (
              <div
                key={attr.id}
                onClick={() => setSelectedAttraction(attr)}
                className="group cursor-pointer bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-lg hover:border-slate-300 transition-all flex flex-col"
              >
                <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={attr.image}
                    alt={attr.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-base font-bold font-display leading-tight truncate">
                      {attr.name}
                    </h3>
                    <span className="text-[11px] text-slate-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-amber-400" />
                      {attr.distanceFromHotel}
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {attr.shortDescription}
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {attr.visitDuration}
                    </span>
                    <span className="font-mono font-bold text-slate-800">
                      {attr.estTicketPrice === 0 ? 'Free' : formatCurrency(attr.estTicketPrice, currency)}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="w-full text-xs font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 group-hover:bg-amber-100 py-2 rounded-xl text-center transition-colors"
                  >
                    View Details & Location
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Complete Budget Calculator */}
        <section id="budget-calculator">
          <BudgetCalculator
            userBudget={userBudget}
            currency={currency}
            travelStyle={currentStyle}
            onStyleChange={setCurrentStyle}
            baseBreakdown={destination.estimatedCost.breakdown}
            durationDays={durationDays}
          />
        </section>

        {/* Section: Day-by-Day Personalized Itinerary */}
        <section id="personalized-itinerary">
          <ItineraryView
            itinerary={details.itinerary}
            currency={currency}
            destinationName={destination.name}
            onAskAiAboutActivity={(activityTitle, day) => {
              onOpenAiChat(`In Day ${day}, regarding "${activityTitle}": can you suggest an alternative or give me advice on the best time to avoid crowds?`);
            }}
          />
        </section>

        {/* Section: Hotel Search Fitting Your Budget */}
        <section id="hotels-section" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                Accommodation Finder
              </span>
              <h2 className="text-2xl font-bold font-display text-slate-900">
                Hotels That Fit Your Budget
              </h2>
              <p className="text-xs text-slate-500">
                Curated stays with live booking links to official search providers.
              </p>
            </div>

            {/* Hotel Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              {[
                { id: 'all', label: 'All Stays' },
                { id: 'budget', label: 'Value / Under ₹6k' },
                { id: 'luxury', label: 'Luxury & Resort' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setHotelFilter(f.id as any)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    hotelFilter === f.id
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => {
              const convertedNight = convertFromINR(hotel.pricePerNight, currency);
              const convertedTotal = convertedNight * durationDays;
              const bookingUrl = `https://www.google.com/travel/hotels?q=${encodeURIComponent(hotel.bookingQuery || hotel.name + ' ' + destination.name)}`;

              return (
                <div
                  key={hotel.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="relative h-48 w-full bg-slate-100">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 backdrop-blur-sm">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{hotel.rating}</span>
                        <span className="text-slate-300 font-normal">({hotel.reviewCount})</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="text-base font-bold font-display text-slate-900 leading-tight">
                          {hotel.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{hotel.location}</span>
                        </p>
                      </div>

                      <p className="text-xs text-slate-600">
                        {hotel.suitability}
                      </p>

                      {/* Amenities */}
                      <div className="flex flex-wrap gap-1">
                        {hotel.amenities.slice(0, 3).map((amenity, i) => (
                          <span
                            key={i}
                            className="text-[11px] bg-slate-50 border border-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
                          >
                            {amenity}
                          </span>
                        ))}
                      </div>

                      <div className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
                        {hotel.cancellationPolicy}
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-4 mt-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Estimated Stay</span>
                      <div className="text-base font-extrabold text-slate-900 font-mono">
                        {formatCurrency(convertedNight, currency)} <span className="text-xs font-normal text-slate-500">/ night</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {formatCurrency(convertedTotal, currency)} for {durationDays} nights
                      </span>
                    </div>

                    <a
                      href={bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
                    >
                      <span>Check Rates</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: Flights & Trains */}
        <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                Travel Logistics
              </span>
              <h2 className="text-2xl font-bold font-display text-slate-900">
                Flights & Long-Distance Connections
              </h2>
              <p className="text-xs text-slate-500">
                Estimated carrier options. Click "Search Flights" for live ticket availability.
              </p>
            </div>

            <a
              href={`https://www.google.com/travel/flights?q=flights+to+${encodeURIComponent(destination.name)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors"
            >
              <span>Search All Flights on Google</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>

          <div className="space-y-3">
            {details.flights.map((flight) => {
              const convertedPrice = convertFromINR(flight.price, currency);
              const flightUrl = `https://www.google.com/travel/flights?q=${encodeURIComponent(flight.searchQuery)}`;

              return (
                <div
                  key={flight.id}
                  className="flex flex-col lg:flex-row lg:items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0">
                      <Plane className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {flight.airline}
                      </h4>
                      <p className="text-xs text-slate-500 font-mono">
                        {flight.flightNumber} · {flight.baggage}
                      </p>
                    </div>
                  </div>

                  {/* Flight Schedule */}
                  <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Depart</span>
                      <span className="font-mono">{flight.departureTime} ({flight.departureAirport})</span>
                    </div>
                    <div className="text-center px-2">
                      <span className="text-[10px] text-slate-400 block">{flight.duration}</span>
                      <div className="w-16 h-0.5 bg-slate-300 relative my-1" />
                      <span className="text-[10px] text-amber-700 block">{flight.stops}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Arrive</span>
                      <span className="font-mono">{flight.arrivalTime} ({flight.arrivalAirport})</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="flex items-center justify-between lg:justify-end gap-4 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block uppercase">Est. Round-Trip</span>
                      <span className="text-base font-extrabold text-slate-900 font-mono">
                        {formatCurrency(convertedPrice, currency)}
                      </span>
                    </div>
                    <a
                      href={flightUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-all inline-flex items-center gap-1"
                    >
                      <span>Check Live</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: Restaurants & Culinary Highlights */}
        <section id="dining-section" className="space-y-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
              Culinary Discovery
            </span>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Authentic Dining in {destination.name}
            </h2>
            <p className="text-xs text-slate-500">
              Selected for authentic local recipes, vegetarian accessibility, and verified guest reputation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {details.restaurants.map((rest) => {
              const googleSearch = `https://www.google.com/search?q=${encodeURIComponent(rest.officialQuery || rest.name + ' ' + destination.name)}`;
              return (
                <div
                  key={rest.id}
                  className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="relative h-44 w-full bg-slate-100">
                      <img
                        src={rest.image}
                        alt={rest.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-slate-900/80 text-white text-xs font-bold px-2 py-0.5 rounded-lg flex items-center gap-1 backdrop-blur-sm">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span>{rest.rating}</span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">
                          {rest.cuisine}
                        </span>
                        <h3 className="text-base font-bold font-display text-slate-900 leading-tight">
                          {rest.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {rest.distance} · {rest.priceRange}
                        </p>
                      </div>

                      <div className="space-y-1">
                        <span className="text-[11px] font-semibold text-slate-700 block">
                          Signature Specialties:
                        </span>
                        <div className="text-xs text-slate-600 line-clamp-2">
                          {rest.popularDishes.join(' · ')}
                        </div>
                      </div>

                      {rest.vegetarianFriendly && (
                        <span className="inline-block text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-md">
                          Vegetarian-Friendly Options Available
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-4 mt-3">
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase">Est. per person</span>
                      <span className="text-xs font-bold font-mono text-slate-800">
                        {formatCurrency(convertFromINR(rest.estCostPerPerson, currency), currency)}
                      </span>
                    </div>

                    <a
                      href={googleSearch}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900"
                    >
                      <span>Menu & Reviews</span>
                      <ExternalLink className="w-3 h-3 text-slate-400" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section: Local Transportation & Getting Around */}
        <section id="transport-section" className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
              Local Mobility
            </span>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Getting Around {destination.name}
            </h2>
            <p className="text-xs text-slate-500">
              Reliable local transport options with realistic fare ranges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {details.transportation.map((t, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-2.5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Navigation className="w-4 h-4 text-amber-600" />
                    <h4 className="text-sm font-bold text-slate-900">{t.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{t.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-200 text-xs space-y-1">
                  <div className="flex justify-between text-slate-500">
                    <span>Est. Cost:</span>
                    <strong className="text-slate-800 font-mono">{t.estCostRange}</strong>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Typical Duration:</span>
                    <strong className="text-slate-800">{t.typicalDuration}</strong>
                  </div>
                  <div className="text-[11px] text-amber-900 bg-amber-100/60 p-2 rounded-lg mt-2">
                    💡 {t.tip}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Month-by-Month Best Time to Visit */}
        <section id="best-time-section" className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
              Seasonality & Climate
            </span>
            <h2 className="text-2xl font-bold font-display text-slate-900">
              Best Time to Visit {destination.name}
            </h2>
            <p className="text-xs text-slate-500">
              Based on historical climate analysis, crowd volumes, and seasonal activities.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block mb-1">
                High Season
              </span>
              <p className="text-xs text-slate-700">{details.bestTimeInfo.highSeason}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
                Shoulder Season (Best Value)
              </span>
              <p className="text-xs text-slate-700">{details.bestTimeInfo.shoulderSeason}</p>
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block mb-1">
                Low Season
              </span>
              <p className="text-xs text-slate-700">{details.bestTimeInfo.lowSeason}</p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-slate-200 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 text-slate-700 font-semibold">
                <tr>
                  <th className="p-3">Month</th>
                  <th className="p-3">Avg Temp (High/Low)</th>
                  <th className="p-3">Rainfall</th>
                  <th className="p-3">Crowd Level</th>
                  <th className="p-3">TripWise Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {details.bestTimeInfo.monthlyGuide.map((m, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-900">{m.month}</td>
                    <td className="p-3 font-mono text-slate-700">{m.temp}</td>
                    <td className="p-3 font-mono text-slate-700">{m.rain}</td>
                    <td className="p-3 text-slate-700">{m.crowd}</td>
                    <td className="p-3 text-slate-600">{m.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* Attraction Modal */}
      <AttractionModal
        attraction={selectedAttraction}
        onClose={() => setSelectedAttraction(null)}
        currency={currency}
      />

      {/* Change Destination Modal */}
      {isChangeModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-slate-900 font-display">
                  Change Destination
                </h3>
              </div>
              <button
                onClick={() => setIsChangeModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Search for any city, country, landmark, or point of interest worldwide:
            </p>

            <DestinationSearchInput
              variant="default"
              autoFocus
              placeholder="e.g. Mount Fuji, Paris, Seoul, Visakhapatnam..."
              onSelectDestination={(newDest) => {
                setIsChangeModalOpen(false);
                if (onSelectDestination) {
                  onSelectDestination(newDest);
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
