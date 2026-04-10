import { useState } from 'react';
import BodyFront from './BodyFront';
import BodyBack from './BodyBack';
import BODY_ZONE_LABELS, { PRESETS } from './bodyZones';

export default function BodySelector({ selectedZones, onChangeZones }) {
  const [view, setView] = useState('front');

  const handleToggleZone = (zone) => {
    if (selectedZones.includes(zone)) {
      onChangeZones(selectedZones.filter((z) => z !== zone));
    } else {
      onChangeZones([...selectedZones, zone]);
    }
  };

  const applyPreset = (zones) => {
    onChangeZones([...zones]);
  };

  const clearAll = () => {
    onChangeZones([]);
  };

  // Check if a preset matches current selection
  const isPresetActive = (preset) => {
    if (selectedZones.length !== preset.zones.length) return false;
    return preset.zones.every((z) => selectedZones.includes(z));
  };

  return (
    <div className="space-y-3">
      {/* Presets */}
      <div className="flex flex-wrap gap-1.5 justify-center">
        {PRESETS.map((preset) => (
          <button
            key={preset.key}
            onClick={() => applyPreset(preset.zones)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isPresetActive(preset)
                ? 'bg-amber-500/25 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/10'
                : 'bg-slate-700/40 text-slate-400 border border-slate-600/30 hover:bg-slate-700/60'
            }`}
            title={preset.desc}
          >
            {preset.label}
          </button>
        ))}
        {selectedZones.length > 0 && (
          <button
            onClick={clearAll}
            className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-700/40 text-slate-500 border border-slate-600/30 hover:text-red-400 hover:border-red-500/30 transition-all"
          >
            ✕ Limpiar
          </button>
        )}
      </div>

      {/* View toggle */}
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={() => setView('front')}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
            view === 'front'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
          }`}
        >
          Frontal
        </button>
        <button
          onClick={() => setView('back')}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
            view === 'back'
              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              : 'bg-slate-700/50 text-slate-400 border border-slate-600/30'
          }`}
        >
          Espalda
        </button>
      </div>

      {/* Body SVG */}
      <div className="flex justify-center">
        <div className="w-48">
          {view === 'front' ? (
            <BodyFront selectedZones={selectedZones} onToggleZone={handleToggleZone} />
          ) : (
            <BodyBack selectedZones={selectedZones} onToggleZone={handleToggleZone} />
          )}
        </div>
      </div>

      {/* Selected zones pills */}
      {selectedZones.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center">
          {selectedZones.map((zone) => (
            <span
              key={zone}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/20 text-amber-400 border border-amber-500/20"
            >
              {BODY_ZONE_LABELS[zone] || zone}
              <button
                onClick={() => handleToggleZone(zone)}
                className="ml-0.5 hover:text-amber-200"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Count */}
      <div className="text-center text-[10px] text-slate-500">
        {selectedZones.length} de {Object.keys(BODY_ZONE_LABELS).length} zonas seleccionadas
      </div>
    </div>
  );
}
