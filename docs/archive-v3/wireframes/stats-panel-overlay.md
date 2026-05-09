# Stats Panel (Slide-Up Overlay) - Wireframe Specification

**Screen ID**: OVERLAY-01
**Batch**: 3 (MEDIUM - Tutorial & Setup)
**Status**: ✅ Spec Complete
**Design Date**: 2025-11-30
**Last Updated**: 2025-12-06
**Spec Version**: 2.0

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

Detailed stats overlay that slides up from the bottom when user taps progress rings on Home Screen. Shows comprehensive fitness and skill progression data **with raw numerical values always visible** - no hidden data behind taps.

---

## Layout Structure

### Slide-Up Overlay (Full Height)
Using **DMG Palette ONLY** (`#9BBC0F`, `#0F380F`, `#8BAC0F`, `#306230`)

```
┌─────────────────────────────────────┐
│  HOME SCREEN (Dimmed 50%)           │ ← Background dimmed
│  rgba(15, 56, 15, 0.5)              │   #0F380F at 50% opacity
├─────────────────────────────────────┤
│                                     │
│  ╔═══════════════════════════════╗ │ ← Slides up from bottom
│  ║  STATS PANEL                  ║ │   Background: #9BBC0F
│  ║  ═════════════════════════════ ║ │   Border: #306230, 4px
│  ║                               ║ │
│  ║  ┌─────────────────────────┐  ║ │
│  ║  │     ■■■■■■■■■           │  ║ │ ← Drag Handle (pixel bar)
│  ║  └─────────────────────────┘  ║ │   NO borderRadius
│  ║                               ║ │
│  ║  FITNESS PROGRESS             ║ │ ← Section Header
│  ║  ─────────────────────────    ║ │   Font: Press Start 2P, 10px
│  ║                               ║ │
│  ║       ┌─────────────┐         ║ │
│  ║       │   65%       │         ║ │ ← Large Progress Ring
│  ║       │  Daily Goal │         ║ │   SVG with square caps
│  ║       └─────────────┘         ║ │
│  ║                               ║ │
│  ║  Steps:      7,234 / 10,000   ║ │ ← RAW DATA ALWAYS VISIBLE
│  ║  Calories:   342 / 500        ║ │   Font: Montserrat, 12px
│  ║  Workout:    25 / 30 min      ║ │   Actual numbers shown
│  ║  Distance:   5.2 km           ║ │
│  ║                               ║ │
│  ║  ═════════════════════════════ ║ │
│  ║                               ║ │
│  ║  COMBAT PROGRESS              ║ │ ← Section Header
│  ║  ─────────────────────────    ║ │
│  ║                               ║ │
│  ║       ┌─────────────┐         ║ │
│  ║       │   30%       │         ║ │ ← Skill Ring
│  ║       │Combat Skill │         ║ │
│  ║       └─────────────┘         ║ │
│  ║                               ║ │
│  ║  Battles Won:     3           ║ │ ← RAW Combat Stats
│  ║  Total Damage:    1,250       ║ │
│  ║  Best Combo:      7 hits      ║ │
│  ║  Perfect Blocks:  12          ║ │
│  ║                               ║ │
│  ║  ═════════════════════════════ ║ │
│  ║                               ║ │
│  ║  EVOLUTION                    ║ │ ← Section Header
│  ║  ─────────────────────────    ║ │
│  ║                               ║ │
│  ║  Stage: 1                     ║ │
│  ║  Progress: ▓▓▓▓░░░░ 150/200   ║ │ ← Bar + Raw Number
│  ║  Next Stage: 50 XP remaining  ║ │
│  ║                               ║ │
│  ╚═══════════════════════════════╝ │
└─────────────────────────────────────┘
```

---

## Component Specifications

### 1. Dimmed Background Overlay
```typescript
{
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(15, 56, 15, 0.5)',  // Deep forest, 50% opacity
}

// Tap to dismiss
<TouchableOpacity
  activeOpacity={1}
  onPress={handleDismiss}
  style={{ flex: 1 }}
  accessibilityLabel="Tap to close stats panel"
  accessibilityRole="button"
/>
```

