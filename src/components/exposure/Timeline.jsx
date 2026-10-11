import { useExposureStore } from '../../store/exposureStore';
import { getIntensityColor } from '../../utils/format';

export default function Timeline() {
  const { todaySessions } = useExposureStore();
  const hours = Array.from({ length: 24 }, (_, index) => index);

  function getSessionsAtHour(hour) {
    return todaySessions.filter((session) => {
      const startHour = new Date(session.start_time).getHours();
      const endHour = session.end_time ? new Date(session.end_time).getHours() : startHour;
      return hour >= startHour && hour <= endHour;
    });
  }

  return (
    <div className="rounded-xl bg-slate-800/50 p-4">
      <h3 className="mb-3 text-sm font-semibold text-slate-300">Timeline del día</h3>
      <div className="flex h-16 items-end gap-[2px]">
        {hours.map((hour) => {
          const sessions = getSessionsAtHour(hour);
          const hasExposure = sessions.length > 0;
          const maxIntensity = sessions.reduce((max, session) => {
            const order = { high: 3, medium: 2, low: 1 };
            return (order[session.intensity_level] || 0) > (order[max] || 0) ? session.intensity_level : max;
          }, 'low');

          return (
            <div key={hour} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-sm transition-all duration-300"
                style={{
                  height: hasExposure ? '100%' : '20%',
                  backgroundColor: hasExposure ? getIntensityColor(maxIntensity) : '#1e293b',
                  opacity: hasExposure ? 0.8 : 0.3,
                }}
              />
              {hour % 6 === 0 && <span className="text-[9px] text-slate-500">{hour}h</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
