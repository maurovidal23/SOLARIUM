import { PersonStanding } from 'lucide-react';
import { useExposureStore } from '../../store/exposureStore';
import { formatTime, formatDuration, getIntensityColor, getIntensityLabel, formatBodyParts } from '../../utils/format';

export default function SessionList() {
  const { todaySessions } = useExposureStore();

  if (todaySessions.length === 0) {
    return <div className="py-8 text-center text-sm text-slate-500">No hay sesiones registradas hoy</div>;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-slate-300">Sesiones de hoy</h3>
      {[...todaySessions].reverse().map((session) => (
        <div key={session.id} className="flex items-center gap-3 rounded-xl bg-slate-800/50 p-3">
          <div className="h-10 w-2 rounded-full" style={{ backgroundColor: getIntensityColor(session.intensity_level) }} />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">
              {formatTime(session.start_time)} — {session.end_time ? formatTime(session.end_time) : 'en curso'}
            </div>
            <div className="text-xs text-slate-400">
              {formatDuration(session.duration)} · {getIntensityLabel(session.intensity_level)}
            </div>
            {session.body_parts?.length > 0 && (
              <div className="mt-1 flex items-center gap-1 truncate text-[10px] text-slate-500">
                <PersonStanding size={12} />
                {formatBodyParts(session.body_parts)}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
