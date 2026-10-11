import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useProfileStore } from './profileStore';

beforeEach(() => {
  window.localStorage.clear();
  useProfileStore.getState().resetProfile();
});

describe('profile store persistence resilience', () => {
  it('reports failed profile deletion while resetting memory, then clears the warning after retry', () => {
    useProfileStore.getState().completeOnboarding({ city: 'Test city' });
    const removeSpy = vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {
      throw new Error('SecurityError');
    });

    expect(() => useProfileStore.getState().resetProfile()).not.toThrow();
    expect(useProfileStore.getState().profile.onboardingComplete).toBe(false);
    expect(useProfileStore.getState().profile.city).toBe('');
    expect(window.localStorage.getItem('solarium.profile.v1')).not.toBeNull();
    expect(useProfileStore.getState().profileDeletionWarning).toBe(true);

    removeSpy.mockRestore();
    useProfileStore.getState().resetProfile();
    expect(window.localStorage.getItem('solarium.profile.v1')).toBeNull();
    expect(useProfileStore.getState().profileDeletionWarning).toBe(false);
  });

  it('keeps the in-memory profile and flags a warning when localStorage writes fail', () => {
    const writeSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

    expect(() =>
      useProfileStore
        .getState()
        .completeOnboarding({ skinType: 'fair', dailyGoalMinutes: 30, city: 'Madrid' }),
    ).not.toThrow();

    const state = useProfileStore.getState();
    expect(state.profile.onboardingComplete).toBe(true);
    expect(state.profile.skinType).toBe('fair');
    expect(state.profile.city).toBe('Madrid');
    expect(state.persistenceWarning).toBe(true);

    writeSpy.mockRestore();
  });

  it('clears an existing persistence warning after a successful save', () => {
    useProfileStore.setState({ persistenceWarning: true });
    useProfileStore.getState().saveProfile({ city: 'Sevilla' });

    const state = useProfileStore.getState();
    expect(state.persistenceWarning).toBe(false);
    expect(state.profile.city).toBe('Sevilla');
  });

  it('does not throw from saveProfile when storage rejects the write', () => {
    const writeSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

    expect(() => useProfileStore.getState().saveProfile({ city: 'Valencia' })).not.toThrow();
    expect(useProfileStore.getState().profile.city).toBe('Valencia');
    expect(useProfileStore.getState().persistenceWarning).toBe(true);

    writeSpy.mockRestore();
  });
});
