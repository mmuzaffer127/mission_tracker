import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  Phone,
  Mail,
  Shield,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  Lock,
  User,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';
import { useSound } from '../../contexts/SoundContext.js';

type AuthTab = 'google' | 'phone' | 'email';
type EmailMode = 'login' | 'signup' | 'forgot' | 'verify_email';

const COUNTRY_CODES = [
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+1', country: 'United States / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+971', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+966', country: 'Saudi Arabia', flag: '🇸🇦' }
];

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    user,
    signInWithGoogle,
    signInWithPhoneOtp,
    verifyPhoneOtp,
    signInWithEmail,
    signUpWithEmail,
    verifyEmailOtp,
    resetPasswordForEmail,
    enableDemoMode
  } = useAuth();
  const { playClick, playComplete } = useSound();

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const [activeTab, setActiveTab] = useState<AuthTab>('google');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Phone OTP States
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneRaw, setPhoneRaw] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneOtp, setPhoneOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Email States
  const [emailMode, setEmailMode] = useState<EmailMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailOtp, setEmailOtp] = useState(['', '', '', '', '', '']);
  const emailOtpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // 30s Countdown timer for resend
  useEffect(() => {
    let interval: any;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendTimer]);

  // Clean errors when switching tabs
  const handleTabChange = (tab: AuthTab) => {
    playClick();
    setActiveTab(tab);
    setError(null);
    setSuccessMsg(null);
  };

  // -------------------------------------------------------------
  // A) Google OAuth
  // -------------------------------------------------------------
  const handleGoogleSignIn = async () => {
    playClick();
    setLoading(true);
    setError(null);
    const { error: err } = await signInWithGoogle();
    if (err) {
      setError(err.message || 'Google authentication failed.');
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // B) Phone OTP Logic
  // -------------------------------------------------------------
  const getE164Phone = () => {
    const cleaned = phoneRaw.replace(/\D/g, '');
    return `${countryCode}${cleaned}`;
  };

  const handleSendPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleaned = phoneRaw.replace(/\D/g, '');
    if (cleaned.length < 7) {
      setError('Please enter a valid phone number.');
      return;
    }

    const fullPhone = getE164Phone();
    playClick();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const { error: err } = await signInWithPhoneOtp(fullPhone);
    setLoading(false);

    if (err) {
      setError(err.message || 'Failed to dispatch verification code. Please check number or SMS configuration.');
    } else {
      setPhoneOtpSent(true);
      setResendTimer(30);
      setSuccessMsg(`6-digit code dispatched to ${fullPhone}`);
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }
  };

  const handleVerifyPhoneOtp = async (codeString?: string) => {
    const token = codeString || phoneOtp.join('');
    if (token.length !== 6) {
      setError('Please enter all 6 digits.');
      return;
    }

    const fullPhone = getE164Phone();
    playClick();
    setLoading(true);
    setError(null);

    const { error: err } = await verifyPhoneOtp(fullPhone, token);
    setLoading(false);

    if (err) {
      setError(err.message || 'Invalid or expired SMS token. Please try again.');
    } else {
      playComplete();
      navigate('/dashboard');
    }
  };

  // Phone OTP inputs auto-advance & paste handler
  const handleOtpBoxChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const next = [...phoneOtp];
    next[index] = value.slice(-1);
    setPhoneOtp(next);

    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== '')) {
      handleVerifyPhoneOtp(next.join(''));
    }
  };

  const handleOtpBoxKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !phoneOtp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;

    const next = [...phoneOtp];
    for (let i = 0; i < 6; i++) {
      next[i] = pasted[i] || '';
    }
    setPhoneOtp(next);

    const targetIndex = Math.min(pasted.length, 5);
    otpInputRefs.current[targetIndex]?.focus();

    if (pasted.length === 6) {
      handleVerifyPhoneOtp(pasted);
    }
  };

  // -------------------------------------------------------------
  // C) Email Logic
  // -------------------------------------------------------------
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }

    if (emailMode === 'forgot') {
      playClick();
      setLoading(true);
      const { error: err } = await resetPasswordForEmail(email.trim());
      setLoading(false);
      if (err) {
        setError(err.message || 'Failed to dispatch password recovery link.');
      } else {
        setSuccessMsg('Password recovery instructions dispatched to your inbox.');
      }
      return;
    }

    if (password.length < 8) {
      setError('Security policy requires at least 8 characters for passphrases.');
      return;
    }

    playClick();
    setLoading(true);

    if (emailMode === 'signup') {
      const { error: err, needsEmailVerification } = await signUpWithEmail(
        email.trim(),
        password,
        fullName.trim()
      );
      setLoading(false);

      if (err) {
        setError(err.message || 'Account registration failed.');
      } else if (needsEmailVerification) {
        setEmailMode('verify_email');
        setResendTimer(30);
        setSuccessMsg(`Verification token sent to ${email.trim()}. Enter the 6-digit code below.`);
      } else {
        playComplete();
        navigate('/dashboard');
      }
    } else {
      // Login
      const { error: err } = await signInWithEmail(email.trim(), password);
      setLoading(false);

      if (err) {
        setError(err.message || 'Invalid credentials or unverified account.');
      } else {
        playComplete();
        navigate('/dashboard');
      }
    }
  };

  const handleVerifyEmailOtp = async (codeString?: string) => {
    const token = codeString || emailOtp.join('');
    if (token.length !== 6) {
      setError('Please enter all 6 digits of the confirmation code.');
      return;
    }

    playClick();
    setLoading(true);
    setError(null);

    const { error: err } = await verifyEmailOtp(email.trim(), token);
    setLoading(false);

    if (err) {
      setError(err.message || 'Invalid verification code. Please check your inbox or resend.');
    } else {
      playComplete();
      navigate('/dashboard');
    }
  };

  const handleEmailOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...emailOtp];
    next[index] = val.slice(-1);
    setEmailOtp(next);

    if (val && index < 5) {
      emailOtpRefs.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== '')) {
      handleVerifyEmailOtp(next.join(''));
    }
  };

  // Demo bypass
  const handleDemoAccess = () => {
    playClick();
    enableDemoMode();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex w-full relative overflow-hidden" style={{ background: '#020917', color: '#ffffff' }}>
      {/* Background orbs */}
      <div
        className="fixed top-0 left-1/4 w-[600px] h-[600px] rounded-full pointer-events-none filter blur-[120px] opacity-25"
        style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
      />
      <div
        className="fixed bottom-0 right-10 w-[500px] h-[500px] rounded-full pointer-events-none filter blur-[120px] opacity-20"
        style={{ background: 'radial-gradient(circle, #1129e2 0%, transparent 70%)' }}
      />

      {/* ── LEFT PANEL: Brand Immersion (desktop only) ── */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 lg:p-16 relative z-10 border-r border-white/10">
        <div className="space-y-6">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-2 select-none group">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{
                background: 'rgba(6,182,212,0.2)',
                boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.5), 0 0 30px rgba(6,182,212,0.3)'
              }}
            >
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight">
              Mission<span className="text-cyan-400">OS</span>
            </span>
          </Link>

          <div className="space-y-4 pt-8">
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: 'rgba(6,182,212,0.12)',
                boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.3)',
                color: '#22d3ee'
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Identity & Access Command</span>
            </div>

            <h1 className="text-4xl xl:text-5xl font-black leading-tight tracking-tight text-white">
              Operate at Your <br />
              <span
                style={{
                  background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #818cf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                Highest Potential.
              </span>
            </h1>

            <p className="text-sm text-white/60 max-w-md leading-relaxed">
              Log into your encrypted personal growth operating system. Execute tactical missions, build unbreakable daily streaks, and consult your Gemini AI Co-Pilot.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-2 gap-3 pt-6 max-w-md">
            {[
              { title: 'Google Identity', desc: 'Single-click Gmail authentication' },
              { title: 'Phone OTP', desc: 'Fast E.164 SMS verification' },
              { title: 'Tactical HQ', desc: 'Kanban missions & master goals' },
              { title: 'AI Synthesis', desc: 'Gemini-powered roadmap engine' }
            ].map((f) => (
              <div
                key={f.title}
                className="p-3.5 rounded-xl transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)'
                }}
              >
                <div className="flex items-center gap-1.5 text-cyan-300 text-xs font-bold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{f.title}</span>
                </div>
                <p className="text-[11px] text-white/50">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Quote & About Link */}
        <div className="pt-8 border-t border-white/10 flex items-center justify-between">
          <p className="text-xs text-white/40 italic">
            "You do not rise to the level of your goals. You fall to the level of your systems."
          </p>
          <Link
            to="/about"
            className="text-xs text-cyan-400 font-semibold hover:underline flex items-center gap-1 ml-4 flex-shrink-0"
          >
            <span>Explore About</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── RIGHT PANEL: Interactive Auth Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 relative z-10 overflow-y-auto max-h-screen">
        <div className="w-full max-w-md space-y-6 my-auto">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <Link to="/" className="inline-flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'rgba(6,182,212,0.2)', boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.5)' }}
              >
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-xl font-black text-white">Mission<span className="text-cyan-400">OS</span></span>
            </Link>
            <Link to="/about" className="text-xs text-cyan-400 font-medium hover:underline">
              About
            </Link>
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Command Authentication
            </h2>
            <p className="text-xs text-white/55">
              Select your preferred authentication method to enter Mission OS.
            </p>
          </div>

          {/* ── Animated Method Tabs ── */}
          <div
            className="flex p-1 rounded-2xl relative"
            style={{
              background: 'rgba(255,255,255,0.06)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
            }}
          >
            {[
              { id: 'google', label: 'Google (Gmail)', icon: 'G' },
              { id: 'phone', label: 'Phone OTP', icon: Phone },
              { id: 'email', label: 'Email Pass', icon: Mail }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              const IconComponent = typeof tab.icon !== 'string' ? tab.icon : null;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleTabChange(tab.id as AuthTab)}
                  className={`relative flex-1 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all z-10 ${
                    isActive ? 'text-black' : 'text-white/65 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBadge"
                      className="absolute inset-0 rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
                        boxShadow: '0 0 20px rgba(6,182,212,0.4)'
                      }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {tab.icon === 'G' ? (
                      <span className="font-black text-xs">G</span>
                    ) : IconComponent ? (
                      <IconComponent className="w-3.5 h-3.5" />
                    ) : null}
                    <span>{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Alert Messages */}
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3.5 rounded-xl text-xs flex items-start gap-2.5"
                style={{
                  background: 'rgba(239,68,68,0.18)',
                  boxShadow: 'inset 0 0 0 1px rgba(239,68,68,0.4)',
                  color: '#fca5a5'
                }}
              >
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="p-3.5 rounded-xl text-xs flex items-start gap-2.5"
                style={{
                  background: 'rgba(16,185,129,0.18)',
                  boxShadow: 'inset 0 0 0 1px rgba(16,185,129,0.4)',
                  color: '#6ee7b7'
                }}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── TAB CONTENT ── */}
          <div
            className="rounded-3xl p-6 sm:p-7 space-y-5"
            style={{
              background: 'rgba(255,255,255,0.05)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14), 0 20px 50px rgba(0,0,0,0.4)',
              backdropFilter: 'blur(24px)'
            }}
          >
            {/* 1) GOOGLE TAB */}
            {activeTab === 'google' && (
              <motion.div
                key="google-tab"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-5 text-center"
              >
                <div className="space-y-2">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
                    style={{
                      background: 'rgba(255,255,255,0.08)',
                      boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)'
                    }}
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-white">Google OAuth 2.0</h3>
                  <p className="text-xs text-white/60 max-w-xs mx-auto">
                    Sign in with your Google / Gmail account. Your email and name are synchronized automatically.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3.5 rounded-2xl font-bold text-sm bg-white text-black transition-all hover:bg-white/90 flex items-center justify-center gap-3 shadow-lg disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>{loading ? 'Connecting to Google...' : 'Continue with Google'}</span>
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] text-white/40 pt-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>Secure OAuth 2.0 token exchange with PKCE</span>
                </div>
              </motion.div>
            )}

            {/* 2) PHONE OTP TAB */}
            {activeTab === 'phone' && (
              <motion.div
                key="phone-tab"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {!phoneOtpSent ? (
                  <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                    <div>
                      <label className="glass-label">Country Code</label>
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="glass-select text-xs py-2.5"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option key={c.code} value={c.code}>
                            {c.flag} {c.country} ({c.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="glass-label">Mobile Phone Number (E.164)</label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-xs font-mono text-cyan-300">
                          {countryCode}
                        </span>
                        <input
                          type="tel"
                          required
                          autoFocus
                          value={phoneRaw}
                          onChange={(e) => setPhoneRaw(e.target.value)}
                          placeholder="98765 43210"
                          className="glass-input pl-16 py-2.5 text-sm font-mono"
                        />
                      </div>
                      <p className="text-[11px] text-white/40 mt-1">
                        A real 6-digit SMS verification code will be dispatched.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl font-bold text-xs text-black transition-all hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, #22d3ee, #06b6d4)' }}
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{loading ? 'Dispatching SMS...' : 'Dispatch Verification Code'}</span>
                    </button>
                  </form>
                ) : (
                  /* Phone OTP Code verification */
                  <div className="space-y-5">
                    <div className="text-center space-y-1">
                      <p className="text-xs text-white/60">Enter the 6-digit code dispatched to</p>
                      <p className="text-sm font-mono font-bold text-cyan-300">{getE164Phone()}</p>
                    </div>

                    {/* 6-box input */}
                    <div className="flex items-center justify-center gap-2" onPaste={handleOtpPaste}>
                      {phoneOtp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (otpInputRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpBoxKeyDown(idx, e)}
                          className="w-11 h-12 text-center text-lg font-bold font-mono rounded-xl text-white transition-all focus:outline-none"
                          style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: digit ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.2)',
                            boxShadow: digit ? '0 0 15px rgba(6,182,212,0.3)' : 'none'
                          }}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={loading || phoneOtp.some((d) => d === '')}
                      onClick={() => handleVerifyPhoneOtp()}
                      className="w-full py-3 rounded-xl font-bold text-xs text-black transition-all hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg, #22d3ee, #06b6d4)' }}
                    >
                      <span>{loading ? 'Verifying...' : 'Authenticate & Enter HQ'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center justify-between text-xs pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPhoneOtpSent(false);
                          setPhoneOtp(['', '', '', '', '', '']);
                          setError(null);
                        }}
                        className="text-white/60 hover:text-white flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3 h-3" />
                        <span>Edit number</span>
                      </button>

                      {resendTimer > 0 ? (
                        <span className="text-white/40 font-mono">Resend in {resendTimer}s</span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleSendPhoneOtp(e as any)}
                          className="text-cyan-400 font-semibold hover:underline flex items-center gap-1"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Resend OTP</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* 3) EMAIL TAB */}
            {activeTab === 'email' && (
              <motion.div
                key="email-tab"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                {emailMode === 'verify_email' ? (
                  /* Email verification OTP screen */
                  <div className="space-y-4 text-center">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white">Verify Your Inbox</h4>
                      <p className="text-xs text-white/60">
                        Enter the 6-digit confirmation token sent to <strong className="text-white">{email}</strong>
                      </p>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      {emailOtp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => (emailOtpRefs.current[idx] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleEmailOtpChange(idx, e.target.value)}
                          className="w-11 h-12 text-center text-lg font-bold font-mono rounded-xl text-white transition-all focus:outline-none"
                          style={{
                            background: 'rgba(255,255,255,0.08)',
                            border: digit ? '1px solid #22d3ee' : '1px solid rgba(255,255,255,0.2)'
                          }}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      disabled={loading || emailOtp.some((d) => d === '')}
                      onClick={() => handleVerifyEmailOtp()}
                      className="w-full py-3 rounded-xl font-bold text-xs text-black transition-all hover:opacity-90 disabled:opacity-40"
                      style={{ background: 'linear-gradient(135deg, #22d3ee, #06b6d4)' }}
                    >
                      {loading ? 'Verifying Token...' : 'Confirm Email & Enter OS'}
                    </button>

                    <button
                      type="button"
                      onClick={() => setEmailMode('login')}
                      className="text-xs text-white/50 hover:text-white"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleEmailAuth} className="space-y-3.5">
                    {emailMode === 'signup' && (
                      <div>
                        <label className="glass-label">Operative Full Name *</label>
                        <div className="relative">
                          <User className="w-4 h-4 absolute left-3 top-2.5 text-white/40" />
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Elena Rostova"
                            className="glass-input pl-9 text-xs py-2.5"
                          />
                        </div>
                      </div>
                    )}

                    <div>
                      <label className="glass-label">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 absolute left-3 top-2.5 text-white/40" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="commander@missionos.dev"
                          className="glass-input pl-9 text-xs py-2.5"
                        />
                      </div>
                    </div>

                    {emailMode !== 'forgot' && (
                      <div>
                        <div className="flex items-center justify-between">
                          <label className="glass-label mb-0">Passphrase *</label>
                          {emailMode === 'login' && (
                            <button
                              type="button"
                              onClick={() => setEmailMode('forgot')}
                              className="text-[11px] text-cyan-300 hover:underline"
                            >
                              Forgot passphrase?
                            </button>
                          )}
                        </div>
                        <div className="relative mt-1">
                          <Lock className="w-4 h-4 absolute left-3 top-2.5 text-white/40" />
                          <input
                            type={showPassword ? 'text' : 'password'}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Min. 8 characters"
                            className="glass-input pl-9 pr-9 text-xs py-2.5"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-white/40 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 rounded-xl font-bold text-xs text-black transition-all hover:opacity-90 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                      style={{ background: 'linear-gradient(135deg, #22d3ee, #06b6d4)' }}
                    >
                      <span>
                        {loading
                          ? 'Executing Request...'
                          : emailMode === 'signup'
                          ? 'Create Account'
                          : emailMode === 'forgot'
                          ? 'Dispatch Recovery Link'
                          : 'Authenticate with Passphrase'}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {/* Mode switcher */}
                    <div className="text-center pt-2 text-xs text-white/60">
                      {emailMode === 'login' ? (
                        <span>
                          Don't have an operative account?{' '}
                          <button
                            type="button"
                            onClick={() => setEmailMode('signup')}
                            className="text-cyan-300 font-semibold hover:underline"
                          >
                            Sign up now
                          </button>
                        </span>
                      ) : (
                        <span>
                          Already registered?{' '}
                          <button
                            type="button"
                            onClick={() => setEmailMode('login')}
                            className="text-cyan-300 font-semibold hover:underline"
                          >
                            Log into account
                          </button>
                        </span>
                      )}
                    </div>
                  </form>
                )}
              </motion.div>
            )}
          </div>

          {/* ── Guest Demo Sandbox Bypass ── */}
          <div className="pt-2 text-center space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[11px] uppercase tracking-wider text-white/40 font-mono">or preview</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button
              type="button"
              onClick={handleDemoAccess}
              className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all hover:bg-white/10 text-white/70 hover:text-white"
              style={{
                background: 'rgba(255,255,255,0.04)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
              }}
            >
              Continue in Guest Sandbox Mode →
            </button>
          </div>

          {/* Footer links */}
          <div className="text-center text-xs text-white/40 pt-2 space-x-3">
            <Link to="/about" className="hover:text-cyan-300 underline">
              About Mission OS
            </Link>
            <span>·</span>
            <Link to="/" className="hover:text-cyan-300 underline">
              Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
