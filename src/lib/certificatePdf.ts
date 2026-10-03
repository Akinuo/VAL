import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from 'pdf-lib'

type CertificatePdfInput = {
  name: string
  score: number
  total: number
  date: string
}

// A4 landscape, points
const PAGE_W = 841.89
const PAGE_H = 595.28

function centerText(page: PDFPage, text: string, y: number, font: PDFFont, size: number, color: ReturnType<typeof rgb>) {
  const width = font.widthOfTextAtSize(text, size)
  page.drawText(text, { x: (PAGE_W - width) / 2, y, size, font, color })
}

// Builds a single-page landscape certificate: brand-colored double border,
// the learner's name, and their final assessment score. Runs entirely
// client-side (pdf-lib has no Node-only dependencies in its core API), so
// the download happens the moment a passing score is submitted — no server
// round trip needed.
export async function buildCertificatePdf({ name, score, total, date }: CertificatePdfInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create()
  const page = doc.addPage([PAGE_W, PAGE_H])
  const font = await doc.embedFont(StandardFonts.Helvetica)
  const bold = await doc.embedFont(StandardFonts.HelveticaBold)
  const italic = await doc.embedFont(StandardFonts.HelveticaOblique)

  const denim = rgb(0.133, 0.2, 0.42)
  const gold = rgb(0.898, 0.608, 0.110)
  const ink = rgb(0.118, 0.141, 0.251)
  const muted = rgb(0.353, 0.384, 0.518)
  const green = rgb(0.118, 0.420, 0.278)
  const rule = rgb(0.827, 0.851, 0.910)

  const pct = total > 0 ? Math.round((score / total) * 100) : 0

  // Decorative double border
  const M = 24
  page.drawRectangle({ x: M, y: M, width: PAGE_W - M * 2, height: PAGE_H - M * 2, borderColor: denim, borderWidth: 2 })
  page.drawRectangle({ x: M + 8, y: M + 8, width: PAGE_W - (M + 8) * 2, height: PAGE_H - (M + 8) * 2, borderColor: gold, borderWidth: 1 })

  let y = PAGE_H - 108
  centerText(page, 'V A L   G U I D E', y, bold, 12, muted)

  y -= 36
  centerText(page, 'Certificate of Completion', y, bold, 32, denim)

  y -= 30
  centerText(page, 'This certifies that', y, italic, 13, muted)

  y -= 46
  centerText(page, name, y, bold, 26, ink)
  const nameWidth = bold.widthOfTextAtSize(name, 26)
  page.drawLine({
    start: { x: (PAGE_W - nameWidth) / 2 - 24, y: y - 10 },
    end: { x: (PAGE_W + nameWidth) / 2 + 24, y: y - 10 },
    thickness: 1,
    color: gold,
  })

  y -= 44
  centerText(page, 'has successfully completed the B.M.O: Basic Machine', y, font, 13, ink)
  y -= 20
  centerText(page, 'Operation training program, including its final assessment.', y, font, 13, ink)

  y -= 38
  centerText(page, `Final assessment score: ${score} / ${total} (${pct}%)`, y, bold, 14, green)

  // Footer
  const footerY = M + 46
  page.drawLine({
    start: { x: PAGE_W / 2 - 220, y: footerY + 24 },
    end: { x: PAGE_W / 2 + 220, y: footerY + 24 },
    thickness: 0.75,
    color: rule,
  })

  page.drawText('DATE', { x: PAGE_W / 2 - 220, y: footerY, size: 9, font: bold, color: muted })
  page.drawText(date, { x: PAGE_W / 2 - 220, y: footerY - 16, size: 12, font, color: ink })

  const issuedLabel = 'ISSUED BY'
  const issuedValue = 'B.M.O — Basic Machine Operation'
  const labelWidth = bold.widthOfTextAtSize(issuedLabel, 9)
  const valueWidth = font.widthOfTextAtSize(issuedValue, 12)
  page.drawText(issuedLabel, { x: PAGE_W / 2 + 220 - labelWidth, y: footerY, size: 9, font: bold, color: muted })
  page.drawText(issuedValue, { x: PAGE_W / 2 + 220 - valueWidth, y: footerY - 16, size: 12, font, color: ink })

  return doc.save()
}
