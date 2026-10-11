import { Crown, Lock, MapPin, Shield, TimerReset } from 'lucide-react';
import { useProfileStore } from '../../store/profileStore';
import { PRO_FEATURES } from '../../data/proFeatures';
import { SKIN_TYPE_LABELS } from '../../data/skinTypes';

export default function InsightsPage() {
  const profile = useProfileStore((state) => state.profile);

  return (
    <div className="mx-auto flex-1 space-y-4 px-4 pb-24 pt-6 w-full max-w-lg">
      <header>
        <h1 className="text-xl font-bold">Insights</h1>
        <p className="mt-1 text-xs text-slate-500">La pantalla que puede vender Pro: UV, alertas y personalización.</p>
      </header>

      <section className="rounded-3xl border border-amber-400/35 bg-gradient-to-br from-amber-400/20 via-orange-500/10 to-slate-900 p-5 shadow-lg shadow-amber-500/10">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-950">
            <Crown size={25} />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-black text-amber-50">Solarium Pro</h2>
            <p className="mt-1 text-xs leading-relaxed text-amber-100/75">
              Pro no debe vender más botones. Debe vender tranquilidad: cuánto sol, cuándo parar y qué zonas cuidar.
            </p>
          </div>
        </div>
        <div className="mt-4 w-full rounded-2xl border border-amber-300/40 bg-amber-400/10 py-3 text-center text-sm font-black text-amber-100">
          Ver plan Pro
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <TimerReset size={16} className="text-amber-300" />
            Objetivo
          </div>
          <div className="mt-2 text-2xl font-black text-slate-50">{profile.dailyGoalMinutes}m</div>
          <p className="mt-1 text-[11px] text-slate-500">Ajustado en onboarding.</p>
        </div>
        <div className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Shield size={16} className="text-amber-300" />
            Perfil
          </div>
          <div className="mt-2 text-2xl font-black text-slate-50">{SKIN_TYPE_LABELS[profile.skinType] || profile.skinType}</div>
          <p className="mt-1 text-[11px] text-slate-500">Base para recomendaciones.</p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-700/70 bg-slate-800/50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Ubicación UV</h3>
            <p className="mt-0.5 text-xs text-slate-500">{profile.city || 'Sin ciudad configurada'}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-amber-300">
            <MapPin size={19} />
          </div>
        </div>
      </section>

      <section className="space-y-3">
        {PRO_FEATURES.map(({ Icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3 rounded-2xl border border-slate-700/70 bg-slate-800/50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-amber-300">
              <Icon size={19} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-slate-200">{title}</h3>
                <Lock size={14} className="shrink-0 text-slate-500" />
              </div>
              <p className="mt-1 text-xs leading-relaxed text-slate-500">{desc}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
