import { NavLink } from 'react-router-dom';
import { Sun, BarChart3, Clock, Settings } from 'lucide-react';

const tabs = [
  { to: '/', icon: Sun, label: 'Inicio' },
  { to: '/dashboard', icon: BarChart3, label: 'Dashboard' },
  { to: '/history', icon: Clock, label: 'Historial' },
  { to: '/settings', icon: Settings, label: 'Ajustes' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-800 safe-area-pb">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 py-3 px-4 text-xs transition-colors ${
                isActive ? 'text-amber-400' : 'text-slate-500'
              }`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
