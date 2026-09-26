'use client'
import {
  createContext, useCallback, useContext,
  useEffect, useMemo, useState, ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from './supabase'

const STORAGE_KEY = 'val-progress'

function readLocal(): string[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveLocal(s: Set<string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...s])) } catch {}
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
    // Seed from localStorage immediately (works without Supabase)
    setDone(new Set(readLocal()))

    if (!supabase) { setLoading(false); return }

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

      // One read per login; merge remote + local
      const { data, error } = await supabase
        .from('progress')
        .select('step_id')
        .eq('user_id', session.user.id)
      if (error) console.error('[progress] failed to load saved progress', error)

      const remote = (data ?? []).map(r => r.step_id as string)
      const local = readLocal()
      const merged = new Set([...local, ...remote])

      setDone(merged)
      saveLocal(merged)
      setLoading(false)

      // Push anything this device has that the database doesn't yet — covers
      // guest progress made before logging in, and any earlier write that
      // failed to save (see the retry-on-reconnect effect below).
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

  // Retry any progress that didn't make it to Supabase — e.g. the tab was
  // offline, or a single upsert in `mark` failed. Local storage already has
  // it, so this just re-attempts the save when the connection/tab is back.
  useEffect(() => {
    if (!supabase || !uid) return
    const retry = () => pushProgress(uid, readLocal())
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
    saveLocal(next)
    if (supabase && uid) {
      supabase.from('progress')
        .upsert({ user_id: uid, step_id: id }, { onConflict: 'user_id,step_id', ignoreDuplicates: true })
        .then(({ error }) => {
          // Not fatal: it stays in localStorage and the retry effect above
          // (or the next login sync) will push it once connectivity/auth recovers.
          if (error) console.error('[progress] failed to save step', id, error)
        })
    }
  }, [done, uid])

  const signOut = useCallback(() => {
    supabase?.auth.signOut()
    // Optimistically clear state; the auth listener will also fire
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
