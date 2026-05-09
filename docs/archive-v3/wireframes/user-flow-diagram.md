# 16BitFit User Flow Diagram
## Version 3.1 | "Hook-First" FTUE Strategy (Party Mode Aligned)

> **Document Owner:** UI/UX Specialist (Sally)
> **Last Updated:** 2026-01-02
> **Approved By:** Sean (Product Owner)
> **Party Mode Alignment:** 2025-12-29 decisions incorporated

---

## Executive Summary

| Attribute | Value |
|-----------|-------|
| **Strategy** | "Immediate Action" / "Hook-First" FTUE |
| **Core Loop Target** | 60-90 seconds to first battle outcome |
| **Full FTUE Target** | 90-120 seconds total |
| **Deferred Actions** | Account creation, Health permissions, AI Avatar generation |
| **Champion Selection** | Post-FTUE, in Battle Mode (Phaser, landscape) |

**Key Party Mode Decisions (2025-12-29):**
- ✅ Champion selection moved to Battle Mode (NOT onboarding)
- ✅ 6 champions in SF2-style 2×3 grid (purely cosmetic, Mario Party model)
- ✅ No-defeat philosophy: outcomes are "victory" or "continue_training"
- ✅ Terminology: "Training/Workout" replaces "Quest", "Champion" replaces "Fighter"
- ✅ Battle Mode Transition Video for entering/exiting Battle Mode
- ✅ Simple fade for FTUE simulated workout (NOT cartridge animation)
- ✅ Victory Ceremony DEPRECATED → Avatar reactions on Home Dashboard

**Research Basis:**
- 40% of users abandon during onboarding (Synthesis Report)
- 77% of DAU lost within first 3 days without immediate hook
- Users need a "60-second aha moment" to commit

---

## Transition Architecture

| Transition | Usage | Duration |
|------------|-------|----------|
| **Simple Fade** | FTUE simulated workout → Tutorial Battle | Instant |
| **Battle Mode Transition Video** | Entering/Exiting Battle Mode (portrait ↔ landscape) | ~3-5 sec |
| **Cartridge Load Animation** | Post-onboarding WORKOUT entry ONLY | ~1 sec |

---

## Progress Dots Pattern (Onboarding)

> **Key Design Decision:** Progress dots represent 3 decision PHASES, not every screen.

| Screen | Progress Dots | Rationale |
|--------|---------------|-----------|
| Welcome Screen | **NONE** | Clean "PRESS START" moment - no UI clutter |
| Archetype Selection | **● ○ ○** (1/3) | First decision: Choose identity |
| Tutorial Training Assignment | **● ● ○** (2/3) | Second decision: Commit to workout |
| Simulated Workout | **NONE** | Exercise progress shown separately (1/3, 2/3, 3/3) |
| Battle Mode screens | **NONE** | Different context (Phaser, landscape) |
| Home Dashboard | **NONE** | Onboarding complete! |

**Visual Representation:**
```
Welcome        → [No dots]
                  ↓
Archetype      → ● ○ ○  (Step 1 of 3)
                  ↓
Training Assign → ● ● ○  (Step 2 of 3)
                  ↓
Workout        → [Exercise progress: 1/3, 2/3, 3/3]
                  ↓
Home Dashboard → [Complete - no dots]
```

---

## Phase 1: Core Loop (60-90 seconds) — THE HOOK

> **Goal:** User experiences fitness-to-battle causality within 60 seconds.
> No accounts. No permissions. No friction. Just gameplay.
> **Default champion** used for tutorial (user selects champion in Battle Mode later).

