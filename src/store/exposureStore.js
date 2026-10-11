import { create } from 'zustand';
import { addSession, getSessionsForDay } from '../db/sessions';

// Reset invalidates reads that may still hold a snapshot of deleted sessions.
let exposureGeneration = 0;

export const useExposureStore = create((set, get) => ({
  isTracking: false,
  currentSession: null,
  elapsedSeconds: 0,
  intervalId: null,

  todaySessions: [],
  todayTotal: 0,

  showIntensityModal: false,
  pendingSession: null,

  startExposure: () => {
    const now = Date.now();
    const session = {
      start_time: now,
      end_time: null,
      duration: 0,
      intensity_level: 'medium',
      body_parts: [],
    };

    const intervalId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - now) / 1000);
      set({ elapsedSeconds: elapsed });
    }, 1000);

    set({
      isTracking: true,
      currentSession: session,
      elapsedSeconds: 0,
      intervalId,
    });
  },

  stopExposure: () => {
    const { currentSession, intervalId } = get();
    if (!currentSession) return;

    clearInterval(intervalId);

    const now = Date.now();
    const duration = Math.floor((now - currentSession.start_time) / 1000);

    set({
      isTracking: false,
      currentSession: null,
      elapsedSeconds: 0,
      intervalId: null,
      showIntensityModal: true,
      pendingSession: {
        ...currentSession,
        end_time: now,
        duration,
      },
    });
  },

  confirmSession: async (intensity, bodyParts) => {
    const { pendingSession } = get();
    if (!pendingSession) return;

    await addSession({
      ...pendingSession,
      intensity_level: intensity,
      body_parts: bodyParts || [],
    });

    set({ showIntensityModal: false, pendingSession: null });
    get().loadTodaySessions();
  },

  dismissIntensity: async () => {
    const { pendingSession } = get();
    if (!pendingSession) return;

    await addSession(pendingSession);
    set({ showIntensityModal: false, pendingSession: null });
    get().loadTodaySessions();
  },

  loadTodaySessions: async () => {
    const generation = exposureGeneration;
    const today = new Date().toISOString().split('T')[0];
    const sessions = await getSessionsForDay(today);
    if (generation !== exposureGeneration) return;
    const todayTotal = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    set({ todaySessions: sessions, todayTotal });
  },

  // Atomically clears every piece of live exposure state: the running timer, the
  // in-flight session, the pending intensity modal, and today's cached sessions.
  // Used by "Borrar todo" so deleted data cannot reappear or be re-saved.
  resetExposure: () => {
    exposureGeneration += 1;
    const { intervalId } = get();
    if (intervalId) clearInterval(intervalId);
    set({
      isTracking: false,
      currentSession: null,
      elapsedSeconds: 0,
      intervalId: null,
      showIntensityModal: false,
      pendingSession: null,
      todaySessions: [],
      todayTotal: 0,
    });
  },
}));
