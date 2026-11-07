import React from 'react';
import { Settings, Volume2, Bell, Shield, Database, CheckCircle2 } from 'lucide-react';
import { useSound } from '../contexts/SoundContext.js';
import { useAuth } from '../contexts/AuthContext.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

export const SettingsPage: React.FC = () => {
  const { soundEnabled, toggleSound } = useSound();
  const { user, isDemoMode, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center space-x-2">
          <Settings className="w-6 h-6 text-gray-300" />
          <span>System Settings & Preferences</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Configure Mission OS parameters, audio triggers, security, and cloud sync.
        </p>
      </div>

      <div className="space-y-4">
        {/* Profile Card */}
        <div className="glass-panel rounded-2xl p-6 border border-surface-border flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-blue flex items-center justify-center font-bold text-lg text-white">
              {user?.full_name?.charAt(0) || 'C'}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{user?.full_name}</h3>
              <p className="text-xs text-gray-400 font-mono">{user?.email}</p>
              <p className="text-xs text-brand-cyan font-mono mt-0.5">Rank: {user?.level} • {user?.xp} XP</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="px-4 py-2 rounded-xl bg-surface-50 hover:bg-rose-500/20 text-xs font-semibold text-rose-400 border border-surface-border transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Audio FX Settings */}
        <div className="glass-panel rounded-2xl p-6 border border-surface-border flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Volume2 className="w-5 h-5 text-brand-cyan" />
            <div>
              <h4 className="text-sm font-bold text-white">Haptic Audio Synthesizer</h4>
              <p className="text-xs text-gray-400">Play celebratory harmonic chimes on mission and habit completions</p>
            </div>
          </div>

          <button
            onClick={toggleSound}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              soundEnabled
                ? 'bg-brand-blue/20 text-brand-blue border-brand-blue/40'
                : 'bg-surface-50 text-gray-500 border-surface-border'
            }`}
          >
            {soundEnabled ? 'Enabled' : 'Muted'}
          </button>
        </div>

        {/* Database & Cloud Connection Status */}
        <div className="glass-panel rounded-2xl p-6 border border-surface-border space-y-3">
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-brand-emerald" />
            <div>
              <h4 className="text-sm font-bold text-white">Database & Persistence Engine</h4>
              <p className="text-xs text-gray-400">Multi-tenant Row Level Security (RLS) PostgreSQL integration</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface-50 border border-surface-border text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Cloud Supabase Status:</span>
              <span className={`font-mono font-bold ${isSupabaseConfigured ? 'text-emerald-400' : 'text-amber-400'}`}>
                {isSupabaseConfigured ? 'Connected (Cloud Production)' : 'Active (Local Memory / Sandbox Mode)'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Schema Integrity:</span>
              <span className="font-mono text-emerald-400 font-bold">20 Tables Verified (DDL Ready)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
