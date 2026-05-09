# Workout Tracker Screen - Wireframe Specification

**Screen ID**: WORKOUT-01
**Batch**: 1 (CRITICAL - MVP Blocking)
**Status**: ✅ Spec Complete
**Design Date**: 2025-11-30
**Last Updated**: 2026-01-05
**Spec Version**: 3.1 (FTUE Video Update Aligned)

---

## Party Mode Alignment (2025-12-29)

### Key Changes in This Version
- ✅ "Quest" → "Training" / "Workout" in navigation and references
- ✅ Entry from Daily Workout Assignment (Daily Loop)
- ✅ Entry from Home Screen → Training Cartridge (if workout active)

---

## FTUE Video Update (2026-01-05)

> ⚠️ **IMPORTANT: This screen is NOT used during FTUE.**
>
> As of Party Mode 2026-01-05, the FTUE uses a **passive video clip** (8-12 seconds) instead of an interactive workout tracker.
>
> | Context | Screen Used |
> |---------|-------------|
> | **FTUE (Onboarding)** | FTUE Workout Video (passive, ~8-12s) |
> | **Daily Loop (Post-Onboarding)** | This Workout Tracker Screen |
>
> See [user-flow-diagram.md](./user-flow-diagram.md) and [video-asset-specifications.md](../design-system/video-asset-specifications.md) for FTUE video details.

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

Minimalist interface for tracking active workouts with reduced cognitive load. Used in FTUE with simulated data (60s tutorial) and in daily loop with real HealthKit/Health Connect data. **Raw numerical data is always visible** to comply with Usability Trap Prevention guidelines.

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
│                                     │
│         ┌─────────────┐             │
│         │   WORKOUT   │             │ ← Header
│         └─────────────┘             │   Font: Press Start 2P, 12px
│                                     │   Color: #0F380F
│                                     │
│                                     │
│         ╔═══════════╗               │
│         ║           ║               │
│         ║   5:42    ║               │ ← Primary Metric Display
│         ║           ║               │   Font: Press Start 2P, 32px
│         ╚═══════════╝               │   Color: #0F380F
│         DURATION                    │   Border: #306230, 4px
│                                     │
│   ┌─────────────────────────────┐  │
│   │ Steps: 2,847  Cals: 142    │  │ ← RAW DATA ALWAYS VISIBLE
│   └─────────────────────────────┘  │   Font: Montserrat, 14px
│                                     │
│      ┌─────────────────┐            │
│      │   [Avatar]      │            │ ← Optional: Small Home Avatar
│      │   64×64pt       │            │   Idle/active animation
│      └─────────────────┘            │   NEVER shows disappointed
│                                     │
│                                     │
│   ┌─────────────────────────────┐  │
│   │                             │  │
│   │         ⏸ PAUSE            │  │ ← Large Control Button
│   │                             │  │   Touch: Full width × 60dp
│   └─────────────────────────────┘  │   Background: #8BAC0F
│                                     │
│   ┌─────────────────────────────┐  │
│   │         ⏹ STOP              │  │ ← Stop Button
│   └─────────────────────────────┘  │   Touch: Full width × 48dp
│                                     │   Background: #306230
└─────────────────────────────────────┘
```

---

## Component Specifications

### 1. Screen Background
```typescript
{
  flex: 1,
  backgroundColor: '#9BBC0F',      // Neon grass glow
  justifyContent: 'space-between',
  paddingVertical: 40,
}
```

### 2. Header Text
```typescript
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  lineHeight: 16,
  color: '#0F380F',                // Deep forest
  textAlign: 'center',
  marginBottom: 40,
}
```

### 3. Primary Metric Display
```typescript
// Container
{
  backgroundColor: '#9BBC0F',
  borderWidth: 4,
  borderColor: '#306230',          // Pine border
  borderRadius: 0,                 // MANDATORY: No rounded corners
  paddingVertical: 24,
  paddingHorizontal: 32,
  alignSelf: 'center',
  marginBottom: 8,
}

