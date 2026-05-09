# Home Dashboard Screen - Wireframe Specification

**Screen ID**: HOME-01
**Batch**: 1 (CRITICAL - MVP Blocking)
**Status**: ✅ Spec Complete
**Design Date**: 2025-11-30
**Last Updated**: 2025-12-31
**Spec Version**: 2.1 (Party Mode Aligned)

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

Primary landing screen after FTUE completion. Displays user's Home Avatar, dual progress rings (Fitness/Skill), momentum indicator, and provides entry points to core loops (Workout via Training Cartridge, Battle via Tab Bar).

---

## Party Mode Alignment (2025-12-29)

### Key Changes in This Version
- ✅ "Quest Cartridge" → "Training Cartridge" / "Workout Cartridge"
- ✅ "Daily Quest" → "Daily Training" / "Daily Workout"
- ✅ "Change Quest" → "Change Training" / "Change Workout"
- ✅ Added Post-Battle Avatar States (Victory pose vs Determined pose)
- ✅ Added Evolution Overlay Integration
- ✅ Battle Tab entry → Battle Mode Transition Video (NOT Cartridge Load)
- ✅ Victory Ceremony DEPRECATED → Avatar reactions on this screen

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
│   ╔═══════════════════════════╗    │
│   ║                           ║    │
│   ║   [Home Avatar 128×128]   ║    │ ← Centered avatar
│   ║   Idle blink animation    ║    │   Tap → Profile
│   ║                           ║    │
│   ╚═══════════════════════════╝    │
│                                     │
│   ┌───────────┐   ┌───────────┐    │
│   │  FITNESS  │   │   SKILL   │    │ ← Dual Progress Rings
│   │   ◯───◯   │   │   ◯───◯   │    │   Tap → Stats Panel
│   │    65%    │   │    30%    │    │   Touch: 80×80dp each
│   └───────────┘   └───────────┘    │
│                                     │
│   ┌───────────────────────────┐    │
│   │  🔥 MOMENTUM: 47 days     │    │ ← Momentum Bar (NOT streak)
│   │  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░  │    │   Graceful decay system
│   └───────────────────────────┘    │   NO punishment messaging
│                                     │
│   ╔═══════════════════════════╗    │
│   ║                           ║    │
│   ║   [TRAINING CARTRIDGE]    ║    │ ← Primary CTA
│   ║   "Daily Workout Ready!"  ║    │   Touch: Full width, 80dp h
│   ║                           ║    │   Background: #8BAC0F
│   ╚═══════════════════════════╝    │
│                                     │
│   ┌───────────────────────────┐    │
│   │   Change Workout          │    │ ← Secondary link
│   └───────────────────────────┘    │   Touch: 44dp height
│                                     │
│   ┌───────────────────────────┐    │
│   │ 🏠  ⚔️  👤  ⚙️          │    │ ← Tab Bar
│   │ Home Battle Profile Settings│    │   Touch: 44×44dp per tab
│   └───────────────────────────┘    │
│                                     │
└─────────────────────────────────────┘

HARDWARE SHELL (Below LCD) - Uses Hardware Palette
┌─────────────────────────────────────┐
│  STATS RIBBON                       │
│  Steps: 7,234 | Cals: 342 | 25 min │ ← Raw numerical data visible
│  Background: #D7D5CA (Shell Body)   │   Font: Montserrat 12px
└─────────────────────────────────────┘
```

---

## Critical Palette Distinction

### Virtual LCD Screen Area (DMG Palette)
**ONLY these 4 colors allowed**:
- `#9BBC0F` - Neon Grass Glow (background)
- `#0F380F` - Deep Forest Shadow (text, borders)
- `#8BAC0F` - Lime Highlight (buttons, filled progress)
- `#306230` - Pine Border (borders, secondary text)

### Shell Area (Hardware Palette)
**Different palette for physical shell simulation**:
- `#D7D5CA` - Body (main shell color)
- `#9A9A9A` - Bezel (frame around LCD)
- `#6C6B6B` - Recess (inner depth layer)
- `#1C1C1C` - Text (shell text color)
- `#B64A75` - Accent (A/B buttons, power indicator)

