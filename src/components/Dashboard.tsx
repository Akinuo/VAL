'use client'
import Link from 'next/link'
import { useProgress } from '@/lib/progress'
import { earned } from '@/lib/badges'
import type { Content } from '@/lib/content'
import { IconRibbon } from './icons'

export default function Dashboard({ c }: { c: Content }) {
  const { done, email, displayName, loading } = useProgress()

  const allStepIds = c.lessons.flatMap(l => l.steps.map(s => s.id))
  const completedSteps = allStepIds.filter(id => done.has(id)).length
  const pct = allStepIds.length ? Math.round((completedSteps / allStepIds.length) * 100) : 0
  const earnedBadges = earned(c, done)
  const firstName = displayName || (email ? email.split('@')[0] : null)

  if (loading) return <DashboardSkeleton />

  // Most recently started but not finished lesson
  const continueLesson = c.lessons.find(l =>
    l.steps.some(s => done.has(s.id)) && !l.steps.every(s => done.has(s.id))
  )

  // Next unstarted lesson
  const nextLesson = !continueLesson
    ? c.lessons.find(l => l.steps.length > 0 && !l.steps.some(s => done.has(s.id)))
    : null

  const promptLesson = continueLesson ?? nextLesson

  return (
    <div className="grid gap-8 fade-in">

      {/* ── Welcome ── */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-denim sm:text-3xl">
            {firstName ? `Welcome back, ${firstName}` : 'Your learning dashboard'}
          </h1>
          <p className="mt-1 text-sm text-muted">
            {pct === 0
              ? 'Start your first lesson below.'
              : pct === 100
              ? 'All lessons complete — well done!'
              : `${completedSteps} of ${allStepIds.length} steps completed.`}
          </p>
        </div>
        {!email && (
          <Link href="/login" className="btn-outline self-start text-sm sm:self-auto">
            Log in to sync progress
          </Link>
        )}
      </div>

      {/* ── Where you are ── */}
      <section className="rounded-lg bg-denim p-5 text-white sm:p-6">
        <p className="text-sm text-white/70">
          {promptLesson ? (continueLesson ? 'Pick up where you left off' : 'Your first lesson') : 'Every lesson is done'}
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold leading-tight sm:text-3xl">
          {promptLesson ? promptLesson.title : 'You have finished the course.'}
        </h2>

        {/* Progress is stitched: the gold thread fills in as steps are passed */}
        <div
          role="progressbar"
          aria-label="Overall progress"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
          className="relative mt-6 h-1.5"
        >
          <div className="absolute inset-0 rounded-full opacity-30" style={{ background: 'repeating-linear-gradient(90deg,#fff 0 10px,transparent 10px 16px)' }} />
          <div className="absolute inset-y-0 left-0 overflow-hidden transition-[width] duration-700" style={{ width: pct + '%' }}>
            <div className="h-full w-[100vw]" style={{ background: 'repeating-linear-gradient(90deg,#E59B1C 0 10px,transparent 10px 16px)' }} />
          </div>
        </div>
        <p className="mt-2 text-sm text-white/80">
          {completedSteps} of {allStepIds.length} steps done, {earnedBadges.size} of {c.achievements.length} badges earned
        </p>

        {promptLesson && (
          <Link href={`/lessons/${promptLesson.slug}`} className="btn mt-5 !bg-thread !text-ink hover:!bg-amber-border">
            {continueLesson ? 'Continue lesson' : 'Start lesson'}
          </Link>
        )}
      </section>

      {/* ── Lessons ── */}
      <section id="lessons" aria-labelledby="lessons-heading" className="scroll-mt-4">
        <h2 id="lessons-heading" className="font-display text-lg font-semibold text-denim">Lessons</h2>
        <ol className="mt-3 divide-y divide-border rounded-lg border border-border bg-paper">
          {c.lessons.map((l, i) => {
            const doneCount = l.steps.filter(s => done.has(s.id)).length
            const full = doneCount === l.steps.length && l.steps.length > 0
            const lPct = l.steps.length ? Math.round((doneCount / l.steps.length) * 100) : 0
            return (
              <li key={l.slug}>
                <Link
                  href={`/lessons/${l.slug}`}
                  className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-denim-light"
                >
                  <span
                    aria-hidden="true"
                    className={`grid h-8 w-8 shrink-0 place-items-center rounded-full border font-display text-sm font-semibold transition-colors ${
                      full
                        ? 'border-green bg-green text-white'
                        : 'border-denim/30 text-denim group-hover:border-denim'
                    }`}
                  >
                    {full ? '✓' : i + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-ink group-hover:text-denim">{l.title}</span>
                      {full && <span className="chip-green">Complete</span>}
                    </div>
                    <p className="mt-0.5 text-sm text-muted">{l.summary}</p>
                    {lPct > 0 && !full && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-amber-soft">
                          <div className="h-full rounded-full bg-amber" style={{ width: lPct + '%' }} />
                        </div>
                        <span className="shrink-0 text-xs text-muted">{doneCount}/{l.steps.length}</span>
                      </div>
                    )}
                  </div>
                  <span className="shrink-0 text-lg text-muted group-hover:text-denim" aria-hidden>›</span>
                </Link>
              </li>
            )
          })}
        </ol>
      </section>

      {/* ── Badges ── */}
      <details className="group rounded-lg border border-border bg-paper">
        <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 font-display text-lg font-semibold text-denim">
          Badges
          <span className="text-sm font-normal text-muted">{earnedBadges.size} of {c.achievements.length} earned</span>
        </summary>
        <ul className="grid gap-2 border-t border-border p-4 sm:grid-cols-2">
          {c.achievements.map(a => {
            const y = earnedBadges.has(a.slug)
            return (
              <li key={a.slug} className={`flex items-start gap-3 rounded p-3 ${y ? 'bg-green-soft' : 'bg-chalk'}`}>
                <IconRibbon className={`mt-0.5 h-5 w-5 shrink-0 ${y ? 'text-green' : 'text-muted/50'}`} />
                <div>
                  <p className={`font-semibold ${y ? 'text-ink' : 'text-muted'}`}>{a.title}</p>
                  <p className="text-sm text-muted">{a.description}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </details>

    </div>
  )
}

// Shown briefly while the session (and any saved progress) resolves, so
// signed-in users never see a flash of the guest-state dashboard.
function DashboardSkeleton() {
  return (
    <div className="grid gap-8 fade-in" aria-hidden="true">
      <div className="grid gap-2">
        <div className="h-7 w-56 animate-pulse rounded bg-denim-light" />
        <div className="h-4 w-40 animate-pulse rounded bg-denim-light" />
      </div>
      <div className="h-40 animate-pulse rounded-lg bg-denim-light sm:h-44" />
      <div className="grid gap-3">
        <div className="h-5 w-24 animate-pulse rounded bg-denim-light" />
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-[72px] animate-pulse bg-paper" style={{ animationDelay: `${i * 75}ms` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
