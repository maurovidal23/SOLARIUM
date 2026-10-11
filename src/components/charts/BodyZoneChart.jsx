import { useEffect, useState } from 'react';
import { getAllSessions } from '../../db/sessions';
import BODY_ZONE_LABELS from '../body/bodyZones';
import { ZONE_COLORS } from './bodyChartConfig';
import { calculateBodyZoneMetrics } from '../../utils/bodyZoneMetrics';

export default function BodyZoneChart() {
  const [data, setData] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    async function load() {
      const sessions = await getAllSessions();
      setTotalSessions(sessions.length);

      const { zoneMinutesByKey } = calculateBodyZoneMetrics(sessions);

      setData(Object.entries(zoneMinutesByKey)
        .map(([zone, minutes]) => ({
          zone,
          label: BODY_ZONE_LABELS[zone] || zone,
          minutos: Math.round(minutes),
          color: ZONE_COLORS[zone] || '#f59e0b',
        }))
        .sort((a, b) => b.minutos - a.minutos));
    }

    load();
  }, []);

  const maxMinutes = Math.max(...data.map((item) => item.minutos), 1);
  const hasData = data.some((item) => item.minutos > 0);

  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-4 shadow-lg shadow-black/10">
      <div>
        <h3 className="text-sm font-semibold text-slate-200">Exposición por zona</h3>
        <p className="mt-0.5 text-[11px] text-slate-500">Minutos acumulados - {totalSessions} sesiones</p>
      </div>

      {!hasData ? (
        <div className="py-6 text-center text-xs text-slate-500">Aún no hay datos de zonas corporales</div>
      ) : (
        <div className="mt-4 space-y-1.5">
          {data.map((item) => (
            <div key={item.zone} className="flex items-center gap-2">
              <div className="w-24 truncate text-right text-[10px] text-slate-400">{item.label}</div>
              <div className="h-5 flex-1 overflow-hidden rounded-full bg-slate-700/40">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.max((item.minutos / maxMinutes) * 100, item.minutos > 0 ? 5 : 0)}%`,
                    backgroundColor: item.color,
                    opacity: item.minutos > 0 ? 0.85 : 0.2,
                  }}
                />
              </div>
              <div className="w-12 text-right text-[10px] text-slate-400">{item.minutos > 0 ? `${item.minutos}m` : '-'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
