import WeeklyChart from '../../components/charts/WeeklyChart';
import MonthlyHeatmap from '../../components/charts/MonthlyHeatmap';
import YearlyChart from '../../components/charts/YearlyChart';
import DailyComparison from '../../components/charts/DailyComparison';
import BodyZoneChart from '../../components/charts/BodyZoneChart';
import BodyHeatmapChart from '../../components/charts/BodyHeatmap';

export default function DashboardPage() {
  return (
    <div className="flex-1 px-4 pt-6 pb-24 max-w-lg mx-auto w-full space-y-4">
      <header>
        <h1 className="text-xl font-bold">Dashboard</h1>
        <p className="text-slate-500 text-xs mt-1">Análisis de tu exposición solar</p>
      </header>

      <DailyComparison />
      <WeeklyChart />

      {/* Body zone analytics */}
      <BodyHeatmapChart />
      <BodyZoneChart />

      <MonthlyHeatmap />
      <YearlyChart />
    </div>
  );
}
