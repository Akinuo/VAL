'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useProgress } from '@/lib/progress'
import type { Lesson } from '@/lib/content'
import { IconCheck } from './icons'

const embed = (u: string) => {
  const yt = u.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?cc_load_policy=1&rel=0&playsinline=1&autoplay=1`
  const drive = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (drive) return `https://drive.google.com/file/d/${drive[1]}/preview?autoplay=1`
  return u
}

export default function LessonPlayer({ lesson }: { lesson: Lesson }) {
  const { done, mark } = useProgress()
  const [stepIndex, setStepIndex] = useState(0)
  const [pick, setPick] = useState<number | null>(null)
  const [vid, setVid] = useState(false)
  const [vidLoaded, setVidLoaded] = useState(false)

  const step = lesson.steps[stepIndex]
  const quiz = step.quiz_questions?.[0]
  const isCorrect = quiz != null && pick === quiz.answer
  const isLast = stepIndex === lesson.steps.length - 1
  const alreadyPassed = done.has(step.id)
  const passedCount = lesson.steps.filter(s => done.has(s.id)).length
  const lessonPct = lesson.steps.length ? Math.round((passedCount / lesson.steps.length) * 100) : 0

  function goToStep(n: number) {
    setStepIndex(n)
    setPick(null)
  }

  function choose(n: number) {
    setPick(n)
    if (quiz && n === quiz.answer) mark(step.id)
  }

  const canAdvance = isCorrect || alreadyPassed

  return (
    <article className="grid gap-6 fade-in">

      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/home" className="transition-colors hover:text-denim">Home</Link>
        <span aria-hidden="true">›</span>
        <span className="truncate text-ink">{lesson.title}</span>
      </nav>

      {/* Lesson header */}
      <div>
        <h1 className="font-display text-2xl font-bold text-denim sm:text-3xl">{lesson.title}</h1>
        <p className="mt-1 text-sm text-muted">{lesson.summary}</p>
        <div className="mt-3 flex items-center gap-3">
          <div
            role="progressbar"
            aria-label="Lesson progress"
            aria-valuenow={lessonPct}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-1.5 flex-1 overflow-hidden rounded-full bg-amber-soft"
          >
            <div
              className="h-full rounded-full bg-amber transition-[width] duration-500"
              style={{ width: lessonPct + '%' }}
            />
          </div>
          <span className="shrink-0 text-xs text-muted">{passedCount}/{lesson.steps.length} steps</span>
        </div>
      </div>

      {/* Video */}
      <div
        className={`w-full max-w-full overflow-hidden rounded-lg border border-border ${lesson.video_url ? 'bg-ink' : 'bg-denim-light'}`}
        style={lesson.video_url ? { aspectRatio: '16/9', maxWidth: '100%' } : { maxWidth: '100%' }}
      >
        {lesson.video_url ? (
          vid ? (
            <div className="relative h-full w-full max-w-full">
              {!vidLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-ink">
                  <span
                    className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-amber"
                    role="status"
                    aria-label="Loading video"
                  />
                </div>
              )}
              <iframe
                className="block h-full w-full max-w-full"
                style={{ border: 0 }}
                src={embed(lesson.video_url)}
                title={`${lesson.title} — video`}
                loading="eager"
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
                onLoad={() => setVidLoaded(true)}
              />
            </div>
          ) : (
            <button
              className="flex h-full w-full flex-col items-center justify-center gap-3 text-center px-6 active:bg-white/5"
              onClick={() => { setVidLoaded(false); setVid(true) }}
              aria-label="Play video"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
                <svg viewBox="0 0 24 24" className="h-7 w-7 text-amber" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="text-sm font-medium text-white">Play video</span>
              <span className="text-xs text-white/40">Tap once here, then press play in the video</span>
            </button>
          )
        ) : (
          <div className="px-4 py-3">
            <p className="text-sm text-muted">This lesson has no video yet. Follow the steps below.</p>
          </div>
        )}
      </div>

      {/* Step navigator */}
      <div>
        <p className="mb-2 text-sm font-medium text-muted">Steps</p>
        <ol aria-label="Lesson steps" className="flex flex-wrap gap-2">
          {lesson.steps.map((s, n) => (
            <li key={s.id}>
              <button
                onClick={() => goToStep(n)}
                aria-current={n === stepIndex ? 'step' : undefined}
                aria-label={`Step ${n + 1}${done.has(s.id) ? ', completed' : ''}`}
                className={`grid h-10 w-10 place-items-center rounded-full border font-display text-sm font-semibold transition-all duration-150 ${
                  n === stepIndex
                    ? 'border-denim bg-denim text-white scale-110'
                    : done.has(s.id)
                    ? 'border-green bg-green-soft text-green'
                    : 'border-border bg-paper text-muted hover:border-denim/40 hover:text-denim'
                }`}
              >
                {done.has(s.id) && n !== stepIndex ? <IconCheck className="h-3.5 w-3.5" /> : n + 1}
              </button>
            </li>
          ))}
        </ol>
      </div>

      {/* Step content */}
      <section aria-labelledby="step-title" className="rounded-lg border border-border bg-paper">
        <div className="border-b border-border px-5 py-4">
          <p className="eyebrow mb-1">Step {stepIndex + 1} of {lesson.steps.length}</p>
          <h2 id="step-title" className="font-display text-xl font-semibold text-denim">{step.title}</h2>
        </div>

        <div className="px-5 py-4">
          <p className="max-w-prose leading-relaxed text-ink">{step.body}</p>

          {/* Already passed notice */}
          {alreadyPassed && !pick && (
            <p className="mt-4 flex items-center gap-2 text-sm text-green">
              <IconCheck className="h-4 w-4 shrink-0" />
              You already passed this step.
            </p>
          )}

          {/* Quiz */}
          {quiz && (
            <fieldset className="mt-5 border-t border-border pt-4">
              <legend className="font-semibold text-ink">{quiz.question}</legend>
              <div className="mt-3 grid gap-2">
                {quiz.options.map((option, n) => {
                  const chosen = pick === n
                  const correct = n === quiz.answer
                  let cls = 'opt'
                  if (pick !== null) {
                    if (chosen && correct)
                      cls = 'block w-full rounded border border-green-border bg-green-soft px-4 py-2.5 text-left text-sm font-medium text-green'
                    else if (chosen)
                      cls = 'block w-full rounded border border-red-border bg-red-soft px-4 py-2.5 text-left text-sm font-medium text-red'
                    else
                      cls = 'block w-full rounded border border-border bg-paper px-4 py-2.5 text-left text-sm text-muted'
                  }
                  return (
                    <button
                      key={option}
                      className={cls}
                      style={{ minHeight: '44px' }}
                      aria-pressed={chosen}
                      disabled={pick !== null}
                      onClick={() => choose(n)}
                    >
                      {option}
                    </button>
                  )
                })}
              </div>
            </fieldset>
          )}

          {/* Feedback */}
          <div aria-live="polite" className="mt-3 min-h-[2.5rem]">
            {pick !== null && quiz && (
              isCorrect ? (
                <p className="alert-ok flex items-center gap-2">
                  <IconCheck className="h-4 w-4 shrink-0" />
                  Correct!{quiz.explanation ? ` ${quiz.explanation}` : ''}
                </p>
              ) : (
                <p className="alert-err">
                  Not quite — re-read the step, then{' '}
                  <button className="underline underline-offset-2" onClick={() => setPick(null)}>
                    try again
                  </button>.
                </p>
              )
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap gap-2 border-t border-border px-5 py-4">
          {stepIndex > 0 && (
            <button className="btn-outline" onClick={() => goToStep(stepIndex - 1)}>
              ← Previous
            </button>
          )}
          {isLast ? (
            <Link href="/home" className="btn">Back to home</Link>
          ) : (
            <button
              className="btn"
              disabled={!canAdvance}
              onClick={() => goToStep(stepIndex + 1)}
              title={!canAdvance ? 'Answer the quiz question to continue' : undefined}
            >
              Next step
            </button>
          )}
        </div>
      </section>

    </article>
  )
}
