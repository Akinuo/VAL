import {notFound} from 'next/navigation'
import type {Metadata} from 'next'
import LessonPlayer from '@/components/LessonPlayer'
import {getContent} from '@/lib/content'
export const revalidate=3600
export async function generateStaticParams(){return(await getContent()).lessons.map(l=>({slug:l.slug}))}
export async function generateMetadata({params}:{params:{slug:string}}):Promise<Metadata>{
 const {lessons}=await getContent()
 const l=lessons.find(x=>x.slug===params.slug)
 if(!l)return{title:'Lesson not found'}
 return{title:l.title,description:l.summary,openGraph:{title:l.title,description:l.summary}}
}
export default async function LessonPage({params}:{params:{slug:string}}){
 const {lessons}=await getContent()
 const l=lessons.find(x=>x.slug===params.slug)
 if(!l||!l.steps.length)notFound()
 return<LessonPlayer lesson={l} lessons={lessons}/>}
