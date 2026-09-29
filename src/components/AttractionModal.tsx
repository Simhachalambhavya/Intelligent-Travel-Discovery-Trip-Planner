import React from 'react';
import { X, MapPin, Clock, DollarSign, ExternalLink, Sparkles, Navigation, BookOpen } from 'lucide-react';
import { Attraction } from '../types/travel';
import { formatCurrency } from '../utils/currency';

interface AttractionModalProps {
  attraction: Attraction | null;
  onClose: () => void;
  currency: string;
}

export const AttractionModal: React.FC<AttractionModalProps> = ({
  attraction,
  onClose,
  currency,
}) => {
  if (!attraction) return null;

  const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(attraction.googleQuery || attraction.name)}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attraction.name + ' ' + (attraction.distanceFromHotel || ''))}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8 border border-slate-200">
        {/* Top Image Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-slate-100">
          <img
            src={attraction.image}
            alt={attraction.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-900/70 text-white hover:bg-slate-900 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title on image */}
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <h2 className="text-2xl sm:text-3xl font-bold font-display leading-tight">
              {attraction.name}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>{attraction.distanceFromHotel}</span>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* AI Recommendation Reason */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4">
            <div className="flex items-start gap-2.5 text-xs text-amber-950">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-amber-900 mb-0.5">Why TripWise Recommends This:</strong>
                <p className="leading-relaxed">{attraction.aiRecommendationReason}</p>
              </div>
            </div>
          </div>

          {/* Overview Prose */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Overview
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              {attraction.shortDescription}
            </p>
          </div>

          {/* History and Significance */}
          {attraction.historyAndSignificance && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                <span>History & Significance</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {attraction.historyAndSignificance}
              </p>
            </div>
          )}

          {/* Practical Visiting Info Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Visit Duration</span>
              </span>
              <span className="text-xs font-bold text-slate-800">
                {attraction.visitDuration}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-slate-500" />
                <span>Ticket Price</span>
              </span>
              <span className="text-xs font-bold text-slate-800 font-mono">
                {attraction.estTicketPrice === 0 ? 'Free Entry' : formatCurrency(attraction.estTicketPrice, currency)}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Hours</span>
              </span>
              <span className="text-xs font-bold text-slate-800">
                {attraction.openingHours}
              </span>
            </div>
          </div>

          {/* External Verification Links */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-slate-500">
              Explore authentic visitor reviews and live location:
            </span>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-800 transition-colors"
              >
                <Navigation className="w-3.5 h-3.5 text-slate-600" />
                <span>Open in Maps</span>
              </a>
              <a
                href={googleSearchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white transition-colors"
              >
                <span>View on Google</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-300" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
