import './globals.css'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/atkinson-hyperlegible/400.css'
import '@fontsource/atkinson-hyperlegible/700.css'
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
  themeColor: '#22336B',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-chalk font-sans text-ink">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:rounded focus:bg-denim focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
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
