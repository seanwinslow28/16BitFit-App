# Epic 1: Foundation & Core Loop Setup

**Epic Goal:** Establish the core application shell (React Native), integrate foundational backend services (Supabase), and deliver a "Hook-First" onboarding experience that prioritizes immediate immersion in the core gameplay loop (Workout -> Battle) within 90-120 seconds. High-friction steps (Account Creation, Health Connect, Avatar Generation) are implemented using **Progressive Disclosure**, deferred until after the user reaches the Home Dashboard.

**Integration Requirements:** Requires setting up connections to Supabase, platform-specific Health APIs (HealthKit/Connect), and the Runware API for avatar generation. Establishes the critical React Native <-> Phaser WebView bridge.

**Version:** 2.0 (Party Mode Aligned)
**Last Updated:** 2026-01-02

---

## Party Mode Alignment (2025-12-29)

This epic has been updated to reflect the following Party Mode design decisions:

1. **Champion Selection in Battle Mode** - Champion selection happens in Battle Mode (Phaser, landscape), NOT during onboarding
2. **6 Champions (Cosmetic-Only)** - Sean, Mary, Marcus, Aria, Kenji, Zara share identical stats (Mario Party model)
3. **No-Defeat Philosophy** - Battles result in "victory" or "continue_training" (never defeat/loss)
4. **Victory Ceremony DEPRECATED** - Post-battle results reflected in avatar pose on Home Dashboard
5. **Terminology** - "Champion" (not Fighter/Combat Character), "Training/Workout" (not Quest), "Momentum" (not Streak)

---

## Story 1.1: Project Initialization & Core Dependencies
**As a** Developer,
**I want** to initialize the React Native project structure (Monorepo setup TBD by Architect) and install core dependencies (React Native, Phaser, Supabase client, Navigation, Reanimated, Skia),
**so that** the foundational codebase is established for subsequent features.

### Acceptance Criteria
1.  React Native project is initialized using the specified version (e.g., 0.71.8+).
2.  Core dependencies (Phaser 3.70.0+, Supabase client, React Navigation, Reanimated 4, react-native-skia) are installed and configured.
3.  Basic project structure (potentially within a Monorepo) is created following architectural guidance.
4.  The application builds and runs successfully on both iOS simulator and Android emulator, displaying a placeholder screen.
5.  Basic linting and formatting rules are configured.

## Story 1.2: Supabase Backend Setup & Basic Auth
**As a** Developer,
**I want** to configure the Supabase client, set up basic authentication (deferred auth option), and establish a basic user profile table,
**so that** user data can be stored and managed securely.

### Acceptance Criteria
1.  Supabase client is initialized with project URL and anon key.
2.  A basic `profiles` table is created in Supabase with necessary fields (user_id, archetype, avatar_url, evolution_stage, selected_champion, fitness_momentum, etc.).
3.  Basic email/password or social login (TBD) is configured.
4.  **Deferred Authentication** is the default: Users are assigned an anonymous ID initially and can "Claim Account" later.
5.  User sessions are managed correctly.

## Story 1.3: HealthKit/Connect Integration (Contextual)
**As a** Developer,
**I want** to integrate platform-specific health APIs (Apple HealthKit, Google Fit via Health Connect) to request permissions **contextually** (e.g., when starting a workout),
**so that** real-world fitness activity can be brought into the application without blocking the initial experience.

### Acceptance Criteria
1.  Necessary libraries/modules for HealthKit (iOS) and Health Connect API (Android) are integrated.
2.  The application requests user permission to read step count data **only when triggered by a user action** (e.g., "Sync Steps" button).
3.  Step count data for the current day is successfully fetched upon app launch/foregrounding (if permission granted).
4.  Fetched step count is stored or updated in the user's profile/state.
5.  Basic error handling is implemented for permission denial or sync failures.

## Story 1.4: Onboarding Flow - Archetype Selection
**As a** New User,
**I want** to select my desired Fitness Archetype (Trainer, Runner, Yoga, Bodybuilder, Cyclist) immediately after the Welcome screen,
**so that** I can begin personalizing my experience without the friction of account creation.

### Acceptance Criteria
1.  **Archetype Selection Screen** is presented immediately after the Welcome Screen.
2.  User is presented with the five Fitness Archetype options.
3.  User selection is saved **locally** initially.
4.  The flow transitions smoothly to **Tutorial Training Assignment** (Story 1.10 FTUE flow).
5.  **Profile Setup (Account Creation)** is deferred to Phase 2.
6.  **Note:** Champion selection does NOT occur during onboarding—it happens in Battle Mode (post-FTUE).

## Story 1.5: Avatar Generation ("Smooth-to-Pixel" Architecture)
**As a** User (on Home Dashboard),
**I want** to upload a selfie and have the system generate my personalized DMG-style pixel art avatar,
**so that** I can see myself as a retro Game Boy character in the game.

### Architecture Overview

