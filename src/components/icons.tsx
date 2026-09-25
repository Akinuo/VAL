// Premium icon set — 24×24 viewport, 1.5px stroke, round caps/joins.
// Each icon is drawn for its specific meaning in a sewing-education context.
const S = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}
type P = { className?: string }

// Thread spool — two elliptical flanges, a barrel, and crossed thread wraps
export function IconSpool({ className }: P) {
  return (
    <svg {...S} className={className} aria-hidden="true">
      {/* Top flange */}
      <ellipse cx="12" cy="5.5" rx="6.5" ry="2" />
      {/* Bottom flange */}
      <ellipse cx="12" cy="18.5" rx="6.5" ry="2" />
      {/* Barrel sides */}
      <line x1="5.5" y1="5.5" x2="5.5" y2="18.5" />
      <line x1="18.5" y1="5.5" x2="18.5" y2="18.5" />
      {/* Thread wraps — two crossing diagonals */}
      <path d="M5.5 8.5 Q12 11 18.5 9" />
      <path d="M5.5 15 Q12 13 18.5 14.5" />
    </svg>
  )
}

// Map pin / part marker — location pin with a centre dot
export function IconPartMarker({ className }: P) {
  return (
    <svg {...S} className={className} aria-hidden="true">
      {/* Pin body */}
      <path d="M12 2.5C9.1 2.5 6.8 4.8 6.8 7.7c0 4.1 5.2 10.8 5.2 10.8s5.2-6.7 5.2-10.8C17.2 4.8 14.9 2.5 12 2.5z" />
      {/* Centre dot */}
      <circle cx="12" cy="7.7" r="1.6" fill="currentColor" stroke="none" />
      {/* Ground shadow line */}
      <path d="M9 20.5 Q12 21.5 15 20.5" strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

// Checkbox with checkmark — clean square with rounded corners
export function IconCheck({ className }: P) {
  return (
    <svg {...S} className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="3" />
      <polyline points="7.5,12.5 10.5,15.5 16.5,9" />
    </svg>
  )
}

// Question mark in circle — clean, legible at small sizes
export function IconQuestion({ className }: P) {
  return (
    <svg {...S} className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      {/* Question curve */}
      <path d="M9.5 9.5a2.5 2.5 0 0 1 4.9.8c0 1.6-2.4 2-2.4 3.7" />
      {/* Dot */}
      <circle cx="12" cy="17" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

// QR code — three corner squares + data dots, recognisable at 16px
export function IconQr({ className }: P) {
  return (
    <svg {...S} className={className} aria-hidden="true">
      {/* Top-left finder */}
      <rect x="3" y="3" width="7" height="7" rx="1.2" />
      <rect x="5" y="5" width="3" height="3" fill="currentColor" stroke="none" />
      {/* Top-right finder */}
      <rect x="14" y="3" width="7" height="7" rx="1.2" />
      <rect x="16" y="5" width="3" height="3" fill="currentColor" stroke="none" />
      {/* Bottom-left finder */}
      <rect x="3" y="14" width="7" height="7" rx="1.2" />
      <rect x="5" y="16" width="3" height="3" fill="currentColor" stroke="none" />
      {/* Data module dots */}
      <rect x="14" y="14" width="2.5" height="2.5" rx="0.4" fill="currentColor" stroke="none" />
      <rect x="18.5" y="14" width="2.5" height="2.5" rx="0.4" fill="currentColor" stroke="none" />
      <rect x="14" y="18.5" width="2.5" height="2.5" rx="0.4" fill="currentColor" stroke="none" />
      <rect x="18.5" y="18.5" width="2.5" height="2.5" rx="0.4" fill="currentColor" stroke="none" />
    </svg>
  )
}

// Speech bubble — clean tail, no star decoration
export function IconMessage({ className }: P) {
  return (
    <svg {...S} className={className} aria-hidden="true">
      {/* Bubble body */}
      <path d="M4 4h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H8.5l-4.5 3.5V16H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1z" />
      {/* Three text lines */}
      <line x1="7" y1="8.5" x2="17" y2="8.5" />
      <line x1="7" y1="11.5" x2="14" y2="11.5" />
    </svg>
  )
}

// Play / video — screen with a centred triangle
export function IconPlay({ className }: P) {
  return (
    <svg {...S} className={className} aria-hidden="true">
      {/* Screen */}
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      {/* Play triangle */}
      <path d="M10 9.5 L16 12 L10 14.5 Z" fill="currentColor" stroke="none" />
    </svg>
  )
}

// Award ribbon — circle badge with a ribbon tail
export function IconRibbon({ className }: P) {
  return (
    <svg {...S} className={className} aria-hidden="true">
      {/* Badge circle */}
      <circle cx="12" cy="8.5" r="5.5" />
      {/* Ribbon tails */}
      <path d="M8.5 13.2 L6.5 21 L12 18 L17.5 21 L15.5 13.2" />
      {/* Star / check inside */}
      <polyline points="9.8,8.5 11.3,10 14.5,7" strokeWidth="1.4" />
    </svg>
  )
}

// Needle — used in lesson player video placeholder
export function IconNeedle({ className }: P) {
  return (
    <svg {...S} className={className} aria-hidden="true">
      {/* Needle shaft */}
      <line x1="12" y1="3" x2="12" y2="19" />
      {/* Eye */}
      <ellipse cx="12" cy="6" rx="1.8" ry="1.2" />
      {/* Point */}
      <path d="M11 19 Q12 22 13 19" fill="currentColor" stroke="none" />
    </svg>
  )
}

// Wrench / settings — used for machine preparation
export function IconWrench({ className }: P) {
  return (
    <svg {...S} className={className} aria-hidden="true">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l2.3-2.3a6 6 0 0 1-7.8 7.8l-5.1 5.1a2.12 2.12 0 0 1-3-3l5.1-5.1a6 6 0 0 1 7.8-7.8l-2.3 2.3z" />
    </svg>
  )
}

// Shield — used for safety lesson
export function IconShield({ className }: P) {
  return (
    <svg {...S} className={className} aria-hidden="true">
      <path d="M12 2.5 L20 6 V12c0 5-8 9.5-8 9.5S4 17 4 12V6L12 2.5z" />
      <polyline points="9,12 11,14 15,10" />
    </svg>
  )
}

// Padlock — shackle + body with keyhole, used for lessons not yet unlocked
export function IconLock({ className }: P) {
  return (
    <svg {...S} className={className} aria-hidden="true">
      {/* Shackle */}
      <path d="M7.5 10V7a4.5 4.5 0 0 1 9 0v3" />
      {/* Body */}
      <rect x="5" y="10" width="14" height="10" rx="2.5" />
      {/* Keyhole */}
      <circle cx="12" cy="14.2" r="1.3" fill="currentColor" stroke="none" />
      <line x1="12" y1="15.5" x2="12" y2="17.3" />
    </svg>
  )
}

// Sparkle / clean — used for cleaning lesson
export function IconSparkle({ className }: P) {
  return (
    <svg {...S} className={className} aria-hidden="true">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}
