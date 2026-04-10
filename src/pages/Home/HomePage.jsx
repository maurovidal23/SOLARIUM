import { useEffect } from 'react';
import { useExposureStore } from '../../store/exposureStore';
import ExposureButton from '../../components/exposure/ExposureButton';
import DailySummary from '../../components/exposure/DailySummary';
import Timeline from '../../components/exposure/Timeline';
import SessionList from '../../components/exposure/SessionList';
import IntensityModal from '../../components/exposure/IntensityModal';

export default function HomePage() {
  const loadTodaySessions = useExposureStore((s) => s.loadTodaySessions);

  useEffect(() => {
    loadTodaySessions();
  }, [loadTodaySessions]);

  return (
    <div className="flex-1 px-4 pt-6 pb-24 max-w-lg mx-auto w-full space-y-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold">
          <span className="text-amber-400">☀️</span> Solarium
        </h1>
        <p className="text-slate-500 text-xs mt-1">Monitoriza tu exposición solar</p>
      </header>

      <ExposureButton />
      <DailySummary />
      <Timeline />
      <SessionList />
      <IntensityModal />
    </div>
  );
}
