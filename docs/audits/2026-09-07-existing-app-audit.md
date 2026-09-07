# Existing app audit — September 7, 2026

## Recommendation

Keep this repository and its Expo/React Native/TypeScript foundation. Selectively reuse the small UI components and assets that serve the pilot. Build a new, minimal product flow inside that foundation rather than reconnecting and repairing every migrated V3 screen. Do not discard the repository, port back to the old fighting engine, or spend the first implementation sessions refactoring unrelated code.

The application is a buildable scaffold with a library of disconnected screens. It is not a partially working MVP that only needs polish. The main risk is treating dormant, mocked behavior as completed functionality.

This audit changed documentation and agent setup only. No application code, package versions, assets, or existing user files were removed or replaced. No commit or remote publication was made.

## Scope and verification

Reviewed the active entry point, navigation, package/configuration files, UI primitives, representative onboarding/home/workout/settings/evolution screens, health and sprite services, persistence, test setup, asset references, current pitch, and repository instructions. Inventoried active source and assets. Inspected one existing archetype sprite and one updated visual reference. Historical V3 documents were not re-audited as current requirements. Audio files were inventoried, not auditioned.

Repository HEAD during the audit: `a3f2f74`. Node: `v22.22.2`. There is no Git remote and no existing tracker configuration. Pre-existing untracked work includes `docs/16bitfit-v4-pixel-tests/` and inspiration images 9–12; preserve it.

| Check | Result | What it establishes |
|---|---|---|
| `npm run type-check` | Passed | The TypeScript program passes its current checks; missing assets, mocked services, and permissive navigation types remain possible. |
| `CI=1 npm test -- --runInBand --silent` | 14 suites passed, 1 skipped; 210 tests passed, 23 skipped | Existing isolated test expectations pass. It does not establish a playable or persistent MVP. |
| `npm run lint` | Failed before checking source | ESLint 9.39.4 cannot find `eslint.config.js`, `.mjs`, or `.cjs`. |
| `CI=1 ./node_modules/.bin/expo install --check` | Failed compatibility check | Six installed packages differ from the SDK-compatible versions reported below. No updates applied. |
| `CI=1 ./node_modules/.bin/expo export --platform ios --output-dir <temporary directory>` | Passed: 1,219 modules, one Hermes iOS bundle | The currently reachable placeholder application bundles. This is not a signed native build, simulator run, or device test. |
| `xcrun simctl list devices booted` | Unavailable | `simctl` could not be found. The selected developer directory is `/Library/Developer/CommandLineTools`; no standard `/Applications/Xcode*.app` was found. Native visual behavior remains unverified. |

Temporary bundle output: `/tmp/16bitfit-audit-ios.cVIGtZ`. It is disposable and not needed by the next session. The durable check transcript is [check-results.txt](2026-09-07-check-results.txt).

Expo's check reported installed → expected: `expo` 54.0.34 → ~54.0.37; `expo-font` 14.0.11 → ~14.0.12; `@types/jest` 30.0.0 → 29.5.14; `babel-preset-expo` 55.0.21 → ~54.0.10; `eslint-config-expo` 55.0.0 → ~10.0.0; `jest-expo` 55.0.17 → ~54.0.18. These are dated compatibility findings for the installed SDK, not a recommendation to select those exact versions for a future release. Wayfinder should decide whether to align the existing SDK or move to a supported release after checking current iPhone distribution requirements.

## Findings that matter to the MVP

### The only connected route is a placeholder

[`src/navigation/index.tsx`](../../src/navigation/index.tsx) registers only `Home`, pointing to `PlaceholderHome`, whose text says the skeleton is up. `App.tsx` loads that navigator. None of the copied onboarding, workout, profile, or battle experiences is wired into the app.

Do not confuse successful bundling with verification of those screens. Define a small typed navigation flow from the new pilot requirements, then connect only those screens it actually needs.

### Visible progress and “generation” are still simulated

