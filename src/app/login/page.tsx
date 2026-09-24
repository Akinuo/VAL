'use client'
import {useState} from 'react'
import {useRouter} from 'next/navigation'
import {supabase} from '@/lib/supabase'
export default function Login(){
 const r=useRouter(),[up,setUp]=useState(false),[msg,setMsg]=useState('')
 async function submit(e:React.FormEvent<HTMLFormElement>){
  e.preventDefault();if(!supabase){setMsg('Login is not set up yet. Add your Supabase keys to .env.local.');return}
  const f=new FormData(e.currentTarget),cred={email:String(f.get('email')),password:String(f.get('password'))}
  const{data,error}=up?await supabase.auth.signUp(cred):await supabase.auth.signInWithPassword(cred)
  if(error)setMsg(error.message);else if(data.session)r.push('/');else setMsg('Check your email to confirm your account, then log in.')}
 return(<><h1 className="font-serif text-3xl font-bold text-maroon">{up?'Create an account':'Log in'}</h1>
  <p className="mt-1">An account saves your progress across devices. Lessons stay open without one.</p>
  <form onSubmit={submit} className="mt-4 grid max-w-md gap-4">
   <label>Email<input name="email" type="email" required autoComplete="email" className="field"/></label>
   <label>Password (at least 6 characters)<input name="password" type="password" required minLength={6} autoComplete={up?'new-password':'current-password'} className="field"/></label>
   <button className="btn">{up?'Create account':'Log in'}</button>
   <button type="button" className="min-h-[44px] underline" onClick={()=>{setUp(!up);setMsg('')}}>{up?'I already have an account':'I need an account'}</button>
   <p aria-live="polite">{msg}</p></form></>)}
