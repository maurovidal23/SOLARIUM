# Solarium launch-hardening Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix the reviewed local-first data lifecycle and body-zone defects, implement the simple two-sided body-part selector from the user's reference, and leave the MVP testable and reviewable.

**Architecture:** Keep session persistence in Dexie and UI state in the existing Zustand stores. Put body-zone labels and metric calculations behind canonical helpers; reuse one accessible zone primitive for interactive selection and render the dashboard maps as decorative/read-only. Preserve the current 13 zone IDs and local-only product boundary.

**Tech Stack:** React 18, Vite 5, Zustand, Dexie, Tailwind, Vitest, jsdom, React Testing Library.

**Spec:** `docs/superpowers/specs/2026-10-11-solarium-launch-hardening-design.md`

**Execution method:** User requested Convoy `full-cycle`. Run it against a clean temporary snapshot of the approved local changes, not the live dirty checkout. Transfer the resulting patch back only after reviewing it; do not commit on the live `main` checkout.

**Execution results:** See [the execution record](2026-10-11-solarium-launch-hardening-results.md) for completed tasks, the Convoy run, test-first fixes, verification evidence, and remaining native follow-ups.

## Global Constraints

- Preserve local-first behavior; do not add network, GPS, UV, StoreKit, cloud sync, or health integrations.
- Preserve all 13 existing body-zone IDs and their session-data representation; do not migrate IndexedDB records.
- Show front and back body maps together, divided into broad body parts with no muscle anatomy; keep Spanish copy and the slate/amber palette.
- `Borrar todo` must also clear timers, pending sessions, modal state, and in-memory daily totals.
- The analytics `Total` is actual session duration counted once per session; per-zone minutes remain per-zone values.
- All changed/new text files use LF without BOM; new text/config files use mode `100644`.
- Run implementation and intermediate commits only in the temporary snapshot. Keep existing user edits in the live checkout intact and uncommitted.

## Review Focus

- Confirmed deletion with an active timer and with a pending intensity modal cannot recreate a session — Task 1 integration tests.
- Confirmed storage write failure still completes onboarding in memory and communicates that persistence failed — Task 2 tests.
- Confirmed selecting a zone on either simplified map updates the same canonical key and selected-zone chips — Task 3 tests.
- Confirmed multi-zone and zone-less sessions contribute once to total duration, while coverage includes all 13 zones — Task 4 tests.
- Confirmed repository normalization, dependency metadata, and release checks remain clean after a fresh install — Tasks 5 and 7 checks.

---

### Task 1: Test harness and complete data deletion

**Files:**
- Modify: `package.json`, `package-lock.json`, `src/store/exposureStore.js`, `src/pages/Settings/SettingsPage.jsx`
- Create: `vitest.config.js`, `src/test/setup.js`, `src/store/exposureStore.test.js`, `src/pages/Settings/SettingsPage.test.jsx`

**Interfaces:**
- Produce `useExposureStore.getState().resetExposure(): void`.
- `resetExposure()` clears the active interval and resets `isTracking`, `currentSession`, `elapsedSeconds`, `intervalId`, `showIntensityModal`, `pendingSession`, `todaySessions`, and `todayTotal`.

- [ ] Add Vitest, jsdom, `@testing-library/react`, and `@testing-library/jest-dom` as development dependencies; configure `npm test` as `vitest run`, jsdom, and the shared setup file.
- [ ] Write failing store tests for resetting an active timer and a pending session; assert a subsequent `confirmSession`/`dismissIntensity` does not call `addSession` after reset.
- [ ] Write a failing SettingsPage test: seed active/pending exposure state, confirm “Borrar todo”, then assert sessions/profile are cleared and the exposure state is reset.
- [ ] Run `npm test -- src/store/exposureStore.test.js src/pages/Settings/SettingsPage.test.jsx`; confirm the new reset assertions fail before implementation.
- [ ] Implement `resetExposure()` and call it after the successful `clearAllSessions()` in `handleDeleteAll`; use the existing `resetProfile()` action instead of clearing and reloading profile separately.
- [ ] Re-run the two targeted test files; expect all reset and no-session-resurrection assertions to pass.

### Task 2: Resilient onboarding profile persistence

