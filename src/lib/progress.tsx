'use client'
import {
  createContext, useCallback, useContext,
  useEffect, useMemo, useState, ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
import type { Session } from '@supabase/supabase-js'
import { Capacitor } from '@capacitor/core'
import { App as CapApp } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { SplashScreen } from '@capacitor/splash-screen'
import { StatusBar, Style } from '@capacitor/status-bar'
import { supabase } from './supabase'

const LEGACY_STORAGE_KEY = 'val-progress'
// Progress used to be cached under one global, unscoped key so it could
// survive from a guest session into a freshly created account. Now that
// /lessons requires auth, that key is stale — and left as-is, it's a data
// leak on a shared device: Account B logging in after Account A logs out
// would inherit (and push to Supabase) Account A's completed lessons.
// Progress is cached per-account instead. DEV_ONLY_KEY is a single
// exception: local dev without Supabase configured has no accounts at all,
// so there's nothing to scope to.
const DEV_ONLY_KEY = 'val-progress:dev'
const accountKey = (uid: string) => `val-progress:${uid}`

function readLocal(key: string): string[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]') } catch { return [] }
}
function saveLocal(key: string, s: Set<string>) {
  try { localStorage.setItem(key, JSON.stringify([...s])) } catch {}
}

type Ctx = {
  done: Set<string>
  mark: (id: string) => void
  email: string | null
  uid: string | null
  displayName: string | null
  loading: boolean
  signOut: () => void
}

