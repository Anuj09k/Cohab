import React, { useState } from 'react';
import { UserProfile } from '../types';
import { useApp } from '../AppContext';
import { getDetailedCompatibility } from '../services/matchingService';
import { RentSplitModal } from './RentSplitModal';
import { CommuteModal } from './CommuteModal';
import { VideoTourModal } from './VideoTourModal';
import { HouseRuleAgreementModal } from './HouseRuleAgreementModal';
import {
  ShieldCheck,
  MapPin,
  Briefcase,
  Calendar,
  Home,
  Sparkles,
  Heart,
  X,
  Info,
  ChevronLeft,
  ChevronRight,
  Flag,
  Calculator,
  Play,
  Navigation,
  FileText,
  Utensils,
  Check,
  AlertCircle,
} from 'lucide-react';

interface SwipeCardProps {
  profile: UserProfile;
  compatibilityScore: number;
  isMoveInCloseMatch?: boolean;
  onLike: () => void;
  onPass: () => void;
  onSuperlike: (note?: string) => void;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  profile,
  compatibilityScore,
  isMoveInCloseMatch,
  onLike,
  onPass,
  onSuperlike,
}) => {
  const { currentUser, setChecklistModalOpen, haptic, setReportedProfileModalOpen, t } = useApp();
  const [photoIndex, setPhotoIndex] = useState(0);
  const [superchatOpen, setSuperchatOpen] = useState(false);
  const [superchatNote, setSuperchatNote] = useState('');
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [rentCalculatorOpen, setRentCalculatorOpen] = useState(false);
  const [commuteModalOpen, setCommuteModalOpen] = useState(false);
  const [videoTourOpen, setVideoTourOpen] = useState(false);
  const [agreementModalOpen, setAgreementModalOpen] = useState(false);

  // Compile photos: original avatar + flat photos if lister
  const photos = profile.role === 'lister' && profile.flatPhotos && profile.flatPhotos.length > 0
    ? [profile.avatar, ...profile.flatPhotos]
    : [profile.avatar];

  const handleNextPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic('light');
    setPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = (e: React.MouseEvent) => {
    e.stopPropagation();
    haptic('light');
    setPhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleSendSuperlike = () => {
    onSuperlike(superchatNote);
    setSuperchatOpen(false);
    setSuperchatNote('');
  };

  const detailedScore = getDetailedCompatibility(currentUser, profile);

  return (
    <div className="relative w-full h-[620px] max-w-sm sm:max-w-md mx-auto rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl flex flex-col select-none transition-all">
      {/* Top Image & Visual Gallery */}
      <div className="relative h-[360px] w-full bg-slate-950 overflow-hidden cursor-pointer">
        <img
          src={photos[photoIndex]}
          alt={profile.name}
          className="w-full h-full object-cover transition duration-300"
        />

        {/* Gradient Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-black/50 pointer-events-none" />

        {/* Story Progress Indicators for Multiple Photos */}
        {photos.length > 1 && (
          <div className="absolute top-3 inset-x-3 flex gap-1.5 z-10">
            {photos.map((_, idx) => (
              <div
                key={idx}
                className={`h-1 flex-1 rounded-full transition-all ${
                  idx === photoIndex ? 'bg-white shadow' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        )}

        {/* Left/Right Photo Tap Zones */}
        {photos.length > 1 && (
          <>
            <button
              onClick={handlePrevPhoto}
              className="absolute left-0 inset-y-0 w-1/3 z-10 flex items-center justify-start pl-2 text-white/50 hover:text-white transition"
              aria-label="Previous photo"
            >
              <span className="p-1 rounded-full bg-black/30 backdrop-blur-sm">
                <ChevronLeft className="w-5 h-5" />
              </span>
            </button>
            <button
              onClick={handleNextPhoto}
              className="absolute right-0 inset-y-0 w-1/3 z-10 flex items-center justify-end pr-2 text-white/50 hover:text-white transition"
              aria-label="Next photo"
            >
              <span className="p-1 rounded-full bg-black/30 backdrop-blur-sm">
                <ChevronRight className="w-5 h-5" />
              </span>
            </button>
          </>
        )}

        {/* Badges: Compatibility Score, Move-in proximity & Verified Badge */}
        <div className="absolute top-7 left-3 flex flex-wrap gap-1.5 z-10 max-w-[80%]">
          {/* Compatibility score ranking pill (tap to see breakdown) */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              haptic('light');
              setBreakdownOpen(true);
            }}
            className="px-2.5 py-1 rounded-full bg-rose-500/95 text-white backdrop-blur-md text-xs font-black tracking-wide flex items-center gap-1 shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{compatibilityScore}% {t('matchPercentage')}</span>
          </button>

          {/* Move-in Date Proximity Pill */}
          {isMoveInCloseMatch && (
            <div className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-slate-950 text-[11px] font-extrabold flex items-center gap-1 shadow">
              <Calendar className="w-3 h-3" />
              <span>{t('moveInProximity')}</span>
            </div>
          )}

          {/* White or Gold verified badge */}
          {profile.verification.status === 'verified' && (
            <div
              className={`px-2 py-1 rounded-full backdrop-blur-md text-[11px] font-bold flex items-center gap-1 ${
                profile.verification.badgeLevel === 'gold' && !profile.hideMembershipBadge
                  ? 'bg-amber-500 text-slate-950 font-extrabold shadow-amber-500/20'
                  : 'bg-white/90 text-slate-950'
              }`}
            >
              <ShieldCheck className="w-3 h-3" />
              <span>
                {profile.verification.badgeLevel === 'gold' && !profile.hideMembershipBadge
                  ? t('goldVerified')
                  : t('whiteVerified')}
              </span>
            </div>
          )}
        </div>

        {/* Role badge & Report trigger */}
        <div className="absolute top-7 right-3 flex items-center gap-1.5 z-10">
          <span className="px-2 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-[10px] font-semibold text-slate-300 uppercase tracking-wider">
            {profile.role === 'lister' ? t('hasFlat') : t('lookingForFlat')}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setReportedProfileModalOpen(true);
            }}
            className="p-1.5 rounded-full bg-slate-900/80 text-slate-400 hover:text-rose-400 transition"
            title="Report or Block"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 15-second Video Walkthrough Snippet Button (If available on listing) */}
        {profile.flatVideoTourUrl && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              haptic('medium');
              setVideoTourOpen(true);
            }}
            className="absolute bottom-16 right-3.5 px-3 py-1.5 rounded-full bg-rose-500 text-white backdrop-blur-md text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-rose-500/30 hover:bg-rose-600 transition z-10 animate-pulse"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{t('videoTour')}</span>
          </button>
        )}

        {/* Profile Headline in Image Bottom */}
        <div className="absolute bottom-3 inset-x-4 z-10">
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-black text-white">{profile.name}</h3>
            <span className="text-xl font-medium text-slate-300">{profile.age}</span>
          </div>
          <p className="text-xs text-slate-300 line-clamp-1 font-medium mt-0.5">{profile.headline}</p>
        </div>
      </div>

      {/* Card Body - Content & Habits */}
      <div className="flex-1 p-3.5 bg-slate-900 overflow-y-auto no-scrollbar flex flex-col justify-between">
        <div className="space-y-2.5">
          {/* Key Facts Pills */}
          <div className="flex flex-wrap gap-1.5 text-xs">
            <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 flex items-center gap-1 font-medium text-[11px]">
              {profile.gender === 'male' && '👨 Male'}
              {profile.gender === 'female' && '👩 Female'}
              {profile.gender === 'others' && (
                <span className="text-amber-300 font-semibold">
                  🌈 {profile.othersSubtype ? profile.othersSubtype.charAt(0).toUpperCase() + profile.othersSubtype.slice(1) : 'Others'}
                </span>
              )}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 flex items-center gap-1 text-[11px]">
              <MapPin className="w-3 h-3 text-rose-400" />
              {profile.location}
            </span>
            <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 flex items-center gap-1 text-[11px]">
              <Briefcase className="w-3 h-3 text-amber-400" />
              {profile.occupation}
            </span>
            <button
              onClick={() => {
                haptic('light');
                setRentCalculatorOpen(true);
              }}
              className="px-2 py-0.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 font-semibold border border-rose-500/20 flex items-center gap-1 text-[11px]"
              title="Click to calculate split with bills"
            >
              <Calculator className="w-3 h-3" />
              ₹{profile.budget.toLocaleString()} / mo
            </button>
          </div>

          {/* Food & Kitchen Utensils Habits Ribbon */}
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-lg bg-amber-500/20 text-amber-400">
                <Utensils className="w-3.5 h-3.5" />
              </span>
              <div>
                <p className="font-bold text-white text-[11px] flex items-center gap-1">
                  {profile.foodPreference === 'veg' && '🥗 Pure Vegetarian'}
                  {profile.foodPreference === 'eggetarian' && '🍳 Eggetarian'}
                  {profile.foodPreference === 'non_veg' && '🍗 Non-Vegetarian'}
                  {profile.foodPreference === 'jain' && '🌿 Jain Diet'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {profile.nonVegCookingAllowedInSharedUtensils
                    ? 'Shared Cookware: Non-veg OK'
                    : 'Requires Separate Veg Utensils'}
                </p>
              </div>
            </div>

            <span
              className={`text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                profile.nonVegCookingAllowedInSharedUtensils
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
              }`}
            >
              {profile.nonVegCookingAllowedInSharedUtensils ? 'Shared Pans' : 'Separate Pans'}
            </span>
          </div>

          {/* Feature Toolbar Buttons: Commute & House Agreement */}
          <div className="flex items-center gap-1.5 pt-0.5">
            <button
              onClick={() => {
                haptic('light');
                setCommuteModalOpen(true);
              }}
              className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700/80 rounded-xl text-[11px] font-semibold text-sky-300 flex items-center justify-center gap-1.5 border border-slate-700/60"
            >
              <Navigation className="w-3.5 h-3.5 text-sky-400" />
              <span>{t('commute')}</span>
            </button>

            <button
              onClick={() => {
                haptic('light');
                setAgreementModalOpen(true);
              }}
              className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700/80 rounded-xl text-[11px] font-semibold text-amber-300 flex items-center justify-center gap-1.5 border border-slate-700/60"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
              <span>{t('houseAgreement')}</span>
            </button>
          </div>

          {/* Lister Specific Flat Details */}
          {profile.role === 'lister' && profile.flatBHK && (
            <div className="p-2 bg-slate-800/70 rounded-xl border border-slate-700/60 text-xs flex items-center justify-between">
              <div>
                <p className="font-semibold text-white flex items-center gap-1.5 text-xs">
                  <Home className="w-3.5 h-3.5 text-rose-400" /> {profile.flatBHK}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {profile.furnishingStatus} • Deposit: ₹{(profile.deposit || 0).toLocaleString()}
                </p>
              </div>
              <button
                onClick={() => {
                  haptic('light');
                  setRentCalculatorOpen(true);
                }}
                className="px-2 py-1 bg-slate-700/70 hover:bg-slate-700 text-[10px] text-amber-300 font-bold rounded-lg"
              >
                Split
              </button>
            </div>
          )}

          {/* Lifestyle Matrix Badges */}
          <div className="grid grid-cols-3 gap-1.5 text-[11px] font-medium text-slate-300">
            <div className="p-1.5 bg-slate-800/50 rounded-lg text-center">
              <span className="text-[9px] text-slate-500 block">{t('sleep')}</span>
              {profile.sleepHabit === 'early_bird' ? '☀️ Early Bird' : profile.sleepHabit === 'night_owl' ? '🌙 Night Owl' : '⚡ Flexible'}
            </div>
            <div className="p-1.5 bg-slate-800/50 rounded-lg text-center">
              <span className="text-[9px] text-slate-500 block">{t('cleanWk')}</span>
              ✨ {profile.cleaningFrequencyPerWeek}x
            </div>
            <div className="p-1.5 bg-slate-800/50 rounded-lg text-center">
              <span className="text-[9px] text-slate-500 block">{t('fitness')}</span>
              {profile.fitnessEnthusiast ? '💪 Gym/Yoga' : '☕ Relaxed'}
            </div>
          </div>

          {/* Bio Snippet */}
          <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{profile.bio}</p>
        </div>

        {/* Action Controls Toolbar */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-3">
          {/* Pass Button */}
          <button
            onClick={() => {
              haptic('medium');
              onPass();
            }}
            className="w-13 h-13 rounded-full bg-slate-800 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 hover:text-white flex items-center justify-center transition active:scale-90 shadow-lg"
            aria-label="Pass profile"
          >
            <X className="w-6 h-6 text-rose-400" />
          </button>

          {/* Superlike / Direct Match Note */}
          <button
            onClick={() => {
              haptic('light');
              setSuperchatOpen(true);
            }}
            className="w-11 h-11 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center transition active:scale-90 shadow-lg"
            aria-label="Superlike with note"
          >
            <Sparkles className="w-5 h-5" />
          </button>

          {/* Due Diligence Checklist trigger */}
          <button
            onClick={() => {
              haptic('light');
              setChecklistModalOpen(true);
            }}
            className="w-11 h-11 rounded-full bg-slate-800 hover:bg-slate-700/80 border border-slate-700/50 text-slate-400 hover:text-white flex items-center justify-center transition active:scale-90"
            title={t('beforeYouSign')}
          >
            <Info className="w-5 h-5 text-sky-400" />
          </button>

          {/* Like Button */}
          <button
            onClick={() => {
              haptic('heavy');
              onLike();
            }}
            className="w-13 h-13 rounded-full bg-gradient-to-tr from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700 text-white flex items-center justify-center transition active:scale-90 shadow-xl shadow-rose-500/30"
            aria-label="Like profile"
          >
            <Heart className="w-6 h-6 fill-white" />
          </button>
        </div>
      </div>

      {/* Compatibility Deep Dive Modal */}
      {breakdownOpen && (
        <div className="absolute inset-0 z-40 bg-slate-950/95 backdrop-blur-md p-5 flex flex-col justify-between">
          <div className="overflow-y-auto no-scrollbar pr-1">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-rose-400" />
                <h4 className="text-sm font-bold text-white">{t('whyYouMatch')} ({compatibilityScore}%)</h4>
              </div>
              <button
                onClick={() => setBreakdownOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-rose-300 font-medium mb-4 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              {detailedScore.summary}
            </p>

            <div className="space-y-2.5 text-xs">
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Food & Shared Utensil Harmony</span>
                  <span className="font-bold text-amber-300">{detailedScore.foodScore} / 20 pts</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${(detailedScore.foodScore / 20) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Sleep & Rhythm Alignment</span>
                  <span className="font-bold text-white">{detailedScore.sleepScore} / 15 pts</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${(detailedScore.sleepScore / 15) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Smoking & Air Preference</span>
                  <span className="font-bold text-white">{detailedScore.smokerScore} / 15 pts</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(detailedScore.smokerScore / 15) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Move-in Date Alignment (±7 Days)</span>
                  <span className="font-bold text-white">{detailedScore.moveInAlignmentScore} / 5 pts</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-400 rounded-full"
                    style={{ width: `${(detailedScore.moveInAlignmentScore / 5) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Cleaning Frequency & Maid</span>
                  <span className="font-bold text-white">{detailedScore.cleanScore} / 15 pts</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${(detailedScore.cleanScore / 15) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Budget & Rent Target Compatibility</span>
                  <span className="font-bold text-white">{detailedScore.budgetScore} / 10 pts</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-400 rounded-full"
                    style={{ width: `${(detailedScore.budgetScore / 10) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => setBreakdownOpen(false)}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-2xl text-xs mt-3"
          >
            Back to Profile
          </button>
        </div>
      )}

      {/* Superchat / Superlike Prompt Modal */}
      {superchatOpen && (
        <div className="absolute inset-0 z-30 bg-slate-950/95 backdrop-blur-md p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Superlike with Note</h4>
              </div>
              <button
                onClick={() => setSuperchatOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">
              Send a direct intro message to {profile.name}.
            </p>

            <textarea
              value={superchatNote}
              onChange={(e) => setSuperchatNote(e.target.value)}
              placeholder="e.g. Loved your quiet Sunday morning routine! I work in design too and looking to move on the 1st..."
              rows={4}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />

            <div className="mt-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
              <span className="font-semibold text-rose-400">🛡️ Safety Rule: </span>
              Phone numbers, social handles (@ig, snap, wa.me), or disguised digits are strictly blocked in notes.
            </div>
          </div>

          <button
            onClick={handleSendSuperlike}
            className="w-full py-3 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold rounded-2xl text-xs shadow-lg transition active:scale-[0.98]"
          >
            {t('sendSuperlike')}
          </button>
        </div>
      )}

      {/* Modals triggered from card */}
      <RentSplitModal
        isOpen={rentCalculatorOpen}
        onClose={() => setRentCalculatorOpen(false)}
        targetRent={profile.totalRent || profile.budget * 2}
        targetDeposit={profile.deposit || profile.budget * 4}
      />

      <CommuteModal
        isOpen={commuteModalOpen}
        onClose={() => setCommuteModalOpen(false)}
        locationName={profile.location}
        estimates={profile.commuteEstimates}
      />

      <VideoTourModal
        isOpen={videoTourOpen}
        onClose={() => setVideoTourOpen(false)}
        videoUrl={profile.flatVideoTourUrl}
        flatTitle={profile.headline}
      />

      <HouseRuleAgreementModal
        isOpen={agreementModalOpen}
        onClose={() => setAgreementModalOpen(false)}
        otherProfile={profile}
      />
    </div>
  );
};