**Files:**
- Modify: `src/store/profileStore.js`, `src/components/onboarding/Onboarding.jsx`
- Create: `src/store/profileStore.test.js`, `src/components/onboarding/Onboarding.test.jsx`

**Interfaces:**
- `persistProfile(profile): boolean` returns whether localStorage persistence succeeded.
- Profile store state adds `persistenceWarning: boolean`; successful writes clear it, failed writes set it while still committing the new profile to Zustand.

- [ ] Write a failing test that makes `localStorage.setItem` throw during `completeOnboarding`; assert `onboardingComplete` is true in memory and `persistenceWarning` is true.
- [ ] Write a failing onboarding UI test asserting the warning is presented through a localized `role="status"` message.
- [ ] Run `npm test -- src/store/profileStore.test.js src/components/onboarding/Onboarding.test.jsx`; confirm failure on the current unguarded write path.
- [ ] Catch storage-write failures in `persistProfile`, update Zustand regardless, and clear the warning after a later successful save.
- [ ] Render the non-blocking Spanish warning: “No se pudo guardar el perfil. Seguirá disponible hasta que cierres la app.”
- [ ] Re-run the targeted tests; expect the in-memory completion and accessible warning assertions to pass.

### Task 3: Simplified two-sided body-part selector

**Files:**
- Create: `src/components/body/BodyZone.jsx`, `src/components/body/BodySelector.test.jsx`
- Modify: `src/components/body/BodyFront.jsx`, `src/components/body/BodyBack.jsx`, `src/components/body/BodySelector.jsx`, `src/components/body/bodyZones.js`

**Interfaces:**
- `BodyZone({ zone, selectedZones, onToggleZone, interactive = true, children })` owns selection fill, localized `aria-label`, `aria-pressed`, and conditional keyboard/pointer behavior.
- `BodyFront` and `BodyBack` continue accepting `selectedZones` and `onToggleZone`; both add `interactive` defaulting to `true`.

- [ ] Write failing React Testing Library tests that both `Frente` and `Espalda` are rendered together, the existing 13 localized zone IDs are represented across both maps, no muscle-specific labels/segments are rendered, and selecting a region updates the selected-zone summary.
- [ ] Write failing interaction tests for existing `PRESETS` and `ZONE_GROUPS`, including toggling the same zone from either view.
- [ ] Run `npm test -- src/components/body/BodySelector.test.jsx`; confirm the current single-view selector fails the two-view assertions.
- [ ] Extract the shared zone wrapper and colors into `BodyZone.jsx`; give interactive zones localized labels and `aria-pressed` state.
- [ ] Replace muscle-detail SVG paths and decorative muscle lines with broad, separately selectable body-part regions using the existing 13 keys; show both front/back maps together with the selected regions in amber.
- [ ] Retain existing exposure presets, group toggles, chips, and clear behavior; do not add Grow/Define/Exclude or muscle-specific controls.
- [ ] Re-run selector tests; expect both maps, preset behavior, localized names, and selection state to pass.

### Task 4: Correct dashboard body-zone analytics and semantics

**Files:**
- Create: `src/utils/bodyZoneMetrics.js`, `src/components/charts/BodyHeatmap.test.jsx`
- Modify: `src/components/charts/BodyHeatmap.jsx`, `src/components/charts/BodyZoneChart.jsx`, `src/components/body/BodyZone.jsx`, `src/components/body/BodyFront.jsx`, `src/components/body/BodyBack.jsx`

**Interfaces:**
- `calculateBodyZoneMetrics(sessions)` returns `{ totalExposureSeconds, zoneMinutesByKey, activeZones, coveragePercent }`.
- `zoneMinutesByKey` may count one session duration in each selected zone; `totalExposureSeconds` counts each session once; `coveragePercent` is `activeZones.length / 13` rounded to an integer.

