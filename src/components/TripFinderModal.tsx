import React, { useState, useEffect } from 'react';
import { X, Sparkles, Sliders, Calendar, MapPin, Users, Sun, Heart, DollarSign, ArrowRight } from 'lucide-react';
import { TripPreferences, TravelStyle, GroupType } from '../types/travel';
import { formatCurrency } from '../utils/currency';

interface TripFinderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (preferences: TripPreferences) => void;
  initialPreferences: TripPreferences;
  isLoading?: boolean;
}

const ALL_INTERESTS = [
  'Historical places',
  'Beaches',
  'Mountains',
  'Nature',
  'Adventure',
  'Food',
  'Shopping',
  'Nightlife',
  'Culture',
  'Architecture',
  'Photography',
  'Museums',
  'Spiritual/religious places',
  'Luxury',
  'Budget travel',
  'Family activities',
  'Romantic destinations',
  'Hidden gems',
  'Wildlife',
  'Road trips',
];

const WEATHER_OPTIONS = [
  'Any Weather',
  'Warm & Sunny',
  'Tropical Beach Breeze',
  'Crisp Mountain Air',
  'Cool & Scenic',
  'Snow & Winter',
];

export const TripFinderModal: React.FC<TripFinderModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialPreferences,
  isLoading = false,
}) => {
  const [prefs, setPrefs] = useState<TripPreferences>({ ...initialPreferences });

  useEffect(() => {
    if (isOpen) {
      setPrefs({ ...initialPreferences });
    }
  }, [isOpen, initialPreferences]);

  if (!isOpen) return null;

  const toggleInterest = (interest: string) => {
    setPrefs((prev) => {
      const exists = prev.interests.includes(interest);
      const updated = exists
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest];
      return { ...prev, interests: updated };
    });
  };

  const handleGroupTypeChange = (groupType: GroupType) => {
    setPrefs((prev) => {
      let adults = prev.travelers.adults;
      let children = prev.travelers.children;
      if (groupType === 'solo') {
        adults = 1;
        children = 0;
      } else if (groupType === 'couple') {
        adults = 2;
        children = 0;
      } else if (groupType === 'family' && children === 0) {
        children = 1;
      }
      return {
        ...prev,
        travelers: {
          groupType,
          adults,
          children,
          total: adults + children,
        },
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanOrigin = prefs.originCity.trim() || 'Your City';
    const cleanInterests = prefs.interests.length > 0 ? prefs.interests : ['Culture', 'Food', 'Nature'];
    onSubmit({
      ...prefs,
      originCity: cleanOrigin,
      interests: cleanInterests,
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 font-display">
                Tell TripWise What You Love
              </h2>
              <p className="text-xs text-slate-500">
                We'll recommend destinations that match your budget, timeline, and group.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 text-slate-500 hover:text-slate-900 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Row 1: Budget & Currency */}
          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span>Total Trip Budget</span>
              </label>
              <span className="text-base font-extrabold text-amber-700 font-mono">
                {formatCurrency(prefs.budget, prefs.currency)}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
              <div className="sm:col-span-2">
                <input
                  type="range"
                  min={20000}
                  max={400000}
                  step={5000}
                  value={prefs.budget}
                  onChange={(e) => setPrefs({ ...prefs, budget: Number(e.target.value) })}
                  className="w-full accent-amber-600 h-2 bg-amber-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                  <span>₹20,000</span>
                  <span>₹1,50,000</span>
                  <span>₹4,00,000+</span>
                </div>
              </div>
              <div>
                <select
                  value={prefs.currency}
                  onChange={(e) => setPrefs({ ...prefs, currency: e.target.value })}
                  className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="AED">AED</option>
                </select>
              </div>
            </div>
          </div>

          {/* Row 2: Origin City, Duration & Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Starting City / Airport</span>
              </label>
              <input
                type="text"
                value={prefs.originCity}
                onChange={(e) => setPrefs({ ...prefs, originCity: e.target.value })}
                placeholder="e.g. Hyderabad, Mumbai, Delhi"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Trip Duration</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={2}
                  max={21}
                  value={prefs.durationDays}
                  onChange={(e) => setPrefs({ ...prefs, durationDays: Math.max(1, Number(e.target.value)) })}
                  className="w-20 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs sm:text-sm text-center font-bold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-xs text-slate-500 font-medium">Days / Nights</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Destination Preference
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
                {(['any', 'domestic', 'international'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPrefs({ ...prefs, domesticOrInternational: mode })}
                    className={`py-1.5 text-[11px] font-semibold rounded-lg capitalize transition-colors ${
                      prefs.domesticOrInternational === mode
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Row 3: Travelers & Group Type */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Travel Group</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
              {(['solo', 'couple', 'family', 'friends'] as GroupType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleGroupTypeChange(type)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                    prefs.travelers.groupType === type
                      ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <span className="capitalize">{type}</span>
                </button>
              ))}
            </div>

            {/* Adults and Children counters */}
            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Adults (12+ yrs):</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPrefs({
                        ...prefs,
                        travelers: {
                          ...prefs.travelers,
                          adults: Math.max(1, prefs.travelers.adults - 1),
                          total: Math.max(1, prefs.travelers.adults - 1) + prefs.travelers.children,
                        },
                      })
                    }
                    className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-slate-800 w-4 text-center">
                    {prefs.travelers.adults}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPrefs({
                        ...prefs,
                        travelers: {
                          ...prefs.travelers,
                          adults: prefs.travelers.adults + 1,
                          total: prefs.travelers.adults + 1 + prefs.travelers.children,
                        },
                      })
                    }
                    className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-600">Children:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setPrefs({
                        ...prefs,
                        travelers: {
                          ...prefs.travelers,
                          children: Math.max(0, prefs.travelers.children - 1),
                          total: prefs.travelers.adults + Math.max(0, prefs.travelers.children - 1),
                        },
                      })
                    }
                    className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100"
                  >
                    -
                  </button>
                  <span className="text-xs font-bold text-slate-800 w-4 text-center">
                    {prefs.travelers.children}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setPrefs({
                        ...prefs,
                        travelers: {
                          ...prefs.travelers,
                          children: prefs.travelers.children + 1,
                          total: prefs.travelers.adults + prefs.travelers.children + 1,
                        },
                      })
                    }
                    className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Row 4: Travel Style & Weather */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Planning Style
              </label>
              <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl">
                {[
                  { id: 'budget', label: 'Budget Saver' },
                  { id: 'balanced', label: 'Balanced' },
                  { id: 'premium', label: 'Premium' },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setPrefs({ ...prefs, travelStyle: st.id as TravelStyle })}
                    className={`py-2 text-[11px] font-semibold rounded-lg text-center transition-colors ${
                      prefs.travelStyle === st.id
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'text-slate-500 hover:text-slate-900'
                    }`}
                  >
                    {st.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
                <Sun className="w-3.5 h-3.5 text-slate-400" />
                <span>Preferred Weather</span>
              </label>
              <select
                value={prefs.preferredWeather}
                onChange={(e) => setPrefs({ ...prefs, preferredWeather: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {WEATHER_OPTIONS.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 5: Interests Selection (All 20) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-700">
                What do you love most? (Pick 2 or more)
              </label>
              <span className="text-[11px] text-slate-400">
                {prefs.interests.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ALL_INTERESTS.map((interest) => {
                const active = prefs.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      active
                        ? 'bg-amber-600 text-white font-semibold shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <span>Generating Destinations...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Discover Matching Destinations</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
