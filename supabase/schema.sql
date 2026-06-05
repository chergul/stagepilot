-- Users table (synced from Clerk via webhook)
create table if not exists public.users (
  id text primary key, -- Clerk user ID
  email text not null unique,
  credits integer not null default 3,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro', 'agency')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Projects table
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  name text not null default 'Untitled Project',
  status text not null default 'pending' check (status in ('pending', 'analyzing', 'removing', 'staging', 'completed', 'failed')),
  room_type text check (room_type in ('living_room', 'bedroom', 'kitchen', 'bathroom', 'dining_room', 'office', 'other')),
  design_style text check (design_style in ('modern', 'minimalist', 'scandinavian', 'luxury', 'bohemian', 'traditional', 'industrial')),
  original_image_url text not null,
  empty_room_image_url text,
  staged_image_url text,
  twilight_image_url text,
  enhanced_image_url text,
  analysis_data jsonb,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Credit transactions table
create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id text not null references public.users(id) on delete cascade,
  amount integer not null, -- positive = add, negative = deduct
  type text not null check (type in ('purchase', 'usage', 'refund', 'bonus')),
  process_type text,
  project_id uuid references public.projects(id) on delete set null,
  description text,
  created_at timestamptz not null default now()
);

-- Indexes
create index if not exists projects_user_id_idx on public.projects(user_id);
create index if not exists projects_created_at_idx on public.projects(created_at desc);
create index if not exists credit_transactions_user_id_idx on public.credit_transactions(user_id);

-- RLS policies
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.credit_transactions enable row level security;

-- Users can only read/update their own profile
create policy "Users can view own profile" on public.users for select using (id = auth.uid()::text);
create policy "Users can update own profile" on public.users for update using (id = auth.uid()::text);

-- Users can only CRUD their own projects
create policy "Users can view own projects" on public.projects for select using (user_id = auth.uid()::text);
create policy "Users can insert own projects" on public.projects for insert with check (user_id = auth.uid()::text);
create policy "Users can update own projects" on public.projects for update using (user_id = auth.uid()::text);
create policy "Users can delete own projects" on public.projects for delete using (user_id = auth.uid()::text);

-- Users can only view their own transactions
create policy "Users can view own transactions" on public.credit_transactions for select using (user_id = auth.uid()::text);

-- Function to deduct credits atomically
create or replace function public.deduct_credits(
  p_user_id text,
  p_amount integer,
  p_process_type text,
  p_project_id uuid default null
) returns boolean language plpgsql security definer as $$
declare
  v_credits integer;
begin
  select credits into v_credits from public.users where id = p_user_id for update;
  if v_credits < p_amount then
    return false;
  end if;
  update public.users set credits = credits - p_amount, updated_at = now() where id = p_user_id;
  insert into public.credit_transactions (user_id, amount, type, process_type, project_id, description)
  values (p_user_id, -p_amount, 'usage', p_process_type, p_project_id, 'AI processing: ' || p_process_type);
  return true;
end;
$$;
