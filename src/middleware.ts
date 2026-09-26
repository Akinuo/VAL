import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // No Supabase configured (e.g. local dev on content.json) — nothing to gate.
  if (!url || !key) return NextResponse.next()

  // /parts requires an account (only the homepage preview is open to everyone).
  // /lessons is intentionally NOT gated here — lesson progress works for
  // guests via localStorage (see lib/progress.tsx), and the app's own copy
  // (Hero, LoginForm, QR codes) promises lessons are free to browse without
  // an account. Locking /lessons here would silently break that promise.
  const { pathname } = req.nextUrl
  const needsAuth = pathname === '/parts'
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
  matcher: ['/parts'],
}
