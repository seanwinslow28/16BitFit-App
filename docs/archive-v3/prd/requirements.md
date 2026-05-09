# Requirements

**Version:** 2.0 (Party Mode Aligned)
**Last Updated:** 2026-01-02

---

## Party Mode Alignment (2025-12-29)

This requirements document has been updated to reflect Party Mode design decisions:

1. **Champion Selection in Battle Mode** - FR5 updated: 6 Champions selectable in Battle Mode (not onboarding)
2. **Cosmetic-Only Champions** - All champions share identical stats (Mario Party model)
3. **No-Defeat Philosophy** - FR12 updated: Only positive/neutral feedback (never negative)
4. **Terminology** - "Champion" (not Fighter/Combat Character), "Training Cartridge" (not Quest Cartridge), "Momentum" (not Streak)

---

## Functional

1.  **FR1:** User shall be able to create a basic profile (optionally deferred auth).  
2.  **FR2:** User shall be able to select one of five Fitness Archetypes (Trainer, Runner, Yoga, Bodybuilder, Cyclist) for their Home Avatar.  
3.  **FR3:** User shall be able to upload a headshot photo.  
4.  **FR4:** The system shall integrate the user's uploaded face onto the selected Stage 1 Fitness Archetype body using AI to create a personalized Home Avatar.  
5.  **FR5:** User shall be able to select from 6 Champions (Sean, Mary, Marcus, Aria, Kenji, Zara) in Battle Mode. Champions are cosmetic-only with identical stats—user's fitness activity powers ALL champions equally. *(Note: Champion selection is part of Battle Mode flow, not a standalone onboarding step.)*  
6.  **FR6:** The application shall connect to Apple HealthKit (iOS) or Google Fit (via Health Connect API on Android) to request permission and sync step count data.  
7.  **FR7:** The system shall convert synced step counts into an in-game "Energy Bar" resource for use in combat.  
8.  **FR8:** User shall be able to manually log a basic workout type (e.g., Strength, Cardio, Flexibility).  
9.  **FR9:** Synced/logged fitness activity (steps, workouts) shall contribute to the Home Avatar's evolution progress.  
10. **FR10:** The Home Avatar shall visually evolve from Stage 1 to Stage 2 based on accumulated fitness activity progress.  
11. **FR11:** User shall have the option to upload a new headshot photo when their Home Avatar reaches Stage 2.  
12. **FR12:** The Home Avatar shall display basic reactive animations based on recent activity: **positive feedback** (celebration) for active days and **neutral/resting feedback** (peaceful idle) for rest days. *(No-Defeat Philosophy: No negative, sad, or guilt-inducing animations shall be implemented.)*  
13. **FR13:** Fitness activity progress (linked to Home Avatar evolution stage) shall increase all Champions' base stats (e.g., HP, damage). *(Note: All Champions share identical stats—fitness powers the user, not individual characters.)*  
14. **FR14:** User shall be able to initiate a battle against the "Training Dummy" AI opponent.  
15. **FR15:** The selected Champion shall be controllable in combat with basic moves: Light/Medium/Heavy Punch, Light/Medium/Heavy Kick, Walk (Forward/Backward), Jump (Vertical/Forward/Backward), Block (Standing/Crouching).  
16. **FR16:** The combat interface shall display Health Bars for both characters, a round timer, and the user's Energy Meter (fueled by steps).  
17. **FR17:** The Home Screen (within the virtual LCD area) shall display: the user's personalized Home Avatar (top-center), **Dual Progress Rings** (Fitness/Skill) below the avatar, a **Momentum Bar** below the rings, a large **"Training Cartridge" button** below the rings (primary workout entry), and a **bottom Tab Bar** for primary navigation (Home, Battle, Profile, Settings). Key current fitness stats (Steps, Calories, Workout Duration) shall be displayed **on the shell area** below the virtual screen. User stats (powered by fitness) are accessible via the Profile tab.  
18. **FR18:** The Home Screen shall provide an entry point to start a battle (via Battle Tab).  
19. **FR19:** The application shall include a basic first-time user experience (FTUE) guiding profile/archetype selection and a tutorial battle against the Training Dummy. *(Note: Champion selection is NOT part of FTUE—it occurs in Battle Mode after onboarding.)*
20. **FR20:** The system shall implement a **graceful momentum decay** system rather than binary streak breaks. A 100-day momentum shall NOT reset to zero from one missed day—instead decay by a defined percentage (e.g., 5% per missed day).
21. **FR21:** The system shall support explicit **Rest Day logging** that maintains momentum without decay.
22. **FR22:** All reactive feedback (avatar animations, notifications, UI messaging) shall follow a **"celebration only" pattern**—positive reinforcement for activity without negative feedback for inactivity.

