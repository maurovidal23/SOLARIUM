import { useState, useEffect } from 'react';
import { getSessionsForMonth } from '../../db/sessions';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay } from 'date-fns';
import { es } from 'date-fns/locale';

export default function MonthlyHeatmap() {
  const [data, setData] = useState([]);
  const [month] = useState(new Date());

  useEffect(() => {
    async function load() {
      const sessions = await getSessionsForMonth(month);
      const start = startOfMonth(month);
      const end = endOfMonth(month);
      const days = eachDayOfInterval({ start, end });

      const dayData = days.map((day) => {
        const dayStr = day.toISOString().split('T')[0];
        const daySessions = sessions.filter((session) => session.date === dayStr);
        const totalMinutes = daySessions.reduce((sum, session) => sum + (session.duration || 0), 0) / 60;

        let level = 'none';
        if (totalMinutes > 60) level = 'high';
        else if (totalMinutes > 20) level = 'medium';
        else if (totalMinutes > 0) level = 'low';

        return { day: day.getDate(), dayOfWeek: getDay(day), totalMinutes, level, date: dayStr };
      });

      setData(dayData);
    }

    load();
  }, [month]);

  const levelColors = {
    none: '#1e293b',
    low: '#22c55e40',
    medium: '#f59e0b60',
    high: '#ef444480',
  };

  const firstDayOffset = data.length > 0 ? (data[0].dayOfWeek + 6) % 7 : 0;

  return (
    <div className="rounded-xl bg-slate-800/50 p-4">
      <h3 className="mb-4 text-sm font-semibold text-slate-300">{format(month, 'MMMM yyyy', { locale: es })}</h3>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => (
          <div key={day} className="pb-1 text-[10px] text-slate-500">{day}</div>
        ))}

        {Array.from({ length: firstDayOffset }).map((_, index) => (
          <div key={`empty-${index}`} />
        ))}

        {data.map((day) => (
          <div
            key={day.date}
            className="flex aspect-square items-center justify-center rounded-sm text-[10px] text-slate-400"
            style={{ backgroundColor: levelColors[day.level] }}
            title={`${day.date}: ${Math.round(day.totalMinutes)}m`}
          >
            {day.day}
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-center gap-2 text-[10px] text-slate-500">
        <span>Menos</span>
        {Object.entries(levelColors).map(([level, color]) => (
          <div key={level} className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
        ))}
        <span>Más</span>
      </div>
    </div>
  );
}
