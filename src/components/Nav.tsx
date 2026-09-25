'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useProgress } from '@/lib/progress'
import { IconSpool, IconPartMarker, IconCheck, IconQr, IconMessage, IconWrench } from './icons'

const TABS = [
  ['/home',       'Lessons',    IconSpool],
  ['/parts',      'Parts',      IconPartMarker],
  ['/checklists', 'Checklists', IconCheck],
  ['/qr',         'QR',         IconQr],
  ['/feedback',   'Feedback',   IconMessage],
] as const

const isActive = (path: string, href: string) => (href === '/home' ? path === '/home' || path.startsWith('/lessons') : path.startsWith(href))

export default function Nav() {
  const { email, signOut } = useProgress()
  const path = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-paper" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-display text-xl font-extrabold tracking-tight text-denim">VAL Guide</Link>

        <nav aria-label="Main" className="hidden items-center gap-1 sm:flex">
          {TABS.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(path, href) ? 'page' : undefined}
              className={`rounded px-3 py-1.5 text-sm font-medium transition-colors ${isActive(path, href) ? 'bg-denim-light text-denim' : 'text-muted hover:text-denim'}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            href="/settings"
            aria-label="Settings"
            aria-current={path === '/settings' ? 'page' : undefined}
            className={`btn-ghost !px-2 ${path === '/settings' ? 'bg-denim-light text-denim' : ''}`}
          >
            <IconWrench className="h-5 w-5" />
          </Link>
          {email ? (
            <button onClick={signOut} className="btn-ghost" title={email}>Log out</button>
          ) : (
            <Link href="/login" className="btn-outline !min-h-[36px] !px-4">Log in</Link>
          )}
        </div>
      </div>
      <div className="stitch-rule" aria-hidden="true" />
    </header>
  )
}

// Phone navigation: thumb-reach tabs along the bottom
export function TabBar() {
  const path = usePathname()
  return (
    <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-paper sm:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <ul className="grid grid-cols-5">
        {TABS.map(([href, label, Icon]) => {
          const on = isActive(path, href)
          return (
            <li key={href}>
              <Link href={href} aria-current={on ? 'page' : undefined} className={`relative flex h-16 flex-col items-center justify-center gap-1 text-xs font-medium ${on ? 'text-denim' : 'text-muted'}`}>
                {on && <span className="absolute inset-x-5 top-0 h-[3px] rounded-b bg-thread" aria-hidden="true" />}
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
