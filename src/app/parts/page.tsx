import { Suspense } from 'react'
import PartsDiagram from '@/components/PartsDiagram'
import { getContent } from '@/lib/content'
export const revalidate = 3600

export default async function Parts() {
  const { parts } = await getContent()
  return (
    <>
      <div className="mb-6">
        <p className="eyebrow mb-1">Reference</p>
        <h1 className="page-title">Machine parts</h1>
        <p className="mt-1 text-sm text-muted">
          Select a dot on the diagram or a part name below to learn its function.
        </p>
      </div>
      <Suspense fallback={<p className="text-sm text-muted">Loading diagram…</p>}>
        <PartsDiagram parts={parts} />
      </Suspense>
    </>
  )
}
