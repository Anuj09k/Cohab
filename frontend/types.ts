export type UserRole = 'seeker' | 'lister';

export type PlanType = 'free' | 'plus' | 'pro';

export type Gender = 'male' | 'female' | 'others';

export type OthersGenderSubtype = 'all' | 'gay' | 'lesbian' | 'trans' | 'queer';

export type SleepHabit = 'early_bird' | 'night_owl' | 'flexible';

export type PetType = 'dog' | 'cat' | 'none' | 'other';

export type Language = 'en' | 'hi';

// Food and Kitchen Diet Types
export type FoodPreference = 'veg' | 'eggetarian' | 'non_veg' | 'jain';

export interface CommuteEstimate {
  destination: string; // e.g. "Manyata Tech Park", "BKC", "Cyber City", "EGL"
  minutesByMetro: number;
  minutesByCab: number;
  distanceKm: number;
}

export interface UserPreferences {
  genderPreference: 'all' | 'male' | 'female' | 'others';
  othersSubtypePreference?: OthersGenderSubtype;
  budgetMin: number;
  budgetMax: number;
  smokerOk: boolean | null; // null means don't care
  drinkerOk: boolean | null;
  healthConsciousOnly: boolean;
  sleepPreference: 'any' | SleepHabit;
  location: string;
  rentShareMax: number;
  maidShareOk: boolean;
  petsAllowed: PetType[];
  minCleaningPerWeek: number;
  
  // Dietary & Kitchen Filters
  foodPreferenceFilter?: 'all' | FoodPreference;
  nonVegCookingInSharedUtensilsOk?: boolean | null; // null means don't care, false = must NOT cook non-veg in shared utensils

  // Move-in date proximity filter (e.g. ±7 or ±14 days)
  moveInProximityDays?: number; // 7, 14, 30 or undefined (any)
  
  // Premium filters
  onlyNewHere: boolean;
  onlyRecentlyActive: boolean;
}

export interface VerificationState {
  status: 'unverified' | 'pending' | 'verified' | 'rejected' | 'locked';
  verifiedAt?: string;
  daysRemainingToVerify: number;
  rawGovDocDeleted: boolean; // DPDP Act compliance guarantee
  faceAnglesCaptured: number;
  badgeLevel: 'none' | 'white' | 'gold'; // gold if plan is plus/pro
}

export interface ProfilePrompt {
  id: string;
  heading: string;
  response: string;
}

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  role: UserRole;
  gender: Gender;
  othersSubtype?: 'gay' | 'lesbian' | 'trans' | 'queer';
  avatar: string;
  headline: string;
  bio: string;
  location: string; // e.g. "Koramangala, Bengaluru" or "Bandra West, Mumbai"
  occupation: string;
  moveInDate: string; // formatted ISO date string or descriptive e.g. "2026-12-01"
  moveInDateTimestamp?: number; // epoch ms for ±7 days calculations
  budget: number; // monthly rent contribution in INR
  
  // Flatmate Lifestyle details
  sleepHabit: SleepHabit;
  smoker: boolean;
  drinker: boolean;
  fitnessEnthusiast: boolean; // gym / yoga
  petFriendly: PetType[];
  cleaningFrequencyPerWeek: number; // e.g. 3, 5, 7
  maidShareWilling: boolean;

  // Food & Kitchen Habit Preferences
  foodPreference: FoodPreference;
  nonVegCookingAllowedInSharedUtensils: boolean;
  kitchenDietNote?: string;
  
  // Lister-only details (Seekers without flat don't have these)
  flatPhotos?: string[]; // 2 interior + 1 exterior
  flatVideoTourUrl?: string; // 15-second ambient walkthrough video snippet
  flatAddress?: string;
  flatBHK?: string;
  totalRent?: number;
  deposit?: number;
  furnishingStatus?: 'Fully Furnished' | 'Semi-Furnished' | 'Unfurnished';

  // Commute Estimates to Top Tech Hubs
  commuteEstimates?: CommuteEstimate[];

  // Verification & Badges
  verification: VerificationState;
  membershipPlan: PlanType;
  hideMembershipBadge: boolean;
  isNewHere: boolean;
  lastActiveMinutesAgo: number;
  
  // Profile Prompts
  prompts: ProfilePrompt[];
}

export interface SubscriptionConfig {
  prices: {
    weeklyPlus: number;
    firstTimeMonthlyPlus: number;
    firstTimeMonthlyPro: number;
    monthlyPlus: number;
    monthlyPro: number;
    threeMonthsPlus: number;
    threeMonthsPro: number;
    sixMonthsPlus: number;
    sixMonthsPro: number;
    yearlyPlus: number;
    yearlyPro: number;
  };
  gstRate: number;
}

export interface QuotaState {
  likesRemaining: number;
  maxLikesPerWeek: number;
  superlikesRemaining: number;
  superchatsRemaining: number;
  boostsRemaining: number;
  activeBoostUntil: number | null;
  boostStackCount: number;
}

export interface SafetyViolationRecord {
  warningCount: number;
  suspendedUntil: number | null;
  history: {
    timestamp: number;
    detectedPattern: string;
    offenseText: string;
  }[];
}

export interface MeetupScheduleData {
  id: string;
  meetupType: 'public_cafe' | 'flat_visit';
  venueName: string;
  venueAddress: string;
  dateTime: string; // ISO date/time string
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  status: 'scheduled' | 'checked_in_safely' | 'cancelled';
  checkInDueTime: string;
  notes?: string;
  lastCheckedInAt?: number;
}

export interface MatchNoteMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  type: 'superchat' | 'regular' | 'meetup_card';
  meetupData?: MeetupScheduleData;
}

export interface MatchThread {
  id: string;
  user: UserProfile;
  compatibilityScore: number;
  matchedAt: string;
  lastMessage?: string;
  messages: MatchNoteMessage[];
  unread: boolean;
}

export interface CompatibilityBreakdown {
  total: number;
  sleepScore: number;
  smokerScore: number;
  drinkerScore: number;
  fitnessScore: number;
  cleanScore: number;
  budgetScore: number;
  moveInAlignmentScore: number;
  foodScore: number;
  summary: string;
}

export interface HouseRuleAgreement {
  id: string;
  createdAt: string;
  flatmateA: string;
  flatmateB: string;
  depositRefundTerms: string;
  quietHours: string;
  guestPolicy: string;
  cleaningSchedule: string;
  kitchenRules: string;
  billPaymentDay: number; // day of month e.g. 5th
}
