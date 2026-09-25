'use client'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import type { Content } from '@/lib/content'
import { useProgress } from '@/lib/progress'

// three.js only loads on this page
const MachineViewer = dynamic(() => import('./MachineViewer'), {
  ssr: false,
  loading: () => <div className="flex h-[340px] items-center justify-center rounded-lg border border-border bg-denim-light text-sm text-muted sm:h-[460px]">Loading 3D model…</div>,
})

export default function PartsDiagram({ parts }: { parts: Content['parts'] }) {
  const params = useSearchParams()
  const { uid } = useProgress()
  const canExplore = !!uid
  const [sel, setSel] = useState(parts[0]?.slug)
  const [xray, setXray] = useState(true)
  const [resetKey, setResetKey] = useState(0)

  useEffect(() => {
    if (!canExplore) return
    const p = params.get('part')
    if (p && parts.some(x => x.slug === p)) setSel(p)
  }, [params, parts, canExplore])

  const cur = parts.find(p => p.slug === sel)
  const view = useRef<HTMLDivElement>(null)
  // Picking from the list scrolls the model back into view. Signed-out visitors
  // can still turn the model around, but selecting a part requires an account.
  const pick = (slug: string) => {
    if (!canExplore) return
    setSel(slug)
    view.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">

      {/* ── 3D model ── */}
      <div ref={view} className="scroll-mt-16">
        <MachineViewer parts={parts} selected={sel} onSelect={pick} xray={xray} resetKey={resetKey} />
        <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-muted">Drag to turn the machine, pinch or scroll to zoom, tap a dot to pick a part.</p>
          <div className="flex gap-1.5">
            <button className="rounded border border-border bg-paper px-3 py-1.5 text-xs font-medium hover:bg-denim-light" onClick={() => setXray(v => !v)} aria-pressed={xray}>
              {xray ? 'See-through: on' : 'See-through: off'}
            </button>
            <button className="rounded border border-border bg-paper px-3 py-1.5 text-xs font-medium hover:bg-denim-light" onClick={() => setResetKey(k => k + 1)}>
              Reset view
            </button>
          </div>
        </div>
      </div>

      {/* ── Info panel ── */}
      <div className="flex flex-col gap-4">
        {canExplore ? (
          <>
            {cur && (
              <div aria-live="polite" className="rounded-lg border border-border border-l-4 border-l-denim bg-paper p-4">
                <p className="eyebrow mb-1">Selected part</p>
                <h2 className="font-display text-lg font-bold text-denim">{cur.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink">{cur.fn}</p>
              </div>
            )}

            <div>
              <p className="eyebrow mb-2">All parts</p>
              <ul className="flex flex-wrap gap-1.5">
                {parts.map(p => (
                  <li key={p.slug}>
                    <button
                      className={`rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
                        p.slug === sel
                          ? 'border-denim bg-denim text-white'
                          : 'border-border bg-paper text-ink hover:border-denim/40 hover:bg-denim-light hover:text-denim'
                      }`}
                      aria-pressed={p.slug === sel}
                      onClick={() => pick(p.slug)}
                    >
                      {p.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="rounded-lg border border-border border-l-4 border-l-denim bg-paper p-4">
            <p className="eyebrow mb-1">Sign in to explore</p>
            <h2 className="font-display text-lg font-bold text-denim">See what each part does</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink">
              You can turn, zoom, and see through the model for free. Sign in to tap any of its {parts.length}{' '}
              parts and learn what each one does.
            </p>
            <Link href="/login?next=/parts" className="btn mt-3 self-start">Sign in</Link>
          </div>
        )}
      </div>

    </div>
  )
}