This story implements the **"Smooth-to-Pixel" strategy** designed via Gemini 3 Deep Think analysis:

- **AI generates cel-shaded vector art** (NOT pixel art) via Runware API
- **Server-side CLAHE + Bayer dithering** handles pixelation with guaranteed 4-color DMG compliance
- **Tri-Signal Pipeline** preserves likeness: ControlNet (geometry) + IP-Adapter (features) + Prompt (style)
- **Async webhook architecture** prevents mobile timeouts
- **"Draft Pick" UX** generates two variants (Accuracy vs. Retro) for user selection

### Technical Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Base Model** | DreamShaper XL Lightning (`civitai:112902@354657`) | 4-step fast generation |
| **ControlNet** | SDXL Canny (`runware:20@1`) | Geometry preservation |
| **IP-Adapter** | FaceID Plus v2 (`civitai:208846@235313`) | Likeness injection |
| **Contrast Fix** | CLAHE (clipLimit: 2.0, gridSize: 8) | Prevents muddy output |
| **Dithering** | Bayer 4x4 (spread: 45) | Authentic DMG aesthetic |

### Acceptance Criteria

1.  **Trigger Point:** Avatar generation flow is accessible from Home Screen (deferred, post-onboarding).
2.  **Photo Upload:** Camera/gallery access implemented; selfie uploaded to Supabase temp storage.
3.  **Preprocessing:** Runware Canny preprocessing returns edge map within 2 seconds for "Boot Sequence" UX.
4.  **Dual Variant Generation:** Two variants generated asynchronously via webhooks:
    - **Accuracy** (ControlNet: 0.50, IP-Adapter: 0.55) - Higher likeness
    - **Retro** (ControlNet: 0.45, IP-Adapter: 0.35) - More stylized
