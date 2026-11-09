import React, { useState } from 'react';
import { Zap, Menu, X, ArrowRight, ChevronDown, Rocket, Brain, Target, BarChart3, Flame, Trophy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BG_VIDEO =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260511_230229_7c9bc431-46cf-489a-948d-e8144d8eb5d4.mp4';

interface NavLinkItem {
  label: string;
  active?: boolean;
  dropdown?: boolean;
}

const navLinks: NavLinkItem[] = [
  { label: 'Home', active: true },
  { label: 'Features', dropdown: true },
  { label: 'How It Works' },
  { label: 'About' }
];

const features = [
  { icon: Target, title: 'Mission Control', desc: 'Break ambitions into tactical missions with kanban tracking and subtask precision.' },
  { icon: Flame, title: 'Habit Engine', desc: 'Build streaks, track consistency and compound your daily rituals into identity.' },
  { icon: Brain, title: 'AI Co-Pilot', desc: 'Gemini-powered roadmap generation and monthly synthesis for laser-focused growth.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Life-balance wheel, heatmaps and growth velocity score updated in real-time.' },
  { icon: Trophy, title: 'Achievements', desc: 'Capture wins, log proof links and build a visual archive of your progress.' },
  { icon: Rocket, title: 'Vision Board', desc: 'Pin your north star goals and milestones to keep the long game in view.' },
];

export const LandingPage: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => navigate('/login');
  const handleStart = () => navigate('/dashboard');

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden" style={{ background: '#020917', color: '#ffffff' }}>

      {/* ── Background video + tinted overlay ── */}
      <div className="fixed inset-0 z-0">
        <video
          autoPlay muted loop playsInline
          src={BG_VIDEO}
          className="w-full h-full object-cover opacity-40"
        />
        {/* cyan-tinted gradient overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.18) 0%, rgba(2,9,23,0.60) 40%, rgba(17,41,226,0.30) 100%)'
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 py-5">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={handleStart}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(6,182,212,0.25)', boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.50)' }}
          >
            <Zap size={16} className="text-cyan-400" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            Mission<span className="text-cyan-400">OS</span>
          </span>
        </div>

        {/* Center nav pill */}
        <nav className="liquid-glass hidden md:flex items-center gap-1 rounded-xl px-2 py-2">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => {
                if (link.label === 'About') navigate('/about');
              }}
              className={`flex items-center gap-0.5 px-3 py-1.5 rounded-md text-sm transition-colors ${
                link.active ? 'text-cyan-300 font-semibold' : 'text-white/70 hover:text-white'
              }`}
            >
              <span>{link.label}</span>
              {link.dropdown && <ChevronDown size={13} className="mt-px" />}
            </button>
          ))}
        </nav>

        {/* Right CTAs */}
        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={handleLogin}
            className="liquid-glass text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-white/5 transition-colors"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={handleStart}
            className="text-black text-sm font-semibold px-4 py-2.5 rounded-full transition-all hover:opacity-90 flex items-center gap-1.5"
            style={{ background: 'linear-gradient(135deg, #22d3ee, #06b6d4)' }}
          >
            Get Started
            <ArrowRight size={14} />
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          onClick={() => setMenuOpen(!menuOpen)}
          className="liquid-glass text-white p-2 rounded-lg md:hidden"
        >
          {menuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="relative z-20 mx-4 mt-0 liquid-glass rounded-2xl p-4 flex flex-col gap-1 md:hidden">
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              className="flex items-center justify-between w-full px-4 py-3 rounded-lg text-sm text-white/80 hover:text-white"
            >
              <span>{link.label}</span>
              {link.dropdown && <ChevronDown size={14} />}
            </button>
          ))}
          <div className="flex gap-2 mt-2 pt-3 border-t border-white/10">
            <button onClick={handleLogin} className="flex-1 liquid-glass text-white text-sm font-medium py-2.5 rounded-full text-center">
              Log in
            </button>
            <button
              onClick={handleStart}
              className="flex-1 text-black text-sm font-semibold py-2.5 rounded-full text-center"
              style={{ background: 'linear-gradient(135deg, #22d3ee, #06b6d4)' }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}

      {/* ── Hero Section ── */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-24 pb-20 sm:pt-32 sm:pb-28">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
          style={{
            background: 'rgba(6,182,212,0.15)',
            boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.35)',
            color: '#22d3ee'
          }}
        >
          <Zap size={12} />
          AI-Powered Personal Growth OS
        </div>

        <h1
          className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-none"
          style={{ letterSpacing: '-0.04em', maxWidth: '900px' }}
        >
          Turn Your{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Ambitions
          </span>{' '}
          Into Results
        </h1>

        <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-10 max-w-xl">
          MissionOS is your personal command center — manage missions, build
          habits, track goals and get AI-powered insights to level up every day.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={handleStart}
            className="text-black font-bold px-8 py-3.5 rounded-full text-sm sm:text-base transition-all hover:opacity-90 hover:-translate-y-0.5 flex items-center gap-2 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
              boxShadow: '0 0 40px rgba(6,182,212,0.4)'
            }}
          >
            <Rocket size={16} />
            Launch Your OS
          </button>
          <button
            type="button"
            onClick={handleLogin}
            className="liquid-glass text-white font-medium px-8 py-3.5 rounded-full text-sm sm:text-base transition-all hover:bg-white/8"
          >
            Sign In
          </button>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-14">
          {[
            { val: '13+', label: 'Power Features' },
            { val: 'AI', label: 'Gemini Co-Pilot' },
            { val: '∞', label: 'Growth Potential' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="text-2xl font-black"
                style={{
                  background: 'linear-gradient(135deg, #22d3ee, #818cf8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                {stat.val}
              </div>
              <div className="text-xs text-white/50 mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="relative z-10 px-6 sm:px-10 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl sm:text-4xl font-black mb-3"
              style={{ letterSpacing: '-0.04em' }}
            >
              Everything You Need to{' '}
              <span style={{ color: '#22d3ee' }}>Win</span>
            </h2>
            <p className="text-white/50 text-sm max-w-md mx-auto">
              A complete operating system for high-performance individuals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="glass-card p-6 group cursor-pointer"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: 'rgba(6,182,212,0.15)', boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.30)' }}
                  >
                    <Icon size={18} className="text-cyan-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white mb-2">{f.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA Bottom ── */}
      <section className="relative z-10 px-6 pb-20 text-center">
        <div
          className="max-w-2xl mx-auto rounded-3xl p-10 sm:p-14"
          style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(17,41,226,0.12) 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.25), 0 0 80px rgba(6,182,212,0.08)'
          }}
        >
          <h2
            className="text-3xl sm:text-4xl font-black mb-4"
            style={{ letterSpacing: '-0.04em' }}
          >
            Ready to Operate at Your Best?
          </h2>
          <p className="text-white/55 text-sm mb-8 max-w-md mx-auto">
            Join now and start commanding your growth with military discipline and AI precision.
          </p>
          <button
            type="button"
            onClick={handleStart}
            className="text-black font-bold px-10 py-4 rounded-full text-base transition-all hover:opacity-90 hover:-translate-y-0.5 inline-flex items-center gap-2"
            style={{
              background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
              boxShadow: '0 0 40px rgba(6,182,212,0.35)'
            }}
          >
            <Rocket size={18} />
            Start for Free
          </button>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="relative z-10 text-center py-6 text-xs"
        style={{ color: 'rgba(255,255,255,0.30)', borderTop: '1px solid rgba(255,255,255,0.08)' }}
      >
        © 2026 MissionOS · Your Personal Growth Command Center
      </footer>
    </div>
  );
};
