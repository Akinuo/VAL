'use client'
import dynamic from 'next/dynamic'

// three.js only loads when this preview is on screen
const MachineViewer = dynamic(() => import('./MachineViewer'), {
  ssr: false,
  loading: () => <div className="flex h-[340px] items-center justify-center rounded-lg border border-border bg-denim-light text-sm text-muted sm:h-[460px]">Loading 3D model…</div>,
})

// Free rotate/zoom preview for anyone — no parts to tap, no account needed.
// Full part-by-part exploration lives behind login on /parts.
export default function MachinePreview() {
  return <MachineViewer parts={[]} selected="" onSelect={() => {}} xray={false} resetKey={0} />
}
