import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getSessionsForDay, getAllSessions } from '../../db/sessions';

export default function DailyComparison() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function load() {
      const today = new Date().toISOString().split('T')[0];
      const todaySessions = await getSessionsForDay(today);
      const allSessions = await getAllSessions();

      // Build hourly accumulation for today
      const hours = Array.from({ length: 24 }, (_, h) => {
        const todayAtHour = todaySessions
          .filter((s) => new Date(s.start_time).getHours() <= h)
          .reduce((sum, s) => {
            const startH = new Date(s.start_time).getHours();
            const endH = s.end_time ? new Date(s.end_time).getHours() : startH;
            if (h >= startH && h <= endH) {
              return sum + (s.duration || 0) / 60;
            }
            return sum + (s.duration || 0) / 60;
          }, 0);

        // Calculate historical average for this hour
        const dates = [...new Set(allSessions.map((s) => s.date))];
        const numDays = Math.max(dates.length, 1);
        const historicalAtHour = allSessions
          .filter((s) => new Date(s.start_time).getHours() <= h)
          .reduce((sum, s) => sum + (s.duration || 0) / 60, 0) / numDays;

        return {
          hora: `${h}:00`,
          hoy: Math.round(todayAtHour * 10) / 10,
          media: Math.round(historicalAtHour * 10) / 10,
        };
      });

      setData(hours);
    }
    load();
  }, []);

  return (
    <div className="bg-slate-800/50 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Hoy vs Media histórica</h3>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="hora" stroke="#64748b" fontSize={10} interval={5} />
          <YAxis stroke="#64748b" fontSize={12} unit="m" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            labelStyle={{ color: '#f8fafc' }}
          />
          <Area type="monotone" dataKey="media" stroke="#64748b" fill="#64748b20" name="Media" />
          <Area type="monotone" dataKey="hoy" stroke="#f59e0b" fill="#f59e0b20" name="Hoy" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
