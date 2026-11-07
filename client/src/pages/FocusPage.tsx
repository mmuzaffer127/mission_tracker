import React, { useState, useEffect } from 'react';
import { Timer, Play, Pause, RotateCcw, Zap, Sparkles } from 'lucide-react';
import { useSound } from '../contexts/SoundContext.js';

export const FocusPage: React.FC = () => {
  const [mode, setMode] = useState<'pomodoro' | 'short_break' | 'deep_work'>('pomodoro');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [completedSessions, setCompletedSessions] = useState(3);

  const { playComplete, playClick } = useSound();

  const MODE_TIMES = {
    pomodoro: 25 * 60,
    short_break: 5 * 60,
    deep_work: 50 * 60
  };

  useEffect(() => {
    let interval: any = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playComplete();
      setCompletedSessions((c) => c + 1);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const switchMode = (newMode: 'pomodoro' | 'short_break' | 'deep_work') => {
    playClick();
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(MODE_TIMES[newMode]);
  };

  const toggleTimer = () => {
    playClick();
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    playClick();
    setIsRunning(false);
    setTimeLeft(MODE_TIMES[mode]);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalTime = MODE_TIMES[mode];
  const progressPercent = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center justify-center space-x-2">
          <Timer className="w-8 h-8 text-brand-cyan" />
          <span>Hyperfocus Command Center</span>
        </h1>
        <p className="text-xs text-gray-400">
          Eliminate sensory distraction. Enter high-leverage flow states.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center justify-center p-1.5 rounded-2xl bg-surface-100 border border-surface-border max-w-md mx-auto">
        <button
          onClick={() => switchMode('pomodoro')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            mode === 'pomodoro' ? 'bg-brand-blue text-white shadow-glow' : 'text-gray-400 hover:text-white'
          }`}
        >
          Pomodoro (25m)
        </button>
        <button
          onClick={() => switchMode('deep_work')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            mode === 'deep_work' ? 'bg-brand-cyan text-black font-bold shadow-glow' : 'text-gray-400 hover:text-white'
          }`}
        >
          Deep Work (50m)
        </button>
        <button
          onClick={() => switchMode('short_break')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            mode === 'short_break' ? 'bg-brand-emerald text-black font-bold shadow-glow' : 'text-gray-400 hover:text-white'
          }`}
        >
          Short Rest (5m)
        </button>
      </div>

      {/* Futuristic Circular / Display Timer */}
      <div className="glass-panel rounded-3xl p-12 border border-surface-border flex flex-col items-center justify-center space-y-8 shadow-card relative overflow-hidden">
        {/* Ambient background glow when running */}
        {isRunning && (
          <div className="absolute inset-0 bg-brand-cyan/5 animate-pulse pointer-events-none" />
        )}

        <div className="relative flex items-center justify-center">
          <div className="text-7xl sm:text-8xl font-black text-white font-mono tracking-wider drop-shadow-md">
            {timeFormatted}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md bg-surface-50 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-emerald transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
          <button
            onClick={resetTimer}
            className="p-3 rounded-2xl bg-surface-50 border border-surface-border text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide shadow-glow transition-all active:scale-95 flex items-center space-x-2 ${
              isRunning
                ? 'bg-rose-500 text-white hover:bg-rose-600'
                : 'bg-gradient-to-r from-brand-blue to-brand-cyan text-white hover:brightness-110'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>Initiate Focus</span>
              </>
            )}
          </button>
        </div>

        {/* Session Stats */}
        <div className="flex items-center space-x-8 pt-6 border-t border-surface-border/60 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-brand-amber" />
            <span>Today's Sessions: <strong className="text-white font-mono">{completedSessions} completed</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-brand-cyan" />
            <span>XP Rate: <strong className="text-brand-cyan font-mono">+25 XP / session</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
