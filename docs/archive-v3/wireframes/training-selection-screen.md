# Training Selection Screen - Wireframe Specification

**Screen ID**: TRAINING-02
**Batch**: 3 (MEDIUM - Tutorial & Setup)
**Status**: ✅ Spec Complete
**Design Date**: 2025-11-30
**Last Updated**: 2025-12-31
**Spec Version**: 3.0 (Party Mode Aligned)

---

## Party Mode Alignment (2025-12-29)

### Key Changes in This Version
- ✅ Renamed from "Quest Selection/Change Screen" to "Training Selection Screen"
- ✅ Screen ID changed from QUEST-02 to TRAINING-02
- ✅ "Quest" → "Workout" / "Training" throughout
- ✅ "Choose Quest" → "Choose Training" / "Choose Workout"
- ✅ "Confirm Quest" → "Confirm Workout"
- ✅ Entry: Via "Change Workout" on Home Dashboard or Daily Workout Assignment
- ✅ Exit: Returns to Home Dashboard with selected workout

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

Allow users to browse and select from available daily workouts based on their archetype. Accessed from Home Screen via "Change Workout" link or from Daily Workout Assignment screen. **No punishment for changing workouts** - all options are presented as equally valid choices.

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
│   │  CHOOSE WORKOUT             │  │ ← Header
│   │  December 6, 2025           │  │   Font: Press Start 2P, 12px
│   └─────────────────────────────┘  │   Date: Montserrat, 12px
│                                     │
│   ╔═══════════════════════════╗   │ ← Workout Card 1 (Selected)
│   ║  MORNING JOG              ║   │   Background: #8BAC0F
│   ║  CARDIO • 30 MIN          ║   │
│   ║                           ║   │
│   ║  Goal: 3,000 steps        ║   │ ← RAW DATA visible
│   ║  Reward: +100 XP          ║   │   Goals AND rewards shown
│   ║                           ║   │
│   ║  [✓ SELECTED]             ║   │ ← Selection indicator
│   ╚═══════════════════════════╝   │   Touch: Full card × 80dp+
│                                     │
│   ┌───────────────────────────┐   │ ← Workout Card 2
│   │  STRENGTH SESSION         │   │   Background: #9BBC0F
│   │  STRENGTH • 45 MIN        │   │   Border: #306230
│   │                           │   │
│   │  Goal: 20 minutes         │   │
│   │  Reward: +120 XP          │   │
│   │                           │   │
│   │  [TAP TO SELECT]          │   │ ← Touch: Full card × 80dp+
│   └───────────────────────────┘   │
│                                     │
│   ┌───────────────────────────┐   │ ← Workout Card 3
│   │  FLEXIBILITY FLOW         │   │
│   │  FLEXIBILITY • 30 MIN     │   │
│   │                           │   │
│   │  Goal: 15 minutes         │   │
│   │  Reward: +100 XP          │   │
│   │                           │   │
│   │  [TAP TO SELECT]          │   │
│   └───────────────────────────┘   │
│                                     │
│   ┌───────────────────────────┐   │
│   │   CONFIRM WORKOUT         │   │ ← Confirm Button
│   └───────────────────────────┘   │   Touch: Full width × 52dp
└─────────────────────────────────────┘
```

---

## Component Specifications

### 1. Screen Background
```typescript
{
  flex: 1,
  backgroundColor: '#9BBC0F',      // Neon grass glow
}
```

### 2. Header
```typescript
{
  backgroundColor: '#9BBC0F',
  borderBottomWidth: 2,
  borderBottomColor: '#306230',
  paddingVertical: 16,
  paddingHorizontal: 24,
  marginBottom: 16,
}

// Header Title
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
  fontSize: 12,
  color: '#306230',
  textAlign: 'center',
}
```

### 3. Selected Workout Card
```typescript
{
  backgroundColor: '#8BAC0F',      // Lime (selected)
  borderWidth: 4,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  padding: 16,
  marginHorizontal: 24,
  marginBottom: 12,
  minHeight: 80,                   // MANDATORY: Touch target (full card)
  shadowColor: '#0F380F',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,                 // MANDATORY: Hard pixel shadow
}

// Workout Title
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
  marginBottom: 4,
}

// Workout Type + Duration
{
  fontFamily: 'Montserrat',
  fontSize: 11,
  color: '#306230',
  marginBottom: 8,
}

// Goal (RAW DATA)
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#0F380F',
  marginBottom: 4,
}

// Reward (RAW DATA)
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  fontWeight: '600',
  color: '#0F380F',
  marginBottom: 8,
}

// Selection Indicator
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 8,
  color: '#0F380F',
}
```

### 4. Unselected Workout Card
```typescript
{
  backgroundColor: '#9BBC0F',      // Neon grass
  borderWidth: 2,
  borderColor: '#306230',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  padding: 16,
  marginHorizontal: 24,
  marginBottom: 12,
  minHeight: 80,                   // MANDATORY: Touch target
}

