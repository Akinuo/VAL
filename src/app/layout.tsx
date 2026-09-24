import './globals.css'
import '@fontsource/fraunces/600.css'
import '@fontsource/fraunces/700.css'
import type { Metadata, Viewport } from 'next'
import { Providers } from '@/lib/progress'
import AppShell from '@/components/AppShell'

export const metadata: Metadata = {
  title: 'VAL Guide — Basic Sewing Machine Operation',
  description: 'Guided lessons, quizzes, and checklists for BTLED Home Economics students learning basic sewing machine operation.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6E1A2C',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-cream font-sans text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded focus:bg-maroon focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
