import Image from 'next/image'
import Link from 'next/link'
import { getContent } from '@/lib/content'
import MachinePreview from '@/components/MachinePreview'
import { IconPartMarker, IconQuestion, IconRibbon } from '@/components/icons'

export const revalidate = 3600

// Front page — laid out like a compact Android app screen: a slim app bar,
// a short hero (no oversized marketing type), tap-sized card tiles, and a
// persistent bottom action bar instead of a page full of scroll-to-find CTAs.
export default async function LandingPage() {
  const { lessons, achievements } = await getContent()
  const first = lessons[0]
  const totalMinutes = lessons.reduce((sum, l) => sum + l.minutes, 0)
  const signupHref = `/login?mode=signup&next=/lessons/${first.slug}`

  return (
    <>
      {/* ── Mobile splash — phone widths only. A slim brand bar up top, then a
          centered hero: logo, title, one line, and a single way in. ── */}
      <div
        className="grain relative isolate flex min-h-screen flex-col bg-chalk sm:hidden"
        style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <header className="flex h-14 shrink-0 items-center justify-between px-5">
          <Link href="/" aria-label="VAL Guide home" className="flex items-center">
            <Image src="/logo-mark.png" alt="" width={26} height={26} priority className="h-[26px] w-[26px]" />
          </Link>
          <Link href="/login" className="btn-ghost !min-h-[32px] !px-3 !text-xs">Log in</Link>
        </header>
        <div className="stitch-rule shrink-0" aria-hidden="true" />

        <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
          <Image src="/logo-mark.png" alt="" width={76} height={76} className="h-[76px] w-[76px]" />
          <h1 className="mt-5 font-display text-[1.7rem] font-extrabold tracking-tight text-denim">VAL Guide</h1>
          <p className="mt-2 max-w-[24ch] text-base leading-snug text-muted">
            Get to know your sewing machine.
          </p>
          <Link href={signupHref} className="btn mt-8 w-full max-w-xs">
            Sign in to start lesson 1
          </Link>
          <p className="mt-3 text-xs text-muted">Free to sign up — takes less than a minute.</p>
        </div>
      </div>

      {/* ── Full layout — tablet and up ── */}
      <div className="hidden min-h-screen bg-chalk sm:block">
      {/* ── App bar ── */}
      <header
        className="sticky top-0 z-30 border-b border-border bg-paper/95 backdrop-blur"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="mx-auto flex h-14 max-w-app items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight text-denim">
            <Image src="/logo-mark.png" alt="" width={26} height={26} priority className="h-[26px] w-[26px]" />
            VAL Guide
          </Link>
          <Link href="/login" className="btn-ghost !min-h-[32px] !px-3 !text-xs">Log in</Link>
        </div>
        <div className="stitch-rule" aria-hidden="true" />
      </header>

      <main className="mx-auto max-w-app px-4 pb-28 pt-6">

        {/* ── Hero ── */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-amber">BTLED Home Economics</p>
          <h1 className="mt-1 font-display text-[1.85rem] font-extrabold leading-[1.1] tracking-tight text-denim sm:text-[2.2rem]">
            Get to know your sewing machine.
          </h1>
          <svg viewBox="0 0 300 8" preserveAspectRatio="none" aria-hidden="true" className="stitch-in mt-3 h-2 w-28">
            <line x1="0" y1="4" x2="300" y2="4" stroke="#E59B1C" strokeWidth="4" strokeDasharray="16 10" strokeLinecap="round" />
          </svg>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            {lessons.length} short lessons for BTLED Home Economics students: machine parts,
            threading, bobbins, stitch length, safety and care.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="chip-denim">{lessons.length} lessons</span>
            <span className="chip-denim">~{totalMinutes} min total</span>
            <span className="chip-green">Free to join</span>
          </div>
        </section>

        {/* ── Quick actions ── */}
        <section className="mt-5 grid grid-cols-2 gap-3">
          <Link href="/parts" className="card flex flex-col gap-2 p-4 transition-colors hover:bg-denim-light active:scale-[0.98]">
            <IconPartMarker className="h-6 w-6 text-denim" />
            <span className="font-display text-sm font-bold leading-tight text-ink">Explore parts</span>
            <span className="text-xs leading-snug text-muted">Spin the 3D model, tap all 14 parts</span>
          </Link>
          <Link href="/faq" className="card flex flex-col gap-2 p-4 transition-colors hover:bg-denim-light active:scale-[0.98]">
            <IconQuestion className="h-6 w-6 text-denim" />
            <span className="font-display text-sm font-bold leading-tight text-ink">FAQs</span>
            <span className="text-xs leading-snug text-muted">Common questions, answered</span>
          </Link>
        </section>

        {/* ── 3D preview ── */}
        <section className="card mt-4 overflow-hidden">
          <MachinePreview />
          <div className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="font-display text-sm font-bold text-denim">Turn the machine around</p>
              <p className="mt-0.5 truncate text-xs text-muted">Drag to spin — sign in to tap each part</p>
            </div>
            <Link href="/parts" className="btn-outline shrink-0 !min-h-[36px] !px-3 !text-xs">Open</Link>
          </div>
        </section>

        {/* ── Lessons ── */}
        <section className="mt-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-display text-base font-bold text-denim">The lessons, in order</h2>
            <span className="text-xs text-muted">{lessons.length} total</span>
          </div>
          <ol className="card mt-2 divide-y divide-border">
            {lessons.map((l, i) => (
              <li key={l.slug}>
                <Link
                  href={`/lessons/${l.slug}`}
                  className="group flex items-center gap-3 px-4 py-3 transition-colors hover:bg-denim-light"
                >
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-denim-light text-xs font-bold text-denim">
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-ink group-hover:text-denim">{l.title}</span>
                    <span className="block truncate text-xs text-muted">{l.summary}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted">{l.minutes} min</span>
                </Link>
              </li>
            ))}
          </ol>
        </section>

        {/* ── Badges teaser ── */}
        <section className="card mt-4 flex items-center gap-3 p-4">
          <IconRibbon className="h-6 w-6 shrink-0 text-thread" />
          <p className="text-xs leading-snug text-muted">
            Earn a badge for every lesson you finish — {achievements.length} to collect.
          </p>
        </section>

        <p className="mt-6 text-center text-xs text-muted">VAL Guide for BTLED Home Economics</p>
      </main>

      {/* ── Persistent bottom action ── */}
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-paper/95 backdrop-blur"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)', boxShadow: '0 -2px 10px rgba(30,36,64,0.08)' }}
      >
        <div className="mx-auto max-w-app px-4 py-3">
          <Link href={signupHref} className="btn w-full !text-[0.95rem]">
            Sign in to start lesson 1
          </Link>
          <p className="mt-1.5 text-center text-[11px] text-muted">Free to sign up — takes less than a minute.</p>
        </div>
      </div>
      </div>
    </>
  )
}
