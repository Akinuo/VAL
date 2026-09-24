'use client'
import { usePathname } from 'next/navigation'
import Nav from './Nav'
import Stitch from './Stitch'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const path = usePathname()

  // Landing page manages its own full layout
  if (path === '/') return <>{children}</>

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Nav />
      <main id="main" className="mx-auto w-full max-w-app flex-1 px-4 py-8 sm:px-6">
        {children}
      </main>
      <footer className="border-t border-border bg-paper">
        <div className="mx-auto flex max-w-app items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Stitch className="w-24 text-border" />
          <p className="text-xs text-muted">VAL Guide · BTLED Home Economics</p>
        </div>
      </footer>
    </div>
  )
}
