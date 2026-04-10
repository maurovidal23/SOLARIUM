import { useState, useEffect } from 'react';
import { getAllSessions } from '../../db/sessions';
import BODY_ZONE_LABELS from '../body/bodyZones';

/**
 * Shows a front-view body SVG where each zone is colored
 * by its accumulated exposure (heatmap style).
 */
export default function BodyHeatmap() {
  const [zoneMinutes, setZoneMinutes] = useState({});

  useEffect(() => {
    async function load() {
      const sessions = await getAllSessions();
      const totals = {};
      Object.keys(BODY_ZONE_LABELS).forEach((z) => { totals[z] = 0; });

      sessions.forEach((s) => {
        const minutes = (s.duration || 0) / 60;
        if (s.body_parts && s.body_parts.length > 0) {
          s.body_parts.forEach((zone) => {
            if (totals[zone] !== undefined) {
              totals[zone] += minutes;
            }
          });
        }
      });
      setZoneMinutes(totals);
    }
    load();
  }, []);

  const maxMin = Math.max(...Object.values(zoneMinutes), 1);

  // Gradient from slate (no exposure) → amber → red (high exposure)
  const getHeatColor = (zone) => {
    const mins = zoneMinutes[zone] || 0;
    if (mins === 0) return '#334155';
    const ratio = Math.min(mins / maxMin, 1);
    if (ratio < 0.5) {
      // green → amber
      const t = ratio * 2;
      const r = Math.round(34 + (245 - 34) * t);
      const g = Math.round(197 + (158 - 197) * t);
      const b = Math.round(94 + (11 - 94) * t);
      return `rgb(${r},${g},${b})`;
    }
    // amber → red
    const t = (ratio - 0.5) * 2;
    const r = Math.round(245 + (239 - 245) * t);
    const g = Math.round(158 + (68 - 158) * t);
    const b = Math.round(11 + (68 - 11) * t);
    return `rgb(${r},${g},${b})`;
  };

  const getOpacity = (zone) => {
    const mins = zoneMinutes[zone] || 0;
    return mins > 0 ? 0.85 : 0.3;
  };

  const formatMins = (zone) => {
    const m = Math.round(zoneMinutes[zone] || 0);
    return m > 0 ? `${m}m` : '';
  };

  return (
    <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-slate-300">Mapa de calor corporal</h3>
        <p className="text-[10px] text-slate-500 mt-0.5">Zonas con más exposición acumulada</p>
      </div>

      <div className="flex justify-center">
        <div className="w-44">
          <svg viewBox="0 0 200 420" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            {/* Face */}
            <ellipse cx="100" cy="38" rx="24" ry="30" fill={getHeatColor('face')} opacity={getOpacity('face')} stroke="#475569" strokeWidth="1" />
            {/* Neck */}
            <rect x="90" y="66" width="20" height="16" rx="4" fill={getHeatColor('neck')} opacity={getOpacity('neck')} stroke="#475569" strokeWidth="1" />
            {/* Shoulders */}
            <path d="M66,88 Q66,78 78,82 L90,84 L90,100 L66,100 Z" fill={getHeatColor('shoulders')} opacity={getOpacity('shoulders')} stroke="#475569" strokeWidth="1" />
            <path d="M134,88 Q134,78 122,82 L110,84 L110,100 L134,100 Z" fill={getHeatColor('shoulders')} opacity={getOpacity('shoulders')} stroke="#475569" strokeWidth="1" />
            {/* Chest */}
            <rect x="78" y="82" width="44" height="44" rx="4" fill={getHeatColor('chest')} opacity={getOpacity('chest')} stroke="#475569" strokeWidth="1" />
            {/* Abdomen */}
            <path d="M78,126 L122,126 L118,186 Q100,194 82,186 Z" fill={getHeatColor('abdomen')} opacity={getOpacity('abdomen')} stroke="#475569" strokeWidth="1" />
            {/* Arms */}
            <rect x="48" y="100" width="20" height="52" rx="8" fill={getHeatColor('arms')} opacity={getOpacity('arms')} stroke="#475569" strokeWidth="1" />
            <rect x="132" y="100" width="20" height="52" rx="8" fill={getHeatColor('arms')} opacity={getOpacity('arms')} stroke="#475569" strokeWidth="1" />
            {/* Forearms */}
            <rect x="44" y="154" width="18" height="52" rx="7" fill={getHeatColor('forearms')} opacity={getOpacity('forearms')} stroke="#475569" strokeWidth="1" />
            <rect x="138" y="154" width="18" height="52" rx="7" fill={getHeatColor('forearms')} opacity={getOpacity('forearms')} stroke="#475569" strokeWidth="1" />
            {/* Hands */}
            <ellipse cx="53" cy="218" rx="10" ry="12" fill={getHeatColor('hands')} opacity={getOpacity('hands')} stroke="#475569" strokeWidth="1" />
            <ellipse cx="147" cy="218" rx="10" ry="12" fill={getHeatColor('hands')} opacity={getOpacity('hands')} stroke="#475569" strokeWidth="1" />
            {/* Thighs */}
            <path d="M82,190 L98,190 L94,272 L76,272 Z" fill={getHeatColor('thighs')} opacity={getOpacity('thighs')} stroke="#475569" strokeWidth="1" />
            <path d="M102,190 L118,190 L124,272 L106,272 Z" fill={getHeatColor('thighs')} opacity={getOpacity('thighs')} stroke="#475569" strokeWidth="1" />
            {/* Shins */}
            <rect x="74" y="276" width="20" height="60" rx="8" fill={getHeatColor('shins')} opacity={getOpacity('shins')} stroke="#475569" strokeWidth="1" />
            <rect x="106" y="276" width="20" height="60" rx="8" fill={getHeatColor('shins')} opacity={getOpacity('shins')} stroke="#475569" strokeWidth="1" />
            {/* Feet */}
            <ellipse cx="84" cy="350" rx="14" ry="10" fill={getHeatColor('feet')} opacity={getOpacity('feet')} stroke="#475569" strokeWidth="1" />
            <ellipse cx="116" cy="350" rx="14" ry="10" fill={getHeatColor('feet')} opacity={getOpacity('feet')} stroke="#475569" strokeWidth="1" />
          </svg>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-1.5">
        <span className="text-[9px] text-slate-500">Menos</span>
        <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#334155' }} />
        <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#22c55e' }} />
        <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#f59e0b' }} />
        <div className="w-4 h-3 rounded-sm" style={{ backgroundColor: '#ef4444' }} />
        <span className="text-[9px] text-slate-500">Más</span>
      </div>
    </div>
  );
}
