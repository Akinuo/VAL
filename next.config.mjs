/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  eslint: { ignoreDuringBuilds: true },
  async headers() {
    // Baseline hardening for a public site with login + a feedback form that
    // collects name/email. No CSP here: the app loads YouTube/Drive iframes
    // and a runtime-configured Supabase URL, and a wrong allowlist would
    // silently break video or auth — safer to leave that to a follow-up pass
    // with the real production origins in hand.
    const securityHeaders = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
    ]
    return [{ source: '/:path*', headers: securityHeaders }]
  },
}
export default config

