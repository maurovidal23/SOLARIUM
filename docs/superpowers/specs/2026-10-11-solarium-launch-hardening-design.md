# Solarium launch-hardening design

**Status:** Draft for review  
**Source:** Convoy run `20261011-124243-igxw`, reviewed against `origin/main` using a verified 64-file snapshot, plus the user's body-area reference image.

## Intent

Prepare Solarium's local-first exposure tracker for a dependable MVP/App Store path. The review found that deleting data can leave a live exposure session able to reappear, the body heatmap can report more minutes than were actually tracked, profile persistence can prevent onboarding from completing, and the current diff is obscured by repository-wide encoding churn. The supplied reference image establishes the desired body-area selector direction: a simple front-and-back body map with selectable parts, without muscle detail.

## Goals

1. Make “Borrar todo” remove session and profile data from storage **and** live application state, including any running timer or pending intensity modal.
2. Make body-zone selection and analytics understandable, accessible, and consistent with the actual tracked zones.
3. Keep onboarding usable when browser storage writes fail, while making clear that the profile may not persist after the current session.
4. Add regression coverage for the corrected behavior and leave lint, tests, and production build runnable from a clean dependency install.
5. Restore a focused, reviewable diff: LF line endings, no BOMs, normal non-executable source/document modes, and correct Spanish accents.
6. Resolve the review's low-risk configuration and duplication findings where they are safe and local to this work.

## Product behavior

### Exposure data deletion

- After confirmation, deletion clears all IndexedDB sessions and the locally stored profile.
- The exposure store is reset atomically: stop and clear any timer; clear current and pending sessions; close the intensity modal; reset elapsed time, today's session list, and today's total.
- Returning to Home must not show deleted sessions, reopen a stale modal, or save a session that was pending when deletion occurred.
- Clearing the profile continues to reset onboarding completion, matching the existing confirmation and profile-reset behavior.

### Body-area selection

- Show front and back body views together in the selector, following the supplied reference's selection-screen pattern.
- Use simple, flat silhouettes segmented into the existing 13 exposure zones: face, neck, shoulders, chest, abdomen, arms, forearms, hands, upper back, lower back, thighs, shins, and feet.
- Do not depict individual muscles or add fitness concepts such as grow/define/exclude.
- Preserve direct map selection, selected-zone chips, existing exposure presets, and group selection. Use localized Spanish labels and the existing slate/amber palette; selected zones remain visually distinct in amber.
- The selector's quick presets remain exposure-oriented (`Cuerpo completo`, `Sin camiseta`, `Vestido`, `Shorts`); this work does not redefine their meanings.

### Dashboard body heatmap

- Display front and back views so all 13 exposure zones can be represented.
- Coverage is `distinct active zones / 13`; it must agree with the zones highlighted across both views.
- The card's `Total` is actual exposure duration, counted once per session. Per-zone accumulated minutes remain a separate per-zone measure and are labelled accordingly.
- Analytics maps are read-only: no focusable or clickable no-op controls. Interactive selector regions expose localized accessible names.

### Profile persistence

- A failed `localStorage.setItem` must not prevent the in-memory profile update or keep the onboarding gate from completing for the current session.
- Show a non-blocking Spanish notice that the profile could not be saved and may be lost when the app closes.

## Engineering hygiene and cleanup

- Normalize changed and new text files to LF with no UTF-8 BOM; add `.gitattributes` to keep LF as the repository convention.
- New text/config/document files use mode `100644`; `package.json` ends with a newline; restore Spanish diacritics in existing and new UI copy.
- Move `@capacitor/cli` to `devDependencies` and remove the obsolete `bundledWebRuntime` option.
- Consolidate shared body-map helpers and canonical body-zone labels. Remove `updateSession` and profile fields that are written but never consumed, after confirming there are no callers. Share duplicated Pro catalogue and per-zone aggregation only where a small, clear module removes duplication without broad refactoring.

## Verification and acceptance

- Tests cover deleting while a timer is active, deleting while an intensity modal is pending, profile storage write failure, multi-zone session totals, front/back coverage, and body-selector zone/preset interactions.
- The dashboard heatmap reports a multi-zone session's duration once, and coverage includes back-zone exposure in a visibly represented back view.
- The selector exposes the same 13 zones and existing presets, with no muscle anatomy and localized labels; the analytics version has no interactive controls in the tab order.
- `npm run lint`, the new test command, and `npm run build` pass after a clean dependency install.
- iOS-native build/TestFlight behavior remains a later macOS/Xcode validation; this work may run `npm run ios:sync` where dependencies permit but makes no App Store submission claim.

## Non-goals

- No UV API, GPS lookup, reminders, StoreKit/subscriptions, cloud sync, or health integrations.
- No change to the privacy/export policy or health-advice boundary beyond preserving current local-first behavior.
- No broad visual redesign outside the body selector and dashboard body heatmap.
- No speculative changes to pre-existing date-bucketing or timeline issues not introduced by this reviewed diff.
- Convoy's dirty-import behavior and inconsistent score JSON are separate tooling follow-ups; this specification covers the Solarium application.

## Calls made for the builder

- The body selector shows both sides together; mobile sizing may stack or scale the two simple maps while keeping zones tappable.
- Existing 13 zone identifiers and exposure presets are preserved to avoid a data migration.
- `Total` means actual session duration; per-zone minutes are a distinct metric.
- A failed profile write keeps onboarding usable in memory and shows a non-blocking persistence warning.
- The scope includes all eight review finding clusters, while separating product/legal and Apple-side decisions explicitly listed as non-goals.
