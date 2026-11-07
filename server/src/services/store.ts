import { Mission, Goal, Habit, Achievement, JournalEntry, FocusSession, HabitCheckin, MissionSubtask, GoalMilestone } from '../types/index.js';
import { calculateHabitStreak, calculateMissionProgress, calculateGoalProgress } from '../utils/formulas.js';
import { getSupabase } from '../config/supabase.js';

// Pre-seeded initial data for Mission OS
const INITIAL_MISSIONS: Mission[] = [
  {
    id: 'm-101',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Architect Mission OS Production Core',
    description: 'Design the core modules, clean architecture, and responsive UI system.',
    priority: 'critical',
    status: 'in_progress',
    start_date: new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    progress_percentage: 67,
    is_recurring: false,
    is_archived: false,
    created_at: new Date(Date.now() - 86400000 * 3).toISOString(),
    updated_at: new Date().toISOString(),
    subtasks: [
      { id: 'st-1', mission_id: 'm-101', title: 'PostgreSQL schema with strict RLS', is_completed: true, order_index: 0, created_at: new Date().toISOString() },
      { id: 'st-2', mission_id: 'm-101', title: 'Express & Supabase Auth middleware', is_completed: true, order_index: 1, created_at: new Date().toISOString() },
      { id: 'st-3', mission_id: 'm-101', title: 'Dark cyberpunk UI design system', is_completed: false, order_index: 2, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'm-102',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Deploy Gemini AI Personal Growth Copilot',
    description: 'Integrate the official @google/genai SDK for goal roadmap generation and reflections.',
    priority: 'high',
    status: 'not_started',
    start_date: new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 86400000 * 4).toISOString(),
    progress_percentage: 0,
    is_recurring: false,
    is_archived: false,
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString(),
    subtasks: [
      { id: 'st-4', mission_id: 'm-102', title: 'Set up Gemini 2.5 Flash SDK client', is_completed: false, order_index: 0, created_at: new Date().toISOString() },
      { id: 'st-5', mission_id: 'm-102', title: 'Implement structured roadmap response schema', is_completed: false, order_index: 1, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'm-103',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Morning Mental Calibration & Deep Work Routine',
    description: 'Establish high-energy state with 90 minutes of uninterrupted focused development.',
    priority: 'medium',
    status: 'completed',
    start_date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    deadline: new Date().toISOString(),
    progress_percentage: 100,
    is_recurring: true,
    is_archived: false,
    completed_at: new Date().toISOString(),
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString(),
    subtasks: [
      { id: 'st-6', mission_id: 'm-103', title: 'Plan top 3 MITs', is_completed: true, order_index: 0, created_at: new Date().toISOString() },
      { id: 'st-7', mission_id: 'm-103', title: 'Zero-distraction phone lockbox', is_completed: true, order_index: 1, created_at: new Date().toISOString() }
    ]
  }
];

const INITIAL_GOALS: Goal[] = [
  {
    id: 'g-201',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Achieve Elite Full-Stack Systems Mastery',
    description: 'Master full-stack distributed system architectures, high-performance databases, and LLM orchestration.',
    timeframe: 'annual',
    target_date: new Date(Date.now() + 86400000 * 180).toISOString().split('T')[0],
    progress_percentage: 55,
    is_achieved: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    milestones: [
      { id: 'ms-1', goal_id: 'g-201', title: 'Advanced Postgres DDL, Indexing & RLS Policies', order_index: 0, is_completed: true, completed_at: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 'ms-2', goal_id: 'g-201', title: 'TypeScript Monorepo & REST Microservices', order_index: 1, is_completed: true, completed_at: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 'ms-3', goal_id: 'g-201', title: 'Google Gemini AI Integration with Structured JSON', order_index: 2, is_completed: false, created_at: new Date().toISOString() },
      { id: 'ms-4', goal_id: 'g-201', title: 'Production Multi-Region Cloud Deployment', order_index: 3, is_completed: false, created_at: new Date().toISOString() }
    ]
  },
  {
    id: 'g-202',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Read 24 High-Impact Non-Fiction Books',
    description: 'Systematically consume and synthesize game-changing works on strategy, psychology, and technology.',
    timeframe: 'annual',
    target_date: new Date(Date.now() + 86400000 * 240).toISOString().split('T')[0],
    progress_percentage: 33,
    is_achieved: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    milestones: [
      { id: 'ms-5', goal_id: 'g-202', title: 'Read Atomic Habits & Deep Work', order_index: 0, is_completed: true, completed_at: new Date().toISOString(), created_at: new Date().toISOString() },
      { id: 'ms-6', goal_id: 'g-202', title: 'Read Designing Data-Intensive Applications', order_index: 1, is_completed: false, created_at: new Date().toISOString() }
    ]
  }
];

const INITIAL_HABITS: Habit[] = [
  {
    id: 'h-301',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Deep Work Code Sprint (90 min)',
    description: 'Uninterrupted creative engineering before 11:00 AM.',
    frequency: 'daily',
    target_count_per_day: 1,
    current_streak: 14,
    longest_streak: 21,
    is_paused: false,
    is_archived: false,
    created_at: new Date(Date.now() - 86400000 * 30).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'h-302',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: '30-Minute Tactical Reading',
    description: 'Read technical whitepapers, architecture docs, or non-fiction.',
    frequency: 'daily',
    target_count_per_day: 1,
    current_streak: 8,
    longest_streak: 15,
    is_paused: false,
    is_archived: false,
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'h-303',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'Cardio & Strength Conditioning',
    description: '45 minutes physical resilience and conditioning.',
    frequency: 'daily',
    target_count_per_day: 1,
    current_streak: 5,
    longest_streak: 12,
    is_paused: false,
    is_archived: false,
    created_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    user_id: '00000000-0000-0000-0000-000000000001',
    title: 'System Genesis: Mission OS Bootstrapped',
    description: 'Completed foundational system architecture and deployed enterprise database schema.',
    year_month: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
    xp_awarded: 250,
    unlocked_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    evidence: [
      {
        id: 'ev-1',
        achievement_id: 'ach-1',
        external_url: 'https://github.com',
        media_type: 'external_link',
        caption: 'Production Repository Commit',
        created_at: new Date().toISOString()
      }
    ]
  }
];

class MemoryStore {
  missions: Mission[] = [...INITIAL_MISSIONS];
  goals: Goal[] = [...INITIAL_GOALS];
  habits: Habit[] = [...INITIAL_HABITS];
  checkins: HabitCheckin[] = [];
  achievements: Achievement[] = [...INITIAL_ACHIEVEMENTS];
  journal: JournalEntry[] = [];
  focusSessions: FocusSession[] = [];
  userXp: number = 850;
  userLevel: string = 'Explorer';

  constructor() {
    // Generate sample check-ins for the last 14 days for streak visualization
    const today = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      this.checkins.push({
        id: `chk-301-${i}`,
        habit_id: 'h-301',
        user_id: '00000000-0000-0000-0000-000000000001',
        checkin_date: dateStr,
        count: 1,
        created_at: d.toISOString()
      });
      if (i < 8) {
        this.checkins.push({
          id: `chk-302-${i}`,
          habit_id: 'h-302',
          user_id: '00000000-0000-0000-0000-000000000001',
          checkin_date: dateStr,
          count: 1,
          created_at: d.toISOString()
        });
      }
    }
  }

  // --- MISSIONS ---
  getMissions(userId: string) {
    return this.missions.filter((m) => m.user_id === userId && !m.is_archived);
  }

  getMissionById(userId: string, id: string) {
    return this.missions.find((m) => m.id === id && m.user_id === userId);
  }

  createMission(userId: string, payload: Partial<Mission> & { subtasks?: (string | MissionSubtask)[] }) {
    const rawSubtasks = payload.subtasks || [];
    const newMissionId = `m-${Date.now()}`;
    const newSubtasks: MissionSubtask[] = rawSubtasks.map((t, index) => ({
      id: `st-${Date.now()}-${index}`,
      mission_id: newMissionId,
      title: typeof t === 'string' ? t : (t as any).title,
      is_completed: false,
      order_index: index,
      created_at: new Date().toISOString()
    }));

    const newMission: Mission = {
      id: newMissionId,
      user_id: userId,
      goal_id: payload.goal_id || null,
      category_id: payload.category_id || null,
      title: payload.title || 'Untitled Mission',
      description: payload.description || '',
      priority: payload.priority || 'medium',
      status: payload.status || 'not_started',
      start_date: payload.start_date || new Date().toISOString().split('T')[0],
      deadline: payload.deadline || null,
      progress_percentage: calculateMissionProgress(newSubtasks),
      is_recurring: payload.is_recurring || false,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      subtasks: newSubtasks
    };

    this.missions.unshift(newMission);
    return newMission;
  }

  updateMission(userId: string, id: string, payload: Partial<Mission>) {
    const index = this.missions.findIndex((m) => m.id === id && m.user_id === userId);
    if (index === -1) return null;

    const mission = this.missions[index];
    const updated: Mission = {
      ...mission,
      ...payload,
      updated_at: new Date().toISOString()
    };

    if (payload.status === 'completed' && mission.status !== 'completed') {
      updated.completed_at = new Date().toISOString();
      updated.progress_percentage = 100;
      this.userXp += 60;
    }

    this.missions[index] = updated;
    return updated;
  }

  deleteMission(userId: string, id: string) {
    const prevLen = this.missions.length;
    this.missions = this.missions.filter((m) => !(m.id === id && m.user_id === userId));
    return this.missions.length < prevLen;
  }

  toggleSubtask(userId: string, missionId: string, subtaskId: string, isCompleted: boolean) {
    const mission = this.getMissionById(userId, missionId);
    if (!mission || !mission.subtasks) return null;

    const st = mission.subtasks.find((s) => s.id === subtaskId);
    if (!st) return null;

    st.is_completed = isCompleted;
    mission.progress_percentage = calculateMissionProgress(mission.subtasks);
    if (mission.progress_percentage === 100 && mission.status !== 'completed') {
      mission.status = 'completed';
      mission.completed_at = new Date().toISOString();
      this.userXp += 60;
    }
    mission.updated_at = new Date().toISOString();
    return mission;
  }

  // --- GOALS ---
  getGoals(userId: string) {
    return this.goals.filter((g) => g.user_id === userId);
  }

  createGoal(userId: string, payload: Partial<Goal> & { milestones?: (string | GoalMilestone)[] }) {
    const rawMilestones = payload.milestones || [];
    const newGoalId = `g-${Date.now()}`;
    const newMilestones: GoalMilestone[] = rawMilestones.map((t, index) => ({
      id: `ms-${Date.now()}-${index}`,
      goal_id: newGoalId,
      title: typeof t === 'string' ? t : (t as any).title,
      order_index: index,
      is_completed: false,
      created_at: new Date().toISOString()
    }));

    const newGoal: Goal = {
      id: newGoalId,
      user_id: userId,
      title: payload.title || 'Untitled Master Goal',
      description: payload.description || '',
      timeframe: payload.timeframe || 'quarterly',
      target_date: payload.target_date || null,
      progress_percentage: 0,
      is_achieved: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      milestones: newMilestones
    };

    this.goals.unshift(newGoal);
    return newGoal;
  }

  toggleMilestone(userId: string, goalId: string, milestoneId: string, isCompleted: boolean) {
    const goal = this.goals.find((g) => g.id === goalId && g.user_id === userId);
    if (!goal || !goal.milestones) return null;

    const ms = goal.milestones.find((m) => m.id === milestoneId);
    if (!ms) return null;

    ms.is_completed = isCompleted;
    ms.completed_at = isCompleted ? new Date().toISOString() : null;

    const attachedMissions = this.missions.filter((m) => m.goal_id === goalId);
    goal.progress_percentage = calculateGoalProgress(goal.milestones, attachedMissions);
    if (goal.progress_percentage === 100 && !goal.is_achieved) {
      goal.is_achieved = true;
      goal.achieved_at = new Date().toISOString();
      this.userXp += 300;
    }
    goal.updated_at = new Date().toISOString();
    return goal;
  }

  // --- HABITS ---
  getHabits(userId: string) {
    return this.habits.filter((h) => h.user_id === userId && !h.is_archived);
  }

  createHabit(userId: string, payload: Partial<Habit>) {
    const newHabit: Habit = {
      id: `h-${Date.now()}`,
      user_id: userId,
      title: payload.title || 'New Daily Habit',
      description: payload.description || '',
      frequency: payload.frequency || 'daily',
      custom_days: payload.custom_days || [],
      target_count_per_day: payload.target_count_per_day || 1,
      current_streak: 0,
      longest_streak: 0,
      is_paused: false,
      is_archived: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.habits.unshift(newHabit);
    return newHabit;
  }

  recordHabitCheckin(userId: string, habitId: string, dateStr: string, count: number = 1, notes?: string) {
    const habit = this.habits.find((h) => h.id === habitId && h.user_id === userId);
    if (!habit) return null;

    const existingIndex = this.checkins.findIndex((c) => c.habit_id === habitId && c.checkin_date === dateStr);
    if (existingIndex >= 0) {
      this.checkins[existingIndex].count = count;
      if (notes) this.checkins[existingIndex].notes = notes;
    } else {
      this.checkins.push({
        id: `chk-${Date.now()}`,
        habit_id: habitId,
        user_id: userId,
        checkin_date: dateStr,
        count,
        notes,
        created_at: new Date().toISOString()
      });
      this.userXp += 15;
    }

    // Recalculate streak
    const habitCheckinDates = this.checkins
      .filter((c) => c.habit_id === habitId)
      .map((c) => c.checkin_date);

    const todayStr = new Date().toISOString().split('T')[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    const { currentStreak, longestStreak } = calculateHabitStreak(habitCheckinDates, todayStr, yesterdayStr);
    habit.current_streak = currentStreak;
    habit.longest_streak = Math.max(habit.longest_streak, longestStreak);
    habit.updated_at = new Date().toISOString();

    return { habit, checkin: { habit_id: habitId, date: dateStr, count } };
  }

  // --- ACHIEVEMENTS ---
  getAchievements(userId: string, yearMonth?: string) {
    let list = this.achievements.filter((a) => a.user_id === userId);
    if (yearMonth) {
      list = list.filter((a) => a.year_month === yearMonth);
    }
    return list;
  }

  createAchievement(userId: string, payload: Partial<Achievement>) {
    const currentYM = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const newAch: Achievement = {
      id: `ach-${Date.now()}`,
      user_id: userId,
      mission_id: payload.mission_id || null,
      goal_id: payload.goal_id || null,
      title: payload.title || 'Untitled Breakthrough',
      description: payload.description || '',
      year_month: payload.year_month || currentYM,
      xp_awarded: payload.xp_awarded || 50,
      unlocked_at: new Date().toISOString(),
      evidence: []
    };
    this.achievements.unshift(newAch);
    this.userXp += newAch.xp_awarded;
    return newAch;
  }

  // --- ANALYTICS SUMMARY ---
  getDashboardSummary(userId: string) {
    const userMissions = this.getMissions(userId);
    const userGoals = this.getGoals(userId);
    const userHabits = this.getHabits(userId);

    const completedMissions = userMissions.filter((m) => m.status === 'completed').length;
    const pendingMissions = userMissions.filter((m) => m.status === 'in_progress' || m.status === 'not_started').length;
    const achievedGoals = userGoals.filter((g) => g.is_achieved).length;

    const totalStreak = userHabits.reduce((acc, h) => acc + h.current_streak, 0);
    const avgStreak = userHabits.length > 0 ? Math.round(totalStreak / userHabits.length) : 0;

    const missionRate = userMissions.length > 0 ? Math.round((completedMissions / userMissions.length) * 100) : 0;
    const overallGrowthScore = Math.min(100, Math.round(missionRate * 0.6 + avgStreak * 2.5));

    return {
      growthScore: overallGrowthScore,
      xp: this.userXp,
      level: this.userXp >= 1500 ? 'Achiever' : this.userXp >= 500 ? 'Explorer' : 'Beginner',
      missions: {
        total: userMissions.length,
        completed: completedMissions,
        pending: pendingMissions,
        completionRate: missionRate
      },
      goals: {
        total: userGoals.length,
        achieved: achievedGoals
      },
      habits: {
        total: userHabits.length,
        averageStreak: avgStreak
      },
      achievementsCount: this.achievements.length
    };
  }
}

export const dbStore = new MemoryStore();