5.  **Post-Processing:** Server applies CLAHE contrast normalization + Bayer dithering.
6.  **DMG Compliance:** Final output is exactly 128x128 pixels with exactly 4 DMG colors (#0F380F, #306230, #8BAC0F, #9BBC0F).
7.  **Boot Sequence UX:** Loading experience shows Canny map ("Scanning Biometrics...") and progress bar during generation.
8.  **Draft Pick Selection:** User presented with both variants side-by-side; selection saved as `final_url`.
9.  **Realtime Updates:** Client subscribes to Supabase Realtime; transitions to Draft Pick when both variants complete.
10. **Performance:** Total generation completes within 15 seconds; preprocessing within 2 seconds.
11. **Error Handling:** DSP fallback (Game Boy Camera style) if AI generation fails; retry option on failure.

### References

- **Implementation Spec:** [avatar-generation-implementation-spec.md](../architecture/avatar-generation-implementation-spec.md)
- **Story Details:** [1.5.avatar-generation.story.md](../stories/1.5.avatar-generation.story.md)

## Story 1.6: Home Screen Dashboard
**As a** User,
**I want** to see my generated Home Avatar, progress rings, training cartridge, tab bar, and fitness stats on the Home Screen,
**so that** the main application hub is functional and displays my personal progress.

### Acceptance Criteria
1.  The Home Screen UI is implemented following the Game Boy aesthetic (NFR6).
2.  The user's Home Avatar (or placeholder) is displayed prominently (top-center).
3.  **Dual Progress Rings**, a **Momentum Bar**, and the **"Training Cartridge" button** are displayed below the avatar.
4.  The **bottom Tab Bar** (Home, Battle, Profile, Settings) is displayed and functional.
5.  Key fitness stats are displayed on the **shell area** (Steps, Calories, Workout Duration).
6.  **Post-Battle Avatar States:** Avatar displays victory pose or determined pose based on last battle outcome.
7.  **Note:** Champion selection does NOT occur on this screen—it happens in Battle Mode.

### Party Mode Notes
- **No Champion Display:** Home Dashboard shows user's personal stats only. Champion is Battle Mode context.
- **Avatar Reactions:** After battles, avatar shows victory pose (won) or determined pose (continue_training).
- **Evolution Overlay:** When XP threshold is met, Evolution Ceremony triggers as overlay on Home Dashboard.

## Story 1.7: WebView Bridge & Basic Combat Scene Setup
**As a** Developer,
**I want** to set up the React Native WebView component, implement the core "Hybrid Velocity Bridge" protocol, and load a basic Phaser 3 scene within the WebView,
**so that** the foundation for high-performance communication and gameplay is established.

### Acceptance Criteria
1.  A dedicated WebView component is integrated into the React Native application.
2.  The core binary message protocol for the Hybrid Velocity Bridge is implemented on both the React Native and Phaser sides.
3.  Basic communication (e.g., sending a 'start game' event from RN to Phaser) is functional with low latency (<50ms target).
4.  A basic Phaser 3 scene loads successfully within the WebView.
5.  Performance baseline (FPS, memory) is established.

## Story 1.8: Implement Core Combat Mechanics & Training Dummy
**As a** Player,
**I want** my selected Champion to respond to basic combat inputs (6 attacks, movement, jump, block) within the Phaser scene, and face a simple Training Dummy AI,
**so that** the fundamental fighting gameplay is functional.

### Acceptance Criteria
1.  Selected Champion sprite/animations are loaded into the Phaser BattleScene.
2.  Virtual controls (D-pad, 6 buttons) are implemented in the UI layer and correctly send input commands via the bridge.
3.  The Champion executes the corresponding basic actions in Phaser.
4.  A non-attacking "Training Dummy" AI opponent is implemented.
5.  Basic physics are functional.
6.  Combat actions feel responsive (<50ms latency).

### Party Mode Notes
- **6 Champions Available:** Sean (MMA), Mary (Kickboxing), Marcus (Boxer), Aria (Capoeira), Kenji (Aikido), Zara (Power Lifter)
- **Cosmetic-Only:** All champions share identical stats and movesets. User's fitness powers ALL champions equally.
- **Champion Selection:** Happens in Battle Mode via SF2-style 2×3 grid, NOT during onboarding.

## Story 1.9: Integrate Combat UI & Step-Energy Mechanic
**As a** Player,
**I want** to see Health Bars, a timer, and my Energy Meter (fueled by synced steps) in the combat UI, and have the Energy Meter deplete/recharge appropriately,
**so that** core combat resources and status are visible and functional.

### Acceptance Criteria
1.  Combat UI elements (Health Bars, Timer, Energy Meter) are implemented in the Phaser scene following SF2 style (NFR7).
2.  Initial Health values are set for both the player's champion and opponent.
3.  A round timer starts and counts down.
4.  The user's current step count (synced contextually) is used to determine the initial/max value of the Energy Meter.
5.  A basic mechanic for using/depleting energy is implemented.
6.  The UI elements update correctly during gameplay.

## Story 1.10: Basic FTUE & Tutorial Battle Integration
**As a** New User,
**I want** the onboarding flow to conclude with a brief tutorial battle against the Training Dummy, followed by landing on the Home Dashboard with my avatar showing a victory pose,
**so that** I understand the core loop and controls within 60-90 seconds.

### Acceptance Criteria
1.  The onboarding flow (Welcome → Archetype Selection → Tutorial Training Assignment → Simulated Workout → Tutorial Battle) transitions smoothly.
2.  The tutorial briefly explains basic movement and attack controls.
3.  The tutorial initiates the first battle via the **Battle Mode Transition Video** (portrait → landscape).
4.  **Default Champion (Sean)** is automatically assigned for tutorial battle—no selection required.
5.  **GUARANTEED VICTORY:** Tutorial battle cannot result in failure (Training Dummy has very low HP).
6.  Upon tutorial completion, user transitions to **Home Dashboard** with avatar showing victory pose.
7.  The entire FTUE aims to be completable within **60-90 seconds**.

### Party Mode Notes
- **No Champion Selection in FTUE:** Default champion (Sean) is used for tutorial.
- **Victory Ceremony DEPRECATED:** Post-battle results are applied silently; avatar shows victory pose on Home Dashboard.
- **Battle Mode Transition Video:** Entry/exit via cinematic video, NOT Cartridge Load Animation.

## Story 1.11: Achieve 60fps Performance Target
**As a** Player,
**I want** the combat gameplay against the Training Dummy to consistently run at 60fps on target devices,
**so that** the fighting experience feels smooth and responsive.

### Acceptance Criteria
1.  Performance profiling is conducted during combat scenarios.
2.  Optimizations are implemented as needed.
3.  Combat achieves an average of 60fps with 90% consistency (NFR1).
4.  Memory usage remains below 150MB peak (NFR3).
5.  Input latency remains below 50ms (NFR2).

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| 2025-10-23 | 1.0 | Initial Epic 1 PRD | John (PM) |
| 2025-12-31 | 1.1 | **Story 1.5 complete rewrite:** Updated to "Smooth-to-Pixel" architecture per Gemini 3 Deep Think analysis. Replaced DALL-E 3 face integration with Runware-based pipeline (DreamShaper XL Lightning + ControlNet + IP-Adapter). Added CLAHE contrast normalization, Bayer dithering, async webhook architecture, "Boot Sequence" UX, and "Draft Pick" dual variant selection. Now references implementation spec and story file. | John (PM) |
| 2026-01-02 | 2.0 | **Party Mode Alignment:** Story 1.4 updated to remove Combat Character Selection from FTUE. Story 1.6 renamed from "Combat Character Selection & Home Screen Display" to "Home Screen Dashboard" (character selection moved to Battle Mode). Story 1.8 updated to use "Champion" terminology with 6 champions (cosmetic-only). Story 1.10 updated with default champion (Sean) for tutorial, guaranteed victory, Victory Ceremony deprecated. Added Party Mode alignment section. Updated terminology throughout (Champion, Training Cartridge, Momentum). | John (PM) |
