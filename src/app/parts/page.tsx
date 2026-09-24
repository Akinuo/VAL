import PartsDiagram from '@/components/PartsDiagram'
import {getContent} from '@/lib/content'
export const revalidate=3600
export default async function Parts(){
 return(<><h1 className="mb-4 font-serif text-3xl font-bold text-maroon">Machine parts</h1><PartsDiagram parts={(await getContent()).parts}/></>)}
