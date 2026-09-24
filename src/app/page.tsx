import Dashboard from '@/components/Dashboard'
import {getContent} from '@/lib/content'
export const revalidate=3600
export default async function Home(){
 return(<><h1 className="font-serif text-3xl font-bold text-maroon">Learn basic sewing machine operation, one short step at a time</h1>
  <p className="mb-8 mt-2 max-w-prose">Watch a short video, read one step, answer one quick question. You can browse everything without logging in.</p>
  <Dashboard c={await getContent()}/></>)}
