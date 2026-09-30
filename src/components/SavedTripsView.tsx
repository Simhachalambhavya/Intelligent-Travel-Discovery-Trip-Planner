import React from 'react';
import { Bookmark, Calendar, MapPin, Trash2, ArrowRight, Share2, DollarSign, Download } from 'lucide-react';
import { SavedTrip } from '../types/travel';
import { formatCurrency } from '../utils/currency';

interface SavedTripsViewProps {
  savedTrips: SavedTrip[];
  currency: string;
  onSelectTrip: (trip: SavedTrip) => void;
  onDeleteTrip: (id: string) => void;
  onOpenPlanModal: () => void;
}

export const SavedTripsView: React.FC<SavedTripsViewProps> = ({
  savedTrips,
  currency,
  onSelectTrip,
  onDeleteTrip,
  onOpenPlanModal,
}) => {
  const handleExportTrip = (e: React.MouseEvent, trip: SavedTrip) => {
    e.stopPropagation();
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trip, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${trip.destinationName.toLowerCase()}-tripwise-itinerary.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (savedTrips.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
          <Bookmark className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">
          No Saved Trips Yet
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          When you explore destinations and generate itineraries, you can bookmark them here to plan and revisit anytime.
        </p>
        <button
          onClick={onOpenPlanModal}
          className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm shadow-md transition-all active:scale-95"
        >
          Start Planning a Trip
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
            Personal Itinerary Vault
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900">
            Your Saved Trips & Itineraries
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {savedTrips.length} custom travel itineraries saved in your profile.
          </p>
        </div>

        <button
          onClick={onOpenPlanModal}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all"
        >
          Plan Another Trip
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {savedTrips.map((trip) => (
          <div
            key={trip.id}
            className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
          >
            <div>
              <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                <img
                  src={trip.image}
                  alt={trip.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() => onDeleteTrip(trip.id)}
                    className="w-8 h-8 rounded-full bg-slate-900/70 hover:bg-rose-600 text-white flex items-center justify-center transition-colors"
                    title="Delete trip"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="absolute bottom-3 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                    {trip.country}
                  </span>
                  <h3 className="text-lg font-bold font-display leading-tight truncate">
                    {trip.destinationName}
                  </h3>
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {trip.dates}
                  </span>
                  <span className="capitalize font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md text-[11px]">
                    {trip.travelStyle} Mode
                  </span>
                </div>

                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">Trip Budget:</span>
                  <span className="text-sm font-bold font-mono text-slate-900">
                    {formatCurrency(trip.totalCost, currency)}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Saved on {trip.createdAt} · {trip.itinerary?.length || 0} Days scheduled
                </p>
              </div>
            </div>

            <div className="p-5 pt-0 border-t border-slate-100 flex items-center justify-between gap-2.5 mt-2">
              <button
                onClick={() => onSelectTrip(trip)}
                className="flex-1 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Full Itinerary</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={(e) => handleExportTrip(e, trip)}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                title="Download itinerary JSON"
                aria-label="Download itinerary JSON"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
