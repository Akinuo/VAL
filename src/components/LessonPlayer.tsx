'use client'
import {useState} from 'react'
import Link from 'next/link'
import {useProgress} from '@/lib/progress'
import type {Lesson} from '@/lib/content'
import {IconCheck} from './icons'
const embed=(u:string)=>{const m=u.match(/(?:v=|youtu\.be\/|embed\/)([\w-]{11})/);return m?`https://www.youtube-nocookie.com/embed/${m[1]}?cc_load_policy=1&rel=0`:u}
export default function LessonPlayer({lesson}:{lesson:Lesson}){
 const{done,mark}=useProgress()
 const[i,setI]=useState(0),[pick,setPick]=useState<number|null>(null),[vid,setVid]=useState(false)
 const s=lesson.steps[i],q=s.quiz_questions?.[0],ok=q!=null&&pick===q.answer,last=i===lesson.steps.length-1
 const go=(n:number)=>{setI(n);setPick(null)}
 const choose=(n:number)=>{setPick(n);if(q&&n===q.answer)mark(s.id)}
 return(<article>
  <h1 className="font-serif text-3xl font-bold text-maroon">{lesson.title}</h1>
  <p className="mt-1">{lesson.summary}</p>
  <div className="mt-4 grid aspect-video place-items-center overflow-hidden rounded-swatch bg-ink text-cream">
   {lesson.video_url?(vid?<iframe className="h-full w-full" src={embed(lesson.video_url)} title={`${lesson.title} video`} loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen/>:<button className="btn" onClick={()=>setVid(true)}>Play video (loads when pressed)</button>):<p className="p-4 text-center">No video has been added yet. The steps below cover the whole lesson.</p>}
  </div>
  <ol aria-label="Steps" className="mt-5 flex flex-wrap gap-2">{lesson.steps.map((t,n)=><li key={t.id}><button onClick={()=>go(n)} aria-current={n===i?'step':undefined} aria-label={`Step ${n+1}${done.has(t.id)?', passed':''}`} className={`grid h-11 w-11 place-items-center rounded-full border-2 border-maroon font-serif font-semibold ${n===i?'bg-maroon text-cream':done.has(t.id)?'bg-sage text-cream':'bg-paper'}`}>{done.has(t.id)?<IconCheck className="h-5 w-5"/>:n+1}</button></li>)}</ol>
  <section className="mt-4" aria-labelledby="st">
   <h2 id="st" className="font-serif text-2xl font-semibold text-maroon">Step {i+1} of {lesson.steps.length}: {s.title}</h2>
   <p className="mt-2 max-w-prose">{s.body}</p>
   {q&&<fieldset className="mt-4"><legend className="font-semibold">Quick quiz: {q.question}</legend>
    <div className="mt-2 grid gap-2">{q.options.map((o,n)=><button key={o} className="opt" aria-pressed={pick===n} onClick={()=>choose(n)}>{o}</button>)}</div></fieldset>}
   <div aria-live="polite" className="mt-3 min-h-[3.5rem]">
    {pick!==null&&q&&(ok?<p className="font-semibold text-maroon">Correct. {q.explanation}</p>:<p className="font-semibold">Not quite. Re-read the step, then <button className="underline underline-offset-2" onClick={()=>setPick(null)}>try again</button>.</p>)}
   </div>
   <div className="flex flex-wrap gap-2">
    {i>0&&<button className="btn" onClick={()=>go(i-1)}>Previous step</button>}
    {last?<Link href="/" className="btn">Back to home</Link>:<button className="btn" disabled={!(ok||done.has(s.id))} onClick={()=>go(i+1)}>Next step</button>}
   </div>
  </section></article>)}
