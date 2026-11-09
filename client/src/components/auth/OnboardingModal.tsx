import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.js';
import { Shield, ArrowRight, Sparkles } from 'lucide-react';
import { useSound } from '../../contexts/SoundContext.js';

export const OnboardingModal: React.FC = () => {
  const { user, needsOnboarding, completeOnboarding } = useAuth();
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { playComplete, playClick } = useSound();

  if (!needsOnboarding || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide your name or call-sign.');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      playClick();
      const { error: err } = await completeOnboarding(name.trim());
      if (err) throw err;
      playComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to complete profile onboarding.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        className="w-full max-w-md p-6 sm:p-8 rounded-3xl space-y-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(17,41,226,0.35) 0%, rgba(2,9,23,0.90) 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.35), 0 24px 64px rgba(0,0,0,0.6)',
          color: '#ffffff'
        }}
      >
        {/* Glow orb */}
        <div
          className="absolute -top-20 -right-20 w-44 h-44 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)' }}
        />

        <div className="text-center space-y-3 relative z-10">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto"
            style={{
              background: 'rgba(6,182,212,0.18)',
              boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.45)'
            }}
          >
            <Shield className="w-7 h-7 text-cyan-400" />
          </div>

          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
            style={{
              background: 'rgba(6,182,212,0.15)',
              color: '#22d3ee',
              boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.3)'
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Profile Initialization</span>
          </div>

          <h2 className="text-2xl font-black text-white tracking-tight">
            Designate Your Operative Name
          </h2>

          <p className="text-xs text-white/60 leading-relaxed max-w-xs mx-auto">
            Welcome to Mission OS. Before deploying to your command center, establish your Commander Call-sign.
          </p>
        </div>

        {error && (
          <div
            className="p-3 text-xs rounded-xl"
            style={{
              background: 'rgba(239, 68, 68, 0.2)',
              boxShadow: 'inset 0 0 0 1px rgba(239, 68, 68, 0.4)',
              color: '#ffffff'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          <div>
            <label className="glass-label">Full Name or Call-Sign *</label>
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Commander Sarah Vance"
              className="glass-input text-sm py-3"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 rounded-xl font-bold text-sm text-black transition-all hover:opacity-90 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
              boxShadow: '0 0 25px rgba(6,182,212,0.3)'
            }}
          >
            <span>{submitting ? 'Initializing Command HQ...' : 'Initialize Mission OS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

