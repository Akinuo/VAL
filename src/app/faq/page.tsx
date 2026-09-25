import { getContent } from '@/lib/content'
import FaqList from '@/components/FaqList'
export const revalidate = 3600

export default async function Faq() {
  const { faqs } = await getContent()
  return (
    <>
      <div className="mb-6">
        <h1 className="page-title">Frequently asked questions</h1>
        <p className="mt-1 text-sm text-muted">Select a question to read the answer.</p>
      </div>

      <FaqList faqs={faqs} />
    </>
  )
}
