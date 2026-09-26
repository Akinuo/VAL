import { Suspense } from 'react'
import type { Metadata } from 'next'
import PartsDiagram from '@/components/PartsDiagram'
import { getContent } from '@/lib/content'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Machine parts',
  description: 'Explore the 14 parts of the sewing machine in an interactive 3D view.',
  // Gated behind login (see middleware.ts) — a crawler can't reach the real content anyway.
  robots: { index: false, follow: true },
}

export default async function Parts() {
  const { parts } = await getContent()
  return (
    <>
      <div className="mb-6">
        <h1 className="page-title">Machine parts</h1>
        <p className="mt-1 text-sm text-muted">
          Turn the 3D machine, then select a dot or a part name to learn its function.
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-muted">Loading diagram…</p>}>
        <PartsDiagram parts={parts} />
      </Suspense>
    </>
  )
}
