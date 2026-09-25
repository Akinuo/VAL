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
  return (
    <div className="relative">
      <MachineViewer parts={[]} selected="" onSelect={() => {}} xray={false} resetKey={0} />
      <span className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-ink/60 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
        Drag to rotate · pinch or scroll to zoom
      </span>
    </div>
  )
}
