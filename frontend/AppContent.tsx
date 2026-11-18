import React, { useState } from 'react';
import { useApp } from './AppContext';
import { Compass, MessageCircle, User, Shield } from 'lucide-react';
import { ExploreView } from './ExploreView';
import { MatchesView } from './MatchesView';
import { ProfileView } from './ProfileView';
import { SafetyCenterView } from './SafetyCenterView';
import { VerificationModal } from './components/VerificationModal';
import { ChecklistModal } from './components/ChecklistModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { SafetyModals } from './components/SafetyModals';
import { OnboardingModal } from './components/OnboardingModal';

export const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, haptic, matches, t } = useApp();
  const [onboardingOpen, setOnboardingOpen] = useState(() => {
    return !localStorage.getItem('flatmate_onboarding_done');
  });

  const unreadCount = matches.filter((m) => m.unread).length;

  const handleOnboardingComplete = () => {
    localStorage.setItem('flatmate_onboarding_done', 'true');
    setOnboardingOpen(false);
  };

  return (
    <div className="flex justify-center items-center h-full w-full bg-slate-950">
      {/* Mobile Frame Container: 430px max width for authentic iOS/Android viewport */}
      <div className="relative w-full h-full max-w-md bg-slate-950 flex flex-col overflow-hidden border-x border-slate-900 shadow-2xl">
        {/* Main Active View */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'explore' && <ExploreView />}
          {activeTab === 'matches' && <MatchesView />}
          {activeTab === 'profile' && <ProfileView />}
          {activeTab === 'safety' && <SafetyCenterView />}
        </div>

        {/* Bottom Native Tab Bar with 4 Tabs */}
        <div className="h-16 bg-slate-950/95 backdrop-blur-lg border-t border-slate-900 px-4 flex items-center justify-around z-30 select-none">
          {/* Explore Tab */}
          <button
            onClick={() => {
              haptic('light');
              setActiveTab('explore');
            }}
            className={`flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'explore' ? 'text-rose-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px] font-bold">{t('discover')}</span>
          </button>

          {/* Matches Tab */}
          <button
            onClick={() => {
              haptic('light');
              setActiveTab('matches');
            }}
            className={`flex flex-col items-center justify-center gap-1 relative transition ${
              activeTab === 'matches' ? 'text-rose-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <div className="relative">
              <MessageCircle className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold">{t('matches')}</span>
          </button>

          {/* Safety Center Tab */}
          <button
            onClick={() => {
              haptic('light');
              setActiveTab('safety');
            }}
            className={`flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'safety' ? 'text-rose-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] font-bold">Safety</span>
          </button>

          {/* Profile Tab */}
          <button
            onClick={() => {
              haptic('light');
              setActiveTab('profile');
            }}
            className={`flex flex-col items-center justify-center gap-1 transition ${
              activeTab === 'profile' ? 'text-rose-500' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] font-bold">{t('profile')}</span>
          </button>
        </div>

        {/* Global Modals */}
        <OnboardingModal isOpen={onboardingOpen} onComplete={handleOnboardingComplete} />
        <VerificationModal />
        <ChecklistModal />
        <SubscriptionModal />
        <SafetyModals />
      </div>
    </div>
  );
};
