import type { CapacitorConfig } from '@capacitor/cli'

// The Android app is a thin native shell around the same Next.js codebase
// deployed to Vercel — no separate mobile build, no duplicated UI/logic.
// Capacitor loads the live site (server.url) instead of bundling a static
// export, since the app relies on server routes (auth callback, feedback
// email, on-demand revalidate) that a static export can't serve.
const config: CapacitorConfig = {
  appId: 'ph.akinuo.valguide',
  appName: 'Basic Machine Operation (B.M.O)',
  webDir: 'public', // unused while server.url is set, but required by the schema
  server: {
    url: 'https://val-ashen-theta.vercel.app',
    androidScheme: 'https',
    cleartext: false,
    // Shown from the app's local bundle (see public/error.html) instead of
    // the WebView's raw browser error page when the remote site above can't
    // be reached — no signal, DNS failure, the deploy being down, etc.
    errorPath: 'error.html',
  },
  plugins: {
    // launchAutoHide is off because the OS's own SplashScreen theme
    // (android/app/.../styles.xml, AppTheme.NoActionBarLaunch) dismisses
    // almost immediately on its own — well before the remote page (server.url
    // above) has actually loaded over the network, leaving a blank/white gap.
    // Hiding it explicitly once the app shell has mounted (see lib/progress.tsx)
    // closes that gap instead.
    SplashScreen: {
      launchAutoHide: false,
      backgroundColor: '#22336B', // brand navy (denim), matches tailwind.config.ts
      androidScaleType: 'CENTER_CROP',
      // The spinner is hard-coded to render screen-center on Android (a
      // long-standing Capacitor limitation, not something configurable here),
      // which put it right on top of the centered badge artwork. The badge
      // + navy background already reads as "loading" on its own.
      showSpinner: false,
    },
  },
}

export default config
