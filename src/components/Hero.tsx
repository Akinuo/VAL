import Link from 'next/link'
import type { Content } from '@/lib/content'
import { IconPlay, IconPartMarker, IconCheck, IconRibbon } from './icons'

const stats = (c: Content) => [
 { icon: IconPlay, n: c.lessons.length, label: c.lessons.length === 1 ? 'video lesson' : 'video lessons' },
 { icon: IconPartMarker, n: c.parts.length, label: 'labeled machine parts' },
 { icon: IconCheck, n: c.checklists.length, label: c.checklists.length === 1 ? 'checklist' : 'checklists' },
 { icon: IconRibbon, n: c.achievements.length, label: 'badges to earn' },
]

export default function Hero({ c }: { c: Content }) {
 const first = c.lessons[0]
 return (
  <section className="grid gap-8">
   <div className="grid items-center gap-6 sm:grid-cols-[1.1fr_.9fr]">
    <div>
     <h1 className="font-display text-3xl font-bold leading-tight text-denim sm:text-4xl">
      Learn to run a sewing machine, one short step at a time
     </h1>
     <p className="mt-3 max-w-prose text-ink/80">
      Watch a short video, read one step, answer one quick question. Everything is free to browse
      without an account &mdash; log in only if you want your progress to follow you to another device.
     </p>
     <div className="mt-5 flex flex-wrap gap-3">
      {first && (
       <Link href={`/lessons/${first.slug}`} className="btn">
        Start lesson 1: {first.title}
       </Link>
      )}
      <a href="#lessons" className="btn-quiet">
       Browse all lessons
      </a>
     </div>
    </div>
    <svg
     viewBox="0 0 320 120"
     role="img"
     aria-label="An illustration of a needle stitching a running line, representing short, sequential lessons"
     className="mx-auto w-full max-w-xs text-denim sm:max-w-none"
    >
     <path
      className="hero-line"
      d="M10,92 L55,58 L110,82 L165,50 L220,74 L275,46 L310,60"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
     />
     <g className="hero-needle" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="299" y1="51" x2="317" y2="65" />
      <circle cx="301.5" cy="53" r="1.6" fill="none" />
      <path d="M301.5 53 C296 55, 293 52, 294 48" fill="none" strokeWidth="1.4" />
     </g>
    </svg>
   </div>
   <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
    {stats(c).map(({ icon: Icon, n, label }) => (
     <div key={label} className="card flex flex-col items-start gap-1.5 px-4 py-3">
      <Icon className="h-5 w-5 text-thread" />
      <dt className="sr-only">{label}</dt>
      <dd className="font-display text-2xl font-semibold text-denim">{n}</dd>
      <span className="text-sm leading-snug text-ink/75">{label}</span>
     </div>
    ))}
   </dl>
  </section>
 )
}
