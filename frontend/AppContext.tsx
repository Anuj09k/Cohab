import React, { createContext, useContext, useState } from 'react';
import {
  UserProfile,
  UserPreferences,
  PlanType,
  QuotaState,
  SafetyViolationRecord,
  MatchThread,
  SubscriptionConfig,
  Language,
  MeetupScheduleData,
} from './types';
import {
  INITIAL_CURRENT_USER,
  MOCK_PROFILES,
  DEFAULT_PREFERENCES,
  REMOTE_SUBSCRIPTION_CONFIG,
} from './constants';
import { TRANSLATIONS } from './translations';
import {
  getInitialQuotasForPlan,
  calculateBoostDurationHours,
  detectContactLeak,
} from './services/matchingService';

interface AppContextType {
  currentUser: UserProfile;
  updateCurrentUser: (updates: Partial<UserProfile>) => void;
  profiles: UserProfile[];
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  plan: PlanType;
  quotas: QuotaState;
  changePlan: (newPlan: PlanType) => void;
  useLike: () => boolean;
  usePass: () => boolean;
  useSuperlike: (targetProfile: UserProfile, note?: string) => { success: boolean; error?: string };
  triggerBoost: () => void;
  matches: MatchThread[];
  addMatch: (profile: UserProfile, note?: string) => void;
  sendChatMessage: (threadId: string, text: string) => { success: boolean; error?: string };
  scheduleMeetupInThread: (threadId: string, meetup: MeetupScheduleData) => void;
  checkInMeetupSafely: (threadId: string, meetupId: string) => void;
  violations: SafetyViolationRecord;
  clearWarning: () => void;
  verificationModalOpen: boolean;
  setVerificationModalOpen: (open: boolean) => void;
  checklistModalOpen: boolean;
  setChecklistModalOpen: (open: boolean) => void;
  subscriptionModalOpen: boolean;
  setSubscriptionModalOpen: (open: boolean) => void;
  safetyModalData: { open: boolean; title: string; message: string; pattern?: string };
  setSafetyModalData: (data: { open: boolean; title: string; message: string; pattern?: string }) => void;
  reportedProfileModalOpen: boolean;
  setReportedProfileModalOpen: (open: boolean) => void;
  reportProfile: (profileId: string, reason: string) => void;
  haptic: (type?: 'light' | 'medium' | 'heavy' | 'success' | 'error') => void;
  activeTab: 'explore' | 'matches' | 'profile' | 'safety';
  setActiveTab: (tab: 'explore' | 'matches' | 'profile' | 'safety') => void;
  remoteConfig: SubscriptionConfig;
  passedProfileIds: Set<string>;
  likedProfileIds: Set<string>;
  transferProMembership: (targetEmail: string) => { success: boolean; message: string };
  proTransferCount: number;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, interpolations?: Record<string, string | number>) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('cohab_user');
    return saved ? JSON.parse(saved) : INITIAL_CURRENT_USER;
  });

  const [profiles, setProfiles] = useState<UserProfile[]>(() => {
    return MOCK_PROFILES;
  });

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = localStorage.getItem('cohab_prefs');
    return saved ? JSON.parse(saved) : DEFAULT_PREFERENCES;
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('cohab_lang') as Language;
    return saved === 'hi' ? 'hi' : 'en';
  });

  const [plan, setPlan] = useState<PlanType>(currentUser.membershipPlan);
  const [quotas, setQuotas] = useState<QuotaState>(() => {
    const base = getInitialQuotasForPlan(currentUser.membershipPlan);
    return {
      ...base,
      activeBoostUntil: null,
      boostStackCount: 0,
    };
  });

  const [matches, setMatches] = useState<MatchThread[]>([
    {
      id: 'match_103',
      user: MOCK_PROFILES[2], // Rhea Sengupta
      compatibilityScore: 94,
      matchedAt: 'Yesterday',
      lastMessage: 'Hey Arjun! Really liked your note about early mornings.',
      unread: true,
      messages: [
        {
          id: 'm1',
          senderId: 'p_103',
          text: 'Hey Arjun! Really liked your note about early mornings and keeping kitchen spaces spotless. Are you planning to visit Koramangala this weekend?',
          timestamp: Date.now() - 3600000 * 20,
          type: 'regular',
        },
      ],
    },
  ]);

  const [passedProfileIds, setPassedProfileIds] = useState<Set<string>>(new Set());
  const [likedProfileIds, setLikedProfileIds] = useState<Set<string>>(new Set(['p_103']));
  const [proTransferCount, setProTransferCount] = useState<number>(0);

  const [violations, setViolations] = useState<SafetyViolationRecord>({
    warningCount: 0,
    suspendedUntil: null,
    history: [],
  });

  const [activeTab, setActiveTab] = useState<'explore' | 'matches' | 'profile' | 'safety'>('explore');

  // Modals
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [checklistModalOpen, setChecklistModalOpen] = useState(false);
  const [subscriptionModalOpen, setSubscriptionModalOpen] = useState(false);
  const [reportedProfileModalOpen, setReportedProfileModalOpen] = useState(false);
  const [safetyModalData, setSafetyModalData] = useState<{
    open: boolean;
    title: string;
    message: string;
    pattern?: string;
  }>({
    open: false,
    title: '',
    message: '',
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('cohab_lang', lang);
  };

  const t = (key: string, interpolations?: Record<string, string | number>): string => {
    const dict = TRANSLATIONS[language] || TRANSLATIONS.en;
    let text = dict[key] || TRANSLATIONS.en[key] || key;
    if (interpolations) {
      Object.keys(interpolations).forEach((k) => {
        text = text.replace(`{${k}}`, String(interpolations[k]));
      });
    }
    return text;
  };

  const haptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' = 'light') => {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        if (type === 'light') navigator.vibrate(12);
        else if (type === 'medium') navigator.vibrate(25);
        else if (type === 'heavy') navigator.vibrate([40, 20, 40]);
        else if (type === 'success') navigator.vibrate([20, 30, 60]);
        else if (type === 'error') navigator.vibrate([50, 40, 50, 40, 50]);
      } catch {
        // Ignored
      }
    }
  };

  const updateCurrentUser = (updates: Partial<UserProfile>) => {
    setCurrentUser((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('cohab_user', JSON.stringify(updated));
      return updated;
    });
  };

  const updatePreferences = (updates: Partial<UserPreferences>) => {
    setPreferences((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('cohab_prefs', JSON.stringify(updated));
      return updated;
    });
  };

  const changePlan = (newPlan: PlanType) => {
    setPlan(newPlan);
    const newQuotas = getInitialQuotasForPlan(newPlan);
    setQuotas((prev) => ({
      ...prev,
      ...newQuotas,
    }));
    updateCurrentUser({
      membershipPlan: newPlan,
      verification: {
        ...currentUser.verification,
        badgeLevel: newPlan === 'free' ? 'white' : 'gold',
      },
    });
    haptic('success');
  };

  const useLike = (): boolean => {
    if (plan === 'free' && quotas.likesRemaining <= 0) {
      haptic('error');
      setSubscriptionModalOpen(true);
      return false;
    }

    if (plan !== 'pro') {
      setQuotas((prev) => ({
        ...prev,
        likesRemaining: Math.max(0, prev.likesRemaining - 1),
      }));
    }
    haptic('medium');
    return true;
  };

  const usePass = (): boolean => {
    if (plan === 'free' && quotas.likesRemaining <= 0) {
      haptic('error');
      setSubscriptionModalOpen(true);
      return false;
    }
    haptic('light');
    return true;
  };

  const recordViolation = (text: string, pattern: string) => {
    setViolations((prev) => {
      const newCount = prev.warningCount + 1;
      let suspendedUntil = prev.suspendedUntil;
      if (newCount > 3) {
        suspendedUntil = Date.now() + 3 * 24 * 3600 * 1000;
      }
      return {
        warningCount: newCount,
        suspendedUntil,
        history: [
          ...prev.history,
          {
            timestamp: Date.now(),
            detectedPattern: pattern,
            offenseText: text,
          },
        ],
      };
    });
  };

  const useSuperlike = (
    targetProfile: UserProfile,
    note?: string
  ): { success: boolean; error?: string } => {
    if (quotas.superlikesRemaining <= 0) {
      setSubscriptionModalOpen(true);
      return { success: false, error: 'Out of superlikes for this week' };
    }

    if (note && note.trim().length > 0) {
      const check = detectContactLeak(note);
      if (!check.isSafe) {
        recordViolation(note, check.detectedPattern || 'Contact Info Detected');
        haptic('error');
        setSafetyModalData({
          open: true,
          title: 'Direct Contact Info Blocked',
          message:
            'To protect privacy and prevent spam, sharing personal contact numbers or social media handles in match notes is strictly restricted. Please keep conversations inside Cohab until mutual trust is verified.',
          pattern: check.detectedPattern,
        });
        return { success: false, error: check.detectedPattern };
      }
    }

    setQuotas((prev) => ({
      ...prev,
      superlikesRemaining: Math.max(0, prev.superlikesRemaining - 1),
    }));

    addMatch(targetProfile, note);
    haptic('success');
    return { success: true };
  };

  const triggerBoost = () => {
    if (quotas.boostsRemaining <= 0) {
      setSubscriptionModalOpen(true);
      return;
    }

    const currentBoostStack = quotas.boostStackCount + 1;
    const durationHours = calculateBoostDurationHours(currentBoostStack);
    const activeBoostUntil = Date.now() + durationHours * 3600 * 1000;

    setQuotas((prev) => ({
      ...prev,
      boostsRemaining: Math.max(0, prev.boostsRemaining - 1),
      boostStackCount: currentBoostStack,
      activeBoostUntil,
    }));

    haptic('heavy');
  };

  const addMatch = (profile: UserProfile, note?: string) => {
    setLikedProfileIds((prev) => new Set([...prev, profile.id]));

    const exists = matches.some((m) => m.user.id === profile.id);
    if (!exists) {
      const initialMessages: any[] = [];
      if (note) {
        initialMessages.push({
          id: `note_${Date.now()}`,
          senderId: currentUser.id,
          text: note,
          timestamp: Date.now(),
          type: 'superchat',
        });
      }
      const newMatch: MatchThread = {
        id: `match_${profile.id}`,
        user: profile,
        compatibilityScore: 89,
        matchedAt: 'Just now',
        lastMessage: note || 'Matched with compatibility score!',
        unread: false,
        messages: initialMessages,
      };
      setMatches((prev) => [newMatch, ...prev]);
    }
  };

  const sendChatMessage = (
    threadId: string,
    text: string
  ): { success: boolean; error?: string } => {
    if (violations.suspendedUntil && violations.suspendedUntil > Date.now()) {
      return {
        success: false,
        error: `Your account is temporarily suspended for repeated contact leaks until ${new Date(
          violations.suspendedUntil
        ).toLocaleDateString()}.`,
      };
    }

    const check = detectContactLeak(text);
    if (!check.isSafe) {
      recordViolation(text, check.detectedPattern || 'Contact Info Detected');
      haptic('error');
      setSafetyModalData({
        open: true,
        title: 'Safety Shield Triggered',
        message:
          'Your message contained suspected phone numbers or social media references. Cohab secures your identity until both verified flatmates have reviewed the safety checklist.',
        pattern: check.detectedPattern,
      });
      return { success: false, error: check.detectedPattern };
    }

    setMatches((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            lastMessage: text,
            messages: [
              ...thread.messages,
              {
                id: `msg_${Date.now()}`,
                senderId: currentUser.id,
                text,
                timestamp: Date.now(),
                type: 'regular',
              },
            ],
          };
        }
        return thread;
      })
    );

    haptic('light');
    return { success: true };
  };

  const scheduleMeetupInThread = (threadId: string, meetup: MeetupScheduleData) => {
    setMatches((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            lastMessage: `📍 Scheduled Meetup: ${meetup.venueName} (${new Date(meetup.dateTime).toLocaleDateString()})`,
            messages: [
              ...thread.messages,
              {
                id: `meetup_${Date.now()}`,
                senderId: currentUser.id,
                text: `Scheduled a safe meetup at ${meetup.venueName}`,
                timestamp: Date.now(),
                type: 'meetup_card',
                meetupData: meetup,
              },
            ],
          };
        }
        return thread;
      })
    );
    haptic('success');
  };

  const checkInMeetupSafely = (threadId: string, meetupId: string) => {
    setMatches((prev) =>
      prev.map((thread) => {
        if (thread.id === threadId) {
          return {
            ...thread,
            messages: thread.messages.map((m) => {
              if (m.meetupData && m.meetupData.id === meetupId) {
                return {
                  ...m,
                  meetupData: {
                    ...m.meetupData,
                    status: 'checked_in_safely',
                    lastCheckedInAt: Date.now(),
                  },
                };
              }
              return m;
            }),
          };
        }
        return thread;
      })
    );
    haptic('success');
  };

  const reportProfile = (profileId: string, reason: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== profileId));
    setMatches((prev) => prev.filter((m) => m.user.id !== profileId));
    setReportedProfileModalOpen(false);
    haptic('medium');
  };

  const transferProMembership = (targetEmail: string) => {
    if (plan !== 'pro') {
      return { success: false, message: 'Only Pro memberships can be transferred.' };
    }
    if (proTransferCount >= 1) {
      return { success: false, message: 'Pro membership can only be transferred once as per policy.' };
    }
    setProTransferCount((prev) => prev + 1);
    return {
      success: true,
      message: `Pro membership successfully transferred to ${targetEmail}. Your account will revert to Free.`,
    };
  };

  const clearWarning = () => {
    setSafetyModalData({ open: false, title: '', message: '' });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        updateCurrentUser,
        profiles,
        preferences,
        updatePreferences,
        plan,
        quotas,
        changePlan,
        useLike,
        usePass,
        useSuperlike,
        triggerBoost,
        matches,
        addMatch,
        sendChatMessage,
        scheduleMeetupInThread,
        checkInMeetupSafely,
        violations,
        clearWarning,
        verificationModalOpen,
        setVerificationModalOpen,
        checklistModalOpen,
        setChecklistModalOpen,
        subscriptionModalOpen,
        setSubscriptionModalOpen,
        safetyModalData,
        setSafetyModalData,
        reportedProfileModalOpen,
        setReportedProfileModalOpen,
        reportProfile,
        haptic,
        activeTab,
        setActiveTab,
        remoteConfig: REMOTE_SUBSCRIPTION_CONFIG,
        passedProfileIds,
        likedProfileIds,
        transferProMembership,
        proTransferCount,
        language,
        setLanguage,
        t,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