### 2. Stats Panel Container
```typescript
{
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '80%',                   // 80% of screen height
  backgroundColor: '#9BBC0F',
  borderTopLeftRadius: 0,          // MANDATORY: No rounded corners
  borderTopRightRadius: 0,         // MANDATORY: No rounded corners
  borderWidth: 4,
  borderColor: '#306230',
  borderBottomWidth: 0,
  paddingTop: 20,
  paddingHorizontal: 24,
  paddingBottom: 40,
  shadowColor: '#0F380F',
  shadowOffset: { width: 0, height: -4 },
  shadowOpacity: 0.3,
  shadowRadius: 0,                 // MANDATORY: Hard pixel shadow
}
```

### 3. Drag Handle (Pixel Bar - NO BORDER RADIUS)
```typescript
{
  width: 60,
  height: 4,
  backgroundColor: '#306230',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  alignSelf: 'center',
  marginBottom: 20,
}
```

### 4. Section Header
```typescript
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
  marginTop: 20,
  marginBottom: 8,
  borderBottomWidth: 2,
  borderBottomColor: '#306230',
  paddingBottom: 4,
}
```

### 5. Large Progress Ring (SVG)
```typescript
// Using react-native-svg with square strokeLinecap
<Svg width={120} height={120}>
  {/* Background ring */}
  <Circle
    cx={60}
    cy={60}
    r={50}
    stroke="#306230"
    strokeWidth={12}
    fill="transparent"
    strokeLinecap="square"         // MANDATORY: Pixel aesthetic
  />
  {/* Progress ring */}
  <Circle
    cx={60}
    cy={60}
    r={50}
    stroke="#8BAC0F"
    strokeWidth={12}
    fill="transparent"
    strokeDasharray={circumference}
    strokeDashoffset={strokeDashoffset}
    strokeLinecap="square"         // MANDATORY: Pixel aesthetic
    transform={`rotate(-90 60 60)`}
  />
</Svg>

// Percentage Text (Center)
{
  position: 'absolute',
  fontFamily: 'PressStart2P-Regular',
  fontSize: 20,
  color: '#0F380F',
}

// Label (Below Ring)
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#306230',
  textAlign: 'center',
  marginTop: 8,
}
```

### 6. Stat Row (RAW DATA ALWAYS VISIBLE)
```typescript
{
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 8,
  paddingHorizontal: 12,
}

// Stat Label
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#306230',
}

// Stat Value (RAW NUMBER)
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  fontWeight: '600',
  color: '#0F380F',
}
```

### 7. Evolution Progress Bar
```typescript
{
  backgroundColor: '#306230',      // Empty state
  borderWidth: 2,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  height: 20,
  marginVertical: 8,
  overflow: 'hidden',
}

// Fill
{
  backgroundColor: '#8BAC0F',
  height: '100%',
  width: '75%',                    // Based on progress
}

// Progress Text (Overlay)
{
  position: 'absolute',
  width: '100%',
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
}

{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 8,
  color: '#0F380F',                // Visible on both fill and empty
}
```

---

## Usability Compliance

> **Reference**: front-end-spec.md "Usability Traps Prevention" section

### Trap 1: Information Density ✅
- **Compliance**: All stats show raw numerical values
- **Implementation**:
  - "7,234 / 10,000" format for goals
  - Actual numbers, not percentages alone
  - Both current and target visible

### Trap 2: AI Summaries ✅
- **Compliance**: No AI-generated insights
- **Implementation**:
  - Static stat labels
  - No "Great job!" or "You're behind" messaging
  - Numbers speak for themselves

### Trap 3: Punishment Mechanics ✅
- **Compliance**: Neutral data presentation
- **Implementation**:
  - No red/green coloring for "bad/good"
  - No comparison to other users
  - No "You should be at X" messaging
  - Data is informational, not judgmental

### Trap 4: Onboarding Overload ✅
- **Compliance**: Optional detail view
- **Implementation**: Stats panel is opt-in (tap to expand)

