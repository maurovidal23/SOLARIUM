import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

// The app shell renders pages that read from IndexedDB; stub persistence so the
// test stays hermetic and only exercises the onboarding gate + store state.
vi.mock('./db/sessions', () => ({
  addSession: vi.fn().mockResolvedValue(1),
  getSessionsForDay: vi.fn().mockResolvedValue([]),
  getSessionsInRange: vi.fn().mockResolvedValue([]),
  getSessionsForWeek: vi.fn().mockResolvedValue([]),
  getSessionsForMonth: vi.fn().mockResolvedValue([]),
  getSessionsForYear: vi.fn().mockResolvedValue([]),
  deleteSession: vi.fn().mockResolvedValue(undefined),
  getAllSessions: vi.fn().mockResolvedValue([]),
  clearAllSessions: vi.fn().mockResolvedValue(undefined),
}));

import App from './App';
import { getSessionsForDay, getAllSessions, clearAllSessions } from './db/sessions';
import { useProfileStore } from './store/profileStore';

describe('App persistence gate', () => {
  beforeEach(() => {
    // restoreMocks resets factory defaults, so reconfigure the reads the shell needs.
    getSessionsForDay.mockResolvedValue([]);
    getAllSessions.mockResolvedValue([]);
    clearAllSessions.mockResolvedValue(undefined);

    window.localStorage.clear();
    useProfileStore.getState().resetProfile();
  });

  it('keeps the persistence warning visible after onboarding completes when storage fails', async () => {
    const writeSpy = vi
      .spyOn(Storage.prototype, 'setItem')
      .mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

    render(<App />);

    fireEvent.click(await screen.findByRole('button', { name: /empezar gratis/i }));

    // Onboarding completes in memory even though the write failed...
    expect(useProfileStore.getState().profile.onboardingComplete).toBe(true);
    // ...and the warning survives the gate unmounting.
    const warning = await screen.findByRole('status');
    expect(warning).toHaveTextContent(/no se pudo guardar el perfil/i);

    writeSpy.mockRestore();
  });
});
