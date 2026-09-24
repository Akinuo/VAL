'use client'
import {useEffect,useState} from 'react'
import type {Content} from '@/lib/content'
export default function PartsDiagram({parts}:{parts:Content['parts']}){
 const[sel,setSel]=useState(parts[0]?.slug)
 useEffect(()=>{const p=new URLSearchParams(location.search).get('part');if(p&&parts.some(x=>x.slug===p))setSel(p)},[parts])
 const cur=parts.find(p=>p.slug===sel)
 return(<div>
  <svg viewBox="0 0 320 230" role="group" aria-label="Sewing machine diagram. Select a dot, or use the buttons below." className="w-full border-2 border-maroon/30 bg-white">
   <rect x="30" y="40" width="250" height="44" rx="18" fill="#B8552F"/><circle cx="296" cy="62" r="15" fill="#6E1A2C"/>
   <rect x="20" y="160" width="280" height="30" rx="8" fill="#7C8F6E"/><rect x="58" y="84" width="8" height="56" fill="#2B1A17"/>
   <rect x="50" y="138" width="26" height="8" fill="#D4A017"/><rect x="240" y="204" width="60" height="14" rx="6" fill="#6E1A2C"/>
   {parts.map(p=><circle key={p.slug} cx={p.x} cy={p.y} r={p.slug===sel?11:8} tabIndex={0} role="button" aria-label={p.name} aria-pressed={p.slug===sel} onClick={()=>setSel(p.slug)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSel(p.slug)}}} fill="#D4A017" stroke="#2B1A17" strokeWidth="2" className="cursor-pointer"/>)}
  </svg>
  {cur&&<div aria-live="polite" className="mt-3 border-l-8 border-mustard bg-white p-3"><h2 className="font-serif text-xl font-bold">{cur.name}</h2><p>{cur.fn}</p></div>}
  <ul className="mt-3 flex flex-wrap gap-2">{parts.map(p=><li key={p.slug}><button className="opt !w-auto" aria-pressed={p.slug===sel} onClick={()=>setSel(p.slug)}>{p.name}</button></li>)}</ul>
 </div>)}
