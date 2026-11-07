-- ============================================================================
-- MISSION OS: Complete Supabase PostgreSQL DDL Schema & Policies
-- Version: 1.0.0
-- Database: PostgreSQL 15+ with pg_graphql, uuid-ossp, pgcrypto
-- ============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Custom Enum Types
DO $$ BEGIN
    CREATE TYPE mission_priority AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE mission_status AS ENUM ('not_started', 'in_progress', 'completed', 'on_hold', 'cancelled');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE goal_timeframe AS ENUM ('daily', 'weekly', 'monthly', 'quarterly', 'annual', 'long_term');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE habit_frequency AS ENUM ('daily', 'weekdays', 'weekends', 'custom_days');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE focus_session_type AS ENUM ('pomodoro', 'short_break', 'long_break', 'deep_work');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE user_level_title AS ENUM ('Beginner', 'Explorer', 'Achiever', 'Consistent', 'High Performer', 'Mastermind');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. Profiles Table (Synced with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'UTC',
    level user_level_title DEFAULT 'Beginner',
    current_xp INTEGER DEFAULT 0 CHECK (current_xp >= 0),
    next_level_xp INTEGER DEFAULT 500,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Mission & Goal Categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    color_hex VARCHAR(7) NOT NULL DEFAULT '#3B82F6',
    icon_name TEXT DEFAULT 'Folder',
    is_system BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Goals Table
CREATE TABLE IF NOT EXISTS public.goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    timeframe goal_timeframe NOT NULL DEFAULT 'quarterly',
    target_date DATE,
    progress_percentage NUMERIC(5,2) DEFAULT 0.00 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    is_achieved BOOLEAN DEFAULT FALSE,
    achieved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Goal Milestones
CREATE TABLE IF NOT EXISTS public.goal_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    goal_id UUID REFERENCES public.goals(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    order_index INTEGER DEFAULT 0 NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Missions Table
CREATE TABLE IF NOT EXISTS public.missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    priority mission_priority DEFAULT 'medium' NOT NULL,
    status mission_status DEFAULT 'not_started' NOT NULL,
    start_date DATE DEFAULT CURRENT_DATE,
    deadline TIMESTAMPTZ,
    progress_percentage NUMERIC(5,2) DEFAULT 0.00 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_rule TEXT,
    is_archived BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Mission Subtasks
CREATE TABLE IF NOT EXISTS public.mission_subtasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID REFERENCES public.missions(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    order_index INTEGER DEFAULT 0 NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Habits Table
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    frequency habit_frequency DEFAULT 'daily' NOT NULL,
    custom_days INTEGER[],
    target_count_per_day INTEGER DEFAULT 1 NOT NULL,
    current_streak INTEGER DEFAULT 0 NOT NULL,
    longest_streak INTEGER DEFAULT 0 NOT NULL,
    is_paused BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 8. Habit Check-ins Table
CREATE TABLE IF NOT EXISTS public.habit_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    checkin_date DATE NOT NULL,
    count INTEGER DEFAULT 1 NOT NULL,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_habit_date_checkin UNIQUE(habit_id, checkin_date)
);

-- 9. Achievements & Wall of Fame
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    mission_id UUID REFERENCES public.missions(id) ON DELETE SET NULL,
    goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    year_month VARCHAR(7) NOT NULL, -- Format: YYYY-MM
    xp_awarded INTEGER DEFAULT 50 NOT NULL,
    unlocked_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. Proof of Achievement (Evidence)
CREATE TABLE IF NOT EXISTS public.achievement_evidence (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE NOT NULL,
    file_url TEXT,
    external_url TEXT,
    media_type TEXT NOT NULL,
    caption TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 11. Journal Entries & Reflections
CREATE TABLE IF NOT EXISTS public.journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    entry_date DATE NOT NULL,
    title TEXT,
    content_markdown TEXT NOT NULL,
    mood_score INTEGER CHECK (mood_score BETWEEN 1 AND 5),
    tags TEXT[],
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 12. Dear Future Me Letters
CREATE TABLE IF NOT EXISTS public.dear_future_me (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    letter_title TEXT NOT NULL,
    letter_body TEXT NOT NULL,
    unlock_date DATE NOT NULL,
    is_opened BOOLEAN DEFAULT FALSE,
    opened_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 13. Weekly Reviews
CREATE TABLE IF NOT EXISTS public.weekly_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    week_start_date DATE NOT NULL,
    accomplishments TEXT,
    lessons_learned TEXT,
    challenges_faced TEXT,
    improvements_next_week TEXT,
    metrics_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_weekly_review UNIQUE(user_id, week_start_date)
);

-- 14. Monthly Achievement Snapshots (Permanent Historical Records)
CREATE TABLE IF NOT EXISTS public.monthly_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    year_month VARCHAR(7) NOT NULL,
    missions_completed_count INTEGER DEFAULT 0,
    goals_achieved_count INTEGER DEFAULT 0,
    habit_completion_rate NUMERIC(5,2) DEFAULT 0.00,
    total_xp_gained INTEGER DEFAULT 0,
    deep_work_minutes INTEGER DEFAULT 0,
    ai_summary_markdown TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_month_report UNIQUE(user_id, year_month)
);

-- 15. Focus Sessions (Pomodoro / Deep Work)
CREATE TABLE IF NOT EXISTS public.focus_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    mission_id UUID REFERENCES public.missions(id) ON DELETE SET NULL,
    session_type focus_session_type DEFAULT 'pomodoro' NOT NULL,
    duration_minutes INTEGER NOT NULL,
    notes TEXT,
    completed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 16. Vision Board Items
CREATE TABLE IF NOT EXISTS public.vision_board_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    image_url TEXT NOT NULL,
    title TEXT,
    quote TEXT,
    category TEXT,
    position_x NUMERIC(6,2) DEFAULT 0.0,
    position_y NUMERIC(6,2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 17. Future Self Tracking (Horizon Milestones)
CREATE TABLE IF NOT EXISTS public.future_self_goals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    timeframe_horizon VARCHAR(20) NOT NULL,
    title TEXT NOT NULL,
    vision_statement TEXT NOT NULL,
    target_date DATE NOT NULL,
    is_realized BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 18. Life Balance Wheel Self-Assessments
CREATE TABLE IF NOT EXISTS public.life_balance_assessments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    assessment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    career_score INTEGER CHECK (career_score BETWEEN 1 AND 10) NOT NULL,
    education_score INTEGER CHECK (education_score BETWEEN 1 AND 10) NOT NULL,
    health_score INTEGER CHECK (health_score BETWEEN 1 AND 10) NOT NULL,
    relationships_score INTEGER CHECK (relationships_score BETWEEN 1 AND 10) NOT NULL,
    financial_score INTEGER CHECK (financial_score BETWEEN 1 AND 10) NOT NULL,
    personal_dev_score INTEGER CHECK (personal_dev_score BETWEEN 1 AND 10) NOT NULL,
    creativity_score INTEGER CHECK (creativity_score BETWEEN 1 AND 10) NOT NULL,
    spiritual_score INTEGER CHECK (spiritual_score BETWEEN 1 AND 10) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 19. Gamification: XP Ledger & Badges
CREATE TABLE IF NOT EXISTS public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    amount INTEGER NOT NULL CHECK (amount <> 0),
    source_type TEXT NOT NULL,
    source_id UUID,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    icon_name TEXT NOT NULL,
    required_xp INTEGER DEFAULT 0,
    criteria_json JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS public.user_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    badge_id UUID REFERENCES public.badges(id) ON DELETE CASCADE NOT NULL,
    awarded_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT unique_user_badge UNIQUE(user_id, badge_id)
);

-- 20. User Notification Preferences
CREATE TABLE IF NOT EXISTS public.user_preferences (
    user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    daily_reminder_time TIME DEFAULT '08:00:00',
    weekly_review_day INTEGER DEFAULT 0,
    sound_effects_enabled BOOLEAN DEFAULT TRUE,
    gamification_enabled BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_missions_user_status ON public.missions(user_id, status);
CREATE INDEX IF NOT EXISTS idx_missions_deadline ON public.missions(user_id, deadline);
CREATE INDEX IF NOT EXISTS idx_habit_checkins_user_date ON public.habit_checkins(user_id, checkin_date);
CREATE INDEX IF NOT EXISTS idx_achievements_user_month ON public.achievements(user_id, year_month);
CREATE INDEX IF NOT EXISTS idx_focus_sessions_user ON public.focus_sessions(user_id, completed_at);
CREATE INDEX IF NOT EXISTS idx_journal_user_date ON public.journal_entries(user_id, entry_date);

-- ROW LEVEL SECURITY
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goal_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mission_subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievement_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dear_future_me ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.focus_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vision_board_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.future_self_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.life_balance_assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;

-- Standard RLS Policies (Safe drop and recreate to prevent duplicate error)
DROP POLICY IF EXISTS "Users own their profiles" ON public.profiles;
CREATE POLICY "Users own their profiles" ON public.profiles FOR ALL USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users own their categories" ON public.categories;
CREATE POLICY "Users own their categories" ON public.categories FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their goals" ON public.goals;
CREATE POLICY "Users own their goals" ON public.goals FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their missions" ON public.missions;
CREATE POLICY "Users own their missions" ON public.missions FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their habits" ON public.habits;
CREATE POLICY "Users own their habits" ON public.habits FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their habit checkins" ON public.habit_checkins;
CREATE POLICY "Users own their habit checkins" ON public.habit_checkins FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their achievements" ON public.achievements;
CREATE POLICY "Users own their achievements" ON public.achievements FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their journal entries" ON public.journal_entries;
CREATE POLICY "Users own their journal entries" ON public.journal_entries FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their letters" ON public.dear_future_me;
CREATE POLICY "Users own their letters" ON public.dear_future_me FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their weekly reviews" ON public.weekly_reviews;
CREATE POLICY "Users own their weekly reviews" ON public.weekly_reviews FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their monthly reports" ON public.monthly_reports;
CREATE POLICY "Users own their monthly reports" ON public.monthly_reports FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their focus sessions" ON public.focus_sessions;
CREATE POLICY "Users own their focus sessions" ON public.focus_sessions FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their vision items" ON public.vision_board_items;
CREATE POLICY "Users own their vision items" ON public.vision_board_items FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their future goals" ON public.future_self_goals;
CREATE POLICY "Users own their future goals" ON public.future_self_goals FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their wheel assessments" ON public.life_balance_assessments;
CREATE POLICY "Users own their wheel assessments" ON public.life_balance_assessments FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their xp transactions" ON public.xp_transactions;
CREATE POLICY "Users own their xp transactions" ON public.xp_transactions FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their user badges" ON public.user_badges;
CREATE POLICY "Users own their user badges" ON public.user_badges FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their preferences" ON public.user_preferences;
CREATE POLICY "Users own their preferences" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users own their goal milestones" ON public.goal_milestones;
CREATE POLICY "Users own their goal milestones" ON public.goal_milestones
    FOR ALL USING (EXISTS (SELECT 1 FROM public.goals WHERE goals.id = goal_milestones.goal_id AND goals.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users own their mission subtasks" ON public.mission_subtasks;
CREATE POLICY "Users own their mission subtasks" ON public.mission_subtasks
    FOR ALL USING (EXISTS (SELECT 1 FROM public.missions WHERE missions.id = mission_subtasks.mission_id AND missions.user_id = auth.uid()));

DROP POLICY IF EXISTS "Users own their achievement evidence" ON public.achievement_evidence;
CREATE POLICY "Users own their achievement evidence" ON public.achievement_evidence
    FOR ALL USING (EXISTS (SELECT 1 FROM public.achievements WHERE achievements.id = achievement_evidence.achievement_id AND achievements.user_id = auth.uid()));

-- SEED BADGES
INSERT INTO public.badges (slug, title, description, icon_name, required_xp, criteria_json)
VALUES 
    ('first_mission', 'First Frontier', 'Completed your very first mission.', 'Compass', 30, '{"type": "missions_completed", "count": 1}'),
    ('streak_starter', 'Ignition Spark', 'Maintained a 7-day habit streak.', 'Flame', 100, '{"type": "habit_streak", "count": 7}'),
    ('deep_diver', 'Hyperfocus Flow', 'Completed 5 hours of deep focus sessions.', 'Zap', 150, '{"type": "focus_minutes", "count": 300}'),
    ('goal_crusher', 'Apex Victor', 'Successfully achieved a primary quarterly or annual goal.', 'Trophy', 300, '{"type": "goals_achieved", "count": 1}'),
    ('unstoppable_30', 'Unbreakable Momentum', 'Maintained a 30-day streak across core habits.', 'ShieldCheck', 500, '{"type": "habit_streak", "count": 30}')
ON CONFLICT (slug) DO NOTHING;
