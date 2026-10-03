import type { Metadata } from 'next'
import PrivacyBody from '@/components/PrivacyBody'

export const metadata: Metadata = {
  title: 'Privacy Statement',
  description:
    'How B.M.O (Basic Machine Operation) collects, uses and protects your personal data under the Data Privacy Act of 2012 (Republic Act No. 10173).',
}

export default function PrivacyPage() {
  return (
    <article className="max-w-prose text-[15px] leading-relaxed text-ink">
      <h1 className="page-title">Privacy Statement</h1>
      <p className="mt-1 text-sm text-muted">B.M.O (Basic Machine Operation) · Last updated October 2026</p>
      <PrivacyBody />
    </article>
  )
}
