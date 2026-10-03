import { NextResponse } from 'next/server'

// Liveness probe for the load balancer / container orchestrator.
export const dynamic = 'force-dynamic'

export function GET() {
  return NextResponse.json({ ok: true })
}
