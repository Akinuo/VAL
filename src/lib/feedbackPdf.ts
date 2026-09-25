import { PDFDocument, StandardFonts, rgb, type PDFFont } from 'pdf-lib'

export type FeedbackPdfInput = {
  name: string | null
  email: string | null
  rating: number
  message: string
  date: string
}

const PAGE_W = 595.28 // A4 portrait, points
const PAGE_H = 841.89
const MARGIN = 56

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let line = ''
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (line && font.widthOfTextAtSize(candidate, size) > maxWidth) {
      lines.push(line)
      line = word
    } else {
      line = candidate
    }
  }
  if (line) lines.push(line)
  return lines
}

// Builds a clean, single-page PDF summarising a feedback submission:
// who sent it, their rating, the message, and when. Kept intentionally
// simple (no images/fonts beyond the two standard Helvetica weights) so
// it renders fast in a short-lived serverless function.
export async function buildFeedbackPdf({ name, email, rating, message, date }: FeedbackPdfInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const page = doc.addPage([PAGE_W, PAGE_H])
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)

  const denim = rgb(0.133, 0.2, 0.42)
  const muted = rgb(0.353, 0.384, 0.518)
  const ink = rgb(0.118, 0.141, 0.251)

  let y = PAGE_H - 64

  page.drawText('VAL Guide', { x: MARGIN, y, size: 12, font: bold, color: muted })
  y -= 22
  page.drawText('Feedback submission', { x: MARGIN, y, size: 20, font: bold, color: denim })
  y -= 12
  page.drawLine({ start: { x: MARGIN, y }, end: { x: PAGE_W - MARGIN, y }, thickness: 1, color: rgb(0.827, 0.851, 0.910) })
  y -= 30

  const field = (label: string, value: string) => {
    page.drawText(label, { x: MARGIN, y, size: 9, font: bold, color: muted })
    y -= 15
    page.drawText(value, { x: MARGIN, y, size: 12, font, color: ink })
    y -= 26
  }

  field('DATE', date)
  field('NAME', name || 'Anonymous')
  field('EMAIL', email || 'Not signed in')
  field('RATING', `${'*'.repeat(rating)}${'-'.repeat(5 - rating)}  (${rating} / 5)`)

  page.drawText('MESSAGE', { x: MARGIN, y, size: 9, font: bold, color: muted })
  y -= 18

  const lines = wrapText(message, font, 12, PAGE_W - MARGIN * 2)
  for (const line of lines) {
    if (y < MARGIN) break // feedback is capped at 1000 chars, so a single page is always enough
    page.drawText(line, { x: MARGIN, y, size: 12, font, color: ink })
    y -= 17
  }

  return doc.save()
}
