import Checklists from '@/components/Checklists'
import { getContent } from '@/lib/content'
export const revalidate = 3600

export default async function Page() {
  return (
    <>
      <div className="mb-6">
        <p className="eyebrow mb-1">Practice tool</p>
        <h1 className="page-title">Checklists</h1>
        <p className="mt-1 text-sm text-muted">Ticks are saved on this device only.</p>
      </div>
      <Checklists lists={(await getContent()).checklists} />
    </>
  )
}
