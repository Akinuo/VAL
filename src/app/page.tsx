import Link from 'next/link'
import { getContent } from '@/lib/content'
import MachinePreview from '@/components/MachinePreview'

export const revalidate = 3600

export default async function LandingPage() {
  const { lessons } = await getContent()
  const first = lessons[0]

  return (
    <div className="min-h-screen bg-chalk text-ink">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-denim">
          VAL Guide
        </Link>
        <nav className="flex items-center gap-1">
          <Link href="/login" className="btn-ghost">Log in</Link>
          <Link href="/home" className="btn">Open lessons</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-5xl px-5 pb-16 pt-10 sm:pt-20">
        <h1 className="max-w-3xl font-display text-[clamp(2.6rem,9vw,5.5rem)] font-extrabold leading-[0.96] tracking-tight text-denim">
          Get to know your sewing machine.
        </h1>

        {/* The topstitch: drawn once on load */}
        <svg viewBox="0 0 1000 8" preserveAspectRatio="none" aria-hidden="true" className="stitch-in mt-8 h-2 w-full">
          <line x1="0" y1="4" x2="1000" y2="4" stroke="#E59B1C" strokeWidth="4" strokeDasharray="22 14" strokeLinecap="round" />
        </svg>

        <div className="mt-8 grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-end">
          <p className="max-w-prose text-lg leading-relaxed text-muted">
            {lessons.length} short lessons for BTLED Home Economics students: machine parts, threading,
            bobbins, stitch length, safety and care. Watch the video, follow the steps, answer one
            question, then move on.
          </p>
          <div>
            <div className="flex flex-wrap gap-3">
              <Link href={`/lessons/${first.slug}`} className="btn">Start lesson 1</Link>
              <Link href="/login?mode=signup" className="btn-outline">Sign in to save progress</Link>
            </div>
            <p className="mt-3 text-sm text-muted">Free to sign up — takes less than a minute.</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-16">
        <div className="grid overflow-hidden rounded-lg bg-denim-light md:grid-cols-[1.5fr_1fr]">
          <MachinePreview />
          <div className="flex flex-col justify-center gap-3 p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold leading-tight tracking-tight text-denim">Turn the machine around</h2>
            <p className="text-muted">
              Drag to spin the 3D model and get a feel for the real machine. Sign in to tap any of
              its 14 parts and see what each one does.
            </p>
            <Link href="/parts" className="btn self-start">Explore the machine</Link>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto grid max-w-5xl gap-10 px-5 py-16 md:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="font-display text-3xl font-bold tracking-tight text-denim">The lessons, in order</h2>
            <p className="mt-3 max-w-sm text-muted">
              Each one takes about five minutes. Finish a lesson to earn its badge.
            </p>
          </div>

          <ol className="relative ml-3.5 border-l-2 border-dashed border-thread">
            {lessons.map((l, i) => (
              <li key={l.slug}>
                <Link
                  href={`/lessons/${l.slug}`}
                  className="group relative flex items-baseline justify-between gap-4 py-4 pl-8 pr-2 transition-colors hover:bg-denim-light"
                >
                  <span className="absolute -left-[15px] top-4 flex h-7 w-7 items-center justify-center rounded-full bg-denim text-sm font-bold text-white ring-4 ring-paper group-hover:ring-denim-light">
                    {i + 1}
                  </span>
                  <span>
                    <span className="block font-display text-xl font-bold leading-snug text-ink">{l.title}</span>
                    <span className="mt-0.5 block text-muted">{l.summary}</span>
                  </span>
                  <span className="shrink-0 text-sm text-muted">{l.minutes} min</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-denim text-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-6 px-5 py-14 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="max-w-md font-display text-3xl font-bold leading-tight tracking-tight">
            Start with the parts of the machine.
          </h2>
          <Link href={`/lessons/${first.slug}`} className="btn !bg-thread !text-ink hover:!bg-amber-border">
            Start lesson 1
          </Link>
        </div>
      </section>

      <footer className="bg-denim-deep text-sm text-white/70">
        <div className="mx-auto max-w-5xl px-5 py-5">VAL Guide for BTLED Home Economics</div>
      </footer>
    </div>
  )
}