---

## Component Specifications

### 1. Home Avatar Container
```typescript
{
  width: 160,
  height: 160,
  backgroundColor: '#9BBC0F',
  borderWidth: 4,
  borderColor: '#306230',
  borderRadius: 0,                    // MANDATORY: No rounded corners
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'center',
  marginTop: 24,
  marginBottom: 20,
}

// Avatar Image
{
  width: 128,
  height: 128,
  resizeMode: 'contain',
}

// Touch Target: 160×160dp ✅ (exceeds 44×44dp minimum)
```

### 2. Dual Progress Rings Container
```typescript
{
  flexDirection: 'row',
  justifyContent: 'space-around',
  paddingHorizontal: 40,
  marginBottom: 16,
}
```

### 3. Individual Progress Ring
```typescript
{
  width: 100,
  height: 100,
  alignItems: 'center',
  justifyContent: 'center',
}

// Ring (using react-native-svg)
// Stroke colors: #306230 (background), #8BAC0F (fill)
// No strokeLinecap: 'round' - use 'square' for pixel aesthetic

// Label
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 8,
  color: '#0F380F',
  marginTop: 4,
}

// Percentage
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 14,
  color: '#0F380F',
}

// Touch Target: 100×100dp ✅ (exceeds 44×44dp minimum)
```

### 4. Momentum Bar (NOT Streak)
```typescript
// Container
{
  backgroundColor: '#9BBC0F',
  borderWidth: 2,
  borderColor: '#306230',
  borderRadius: 0,
  padding: 12,
  marginHorizontal: 24,
  marginBottom: 16,
}

// Label Row
{
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 8,
}

// Label Text (left)
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 8,
  color: '#0F380F',
}

// Days Text (right) - Shows "47 days" NOT "47 day streak"
{
  fontFamily: 'Montserrat',
  fontWeight: '600',
  fontSize: 12,
  color: '#0F380F',
}

// Progress Bar
{
  backgroundColor: '#306230',
  height: 12,
  borderWidth: 0,
  borderRadius: 0,
}

// Progress Fill
{
  backgroundColor: '#8BAC0F',
  height: '100%',
  width: '70%',  // Based on momentum percentage
}
```

### 5. Training Cartridge Button (Primary CTA)
```typescript
{
  backgroundColor: '#8BAC0F',
  borderWidth: 4,
  borderColor: '#0F380F',
  borderRadius: 0,
  paddingVertical: 20,
  paddingHorizontal: 24,
  marginHorizontal: 24,
  marginBottom: 12,
  shadowColor: '#0F380F',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,                    // MANDATORY: Hard pixel shadow
  minHeight: 80,                      // Ensures touch target
}

// Cartridge Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  color: '#0F380F',
  textAlign: 'center',
}

// Subtext
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#0F380F',
  textAlign: 'center',
  marginTop: 4,
}

// Touch Target: Full width × 80dp ✅ (exceeds 44×44dp minimum)
```

### 6. Change Workout Link
```typescript
{
  paddingVertical: 12,
  paddingHorizontal: 24,
  alignSelf: 'center',
  minHeight: 44,                      // MANDATORY: Touch target
  minWidth: 120,
  justifyContent: 'center',
}

// Link Text
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#306230',
  textDecorationLine: 'underline',
  textAlign: 'center',
}

// Touch Target: 120×44dp ✅ (meets 44×44dp minimum)
```

### 7. Tab Bar
```typescript
{
  flexDirection: 'row',
  justifyContent: 'space-around',
  backgroundColor: '#9BBC0F',
  borderTopWidth: 2,
  borderTopColor: '#306230',
  paddingVertical: 8,
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
}

// Tab Item
{
  width: 70,
  height: 50,
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: 44,                       // MANDATORY: Touch target
  minHeight: 44,
}

// Tab Icon
{
  width: 24,
  height: 24,
  tintColor: '#306230',               // Inactive
  // Active: '#0F380F'
}

// Tab Label
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 6,
  color: '#306230',                   // Inactive
  // Active: '#0F380F'
  marginTop: 2,
}

// Touch Target: 70×50dp per tab ✅ (exceeds 44×44dp minimum)
```

