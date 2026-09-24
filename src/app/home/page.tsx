import Dashboard from '@/components/Dashboard'
import { getContent } from '@/lib/content'
export const revalidate = 3600

export default async function HomePage() {
  return <Dashboard c={await getContent()} />
}
