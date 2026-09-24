import { getContent } from '@/lib/content'
export const revalidate = 3600

export default async function Faq() {
  const { faqs } = await getContent()
  return (
    <>
      <div className="mb-6">
        <h1 className="page-title">Frequently asked questions</h1>
        <p className="mt-1 text-sm text-muted">Select a question to read the answer.</p>
      </div>

      <div className="divide-y divide-border rounded-lg border border-border bg-paper">
        {faqs.map((f, idx) => (
          <details key={f.q} className="group">
            <summary className="flex min-h-[52px] cursor-pointer list-none select-none items-center gap-3 px-5 py-3 transition-colors hover:bg-denim-light">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-denim-light font-display text-xs font-bold text-denim group-open:bg-denim group-open:text-white transition-colors">
                {idx + 1}
              </span>
              <span className="flex-1 text-sm font-semibold text-ink">{f.q}</span>
              <span className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-180" aria-hidden="true">
                ▾
              </span>
            </summary>
            <p className="border-t border-border px-5 pb-5 pt-3 text-sm leading-relaxed text-ink">
              {f.a}
            </p>
          </details>
        ))}
      </div>
    </>
  )
}
