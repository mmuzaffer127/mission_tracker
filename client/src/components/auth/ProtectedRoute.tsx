import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.js';
import { OnboardingModal } from './OnboardingModal.js';
import { Zap } from 'lucide-react';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading, isDemoMode } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-4 space-y-4"
        style={{ background: '#020917', color: '#ffffff' }}
      >
        <div className="relative">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center animate-pulse"
            style={{
              background: 'rgba(6,182,212,0.2)',
              boxShadow: '0 0 40px rgba(6,182,212,0.4), inset 0 0 0 1px rgba(6,182,212,0.6)'
            }}
          >
            <Zap className="w-8 h-8 text-cyan-400" />
          </div>
          <div className="absolute inset-0 rounded-2xl border-2 border-cyan-400/40 animate-ping pointer-events-none" />
        </div>
        <p className="text-xs uppercase tracking-widest font-mono text-cyan-300">
          Decrypting Mission OS Credentials...
        </p>
      </div>
    );
  }

  if (!user && !isDemoMode) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return (
    <>
      <OnboardingModal />
      {children}
    </>
  );
};

