# 16BitFit-V3 Product Requirements Document (PRD)

## Goals and Background Context

### Goals

* Achieve **8,000 downloads** within the first month post-launch.
* Establish an initial daily revenue stream of **$30/day** within the first month post-launch.
* Validate the **SBFG category concept** by achieving a **Day-30 retention rate of 25%**. *(Note: Industry average is 8-12%. Our "Celebration Without Punishment" approach directly addresses the 61% user anxiety rate and 27% mental-health-driven churn identified in competitive apps. By eliminating streak-break mechanics and guilt-based feedback, we target 2-3x industry retention.)*
* Secure an average **4.5+ star rating** on app stores within 3 months post-launch.
* Successfully demonstrate the core SBFG loop: Fitness Activity -> Data Sync -> Avatar Evolution + Stat Increase -> Skill-Based Combat -> Feedback.
* Meet technical performance targets: **60fps combat** (90% consistency), **<50ms input latency**, **<150MB peak memory**.
* Implement a **"Celebration Without Punishment"** design philosophy—no streak-break mechanics, guilt-based messaging, or psychological harm patterns. Target zero anxiety-inducing mechanics (informed by 61% user anxiety rate from missed tracking days in competitive apps).

### Background Context

16BitFit-V3 pioneers the **SBFG (Strength-Based Fighting Game)** category, addressing a gap where existing fitness apps lack deep, skill-based engagement and mobile fighting games lack real-world health integration. It targets the "Skill-Focused Fitness Gamer" by transforming validated fitness data (steps, workouts via HealthKit/Health Connect) into core power mechanics for an authentic, retro (Street Fighter 2 inspired) mobile fighting game. The core problem is the high churn in fitness apps (>70% in 3 months) due to superficial gamification and the sedentary nature of engaging mobile games.

16BitFit-V3 proposes a unique solution: a hybrid React Native (shell) + Phaser 3 (WebView combat engine) architecture using the high-performance "Hybrid Velocity Bridge". Key differentiators include the dual progression system (fitness-driven visual avatar evolution + skill-based combat rank), authentic 60fps fighting mechanics powered by real fitness, AI-driven personalization (avatar face integration), and a distinct retro aesthetic. The MVP focuses on establishing this core loop with 2 playable characters vs. 1 AI boss, basic fitness sync, and avatar evolution (Stages 1-2).

16BitFit V3 explicitly rejects the **PBL (Points, Badges, Leaderboards) pattern** that research shows violates Self-Determination Theory by undermining autonomy, competence, and relatedness. Instead, fitness data directly powers gameplay mechanics—steps become energy, workouts build stats—creating **meaningful integration** where players feel "an actual game that requires fitness to progress" rather than "a fitness tracker wearing a Halloween costume of a game."

### Change Log

| Date       | Version | Description                                | Author    |
| :--------- | :------ | :----------------------------------------- | :-------- |
| 2025-10-23 | 0.1     | Initial PRD draft started                  | John (PM) |
| 2025-10-23 | 0.2     | Updated FR/NFR based on UI Prototypes      | John (PM) |
| 2025-10-23 | 0.3     | Aligned PRD with front-end-spec.md details | John (PM) |
| 2025-12-03 | 0.4     | Strategic Synthesis integration: Added "Celebration Without Punishment" goal, anti-PBL positioning, FR20-22 (momentum decay, rest days, celebration-only feedback), strengthened NFR1-2 with FGC existential framing, added NFR14 (performance-first dev), fixed NFR11 (60-second aha moment), removed punishment mechanics from Story 2.5, added Monetization Strategy section | John (PM) |
| 2025-12-29 | 0.5     | Party Mode session updates: (1) Champions as cosmetic skins—Mario Party model, no stat differences; (2) No-defeat philosophy—`continue_training` outcome instead of "loss"; (3) Quest→Training/Workout terminology; (4) Victory Ceremony deprecated—merged into transition video + Home reaction; (5) Evolution Ceremony—Pokemon-style blinking animation; (6) Champion Select—SF2-style grid in Phaser Battle Mode; (7) Cartridge animation—workout selection only, not onboarding | John (PM) |
| 2025-12-31 | 0.6     | **Story 1.5 complete rewrite:** Updated to "Smooth-to-Pixel" architecture per Gemini 3 Deep Think analysis. Replaced DALL-E 3 face integration with Runware-based pipeline (DreamShaper XL Lightning + ControlNet + IP-Adapter). Added CLAHE contrast normalization, Bayer dithering, async webhook architecture, "Boot Sequence" UX, and "Draft Pick" dual variant selection. References implementation spec. | John (PM) |
| 2026-01-02 | 0.7     | **Cross-document alignment:** Updated Story 1.6 to remove Combat Character selection (moved to Battle Mode); updated Story 1.8 to reference 6 Champions and add SF2 grid selection as AC; aligned terminology with Party Mode decisions. | BMad Master |
| 2026-01-05 | 0.8     | **FTUE Video Update (Party Mode):** Added FR28-30 for video assets (FTUE Workout Video, Video Pipeline, Unified Audio). Updated Story 1.10 with passive video approach (~8-12s pixel animation, NOT interactive tracker). Videos created via Nano Banana Pro + Veo 3.1. FTUE video bundled in app; transition videos on CDN. Reference: video-asset-specifications.md | Paige (Tech Writer) |

---

## Requirements

### Functional

