import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, MapPin, Landmark, Compass, Sparkles, X, Loader2, Globe, Building2, Mountain } from 'lucide-react';
import { Destination } from '../types/travel';
import { buildDestinationFromPlace, RawPlaceData } from '../utils/destinationBuilder';

interface AutocompletePredictionItem {
  placeId: string;
  mainText: string;
  secondaryText: string;
  fullText: string;
  types?: string[];
}

interface DestinationSearchInputProps {
  onSelectDestination: (destination: Destination) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  variant?: 'hero' | 'default';
  autoFocus?: boolean;
}

export const DestinationSearchInput: React.FC<DestinationSearchInputProps> = ({
  onSelectDestination,
  placeholder = 'Search destinations, landmarks, cities worldwide (e.g. Tokyo, Mount Fuji, Paris)...',
  className = '',
  inputClassName = '',
  variant = 'hero',
  autoFocus = false,
}) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AutocompletePredictionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [sessionToken, setSessionToken] = useState<string>(() => generateSessionToken());

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<any>(null);

  function generateSessionToken(): string {
    return 'tripwise-' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch autocomplete suggestions as the user types
  const fetchSuggestions = useCallback(
    async (text: string) => {
      if (!text || text.trim().length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const res = await fetch('/api/places/autocomplete', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: text.trim(), sessionToken }),
        });

        if (res.ok) {
          const data = await res.json();
          setSuggestions(data.suggestions || []);
          setIsOpen(true);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.warn('Autocomplete fetch error:', err);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [sessionToken]
  );

  // Debounced input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    setSelectedIndex(-1);

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!val.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceTimerRef.current = setTimeout(() => {
      fetchSuggestions(val);
    }, 220);
  };

  // Handle selecting a place prediction
  const handleSelectPrediction = async (item: AutocompletePredictionItem) => {
    setIsLoading(true);
    setIsOpen(false);
    setQuery(item.mainText);

    try {
      const res = await fetch('/api/places/details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ placeId: item.placeId, sessionToken }),
      });

      // Renew session token after place selection
      setSessionToken(generateSessionToken());

      if (res.ok) {
        const rawPlace: RawPlaceData = await res.json();
        const dest = buildDestinationFromPlace(rawPlace);
        onSelectDestination(dest);
      } else {
        // Fallback: construct destination from suggestion item
        const fallbackPlace: RawPlaceData = {
          placeId: item.placeId,
          name: item.mainText,
          formattedAddress: item.fullText || `${item.mainText}, ${item.secondaryText}`,
          country: item.secondaryText ? item.secondaryText.split(',').pop()?.trim() : 'Global Destination',
          coordinates: { lat: 20.0, lng: 77.0 },
          types: item.types,
        };
        const dest = buildDestinationFromPlace(fallbackPlace);
        onSelectDestination(dest);
      }
    } catch (err) {
      console.error('Error fetching place details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key or text search submit (e.g. "Mount Fuji", "Disneyland Paris", "beaches in Thailand")
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelectPrediction(suggestions[selectedIndex]);
      return;
    }

    setIsLoading(true);
    setIsOpen(false);

    try {
      const res = await fetch('/api/places/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: query.trim() }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.places && data.places.length > 0) {
          const rawPlace: RawPlaceData = data.places[0];
          const dest = buildDestinationFromPlace(rawPlace);
          onSelectDestination(dest);
          return;
        }
      }

      // If no API result, build a rich custom destination
      const fallbackPlace: RawPlaceData = {
        placeId: `custom-${Date.now()}`,
        name: query.trim(),
        formattedAddress: query.trim(),
        coordinates: { lat: 25.0, lng: 55.0 },
        types: ['tourist_attraction', 'locality'],
      };
      const dest = buildDestinationFromPlace(fallbackPlace);
      onSelectDestination(dest);
    } catch (err) {
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSubmit();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions[selectedIndex]) {
        handleSelectPrediction(suggestions[selectedIndex]);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // Get appropriate icon for place type
  const getPlaceIcon = (types: string[] = []) => {
    const t = types.join(' ').toLowerCase();
    if (t.includes('mountain') || t.includes('natural_feature')) {
      return <Mountain className="w-4 h-4 text-emerald-400 shrink-0" />;
    }
    if (t.includes('landmark') || t.includes('tourist_attraction') || t.includes('monument')) {
      return <Landmark className="w-4 h-4 text-amber-400 shrink-0" />;
    }
    if (t.includes('locality') || t.includes('city') || t.includes('administrative_area')) {
      return <Building2 className="w-4 h-4 text-sky-400 shrink-0" />;
    }
    return <MapPin className="w-4 h-4 text-amber-500 shrink-0" />;
  };

  const isHero = variant === 'hero';

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <form
        onSubmit={handleSubmit}
        className={`relative flex items-center transition-all ${
          isHero
            ? 'bg-white/10 hover:bg-white/15 focus-within:bg-white/20 border border-white/20 focus-within:border-amber-400 rounded-xl px-3 py-1.5'
            : 'bg-white border border-slate-200 focus-within:border-amber-500 focus-within:ring-2 focus-within:ring-amber-500/20 rounded-xl px-3 py-2 shadow-sm'
        }`}
      >
        <Search
          className={`w-4 h-4 mr-2.5 shrink-0 ${
            isHero ? 'text-slate-300' : 'text-slate-400'
          }`}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (suggestions.length > 0) setIsOpen(true);
          }}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full bg-transparent text-xs sm:text-sm focus:outline-none ${
            isHero
              ? 'text-white placeholder-slate-400'
              : 'text-slate-900 placeholder-slate-400'
          } ${inputClassName}`}
        />

        {isLoading ? (
          <Loader2
            className={`w-4 h-4 animate-spin ml-2 shrink-0 ${
              isHero ? 'text-amber-400' : 'text-amber-600'
            }`}
          />
        ) : query ? (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setSuggestions([]);
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className={`p-1 rounded-full transition-colors ml-1 ${
              isHero
                ? 'text-slate-400 hover:text-white hover:bg-white/10'
                : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : null}

        <button
          type="submit"
          disabled={!query.trim() || isLoading}
          className={`ml-2 text-xs font-semibold px-2.5 py-1 rounded-lg transition-all shrink-0 ${
            isHero
              ? 'text-amber-300 hover:text-amber-200 bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-30'
              : 'text-white bg-slate-900 hover:bg-slate-800 active:scale-95 disabled:opacity-40'
          }`}
        >
          Go
        </button>
      </form>

      {/* Autocomplete Suggestions Dropdown */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 top-full mt-2 z-50 rounded-2xl shadow-2xl border overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-150 ${
            isHero
              ? 'bg-slate-900/95 border-slate-700 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="p-2 border-b border-white/10 flex items-center justify-between text-[11px] font-medium text-slate-400 px-3">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-500" />
              <span>Worldwide Destination Search</span>
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider">
              {suggestions.length} {suggestions.length === 1 ? 'place' : 'places'} found
            </span>
          </div>

          <div className="max-h-72 overflow-y-auto divide-y divide-white/5 py-1">
            {suggestions.length > 0 ? (
              suggestions.map((item, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={item.placeId || idx}
                    type="button"
                    onClick={() => handleSelectPrediction(item)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left px-3.5 py-2.5 flex items-start gap-3 transition-colors ${
                      isSelected
                        ? isHero
                          ? 'bg-white/15 text-white'
                          : 'bg-amber-50 text-slate-900'
                        : isHero
                        ? 'hover:bg-white/10 text-slate-200'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="mt-0.5">{getPlaceIcon(item.types)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs sm:text-sm font-semibold truncate flex items-center gap-1.5">
                        <span>{item.mainText}</span>
                        {item.types && item.types.length > 0 && (
                          <span
                            className={`text-[9px] px-1.5 py-0.2 rounded font-normal uppercase tracking-wider ${
                              isHero
                                ? 'bg-white/10 text-amber-300'
                                : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            {formatPlaceType(item.types[0])}
                          </span>
                        )}
                      </div>
                      {item.secondaryText && (
                        <div
                          className={`text-[11px] truncate mt-0.5 ${
                            isHero ? 'text-slate-400' : 'text-slate-500'
                          }`}
                        >
                          {item.secondaryText}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                No matching places found. Press enter to search worldwide.
              </div>
            )}
          </div>

          {/* Quick prompt to search freeform */}
          <div
            onClick={() => handleSubmit()}
            className={`px-3.5 py-2 text-center text-xs cursor-pointer border-t font-medium transition-colors ${
              isHero
                ? 'border-white/10 bg-white/5 hover:bg-white/10 text-amber-300'
                : 'border-slate-100 bg-slate-50 hover:bg-slate-100 text-amber-700'
            }`}
          >
            Explore "{query}" with complete trip details & AI itinerary →
          </div>
        </div>
      )}
    </div>
  );
};

function formatPlaceType(type: string): string {
  if (!type) return 'Place';
  const clean = type.replace(/_/g, ' ');
  if (clean.includes('tourist attraction')) return 'Attraction';
  if (clean.includes('natural feature')) return 'Nature';
  if (clean.includes('locality')) return 'City';
  if (clean.includes('country')) return 'Country';
  if (clean.includes('administrative')) return 'Region';
  if (clean.includes('mountain')) return 'Mountain';
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}
