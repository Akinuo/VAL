'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Nav, { TabBar } from './Nav'
import ConsentLink from './ConsentLink'

// These pages draw their own full-page layout
const OWN_LAYOUT = new Set(['/', '/login'])

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  if (OWN_LAYOUT.has(path)) return <>{children}</>

  const wide = path === '/parts' // the 3D viewer needs the room
  return (
    <div className="flex min-h-screen flex-col bg-chalk">
      <Nav />
      <main id="main" className={`mx-auto w-full flex-1 px-4 py-6 pb-28 sm:px-6 sm:py-10 sm:pb-12 ${wide ? 'max-w-5xl' : 'max-w-app'}`}>
        {children}
      </main>
      <footer className="hidden border-t border-border bg-paper sm:block">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-2 px-6 py-4 text-sm text-muted">
          <span>B.M.O (Basic Machine Operation) for BTLED Home Economics</span>
          <span className="flex gap-4">
            <Link href="/privacy" className="underline underline-offset-2">Privacy Statement</Link>
            <ConsentLink />
          </span>
        </div>
      </footer>
      <TabBar />
    </div>
  )
}
