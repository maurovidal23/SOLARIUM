import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

// Surface storage operations are mocked; the assertions verify that
// "Borrar todo" also resets the live in-memory stores.
vi.mock('../../db/sessions', () => ({
  clearAllSessions: vi.fn().mockResolvedValue(undefined),
  getAllSessions: vi.fn().mockResolvedValue([]),
}));

import { clearAllSessions } from '../../db/sessions';
import SettingsPage from './SettingsPage';
import { useExposureStore } from '../../store/exposureStore';
import { useProfileStore } from '../../store/profileStore';

beforeEach(() => {
  vi.clearAllMocks();
  window.localStorage.clear();
  window.confirm = vi.fn(() => true);

  useExposureStore.setState({
    isTracking: false,
    currentSession: null,
    elapsedSeconds: 0,
    intervalId: null,
    todaySessions: [],
    todayTotal: 0,
    showIntensityModal: false,
    pendingSession: null,
  });

  useProfileStore.getState().resetProfile();
});

describe('SettingsPage "Borrar todo"', () => {
  it('reports a failed deletion, preserves live data, and allows a successful retry', async () => {
    clearAllSessions.mockRejectedValueOnce(new Error('IndexedDB unavailable'));
    useExposureStore.setState({ todaySessions: [{ id: 1, duration: 60 }], todayTotal: 60 });
    useProfileStore.setState({ profile: { onboardingComplete: true, skinType: 'fair', city: 'Madrid' } });

    render(<SettingsPage />);
    fireEvent.click(screen.getByRole('button', { name: /borrar todo/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/no se pudieron borrar las sesiones/i);
    expect(useExposureStore.getState().todayTotal).toBe(60);
    expect(useProfileStore.getState().profile.onboardingComplete).toBe(true);

    fireEvent.click(screen.getByRole('button', { name: /borrar todo/i }));
    await waitFor(() => expect(useExposureStore.getState().todayTotal).toBe(0));
    expect(screen.queryByRole('alert')).toBeNull();
    expect(useProfileStore.getState().profile.onboardingComplete).toBe(false);
  });

  it('clears stored data and resets an active exposure timer', async () => {
    useExposureStore.setState({
      isTracking: true,
      currentSession: { start_time: Date.now() - 60_000, end_time: null, duration: 0 },
      elapsedSeconds: 60,
      intervalId: 12345,
      showIntensityModal: false,
      pendingSession: null,
      todaySessions: [{ id: 1, duration: 60, body_parts: ['face'] }],
      todayTotal: 60,
    });

    render(<SettingsPage />);
    fireEvent.click(screen.getByRole('button', { name: /borrar todo/i }));

    await waitFor(() => expect(clearAllSessions).toHaveBeenCalledTimes(1));

    const exposure = useExposureStore.getState();
    expect(exposure.isTracking).toBe(false);
    expect(exposure.currentSession).toBeNull();
    expect(exposure.elapsedSeconds).toBe(0);
    expect(exposure.intervalId).toBeNull();
    expect(exposure.todaySessions).toEqual([]);
    expect(exposure.todayTotal).toBe(0);
    expect(useProfileStore.getState().profile.onboardingComplete).toBe(false);
  });

  it('closes a pending intensity modal and drops the pending session', async () => {
    useExposureStore.setState({
      showIntensityModal: true,
      pendingSession: { start_time: Date.now() - 120_000, end_time: Date.now(), duration: 120 },
    });

    render(<SettingsPage />);
    fireEvent.click(screen.getByRole('button', { name: /borrar todo/i }));

    await waitFor(() => expect(clearAllSessions).toHaveBeenCalledTimes(1));

    const exposure = useExposureStore.getState();
    expect(exposure.showIntensityModal).toBe(false);
    expect(exposure.pendingSession).toBeNull();
  });

  it('does nothing when the user cancels the confirmation', async () => {
    window.confirm = vi.fn(() => false);
    useExposureStore.setState({ isTracking: true, intervalId: 999 });

    render(<SettingsPage />);
    fireEvent.click(screen.getByRole('button', { name: /borrar todo/i }));

    expect(clearAllSessions).not.toHaveBeenCalled();
    expect(useExposureStore.getState().isTracking).toBe(true);
  });
});

describe('SettingsPage profile summary', () => {
  it('shows the localized skin-type label instead of the raw stored key', () => {
    useProfileStore.setState({
      profile: { onboardingComplete: true, skinType: 'fair', dailyGoalMinutes: 25, city: 'Madrid' },
    });

    render(<SettingsPage />);

    expect(screen.getByText(/Piel: Clara/)).toBeInTheDocument();
    expect(screen.queryByText(/Piel: fair/)).toBeNull();
    expect(screen.getByText(/Ciudad: Madrid/)).toBeInTheDocument();
  });
});
