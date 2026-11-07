import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  Compass,
  Flame,
  Calendar,
  Trophy,
  BarChart3,
  BookOpen,
  Eye,
  Timer,
  Sparkles,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/missions', label: 'My Missions', icon: Target },
  { to: '/goals', label: 'Master Goals', icon: Compass },
  { to: '/habits', label: 'Daily Habits', icon: Flame },
  { to: '/calendar', label: 'Smart Calendar', icon: Calendar },
  { to: '/achievements', label: 'Achievement Wall', icon: Trophy },
  { to: '/analytics', label: 'Analytics & Wheel', icon: BarChart3 },
  { to: '/journal', label: 'Journal & Future Me', icon: BookOpen },
  { to: '/vision-board', label: 'Vision Board', icon: Eye },
  { to: '/focus', label: 'Focus Mode', icon: Timer },
  { to: '/ai-assistant', label: 'AI Growth Copilot', icon: Sparkles, badge: 'Gemini' },
  { to: '/reports', label: 'Monthly & Annual Reports', icon: FileText },
  { to: '/settings', label: 'System Settings', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { user, isDemoMode } = useAuth();

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-surface-200 border-r border-surface-border transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-surface-border">
        {!collapsed ? (
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center font-bold text-white shadow-glow">
              M
            </div>
            <div>
              <span className="font-bold text-base tracking-wider text-white">MISSION</span>
              <span className="text-xs px-1.5 py-0.5 ml-1.5 rounded bg-brand-blue/20 text-brand-blue font-mono font-bold">OS</span>
            </div>
          </div>
        ) : (
          <div className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-blue to-brand-cyan flex items-center justify-center font-bold text-white shadow-glow">
            M
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-surface-100 transition-colors hidden md:block"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Demo Warning Pill if active */}
      {isDemoMode && !collapsed && (
        <div className="mx-3 mt-3 px-3 py-1.5 rounded-lg bg-brand-blue/10 border border-brand-blue/20 flex items-center space-x-2 text-[11px] text-blue-300">
          <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-brand-blue" />
          <span className="truncate">Local Demo Mode Active</span>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-brand-blue/15 text-blue-400 border border-brand-blue/30 shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-surface-100/60'
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 transition-colors ${collapsed ? 'mx-auto' : 'mr-3'}`} />
              {!collapsed && (
                <div className="flex items-center justify-between w-full overflow-hidden">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 border border-purple-500/30">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Status Bar at bottom */}
      <div className="p-3 border-t border-surface-border">
        {!collapsed ? (
          <div className="flex items-center space-x-3 px-2 py-2 rounded-xl bg-surface-100/70 border border-surface-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center font-semibold text-xs text-white">
              {user?.full_name?.charAt(0) || 'C'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-200 truncate">{user?.full_name}</p>
              <p className="text-[10px] text-brand-cyan font-mono">{user?.level} • {user?.xp} XP</p>
            </div>
          </div>
        ) : (
          <div className="w-8 h-8 mx-auto rounded-full bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center font-semibold text-xs text-white">
            {user?.full_name?.charAt(0) || 'C'}
          </div>
        )}
      </div>
    </aside>
  );
};
