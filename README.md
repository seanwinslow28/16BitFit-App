# 16BitFit

An iPhone fitness game where recorded workouts grow a character's strength for retro turn-based battles.

**Status: MVP planning.** The Expo/React Native/TypeScript foundation builds to a placeholder screen. Automatic workout capture, game progression, battles, and saved player progress are not implemented yet. Preserved V3 screens and assets are references, not a working game loop.

## Planning and tracking

- [Canonical Wayfinder map](https://github.com/seanwinslow28/16BitFit-App/issues/1)
- [Decision tickets](https://github.com/seanwinslow28/16BitFit-App/issues?q=is%3Aissue)
- [Agreed MVP scope](docs/2026-UPDATE/16BitFit-MVP-Agreed-Scope.md)
- [Resume Wayfinder planning](docs/2026-UPDATE/16BitFit-MVP-Wayfinder-Kickoff.md)
- [Existing-app audit](docs/audits/2026-09-07-existing-app-audit.md)
- [Automatic workout capture research](docs/research/16bitfit-workout-capture.md)
- [Private iPhone distribution research](docs/research/16bitfit-iphone-distribution.md)

The first pilot is iPhone only, with automatic recorded-workout rewards, one freely replayable boss, static preset avatars, and local saves without player sign-up. Begin with two observed testers, then roughly 5–8 people for two weeks after addressing the main problems. Optional image personalization waits for a working core loop and evidence of return use.

## Local development

The audit used Node.js 22.22.2. Install dependencies from the lockfile and start the existing scaffold:

```sh
npm ci
npm start
```

These commands run the current project; they do not establish native HealthKit support. That integration will require an agreed native build and physical-device verification.

```sh
npm run type-check
npm test -- --runInBand
```

The dated audit passed type checking, 210 tests, and iOS bundle export. It also found 23 skipped tests, an unconfigured lint command, package compatibility issues, missing fonts, and no native iPhone verification. Those findings remain unresolved; publishing this repository does not fix them.

## Contributing

Read [AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md), and the [GitHub tracker conventions](docs/agents/issue-tracker.md). Product decisions live in GitHub issues; later build tickets belong to a separate implementation effort. Artwork and archived V3 material are preserved, and reference images are not automatically approved shipping assets.

Keep credentials and personal workout/photo records out of Git. Local `.scratch/` files are ignored; the former Markdown tracker is retained locally only as a migration snapshot.
