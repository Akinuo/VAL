'use client'
import { useEffect, useState } from 'react'
import QRCode from 'qrcode'
import type { Content } from '@/lib/content'
import { IconChevron } from './icons'

export default function QrHub({ c }: { c: Content }) {
  const groups: Record<string, [string, string][]> = {
    'Lesson': c.lessons.map(l => [l.title, `/lessons/${l.slug}`]),
    'Module (all lessons)': [['Basic Sewing Machine Operation', '/home#lessons']],
    'Checklist': c.checklists.map(l => [l.title, `/checklists#${l.slug}`]),
    'Machine part': c.parts.map(p => [p.name, `/parts?part=${p.slug}`]),
    'FAQ': [['Frequently asked questions', '/settings']],
    'Feedback': [['Feedback form', '/feedback']],
  }
  const [g, setG] = useState('Lesson')
  const [idx, setIdx] = useState(0)
  const [img, setImg] = useState('')
  const [url, setUrl] = useState('')

  const item = groups[g][idx] ?? groups[g][0]
  const path = item[1]

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_SITE_URL || location.origin
    const u = base.replace(/\/$/, '') + path
    setUrl(u)
    QRCode.toDataURL(u, {
      width: 320,
      margin: 2,
      color: { dark: '#22336B', light: '#FFFFFF' },
    }).then(setImg)
  }, [path])

  return (
    <div className="grid max-w-md gap-4">
      <div className="card p-4">
        <label className="text-sm font-medium text-ink">
          Page type
          <div className="relative">
            <select
              className="field select"
              value={g}
              onChange={e => { setG(e.target.value); setIdx(0) }}
            >
              {Object.keys(groups).map(k => <option key={k}>{k}</option>)}
            </select>
            <IconChevron className="select-chevron" />
          </div>
        </label>
        <label className="mt-3 block text-sm font-medium text-ink">
          Page
          <div className="relative">
            <select
              className="field select"
              value={idx}
              onChange={e => setIdx(Number(e.target.value))}
            >
              {groups[g].map(([t], n) => (
                <option key={t} value={n}>{t}</option>
              ))}
            </select>
            <IconChevron className="select-chevron" />
          </div>
        </label>
      </div>

      {img ? (
        <figure key={path} className="card fade-in p-4">
          <img
            src={img}
            width={320}
            height={320}
            alt={`QR code that opens ${item[0]}`}
            className="w-full rounded-lg"
          />
          <figcaption className="mt-2 break-all text-xs text-ink/55">{url}</figcaption>
        </figure>
      ) : (
        <div className="card grid aspect-square place-items-center p-4" aria-hidden="true">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-denim-light border-t-denim" />
        </div>
      )}

      {img && (
        <a
          className="btn"
          href={img}
          download={`val-guide-${path.replace(/[^a-z0-9]+/gi, '-')}.png`}
        >
          Download PNG
        </a>
      )}
    </div>
  )
}
