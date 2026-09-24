-- VAL Guide schema + RLS. Run in the Supabase SQL editor (or `supabase db push`), then run supabase/seed.sql.
create table public.profiles (id uuid primary key references auth.users(id) on delete cascade, role text not null default 'student' check (role in ('student','admin')), created_at timestamptz not null default now());
create function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$ select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin') $$;
create function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$ begin insert into public.profiles (id) values (new.id) on conflict do nothing; return new; end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.lessons (slug text primary key, title text not null, summary text not null default '', video_url text, minutes int not null default 5, position int not null default 0);
create table public.steps (id text primary key, lesson_slug text not null references public.lessons(slug) on delete cascade, position int not null, title text not null, body text not null);
create table public.quiz_questions (id text primary key, step_id text not null references public.steps(id) on delete cascade, question text not null, options jsonb not null, answer int not null, explanation text not null default '');
create table public.checklists (slug text primary key, title text not null, items jsonb not null, position int not null default 0);
create table public.parts (slug text primary key, name text not null, fn text not null, x int not null, y int not null, position int not null default 0);
create table public.faqs (id bigint generated always as identity primary key, q text not null unique, a text not null, position int not null default 0);
create table public.achievements (slug text primary key, title text not null, description text not null, criteria text not null, position int not null default 0);
create table public.progress (user_id uuid not null references auth.users(id) on delete cascade, step_id text not null references public.steps(id) on delete cascade, completed_at timestamptz not null default now(), primary key (user_id, step_id));
create table public.feedback (id bigint generated always as identity primary key, user_id uuid references auth.users(id) on delete set null, name text check (char_length(name) <= 80), rating int check (rating between 1 and 5), message text not null check (char_length(message) between 5 and 1000), created_at timestamptz not null default now());
create index on public.steps (lesson_slug);
create index on public.quiz_questions (step_id);

-- Learning content: everyone reads, only admins write.
do $$ declare t text; begin
 foreach t in array array['lessons','steps','quiz_questions','checklists','parts','faqs','achievements'] loop
  execute format('alter table public.%I enable row level security', t);
  execute format('create policy "public read" on public.%I for select using (true)', t);
  execute format('create policy "admin write" on public.%I for all using (public.is_admin()) with check (public.is_admin())', t);
 end loop;
end $$;

-- Profiles: read your own; only admins change roles (students cannot promote themselves).
alter table public.profiles enable row level security;
create policy "read own profile" on public.profiles for select using (id = (select auth.uid()) or public.is_admin());
create policy "admin updates profiles" on public.profiles for update using (public.is_admin()) with check (public.is_admin());

-- Progress: each student sees and writes only their own rows.
alter table public.progress enable row level security;
create policy "own progress read" on public.progress for select using (user_id = (select auth.uid()));
create policy "own progress insert" on public.progress for insert with check (user_id = (select auth.uid()));
create policy "own progress delete" on public.progress for delete using (user_id = (select auth.uid()));

-- Feedback: anyone can send (length limits enforced above); only admins read or delete.
alter table public.feedback enable row level security;
create policy "anyone sends feedback" on public.feedback for insert with check (user_id is null or user_id = (select auth.uid()));
create policy "admin reads feedback" on public.feedback for select using (public.is_admin());
create policy "admin deletes feedback" on public.feedback for delete using (public.is_admin());
