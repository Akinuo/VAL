'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { IconCheck } from '@/components/icons'

export default function Feedback() {
  const [st, setSt] = useState<'idle' | 'sending' | 'ok' | 'err'>('idle')
  const [rating, setRating] = useState(5)
  const [hover, setHover] = useState(0)
  const [chars, setChars] = useState(0)

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    setSt('sending')
    if (!supabase) { setSt('err'); return }
    const { data } = await supabase.auth.getSession()
    const { error } = await supabase.from('feedback').insert({
      name: String(f.get('name') || '') || null,
      rating,
      message: String(f.get('message')),
      user_id: data.session?.user.id ?? null,
    })
    setSt(error ? 'err' : 'ok')
    if (!error) { form.reset(); setChars(0); setRating(5) }
  }

  if (st === 'ok') {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-soft border border-green-border">
          <IconCheck className="h-6 w-6 text-green" />
        </div>
        <div>
          <h2 className="font-display text-xl font-bold text-denim">Feedback sent</h2>
          <p className="mt-1 text-sm text-muted">Thank you — your response has been recorded.</p>
        </div>
        <button className="btn-outline mt-2" onClick={() => setSt('idle')}>Send more feedback</button>
      </div>
    )
  }

  return (
    <>
      <div className="mb-6">
        <p className="eyebrow mb-1">Your input</p>
        <h1 className="page-title">Feedback</h1>
        <p className="mt-1 text-sm text-muted">Let us know how the lessons are working for you.</p>
      </div>

      <form onSubmit={submit} className="grid max-w-md gap-5">

        <label className="block text-sm font-medium text-ink">
          Name <span className="font-normal text-muted">(optional)</span>
          <input name="name" maxLength={80} className="field" placeholder="Your name" />
        </label>

        {/* Star rating */}
        <div>
          <p className="text-sm font-medium text-ink">Rating</p>
          <div className="mt-1.5 flex items-center gap-1" role="group" aria-label="Rating out of 5">
            {[1, 2, 3, 4, 5].map(v => (
              <button
                key={v}
                type="button"
                aria-label={`${v} star${v > 1 ? 's' : ''}`}
                aria-pressed={rating === v}
                onClick={() => setRating(v)}
                onMouseEnter={() => setHover(v)}
                onMouseLeave={() => setHover(0)}
                className="text-2xl leading-none transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-denim focus-visible:ring-offset-1 rounded"
              >
                <span className={(hover || rating) >= v ? 'text-amber' : 'text-border'}>★</span>
              </button>
            ))}
            <span className="ml-2 text-xs text-muted">
              {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][hover || rating]}
            </span>
          </div>
        </div>

        <label className="block text-sm font-medium text-ink">
          <div className="flex items-center justify-between">
            <span>Your message</span>
            <span className={`text-xs ${chars > 900 ? 'text-red' : 'text-muted'}`}>{chars}/1000</span>
          </div>
          <textarea
            name="message"
            required
            minLength={5}
            maxLength={1000}
            rows={5}
            className="field resize-none"
            placeholder="Tell us what you think…"
            onChange={e => setChars(e.target.value.length)}
          />
        </label>

        <button className="btn" disabled={st === 'sending'}>
          {st === 'sending' ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Sending…
            </span>
          ) : 'Send feedback'}
        </button>

        {st === 'err' && (
          <p aria-live="polite" className="alert-err">
            Feedback could not be sent. Check your connection and try again.
          </p>
        )}
      </form>
    </>
  )
}
