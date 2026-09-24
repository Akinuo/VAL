'use client'
import Link from 'next/link'
import {useProgress} from '@/lib/progress'
import {earned} from '@/lib/badges'
import type {Content} from '@/lib/content'
const edge=['border-terracotta','border-mustard','border-sage']
export default function Dashboard({c}:{c:Content}){
 const{done}=useProgress()
 const ids=c.lessons.flatMap(l=>l.steps.map(s=>s.id)),n=ids.filter(i=>done.has(i)).length,pct=ids.length?Math.round(n/ids.length*100):0
 const got=earned(c,done)
 return(<div className="grid gap-8">
  <section aria-labelledby="prog"><h2 id="prog" className="font-serif text-2xl text-maroon">Your progress</h2>
   <p className="mt-1">{n} of {ids.length} steps passed ({pct}%)</p>
   <div role="progressbar" aria-label="Overall progress" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} className="mt-2 h-4 rounded border border-maroon/40 bg-white"><div className="h-full rounded-l bg-mustard" style={{width:pct+'%'}}/></div>
  </section>
  <section id="lessons" aria-labelledby="les"><h2 id="les" className="font-serif text-2xl text-maroon">Lessons</h2>
   <ul className="mt-3 grid gap-3">{c.lessons.map((l,i)=>{const d=l.steps.filter(s=>done.has(s.id)).length
    return<li key={l.slug}><Link href={`/lessons/${l.slug}`} className={`block border-l-8 bg-white p-4 hover:bg-mustard/20 ${edge[i%3]}`}>
     <span className="block font-serif text-xl font-bold">{l.title}</span><span className="block">{l.summary}</span>
     <span className="mt-1 block text-sm">{l.minutes} min, {d} of {l.steps.length} steps passed</span></Link></li>})}</ul>
  </section>
  <section aria-labelledby="bad"><h2 id="bad" className="font-serif text-2xl text-maroon">Badges</h2>
   <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{c.achievements.map(a=>{const y=got.has(a.slug)
    return<li key={a.slug} className={`border-2 p-3 ${y?'border-maroon bg-mustard':'border-dashed border-maroon/40 bg-white'}`}>
     <span className="block font-bold">{a.title}</span><span className="block text-sm">{a.description}</span><span className="mt-1 block text-sm font-semibold">{y?'Earned':'Not yet earned'}</span></li>})}</ul>
  </section></div>)}
