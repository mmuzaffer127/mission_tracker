import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  Target,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Award
} from 'lucide-react';
import { api } from '../lib/api.js';
import { useAuth } from '../contexts/AuthContext.js';
import { useSound } from '../contexts/SoundContext.js';
import { StatusBadge } from '../components/ui/StatusBadge.js';
import { ProgressRing } from '../components/ui/ProgressRing.js';
import { Mission, Habit, DashboardSummary } from '../types/index.js';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { playComplete, playClick } = useSound();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-surface-100 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-surface-100 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-surface-100 rounded-2xl" />
          <div className="h-96 bg-surface-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Strategic Mission Header Banner */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-surface-100 via-surface-100 to-brand-blue/10 border border-surface-border">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-brand-blue/15 border border-brand-blue/30 text-xs font-semibold text-blue-400 mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Growth Operating System</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-gradient-blue">{user?.full_name}</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1 max-w-xl">
              Consistency compounds. You are currently ranked as an <strong className="text-brand-cyan">{summary?.level}</strong> with an active Growth Velocity Score of <strong className="text-emerald-400">{summary?.growthScore}/100</strong>.
            </p>
          </div>

          <div className="flex items-center space-x-4 bg-surface-200/90 p-4 rounded-xl border border-surface-border">
            <ProgressRing progress={summary?.growthScore || 0} size={64} strokeWidth={6} colorClass="stroke-brand-cyan" />
            <div>
              <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold">Growth Score</p>
              <p className="text-lg font-bold text-white">{summary?.growthScore} <span className="text-xs text-emerald-400 font-normal">/ 100</span></p>
              <p className="text-[11px] text-gray-400">1% better every day</p>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Command Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Missions Metric */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Missions</span>
            <Target className="w-4 h-4 text-brand-blue" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{summary?.missions.pending || 0}</span>
            <span className="text-xs text-gray-400">of {summary?.missions.total || 0} total</span>
          </div>
          <div className="mt-3 w-full bg-surface-50 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-brand-blue h-full rounded-full transition-all duration-500"
              style={{ width: `${summary?.missions.completionRate || 0}%` }}
            />
          </div>
        </div>

        {/* Habits Consistency */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Habit Consistency</span>
            <Flame className="w-4 h-4 text-brand-amber" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{summary?.habits.averageStreak || 0}</span>
            <span className="text-xs text-gray-400">avg day streak</span>
          </div>
          <p className="mt-3 text-xs text-brand-amber font-medium flex items-center space-x-1">
            <span>🔥 Momentum active</span>
          </p>
        </div>

        {/* Master Goals Achieved */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Master Goals</span>
            <TrendingUp className="w-4 h-4 text-brand-emerald" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{summary?.goals.achieved || 0}</span>
            <span className="text-xs text-gray-400">of {summary?.goals.total || 0} completed</span>
          </div>
          <p className="mt-3 text-xs text-emerald-400">
            {summary?.goals.total ? `${Math.round(((summary?.goals.achieved || 0) / summary.goals.total) * 100)}% milestones met` : 'No goals yet'}
          </p>
        </div>

        {/* Total XP Gained */}
        <div className="glass-card p-5">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Earned XP</span>
            <Award className="w-4 h-4 text-brand-purple" />
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold text-white">{summary?.xp || 0}</span>
            <span className="text-xs text-purple-400 font-mono">XP</span>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Level: <strong className="text-brand-purple">{summary?.level}</strong>
          </p>
        </div>
      </div>

      {/* Main Dual Operational View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Missions Operational Stream */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-brand-blue" />
              <h2 className="text-base font-bold text-white">Today's High-Impact Missions</h2>
            </div>
            <Link
              to="/missions"
              className="text-xs text-brand-blue hover:text-blue-300 font-medium flex items-center space-x-1"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {missions.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Target className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <p className="text-sm">No active missions scheduled.</p>
              <Link to="/missions" className="text-xs text-brand-blue hover:underline mt-1 inline-block">
                Launch your first mission
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {missions.slice(0, 4).map((mission) => (
                <div
                  key={mission.id}
                  className="p-4 rounded-xl bg-surface-50/70 border border-surface-border hover:border-brand-blue/30 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <StatusBadge priority={mission.priority} />
                        <h3 className="text-sm font-semibold text-gray-200">{mission.title}</h3>
                      </div>
                      {mission.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-1">{mission.description}</p>
                      )}
                    </div>
                    <StatusBadge status={mission.status} />
                  </div>

                  {/* Subtask Checkboxes */}
                  {mission.subtasks && mission.subtasks.length > 0 && (
                    <div className="pt-2 border-t border-surface-border/50 space-y-1.5">
                      {mission.subtasks.map((st) => (
                        <label
                          key={st.id}
                          className="flex items-center space-x-2 text-xs text-gray-300 cursor-pointer select-none hover:text-white"
                        >
                          <input
                            type="checkbox"
                            checked={st.is_completed}
                            onChange={() => handleSubtaskToggle(mission.id, st.id, st.is_completed)}
                            className="rounded border-surface-border bg-surface-100 text-brand-blue focus:ring-0 focus:ring-offset-0"
                          />
                          <span className={st.is_completed ? 'line-through text-gray-500' : ''}>
                            {st.title}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{mission.deadline ? new Date(mission.deadline).toLocaleDateString() : 'No deadline'}</span>
                    </span>
                    <span className="font-mono text-brand-cyan">{mission.progress_percentage}% completed</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Daily Habit Consistency Terminal */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-surface-border">
            <div className="flex items-center space-x-2">
              <Flame className="w-5 h-5 text-brand-amber" />
              <h2 className="text-base font-bold text-white">Daily Habit Check-in</h2>
            </div>
            <Link
              to="/habits"
              className="text-xs text-brand-amber hover:text-amber-300 font-medium flex items-center space-x-1"
            >
              <span>Habits</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="p-3.5 rounded-xl bg-surface-50/70 border border-surface-border flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-semibold text-gray-200">{habit.title}</h4>
                  <p className="text-[11px] text-brand-amber font-mono mt-0.5">
                    🔥 {habit.current_streak} day streak (Best: {habit.longest_streak})
                  </p>
                </div>
                <button
                  onClick={() => handleHabitCheckin(habit.id)}
                  className="px-3 py-1.5 rounded-lg bg-surface-100 hover:bg-brand-emerald hover:text-black border border-surface-border text-xs font-semibold text-emerald-400 transition-all flex items-center space-x-1"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Check</span>
                </button>
              </div>
            ))}
          </div>

          {/* Quick AI Advisor Hook */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20">
            <div className="flex items-center space-x-2 text-xs font-semibold text-purple-300 mb-1">
              <Sparkles className="w-4 h-4 text-brand-purple" />
              <span>AI Growth Recommendation</span>
            </div>
            <p className="text-xs text-gray-300">
              "Your 14-day Deep Work streak is elevating your momentum. Keep morning distraction gates locked to preserve cognitive energy."
            </p>
            <Link
              to="/ai-assistant"
              className="mt-2 text-[11px] text-purple-400 hover:underline flex items-center space-x-1"
            >
              <span>Consult Gemini Copilot</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
