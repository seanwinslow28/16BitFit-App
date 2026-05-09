# Tutorial Workout Assignment Screen - Wireframe Specification

**Screen ID**: FTUE-03
**Batch**: 1 (CRITICAL - MVP Blocking)
**Status**: ✅ Spec Complete
**Design Date**: 2025-11-30
**Last Updated**: 2025-12-31
**Spec Version**: 3.0 (Party Mode Aligned)

---

## Party Mode Alignment (2025-12-29)

### Key Changes in This Version
- ✅ Renamed from "Tutorial Quest Assignment" to "Tutorial Workout Assignment"
- ✅ Screen ID changed from FTUE-04 to FTUE-03 (character selection removed from FTUE)
- ✅ "Quest" → "Workout" / "Training" throughout
- ✅ "First Mission" → "First Training" (consistent terminology)
- ✅ Flow position updated: Screen 3 of 8 (was 4 of 9)
- ✅ Previous screen is now Archetype Selection (NOT Combat Character Selection)
- ✅ Transition: Simple fade to Simulated Workout (NOT Cartridge Load)

---

## Design System Compliance

> **Reference Document**: `docs/front-end-spec.md` v2.0
>
> This wireframe adheres to all MANDATORY DESIGN REQUIREMENTS including:
> - ✅ Dual Palette System (LCD 4-color only for screen content)
> - ✅ Typography Separation (Press Start 2P + Montserrat)
> - ✅ 44×44dp minimum touch targets
> - ✅ WCAG 2.1 AA accessibility compliance
> - ✅ Usability Traps Prevention guidelines

---

## Purpose

Assign the first tutorial workout (simulated training session) to introduce the core loop concept. This screen bridges archetype selection and the actual workout experience. **Critical component of the 60-90 second Hook-First FTUE** - must be completable in ~10 seconds.

> **Note:** In this tutorial flow, the user's champion is automatically set to the default (Sean) for the simulated battle. Champion selection happens later in Battle Mode (post-FTUE) when the user enters the full battle experience.

---

## Layout Structure

### Virtual LCD Area (329×584pt)
Using **DMG Palette ONLY** (`#9BBC0F`, `#0F380F`, `#8BAC0F`, `#306230`)

```
┌─────────────────────────────────────┐
│  LCD SCREEN (329×584pt)             │
│  Background: #9BBC0F (Neon grass)   │
├─────────────────────────────────────┤
│                                     │
│   ╔═══════════════════════════╗   │ ← Training Card Container
│   ║  🎮 FIRST TRAINING        ║   │   Border: #306230 (Pine), 4px
│   ║                           ║   │   Background: #9BBC0F (Neon grass)
│   ║  Power up for battle!     ║   │
│   ║                           ║   │
│   ║  ┌─────────────────────┐  ║   │
│   ║  │  TUTORIAL WORKOUT   │  ║   │ ← Workout Type Badge
│   ║  │  60 seconds         │  ║   │   Background: #8BAC0F (Lime)
│   ║  └─────────────────────┘  ║   │   Text: #0F380F (Deep forest)
│   ║                           ║   │
│   ║  Complete a quick         ║   │
│   ║  training session to      ║   │ ← Description Text
│   ║  unlock your first        ║   │   Font: Montserrat, 14px
│   ║  battle!                  ║   │   Color: #0F380F
│   ║                           ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │ REWARD:           │    ║   │ ← Reward Preview
│   ║  │ ⚡ Battle Unlock   │    ║   │   Border: #306230, 2px
│   ║  │ +50 XP            │    ║   │   Background: #8BAC0F
│   ║  └───────────────────┘    ║   │
│   ║                           ║   │
│   ╚═══════════════════════════╝   │
│                                     │
│   ┌───────────────────────────┐   │
│   │   START WORKOUT           │   │ ← Primary CTA Button
│   │         ▶                 │   │   Touch: Full width × 56dp
│   └───────────────────────────┘   │   Background: #8BAC0F (Lime)
│                                     │   Border: #0F380F, 4px
└─────────────────────────────────────┘
```

---

## Component Specifications

### 1. Screen Background
```typescript
{
  flex: 1,
  backgroundColor: '#9BBC0F',      // Neon grass glow
  paddingVertical: 24,
}
```

### 2. Training Card Container
```typescript
{
  backgroundColor: '#9BBC0F',      // Neon grass glow
  borderWidth: 4,
  borderColor: '#306230',          // Pine border
  borderRadius: 0,                 // MANDATORY: No rounded corners
  padding: 16,
  marginHorizontal: 24,
  marginTop: 80,
  shadowColor: '#0F380F',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,                 // MANDATORY: Hard pixel shadow
}
```

### 3. Training Title
```typescript
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 16,
  lineHeight: 20,
  color: '#0F380F',                // Deep forest
  marginBottom: 12,
  textAlign: 'center',
}
```

