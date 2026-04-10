import { useState } from 'react';
import { useExposureStore } from '../../store/exposureStore';
import { getIntensityColor } from '../../utils/format';
import BodySelector from '../body/BodySelector';

const levels = [
  { key: 'low', label: 'Baja', emoji: '🌤️', desc: 'Sombra parcial, nublado' },
  { key: 'medium', label: 'Media', emoji: '☀️', desc: 'Sol directo moderado' },
  { key: 'high', label: 'Alta', emoji: '🔥', desc: 'Sol intenso, mediodía' },
];

export default function IntensityModal() {
  const { showIntensityModal, confirmSession, dismissIntensity } = useExposureStore();
  const [step, setStep] = useState('intensity'); // 'intensity' | 'body'
  const [selectedIntensity, setSelectedIntensity] = useState(null);
  const [selectedBodyParts, setSelectedBodyParts] = useState([]);

  if (!showIntensityModal) return null;

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

  const handleBack = () => {
    setStep('intensity');
  };

  const resetLocal = () => {
    setStep('intensity');
    setSelectedIntensity(null);
    setSelectedBodyParts([]);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4 max-h-[90vh] overflow-y-auto">

        {step === 'intensity' && (
          <>
            <h2 className="text-xl font-bold text-center">¿Intensidad del sol?</h2>
            <p className="text-slate-400 text-sm text-center">
              Selecciona la intensidad percibida durante esta sesión
            </p>

            <div className="space-y-3">
              {levels.map(({ key, label, emoji, desc }) => (
                <button
                  key={key}
                  onClick={() => handleSelectIntensity(key)}
                  className="w-full flex items-center gap-4 p-4 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                  style={{ backgroundColor: `${getIntensityColor(key)}20`, border: `1px solid ${getIntensityColor(key)}40` }}
                >
                  <span className="text-3xl">{emoji}</span>
                  <div className="text-left">
                    <div className="font-semibold" style={{ color: getIntensityColor(key) }}>{label}</div>
                    <div className="text-xs text-slate-400">{desc}</div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleSkip}
              className="w-full text-slate-500 text-sm py-2 hover:text-slate-300 transition-colors"
            >
              Omitir
            </button>
          </>
        )}

        {step === 'body' && (
          <>
            <div className="flex items-center gap-2">
              <button
                onClick={handleBack}
                className="text-slate-400 hover:text-slate-200 transition-colors p-1"
              >
                ← 
              </button>
              <div className="flex-1">
                <h2 className="text-lg font-bold">Zonas expuestas</h2>
                <p className="text-slate-400 text-xs">
                  Toca las zonas del cuerpo que estuvieron al sol
                </p>
              </div>
            </div>

            <BodySelector
              selectedZones={selectedBodyParts}
              onChangeZones={setSelectedBodyParts}
            />

            <div className="flex gap-3">
              <button
                onClick={handleSkip}
                className="flex-1 text-slate-500 text-sm py-3 rounded-xl border border-slate-700 hover:text-slate-300 hover:border-slate-500 transition-colors"
              >
                Omitir
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold text-sm active:scale-95 transition-transform"
              >
                Guardar {selectedBodyParts.length > 0 && `(${selectedBodyParts.length})`}
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
