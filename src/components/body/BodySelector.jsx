import { useMemo } from 'react';
import { Check, RotateCcw, Sparkles, X } from 'lucide-react';
import BodyFront from './BodyFront';
import BodyBack from './BodyBack';
import BODY_ZONE_LABELS, { PRESETS, ZONE_GROUPS } from './bodyZones';

export default function BodySelector({ selectedZones, onChangeZones }) {
  const selectedSet = useMemo(() => new Set(selectedZones), [selectedZones]);
  const selectedPercent = Math.round((selectedZones.length / Object.keys(BODY_ZONE_LABELS).length) * 100);

  const handleToggleZone = (zone) => {
    if (selectedSet.has(zone)) {
      onChangeZones(selectedZones.filter((z) => z !== zone));
      return;
    }
    onChangeZones([...selectedZones, zone]);
  };

  const applyPreset = (zones) => onChangeZones([...zones]);
  const clearAll = () => onChangeZones([]);

  const toggleGroup = (zones) => {
    const allSelected = zones.every((zone) => selectedSet.has(zone));
    if (allSelected) {
      onChangeZones(selectedZones.filter((zone) => !zones.includes(zone)));
      return;
    }
    onChangeZones(Array.from(new Set([...selectedZones, ...zones])));
  };

  const isPresetActive = (preset) => {
    if (selectedZones.length !== preset.zones.length) return false;
    return preset.zones.every((zone) => selectedSet.has(zone));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-700/70 bg-slate-950/30 p-3">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-300/80">Mapa corporal</div>
            <div className="text-[11px] text-slate-400">Selecciona solo las zonas que recibieron sol directo.</div>
          </div>
          <div className="rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs font-semibold text-amber-200">
            {selectedPercent}%
          </div>
        </div>

        {/* Both views are shown together so all 13 zones are reachable at once. */}
        <div className="grid grid-cols-2 items-start gap-3">
          <figure className="m-0">
            <div className="mx-auto w-full rounded-[26px] border border-slate-700/60 bg-slate-950/45 px-3 py-3">
              <BodyFront selectedZones={selectedZones} onToggleZone={handleToggleZone} />
            </div>
            <figcaption className="mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Frontal
            </figcaption>
          </figure>

          <figure className="m-0">
            <div className="mx-auto w-full rounded-[26px] border border-slate-700/60 bg-slate-950/45 px-3 py-3">
              <BodyBack selectedZones={selectedZones} onToggleZone={handleToggleZone} />
            </div>
            <figcaption className="mt-2 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Espalda
            </figcaption>
          </figure>
        </div>

        <div className="mt-3 grid gap-2">
          {ZONE_GROUPS.map((group) => {
            const activeCount = group.zones.filter((zone) => selectedSet.has(zone)).length;
            const allSelected = activeCount === group.zones.length;
            return (
              <button
                key={group.key}
                type="button"
                onClick={() => toggleGroup(group.zones)}
                className={`w-full rounded-xl border px-3 py-2 text-left transition-all ${
                  allSelected
                    ? 'border-amber-400/50 bg-amber-400/15 text-amber-100'
                    : 'border-slate-700/70 bg-slate-900/50 text-slate-300 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold">{group.label}</span>
                  {allSelected ? <Check size={14} /> : <span className="text-[10px] text-slate-500">{activeCount}/{group.zones.length}</span>}
                </div>
              </button>
            );
          })}
          {selectedZones.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700/70 px-3 py-2 text-xs font-semibold text-slate-400 transition-colors hover:border-red-400/40 hover:text-red-300"
            >
              <RotateCcw size={14} />
              Limpiar mapa
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {PRESETS.map((preset) => (
          <button
            key={preset.key}
            type="button"
            onClick={() => applyPreset(preset.zones)}
            className={`rounded-xl border p-3 text-left transition-all ${
              isPresetActive(preset)
                ? 'border-amber-400/60 bg-amber-400/15 text-amber-100'
                : 'border-slate-700/70 bg-slate-800/50 text-slate-300 hover:border-slate-500'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-semibold">
              {preset.key === 'full' && <Sparkles size={14} />}
              {preset.label}
            </div>
            <div className="mt-1 text-[10px] leading-snug text-slate-500">{preset.desc}</div>
          </button>
        ))}
      </div>

      {selectedZones.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedZones.map((zone) => (
            <span
              key={zone}
              className="inline-flex items-center gap-1 rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-1 text-[10px] font-medium text-amber-200"
            >
              {BODY_ZONE_LABELS[zone] || zone}
              <button type="button" aria-label={`Quitar ${BODY_ZONE_LABELS[zone] || zone}`} onClick={() => handleToggleZone(zone)} className="-m-0.5 p-0.5 text-amber-200/70 transition-colors hover:text-white">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