- [`HomeScreen`](../../src/screens/home/HomeScreen/index.tsx) hardcodes progress, steps, and other metrics; its battle action only logs a message.
- [`WorkoutTrackerScreen`](../../src/screens/workout/WorkoutTrackerScreen/index.tsx) starts with 2,847 steps and 142 calories. Stopping navigates toward an unregistered `Tabs` route and does not record an activity or award progress.
- [`PhotoUploadScreen`](../../src/screens/onboarding/PhotoUploadScreen/index.tsx) waits three seconds and navigates to the absent `AvatarBootSequence`; it does not call the sprite provider. Photo picking code is a reuse candidate, not an AI feature.
- [`SettingsScreen`](../../src/screens/settings/SettingsScreen/index.tsx) stores toggles in component state. Sign-out logs to the console; tutorial replay and health reconnection show “Coming Soon.” These controls should not appear as working settings in a pilot.
- [`MomentumBar`](../../src/components/molecules/MomentumBar/index.tsx) marks days using `index < days % 8`, not recorded activity dates. Its `progress` input is unused.

There is no working battle engine, activity reward ledger, player progression model, or saved end-to-end game loop in the audited active source. These are new work, not visual cleanup.

### The design structure is salvageable; the palette is not set

[`tokens.ts`](../../src/design-system/tokens.ts) deliberately sets backgrounds, text, buttons, and semantic feedback to the same magenta placeholder. Reconnecting a screen will not produce a readable final design. Preserve the user's pending palette decision; do not revive the old four-green palette or invent new colors under the guise of bug fixing.

The spacing, minimum touch targets, typography roles, pixel-border ideas, and accessible labels are useful starting points. `PixelText` enables font scaling and several components consider reduced motion. These are implementation ingredients, not a completed accessibility review: for example, `PixelButton` still animates without using the reduced-motion hook. Validate the selected components with the real theme, large text, and VoiceOver during implementation.

[`useFonts.ts`](../../src/hooks/useFonts.ts) has five active font-file references, and all five files are absent. The current root does not load that hook, which helps explain why the placeholder export passes. Importing the hook/barrel while reconnecting old screens can expose a bundling failure. Either restore the chosen fonts with their appropriate source/license or deliberately change typography. The automated asset scan also matched comments and test-only examples; those were excluded from this finding.

### Persistence and provider boundaries are patterns, not finished infrastructure

[`healthStore.ts`](../../src/stores/healthStore.ts) demonstrates Zustand plus AsyncStorage persistence, but only for health/sync fields. Keep that pattern as a candidate for pilot state; do not reuse its schema as a player model. Game progress still needs activity identity, duplicate handling, reward rules, battle state policy, reset behavior, and persisted-state versioning.

[`backend/index.ts`](../../src/services/backend/index.ts) throws whenever a member is accessed. The backend contracts presume email/password authentication and step storage; neither has been selected as necessary for this MVP. Preserve the concept of an external-service boundary, but reshape the actual contract after deciding local persistence versus shared services. Avoid building accounts solely because an interface already exists.

All three [`sprite-provider`](../../src/services/sprite-provider/index.ts) implementations throw “not implemented.” The interface offers a useful seam for a controlled experiment, but it needs a real failure/cancellation story, output persistence, and an appropriate server boundary if a provider secret is required. A public client must not contain that secret. Do not mistake provider class names for verified current API support.

### Health integration should remain separate from the first game loop

The iOS and Android files refer to native packages not installed in V4; sync functions throw. Their presence does not establish working HealthKit/Health Connect integration or permissions. The health facade also copies instance methods without binding them; the iOS permission implementation uses `this.permissions`, which the facade does not carry. This is a dormant reuse risk identified in source, not a reproduced device failure.

For the first pilot, evaluate manual completed-workout logging before committing to native health integration. Do not spend time fixing the Android path for an iPhone-only destination. If HealthKit is chosen later, re-evaluate its API and permission behavior with current primary documentation and real-device tests.

### The test suite contains useful checks and substantial legacy insulation

[`jest.setup.js`](../../jest.setup.js) mocks navigation, animations, storage, native modules, and the aliased design system. Its design-system replacement uses old green values, so affected tests do not exercise the real magenta theme. The evolution suite is explicitly skipped. The smoke test checks arithmetic; sprite tests check that stubs throw.

