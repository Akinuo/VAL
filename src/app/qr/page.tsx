import QrHub from '@/components/QrHub'
import {getContent} from '@/lib/content'
export const revalidate=3600
export default async function Qr(){
 return(<><h1 className="font-serif text-3xl font-bold text-maroon">QR Learning Hub</h1><p className="mb-6 mt-2">Pick a page, then print or share its QR code. Scanning it opens that page on any phone.</p><QrHub c={await getContent()}/></>)}
