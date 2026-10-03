import './globals.css'
import '@fontsource-variable/bricolage-grotesque'
import '@fontsource/atkinson-hyperlegible/400.css'
import '@fontsource/atkinson-hyperlegible/700.css'
import type { Metadata, Viewport } from 'next'
import { Providers } from '@/lib/progress'
import AppShell from '@/components/AppShell'
import CookieConsent from '@/components/CookieConsent'

const SITE_DESCRIPTION =
  'Guided lessons, quizzes, and checklists for BTLED Home Economics students learning basic sewing machine operation.'

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL ? new URL(process.env.NEXT_PUBLIC_SITE_URL) : undefined,
  title: {
    default: 'Basic Machine Operation (B.M.O)',
    // Every page below sets its own title (e.g. "Checklists") and inherits
    // "— B.M.O" from here, so tabs/bookmarks/search results stop being
    // identical across pages without repeating the suffix everywhere.
    template: '%s — B.M.O',
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    title: 'Basic Machine Operation (B.M.O)',
    description: SITE_DESCRIPTION,
    images: ['/logo-full.png'],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
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
          <div id="app-root">
            <AppShell>{children}</AppShell>
          </div>
          <CookieConsent />
        </Providers>
      </body>
    </html>
  )
}
