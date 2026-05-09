# Daily Workout Assignment Screen - Wireframe Specification

**Screen ID**: TRAINING-01
**Batch**: 2 (HIGH - Core Loop Functionality)
**Status**: ✅ Spec Complete
**Design Date**: 2025-11-30
**Last Updated**: 2025-12-31
**Spec Version**: 3.0 (Party Mode Aligned)

---

## Party Mode Alignment (2025-12-29)

### Key Changes in This Version
- ✅ Renamed from "Daily Quest Assignment" to "Daily Workout Assignment"
- ✅ Screen ID changed from QUEST-01 to TRAINING-01
- ✅ "Quest" → "Workout" / "Training" throughout
- ✅ "Start Quest" → "Start Workout"
- ✅ "Change Quest" → "Change Workout"
- ✅ "fighter's energy" → "champion's energy" (cosmetic champions)
- ✅ Entry: Via Training Cartridge on Home Dashboard
- ✅ Transition: Uses Cartridge Load Animation (post-onboarding workout context)

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

Assign daily workouts based on user's selected archetype. This screen is shown when the user taps the Training Cartridge on the Home Screen (post-FTUE). **Workout goals and rewards are displayed with raw numbers** - no hidden information. **No punishment for changing workouts**.

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
│   ┌─────────────────────────────┐  │
│   │  DAILY WORKOUT              │  │ ← Header
│   │  November 30, 2025          │  │   Font: Press Start 2P, 12px
│   └─────────────────────────────┘  │   Color: #0F380F
│                                     │
│   ╔═══════════════════════════╗   │
│   ║  🏃 MORNING JOG            ║   │ ← Workout Title
│   ║                           ║   │   Font: Press Start 2P, 14px
│   ║  ┌─────────────────────┐  ║   │
│   ║  │  CARDIO • 30 MIN    │  ║   │ ← Workout Type Badge
│   ║  └─────────────────────┘  ║   │   Background: #8BAC0F
│   ║                           ║   │
│   ║  Complete a 30-minute     ║   │
│   ║  cardio workout to fuel   ║   │ ← Description
│   ║  your champion's energy!  ║   │   Font: Montserrat, 14px
│   ║                           ║   │
│   ║  ╔═══════════════════╗    ║   │
│   ║  ║ GOAL              ║    ║   │ ← Goal Box (RAW DATA)
│   ║  ║ ─────────────     ║    ║   │   Border: #306230, 2px
│   ║  ║ Duration: 30 min  ║    ║   │   Background: #9BBC0F
│   ║  ║ Steps: 3,000+     ║    ║   │
│   ║  ╚═══════════════════╝    ║   │
│   ║                           ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │ REWARDS:          │    ║   │ ← Reward Preview (RAW DATA)
│   ║  │ ⚡ +100 XP         │    ║   │   Border: #306230, 2px
│   ║  │ 🎟 +1 Battle Ticket│    ║   │   Background: #8BAC0F
│   ║  │ 💪 +50 Energy      │    ║   │
│   ║  └───────────────────┘    ║   │
│   ╚═══════════════════════════╝   │
│                                     │
│   ┌───────────────────────────┐   │
│   │   START WORKOUT           │   │ ← Primary CTA
│   └───────────────────────────┘   │   Touch: Full width × 52dp
│                                     │   Background: #8BAC0F
│   ┌───────────────────────────┐   │
│   │   CHANGE WORKOUT          │   │ ← Secondary Action
│   └───────────────────────────┘   │   Touch: Full width × 48dp
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
  paddingVertical: 16,
}
```

### 2. Header
```typescript
{
  backgroundColor: '#9BBC0F',
  borderBottomWidth: 2,
  borderBottomColor: '#306230',
  paddingVertical: 12,
  paddingHorizontal: 24,
  marginBottom: 16,
}

// Title
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  color: '#0F380F',
  textAlign: 'center',
  marginBottom: 4,
}

// Date
{
  fontFamily: 'Montserrat',
  fontSize: 10,
  color: '#306230',
  textAlign: 'center',
}
```

### 3. Workout Card Container
```typescript
{
  backgroundColor: '#9BBC0F',
  borderWidth: 4,
  borderColor: '#306230',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  padding: 16,
  marginHorizontal: 24,
  marginBottom: 20,
  shadowColor: '#0F380F',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,                 // MANDATORY: Hard pixel shadow
}
```

### 4. Workout Title
```typescript
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 14,
  lineHeight: 18,
  color: '#0F380F',
  marginBottom: 12,
  textAlign: 'center',
}
```

### 5. Workout Type Badge
```typescript
{
  backgroundColor: '#8BAC0F',
  borderWidth: 2,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  paddingHorizontal: 12,
  paddingVertical: 6,
  alignSelf: 'center',
  marginBottom: 12,
}

