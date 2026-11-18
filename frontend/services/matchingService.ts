import { UserProfile, UserPreferences, CompatibilityBreakdown } from './types';

/**
 * Calculates compatibility score (0 to 100%) between current user and target profile with full factor breakdown.
 * Weights:
 * - Sleep habit match: 15 pts
 * - Smoker alignment: 15 pts
 * - Drinker alignment: 10 pts
 * - Fitness & wellness: 10 pts
 * - Cleaning & maid expectation: 15 pts
 * - Food & kitchen cookware habits: 20 pts (Vegetarian/Eggetarian/Non-veg/Jain + shared utensils rules)
 * - Budget/Rent compatibility: 10 pts
 * - Move-in Timeline proximity (±7 days alignment): 5 pts
 */
export function getDetailedCompatibility(
  user: UserProfile,
  candidate: UserProfile
): CompatibilityBreakdown {
  let sleepScore = 0;
  let smokerScore = 0;
  let drinkerScore = 0;
  let fitnessScore = 0;
  let cleanScore = 0;
  let foodScore = 0;
  let budgetScore = 0;
  let moveInAlignmentScore = 0;

  // 1. Sleep Habit (15 pts)
  if (user.sleepHabit === candidate.sleepHabit) {
    sleepScore = 15;
  } else if (user.sleepHabit === 'flexible' || candidate.sleepHabit === 'flexible') {
    sleepScore = 10;
  } else {
    sleepScore = 4;
  }

  // 2. Smoker alignment (15 pts)
  if (user.smoker === candidate.smoker) {
    smokerScore = 15;
  } else {
    smokerScore = user.smoker ? 6 : 2;
  }

  // 3. Drinker alignment (10 pts)
  if (user.drinker === candidate.drinker) {
    drinkerScore = 10;
  } else {
    drinkerScore = 5;
  }

  // 4. Fitness & Wellness (10 pts)
  if (user.fitnessEnthusiast === candidate.fitnessEnthusiast) {
    fitnessScore = 10;
  } else {
    fitnessScore = 5;
  }

  // 5. Cleaning Frequency & Maid Share (15 pts)
  const cleaningDiff = Math.abs(user.cleaningFrequencyPerWeek - candidate.cleaningFrequencyPerWeek);
  let cPts = cleaningDiff <= 1 ? 10 : cleaningDiff <= 3 ? 6 : 2;
  if (user.maidShareWilling === candidate.maidShareWilling) {
    cPts += 5;
  }
  cleanScore = cPts;

  // 6. Food & Kitchen Utensils Compatibility (20 pts)
  // Check exact diet match or compatibility
  if (user.foodPreference === candidate.foodPreference) {
    foodScore = 12;
  } else if (
    (user.foodPreference === 'veg' && candidate.foodPreference === 'jain') ||
    (user.foodPreference === 'jain' && candidate.foodPreference === 'veg') ||
    (user.foodPreference === 'eggetarian' && candidate.foodPreference === 'non_veg') ||
    (user.foodPreference === 'non_veg' && candidate.foodPreference === 'eggetarian')
  ) {
    foodScore = 9;
  } else {
    foodScore = 4;
  }

  // Shared utensils policy check:
  // If one user strictly disallows non-veg cooking in shared utensils and the other is non-veg
  if (
    (!user.nonVegCookingAllowedInSharedUtensils && candidate.foodPreference === 'non_veg') ||
    (!candidate.nonVegCookingAllowedInSharedUtensils && user.foodPreference === 'non_veg')
  ) {
    // If one disallows it, require clear separate utensils: partial penalty unless both agree
    if (user.nonVegCookingAllowedInSharedUtensils === candidate.nonVegCookingAllowedInSharedUtensils) {
      foodScore += 4;
    } else {
      foodScore += 1;
    }
  } else {
    // Both allow or both don't conflict
    foodScore += 8;
  }

  // 7. Budget compatibility (10 pts)
  const budgetRatio = Math.min(user.budget, candidate.budget) / Math.max(user.budget, candidate.budget);
  budgetScore = Math.round(budgetRatio * 10);

  // 8. Move-in date proximity (5 pts)
  if (user.moveInDateTimestamp && candidate.moveInDateTimestamp) {
    const diffDays = Math.abs(user.moveInDateTimestamp - candidate.moveInDateTimestamp) / (24 * 3600 * 1000);
    if (diffDays <= 7) {
      moveInAlignmentScore = 5;
    } else if (diffDays <= 14) {
      moveInAlignmentScore = 3;
    } else {
      moveInAlignmentScore = 1;
    }
  } else {
    moveInAlignmentScore = 3;
  }

  const total = Math.min(
    100,
    Math.max(25, sleepScore + smokerScore + drinkerScore + fitnessScore + cleanScore + foodScore + budgetScore + moveInAlignmentScore)
  );

  let summary = 'Great potential flatmate match!';
  if (total >= 90) summary = 'Exceptional alignment across diet, sleep, kitchen norms, and budget!';
  else if (total >= 75) summary = 'Strong compatibility with minor kitchen or schedule variations.';
  else if (total >= 50) summary = 'Moderate fit — discuss cookware segregation and guest policies.';
  else summary = 'Lifestyle & dietary differences present — discuss kitchen boundaries early.';

  return {
    total,
    sleepScore,
    smokerScore,
    drinkerScore,
    fitnessScore,
    cleanScore,
    foodScore,
    budgetScore,
    moveInAlignmentScore,
    summary,
  };
}

