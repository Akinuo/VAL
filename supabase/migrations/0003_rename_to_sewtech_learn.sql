-- Rename the app inside the content tables: "VAL Guide" / "B.M.O" -> "SewTech Learn".
-- The seed file already uses the new name, but rows seeded earlier keep the old text.
-- Safe to run more than once: it only touches rows that still contain an old name.
-- Run in the Supabase SQL editor.

create or replace function public._rename_brand(t text) returns text language sql immutable as $$
  select replace(replace(replace(replace(t,
    'Basic Machine Operation (B.M.O)', 'SewTech Learn'),
    'B.M.O (Basic Machine Operation)', 'SewTech Learn'),
    'VAL Guide', 'SewTech Learn'),
    'B.M.O', 'SewTech Learn')
$$;

update public.lessons set title = public._rename_brand(title), summary = public._rename_brand(summary)
  where title || ' ' || summary ~ 'VAL Guide|B\.M\.O';

update public.steps set title = public._rename_brand(title), body = public._rename_brand(body)
  where title || ' ' || body ~ 'VAL Guide|B\.M\.O';

update public.quiz_questions
  set question = public._rename_brand(question),
      explanation = public._rename_brand(explanation),
      options = public._rename_brand(options::text)::jsonb
  where question || ' ' || explanation || ' ' || options::text ~ 'VAL Guide|B\.M\.O';

update public.checklists set title = public._rename_brand(title), items = public._rename_brand(items::text)::jsonb
  where title || ' ' || items::text ~ 'VAL Guide|B\.M\.O';

update public.parts set name = public._rename_brand(name), fn = public._rename_brand(fn)
  where name || ' ' || fn ~ 'VAL Guide|B\.M\.O';

update public.faqs set q = public._rename_brand(q), a = public._rename_brand(a)
  where q || ' ' || a ~ 'VAL Guide|B\.M\.O';

update public.achievements set title = public._rename_brand(title), description = public._rename_brand(description)
  where title || ' ' || description ~ 'VAL Guide|B\.M\.O';

drop function public._rename_brand(text);