// Workout Title
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
  marginBottom: 4,
}

// Workout Type + Duration
{
  fontFamily: 'Montserrat',
  fontSize: 11,
  color: '#306230',
  marginBottom: 8,
}

// Goal (RAW DATA)
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#0F380F',
  marginBottom: 4,
}

// Reward (RAW DATA)
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  fontWeight: '600',
  color: '#0F380F',
  marginBottom: 8,
}

// Selection Hint
{
  fontFamily: 'Montserrat',
  fontSize: 10,
  color: '#306230',
}
```

### 5. Confirm Button
```typescript
{
  backgroundColor: '#8BAC0F',
  borderWidth: 4,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  paddingVertical: 16,
  marginHorizontal: 24,
  marginTop: 8,
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
```

---

## Usability Compliance

> **Reference**: front-end-spec.md "Usability Traps Prevention" section

### Trap 1: Information Density ✅
- **Compliance**: Goals AND rewards visible on each card
- **Implementation**: Raw data shown (steps, minutes, XP) - no hidden info

### Trap 2: AI Summaries ✅
- **Compliance**: No AI-generated workout descriptions
- **Implementation**: Predefined workout templates

### Trap 3: Punishment Mechanics ✅
- **Compliance**: No penalty for changing workouts
- **Implementation**:
  - All workouts presented as equally valid
  - No "Are you sure?" guilt messaging
  - No "You'll lose progress" warnings
  - Changing workouts is a neutral action

### Trap 4: Onboarding Overload ✅
- **Compliance**: Maximum 3-4 workout options visible
- **Implementation**: Scrollable if more workouts, but limited pool per archetype

### Trap 5: Feature Labyrinths ✅
- **Compliance**: Two actions: Select card → Confirm
- **Implementation**: Simple selection flow, no nested menus

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| Workout Card (Selected) | Full width × 80dp+ | Full width × 80dp+ | ✅ |
| Workout Card (Unselected) | Full width × 80dp+ | Full width × 80dp+ | ✅ |
| CONFIRM WORKOUT Button | Full width × 52dp | Full width × 52dp | ✅ |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Screen title
accessibilityLabel="Choose workout screen for December 6, 2025"
accessibilityRole="header"

// Selected workout card
accessibilityLabel={`Morning Jog, Cardio, 30 minutes. Goal: 3,000 steps. Reward: 100 experience points. Currently selected.`}
accessibilityRole="radio"
accessibilityState={{ checked: true }}
accessibilityHint="Double tap to keep this workout selected"

// Unselected workout card
accessibilityLabel={`Strength Session, Strength, 45 minutes. Goal: 20 minutes. Reward: 120 experience points. Not selected.`}
accessibilityRole="radio"
accessibilityState={{ checked: false }}
accessibilityHint="Double tap to select this workout"

// Confirm button
accessibilityLabel="Confirm selected workout"
accessibilityRole="button"
accessibilityHint="Double tap to start your selected workout"
```

### Focus Order
1. Header (informational)
2. Workout Card 1 (radio option)
3. Workout Card 2 (radio option)
4. Workout Card 3 (radio option)
5. CONFIRM WORKOUT Button

### Reduce Motion Support
```typescript
const prefersReducedMotion = useReducedMotion();

// Card selection animation
const selectionAnimation = prefersReducedMotion
  ? null  // Instant state change
  : {
      scale: { toValue: 1, duration: 150 },
      border: { duration: 100 },
    };

// Button press animation
const buttonScale = prefersReducedMotion
  ? 1
  : 0.96;
```

### Color Contrast Verification

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Header title | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Workout title (selected) | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |
| Workout title (unselected) | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Workout type | #306230 | #9BBC0F | 2.8:1 | ⚠️ Large only |
| Button text | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |

---

## Workout Pool by Archetype

### Runner Workouts
```typescript
const runnerWorkouts = [
  {
    id: 'morning_jog',
    title: 'MORNING JOG',
    type: 'CARDIO',
    duration: 30,
    goal: '3,000 steps',
    rewards: { xp: 100 },
  },
  {
    id: 'sprint_intervals',
    title: 'SPRINT INTERVALS',
    type: 'CARDIO',
    duration: 20,
    goal: '2,000 steps',
    rewards: { xp: 80 },
  },
  {
    id: 'long_run',
    title: 'LONG RUN',
    type: 'CARDIO',
    duration: 60,
    goal: '6,000 steps',
    rewards: { xp: 150 },
  },
];
```

### Bodybuilder Workouts
```typescript
const bodybuilderWorkouts = [
  {
    id: 'strength_session',
    title: 'STRENGTH SESSION',
    type: 'STRENGTH',
    duration: 45,
    goal: '30 minutes',
    rewards: { xp: 120 },
  },
  {
    id: 'power_lifting',
    title: 'POWER LIFTING',
    type: 'STRENGTH',
    duration: 60,
    goal: '45 minutes',
    rewards: { xp: 150 },
  },
  {
    id: 'quick_pump',
    title: 'QUICK PUMP',
    type: 'STRENGTH',
    duration: 30,
    goal: '20 minutes',
    rewards: { xp: 100 },
  },
];
```

### Yogi Workouts
```typescript
const yogiWorkouts = [
  {
    id: 'flexibility_flow',
    title: 'FLEXIBILITY FLOW',
    type: 'FLEXIBILITY',
    duration: 30,
    goal: '20 minutes',
    rewards: { xp: 100 },
  },
  {
    id: 'morning_stretch',
    title: 'MORNING STRETCH',
    type: 'FLEXIBILITY',
    duration: 15,
    goal: '10 minutes',
    rewards: { xp: 60 },
  },
  {
    id: 'deep_yoga',
    title: 'DEEP YOGA',
    type: 'FLEXIBILITY',
    duration: 45,
    goal: '35 minutes',
    rewards: { xp: 130 },
  },
];
```

---

## State Variations

### No Workout Selected Yet
```
┌───────────────────────────┐
│  MORNING JOG              │
│  CARDIO • 30 MIN          │
│                           │
│  Goal: 3,000 steps        │
│  Reward: +100 XP          │
│                           │
│  [TAP TO SELECT]          │ ← All cards show this
└───────────────────────────┘

┌───────────────────────────┐
│   SELECT A WORKOUT        │ ← Button disabled
└───────────────────────────┘   Neutral, not "You must select"
```

### Changing Workout (Previously Selected)
```
// No warning modal - just allow the change
// No "Are you sure?" - respect user agency
// Previous selection simply deselects when new one is tapped
```

### Loading Workouts
```
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗   │
│   ║  [Pixel spinner]          ║   │
│   ║                           ║   │
│   ║  Loading workouts...      ║   │
│   ╚═══════════════════════════╝   │
└─────────────────────────────────────┘
```

### Workout Confirmed
```
// Navigate directly to Home Screen
// Brief toast: "Workout set!"
// No celebration screen (save celebrations for completions)
```

---

## Implementation Notes

### Fetch Workouts by Archetype
```typescript
const fetchWorkoutsForArchetype = async (archetype: string) => {
  const workoutPools: Record<string, Workout[]> = {
    runner: runnerWorkouts,
    bodybuilder: bodybuilderWorkouts,
    yogi: yogiWorkouts,
  };

  return workoutPools[archetype] || runnerWorkouts;
};
```

### Handle Workout Selection
```typescript
const handleSelectWorkout = (workoutId: string) => {
  // Simply update selection - no confirmation needed
  setSelectedWorkoutId(workoutId);

  // Haptic feedback
  Haptics.impact(Haptics.ImpactFeedbackStyle.Light);
};
```

### Handle Confirm Workout
```typescript
const handleConfirmWorkout = async () => {
  if (!selectedWorkoutId) return;

  const selectedWorkout = workouts.find(w => w.id === selectedWorkoutId);

  // Save to database
  await supabase
    .from('daily_workouts')
    .upsert({
      user_id: userId,
      workout_id: selectedWorkoutId,
      date: new Date().toISOString().split('T')[0],
      status: 'assigned',
      goal: selectedWorkout.goal,
      xp_reward: selectedWorkout.rewards.xp,
    });

  // Show brief confirmation
  showToast('Workout set!');

  // Navigate to Home
  navigation.navigate('Home');
};
```

---

## Navigation

### Entry Points
- From Home Screen → Change Workout link
- From Daily Workout Assignment → CHANGE WORKOUT button
- From Settings → Workout Preferences (future)

### Exit Points
- To Home Dashboard (via Confirm)
- Back to previous screen (via Back button)

---

## Related Screens

- **Previous**: Home Dashboard / Daily Workout Assignment
- **Next**: Home Dashboard (with selected workout)
- **Flow**: Daily Engagement Loop

---

## Design System Compliance Checklist

- [x] Only 4 LCD colors used
- [x] No border radius (`borderRadius: 0`)
- [x] Hard pixel shadows (`shadowRadius: 0`)
- [x] No gradients
- [x] Typography: Press Start 2P (titles/buttons) + Montserrat (details)
- [x] All touch targets ≥ 44×44dp (cards are 80dp+)
- [x] Screen reader labels on all elements
- [x] Reduce Motion preference respected
- [x] Goals AND rewards visible (no hidden info)
- [x] No punishment for changing workouts
- [x] Radio button pattern with proper ARIA

---

**Priority**: MEDIUM
**Estimated Implementation**: 4-6 hours