1.  **FR1:** User shall be able to create a basic profile (optionally deferred auth).  
2.  **FR2:** User shall be able to select one of five Fitness Archetypes (Trainer, Runner, Yoga, Bodybuilder, Cyclist) for their Home Avatar.  
3.  **FR3:** User shall be able to upload a headshot photo.  
4.  **FR4:** The system shall integrate the user's uploaded face onto the selected Stage 1 Fitness Archetype body using AI to create a personalized Home Avatar.  
5.  **FR5:** User shall be able to choose their **Champion** from a roster of diverse characters (MVP: 6 champions: Sean, Mary, Marcus, Aria, Kenji, Zara) via an SF2-style 2×3 grid selection screen within Phaser Battle Mode. **Champions are purely cosmetic**—like Mario Party characters, they provide identity/representation without gameplay stat differences. The user's real-world fitness powers ALL champions equally. Champion selection occurs after the Phaser WebView loads, not during vertical onboarding.  
6.  **FR6:** The application shall connect to Apple HealthKit (iOS) or Google Fit (via Health Connect API on Android) to request permission and sync step count data.  
7.  **FR7:** The system shall convert synced step counts into an in-game "Energy Bar" resource for use in combat.  
8.  **FR8:** User shall be able to manually log a basic workout type (e.g., Strength, Cardio, Flexibility).  
9.  **FR9:** Synced/logged fitness activity (steps, workouts) shall contribute to the Home Avatar's evolution progress.  
10. **FR10:** The Home Avatar shall visually evolve from Stage 1 to Stage 2 based on accumulated fitness activity progress.  
11. **FR11:** User shall have the option to upload a new headshot photo when their Home Avatar reaches Stage 2.  
12. **FR12:** The Home Avatar shall display basic reactive animations (positive/negative feedback) based on recent activity/inactivity.  
13. **FR13:** Fitness activity progress (linked to Home Avatar evolution stage) shall increase the selected Combat Character's stats (e.g., HP, damage).  
14. **FR14:** User shall be able to initiate a battle against the "Training Dummy" AI opponent.  
15. **FR15:** The selected Combat Character ("Sean" or "Mary") shall be controllable in combat with basic moves: Light/Medium/Heavy Punch, Light/Medium/Heavy Kick, Walk (Forward/Backward), Jump (Vertical/Forward/Backward), Block (Standing/Crouching).  
16. **FR16:** The combat interface shall display Health Bars for both characters, a round timer, and the user's Energy Meter (fueled by steps).  
17. **FR17:** The Home Screen (within the virtual LCD area) shall display: the user's personalized Home Avatar (top-center), **Dual Progress Rings** (Fitness/Skill) below the avatar, a **Momentum/Streak Bar** below the rings, a large **"Training" button** below the rings (primary workout entry), and a **bottom Tab Bar** for primary navigation (Home, Battle, Profile, Settings). Key current fitness stats (Steps, Calories, Workout Duration) shall be displayed **on the shell area** below the virtual screen. Champion stats should be accessible via the Profile tab. **Post-battle states:** Avatar displays victory pose (after win) or determined pose (after `continue_training` outcome) with animated stat updates.  
18. **FR18:** The Home Screen shall provide an entry point to start a battle (via Battle Tab).  
19. **FR19:** The application shall include a "Hook-First" first-time user experience (FTUE) that prioritizes immersion: guiding archetype/character selection, a simulated tutorial workout, and a tutorial battle against the Training Dummy. Profile creation, AI avatar generation, and Health permissions shall be deferred using progressive disclosure after the core loop is complete.
20. **FR20:** The system shall implement a **graceful momentum decay** system rather than binary streak breaks—a 100-day streak shall not reset to zero from one missed day but instead decay by a defined percentage with recovery mechanics.
21. **FR21:** The system shall support explicit **Rest Day logging** that maintains momentum, recognizes recovery as part of fitness, and potentially grants recovery bonuses—no punishment for planned rest, illness, or injury.
22. **FR22:** All reactive feedback (avatar animations, notifications, UI messaging) shall follow a **"celebration only" pattern**—positive reinforcement for activity without negative feedback, guilt messaging, or shame mechanics for inactivity.
23. **FR23:** Battle outcomes shall be either **Victory** (stats gained, celebration) or **Continue Training** (stats unchanged, encouragement). There is **no defeat/loss state that removes stats or punishes the user**. Users who don't win are encouraged to train more and try again.
24. **FR24:** The **Battle Mode Main Menu** (Phaser, landscape) shall display: Start Battle, Choose Your Champion, Settings, and Back to Home. First-time users must select a Champion before their first battle.
25. **FR25:** **Evolution Ceremony** shall trigger when XP threshold is reached, displaying a Pokemon Red/Blue-style animation: "Your avatar is evolving!" overlay → blinking/morphing sprite sequence (old↔new, accelerating) → "EVOLUTION COMPLETE!" → results screen with stat bonuses.
26. **FR26:** **Cartridge Load Animation** shall only occur for post-onboarding workout selection (not during FTUE). The animation shows a DMG-palette cartridge with dumbbell logo inserting into a Game Boy slot (~1 second).
27. **FR27:** **Battle Mode Transition Video** shall play when entering/exiting Battle Mode in both onboarding and post-onboarding flows. The video transitions from DMG 4-color portrait to full-color 2D fighting game landscape (and reverse for exit).
28. **FR28:** **FTUE Workout Video** shall be a passive video clip (~8-12 seconds) showing 8-bit/16-bit pixel animations of archetypes doing workouts. This is NOT an interactive workout tracker. The video demonstrates the workout→battle energy concept. Skip button appears after 2 seconds. Reduce Motion users see skip immediately. Video is bundled in app for instant playback.
29. **FR29:** **Video Assets Pipeline** shall support 4 video assets: (1) FTUE Workout Video (bundled), (2) Battle Entry Transition (CDN), (3) Battle Exit Transition (CDN), (4) Evolution Ceremony sequence (CDN). All FTUE-critical videos bundled; non-critical videos streamed from Supabase CDN.
30. **FR30:** **Unified Onboarding Audio** shall be a single chiptune track playing from Welcome Screen through Workout Complete Ceremony, stopping when entering Battle Mode. Battle Mode has its own separate audio track.