- [ ] Write failing `BodyHeatmap.test.jsx` behavior tests for a 10-minute four-zone session plus a 5-minute zone-less session (total must be 15 minutes, not 40), per-zone accumulation, and the 13-zone coverage denominator; keep these tests on the existing component so the red phase does not import the not-yet-created helper.
- [ ] Write failing component tests asserting the dashboard displays both front and back zones, reports distinct session time as total, and computes coverage over the visible 13-zone set.
- [ ] Assert the dashboard maps render in read-only mode without focusable button/keyboard controls; label each SVG as a localized front/back body map with `role="img"`.
- [ ] Run `npm test -- src/components/charts/BodyHeatmap.test.jsx`; confirm current per-zone summing, missing back view, and interactive controls fail as assertions (not module-load errors).
- [ ] Implement `calculateBodyZoneMetrics`, use it from both chart components, and render `BodyFront` + `BodyBack` read-only in `BodyHeatmap`.
- [ ] Ignore unknown stored zone keys; label total exposure time separately from per-zone accumulated minutes; retain the ranked zone list and expose the back-zone contribution in the map.
- [ ] Re-run the metric and dashboard tests; expect the duration, coverage, two-view, and read-only assertions to pass.

### Task 5: Normalize the reviewed diff and restore Spanish copy

**Files:**
- Create: `.gitattributes`
- Modify: all text files changed or introduced in the reviewed snapshot, including `.gitignore`, `README.md`, `package.json`, UI copy, and docs.

- [ ] Add `.gitattributes` with `* text=auto eol=lf`.
- [ ] Remove UTF-8 BOMs and normalize changed/new text files to LF; use Git renormalization in the temporary snapshot so encoding-only hunks disappear.
- [ ] Restore Spanish accents and punctuation in changed user-facing strings, including “exposición”, “Más”, “Aún”, and new onboarding/settings copy.
- [ ] Set new non-executable text/config/document files to mode `100644`; restore the final newline in `package.json`.
- [ ] Run `git diff --check` and inspect `git diff --stat`; confirm no encoding-only file remains and no whitespace errors are introduced.

### Task 6: Capacitor metadata and low-risk duplication cleanup

**Files:**
- Modify: `package.json`, `package-lock.json`, `capacitor.config.json`, `src/components/charts/bodyChartConfig.js`, `src/components/charts/BodyZoneChart.jsx`, `src/components/charts/BodyHeatmap.jsx`, `src/utils/format.js`, `src/db/sessions.js`, `src/store/profileStore.js`, `src/components/onboarding/Onboarding.jsx`, `src/pages/Insights/InsightsPage.jsx`, `src/pages/Settings/SettingsPage.jsx`
- Create: `src/data/proFeatures.js`, exporting `PRO_FEATURES` for the Settings and Insights pages.

- [ ] Move `@capacitor/cli` from `dependencies` to `devDependencies` and update the lockfile.
- [ ] Remove the obsolete `bundledWebRuntime` option from `capacitor.config.json`.
- [ ] Keep `src/components/body/bodyZones.js` as the canonical `BODY_ZONE_LABELS` source; import it from `formatBodyParts`, `BodyHeatmap`, and `BodyZoneChart`, then remove `BODY_PART_SHORT` and the `bodyChartConfig.js` label re-export.
- [ ] Remove the uncalled `updateSession` export, the unread `reminderPreference`/`locationMode`/`proIntentSeen` defaults, and the onboarding/Insights writes to `locationMode`/`proIntentSeen`; repository search must show no remaining references.
- [ ] Move the duplicate Settings/Insights Pro cards into `src/data/proFeatures.js` and use the existing `calculateBodyZoneMetrics` helper in both charts.
- [ ] Run the targeted tests and `npm run lint`; expect no dead-import, missing-label, or behavior regressions.

### Task 7: Clean-install verification and Convoy handoff

**Files:**
- Modify: `package-lock.json` only if clean installation demonstrates it is stale.
- Verify: test and build commands; no Xcode archive is expected on Linux.

- [ ] Run `npm ci` in the temporary snapshot.
- [ ] Run `npm test`; expect the deletion, storage failure, selector, and heatmap regression suites to pass.
- [ ] Run `npm run lint`; expect ESLint 9 to use `eslint.config.js` successfully.
- [ ] Run `npm run build`; expect Vite production assets to build without missing optional Rollup modules.
- [ ] Run `npm run ios:sync` if the Linux Capacitor environment supports it; do not claim Xcode/TestFlight validation.
- [ ] Execute the user-requested Convoy `full-cycle` pipeline on this verified snapshot with this plan and the approved spec attached; let its audits and quality loop report any remaining gaps.
- [ ] Review the final snapshot diff and tests, then apply only the verified implementation diff to the live checkout. Confirm the original local work is still present and leave the live branch uncommitted.
