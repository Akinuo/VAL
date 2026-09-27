import type { Metadata } from 'next'
import AssessmentPlayer from '@/components/AssessmentPlayer'
import { getContent } from '@/lib/content'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Final assessment',
  description: 'Comprehensive final assessment covering every VAL Guide lesson — pass it to earn your certificate of completion.',
  robots: { index: false, follow: true },
}

export default async function AssessmentPage() {
  return <AssessmentPlayer c={await getContent()} />
}
