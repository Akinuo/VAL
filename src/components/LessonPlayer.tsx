'use client'
import { useEffect, useId, useRef, useState } from 'react'
import Link from 'next/link'
import { useProgress } from '@/lib/progress'
import type { Lesson } from '@/lib/content'
import { isLessonFull, unlockedFlags } from '@/lib/lessons'
import { IconCheck, IconLock } from './icons'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady?: () => void
  }
}

let ytApiPromise: Promise<void> | null = null
function loadYouTubeApi(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (window.YT?.Player) return Promise.resolve()
  if (ytApiPromise) return ytApiPromise
  ytApiPromise = new Promise((resolve) => {
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => { prev?.(); resolve() }
    if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      document.head.appendChild(tag)
    }
  })
  return ytApiPromise
}

type EmbedInfo = { type: 'youtube'; videoId: string } | { type: 'other'; src: string }

const getEmbedInfo = (u: string): EmbedInfo => {
  const yt = u.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/)
  if (yt) return { type: 'youtube', videoId: yt[1] }
  const drive = u.match(/drive\.google\.com\/file\/d\/([\w-]+)/)
  if (drive) return { type: 'other', src: `https://drive.google.com/file/d/${drive[1]}/preview?autoplay=1` }
  return { type: 'other', src: u }
}

