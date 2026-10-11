# Solarium launch-hardening execution results

Plan: `2026-10-11-solarium-launch-hardening.md`
Spec: `../specs/2026-10-11-solarium-launch-hardening-design.md`

## Execution record

- Isolated snapshot: `/tmp/opencode/solarium-fullcycle-red-20261011`.
- Original local-work baseline: `477e3d53541f35cdb46e28e9c95eb55d3dd9270f`.
- Committed test-first baseline: `0a44fb2e52b7d0b8e798e74b60b674e8662d7612`.
- Baseline execution: 22 tests, 16 expected assertion failures and 6 passes.
- Convoy full-cycle: `20261011-185844-zaz2`, completed, machine score 91/100 (target 90). The report prose says 92; the terminal and machine-readable score both say 91.
- Tasks 1–6 implemented; Task 7 clean installation, tests, lint, build, and Capacitor sync independently verified.
- Convoy added a post-onboarding warning integration test and regressions for stale reads, failed profile deletion, malformed analytics input, zone interactions, and localization.

## Final fix pass

- Restored “exposición” in `public/manifest.json`.
- Failed session deletion now displays an accessible Spanish error, preserves existing live data, and permits retry. New regression failed before the fix and passed afterward.
- Zone-less-only sessions now retain the heatmap's actual exposure total and both read-only views. New regression failed before the fix and passed afterward.
- Applied the plan's non-executable file-mode rule to the native scaffold; native source bytes were already LF. Removed the iOS text-normalization exception from `.gitattributes`.

## Verification

Independently executed on the final snapshot:

- `npm ci --no-audit --no-fund`: success, 542 packages installed.
- `npm test`: 11 test files, 50 tests passed, no unhandled errors.
- `npm run lint`: exit 0.
- `npm run build`: exit 0.
- `git diff --check`: exit 0.
- `npm run ios:sync`: exit 0; web assets copied and Capacitor iOS metadata updated.

Build advisories: outdated Browserslist data and a JavaScript chunk above 500 kB. Native compilation, signing, Xcode archive, and TestFlight have not been validated on Linux.

## Rulings

- Session deletion failure is important despite the scorer's minor label: an unhandled rejection provides no usable outcome for a destructive action. Preserve data and show a retryable error rather than resetting memory as if deletion succeeded. Cost if wrong: the user must retry deletion after storage recovers.
- Keep `Total` and the unselected maps visible for zone-less sessions: tracked exposure exists even without zone attribution. Cost if wrong: a slightly taller empty-state card.
- The approved LF/non-executable rule includes new iOS text files; permission normalization does not change native source behavior. Cost if wrong: executable permissions would need restoring for a future script (none of the scaffold files are scripts).

## Deferred minor findings

- Persistence suites mock the session repository; a real Dexie/fake-indexeddb integration test remains a follow-up.
- Validate the shape of stored profile JSON before merging defaults.
- Generate/validate Swift Package Manager's `Package.resolved` on macOS.
- Consider shared SVG scaffold extraction if front/back figures drift.
- Revisit the existing repository-wide `react/prop-types` disable separately.
- On-device small-zone tap targets, navigation naming, and the Pro roadmap display remain product/native follow-ups.

The original plan checkboxes are planning instructions; this results file records executed work and limitations. Only the implementation delta is intended for the live dirty checkout; the live branch remains uncommitted.
