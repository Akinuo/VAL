import type { Metadata } from 'next'
import { getContent } from '@/lib/content'
import Settings from '@/components/Settings'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Settings',
  description: 'Account settings and frequently asked questions for VAL Guide.',
  robots: { index: false, follow: true },
}

export default async function SettingsPage() {
  const { faqs } = await getContent()
  return <Settings faqs={faqs} />
}
