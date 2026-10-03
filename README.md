# B.M.O — Basic Machine Operation (also known as B.M.O)

Mobile-first self-learning app for BTLED Home Economics students. Next.js 14 (App Router) + TypeScript + Tailwind, Supabase Free (Postgres + Auth), Vercel Free.

## Run it locally
1. `npm install`
2. Create a Supabase project. In **SQL Editor**, run `supabase/migrations/0001_init.sql`, then `supabase/seed.sql`.
3. `cp .env.example .env.local` and paste your project URL and **anon** key (Project Settings > API). Never use the service_role key in this app.
4. `npm run dev` and open http://localhost:3000

Without step 3 the app still runs on the bundled content in `src/data/content.json` (progress stays on the device; login and feedback are disabled).

## Deploy to Vercel
1. Push this folder to a Git repo and import it in Vercel (framework: Next.js, no extra settings).
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` under Project Settings > Environment Variables.
3. In Supabase > Authentication > URL Configuration, set the Site URL to your Vercel domain.

## Editing content and admin access
- Videos: set `lessons.video_url` to a YouTube (unlisted) link in the Supabase Table Editor. Only the URL is stored. Every lesson ships with no video so you can add your own.
- Make an admin: sign up in the app, then run `update public.profiles set role = 'admin' where id = '<user uuid>';`. Admin RLS policies then allow editing lessons, steps, quizzes, checklists, parts, FAQs, achievements and reading feedback (through the Supabase dashboard or API).
- `npm run seed` regenerates `supabase/seed.sql` from `src/data/content.json`.
- Content pages are ISR (`revalidate = 3600`), so edits made straight in the Supabase Table Editor can take up to an hour to appear — or never, if the deploy that last built the page predates your edit. To see changes immediately:
  1. Add `REVALIDATE_SECRET` (any random string) in Vercel > Project Settings > Environment Variables, and redeploy once so it's live.
  2. In Supabase > Database > Webhooks, add a webhook per content table (`lessons`, `steps`, `quiz_questions`, `checklists`, `parts`, `faqs`, `achievements`) for INSERT/UPDATE/DELETE, type "HTTP Request", method POST, URL `https://<your-domain>/api/revalidate`, with an HTTP header `x-revalidate-secret: <REVALIDATE_SECRET>`.
  3. Or trigger it by hand after an edit: `curl -X POST -H "x-revalidate-secret: <REVALIDATE_SECRET>" "https://<your-domain>/api/revalidate"`.

## Quiz content
Lessons, steps and quiz questions come from `QUIZ.docx` (8 videos x 5 questions). Each lesson has five steps, and each step ends with one quiz question. Step text summarises what the answer key tests; check it against your videos. Quiz explanations are empty, so a correct answer just shows "Correct." Fill `quiz_questions.explanation` to add more.

**If you already ran the first seed**, clear the old sample content before running the new one:
`delete from public.lessons where slug in ('bobbin-winding','threading','tension'); delete from public.achievements;`

## Free-tier design notes
- Content pages are statically generated and revalidated hourly, so Supabase sees a handful of reads per hour, not one per visitor.
- A signed-in student costs one read at login and one small upsert per newly passed step. No polling, no realtime, no uploads.
- Badges are derived from progress (no extra writes). Videos load only after the student presses play.
- Quiz answers are readable by the browser (needed for instant feedback), so treat quizzes as practice, not graded tests.

## Not included yet
In-app admin screens (use the Supabase dashboard), PWA/offline caching, and syncing checklist ticks to Supabase (they stay on the device).
