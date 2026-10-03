'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { closeConsentPanel, saveConsent, useConsent } from '@/lib/consent'

export default function CookieConsent() {
  const { ready, decided, thirdParty, panelOpen } = useConsent()
  const [details, setDetails] = useState(false)
  const [videos, setVideos] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)

  const visible = ready && (!decided || panelOpen)

  // When re-opened from "Privacy & cookies", start from the saved choice.
  useEffect(() => {
    if (visible) {
      setVideos(thirdParty)
      setDetails(decided)
      headingRef.current?.focus({ preventScroll: true })
    }
  }, [visible, decided, thirdParty])

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-labelledby="consent-title"
      aria-describedby="consent-desc"
      className="fixed inset-x-0 bottom-0 z-[60] px-3 pb-3 sm:px-4 sm:pb-4"
      style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}
    >
      <div className="mx-auto max-h-[85vh] max-w-2xl overflow-y-auto rounded-lg border border-border border-t-thread bg-paper p-5 shadow-md [border-top-style:dashed] [border-top-width:3px]">
        <h2
          id="consent-title"
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-lg font-bold text-denim outline-none"
        >
          Your data, your choice
        </h2>

        <div id="consent-desc" className="mt-2 grid gap-2 text-sm leading-relaxed text-ink">
          <p>
            B.M.O (Basic Machine Operation) saves your sign-in and lesson progress so you can pick up where you
            left off. In line with the <strong>Data Privacy Act of 2012 (Republic Act No. 10173)</strong>, we only
            collect and use your personal data with your knowledge and consent, for the purposes stated in our
            Privacy Statement, and only as much as we need.
          </p>
          <p className="text-muted">
            Lesson videos are hosted by YouTube and Google Drive, which may set their own cookies. They load only
            if you allow them.{' '}
            <Link href="/privacy" className="font-medium text-denim underline underline-offset-2">
              Read the full Privacy Statement
            </Link>
            .
          </p>
        </div>

        <button
          type="button"
          onClick={() => setDetails(d => !d)}
          aria-expanded={details}
          aria-controls="consent-details"
          className="mt-3 text-sm font-medium text-denim underline underline-offset-2"
        >
          {details ? 'Hide choices' : 'Choose what to allow'}
        </button>

        {details && (
          <div id="consent-details" className="mt-3 grid gap-3 rounded border border-border bg-chalk p-3 text-sm">
            <div>
              <p className="font-medium text-ink">Essential — always on</p>
              <p className="mt-0.5 text-muted">
                The sign-in session cookie, and on-device storage for your progress, checklists and this choice.
                The app cannot work without these.
              </p>
            </div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={videos}
                onChange={e => setVideos(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-[#22336B]"
              />
              <span>
                <span className="font-medium text-ink">Lesson videos (YouTube / Google Drive)</span>
                <span className="mt-0.5 block text-muted">
                  Lets the lesson video player load. These services may set cookies and receive your IP address.
                </span>
              </span>
            </label>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" className="btn" onClick={() => saveConsent(true)}>
            Accept all
          </button>
          <button type="button" className="btn-outline" onClick={() => saveConsent(false)}>
            Essential only
          </button>
          {details && (
            <button type="button" className="btn-ghost" onClick={() => saveConsent(videos)}>
              Save my choices
            </button>
          )}
          {decided && (
            <button type="button" className="btn-ghost ml-auto" onClick={closeConsentPanel}>
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
