import { redirect } from 'next/navigation'

// FAQs now live on the Settings page — this keeps any old links or
// printed/shared QR codes pointing at /faq working.
export default function FaqRedirect() {
  redirect('/settings')
}
