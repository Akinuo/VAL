'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Nav, { TabBar } from './Nav'

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
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4 text-sm text-muted">
          <span>VAL Guide for BTLED Home Economics</span>
          <Link href="/qr" className="underline underline-offset-2 hover:text-denim">QR codes for teachers</Link>
        </div>
      </footer>
      <TabBar />
    </div>
  )
}
