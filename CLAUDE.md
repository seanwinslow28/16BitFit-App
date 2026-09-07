# 16BitFit V4 — Claude Code Configuration

## Project Overview

16BitFit V4 turns real workouts into the fuel for a retro **Pokemon-style** turn-based fitness battler. The user uploads a selfie, gets turned into a pixel sprite, and battles boss characters using stats grown by real activity.

**This is the 2026 reboot.** V3 (Street Fighter 2 / Phaser / DMG-only / multi-stage SDXL pipeline) has been retired. See `docs/2026-UPDATE/16BitFit-Updated-Pitch-2026.md` for the new vision and `docs/archive-v3/` for the historical reference.

## Tech Stack

- **Frontend:** React Native (Expo) + TypeScript strict
- **State:** Zustand
- **Backend:** TBD (stubbed behind `src/services/backend/IBackendClient` until chosen)
- **Sprite Generation:** TBD (stubbed behind `src/services/sprite-provider/IPixelSpriteProvider` — evaluating OpenAI Images / Nano Banana 2 / PixelLab.ai)
- **Health Integration:** Apple HealthKit (iOS) / Health Connect (Android)
- **Combat:** Pure RN turn-based — **no Phaser, no WebView bridge**

## Design System

Palette is currently a magenta `#FF00FF` stub (`src/design-system/tokens.ts`). The user is doing a separate design brainstorm pass to define the V4 16-bit color system. **Do not invent palette values.** Spacing, borders, shadows, animations, and touch targets are stable.

## Key Architectural Constraints

1. **Backend-agnostic.** Code against `IBackendClient` — never import a provider SDK directly outside `src/services/backend/<provider>.ts`.
2. **Sprite-provider-agnostic.** Same — code against `IPixelSpriteProvider`.
3. **No Phaser, no WebView.** Turn-based combat is plain RN state + animations.
4. **Celebration without punishment.** No streak-breaks, no guilt copy. Rest days respected.

## Commands

```bash
npm start            # Expo dev server
npm run ios          # iOS simulator
npm run android      # Android emulator
npm test             # Jest
npm run type-check   # tsc --noEmit
npm run lint         # eslint src
```

## What's REWORK-V4

Files migrated from V3 with a `// REWORK-V4:` banner are functional placeholders. They need restyling and re-wiring after the design brainstorm + backend/provider decisions land. Do not assume they reflect V4 intent.


## Active MVP planning — September 7, 2026

Read `docs/2026-UPDATE/16BitFit-MVP-Agreed-Scope.md` before treating earlier overview or archived V3 content as requirements. The first pilot is iPhone-only for regular gym-goers who enjoy Pokémon-style games. Automatic recorded-workout capture, freely replayable battles, workout-earned strength, local game saves, and no player sign-up are agreed. Presets lead; optional personalization follows core-loop return-use evidence. Exact integration, reward rules, visual choices, provider choice, and distribution remain decisions to make, not completed features.

The current-code baseline is `docs/audits/2026-09-07-existing-app-audit.md`. The fresh-session Wayfinder entry is `docs/2026-UPDATE/16BitFit-MVP-Wayfinder-Kickoff.md`. The audit recommends selective reuse inside this repo; preserve existing user changes and artwork. Planning does not authorize an app rewrite or a purge of old files.

## Agent skills

### Issue tracker

GitHub Issues in `seanwinslow28/16BitFit-App` is canonical; see `docs/agents/issue-tracker.md`, including Wayfinding operations. Continue the existing [private iPhone MVP map](https://github.com/seanwinslow28/16BitFit-App/issues/1). The former `.scratch/16bitfit-mvp/` files are local migration snapshots, not an active tracker. Sean explicitly authorized publishing project files and migrating the decision tickets to this private repository.

### Triage labels

Use the default five role labels recorded in `docs/agents/triage-labels.md`. Triage labels are separate from Wayfinder type and claim state.

### Domain docs

Single-context layout; see `docs/agents/domain.md`. Create domain terms and ADRs lazily as decisions are actually resolved; do not manufacture a completed domain model at kickoff.
