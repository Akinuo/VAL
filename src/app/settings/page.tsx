import { getContent } from '@/lib/content'
import Settings from '@/components/Settings'
export const revalidate = 3600

export default async function SettingsPage() {
  const { faqs } = await getContent()
  return <Settings faqs={faqs} />
}
