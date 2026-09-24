'use client'
import Link from 'next/link'
import {useProgress} from '@/lib/progress'
const L=[['/','Home'],['/parts','Machine parts'],['/checklists','Checklists'],['/faq','FAQ'],['/qr','QR hub'],['/feedback','Feedback']]
export default function Nav(){
 const{email,signOut}=useProgress()
 return(<header className="bg-maroon text-cream"><div className="mx-auto max-w-3xl px-4 pb-1 pt-3">
  <div className="flex items-center justify-between gap-2">
   <Link href="/" className="font-serif text-xl font-bold">VAL Guide</Link>
   {email?<button onClick={signOut} className="min-h-[44px] underline">Log out</button>:<Link href="/login" className="inline-flex min-h-[44px] items-center underline">Log in to save progress</Link>}
  </div>
  <nav aria-label="Main" className="-mx-2 flex flex-wrap">{L.map(([h,t])=><Link key={h} href={h} className="inline-flex min-h-[44px] items-center px-2 hover:text-mustard">{t}</Link>)}</nav>
 </div><div className="weave" aria-hidden="true"/></header>)}
