'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useProgress } from '@/lib/progress'
import { IconSpool, IconCheck, IconRibbon, IconPlay } from '@/components/icons'

// Google "G" logo — inline so there's no extra dependency
function GoogleLogo() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  )
}

const PERKS = [
  { Icon: IconPlay,   text: '8 video lessons with step-by-step guides' },
  { Icon: IconCheck,  text: 'Progress saved and synced across devices' },
  { Icon: IconRibbon, text: 'Earn badges as you complete lessons' },
]

// Map raw Supabase error messages to student-friendly text
function friendlyError(msg: string): string {
  const m = msg.toLowerCase()
  if (m.includes('invalid login') || m.includes('invalid credentials')) return 'Incorrect email or password.'
  if (m.includes('email not confirmed')) return 'Please confirm your email address first, then try again.'
  if (m.includes('user already registered')) return 'An account with this email already exists. Try logging in instead.'
  if (m.includes('password should be at least')) return 'Password must be at least 6 characters.'
  if (m.includes('rate limit')) return 'Too many attempts. Please wait a moment and try again.'
  if (m.includes('network') || m.includes('fetch')) return 'Connection error. Check your internet and try again.'
  return 'Something went wrong. Please try again.'
}

export default function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { email: authedEmail } = useProgress()

  const [isSignup, setIsSignup] = useState(params.get('mode') === 'signup')
  const [msg, setMsg] = useState(
    params.get('error') === 'oauth' ? 'Google sign-in failed. Please try again.' : ''
  )
  const [msgType, setMsgType] = useState<'ok' | 'err'>('err')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  useEffect(() => {
    if (authedEmail) router.replace(params.get('next') ?? '/home')
  }, [authedEmail, router, params])

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!supabase) {
      setMsg('Login is not set up yet. Add your Supabase keys to .env.local.')
      setMsgType('err')
      return
    }
    setLoading(true)
    setMsg('')
    const f = new FormData(e.currentTarget)
    const cred = { email: String(f.get('email')), password: String(f.get('password')) }
    const { data, error } = isSignup
      ? await supabase.auth.signUp(cred)
      : await supabase.auth.signInWithPassword(cred)
    setLoading(false)
    if (error) {
      setMsg(friendlyError(error.message))
      setMsgType('err')
    } else if (data.session) {
      router.replace(params.get('next') ?? '/home')
    } else {
      setMsg('Check your email to confirm your account, then log in.')
      setMsgType('ok')
    }
  }

  async function signInWithGoogle() {
    if (!supabase) {
      setMsg('Login is not set up yet. Add your Supabase keys to .env.local.')
      setMsgType('err')
      return
    }
    setGoogleLoading(true)
    setMsg('')
    const next = params.get('next') ?? '/home'
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    })
    if (error) {
      setMsg(friendlyError(error.message))
      setMsgType('err')
      setGoogleLoading(false)
    }
    // On success the browser navigates away — no need to reset loading
  }

  return (
    <div className="min-h-screen bg-cream">

      {/* Header */}
      <header className="border-b border-border bg-paper">
        <div className="mx-auto flex max-w-app items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-2 font-serif text-base font-bold text-maroon">
            <IconSpool className="h-5 w-5" />
            VAL Guide
          </Link>
        </div>
      </header>

      <div className="mx-auto grid max-w-app gap-0 lg:grid-cols-[1fr_1.1fr]" style={{ minHeight: 'calc(100vh - 49px)' }}>

        {/* Left — brand panel */}
        <div className="hidden flex-col justify-between border-r border-border bg-maroon px-8 py-12 text-white lg:flex">
          <div>
            <p className="eyebrow mb-3 text-white/50">BTLED Home Economics</p>
            <h1 className="font-serif text-2xl font-bold leading-snug">
              {isSignup ? 'Start learning today.' : 'Welcome back.'}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/65">
              VAL Guide walks you through basic sewing machine operation — parts, threading, bobbin
              winding, stitch settings, safety, and care.
            </p>
            <ul className="mt-8 grid gap-3">
              {PERKS.map(({ Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm text-white/75">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Icon className="h-3.5 w-3.5 text-amber" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
          <p className="text-xs text-white/30">No account needed to browse lessons.</p>
        </div>

        {/* Right — form */}
        <div className="flex flex-col justify-center bg-paper px-6 py-12 sm:px-10">
          <div className="mx-auto w-full max-w-sm">

            <h2 className="font-serif text-2xl font-bold text-maroon">
              {isSignup ? 'Create an account' : 'Log in'}
            </h2>
            <p className="mt-1 text-sm text-muted">
              {isSignup
                ? 'Sign up to save your progress across devices.'
                : 'Continue your learning journey.'}
            </p>

            {!supabase && (
              <div className="alert-info mt-4">
                Supabase is not configured. Add your keys to{' '}
                <code className="font-mono text-xs">.env.local</code> to enable login.
              </div>
            )}

            {/* ── Google sign-in ── */}
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={googleLoading || !supabase}
              className="mt-6 flex w-full items-center justify-center gap-3 rounded border border-border bg-paper py-2.5 text-sm font-medium text-ink shadow-sm transition-colors hover:bg-cream disabled:cursor-not-allowed disabled:opacity-50"
            >
              {googleLoading ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-border border-t-ink" />
              ) : (
                <GoogleLogo />
              )}
              Continue with Google
            </button>

            {/* ── Divider ── */}
            <div className="relative mt-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted">or</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            <form onSubmit={submit} className="mt-5 grid gap-4">
              <label className="block text-sm font-medium text-ink">
                Email address
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="field"
                />
              </label>

              <label className="block text-sm font-medium text-ink">
                Password
                {isSignup && (
                  <span className="ml-1 font-normal text-muted">(min. 6 characters)</span>
                )}
                <div className="relative">
                  <input
                    name="password"
                    type={showPw ? 'text' : 'password'}
                    required
                    minLength={6}
                    autoComplete={isSignup ? 'new-password' : 'current-password'}
                    placeholder="••••••••"
                    className="field pr-10"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted underline underline-offset-2 hover:text-maroon"
                    onClick={() => setShowPw(v => !v)}
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? 'Hide' : 'Show'}
                  </button>
                </div>
              </label>

              <button className="btn mt-1 w-full" disabled={loading}>
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    {isSignup ? 'Creating account…' : 'Logging in…'}
                  </span>
                ) : isSignup ? 'Create account' : 'Log in'}
              </button>

              {msg && (
                <p aria-live="polite" className={msgType === 'ok' ? 'alert-ok' : 'alert-err'}>
                  {msg}
                </p>
              )}
            </form>

            <div className="mt-6 border-t border-border pt-5 text-center">
              <button
                type="button"
                className="text-sm text-maroon underline underline-offset-2 hover:text-maroon-deep"
                onClick={() => { setIsSignup(!isSignup); setMsg('') }}
              >
                {isSignup ? 'Already have an account? Log in' : "Don't have an account? Sign up"}
              </button>
            </div>

            <p className="mt-4 text-center text-xs text-muted">
              You can also{' '}
              <Link href="/home" className="underline hover:text-maroon">
                browse without logging in
              </Link>
              . Progress stays on this device only.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}
