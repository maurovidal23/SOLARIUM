import { NavLink } from 'react-router-dom';
import { BarChart3, Clock, Crown, Settings, Sun } from 'lucide-react';

const tabs = [
  { to: '/', icon: Sun, label: 'Inicio' },
  { to: '/dashboard', icon: BarChart3, label: 'Datos' },
  { to: '/insights', icon: Crown, label: 'Pro' },
  { to: '/history', icon: Clock, label: 'Historial' },
  { to: '/settings', icon: Settings, label: 'Ajustes' },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900/95 backdrop-blur safe-area-pb">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {tabs.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 flex-col items-center gap-1 px-1 py-3 text-[11px] transition-colors ${
                isActive ? 'text-amber-400' : 'text-slate-500'
              }`
            }
          >
            <Icon size={20} />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
