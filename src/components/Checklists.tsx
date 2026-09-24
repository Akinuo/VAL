'use client'
import {useEffect,useState} from 'react'
import type {Content} from '@/lib/content'
const K='val-checks'
export default function Checklists({lists}:{lists:Content['checklists']}){
 const[on,setOn]=useState<string[]>([])
 useEffect(()=>{try{setOn(JSON.parse(localStorage.getItem(K)||'[]'))}catch{}},[])
 const put=(n:string[])=>{setOn(n);try{localStorage.setItem(K,JSON.stringify(n))}catch{}}
 return(<div className="grid gap-8">{lists.map(l=><section key={l.slug} id={l.slug} className="scroll-mt-4"><h2 className="font-serif text-2xl text-maroon">{l.title}</h2>
  <ul className="mt-2">{l.items.map((it,i)=>{const k=`${l.slug}:${i}`;return<li key={k}><label className="flex min-h-[44px] items-center gap-3"><input type="checkbox" className="h-6 w-6 accent-[#6E1A2C]" checked={on.includes(k)} onChange={()=>put(on.includes(k)?on.filter(x=>x!==k):[...on,k])}/>{it}</label></li>})}</ul>
  <button className="mt-1 underline" onClick={()=>put(on.filter(x=>!x.startsWith(l.slug+':')))}>Clear this checklist</button></section>)}</div>)}
