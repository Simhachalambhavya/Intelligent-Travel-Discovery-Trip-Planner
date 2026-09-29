import React from 'react';
import { Compass, Sparkles, Heart, User, Search } from 'lucide-react';

interface NavbarProps {
  activeTab: 'explore' | 'plan' | 'saved' | 'profile';
  setActiveTab: (tab: 'explore' | 'plan' | 'saved' | 'profile') => void;
  currency: string;
  setCurrency: (c: string) => void;
  onOpenPlanModal: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currency,
  setCurrency,
  onOpenPlanModal,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => setActiveTab('explore')}
          className="text-left group flex items-center gap-2"
        >
          <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-display font-extrabold text-sm shadow-sm group-hover:bg-amber-600 transition-colors">
            TW
          </span>
          <span className="text-xl font-bold tracking-tight text-slate-900 font-display">
            TripWise<span className="text-amber-600 font-normal"> AI</span>
          </span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('explore')}
            className={`transition-colors hover:text-slate-900 ${
              activeTab === 'explore' ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-amber-500' : ''
            }`}
          >
            Explore Destinations
          </button>
          <button
            onClick={() => setActiveTab('plan')}
            className={`transition-colors hover:text-slate-900 ${
              activeTab === 'plan' ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-amber-500' : ''
            }`}
          >
            Trip Planner
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`transition-colors hover:text-slate-900 relative ${
              activeTab === 'saved' ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-amber-500' : ''
            }`}
          >
            Saved Trips
            {savedCount > 0 && (
              <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                {savedCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`transition-colors hover:text-slate-900 ${
              activeTab === 'profile' ? 'text-slate-900 font-semibold underline underline-offset-8 decoration-2 decoration-amber-500' : ''
            }`}
          >
            Travel Profile
          </button>
        </nav>

        {/* Zone 3: Actions */}
        <div className="flex items-center gap-3">
          {/* Currency Selector */}
          <div className="relative">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="text-xs font-semibold bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Select Currency"
            >
              <option value="INR">₹ INR</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
              <option value="GBP">£ GBP</option>
              <option value="AED">AED</option>
            </select>
          </div>

          {/* Primary CTA */}
          <button
            onClick={onOpenPlanModal}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 active:scale-95 transition-all shadow-sm whitespace-nowrap"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Plan My Trip</span>
          </button>
        </div>
      </div>
    </header>
  );
};
