# Workout Complete Ceremony Screen - Wireframe Specification

**Screen ID**: CEREMONY-01
**Batch**: 1 (CRITICAL - MVP Blocking)
**Status**: ✅ Spec Complete
**Design Date**: 2025-11-30
**Last Updated**: 2026-01-05
**Spec Version**: 3.1 (FTUE Video Update Aligned)

---

## Party Mode Alignment (2025-12-29)

### Key Changes in This Version
- ✅ "Quest" → "Training" / "Workout" in messaging
- ✅ No "Quest Incomplete" shaming - neutral messaging
- ✅ Battle Ticket awarded when daily workout is complete
- ✅ Primary CTA: "CONTINUE" (Daily Loop only)

---

## FTUE Video Update (2026-01-05)

> ⚠️ **IMPORTANT: This screen is NOT used during FTUE.**
>
> As of Party Mode 2026-01-05, the FTUE flow uses a **passive video clip** that auto-advances directly to the Battle Mode Transition Video. The Workout Complete Ceremony is skipped in FTUE.
>
> | Context | Flow |
> |---------|------|
> | **FTUE (Onboarding)** | FTUE Workout Video → Battle Mode Transition Video → Tutorial Battle |
> | **Daily Loop (Post-Onboarding)** | Workout Tracker → This Ceremony Screen → Home Dashboard |
>
> **Rationale:** The FTUE needs to get users to the "aha moment" (first battle) as quickly as possible. The ceremony adds friction during onboarding but is valuable for the daily engagement loop.
>
> See [user-flow-diagram.md](./user-flow-diagram.md) for complete flow details.

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

Celebrate workout completion, award XP and Battle Ticket, and provide **positive-only reinforcement**. This "ceremony" screen creates a rewarding moment in the core loop. **Raw workout data always visible** - never hidden behind taps.

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
│   ╔═══════════════════════════╗   │
│   ║                           ║   │
│   ║   WORKOUT COMPLETE!       ║   │ ← Header
│   ║                           ║   │   Font: Press Start 2P, 16px
│   ╚═══════════════════════════╝   │   Color: #0F380F
│                                     │
│                                     │
│   ┌───────────────────────────┐   │
│   │  ⚡ +50 XP                │   │ ← XP Reward
│   │                           │   │   Background: #8BAC0F (Lime)
│   │  [Progress bar animation] │   │   Border: #0F380F, 2px
│   │  Level 1 ▓▓▓▓░░░░ 50/100  │   │   RAW DATA VISIBLE
│   └───────────────────────────┘   │
│                                     │
│   ┌───────────────────────────┐   │
│   │  🎟 +1 BATTLE TICKET      │   │ ← Ticket Reward
│   │                           │   │   Background: #8BAC0F
│   │  [Ticket icon animation]  │   │   Border: #306230, 2px
│   └───────────────────────────┘   │   Bounce animation
│                                     │
│                                     │
│   ╔═══════════════════════════╗   │
│   ║  WORKOUT STATS            ║   │ ← Stats Summary
│   ║  ─────────────────────    ║   │   RAW DATA ALWAYS VISIBLE
│   ║  Duration:    5:12        ║   │   Border: #306230, 4px
│   ║  Steps:       487         ║   │   Font: Montserrat, 12px
│   ║  Calories:    42          ║   │
│   ╚═══════════════════════════╝   │
│                                     │
│                                     │
│   ┌───────────────────────────┐   │
│   │     TO BATTLE! ▶          │   │ ← Primary CTA (FTUE)
│   └───────────────────────────┘   │   Touch: Full width × 52dp
│                                     │   OR "CONTINUE" (Daily Loop)
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

