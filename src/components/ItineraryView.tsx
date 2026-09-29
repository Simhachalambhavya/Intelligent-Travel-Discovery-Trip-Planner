import React, { useState } from 'react';
import { Calendar, Clock, MapPin, DollarSign, Sparkles, CheckCircle2, ChevronDown, ChevronRight, Navigation, MessageSquare } from 'lucide-react';
import { DayItinerary, ItineraryActivity } from '../types/travel';
import { formatCurrency } from '../utils/currency';

interface ItineraryViewProps {
  itinerary: DayItinerary[];
  currency: string;
  destinationName: string;
  onAskAiAboutActivity?: (activityTitle: string, day: number) => void;
}

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  currency,
  destinationName,
  onAskAiAboutActivity,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>({});

  const toggleComplete = (id: string) => {
    setCompletedActivities((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const currentDayData = itinerary.find((d) => d.day === selectedDay) || itinerary[0];

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center text-slate-500">
        No itinerary generated yet.
      </div>
    );
  }

  const periodColors = {
    morning: { badge: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
    afternoon: { badge: 'bg-sky-100 text-sky-800', dot: 'bg-sky-500' },
    evening: { badge: 'bg-indigo-100 text-indigo-800', dot: 'bg-indigo-500' },
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
            Personalized Day-by-Day Schedule
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
            {itinerary.length}-Day Curated Itinerary
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Designed to balance opening hours, neighborhood travel distances, and cultural highlights.
          </p>
        </div>

        {/* Day Selector Tabs (interactive buttons adhering to interactive tab rule) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {itinerary.map((d) => (
            <button
              key={d.day}
              onClick={() => setSelectedDay(d.day)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold shrink-0 transition-all ${
                selectedDay === d.day
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Day {d.day}
            </button>
          ))}
        </div>
      </div>

      {/* Selected Day Theme Banner */}
      <div className="my-6 bg-slate-50 border border-slate-100 rounded-2xl p-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            Day {currentDayData.day} Focus
          </span>
          <h4 className="text-base font-bold text-slate-900 mt-0.5 font-display">
            {currentDayData.theme}
          </h4>
        </div>
        <span className="text-xs font-semibold text-slate-500 font-mono">
          {currentDayData.activities.length} planned experiences
        </span>
      </div>

      {/* Vertical Timeline */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2 sm:before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {currentDayData.activities.map((act, idx) => {
          const actKey = `day-${currentDayData.day}-act-${idx}`;
          const isDone = completedActivities[actKey];
          const periodStyle = periodColors[act.period] || periodColors.morning;

          return (
            <div key={idx} className="relative group">
              {/* Timeline marker */}
              <button
                onClick={() => toggleComplete(actKey)}
                className={`absolute -left-6 sm:-left-8 top-1.5 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white scale-110 shadow-sm'
                    : 'bg-slate-300 hover:bg-amber-500'
                }`}
                title={isDone ? 'Mark as incomplete' : 'Mark as completed'}
              >
                {isDone && <CheckCircle2 className="w-3.5 h-3.5" />}
              </button>

              {/* Activity Card */}
              <div
                className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                  isDone
                    ? 'bg-slate-50/60 border-slate-200/60 opacity-60'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-sm hover:shadow-md'
                }`}
              >
                {/* Top Row: Time, Period Badge & Estimated Cost */}
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {act.time}
                    </span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${periodStyle.badge}`}>
                      {act.period}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      ({act.duration})
                    </span>
                  </div>

                  <div className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-lg">
                    {act.estCost === 0 ? 'Free' : formatCurrency(act.estCost, currency)}
                  </div>
                </div>

                {/* Title & Description */}
                <h5 className={`text-base font-bold font-display text-slate-900 ${isDone ? 'line-through' : ''}`}>
                  {act.title}
                </h5>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {act.description}
                </p>

                {/* Location & Local Tip */}
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate max-w-xs">{act.location}</span>
                  </div>

                  {/* AI Assistance button */}
                  {onAskAiAboutActivity && (
                    <button
                      onClick={() => onAskAiAboutActivity(act.title, currentDayData.day)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors shrink-0"
                    >
                      <Sparkles className="w-3 h-3 text-amber-600" />
                      <span>Ask AI / Modify Activity</span>
                    </button>
                  )}
                </div>

                {/* Insider Tip callout if present */}
                {act.tips && (
                  <div className="mt-2 text-[11px] text-slate-500 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100/60">
                    <strong className="text-amber-900">TripWise Tip: </strong>
                    {act.tips}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
