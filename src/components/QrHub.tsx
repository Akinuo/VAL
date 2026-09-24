'use client'
import {useEffect,useState} from 'react'
import QRCode from 'qrcode'
import type {Content} from '@/lib/content'
export default function QrHub({c}:{c:Content}){
 const groups:Record<string,[string,string][]>={
  'Lesson':c.lessons.map(l=>[l.title,`/lessons/${l.slug}`]),
  'Module (all lessons)':[['Basic Sewing Machine Operation','/#lessons']],
  'Checklist':c.checklists.map(l=>[l.title,`/checklists#${l.slug}`]),
  'Machine part':c.parts.map(p=>[p.name,`/parts?part=${p.slug}`]),
  'FAQ':[['Frequently asked questions','/faq']],
  'Feedback':[['Feedback form','/feedback']]}
 const[g,setG]=useState('Lesson'),[i,setI]=useState(0),[img,setImg]=useState(''),[url,setUrl]=useState('')
 const item=groups[g][i]??groups[g][0],path=item[1]
 useEffect(()=>{const u=location.origin+path;setUrl(u);QRCode.toDataURL(u,{width:320,margin:2,color:{dark:'#6E1A2C',light:'#FFFFFF'}}).then(setImg)},[path])
 return(<div className="grid max-w-md gap-4">
  <label>Page type<select className="field" value={g} onChange={e=>{setG(e.target.value);setI(0)}}>{Object.keys(groups).map(k=><option key={k}>{k}</option>)}</select></label>
  <label>Page<select className="field" value={i} onChange={e=>setI(Number(e.target.value))}>{groups[g].map(([t],n)=><option key={t} value={n}>{t}</option>)}</select></label>
  {img&&<figure><img src={img} width={320} height={320} alt={`QR code that opens ${item[0]}`} className="border-2 border-maroon/30"/><figcaption className="mt-1 break-all text-sm">{url}</figcaption></figure>}
  {img&&<a className="btn" href={img} download={`val-guide-${path.replace(/[^a-z0-9]+/gi,'-')}.png`}>Download PNG</a>}
 </div>)}
