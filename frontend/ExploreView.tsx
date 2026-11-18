import React, { useState } from 'react';
import { useApp } from './AppContext';
import { filterAndRankProfiles } from './services/matchingService';
import { SwipeCard } from './components/SwipeCard';
import { FilterDrawer } from './components/FilterDrawer';
import { RentSplitModal } from './components/RentSplitModal';
import { CommuteModal } from './components/CommuteModal';
import { HouseRuleAgreementModal } from './components/HouseRuleAgreementModal';
import { PdfSpecModal } from './components/PdfSpecModal';
import {
  SlidersHorizontal,
  Zap,
  Sparkles,
  Inbox,
  AlertCircle,
  Heart,
  Calculator,
  Languages,
  Navigation,
  FileText,
  FileDown,
} from 'lucide-react';

export const ExploreView: React.FC = () => {
  const {
    profiles,
    currentUser,
    preferences,
    useLike,
    usePass,
    useSuperlike,
    triggerBoost,
    quotas,
    plan,
    setSubscriptionModalOpen,
    setVerificationModalOpen,
    haptic,
    passedProfileIds,
    likedProfileIds,
    language,
    setLanguage,
    t,
  } = useApp();

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [rentModalOpen, setRentModalOpen] = useState(false);
  const [commuteModalOpen, setCommuteModalOpen] = useState(false);
  const [agreementModalOpen, setAgreementModalOpen] = useState(false);
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter & rank based on compatibility score
  const scoredCandidates = filterAndRankProfiles(profiles, currentUser, preferences).filter(
    (item) => !passedProfileIds.has(item.profile.id) && !likedProfileIds.has(item.profile.id)
  );

  const currentMatch = scoredCandidates[currentIndex];

  const handleLike = () => {
    if (!currentMatch) return;
    const ok = useLike();
    if (ok) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePass = () => {
    if (!currentMatch) return;
    const ok = usePass();
    if (ok) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleSuperlike = (note?: string) => {
    if (!currentMatch) return;
    const res = useSuperlike(currentMatch.profile, note);
    if (res.success) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'hi' : 'en';
    setLanguage(nextLang);
    haptic('light');
  };

  const isBoostActive = quotas.activeBoostUntil && quotas.activeBoostUntil > Date.now();
  const boostHoursRemaining = isBoostActive
    ? Math.max(1, Math.round((quotas.activeBoostUntil! - Date.now()) / (3600 * 1000)))
    : 0;

  return (
    <div className="flex flex-col h-full bg-slate-950 overflow-hidden relative">
      {/* Top Mobile Bar with Cohab Identity */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-slate-900 bg-slate-950/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center shadow-md shadow-rose-500/20">
            <span className="text-white font-black text-sm">C</span>
          </div>
          <div>
            <h1 className="text-base font-extrabold tracking-tight text-white leading-tight">{t('appName')}</h1>
            <p className="text-[10px] text-slate-400 font-medium">{t('tagline')}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Architecture & Features PDF Dossier Trigger */}
          <button
            onClick={() => {
              haptic('light');
              setPdfModalOpen(true);
            }}
            className="px-2 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:text-white flex items-center gap-1 text-xs font-bold transition active:scale-95"
            title="Export Features & Architecture PDF"
          >
            <FileDown className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">PDF</span>
          </button>

          {/* Hindi / English Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="px-2 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-bold text-rose-400 hover:text-white flex items-center gap-1"
            title="Switch Language"
          >
            <Languages className="w-3.5 h-3.5" />
            <span>{t('languageToggle')}</span>
          </button>

          {/* Quick Rent Splitter Calculator */}
          <button
            onClick={() => {
              haptic('light');
              setRentModalOpen(true);
            }}
            className="p-2 rounded-full bg-slate-900 border border-slate-800 text-amber-400 hover:text-amber-300 hover:border-amber-500/40"
            title={t('splitRent')}
          >
            <Calculator className="w-4 h-4" />
          </button>

          {/* Boost Trigger */}
          <button
            onClick={() => {
              haptic('medium');
              triggerBoost();
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition ${
              isBoostActive
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-900 border border-slate-800 text-amber-400 hover:border-amber-500/40'
            }`}
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{isBoostActive ? `${boostHoursRemaining}h ${t('boosted')}` : `${t('boost')} (${quotas.boostsRemaining})`}</span>
          </button>

          {/* Filter button */}
          <button
            onClick={() => {
              haptic('light');
              setFilterDrawerOpen(true);
            }}
            className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-white relative"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Verification Warning Notice if unverified */}
      {currentUser.verification.status !== 'verified' && (
        <div
          onClick={() => setVerificationModalOpen(true)}
          className="mx-3 mt-2 p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-200">
              {t('idVerificationBanner', { days: currentUser.verification.daysRemainingToVerify })}
            </p>
          </div>
          <span className="text-xs font-bold text-amber-400 shrink-0 underline">{t('verifyNow')}</span>
        </div>
      )}

      {/* Quotas & Likes Indicator banner for Free users */}
      {plan === 'free' && (
        <div className="px-4 py-1.5 bg-slate-900/50 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-900">
          <span className="flex items-center gap-1">
            <Heart className="w-3 h-3 text-rose-500" /> {t('freeLikesBanner')}{' '}
            <strong className="text-white">{quotas.likesRemaining} left</strong>
          </span>
          <button
            onClick={() => setSubscriptionModalOpen(true)}
            className="text-rose-400 font-semibold hover:underline"
          >
            {t('upgradeToPro')}
          </button>
        </div>
      )}

      {/* Main Swipe Surface */}
      <div className="flex-1 flex items-center justify-center p-3 relative">
        {currentMatch ? (
          <SwipeCard
            profile={currentMatch.profile}
            compatibilityScore={currentMatch.compatibilityScore}
            isMoveInCloseMatch={currentMatch.isMoveInCloseMatch}
            onLike={handleLike}
            onPass={handlePass}
            onSuperlike={handleSuperlike}
          />
        ) : (
          <div className="text-center p-6 max-w-sm mx-auto">
            <div className="w-16 h-16 mx-auto bg-slate-900 border border-slate-800 rounded-3xl flex items-center justify-center text-slate-500 mb-4">
              <Inbox className="w-8 h-8 text-rose-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">{t('allCaughtUp')}</h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-6">
              {t('allCaughtUpDesc')}
            </p>
            <button
              onClick={() => setFilterDrawerOpen(true)}
              className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-xs font-bold shadow-md transition"
            >
              {t('adjustFilters')}
            </button>
          </div>
        )}
      </div>

      {/* Slide-out Filter Drawer */}
      <FilterDrawer isOpen={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)} />

      {/* Rent Calculator Modal */}
      <RentSplitModal isOpen={rentModalOpen} onClose={() => setRentModalOpen(false)} />

      {/* Standalone Commute Modal */}
      <CommuteModal
        isOpen={commuteModalOpen}
        onClose={() => setCommuteModalOpen(false)}
        locationName={currentUser.location}
        estimates={currentUser.commuteEstimates}
      />

      {/* House Rule Agreement Modal */}
      <HouseRuleAgreementModal
        isOpen={agreementModalOpen}
        onClose={() => setAgreementModalOpen(false)}
        otherProfile={currentMatch ? currentMatch.profile : undefined}
      />

      {/* Complete Architecture & Feature Spec PDF Modal */}
      <PdfSpecModal
        isOpen={pdfModalOpen}
        onClose={() => setPdfModalOpen(false)}
      />
    </div>
  );
};
