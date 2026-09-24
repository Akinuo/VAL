import Hero from '@/components/Hero'
import Dashboard from '@/components/Dashboard'
import Stitch from '@/components/Stitch'
import {getContent} from '@/lib/content'
export const revalidate=3600
export default async function Home(){
 const c=await getContent()
 return(<div className="grid gap-10">
  <Hero c={c}/>
  <Stitch className="text-maroon/20"/>
  <Dashboard c={c}/>
 </div>)}
