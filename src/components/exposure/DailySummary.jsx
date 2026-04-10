import { useExposureStore } from '../../store/exposureStore';
import { formatDuration } from '../../utils/format';

export default function DailySummary() {
  const { todaySessions, todayTotal } = useExposureStore();

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-amber-400">
          {formatDuration(todayTotal)}
        </div>
        <div className="text-xs text-slate-400 mt-1">Tiempo total hoy</div>
      </div>
      <div className="bg-slate-800/50 rounded-xl p-4 text-center">
        <div className="text-2xl font-bold text-amber-400">
          {todaySessions.length}
        </div>
        <div className="text-xs text-slate-400 mt-1">Sesiones</div>
      </div>
    </div>
  );
}