### 4. Workout Type Badge
```typescript
{
  backgroundColor: '#8BAC0F',      // Lime highlight
  borderWidth: 2,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  paddingHorizontal: 12,
  paddingVertical: 8,
  alignSelf: 'center',
  marginBottom: 16,
}

// Badge Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
  textAlign: 'center',
}
```

### 5. Description Text
```typescript
{
  fontFamily: 'Montserrat',
  fontSize: 14,
  lineHeight: 20,
  color: '#0F380F',
  textAlign: 'center',
  marginBottom: 16,
}
```

### 6. Reward Preview Box
```typescript
{
  backgroundColor: '#8BAC0F',      // Lime highlight
  borderWidth: 2,
  borderColor: '#306230',          // Pine border
  borderRadius: 0,                 // MANDATORY: No rounded corners
  padding: 12,
  marginBottom: 20,
}

// Reward Text
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  lineHeight: 16,
  color: '#0F380F',
}
```

### 7. Start Workout Button (Primary CTA)
```typescript
{
  backgroundColor: '#8BAC0F',      // Lime highlight
  borderWidth: 4,
  borderColor: '#0F380F',          // Deep forest
  borderRadius: 0,                 // MANDATORY: No rounded corners
  paddingVertical: 16,
  paddingHorizontal: 24,
  marginHorizontal: 24,
  marginTop: 20,
  minHeight: 56,                   // MANDATORY: Touch target
  shadowColor: '#0F380F',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,                 // MANDATORY: Hard pixel shadow
}

// Button Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  color: '#0F380F',
  textAlign: 'center',
}

// Touch Target: Full width × 56dp ✅ (exceeds 44×44dp minimum)
```

---

## Usability Compliance

> **Reference**: front-end-spec.md "Usability Traps Prevention" section

### Trap 1: Information Density ✅
- **Compliance**: Workout details visible at a glance
- **Implementation**: Duration (60s), reward type, XP value all shown upfront

### Trap 2: AI Summaries ✅
- **Compliance**: No AI-generated content
- **Implementation**: Static, predefined quest description

### Trap 3: Punishment Mechanics ✅
- **Compliance**: No negative consequences presented
- **Implementation**:
  - No timer pressure on this screen
  - No "you must" language - positive framing only
  - Reward-focused messaging

### Trap 4: Onboarding Overload ✅
- **Compliance**: Single action required - one button
- **Implementation**: Minimal text, clear CTA, no tutorial overlay here

### Trap 5: Feature Labyrinths ✅
- **Compliance**: Linear flow, no side navigation
- **Implementation**: One path forward: tap START WORKOUT

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| START WORKOUT Button | Full width × 56dp | Full width × 56dp | ✅ |
| Training Card | Non-interactive | N/A | N/A |
| Back Button (if present) | 44×44dp | 44×44dp | ✅ |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Screen title
accessibilityLabel="Tutorial workout assignment screen"
accessibilityRole="header"

// Training card
accessibilityLabel="First training: Power up for battle. Tutorial workout, 60 seconds. Reward: Battle unlock and 50 XP."
accessibilityRole="text"

// Start button
accessibilityLabel="Start workout"
accessibilityRole="button"
accessibilityHint="Double tap to begin your first tutorial workout"
```

### Focus Order
1. Header (informational)
2. Training Card (informational)
3. START WORKOUT Button

### Reduce Motion Support
```typescript
const prefersReducedMotion = useReducedMotion();

// Entry animation
const entryAnimation = prefersReducedMotion
  ? null  // Instant display
  : slideUpAnimation;

// Button press animation
const buttonScale = prefersReducedMotion
  ? 1
  : 0.96;
