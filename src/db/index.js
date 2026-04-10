import Dexie from 'dexie';

export const db = new Dexie('SolariumDB');

db.version(1).stores({
  sessions: '++id, start_time, end_time, duration, intensity_level, date',
});
