import { useState } from 'react';
import { Bell, MapPin, Shield, Sun } from 'lucide-react';
import { useProfileStore } from '../../store/profileStore';
import { SKIN_TYPES } from '../../data/skinTypes';
import PersistenceNotice from './PersistenceNotice';

const goals = [10, 20, 30, 45];

export default function Onboarding() {
  const completeOnboarding = useProfileStore((state) => state.completeOnboarding);
  const [skinType, setSkinType] = useState('medium');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(20);
  const [city, setCity] = useState('');

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950 px-4 py-6">
      <div className="mx-auto flex min-h-full w-full max-w-lg flex-col justify-center gap-5">
        <header className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[24px] bg-amber-400 text-slate-950 shadow-lg shadow-amber-400/25">
            <Sun size={34} />
          </div>
          <h1 className="mt-5 text-3xl font-black tracking-tight">Solarium</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Tu diario de exposición solar. Crea el hábito gratis; Pro añadirá UV, alertas y perfiles avanzados.
          </p>
        </header>

        <section className="rounded-3xl border border-slate-700/70 bg-slate-900 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-100">
            <Shield size={17} className="text-amber-300" />
            Tipo de piel
          </div>
          <div className="grid gap-2">
            {SKIN_TYPES.map((type) => (
              <button
                key={type.key}
                type="button"
                onClick={() => setSkinType(type.key)}
                className={`rounded-2xl border p-3 text-left transition-all ${
                  skinType === type.key ? 'border-amber-400/70 bg-amber-400/15' : 'border-slate-700 bg-slate-950/35'
                }`}
              >
                <div className="text-sm font-semibold text-slate-100">{type.label}</div>
                <div className="mt-0.5 text-xs text-slate-500">{type.desc}</div>
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700/70 bg-slate-900 p-4">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-100">
            <Bell size={17} className="text-amber-300" />
            Objetivo diario
          </div>
          <div className="grid grid-cols-4 gap-2">
            {goals.map((goal) => (
              <button
                key={goal}
                type="button"
                onClick={() => setDailyGoalMinutes(goal)}
                className={`rounded-2xl border py-3 text-sm font-bold transition-all ${
                  dailyGoalMinutes === goal ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-700 bg-slate-950/35 text-slate-300'
                }`}
              >
                {goal}m
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-slate-700/70 bg-slate-900 p-4">
          <label className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-100" htmlFor="city">
            <MapPin size={17} className="text-amber-300" />
            Ciudad para UV Pro
          </label>
          <input
            id="city"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            placeholder="Madrid, Barcelona..."
            className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition-colors placeholder:text-slate-600 focus:border-amber-400/70"
          />
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            En esta versión no pedimos GPS. Para App Store, primero mostramos valor con ciudad manual y luego pedimos ubicación solo si hace falta.
          </p>
        </section>

        <PersistenceNotice />

        <button
          type="button"
          onClick={() => completeOnboarding({ skinType, dailyGoalMinutes, city: city.trim() })}
          className="rounded-2xl bg-amber-400 py-4 text-base font-black text-slate-950 shadow-lg shadow-amber-400/20 active:scale-[0.98]"
        >
          Empezar gratis
        </button>

        <p className="text-center text-[11px] leading-relaxed text-slate-500">
          Solarium no sustituye consejo médico. La guía UV futura será informativa y dependerá de permisos y datos externos.
        </p>
      </div>
    </div>
  );
}
