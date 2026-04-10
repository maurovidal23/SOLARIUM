import { db } from './index';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

export async function addSession(session) {
  const date = new Date(session.start_time).toISOString().split('T')[0];
  return db.sessions.add({ ...session, date });
}

export async function updateSession(id, changes) {
  return db.sessions.update(id, changes);
}

export async function getSessionsForDay(date) {
  const dayStr = date instanceof Date ? date.toISOString().split('T')[0] : date;
  return db.sessions.where('date').equals(dayStr).toArray();
}

export async function getSessionsInRange(from, to) {
  return db.sessions
    .where('start_time')
    .between(from.getTime(), to.getTime(), true, true)
    .toArray();
}

export async function getSessionsForWeek(date) {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return getSessionsInRange(start, end);
}

export async function getSessionsForMonth(date) {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return getSessionsInRange(start, end);
}

export async function getSessionsForYear(date) {
  const start = startOfYear(date);
  const end = endOfYear(date);
  return getSessionsInRange(start, end);
}

export async function deleteSession(id) {
  return db.sessions.delete(id);
}

export async function getAllSessions() {
  return db.sessions.toArray();
}