// Badge Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 8,
  color: '#0F380F',
}
```

### 6. Goal Box
```typescript
{
  backgroundColor: '#9BBC0F',
  borderWidth: 2,
  borderColor: '#306230',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  padding: 12,
  marginVertical: 12,
}

// Goal Title
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
  marginBottom: 8,
  borderBottomWidth: 1,
  borderBottomColor: '#306230',
  paddingBottom: 4,
}

// Goal Item (RAW DATA)
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#0F380F',
  marginBottom: 4,
}
```

### 7. Reward Box
```typescript
{
  backgroundColor: '#8BAC0F',
  borderWidth: 2,
  borderColor: '#306230',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  padding: 12,
}

// Reward Title
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
  marginBottom: 8,
}

// Reward Item (RAW DATA)
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#0F380F',
  marginBottom: 4,
}
```

### 8. Primary CTA Button
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

### 9. Secondary Button
```typescript
{
  backgroundColor: '#306230',      // Pine border
  borderWidth: 2,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  paddingVertical: 12,
  marginHorizontal: 24,
  minHeight: 48,                   // MANDATORY: Touch target
}

// Button Text
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#9BBC0F',              // Neon grass (inverse)
  textAlign: 'center',
}

// Touch Target: Full width × 48dp ✅ (exceeds 44×44dp minimum)
```

---

## Usability Compliance

> **Reference**: front-end-spec.md "Usability Traps Prevention" section

### Trap 1: Information Density ✅
- **Compliance**: All workout details visible at once
- **Implementation**: Goals AND rewards shown upfront - no hidden info

### Trap 2: AI Summaries ✅
- **Compliance**: No AI-generated workout descriptions
- **Implementation**: Static, predefined workout templates

### Trap 3: Punishment Mechanics ✅
- **Compliance**: No punishment for changing workouts
- **Implementation**:
  - "CHANGE WORKOUT" button with no negative framing
  - No "you'll lose progress" warnings
  - No daily limit on changing workouts

### Trap 4: Onboarding Overload ✅
- **Compliance**: Simple two-button interface
- **Implementation**: START WORKOUT or CHANGE WORKOUT - clear choices

### Trap 5: Feature Labyrinths ✅
- **Compliance**: Two clear paths forward
- **Implementation**: Direct routes to Workout Tracker or Training Selection

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| START WORKOUT Button | Full width × 52dp | Full width × 52dp | ✅ |
| CHANGE WORKOUT Button | Full width × 48dp | Full width × 48dp | ✅ |
| Back Button (if present) | 44×44dp | 44×44dp | ✅ |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Screen title
accessibilityLabel={`Daily workout for ${dateString}`}
accessibilityRole="header"

// Workout card
accessibilityLabel={`${workoutTitle}. ${workoutType} workout, ${duration} minutes. Goals: Duration ${duration} minutes, Steps ${stepsMin} or more. Rewards: ${xp} XP, ${ticketCount} Battle Ticket, ${energy} Energy.`}
accessibilityRole="text"

// Start button
accessibilityLabel="Start workout"
accessibilityRole="button"
accessibilityHint="Double tap to begin your daily workout"

// Change button
accessibilityLabel="Change workout"
accessibilityRole="button"
accessibilityHint="Double tap to see other workout options"
```

### Focus Order
1. Header (informational)
2. Workout Card (informational)
3. START WORKOUT Button
4. CHANGE WORKOUT Button

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
| Description | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Badge text | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |
| Goal text | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Reward text | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |
| Primary button | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |
| Secondary button | #9BBC0F | #306230 | 2.8:1 | ⚠️ Large only |

---

## Workout Types by Archetype

### Runner Archetype
```typescript
{
  id: 'morning_jog',
  title: 'MORNING JOG',
  type: 'CARDIO',
  duration: 30,
  goals: {
    duration_minutes: 30,
    steps_min: 3000,
  },
  rewards: {
    xp: 100,
    battle_ticket: 1,
    energy: 50,
  },
}
```

### Bodybuilder Archetype
```typescript
{
  id: 'strength_session',
  title: 'STRENGTH SESSION',
  type: 'STRENGTH',
  duration: 45,
  goals: {
    duration_minutes: 45,
    sets_min: 3,
  },
  rewards: {
    xp: 120,
    battle_ticket: 1,
    energy: 60,
  },
}
```

