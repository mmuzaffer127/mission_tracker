import React from 'react';
import { Volume2, VolumeX, Menu, Sparkles, Bell } from 'lucide-react';
import { useSound } from '../../contexts/SoundContext.js';
import { useAuth } from '../../contexts/AuthContext.js';

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
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-surface-200/80 backdrop-blur-md border-b border-surface-border">
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-surface-100 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-sm font-semibold text-gray-200">
            Mission Operations Command
          </h2>
          <p className="text-xs text-gray-400 hidden sm:block">
            "Become 1% Better Every Day."
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Quick Launch Mission Button */}
        <button
          onClick={onOpenQuickMission}
          className="flex items-center space-x-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-brand-blue to-blue-600 text-white text-xs font-semibold shadow-glow hover:brightness-110 active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Mission</span>
        </button>

        {/* Audio FX Toggle */}
        <button
          onClick={handleSoundToggle}
          className={`p-2 rounded-xl border transition-colors ${
            soundEnabled
              ? 'bg-surface-100 text-brand-cyan border-brand-cyan/30'
              : 'bg-surface-100/50 text-gray-500 border-surface-border'
          }`}
          title={soundEnabled ? 'Sound Effects Active' : 'Sound Effects Muted'}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button className="p-2 rounded-xl bg-surface-100 border border-surface-border text-gray-400 hover:text-white transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
        </div>

        {/* XP Status Pill */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-xl bg-surface-100 border border-surface-border text-xs">
          <span className="text-brand-amber font-mono font-bold">⚡ {user?.xp || 850} XP</span>
        </div>
      </div>
    </header>
  );
};
