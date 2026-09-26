import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // No Supabase configured (e.g. local dev on content.json) — nothing to gate.
  if (!url || !key) return NextResponse.next()

  // /parts and /lessons both require an account (only the homepage preview
  // is open to everyone). Guest localStorage progress (see lib/progress.tsx)
  // is still used as a local cache once signed in, but it's no longer a
  // substitute for auth — signing in is required to reach either route.
  const { pathname } = req.nextUrl
  const needsAuth = pathname === '/parts' || pathname === '/lessons' || pathname.startsWith('/lessons/')
  if (!needsAuth) return NextResponse.next()

  const res = NextResponse.next()
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => req.cookies.getAll(),
      setAll: list => list.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
    },
  })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const loginUrl = new URL('/login', req.url)
    loginUrl.searchParams.set('next', pathname + req.nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  return res
}

export const config = {
  matcher: ['/parts', '/lessons', '/lessons/:path*'],
}
