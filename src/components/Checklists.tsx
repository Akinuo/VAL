'use client'
import { useEffect, useState } from 'react'
import type { Content } from '@/lib/content'

const K = 'val-checks'

export default function Checklists({ lists }: { lists: Content['checklists'] }) {
  const [on, setOn] = useState<string[]>([])

  useEffect(() => {
    try { setOn(JSON.parse(localStorage.getItem(K) || '[]')) } catch {}
  }, [])

  function put(next: string[]) {
    setOn(next)
    try { localStorage.setItem(K, JSON.stringify(next)) } catch {}
  }

  return (
    <div className="grid gap-5">
      {lists.map(l => {
        const keys = l.items.map((_, i) => `${l.slug}:${i}`)
        const checked = keys.filter(k => on.includes(k)).length
        const allDone = checked === l.items.length && l.items.length > 0

        return (
          <section key={l.slug} id={l.slug} className="card scroll-mt-4 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-3.5">
              <div>
                <h2 className="font-serif text-base font-semibold text-maroon">{l.title}</h2>
                <p className="text-xs text-muted">
                  {checked === 0
                    ? `${l.items.length} items`
                    : allDone
                    ? 'All done'
                    : `${checked} of ${l.items.length} done`}
                </p>
              </div>
              {allDone && (
                <span className="chip-green shrink-0">Complete</span>
              )}
            </div>

            {/* Progress bar */}
            {checked > 0 && (
              <div className="h-1 bg-border">
                <div
                  className="h-full bg-green transition-[width] duration-300"
                  style={{ width: `${Math.round((checked / l.items.length) * 100)}%` }}
                />
              </div>
            )}

            {/* Items */}
            <ul className="divide-y divide-border px-5">
              {l.items.map((item, i) => {
                const k = `${l.slug}:${i}`
                const isOn = on.includes(k)
                return (
                  <li key={k}>
                    <label className="flex min-h-[48px] cursor-pointer items-center gap-3 py-1">
                      <input
                        type="checkbox"
                        className="h-4 w-4 shrink-0 rounded border-border accent-[#6E1A2C]"
                        checked={isOn}
                        onChange={() => put(isOn ? on.filter(x => x !== k) : [...on, k])}
                      />
                      <span className={`text-sm transition-colors ${isOn ? 'text-muted line-through' : 'text-ink'}`}>
                        {item}
                      </span>
                    </label>
                  </li>
                )
              })}
            </ul>

            {/* Footer */}
            <div className="border-t border-border px-5 py-2.5">
              <button
                className="text-xs text-muted underline underline-offset-2 transition-colors hover:text-maroon"
                onClick={() => put(on.filter(x => !x.startsWith(l.slug + ':')))}
              >
                Clear this checklist
              </button>
            </div>

          </section>
        )
      })}
    </div>
  )
}