### 2. Header Container
```typescript
{
  backgroundColor: '#9BBC0F',      // Neon grass
  borderWidth: 4,
  borderColor: '#306230',          // Pine border
  borderRadius: 0,                 // MANDATORY: No rounded corners
  paddingVertical: 16,
  paddingHorizontal: 24,
  marginHorizontal: 24,
  marginTop: 40,
  marginBottom: 24,
  alignItems: 'center',
}

// Header Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 16,
  lineHeight: 20,
  color: '#0F380F',
  textAlign: 'center',
}
```

### 3. XP Reward Card
```typescript
{
  backgroundColor: '#8BAC0F',      // Lime highlight
  borderWidth: 2,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  padding: 16,
  marginHorizontal: 24,
  marginBottom: 16,
}

// XP Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 14,
  color: '#0F380F',
  marginBottom: 8,
}

// Progress Bar Container
{
  backgroundColor: '#9BBC0F',      // Neon grass (empty state)
  borderWidth: 2,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  height: 20,
  marginTop: 8,
}

// Progress Bar Fill (Animated)
{
  backgroundColor: '#0F380F',      // Deep forest (filled state)
  height: '100%',
  width: '50%',                    // Animates from 0% to target
}

// Progress Text (RAW DATA)
{
  fontFamily: 'Montserrat',
  fontSize: 10,
  color: '#0F380F',
  marginTop: 4,
}
```

### 4. Battle Ticket Card
```typescript
{
  backgroundColor: '#8BAC0F',      // Lime highlight
  borderWidth: 2,
  borderColor: '#306230',          // Pine border
  borderRadius: 0,                 // MANDATORY: No rounded corners
  padding: 16,
  marginHorizontal: 24,
  marginBottom: 24,
  alignItems: 'center',
}

// Ticket Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  color: '#0F380F',
}

// Ticket Icon (Pixel Art)
// Animated: scale bounce (1.0 → 1.2 → 1.0, 300ms)
// Respects Reduce Motion preference
```

### 5. Stats Summary Box
```typescript
{
  backgroundColor: '#9BBC0F',      // Neon grass
  borderWidth: 4,
  borderColor: '#306230',          // Pine border
  borderRadius: 0,                 // MANDATORY: No rounded corners
  padding: 16,
  marginHorizontal: 24,
  marginBottom: 24,
}

// Stats Title
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
  marginBottom: 8,
  borderBottomWidth: 2,
  borderBottomColor: '#306230',
  paddingBottom: 4,
}

// Stats Row
{
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 4,
}

// Stats Label
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#306230',              // Pine (muted)
}

// Stats Value (RAW DATA)
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  fontWeight: '600',
  color: '#0F380F',              // Deep forest
}
```

### 6. Primary CTA Button
```typescript
{
  backgroundColor: '#8BAC0F',      // Lime highlight
  borderWidth: 4,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  paddingVertical: 16,
  marginHorizontal: 24,
  marginBottom: 12,
  minHeight: 52,                   // MANDATORY: Touch target
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

// Touch Target: Full width × 52dp ✅ (exceeds 44×44dp minimum)
```

---

## Usability Compliance

> **Reference**: front-end-spec.md "Usability Traps Prevention" section

### Trap 1: Information Density ✅
- **Compliance**: Raw workout data always visible (Duration, Steps, Calories)
- **Implementation**: Stats box shows all data without needing to tap

### Trap 2: AI Summaries ✅
- **Compliance**: No AI interpretation of workout
- **Implementation**: Raw numbers displayed as-is from HealthKit/simulated data

### Trap 3: Punishment Mechanics ✅
- **Compliance**: Celebration only - no negative feedback
- **Implementation**:
  - No "you could have done more" messaging
  - No comparison to previous workouts
  - No "Workout Incomplete" shaming - just state fact neutrally
  - Every workout is celebrated

### Trap 4: Onboarding Overload ✅
- **Compliance**: Simple, linear flow - one button action
- **Implementation**: View rewards → CONTINUE/TO BATTLE → Next screen

