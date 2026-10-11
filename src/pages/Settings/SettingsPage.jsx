import { useState } from 'react';
import { Crown, Download, Lock, RotateCcw, Shield, Sun, Trash2 } from 'lucide-react';
import { clearAllSessions, getAllSessions } from '../../db/sessions';
import { getStoredProfile, useProfileStore } from '../../store/profileStore';
import { useExposureStore } from '../../store/exposureStore';
import { PRO_FEATURES } from '../../data/proFeatures';
import { SKIN_TYPE_LABELS } from '../../data/skinTypes';

const freeFeatures = [
  'Timer diario de exposición solar',
  'Intensidad percibida por sesión',
  'Mapa corporal frontal y espalda',
  'Historial local en el dispositivo',
];

function downloadJson(filename, data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function SettingsPage() {
  const profile = useProfileStore((state) => state.profile);
  const resetProfile = useProfileStore((state) => state.resetProfile);
  const resetExposure = useExposureStore((state) => state.resetExposure);
  const [deletionError, setDeletionError] = useState('');

  const handleExport = async () => {
    const sessions = await getAllSessions();
    downloadJson(`solarium-export-${new Date().toISOString().split('T')[0]}.json`, {
      exported_at: new Date().toISOString(),
      profile: getStoredProfile(),
      sessions,
    });
  };

  const handleDeleteAll = async () => {
    const confirmed = window.confirm('Esto borrará sesiones y perfil local. No se puede deshacer.');
    if (!confirmed) return;
    setDeletionError('');
    try {
      await clearAllSessions();
    } catch {
      setDeletionError('No se pudieron borrar las sesiones. Tus datos siguen disponibles. Inténtalo de nuevo.');
      return;
    }
    // Reset the live stores as well as storage: resetProfile clears the stored
    // profile, and resetExposure stops timers/pending sessions so deleted data
    // cannot reappear.
    resetProfile();
    resetExposure();
  };

  return (
    <div className="mx-auto flex-1 space-y-4 px-4 pb-24 pt-6 w-full max-w-lg">
      <header>
        <h1 className="text-xl font-bold">Ajustes</h1>
        <p className="mt-1 text-xs text-slate-500">Preparado para App Store: privacidad, perfil y producto Pro.</p>
      </header>

      <section className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-200">Perfil solar</h2>
            <p className="mt-1 text-xs text-slate-500">Piel: {SKIN_TYPE_LABELS[profile.skinType] || profile.skinType} - Objetivo: {profile.dailyGoalMinutes}m - Ciudad: {profile.city || 'sin configurar'}</p>
          </div>
          <button
            type="button"
            onClick={resetProfile}
            className="rounded-xl border border-slate-700 p-2 text-slate-400 transition-colors hover:border-amber-400/50 hover:text-amber-300"
            title="Repetir onboarding"
            aria-label="Repetir onboarding"
          >
            <RotateCcw size={17} />
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-400/30 bg-gradient-to-br from-amber-400/15 to-orange-500/10 p-4 shadow-lg shadow-amber-500/10">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
            <Crown size={22} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-amber-100">Solarium Pro</h2>
              <span className="rounded-full border border-amber-300/30 px-2 py-0.5 text-[10px] font-semibold text-amber-200">Roadmap</span>
            </div>
            <p className="mt-1 text-xs leading-relaxed text-amber-100/70">
              La versión gratis crea el hábito. Pro debe vender precisión: UV, alertas, perfiles y exportación.
            </p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-4">
        <h3 className="text-sm font-semibold text-slate-200">Gratis ahora</h3>
        <div className="mt-3 grid gap-2">
          {freeFeatures.map((feature) => (
            <div key={feature} className="flex items-center gap-2 text-xs text-slate-400">
              <Sun size={14} className="text-amber-300" />
              {feature}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-4">
        <h3 className="text-sm font-semibold text-slate-200">Funciones Pro a construir</h3>
        <div className="mt-3 grid gap-3">
          {PRO_FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} className="flex items-start gap-3 rounded-xl border border-slate-700/70 bg-slate-900/45 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-amber-300">
                <Icon size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-xs font-semibold text-slate-200">{title}</h4>
                  <Lock size={13} className="shrink-0 text-slate-500" />
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-4">
        <div className="flex items-start gap-3">
          <Shield size={18} className="mt-0.5 text-slate-400" />
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Privacidad y datos</h3>
            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Los datos se guardan localmente en este MVP. Para App Store hay que publicar política de privacidad, disclaimer de salud y textos de permiso de ubicación.
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-300 hover:border-amber-400/50 hover:text-amber-300"
              >
                <Download size={15} />
                Exportar
              </button>
              <button
                type="button"
                onClick={handleDeleteAll}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-500/30 px-3 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/10"
              >
                <Trash2 size={15} />
                Borrar todo
              </button>
            </div>
            {deletionError && <p role="alert" className="mt-3 text-xs text-red-300">{deletionError}</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
