import { useExposureStore } from '../../store/exposureStore';
import { getIntensityColor, formatTime } from '../../utils/format';

export default function Timeline() {
  const { todaySessions } = useExposureStore();
  const hours = Array.from({ length: 24 }, (_, i) => i);

  function getSessionsAtHour(hour) {
    return todaySessions.filter((s) => {
      const startHour = new Date(s.start_time).getHours();
      const endHour = s.end_time ? new Date(s.end_time).getHours() : startHour;
      return hour >= startHour && hour <= endHour;
    });
  }

  return (
    <div className="bg-slate-800/50 rounded-xl p-4">
      <h3 className="text-sm font-semibold text-slate-300 mb-3">Timeline del día</h3>
      <div className="flex gap-[2px] h-16 items-end">
        {hours.map((hour) => {
          const sessions = getSessionsAtHour(hour);
          const hasExposure = sessions.length > 0;
          const maxIntensity = sessions.reduce((max, s) => {
            const order = { high: 3, medium: 2, low: 1 };
            return (order[s.intensity_level] || 0) > (order[max] || 0) ? s.intensity_level : max;
          }, 'low');

          return (
            <div key={hour} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-sm transition-all duration-300"
                style={{
                  height: hasExposure ? '100%' : '20%',
                  backgroundColor: hasExposure ? getIntensityColor(maxIntensity) : '#1e293b',
                  opacity: hasExposure ? 0.8 : 0.3,
                }}
              />
              {hour % 6 === 0 && (
                <span className="text-[9px] text-slate-500">{hour}h</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
