# Cartridge Load Transition - Wireframe Specification

**Screen ID**: TRANSITION-01
**Batch**: 2 (HIGH - Core Loop Functionality)
**Status**: ✅ Spec Complete
**Design Date**: 2025-11-30
**Last Updated**: 2025-12-31
**Spec Version**: 3.1 (Party Mode Aligned)

---

> ## ⚠️ USAGE RESTRICTION (Party Mode 2025-12-29)
>
> **This transition is ONLY for post-onboarding WORKOUT entry.**
>
> | Context | Transition Used |
> |---------|-----------------|
> | FTUE Simulated Workout → Tutorial Battle | **Simple fade** (NOT this) |
> | Home → Training Menu → Workout | **Cartridge Load Animation** (this) |
> | Entering Battle Mode (any context) | **Battle Mode Transition Video** (NOT this) |
> | Exiting Battle Mode | **Battle Mode Transition Video** (NOT this) |
>
> See [user-flow-diagram.md](./user-flow-diagram.md) for complete transition architecture.

---

## Changelog

### v3.0 (2025-12-29)
- **CHANGED:** Scope restricted to **post-onboarding workout selection ONLY**
- **CHANGED:** Label changed from "BATTLE MODE" to "TRAINING" with dumbbell icon
- **CHANGED:** Duration reduced from ~1.5s to ~1.0s (faster, snappier)
- **REMOVED:** Orientation change to landscape (workouts remain portrait)
- **CLARIFIED:** This animation does NOT play during FTUE/onboarding
- **CLARIFIED:** Battle Mode entry uses separate Transition Video, not cartridge animation

---

## Design System Compliance

> **Reference Document**: `docs/front-end-spec.md` v2.0
>
> This wireframe adheres to all MANDATORY DESIGN REQUIREMENTS including:
> - ✅ Dual Palette System (LCD 4-color only for transition)
> - ✅ Typography Separation (Press Start 2P only)
> - ✅ 44×44dp minimum touch targets (for error states)
> - ✅ WCAG 2.1 AA accessibility compliance
> - ✅ Usability Traps Prevention guidelines

---

## Scope & Usage

> **IMPORTANT:** This Cartridge Load Transition is **ONLY** used for:
>
> ✅ **Post-onboarding workout/training selection** (Home → Training → Workout)
>
> ❌ **NOT used for:**
> - FTUE/Onboarding simulated workout demo
> - Battle Mode entry (uses Battle Mode Transition Video instead)
> - Evolution ceremonies
> - Any onboarding screens

---

## Purpose

Create a quick, satisfying Game Boy-style cartridge insertion animation when selecting a workout from the Training menu. This brief transition (~1 second) reinforces the retro aesthetic without interrupting flow. **Respects Reduce Motion preferences** for accessibility.

---

## Animation Sequence

### Total Duration: ~1.0 second (instant for Reduce Motion)

```
FRAME 1 (0ms - 250ms): Cartridge Slide-In
┌─────────────────────────────────────┐
│  LCD SCREEN (329×584pt)             │
│  Background: #9BBC0F                │
├─────────────────────────────────────┤
│                                     │
│                                     │
│         ┌─────────────────┐         │
│         │  [CARTRIDGE]    │ ←──────┤ Slides in from right
│         │  🏋️ TRAINING    │         │ 250ms ease-out
│         │  ▓▓▓▓▓▓▓▓▓▓▓▓   │         │ Dumbbell icon
│         └─────────────────┘         │
│                                     │
│                                     │
└─────────────────────────────────────┘

FRAME 2 (250ms - 500ms): Cartridge Insert
┌─────────────────────────────────────┐
│                                     │
│         ┌─────────────────┐         │
│         │  [CARTRIDGE]    │         │ Moves down into "slot"
│         │  🏋️ TRAINING    │         │ 250ms ease-in
│         │  ▓▓▓▓▓▓▓▓▓▓▓▓   │ ↓       │
│         └─────────────────┘         │
│         ═══════════════════         │ ← Slot indicator
│                                     │
└─────────────────────────────────────┘

FRAME 3 (500ms - 700ms): Screen Flash
┌─────────────────────────────────────┐
│  SCREEN FLASH (#9BBC0F → #0F380F)   │ Flash effect
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ 200ms
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │ Uses DMG colors only
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓ │
└─────────────────────────────────────┘

FRAME 4 (700ms - 1000ms): Loading Text
┌─────────────────────────────────────┐
│  Background: #0F380F (Deep forest)  │
│                                     │
│                                     │
│         STARTING WORKOUT...         │ Pixel text
│                                     │ Font: Press Start 2P, 14px
│         ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓           │ Loading bar (quick fill)
│                                     │ Animates 700ms → 1000ms
│                                     │
└─────────────────────────────────────┘

→ WORKOUT SCREEN LOADS (portrait, same orientation)
```

