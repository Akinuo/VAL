-- Final assessment results. Run after 0001_init.sql, in the Supabase SQL editor (or `supabase db push`).
-- One row per student holding their best attempt so far (see progress.tsx: a
-- retake only overwrites this row when it scores at least as well).
create table public.assessment_attempts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  score int not null,
  total int not null,
  passed boolean not null default false,
  completed_at timestamptz not null default now()
);

-- Same shape as progress: each student reads/writes only their own row.
-- Admins can additionally read every row, e.g. to check who's certified.
alter table public.assessment_attempts enable row level security;
create policy "own assessment read" on public.assessment_attempts for select using (user_id = (select auth.uid()));
create policy "admin reads assessment attempts" on public.assessment_attempts for select using (public.is_admin());
create policy "own assessment insert" on public.assessment_attempts for insert with check (user_id = (select auth.uid()));
create policy "own assessment update" on public.assessment_attempts for update using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
