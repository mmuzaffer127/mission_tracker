import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase.js';
import { Zap, AlertCircle } from 'lucide-react';

export const AuthCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: any;

    const processAuth = async () => {
      if (!supabase) {
        navigate('/login', { replace: true });
        return;
      }

      try {
        // Exchange auth code or hash if present
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error('[Auth Callback] Session retrieval error:', error);
          setErrorMsg(error.message);
          return;
        }

        if (session) {
          localStorage.setItem('mission_os_token', session.access_token);
          // Redirect to dashboard
          timeoutId = setTimeout(() => {
            navigate('/dashboard', { replace: true });
          }, 600);
        } else {
          // Listen once for auth state change
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
            if (newSession) {
              localStorage.setItem('mission_os_token', newSession.access_token);
              subscription.unsubscribe();
              navigate('/dashboard', { replace: true });
            }
          });

          // Fallback timeout
          timeoutId = setTimeout(() => {
            subscription.unsubscribe();
            navigate('/dashboard', { replace: true });
          }, 2500);
        }
      } catch (err: any) {
        console.error('[Auth Callback] Unexpected error:', err);
        setErrorMsg(err.message || 'Authentication exchange failed.');
      }
    };

    processAuth();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [navigate]);

  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#020917] text-white">
        <div className="glass-card p-8 max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
            <AlertCircle size={28} />
          </div>
          <h2 className="text-xl font-bold">Authentication Error</h2>
          <p className="text-xs text-white/60">{errorMsg}</p>
          <button
            onClick={() => navigate('/login', { replace: true })}
            className="btn-primary w-full text-xs"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-4 space-y-5"
      style={{ background: '#020917', color: '#ffffff' }}
    >
      <div className="relative">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center animate-bounce"
          style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.25), rgba(17,41,226,0.35))',
            boxShadow: '0 0 50px rgba(6,182,212,0.4), inset 0 0 0 1px rgba(6,182,212,0.6)'
          }}
        >
          <Zap className="w-8 h-8 text-cyan-400" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/40 animate-ping pointer-events-none" />
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-lg font-black tracking-tight text-white">
          Securing Command Link
        </h2>
        <p className="text-xs text-cyan-300 font-mono tracking-wider">
          Validating Google credentials & synchronizing operative profile...
        </p>
      </div>
    </div>
  );
};