> **Note:** No orientation change - workouts remain in portrait mode.
> Battle Mode uses a separate Transition Video for landscape entry.

---

## Component Specifications

### 1. Screen Background
```typescript
{
  flex: 1,
  backgroundColor: '#9BBC0F',      // Neon grass glow
  justifyContent: 'center',
  alignItems: 'center',
}
```

### 2. Cartridge Graphic
```typescript
// SVG or Image asset
{
  width: 200,
  height: 120,
  // Pixel art cartridge design
  // Colors: DMG palette ONLY
}

// Cartridge Label
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
  textAlign: 'center',
}
```

### 3. Slot Indicator
```typescript
{
  width: 220,
  height: 8,
  backgroundColor: '#306230',      // Pine border
  borderWidth: 2,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  alignSelf: 'center',
}
```

### 4. Flash Overlay
```typescript
{
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: '#8BAC0F',      // Lime (NOT white - stays in palette)
}

// Animated opacity: 0 → 1 → 0
```

### 5. Loading Screen
```typescript
{
  flex: 1,
  backgroundColor: '#0F380F',      // Deep forest (inverted)
  justifyContent: 'center',
  alignItems: 'center',
}

// Loading Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 14,
  color: '#9BBC0F',                // Neon grass (inverted)
  marginBottom: 20,
}

// Loading Bar Container
{
  width: 240,
  height: 20,
  backgroundColor: '#306230',      // Pine border (empty)
  borderWidth: 2,
  borderColor: '#9BBC0F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
}

// Loading Bar Fill (Animated)
{
  backgroundColor: '#9BBC0F',      // Neon grass (filled)
  height: '100%',
  width: '0%',                     // Animates 0% → 100%
}
```

---

## Usability Compliance

> **Reference**: front-end-spec.md "Usability Traps Prevention" section

### Trap 1: Information Density ✅
- **Compliance**: Simple loading screen with clear messaging
- **Implementation**: "LOADING BATTLE..." text only

### Trap 2: AI Summaries ✅
- **Compliance**: No AI content
- **Implementation**: Static loading message

### Trap 3: Punishment Mechanics ✅
- **Compliance**: No failure states shown as user fault
- **Implementation**: Error states are neutral ("Unable to load")

### Trap 4: Onboarding Overload ✅
- **Compliance**: Brief, purposeful transition
- **Implementation**: 1.5 seconds maximum

### Trap 5: Feature Labyrinths ✅
- **Compliance**: Linear transition, no side paths
- **Implementation**: Automatic flow to Battle Screen

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| RETRY Button (error) | Full width × 48dp | Full width × 48dp | ✅ |
| CANCEL Button (error) | Full width × 48dp | Full width × 48dp | ✅ |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Loading state
accessibilityLabel="Loading battle. Please wait."
accessibilityRole="alert"
accessibilityLiveRegion="polite"

// Error state
accessibilityLabel="Failed to load battle. Would you like to retry?"
accessibilityRole="alert"
```

### Reduce Motion Support
```typescript
const prefersReducedMotion = useReducedMotion();

