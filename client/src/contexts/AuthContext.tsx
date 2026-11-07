import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';

interface User {
  id: string;
  email: string;
  full_name: string;
  level: string;
  xp: number;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  isDemoMode: boolean;
}

const DEMO_USER: User = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'commander@missionos.dev',
  full_name: 'Commander Alpha',
  level: 'Explorer',
  xp: 850
};

const AuthContext = createContext<AuthContextType>({
  user: DEMO_USER,
  loading: false,
  logout: async () => {},
  isDemoMode: true
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(DEMO_USER);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(!isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setUser(DEMO_USER);
      setIsDemoMode(true);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || 'Commander',
          level: 'Beginner',
          xp: 100
        });
        localStorage.setItem('mission_os_token', session.access_token);
      } else {
        setUser(DEMO_USER);
        setIsDemoMode(true);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          full_name: session.user.user_metadata?.full_name || 'Commander',
          level: 'Beginner',
          xp: 100
        });
        localStorage.setItem('mission_os_token', session.access_token);
        setIsDemoMode(false);
      } else {
        setUser(DEMO_USER);
        setIsDemoMode(true);
        localStorage.removeItem('mission_os_token');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('mission_os_token');
    setUser(DEMO_USER);
    setIsDemoMode(true);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, isDemoMode }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
