import { useExposureStore } from '../../store/exposureStore';
import { formatDuration } from '../../utils/format';

export default function ExposureButton() {
  const { isTracking, elapsedSeconds, startExposure, stopExposure } = useExposureStore();

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Timer ring */}
      <div className="relative">
        <div
          className={`w-52 h-52 rounded-full flex items-center justify-center transition-all duration-500 ${
            isTracking
              ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 shadow-[0_0_60px_rgba(245,158,11,0.3)]'
              : 'bg-slate-800/50'
          }`}
        >
          <div
            className={`w-44 h-44 rounded-full flex flex-col items-center justify-center transition-all duration-500 ${
              isTracking
                ? 'bg-gradient-to-br from-amber-500/30 to-orange-600/30'
                : 'bg-slate-800'
            }`}
          >
            {isTracking ? (
              <>
                <span className="text-4xl mb-1">☀️</span>
                <span className="text-2xl font-mono font-bold text-amber-400">
                  {formatDuration(elapsedSeconds)}
                </span>
                <span className="text-xs text-amber-400/60 mt-1">Exposición activa</span>
              </>
            ) : (
              <>
                <span className="text-4xl mb-1 opacity-40">🌙</span>
                <span className="text-sm text-slate-500 mt-1">Sin exposición</span>
              </>
            )}
          </div>
        </div>

        {/* Pulse animation when tracking */}
        {isTracking && (
          <div className="absolute inset-0 rounded-full animate-ping bg-amber-500/10" style={{ animationDuration: '2s' }} />
        )}
      </div>

      {/* Action button */}
      <button
        onClick={isTracking ? stopExposure : startExposure}
        className={`px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-300 active:scale-95 ${
          isTracking
            ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30'
            : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40'
        }`}
      >
        {isTracking ? '⏹ Detener exposición' : '☀️ Iniciar exposición'}
      </button>
    </div>
  );
}
