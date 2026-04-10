import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getSessionsForYear } from '../../db/sessions';
import { format, startOfYear, addMonths } from 'date-fns';
import { es } from 'date-fns/locale';

export default function YearlyChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function load() {
      const now = new Date();
      const sessions = await getSessionsForYear(now);

      const months = Array.from({ length: 12 }, (_, i) => {
        const month = addMonths(startOfYear(now), i);
        const monthStr = format(month, 'yyyy-MM');
        const monthSessions = sessions.filter((s) => s.date?.startsWith(monthStr));
        const totalHours = monthSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 3600;

        return {
          name: format(month, 'MMM', { locale: es }),
          horas: Math.round(totalHours * 10) / 10,
        };
      });

      setData(months);
    }
    load();
  }, []);

  return (
    <div className="bg-slate-800/50 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-4">Este año</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis dataKey="name" stroke="#64748b" fontSize={10} />
          <YAxis stroke="#64748b" fontSize={12} unit="h" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
            labelStyle={{ color: '#f8fafc' }}
            formatter={(value) => [`${value} hrs`, 'Exposición']}
          />
          <Bar dataKey="horas" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
