import type { Metadata } from 'next'

// feedback/page.tsx is a 'use client' component, which can't export
// metadata itself — this server-component layout carries it instead.
export const metadata: Metadata = {
  title: 'Feedback',
  description: 'Share feedback on VAL Guide — what worked, what didn\u2019t, and what to add next.',
}

export default function FeedbackLayout({ children }: { children: React.ReactNode }) {
  return children
}
