// Supabase origin for CSP connect-src (REST + realtime websocket).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
let supabaseOrigins = []
try {
  if (supabaseUrl) {
    const u = new URL(supabaseUrl)
    supabaseOrigins = [u.origin, `wss://${u.host}`]
  }
} catch {}

const isDev = process.env.NODE_ENV !== 'production'

// Next.js 14 injects inline bootstrap scripts, so script-src needs
// 'unsafe-inline' unless nonces are wired through middleware. Everything else
// is locked to same-origin plus the specific hosts the app actually uses.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.youtube.com https://s.ytimg.com`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://i.ytimg.com https://img.youtube.com",
  "font-src 'self' data:",
  `connect-src 'self' ${supabaseOrigins.join(' ')}`.trim(),
  "frame-src https://www.youtube.com https://www.youtube-nocookie.com https://drive.google.com",
  "media-src 'self' blob:",
  "worker-src 'self' blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ['upgrade-insecure-requests']),
].join('; ')

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Self-contained server bundle for the Docker/nginx deployment (ignored by Vercel).
  output: 'standalone',
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    const securityHeaders = [
      { key: 'Content-Security-Policy', value: csp },
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin-allow-popups' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()' },
    ]
    return [
      { source: '/:path*', headers: securityHeaders },
      { source: '/api/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }] },
    ]
  },
}
export default config
