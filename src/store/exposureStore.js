import { create } from 'zustand';
import { addSession, updateSession, getSessionsForDay } from '../db/sessions';

export const useExposureStore = create((set, get) => ({
  // Current session state
  isTracking: false,
  currentSession: null,
  elapsedSeconds: 0,
  intervalId: null,

  // Today's data
  todaySessions: [],
  todayTotal: 0,

  // Intensity modal
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

    const pendingSession = {
      ...currentSession,
      end_time: now,
      duration,
    };

    set({
      isTracking: false,
      currentSession: null,
      elapsedSeconds: 0,
      intervalId: null,
      showIntensityModal: true,
      pendingSession,
    });
  },

  confirmSession: async (intensity, bodyParts) => {
    const { pendingSession } = get();
    if (!pendingSession) return;

    const session = {
      ...pendingSession,
      intensity_level: intensity,
      body_parts: bodyParts || [],
    };
    await addSession(session);

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
    const today = new Date().toISOString().split('T')[0];
    const sessions = await getSessionsForDay(today);
    const todayTotal = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
    set({ todaySessions: sessions, todayTotal });
  },
}));
