import { useState } from 'react';
import { ArrowLeft, CloudSun, Flame, Sun } from 'lucide-react';
import { useExposureStore } from '../../store/exposureStore';
import { getIntensityColor } from '../../utils/format';
import BodySelector from '../body/BodySelector';

const levels = [
  { key: 'low', label: 'Baja', Icon: CloudSun, desc: 'Sombra parcial o cielo nublado' },
  { key: 'medium', label: 'Media', Icon: Sun, desc: 'Sol directo moderado' },
  { key: 'high', label: 'Alta', Icon: Flame, desc: 'Sol intenso o horas centrales' },
];

export default function IntensityModal() {
  const { showIntensityModal, confirmSession, dismissIntensity } = useExposureStore();
  const [step, setStep] = useState('intensity');
  const [selectedIntensity, setSelectedIntensity] = useState(null);
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);

  if (!showIntensityModal) return null;

  const resetLocal = () => {
    setStep('intensity');
    setSelectedIntensity(null);
    setSelectedBodyParts([]);
  };

  const handleSelectIntensity = (key) => {
    setSelectedIntensity(key);
    setStep('body');
  };

  const handleConfirm = () => {
    confirmSession(selectedIntensity || 'medium', selectedBodyParts);
    resetLocal();
  };

  const handleSkip = () => {
    if (step === 'intensity') {
      dismissIntensity();
    } else {
      confirmSession(selectedIntensity || 'medium', []);
    }
    resetLocal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center">
      <div className="max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[28px] border border-slate-700/80 bg-slate-900 p-5 shadow-2xl shadow-black/40">
        {step === 'intensity' && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-slate-50">Intensidad del sol</h2>
              <p className="mt-1 text-sm text-slate-400">Elige cómo se sintió esta sesión.</p>
            </div>

            <div className="space-y-3">
              {levels.map(({ key, label, Icon, desc }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleSelectIntensity(key)}
                  className="flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all hover:scale-[1.01] active:scale-[0.99]"
                  style={{ backgroundColor: `${getIntensityColor(key)}18`, borderColor: `${getIntensityColor(key)}45` }}
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl" style={{ backgroundColor: `${getIntensityColor(key)}25`, color: getIntensityColor(key) }}>
                    <Icon size={24} />
                  </span>
                  <span>
                    <span className="block font-semibold" style={{ color: getIntensityColor(key) }}>{label}</span>
                    <span className="text-xs text-slate-400">{desc}</span>
                  </span>
                </button>
              ))}
            </div>

            <button type="button" onClick={handleSkip} className="w-full py-2 text-sm text-slate-500 transition-colors hover:text-slate-300">
              Omitir
            </button>
          </div>
        )}

        {step === 'body' && (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <button type="button" onClick={() => setStep('intensity')} className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-800 hover:text-slate-100">
                <ArrowLeft size={18} />
              </button>
              <div>
                <h2 className="text-lg font-bold text-slate-50">Zonas expuestas</h2>
                <p className="mt-0.5 text-xs text-slate-400">Toca el mapa o usa presets rápidos.</p>
              </div>
            </div>

            <BodySelector selectedZones={selectedBodyParts} onChangeZones={setSelectedBodyParts} />

            <div className="grid grid-cols-2 gap-3 pt-1">
              <button type="button" onClick={handleSkip} className="rounded-2xl border border-slate-700 py-3 text-sm font-semibold text-slate-400 transition-colors hover:border-slate-500 hover:text-slate-200">
                Omitir
              </button>
              <button type="button" onClick={handleConfirm} className="rounded-2xl bg-amber-400 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-400/20 transition-transform active:scale-95">
                Guardar {selectedBodyParts.length > 0 ? `(${selectedBodyParts.length})` : ''}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
