'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import type { Content } from '@/lib/content'

export default function PartsDiagram({ parts }: { parts: Content['parts'] }) {
  const params = useSearchParams()
  const [sel, setSel] = useState(parts[0]?.slug)

  useEffect(() => {
    const p = params.get('part')
    if (p && parts.some(x => x.slug === p)) setSel(p)
  }, [params, parts])

  const cur = parts.find(p => p.slug === sel)

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_300px]">

      {/* ── Diagram ── */}
      <div>
        <svg
          viewBox="0 0 320 230"
          role="group"
          aria-label="Sewing machine diagram. Select a labelled dot to learn about that part."
          className="w-full rounded-lg border border-border bg-paper"
        >
          <defs>
            <linearGradient id="dBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor="#9B2D42" />
              <stop offset="60%"  stopColor="#7A1E30" />
              <stop offset="100%" stopColor="#4A0F1C" />
            </linearGradient>
            <linearGradient id="dArmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#8B2236" />
              <stop offset="100%" stopColor="#6E1A2C" />
            </linearGradient>
            <radialGradient id="dWheelGrad" cx="38%" cy="32%">
              <stop offset="0%"   stopColor="#6E1A2C" />
              <stop offset="100%" stopColor="#2A0810" />
            </radialGradient>
            <linearGradient id="dBedGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="#3A7A5E" />
              <stop offset="100%" stopColor="#2D6A4F" />
            </linearGradient>
            <linearGradient id="dShine" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%"   stopColor="white" stopOpacity="0.15" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <filter id="dShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#1C1410" floodOpacity="0.15" />
            </filter>
          </defs>

          {/* ── Bed / base ── */}
          <rect x="14" y="168" width="292" height="46" rx="8" fill="url(#dBedGrad)" filter="url(#dShadow)" />
          <rect x="14" y="168" width="292" height="16" rx="8" fill="url(#dShine)" />
          {/* Throat plate */}
          <rect x="44" y="168" width="72" height="7" rx="1.5" fill="#C8C0B0" opacity="0.55" />
          {/* Feed dog slots */}
          <rect x="56" y="170" width="3.5" height="3" rx="0.8" fill="#1C1410" opacity="0.35" />
          <rect x="63" y="170" width="3.5" height="3" rx="0.8" fill="#1C1410" opacity="0.35" />
          <rect x="70" y="170" width="3.5" height="3" rx="0.8" fill="#1C1410" opacity="0.35" />
          {/* Foot pedal */}
          <rect x="228" y="200" width="64" height="9" rx="4.5" fill="#2A0810" opacity="0.8" />
          <rect x="234" y="196" width="52" height="7" rx="3.5" fill="#3D1020" />

          {/* ── Machine body ── */}
          <rect x="22" y="96" width="256" height="76" rx="14" fill="url(#dBodyGrad)" filter="url(#dShadow)" />
          <rect x="22" y="96" width="256" height="28" rx="14" fill="url(#dShine)" />
          <rect x="22" y="158" width="256" height="14" rx="0" fill="#3A0D18" opacity="0.25" />

          {/* ── Machine arm ── */}
          <rect x="34" y="44" width="210" height="56" rx="14" fill="url(#dArmGrad)" filter="url(#dShadow)" />
          <rect x="34" y="44" width="210" height="20" rx="14" fill="url(#dShine)" />
          {/* Arm-to-body join */}
          <path d="M34 92 Q22 92 22 108" fill="none" stroke="#4A0F1C" strokeWidth="2.5" />

          {/* ── Spool pin ── */}
          {/* pin: x=200, y=34 in content.json */}
          <rect x="198" y="18" width="4" height="20" rx="2" fill="#2A1810" />
          <ellipse cx="200" cy="18" rx="9.5" ry="3" fill="#C8860A" />
          <ellipse cx="200" cy="34" rx="9.5" ry="3" fill="#C8860A" />
          <rect x="190.5" y="18" width="19" height="16" fill="#D4960E" opacity="0.65" />
          <line x1="190.5" y1="23" x2="209.5" y2="23" stroke="#B87A08" strokeWidth="0.8" opacity="0.5" />
          <line x1="190.5" y1="27" x2="209.5" y2="27" stroke="#B87A08" strokeWidth="0.8" opacity="0.5" />
          <line x1="190.5" y1="31" x2="209.5" y2="31" stroke="#B87A08" strokeWidth="0.8" opacity="0.5" />
          {/* Thread leaving spool toward take-up lever */}
          <path d="M200 34 Q180 44 150 30" fill="none" stroke="#C8860A" strokeWidth="1" strokeDasharray="2.5 2" opacity="0.55" />

          {/* ── Bobbin winder spindle ── */}
          {/* x=245, y=34 */}
          <rect x="243" y="38" width="4" height="16" rx="2" fill="#2A1810" />
          <ellipse cx="245" cy="38" rx="5.5" ry="1.8" fill="#999" />
          <ellipse cx="245" cy="52" rx="5.5" ry="1.8" fill="#999" />

          {/* ── Thread guide ── */}
          {/* x=150, y=30 */}
          <circle cx="150" cy="30" r="4" fill="none" stroke="#C8C0B0" strokeWidth="1.4" />
          <circle cx="150" cy="30" r="1.4" fill="#C8C0B0" />

          {/* ── Take-up lever ── */}
          {/* x=75, y=50 */}
          <path d="M88 48 Q82 42 76 52 Q72 58 80 62" fill="none" stroke="#C8C0B0" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="80" cy="62" r="2.5" fill="#C8C0B0" />
          {/* Thread through take-up lever down to needle */}
          <path d="M80 62 Q80 80 80 100" fill="none" stroke="#C8860A" strokeWidth="0.9" strokeDasharray="2.5 2" opacity="0.5" />

          {/* ── Tension dial ── */}
          {/* x=125, y=62 */}
          <circle cx="125" cy="118" r="13" fill="#2A0810" />
          <circle cx="125" cy="118" r="10" fill="#3D1020" />
          {[0,45,90,135,180,225,270,315].map((deg, i) => {
            const rad = (deg * Math.PI) / 180
            return (
              <line
                key={i}
                x1={125 + 6 * Math.cos(rad)}
                y1={118 + 6 * Math.sin(rad)}
                x2={125 + 8.5 * Math.cos(rad)}
                y2={118 + 8.5 * Math.sin(rad)}
                stroke="#C8860A"
                strokeWidth="0.9"
                opacity="0.65"
              />
            )
          })}
          <text x="125" y="122" textAnchor="middle" fontSize="7" fill="#C8860A" fontFamily="serif" fontWeight="bold">4</text>

          {/* ── Stitch selector ── */}
          {/* x=170, y=62 */}
          <circle cx="170" cy="118" r="11" fill="#2A0810" />
          <circle cx="170" cy="118" r="8"  fill="#3D1020" />
          <line x1="170" y1="111" x2="170" y2="114.5" stroke="#C8860A" strokeWidth="1" opacity="0.7" />
          <text x="170" y="122" textAnchor="middle" fontSize="6.5" fill="#C8860A" fontFamily="serif">2.5</text>

          {/* ── Handwheel ── */}
          {/* x=296, y=62 — placed at right of body */}
          <circle cx="296" cy="130" r="28" fill="url(#dWheelGrad)" filter="url(#dShadow)" />
          <circle cx="296" cy="130" r="28" fill="none" stroke="#C8860A" strokeWidth="1.2" opacity="0.35" />
          {[0,60,120,180,240,300].map((deg, i) => {
            const rad = (deg * Math.PI) / 180
            return (
              <line
                key={i}
                x1={296 + 9 * Math.cos(rad)}
                y1={130 + 9 * Math.sin(rad)}
                x2={296 + 24 * Math.cos(rad)}
                y2={130 + 24 * Math.sin(rad)}
                stroke="#C8860A"
                strokeWidth="1"
                opacity="0.45"
              />
            )
          })}
          <circle cx="296" cy="130" r="9"  fill="#4A0F1C" />
          <circle cx="296" cy="130" r="4.5" fill="#6E1A2C" />
          <ellipse cx="289" cy="121" rx="6" ry="4" fill="white" opacity="0.06" transform="rotate(-30 289 121)" />

          {/* ── Presser-foot lever ── */}
          {/* x=36, y=96 */}
          <rect x="34" y="120" width="4.5" height="32" rx="2.2" fill="#999" opacity="0.55" />
          <rect x="28" y="120" width="16" height="5.5" rx="2.5" fill="#999" opacity="0.6" />

          {/* ── Needle bar ── */}
          {/* x=62, y=96 */}
          <rect x="59" y="100" width="6" height="62" rx="3" fill="#2A1810" />
          <rect x="56" y="122" width="12" height="7" rx="2" fill="#888" opacity="0.65" />

          {/* ── Needle ── */}
          {/* x=62, y=118 */}
          <rect x="61" y="160" width="2.8" height="26" rx="1.4" fill="#B0A898" />
          <ellipse cx="62.4" cy="166" rx="1.4" ry="2" fill="none" stroke="#888" strokeWidth="0.9" />
          {/* Thread through needle */}
          <path d="M62.4 168 Q62.4 178 62.4 188" fill="none" stroke="#C8860A" strokeWidth="0.9" strokeDasharray="2 1.5" opacity="0.7" />

          {/* ── Presser foot ── */}
          {/* x=63, y=142 */}
          <rect x="50" y="170" width="26" height="9" rx="3" fill="#3A7A5E" />
          <rect x="52" y="177" width="9" height="5" rx="1.5" fill="#2D6A4F" />
          <rect x="65" y="177" width="9" height="5" rx="1.5" fill="#2D6A4F" />
          <rect x="60" y="150" width="4.5" height="22" rx="2" fill="#888" opacity="0.55" />

          {/* ── Feed dogs / throat plate ── */}
          {/* x=100, y=160 */}
          {/* already drawn above as throat plate slots */}

          {/* ── Bobbin case ── */}
          {/* x=150, y=175 */}
          <ellipse cx="150" cy="178" rx="14" ry="6" fill="#3D1020" opacity="0.6" />
          <ellipse cx="150" cy="178" rx="9"  ry="3.5" fill="#2A0810" opacity="0.7" />

          {/* ── Foot pedal dot ── */}
          {/* x=270, y=211 */}

          {/* ── Interactive part dots ── */}
          {parts.map(p => {
            const active = p.slug === sel
            return (
              <g key={p.slug}>
                {/* Pulse ring when active */}
                {active && (
                  <circle cx={p.x} cy={p.y} r={15} fill="#6E1A2C" opacity={0.1} />
                )}
                {/* Outer ring */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={active ? 8 : 5.5}
                  fill={active ? '#6E1A2C' : '#FAF8F4'}
                  stroke={active ? '#4A0F1C' : '#C8860A'}
                  strokeWidth={active ? 2 : 1.5}
                  className="cursor-pointer transition-all duration-150"
                  tabIndex={0}
                  role="button"
                  aria-label={p.name}
                  aria-pressed={active}
                  onClick={() => setSel(p.slug)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSel(p.slug) }
                  }}
                />
                {/* Inner dot */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={active ? 3 : 2}
                  fill={active ? '#FAF8F4' : '#C8860A'}
                  className="pointer-events-none"
                />
              </g>
            )
          })}
        </svg>
        <p className="mt-2 text-xs text-muted">Select a dot on the diagram, or use the buttons below.</p>
      </div>

      {/* ── Info panel ── */}
      <div className="flex flex-col gap-4">
        {cur && (
          <div aria-live="polite" className="rounded-lg border border-border border-l-4 border-l-maroon bg-paper p-4">
            <p className="eyebrow mb-1">Selected part</p>
            <h2 className="font-serif text-lg font-bold text-maroon">{cur.name}</h2>
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
                      ? 'border-maroon bg-maroon text-white'
                      : 'border-border bg-paper text-ink hover:border-maroon/40 hover:bg-maroon-light hover:text-maroon'
                  }`}
                  aria-pressed={p.slug === sel}
                  onClick={() => setSel(p.slug)}
                >
                  {p.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

    </div>
  )
}
