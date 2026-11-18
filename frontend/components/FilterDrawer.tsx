import React, { useState } from 'react';
import { useApp } from '../AppContext';
import { FoodPreference } from '../types';
import { SlidersHorizontal, Sparkles, X, RotateCcw, Calendar, Utensils } from 'lucide-react';

export const FilterDrawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { preferences, updatePreferences, plan, setSubscriptionModalOpen, haptic, t } = useApp();
  const [localPrefs, setLocalPrefs] = useState(preferences);

  if (!isOpen) return null;

  const handleApply = () => {
    updatePreferences(localPrefs);
    haptic('medium');
    onClose();
  };

  const handleReset = () => {
    haptic('light');
    setLocalPrefs({
      genderPreference: 'all',
      othersSubtypePreference: 'all',
      budgetMin: 5000,
      budgetMax: 50000,
      smokerOk: null,
      drinkerOk: null,
      healthConsciousOnly: false,
      sleepPreference: 'any',
      location: 'All Bangalore / Mumbai',
      rentShareMax: 40000,
      maidShareOk: true,
      petsAllowed: ['dog', 'cat', 'none'],
      minCleaningPerWeek: 1,
      moveInProximityDays: 30,
      foodPreferenceFilter: 'all',
      nonVegCookingInSharedUtensilsOk: null,
      onlyNewHere: false,
      onlyRecentlyActive: false,
    });
  };

  const isPremiumUnlocked = plan !== 'free';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-sm">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col text-slate-100 shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="w-5 h-5 text-rose-500" />
            <h3 className="text-lg font-bold text-white">Discovery Filters</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filters */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
          {/* Food & Kitchen Habits Filter */}
          <div className="p-3.5 bg-slate-800/40 rounded-2xl border border-slate-700/60 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-amber-400" />
                <label className="text-xs font-bold text-white">Food & Kitchen Habits</label>
              </div>
              <span className="text-[10px] text-amber-300 font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 uppercase">
                {localPrefs.foodPreferenceFilter || 'All'}
              </span>
            </div>

            {/* Diet Category Chips */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'all', label: 'All Diets' },
                { id: 'veg', label: '🥗 Pure Veg' },
                { id: 'eggetarian', label: '🍳 Eggetarian' },
                { id: 'non_veg', label: '🍗 Non-Veg' },
                { id: 'jain', label: '🌿 Jain Diet' },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setLocalPrefs({ ...localPrefs, foodPreferenceFilter: item.id as any });
                    haptic('light');
                  }}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition text-center ${
                    (localPrefs.foodPreferenceFilter || 'all') === item.id
                      ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Non-Veg Cooking in Shared Utensils Toggle */}
            <div className="pt-2 border-t border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-200 block font-medium">Non-Veg in Shared Utensils</span>
                  <span className="text-[10px] text-slate-400">
                    {localPrefs.nonVegCookingInSharedUtensilsOk === null
                      ? "Don't care / Flexible"
                      : localPrefs.nonVegCookingInSharedUtensilsOk
                      ? 'Must be Allowed'
                      : 'Must NOT be cooked in shared pans'}
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setLocalPrefs({
                        ...localPrefs,
                        nonVegCookingInSharedUtensilsOk:
                          localPrefs.nonVegCookingInSharedUtensilsOk === false ? null : false,
                      });
                      haptic('light');
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                      localPrefs.nonVegCookingInSharedUtensilsOk === false
                        ? 'border-rose-500 bg-rose-500/20 text-rose-300'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    Strict No
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLocalPrefs({
                        ...localPrefs,
                        nonVegCookingInSharedUtensilsOk:
                          localPrefs.nonVegCookingInSharedUtensilsOk === true ? null : true,
                      });
                      haptic('light');
                    }}
                    className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition ${
                      localPrefs.nonVegCookingInSharedUtensilsOk === true
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    Allowed
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Move-in Date Proximity Matching Filter */}
          <div className="p-3.5 bg-slate-800/40 rounded-2xl border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <label className="text-xs font-bold text-white">Move-in Date Proximity</label>
              </div>
              <span className="text-[10px] text-emerald-300 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
                {localPrefs.moveInProximityDays && localPrefs.moveInProximityDays <= 7
                  ? '±7 Days'
                  : localPrefs.moveInProximityDays && localPrefs.moveInProximityDays <= 14
                  ? '±14 Days'
                  : 'Any Date'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Only discover roommates who plan to move into the flat within the same timeframe as you.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-1">
              {[
                { days: 7, label: '±7 Days' },
                { days: 14, label: '±14 Days' },
                { days: 30, label: 'Anytime' },
              ].map((item) => (
                <button
                  key={item.days}
                  type="button"
                  onClick={() => {
                    setLocalPrefs({ ...localPrefs, moveInProximityDays: item.days });
                    haptic('light');
                  }}
                  className={`py-1.5 rounded-xl text-xs font-semibold border transition ${
                    (localPrefs.moveInProximityDays || 30) === item.days
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Gender Preference */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Flatmate Gender Preference
              </label>
              {localPrefs.genderPreference === 'others' && (
                <span className="text-[10px] font-bold text-amber-400 px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30">
                  {localPrefs.othersSubtypePreference && localPrefs.othersSubtypePreference !== 'all'
                    ? localPrefs.othersSubtypePreference.toUpperCase()
                    : 'ALL OTHERS'}
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'all', label: 'All' },
                { id: 'male', label: 'Male' },
                { id: 'female', label: 'Female' },
                { id: 'others', label: 'Others' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setLocalPrefs({
                      ...localPrefs,
                      genderPreference: item.id as any,
                      othersSubtypePreference: item.id === 'others' ? (localPrefs.othersSubtypePreference || 'all') : undefined,
                    });
                    haptic('light');
                  }}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition ${
                    localPrefs.genderPreference === item.id
                      ? 'border-rose-500 bg-rose-500/15 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Dropdown menu when "Others" is selected */}
            {localPrefs.genderPreference === 'others' && (
              <div className="mt-3 p-3 bg-slate-800/50 rounded-2xl border border-slate-700/70 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <label htmlFor="others-subtype-select" className="text-xs font-medium text-slate-300">
                    Specify Category:
                  </label>
                  <span className="text-[10px] text-slate-400">Select identity</span>
                </div>
                
                <div className="relative">
                  <select
                    id="others-subtype-select"
                    value={localPrefs.othersSubtypePreference || 'all'}
                    onChange={(e) => {
                      setLocalPrefs({
                        ...localPrefs,
                        othersSubtypePreference: e.target.value as any,
                      });
                      haptic('light');
                    }}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none focus:outline-none focus:border-rose-500 font-medium cursor-pointer"
                  >
                    <option value="all">All Others (Gay, Lesbian, Trans, Queer)</option>
                    <option value="gay">Gay</option>
                    <option value="lesbian">Lesbian</option>
                    <option value="trans">Trans</option>
                    <option value="queer">Queer</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                    </svg>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'gay', label: 'Gay' },
                    { id: 'lesbian', label: 'Lesbian' },
                    { id: 'trans', label: 'Trans' },
                    { id: 'queer', label: 'Queer' },
                  ].map((chip) => (
                    <button
                      key={chip.id}
                      type="button"
                      onClick={() => {
                        setLocalPrefs({
                          ...localPrefs,
                          othersSubtypePreference: chip.id as any,
                        });
                        haptic('light');
                      }}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition ${
                        (localPrefs.othersSubtypePreference || 'all') === chip.id
                          ? 'bg-rose-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Budget Range */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Monthly Rent Contribution
              </label>
              <span className="text-xs font-bold text-rose-400">
                ₹{localPrefs.budgetMin.toLocaleString()} - ₹{localPrefs.budgetMax.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="50000"
              step="1000"
              value={localPrefs.budgetMax}
              onChange={(e) =>
                setLocalPrefs({ ...localPrefs, budgetMax: Number(e.target.value) })
              }
              className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* Sleep Schedule */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 block">
              Sleep Schedule
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'any', label: 'Any' },
                { id: 'early_bird', label: 'Early Bird' },
                { id: 'night_owl', label: 'Night Owl' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setLocalPrefs({ ...localPrefs, sleepPreference: item.id as any });
                    haptic('light');
                  }}
                  className={`py-2 px-2 text-xs font-semibold rounded-xl border text-center transition ${
                    localPrefs.sleepPreference === item.id
                      ? 'border-rose-500 bg-rose-500/15 text-white'
                      : 'border-slate-800 bg-slate-800/40 text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Habits: Smoking & Drinking */}
          <div className="space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Habits & Lifestyle
            </label>
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-xs text-slate-200">Non-Smoker Preferred</span>
              <button
                onClick={() =>
                  setLocalPrefs({
                    ...localPrefs,
                    smokerOk: localPrefs.smokerOk === false ? null : false,
                  })
                }
                className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
                  localPrefs.smokerOk === false ? 'bg-rose-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow" />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-xs text-slate-200">Non-Drinker Preferred</span>
              <button
                onClick={() =>
                  setLocalPrefs({
                    ...localPrefs,
                    drinkerOk: localPrefs.drinkerOk === false ? null : false,
                  })
                }
                className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
                  localPrefs.drinkerOk === false ? 'bg-rose-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow" />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-xs text-slate-200">Health Conscious (Gym / Yoga)</span>
              <button
                onClick={() =>
                  setLocalPrefs({
                    ...localPrefs,
                    healthConsciousOnly: !localPrefs.healthConsciousOnly,
                  })
                }
                className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
                  localPrefs.healthConsciousOnly ? 'bg-rose-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow" />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
              <span className="text-xs text-slate-200">Maid Share Required</span>
              <button
                onClick={() =>
                  setLocalPrefs({
                    ...localPrefs,
                    maidShareOk: !localPrefs.maidShareOk,
                  })
                }
                className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
                  localPrefs.maidShareOk ? 'bg-rose-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow" />
              </button>
            </div>
          </div>

          {/* Premium Filters Section */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 to-rose-500/10 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-amber-400 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Premium Filters
              </div>
              {!isPremiumUnlocked && (
                <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded-full uppercase">
                  Plus / Pro Only
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-200">New Here (Joined &lt; 7 days)</span>
              <button
                onClick={() => {
                  if (!isPremiumUnlocked) {
                    setSubscriptionModalOpen(true);
                    return;
                  }
                  setLocalPrefs({ ...localPrefs, onlyNewHere: !localPrefs.onlyNewHere });
                }}
                className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
                  localPrefs.onlyNewHere ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow" />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-200">Recently Active (Within 30 mins)</span>
              <button
                onClick={() => {
                  if (!isPremiumUnlocked) {
                    setSubscriptionModalOpen(true);
                    return;
                  }
                  setLocalPrefs({ ...localPrefs, onlyRecentlyActive: !localPrefs.onlyRecentlyActive });
                }}
                className={`w-11 h-6 rounded-full transition p-1 flex items-center ${
                  localPrefs.onlyRecentlyActive ? 'bg-amber-500 justify-end' : 'bg-slate-700 justify-start'
                }`}
              >
                <div className="w-4 h-4 bg-white rounded-full shadow" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Apply */}
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleApply}
            className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 font-bold rounded-2xl text-white shadow-lg shadow-rose-500/25 transition active:scale-[0.98]"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
