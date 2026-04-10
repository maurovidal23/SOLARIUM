import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getSessionsForWeek } from '../../db/sessions';
import { format, startOfWeek, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

export default function WeeklyChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function load() {
      const now = new Date();
      const sessions = await getSessionsForWeek(now);
      const weekStart = startOfWeek(now, { weekStartsOn: 1 });

      const days = Array.from({ length: 7 }, (_, i) => {
        const day = addDays(weekStart, i);
        const dayStr = day.toISOString().split('T')[0];
        const daySessions = sessions.filter((s) => s.date === dayStr);
        const totalMinutes = daySessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60;

        return {
          name: format(day, 'EEE', { locale: es }),
          minutos: Math.round(totalMinutes * 10) / 10,
          date: dayStr,
        };
      });

      setData(days);
    }
    load();
  }, []);

  return (
    <div className="bg-slate-800/50 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Esta semana</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
          <YAxis stroke="#64748b" fontSize={12} unit="m" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            labelStyle={{ color: '#f8fafc' }}
            formatter={(value) => [`${value} min`, 'Exposición']}
          />
          <Bar dataKey="minutos" fill="#f59e0b" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
