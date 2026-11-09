import React from 'react';
import { Volume2, VolumeX, Menu, Sparkles, Bell, Info } from 'lucide-react';
import { useSound } from '../../contexts/SoundContext.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { Link } from 'react-router-dom';

interface TopNavProps {
  onMenuClick: () => void;
  onOpenQuickMission: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({ onMenuClick, onOpenQuickMission }) => {
  const { soundEnabled, toggleSound, playClick } = useSound();
  const { user } = useAuth();

  const handleSoundToggle = () => {
    playClick();
    toggleSound();
  };

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between h-14 px-5"
      style={{
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: 'inset 0 -1px 0 rgba(255,255,255,0.12)',
      }}
    >
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg transition-colors md:hidden"
          style={{ color: 'rgba(255,255,255,0.65)' }}
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2
            className="text-sm font-bold text-white"
            style={{ letterSpacing: '-0.04em' }}
          >
            Mission Operations Command
          </h2>
          <p
            className="text-[11px] hidden sm:block"
            style={{ color: 'rgba(255,255,255,0.50)' }}
          >
            "Become 1% Better Every Day."
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Quick Launch Mission Button */}
        <button
          onClick={onOpenQuickMission}
          className="btn-primary flex items-center space-x-1.5 text-xs"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Mission</span>
        </button>

        {/* About Mission OS Link */}
        <Link
          to="/about"
          className="p-2 rounded-xl transition-colors text-white/70 hover:text-white"
          style={{
            background: 'rgba(255,255,255,0.07)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
          }}
          title="About Mission OS"
        >
          <Info className="w-4 h-4 text-cyan-300" />
        </Link>

        {/* Audio FX Toggle */}
        <button
          onClick={handleSoundToggle}
          className="p-2 rounded-xl transition-colors"
          style={{
            background: soundEnabled ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)',
            color: soundEnabled ? '#ffffff' : 'rgba(255,255,255,0.45)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
          }}
          title={soundEnabled ? 'Sound Effects Active' : 'Sound Effects Muted'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            className="p-2 rounded-xl transition-colors"
            style={{
              background: 'rgba(255,255,255,0.07)',
              color: 'rgba(255,255,255,0.65)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
            }}
          >
            <Bell className="w-4 h-4" />
          </button>
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full pulse-dot"
            style={{ background: 'rgba(255,255,255,0.80)' }}
          />
        </div>

        {/* XP Status Pill */}
        <div
          className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold"
          style={{
            background: 'rgba(255,255,255,0.10)',
            color: '#ffffff',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.20)',
          }}
        >
          <span>⚡</span>
          <span>{user?.xp || 850} XP</span>
        </div>
      </div>
    </header>
  );
};
