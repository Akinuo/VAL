'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useProgress } from '@/lib/progress'
import { IconCheck } from './icons'
import FaqList from './FaqList'

export default function Settings({ faqs }: { faqs: { q: string; a: string }[] }) {
  const router = useRouter()
  const { email, displayName, loading, signOut } = useProgress()

  const [name, setName] = useState('')
  const [saveSt, setSaveSt] = useState<'idle' | 'saving' | 'ok' | 'err'>('idle')
  const [confirmOpen, setConfirmOpen] = useState(false)

  // Keep the field in sync once the session (and its saved display name) resolves.
  useEffect(() => { setName(displayName ?? '') }, [displayName])

  async function saveName(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!supabase || !trimmed) return
    setSaveSt('saving')
    const { error } = await supabase.auth.updateUser({ data: { display_name: trimmed } })
    setSaveSt(error ? 'err' : 'ok')
    if (!error) setTimeout(() => setSaveSt('idle'), 2000)
  }

  function confirmLogout() {
    setConfirmOpen(false)
    signOut()
    router.replace('/')
  }

  if (loading) return <SettingsSkeleton />

  return (
    <div className="grid gap-8 fade-in">
      <div>
        <h1 className="page-title">Settings</h1>
        <p className="mt-1 text-sm text-muted">Manage your account and find answers to common questions.</p>
      </div>

      {email ? (
        <section className="card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-denim">Account</h2>

          <div className="mt-4 grid max-w-sm gap-5">
            <div>
              <p className="text-sm font-medium text-ink">Email</p>
              <p className="mt-1 text-sm text-muted">{email}</p>
            </div>

            <form onSubmit={saveName} className="grid gap-2">
              <label className="block text-sm font-medium text-ink">
                Display name
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  maxLength={60}
                  placeholder="Your name"
                  className="field"
                />
              </label>
              <div className="flex items-center gap-3">
                <button
                  className="btn-outline !min-h-[36px] !px-4 text-sm"
                  disabled={saveSt === 'saving' || !name.trim() || name.trim() === (displayName ?? '')}
                >
                  {saveSt === 'saving' ? 'Saving…' : 'Save name'}
                </button>
                {saveSt === 'ok' && (
                  <span className="flex items-center gap-1 text-sm text-green">
                    <IconCheck className="h-4 w-4" /> Saved
                  </span>
                )}
                {saveSt === 'err' && <span className="text-sm text-red">Could not save. Try again.</span>}
              </div>
            </form>
          </div>
        </section>
      ) : (
        <section className="alert-info">
          <Link href="/login" className="font-medium underline underline-offset-2">Log in</Link>
          {' '}to manage your account and sync progress across devices.
        </section>
      )}

      <section className="card p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-denim">Frequently asked questions</h2>
        <div className="mt-4">
          <FaqList faqs={faqs} />
        </div>
      </section>

      {email && (
        <section className="card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-denim">Log out</h2>
          <p className="mt-1 text-sm text-muted">You&apos;ll need to log back in to sync progress across devices.</p>
          <button
            onClick={() => setConfirmOpen(true)}
            className="btn-outline mt-3 !min-h-[36px] !border-red-border !text-red hover:!bg-red-soft"
          >
            Log out
          </button>
        </section>
      )}

      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-confirm-title"
        >
          <div className="card w-full max-w-sm p-6">
            <h3 id="logout-confirm-title" className="font-display text-lg font-bold text-denim">Log out?</h3>
            <p className="mt-2 text-sm text-muted">You can log back in anytime with your email and password.</p>
            <div className="mt-5 flex justify-end gap-3">
              <button onClick={() => setConfirmOpen(false)} className="btn-ghost">Cancel</button>
              <button onClick={confirmLogout} className="btn !bg-red hover:!opacity-90">Log out</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function SettingsSkeleton() {
  return (
    <div className="grid gap-8 fade-in" aria-hidden="true">
      <div className="grid gap-2">
        <div className="h-7 w-40 animate-pulse rounded bg-denim-light" />
        <div className="h-4 w-64 animate-pulse rounded bg-denim-light" />
      </div>
      <div className="h-40 animate-pulse rounded-lg bg-denim-light" />
      <div className="h-52 animate-pulse rounded-lg bg-denim-light" />
    </div>
  )
}
