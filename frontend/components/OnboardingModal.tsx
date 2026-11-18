import React, { useState } from 'react';
import { useApp } from './AppContext';
import { FoodPreference, Gender, OthersGenderSubtype, SleepHabit } from './types';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Utensils,
  Moon,
  Sun,
  Home,
  CheckCircle2,
  MapPin,
  Clock,
  Compass,
  Heart,
} from 'lucide-react';

export const OnboardingModal: React.FC<{
  isOpen: boolean;
  onComplete: () => void;
}> = ({ isOpen, onComplete }) => {
  const { currentUser, updateCurrentUser, haptic, t } = useApp();
  const [step, setStep] = useState(1);

  // Form states
  const [role, setRole] = useState<'seeker' | 'lister'>(currentUser.role);
  const [name, setName] = useState(currentUser.name);
  const [age, setAge] = useState(currentUser.age);
  const [gender, setGender] = useState<Gender>(currentUser.gender);
  const [othersSubtype, setOthersSubtype] = useState<OthersGenderSubtype>(
    (currentUser.othersSubtype as OthersGenderSubtype) || 'queer'
  );
  const [location, setLocation] = useState(currentUser.location);
  const [budget, setBudget] = useState(currentUser.budget);
  const [sleepHabit, setSleepHabit] = useState<SleepHabit>(currentUser.sleepHabit);
  const [smoker, setSmoker] = useState(currentUser.smoker);
  const [drinker, setDrinker] = useState(currentUser.drinker);
  const [fitnessEnthusiast, setFitnessEnthusiast] = useState(currentUser.fitnessEnthusiast);
  const [cleaningFrequency, setCleaningFrequency] = useState(currentUser.cleaningFrequencyPerWeek);
  const [foodPreference, setFoodPreference] = useState<FoodPreference>(currentUser.foodPreference);
  const [nonVegCookingAllowed, setNonVegCookingAllowed] = useState(
    currentUser.nonVegCookingAllowedInSharedUtensils
  );
  const [promptResponse, setPromptResponse] = useState(
    currentUser.prompts[0]?.response || 'Wash your dishes right after eating or rinse them cleanly for the maid.'
  );

  if (!isOpen) return null;

  const handleNext = () => {
    haptic('light');
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Save all and complete onboarding
      updateCurrentUser({
        role,
        name: name.trim() || 'Cohab Resident',
        age: Number(age) || 25,
        gender,
        othersSubtype: gender === 'others' ? (othersSubtype as any) : undefined,
        location: location.trim() || 'Indiranagar, Bengaluru',
        budget: Number(budget) || 20000,
        sleepHabit,
        smoker,
        drinker,
        fitnessEnthusiast,
        cleaningFrequencyPerWeek: cleaningFrequency,
        foodPreference,
        nonVegCookingAllowedInSharedUtensils: nonVegCookingAllowed,
        prompts: [
          {
            id: 'p1',
            heading: 'My non-negotiable house rule',
            response: promptResponse,
          },
        ],
      });
      haptic('success');
      onComplete();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/90 backdrop-blur-md">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 text-slate-100 shadow-2xl relative max-h-[94vh] flex flex-col overflow-hidden">
        {/* Step Progress Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-black text-xs">
              {step}/4
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">
                {step === 1 && 'Welcome to Cohab'}
                {step === 2 && 'Living & Habit Preferences'}
                {step === 3 && 'Food & Kitchen Rules'}
                {step === 4 && 'House Norm & Budget'}
              </h3>
              <p className="text-[10px] text-slate-400">Quick 2-minute onboarding profile setup</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
            {step === 1 && 'Role & Identity'}
            {step === 2 && 'Daily Rhythm'}
            {step === 3 && 'Dietary Sync'}
            {step === 4 && 'Final Step'}
          </span>
        </div>

        {/* Step Progress Indicator Bar */}
        <div className="w-full h-1 bg-slate-800 my-3 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-300 rounded-full"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Form Body by Step */}
        <div className="flex-1 overflow-y-auto space-y-4 py-1 pr-1 no-scrollbar text-xs">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mb-2">
                  What is your primary intent?
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      setRole('seeker');
                      haptic('light');
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                      role === 'seeker'
                        ? 'border-rose-500 bg-rose-500/15 text-white'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    <Compass className="w-5 h-5 text-rose-400 mb-2" />
                    <p className="font-bold text-xs text-white">Looking for a Place</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Need a room in an existing flat</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setRole('lister');
                      haptic('light');
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition ${
                      role === 'lister'
                        ? 'border-amber-500 bg-amber-500/15 text-white'
                        : 'border-slate-800 bg-slate-800/40 text-slate-400'
                    }`}
                  >
                    <Home className="w-5 h-5 text-amber-400 mb-2" />
                    <p className="font-bold text-xs text-white">Have a Flat / Lister</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Have an apartment & need flatmates</p>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2">
                  <label className="text-slate-300 font-semibold block mb-1">Your Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Arjun Mehta"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">Age</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mb-1.5">
                  Gender Identity
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'male', label: 'Male' },
                    { id: 'female', label: 'Female' },
                    { id: 'others', label: 'Others' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setGender(g.id as any);
                        haptic('light');
                      }}
                      className={`py-2 rounded-xl text-xs font-semibold border transition ${
                        gender === g.id
                          ? 'border-rose-500 bg-rose-500/20 text-white'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      {g.label}
                    </button>
                  ))}
                </div>

                {gender === 'others' && (
                  <div className="mt-2.5 p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 flex items-center justify-between">
                    <span className="text-[11px] text-slate-300 font-medium">Specify Category:</span>
                    <select
                      value={othersSubtype}
                      onChange={(e) => setOthersSubtype(e.target.value as any)}
                      className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-amber-300 font-semibold focus:outline-none"
                    >
                      <option value="gay">Gay</option>
                      <option value="lesbian">Lesbian</option>
                      <option value="trans">Trans</option>
                      <option value="queer">Queer</option>
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">Preferred Location</label>
                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-xl px-3 py-2">
                  <MapPin className="w-4 h-4 text-rose-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Indiranagar, Bengaluru or Bandra West, Mumbai"
                    className="w-full bg-transparent focus:outline-none text-xs text-white"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mb-2">
                  Sleep Cycle & Daily Rhythm
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'early_bird', label: '☀️ Early Bird', desc: 'Up before 7 AM' },
                    { id: 'night_owl', label: '🌙 Night Owl', desc: 'Active past midnight' },
                    { id: 'flexible', label: '⚡ Flexible', desc: 'Varies with work' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        setSleepHabit(s.id as any);
                        haptic('light');
                      }}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        sleepHabit === s.id
                          ? 'border-rose-500 bg-rose-500/20 text-white'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      <p className="font-bold text-xs">{s.label}</p>
                      <p className="text-[9px] text-slate-500 mt-0.5">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div>
                    <p className="font-semibold text-white text-xs">Smoker?</p>
                    <p className="text-[10px] text-slate-400">Balcony / common area policy</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSmoker(!smoker)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      smoker ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {smoker ? 'Yes' : 'No'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div>
                    <p className="font-semibold text-white text-xs">Drinker?</p>
                    <p className="text-[10px] text-slate-400">Social drinker on weekends</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDrinker(!drinker)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      drinker ? 'bg-rose-500 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {drinker ? 'Yes' : 'No'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-800">
                  <div>
                    <p className="font-semibold text-white text-xs">Gym / Yoga Enthusiast?</p>
                    <p className="text-[10px] text-slate-400">Matches you with active flatmates</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFitnessEnthusiast(!fitnessEnthusiast)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                      fitnessEnthusiast ? 'bg-emerald-500 text-slate-950 font-black' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {fitnessEnthusiast ? 'Yes' : 'No'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-slate-400 font-semibold uppercase tracking-wider text-[10px] block mb-2">
                  My Dietary Habit
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'veg', label: '🥗 Pure Vegetarian' },
                    { id: 'eggetarian', label: '🍳 Eggetarian' },
                    { id: 'non_veg', label: '🍗 Non-Vegetarian' },
                    { id: 'jain', label: '🌿 Jain Diet' },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        setFoodPreference(d.id as any);
                        haptic('light');
                      }}
                      className={`p-2.5 rounded-xl text-xs font-semibold border text-left transition ${
                        foodPreference === d.id
                          ? 'border-amber-400 bg-amber-500/20 text-white'
                          : 'border-slate-800 bg-slate-800/40 text-slate-400'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shared Utensil Non-Veg Cooking Rule */}
              <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-amber-400" />
                    <span className="font-bold text-white text-xs">Shared Cookware Rule</span>
                  </div>
                  <span
                    className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      nonVegCookingAllowed
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {nonVegCookingAllowed ? 'Non-Veg OK' : 'Separate Pans Required'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Can non-veg dishes be cooked inside shared kitchen utensils, or are separate pans strictly required?
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setNonVegCookingAllowed(false);
                      haptic('light');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      !nonVegCookingAllowed
                        ? 'border-rose-500 bg-rose-500/20 text-rose-300'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    Separate Pans Only
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNonVegCookingAllowed(true);
                      haptic('light');
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      nonVegCookingAllowed
                        ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                        : 'border-slate-800 text-slate-400'
                    }`}
                  >
                    Shared Cooking OK
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-semibold text-xs">Monthly Rent Budget Target</label>
                  <span className="font-bold text-rose-400 text-sm">₹{budget.toLocaleString()} / mo</span>
                </div>
                <input
                  type="range"
                  min="6000"
                  max="60000"
                  step="1000"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-slate-300 font-semibold text-xs">Desired Cleaning per Week</label>
                  <span className="font-bold text-white text-xs">{cleaningFrequency} times / week</span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {[2, 4, 5, 7].map((cnt) => (
                    <button
                      key={cnt}
                      type="button"
                      onClick={() => setCleaningFrequency(cnt)}
                      className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                        cleaningFrequency === cnt
                          ? 'border-amber-400 bg-amber-500/20 text-white'
                          : 'border-slate-800 text-slate-400'
                      }`}
                    >
                      {cnt}x
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1 text-xs">
                  My Non-Negotiable House Rule
                </label>
                <textarea
                  value={promptResponse}
                  onChange={(e) => setPromptResponse(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-rose-500 placeholder-slate-500"
                  placeholder="e.g. Wash your dishes promptly or inform on WhatsApp if friends are visiting..."
                />
              </div>

              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center gap-2.5 text-emerald-300 text-[11px]">
                <ShieldCheck className="w-5 h-5 shrink-0" />
                <span>You're all set! Profiles are protected under India DPDP Act compliance.</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={handleNext}
            className="w-full py-3.5 bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 font-extrabold rounded-2xl text-white shadow-xl shadow-rose-500/25 transition active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>{step === 4 ? 'Complete & Start Swiping on Cohab' : 'Next Step'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
