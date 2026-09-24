import { NextResponse, type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = req.nextUrl
  const code = searchParams.get('code')
  const raw = searchParams.get('next') ?? '/home'
  // Only allow same-site paths
  const next = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/home'

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (code && url && key) {
    const res = NextResponse.redirect(`${origin}${next}`)
    const supabase = createServerClient(url, key, {
      cookies: {
        getAll: () => req.cookies.getAll(),
        // The session cookies must be set on the redirect response itself
        setAll: list => list.forEach(({ name, value, options }) => res.cookies.set(name, value, options)),
      },
    })
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return res
  }

  return NextResponse.redirect(`${origin}/login?error=oauth`)
}
