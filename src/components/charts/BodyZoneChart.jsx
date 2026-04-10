import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getAllSessions } from '../../db/sessions';
import BODY_ZONE_LABELS from '../body/bodyZones';

const ZONE_COLORS = {
  face: '#fbbf24',
  neck: '#f59e0b',
  shoulders: '#d97706',
  chest: '#f97316',
  abdomen: '#ea580c',
  arms: '#fb923c',
  forearms: '#fdba74',
  hands: '#fde68a',
  thighs: '#a16207',
  shins: '#ca8a04',
  feet: '#eab308',
  upper_back: '#b45309',
  lower_back: '#92400e',
};

export default function BodyZoneChart() {
  const [data, setData] = useState([]);
  const [totalSessions, setTotalSessions] = useState(0);

  useEffect(() => {
    async function load() {
      const sessions = await getAllSessions();
      setTotalSessions(sessions.length);

      // Count total minutes of exposure per zone
      const zoneTotals = {};
      Object.keys(BODY_ZONE_LABELS).forEach((z) => { zoneTotals[z] = 0; });

      sessions.forEach((s) => {
        const minutes = (s.duration || 0) / 60;
        if (s.body_parts && s.body_parts.length > 0) {
          s.body_parts.forEach((zone) => {
            if (zoneTotals[zone] !== undefined) {
              zoneTotals[zone] += minutes;
            }
          });
        }
      });

      const chartData = Object.entries(zoneTotals)
        .map(([zone, minutes]) => ({
          zone,
          label: BODY_ZONE_LABELS[zone] || zone,
          minutos: Math.round(minutes),
          color: ZONE_COLORS[zone] || '#f59e0b',
        }))
        .sort((a, b) => b.minutos - a.minutos);

      setData(chartData);
    }
    load();
  }, []);

  const maxMinutes = Math.max(...data.map((d) => d.minutos), 1);

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 space-y-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-300">Exposición por zona corporal</h3>
        <p className="text-[10px] text-slate-500 mt-0.5">
          Minutos totales acumulados · {totalSessions} sesiones
        </p>
      </div>

      {data.every((d) => d.minutos === 0) ? (
        <div className="text-center text-slate-500 py-6 text-xs">
          Aún no hay datos de zonas corporales
        </div>
      ) : (
        <>
          {/* Horizontal bar chart */}
          <div className="space-y-1.5">
            {data.map((d) => (
              <div key={d.zone} className="flex items-center gap-2">
                <div className="w-20 text-right text-[10px] text-slate-400 truncate">
                  {d.label}
                </div>
                <div className="flex-1 h-5 bg-slate-700/40 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.max((d.minutos / maxMinutes) * 100, d.minutos > 0 ? 4 : 0)}%`,
                      backgroundColor: d.color,
                      opacity: d.minutos > 0 ? 0.8 : 0.2,
                    }}
                  />
                </div>
                <div className="w-12 text-[10px] text-slate-400 text-right">
                  {d.minutos > 0 ? `${d.minutos}m` : '—'}
                </div>
              </div>
            ))}
          </div>

          {/* Top 3 highlight */}
          <div className="flex gap-2 justify-center">
            {data.filter((d) => d.minutos > 0).slice(0, 3).map((d, i) => (
              <div
                key={d.zone}
                className="text-center px-3 py-2 rounded-lg"
                style={{ backgroundColor: `${d.color}15`, border: `1px solid ${d.color}30` }}
              >
                <div className="text-lg font-bold" style={{ color: d.color }}>
                  {['🥇', '🥈', '🥉'][i]}
                </div>
                <div className="text-[10px] text-slate-400">{d.label}</div>
                <div className="text-xs font-semibold" style={{ color: d.color }}>
                  {d.minutos}m
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