### 8. Stats Ribbon (Hardware Shell Area)
```typescript
// Uses HARDWARE PALETTE - NOT LCD PALETTE
{
  backgroundColor: '#D7D5CA',         // Shell Body color
  paddingVertical: 8,
  paddingHorizontal: 16,
  flexDirection: 'row',
  justifyContent: 'space-around',
}

// Stat Item
{
  alignItems: 'center',
}

// Stat Value - RAW NUMERICAL DATA ALWAYS VISIBLE
{
  fontFamily: 'Montserrat',
  fontWeight: '600',
  fontSize: 14,
  color: '#1C1C1C',                   // Shell Text color
}

// Stat Label
{
  fontFamily: 'Montserrat',
  fontSize: 10,
  color: '#6C6B6B',                   // Shell Recess color
}
```

---

## Usability Compliance

> **Reference**: front-end-spec.md "Usability Traps Prevention" section

### Trap 1: Information Density ✅
- **Compliance**: Stats Ribbon shows raw numerical values (Steps: 7,234 | Cals: 342 | 25 min)
- **Implementation**: Numbers are ALWAYS visible, not hidden behind taps

### Trap 2: AI Summaries ✅
- **Compliance**: No AI summaries on home screen - raw data only
- **Implementation**: Stats show actual values, not interpretations

### Trap 3: Punishment Mechanics ✅
- **Compliance**: Momentum system uses GRACEFUL DECAY, not binary streaks
- **Implementation**:
  - Label says "MOMENTUM" not "STREAK"
  - Missing a day = 5% decay (NOT reset to zero)
  - No guilt messaging ("You missed your goal!")
  - Avatar NEVER shows disappointed state

### Trap 4: Onboarding Overload ✅
- **Compliance**: Home screen shows minimal elements
- **Implementation**: Only 5 interactive elements visible:
  1. Avatar
  2. Progress Rings
  3. Training Cartridge
  4. Change Workout link
  5. Tab Bar

### Trap 5: Feature Labyrinths ✅
- **Compliance**: Progressive disclosure active
- **Implementation**: Advanced features unlock through engagement, not visible on first load

---

## Momentum System (NOT Streak)

### Key Differences from Traditional Streaks

| Traditional Streak | 16BitFit Momentum |
|--------------------|-------------------|
| Miss 1 day = Reset to 0 | Miss 1 day = 5% decay |
| Shows "0 day streak" | Shows "47 days momentum" |
| "You broke your streak!" | No negative messaging |
| Binary (on/off) | Graceful gradient |

### Momentum Decay Formula
```typescript
const calculateMomentum = (currentMomentum: number, missedDays: number): number => {
  // Each missed day decays momentum by 5%
  const decayRate = 0.05;
  const decayMultiplier = Math.pow(1 - decayRate, missedDays);
  return Math.round(currentMomentum * decayMultiplier);
};

// Example: 100 days momentum + 1 missed day
// 100 * 0.95 = 95 days (NOT 0)

// Recovery: 2 active days restore 50% of decay
const recoverMomentum = (currentMomentum: number, originalMomentum: number): number => {
  const decayAmount = originalMomentum - currentMomentum;
  const recovery = decayAmount * 0.5;
  return currentMomentum + recovery;
};
```

### Rest Day Handling
```typescript
// If user explicitly logs a rest day:
// - NO decay applied
// - Momentum maintained
// - Optional: Small bonus for logging rest ("Recovery Bonus")

const handleRestDay = (momentum: number): number => {
  // Rest days are recognized, not punished
  return momentum; // No change
};
```

---

## Post-Battle Avatar States (Party Mode 2025-12-29)

> **Victory Ceremony DEPRECATED:** Battle results are now reflected in avatar reactions on this screen, not a separate Victory Ceremony screen.

### Avatar State Based on Battle Outcome

