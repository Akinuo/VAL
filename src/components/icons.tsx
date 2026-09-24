// A small, consistent line-icon system: 24x24, currentColor, same stroke weight.
// Shapes are drawn from the app's own subject matter (spools, part markers, ribbons)
// rather than a generic icon font, so they stay legible at nav size and on slow connections.
const base = {
 viewBox: '0 0 24 24',
 fill: 'none',
 stroke: 'currentColor',
 strokeWidth: 1.6,
 strokeLinecap: 'round' as const,
 strokeLinejoin: 'round' as const,
}
type P = { className?: string }

export function IconSpool({ className }: P) {
 return (
  <svg {...base} className={className} aria-hidden="true">
   <ellipse cx="12" cy="6" rx="7" ry="2.3" />
   <ellipse cx="12" cy="18" rx="7" ry="2.3" />
   <path d="M5 6v12M19 6v12" />
   <path d="M6.5 9.5l11 5M17.5 9.5l-11 5" />
  </svg>
 )
}

export function IconPartMarker({ className }: P) {
 return (
  <svg {...base} className={className} aria-hidden="true">
   <circle cx="12" cy="12" r="7.2" />
   <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
  </svg>
 )
}

export function IconCheck({ className }: P) {
 return (
  <svg {...base} className={className} aria-hidden="true">
   <rect x="4" y="4" width="16" height="16" rx="3.5" />
   <path d="M8 12.5l2.6 2.6L16.5 9" />
  </svg>
 )
}

export function IconQuestion({ className }: P) {
 return (
  <svg {...base} className={className} aria-hidden="true">
   <circle cx="12" cy="12" r="8.6" />
   <path d="M9.3 9.8c.2-1.6 1.6-2.7 3.1-2.5 1.5.2 2.6 1.4 2.4 2.8-.2 1.3-1.3 1.8-2.1 2.3-.6.4-1 .8-1 1.7" />
   <circle cx="12" cy="16.6" r=".9" fill="currentColor" stroke="none" />
  </svg>
 )
}

export function IconQr({ className }: P) {
 return (
  <svg {...base} className={className} aria-hidden="true">
   <rect x="3" y="3" width="6.2" height="6.2" rx="1" />
   <rect x="14.8" y="3" width="6.2" height="6.2" rx="1" />
   <rect x="3" y="14.8" width="6.2" height="6.2" rx="1" />
   <rect x="15.4" y="15.4" width="2.2" height="2.2" fill="currentColor" stroke="none" />
   <rect x="19.2" y="19.2" width="1.6" height="1.6" fill="currentColor" stroke="none" />
   <rect x="15.4" y="19.2" width="1.6" height="1.6" fill="currentColor" stroke="none" />
  </svg>
 )
}

export function IconMessage({ className }: P) {
 return (
  <svg {...base} className={className} aria-hidden="true">
   <path d="M4 5.5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H9.5l-4 3v-3H4a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1z" />
   <path
    d="M12 8.4l1 2 2.2.3-1.6 1.5.4 2.2-2-1-2 1 .4-2.2-1.6-1.5 2.2-.3z"
    fill="currentColor"
    stroke="none"
   />
  </svg>
 )
}

export function IconPlay({ className }: P) {
 return (
  <svg {...base} className={className} aria-hidden="true">
   <rect x="3" y="5" width="18" height="14" rx="2.5" />
   <path d="M10 9.3l6 2.7-6 2.7z" fill="currentColor" stroke="none" />
  </svg>
 )
}

export function IconRibbon({ className }: P) {
 return (
  <svg {...base} className={className} aria-hidden="true">
   <circle cx="12" cy="9" r="5.6" />
   <path d="M9.5 13.6L7.2 21l4.8-2.5 4.8 2.5-2.3-7.4" />
   <path d="M9.7 9.2l1.6 1.6 2.9-2.9" />
  </svg>
 )
}