if (prefersReducedMotion) {
  // Skip all animations - instant transition
  setShowLoading(true);
  await preloadBattleAssets();
  await ScreenOrientation.lockAsync(
    ScreenOrientation.OrientationLock.LANDSCAPE_RIGHT
  );
  navigation.navigate('BattleScreen');
} else {
  // Play full animation sequence
  playCartridgeLoadAnimation();
}
```

### Color Contrast Verification

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Loading text | #9BBC0F | #0F380F | 6.5:1 | ✅ AAA |
| Loading bar fill | #9BBC0F | #306230 | 2.8:1 | ⚠️ Decorative |
| Error button | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |

---

## Animation Implementation

### Complete Animation Sequence
```typescript
const playCartridgeLoadAnimation = async (workoutId: string) => {
  // Respect Reduce Motion preference
  if (prefersReducedMotion) {
    // Instant transition - no animation
    await preloadWorkoutAssets(workoutId);
    navigation.navigate('WorkoutScreen', { workoutId });
    return;
  }

  // 1. Cartridge slide-in (0-250ms)
  await Animated.timing(cartridgeX, {
    toValue: 0,
    duration: 250,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();

  // 2. Cartridge insert (250-500ms)
  await Animated.timing(cartridgeY, {
    toValue: 50,
    duration: 250,
    easing: Easing.in(Easing.cubic),
    useNativeDriver: true,
  }).start();

  // Play insert sound
  SoundManager.play('cartridge_insert');

  // Haptic feedback (medium impact)
  Haptics.impact(Haptics.ImpactFeedbackStyle.Medium);

  // 3. Screen flash (500-700ms) - uses DMG color, not white
  await Animated.sequence([
    Animated.timing(flashOpacity, {
      toValue: 1,
      duration: 100,
      useNativeDriver: true,
    }),
    Animated.timing(flashOpacity, {
      toValue: 0,
      duration: 100,
      useNativeDriver: true,
    }),
  ]).start();

  // 4. Show loading screen (700-1000ms)
  setShowLoading(true);

  // Preload workout assets during loading bar
  const preloadPromise = preloadWorkoutAssets(workoutId);

  await Animated.timing(loadingProgress, {
    toValue: 1,
    duration: 300,
    easing: Easing.linear,
    useNativeDriver: false,
  }).start();

  await preloadPromise;

  // 5. Navigate to Workout Screen (stays in portrait)
  navigation.navigate('WorkoutScreen', { workoutId });
};
```

> **Note:** No orientation lock - workouts remain in portrait mode.
> Battle Mode entry uses the Battle Mode Transition Video with landscape orientation.

---

## Sound Effects

### Cartridge Insert Sound
```typescript
// 8-bit mechanical sound
// Duration: ~500ms
// Volume: Medium
SoundManager.play('cartridge_insert', {
  volume: 0.7,
  pitch: 1.0,
});
```

### Loading Sound (Optional)
```typescript
// Retro loading beep
// Duration: ~300ms
// Volume: Low
SoundManager.play('loading_beep', {
  volume: 0.4,
  pitch: 1.2,
});
```

---

## Reverse Animation (Exit Workout)

### Sequence: Workout Complete → Home
```
1. Flash effect (100ms)
2. Show brief loading (200ms) - "WORKOUT COMPLETE!"
3. Cartridge eject animation (300ms)
   - Moves up from slot
   - Slides out to right
4. Return to Home Dashboard
```

```typescript
const playCartridgeEjectAnimation = async () => {
  if (prefersReducedMotion) {
    // Instant transition
    navigation.navigate('Home');
    return;
  }

  // Quick eject animation (~600ms total)
  await flashScreen('#8BAC0F', 100);

  setLoadingText('WORKOUT COMPLETE!');
  await delay(200);

  await Animated.parallel([
    Animated.timing(cartridgeY, {
      toValue: -50,
      duration: 150,
      useNativeDriver: true,
    }),
    Animated.timing(cartridgeX, {
      toValue: 400,
      duration: 300,
      delay: 150,
      useNativeDriver: true,
    }),
  ]).start();

  navigation.navigate('Home');
};
```

> **Note:** Battle Mode exit uses Battle Mode Transition Video, NOT cartridge eject.
> This eject animation is ONLY for workout completion.

---

## State Variations

### Standard Workout Entry
```
┌─────────────────────────────────────┐
│         ┌─────────────────┐         │
│         │  [CARTRIDGE]    │         │
│         │  🏋️ TRAINING    │         │ ← Dumbbell icon + TRAINING
│         │  ▓▓▓▓▓▓▓▓▓▓▓▓   │         │
│         └─────────────────┘         │
│                                     │
│         STARTING WORKOUT...         │ ← Loading text
│         ▓▓▓▓▓▓▓▓░░░░░░░░           │
└─────────────────────────────────────┘
```

### Loading Failed (Error State - Neutral Tone)
```
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗   │
│   ║  LOADING FAILED           ║   │  ← Neutral, not "ERROR"
│   ║                           ║   │
│   ║  Unable to load workout.  ║   │  ← No blame
│   ║                           ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │   RETRY           │    ║   │  ← Touch: 48dp height
│   ║  └───────────────────┘    ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │   GO BACK         │    ║   │  ← Touch: 48dp height
│   ║  └───────────────────┘    ║   │
│   ╚═══════════════════════════╝   │
└─────────────────────────────────────┘
```

---

## Implementation Notes

### Preload Workout Assets
```typescript
// Preload workout assets during transition
const preloadWorkoutAssets = async (workoutId: string) => {
  // Fetch workout data
  const { data: workout } = await supabase
    .from('workouts')
    .select('*')
    .eq('id', workoutId)
    .single();

  // Load workout UI assets
  await Asset.loadAsync([
    require('./assets/ui/workout-timer.png'),
    require('./assets/ui/exercise-icons.png'),
  ]);

  // Load workout audio (if any)
  if (workout?.audio_url) {
    await Audio.Sound.createAsync({ uri: workout.audio_url });
  }

  return workout;
};
```

> **Note:** No orientation lock needed - workouts remain in portrait mode.
> Battle Mode uses separate Transition Video with landscape orientation lock.

---

## Navigation

### Entry Points
- Home Dashboard → Training Menu → Select Workout

### Exit Points
- To Workout Screen (portrait)

### Reverse Entry
- From Workout Screen (on completion)

### Reverse Exit
- To Home Dashboard (with updated stats)

### Flow Diagram

```
Home Dashboard
     │
     └─ [Training Button]
          │
          ▼
     Training Menu
     (List of available workouts)
          │
          └─ [Select Workout Card]
               │
               ▼
          CARTRIDGE LOAD ANIMATION
          (~1 second)
               │
               ▼
          Workout Screen
          (Portrait mode, guided workout)
               │
               └─ [Workout Complete]
                    │
                    ▼
               CARTRIDGE EJECT ANIMATION
               (~0.6 seconds)
                    │
                    ▼
               Home Dashboard
               (Stats updated, avatar reaction)
```

---

## Related Screens

- **Previous**: Training Menu (from Home Dashboard)
- **Next**: Workout Screen
- **Returns to**: Home Dashboard (via eject animation)
- **Flow**: Post-Onboarding Daily Training Loop

> **Important:** This animation is NOT used during FTUE/onboarding.
> Onboarding simulated workout uses simple fade transitions.

---

## Design System Compliance Checklist

- [x] Only 4 LCD colors used (flash uses #8BAC0F, not white)
- [x] No border radius (`borderRadius: 0`)
- [x] Hard pixel shadows (`shadowRadius: 0`)
- [x] No gradients
- [x] Typography: Press Start 2P only
- [x] Touch targets ≥ 44×44dp (error buttons)
- [x] Screen reader labels for loading/error states
- [x] Reduce Motion preference respected (instant transition)
- [x] Thematic and immersive (dumbbell icon + "TRAINING" label)
- [x] Neutral error messaging (no blame)
- [x] Quick duration (~1 second) to minimize interruption
- [x] Stays in portrait mode (no orientation changes)

---

**Priority**: MEDIUM - Post-onboarding workout entry experience
**FTUE Position**: NOT USED during FTUE (onboarding uses simple transitions)
**Post-Onboarding**: Home → Training Menu → Workout
**Estimated Implementation**: 3-4 hours (simplified, no orientation handling)
**Technical Note**: Workout assets only, no Phaser coordination needed