| Battle Outcome | Avatar Pose | Message | Stats |
|----------------|-------------|---------|-------|
| `victory` | Victory pose (arms raised, celebrating) | None (stats update silently) | XP gained, stats increased |
| `continue_training` | Determined pose (training stance) | "Your champion is resting... time to train more!" | Stats unchanged (NOT reduced) |

### Victory Pose Implementation
```typescript
// Avatar displays victory pose when returning from battle with victory
const avatarState = battleResult === 'victory'
  ? 'victory_pose'
  : 'determined_pose';

// Victory pose sprite
{
  spriteKey: 'avatar_victory',
  animation: 'arms_raised',
  duration: 2000,  // Show for 2 seconds
  transitionTo: 'idle',  // Then return to normal idle
}

// Determined pose sprite (no defeat - encouraging stance)
{
  spriteKey: 'avatar_determined',
  animation: 'training_stance',
  duration: 2000,
  transitionTo: 'idle',
}
```

### Continue Training Message
```typescript
// Modal/toast shown on continue_training outcome
{
  message: "Your champion is resting... time to train more!",
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  backgroundColor: '#8BAC0F',
  borderColor: '#0F380F',
  duration: 3000,  // Auto-dismiss after 3s
  // NO negative messaging, NO guilt, NO punishment
}
```

### No-Defeat Philosophy
```typescript
// CRITICAL: These states are NEVER shown
// ❌ "You lost"
// ❌ "Defeat"
// ❌ Sad/disappointed avatar pose
// ❌ XP reduction
// ❌ Stats decrease

// ALWAYS show positive/encouraging states
// ✅ "Continue Training"
// ✅ Determined/focused pose
// ✅ Stats unchanged (not reduced)
// ✅ Forward-looking messaging
```

---

## Evolution Overlay Integration

> When XP threshold is met during battle, Evolution Ceremony triggers as an **OVERLAY** on this Home Dashboard screen.

### Evolution Trigger
```typescript
interface EvolutionCheck {
  previousXP: number;
  currentXP: number;
  evolutionThreshold: number;
}

const checkEvolution = (check: EvolutionCheck): boolean => {
  return check.previousXP < check.evolutionThreshold &&
         check.currentXP >= check.evolutionThreshold;
};

// If evolution triggered after battle:
useEffect(() => {
  if (checkEvolution(evolutionCheck)) {
    setShowEvolutionOverlay(true);
  }
}, [battleResult]);
```

### Evolution Overlay Behavior
```
┌─────────────────────────────────────┐
│  HOME DASHBOARD (dimmed background) │
│                                     │
│   ╔═══════════════════════════╗    │
│   ║   EVOLUTION OVERLAY       ║    │
│   ║                           ║    │
│   ║   [Old Sprite] → [New]    ║    │ ← Blinking animation
│   ║    Blink Blink Blink      ║    │   Pokemon Red/Blue style
│   ║                           ║    │
│   ║   "Your champion evolved!"║    │
│   ║                           ║    │
│   ║   [TAP TO CONTINUE]       ║    │
│   ╚═══════════════════════════╝    │
│                                     │
└─────────────────────────────────────┘
```

### Animation Specifications
```typescript
// Evolution blink sequence
const evolutionAnimation = {
  phases: [
    { duration: 500, showOld: true, showNew: false },
    { duration: 300, showOld: false, showNew: true },
    { duration: 300, showOld: true, showNew: false },
    { duration: 200, showOld: false, showNew: true },
    { duration: 200, showOld: true, showNew: false },
    { duration: 150, showOld: false, showNew: true },
    { duration: 150, showOld: true, showNew: false },
    { duration: 100, showOld: false, showNew: true },
    // Accelerating blink...
    { duration: 1000, showOld: false, showNew: true }, // Final new sprite
  ],
  totalDuration: 3000,
  skipOption: true,  // "Tap to skip" available
};

// Reduce Motion alternative
if (prefersReducedMotion) {
  // Crossfade instead of blinking
  evolutionAnimation = {
    type: 'crossfade',
    duration: 1000,
    skipOption: true,
  };
}
```

