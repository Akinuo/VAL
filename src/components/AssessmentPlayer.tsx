'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useProgress, type AssessmentRecord } from '@/lib/progress'
import type { Content } from '@/lib/content'
import {
  buildAssessmentQuestions, isAssessmentUnlocked, isPassingScore, PASS_PERCENT,
  type AssessmentQuestion,
} from '@/lib/assessment'
import { shuffle } from '@/lib/shuffle'
import { IconCheck, IconLock, IconCertificate, IconDownload } from './icons'

type PlayQuestion = AssessmentQuestion & { order: number[] }
type Phase = 'summary' | 'intro' | 'active' | 'results'
type Result = { score: number; total: number; passed: boolean }

export default function AssessmentPlayer({ c }: { c: Content }) {
  const { done, loading, assessment, submitAssessment, displayName, email } = useProgress()
  const questionPool = buildAssessmentQuestions(c)
  const unlocked = isAssessmentUnlocked(c, done)

  const [phase, setPhase] = useState<Phase | null>(null)
  const [order, setOrder] = useState<PlayQuestion[]>([])
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [result, setResult] = useState<Result | null>(null)
  const [certName, setCertName] = useState('')
  const [downloading, setDownloading] = useState(false)

  // Decide the starting screen only once progress has actually resolved —
  // a learner who already passed before lands on the summary/certificate
  // view instead of being asked to sit the exam again.
  useEffect(() => {
    if (!loading && phase === null) setPhase(assessment ? 'summary' : 'intro')
  }, [loading, assessment, phase])

  // Pre-fill the certificate name from whatever the account already has,
  // once, so the field doesn't fight with the learner if they edit it.
  useEffect(() => {
    setCertName(prev => prev || displayName || (email ? email.split('@')[0] : ''))
  }, [displayName, email])

  function start() {
    const shuffled: PlayQuestion[] = shuffle(questionPool).map(q => ({
      ...q,
      order: shuffle(q.options.map((_, i) => i)),
    }))
    setOrder(shuffled)
    setAnswers({})
    setResult(null)
    setPhase('active')
  }

  function choose(questionId: string, optIdx: number) {
    setAnswers(a => ({ ...a, [questionId]: optIdx }))
  }

  function submit() {
    const score = order.filter(q => answers[q.id] === q.answer).length
    const total = order.length
    const passed = isPassingScore(score, total)
    submitAssessment({ score, total, passed })
    setResult({ score, total, passed })
    setPhase('results')
  }

  async function downloadCertificate(score: number, total: number) {
    setDownloading(true)
    try {
      // pdf-lib is only needed once someone actually earns a certificate,
      // so it's loaded on demand here rather than bundled into every visit
      // to this page.
      const { buildCertificatePdf } = await import('@/lib/certificatePdf')
      const date = new Date().toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })
      const bytes = await buildCertificatePdf({ name: certName.trim() || 'B.M.O Student', score, total, date })
      const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `BMO-Certificate-${(certName.trim() || 'certificate').replace(/\s+/g, '-')}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } finally {
      setDownloading(false)
    }
  }

  if (loading || phase === null) return <AssessmentSkeleton />
  if (!unlocked) return <LockedAssessment />

  const answeredCount = Object.keys(answers).length

  return (
    <article className="grid gap-6 fade-in">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/home" className="transition-colors hover:text-denim">Home</Link>
        <span aria-hidden="true">›</span>
        <span className="truncate text-ink">Final assessment</span>
      </nav>

      <div>
        <h1 className="font-display text-2xl font-bold text-denim sm:text-3xl">Final assessment</h1>
        <p className="mt-1 text-sm text-muted">
          One comprehensive test covering every lesson — score at least {PASS_PERCENT}% to earn your certificate.
        </p>
      </div>

      {phase === 'summary' && assessment && (
        <SummaryCard
          assessment={assessment}
          certName={certName}
          setCertName={setCertName}
          onRetake={start}
          onDownload={() => downloadCertificate(assessment.score, assessment.total)}
          downloading={downloading}
        />
      )}

      {phase === 'intro' && (
        <IntroCard totalQuestions={questionPool.length} onStart={start} />
      )}

      {phase === 'active' && (
        <>
          <ol className="grid gap-4">
            {order.map((q, i) => (
              <li key={q.id} className="rounded-lg border border-border bg-paper p-5">
                <p className="eyebrow mb-1">Question {i + 1} of {order.length} · {q.lessonTitle}</p>
                <fieldset>
                  <legend className="font-semibold text-ink">{q.question}</legend>
                  <div className="mt-3 grid gap-2">
                    {q.order.map(optIdx => (
                      <button
                        key={optIdx}
                        type="button"
                        className="opt"
                        style={{ minHeight: '44px' }}
                        aria-pressed={answers[q.id] === optIdx}
                        onClick={() => choose(q.id, optIdx)}
                      >
                        {q.options[optIdx]}
                      </button>
                    ))}
                  </div>
                </fieldset>
              </li>
            ))}
          </ol>

          <div className="sticky bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border bg-paper px-5 py-4 shadow-md">
            <span className="text-sm text-muted">{answeredCount} of {order.length} answered</span>
            <button className="btn" onClick={submit} disabled={answeredCount < order.length}>
              Submit assessment
            </button>
          </div>
        </>
      )}

      {phase === 'results' && result && (
        <ResultsView
          order={order}
          answers={answers}
          result={result}
          certName={certName}
          setCertName={setCertName}
          onRetake={start}
          onDownload={() => downloadCertificate(result.score, result.total)}
          downloading={downloading}
        />
      )}
    </article>
  )
}

function CertificateCard({ score, total, certName, setCertName, onDownload, downloading }: {
  score: number
  total: number
  certName: string
  setCertName: (v: string) => void
  onDownload: () => void
  downloading: boolean
}) {
  const pct = total ? Math.round((score / total) * 100) : 0
  return (
    <div className="rounded-lg border border-amber-border bg-amber-soft p-5">
      <div className="flex items-start gap-3">
        <IconCertificate className="mt-0.5 h-6 w-6 shrink-0 text-amber" />
        <div>
          <p className="font-display text-lg font-semibold text-denim">Certificate of Completion</p>
          <p className="mt-0.5 text-sm text-ink">
            Scored {score}/{total} ({pct}%) — at or above the {PASS_PERCENT}% needed to pass.
          </p>
        </div>
      </div>
      <label className="mt-4 block text-sm font-medium text-ink" htmlFor="cert-name">
        Name for certificate
      </label>
      <input
        id="cert-name"
        className="field mt-1 max-w-sm"
        value={certName}
        onChange={e => setCertName(e.target.value)}
        placeholder="Full name"
      />
      <button className="btn mt-4" onClick={onDownload} disabled={downloading || !certName.trim()}>
        <IconDownload className="h-4 w-4" />
        {downloading ? 'Preparing…' : 'Download certificate (PDF)'}
      </button>
    </div>
  )
}

function SummaryCard({ assessment, certName, setCertName, onRetake, onDownload, downloading }: {
  assessment: AssessmentRecord
  certName: string
  setCertName: (v: string) => void
  onRetake: () => void
  onDownload: () => void
  downloading: boolean
}) {
  const date = new Date(assessment.completedAt).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric' })

  if (assessment.passed) {
    return (
      <div className="grid gap-4">
        <p className="alert-ok flex items-center gap-2">
          <IconCheck className="h-4 w-4 shrink-0" />
          Passed on {date} — {assessment.score}/{assessment.total} correct.
        </p>
        <CertificateCard
          score={assessment.score}
          total={assessment.total}
          certName={certName}
          setCertName={setCertName}
          onDownload={onDownload}
          downloading={downloading}
        />
        <button className="btn-outline self-start" onClick={onRetake}>Retake for a better score</button>
      </div>
    )
  }

  const pct = assessment.total ? Math.round((assessment.score / assessment.total) * 100) : 0
  return (
    <div className="grid gap-4">
      <p className="alert-info">
        Your best attempt so far: {assessment.score}/{assessment.total} ({pct}%) on {date} — {PASS_PERCENT}% is needed to pass.
      </p>
      <button className="btn self-start" onClick={onRetake}>Retake assessment</button>
    </div>
  )
}

function IntroCard({ totalQuestions, onStart }: { totalQuestions: number; onStart: () => void }) {
  return (
    <div className="rounded-lg border border-border bg-paper p-6">
      <p className="text-ink">
        This assessment pulls together {totalQuestions} questions from every lesson in the course. Answer all of
        them, then submit — your score is tallied once every question has an answer, not question by question.
      </p>
      <p className="mt-2 text-sm text-muted">
        Score at least {PASS_PERCENT}% to earn your Certificate of Completion. You can retake it any time.
      </p>
      <button className="btn mt-5" onClick={onStart}>Start assessment</button>
    </div>
  )
}

function ResultsView({ order, answers, result, certName, setCertName, onRetake, onDownload, downloading }: {
  order: PlayQuestion[]
  answers: Record<string, number>
  result: Result
  certName: string
  setCertName: (v: string) => void
  onRetake: () => void
  onDownload: () => void
  downloading: boolean
}) {
  const pct = result.total ? Math.round((result.score / result.total) * 100) : 0
  return (
    <div className="grid gap-6">
      <div className={result.passed ? 'alert-ok' : 'alert-err'}>
        <p className="font-semibold">{result.passed ? 'You passed!' : 'Not quite — give it another go.'}</p>
        <p className="mt-0.5">
          {result.score} of {result.total} correct ({pct}%). {PASS_PERCENT}% is needed to pass.
        </p>
      </div>

      {result.passed ? (
        <CertificateCard
          score={result.score}
          total={result.total}
          certName={certName}
          setCertName={setCertName}
          onDownload={onDownload}
          downloading={downloading}
        />
      ) : (
        <button className="btn self-start" onClick={onRetake}>Retake assessment</button>
      )}

      <section>
        <h2 className="font-display text-lg font-semibold text-denim">Review</h2>
        <ol className="mt-3 grid gap-3">
          {order.map((q, i) => {
            const pick = answers[q.id]
            const correct = pick === q.answer
            return (
              <li key={q.id} className={`rounded-lg border p-4 ${correct ? 'border-green-border bg-green-soft' : 'border-red-border bg-red-soft'}`}>
                <p className="eyebrow mb-1">Question {i + 1} · {q.lessonTitle}</p>
                <p className="font-medium text-ink">{q.question}</p>
                <p className={`mt-1 text-sm ${correct ? 'text-green' : 'text-red'}`}>
                  Your answer: {q.options[pick]}{correct ? ' — correct' : ''}
                </p>
                {!correct && <p className="mt-0.5 text-sm text-ink">Correct answer: {q.options[q.answer]}</p>}
                {q.explanation && <p className="mt-1 text-sm text-muted">{q.explanation}</p>}
              </li>
            )
          })}
        </ol>
      </section>

      <Link href="/home" className="btn-outline self-start">Back to home</Link>
    </div>
  )
}

// Shown when a lesson still needs finishing before the assessment can be taken.
function LockedAssessment() {
  return (
    <article className="grid gap-6 fade-in">
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-muted">
        <Link href="/home" className="transition-colors hover:text-denim">Home</Link>
        <span aria-hidden="true">›</span>
        <span className="truncate text-ink">Final assessment</span>
      </nav>
      <div className="grid place-items-center gap-3 rounded-lg border border-border bg-paper px-6 py-14 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-full border border-denim/15 bg-chalk text-muted/60">
          <IconLock className="h-6 w-6" />
        </span>
        <h1 className="font-display text-xl font-semibold text-denim">The final assessment is locked</h1>
        <p className="max-w-sm text-sm text-muted">Complete every lesson to unlock the final assessment and earn your certificate.</p>
        <Link href="/home#lessons" className="btn mt-2">Back to lessons</Link>
      </div>
    </article>
  )
}

function AssessmentSkeleton() {
  return (
    <div className="grid gap-6 fade-in" aria-hidden="true">
      <div className="h-4 w-40 animate-pulse rounded bg-denim-light" />
      <div className="grid gap-2">
        <div className="h-7 w-64 animate-pulse rounded bg-denim-light" />
        <div className="h-4 w-48 animate-pulse rounded bg-denim-light" />
      </div>
      <div className="h-40 animate-pulse rounded-lg bg-denim-light" />
    </div>
  )
}
