// Small sewing motifs used as quiet watermarks. Decorative only.
export function SpoolMark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 84" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={`pointer-events-none select-none ${className}`}>
      <rect x="10" y="4" width="44" height="9" rx="2.5" />
      <rect x="10" y="71" width="44" height="9" rx="2.5" />
      <path d="M16 13v58M48 13v58" />
      <path d="M16 20h32M16 27h32M16 34h32M16 41h32M16 48h32M16 55h32M16 62h32" opacity=".7" />
      <path d="M48 66c10 2 8 12 20 9" />
    </svg>
  )
}