### Trap 5: Feature Labyrinths ✅
- **Compliance**: Single primary exit path
- **Implementation**: One clear CTA button

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| TO BATTLE/CONTINUE Button | Full width × 52dp | Full width × 52dp | ✅ |
| XP Card | Variable | Non-interactive | N/A |
| Ticket Card | Variable | Non-interactive | N/A |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Screen announcement
accessibilityLabel="Workout complete! Congratulations."
accessibilityRole="alert"

// XP reward
accessibilityLabel={`You earned ${xpGained} experience points. Level ${currentLevel}, ${currentXP} of ${xpToNextLevel} to next level.`}
accessibilityRole="text"

// Battle ticket
accessibilityLabel={`You earned ${ticketCount} battle ticket.`}
accessibilityRole="text"

// Stats summary
accessibilityLabel={`Workout stats: Duration ${duration}. Steps ${steps}. Calories ${calories}.`}
accessibilityRole="text"

// Primary button
accessibilityLabel={isFTUE ? "Go to battle" : "Continue to home"}
accessibilityRole="button"
accessibilityHint={isFTUE ? "Double tap to start your first battle" : "Double tap to return home"}
```

### Focus Order
1. Header (announcement)
2. XP Reward Card
3. Battle Ticket Card
4. Stats Summary
5. Primary CTA Button

### Reduce Motion Support
```typescript
const prefersReducedMotion = useReducedMotion();

// Entry animation
const entryAnimations = prefersReducedMotion
  ? null  // Show final state immediately
  : staggeredEntrySequence;

// Progress bar animation
const progressAnimation = prefersReducedMotion
  ? { width: finalWidth }  // Instant
  : Animated.timing(width, { toValue: finalWidth, duration: 500 });

// Ticket bounce
const ticketBounce = prefersReducedMotion
  ? null  // No bounce
  : bounceAnimation;
