export default function Stitch({ className = '' }: { className?: string }) {
 return (
  <svg
   viewBox="0 0 400 12"
   preserveAspectRatio="none"
   className={`h-3 w-full ${className}`}
   aria-hidden="true"
  >
   <line
    x1="0"
    y1="6"
    x2="400"
    y2="6"
    stroke="currentColor"
    strokeWidth="2"
    strokeDasharray="9 8"
    strokeLinecap="round"
   />
  </svg>
 )
}