export function calculateCompatibilityScore(
  user: UserProfile,
  candidate: UserProfile
): number {
  return getDetailedCompatibility(user, candidate).total;
}

/**
 * Checks if candidate is within ±N days of user move-in date
 */
export function isMoveInClose(user: UserProfile, candidate: UserProfile, maxDays: number = 7): boolean {
  if (!user.moveInDateTimestamp || !candidate.moveInDateTimestamp) return false;
  const diffDays = Math.abs(user.moveInDateTimestamp - candidate.moveInDateTimestamp) / (24 * 3600 * 1000);
  return diffDays <= maxDays;
}

/**
 * Filters and sorts candidates according to UserPreferences and Compatibility Score
 */
export function filterAndRankProfiles(
  profiles: UserProfile[],
  currentUser: UserProfile,
  filters: UserPreferences
): { profile: UserProfile; compatibilityScore: number; isMoveInCloseMatch: boolean }[] {
  const filtered = profiles.filter((profile) => {
    // Gender Filter
    if (filters.genderPreference !== 'all') {
      if (profile.gender !== filters.genderPreference) {
        return false;
      }
      if (
        filters.genderPreference === 'others' &&
        filters.othersSubtypePreference &&
        filters.othersSubtypePreference !== 'all' &&
        profile.othersSubtype !== filters.othersSubtypePreference
      ) {
        return false;
      }
    }

    // Budget range
    if (profile.budget < filters.budgetMin || profile.budget > filters.budgetMax) {
      return false;
    }

    // Food Preference Filter
    if (filters.foodPreferenceFilter && filters.foodPreferenceFilter !== 'all') {
      if (profile.foodPreference !== filters.foodPreferenceFilter) {
        return false;
      }
    }

    // Non-veg cooking in shared utensils
    if (filters.nonVegCookingInSharedUtensilsOk !== null && filters.nonVegCookingInSharedUtensilsOk !== undefined) {
      if (profile.nonVegCookingAllowedInSharedUtensils !== filters.nonVegCookingInSharedUtensilsOk) {
        return false;
      }
    }

    // Move-in Proximity filter if selected
    if (filters.moveInProximityDays && filters.moveInProximityDays < 30) {
      const isClose = isMoveInClose(currentUser, profile, filters.moveInProximityDays);
      if (!isClose) return false;
    }

    // Smoker
    if (filters.smokerOk !== null && profile.smoker !== filters.smokerOk) {
      return false;
    }

    // Drinker
    if (filters.drinkerOk !== null && profile.drinker !== filters.drinkerOk) {
      return false;
    }

    // Health conscious
    if (filters.healthConsciousOnly && !profile.fitnessEnthusiast) {
      return false;
    }

    // Sleep Preference
    if (filters.sleepPreference !== 'any' && profile.sleepHabit !== filters.sleepPreference) {
      return false;
    }

    // Maid Share
    if (filters.maidShareOk && !profile.maidShareWilling) {
      return false;
    }

    // Cleaning frequency
    if (profile.cleaningFrequencyPerWeek < filters.minCleaningPerWeek) {
      return false;
    }

    // Premium filters
    if (filters.onlyNewHere && !profile.isNewHere) {
      return false;
    }

    if (filters.onlyRecentlyActive && profile.lastActiveMinutesAgo > 30) {
      return false;
    }

    return true;
  });

  // Calculate scores and sort descending
  const scored = filtered.map((profile) => ({
    profile,
    compatibilityScore: calculateCompatibilityScore(currentUser, profile),
    isMoveInCloseMatch: isMoveInClose(currentUser, profile, 7),
  }));

  scored.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  return scored;
}