export default function LessonPlayer({ lesson, lessons }: { lesson: Lesson; lessons: Lesson[] }) {
  const { done, mark, loading } = useProgress()
  const [stepIndex, setStepIndex] = useState(0)
  const [pick, setPick] = useState<number | null>(null)
  const [vid, setVid] = useState(false)
  const [vidLoaded, setVidLoaded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const playerElId = `yt-player-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  const playerRef = useRef<any>(null)

  function togglePlay() {
    const p = playerRef.current
    if (!p) return
    playing ? p.pauseVideo() : p.playVideo()
  }

  useEffect(() => {
    if (!vid || !lesson.video_url) return
    const info = getEmbedInfo(lesson.video_url)
    if (info.type !== 'youtube') return
    let cancelled = false

    loadYouTubeApi().then(() => {
      if (cancelled) return
      playerRef.current = new window.YT.Player(playerElId, {
        videoId: info.videoId,
        playerVars: { rel: 0, playsinline: 1, iv_load_policy: 3, cc_load_policy: 1, autoplay: 1 },
        events: {
          onReady: (e: any) => {
            setVidLoaded(true)
            e.target.playVideo()
          },
          onStateChange: (e: any) => {
            setPlaying(e.data === window.YT.PlayerState.PLAYING || e.data === window.YT.PlayerState.BUFFERING)
          },
        },
      })
    })

    return () => {
      cancelled = true
      playerRef.current?.destroy?.()
      playerRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vid, lesson.video_url])

  // Same rule as the dashboard: a lesson is reachable once every lesson
  // before it is fully complete. Completed lessons stay reachable too, so
  // their video and steps can always be revisited.
  const full = isLessonFull(lesson, done)
  const lessonIndex = lessons.findIndex(x => x.slug === lesson.slug)
  const unlocked = lessonIndex === -1 ? true : unlockedFlags(lessons, done)[lessonIndex]
  const locked = !loading && !full && !unlocked

  // Progress (and therefore lock status) resolves client-side, so hold off
  // on rendering the video/steps until we actually know whether this lesson
  // is reachable — otherwise a locked lesson would flash its content first.
  if (loading) {
    return <LessonSkeleton />
  }

  if (locked) {
    return <LockedLesson lesson={lesson} />
  }

  const step = lesson.steps[stepIndex]
  const quiz = step.quiz_questions?.[0]
  const isCorrect = quiz != null && pick === quiz.answer
  const isLast = stepIndex === lesson.steps.length - 1
  const alreadyPassed = done.has(step.id)
  const passedCount = lesson.steps.filter(s => done.has(s.id)).length
  const lessonPct = lesson.steps.length ? Math.round((passedCount / lesson.steps.length) * 100) : 0

  // A step only needs to be "correct" if it actually has a quiz — steps
  // with no quiz_questions can't be gotten wrong, so they don't count
  // toward whether the lesson was answered perfectly.
  const quizSteps = lesson.steps.filter(s => s.quiz_questions?.[0])
  const missedSteps = quizSteps.filter(s => !done.has(s.id))
  const lessonPerfect = missedSteps.length === 0

  function goToStep(n: number) {
    setStepIndex(n)
    setPick(null)
  }

  function choose(n: number) {
    setPick(n)
    if (quiz && n === quiz.answer) mark(step.id)
  }

  function reviewMissed() {
    const target = missedSteps[0]
    if (!target) return
    goToStep(lesson.steps.findIndex(s => s.id === target.id))
  }

  const embedInfo = lesson.video_url ? getEmbedInfo(lesson.video_url) : null

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
        style={
          lesson.video_url
            ? { aspectRatio: '16/9', maxWidth: '100%', minHeight: '200px', maxHeight: '75vh' }
            : { maxWidth: '100%' }
        }
      >
        {lesson.video_url ? (
          vid ? (
            <div className="relative h-full w-full max-w-full">
              {embedInfo!.type === 'youtube' ? (
                <>
                  {/* Real YouTube player, controlled via the IFrame API */}
                  <div id={playerElId} className="h-full w-full" />

                  {/* Cover the player whenever it isn't actively playing — this is the
                      only reliable way to hide YouTube's own title/branding overlay,
                      which reappears on pause regardless of embed URL parameters. */}
                  {!playing && (
                    <button
                      onClick={togglePlay}
                      aria-label={vidLoaded ? 'Play video' : 'Loading video'}
                      className="absolute inset-0 flex h-full w-full flex-col items-center justify-center gap-3 bg-ink text-center px-6 active:bg-white/5"
                    >
                      {vidLoaded ? (
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-white/20">
                          <svg viewBox="0 0 24 24" className="h-7 w-7 text-amber" fill="currentColor" aria-hidden="true">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </span>
                      ) : (
                        <span
                          className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-amber"
                          role="status"
                          aria-label="Loading video"
                        />
                      )}
                    </button>
                  )}

                  {playing && (
                    <button
                      onClick={togglePlay}
                      aria-label="Pause video"
                      className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur transition-colors hover:bg-black/80 active:bg-black/90"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden="true">
                        <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
                      </svg>
                    </button>
                  )}
                </>
              ) : (
                <>
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
                    src={embedInfo!.src}
                    title={`${lesson.title} — video`}
                    loading="eager"
                    allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                    allowFullScreen
                    onLoad={() => setVidLoaded(true)}
                  />
                </>
              )}
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
              <span className="text-xs text-white/40">Tap once to load, then tap play</span>
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
                  </button>, or move on and come back to it later.
                </p>
              )
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex flex-wrap items-start gap-2 border-t border-border px-5 py-4">
          {stepIndex > 0 && (
            <button className="btn-outline" onClick={() => goToStep(stepIndex - 1)}>
              ← Previous
            </button>
          )}
          {isLast ? (
            lessonPerfect ? (
              <Link href="/home" className="btn">Back to home</Link>
            ) : (
              <div className="w-full rounded border border-amber-border bg-amber-soft px-4 py-3 text-sm text-ink sm:w-auto">
                <p className="font-medium">
                  {quizSteps.length - missedSteps.length}/{quizSteps.length} correct — get every question right to unlock the next lesson.
                </p>
                <button className="btn-outline mt-2" onClick={reviewMissed}>
                  Review missed question{missedSteps.length > 1 ? 's' : ''}
                </button>
              </div>
            )
          ) : (
            <button className="btn" onClick={() => goToStep(stepIndex + 1)}>
              Next step
            </button>
          )}
        </div>
      </section>

    </article>
  )
}

// Shown when a lesson hasn't been unlocked yet — no video or step content is
// rendered, so nothing leaks ahead of where the learner actually is.
function LockedLesson({ lesson }: { lesson: Lesson }) {
  return (
    <article className="grid gap-6 fade-in">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/home" className="transition-colors hover:text-denim">Home</Link>
        <span aria-hidden="true">›</span>
        <span className="truncate text-ink">{lesson.title}</span>
      </nav>

      <div className="grid place-items-center gap-3 rounded-lg border border-border bg-paper px-6 py-14 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-denim/15 bg-chalk text-muted/60">
          <IconLock className="h-6 w-6" />
        </span>
        <h1 className="font-display text-xl font-semibold text-denim">This lesson is locked</h1>
        <p className="max-w-sm text-sm text-muted">
          Complete the lessons before “{lesson.title}” to unlock it.
        </p>
        <Link href="/home#lessons" className="btn mt-2">Back to lessons</Link>
      </div>
    </article>
  )
}

// Shown briefly while saved progress (and therefore lock status) resolves.
function LessonSkeleton() {
  return (
    <div className="grid gap-6 fade-in" aria-hidden="true">
      <div className="h-4 w-40 animate-pulse rounded bg-denim-light" />
      <div className="grid gap-2">
        <div className="h-7 w-64 animate-pulse rounded bg-denim-light" />
        <div className="h-4 w-48 animate-pulse rounded bg-denim-light" />
      </div>
      <div className="aspect-video w-full animate-pulse rounded-lg bg-denim-light" />
      <div className="h-40 animate-pulse rounded-lg bg-denim-light" />
    </div>
  )
}
