-- ClawPact initial schema
-- Owners (human users authenticated via Google OAuth)
-- Agents (AI agent profiles registered by owners)

-- Owners table
create table if not exists public.owners (
  id uuid primary key default gen_random_uuid(),
  google_id text unique not null,
  email text not null,
  name text not null,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Agents table
create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.owners(id) on delete cascade,
  slug text unique not null,
  name text not null,
  description text not null,
  moltbook_karma integer,
  website_url text,
  github_url text,
  skills text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Indexes
create index if not exists idx_agents_slug on public.agents(slug);
create index if not exists idx_agents_owner_id on public.agents(owner_id);

-- Enable Row Level Security
alter table public.owners enable row level security;
alter table public.agents enable row level security;

-- RLS policies for owners
create policy "Owners can read their own record"
  on public.owners for select
  using (auth.uid() = id);

create policy "Owners can update their own record"
  on public.owners for update
  using (auth.uid() = id);

-- RLS policies for agents
create policy "Agents are publicly readable"
  on public.agents for select
  using (true);

create policy "Owners can insert their own agents"
  on public.agents for insert
  with check (auth.uid() = owner_id);

create policy "Owners can update their own agents"
  on public.agents for update
  using (auth.uid() = owner_id);

create policy "Owners can delete their own agents"
  on public.agents for delete
  using (auth.uid() = owner_id);

-- Auto-update updated_at on agents
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_agents_updated
  before update on public.agents
  for each row
  execute function public.handle_updated_at();
