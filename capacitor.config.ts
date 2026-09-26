import type { CapacitorConfig } from '@capacitor/cli'

// The Android app is a thin native shell around the same Next.js codebase
// deployed to Vercel — no separate mobile build, no duplicated UI/logic.
// Capacitor loads the live site (server.url) instead of bundling a static
// export, since the app relies on server routes (auth callback, feedback
// email, on-demand revalidate) that a static export can't serve.
const config: CapacitorConfig = {
  appId: 'ph.akinuo.valguide',
  appName: 'VAL Guide',
  webDir: 'public', // unused while server.url is set, but required by the schema
  server: {
    url: 'https://val-ashen-theta.vercel.app',
    androidScheme: 'https',
    cleartext: false,
  },
}

export default config
