import { useEffect, useMemo, useState } from 'react';
import { getAllSessions } from '../../db/sessions';
import BODY_ZONE_LABELS from '../body/bodyZones';
import BodyFront from '../body/BodyFront';
import BodyBack from '../body/BodyBack';
import { calculateBodyZoneMetrics } from '../../utils/bodyZoneMetrics';

export default function BodyHeatmap() {
  const [metrics, setMetrics] = useState(() => calculateBodyZoneMetrics([]));

  useEffect(() => {
    async function load() {
      const sessions = await getAllSessions();
      setMetrics(calculateBodyZoneMetrics(sessions));
    }

    load();
  }, []);

  const rankedZones = useMemo(
    () =>
      Object.entries(metrics.zoneMinutesByKey)
        .map(([zone, minutes]) => ({
          zone,
          minutes: Math.round(minutes),
          label: BODY_ZONE_LABELS[zone] || zone,
        }))
        .sort((a, b) => b.minutes - a.minutes),
    [metrics],
  );

  const activeZones = metrics.activeZones;
  const totalMinutes = Math.round(metrics.totalExposureSeconds / 60);
  const coverage = metrics.coveragePercent;

  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-4 shadow-lg shadow-black/10">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Mapa corporal</h3>
          <p className="mt-0.5 text-[11px] text-slate-500">Zonas con exposición acumulada</p>
        </div>
        <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
          {coverage}% cobertura
        </div>
      </div>

      {activeZones.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-700 p-5 text-center text-xs text-slate-500">
          Guarda una sesión con zonas corporales para ver tu mapa de exposición.
        </div>
      )}
        <div className="grid grid-cols-[minmax(130px,1fr)_132px] items-center gap-4 max-[390px]:grid-cols-1">
          <div className="grid grid-cols-2 gap-2">
            <div className="mx-auto w-full rounded-[26px] border border-slate-700/60 bg-slate-950/45 px-2 py-3">
              <BodyFront selectedZones={activeZones} interactive={false} />
            </div>
            <div className="mx-auto w-full rounded-[26px] border border-slate-700/60 bg-slate-950/45 px-2 py-3">
              <BodyBack selectedZones={activeZones} interactive={false} />
            </div>
          </div>

          <div className="space-y-2">
            <div className="rounded-xl border border-slate-700/70 bg-slate-900/55 p-3">
              <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Total</div>
              <div className="mt-1 text-2xl font-bold text-slate-100">{totalMinutes}m</div>
              <div className="mt-0.5 text-[10px] text-slate-500">Tiempo de exposición</div>
            </div>
            <div className="text-[10px] uppercase tracking-[0.16em] text-slate-500">Minutos por zona</div>
            {rankedZones.filter((item) => item.minutes > 0).slice(0, 4).map((item) => (
              <div key={item.zone} className="flex items-center justify-between gap-2 rounded-lg bg-slate-900/45 px-3 py-2">
                <span className="truncate text-[11px] text-slate-300">{item.label}</span>
                <span className="text-xs font-semibold text-amber-300">{item.minutes}m</span>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}