// Metric Value - RAW NUMBER ALWAYS VISIBLE
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 32,
  lineHeight: 40,
  color: '#0F380F',
  textAlign: 'center',
}

// Metric Label
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  lineHeight: 16,
  color: '#306230',
  textAlign: 'center',
  marginTop: 4,
}
```

### 4. Secondary Stats Row (RAW DATA)
```typescript
// Container - Stats ALWAYS visible, never hidden
{
  backgroundColor: '#9BBC0F',
  borderWidth: 2,
  borderColor: '#306230',
  borderRadius: 0,
  paddingVertical: 12,
  paddingHorizontal: 16,
  marginHorizontal: 24,
  marginBottom: 16,
  flexDirection: 'row',
  justifyContent: 'space-around',
}

// Stat Text - Raw numerical values
{
  fontFamily: 'Montserrat',
  fontSize: 14,
  fontWeight: '600',
  color: '#0F380F',
}
```

### 5. Home Avatar (Optional)
```typescript
{
  width: 64,
  height: 64,
  alignSelf: 'center',
  marginVertical: 24,
}

// Animation States:
// - Active: Subtle bounce (POSITIVE only)
// - Paused: Idle blink (NEUTRAL)
// - NEVER: Sad, disappointed, or negative expression
```

### 6. Pause Button (Primary Control)
```typescript
{
  backgroundColor: '#8BAC0F',      // Lime highlight
  borderWidth: 4,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  paddingVertical: 20,
  marginHorizontal: 24,
  marginBottom: 12,
  minHeight: 60,                   // MANDATORY: Touch target
  shadowColor: '#0F380F',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,                 // MANDATORY: Hard pixel shadow
}

// Button Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 14,
  color: '#0F380F',
  textAlign: 'center',
}

// Touch Target: Full width × 60dp ✅ (exceeds 44×44dp minimum)
```

### 7. Stop Button (Secondary Control)
```typescript
{
  backgroundColor: '#306230',      // Pine (muted)
  borderWidth: 2,
  borderColor: '#0F380F',
  borderRadius: 0,
  paddingVertical: 16,
  marginHorizontal: 24,
  minHeight: 48,                   // MANDATORY: Touch target
}

// Button Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  color: '#9BBC0F',                // Inverse
  textAlign: 'center',
}

// Touch Target: Full width × 48dp ✅ (exceeds 44×44dp minimum)
```

---

## Usability Compliance

> **Reference**: front-end-spec.md "Usability Traps Prevention" section

### Trap 1: Information Density ✅
- **Compliance**: Raw data (Duration, Steps, Calories) ALWAYS visible on screen
- **Implementation**: Secondary stats row shows actual numbers without tapping

### Trap 2: AI Summaries ✅
- **Compliance**: No AI summaries during workout - raw data only
- **Implementation**: Numbers are shown as-is from HealthKit/simulated data

### Trap 3: Punishment Mechanics ✅
- **Compliance**: No negative feedback for pausing or slow progress
- **Implementation**:
  - Avatar NEVER shows disappointed expression
  - No "You're behind!" or "Speed up!" messages
  - Pausing is presented neutrally, not as failure

### Trap 4: Onboarding Overload ✅
- **Compliance**: Minimal UI elements during workout
- **Implementation**: Only 4 elements: Timer, Stats Row, Avatar (optional), 2 Buttons

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| Pause Button | Full width × 60dp | Full width × 60dp | ✅ |
| Stop Button | Full width × 48dp | Full width × 48dp | ✅ |
| Primary Metric | Variable | Not interactive | N/A |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Screen title
accessibilityLabel="Workout in progress"

// Primary metric
accessibilityLabel={`Duration: ${minutes} minutes ${seconds} seconds`}
accessibilityRole="timer"
accessibilityLiveRegion="polite"

// Secondary stats
accessibilityLabel={`Steps: ${steps}. Calories: ${calories}.`}

// Pause button
accessibilityLabel={isActive ? "Pause workout" : "Resume workout"}
accessibilityRole="button"
accessibilityHint={isActive ? "Double tap to pause" : "Double tap to resume"}

// Stop button
accessibilityLabel="Stop workout"
accessibilityRole="button"
accessibilityHint="Double tap to end workout and see results"
```

