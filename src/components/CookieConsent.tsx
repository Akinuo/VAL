'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import { closeConsentPanel, saveConsent, useConsent } from '@/lib/consent'
import PrivacyBody from './PrivacyBody'

type View = 'choices' | 'statement'

function ShieldIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
      <path d="M12 3 5 6v5.5c0 4.2 2.8 7.6 7 9.5 4.2-1.9 7-5.3 7-9.5V6l-7-3Z" />
      <path d="m9 12 2.2 2.2L15.2 10" />
    </svg>
  )
}

function Row({ title, badge, children, action }: { title: string; badge?: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 rounded-lg border border-border bg-chalk/60 p-4">
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-ink">
          {title}
          {badge && <span className="rounded-full bg-green-soft px-2 py-0.5 text-xs font-medium text-green">{badge}</span>}
        </p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{children}</p>
      </div>
      {action}
    </div>
  )
}

export default function CookieConsent() {
  const { ready, decided, thirdParty, panelOpen } = useConsent()
  const [view, setView] = useState<View>('choices')
  const [videos, setVideos] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const visible = ready && (!decided || panelOpen)
  // First-time visitors must choose. Someone re-opening it from the footer may dismiss it.
  const dismissible = decided

  useEffect(() => {
    if (!visible) return
    setVideos(thirdParty)
    setView('choices')
  }, [visible, thirdParty])

  // Lock the page behind the dialog: no scrolling, no clicking, no tabbing into it.
  useEffect(() => {
    if (!visible) return
    const root = document.getElementById('app-root')
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    root?.setAttribute('inert', '')
    root?.setAttribute('aria-hidden', 'true')
    return () => {
      document.documentElement.style.overflow = prevOverflow
      root?.removeAttribute('inert')
      root?.removeAttribute('aria-hidden')
    }
  }, [visible])

  useEffect(() => {
    if (!visible) return
    scrollRef.current?.scrollTo({ top: 0 })
    headingRef.current?.focus({ preventScroll: true })
  }, [visible, view])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (view === 'statement') { e.stopPropagation(); setView('choices') }
        else if (dismissible) closeConsentPanel()
        return
      }
      if (e.key !== 'Tab') return
      const nodes = dialogRef.current?.querySelectorAll<HTMLElement>('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')
      if (!nodes || nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current || document.activeElement === headingRef.current)) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    },
    [view, dismissible],
  )

  if (!visible) return null

  const reading = view === 'statement'

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end justify-center bg-denim-deep/70 backdrop-blur-sm sm:items-center sm:p-6"
      onMouseDown={e => { if (e.target === e.currentTarget && dismissible && !reading) closeConsentPanel() }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-title"
        onKeyDown={onKeyDown}
        className="fade-in flex max-h-[92dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-2xl bg-paper shadow-md sm:max-h-[86dvh] sm:rounded-2xl"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* topstitch */}
        <svg viewBox="0 0 400 6" preserveAspectRatio="none" aria-hidden="true" className="h-1.5 w-full shrink-0">
          <line x1="0" y1="3" x2="400" y2="3" stroke="#E59B1C" strokeWidth="3" strokeDasharray="14 9" />
        </svg>

        {/* header */}
        <div className="flex shrink-0 items-center gap-3 px-5 pb-3 pt-4 sm:px-6">
          {reading ? (
            <button type="button" onClick={() => setView('choices')} className="btn-ghost -ml-2 !px-2" aria-label="Back to cookie choices">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true"><path d="m15 18-6-6 6-6" /></svg>
            </button>
          ) : (
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-denim-light text-denim">
              <ShieldIcon className="h-6 w-6" />
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 id="consent-title" ref={headingRef} tabIndex={-1} style={{ outline: 'none' }} className="font-display text-xl font-bold leading-tight text-denim">
              {reading ? 'Privacy Statement' : 'Your data, your choice'}
            </h2>
            <p className="text-xs text-muted">
              {reading ? 'Data Privacy Act of 2012 (RA 10173) · Updated October 2026' : 'B.M.O · Basic Machine Operation'}
            </p>
          </div>
          {dismissible && !reading && (
            <button type="button" onClick={closeConsentPanel} className="btn-ghost !px-2" aria-label="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-5 w-5" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18" /></svg>
            </button>
          )}
        </div>

        {/* body */}
        <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto border-t border-border px-5 py-4 sm:px-6">
          {reading ? (
            <div className="text-sm leading-relaxed text-ink">
              <PrivacyBody modal />
            </div>
          ) : (
            <div className="grid gap-4">
              <p className="text-sm leading-relaxed text-ink">
                B.M.O saves your sign-in and lesson progress so you can pick up where you left off. Under the{' '}
                <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong> we collect and use your personal
                data only with your knowledge and consent, for stated purposes, and only as much as we need.
              </p>

              <Row title="Essential" badge="Always on" >
                Sign-in session cookie and on-device storage for your progress, checklists and this choice. The app
                can&apos;t work without them.
              </Row>

              <Row
                title="Lesson videos"
                action={
                  <button
                    type="button"
                    role="switch"
                    aria-checked={videos}
                    aria-label="Allow lesson videos from YouTube and Google Drive"
                    onClick={() => setVideos(v => !v)}
                    className={`relative mt-0.5 h-7 w-12 shrink-0 rounded-full transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-denim ${videos ? 'bg-denim' : 'bg-border'}`}
                  >
                    <span className={`absolute left-0.5 top-0.5 h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-150 ${videos ? 'translate-x-5' : ''}`} />
                  </button>
                }
              >
                Videos are served by YouTube and Google Drive, which may set cookies and see your IP address. They
                load only if you switch this on.
              </Row>

              <button
                type="button"
                onClick={() => setView('statement')}
                className="flex items-center justify-between gap-3 rounded-lg border border-denim/25 px-4 py-3 text-left text-sm font-semibold text-denim transition-colors hover:border-denim hover:bg-denim-light"
              >
                Read the full Privacy Statement
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
              </button>
            </div>
          )}
        </div>

        {/* actions: always visible, also while reading */}
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-border bg-chalk/60 px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button type="button" className="btn-outline" onClick={() => saveConsent(videos)}>
            {videos ? 'Save my choices' : 'Essential only'}
          </button>
          <button type="button" className="btn" onClick={() => saveConsent(true)}>
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}
