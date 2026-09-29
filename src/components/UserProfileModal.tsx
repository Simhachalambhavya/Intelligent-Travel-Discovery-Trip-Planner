import React, { useState } from 'react';
import { User, MapPin, DollarSign, Heart, Sparkles, Check, Save } from 'lucide-react';
import { UserTripProfile, TravelStyle, GroupType } from '../types/travel';
import { formatCurrency } from '../utils/currency';

interface UserProfileModalProps {
  profile: UserTripProfile;
  onUpdateProfile: (updated: UserTripProfile) => void;
  currency: string;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  profile,
  onUpdateProfile,
  currency,
}) => {
  const [formData, setFormData] = useState<UserTripProfile>({ ...profile });
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(formData);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-display font-bold text-lg">
              {formData.name.charAt(0)}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block">
                Traveler Persona
              </span>
              <h2 className="text-2xl font-bold font-display text-slate-900">
                {formData.name}'s Travel Profile
              </h2>
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60">
            Home Base: <strong className="text-slate-800">{formData.homeCity}</strong>
          </div>
        </div>

        {/* AI Insight Box based on preferences */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-4">
          <div className="flex items-start gap-2.5 text-xs text-amber-950">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block text-amber-900 mb-0.5 font-display text-sm">
                Personalized Recommendation Engine
              </strong>
              <p className="leading-relaxed">
                Because you usually prefer <strong>{formData.travelStyle}</strong> style trips from{' '}
                <strong>{formData.homeCity}</strong> with a typical budget of{' '}
                <strong>{formatCurrency(formData.typicalBudget, currency)}</strong> and love{' '}
                <strong>{formData.interests.join(', ')}</strong>, TripWise AI automatically weights
                beach, heritage, and scenic destinations matching your profile.
              </p>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Home City / Origin Airport
              </label>
              <input
                type="text"
                value={formData.homeCity}
                onChange={(e) => setFormData({ ...formData, homeCity: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Typical Trip Budget
              </label>
              <input
                type="number"
                step={5000}
                value={formData.typicalBudget}
                onChange={(e) => setFormData({ ...formData, typicalBudget: Number(e.target.value) })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Default Travel Style
              </label>
              <select
                value={formData.travelStyle}
                onChange={(e) => setFormData({ ...formData, travelStyle: e.target.value as TravelStyle })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="budget">Budget Saver</option>
                <option value="balanced">Balanced</option>
                <option value="premium">Premium</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Default Traveler Group
              </label>
              <select
                value={formData.travelers.groupType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    travelers: { ...formData.travelers, groupType: e.target.value as GroupType },
                  })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="solo">Solo Explorer</option>
                <option value="couple">Couple / Romantic</option>
                <option value="family">Family with Kids</option>
                <option value="friends">Friends Group</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Preferences are stored securely in your browser session.
            </span>
            <button
              type="submit"
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm px-6 py-2.5 rounded-xl transition-all shadow-sm flex items-center gap-2"
            >
              {isSavedNotice ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Profile Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Update Preferences</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
