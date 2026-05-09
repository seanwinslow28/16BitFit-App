# User Interface Design Goals

**Version:** 1.1 (Party Mode Aligned)
**Last Updated:** 2026-01-02

**(Note: This section provides a high-level summary. Refer to `docs/front-end-spec.md` for complete UI/UX details, including specific palettes, components, flows, and interaction patterns.)**

---

## Overall UX Vision

To create an intuitive, engaging, and nostalgically authentic **"Modern Retro Fusion"** UI, blending Game Boy hardware aesthetics (shell) with a DMG-palette virtual screen, guided by modern UX principles like clarity and simplicity. The focus is on clear feedback for the dual progression (fitness/skill) and reinforcing the core SBFG loop.

## Key Interaction Paradigms

* **Retro Simulation:** Main shell app simulates Game Boy hardware interaction with modern touch input.  
* **Bottom Tab Bar Navigation:** Primary navigation within the virtual screen.  
* **Transition Architecture:**
  - **Cartridge Load Animation:** Thematic transition when entering workouts (post-onboarding only).
  - **Battle Mode Transition Video:** Cinematic portrait→landscape transition when entering/exiting Phaser WebView combat.
  - **Simple Fade:** Used for FTUE simulated workout (minimal friction).
* **Purposeful Juice:** Use of micro-animations, haptics, and sound to enhance feedback.

### Party Mode Transitions (2025-12-29)

| Context | Transition Type | Notes |
|---------|-----------------|-------|
| Home → Workout | Cartridge Load Animation | Post-onboarding only |
| Home → Battle Mode | Battle Mode Transition Video | Portrait → Landscape |
| Battle → Home | Battle Mode Transition Video (exit) | Landscape → Portrait |
| FTUE Simulated Workout | Simple Fade | Minimal friction for new users |
| Evolution Ceremony | Overlay on Home Dashboard | Pokemon-style blink animation |

## Core Screens and Views (MVP)

Refer to `front-end-spec.md` for the detailed Site Map and User Flows. Key MVP screens include:
- **Onboarding:** Welcome, Archetype Selection, Tutorial Training Assignment
- **Home Dashboard:** Avatar, Progress Rings, Momentum Bar, Training Cartridge
- **Workout Tracker:** Active workout display, completion celebration
- **Battle Mode (WebView):** Champion Selection (SF2 grid), Combat HUD, Victory/Continue Training
- **Profile/Avatar:** Stats, Evolution Progress, Avatar Generation
- **Settings:** Preferences, Rest Day logging, Account management

### Party Mode Screen Updates

- **Champion Selection:** Moved from onboarding to Battle Mode (landscape, Phaser WebView)
- **Victory Ceremony:** DEPRECATED—results reflected in Home Dashboard avatar pose
- **Evolution Ceremony:** Now triggers as overlay on Home Dashboard

## Accessibility

Target WCAG AA compliance where feasible, with specific considerations outlined in `front-end-spec.md`.

## Branding

Strict adherence to the **Dual Palette System** (Hardware Shell vs. DMG Screen) and use of specified **Pixel Fonts** ("Press Start 2P", potentially "Inter"/"Montserrat") as defined in `front-end-spec.md`.

## Target Device and Platforms

Mobile Portrait (Shell), Mobile Landscape (Battle Screen) on iOS (12+) / Android (10+).

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-23 | 1.0 | Initial UI design goals | John (PM) |
| 2026-01-02 | 1.1 | **Party Mode Alignment:** Added Transition Architecture section clarifying Cartridge Load vs Battle Mode Transition Video usage. Added Party Mode Transitions table. Updated Core Screens section with Party Mode screen updates (Champion Selection in Battle Mode, Victory Ceremony deprecated, Evolution as overlay). | John (PM) |
