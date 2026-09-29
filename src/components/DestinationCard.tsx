import React from 'react';
import { ArrowRight, Heart, Sparkles, MapPin, Calendar, Sun, Plane, Hotel, Utensils } from 'lucide-react';
import { Destination } from '../types/travel';
import { formatCurrency, convertFromINR } from '../utils/currency';

interface DestinationCardProps {
  destination: Destination;
  currency: string;
  onExplore: (dest: Destination) => void;
  isSaved?: boolean;
  onToggleSave?: (dest: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  destination,
  currency,
  onExplore,
  isSaved = false,
  onToggleSave,
}) => {
  const convertedMin = convertFromINR(destination.estimatedCost.min, currency);
  const convertedMax = convertFromINR(destination.estimatedCost.max, currency);
  const estFlight = convertFromINR(destination.estimatedCost.breakdown.flights, currency);
  const estHotel = convertFromINR(destination.estimatedCost.breakdown.hotel, currency);

  return (
    <article className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col">
      {/* Visual Image Banner */}
      <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-slate-100">
        <img
          src={destination.image}
          alt={`${destination.name}, ${destination.country}`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          onError={(e) => {
            // Styled graceful CSS fallback
            e.currentTarget.style.display = 'none';
          }}
        />
        {/* Measured Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

        {/* Top Badges: Match % & Heart Save */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-white text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{destination.matchScore}% Match</span>
          </div>
          {onToggleSave && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleSave(destination);
              }}
              className={`w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
                isSaved
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'bg-white/70 text-slate-800 hover:bg-white hover:text-rose-500'
              }`}
              aria-label={isSaved ? 'Remove from saved' : 'Save destination'}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        {/* Bottom Image Overlay: Title & Country */}
        <div className="absolute bottom-4 left-4 right-4 text-white">
          <p className="text-xs uppercase tracking-wider text-amber-300 font-semibold mb-0.5">
            {destination.country}
          </p>
          <h3 className="text-2xl font-bold font-display tracking-tight text-white leading-tight">
            {destination.name}
          </h3>
          <p className="text-xs text-slate-200 line-clamp-1 mt-0.5">
            {destination.tagline}
          </p>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        {/* AI Match Explanation */}
        <div className="bg-amber-50/70 border border-amber-100/80 rounded-2xl p-3.5">
          <div className="flex items-start gap-2 text-xs text-amber-950">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <span className="font-bold">Why it matches: </span>
              {destination.whyMatchExplanation}
            </p>
          </div>
        </div>

        {/* Estimated Costs & Recommended Days */}
        <div className="grid grid-cols-2 gap-3 py-3 border-y border-slate-100">
          <div>
            <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
              Estimated Total
            </span>
            <span className="text-base sm:text-lg font-extrabold text-slate-900 font-mono">
              {formatCurrency(convertedMin, currency)} – {formatCurrency(convertedMax, currency)}
            </span>
            <span className="text-[11px] text-slate-500 block">
              flights + stay + food + activities
            </span>
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 block uppercase tracking-wider">
              Ideal Duration
            </span>
            <span className="text-base sm:text-lg font-bold text-slate-800">
              {destination.recommendedDays} Days
            </span>
            <span className="text-[11px] text-slate-500 block truncate">
              Best in {destination.bestMonths.slice(0, 3).join(', ')}
            </span>
          </div>
        </div>

        {/* Breakdown highlights (Flights & Hotel preview) */}
        <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 px-3.5 py-2.5 rounded-xl">
          <div className="flex items-center gap-1.5">
            <Plane className="w-3.5 h-3.5 text-slate-400" />
            <span>Flight est: <strong className="text-slate-800 font-mono">{formatCurrency(estFlight, currency)}</strong></span>
          </div>
          <div className="flex items-center gap-1.5">
            <Hotel className="w-3.5 h-3.5 text-slate-400" />
            <span>Hotel est: <strong className="text-slate-800 font-mono">{formatCurrency(estHotel, currency)}</strong></span>
          </div>
        </div>

        {/* Best For Tags (Zero-Pill: Clean unboxed metadata with separators) */}
        <div className="space-y-1">
          <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
            Best For
          </div>
          <div className="flex items-center flex-wrap gap-1.5 text-xs text-slate-600">
            {destination.travelStyleTags.map((tag, idx) => (
              <React.Fragment key={tag}>
                <span className="font-medium text-slate-700">{tag}</span>
                {idx < destination.travelStyleTags.length - 1 && (
                  <span className="text-slate-300" aria-hidden="true">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Food Specialties */}
        <div className="text-xs text-slate-500 line-clamp-1">
          <span className="font-semibold text-slate-700">Must try: </span>
          {destination.foodSpecialties.join(' · ')}
        </div>

        {/* Action Button */}
        <button
          onClick={() => onExplore(destination)}
          className="w-full mt-2 bg-slate-900 hover:bg-slate-800 active:scale-[0.98] text-white font-semibold text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm group-hover:bg-amber-600"
        >
          <span>Explore Destination & Plan Trip</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </article>
  );
};
