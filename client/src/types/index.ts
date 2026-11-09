export type MissionPriority = 'low' | 'medium' | 'high' | 'critical';
export type MissionStatus = 'not_started' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
export type GoalTimeframe = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual' | 'long_term';
export type HabitFrequency = 'daily' | 'weekdays' | 'weekends' | 'custom_days';

export interface UserProfile {
  id: string;
  email?: string | null;
  phone?: string | null;
  full_name: string;
  avatar_url?: string | null;
  auth_provider?: string;
  onboarding_completed?: boolean;
  timezone?: string;
  level: string;
  current_xp: number;
  xp?: number;
  next_level_xp?: number;
}

export interface MissionSubtask {
  id: string;
  mission_id: string;
  title: string;
  is_completed: boolean;
  order_index: number;
  created_at: string;
}

export interface Mission {
  id: string;
  user_id: string;
  goal_id?: string | null;
  category_id?: string | null;
  title: string;
  description?: string;
  priority: MissionPriority;
  status: MissionStatus;
  start_date: string;
  deadline?: string | null;
  progress_percentage: number;
  is_recurring: boolean;
  recurrence_rule?: string;
  is_archived: boolean;
  completed_at?: string | null;
  created_at: string;
  updated_at: string;
  subtasks?: MissionSubtask[];
}

export interface GoalMilestone {
  id: string;
  goal_id: string;
  title: string;
  order_index: number;
  is_completed: boolean;
  completed_at?: string | null;
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  category_id?: string | null;
  title: string;
  description?: string;
  timeframe: GoalTimeframe;
  target_date?: string | null;
  progress_percentage: number;
  is_achieved: boolean;
  achieved_at?: string | null;
  created_at: string;
  updated_at: string;
  milestones?: GoalMilestone[];
  missions?: Mission[];
}

export interface HabitCheckin {
  id: string;
  habit_id: string;
  user_id: string;
  checkin_date: string;
  count: number;
  notes?: string;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  category_id?: string | null;
  title: string;
  description?: string;
  frequency: HabitFrequency;
  custom_days?: number[];
  target_count_per_day: number;
  current_streak: number;
  longest_streak: number;
  is_paused: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  checkins?: HabitCheckin[];
}

export interface AchievementEvidence {
  id: string;
  achievement_id: string;
  file_url?: string;
  external_url?: string;
  media_type: string;
  caption?: string;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  mission_id?: string | null;
  goal_id?: string | null;
  title: string;
  description?: string;
  year_month: string;
  xp_awarded: number;
  unlocked_at: string;
  evidence?: AchievementEvidence[];
}

export interface DashboardSummary {
  growthScore: number;
  xp: number;
  level: string;
  missions: {
    total: number;
    completed: number;
    pending: number;
    completionRate: number;
  };
  goals: {
    total: number;
    achieved: number;
  };
  habits: {
    total: number;
    averageStreak: number;
  };
  achievementsCount: number;
}