### Focus Order
1. Header (informational)
2. Primary Metric
3. Secondary Stats
4. Pause Button
5. Stop Button

### Reduce Motion Support
```typescript
const prefersReducedMotion = useReducedMotion();

// Avatar animation
const avatarAnimation = prefersReducedMotion
  ? null  // Static image
  : activeAnimation;

// Timer digit transitions
const digitTransition = prefersReducedMotion
  ? 'none'
  : 'smooth';

// Button press animation
const buttonScale = prefersReducedMotion
  ? 1
  : 0.96;
```

### Color Contrast Verification

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Timer text | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Stats text | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Pause button | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |
| Stop button | #9BBC0F | #306230 | 2.8:1 | ⚠️ Large only |

---

## Animations & Micro-interactions

### Timer Count-Up
```typescript
// Updates every second, no flicker
useEffect(() => {
  let interval: NodeJS.Timeout;
  if (isActive) {
    interval = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
  }
  return () => clearInterval(interval);
}, [isActive]);
```

### Button Press Feedback
```typescript
// Pressed state (respects Reduce Motion)
const pressedStyle = {
  transform: [{ scale: prefersReducedMotion ? 1 : 0.96 }],
  shadowOffset: { width: 2, height: 2 },
};

// Haptic: Light impact
Haptics.impact(Haptics.ImpactFeedbackStyle.Light);

// Sound: 8-bit "click"
SoundManager.play('button_click');
```

### Avatar Reactions
```typescript
// POSITIVE/NEUTRAL ONLY - No negative states
const avatarStates = {
  active: 'subtle_bounce',     // Every 5 seconds
  paused: 'idle_blink',        // Neutral, waiting
  nearComplete: 'happy',       // Encouraging
  // NEVER: sad, disappointed, tired, stressed
};
```

---

## State Variations

### State 1: Active (Workout in Progress)
```
Header: "WORKOUT ACTIVE"
Timer: Counting up (0:42 → 0:43 → ...)
Stats: Live updating from HealthKit
Avatar: Subtle bounce animation
Pause Button: "⏸ PAUSE" (visible)
Stop Button: "⏹ STOP" (visible)
```

### State 2: Paused
```
Header: "PAUSED"
Timer: Frozen at current time
Stats: Static (last known values)
Avatar: Idle blink (neutral)
Resume Button: "▶ RESUME" (replaces Pause)
Stop Button: "⏹ STOP" (visible)
```

### State 3: FTUE Tutorial (Simulated Data)
```
Header: "TUTORIAL"
Timer: Counting up to 60s
Stats: Simulated values (fake steps/calories)
Hint: "Keep going! 18s remaining"
Auto-complete: At 60 seconds
Skip Button: Appears after 10 seconds
```

---

## Edge Cases & Error Handling

### HealthKit/Connect Disconnected
```
┌─────────────────────────────────────┐
│   ⚠ HEALTH DATA UNAVAILABLE         │
│                                     │
│   Workout tracked manually.         │
│   Reconnect in Settings for         │
│   auto-sync.                        │
│                                     │
│   ┌─────────────────────────────┐  │
│   │    CONTINUE ANYWAY          │  │
│   └─────────────────────────────┘  │
└─────────────────────────────────────┘

// Duration still tracks
// Steps/Calories show "--"
```