```

### Color Contrast Verification

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Header text | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| XP text | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |
| Stats label | #306230 | #9BBC0F | 2.8:1 | ⚠️ Large only |
| Stats value | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Button text | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |

---

## Animations & Micro-interactions

### Entry Animation (Sequential)
```typescript
// All animations respect Reduce Motion preference
const runEntryAnimations = () => {
  if (prefersReducedMotion) {
    setAllVisible(true);
    return;
  }

  // 1. Header slides down (200ms, ease-out)
  Animated.timing(headerY, {
    toValue: 0,
    duration: 200,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();

  // 2. XP Card fades in + progress bar animates (500ms)
  setTimeout(() => {
    Animated.parallel([
      Animated.timing(xpOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.timing(progressWidth, {
        toValue: earnedPercentage,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  }, 200);

  // 3. Ticket Card bounces in (300ms, spring)
  setTimeout(() => {
    Animated.sequence([
      Animated.timing(ticketScale, { toValue: 1.2, duration: 150, useNativeDriver: true }),
      Animated.timing(ticketScale, { toValue: 1.0, duration: 150, useNativeDriver: true }),
    ]).start();
  }, 700);

  // 4. Stats Box fades in (200ms)
  setTimeout(() => {
    Animated.timing(statsOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  }, 1000);

  // 5. Button fades in (200ms)
  setTimeout(() => {
    Animated.timing(buttonOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
  }, 1200);

  // Total animation time: ~1.4 seconds
};
```

### Sound Effects
```typescript
// Play success jingle on screen entry
SoundManager.play('workout_complete_jingle');

// Play XP gain sound during progress bar animation
SoundManager.play('xp_gain');

// Play ticket award sound
SoundManager.play('ticket_award');
```

### Button Press
```typescript
// Pressed state (respects Reduce Motion)
const pressedStyle = {
  transform: [{ scale: prefersReducedMotion ? 1 : 0.96 }],
  shadowOffset: { width: 2, height: 2 },
};

// Haptic: Medium impact
Haptics.impact(Haptics.ImpactFeedbackStyle.Medium);

// Sound: 8-bit "success" jingle
SoundManager.play('button_success');
```

---

## State Variations

### ~~FTUE Version (Tutorial Complete)~~ - DEPRECATED

> ⚠️ **FTUE Video Update (2026-01-05):** This state is no longer used. FTUE now uses passive video that auto-advances to battle without showing this ceremony screen.

### Daily Loop Version (Real Workout)
```
Primary Button: "CONTINUE"
Stats: Real HealthKit/Connect data
XP: Variable based on duration/intensity
Ticket: +1 (if daily workout complete)
```

### Data Sync Failure (Neutral, Not Punitive)
```
Stats Summary shows:
Duration: 5:12 ✓
Steps: -- (syncing)
Calories: -- (syncing)

// Still award XP based on duration
// Show subtle info icon (NOT warning)
// Message: "Some data still syncing"
```

---

## Edge Cases & Error Handling

### Data Sync Failure
- XP still awarded based on duration (what we know)
- Show dashes for unavailable data
- No error messaging that implies user failure

### No Ticket Earned (Workout Goals Not Met)
- Simply don't show ticket card
- No "Workout Incomplete" shaming message
- User still gets XP for effort

---

## Implementation Notes

### Reward Calculation
```typescript
interface WorkoutRewards {
  xp: number;
  battleTicket: boolean;
  stats: {
    duration: number;      // seconds
    steps?: number;
    calories?: number;
  };
}

const calculateRewards = (workout: Workout): WorkoutRewards => {
  // XP formula (positive only - no penalties)
  const baseXP = 50;
  const durationBonus = Math.floor(workout.duration / 60) * 10;
  const xp = baseXP + durationBonus;

  // Ticket awarded if daily workout goals are met
  const battleTicket = workout.goalsComplete;

  return { xp, battleTicket, stats: workout.stats };
};
```

### Database Update
```typescript
// Update user profile with rewards
await supabase
  .from('user_profiles')
  .update({
    evolution_progress: currentProgress + rewards.xp,
    last_activity_date: new Date().toISOString(),
  })
  .eq('id', userId);

// Log workout (for analytics, not punishment)
await supabase
  .from('workout_logs')
  .insert({
    user_id: userId,
    duration_minutes: Math.floor(rewards.stats.duration / 60),
    workout_type: workoutType,
    evolution_points_gained: rewards.xp,
  });
```

---

## Navigation

### Entry Points
- From Workout Tracker Screen (on "STOP" → confirmed) - **Daily Loop only**

### Exit Points (FTUE) - DEPRECATED
> ⚠️ **FTUE Video Update (2026-01-05):** FTUE no longer uses this screen. FTUE Workout Video auto-advances directly to Battle Mode Transition Video.

### Exit Points (Daily Loop)
- To Home Dashboard

---

## Related Screens

- **Previous**: Workout Tracker Screen (Daily Loop only)
- **Next (FTUE)**: N/A - FTUE skips this screen (2026-01-05 update)
- **Next (Daily)**: Home Dashboard
- **Flow**: Daily Engagement Loop only (not FTUE)

---

## Design System Compliance Checklist

- [x] Only 4 LCD colors used
- [x] No border radius (`borderRadius: 0`)
- [x] Hard pixel shadows (`shadowRadius: 0`)
- [x] No gradients
- [x] Typography: Press Start 2P (headers) + Montserrat (stats)
- [x] All touch targets ≥ 44×44dp
- [x] Screen reader labels on all elements
- [x] Reduce Motion preference respected
- [x] Raw numerical data always visible
- [x] No punishment mechanics (celebration only)
- [x] Graceful handling of missing data

---

**Priority**: CRITICAL - Positive reinforcement for daily loop
**Target Duration**: ~5 seconds (view + continue)
**FTUE Position**: N/A - FTUE skips this screen (uses passive video → battle)
**Daily Loop Position**: After Workout Tracker → Before Home Dashboard
**Estimated Implementation**: 4-6 hours