/**
 * Anti-Leak Contact & Social Handle Detection Filter
 */
export interface SafetyCheckResult {
  isSafe: boolean;
  detectedPattern?: string;
  sanitizedMessage?: string;
}

export function detectContactLeak(text: string): SafetyCheckResult {
  const normalized = text.toLowerCase();

  // 1. Social handles & typical messaging platforms
  const socialRegex = /(?:insta|instagram|ig|telegram|snapchat|snap|wa\.me|whatsapp|fb\.com|linkedin|twitter|threads)[\s:_\-@]+([a-z0-9_.]{3,})/i;
  const directHandleRegex = /@[a-z0-9_.]{4,}/i;
  
  if (socialRegex.test(normalized)) {
    return {
      isSafe: false,
      detectedPattern: 'Social Media Handle/Account Reference',
    };
  }

  if (directHandleRegex.test(text)) {
    return {
      isSafe: false,
      detectedPattern: 'Handle reference (@handle)',
    };
  }

  // 2. Standard Phone Numbers
  const strippedDigits = text.replace(/[^0-9]/g, '');
  if (strippedDigits.length >= 10) {
    return {
      isSafe: false,
      detectedPattern: 'Phone Number (10+ digits)',
    };
  }

  // 3. Obfuscated word numbers: "nine 8 two", "seven zero one..."
  const wordMap: Record<string, string> = {
    zero: '0', oh: '0',
    one: '1', two: '2', three: '3', four: '4', five: '5',
    six: '6', seven: '7', eight: '8', nine: '9',
  };

  const tokens = normalized.split(/[\s,.\-_/]+/);
  let numericSeqCount = 0;

  for (const token of tokens) {
    if (wordMap[token] || /^[0-9]$/.test(token)) {
      numericSeqCount++;
    } else {
      if (numericSeqCount >= 5) {
        return {
          isSafe: false,
          detectedPattern: 'Obfuscated Phone Sequence (spoken numbers)',
        };
      }
      numericSeqCount = 0;
    }
  }

  if (numericSeqCount >= 5) {
    return {
      isSafe: false,
      detectedPattern: 'Obfuscated Phone Sequence (spoken numbers)',
    };
  }

  return { isSafe: true };
}

/**
 * Boost Stacking Math
 */
export function calculateBoostDurationHours(boostCount: number): number {
  if (boostCount <= 0) return 0;
  if (boostCount === 1) return 24;
  if (boostCount === 2) return 60; // 48 + 12 bonus
  return boostCount * 24 + (boostCount - 1) * 12;
}

/**
 * Weekly Quota Allocations
 */
export function getInitialQuotasForPlan(plan: 'free' | 'plus' | 'pro') {
  if (plan === 'pro') {
    return {
      likesRemaining: 9999,
      maxLikesPerWeek: 9999,
      superlikesRemaining: 10,
      superchatsRemaining: 10,
      boostsRemaining: 3,
    };
  }
  if (plan === 'plus') {
    return {
      likesRemaining: 25,
      maxLikesPerWeek: 25,
      superlikesRemaining: 5,
      superchatsRemaining: 5,
      boostsRemaining: 2,
    };
  }
  return {
    likesRemaining: 5,
    maxLikesPerWeek: 5,
    superlikesRemaining: 1,
    superchatsRemaining: 1,
    boostsRemaining: 1,
  };
}
