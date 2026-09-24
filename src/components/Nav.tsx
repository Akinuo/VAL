'use client'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useProgress} from '@/lib/progress'
import {IconSpool,IconPartMarker,IconCheck,IconQuestion,IconQr,IconMessage} from './icons'
const L=[
 ['/','Home',IconSpool],
 ['/parts','Machine parts',IconPartMarker],
 ['/checklists','Checklists',IconCheck],
 ['/faq','FAQ',IconQuestion],
 ['/qr','QR hub',IconQr],
 ['/feedback','Feedback',IconMessage],
] as const
export default function Nav(){
 const{email,signOut}=useProgress()
 const path=usePathname()
 return(<header className="sticky top-0 z-40 bg-maroon text-cream">
  <div className="mx-auto max-w-3xl px-4 pb-1 pt-3">
   <div className="flex items-center justify-between gap-2">
    <Link href="/" className="flex items-center gap-2 font-serif text-xl font-bold">
     <IconSpool className="h-6 w-6 text-mustard"/>VAL Guide
    </Link>
    {email?<button onClick={signOut} className="min-h-[44px] text-sm underline underline-offset-2">Log out</button>:<Link href="/login" className="inline-flex min-h-[44px] items-center text-sm underline underline-offset-2">Log in to save progress</Link>}
   </div>
   <nav aria-label="Main" className="-mx-2 mt-1 flex flex-wrap">{L.map(([h,t,Icon])=>{const on=h==='/'?path==='/':path.startsWith(h)
    return<Link key={h} href={h} aria-current={on?'page':undefined} className={`flex min-h-[44px] items-center gap-1.5 border-b-2 px-2 text-sm transition-colors ${on?'border-mustard text-mustard':'border-transparent hover:text-mustard'}`}>
     <Icon className="h-4 w-4"/>{t}</Link>})}</nav>
  </div>
  <div className="weave" aria-hidden="true"/>
 </header>)}
