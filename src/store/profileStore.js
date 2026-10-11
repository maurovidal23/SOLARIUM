import { create } from 'zustand';

const STORAGE_KEY = 'solarium.profile.v1';

const defaultProfile = {
  onboardingComplete: false,
  skinType: 'medium',
  dailyGoalMinutes: 20,
  city: '',
};

function readProfile() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? { ...defaultProfile, ...JSON.parse(raw) } : defaultProfile;
  } catch {
    return defaultProfile;
  }
}

// Returns whether the write reached localStorage. A failed write (quota,
// private mode, disabled storage) must never break the in-memory flow.
function persistProfile(profile) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return true;
  } catch {
    return false;
  }
}

export const useProfileStore = create((set, get) => ({
  profile: defaultProfile,
  loaded: false,
  persistenceWarning: false,
  profileDeletionWarning: false,

  loadProfile: () => {
    set({ profile: readProfile(), loaded: true });
  },

  saveProfile: (updates) => {
    const nextProfile = { ...get().profile, ...updates };
    const persisted = persistProfile(nextProfile);
    set({ profile: nextProfile, loaded: true, persistenceWarning: !persisted });
  },

  completeOnboarding: (updates) => {
    const nextProfile = { ...get().profile, ...updates, onboardingComplete: true };
    const persisted = persistProfile(nextProfile);
    set({ profile: nextProfile, loaded: true, persistenceWarning: !persisted });
  },

  resetProfile: () => {
    let profileDeletionWarning = false;
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Reset memory, but do not imply that the stored personal data was removed.
      profileDeletionWarning = true;
    }
    set({ profile: defaultProfile, loaded: true, persistenceWarning: false, profileDeletionWarning });
  },
}));

export function getStoredProfile() {
  return readProfile();
}
