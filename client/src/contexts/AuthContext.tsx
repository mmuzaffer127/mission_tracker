import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '../lib/supabase.js';
import { UserProfile } from '../types/index.js';

export interface AuthContextType {
  user: UserProfile | null;
  supabaseUser: SupabaseUser | null;
  session: Session | null;
  loading: boolean;
  isDemoMode: boolean;
  needsOnboarding: boolean;
  // Auth methods
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signInWithPhoneOtp: (phone: string) => Promise<{ error: Error | null }>;
  verifyPhoneOtp: (phone: string, token: string) => Promise<{ error: Error | null }>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null; needsEmailVerification?: boolean }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: Error | null }>;
  verifyEmailOtp: (email: string, token: string) => Promise<{ error: Error | null }>;
  resetPasswordForEmail: (email: string) => Promise<{ error: Error | null }>;
  completeOnboarding: (fullName: string) => Promise<{ error: Error | null }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  enableDemoMode: () => void;
}

const DEMO_USER: UserProfile = {
  id: '00000000-0000-0000-0000-000000000001',
  email: 'commander@missionos.dev',
  full_name: 'Commander Alpha',
  level: 'Explorer',
  current_xp: 850,
  timezone: 'UTC',
  auth_provider: 'demo',
  onboarding_completed: true
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  supabaseUser: null,
  session: null,
  loading: true,
  isDemoMode: false,
  needsOnboarding: false,
  signInWithGoogle: async () => ({ error: null }),
  signInWithPhoneOtp: async () => ({ error: null }),
  verifyPhoneOtp: async () => ({ error: null }),
  signUpWithEmail: async () => ({ error: null }),
  signInWithEmail: async () => ({ error: null }),
  verifyEmailOtp: async () => ({ error: null }),
  resetPasswordForEmail: async () => ({ error: null }),
  completeOnboarding: async () => ({ error: null }),
  updateProfile: async () => ({ error: null }),
  logout: async () => {},
  enableDemoMode: () => {}
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [needsOnboarding, setNeedsOnboarding] = useState<boolean>(false);

  // Sync profile data from public.profiles table
  const fetchProfile = useCallback(async (sbUser: SupabaseUser, token?: string) => {
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sbUser.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.warn('[AuthContext] Failed to fetch profile from DB:', error.message);
      }

      if (data) {
        const fullProfile: UserProfile = {
          id: data.id,
          email: data.email || sbUser.email,
          phone: data.phone || sbUser.phone,
          full_name: data.full_name || sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || 'Operative',
          avatar_url: data.avatar_url || sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture,
          auth_provider: data.auth_provider || sbUser.app_metadata?.provider || 'email',
          onboarding_completed: Boolean(data.onboarding_completed),
          level: data.level || 'Explorer',
          current_xp: data.xp || 150,
          timezone: 'UTC'
        };

        const hasName = Boolean(fullProfile.full_name && fullProfile.full_name.trim().length > 0 && fullProfile.full_name !== 'Operative');
        const onboardingDone = Boolean(data.onboarding_completed && hasName);

        setNeedsOnboarding(!onboardingDone);
        setUser(fullProfile);
        return fullProfile;
      } else {
        // Fallback: construct profile from auth metadata
        const metadataName = sbUser.user_metadata?.full_name || sbUser.user_metadata?.name || '';
        const fallbackProfile: UserProfile = {
          id: sbUser.id,
          email: sbUser.email,
          phone: sbUser.phone,
          full_name: metadataName || (sbUser.email ? sbUser.email.split('@')[0] : 'Operative'),
          avatar_url: sbUser.user_metadata?.avatar_url || sbUser.user_metadata?.picture,
          auth_provider: sbUser.app_metadata?.provider || 'email',
          onboarding_completed: Boolean(metadataName),
          level: 'Beginner',
          current_xp: 100,
          timezone: 'UTC'
        };

        // Attempt upsert to public.profiles
        try {
          await supabase.from('profiles').upsert({
            id: sbUser.id,
            email: sbUser.email,
            phone: sbUser.phone,
            full_name: fallbackProfile.full_name,
            avatar_url: fallbackProfile.avatar_url,
            auth_provider: fallbackProfile.auth_provider,
            onboarding_completed: Boolean(metadataName)
          });
        } catch (e) {
          // ignore if table doesn't exist yet
        }

        setNeedsOnboarding(!metadataName);
        setUser(fallbackProfile);
        return fallbackProfile;
      }
    } catch (err) {
      console.error('[AuthContext] Profile resolution error:', err);
      return null;
    }
  }, []);

  // Initialize session and listener
  useEffect(() => {
    let mounted = true;

    const client = supabase;
    if (!isSupabaseConfigured || !client) {
      // If Supabase isn't configured, fall back to demo mode
      setUser(DEMO_USER);
      setIsDemoMode(true);
      setLoading(false);
      return;
    }

    const checkInitialSession = async () => {
      try {
        const { data: { session: initialSession }, error } = await client.auth.getSession();
        if (error) {
          console.error('[AuthContext] Session retrieval error:', error);
        }

        if (initialSession?.user && mounted) {
          setSession(initialSession);
          setSupabaseUser(initialSession.user);
          localStorage.setItem('mission_os_token', initialSession.access_token);
          await fetchProfile(initialSession.user, initialSession.access_token);
          setIsDemoMode(false);
        } else if (mounted) {
          // Check if local token was set in demo mode
          const localDemo = localStorage.getItem('mission_os_demo') === 'true';
          if (localDemo) {
            setUser(DEMO_USER);
            setIsDemoMode(true);
          } else {
            setUser(null);
            setIsDemoMode(false);
          }
        }
      } catch (err) {
        console.error('[AuthContext] Init error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkInitialSession();

    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      if (newSession?.user) {
        setSession(newSession);
        setSupabaseUser(newSession.user);
        localStorage.setItem('mission_os_token', newSession.access_token);
        localStorage.removeItem('mission_os_demo');
        setIsDemoMode(false);
        await fetchProfile(newSession.user, newSession.access_token);
        setLoading(false);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setSupabaseUser(null);
        setUser(null);
        setIsDemoMode(false);
        setNeedsOnboarding(false);
        localStorage.removeItem('mission_os_token');
        localStorage.removeItem('mission_os_demo');
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // A) Google OAuth
  const signInWithGoogle = async () => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'select_account'
          }
        }
      });
      return { error: error || null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // B) Phone OTP: Send 6-digit OTP code to real phone number (E.164)
  const signInWithPhoneOtp = async (phone: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    try {
      const { error } = await supabase.auth.signInWithOtp({
        phone
      });
      return { error: error || null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // B) Phone OTP: Verify 6-digit code
  const verifyPhoneOtp = async (phone: string, token: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token: token.trim(),
        type: 'sms'
      });

      if (error) return { error };

      if (data.session && data.user) {
        setSession(data.session);
        setSupabaseUser(data.user);
        localStorage.setItem('mission_os_token', data.session.access_token);
        await fetchProfile(data.user, data.session.access_token);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // C) Email Sign Up
  const signUpWithEmail = async (email: string, password: string, fullName?: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName || email.split('@')[0]
          }
        }
      });

      if (error) return { error };

      // If user is returned but session is null, email confirmation is required
      const needsEmailVerification = !data.session;
      if (data.session && data.user) {
        setSession(data.session);
        setSupabaseUser(data.user);
        localStorage.setItem('mission_os_token', data.session.access_token);
        await fetchProfile(data.user, data.session.access_token);
      }

      return { error: null, needsEmailVerification };
    } catch (err: any) {
      return { error: err };
    }
  };

  // C) Email Sign In
  const signInWithEmail = async (email: string, password: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) return { error };

      if (data.session && data.user) {
        setSession(data.session);
        setSupabaseUser(data.user);
        localStorage.setItem('mission_os_token', data.session.access_token);
        await fetchProfile(data.user, data.session.access_token);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // C) Verify Email OTP code (from verification email)
  const verifyEmailOtp = async (email: string, token: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token: token.trim(),
        type: 'signup'
      });

      if (error) return { error };

      if (data.session && data.user) {
        setSession(data.session);
        setSupabaseUser(data.user);
        localStorage.setItem('mission_os_token', data.session.access_token);
        await fetchProfile(data.user, data.session.access_token);
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // C) Reset Password
  const resetPasswordForEmail = async (email: string) => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/login`
      });
      return { error: error || null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // Complete onboarding (e.g. for phone sign-up asking name)
  const completeOnboarding = async (fullName: string) => {
    if (!supabase || !supabaseUser) {
      if (user) {
        setUser({ ...user, full_name: fullName, onboarding_completed: true });
        setNeedsOnboarding(false);
      }
      return { error: null };
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: supabaseUser.id,
          full_name: fullName.trim(),
          onboarding_completed: true,
          updated_at: new Date().toISOString()
        });

      if (error) return { error };

      // Update user metadata in Supabase Auth
      await supabase.auth.updateUser({
        data: { full_name: fullName.trim() }
      });

      if (user) {
        setUser({
          ...user,
          full_name: fullName.trim(),
          onboarding_completed: true
        });
      }

      setNeedsOnboarding(false);
      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // Update profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!supabase || !supabaseUser) return { error: null };
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', supabaseUser.id);

      if (error) return { error };

      if (user) {
        setUser({ ...user, ...updates });
      }

      return { error: null };
    } catch (err: any) {
      return { error: err };
    }
  };

  // Logout
  const logout = async () => {
    if (supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.error('[AuthContext] SignOut error:', err);
      }
    }
    localStorage.removeItem('mission_os_token');
    localStorage.removeItem('mission_os_demo');
    setSession(null);
    setSupabaseUser(null);
    setUser(null);
    setIsDemoMode(false);
    setNeedsOnboarding(false);
  };

  // Enable demo mode bypass
  const enableDemoMode = () => {
    localStorage.setItem('mission_os_demo', 'true');
    setUser(DEMO_USER);
    setIsDemoMode(true);
    setNeedsOnboarding(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        supabaseUser,
        session,
        loading,
        isDemoMode,
        needsOnboarding,
        signInWithGoogle,
        signInWithPhoneOtp,
        verifyPhoneOtp,
        signUpWithEmail,
        signInWithEmail,
        verifyEmailOtp,
        resetPasswordForEmail,
        completeOnboarding,
        updateProfile,
        logout,
        enableDemoMode
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