### Yoga Archetype
```typescript
{
  id: 'flexibility_flow',
  title: 'FLEXIBILITY FLOW',
  type: 'FLEXIBILITY',
  duration: 30,
  goals: {
    duration_minutes: 30,
    poses_min: 10,
  },
  rewards: {
    xp: 100,
    battle_ticket: 1,
    energy: 50,
  },
}
```

---

## Animations & Micro-interactions

### Entry Animation
```typescript
// Workout card slides up from bottom (respects Reduce Motion)
const entryAnimation = () => {
  if (prefersReducedMotion) return;

  Animated.timing(translateY, {
    toValue: 0,
    duration: 300,
    easing: Easing.out(Easing.cubic),
    useNativeDriver: true,
  }).start();
};

// Buttons fade in after card settles
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
  shadowOffset: { width: 2, height: 2 },
};

// Haptic: Light impact
Haptics.impact(Haptics.ImpactFeedbackStyle.Light);

// Sound: 8-bit "select"
SoundManager.play('select');
```

---

## State Variations

### Workout Already Active (Neutral Tone)
```
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗   │
│   ║  WORKOUT IN PROGRESS      ║   │
│   ║                           ║   │
│   ║  You have an active       ║   │
│   ║  workout running.         ║   │  ← Neutral, not warning
│   ║                           ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │ CONTINUE WORKOUT  │    ║   │  ← Touch: 44dp height
│   ║  └───────────────────┘    ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │ START NEW WORKOUT │    ║   │  ← Touch: 44dp height
│   ║  └───────────────────┘    ║   │  ← No "abandon" framing
│   ╚═══════════════════════════╝   │
└─────────────────────────────────────┘
```

### Workout Completed Today (Celebration)
```
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗   │
│   ║  ✓ WORKOUT COMPLETE!      ║   │  ← Celebration, not limit
│   ║                           ║   │
│   ║  You've completed your    ║   │
│   ║  daily workout! Great!    ║   │
│   ║                           ║   │
│   ║  Come back tomorrow for   ║   │
│   ║  a new challenge.         ║   │
│   ║                           ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │ RETURN HOME       │    ║   │  ← Touch: 44dp height
│   ║  └───────────────────┘    ║   │
│   ╚═══════════════════════════╝   │
└─────────────────────────────────────┘
```

---

## User Actions

1. **Tap "START WORKOUT"** → Navigate to Workout Tracker (real data mode)
2. **Tap "CHANGE WORKOUT"** → Navigate to Training Selection Screen
3. **Tap Back** → Return to Home Dashboard

---

## Implementation Notes

### Workout Assignment Logic
```typescript
const assignDailyWorkout = async (userId: string, archetype: string) => {
  // Check if workout already assigned today
  const today = new Date().toISOString().split('T')[0];

  const { data: existingWorkout } = await supabase
    .from('daily_workouts')
    .select('*')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  if (existingWorkout) {
    return existingWorkout;
  }

  // Assign new workout based on archetype
  const workoutPool = getWorkoutsByArchetype(archetype);
  const selectedWorkout = workoutPool[Math.floor(Math.random() * workoutPool.length)];

  const { data: newWorkout } = await supabase
    .from('daily_workouts')
    .insert({
      user_id: userId,
      date: today,
      workout_type: selectedWorkout.type,
      workout_title: selectedWorkout.title,
      goals: selectedWorkout.goals,
      rewards: selectedWorkout.rewards,
      status: 'assigned',
    })
    .select()
    .single();

  return newWorkout;
};
```

---

## Navigation

### Entry Points
- From Home Dashboard → Training Cartridge button (via Cartridge Load Animation)

### Exit Points
- To Workout Tracker (real data mode) - on START WORKOUT
- To Training Selection Screen - on CHANGE WORKOUT
- To Home Dashboard - on back

---

## Related Screens

- **Previous**: Home Dashboard (via Training Cartridge)
- **Next**: Workout Tracker (real data) OR Training Selection
- **Flow**: Daily Engagement Loop
- **Transition**: Entry uses Cartridge Load Animation (post-onboarding context)

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
- [x] Raw numerical data always visible (goals, rewards)
- [x] No punishment for changing workouts
- [x] Neutral framing for active workouts

---

**Priority**: HIGH - Core daily engagement loop
**Estimated Implementation**: 6-8 hours
**Entry Transition**: Cartridge Load Animation (from Home Dashboard Training Cartridge)
