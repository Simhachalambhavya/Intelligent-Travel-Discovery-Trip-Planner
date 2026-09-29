import React, { useState } from 'react';
import { DollarSign, ShieldAlert, Sparkles, TrendingUp, TrendingDown, Check, SlidersHorizontal, AlertCircle } from 'lucide-react';
import { BudgetSummary, TravelStyle } from '../types/travel';
import { formatCurrency, convertFromINR } from '../utils/currency';

interface BudgetCalculatorProps {
  userBudget: number;
  currency: string;
  travelStyle: TravelStyle;
  onStyleChange: (style: TravelStyle) => void;
  baseBreakdown?: {
    flights: number;
    hotel: number;
    food: number;
    transport: number;
    activities: number;
  };
  durationDays: number;
}

export const BudgetCalculator: React.FC<BudgetCalculatorProps> = ({
  userBudget,
  currency,
  travelStyle,
  onStyleChange,
  baseBreakdown = { flights: 40000, hotel: 30000, food: 15000, transport: 8000, activities: 10000 },
  durationDays,
}) => {
  // Multipliers based on planning mode
  const styleMultipliers: Record<TravelStyle, { flight: number; hotel: number; food: number; transport: number; activities: number }> = {
    budget: { flight: 0.9, hotel: 0.7, food: 0.8, transport: 0.7, activities: 0.75 },
    balanced: { flight: 1.0, hotel: 1.0, food: 1.0, transport: 1.0, activities: 1.0 },
    premium: { flight: 1.25, hotel: 1.5, food: 1.4, transport: 1.3, activities: 1.35 },
  };

  const mult = styleMultipliers[travelStyle];

  const flights = convertFromINR(Math.round(baseBreakdown.flights * mult.flight), currency);
  const hotel = convertFromINR(Math.round(baseBreakdown.hotel * mult.hotel), currency);
  const food = convertFromINR(Math.round(baseBreakdown.food * mult.food), currency);
  const localTransport = convertFromINR(Math.round(baseBreakdown.transport * mult.transport), currency);
  const attractions = convertFromINR(Math.round((baseBreakdown.activities * 0.5) * mult.activities), currency);
  const tours = convertFromINR(Math.round((baseBreakdown.activities * 0.35) * mult.activities), currency);
  const taxi = convertFromINR(Math.round((baseBreakdown.transport * 0.4) * mult.transport), currency);
  const miscellaneous = convertFromINR(Math.round(4000 * (durationDays / 5) * mult.food), currency);
  const emergencyBuffer = convertFromINR(Math.round(userBudget * 0.05), currency);

  const estimatedTotal = flights + hotel + food + localTransport + attractions + tours + taxi + miscellaneous + emergencyBuffer;
  const remaining = userBudget - estimatedTotal;
  const percentageUsed = Math.min(100, Math.round((estimatedTotal / (userBudget || 1)) * 100));

  const budgetItems = [
    { label: 'Flights / Long-distance Travel', amount: flights, color: 'bg-sky-500', note: 'Round-trip per person' },
    { label: 'Hotel & Stays', amount: hotel, color: 'bg-indigo-500', note: `${durationDays} nights accommodation` },
    { label: 'Food & Dining', amount: food, color: 'bg-amber-500', note: 'Breakfast, lunch, dinner & cafes' },
    { label: 'Local Transportation (Metro/Bus)', amount: localTransport, color: 'bg-emerald-500', note: 'Transit passes & regional lines' },
    { label: 'Attractions & Sightseeing Tickets', amount: attractions, color: 'bg-rose-500', note: 'Skip-the-line entries & monuments' },
    { label: 'Tour Guides & Local Experiences', amount: tours, color: 'bg-purple-500', note: 'Guided walking & cultural tours' },
    { label: 'Taxi & Ride-Hailing', amount: taxi, color: 'bg-teal-500', note: 'Airport transfers & night cabs' },
    { label: 'Miscellaneous & Shopping', amount: miscellaneous, color: 'bg-slate-400', note: 'Souvenirs & local snacks' },
    { label: 'Emergency Buffer (Recommended)', amount: emergencyBuffer, color: 'bg-amber-700', note: '5% contingent safety fund' },
  ];

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
      {/* Title & Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
            Budget Intelligence
          </span>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
            Trip Budget Breakdown & Calculator
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time automated distribution based on your trip length and traveler group.
          </p>
        </div>

        {/* Smart Budget Modes Toggle */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'budget', label: 'Budget Saver' },
            { id: 'balanced', label: 'Balanced' },
            { id: 'premium', label: 'Premium' },
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => onStyleChange(mode.id as TravelStyle)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                travelStyle === mode.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Your Target Budget
          </span>
          <div className="text-2xl font-extrabold text-slate-900 font-mono">
            {formatCurrency(userBudget, currency)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Set in your trip preferences
          </span>
        </div>

        <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-100">
          <span className="text-[11px] font-semibold text-amber-800 uppercase tracking-wider block mb-1">
            Total Estimated Cost
          </span>
          <div className="text-2xl font-extrabold text-amber-900 font-mono">
            {formatCurrency(estimatedTotal, currency)}
          </div>
          <span className="text-[11px] text-amber-700/80 mt-1 block">
            Includes flights, hotel, food & sights
          </span>
        </div>

        <div
          className={`rounded-2xl p-4 border ${
            remaining >= 0
              ? 'bg-emerald-50/70 border-emerald-100'
              : 'bg-rose-50/70 border-rose-100'
          }`}
        >
          <span
            className={`text-[11px] font-semibold uppercase tracking-wider block mb-1 ${
              remaining >= 0 ? 'text-emerald-800' : 'text-rose-800'
            }`}
          >
            {remaining >= 0 ? 'Remaining Surplus' : 'Budget Deficit'}
          </span>
          <div
            className={`text-2xl font-extrabold font-mono ${
              remaining >= 0 ? 'text-emerald-700' : 'text-rose-700'
            }`}
          >
            {remaining >= 0 ? `+${formatCurrency(remaining, currency)}` : `-${formatCurrency(Math.abs(remaining), currency)}`}
          </div>
          <span
            className={`text-[11px] mt-1 block ${
              remaining >= 0 ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {remaining >= 0 ? 'Well within your budget!' : 'Consider Budget Saver mode'}
          </span>
        </div>
      </div>

      {/* Progress Bar of Budget Consumption */}
      <div className="space-y-2 mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
          <span>Budget Allocated: {percentageUsed}%</span>
          <span className="font-mono text-slate-500">
            {formatCurrency(estimatedTotal, currency)} of {formatCurrency(userBudget, currency)}
          </span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
          {budgetItems.map((item, idx) => {
            const widthPct = Math.max(1, (item.amount / (estimatedTotal || 1)) * 100);
            return (
              <div
                key={idx}
                style={{ width: `${widthPct}%` }}
                className={`${item.color} h-full transition-all duration-500`}
                title={`${item.label}: ${formatCurrency(item.amount, currency)}`}
              />
            );
          })}
        </div>
      </div>

      {/* Itemized Table */}
      <div className="space-y-2.5">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
          Category Allocation Breakdown
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {budgetItems.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 border border-slate-100/80 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <span className={`w-3 h-3 rounded-full ${item.color} shrink-0`} />
                <div>
                  <span className="text-xs font-semibold text-slate-800 block">
                    {item.label}
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    {item.note}
                  </span>
                </div>
              </div>
              <span className="text-xs font-bold font-mono text-slate-900">
                {formatCurrency(item.amount, currency)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