### Wireframe Reference
See [evolution-ceremony-screen.md](./evolution-ceremony-screen.md) for full overlay specifications.

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| Home Avatar | 160×160dp | 160×160dp | ✅ |
| Progress Ring | 100×100dp | 100×100dp | ✅ |
| Training Cartridge | Full width × 80dp | Full width × 80dp | ✅ |
| Change Workout | Variable | 120×44dp | ✅ |
| Tab Bar Item | 70×50dp | 70×50dp | ✅ |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Home Avatar
accessibilityLabel={`Your avatar, ${avatarName}. Stage ${evolutionStage}.`}
accessibilityRole="button"
accessibilityHint="Double tap to view profile and customize avatar"

// Fitness Ring
accessibilityLabel={`Fitness progress: ${fitnessPercent} percent complete. ${steps} steps of ${stepsGoal} goal.`}
accessibilityRole="button"
accessibilityHint="Double tap to view detailed fitness stats"

// Skill Ring
accessibilityLabel={`Skill progress: ${skillPercent} percent complete. ${battlesWon} battles won.`}
accessibilityRole="button"
accessibilityHint="Double tap to view detailed skill stats"

// Momentum Bar
accessibilityLabel={`Momentum: ${momentumDays} days. Keep going!`}
accessibilityRole="progressbar"
accessibilityValue={{ min: 0, max: 100, now: momentumPercent }}

// Training Cartridge
accessibilityLabel={`Daily workout ready: ${workoutTitle}`}
accessibilityRole="button"
accessibilityHint="Double tap to start your daily workout"

// Tab Bar Items
accessibilityLabel={`${tabName} tab${isActive ? ', selected' : ''}`}
accessibilityRole="tab"
accessibilityState={{ selected: isActive }}
```

### Focus Order
1. Home Avatar
2. Fitness Ring
3. Skill Ring
4. Momentum Bar
5. Training Cartridge
6. Change Workout link
7. Tab Bar (Home → Battle → Profile → Settings)

### Reduce Motion Support
```typescript
const prefersReducedMotion = useReducedMotion();

// Avatar idle animation
const avatarAnimation = prefersReducedMotion
  ? null  // Static image
  : idleBlinkAnimation;

// Ring fill animation
const ringAnimationDuration = prefersReducedMotion
  ? 0
  : 500;

// Cartridge press animation
const pressScale = prefersReducedMotion
  ? 1
  : 0.96;
```

### Color Contrast Verification

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Primary text | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Button text | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |
| Secondary text | #306230 | #9BBC0F | 2.8:1 | ⚠️ Large only |
| Shell stats | #1C1C1C | #D7D5CA | 11.3:1 | ✅ AAA |

---

## Animations & Micro-interactions

### Avatar Idle Animation
```typescript
// Subtle blink every 3-5 seconds
// Respects Reduce Motion preference
// Avatar NEVER shows disappointed/sad state
const idleBlinkAnimation = {
  frames: 4,
  duration: 200, // per frame
  interval: 4000, // between blinks
};
```

### Ring Fill Animation
```typescript
// Animate on screen entry
Animated.timing(ringProgress, {
  toValue: targetPercent,
  duration: prefersReducedMotion ? 0 : 500,
  easing: Easing.out(Easing.cubic),
  useNativeDriver: false,
}).start();
```

### Training Cartridge Press
```typescript
// Pressed state
const pressedStyle = {
  transform: [{ scale: prefersReducedMotion ? 1 : 0.96 }],
  shadowOffset: { width: 2, height: 2 },
};

// Haptic feedback
Haptics.impact(Haptics.ImpactFeedbackStyle.Medium);

// Sound effect
SoundManager.play('cartridge_select');
```

### Tab Selection
```typescript
// Visual feedback
const tabActiveStyle = {
  tintColor: '#0F380F',
};

// Haptic
Haptics.impact(Haptics.ImpactFeedbackStyle.Light);
```

---

## State Variations

### First Visit (Post-FTUE)
```
- Avatar: Default archetype silhouette
- Fitness Ring: Shows tutorial progress
- Skill Ring: Shows first battle victory
- Momentum: "1 day"
- Training Cartridge: "Daily Workout Ready!"
```

### Returning User (Workout Available)
```
- Avatar: User's generated/selected avatar
- Rings: Today's real progress
- Momentum: Accumulated days
- Training Cartridge: Current daily workout details
```

### Returning User (Workout Complete)
```
- Training Cartridge changes to:
  "Workout Complete! ✓"
  "Come back tomorrow"
  Background: #306230 (subdued)
