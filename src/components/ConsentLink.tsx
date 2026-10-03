'use client'
import { openConsentPanel } from '@/lib/consent'

export default function ConsentLink({ className = '' }: { className?: string }) {
  return (
    <button type="button" onClick={openConsentPanel} className={`underline underline-offset-2 ${className}`}>
      Cookie settings
    </button>
  )
}
