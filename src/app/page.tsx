import Link from 'next/link'
import { IconSpool } from '@/components/icons'

const LESSONS = [
  { n: 1, title: 'Parts and functions of the sewing machine' },
  { n: 2, title: 'Preparing the machine before use' },
  { n: 3, title: 'Threading the upper thread' },
  { n: 4, title: 'Winding the bobbin' },
  { n: 5, title: 'Installing the bobbin' },
  { n: 6, title: 'Stitch length and basic operation' },
  { n: 7, title: 'Sewing machine safety' },
  { n: 8, title: 'Cleaning and routine care' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream text-ink">

      {/* ── Header ── */}
      <header className="border-b border-border bg-paper">
        <div className="mx-auto flex max-w-app items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-2 font-serif text-lg font-bold text-maroon">
            <IconSpool className="h-5 w-5" />
            VAL Guide
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/login" className="btn-ghost text-sm">Log in</Link>
            <Link href="/login?mode=signup" className="btn text-sm">Get started</Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="border-b border-border bg-paper">
        <div className="mx-auto grid max-w-app items-center gap-10 px-5 py-14 sm:py-20 lg:grid-cols-[1.1fr_0.9fr]">

          <div>
            <p className="eyebrow mb-3">BTLED Home Economics</p>
            <h1 className="font-serif text-3xl font-bold leading-tight text-maroon sm:text-4xl">
              Basic Sewing Machine Operation
            </h1>
            <p className="mt-4 max-w-prose text-base leading-relaxed text-muted">
              A guided learning resource for students. Work through eight short lessons covering
              machine parts, threading, bobbin winding, stitch settings, safety, and routine care.
              Each lesson includes a video, step-by-step instructions, and a short quiz.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/login?mode=signup" className="btn">Create a free account</Link>
              <Link href="/home" className="btn-outline">Browse without logging in</Link>
            </div>
            <p className="mt-3 text-xs text-muted">
              No account needed to read lessons. Log in to save progress across devices.
            </p>
          </div>

          {/* ── Premium sewing machine illustration ── */}
          <div className="hidden lg:flex lg:justify-center" aria-hidden="true">
            <svg
              viewBox="0 0 360 300"
              className="w-full max-w-sm"
              role="img"
              aria-label="Detailed sewing machine illustration"
            >
              <defs>
                {/* Body gradient — gives depth to the machine casing */}
                <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%"   stopColor="#9B2D42" />
                  <stop offset="55%"  stopColor="#7A1E30" />
                  <stop offset="100%" stopColor="#4A0F1C" />
                </linearGradient>
                {/* Arm gradient */}
                <linearGradient id="armGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stopColor="#8B2236" />
                  <stop offset="100%" stopColor="#6E1A2C" />
                </linearGradient>
                {/* Wheel gradient */}
                <radialGradient id="wheelGrad" cx="40%" cy="35%">
                  <stop offset="0%"   stopColor="#6E1A2C" />
                  <stop offset="100%" stopColor="#2A0810" />
                </radialGradient>
                {/* Bed gradient */}
                <linearGradient id="bedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stopColor="#3A7A5E" />
                  <stop offset="100%" stopColor="#2D6A4F" />
                </linearGradient>
                {/* Highlight overlay */}
                <linearGradient id="shineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%"   stopColor="white" stopOpacity="0.18" />
                  <stop offset="60%"  stopColor="white" stopOpacity="0" />
                </linearGradient>
                {/* Drop shadow filter */}
                <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1C1410" floodOpacity="0.18" />
                </filter>
                <filter id="shadowSm" x="-5%" y="-5%" width="110%" height="120%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1C1410" floodOpacity="0.14" />
                </filter>
              </defs>

              {/* ── Machine bed / base ── */}
              <rect x="18" y="188" width="310" height="52" rx="10" fill="url(#bedGrad)" filter="url(#shadow)" />
              {/* Bed highlight */}
              <rect x="18" y="188" width="310" height="18" rx="10" fill="url(#shineGrad)" />
              {/* Throat plate — metal rectangle on bed */}
              <rect x="52" y="188" width="80" height="8" rx="2" fill="#C8C0B0" opacity="0.6" />
              {/* Feed dog slots */}
              <rect x="68" y="190" width="4" height="4" rx="1" fill="#1C1410" opacity="0.4" />
              <rect x="76" y="190" width="4" height="4" rx="1" fill="#1C1410" opacity="0.4" />
              <rect x="84" y="190" width="4" height="4" rx="1" fill="#1C1410" opacity="0.4" />
              {/* Foot pedal */}
              <rect x="240" y="228" width="72" height="10" rx="5" fill="#2A0810" opacity="0.85" />
              <rect x="248" y="224" width="56" height="8" rx="4" fill="#3D1020" />
              <line x1="276" y1="224" x2="276" y2="238" stroke="#C8860A" strokeWidth="1" opacity="0.5" />

              {/* ── Machine body ── */}
              <rect x="28" y="100" width="270" height="92" rx="18" fill="url(#bodyGrad)" filter="url(#shadow)" />
              {/* Body shine */}
              <rect x="28" y="100" width="270" height="36" rx="18" fill="url(#shineGrad)" />
              {/* Body bottom edge shadow */}
              <rect x="28" y="178" width="270" height="14" rx="0" fill="#3A0D18" opacity="0.3" />

              {/* ── Machine arm (upper horizontal) ── */}
              <rect x="42" y="52" width="220" height="52" rx="16" fill="url(#armGrad)" filter="url(#shadowSm)" />
              {/* Arm shine */}
              <rect x="42" y="52" width="220" height="20" rx="16" fill="url(#shineGrad)" />
              {/* Arm-to-body join curve */}
              <path d="M42 96 Q28 96 28 112" fill="none" stroke="#4A0F1C" strokeWidth="3" />

              {/* ── Spool pin ── */}
              <rect x="218" y="28" width="5" height="28" rx="2.5" fill="#2A1810" />
              {/* Spool — top flange */}
              <ellipse cx="220.5" cy="28" rx="11" ry="3.5" fill="#C8860A" />
              {/* Spool — bottom flange */}
              <ellipse cx="220.5" cy="50" rx="11" ry="3.5" fill="#C8860A" />
              {/* Spool — barrel */}
              <rect x="209.5" y="28" width="22" height="22" fill="#D4960E" opacity="0.7" />
              {/* Thread wrap lines on spool */}
              <line x1="209.5" y1="34" x2="231.5" y2="34" stroke="#B87A08" strokeWidth="1" opacity="0.6" />
              <line x1="209.5" y1="38" x2="231.5" y2="38" stroke="#B87A08" strokeWidth="1" opacity="0.6" />
              <line x1="209.5" y1="42" x2="231.5" y2="42" stroke="#B87A08" strokeWidth="1" opacity="0.6" />
              {/* Thread leaving spool */}
              <path d="M220.5 50 Q200 58 185 68" fill="none" stroke="#C8860A" strokeWidth="1.2" strokeDasharray="3 2" opacity="0.7" />

              {/* ── Bobbin winder spindle ── */}
              <rect x="258" y="46" width="4" height="18" rx="2" fill="#2A1810" />
              <ellipse cx="260" cy="46" rx="6" ry="2" fill="#888" />
              <ellipse cx="260" cy="62" rx="6" ry="2" fill="#888" />

              {/* ── Take-up lever ── */}
              <path d="M100 58 Q108 52 116 62 Q120 68 112 72" fill="none" stroke="#C8C0B0" strokeWidth="3" strokeLinecap="round" />
              <circle cx="112" cy="72" r="3" fill="#C8C0B0" />
              {/* Thread through take-up lever */}
              <path d="M112 72 Q112 90 112 108" fill="none" stroke="#C8860A" strokeWidth="1" strokeDasharray="3 2" opacity="0.6" />

              {/* ── Tension dial ── */}
              <circle cx="160" cy="120" r="14" fill="#2A0810" />
              <circle cx="160" cy="120" r="11" fill="#3D1020" />
              {/* Dial markings */}
              {[0,45,90,135,180,225,270,315].map((deg, i) => {
                const r1 = 7, r2 = 9
                const rad = (deg * Math.PI) / 180
                return (
                  <line
                    key={i}
                    x1={160 + r1 * Math.cos(rad)}
                    y1={120 + r1 * Math.sin(rad)}
                    x2={160 + r2 * Math.cos(rad)}
                    y2={120 + r2 * Math.sin(rad)}
                    stroke="#C8860A"
                    strokeWidth="1"
                    opacity="0.7"
                  />
                )
              })}
              <text x="160" y="124" textAnchor="middle" fontSize="8" fill="#C8860A" fontFamily="serif" fontWeight="bold">4</text>

              {/* ── Stitch selector dial ── */}
              <circle cx="200" cy="120" r="12" fill="#2A0810" />
              <circle cx="200" cy="120" r="9"  fill="#3D1020" />
              <line x1="200" y1="112" x2="200" y2="116" stroke="#C8860A" strokeWidth="1.2" opacity="0.8" />
              <text x="200" y="124" textAnchor="middle" fontSize="7" fill="#C8860A" fontFamily="serif">2.5</text>

              {/* ── Handwheel ── */}
              <circle cx="308" cy="130" r="32" fill="url(#wheelGrad)" filter="url(#shadowSm)" />
              {/* Wheel rim */}
              <circle cx="308" cy="130" r="32" fill="none" stroke="#C8860A" strokeWidth="1.5" opacity="0.4" />
              {/* Wheel spokes */}
              {[0, 60, 120, 180, 240, 300].map((deg, i) => {
                const rad = (deg * Math.PI) / 180
                return (
                  <line
                    key={i}
                    x1={308 + 10 * Math.cos(rad)}
                    y1={130 + 10 * Math.sin(rad)}
                    x2={308 + 28 * Math.cos(rad)}
                    y2={130 + 28 * Math.sin(rad)}
                    stroke="#C8860A"
                    strokeWidth="1.2"
                    opacity="0.5"
                  />
                )
              })}
              {/* Wheel hub */}
              <circle cx="308" cy="130" r="10" fill="#4A0F1C" />
              <circle cx="308" cy="130" r="5"  fill="#6E1A2C" />
              {/* Wheel highlight */}
              <ellipse cx="300" cy="120" rx="8" ry="5" fill="white" opacity="0.07" transform="rotate(-30 300 120)" />

              {/* ── Needle bar ── */}
              <rect x="86" y="108" width="7" height="68" rx="3.5" fill="#2A1810" />
              {/* Needle bar clamp */}
              <rect x="83" y="130" width="13" height="8" rx="2" fill="#888" opacity="0.7" />

              {/* ── Needle ── */}
              <rect x="88.5" y="172" width="3" height="28" rx="1.5" fill="#B0A898" />
              {/* Needle eye */}
              <ellipse cx="90" cy="178" rx="1.5" ry="2.2" fill="none" stroke="#888" strokeWidth="1" />
              {/* Thread through needle */}
              <path d="M90 180 Q90 192 90 200" fill="none" stroke="#C8860A" strokeWidth="1" strokeDasharray="2 2" opacity="0.8" />

              {/* ── Presser foot ── */}
              <rect x="78" y="178" width="26" height="10" rx="3" fill="#3A7A5E" />
              {/* Presser foot toes */}
              <rect x="80" y="186" width="9" height="6" rx="1.5" fill="#2D6A4F" />
              <rect x="93" y="186" width="9" height="6" rx="1.5" fill="#2D6A4F" />
              {/* Presser foot bar */}
              <rect x="88" y="158" width="5" height="22" rx="2" fill="#888" opacity="0.6" />

              {/* ── Presser foot lever (at back) ── */}
              <rect x="52" y="128" width="5" height="36" rx="2.5" fill="#888" opacity="0.5" />
              <rect x="46" y="128" width="17" height="6" rx="3" fill="#888" opacity="0.6" />

              {/* ── Thread guide on arm ── */}
              <circle cx="170" cy="58" r="4" fill="none" stroke="#C8C0B0" strokeWidth="1.5" />
              <circle cx="170" cy="58" r="1.5" fill="#C8C0B0" />

              {/* ── Animated stitch line on fabric ── */}
              {/* Fabric strip */}
              <rect x="18" y="196" width="310" height="16" rx="0" fill="#FAF8F4" opacity="0.15" />
              <path
                className="hero-stitch"
                d="M28,204 L58,198 L88,204 L118,198 L148,204 L178,198 L208,204 L238,198 L268,204 L298,198 L322,202"
                fill="none"
                stroke="#C8860A"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* ── Light reflection on body top edge ── */}
              <path d="M46 102 Q160 96 258 102" fill="none" stroke="white" strokeWidth="1" opacity="0.12" />
            </svg>
          </div>

        </div>
      </section>

      {/* ── Lesson list ── */}
      <section className="mx-auto max-w-app px-5 py-12">
        <h2 className="font-serif text-xl font-bold text-maroon">Course outline</h2>
        <p className="mt-1 text-sm text-muted">Eight lessons — each with a video, guided steps, and a quiz.</p>
        <ol className="mt-5 divide-y divide-border rounded-lg border border-border bg-paper">
          {LESSONS.map(({ n, title }) => (
            <li key={n} className="flex items-center gap-4 px-5 py-3.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-maroon-light font-serif text-sm font-bold text-maroon">
                {n}
              </span>
              <span className="text-sm font-medium text-ink">{title}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── How it works ── */}
      <section className="border-t border-border bg-paper">
        <div className="mx-auto max-w-app px-5 py-12">
          <h2 className="font-serif text-xl font-bold text-maroon">How each lesson works</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { step: '1', title: 'Watch',      desc: 'Each lesson has a short video. It loads only when you press play — no wasted data.' },
              { step: '2', title: 'Read',        desc: 'Follow the step-by-step guide. Each step is one clear action or concept.' },
              { step: '3', title: 'Quiz',        desc: 'Answer one question per step. Get instant feedback before moving on.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-4">
                <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-maroon/25 font-serif text-sm font-bold text-maroon">
                  {step}
                </span>
                <div>
                  <p className="font-semibold text-ink">{title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-border">
        <div className="mx-auto max-w-app px-5 py-12">
          <div className="rounded-lg border border-maroon/20 bg-maroon-light px-6 py-8 sm:px-10">
            <h2 className="font-serif text-xl font-bold text-maroon">Ready to start?</h2>
            <p className="mt-2 text-sm text-muted">
              Create a free account to save your progress and earn badges as you complete lessons.
              Or browse without an account — progress stays on this device.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href="/login?mode=signup" className="btn">Create a free account</Link>
              <Link href="/home" className="btn-outline">Browse lessons</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-paper">
        <div className="mx-auto flex max-w-app items-center justify-between gap-4 px-5 py-4 text-xs text-muted">
          <span className="flex items-center gap-1.5 font-semibold text-maroon">
            <IconSpool className="h-4 w-4" />
            VAL Guide
          </span>
          <span>BTLED Home Economics · Videos load only when you press play.</span>
        </div>
      </footer>

    </div>
  )
}
