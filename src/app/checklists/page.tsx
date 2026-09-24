import Checklists from '@/components/Checklists'
import {getContent} from '@/lib/content'
export const revalidate=3600
export default async function Page(){
 return(<><h1 className="mb-4 font-serif text-3xl font-bold text-maroon">Checklists</h1><p className="mb-6">Ticks are saved on this device.</p><Checklists lists={(await getContent()).checklists}/></>)}