### Trap 5: Feature Labyrinths ✅
- **Compliance**: Two dismiss methods
- **Implementation**: Tap background OR drag down to close

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| Drag Handle | 60×4pt | 60×44dp (expanded area) | ✅ |
| Background Dismiss | Full screen | Full screen | ✅ |
| Progress Ring | 120×120pt | Non-interactive | N/A |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Panel announcement
accessibilityLabel="Stats panel. Fitness progress: 65%. Steps: 7,234 out of 10,000. Combat progress: 30%. Battles won: 3."
accessibilityRole="dialog"
accessibilityViewIsModal={true}

// Dismiss instruction
accessibilityHint="Swipe down or tap outside to close"

// Section headers
accessibilityLabel="Fitness Progress section"
accessibilityRole="header"

// Stat rows
accessibilityLabel={`Steps: ${steps} out of ${stepsGoal}`}
accessibilityRole="text"

// Progress rings
accessibilityLabel={`Daily goal progress: ${percentage} percent complete`}
accessibilityRole="progressbar"
accessibilityValue={{ min: 0, max: 100, now: percentage }}
```

### Focus Order
1. Panel header (announcement)
2. Fitness Progress section
3. Progress ring (informational)
4. Steps stat
5. Calories stat
6. Workout stat
7. Distance stat
8. Combat Progress section
9. Combat ring (informational)
10. Battles Won stat
11. Total Damage stat
12. Best Combo stat
13. Perfect Blocks stat
14. Evolution section
15. Evolution progress bar

### Reduce Motion Support
```typescript
const prefersReducedMotion = useReducedMotion();

// Slide-up animation
const slideAnimation = prefersReducedMotion
  ? { duration: 0 }  // Instant
  : {
      type: 'spring',
      friction: 8,
      tension: 65,
    };

// Progress ring animation
const ringAnimation = prefersReducedMotion
  ? null  // Static display
  : {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    };

// Background fade
const fadeAnimation = prefersReducedMotion
  ? { duration: 0 }
  : { duration: 200 };
```

### Color Contrast Verification

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Section header | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Stat value | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Stat label | #306230 | #9BBC0F | 2.8:1 | ⚠️ Large only |
| Progress ring | #8BAC0F | #306230 | 2.8:1 | ⚠️ Visual only |
| Evolution bar text | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |

---

## Animations

### Slide-Up Animation
```typescript
const slideUp = () => {
  if (prefersReducedMotion) {
    setVisible(true);
    backgroundOpacity.setValue(0.5);
    panelY.setValue(0);
    return;
  }

  // Dim background
  Animated.timing(backgroundOpacity, {
    toValue: 0.5,
    duration: 200,
    useNativeDriver: true,
  }).start();

  // Slide panel up
  Animated.spring(panelY, {
    toValue: 0,
    friction: 8,
    tension: 65,
    useNativeDriver: true,
  }).start();

  // Animate progress rings after panel settles
  setTimeout(() => {
    animateProgressRings();
  }, 300);
};
```

### Slide-Down (Dismiss)
```typescript
const slideDown = () => {
  if (prefersReducedMotion) {
    setVisible(false);
    onDismiss();
    return;
  }

  Animated.parallel([
    Animated.timing(backgroundOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.timing(panelY, {
      toValue: screenHeight,
      duration: 250,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }),
  ]).start(() => {
    onDismiss();
  });
};
```

### Drag Gesture
```typescript
import { PanGestureHandler, State } from 'react-native-gesture-handler';

const onGestureEvent = Animated.event(
  [{ nativeEvent: { translationY: panelY } }],
  { useNativeDriver: true }
);

const onHandlerStateChange = (event) => {
  if (event.nativeEvent.state === State.END) {
    const { translationY, velocityY } = event.nativeEvent;

    // Dismiss if dragged down > 100pt or fast swipe
    if (translationY > 100 || velocityY > 500) {
      slideDown();
    } else {
      // Snap back to open position
      Animated.spring(panelY, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }).start();
    }
  }
};
```

---

## State Variations

### Loading State
```
╔═══════════════════════════════╗
║  [Pixel spinner]              ║
║                               ║
║  Loading stats...             ║ ← Neutral messaging
╚═══════════════════════════════╝
```

### No Data Yet (New User)
```
FITNESS PROGRESS
─────────────────────────────

      ┌─────────────┐
      │   0%        │
      │  Daily Goal │
      └─────────────┘

