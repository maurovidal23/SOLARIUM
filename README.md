# Solarium

Solarium is a mobile-first React app for tracking sun exposure sessions, exposed body zones, perceived intensity, and personal exposure history.

The current MVP stores data locally in the browser with IndexedDB and is designed as the base for a freemium iOS/App Store product.

## Current Features

- Start/stop exposure timer.
- Save perceived intensity: low, medium, high.
- Select exposed body zones from front/back body maps.
- Fast presets for common exposure patterns.
- Daily summary, timeline, session history, and body-zone analytics.
- PWA manifest for installable web-app behavior.
- Local-first storage using Dexie/IndexedDB.

## Freemium Product Direction

Free tier:

- Daily exposure timer.
- Local history.
- Body-zone tracking.
- Basic charts.

Pro tier candidates:

- UV index by location and time.
- Smart stop/rotate reminders.
- Skin-type and personal goal profile.
- Export to CSV/PDF.
- iCloud sync and Apple Health integration.
- Advanced weekly/monthly insights.

Before App Store release, add privacy policy, health disclaimer, location permission copy, subscription screens, and a proper onboarding flow.

## Development

```bash
npm install
npm run dev
```

Build production assets:

```bash
npm run build
```

Lint:

```bash
npm run lint
```

## Tech Stack

- React + Vite
- Tailwind CSS
- Zustand
- Dexie / IndexedDB
- Recharts
- lucide-react

## Notes

This app is informational and should not provide medical advice. Any UV or exposure guidance must be framed as general wellness tracking and should include clear disclaimers.
