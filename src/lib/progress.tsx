'use client'
import {createContext,useCallback,useContext,useEffect,useState,ReactNode} from 'react'
import type {Session} from '@supabase/supabase-js'
import {supabase} from './supabase'
const K='val-progress'
const readLocal=():string[]=>{try{return JSON.parse(localStorage.getItem(K)||'[]')}catch{return[]}}
const save=(s:Set<string>)=>{try{localStorage.setItem(K,JSON.stringify([...s]))}catch{}}
type Ctx={done:Set<string>;mark:(id:string)=>void;email:string|null;signOut:()=>void}
const C=createContext<Ctx>({done:new Set(),mark(){},email:null,signOut(){}})
export const useProgress=()=>useContext(C)
export function Providers({children}:{children:ReactNode}){
 const[done,setDone]=useState<Set<string>>(new Set()),[uid,setUid]=useState<string|null>(null),[email,setEmail]=useState<string|null>(null)
 useEffect(()=>{
  setDone(new Set(readLocal()))
  if(!supabase)return
  // One read + at most one batched write per login; afterwards one small upsert per newly passed step.
  const sync=async(s:Session|null)=>{
   setUid(s?.user.id??null);setEmail(s?.user.email??null)
   if(!s||!supabase)return
   const{data}=await supabase.from('progress').select('step_id').eq('user_id',s.user.id)
   const remote=(data??[]).map(r=>r.step_id as string),local=readLocal(),merged=new Set([...local,...remote])
   const missing=local.filter(x=>!remote.includes(x))
   if(missing.length)await supabase.from('progress').upsert(missing.map(step_id=>({user_id:s.user.id,step_id})),{onConflict:'user_id,step_id',ignoreDuplicates:true})
   setDone(merged);save(merged)
  }
  const{data:{subscription}}=supabase.auth.onAuthStateChange((e,s)=>{if(e==='TOKEN_REFRESHED'||e==='USER_UPDATED')return;setTimeout(()=>sync(s),0)})
  return()=>subscription.unsubscribe()
 },[])
 const mark=useCallback((id:string)=>{
  if(done.has(id))return
  const n=new Set(done).add(id);setDone(n);save(n)
  if(supabase&&uid)supabase.from('progress').upsert({user_id:uid,step_id:id},{onConflict:'user_id,step_id',ignoreDuplicates:true}).then(()=>{})
 },[done,uid])
 const signOut=()=>{supabase?.auth.signOut()}
 return<C.Provider value={{done,mark,email,signOut}}>{children}</C.Provider>
}
