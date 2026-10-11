import { useEffect } from 'react';
import { Sun } from 'lucide-react';
import { useExposureStore } from '../../store/exposureStore';
import ExposureButton from '../../components/exposure/ExposureButton';
import DailySummary from '../../components/exposure/DailySummary';
import Timeline from '../../components/exposure/Timeline';
import SessionList from '../../components/exposure/SessionList';
import IntensityModal from '../../components/exposure/IntensityModal';

export default function HomePage() {
  const loadTodaySessions = useExposureStore((state) => state.loadTodaySessions);

  useEffect(() => {
    loadTodaySessions();
  }, [loadTodaySessions]);

  return (
    <div className="mx-auto flex-1 space-y-6 px-4 pb-24 pt-6 w-full max-w-lg">
      <header className="text-center">
        <h1 className="flex items-center justify-center gap-2 text-2xl font-bold">
          <Sun size={24} className="text-amber-300" />
          Solarium
        </h1>
        <p className="mt-1 text-xs text-slate-500">Monitoriza tu exposición solar</p>
      </header>

      <ExposureButton />
      <DailySummary />
      <Timeline />
      <SessionList />
      <IntensityModal />
    </div>
  );
}
