import type { Metadata } from 'next'
import QrHub from '@/components/QrHub'
import { getContent } from '@/lib/content'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'QR hub',
  description: 'Generate a QR code for any lesson, checklist, or page to print or share.',
  // A code-generation tool, not content — keep it out of search results.
  robots: { index: false, follow: true },
}

export default async function Qr() {
  return (
    <>
      <div className="mb-6">
        <h1 className="page-title">QR hub</h1>
        <p className="mt-1 text-sm text-muted">
          Pick a page, then print or share its QR code. Scanning it opens that page on any phone.
        </p>
      </div>
      <QrHub c={await getContent()} />
    </>
  )
}