## Non Functional

1.  **NFR1:** Combat gameplay within the Phaser WebView must achieve an average of 60 frames per second (fps) with 90% consistency on target devices (iPhone 12+, Android 10+ equivalent).  
2.  **NFR2:** Input latency during combat (time from button press to character action) must be less than 50 milliseconds (<50ms).  
3.  **NFR3:** Peak memory usage during combat sessions shall not exceed 150MB.  
4.  **NFR4:** The application load time from launch to a playable state (Home Screen visible) shall be less than 3 seconds (<3s) on target devices.  
5.  **NFR5:** The application crash rate shall be less than 0.1% (<0.1%) across all active users.  
6.  **NFR6:** The React Native shell UI shall implement a **"Modern Retro Fusion"** aesthetic, simulating the physical form factor of a classic Game Boy (using the **Hardware Shell color palette** defined in `front-end-spec.md`) while displaying content within a virtual LCD area styled using the strict 4-color **DMG Screen palette**. UI components should follow custom pixel-art designs inspired by retro kits but built with modern practices (NativeWind/StyleSheet, potentially Skia/Reanimated 4), ensuring clarity and usability. Refer to `16BitFit-Prototype-2.png` and Figma/MagicPath designs (TBD) as primary visual guides.  
7.  **NFR7:** The combat UI (Health bars, timer, energy meter) shall emulate the style of Street Fighter 2.  
8.  **NFR8:** AI Home Avatar generation (face integration) should complete within a reasonable timeframe (target < 15 seconds) and produce a visually recognizable result consistent with the selected archetype body.  
9.  **NFR9:** Fitness data synchronization (steps) shall occur reliably in the background (when permissions allow) or upon app foregrounding, without excessive battery drain.  
10. **NFR10:** User-uploaded photos for avatar generation must be handled securely and comply with platform privacy policies (Apple/Google) and relevant regulations (e.g., GDPR). Health data access must strictly adhere to HealthKit/Health Connect guidelines.  
11. **NFR11:** The onboarding/FTUE process, including the tutorial battle, must be completable within 60-90 seconds (initial setup) / ~3-5 minutes (full flow including workout/battle) by 80% of new users.  
12. **NFR12:** The application must function correctly on target platforms: iOS (iPhone 12+) and Android (API Level 29+/Android 10+).  
13. **NFR13:** UI shell animations and transitions (React Native layer) must target 60fps and feel responsive (<100ms interaction feedback time), utilizing Reanimated 4 or similar performant libraries.

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-23 | 1.0 | Initial requirements | John (PM) |
| 2026-01-02 | 2.0 | **Party Mode Alignment:** FR5 updated (6 Champions in Battle Mode, cosmetic-only). FR12 updated (positive/neutral feedback only, no-defeat philosophy). FR13 updated (fitness powers all champions equally). FR15 updated (Champion terminology). FR17 updated (Training Cartridge, Momentum Bar). FR19 updated (no character selection in FTUE). Added FR20 (graceful momentum decay), FR21 (rest day support), FR22 (celebration-only feedback). | John (PM) |
