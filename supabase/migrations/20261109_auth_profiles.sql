-- ====================================================================
-- MISSION OS — Production Authentication & User Profiles Schema
-- Migration: 20261109_auth_profiles.sql
-- ====================================================================

-- 1. Create public.profiles table
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  phone text,
  avatar_url text,
  auth_provider text default 'email',
  onboarding_completed boolean default false,
  level text default 'Beginner',
  xp integer default 100,
  created_at timestamptz default timezone('utc'::text, now()) not null,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- Index for fast lookup by email or phone
create index if not exists idx_profiles_email on public.profiles(email);
create index if not exists idx_profiles_phone on public.profiles(phone);

-- 2. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;

-- Policy: Users can view their own profile
create policy "Users can view own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

-- Policy: Users can insert their own profile
create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Policy: Users can update their own profile
create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- 3. Automatic profile creation trigger on auth.users insert
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  provider_name text;
  user_full_name text;
  user_avatar text;
  has_name boolean;
begin
  -- Extract provider from raw metadata
  provider_name := coalesce(
    new.raw_app_meta_data->>'provider',
    new.raw_user_meta_data->>'provider',
    case 
      when new.phone is not null and new.phone <> '' then 'phone'
      else 'email'
    end
  );

  -- Extract user display name from Google / OAuth / Email metadata
  user_full_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'user_name',
    ''
  );

  -- Extract avatar URL if provided by OAuth provider
  user_avatar := coalesce(
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'picture',
    ''
  );

  has_name := (user_full_name is not null and length(trim(user_full_name)) > 0);

  insert into public.profiles (
    id,
    full_name,
    email,
    phone,
    avatar_url,
    auth_provider,
    onboarding_completed,
    level,
    xp,
    created_at,
    updated_at
  )
  values (
    new.id,
    user_full_name,
    new.email,
    new.phone,
    user_avatar,
    provider_name,
    has_name, -- Automatically mark completed if name is provided (e.g. Google OAuth)
    'Explorer',
    150,
    now(),
    now()
  )
  on conflict (id) do update set
    email = coalesce(excluded.email, public.profiles.email),
    phone = coalesce(excluded.phone, public.profiles.phone),
    full_name = case 
      when public.profiles.full_name is null or public.profiles.full_name = '' 
      then excluded.full_name 
      else public.profiles.full_name 
    end,
    avatar_url = coalesce(nullif(excluded.avatar_url, ''), public.profiles.avatar_url),
    auth_provider = coalesce(excluded.auth_provider, public.profiles.auth_provider),
    updated_at = now();

  return new;
end;
$$;

-- Trigger firing on every new user in auth.users
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Trigger for automatic updated_at timestamp
create or replace function public.set_current_timestamp_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_current_timestamp_updated_at();

