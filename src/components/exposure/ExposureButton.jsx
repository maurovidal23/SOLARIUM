import { Moon, Square, Sun } from 'lucide-react';
import { useExposureStore } from '../../store/exposureStore';
import { formatDuration } from '../../utils/format';

export default function ExposureButton() {
  const { isTracking, elapsedSeconds, startExposure, stopExposure } = useExposureStore();

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div
          className={`flex h-52 w-52 items-center justify-center rounded-full transition-all duration-500 ${
            isTracking
              ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 shadow-[0_0_70px_rgba(245,158,11,0.28)]'
              : 'bg-slate-800/50'
          }`}
        >
          <div
            className={`flex h-44 w-44 flex-col items-center justify-center rounded-full transition-all duration-500 ${
              isTracking ? 'bg-gradient-to-br from-amber-500/30 to-orange-600/30' : 'bg-slate-800'
            }`}
          >
            {isTracking ? (
              <>
                <Sun size={42} className="mb-2 text-amber-300" />
                <span className="font-mono text-2xl font-bold text-amber-300">{formatDuration(elapsedSeconds)}</span>
                <span className="mt-1 text-xs text-amber-200/70">Exposición activa</span>
              </>
            ) : (
              <>
                <Moon size={40} className="mb-2 text-slate-500" />
                <span className="mt-1 text-sm text-slate-500">Sin exposición</span>
              </>
            )}
          </div>
        </div>

        {isTracking && (
          <div className="absolute inset-0 animate-ping rounded-full bg-amber-500/10" style={{ animationDuration: '2s' }} />
        )}
      </div>

      <button
        type="button"
        onClick={isTracking ? stopExposure : startExposure}
        className={`inline-flex items-center gap-2 rounded-2xl px-9 py-4 text-lg font-bold transition-all duration-300 active:scale-95 ${
          isTracking
            ? 'border border-red-500/30 bg-red-500/20 text-red-300 hover:bg-red-500/30'
            : 'bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40'
        }`}
      >
        {isTracking ? <Square size={18} fill="currentColor" /> : <Sun size={20} />}
        {isTracking ? 'Detener exposición' : 'Iniciar exposición'}
      </button>
    </div>
  );
}
