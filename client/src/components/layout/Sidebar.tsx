import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Files, 
  Sparkles, 
  FileSpreadsheet, 
  BarChart3, 
  CloudRain, 
  ShieldCheck, 
  Network, 
  FileClock, 
  Users, 
  Settings,
  Flame
} from 'lucide-react';

interface SidebarProps {
  collapsed?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = () => {
  const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Documents', path: '/documents', icon: Files },
    { label: 'AI Intelligence', path: '/ai', icon: Sparkles, badge: 'HYBRID' },
    { label: 'Reports', path: '/reports', icon: FileSpreadsheet },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Topics & Trends', path: '/topics', icon: CloudRain },
    { label: 'Data Validation', path: '/validation', icon: ShieldCheck, badge: '4' },
    { label: 'Knowledge Base', path: '/knowledge', icon: Network },
    { label: 'Audit Trail', path: '/audit', icon: FileClock },
    { label: 'Administration', path: '/administration', icon: Users },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-coal-900 border-r border-coal-800 flex flex-col h-screen select-none flex-shrink-0">
      {/* Brand Header */}
      <div className="h-16 border-b border-coal-800 px-5 flex items-center gap-3 bg-coal-950/60">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-500 to-amber-700 flex items-center justify-center text-coal-950 shadow-md">
          <Flame className="w-5 h-5 fill-current" />
        </div>
        <div>
          <h1 className="font-extrabold text-sm tracking-wider text-coal-100 uppercase">
            COAL<span className="text-gold-400">INTELLIGENCE</span>
          </h1>
          <p className="text-[10px] text-coal-400 font-mono tracking-tight">CMPDI / CIL PLATFORM</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-coal-400">
          Core Operations
        </div>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                isActive
                  ? 'bg-coal-800 text-gold-400 border border-coal-700/80 shadow-sm'
                  : 'text-coal-300 hover:bg-coal-800/60 hover:text-coal-100 border border-transparent'
              }`
            }
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-4 h-4 text-coal-400 group-hover:text-gold-400 transition-colors" />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                item.badge === 'HYBRID' 
                  ? 'bg-gold-500/10 text-gold-400 border border-gold-500/30'
                  : 'bg-red-950/80 text-red-400 border border-red-800/80'
              }`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Safety Protocol Badge */}
      <div className="p-4 border-t border-coal-800 bg-coal-950/40">
        <div className="p-3 rounded-lg bg-coal-900 border border-coal-800 text-xs text-coal-400 space-y-1">
          <p className="font-bold text-coal-200 text-[11px] uppercase tracking-wider">
            Evidence Protocol
          </p>
          <p className="text-[10px] text-coal-400 font-mono">
            Answer + Evidence + Source + Confidence + Traceability
          </p>
        </div>
      </div>
    </aside>
  );
};
