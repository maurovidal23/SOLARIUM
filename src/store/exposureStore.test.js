import { describe, it, expect, beforeEach, vi } from 'vitest';

// Keep the store test hermetic: session persistence is mocked so the test
// focuses on in-memory exposure/reset behavior (no IndexedDB required).
vi.mock('../db/sessions', () => ({
  addSession: vi.fn().mockResolvedValue(1),
  getSessionsForDay: vi.fn().mockResolvedValue([]),
}));

import { addSession, getSessionsForDay } from '../db/sessions';
import { useExposureStore } from './exposureStore';

const CLEAN_STATE = {
  isTracking: false,
  currentSession: null,
  elapsedSeconds: 0,
  intervalId: null,
  todaySessions: [],
  todayTotal: 0,
  showIntensityModal: false,
  pendingSession: null,
};

beforeEach(() => {
  vi.clearAllMocks();
  useExposureStore.setState({ ...CLEAN_STATE });
});

function resetExposure() {
  const action = useExposureStore.getState().resetExposure;
  expect(action).toBeTypeOf('function');
  action();
}

describe('exposure store resetExposure', () => {
  it('ignores a pre-reset session read that completes after a fresh load', async () => {
    let resolveStaleRead;
    getSessionsForDay.mockReturnValueOnce(new Promise((resolve) => {
      resolveStaleRead = resolve;
    }));
    const staleLoad = useExposureStore.getState().loadTodaySessions();

    resetExposure();
    getSessionsForDay.mockResolvedValueOnce([]);
    await useExposureStore.getState().loadTodaySessions();
    resolveStaleRead([{ id: 1, duration: 300, body_parts: ['face'] }]);
    await staleLoad;

    expect(useExposureStore.getState().todaySessions).toEqual([]);
    expect(useExposureStore.getState().todayTotal).toBe(0);
  });

  it('stops an active timer and clears all live exposure state', () => {
    useExposureStore.getState().startExposure();

    expect(useExposureStore.getState().isTracking).toBe(true);
    expect(useExposureStore.getState().currentSession).not.toBeNull();
    expect(useExposureStore.getState().intervalId).not.toBeNull();

    resetExposure();

    const state = useExposureStore.getState();
    expect(state.isTracking).toBe(false);
    expect(state.currentSession).toBeNull();
    expect(state.elapsedSeconds).toBe(0);
    expect(state.intervalId).toBeNull();
  });

  it('clears a pending intensity session and never resurrects it via confirmSession', async () => {
    useExposureStore.getState().startExposure();
    useExposureStore.getState().stopExposure();

    expect(useExposureStore.getState().pendingSession).not.toBeNull();
    expect(useExposureStore.getState().showIntensityModal).toBe(true);

    resetExposure();

    expect(useExposureStore.getState().pendingSession).toBeNull();
    expect(useExposureStore.getState().showIntensityModal).toBe(false);

    await useExposureStore.getState().confirmSession('high', ['face']);

    expect(addSession).not.toHaveBeenCalled();
    expect(getSessionsForDay).not.toHaveBeenCalled();
  });

  it('clears a pending intensity session and never resurrects it via dismissIntensity', async () => {
    useExposureStore.getState().startExposure();
    useExposureStore.getState().stopExposure();

    resetExposure();

    await useExposureStore.getState().dismissIntensity();

    expect(addSession).not.toHaveBeenCalled();
  });

  it('persists a confirmed session with its intensity and zones, then closes the modal', async () => {
    useExposureStore.getState().startExposure();
    useExposureStore.getState().stopExposure();

    const pending = useExposureStore.getState().pendingSession;
    expect(pending).not.toBeNull();

    getSessionsForDay.mockResolvedValueOnce([]);
    await useExposureStore.getState().confirmSession('high', ['face', 'arms']);

    expect(addSession).toHaveBeenCalledTimes(1);
    expect(addSession).toHaveBeenCalledWith(
      expect.objectContaining({
        start_time: pending.start_time,
        end_time: pending.end_time,
        duration: pending.duration,
        intensity_level: 'high',
        body_parts: ['face', 'arms'],
      }),
    );
    expect(useExposureStore.getState().showIntensityModal).toBe(false);
    expect(useExposureStore.getState().pendingSession).toBeNull();
  });

  it('persists a dismissed pending session unchanged and closes the modal', async () => {
    useExposureStore.getState().startExposure();
    useExposureStore.getState().stopExposure();

    const pending = useExposureStore.getState().pendingSession;

    getSessionsForDay.mockResolvedValueOnce([]);
    await useExposureStore.getState().dismissIntensity();

    expect(addSession).toHaveBeenCalledWith(pending);
    expect(useExposureStore.getState().showIntensityModal).toBe(false);
    expect(useExposureStore.getState().pendingSession).toBeNull();
  });

  it("clears today's sessions and total so deleted data cannot reappear", () => {
    useExposureStore.setState({
      todaySessions: [{ id: 1, duration: 300, body_parts: ['face'] }],
      todayTotal: 300,
    });

    resetExposure();

    expect(useExposureStore.getState().todaySessions).toEqual([]);
    expect(useExposureStore.getState().todayTotal).toBe(0);
  });
});