### App Backgrounded Mid-Workout
```typescript
// Save state to AsyncStorage
await AsyncStorage.setItem('activeWorkout', JSON.stringify({
  startTime,
  elapsedSeconds,
  workoutId,
  isTutorial,
}));

// Show notification
Notifications.scheduleNotificationAsync({
  content: { title: 'Workout in progress', body: 'Tap to continue' },
  trigger: null,
});

// Resume on foreground
useEffect(() => {
  const handleAppStateChange = async (state) => {
    if (state === 'active') {
      const saved = await AsyncStorage.getItem('activeWorkout');
      if (saved) restoreWorkout(JSON.parse(saved));
    }
  };
  AppState.addEventListener('change', handleAppStateChange);
}, []);
```

### Stop Confirmation Modal
```
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗   │
│   ║ End workout?              ║   │
│   ║                           ║   │
│   ║ Duration: 5:12            ║   │
│   ║ Steps: 2,847              ║   │
│   ║ Calories: 142             ║   │
│   ║                           ║   │
│   ║ ┌───────────────────────┐ ║   │
│   ║ │   YES, END WORKOUT    │ ║   │  ← Touch: 44dp height
│   ║ └───────────────────────┘ ║   │
│   ║ ┌───────────────────────┐ ║   │
│   ║ │   KEEP GOING          │ ║   │  ← Touch: 44dp height
│   ║ └───────────────────────┘ ║   │
│   ╚═══════════════════════════╝   │
└─────────────────────────────────────┘
```

---

## Implementation Notes

### Timer Logic
```typescript
const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};
```

### FTUE Simulated Data
```typescript
// Tutorial mode: auto-complete at 60s
useEffect(() => {
  if (isTutorial && elapsedSeconds >= 60) {
    handleWorkoutComplete({
      duration: 60,
      steps: 500,        // Simulated
      calories: 25,      // Simulated
      isSimulated: true,
    });
  }
}, [elapsedSeconds, isTutorial]);
```

### Real Workout Data Sync
```typescript
// Sync with HealthKit every 10 seconds
useEffect(() => {
  if (isActive && !isTutorial && isHealthConnected) {
    const syncInterval = setInterval(async () => {
      const data = await HealthKit.getWorkoutData(workoutStartTime);
      setSteps(data.steps);
      setCalories(data.calories);
    }, 10000);
    return () => clearInterval(syncInterval);
  }
}, [isActive, isTutorial, isHealthConnected]);
```

---

## Navigation

### Entry Points
- From Tutorial Workout Assignment (FTUE) - via simple fade
- From Daily Workout Assignment (Daily Loop) - via Cartridge Load Animation
- From Home Screen → Training Cartridge (if workout active)

### Exit Points
- On "STOP" confirmed → Workout Complete Ceremony
- On Back (Android) → Show confirmation modal
- On FTUE auto-complete → Workout Complete Ceremony

---

## Related Screens

- **Previous**: Tutorial Workout Assignment OR Daily Workout Assignment
- **Next**: Workout Complete Ceremony
- **Flow**: FTUE Phase 1 & Daily Engagement Loop

---

## Design System Compliance Checklist

- [x] Only 4 LCD colors used
- [x] No border radius (`borderRadius: 0`)
- [x] Hard pixel shadows (`shadowRadius: 0`)
- [x] No gradients
- [x] Typography: Press Start 2P (headers/labels) + Montserrat (stats)
- [x] All touch targets ≥ 44×44dp
- [x] Screen reader labels on all interactive elements
- [x] Reduce Motion preference respected
- [x] Raw numerical data always visible (Steps, Calories)
- [x] No punishment mechanics (avatar never disappointed)
- [x] Minimal UI (reduced cognitive load)

---

**Priority**: CRITICAL - Core loop functionality (Daily Loop only)
**Target Duration**: Variable (Daily Loop)
**FTUE Position**: N/A - FTUE uses passive video, not this screen
**Daily Loop Position**: After Daily Workout Assignment → Before Workout Complete Ceremony
**Estimated Implementation**: 8-10 hours
