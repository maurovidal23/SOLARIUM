import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BottomNav from './components/layout/BottomNav';
import Onboarding from './components/onboarding/Onboarding';
import PersistenceNotice from './components/onboarding/PersistenceNotice';
import HomePage from './pages/Home/HomePage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import InsightsPage from './pages/Insights/InsightsPage';
import HistoryPage from './pages/History/HistoryPage';
import SettingsPage from './pages/Settings/SettingsPage';
import { useProfileStore } from './store/profileStore';

function App() {
  const profile = useProfileStore((state) => state.profile);
  const loaded = useProfileStore((state) => state.loaded);
  const loadProfile = useProfileStore((state) => state.loadProfile);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return (
    <BrowserRouter>
      <div className="flex flex-1 flex-col">
        {loaded && !profile.onboardingComplete && <Onboarding />}
        {loaded && profile.onboardingComplete && <PersistenceNotice />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/insights" element={<InsightsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
