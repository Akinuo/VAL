import type { Metadata } from 'next'
import Dashboard from '@/components/Dashboard'
import { getContent } from '@/lib/content'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Your lessons',
  description: 'Pick up where you left off — track progress and badges across all sewing machine lessons.',
}

export default async function HomePage() {
  return <Dashboard c={await getContent()} />
}
