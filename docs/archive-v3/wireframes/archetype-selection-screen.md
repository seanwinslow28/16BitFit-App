# Archetype Selection Screen Wireframe

**Screen ID:** archetype-selection-screen
**Story:** 1.4 - Onboarding & Profile Setup
**Sprint:** 1
**Model Assignment:** Gemini 3 Pro
**Complexity:** Medium

---

## Purpose

User selects their Fitness Archetype which personalizes their workout recommendations and avatar evolution path. This is the second screen in onboarding. Selection is stored locally (no account yet).

---

## Layout (329×584pt LCD viewport)

```
┌─────────────────────────────────────────┐
│                                         │
│                 [16px]                  │
│                                         │
│          CHOOSE YOUR PATH               │  ← Press Start 2P, 16px, #0F380F
│                                         │
│                 [8px]                   │
│                                         │
│    Select a fitness style that         │  ← Montserrat, 12px, #306230
│         matches your goals              │
│                                         │
│                 [24px]                  │
│                                         │
│   ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│   │ [ICON]  │ │ [ICON]  │ │ [ICON]  │   │  ← Row 1: 3 cards
│   │         │ │         │ │         │   │     96×120px each
│   │ TRAINER │ │ RUNNER  │ │  YOGA   │   │     8px gaps
│   │Balanced │ │ Cardio  │ │Flexible │   │
│   └─────────┘ └─────────┘ └─────────┘   │
│                                         │
│                 [12px]                  │
│                                         │
│       ┌─────────┐ ┌─────────┐           │
│       │ [ICON]  │ │ [ICON]  │           │  ← Row 2: 2 cards, centered
│       │         │ │         │           │
│       │ BUILDER │ │ CYCLIST │           │
│       │Strength │ │Endurance│           │
│       └─────────┘ └─────────┘           │
│                                         │
│                 [32px]                  │
│                                         │
│    ┌──────────────────────────────────┐ │
│    │          CONTINUE                │ │  ← PixelButton, disabled until
│    └──────────────────────────────────┘ │     selection made
│                                         │
│                 [16px]                  │
│                                         │
│              ● ○ ○ ○ ○                  │  ← Progress dots (1 of 5)
│                                         │
│                 [16px]                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## Visual Specifications

### Header
- **Text:** "CHOOSE YOUR PATH"
- **Font:** Press Start 2P
- **Size:** 16px
- **Color:** #0F380F (darkest)
- **Alignment:** Center

### Subheader
- **Text:** "Select a fitness style that matches your goals"
- **Font:** Montserrat Regular
- **Size:** 12px
- **Color:** #306230 (dark)
- **Alignment:** Center

### Archetype Cards (ArchetypeCard molecule)
- **Size:** 96×120px
- **Background (default):** #9BBC0F (lightest)
- **Background (selected):** #8BAC0F (light)
- **Border (default):** 2px solid #306230
- **Border (selected):** 4px solid #0F380F
- **Scale (default):** 1.0
- **Scale (selected):** 1.02
- **Shadow:** 2px offset, #0F380F
- **Gap between cards:** 8px

### Card Content
- **Icon:** 32×32px pixel icon
- **Name:** Press Start 2P, 10px, #0F380F
- **Tagline:** Montserrat, 9px, #306230
- **Spacing:** Icon → Name: 8px, Name → Tagline: 4px

### Continue Button
- **Component:** PixelButton
- **Text:** "CONTINUE"
- **Width:** 280px
- **Height:** 52px
- **Disabled state:** opacity 0.5, no haptic
- **Enabled state:** Full opacity, impactMedium haptic
- **Press animation:** scale 0.95

### Progress Indicator
- **Component:** ProgressIndicator molecule
- **Steps:** 5 total
- **Current:** 1
- **Active dot:** #8BAC0F, 10px diameter
- **Inactive dot:** #306230, 8px diameter
- **Gap:** 8px

---

## Archetypes Data

| ID | Name | Icon | Tagline |
|----|------|------|---------|
| trainer | TRAINER | 💪 | "Balanced fitness" |
| runner | RUNNER | 🏃 | "Cardio focus" |
| yoga | YOGA | 🧘 | "Flexibility" |
| builder | BUILDER | 🏋️ | "Strength" |
| cyclist | CYCLIST | 🚴 | "Endurance" |

---

## States

### No Selection (Default)
- All cards in default state
- Continue button disabled (opacity 0.5)

### Card Hovered/Focused
- Border: 3px solid #306230
- Scale: 1.01

### Card Selected
- Background: #8BAC0F
- Border: 4px solid #0F380F
- Scale: 1.02
- Shadow: 3px offset
- Haptic: impactLight triggered

### Continue Enabled
- After any card selected
- Full opacity
- Haptic on press: impactMedium

### Reduce Motion
- Card selection: Instant border/background change (no scale)
- Continue press: Scale 0.95 still applies

---

## Animation Specifications

### Screen Entry
- **Type:** Slide in from right
- **Duration:** 300ms
- **Easing:** ease-out

### Card Selection
- **Type:** Scale + border + background
- **Scale:** 1.0 → 1.02
- **Duration:** 200ms
- **Easing:** spring (damping: 15, stiffness: 150)

### Card Deselection
- **Type:** Scale + border + background
- **Scale:** 1.02 → 1.0
- **Duration:** 150ms
- **Easing:** ease-out

### Button Enable
- **Type:** Opacity
- **Values:** 0.5 → 1.0
- **Duration:** 200ms

---

## Accessibility

| Element | accessibilityLabel | accessibilityRole | accessibilityHint |
|---------|-------------------|-------------------|-------------------|
| Screen | "Choose your fitness path, step 1 of 5" | - | - |
| Header | "Choose your path" | header | - |
| Card group | "Fitness archetype selection" | radiogroup | "Select one archetype" |
| Trainer card | "Trainer: Balanced fitness for overall health" | radio | "Double tap to select" |
| Runner card | "Runner: Cardio-focused endurance training" | radio | "Double tap to select" |
| Yoga card | "Yoga: Flexibility and mindfulness" | radio | "Double tap to select" |
| Builder card | "Builder: Strength and muscle building" | radio | "Double tap to select" |
| Cyclist card | "Cyclist: Endurance and leg power" | radio | "Double tap to select" |
| Continue button | "Continue to next step" | button | "Proceeds to photo upload" |
| Progress indicator | "Step 1 of 5" | progressbar | - |

### Selection State Announcements
- On selection: "[Archetype name] selected"
- On deselection: "[Archetype name] deselected"

---

## Navigation

| Action | Destination | Transition |
|--------|-------------|------------|
| Back gesture/button | WelcomeScreen | Slide right |
| Tap Continue | PhotoUploadScreen | Slide left |

---

## Component Mapping

| UI Element | Component | Import Path |
|------------|-----------|-------------|
| Header | PixelText | @/components/atoms/PixelText |
| Subheader | PixelText | @/components/atoms/PixelText |
| Archetype cards | ArchetypeCard | @/components/molecules/ArchetypeCard |
| Continue button | PixelButton | @/components/atoms/PixelButton |
| Progress indicator | ProgressIndicator | @/components/molecules/ProgressIndicator |

---

## Data Persistence

- **Storage:** AsyncStorage or MMKV
- **Key:** `@16bitfit/selectedArchetype`
- **Value:** Archetype ID string (e.g., "trainer")
- **Timing:** Save immediately on selection

---

## Party Mode Notes

- Default champion (Sean) is assigned automatically at this stage
- Champion selection is NOT part of onboarding
- Champion selection unlocks in Battle Mode post-FTUE
- Archetype affects workout recommendations, NOT champion stats (all champions are cosmetic)

---

## File Path

```
apps/mobile-shell/src/screens/onboarding/ArchetypeSelectionScreen/index.tsx
```

---

## Notes

- Cards should feel tactile and satisfying to select
- Radio button behavior: only one can be selected at a time
- Previous selection auto-deselects when new one is tapped
- Continue button should feel "unlocked" after selection
- 5 archetypes fit nicely in 3+2 grid layout
- Keep cognitive load low - simple icons and short taglines

---

**Document Version:** 1.0
**Created:** 2026-01-06
**Last Updated:** 2026-01-06
