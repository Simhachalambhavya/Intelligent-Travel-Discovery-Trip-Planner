import React, { useState } from 'react';
import { Search, Sparkles, Compass, ArrowRight, MapPin, Users, Heart, Shield, HelpCircle } from 'lucide-react';
import { GroupType } from '../types/travel';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onConversationalSubmit: (prompt: string) => void;
  onOpenDiscoveryWizard: () => void;
  onSelectGroupType: (type: GroupType) => void;
  selectedGroupType: GroupType;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onConversationalSubmit,
  onOpenDiscoveryWizard,
  onSelectGroupType,
  selectedGroupType,
}) => {
  const [conversationalInput, setConversationalInput] = useState('');
  const [directSearchQuery, setDirectSearchQuery] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const samplePrompts = [
    'I have ₹80,000, 6 days, traveling with family from Hyderabad. We love history, food & nature.',
    'Couple trip from Mumbai with ₹1,20,000 for 5 days. Looking for romantic beach vibes & seafood.',
    'Solo traveler with ₹45,000 for 5 days, seeking mountain trails, peaceful culture, and cafes.',
    '4 friends with ₹90,000 for 6 days looking for adventure, scenic views, and local nightlife.',
  ];

  const handleConversationalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!conversationalInput.trim()) return;
    setIsSubmitting(true);
    await onConversationalSubmit(conversationalInput);
    setIsSubmitting(false);
  };

  const handleDirectSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directSearchQuery.trim()) return;
    onSearch(directSearchQuery);
  };

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 shadow-xl">
      {/* Background Image with Measured Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_travel_adventure_1790693184062.jpg"
          alt="Breathtaking scenic travel adventure"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/75 to-slate-900/40" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-14 sm:py-20 lg:py-24 text-center">
        {/* Editorial Eyebrow */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-amber-300 font-medium mb-6">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Intelligent Travel Discovery & Complete Trip Planning</span>
        </div>

        {/* Marquee Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display text-white max-w-4xl mx-auto text-balance leading-tight sm:leading-none">
          Your Next Adventure Starts Here.
        </h1>
        <p className="mt-4 text-base sm:text-xl text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed text-balance">
          Tell us your budget, travelers, and interests. We will find your ideal destination and build a complete bookable itinerary.
        </p>

        {/* Conversational AI Search Box */}
        <div className="mt-8 max-w-3xl mx-auto">
          <form
            onSubmit={handleConversationalSubmit}
            className="relative bg-white/95 backdrop-blur-md rounded-2xl p-2 sm:p-2.5 shadow-2xl border border-white/20 text-slate-900"
          >
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="flex-1 flex items-center pl-3">
                <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mr-3" />
                <input
                  type="text"
                  value={conversationalInput}
                  onChange={(e) => setConversationalInput(e.target.value)}
                  placeholder="e.g. “I have ₹80,000, 6 days, family from Hyderabad. We love history, food & nature.”"
                  className="w-full bg-transparent text-sm sm:text-base text-slate-800 placeholder-slate-400 focus:outline-none py-2"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !conversationalInput.trim()}
                className="bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm whitespace-nowrap active:scale-95"
              >
                {isSubmitting ? (
                  <span>Analyzing...</span>
                ) : (
                  <>
                    <span>Ask AI</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Prompt quick inspiration chips */}
          <div className="mt-3 flex items-center justify-center gap-1.5 flex-wrap text-xs text-slate-300">
            <span className="text-slate-400">Try asking:</span>
            {samplePrompts.slice(0, 2).map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setConversationalInput(sample);
                  onConversationalSubmit(sample);
                }}
                className="text-left bg-white/10 hover:bg-white/20 border border-white/15 px-2.5 py-1 rounded-lg text-slate-200 transition-colors text-[11px] truncate max-w-[280px] sm:max-w-none"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Divider & Secondary Search Option */}
        <div className="mt-10 pt-8 border-t border-white/10 max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Option A: "I'm not sure — help me choose a destination" */}
          <button
            onClick={onOpenDiscoveryWizard}
            className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Compass className="w-4 h-4 text-amber-400" />
            <span>I'm not sure — help me choose a destination</span>
          </button>

          {/* Option B: Direct Search Input */}
          <form
            onSubmit={handleDirectSearch}
            className="w-full md:w-auto flex-1 max-w-md relative flex items-center bg-white/10 border border-white/20 rounded-xl px-3 py-1.5 focus-within:border-amber-400 transition-colors"
          >
            <Search className="w-4 h-4 text-slate-300 mr-2 shrink-0" />
            <input
              type="text"
              value={directSearchQuery}
              onChange={(e) => setDirectSearchQuery(e.target.value)}
              placeholder="Or search anywhere in the world (e.g. Rio, Kyoto, Paris)..."
              className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none"
            />
            {directSearchQuery && (
              <button
                type="submit"
                className="text-xs font-semibold text-amber-300 hover:text-amber-200 ml-2"
              >
                Go
              </button>
            )}
          </form>
        </div>

        {/* Travel Style Toggles */}
        <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
          <span className="text-xs font-medium text-slate-400 mr-2">Traveling as:</span>
          {(['solo', 'couple', 'family', 'friends'] as GroupType[]).map((type) => {
            const isSelected = selectedGroupType === type;
            const labels: Record<GroupType, string> = {
              solo: 'Solo Explorer',
              couple: 'Couple / Romance',
              family: 'Family with Kids',
              friends: 'Friends Group',
            };
            return (
              <button
                key={type}
                onClick={() => onSelectGroupType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15 hover:text-white border border-white/10'
                }`}
              >
                {labels[type]}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