```

### Offline State
```
- Stats show cached data with timestamp
- Toast: "You're offline. Data will sync when connected."
- Training Cartridge still functional (workout tracking works offline)
```

---

## Data Requirements

### From Supabase
```typescript
interface HomeScreenData {
  // Avatar
  homeAvatarUrl: string | null;
  evolutionStage: number;

  // Progress
  dailySteps: number;
  dailyStepsGoal: number;
  workoutMinutes: number;
  battlesWon: number;
  skillPoints: number;

  // Momentum (NOT streak)
  momentumDays: number;
  lastActivityDate: string;

  // Daily Workout/Training
  dailyWorkout: {
    id: string;
    title: string;
    status: 'pending' | 'in_progress' | 'complete';
  } | null;
}
```

### Real-time Updates
```typescript
// Subscribe to profile changes
const subscription = supabase
  .channel('home-screen')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'user_profiles',
    filter: `id=eq.${userId}`,
  }, handleProfileUpdate)
  .subscribe();
```

---

## Navigation

### Entry Points
- From FTUE completion (first time)
- App launch (returning user)
- Back navigation from other screens
- Tab bar selection

### Exit Points
- **Tap Avatar** → Profile/Avatar Screen
- **Tap Rings** → Stats Panel Overlay (slide up)
- **Tap Training Cartridge** → Workout Assignment OR Workout Tracker
- **Tap Change Workout** → Training Selection Screen
- **Tab: Battle** → Battle Mode Transition Video → Battle Screen (NOT Cartridge Load)
- **Tab: Profile** → Profile/Avatar Screen
- **Tab: Settings** → Settings Screen

---

## Implementation Notes

### Performance Optimization
```typescript
// Memoize expensive calculations
const fitnessPercent = useMemo(() =>
  Math.round((dailySteps / dailyStepsGoal) * 100),
  [dailySteps, dailyStepsGoal]
);

// Use React.memo for child components
const ProgressRing = React.memo(({ percent, label }) => {
  // Ring implementation
});
```

### Error States
```typescript
// Avatar load failure
const handleAvatarError = () => {
  setAvatarUrl(DEFAULT_AVATAR_BY_ARCHETYPE[archetype]);
};

// Data fetch failure
const handleDataError = () => {
  // Show cached data
  // Display subtle error indicator
  // Retry silently in background
};
```

---

## Related Screens

- **FTUE Exit Point**: Tutorial Battle → Home Dashboard (via Battle Mode Transition Video)
- **Stats Detail**: Stats Panel Overlay
- **Workout Flow**: Workout Assignment → Workout Tracker
- **Battle Flow**: Battle Mode Transition Video → Battle Screen (NOT Cartridge Load)
- **Evolution**: Evolution Overlay (triggered on this screen when XP threshold met)
- **Profile**: Profile/Avatar Screen
- **Settings**: Settings Screen

---

## Design System Compliance Checklist

- [x] Only 4 LCD colors used in screen content
- [x] Hardware palette used ONLY in shell area (Stats Ribbon)
- [x] No border radius (`borderRadius: 0`)
- [x] Hard pixel shadows (`shadowRadius: 0`)
- [x] No gradients
- [x] Typography: Press Start 2P (headers/labels) + Montserrat (body/stats)
- [x] All touch targets ≥ 44×44dp
- [x] Screen reader labels on all interactive elements
- [x] Reduce Motion preference respected
- [x] Raw numerical data always visible (no AI summaries hiding data)
- [x] Momentum system (graceful decay, no punishment)
- [x] Progressive disclosure (minimal elements on home)

---

**Priority**: CRITICAL - Primary user landing screen
**Estimated Implementation**: 12-16 hours
**Dependencies**: Avatar service, Quest service, Stats service
