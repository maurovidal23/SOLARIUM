# Solarium iOS Release Checklist

Target: freemium iPhone app distributed through the Apple App Store.

## Current Status

- React/Vite app builds successfully.
- Capacitor iOS wrapper is configured with app id `com.maurovidal.solarium`.
- `ios/` Xcode project scaffold has been generated.
- Data is local-first: sessions in IndexedDB, profile in localStorage.
- No real subscriptions, UV API, GPS, or health integrations are enabled yet.

## Commands

```bash
npm install
npm run build
npm run ios:sync
npm run ios:open
```

`npm run ios:open` requires macOS with Xcode. Windows can prepare and sync the project, but cannot archive/sign the iOS build.

## Apple Requirements Before Submission

1. Apple Developer account.
2. macOS machine with current Xcode.
3. App icon and launch screen assets.
4. Bundle ID registered as `com.maurovidal.solarium`.
5. Privacy Policy URL.
6. In-app privacy screen and support contact.
7. Health/wellness disclaimer.
8. App Store screenshots for required iPhone sizes.
9. App Store metadata: subtitle, keywords, description, support URL, marketing URL.
10. TestFlight build and internal testing before review.

## Freemium Plan

Free MVP:

- Exposure timer.
- Intensity logging.
- Body-zone tracking.
- Daily timeline.
- History and dashboard.
- Local export/delete controls.

Pro v1 candidate:

- UV index by city/GPS.
- Smart stop and rotate reminders.
- Personalized goals by skin type.
- Weekly/monthly insights.
- CSV/PDF export.

Subscription must not be submitted until the app has actual ongoing Pro value. A paywall mock is fine for product testing, but real StoreKit purchases need implementation and Apple metadata.

## Privacy Position

Current MVP stores data locally on the device. If location, cloud sync, analytics, purchases, or account login are added, update the privacy policy and App Store privacy nutrition labels before release.

## Health Disclaimer

Solarium should remain a habit tracker. Do not claim to diagnose, prevent, or treat vitamin D deficiency, skin cancer, burns, or other health conditions. UV guidance must be framed as informational.