const C = createContext<Ctx>({
  done: new Set(), mark() {}, email: null, uid: null, displayName: null, loading: true, signOut() {},
})
export const useProgress = () => useContext(C)

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [done, setDone] = useState<Set<string>>(new Set())
  const [uid, setUid] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Idempotent: safe to call with the full known-done set any time, since the
  // (user_id, step_id) primary key + ignoreDuplicates means anything already
  // saved is just skipped, not duplicated or errored on.
  const pushProgress = useCallback(async (uidVal: string, ids: Iterable<string>) => {
    if (!supabase) return
    const rows = [...ids].map(step_id => ({ user_id: uidVal, step_id }))
    if (!rows.length) return
    const { error } = await supabase
      .from('progress')
      .upsert(rows, { onConflict: 'user_id,step_id', ignoreDuplicates: true })
    if (error) console.error('[progress] failed to sync to Supabase', error)
  }, [])

  useEffect(() => {
    // One-time cleanup: purge the old unscoped key so it can't leak into
    // whichever account (or dev session) reads local storage next.
    try { localStorage.removeItem(LEGACY_STORAGE_KEY) } catch {}

    if (!supabase) {
      // Local dev without Supabase configured — there are no accounts at
      // all in this mode, so a single shared key is fine.
      setDone(new Set(readLocal(DEV_ONLY_KEY)))
      setLoading(false)
      return
    }

    const sync = async (session: Session | null) => {
      setUid(session?.user.id ?? null)
      setEmail(session?.user.email ?? null)
      setDisplayName((session?.user.user_metadata as { display_name?: string } | undefined)?.display_name ?? null)

      if (!session || !supabase) {
        // Signed out — clear in-memory state so the next user starts fresh
        setDone(new Set())
        setLoading(false)
        return
      }

      // Instant paint from this device's cache for this account, then
      // reconcile with the database.
      const local = readLocal(accountKey(session.user.id))
      setDone(new Set(local))

      const { data, error } = await supabase
        .from('progress')
        .select('step_id')
        .eq('user_id', session.user.id)
      if (error) console.error('[progress] failed to load saved progress', error)

      const remote = (data ?? []).map(r => r.step_id as string)
      const merged = new Set([...local, ...remote])

      setDone(merged)
      saveLocal(accountKey(session.user.id), merged)
      setLoading(false)

      // Push anything this device has that the database doesn't yet —
      // covers a write that failed to save earlier on this device (see the
      // retry-on-reconnect effect below).
      pushProgress(session.user.id, merged)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED') return
      if (event === 'USER_UPDATED') {
        // Lightweight refresh — e.g. after updating the display name — skip the progress merge
        setEmail(session?.user.email ?? null)
        setDisplayName((session?.user.user_metadata as { display_name?: string } | undefined)?.display_name ?? null)
        return
      }
      setTimeout(() => sync(session), 0)
    })

    return () => subscription.unsubscribe()
  }, [pushProgress])

  // On native (Capacitor/Android), Google sign-in has to finish in a system
  // browser tab rather than the app's own WebView — see signInWithGoogle in
  // src/app/login/LoginForm.tsx. This is the other half: it catches that tab
  // handing control back to the app via the ph.akinuo.valguide:// custom
  // scheme (registered in AndroidManifest.xml), exchanges the code for a
  // session, and closes the tab. Without it, people were left stranded on
  // the web app in the browser after a successful Google sign-in.
  useEffect(() => {
    if (!supabase || !Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable('App')) return

    // Must match NATIVE_NEXT_KEY in src/app/login/LoginForm.tsx. `next` travels
    // via localStorage rather than a query string on the redirect URL, because
    // Supabase requires an exact string match (no wildcards) for non-http(s)
    // redirectTo values — any query string on it would fail that check.
    const NATIVE_NEXT_KEY = 'valguide_oauth_next'

    const finishNativeSignIn = async (url: string) => {
      let parsed: URL
      try { parsed = new URL(url) } catch { return }
      const code = parsed.searchParams.get('code')
      if (!code) return
      let next = '/home'
      try { next = localStorage.getItem(NATIVE_NEXT_KEY) || '/home'; localStorage.removeItem(NATIVE_NEXT_KEY) } catch {}
      await Browser.close().catch(() => {})
      const { error } = await supabase!.auth.exchangeCodeForSession(code)
      if (!error) router.replace(next)
    }

    const listenerPromise = CapApp.addListener('appUrlOpen', ({ url }) => { finishNativeSignIn(url) })
    // Covers the app having been fully closed and cold-started by the redirect.
    CapApp.getLaunchUrl().then(res => { if (res?.url) finishNativeSignIn(res.url) })

    return () => { listenerPromise.then(handle => handle.remove()) }
  }, [router])

  // Android's hardware/gesture back button has no default handling here, so
  // without this it either does nothing or exits the app outright instead of
  // stepping back through the app's own navigation the way people expect.
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable('App')) return
    const listenerPromise = CapApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) window.history.back()
      else CapApp.minimizeApp() // matches normal Android behavior: back at the root minimizes rather than kills the app
    })
    return () => { listenerPromise.then(handle => handle.remove()) }
  }, [])

  // The OS's own splash theme (see capacitor.config.ts) dismisses on its own
  // almost immediately — well before this remotely-loaded page has actually
  // finished loading over the network. Hiding it here, once this component has
  // mounted, means it stays up for the real loading gap instead of a fixed guess.
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable('SplashScreen')) return
    SplashScreen.hide().catch(() => {})
  }, [])

  // The app's header/nav are light-background (see tailwind.config.ts: chalk/paper),
  // so status bar text needs to be dark to stay legible — Style.Light means "dark
  // text for light backgrounds" (the naming is backwards from what it sounds like).
  useEffect(() => {
    if (!Capacitor.isNativePlatform() || !Capacitor.isPluginAvailable('StatusBar')) return
    StatusBar.setStyle({ style: Style.Light }).catch(() => {})
  }, [])

  // Retry any progress that didn't make it to Supabase — e.g. the tab was
  // offline, or a single upsert in `mark` failed. Local storage already has
  // it, so this just re-attempts the save when the connection/tab is back.
  useEffect(() => {
    if (!supabase || !uid) return
    const retry = () => pushProgress(uid, readLocal(accountKey(uid)))
    const onVisible = () => { if (document.visibilityState === 'visible') retry() }
    window.addEventListener('online', retry)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('online', retry)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [uid, pushProgress])

  const mark = useCallback((id: string) => {
    if (done.has(id)) return
    const next = new Set(done).add(id)
    setDone(next)
    if (!supabase) {
      saveLocal(DEV_ONLY_KEY, next)
    } else if (uid) {
      saveLocal(accountKey(uid), next)
      supabase.from('progress')
        .upsert({ user_id: uid, step_id: id }, { onConflict: 'user_id,step_id', ignoreDuplicates: true })
        .then(({ error }) => {
          // Not fatal: it stays in localStorage and the retry effect above
          // (or the next login sync) will push it once connectivity/auth recovers.
          if (error) console.error('[progress] failed to save step', id, error)
        })
    }
    // If Supabase is configured but there's no uid, there's nothing to do:
    // /lessons requires auth, so this shouldn't be reachable signed out.
  }, [done, uid])

  const signOut = useCallback(() => {
    supabase?.auth.signOut()
    // Optimistically clear state; the auth listener will also fire.
    // Local storage is left alone deliberately — it's scoped to this
    // account's key (accountKey(uid)) and will still be there, correctly,
    // the next time this account signs in on this device.
    setDone(new Set())
    setUid(null)
    setEmail(null)
    setDisplayName(null)
  }, [])

  // Without this, every Providers render creates a brand-new object here,
  // so every component calling useProgress() re-renders on any change —
  // even ones only reading, say, `email`.
  const value = useMemo(
    () => ({ done, mark, email, uid, displayName, loading, signOut }),
    [done, mark, email, uid, displayName, loading, signOut]
  )

  return (
    <C.Provider value={value}>
      {children}
    </C.Provider>
  )
}