```
┌─────────────────────────────────────────────────────────────────┐
│                        APP LAUNCH                                │
│                     (First Time User)                            │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
                 ┌───────────────┐
                 │ WELCOME SCREEN │  ← 5 seconds
                 │  "PRESS START" │     Screen 1
                 └───────┬───────┘
                         │
                         ▼
          ┌──────────────────────────────┐
          │    ARCHETYPE SELECTION       │  ← 15 seconds
          │  [Trainer][Runner][Yoga]...  │     Screen 2
          │    (Default avatar assigned) │     (Default champion: Sean)
          └──────────────┬───────────────┘
                         │
                         ▼
          ┌──────────────────────────────┐
          │ TUTORIAL TRAINING ASSIGNMENT │  ← 5 seconds
          │  "Power up for your battle!" │     Screen 3
          └──────────────┬───────────────┘
                         │
                         ▼
          ┌──────────────────────────────┐
          │   FTUE WORKOUT VIDEO (8-12s) │  ← 8-12 seconds
          │   (Passive pixel animation)  │     Screen 4
          │   (Skip after 2s)            │
          │   (Bundled in app - offline) │
          └──────────────┬───────────────┘
                         │
                         ▼ (Simple fade - NO cartridge animation)
          ┌──────────────────────────────┐
          │ BATTLE MODE TRANSITION VIDEO │  ← 3-5 seconds
          │   (Portrait → Landscape)     │     Screen 5
          └──────────────┬───────────────┘
                         │
                         ▼
          ┌──────────────────────────────┐
          │   TUTORIAL BATTLE vs DUMMY   │  ← 30-45 seconds
          │   (Default champion: Sean)   │     Screen 6
          │   (Guided: Move, Attack)     │     (Phaser, Landscape)
          │   (Guaranteed victory)       │
          └──────────────┬───────────────┘
                         │
                         ▼
          ┌──────────────────────────────┐
          │ BATTLE MODE TRANSITION VIDEO │  ← 3-5 seconds
          │   (Landscape → Portrait)     │     Screen 7
          └──────────────┬───────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    HOME DASHBOARD                                │
│              🎉 CORE LOOP COMPLETE 🎉                            │
│         Avatar shows VICTORY POSE (positive feedback)            │  Screen 8
│         (User has experienced SBFG concept)                      │
│         Evolution overlay triggers if XP threshold met           │
└─────────────────────────────────────────────────────────────────┘

TOTAL TIME: 60-90 seconds ✅

╔═══════════════════════════════════════════════════════════════════╗
║  NOTE: Champion Selection moved to Battle Mode (post-FTUE)        ║
║  User can tap "Battle" tab → "Choose Your Champion" in menu       ║
║  6 Champions in SF2-style 2×3 grid (purely cosmetic)              ║
╚═══════════════════════════════════════════════════════════════════╝
```

---

## Phase 1: Screen Details

### Screen 1: Welcome Screen (5 seconds)

**Entry Point:** App launch (first time user)

**Progress Dots:** NONE - This is the clean "PRESS START" moment

