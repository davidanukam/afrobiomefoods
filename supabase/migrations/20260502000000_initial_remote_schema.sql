/**
 * Remote schema for Afro Biome Foods (replaces prior Firestore collections).
 * Apply with Supabase CLI (`supabase db push`) or paste into SQL Editor.
 *
 * Admin flag: set via Dashboard → Authentication → Users → user → app_metadata: {"admin": true}
 * (never use user_metadata for authorization.)
 */

-- Document tables (flexible JSON matching prior Firestore docs)
create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid (),
  doc jsonb not null default '{}'::jsonb
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid (),
  doc jsonb not null default '{}'::jsonb
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid (),
  doc jsonb not null default '{}'::jsonb
);

create table if not exists public.community_posts (
  id uuid primary key default gen_random_uuid (),
  title text not null,
  content text not null,
  author_uid uuid not null references auth.users (id) on delete cascade,
  author_name text,
  language text not null default 'en',
  kind text not null default 'story',
  audience text,
  created_at timestamptz not null default now ()
);

alter table public.recipes enable row level security;
alter table public.events enable row level security;
alter table public.services enable row level security;
alter table public.community_posts enable row level security;

-- Public read for catalog content
create policy "recipes_select_public" on public.recipes for select using (true);

create policy "events_select_public" on public.events for select using (true);

create policy "services_select_public" on public.services for select using (true);

create policy "community_select_public" on public.community_posts for select using (true);

-- Admin writes (app_metadata.admin must be set server-side / Dashboard)
create policy "recipes_insert_admin" on public.recipes for insert
with check (coalesce((auth.jwt()->'app_metadata'->>'admin')::boolean, false));

create policy "recipes_update_admin" on public.recipes for update
using (coalesce((auth.jwt()->'app_metadata'->>'admin')::boolean, false))
with check (coalesce((auth.jwt()->'app_metadata'->>'admin')::boolean, false));

create policy "recipes_delete_admin" on public.recipes for delete
using (coalesce((auth.jwt()->'app_metadata'->>'admin')::boolean, false));

create policy "services_insert_admin" on public.services for insert
with check (coalesce((auth.jwt()->'app_metadata'->>'admin')::boolean, false));

create policy "services_update_admin" on public.services for update
using (coalesce((auth.jwt()->'app_metadata'->>'admin')::boolean, false))
with check (coalesce((auth.jwt()->'app_metadata'->>'admin')::boolean, false));

create policy "services_delete_admin" on public.services for delete
using (coalesce((auth.jwt()->'app_metadata'->>'admin')::boolean, false));

-- Events: read-only from clients (seed via Dashboard SQL or service role)
create policy "events_insert_admin" on public.events for insert
with check (coalesce((auth.jwt()->'app_metadata'->>'admin')::boolean, false));

create policy "events_update_admin" on public.events for update
using (coalesce((auth.jwt()->'app_metadata'->>'admin')::boolean, false))
with check (coalesce((auth.jwt()->'app_metadata'->>'admin')::boolean, false));

create policy "events_delete_admin" on public.events for delete
using (coalesce((auth.jwt()->'app_metadata'->>'admin')::boolean, false));

-- Community: owners manage their rows
create policy "community_insert_own" on public.community_posts for insert
with check (auth.uid() = author_uid);

create policy "community_update_own" on public.community_posts for update
using (auth.uid() = author_uid)
with check (auth.uid() = author_uid);

create policy "community_delete_own" on public.community_posts for delete
using (auth.uid() = author_uid);

-- Realtime (ignore errors if already member)
alter publication supabase_realtime add table public.recipes;

alter publication supabase_realtime add table public.events;

alter publication supabase_realtime add table public.services;

alter publication supabase_realtime add table public.community_posts;
