'use client'
import {
  createContext, useCallback, useContext,
  useEffect, useState, ReactNode,
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
  signOut: () => void
}

const C = createContext<Ctx>({ done: new Set(), mark() {}, email: null, signOut() {} })
export const useProgress = () => useContext(C)

export function Providers({ children }: { children: ReactNode }) {
  const [done, setDone] = useState<Set<string>>(new Set())
  const [uid, setUid] = useState<string | null>(null)
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    // Seed from localStorage immediately (works without Supabase)
    setDone(new Set(readLocal()))

    if (!supabase) return

    const sync = async (session: Session | null) => {
      setUid(session?.user.id ?? null)
      setEmail(session?.user.email ?? null)

      if (!session || !supabase) {
        // Signed out — clear in-memory state so the next user starts fresh
        setDone(new Set())
        return
      }

      // One read per login; merge remote + local
      const { data } = await supabase
        .from('progress')
        .select('step_id')
        .eq('user_id', session.user.id)

      const remote = (data ?? []).map(r => r.step_id as string)
      const local = readLocal()
      const merged = new Set([...local, ...remote])

      // Push any local-only steps up to Supabase
      const missing = local.filter(x => !remote.includes(x))
      if (missing.length) {
        await supabase.from('progress').upsert(
          missing.map(step_id => ({ user_id: session.user.id, step_id })),
          { onConflict: 'user_id,step_id', ignoreDuplicates: true },
        )
      }

      setDone(merged)
      saveLocal(merged)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') return
      setTimeout(() => sync(session), 0)
    })

    return () => subscription.unsubscribe()
  }, [])

  const mark = useCallback((id: string) => {
    if (done.has(id)) return
    const next = new Set(done).add(id)
    setDone(next)
    saveLocal(next)
    if (supabase && uid) {
      supabase.from('progress')
        .upsert({ user_id: uid, step_id: id }, { onConflict: 'user_id,step_id', ignoreDuplicates: true })
        .then(() => {})
    }
  }, [done, uid])

  const signOut = () => {
    supabase?.auth.signOut()
    // Optimistically clear state; the auth listener will also fire
    setDone(new Set())
    setUid(null)
    setEmail(null)
  }

  return (
    <C.Provider value={{ done, mark, email, signOut }}>
      {children}
    </C.Provider>
  )
}