### Non Functional

1.  **NFR1:** Combat gameplay within the Phaser WebView **must achieve a floor of 60 frames per second** (fps) with 90% consistency on all supported devices (iPhone 12+, Android API 29+). **This is existential for FGC audience credibility—performance below 60fps disqualifies 16BitFit from the primary target segment.** The minimum-spec device (iPhone 12, representative Android API 29 device) must validate 60fps before feature development proceeds.
2.  **NFR2:** Input latency during combat (time from button press to character action) **must be less than 50 milliseconds (<50ms)**. FGC players consciously detect latency at 33-48ms thresholds; the Hybrid Velocity Bridge targets sub-10ms to provide safety margin. **Latency failures will generate public criticism from FGC communities—this is non-negotiable.**  
3.  **NFR3:** Peak memory usage during combat sessions shall not exceed 150MB.  
4.  **NFR4:** The application load time from launch to a playable state (Home Screen visible) shall be less than 3 seconds (<3s) on target devices.  
5.  **NFR5:** The application crash rate shall be less than 0.1% (<0.1%) across all active users.  
6.  **NFR6:** The React Native shell UI shall implement a **"Modern Retro Fusion"** aesthetic, simulating the physical form factor of a classic Game Boy (using the **Hardware Shell color palette** defined in \`front-end-spec.md\`) while displaying content within a virtual LCD area styled using the strict 4-color **DMG Screen palette**. UI components should follow custom pixel-art designs inspired by retro kits but built with modern practices (NativeWind/StyleSheet, potentially Skia/Reanimated 4), ensuring clarity and usability. Refer to \`16BitFit-Prototype-2.png\` and Figma/MagicPath designs (TBD) as primary visual guides.  
7.  **NFR7:** The combat UI (Health bars, timer, energy meter) shall emulate the style of Street Fighter 2.  
8.  **NFR8:** AI Home Avatar generation ("Smooth-to-Pixel" pipeline) should complete within a reasonable timeframe (target < 15 seconds) and produce a visually recognizable 128×128 pixel DMG-compliant result with guaranteed 4-color palette.  
9.  **NFR9:** Fitness data synchronization (steps) shall occur reliably in the background (when permissions allow) or upon app foregrounding, without excessive battery drain.  
10. **NFR10:** User-uploaded photos for avatar generation must be handled securely and comply with platform privacy policies (Apple/Google) and relevant regulations (e.g., GDPR). Health data access must strictly adhere to HealthKit/Health Connect guidelines.  
11. **NFR11:** The core FTUE must deliver a **"60-second aha moment"**—new users must experience the core SBFG loop (fitness → combat power) within 60 seconds of first launch. The full onboarding flow (through tutorial battle completion) must be completable within 90-120 seconds by 80% of new users, with deferred auth/permissions/AI avatar generation occurring AFTER the hook is delivered.  
12. **NFR12:** The application must function correctly on target platforms: iOS (iPhone 12+) and Android (API Level 29+/Android 10+).  
13. **NFR13:** UI shell animations and transitions (React Native layer) must target 60fps and feel responsive (<100ms interaction feedback time), utilizing Reanimated 4 or similar performant libraries.
14. **NFR14:** **Performance-first development is mandatory.** The combat engine and Hybrid Velocity Bridge must validate 60fps on target devices BEFORE investing in content, AI features, or progression systems. Performance regression tests must block deployment if frames drop below threshold.

---

## User Interface Design Goals

**(Note: This section provides a high-level summary. Refer to \`docs/front-end-spec.md\` for complete UI/UX details, including specific palettes, components, flows, and interaction patterns.)**

### Overall UX Vision

To create an intuitive, engaging, and nostalgically authentic **"Modern Retro Fusion"** UI, blending Game Boy hardware aesthetics (shell) with a DMG-palette virtual screen, guided by modern UX principles like clarity and simplicity. The focus is on clear feedback for the dual progression (fitness/skill) and reinforcing the core SBFG loop.

### Key Interaction Paradigms

* **Retro Simulation:** Main shell app simulates Game Boy hardware interaction with modern touch input.  
* **Bottom Tab Bar Navigation:** Primary navigation within the virtual screen.  
* **"Cartridge Load" Transition:** Thematic transition animation when entering/exiting the Phaser WebView battle screen.  
* **Purposeful Juice:** Use of micro-animations, haptics, and sound to enhance feedback.

### Core Screens and Views (MVP)

Refer to \`front-end-spec.md\` for the detailed Site Map and User Flows. Key MVP screens include Onboarding, Home Dashboard, Workout Tracker, Battle Screen (WebView), Profile/Avatar, and basic Settings.

### Accessibility

Target WCAG AA compliance where feasible, with specific considerations outlined in \`front-end-spec.md\`.

### Branding

Strict adherence to the **Dual Palette System** (Hardware Shell vs. DMG Screen) and use of specified **Pixel Fonts** ("Press Start 2P", potentially "Inter"/"Montserrat") as defined in \`front-end-spec.md\`.

### Target Device and Platforms

Mobile Portrait (Shell), Mobile Landscape (Battle Screen) on iOS (12+) / Android (10+).

---

## Technical Assumptions

* **Repository Structure:** Monorepo likely favored based on V2 experience, potentially using Nx or Turborepo (Decision to be finalized by Architect).  
* **Service Architecture:** Hybrid - React Native shell + Phaser 3 WebView + Supabase BaaS. Potential for serverless functions (Supabase Edge Functions) for specific backend logic.  
* **Frontend (Shell):** React Native (latest stable version compatible with dependencies, e.g., 0.71.8+). Styling via NativeWind/StyleSheet. Will utilize **Reanimated 4** for animations and potentially **react-native-skia** for custom pixel rendering/effects. Requires specific pixel fonts ("Press Start 2P", etc.).  
* **Game Engine (WebView):** Phaser 3 (latest stable compatible version, e.g., 3.70.0+) running within a dedicated WebView.  
* **Backend:** Supabase (PostgreSQL + Real-time + Edge Functions).  
* **Asset Generation (AI):** Runware API (DreamShaper XL Lightning + ControlNet + IP-Adapter) for Home Avatar generation with server-side CLAHE + Bayer dithering; Gemini API (Image Gen/Edit) + potentially Veo/Midjourney keyframes for Combat/Boss sprites.  
* **Platform Targets:** iOS (iPhone 12+) and Android (10+).  
* **Core Integration:** High-performance "Hybrid Velocity Bridge" (binary protocol, <50ms latency target) between React Native and Phaser WebView is a critical requirement and assumed feasible based on V2.  
* **Fitness Data Integration:** Apple HealthKit and Google Fit (via Health Connect API) are the required sources for fitness data.  
* **Testing Requirements:** Standard mobile app testing practices. Specific focus on performance testing (FPS, latency, memory) for combat and integration testing for the RN-WebView bridge and fitness data sync. Automated testing frameworks appropriate for React Native (using specified testing libraries) and potentially Phaser to be determined by Architect.

---

## Monetization Strategy (MVP)

### Philosophy

16BitFit adopts a **"deferred monetization"** approach informed by research showing subscription fatigue driving user resentment (MyFitnessPal $80/year backlash, Strava API controversies). The SBFG category is new and requires market education—asking for recurring payment before users understand the value proposition increases friction and churn.

### MVP Monetization Model

**Launch with cosmetic-only IAPs ($1-5 items):**
- Alternate avatar skins/poses
- Combat character color palettes
- Visual effects/victory animations
- Sound effect packs

**Explicitly Avoided in MVP:**
- Subscription paywalls
- Pay-to-win stat boosts
- Premium character unlocks
- Energy/stamina purchase systems

### Post-MVP Monetization Path

After demonstrating retention improvement over competitors (target: 25%+ Day-30 retention vs. industry 8-12%):
1. Introduce optional subscription tier ($10-15/month) for advanced features (PvP matchmaking, expanded progression, cloud sync)
2. Consider **lifetime purchase option** based on Lose It! success model
3. Maintain free tier with full core gameplay—subscription enhances, never gates

### Anti-P2W Commitment

**P2W mechanics are categorically rejected.** FGC research indicates P2W is "categorically rejected" by the target audience. Combat advantage must only come from skill and fitness effort, never wallet.

---

## Epic List

1.  **Epic 1: Foundation & Core Loop Setup:** Establish the core application shell, basic fitness sync (HealthKit/Connect), AI avatar generation flow, character selection, home screen, and validate the fundamental 60fps combat loop against the Training Dummy.  
2.  **Epic 2: Fitness Progression Integration:** Implement the visual Home Avatar evolution (Stage 1 -> Stage 2), link fitness activity to Combat Character stat scaling, and add reactive feedback to the Home Avatar.

---

## Epic 1: Foundation & Core Loop Setup

**Epic Goal:** Establish the core application shell (React Native), integrate foundational backend services (Supabase), set up basic fitness data synchronization (HealthKit/Connect), implement the AI Home Avatar generation flow, allow Combat Character selection, display the basic Home Screen, and validate the core 60fps combat loop within the Phaser WebView against the Training Dummy AI opponent. This epic delivers the minimum testable SBFG experience.

**Integration Requirements:** Requires setting up connections to Supabase, platform-specific Health APIs (HealthKit/Connect), and the Runware AI API for avatar generation (with server-side CLAHE + Bayer dithering). Establishes the critical React Native <-> Phaser WebView bridge.

### Story 1.1: Project Initialization & Core Dependencies  
**As a** Developer,  
**I want** to initialize the React Native project structure (Monorepo setup TBD by Architect) and install core dependencies (React Native, Phaser, Supabase client, Navigation, Reanimated, Skia),  
**so that** the foundational codebase is established for subsequent features.

#### Acceptance Criteria  
1.  React Native project is initialized using the specified version (e.g., 0.71.8+).  
2.  Core dependencies (Phaser 3.70.0+, Supabase client, React Navigation, Reanimated 4, react-native-skia) are installed and configured.  
3.  Basic project structure (potentially within a Monorepo) is created following architectural guidance.  
4.  The application builds and runs successfully on both iOS simulator and Android emulator, displaying a placeholder screen.  
5.  Basic linting and formatting rules are configured.

### Story 1.2: Supabase Backend Setup & Basic Auth  
**As a** Developer,  
**I want** to configure the Supabase client, set up basic authentication (deferred auth option), and establish a basic user profile table,  
**so that** user data can be stored and managed securely.

#### Acceptance Criteria  
1.  Supabase client is initialized with project URL and anon key.  
2.  A basic \`profiles\` table is created in Supabase with necessary fields (user\_id, archetype, avatar\_url, evolution\_stage, etc.).  
3.  Basic email/password or social login (TBD) is configured, allowing users to sign up/in.  
4.  An option for deferred authentication (allowing initial use without login) is implemented.  
5.  User sessions are managed correctly.

### Story 1.3: HealthKit/Connect Integration & Step Sync  
**As a** Developer,  
**I want** to integrate platform-specific health APIs (Apple HealthKit, Google Fit via Health Connect) to request permissions and sync daily step count data,  
**so that** real-world fitness activity can be brought into the application.

#### Acceptance Criteria  
1.  Necessary libraries/modules for HealthKit (iOS) and Health Connect API (Android) are integrated.  
2.  The application correctly requests user permission to read step count data upon first relevant interaction.  
3.  Step count data for the current day is successfully fetched upon app launch/foregrounding (if permission granted).  
4.  Fetched step count is stored or updated in the user's profile/state.  
5.  Basic error handling is implemented for permission denial or sync failures.

### Story 1.4: Onboarding Flow - Profile & Archetype Selection  
**As a** New User,  
**I want** to be guided through creating a basic profile (optional login) and selecting my desired Fitness Archetype (Trainer, Runner, Yoga, Bodybuilder, Cyclist),  
**so that** I can begin personalizing my experience.

#### Acceptance Criteria  
1.  A multi-step onboarding UI flow is presented on first launch, following the retro aesthetic (NFR6).  
2.  User can create a profile (or choose to defer login).  
3.  User is presented with the five Fitness Archetype options.  
4.  User selection of an archetype is recorded and associated with their profile.  
5.  The onboarding flow transitions smoothly between steps.

### Story 1.5: Avatar Generation ("Smooth-to-Pixel" Architecture)
**As a** User (on Home Dashboard),
**I want** to upload a selfie and have the system generate my personalized DMG-style pixel art avatar,
**so that** I can see myself as a retro Game Boy character in the game.

#### Architecture Overview
This story implements the **"Smooth-to-Pixel" strategy**: AI generates cel-shaded vector art (NOT pixel art), and server-side CLAHE + Bayer dithering handles pixelation with guaranteed 4-color DMG compliance. Uses **Tri-Signal Pipeline** (ControlNet + IP-Adapter + Prompt) for likeness preservation. Async webhook architecture prevents mobile timeouts.

#### Acceptance Criteria
1.  **Trigger Point:** Avatar generation accessible from Home Screen (deferred, post-onboarding).
2.  **Photo Upload:** Camera/gallery access implemented; selfie uploaded to Supabase temp storage.
3.  **Preprocessing:** Runware Canny preprocessing returns edge map within 2 seconds for "Boot Sequence" UX.
4.  **Dual Variant Generation:** Two variants generated via async webhooks:
    - **Accuracy** (ControlNet: 0.50, IP-Adapter: 0.55) - Higher likeness
    - **Retro** (ControlNet: 0.45, IP-Adapter: 0.35) - More stylized
5.  **Post-Processing:** Server applies CLAHE contrast normalization + Bayer dithering.
6.  **DMG Compliance:** Final output is exactly 128x128 pixels with exactly 4 DMG colors.
7.  **Draft Pick Selection:** User presented with both variants; selection saved as `final_url`.
8.  **Performance:** Total generation within 15 seconds; preprocessing within 2 seconds.
9.  **Error Handling:** DSP fallback (Game Boy Camera style) if AI generation fails.

#### Technical Stack
- **Base Model:** DreamShaper XL Lightning (`civitai:112902@354657`)
- **ControlNet:** SDXL Canny (`runware:20@1`)
- **IP-Adapter:** FaceID Plus v2 (`civitai:208846@235313`)
- **Contrast Fix:** CLAHE (clipLimit: 2.0, gridSize: 8)
- **Dithering:** Bayer 4x4 (spread: 45)

See [avatar-generation-implementation-spec.md](architecture/avatar-generation-implementation-spec.md) for full details.

### Story 1.6: Home Screen Display  
**As a** User,  
**I want** to see my generated Home Avatar, progress rings, training button, tab bar, and fitness stats on the Home Screen,  
**so that** the main application hub is functional and personalized according to the UI spec.

> **Note (Party Mode 2025-12-29):** Champion selection has been moved to Phaser Battle Mode (Story 1.8+). During FTUE, a default champion is used. Users select their Champion via an SF2-style grid when first entering Battle Mode.

#### Acceptance Criteria  
1.  The Home Screen UI is implemented following the Game Boy aesthetic (NFR6), displaying content within the virtual LCD area using the DMG palette, and stats on the shell area using the Hardware palette.  
2.  The user's generated Home Avatar is displayed prominently (top-center) within the virtual screen.  
3.  **Dual Progress Rings** (Fitness/Skill) and a **Momentum Bar** (graceful decay, NOT binary streak) are displayed below the avatar.  
4.  The **"Training" button** is displayed below the rings as the primary workout entry point.  
5.  The **bottom Tab Bar** (Home, Battle, Profile, Settings) is displayed and functional (navigates to placeholder screens or actual screens).  
6.  Key fitness stats (Steps, Calories, Workout Duration) are displayed on the **shell area** below the virtual screen.  
7.  **Post-battle states:** Avatar displays victory pose (after victory) or determined pose (after `continue_training` outcome) with appropriate messaging.  
8.  Champion stats are accessible via the Profile tab (Champion selection itself occurs in Battle Mode).

### Story 1.7: WebView Bridge & Basic Combat Scene Setup  
**As a** Developer,  
**I want** to set up the React Native WebView component, implement the core "Hybrid Velocity Bridge" protocol, and load a basic Phaser 3 scene within the WebView,  
**so that** the foundation for high-performance communication and gameplay is established.

#### Acceptance Criteria  
1.  A dedicated WebView component is integrated into the React Native application.  
2.  The core binary message protocol for the Hybrid Velocity Bridge is implemented on both the React Native and Phaser sides.  
3.  Basic communication (e.g., sending a 'start game' event from RN to Phaser) is functional with low latency (<50ms target).  
4.  A basic Phaser 3 scene (e.g., PreloadScene, empty BattleScene) loads successfully within the WebView when navigating to the Battle screen. Navigation includes the "Cartridge Load" transition.  
5.  Performance baseline (FPS, memory) is established for the empty scene.

### Story 1.8: Implement Core Combat Mechanics & Training Dummy  
**As a** Player,  
**I want** my selected Champion to respond to basic combat inputs (6 attacks, movement, jump, block) within the Phaser scene, and face a simple Training Dummy AI,  
**so that** the fundamental fighting gameplay is functional.

> **Note (Party Mode 2025-12-29):** First-time users must select a Champion before their first battle via an SF2-style 2×3 grid in the Battle Mode Main Menu. Champions are purely cosmetic—all 6 share identical stats and movesets.

#### Acceptance Criteria  
1.  **Champion Selection Screen:** SF2-style 2×3 grid displayed on first Battle Mode entry. User selects from 6 Champions (Sean, Mary, Marcus, Aria, Kenji, Zara). Selection saved to `user_profiles.selected_champion`.  
2.  Selected Champion sprite/animations are loaded into the Phaser BattleScene.  
3.  Virtual controls (D-pad, 6 buttons) are implemented in the UI layer (React Native or Phaser overlay, matching retro style) and correctly send input commands via the bridge to Phaser.  
4.  The Champion executes the corresponding basic actions (LP, MP, HP, LK, MK, HK, Walk, Jump, Block) in Phaser based on bridge commands.  
5.  A non-attacking "Training Dummy" AI opponent is implemented in the BattleScene.  
6.  Basic physics (gravity, collision detection between characters) are functional.  
7.  Combat actions feel responsive (validating <50ms latency target).

### Story 1.9: Integrate Combat UI & Step-Energy Mechanic  
**As a** Player,  
**I want** to see Health Bars, a timer, and my Energy Meter (fueled by synced steps) in the combat UI, and have the Energy Meter deplete/recharge appropriately,  
**so that** core combat resources and status are visible and functional.

#### Acceptance Criteria  
1.  Combat UI elements (Health Bars, Timer, Energy Meter) are implemented in the Phaser scene following SF2 style (NFR7).  
2.  Initial Health values are set for both characters.  
3.  A round timer starts and counts down.  
4.  The user's current step count (synced in Story 1.3) is used to determine the initial/max value of the Energy Meter.  
5.  A basic mechanic for using/depleting energy (placeholder action) and potentially recharging it is implemented.  
6.  The UI elements update correctly during gameplay (placeholder for damage/energy use).

### Story 1.10: Basic FTUE & Tutorial Battle Integration
**As a** New User,
**I want** the onboarding flow (including FTUE workout video) to conclude with a brief tutorial battle against the Training Dummy, followed by landing on the Home Dashboard with victory pose,
**so that** I understand the core loop and controls.

#### Acceptance Criteria
1.  The onboarding flow transitions: Welcome → Archetype Selection → Tutorial Training Assignment → **FTUE Workout Video** → Workout Complete Ceremony → Battle Mode Transition Video → Tutorial Battle → Home Dashboard.
2.  **FTUE Workout Video** is a passive ~8-12 second pixel animation (NOT an interactive workout tracker). Video shows 8-bit characters doing workouts.
3.  Skip button appears after 2 seconds. Reduce Motion users see skip immediately.
4.  FTUE Workout Video is bundled in app for instant playback (no network dependency).
5.  The tutorial briefly explains basic movement and attack controls via tutorial overlays.
6.  The tutorial initiates the first battle against the Training Dummy via the Battle Mode Transition Video.
7.  Completion of the tutorial battle transitions the user back to the Home Dashboard with avatar victory pose (Victory Ceremony deprecated).
8.  The entire FTUE (including tutorial battle) aims to be completable within 90-120 seconds, with the initial setup (pre-workout) targeting <60 seconds (NFR11).
9.  **Audio:** Unified onboarding music track plays from Welcome through Workout Complete, stops when entering Battle Mode.

### Story 1.11: Achieve 60fps Performance Target  
**As a** Player,  
**I want** the combat gameplay against the Training Dummy to consistently run at 60fps on target devices,  
**so that** the fighting experience feels smooth and responsive.

#### Acceptance Criteria  
1.  Performance profiling is conducted during combat scenarios (Story 1.8, 1.9) on target devices (iPhone 12+, Android 10+ equivalent).  
2.  Optimizations (object pooling, texture atlasing, bridge communication frequency, etc.) are implemented as needed.  
3.  Combat achieves an average of 60fps with 90% consistency (NFR1).  
4.  Memory usage remains below 150MB peak (NFR3).  
5.  Input latency remains below 50ms (NFR2).

---

## Epic 2: Fitness Progression Integration

**Epic Goal:** Implement the visual evolution of the user's personalized Home Avatar from Stage 1 to Stage 2 based on accumulated fitness activity (steps, manual workouts). Link this fitness progression to tangible increases in the selected Combat Character's statistics (HP, damage). Display updated fitness and character stats on the Home Screen and add basic reactive animations to the Home Avatar.

**Integration Requirements:** Requires reading synced fitness data (steps) from user state/profile, accessing workout logs, updating user profile with evolution stage and character stats, and potentially calling the AI service again if the user opts for a new photo at Stage 2. Builds directly on the Home Screen and Combat Character systems established in Epic 1.

### Story 2.1: Implement Fitness-to-Evolution Progress Calculation  
**As a** Developer,  
**I want** to implement the logic that converts synced steps and manually logged workouts into a quantifiable "Evolution Progress" metric for the Home Avatar,  
**so that** fitness activity directly drives character progression.

#### Acceptance Criteria  
1.  A defined algorithm converts daily steps (from Story 1.3) into evolution progress points.  
2.  A defined algorithm converts manually logged workouts (from FR8) into evolution progress points (potentially weighted by type/duration).  
3.  Evolution progress points accumulate over time and are stored persistently (e.g., in Supabase profile).  
4.  A specific progress point threshold is defined for triggering the evolution from Stage 1 to Stage 2.  
5.  The calculation handles historical data correctly (e.g., progress accumulates even if the app isn't opened daily).

### Story 2.2: Implement Home Avatar Visual Evolution (Stage 1 to 2\)  
**As a** User,  
**I want** my personalized Home Avatar's appearance to automatically change from the Stage 1 body to the Stage 2 body when I reach the required fitness progress threshold, with an option to update my photo,  
**so that** I can visually see my fitness achievements reflected in my character.

#### Acceptance Criteria  
1.  When the user's Evolution Progress (from Story 2.1) crosses the Stage 2 threshold, the system flags the user for evolution.  
2.  Upon next app launch or relevant event, the user is presented with an option to evolve to Stage 2 (potentially via a celebratory 'Evolution Ceremony').  
3.  User is given the option to upload a new headshot photo for Stage 2 integration (FR11). If chosen, the AI generation process (from Story 1.5) is triggered using the Stage 2 archetype body image.  
4.  If the user declines a new photo or if generation fails, the existing face is merged with the Stage 2 archetype body image.  
5.  The user's profile is updated with the new Stage 2 avatar image URL and evolution stage status.  
6.  The Home Screen subsequently displays the new Stage 2 Home Avatar.

### Story 2.3: Implement Stat Scaling for Combat Characters  
**As a** Developer,  
**I want** to implement logic that increases the base stats (e.g., HP, base damage) of the selected Combat Character (Sean or Mary) based on the user's Home Avatar evolution stage (Stage 1 vs. Stage 2),  
**so that** fitness progression provides a tangible benefit in combat.

#### Acceptance Criteria  
1.  Base stats (HP, damage multipliers, etc.) are defined for Combat Characters at Stage 1.  
2.  Increased base stats or stat modifiers are defined for Combat Characters upon reaching Stage 2 evolution.  
3.  The system correctly calculates the Combat Character's current effective stats based on the user's current Home Avatar evolution stage.  
4.  These calculated stats are stored persistently or derived dynamically when needed for combat.  
5.  The stat scaling provides a noticeable but balanced advantage in combat (balancing TBD).

### Story 2.4: Update Home Screen with Live Stats  
**As a** User,  
**I want** the Home Screen shell area to display my actual current fitness stats (Steps, Calories - **if calculated**, Workout Duration - **if tracked**) and the Profile Tab to show my selected Combat Character's current, scaled stats,  
**so that** I have an up-to-date overview of my progress.

#### Acceptance Criteria  
1.  The Home Screen shell area correctly fetches and displays the user's current daily step count synced from HealthKit/Connect (Story 1.3).  
2.  The Home Screen shell area displays workout duration (based on manual logs from FR8 or potentially synced data if available).  
3.  **(Optional/Stretch for MVP - Requires Calculation Logic)** The Home Screen shell area displays an estimated calorie burn based on synced/logged activity.  
4.  The Profile Tab displays the selected Combat Character's stats (HP, etc.) reflecting the current scaling based on evolution stage (Story 2.3).  
5.  The displayed stats update appropriately when new fitness data is synced or when evolution occurs.

### Story 2.5: Implement Reactive Home Avatar Animations
**As a** User,
**I want** my Home Avatar on the Home Screen to show simple positive animations when I've been active recently and neutral/resting animations during rest periods,
**so that** I get immediate, ambient feedback celebrating my fitness achievements without guilt or shame for rest days.

#### Acceptance Criteria
1.  Criteria for "recently active" (e.g., met step goal yesterday, logged workout today) and "resting" (e.g., rest day logged, recovery period) are defined. **Inactivity is framed as "resting" rather than "failing."**
2.  Simple, distinct positive animation(s) (e.g., subtle smile, sparkle effect, energetic idle variation) are created for the Home Avatar.
3.  Simple, distinct **neutral/resting animation(s)** (e.g., idle blink, gentle breathing, peaceful stance) are created for the Home Avatar to display during rest periods. **No negative, sad, disappointed, or guilt-inducing animations shall be implemented.** The avatar never expresses disappointment in the user.
4.  The Home Screen logic checks the user's recent activity status against the defined criteria.
5.  The corresponding positive or neutral animation plays periodically or on app load based on the user's status.
6.  A neutral/default state animation (e.g., idle blink) exists and is the baseline—never a "disappointed" state.

---

## Checklist Results Report

### Executive Summary

* **Overall PRD Completeness:** ~98% (Excellent)
* **MVP Scope Appropriateness:** Just Right (Clearly defined based on brief)
* **Readiness for Architecture Phase:** Ready
* **Most Critical Gaps or Concerns:** Algorithm specifics (Evolution, Stat Scaling) to be defined during Architecture/Implementation. Architect validation needed for performance NFRs on minimum-spec devices.

*Updated 2025-12-03: Strategic Synthesis Report findings integrated. Ethical design principles, monetization strategy, and strengthened performance requirements now documented.*

### Category Analysis Table

| Category                         | Status    | Critical Issues                                      |
| :------------------------------- | :-------- | :--------------------------------------------------- |
| 1. Problem Definition & Context  | ✅ PASS   | None — Anti-PBL positioning now explicit             |
| 2. MVP Scope Definition          | ✅ PASS   | None (Well-defined based on brief)                   |
| 3. User Experience Requirements  | ✅ PASS   | Minor: Orientation TBD, accessibility considerations |
| 4. Functional Requirements       | ✅ PASS   | FR20-22 added for ethical design (momentum decay, rest days, celebration-only) |
| 5. Non-Functional Requirements   | ✅ PASS   | NFR1-2 strengthened with FGC existential framing; NFR14 added (performance-first dev); NFR11 updated with 60-second aha moment |
| 6. Epic & Story Structure        | ✅ PASS   | Story 2.5 updated — punishment mechanics removed     |
| 7. Technical Guidance            | ✅ PASS   | None (Assumptions clearly stated)                    |
| 8. Cross-Functional Requirements | ✅ PASS   | None (Data/Integration clear for MVP)                |
| 9. Clarity & Communication       | ✅ PASS   | None                                                 |
| 10. Monetization Strategy        | ✅ PASS   | NEW — Deferred monetization, cosmetic IAPs, anti-P2W |
| 11. Ethical Design               | ✅ PASS   | NEW — "Celebration Without Punishment" philosophy    |

### Top Issues by Priority

* **BLOCKERS:** None identified.
* **HIGH:**
  * **Performance Feasibility (NFR1-3, NFR14):** Architect needs to confirm 60fps/<50ms latency/<150MB memory is achievable on minimum-spec devices (iPhone 12, Android API 29). Performance-first development mandate (NFR14) requires validation before feature work.
  * **Screen Orientation (UI Goals):** Decision needed (Portrait Shell vs. Landscape Combat) before detailed Architecture.
* **MEDIUM:**
  * **Accessibility vs. Aesthetic (UI Goals):** Potential conflict between WCAG AA target and Game Boy aesthetic needs careful consideration by Architect.
  * **Algorithm Specifics (Story 2.1, 2.3):** Precise formulas for `Fitness-to-Evolution` and `Stat Scaling` are needed, likely defined during Architecture/Implementation.
* **LOW:**
  * **Calorie Calculation (Story 2.4):** Marked as optional/stretch; confirm if truly needed for MVP or defer.

### Issues Resolved by Strategic Synthesis Integration (v0.4)

| Original Issue | Resolution |
| :------------- | :--------- |
| Missing ethical design guidance | Added "Celebration Without Punishment" goal + FR20-22 |
| Punishment mechanics in Story 2.5 | Removed negative animations, reframed as "resting" |
| NFR11 target too long (90-120s) | Added "60-second aha moment" requirement |
| No monetization strategy | Added complete Monetization Strategy section |
| Performance NFRs lacked urgency | Strengthened NFR1-2 with "existential" FGC framing |
| No performance-first mandate | Added NFR14 requiring validation before feature dev |
| PBL rejection not explicit | Added anti-PBL paragraph to Background Context |

### MVP Scope Assessment

* The defined MVP scope (Epics 1 & 2) aligns perfectly with the Project Brief's requirements.
* No features seem extraneous; the focus is clearly on validating the core SBFG loop.
* No essential features appear missing for the stated MVP goals.
* Complexity is manageable; performance targets (NFR1-3, Story 1.11) remain the highest technical risk but are now mandated as first-priority validation.
* Ethical design requirements (FR20-22) add minimal implementation overhead while addressing 27% mental-health-driven churn.

### Technical Readiness

* Technical assumptions are clearly stated, providing a solid foundation for the Architect.
* Key technical risks (Bridge Performance, AI Generation) are acknowledged.
* The Architect has clear direction on the required stack (RN, Phaser, Supabase, Reanimated, Skia) and critical integrations (HealthKit/Connect, AI).
* Performance-first development (NFR14) provides clear sequencing guidance.
* Areas needing Architect definition (e.g., specific algorithms, Monorepo structure) are implicitly identified.

### Recommendations

1.  **Proceed to Architecture:** The PRD is comprehensive, validated, and ready.
2.  **Performance-First Validation:** Per NFR14, Architect must validate combat engine + Hybrid Velocity Bridge at 60fps on minimum-spec devices BEFORE feature development.
3.  **Orientation Decision:** Architect to finalize Combat Screen Orientation (Landscape recommended by UI Spec) and detail implementation.
4.  **Algorithm Definition:** Specific algorithms (Evolution, Stat Scaling, Momentum Decay) need definition during Architecture/Implementation.
5.  **Calorie Decision:** Confirm if calorie display (Story 2.4) is essential for MVP launch.

### Final Decision

* **READY FOR ARCHITECT**: The PRD is comprehensive, validated against the brief, market research, and Strategic Synthesis findings. It is logically structured, aligned with the UI/UX Spec, includes ethical design principles and monetization strategy, and is ready for the Architecture phase.  