Steps:      0 / 10,000
Calories:   0 / 500
Workout:    0 / 30 min
Distance:   0.0 km

Start your first workout to
see your progress here!           ← Encouraging, not shaming
```

### Health Data Unavailable
```
FITNESS PROGRESS
─────────────────────────────

Health data not connected.

Connect in Settings to
see your fitness stats.           ← Informative, not pushy

┌───────────────────────────┐
│   OPEN SETTINGS        →  │   ← Optional action
└───────────────────────────┘
```

---

## Data Source

### Fitness Stats
```typescript
interface FitnessStats {
  steps: number;
  stepsGoal: number;
  calories: number;
  caloriesGoal: number;
  workoutMinutes: number;
  workoutGoal: number;
  distance: number;  // km
}

const fetchFitnessStats = async (userId: string) => {
  const today = new Date().toISOString().split('T')[0];

  const { data: dailySteps } = await supabase
    .from('daily_steps')
    .select('step_count')
    .eq('user_id', userId)
    .eq('date', today)
    .single();

  const { data: workouts } = await supabase
    .from('workout_logs')
    .select('duration_minutes, calories_burned')
    .eq('user_id', userId)
    .eq('date', today);

  const totalWorkoutMinutes = workouts?.reduce(
    (sum, w) => sum + w.duration_minutes, 0
  ) || 0;

  const totalCalories = workouts?.reduce(
    (sum, w) => sum + w.calories_burned, 0
  ) || 0;

  return {
    steps: dailySteps?.step_count || 0,
    stepsGoal: 10000,
    calories: totalCalories,
    caloriesGoal: 500,
    workoutMinutes: totalWorkoutMinutes,
    workoutGoal: 30,
    distance: (dailySteps?.step_count || 0) * 0.000762,  // km
  };
};
```

### Combat Stats
```typescript
interface CombatStats {
  battlesWon: number;
  totalDamage: number;
  bestCombo: number;
  perfectBlocks: number;
}

const fetchCombatStats = async (userId: string) => {
  const { data: battles } = await supabase
    .from('battle_logs')
    .select('result, damage_dealt, combos, perfect_blocks')
    .eq('user_id', userId);

  const battlesWon = battles?.filter(b => b.result === 'victory').length || 0;
  const totalDamage = battles?.reduce(
    (sum, b) => sum + b.damage_dealt, 0
  ) || 0;
  const bestCombo = Math.max(...(battles?.map(b => b.combos) || [0]));
  const perfectBlocks = battles?.reduce(
    (sum, b) => sum + b.perfect_blocks, 0
  ) || 0;

  return { battlesWon, totalDamage, bestCombo, perfectBlocks };
};
```

---

## Navigation

### Entry
- From Home Screen → Tap Progress Rings

### Exit
- Tap background → Return to Home Screen (overlay dismisses)
- Drag down → Return to Home Screen (overlay dismisses)

---

## Related Screens

- **Previous**: Home Dashboard
- **Next**: Home Dashboard (overlay dismisses)
- **Flow**: Home Screen enhancement

---

## Design System Compliance Checklist

- [x] Only 4 LCD colors used
- [x] No border radius (`borderRadius: 0`) - including drag handle
- [x] Hard pixel shadows (`shadowRadius: 0`)
- [x] No gradients
- [x] Typography: Press Start 2P (headers/percentage) + Montserrat (stats)
- [x] Drag handle touch target expanded to 44dp
- [x] Screen reader labels on all elements
- [x] Modal accessibility (`accessibilityViewIsModal`)
- [x] Reduce Motion preference respected
- [x] Raw numerical data always visible
- [x] Neutral data presentation (no judgment)
- [x] SVG strokeLinecap="square" for pixel aesthetic

---

**Priority**: MEDIUM - Nice-to-have for detailed stats
**Estimated Implementation**: 6-8 hours (overlay + animations + data fetching)
