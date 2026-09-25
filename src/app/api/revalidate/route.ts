import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Needs the Node.js runtime — revalidatePath isn't available on Edge.
export const runtime = 'nodejs'

// Every route that reads getContent() (see src/lib/content.ts) and therefore
// goes stale until this fires. /lessons/[slug] is handled separately below
// since it's a dynamic segment.
const STATIC_PATHS = ['/', '/home', '/checklists', '/qr', '/parts', '/settings']

async function handle(req: Request) {
  const url = new URL(req.url)
  const secret = req.headers.get('x-revalidate-secret') ?? url.searchParams.get('secret')

  if (!process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'REVALIDATE_SECRET is not set on the server.' }, { status: 503 })
  }
  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false, error: 'Invalid or missing secret.' }, { status: 401 })
  }

  // Supabase Database Webhooks POST the changed row as { table, record, ... }.
  // A manual curl/browser hit won't have a body — both are fine.
  let slug: string | null = url.searchParams.get('slug')
  try {
    const body = await req.json()
    slug = slug ?? body?.record?.slug ?? body?.slug ?? null
  } catch {
    // no/invalid JSON body — ignore, slug from the query string still applies
  }

  const revalidated = [...STATIC_PATHS]
  for (const p of STATIC_PATHS) revalidatePath(p)

  // Revalidate every /lessons/[slug] page in one call…
  revalidatePath('/lessons/[slug]', 'page')
  revalidated.push('/lessons/[slug] (all)')
  // …and the specific slug too, in case that pattern form ever misses it.
  if (slug) {
    revalidatePath(`/lessons/${slug}`)
    revalidated.push(`/lessons/${slug}`)
  }

  return NextResponse.json({ ok: true, revalidated })
}

export const POST = handle
export const GET = handle
