// Next.js shows this the instant navigation to /home starts, instead of
// leaving the previous route's UI frozen on screen while HomePage's
// getContent() call (see page.tsx) resolves. On the Android app specifically
// — which loads this site live from Vercel rather than bundling it — that
// resolve time is a real network round trip, so without this file people
// coming from the login screen would stay stuck on "Taking you to your
// lessons…" until the whole page was ready. This skeleton mirrors
// Dashboard's own loading state (see DashboardSkeleton in
// src/components/Dashboard.tsx) so nothing visibly swaps once real content
// arrives.
export default function HomeLoading() {
  return (
    <div className="grid gap-8 fade-in" aria-hidden="true">
      <div className="grid gap-2">
        <div className="h-7 w-56 animate-pulse rounded bg-denim-light" />
        <div className="h-4 w-40 animate-pulse rounded bg-denim-light" />
      </div>
      <div className="h-40 animate-pulse rounded-lg bg-denim-light sm:h-44" />
      <div className="grid gap-3">
        <div className="h-5 w-24 animate-pulse rounded bg-denim-light" />
        <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-[72px] animate-pulse bg-paper" style={{ animationDelay: `${i * 75}ms` }} />
          ))}
        </div>
      </div>
    </div>
  )
}
