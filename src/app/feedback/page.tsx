'use client'
import {useState} from 'react'
import {supabase} from '@/lib/supabase'
export default function Feedback(){
 const[st,setSt]=useState<'idle'|'sending'|'ok'|'err'>('idle')
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();const form=e.currentTarget,f=new FormData(form);setSt('sending')
  if(!supabase){setSt('err');return}
  const{data}=await supabase.auth.getSession()
  const{error}=await supabase.from('feedback').insert({name:String(f.get('name')||'')||null,rating:Number(f.get('rating')),message:String(f.get('message')),user_id:data.session?.user.id??null})
  setSt(error?'err':'ok');if(!error)form.reset()}
 return(<><h1 className="font-serif text-3xl font-bold text-maroon">Feedback</h1>
  <form onSubmit={submit} className="mt-4 grid max-w-md gap-4">
   <label>Name (optional)<input name="name" maxLength={80} className="field"/></label>
   <label>Rating<select name="rating" defaultValue="5" className="field">{[5,4,3,2,1].map(n=><option key={n}>{n}</option>)}</select></label>
   <label>Your message<textarea name="message" required minLength={5} maxLength={1000} rows={5} className="field"/></label>
   <button className="btn" disabled={st==='sending'}>Send feedback</button>
   <p aria-live="polite">{st==='ok'&&'Thank you. Your feedback was sent.'}{st==='err'&&'Feedback could not be sent. Check your connection and try again.'}</p>
  </form></>)}
