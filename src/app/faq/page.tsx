import {getContent} from '@/lib/content'
export const revalidate=3600
export default async function Faq(){
 const{faqs}=await getContent()
 return(<><h1 className="mb-4 font-serif text-3xl font-bold text-maroon">Frequently asked questions</h1>
  {faqs.map(f=><details key={f.q} className="mb-2 border-l-8 border-sage bg-white p-3"><summary className="min-h-[44px] cursor-pointer font-semibold">{f.q}</summary><p className="mt-2">{f.a}</p></details>)}</>)}
