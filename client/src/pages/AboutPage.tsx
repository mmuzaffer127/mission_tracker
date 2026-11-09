import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Zap,
  Target,
  Compass,
  Flame,
  Trophy,
  BookOpen,
  BarChart3,
  Award,
  Brain,
  ArrowRight,
  CheckCircle2,
  Users,
  ShieldCheck,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext.js';

export const AboutPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCta = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  const featureCards = [
    {
      icon: Target,
      tag: 'Execution',
      title: 'Tactical Missions HQ',
      desc: 'Break large-scale ambitions into granular missions with Kanban boards, subtasks, deadlines, and real-time execution tracking.'
    },
    {
      icon: Compass,
      tag: 'Vision',
      title: 'Master Goal Architecture',
      desc: 'Define quarterly milestones and 3-5 year North Stars. Link high-level visions directly to daily tactical operations.'
    },
    {
      icon: Flame,
      tag: 'Systems',
      title: 'Habit Mastery Engine',
      desc: 'Track consistency heatmaps, build compounding streaks, and transform repetitive daily actions into core identity.'
    },
    {
      icon: Trophy,
      tag: 'Archive',
      title: 'Monthly Achievement Tracker',
      desc: 'Document monthly wins, store external proof links, and maintain an unshakeable digital record of your tangible victories.'
    },
    {
      icon: BookOpen,
      tag: 'Clarity',
      title: 'Mental Calibration Journal',
      desc: 'Morning mindset priming and evening debriefs to sharpen focus, release cognitive friction, and review key lessons.'
    },
    {
      icon: BarChart3,
      tag: 'Metrics',
      title: 'Life Balance & Analytics',
      desc: 'Interactive 8-domain balance wheels, velocity heatmaps, and empirical metrics showing where your energy actually goes.'
    },
    {
      icon: Award,
      tag: 'Gamification',
      title: 'RPG Leveling & Growth Score',
      desc: 'Gain real XP for completing missions and habits. Progress from Explorer to Vanguard and Commander as you compound.'
    },
    {
      icon: Brain,
      tag: 'Intelligence',
      title: 'Gemini AI Growth Co-Pilot',
      desc: 'Harness Google Gemini 2.5 to turn vague ambitions into structured execution roadmaps and monthly retrospective syntheses.'
    }
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Architect Your Horizons',
      desc: 'Define annual North Star visions and break them into sequential quarterly milestones.'
    },
    {
      step: '02',
      title: 'Execute Tactical Missions',
      desc: 'Deploy daily missions, check off subtasks, and lock in compounding habit streaks.'
    },
    {
      step: '03',
      title: 'Synthesize with AI Intelligence',
      desc: 'Review empirical analytics, generate Gemini AI monthly debriefs, and optimize your systems.'
    }
  ];

  const targetAudiences = [
    {
      title: 'Engineers & Tech Builders',
      desc: 'Architect projects with modular discipline, commit to daily coding focus blocks, and eliminate cognitive overwhelm.'
    },
    {
      title: 'Founders & Solopreneurs',
      desc: 'Balance product, distribution, and operational targets with a clean Kanban command center.'
    },
    {
      title: 'High-Output Creators',
      desc: 'Protect creative energy, track deep work rituals, and turn chaotic ideas into finished milestones.'
    },
    {
      title: 'Relentless Self-Improvers',
      desc: 'Anyone dedicated to compounding 1% improvements every day across physical, mental, and professional planes.'
    }
  ];

  return (
    <div
      className="min-h-screen text-white relative overflow-x-hidden selection:bg-cyan-500/30"
      style={{ background: '#020917' }}
    >
      {/* Background radial ambient lights */}
      <div
        className="fixed top-0 left-1/3 w-[800px] h-[800px] rounded-full pointer-events-none filter blur-[140px] opacity-20"
        style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)' }}
      />
      <div
        className="fixed bottom-0 right-10 w-[600px] h-[600px] rounded-full pointer-events-none filter blur-[140px] opacity-15"
        style={{ background: 'radial-gradient(circle, #1129e2 0%, transparent 70%)' }}
      />

      {/* ── Top Navigation ── */}
      <header className="sticky top-0 z-40 px-6 sm:px-12 py-4 liquid-glass border-b border-white/10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 select-none group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
            style={{
              background: 'rgba(6,182,212,0.25)',
              boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.5)'
            }}
          >
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Mission<span className="text-cyan-400">OS</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm">
          <Link to="/" className="text-white/70 hover:text-white transition-colors hidden sm:inline-block">
            Home
          </Link>
          <Link to="/about" className="text-cyan-300 font-semibold border-b border-cyan-400 pb-0.5">
            About
          </Link>
          {user ? (
            <Link
              to="/dashboard"
              className="text-black font-semibold text-xs sm:text-sm px-4 py-2 rounded-full transition-all hover:opacity-90 flex items-center gap-1.5"
              style={{ background: 'linear-gradient(135deg, #22d3ee, #06b6d4)' }}
            >
              <span>Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-white/80 hover:text-white text-xs sm:text-sm font-medium">
                Log In
              </Link>
              <Link
                to="/login"
                className="text-black font-semibold text-xs sm:text-sm px-4 py-2 rounded-full transition-all hover:opacity-90 flex items-center gap-1.5"
                style={{ background: 'linear-gradient(135deg, #22d3ee, #06b6d4)' }}
              >
                <span>Deploy OS</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative z-10 px-6 sm:px-12 pt-20 pb-16 max-w-5xl mx-auto text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold"
          style={{
            background: 'rgba(6,182,212,0.12)',
            boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.3)',
            color: '#22d3ee'
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Operating System for High-Performing Humans</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl font-black leading-tight tracking-tight"
        >
          What is{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #818cf8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}
          >
            Mission OS?
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-base sm:text-lg text-white/65 max-w-2xl mx-auto leading-relaxed"
        >
          Mission OS is an AI-augmented personal operating system designed to bridge the gap between grand ambitions and tactical daily execution. Inspired by military discipline and compounding systems, it transforms chaotic to-do lists into an organized, gamified command headquarters.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
        >
          <button
            onClick={handleCta}
            className="text-black font-bold px-8 py-3.5 rounded-full text-sm sm:text-base transition-all hover:opacity-90 hover:-translate-y-0.5 flex items-center gap-2 shadow-lg"
            style={{
              background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
              boxShadow: '0 0 35px rgba(6,182,212,0.35)'
            }}
          >
            <span>{user ? 'Enter Command Center' : 'Get Started with Mission OS'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="#features"
            className="liquid-glass text-white font-medium px-6 py-3.5 rounded-full text-sm sm:text-base hover:bg-white/10 transition-colors"
          >
            Explore Core Engines
          </a>
        </motion.div>
      </section>

      {/* ── WHAT THE PLATFORM DOES ── */}
      <section className="relative z-10 px-6 sm:px-12 py-16 max-w-5xl mx-auto">
        <div
          className="rounded-3xl p-8 sm:p-12 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(17,41,226,0.2) 0%, rgba(6,182,212,0.08) 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.25), 0 20px 60px rgba(0,0,0,0.5)'
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-300">
                Core Philosophy
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Stop Managing Tasks. Start Commanding Missions.
              </h2>
              <p className="text-xs sm:text-sm text-white/65 leading-relaxed">
                Most productivity software is passive—a cemetery of forgotten bookmarks and endless checklist clutter. Mission OS operates differently: it organizes your life into tactical sprints, connects every task to a quantifiable North Star goal, awards XP, and employs Gemini AI to actively recalibrate your focus.
              </p>
            </div>

            <div className="space-y-3">
              {[
                'Zero Fluff: Focused, high-contrast liquid-glass command interface.',
                'Compounding Habits: Heatmaps inspired by GitHub commitment matrices.',
                'AI Roadmapping: Gemini generates 3-phase strategic project breakdowns in seconds.',
                'Proof-Backed Wins: An archive documenting your tangible monthly breakthroughs.'
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl flex items-start gap-3"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)'
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-white/80 leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 8 FEATURE MODULES ── */}
      <section id="features" className="relative z-10 px-6 sm:px-12 py-16 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-300">
            System Modules
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Built for Tactical Execution
          </h2>
          <p className="text-xs sm:text-sm text-white/55 max-w-lg mx-auto">
            Eight interconnected modules working in total harmony to elevate your operational output.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {featureCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card p-6 flex flex-col justify-between group hover:border-cyan-400/40 transition-all hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        background: 'rgba(6,182,212,0.18)',
                        boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.35)'
                      }}
                    >
                      <Icon className="w-5 h-5 text-cyan-400" />
                    </div>
                    <span
                      className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.7)'
                      }}
                    >
                      {card.tag}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {card.title}
                  </h3>

                  <p className="text-xs text-white/55 leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── 3-STEP "HOW IT WORKS" ── */}
      <section className="relative z-10 px-6 sm:px-12 py-16 max-w-5xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-300">
            Operational Blueprint
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            How Mission OS Works
          </h2>
          <p className="text-xs sm:text-sm text-white/55 max-w-md mx-auto">
            A continuous closed-loop feedback system designed to compound your daily efforts.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {workflowSteps.map((ws, i) => (
            <div
              key={ws.step}
              className="glass-card p-7 space-y-4 relative"
            >
              <div
                className="text-4xl font-black font-mono text-cyan-400/30"
              >
                {ws.step}
              </div>
              <h3 className="text-base font-bold text-white">{ws.title}</h3>
              <p className="text-xs text-white/60 leading-relaxed">{ws.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section className="relative z-10 px-6 sm:px-12 py-16 max-w-5xl mx-auto space-y-10">
        <div className="text-center space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-300">
            Target Operatives
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Engineered for High-Agency Individuals
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {targetAudiences.map((aud) => (
            <div
              key={aud.title}
              className="p-6 rounded-2xl space-y-2"
              style={{
                background: 'rgba(255,255,255,0.04)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.08)'
              }}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">{aud.title}</h4>
              </div>
              <p className="text-xs text-white/60 leading-relaxed pl-6">{aud.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA BANNER ── */}
      <section className="relative z-10 px-6 sm:px-12 py-20 max-w-4xl mx-auto text-center">
        <div
          className="rounded-3xl p-10 sm:p-14 space-y-6 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(6,182,212,0.2) 0%, rgba(17,41,226,0.3) 100%)',
            boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.35), 0 0 60px rgba(6,182,212,0.15)'
          }}
        >
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto"
            style={{
              background: 'rgba(6,182,212,0.25)',
              boxShadow: 'inset 0 0 0 1px rgba(6,182,212,0.5)'
            }}
          >
            <Zap className="w-6 h-6 text-cyan-400" />
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Ready to Take Command of Your Growth?
          </h2>

          <p className="text-xs sm:text-sm text-white/65 max-w-md mx-auto leading-relaxed">
            Deploy your personal operating system today. Zero setup fees, instant Google & Phone authentication, and encrypted progress tracking.
          </p>

          <div className="pt-2">
            <button
              onClick={handleCta}
              className="text-black font-bold px-10 py-4 rounded-full text-base transition-all hover:opacity-90 hover:scale-105 inline-flex items-center gap-2 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #22d3ee, #06b6d4)',
                boxShadow: '0 0 40px rgba(6,182,212,0.4)'
              }}
            >
              <span>{user ? 'Return to Command Dashboard' : 'Deploy Mission OS Now'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 px-6 sm:px-12 py-8 text-center border-t border-white/10 text-xs text-white/40 space-y-2">
        <p>© 2026 Mission OS. Built for operatives committed to relentless compounding.</p>
        <div className="flex items-center justify-center gap-4 text-white/50 pt-1">
          <Link to="/" className="hover:text-cyan-300">Home</Link>
          <span>·</span>
          <Link to="/about" className="hover:text-cyan-300">About</Link>
          <span>·</span>
          <Link to="/login" className="hover:text-cyan-300">Authentication</Link>
        </div>
      </footer>
    </div>
  );
};

