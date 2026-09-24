import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Public routes — no auth required
const PUBLIC = new Set(['/', '/login', '/auth/callback'])

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (PUBLIC.has(pathname)) return NextResponse.next()

  // Supabase stores the session in a cookie whose name starts with "sb-" and ends with "-auth-token"
  const hasSession = req.cookies.getAll().some(
    c => c.name.startsWith('sb-') && c.name.endsWith('-auth-token')
  )

  if (!hasSession) {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  // Run on every route except Next.js internals and static files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)'],
}
