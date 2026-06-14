-- ============================================================================
--  "Čeka se devojčica" — Supabase schema + RLS
--  Run this in the Supabase SQL editor (it runs as owner, so it bypasses RLS
--  for the seed inserts below).
-- ============================================================================

-- ---------------------------------------------------------------------------
--  Tables
-- ---------------------------------------------------------------------------

-- single-row config
create table if not exists config (
  id int primary key default 1,
  due_date date,
  predictions_locked boolean default false,
  reveal_shortlist boolean default false,
  capsule_unlock_date date
);
-- Seed with the family's termin (1. decembar 2026); parents can change it in /admin.
insert into config (id, due_date) values (1, '2026-12-01') on conflict (id) do nothing;

create table if not exists name_suggestions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  note text,
  suggested_by text,
  suggested_by_avatar text,
  created_at timestamptz default now()
);

create table if not exists name_likes (
  id uuid primary key default gen_random_uuid(),
  name_id uuid references name_suggestions(id) on delete cascade,
  voter_id text not null,
  voter_name text,
  voter_avatar text,
  created_at timestamptz default now(),
  unique (name_id, voter_id)
);

-- Parents' secret shortlist — never readable by the anon client (no RLS policy
-- below grants it). Only the service role (via /api/admin/* and /api/reveal)
-- can touch it, so the surprise holds until "Veliko otkrivanje".
create table if not exists parents_shortlist (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

create table if not exists predictions (
  visitor_id text primary key,
  predictor_name text not null,
  predictor_avatar text,
  birth_date date,
  weight_grams int,
  length_cm numeric,
  hair_color text,
  eye_color text,
  temperament text,
  resembles text,
  birth_time time,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists baby_actual (
  id int primary key default 1,
  birth_date date,
  weight_grams int,
  length_cm numeric,
  hair_color text,
  eye_color text,
  temperament text,
  resembles text,
  birth_time time
);
insert into baby_actual (id) values (1) on conflict (id) do nothing;

create table if not exists wishes (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_avatar text,
  message text not null,
  unlock_date date,
  created_at timestamptz default now()
);

-- Private "letters for the baby (to read when she grows up)". Anyone can WRITE,
-- but only the parents (service role) can READ the content — there is NO anon
-- select policy on purpose. The family only sees count + authors via /api/letters/summary.
create table if not exists letters (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_avatar text,
  message text not null,
  created_at timestamptz default now()
);
alter table letters enable row level security;
drop policy if exists "letters insert" on letters;
create policy "letters insert" on letters
  for insert to anon, authenticated with check (true);
-- (no select policy -> anon cannot read letter content; service role bypasses RLS for parents)

-- Idempotent avatar columns (for databases created before avatars were added).
alter table name_suggestions add column if not exists suggested_by_avatar text;
alter table name_likes       add column if not exists voter_avatar text;
alter table predictions      add column if not exists predictor_avatar text;
alter table wishes           add column if not exists author_avatar text;

-- Eye-colour prediction (added after the first version).
alter table predictions add column if not exists eye_color text;
alter table baby_actual add column if not exists eye_color text;

-- Personality/temperament prediction (drives the live baby's expression).
alter table predictions add column if not exists temperament text;
alter table baby_actual add column if not exists temperament text;

-- Keep predictions.updated_at fresh on upsert/update.
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists predictions_set_updated_at on predictions;
create trigger predictions_set_updated_at
  before update on predictions
  for each row execute function set_updated_at();

-- ---------------------------------------------------------------------------
--  Row Level Security
--  Private family app, no auth. The anon key is public, so policies are
--  intentionally permissive — but writes are limited to what each feature
--  needs, and admin/secret tables are closed to anon entirely (service role
--  bypasses RLS for those).
-- ---------------------------------------------------------------------------

alter table config             enable row level security;
alter table name_suggestions   enable row level security;
alter table name_likes         enable row level security;
alter table parents_shortlist  enable row level security;
alter table predictions        enable row level security;
alter table baby_actual        enable row level security;
alter table wishes             enable row level security;

-- config: read-only for everyone; admin writes go through the service role.
drop policy if exists "config read" on config;
create policy "config read" on config
  for select to anon, authenticated using (true);

-- name_suggestions: anyone can read and add a suggestion.
drop policy if exists "names read" on name_suggestions;
create policy "names read" on name_suggestions
  for select to anon, authenticated using (true);
drop policy if exists "names insert" on name_suggestions;
create policy "names insert" on name_suggestions
  for insert to anon, authenticated with check (true);

-- name_likes: read, like (insert), and unlike (delete).
drop policy if exists "likes read" on name_likes;
create policy "likes read" on name_likes
  for select to anon, authenticated using (true);
drop policy if exists "likes insert" on name_likes;
create policy "likes insert" on name_likes
  for insert to anon, authenticated with check (true);
drop policy if exists "likes delete" on name_likes;
create policy "likes delete" on name_likes
  for delete to anon, authenticated using (true);

-- parents_shortlist: NO anon policy on purpose -> only the service role can
-- read or write it. Keeps the parents' picks secret until reveal.

-- predictions: read all; insert + update (upsert by visitor_id).
drop policy if exists "predictions read" on predictions;
create policy "predictions read" on predictions
  for select to anon, authenticated using (true);
drop policy if exists "predictions insert" on predictions;
create policy "predictions insert" on predictions
  for insert to anon, authenticated with check (true);
drop policy if exists "predictions update" on predictions;
create policy "predictions update" on predictions
  for update to anon, authenticated using (true) with check (true);

-- baby_actual: read-only for everyone; admin enters values via service role.
drop policy if exists "baby_actual read" on baby_actual;
create policy "baby_actual read" on baby_actual
  for select to anon, authenticated using (true);

-- wishes: read all + add a wish.
drop policy if exists "wishes read" on wishes;
create policy "wishes read" on wishes
  for select to anon, authenticated using (true);
drop policy if exists "wishes insert" on wishes;
create policy "wishes insert" on wishes
  for insert to anon, authenticated with check (true);

-- ---------------------------------------------------------------------------
--  Realtime — live leaderboard, live lock/reveal, live scoreboard + wishes.
--  (parents_shortlist is intentionally NOT published — it stays secret.)
-- ---------------------------------------------------------------------------
do $$
declare
  t text;
begin
  foreach t in array array[
    'name_suggestions', 'name_likes', 'config', 'predictions', 'baby_actual', 'wishes'
  ] loop
    begin
      execute format('alter publication supabase_realtime add table %I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
