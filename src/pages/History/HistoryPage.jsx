import { useState, useEffect } from 'react';
import { getAllSessions } from '../../db/sessions';
import { formatDuration, formatTime, getIntensityColor, getIntensityLabel, formatBodyParts } from '../../utils/format';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function HistoryPage() {
  const [sessions, setSessions] = useState([]);
  const [grouped, setGrouped] = useState({});

  useEffect(() => {
    async function load() {
      const all = await getAllSessions();
      all.sort((a, b) => b.start_time - a.start_time);
      setSessions(all);

      const groups = {};
      all.forEach((s) => {
        const date = s.date || new Date(s.start_time).toISOString().split('T')[0];
        if (!groups[date]) groups[date] = [];
        groups[date].push(s);
      });
      setGrouped(groups);
    }
    load();
  }, []);

  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <div className="flex-1 px-4 pt-6 pb-24 max-w-lg mx-auto w-full space-y-4">
      <header>
        <h1 className="text-xl font-bold">Historial</h1>
        <p className="text-slate-500 text-xs mt-1">{sessions.length} sesiones registradas</p>
      </header>

      {sortedDates.length === 0 && (
        <div className="text-center text-slate-500 py-12">
          Aún no hay sesiones registradas
        </div>
      )}

      {sortedDates.map((date) => {
        const daySessions = grouped[date];
        const dayTotal = daySessions.reduce((sum, s) => sum + (s.duration || 0), 0);

        return (
          <div key={date} className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-300">
                {format(new Date(date + 'T12:00:00'), 'EEEE d MMMM', { locale: es })}
              </h3>
              <span className="text-xs text-amber-400">{formatDuration(dayTotal)}</span>
            </div>

            {daySessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center gap-3 bg-slate-800/50 rounded-xl p-3"
              >
                <div
                  className="w-2 h-10 rounded-full"
                  style={{ backgroundColor: getIntensityColor(session.intensity_level) }}
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {formatTime(session.start_time)} — {session.end_time ? formatTime(session.end_time) : '—'}
                  </div>
                  <div className="text-xs text-slate-400">
                    {formatDuration(session.duration)} · {getIntensityLabel(session.intensity_level)}
                  </div>
                  {session.body_parts?.length > 0 && (
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      🦴 {formatBodyParts(session.body_parts)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
