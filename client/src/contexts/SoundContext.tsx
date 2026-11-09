import React, { createContext, useContext, useState } from 'react';

interface SoundContextType {
  soundEnabled: boolean;
  toggleSound: () => void;
  playSuccess: () => void;
  playComplete: () => void;
  playClick: () => void;
}

const SoundContext = createContext<SoundContextType>({
  soundEnabled: true,
  toggleSound: () => {},
  playSuccess: () => {},
  playComplete: () => {},
  playClick: () => {}
});

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const playTone = (freq: number, type: OscillatorType = 'sine', duration = 0.15, gainVal = 0.1) => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext might be blocked before first user interaction
    }
  };

  const playClick = () => playTone(600, 'sine', 0.05, 0.05);

  const playComplete = () => {
    playTone(523.25, 'triangle', 0.1, 0.1); // C5
    setTimeout(() => playTone(659.25, 'triangle', 0.15, 0.12), 80); // E5
    setTimeout(() => playTone(783.99, 'triangle', 0.25, 0.15), 160); // G5
  };

  const playSuccess = () => {
    playTone(440, 'sine', 0.1, 0.08);
    setTimeout(() => playTone(880, 'sine', 0.2, 0.12), 90);
  };

  return (
    <SoundContext.Provider value={{ soundEnabled, toggleSound: () => setSoundEnabled(!soundEnabled), playSuccess, playComplete, playClick }}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => useContext(SoundContext);

