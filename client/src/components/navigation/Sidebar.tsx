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
  ShieldAlert,
  Info,
  LogOut
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
  { to: '/about', label: 'About Mission OS', icon: Info },
  { to: '/settings', label: 'System Settings', icon: Settings }
];

export const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const { user, isDemoMode, logout } = useAuth();

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
      style={{
        background: 'rgba(255,255,255,0.07)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.14)',
      }}
    >
      {/* Brand Header */}
      <div
        className="flex items-center justify-between h-16 px-4"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}
      >
        {!collapsed ? (
          <div className="flex items-center space-x-2 overflow-hidden">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm"
              style={{ background: '#ffffff', color: '#1129e2' }}
            >
              M
            </div>
            <span
              className="font-black text-white overflow-hidden whitespace-nowrap"
              style={{ letterSpacing: '-0.06em', fontSize: '1.1rem' }}
            >
              MISSION<span className="opacity-60">OS</span>
            </span>
          </div>
        ) : (
          <div
            className="mx-auto w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm"
            style={{ background: '#ffffff', color: '#1129e2' }}
          >
            M
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg transition-colors hidden md:block"
          style={{ color: 'rgba(255,255,255,0.55)' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.55)')}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Demo Warning Pill if active */}
      {isDemoMode && !collapsed && (
        <div
          className="mx-3 mt-3 px-3 py-1.5 rounded-lg flex items-center space-x-2 text-[11px]"
          style={{
            background: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
            color: 'rgba(255,255,255,0.65)',
          }}
        >
          <ShieldAlert className="w-3.5 h-3.5 flex-shrink-0 text-white" />
          <span className="truncate">Local Demo Mode Active</span>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center px-3 py-2.5 rounded-xl text-sm transition-all group ${
                  isActive ? 'found-nav-active' : 'found-nav-link'
                }`
              }
              style={({ isActive }) =>
                isActive
                  ? {
                      background: 'rgba(255,255,255,0.14)',
                      color: '#ffffff',
                      fontWeight: 600,
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.28)',
                    }
                  : {
                      color: 'rgba(255,255,255,0.65)',
                    }
              }
              onMouseEnter={e => {
                const el = e.currentTarget;
                if (!el.classList.contains('found-nav-active')) {
                  el.style.background = 'rgba(255,255,255,0.09)';
                  el.style.color = '#fff';
                }
              }}
              onMouseLeave={e => {
                const el = e.currentTarget;
                if (!el.classList.contains('found-nav-active')) {
                  el.style.background = '';
                  el.style.color = 'rgba(255,255,255,0.65)';
                }
              }}
            >
              <Icon className={`w-4 h-4 flex-shrink-0 ${collapsed ? 'mx-auto' : 'mr-3'}`} />
              {!collapsed && (
                <div className="flex items-center justify-between w-full overflow-hidden">
                  <span className="truncate tracking-found" style={{ letterSpacing: '-0.03em' }}>
                    {item.label}
                  </span>
                  {item.badge && (
                    <span
                      className="text-[9px] font-bold px-1.5 py-0.5 rounded-full ml-1 flex-shrink-0"
                      style={{
                        background: 'rgba(255,255,255,0.15)',
                        color: 'rgba(255,255,255,0.8)',
                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.25)',
                      }}
                    >
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
      <div
        className="p-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.12)' }}
      >
        {!collapsed ? (
          <div
            className="flex items-center space-x-3 px-2 py-2 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
              style={{ background: '#ffffff', color: '#1129e2' }}
            >
              {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{user?.full_name || 'Commander'}</p>
              <p className="text-[10px] font-mono" style={{ color: 'rgba(255,255,255,0.55)' }}>
                {user?.level} · {user?.current_xp || user?.xp || 0} XP
              </p>
            </div>
            <button
              onClick={() => logout()}
              className="p-1.5 text-white/40 hover:text-red-400 transition-colors rounded-lg hover:bg-white/10"
              title="Secure Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            onClick={() => logout()}
            className="w-8 h-8 mx-auto rounded-full flex items-center justify-center font-bold text-sm cursor-pointer hover:opacity-80"
            style={{ background: '#ffffff', color: '#1129e2' }}
            title="Click to Logout"
          >
            {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        )}
      </div>
    </aside>
  );
};
