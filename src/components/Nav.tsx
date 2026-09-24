'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useProgress } from '@/lib/progress'
import { IconSpool, IconPartMarker, IconCheck, IconQuestion, IconQr, IconMessage } from './icons'

const LINKS = [
  ['/home',       'Home',          IconSpool],
  ['/parts',      'Machine parts', IconPartMarker],
  ['/checklists', 'Checklists',    IconCheck],
  ['/faq',        'FAQ',           IconQuestion],
  ['/qr',         'QR hub',        IconQr],
  ['/feedback',   'Feedback',      IconMessage],
] as const

export default function Nav() {
  const { email, signOut } = useProgress()
  const path = usePathname()
  const [open, setOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Close on Escape
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const initial = email ? email[0].toUpperCase() : null

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-maroon text-white shadow-nav" ref={drawerRef}>
      <div className="mx-auto max-w-app px-4">

        {/* Top row */}
        <div className="flex h-12 items-center justify-between gap-2">
          <Link
            href="/home"
            className="flex items-center gap-2 font-serif text-base font-bold text-white transition-colors hover:text-amber"
            onClick={() => setOpen(false)}
          >
            <IconSpool className="h-5 w-5 text-amber" />
            VAL Guide
          </Link>

          <div className="flex items-center gap-2">
            {email ? (
              <div className="flex items-center gap-2">
                {initial && (
                  <span
                    className="hidden h-7 w-7 items-center justify-center rounded-full bg-amber font-bold text-xs text-ink sm:flex"
                    title={email}
                    aria-label={`Logged in as ${email}`}
                  >
                    {initial}
                  </span>
                )}
                <button
                  onClick={signOut}
                  className="text-sm text-white/70 underline underline-offset-2 transition-colors hover:text-white"
                >
                  Log out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-sm text-white/70 underline underline-offset-2 transition-colors hover:text-white"
              >
                Log in
              </Link>
            )}

            {/* Hamburger — mobile only */}
            <button
              className="ml-1 flex h-9 w-9 flex-col items-center justify-center gap-1.5 rounded transition-colors hover:bg-white/10 sm:hidden"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              onClick={() => setOpen(o => !o)}
            >
              <span className={`block h-0.5 w-5 bg-white transition-transform duration-200 ${open ? 'translate-y-2 rotate-45' : ''}`} />
              <span className={`block h-0.5 w-5 bg-white transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
              <span className={`block h-0.5 w-5 bg-white transition-transform duration-200 ${open ? '-translate-y-2 -rotate-45' : ''}`} />
            </button>
          </div>
        </div>

        {/* Desktop nav links */}
        <nav aria-label="Main navigation" className="hidden sm:flex">
          {LINKS.map(([href, label, Icon]) => {
            const active = href === '/home' ? path === '/home' : path.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                className={`flex h-10 items-center gap-1.5 border-b-2 px-2.5 text-sm transition-colors ${
                  active
                    ? 'border-amber text-amber'
                    : 'border-transparent text-white/75 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Mobile drawer */}
      {open && (
        <nav
          aria-label="Mobile navigation"
          className="border-t border-white/10 bg-maroon-deep sm:hidden"
        >
          {LINKS.map(([href, label, Icon]) => {
            const active = href === '/home' ? path === '/home' : path.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
                className={`flex min-h-[48px] items-center gap-3 border-l-2 px-5 text-sm font-medium transition-colors ${
                  active
                    ? 'border-amber bg-white/5 text-amber'
                    : 'border-transparent text-white/75 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            )
          })}
        </nav>
      )}

      {/* Stitch rule */}
      <div className="stitch-rule" aria-hidden="true" />
    </header>
  )
}