```

### Color Contrast Verification

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Quest title | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Description text | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Badge text | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |
| Reward text | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |
| Button text | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |

---

## Animations & Transitions

### Entry Animation
```typescript
// Training card slides up from bottom (respects Reduce Motion)
const entryAnimation = () => {
  if (prefersReducedMotion) return;

  Animated.timing(translateY, {
    toValue: 0,
    duration: 300,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();
};

// Button fades in after card settles
setTimeout(() => {
  Animated.timing(buttonOpacity, {
    toValue: 1,
    duration: 200,
    useNativeDriver: true,
  }).start();
}, 200);
```

### Button Press
```typescript
// Pressed state (respects Reduce Motion)
const pressedStyle = {
  transform: [{ scale: prefersReducedMotion ? 1 : 0.96 }],
  shadowOffset: { width: 2, height: 2 },  // Shadow reduces
};

// Haptic: Medium impact
Haptics.impact(Haptics.ImpactFeedbackStyle.Medium);

// Sound: 8-bit "blip"
SoundManager.play('button_blip');
```

### Exit Animation
```typescript
// Simple fade transition to FTUE Workout Video (Party Mode 2026-01-05)
// NOTE: Cartridge Load animation is ONLY for post-onboarding workouts
// NOTE: FTUE uses passive video clip, NOT interactive workout tracker
const exitAnimation = () => {
  if (prefersReducedMotion) {
    navigation.navigate('FTUEWorkoutVideo');
    return;
  }

  // Simple fade transition for FTUE
  Animated.timing(opacity, {
    toValue: 0,
    duration: 200,
    useNativeDriver: true,
  }).start(() => {
    navigation.navigate('FTUEWorkoutVideo');
  });
};
```

---

## State Variations

### Default State
- As shown in wireframe above

### Loading State (if workout data fetching)
```
┌─────────────────────────────────────┐
│                                     │
│   ╔═══════════════════════════╗   │
│   ║                           ║   │
│   ║      Loading workout...   ║   │
│   ║                           ║   │
│   ║      [Pixel spinner]      ║   │
│   ║                           ║   │
│   ╚═══════════════════════════╝   │
│                                     │
└─────────────────────────────────────┘
```

---

## Edge Cases & Error Handling

### No Active Workout
- Should not occur in FTUE (workout auto-assigned)
- Fallback: Show generic "Get Ready!" message

### User Taps Back (Android)
```
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗   │
│   ║ Skip tutorial?            ║   │
│   ║                           ║   │
│   ║ You can replay it later   ║   │
│   ║ from Settings.            ║   │  ← No guilt messaging
│   ║                           ║   │
│   ║ ┌───────────────────────┐ ║   │
│   ║ │   CONTINUE TUTORIAL   │ ║   │  ← Touch: 44dp height
│   ║ └───────────────────────┘ ║   │
│   ║ ┌───────────────────────┐ ║   │
│   ║ │   SKIP                │ ║   │  ← Touch: 44dp height
│   ║ └───────────────────────┘ ║   │
│   ╚═══════════════════════════╝   │
└─────────────────────────────────────┘
```

---

## Implementation Notes

### Data Source
```typescript
// Tutorial workout is hardcoded for FTUE
const tutorialWorkout = {
  id: 'tutorial-001',
  title: 'FIRST TRAINING',
  type: 'TUTORIAL WORKOUT',
  duration: 60, // seconds
  description: 'Complete a quick training session to unlock your first battle!',
  reward: {
    type: 'battle_unlock',
    xp: 50,
  },
};
```

### Navigation
```typescript
// On "START WORKOUT" press
// NOTE: Uses simple fade transition (NOT Cartridge Load - that's for post-onboarding only)
// NOTE: FTUE navigates to passive video screen, NOT interactive workout tracker (Party Mode 2026-01-05)
navigation.navigate('FTUEWorkoutVideo', {
  workoutId: 'tutorial-001',
  isTutorial: true,
  defaultChampion: 'sean', // Default champion for tutorial (no selection screen in FTUE)
});
```

---

## Navigation

### Entry Points
- From Archetype Selection Screen (FTUE)
- **Note:** Combat Character Selection has been removed from FTUE (Party Mode 2025-12-29)

### Exit Points
- To **FTUE Workout Video Screen** (on START WORKOUT) - via simple fade
- To Home Dashboard (if skipped - not recommended)

> **FTUE Video Update (Party Mode 2026-01-05):** Next screen is now a passive video (~8-12s pixel animation), NOT an interactive workout tracker. See [video-asset-specifications.md](../design-system/video-asset-specifications.md).

---

## Related Screens

- **Previous**: Archetype Selection Screen
- **Next**: FTUE Workout Video Screen (passive video, ~8-12s)
- **Flow**: FTUE Phase 1 - Core Loop (Screen 3 of 8)
- **Deprecated**: Combat Character Selection (was Screen 3, now removed from FTUE)
- **Deprecated**: Simulated Workout Tracker (replaced with FTUE Workout Video)

---

## Design System Compliance Checklist

- [x] Only 4 LCD colors used
- [x] No border radius (`borderRadius: 0`)
- [x] Hard pixel shadows (`shadowRadius: 0`)
- [x] No gradients
- [x] Typography: Press Start 2P (headers/badges) + Montserrat (body)
- [x] All touch targets ≥ 44×44dp
- [x] Screen reader labels on all elements
- [x] Reduce Motion preference respected
- [x] Usability Traps Prevention addressed
- [x] No punishment mechanics (positive framing)
- [x] Minimal cognitive load (single action)

---

**Priority**: CRITICAL - Blocks FTUE flow
**Target Duration**: ~10 seconds (user reads and taps)
**FTUE Position**: Screen 3 of 8 (Core Loop)
**Estimated Implementation**: 3-4 hours
**Transition**: Simple fade to FTUE Workout Video (NOT Cartridge Load, NOT interactive tracker)

---

## Version History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-11-30 | Initial wireframe spec | Sally (UX) |
| 2.0 | 2025-12-31 | Party Mode alignment: Renamed from Quest to Training, removed character selection from FTUE | Sally (UX) |
| 3.0 | 2025-12-31 | Updated navigation to SimulatedWorkoutTracker | Sally (UX) |
| 3.1 | 2026-01-05 | **FTUE Video Update:** Changed next screen from SimulatedWorkoutTracker to FTUEWorkoutVideo. FTUE now uses passive video (~8-12s) instead of interactive tracker. | Paige (Tech Writer) |
