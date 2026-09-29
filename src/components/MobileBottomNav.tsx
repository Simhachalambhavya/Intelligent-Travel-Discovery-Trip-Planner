import React from 'react';
import { Compass, Sparkles, Bookmark, User, MapPin } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'explore' | 'plan' | 'saved' | 'profile';
  setActiveTab: (tab: 'explore' | 'plan' | 'saved' | 'profile') => void;
  onOpenAiChat: () => void;
  savedCount: number;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenAiChat,
  savedCount,
}) => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 flex items-center justify-around shadow-lg">
      <button
        onClick={() => setActiveTab('explore')}
        className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-semibold transition-colors ${
          activeTab === 'explore' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Compass className="w-5 h-5" />
        <span>Explore</span>
      </button>

      <button
        onClick={() => setActiveTab('plan')}
        className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-semibold transition-colors ${
          activeTab === 'plan' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <MapPin className="w-5 h-5" />
        <span>Planner</span>
      </button>

      {/* Floating Center AI trigger */}
      <button
        onClick={onOpenAiChat}
        className="flex flex-col items-center gap-0.5 -mt-4 bg-slate-900 text-amber-400 p-2.5 rounded-full shadow-lg border-2 border-white hover:bg-slate-800 transition-all active:scale-95"
        aria-label="Ask AI Assistant"
      >
        <Sparkles className="w-5 h-5" />
      </button>

      <button
        onClick={() => setActiveTab('saved')}
        className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-semibold relative transition-colors ${
          activeTab === 'saved' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <Bookmark className="w-5 h-5" />
        <span>Saved</span>
        {savedCount > 0 && (
          <span className="absolute top-0 right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[9px] font-bold flex items-center justify-center">
            {savedCount}
          </span>
        )}
      </button>

      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center gap-0.5 p-1 rounded-lg text-[10px] font-semibold transition-colors ${
          activeTab === 'profile' ? 'text-amber-600' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </button>
    </nav>
  );
};
