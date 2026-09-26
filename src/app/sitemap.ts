import type { MetadataRoute } from 'next'
import { getContent } from '@/lib/content'

// Regenerated on the same hourly cadence as the content it lists — see
// `revalidate` on the pages themselves (src/app/*/page.tsx).
export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://val-akinuo.vercel.app').replace(/\/$/, '')
  const { lessons } = await getContent()

  // /parts, /settings, /login and /qr are excluded: gated, personal, or
  // marked noindex respectively (see each page's own metadata).
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: 'monthly', priority: 1 },
    { url: `${base}/home`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${base}/checklists`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/feedback`, changeFrequency: 'yearly', priority: 0.3 },
  ]

  const lessonRoutes: MetadataRoute.Sitemap = lessons.map(l => ({
    url: `${base}/lessons/${l.slug}`,
    changeFrequency: 'monthly',
    priority: 0.9,
  }))

  return [...staticRoutes, ...lessonRoutes]
}
