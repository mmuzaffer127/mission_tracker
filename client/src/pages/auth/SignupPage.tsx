import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase.js';

export const SignupPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured || !supabase) {
      navigate('/dashboard');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }
        }
      });
      if (authError) throw authError;
      if (data.session) {
        localStorage.setItem('mission_os_token', data.session.access_token);
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-surface-border shadow-card space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-emerald to-brand-cyan flex items-center justify-center font-bold text-xl text-black shadow-glow mx-auto mb-3">
            M
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">Register Operative</h1>
          <p className="text-xs text-gray-400">Initialize your personal growth operating system</p>
        </div>

        {error && (
          <div className="p-3 text-xs rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Operative Name</label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Alex Mercer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 border border-surface-border text-white text-xs focus:outline-none focus:border-brand-emerald"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 border border-surface-border text-white text-xs focus:outline-none focus:border-brand-emerald"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Passphrase</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-surface-50 border border-surface-border text-white text-xs focus:outline-none focus:border-brand-emerald"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-emerald to-teal-500 text-black text-xs font-bold shadow-glow hover:brightness-110 active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
          >
            <span>{loading ? 'Initializing...' : 'Initialize Operating System'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 pt-2 border-t border-surface-border">
          <span>Already have an account? </span>
          <Link to="/login" className="text-brand-cyan hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};
