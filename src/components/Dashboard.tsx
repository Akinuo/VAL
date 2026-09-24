'use client'
import Link from 'next/link'
import {useProgress} from '@/lib/progress'
import {earned} from '@/lib/badges'
import type {Content} from '@/lib/content'
import {IconRibbon} from './icons'
export default function Dashboard({c}:{c:Content}){
 const{done}=useProgress()
 const ids=c.lessons.flatMap(l=>l.steps.map(s=>s.id)),n=ids.filter(i=>done.has(i)).length,pct=ids.length?Math.round(n/ids.length*100):0
 const got=earned(c,done)
 return(<div className="grid gap-10">
  <section aria-labelledby="prog">
   <h2 id="prog" className="font-serif text-2xl font-semibold text-maroon">Your progress</h2>
   <div className="card mt-3 p-4">
    <p className="text-sm text-ink/80">{n} of {ids.length} steps passed</p>
    <div role="progressbar" aria-label="Overall progress" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} className="mt-2 h-3 overflow-hidden rounded-full bg-mustard-soft">
     <div className="h-full rounded-full bg-mustard transition-[width]" style={{width:pct+'%'}}/>
    </div>
    <p className="mt-1 text-sm font-semibold text-maroon">{pct}%</p>
   </div>
  </section>
  <section id="lessons" aria-labelledby="les" className="scroll-mt-4">
   <h2 id="les" className="font-serif text-2xl font-semibold text-maroon">Lessons</h2>
   <ol className="mt-3 grid gap-3">{c.lessons.map((l,i)=>{const d=l.steps.filter(s=>done.has(s.id)).length,full=d===l.steps.length&&l.steps.length>0
    return<li key={l.slug}>
     <Link href={`/lessons/${l.slug}`} className="card group flex gap-4 p-4 transition-colors hover:border-maroon/40">
      <span aria-hidden="true" className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 font-serif font-semibold ${full?'border-maroon bg-maroon text-cream':'border-maroon/40 text-maroon'}`}>{i+1}</span>
      <span className="min-w-0">
       <span className="block font-serif text-lg font-semibold text-ink group-hover:text-maroon">{l.title}</span>
       <span className="block text-sm text-ink/75">{l.summary}</span>
       <span className="mt-1 block text-sm text-ink/60">{l.minutes} min &middot; {d} of {l.steps.length} steps passed</span>
      </span>
     </Link>
    </li>})}</ol>
  </section>
  <section aria-labelledby="bad">
   <h2 id="bad" className="font-serif text-2xl font-semibold text-maroon">Badges</h2>
   <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{c.achievements.map(a=>{const y=got.has(a.slug)
    return<li key={a.slug} className={`flex items-start gap-2.5 rounded-swatch border-2 p-3 ${y?'border-maroon bg-mustard-soft':'border-dashed border-maroon/30 bg-paper'}`}>
     <IconRibbon className={`mt-0.5 h-5 w-5 shrink-0 ${y?'text-maroon':'text-maroon/30'}`}/>
     <span>
      <span className="block font-semibold leading-tight">{a.title}</span>
      <span className="block text-sm text-ink/70">{a.description}</span>
      <span className="mt-1 block text-sm font-semibold text-maroon">{y?'Earned':'Not yet earned'}</span>
     </span>
    </li>})}</ul>
  </section></div>)}