Retain useful control tests, such as disabled/loading button behavior and form interactions, after reviewing their assertions against the retained implementation. Retire arithmetic and “unimplemented forever” tests as actual features replace them. Keep native mocks only where necessary. Add a small number of meaningful checks for the real MVP loop: duplicate activity does not award twice, progress survives restart, battle outcomes follow defined rules, and generation failure preserves access to a preset avatar. Final acceptance needs a real iPhone session, not a larger isolated test count.

## Keep / rework / retire from the first release

“Retire” here means exclude from the MVP implementation and preserve as history until deliberate cleanup. Nothing was deleted during this audit.

| Area | Recommendation | Reason / prerequisite |
|---|---|---|
| Expo + React Native + strict TypeScript | Keep | Current entry bundles; no evidence justifies a framework rewrite. Align the chosen SDK and tools. |
| React Navigation native stack and root safe-area wrapper | Keep the foundation | Replace the placeholder with a small typed flow. |
| `PixelText`, `PixelButton`, `PixelBorder`, `PixelInput`, `PixelProgressBar`, `PixelSprite` | Reuse selectively | Useful primitives; apply a chosen theme, repair font loading, and validate retained behavior. |
| `ConfirmDialog`, `EmptyState`, simple stat displays | Reuse as needed | Only carry components into the pilot when a selected screen needs them. |
| Zustand/AsyncStorage persistence approach | Keep the pattern | Define a new minimal player/activity/progression schema. No preference between competing storage choices is locked by this audit. |
| Image-picker interaction | Rework | Replace fake generation and old routes; retain presets and decide photo handling. |
| Sprite-provider interface | Rework | Useful boundary; no provider implementation exists. Evaluate output acceptance, failure, latency, cost, and secret handling. |
| Full onboarding, home, settings, workout screens | Reference / rebuild narrowly | Old navigation, mocked values, extra features, and incompatible product assumptions would drag obsolete scope into the pilot. |
| Health services and sync | Defer | Not integrated; unnecessary unless activity-input decision requires them. |
| Evolution ceremony and long animation sequence | Defer | Skipped suite, stubbed audio/haptics, not required to test the first encounter. |
| Streak/momentum presentation and negative reward assets | Exclude from first loop | Existing placeholder logic and streak-break concepts conflict with the agreed rest-day philosophy. |
| Five V3 archetype sprite sets | Optional temporary presets | Existing files can avoid an early art-production detour. The inspected builder is four-green art and does not represent the proposed richer final palette. Sean still owns visual approval. |
| Existing sound library | Preserve; shortlist later | 131 MP3 files exist. Do not build an audio subsystem to use them all. Audible quality and selection were not tested. |
| Updated inspiration images and pixel tests | Preserve | User-owned design input, including untracked work. Reference images are not automatically approved shipping assets. |
| `docs/archive-v3` | Preserve as historical reference | Read only when a specific decision needs history. Never treat its old scope as the active backlog. |

## First Wayfinder decisions

These are inputs to charting, not already-created or resolved tickets. State precise questions as tickets even when blocked; reserve fog for questions that cannot yet be phrased precisely.

1. What constitutes a completed activity, how does it award progress, and how do edits, duplicate entries, rest days, and repeat battles behave?
2. What player choices make the single boss encounter satisfying, and what is the smallest prototype Sean needs to judge it?
3. What must be persisted on-device, and does this pilot require a server, account, or shared participant identity?
4. Which iPhone distribution path and Expo SDK can support both the first trusted testers and the later cohort?
5. What is the smallest coherent visual direction, preset-avatar set, and font choice for a comfortable-to-share build?
6. When should personalized generation enter the pilot, and how should fallback, photo handling, provider choice, cost limits, and evaluation work?
7. What events and observations answer the pilot questions without mixing prompted and spontaneous use?
8. What verification and user-review criteria make the build ready for private sharing?

Research into external APIs, release compatibility, and distribution belongs in Wayfinder research tickets; subjective product and design choices remain HITL. Do not precommit a delivery date until those constraints and the runnable first slice are understood.

See [agreed scope](../2026-UPDATE/16BitFit-MVP-Agreed-Scope.md) and [the fresh-session kickoff](../2026-UPDATE/16BitFit-MVP-Wayfinder-Kickoff.md). This audit is completed evidence; the new session should only repeat checks when the relevant files/environment change or a finding needs reproduction.