**Visual Elements:**
- Logo: "16BITFIT" (Press Start 2P, centered)
- Tagline: "Fitness Battles Fueled by Your Steps"
- Primary CTA: "START YOUR JOURNEY" (blinking pixel text)
- Background: DMG palette (#9BBC0F base)
- NO progress dots (clean, impactful first impression)

**User Actions:**
| Action | Result | Timing |
|--------|--------|--------|
| Tap "START YOUR JOURNEY" | Navigate to Archetype Selection | Immediate |

**Accessibility:**
- `accessibilityLabel`: "Start your journey to begin your adventure"
- `accessibilityRole`: "button"

---

### Screen 2: Archetype Selection (15 seconds)

**Entry Point:** From Welcome Screen

**Progress Dots:** ● ○ ○ (Step 1 of 3) - First screen with progress dots

**Visual Elements:**
- Header: "SELECT YOUR CLASS"
- 5 Archetype Cards: Trainer, Runner, Yoga, Bodybuilder, Cyclist
- Each card shows: Pixel art preview + stat bonuses
- CTA: "CONFIRM CLASS" (enabled on selection)
- Progress dots at bottom (1 of 3 active)

**User Actions:**
| Action | Result | Timing |
|--------|--------|--------|
| Tap archetype card | Highlight selection, show stats | Immediate |
| Tap "CONFIRM CLASS" | Save locally, navigate to Tutorial Training | Immediate |

**Design Notes:**
- Default avatar silhouette assigned (no photo required)
- **Default champion (Sean) assigned automatically** - user can change in Battle Mode later
- Selection persisted to AsyncStorage (no account needed)
- Touch targets: 44x44dp minimum per card

**Party Mode Note:**
> ⚠️ **No character selection during onboarding.** User gets default champion (Sean) for tutorial. Champion selection happens in Battle Mode (Phaser, landscape) with 6-champion SF2 grid.

---

### Screen 3: Tutorial Training Assignment (5 seconds)

**Entry Point:** From Archetype Selection

**Progress Dots:** ● ● ○ (Step 2 of 3)

**Visual Elements:**
- Training card: "POWER UP FOR BATTLE!"
- Animated energy meter filling (simulated)
- Auto-advance after 3 seconds OR tap to continue
- Progress dots at bottom (2 of 3 active)

**Purpose:**
- Establishes fitness → combat causality
- Provides narrative context for workout
- Allows WebView to begin pre-loading in background

**Terminology:**
- "Training" used at menu level
- "Workout" used for the actual activity

---

### Screen 4: FTUE Workout Video (8-12 seconds)

**Entry Point:** From Training Assignment

**Progress Dots:** NONE - Video plays automatically

**Visual Elements:**
- Full-screen video player
- 8-bit/16-bit pixel animation of archetypes doing workouts
- DMG 4-color palette (#9BBC0F, #8BAC0F, #306230, #0F380F)
- Skip button appears after 2 seconds
- Chiptune audio (unified onboarding track continues)

> **FTUE Video Update (Party Mode 2026-01-05):** This is a **passive video clip**, NOT an interactive workout tracker. Video demonstrates the workout→battle energy concept through animated sequences.

**User Actions:**
| Action | Result | Timing |
|--------|--------|--------|
| Watch video | Auto-advances to Workout Complete Ceremony | 8-12 seconds |
| Tap "Skip" (after 2s) | Immediately advance to Workout Complete | Immediate |

**Design Notes:**
- OFFLINE-CAPABLE: Video is **bundled in app** (no network required)
- Video created via: Nano Banana Pro (image gen) + Veo 3.1 (animation)
- Reduce Motion: Skip button appears immediately

**Transition Note:**
> ⚠️ **Simple fade transition after video** (NOT Cartridge Load Animation). Cartridge Load is reserved for post-onboarding real workout entry only.

**Video Specification Reference:** See [video-asset-specifications.md](../design-system/video-asset-specifications.md) for storyboards and prompts.

---

### Screen 5: Battle Mode Transition Video (3-5 seconds)

**Entry Point:** From Simulated Workout (via simple fade)

**Visual Elements:**
- Battle Mode Transition Video plays
- Screen rotates to LANDSCAPE
- Phaser WebView loads battle scene

**Technical Notes:**
- WebView should be pre-loaded from Screen 3
- If not loaded, extend video to mask load time
- Orientation lock to landscape during battle

**Party Mode Decision:**
> This transition video plays when entering AND exiting Battle Mode. It provides satisfying closure and orientation change feedback.

---

### Screen 6: Tutorial Battle (30-45 seconds)

**Entry Point:** From Transition Video (WebView, Phaser, Landscape)

**Flow:**
1. **Intro** (5s): "Welcome to the Arena!"
2. **Movement Tutorial** (10s): "Tap Left/Right to move"
3. **Attack Tutorial** (10s): "Tap Punch/Kick to attack"
4. **Battle** (15-20s): Defeat Training Dummy (3 hits)
5. **Victory** (5s): "VICTORY!" message in Phaser

**Design Notes:**
- **GUARANTEED VICTORY:** Dummy has minimal HP, no defeat possible
- **Default champion (Sean)** used for tutorial
- Guided prompts overlay Phaser scene
- Haptic feedback on hits
- OFFLINE-CAPABLE: No network required

**No-Defeat Philosophy:**
> ⚠️ Tutorial battle **cannot result in "continue_training"** - it is always a victory. The no-defeat philosophy applies to regular battles post-FTUE.

---

### Screen 7: Battle Mode Transition Video - Exit (3-5 seconds)

**Entry Point:** From Battle Victory (Phaser)

**Visual Elements:**
- Battle Mode Transition Video plays (reverse/exit version)
- Screen rotates back to PORTRAIT
- Transitions to Home Dashboard

**Party Mode Decision:**
> ⚠️ **Victory Ceremony screen DEPRECATED.** No standalone ceremony. Battle results are reflected in avatar reaction on Home Dashboard.

---

### Screen 8: Home Dashboard (Landing)

**Entry Point:** From Transition Video (exit)

**Visual Elements:**
- Default avatar (archetype silhouette) displaying **VICTORY POSE**
- Dual Progress Rings (Fitness/Skill) - showing tutorial progress
- **Momentum Bar** (NOT streak) - starts at 1 day
- Training Cartridge (ready for next workout)
- Tab Bar: Home, Battle, Profile, Settings
- Stats Ribbon (shell area): Steps: 500, Cals: 25, Time: 1m

**Post-Battle Avatar States:**
| Battle Outcome | Avatar State | Message |
|----------------|--------------|---------|
| Victory | Victory pose (arms raised) | Stats gained displayed |
| Continue Training | Determined pose (training stance) | "Your champion is resting... time to train more!" |

**Evolution Overlay:**
- If XP threshold met during battle, **Evolution Ceremony triggers as OVERLAY**
- Pokemon Red/Blue-style blinking animation
- "Tap to skip" option
- Reduce Motion: crossfade instead of blinking

**State:**
- `hasCompletedOnboarding: true`
- First badge visible in profile
- Deferred action triggers now active
- **Champion selection unlocked** in Battle Mode menu

---

## Champion Selection (Post-FTUE, Battle Mode)

> **Location:** Battle Mode Main Menu → "Choose Your Champion"
> **Environment:** Phaser (WebView), Landscape
> **Style:** SF2-style 2×3 grid of portrait headshots

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  PHASER CANVAS (844 × 390) - LANDSCAPE                                          │
├────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│    ╔════════════════════════════════════════════════════════════════════╗      │
│    ║                    CHOOSE YOUR CHAMPION                             ║      │
│    ╚════════════════════════════════════════════════════════════════════╝      │
│                                                                                  │
│         ┌──────────┐    ┌──────────┐    ┌──────────┐                            │
│         │   SEAN   │    │   MARY   │    │  MARCUS  │                            │
│         │  (MMA)   │    │(Kickbox) │    │ (Boxer)  │                            │
│         └──────────┘    └──────────┘    └──────────┘                            │
│                                                                                  │
│         ┌──────────┐    ┌──────────┐    ┌──────────┐                            │
│         │   ARIA   │    │  KENJI   │    │   ZARA   │                            │
│         │(Capoeira)│    │ (Aikido) │    │(PowerLft)│                            │
│         └──────────┘    └──────────┘    └──────────┘                            │
│                                                                                  │
│    ┌─────────────────────────────────────────────────────────────────────────┐  │
│    │ "Powered by YOUR workouts!" - All champions have identical abilities   │  │
│    └─────────────────────────────────────────────────────────────────────────┘  │
│                                                                                  │
│    [BACK]                                                         [SELECT]      │
│                                                                                  │
└────────────────────────────────────────────────────────────────────────────────┘
```

**6 Champions (All Purely Cosmetic - Mario Party Model):**
| Champion | Fighting Style | Stats |
|----------|---------------|-------|
| Sean | MMA Fighter | Identical to all |
| Mary | Kickboxing Trainer | Identical to all |
| Marcus | Urban Boxer | Identical to all |
| Aria | Dance Combat (Capoeira) | Identical to all |
| Kenji | Aikido/Tai Chi Master | Identical to all |
| Zara | Power Lifter | Identical to all |

**Key Design Decision:**
> ⚠️ Champions are **purely cosmetic** - no stat differences. All champions share identical abilities and are powered by the user's real-world fitness activities. Selection is about identity and preference, not strategic advantage.

---

## Phase 2: Progressive Disclosure (Post-Hook)

> **Goal:** Unlock features contextually as user engages.
> Each trigger is tied to a meaningful user action.

```
┌─────────────────────────────────────────────────────────────────┐
│                    HOME DASHBOARD                                │
└──────────┬──────────────────┬──────────────────┬────────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
    ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
    │ TRIGGER A:   │   │ TRIGGER B:   │   │ TRIGGER C:   │
    │ Tap Avatar   │   │ Start Real   │   │ Complete 2nd │
    │ or Profile   │   │ Workout      │   │ Workout      │
    └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
           │                  │                  │
           ▼                  ▼                  ▼
    ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
    │ AI AVATAR    │   │ HEALTH       │   │ ACCOUNT      │
    │ GENERATION   │   │ PERMISSIONS  │   │ CREATION     │
    │ (Photo Flow) │   │ (HealthKit)  │   │ (Save Data)  │
    └──────────────┘   └──────────────┘   └──────────────┘
```

---

## Phase 2: Trigger Details

### Trigger A: AI Avatar Generation

**Activation:** User taps avatar OR Profile tab OR "Customize" button

**Prompt UI:**
```
┌─────────────────────────────────────┐
│  🎨 CUSTOMIZE YOUR LOOK            │
│                                     │
│  Want a unique avatar? Upload a    │
│  photo and we'll create your       │
│  personalized pixel champion!      │
│                                     │
│  [UPLOAD PHOTO]    [MAYBE LATER]   │
└─────────────────────────────────────┘
```

**Flow if accepted:**
1. Camera/Gallery picker
2. Photo upload + processing (< 15s target)
3. AI avatar result display (Draft Pick UI)
4. Accept/Retry/Skip options

**Conversion Target:** 30% Day 1

---

### Trigger B: Health Permissions

**Activation:** User starts a non-tutorial workout (real Training session)

**Prompt UI:**
```
┌─────────────────────────────────────┐
│  💪 FUEL YOUR CHAMPION             │
│                                     │
│  Connect Apple Health to earn XP   │
│  for your REAL daily steps!        │
│                                     │
│  Your steps = Your power           │
│                                     │
│  [CONNECT HEALTH]  [USE MANUAL]    │
└─────────────────────────────────────┘
```

**Flow if accepted:**
1. System permission dialog (HealthKit/Health Connect)
2. If granted: Begin syncing step data
3. If denied: Manual logging mode enabled

**Conversion Target:** 60% Day 1

---

### Trigger C: Account Creation

**Activation:** User completes 2nd workout OR session ends after 10+ minutes

**Prompt UI:**
```
┌─────────────────────────────────────┐
│  💾 SAVE YOUR PROGRESS             │
│                                     │
│  Great job! Create an account to   │
│  keep your stats, badges, and      │
│  avatar safe.                       │
│                                     │
│  [CREATE ACCOUNT]  [NOT NOW]       │
└─────────────────────────────────────┘
```

**Flow if accepted:**
1. Email/password OR social auth options
2. Migrate local data to Supabase profile
3. Enable cloud sync

**Conversion Target:** 40% Day 1

---

## Battle Outcomes (No-Defeat Philosophy)

> **Party Mode Decision (2025-12-29):** There is no "loss" or "defeat" state. Users are never punished.

| Outcome | Result | Avatar State | Stats |
|---------|--------|--------------|-------|
| `victory` | User wins battle | Victory pose on Home | XP gained, stats increased |
| `continue_training` | User didn't win | Determined pose on Home | Stats unchanged (NOT reduced) |

**Continue Training Message:**
> "Your champion is resting... time to train more!"

**Key Rules:**
- ❌ XP is NEVER removed
- ❌ Stats are NEVER reduced
- ❌ Avatar NEVER shows disappointed/defeated pose
- ✅ All feedback is encouraging and forward-looking

---

## Momentum System (NOT Streak)

> **Party Mode Decision:** Replace punitive streak system with graceful decay momentum.

| Behavior | Old (Streak) | New (Momentum) |
|----------|--------------|----------------|
| Miss 1 day | Reset to 0 | 5% decay |
| Display | "0 day streak" | "47 days momentum" |
| Messaging | "You broke your streak!" | None (no guilt) |
| System | Binary (on/off) | Graceful gradient |

**Momentum Decay Formula:**
```typescript
const calculateMomentum = (currentMomentum: number, missedDays: number): number => {
  const decayRate = 0.05; // 5% per missed day
  const decayMultiplier = Math.pow(1 - decayRate, missedDays);
  return Math.round(currentMomentum * decayMultiplier);
};
// Example: 100 days momentum + 1 missed day = 95 days (NOT 0)
```

---

## Success Metrics

### Phase 1 Funnel (Core Loop)

```
Welcome Screen viewed        → 100%
Archetype selected           → 95%  (5% drop: confusion)
Tutorial training started    → 93%  (2% drop: skip attempt)
Simulated workout completed  → 90%  (3% drop: impatience)
Tutorial battle started      → 88%  (2% drop: disinterest)
Victory achieved             → 88%  (0% drop: guaranteed win)
Home Dashboard reached       → 88%

TARGET: >85% core loop completion ✅
```

### Phase 2 Conversions (Day 1)

```
Health permissions granted   → 60%
Account created              → 40%
AI avatar generated          → 30%
Champion changed from default→ 25%
```

### Analytics Events

```javascript
// Phase 1 Events
analytics.logEvent('ftue_start');
analytics.logEvent('ftue_welcome_viewed');
analytics.logEvent('ftue_archetype_selected', { archetype: 'runner' });
analytics.logEvent('ftue_training_started');  // Changed from quest
analytics.logEvent('ftue_workout_completed', { duration_seconds: 18 });
analytics.logEvent('ftue_battle_started', { champion: 'sean' }); // Default champion
analytics.logEvent('ftue_battle_victory', { duration_seconds: 35 });
analytics.logEvent('ftue_complete', { total_duration_seconds: 85 });

// Phase 2 Events
analytics.logEvent('deferred_avatar_prompt_shown');
analytics.logEvent('deferred_avatar_completed');
analytics.logEvent('deferred_health_prompt_shown');
analytics.logEvent('deferred_health_granted');
analytics.logEvent('deferred_account_prompt_shown');
analytics.logEvent('deferred_account_created');
analytics.logEvent('champion_selection_opened');
analytics.logEvent('champion_changed', { from: 'sean', to: 'aria' });

// Battle Events (Post-FTUE)
analytics.logEvent('battle_outcome', { result: 'victory' });
analytics.logEvent('battle_outcome', { result: 'continue_training' }); // Never 'defeat'

// Drop-off Events
analytics.logEvent('ftue_abandoned', {
  last_screen: 'archetype_selection',
  duration_seconds: 12
});
```

---

## Timing Validation Checkpoints

**Implementation MUST validate these timing gates:**

| Checkpoint | Maximum Time | Measurement Point |
|------------|--------------|-------------------|
| App Launch → Welcome Render | 3 seconds | Screen visible |
| Welcome → First Selection | 10 seconds | Button tap timestamp |
| First Selection → Battle Start | 45 seconds | WebView load complete |
| Battle Start → Victory | 45 seconds | Victory event fired |
| **Total FTUE** | **120 seconds** | Dashboard render |

**If timing gates fail during QA:**
1. Reduce simulated workout to 10 seconds (skippable after 5s)
2. Pre-load WebView during archetype selection
3. Simplify tutorial battle to 2 hits instead of 3
4. Reduce transition video duration by 50%

---

## Error States & Recovery

### Network Errors (Phase 1 is Offline-First)

**Phase 1 should NEVER fail due to network:**
- All tutorial data is local/simulated
- No API calls until Phase 2 triggers
- WebView battle assets bundled in app

**If network required (Phase 2):**
```
Error: "No internet connection"
Recovery:
  - Show toast: "You're offline. We'll sync when you're back."
  - Continue with local storage
  - Queue actions for sync on reconnect
```

### App Crash During FTUE

```
Recovery on relaunch:
  - Check AsyncStorage for FTUE progress
  - Resume from last completed screen
  - Show toast: "Welcome back! Let's continue."
  - Pre-fill any saved selections
```

### WebView Load Failure

```
Error: "Battle failed to load"
Recovery:
  - Show retry button: "Tap to retry"
  - If 3 failures: Skip to Dashboard with "Battle unlocked!"
  - Log error for debugging
```

---

## Accessibility Flow

### Screen Reader Navigation Order

#### Welcome Screen
```
1. "16BitFit logo"
2. "16BitFit. Heading level 1"
3. "Fitness Battles Fueled by Your Steps."
4. "Start Your Journey. Button. Double-tap to begin your adventure."
```

#### Archetype Selection
```
1. "Select Your Class. Heading level 1"
2. "Choose your fitness style"
3. "Trainer. Button. Balanced fitness with variety. Double-tap to select."
4. "Runner. Button. Built for endurance. Double-tap to select."
5. "Yoga. Button. Flexibility focus. Double-tap to select."
6. "Bodybuilder. Button. Strength focus. Double-tap to select."
7. "Cyclist. Button. Cardio specialist. Double-tap to select."
8. "Confirm Class. Button. Disabled." OR "Confirm Class. Button. Double-tap to continue."
```

#### Champion Selection (Battle Mode, Post-FTUE)
```
1. "Choose Your Champion. Heading level 1"
2. "All champions have identical abilities. Powered by your workouts."
3. "Sean. MMA Fighter. Button. Double-tap to select."
4. "Mary. Kickboxing Trainer. Button. Double-tap to select."
5. "Marcus. Urban Boxer. Button. Double-tap to select."
6. "Aria. Dance Combat Instructor. Button. Double-tap to select."
7. "Kenji. Aikido Master. Button. Double-tap to select."
8. "Zara. Power Lifter. Button. Double-tap to select."
9. "Select. Button. Double-tap to confirm your champion."
```

---

## Design System Compliance

### Touch Targets
All interactive elements: **44×44dp minimum**

### Color Palette
All screens use **LCD 4-color DMG palette only**:
- Background: `#9BBC0F`
- Text: `#0F380F`
- Buttons: `#8BAC0F`
- Borders: `#306230`

### Typography
- Headers: Press Start 2P (pixel font)
- Body text: Montserrat (readable)
- Minimum sizes: 10px pixel, 16px modern

### Animation
- Respect "Reduce Motion" system setting
- Maximum animation duration: 500ms (except ceremonies)
- All animations have purpose (feedback, not decoration)
- Evolution ceremony: crossfade for Reduce Motion users

---

## Related Wireframes

| Screen | Wireframe | Status |
|--------|-----------|--------|
| Welcome Screen | `welcome-screen.md` | ✅ Aligned |
| Archetype Selection | `archetype-selection-screen.md` | ⚠️ Needs terminology update |
| Tutorial Training | `tutorial-training-assignment-screen.md` | ⚠️ Renamed from quest |
| Home Dashboard | `home-dashboard-screen-enhanced.md` | ⚠️ Needs post-battle states |
| Champion Select | `champion-select-screen.md` | ✅ Aligned |
| Battle Mode Menu | `battle-mode-menu.md` | ✅ Aligned |
| Evolution Ceremony | `evolution-ceremony-screen.md` | ✅ Aligned |

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-10-31 | Initial Story 1.4 flow | Sally (UX) |
| 2.0 | 2025-12-05 | Complete rewrite: Hook-First strategy, 60-90s timing, Phase 1/2 separation | Sally (UX) |
| 3.0 | 2025-12-31 | **Party Mode Alignment:** Removed combat character selection from FTUE, added 6-champion SF2 grid in Battle Mode, updated terminology (Quest→Training/Workout, Fighter→Champion), added no-defeat philosophy, updated transition architecture, deprecated Victory Ceremony, added Momentum system | Sally (UX) |
| 3.1 | 2026-01-02 | **Progress Dots Pattern:** Documented that progress dots represent 3 decision phases (not every screen). Welcome=none, Archetype=1/3, Training=2/3, Workout/Dashboard=none. Added dedicated Progress Dots Pattern section. | Sally (UX) |
| 3.2 | 2026-01-05 | **FTUE Video Update:** Changed Screen 4 from "Simulated Workout (15-20s)" to "FTUE Workout Video (8-12s)". FTUE now uses passive video clip instead of interactive tracker. Video bundled in app. Skip after 2s. Reference: video-asset-specifications.md | Paige (Tech Writer) |

---

## References

- **PRD:** `docs/prd.md` v0.6 - FR19 (Hook-First FTUE), NFR11 (60-second aha moment)
- **Front-End Spec:** `docs/front-end-spec.md` v2.2 - User Flows section with Party Mode UX
- **Architecture:** `docs/architecture.md` v0.5 - Champion model, BattleResult model
- **CLAUDE.md:** Key Design Decisions summary
- **Design Tokens:** `docs/design-system/design-tokens-LCD.md`

