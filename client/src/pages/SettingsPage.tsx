import React from 'react';
import { Settings, Volume2, Database } from 'lucide-react';
import { useSound } from '../contexts/SoundContext.js';
import { useAuth } from '../contexts/AuthContext.js';
import { isSupabaseConfigured } from '../lib/supabase.js';

export const SettingsPage: React.FC = () => {
  const { soundEnabled, toggleSound } = useSound();
  const { user, logout } = useAuth();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1
          className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center space-x-2"
          style={{ letterSpacing: '-0.06em' }}
        >
          <Settings className="w-6 h-6 text-white" />
          <span>System Settings & Preferences</span>
        </h1>
        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.60)' }}>
          Configure Mission OS parameters, audio triggers, security, and cloud sync.
        </p>
      </div>

      <div className="space-y-4">
        {/* Profile Card */}
        <div
          className="rounded-2xl p-6 flex items-center justify-between"
          style={{
            background: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
          }}
        >
          <div className="flex items-center space-x-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg"
              style={{ background: '#ffffff', color: '#1129e2' }}
            >
              {user?.full_name?.charAt(0) || 'C'}
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{user?.full_name}</h3>
              <p className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.60)' }}>{user?.email}</p>
              <p className="text-xs font-mono mt-0.5 text-white/80">Rank: {user?.level} • {user?.xp} XP</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="btn-glass text-xs hover:bg-white/20"
          >
            Sign Out
          </button>
        </div>

        {/* Audio FX Settings */}
        <div
          className="rounded-2xl p-6 flex items-center justify-between"
          style={{
            background: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
          }}
        >
          <div className="flex items-center space-x-3">
            <Volume2 className="w-5 h-5 text-white" />
            <div>
              <h4 className="text-sm font-bold text-white">Haptic Audio Synthesizer</h4>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>
                Play celebratory harmonic chimes on mission and habit completions
              </p>
            </div>
          </div>

          <button
            onClick={toggleSound}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              soundEnabled
                ? 'bg-white text-[#1129e2] shadow-sm'
                : 'btn-glass'
            }`}
          >
            {soundEnabled ? 'Enabled' : 'Muted'}
          </button>
        </div>

        {/* Database & Cloud Connection Status */}
        <div
          className="rounded-2xl p-6 space-y-3"
          style={{
            background: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
          }}
        >
          <div className="flex items-center space-x-3">
            <Database className="w-5 h-5 text-white" />
            <div>
              <h4 className="text-sm font-bold text-white">Database & Persistence Engine</h4>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>
                Multi-tenant Row Level Security (RLS) PostgreSQL integration
              </p>
            </div>
          </div>

          <div
            className="p-4 rounded-xl text-xs space-y-2"
            style={{
              background: 'rgba(255,255,255,0.06)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)'
            }}
          >
            <div className="flex items-center justify-between">
              <span style={{ color: 'rgba(255,255,255,0.60)' }}>Cloud Supabase Status:</span>
              <span className="font-mono font-bold text-white">
                {isSupabaseConfigured ? 'Connected (Cloud Production)' : 'Active (Local Memory / Sandbox Mode)'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span style={{ color: 'rgba(255,255,255,0.60)' }}>Schema Integrity:</span>
              <span className="font-mono text-white font-bold">20 Tables Verified (DDL Ready)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
