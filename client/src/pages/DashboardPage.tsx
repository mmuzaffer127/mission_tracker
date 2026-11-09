import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Target,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Award,
  Pencil
} from 'lucide-react';
import { api } from '../lib/api.js';
import { useAuth } from '../contexts/AuthContext.js';
import { useSound } from '../contexts/SoundContext.js';
import { StatusBadge } from '../components/ui/StatusBadge.js';
import { ProgressRing } from '../components/ui/ProgressRing.js';
import { EditMissionModal } from '../components/missions/EditMissionModal.js';
import { Mission, Habit, DashboardSummary } from '../types/index.js';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { playComplete, playClick } = useSound();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);

  const fetchData = async () => {
    try {
      const [sumRes, misRes, habRes] = await Promise.all([
        api.getDashboardSummary(),
        api.getMissions(),
        api.getHabits()
      ]);
      setSummary(sumRes);
      setMissions(misRes);
      setHabits(habRes);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener('mission-refetch', fetchData);
    return () => window.removeEventListener('mission-refetch', fetchData);
  }, []);

  const handleSubtaskToggle = async (missionId: string, subtaskId: string, current: boolean) => {
    try {
      playClick();
      await api.toggleSubtask(missionId, subtaskId, !current);
      if (!current) playComplete();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleHabitCheckin = async (habitId: string) => {
    try {
      playClick();
      const today = new Date().toISOString().split('T')[0];
      await api.checkinHabit(habitId, today);
      playComplete();
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="skeleton h-32 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton h-28 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 skeleton h-80 rounded-2xl" />
          <div className="skeleton h-80 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Hero Banner ── */}
      <div
        data-animate="fade"
        data-delay="0"
        className="relative overflow-hidden p-6 sm:p-8 rounded-2xl"
        style={{
          background: 'rgba(255,255,255,0.08)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
        }}
      >
        {/* Background decorative wordmark */}
        <span
          className="absolute -right-8 -top-4 text-9xl font-black select-none pointer-events-none"
          style={{ color: 'rgba(255,255,255,0.04)', letterSpacing: '-0.1em' }}
        >
          MISSION
        </span>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div
              className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-semibold mb-4"
              style={{
                background: 'rgba(255,255,255,0.12)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.22)',
                color: 'rgba(255,255,255,0.80)',
              }}
            >
              <Sparkles className="w-3 h-3" />
              <span>Personal Growth Operating System</span>
            </div>
            <h1
              className="text-3xl sm:text-4xl font-black text-white"
              style={{ letterSpacing: '-0.06em' }}
            >
              Welcome back,{' '}
              <span style={{ color: 'rgba(255,255,255,0.75)' }}>
                {user?.full_name?.split(' ')[0] || 'Commander'}
              </span>
            </h1>
            <p className="text-sm mt-2 max-w-lg" style={{ color: 'rgba(255,255,255,0.60)' }}>
              Consistency compounds. You are ranked as{' '}
              <strong className="text-white">{summary?.level}</strong> with a Growth Velocity Score of{' '}
              <strong className="text-white">{summary?.growthScore}/100</strong>.
            </p>
          </div>

          <div
            className="flex items-center space-x-4 p-4 rounded-xl flex-shrink-0"
            style={{
              background: 'rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
            }}
          >
            <ProgressRing progress={summary?.growthScore || 0} size={64} strokeWidth={6} />
            <div>
              <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Growth Score
              </p>
              <p className="text-2xl font-black text-white" style={{ letterSpacing: '-0.04em' }}>
                {summary?.growthScore}
                <span className="text-sm font-normal ml-1" style={{ color: 'rgba(255,255,255,0.55)' }}>/100</span>
              </p>
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.45)' }}>1% better every day</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Missions */}
        <div data-animate data-delay="100" className="glass-card glass-card-indigo p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Active Missions
            </span>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center kpi-icon-indigo">
              <Target className="w-4 h-4 kpi-val-indigo" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black kpi-val-indigo" style={{ letterSpacing: '-0.04em' }}>
              {summary?.missions.pending || 0}
            </span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>
              of {summary?.missions.total || 0} total
            </span>
          </div>
          <div className="mt-4 progress-track h-1.5">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${summary?.missions.completionRate || 0}%`, background: '#a5b4fc' }}
            />
          </div>
        </div>

        {/* Habit Consistency */}
        <div data-animate data-delay="200" className="glass-card glass-card-cyan p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Habit Consistency
            </span>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center kpi-icon-cyan">
              <Flame className="w-4 h-4 kpi-val-cyan" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black kpi-val-cyan" style={{ letterSpacing: '-0.04em' }}>
              {summary?.habits.averageStreak || 0}
            </span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>avg day streak</span>
          </div>
          <p className="mt-3 text-xs font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>
            🔥 Momentum active
          </p>
        </div>

        {/* Master Goals */}
        <div data-animate data-delay="300" className="glass-card glass-card-emerald p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Master Goals
            </span>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center kpi-icon-emerald">
              <TrendingUp className="w-4 h-4 kpi-val-emerald" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black kpi-val-emerald" style={{ letterSpacing: '-0.04em' }}>
              {summary?.goals.achieved || 0}
            </span>
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>
              of {summary?.goals.total || 0} completed
            </span>
          </div>
          <p className="mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {summary?.goals.total
              ? `${Math.round(((summary?.goals.achieved || 0) / summary.goals.total) * 100)}% milestones met`
              : 'No goals yet'}
          </p>
        </div>

        {/* Earned XP */}
        <div data-animate data-delay="400" className="glass-card glass-card-amber p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Earned XP
            </span>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center kpi-icon-amber">
              <Award className="w-4 h-4 kpi-val-amber" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black kpi-val-amber" style={{ letterSpacing: '-0.04em' }}>
              {summary?.xp || 0}
            </span>
            <span className="text-xs font-mono" style={{ color: 'rgba(255,255,255,0.50)' }}>XP</span>
          </div>
          <p className="mt-3 text-xs" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Level: <strong className="text-white">{summary?.level}</strong>
          </p>
        </div>
      </div>

      {/* ── Main Operational View ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's High-Impact Missions */}
        <div
          data-animate="fade-left"
          data-delay="100"
          className="lg:col-span-2 rounded-2xl p-6 space-y-4"
          style={{
            background: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
          }}
        >
          <div
            className="flex items-center justify-between pb-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}
          >
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-white" />
              <h2 className="text-base font-bold text-white" style={{ letterSpacing: '-0.04em' }}>
                Today's High-Impact Missions
              </h2>
            </div>
            <Link
              to="/missions"
              className="text-xs font-medium flex items-center space-x-1 transition-opacity hover:opacity-80"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {missions.length === 0 ? (
            <div className="text-center py-12" style={{ color: 'rgba(255,255,255,0.50)' }}>
              <Target className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">No active missions scheduled.</p>
              <Link
                to="/missions"
                className="text-xs underline mt-2 inline-block"
                style={{ color: 'rgba(255,255,255,0.65)' }}
              >
                Launch your first mission
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {missions.slice(0, 4).map((mission) => (
                <div
                  key={mission.id}
                  className="p-4 rounded-xl transition-all space-y-3"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.10)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2 flex-wrap gap-1">
                        <StatusBadge priority={mission.priority} />
                        <h3 className="text-sm font-semibold text-white">{mission.title}</h3>
                      </div>
                      {mission.description && (
                        <p className="text-xs mt-1 line-clamp-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                          {mission.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <StatusBadge status={mission.status} />
                      <button
                        onClick={() => setEditingMission(mission)}
                        className="p-1 text-white/40 hover:text-cyan-300 transition-colors rounded"
                        title="Edit Mission Details"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtask Checkboxes */}
                  {mission.subtasks && mission.subtasks.length > 0 && (
                    <div
                      className="pt-2 space-y-1.5"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      {mission.subtasks.map((st) => (
                        <label
                          key={st.id}
                          className="flex items-center space-x-2 text-xs cursor-pointer select-none transition-opacity hover:opacity-100"
                          style={{ color: st.is_completed ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.75)' }}
                        >
                          <input
                            type="checkbox"
                            checked={st.is_completed}
                            onChange={() => handleSubtaskToggle(mission.id, st.id, st.is_completed)}
                          />
                          <span className={st.is_completed ? 'line-through' : ''}>{st.title}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  <div
                    className="flex items-center justify-between text-[11px] pt-1"
                    style={{ color: 'rgba(255,255,255,0.45)' }}
                  >
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{mission.deadline ? new Date(mission.deadline).toLocaleDateString() : 'No deadline'}</span>
                    </span>
                    <span className="font-mono text-white/70">{mission.progress_percentage}% done</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily Habit Check-in */}
        <div
          data-animate="fade-right"
          data-delay="200"
          className="rounded-2xl p-6 space-y-4"
          style={{
            background: 'rgba(255,255,255,0.08)',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.15)',
          }}
        >
          <div
            className="flex items-center justify-between pb-4"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.12)' }}
          >
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-white" />
              <h2 className="text-base font-bold text-white" style={{ letterSpacing: '-0.04em' }}>
                Daily Habit Check-in
              </h2>
            </div>
            <Link
              to="/habits"
              className="text-xs font-medium flex items-center space-x-1 transition-opacity hover:opacity-80"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              <span>Habits</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="p-3.5 rounded-xl flex items-center justify-between"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.10)',
                }}
              >
                <div>
                  <h4 className="text-xs font-semibold text-white">{habit.title}</h4>
                  <p className="text-[11px] font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    🔥 {habit.current_streak}d streak · Best: {habit.longest_streak}
                  </p>
                </div>
                <button
                  onClick={() => handleHabitCheckin(habit.id)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center space-x-1"
                  style={{
                    background: 'rgba(255,255,255,0.12)',
                    color: '#fff',
                    boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.22)',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.22)';
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.12)';
                  }}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Check</span>
                </button>
              </div>
            ))}

            {habits.length === 0 && (
              <div className="text-center py-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
                <Flame className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="text-xs">No habits tracked yet.</p>
              </div>
            )}
          </div>

          {/* AI Growth Advisor Hook */}
          <div
            className="mt-4 p-4 rounded-xl"
            style={{
              background: 'rgba(255,255,255,0.06)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.12)',
            }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-xs font-semibold text-white">AI Growth Recommendation</span>
            </div>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.65)' }}>
              "Your Deep Work streak is building momentum. Keep morning distraction gates locked to preserve cognitive energy."
            </p>
            <Link
              to="/ai-assistant"
              className="mt-2 text-[11px] flex items-center space-x-1 transition-opacity hover:opacity-80"
              style={{ color: 'rgba(255,255,255,0.60)' }}
            >
              <span>Consult Gemini Copilot</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Edit Mission Modal */}
      <EditMissionModal
        mission={editingMission}
        isOpen={!!editingMission}
        onClose={() => setEditingMission(null)}
        onMissionUpdated={fetchData}
      />
    </div>
  );
};
