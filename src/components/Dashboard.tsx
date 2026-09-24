'use client'
import Link from 'next/link'
import { useProgress } from '@/lib/progress'
import { earned } from '@/lib/badges'
import type { Content } from '@/lib/content'
import { IconRibbon, IconPartMarker, IconCheck, IconQuestion, IconQr, IconMessage, IconPlay } from './icons'

const QUICK = [
  { href: '/parts',      Icon: IconPartMarker, label: 'Machine parts' },
  { href: '/checklists', Icon: IconCheck,       label: 'Checklists' },
  { href: '/faq',        Icon: IconQuestion,    label: 'FAQ' },
  { href: '/qr',         Icon: IconQr,          label: 'QR hub' },
  { href: '/feedback',   Icon: IconMessage,     label: 'Feedback' },
]

export default function Dashboard({ c }: { c: Content }) {
  const { done, email } = useProgress()

  const allStepIds = c.lessons.flatMap(l => l.steps.map(s => s.id))
  const completedSteps = allStepIds.filter(id => done.has(id)).length
  const pct = allStepIds.length ? Math.round((completedSteps / allStepIds.length) * 100) : 0
  const earnedBadges = earned(c, done)
  const firstName = email ? email.split('@')[0] : null

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
          <p className="eyebrow mb-1">Dashboard</p>
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

      {/* ── Continue / Start banner ── */}
      {promptLesson && (
        <Link
          href={`/lessons/${promptLesson.slug}`}
          className="group flex items-center gap-4 rounded-lg border border-amber-border bg-amber-soft px-5 py-4 transition-colors hover:border-amber"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-denim text-white">
            <IconPlay className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-amber">
              {continueLesson ? 'Continue where you left off' : 'Start here'}
            </p>
            <p className="mt-0.5 font-display text-base font-semibold text-ink group-hover:text-denim">
              {promptLesson.title}
            </p>
          </div>
          <span className="shrink-0 text-xl text-muted group-hover:text-denim" aria-hidden>›</span>
        </Link>
      )}

      {/* ── Progress ── */}
      <section aria-labelledby="prog-heading">
        <h2 id="prog-heading" className="font-display text-lg font-semibold text-denim">Overall progress</h2>
        <div className="mt-3 card p-4">
          <div className="flex items-center gap-4">
            <div
              role="progressbar"
              aria-label="Overall progress"
              aria-valuenow={pct}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2.5 flex-1 overflow-hidden rounded-full bg-amber-soft"
            >
              <div
                className="h-full rounded-full bg-amber transition-[width] duration-500"
                style={{ width: pct + '%' }}
              />
            </div>
            <span className="shrink-0 font-display text-2xl font-bold tabular-nums text-denim">{pct}%</span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted">
            <span>{completedSteps} of {allStepIds.length} steps</span>
            <span aria-hidden>·</span>
            <span>{c.lessons.filter(l => l.steps.length > 0 && l.steps.every(s => done.has(s.id))).length} of {c.lessons.length} lessons</span>
            <span aria-hidden>·</span>
            <span>{earnedBadges.size} of {c.achievements.length} badges</span>
          </div>
        </div>
      </section>

      {/* ── Quick access ── */}
      <section aria-labelledby="quick-heading">
        <h2 id="quick-heading" className="font-display text-lg font-semibold text-denim">Quick access</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
          {QUICK.map(({ href, Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-paper px-3 py-4 text-center transition-colors hover:border-denim/30 hover:bg-denim-light"
            >
              <Icon className="h-5 w-5 text-denim" />
              <span className="text-xs font-medium text-muted group-hover:text-denim">{label}</span>
            </Link>
          ))}
        </div>
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
                    <p className="mt-0.5 text-xs text-muted">{l.summary}</p>
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
      <section aria-labelledby="badges-heading">
        <h2 id="badges-heading" className="font-display text-lg font-semibold text-denim">Badges</h2>
        {earnedBadges.size === 0 && (
          <p className="mt-1 text-sm text-muted">Complete lessons to earn badges.</p>
        )}
        <ul className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {c.achievements.map(a => {
            const y = earnedBadges.has(a.slug)
            return (
              <li
                key={a.slug}
                className={`flex items-start gap-3 rounded-lg border p-3 ${
                  y
                    ? 'border-green-border bg-green-soft'
                    : 'border-dashed border-border bg-paper opacity-60'
                }`}
              >
                <IconRibbon className={`mt-0.5 h-4 w-4 shrink-0 ${y ? 'text-green' : 'text-muted'}`} />
                <div>
                  <p className="text-sm font-semibold text-ink">{a.title}</p>
                  <p className="text-xs text-muted">{a.description}</p>
                  {y && <span className="mt-1.5 chip-green">Earned</span>}
                </div>
              </li>
            )
          })}
        </ul>
      </section>

    </div>
  )
}
