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
const hits = new Map<string, number[]>()

function rateLimited(ip: string): boolean {
  const now = Date.now()
  const recent = (hits.get(ip) ?? []).filter(t => now - t < RATE_WINDOW_MS)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE_LIMIT
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
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
  const name = String(b.name ?? '').slice(0, 80).trim()
  const message = String(b.message ?? '').slice(0, 1000).trim()
  const email = b.email ? String(b.email).slice(0, 254).trim() : null
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
      from: `"VAL Guide" <${user}>`,
      to: TO_EMAIL,
      replyTo: email || undefined,
      subject: `VAL Guide feedback — ${rating}/5 from ${name || 'Anonymous'}`,
      text: [
        'New feedback was submitted on VAL Guide.',
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
          filename: `val-guide-feedback-${Date.now()}.pdf`,
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
