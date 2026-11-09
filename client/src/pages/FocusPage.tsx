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
        <h1
          className="text-3xl sm:text-4xl font-black text-white tracking-tight flex items-center justify-center space-x-2"
          style={{ letterSpacing: '-0.06em' }}
        >
          <Timer className="w-8 h-8 text-white" />
          <span>Hyperfocus Command Center</span>
        </h1>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.60)' }}>
          Eliminate sensory distraction. Enter high-leverage flow states.
        </p>
      </div>

      {/* Mode Selector */}
      <div
        className="flex items-center justify-center p-1.5 rounded-2xl max-w-md mx-auto"
        style={{
          background: 'rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
        }}
      >
        <button
          onClick={() => switchMode('pomodoro')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            mode === 'pomodoro'
              ? 'bg-white text-[#1129e2] shadow-sm'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Pomodoro (25m)
        </button>
        <button
          onClick={() => switchMode('deep_work')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            mode === 'deep_work'
              ? 'bg-white text-[#1129e2] shadow-sm'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Deep Work (50m)
        </button>
        <button
          onClick={() => switchMode('short_break')}
          className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
            mode === 'short_break'
              ? 'bg-white text-[#1129e2] shadow-sm'
              : 'text-white/60 hover:text-white'
          }`}
        >
          Short Rest (5m)
        </button>
      </div>

      {/* Futuristic Circular / Display Timer */}
      <div
        className="rounded-3xl p-12 flex flex-col items-center justify-center space-y-8 relative overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18), 0 24px 64px rgba(0,0,0,0.25)'
        }}
      >
        {/* Ambient background glow when running */}
        {isRunning && (
          <div
            className="absolute inset-0 pointer-events-none animate-pulse"
            style={{ background: 'rgba(255,255,255,0.05)' }}
          />
        )}

        <div className="relative flex items-center justify-center">
          <div
            className="text-7xl sm:text-8xl font-black text-white font-mono tracking-wider drop-shadow-md select-none"
            style={{ letterSpacing: '0.04em' }}
          >
            {timeFormatted}
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-md progress-track h-2">
          <div
            className="progress-fill h-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-6">
          <button
            onClick={resetTimer}
            className="p-3 rounded-2xl transition-colors"
            style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.65)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#fff')}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.65)')}
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={toggleTimer}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm tracking-wide transition-all active:scale-95 flex items-center space-x-2 ${
              isRunning ? 'bg-white/20 text-white' : 'btn-primary'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Initiate Focus</span>
              </>
            )}
          </button>
        </div>

        {/* Session Stats */}
        <div
          className="flex items-center space-x-8 pt-6 text-xs"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.10)',
            color: 'rgba(255,255,255,0.60)'
          }}
        >
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-white" />
            <span>Today's Sessions: <strong className="text-white font-mono">{completedSessions} completed</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-white" />
            <span>XP Rate: <strong className="text-white font-mono">+25 XP / session</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};
