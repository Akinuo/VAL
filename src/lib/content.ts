import {cache} from 'react'
import fallback from '@/data/content.json'
import {supabase} from './supabase'
export type Quiz={id:string;question:string;options:string[];answer:number;explanation:string}
export type Step={id:string;position?:number;title:string;body:string;quiz_questions:Quiz[]}
export type Lesson={slug:string;title:string;summary:string;video_url:string|null;minutes:number;steps:Step[]}
export type Content={lessons:Lesson[];checklists:{slug:string;title:string;items:string[]}[];parts:{slug:string;name:string;fn:string;x:number;y:number}[];faqs:{q:string;a:string}[];achievements:{slug:string;title:string;description:string;criteria:string}[]}
// Pages using this are statically generated and revalidated hourly, so Supabase sees ~5 reads/hour, not one per visitor.
export const getContent=cache(async():Promise<Content>=>{
 const fb=fallback as unknown as Content
 if(!supabase)return fb
 try{
  const[l,c,p,f,a]=await Promise.all([
   supabase.from('lessons').select('*,steps(*,quiz_questions(*))').order('position'),
   supabase.from('checklists').select('*').order('position'),
   supabase.from('parts').select('*').order('position'),
   supabase.from('faqs').select('*').order('position'),
   supabase.from('achievements').select('*').order('position')])
  if(l.error||!l.data?.length)return fb
  const lessons=(l.data as Lesson[]).map(x=>({...x,steps:[...x.steps].sort((a,b)=>(a.position??0)-(b.position??0))}))
  return{lessons,checklists:c.data??fb.checklists,parts:p.data??fb.parts,faqs:f.data??fb.faqs,achievements:a.data??fb.achievements} as Content
 }catch{return fb}
})
