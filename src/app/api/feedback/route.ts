import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { buildFeedbackPdf } from '@/lib/feedbackPdf'

// Needs the Node.js runtime (not Edge) for nodemailer's SMTP connection.
export const runtime = 'nodejs'

const TO_EMAIL = process.env.FEEDBACK_TO_EMAIL || 'bingmenoso@gmail.com'

// Created once per server instance and reused across requests — building a
// fresh SMTP transport on every submission adds needless connection setup.
let transporter: ReturnType<typeof nodemailer.createTransport> | null = null
function getTransporter(user: string, pass: string) {
  if (!transporter) {
    transporter = nodemailer.createTransport({ service: 'gmail', auth: { user, pass } })
  }
  return transporter
}

// Lightweight per-IP rate limit. In-memory, so it resets on cold start/redeploy
// and isn't shared across serverless instances — not a substitute for a real
// rate limiter (e.g. Upstash) under heavy traffic, but enough to stop casual
// spam of an endpoint that sends an email and renders a PDF per request.
const RATE_LIMIT = 5
const RATE_WINDOW_MS = 10 * 60 * 1000
const MAX_TRACKED_IPS = 5000
const MAX_BODY_BYTES = 8 * 1024
const EMAIL_RE = /^[^\s@<>",;:]+@[^\s@<>",;:]+\.[^\s@<>",;:]+$/
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  // Bound memory: drop expired entries once the table grows large.
  if (hits.size > MAX_TRACKED_IPS) {
    for (const [k, v] of hits) if (!v.some(t => now - t < RATE_WINDOW_MS)) hits.delete(k)
    if (hits.size > MAX_TRACKED_IPS) hits.clear()
  }
  const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE_LIMIT
}

// Reject cross-site browser POSTs. Non-browser clients send no Origin and are
// still covered by the rate limit.
function crossSite(req: Request): boolean {
  const origin = req.headers.get('origin')
  if (!origin) return false
  const host = req.headers.get('x-forwarded-host') ?? req.headers.get('host')
  try { return new URL(origin).host !== host } catch { return true }
}

// Strip control characters so user text can't smuggle headers into the email.
const clean = (v: string) => v.replace(/[\u0000-\u001f\u007f]+/g, ' ').trim()

export async function POST(req: Request) {
  if (crossSite(req)) {
    return NextResponse.json({ ok: false, error: 'Forbidden.' }, { status: 403 })
  }
  if (Number(req.headers.get('content-length') ?? 0) > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: 'Request too large.' }, { status: 413 })
  }

  const ip = req.headers.get('x-real-ip') || req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
  if (rateLimited(ip)) {
    return NextResponse.json({ ok: false, error: 'Too many submissions — please try again later.' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }

  const b = (body ?? {}) as Record<string, unknown>
  const name = clean(String(b.name ?? '').slice(0, 80))
  const message = String(b.message ?? '').slice(0, 1000).trim()
  const rawEmail = b.email ? clean(String(b.email).slice(0, 254)) : ''
  const email = EMAIL_RE.test(rawEmail) ? rawEmail : null
  const rating = Math.min(5, Math.max(1, Number(b.rating) || 5))

  if (message.length < 5) {
    return NextResponse.json({ ok: false, error: 'A message of at least 5 characters is required.' }, { status: 400 })
  }

  const user = process.env.GMAIL_USER
  const pass = process.env.GMAIL_APP_PASSWORD
  if (!user || !pass) {
    // Feedback may still have been saved to Supabase by the client — this only
    // means the email copy couldn't be sent.
    return NextResponse.json({ ok: false, error: 'Email is not configured on the server.' }, { status: 503 })
  }

  const date = new Date().toLocaleString('en-PH', { dateStyle: 'long', timeStyle: 'short' })

  try {
    const pdfBytes = await buildFeedbackPdf({ name: name || null, email, rating, message, date })

    const transporter = getTransporter(user, pass)

    await transporter.sendMail({
      from: `"B.M.O" <${user}>`,
      to: TO_EMAIL,
      replyTo: email || undefined,
      subject: `B.M.O feedback — ${rating}/5 from ${name || 'Anonymous'}`,
      text: [
        'New feedback was submitted on B.M.O.',
        '',
        `Name: ${name || 'Anonymous'}`,
        `Email: ${email || 'Not signed in'}`,
        `Rating: ${rating}/5`,
        `Date: ${date}`,
        '',
        'Message:',
        message,
      ].join('\n'),
      attachments: [
        {
          filename: `bmo-feedback-${Date.now()}.pdf`,
          content: Buffer.from(pdfBytes),
          contentType: 'application/pdf',
        },
      ],
    })

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('feedback email failed:', err)
    return NextResponse.json({ ok: false, error: 'Could not send the feedback email.' }, { status: 502 })
  }
}
