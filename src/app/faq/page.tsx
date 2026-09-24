import {getContent} from '@/lib/content'
export const revalidate=3600
export default async function Faq(){
 const{faqs}=await getContent()
 return(<><h1 className="mb-4 font-serif text-3xl font-bold text-maroon">Frequently asked questions</h1>
  <div className="grid gap-2.5">{faqs.map(f=><details key={f.q} className="card border-l-4 border-l-sage p-3.5"><summary className="min-h-[44px] cursor-pointer font-semibold text-ink marker:text-sage">{f.q}</summary><p className="mt-2 text-ink/85">{f.a}</p></details>)}</div></>)}
