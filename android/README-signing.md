# Building a signed, installable release APK

## Why the old APK said "App not installed"

Two bugs, now fixed in this commit:

1. **`values/colors.xml` was missing.** The app's theme (`styles.xml`)
   referenced `@color/colorPrimary`, `colorPrimaryDark`, and `colorAccent`,
   but none of those colors were ever defined anywhere in the project. Added
   `colors.xml` with the brand navy (`#22336B`) used elsewhere in the app.
2. **The `release` build type had no signing config**, so `assembleRelease`
   produced an *unsigned* APK. Android refuses to install an unsigned APK —
   this is exactly what shows up as the generic "App not installed" toast,
   regardless of the "install unknown apps" setting (that setting only
   controls whether Android will even attempt the install, not whether the
   APK itself is valid).

## One-time setup (already done for you)

A release keystore (`valguide-release.jks`) and `keystore.properties` were
generated and are sitting in this `android/` folder. **Both are
git-ignored on purpose** — never commit a signing key or its password to
source control, even a private repo.

**Back these two files up somewhere safe outside git right now** (password
manager, private cloud drive). If you lose the keystore, every future
update has to be signed with a *different* key, and Android will refuse to
install an update over the existing app unless it's signed with the exact
same key — everyone who installed the old APK would have to uninstall it
first.

## Building the signed APK

Whenever `capacitor.config.ts` or anything in `public/` changes, sync it into
the native project first:

```bash
npm run cap:sync
```

(This is what copies `capacitor.config.ts` and `public/` into
`android/app/src/main/assets/` — the native project won't pick up config or
asset changes without it. It's git-ignored output, so it's regenerated on
every sync rather than committed.)

Then, from the `android/` directory:

```bash
./gradlew assembleRelease
```

The signed APK will be at:

```
android/app/build/outputs/apk/release/app-release.apk
```

That's the file to send to your friend — not `app-release-unsigned.apk`,
and not a debug build (those install fine but aren't meant for
distribution).

If you're using Android Studio instead: **Build → Generate Signed Bundle /
APK → APK**, and point it at `valguide-release.jks` with the credentials in
`keystore.properties` when prompted (it will offer to remember them so you
won't need to re-enter them each time).

## If your friend still can't install it

- Make sure they uninstall any previous copy of VAL Guide first — a
  differently-signed APK (e.g. a debug build vs. this release build) can't
  install over an existing install with a different signature.
- Confirm the APK actually finished transferring (a partial download/copy
  will also fail to install, with the same vague error).
- Their device needs Android 7.0 (API 24) or newer — that's this app's
  `minSdkVersion`.
