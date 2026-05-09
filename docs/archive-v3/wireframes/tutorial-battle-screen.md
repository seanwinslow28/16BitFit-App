# Tutorial Battle Screen - Wireframe Specification

**Screen ID**: FTUE-BATTLE-01
**Batch**: 3 (MEDIUM - Tutorial & Setup)
**Status**: ✅ Spec Complete
**Design Date**: 2025-11-30
**Last Updated**: 2026-01-02
**Spec Version**: 3.0 (Party Mode Aligned)

---

## Party Mode Alignment (2025-12-29)

### Key Changes in This Version
- ✅ Default champion (Sean) used for tutorial - no champion selection in FTUE
- ✅ **GUARANTEED VICTORY** - Tutorial battle cannot result in failure
- ✅ Victory Ceremony **DEPRECATED** → Results applied silently, avatar shows victory pose on Home Dashboard
- ✅ Entry via Battle Mode Transition Video (NOT Cartridge Load Animation)
- ✅ Exit to Home Dashboard directly (no standalone ceremony screen)
- ✅ Updated FTUE flow position (Screen 6 of 8)

---

## Design System Compliance

> **Reference Document**: `docs/front-end-spec.md` v2.0
>
> This wireframe adheres to all MANDATORY DESIGN REQUIREMENTS including:
> - ✅ Dual Palette System (Battle scenes may use SF2 palette exception)
> - ✅ Typography Separation (Press Start 2P + Montserrat)
> - ✅ 44×44dp minimum touch targets
> - ✅ WCAG 2.1 AA accessibility compliance
> - ✅ Usability Traps Prevention guidelines

---

## Purpose

Guided tutorial battle with overlay instructions teaching combat mechanics. This is the user's first hands-on combat experience, introducing movement, attacks, blocking, and the energy system through **progressive disclosure** (one step at a time). 

**Key Design Decisions:**
- **Default Champion (Sean)** is automatically assigned - no character selection during FTUE
- **GUARANTEED VICTORY** - The training dummy is extremely forgiving and cannot defeat the player
- **No punishment for mistakes** - hints appear after 5 attempts (helpful, not critical)
- **No-Defeat Philosophy** - Tutorial always ends in victory for a positive first experience

---

## Layout Structure

### Full Screen (Landscape Mode - 844×390pt)

```
┌────────────────────────────────────────────────────────────┐
│  PHASER WEBVIEW (Battle Scene) + TUTORIAL OVERLAY         │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  [Battle HUD - same as Battle Screen]                     │
│                                                            │
│  ╔══════════════════════════════════════════════════════╗│
│  ║  TUTORIAL OVERLAY (Semi-transparent)                 ║│
│  ║  ┌────────────────────────────────────────────────┐  ║│
│  ║  │  STEP 1: MOVEMENT                              │  ║│ ← Tutorial Box
│  ║  │                                                │  ║│   Background: rgba(15,56,15,0.9)
│  ║  │  Use the D-Pad to move left and right.        │  ║│   Border: #9BBC0F, 4px
│  ║  │                                                │  ║│   Text: #9BBC0F
│  ║  │  [Animated D-Pad indicator]                   │  ║│
│  ║  │                                                │  ║│
│  ║  │  Try moving now!                              │  ║│
│  ║  └────────────────────────────────────────────────┘  ║│
│  ╚══════════════════════════════════════════════════════╝│
│                                                            │
│  [Player Sprite: Sean]    [Training Dummy]               │ ← Default champion
│                                                            │
│  [D-Pad]                                [Action Buttons]  │
│  Touch: 80×80dp                         Touch: 50×50dp    │
└────────────────────────────────────────────────────────────┘
```

---

## Tutorial Steps Sequence

### Step 1: Movement (D-Pad)
```
┌────────────────────────────────────┐
│  STEP 1: MOVEMENT                  │
│                                    │
│  Use the D-Pad to move left        │
│  and right.                        │
│                                    │
│  [← →] ← Animated highlight        │
│                                    │
│  Try moving now!                   │
└────────────────────────────────────┘

// Wait for user to move left AND right
// No time pressure - user can take as long as needed
// Auto-advance after successful movement
```

### Step 2: Jump
```
┌────────────────────────────────────┐
│  STEP 2: JUMP                      │
│                                    │
│  Press UP on the D-Pad to jump.    │
│                                    │
│  [↑] ← Animated highlight          │
│                                    │
│  Jump now!                         │
└────────────────────────────────────┘

// Wait for user to jump
// Auto-advance after successful jump
```

### Step 3: Light Punch
```
┌────────────────────────────────────┐
│  STEP 3: ATTACK                    │
│                                    │
│  Press LP (Light Punch) to         │
│  attack the dummy.                 │
│                                    │
│  [LP] ← Animated highlight         │
│                                    │
│  Hit the dummy!                    │
└────────────────────────────────────┘

// Wait for user to hit dummy with LP
// Auto-advance after successful hit
```

### Step 4: Combo (Multiple Punches)
```
┌────────────────────────────────────┐
│  STEP 4: COMBO                     │
│                                    │
│  Press LP multiple times quickly   │
│  to perform a combo!               │
│                                    │
│  [LP LP LP] ← Sequence indicator   │
│                                    │
│  Try a 3-hit combo!                │
└────────────────────────────────────┘

// Wait for 3+ hit combo
// Show "COMBO!" text in Phaser
```

### Step 5: Heavy Attack
```
┌────────────────────────────────────┐
│  STEP 5: HEAVY ATTACK              │
│                                    │
│  Press HP (Heavy Punch) for a      │
│  powerful strike!                  │
│                                    │
│  [HP] ← Animated highlight         │
│                                    │
│  Deals more damage but uses        │
│  more energy!                      │
└────────────────────────────────────┘

// Wait for HP attack
// Show energy depletion
```

### Step 6: Energy System
```
┌────────────────────────────────────┐
│  STEP 6: ENERGY SYSTEM             │
│                                    │
│  Your energy bar shows how many    │
│  attacks you can perform.          │
│                                    │
│  [Energy Bar Indicator]            │
│                                    │
│  Energy = Steps taken today!       │
│  More steps = More attacks!        │
└────────────────────────────────────┘

// Wait 3 seconds (informational)
// Auto-advance
```

### Step 7: Block
```
┌────────────────────────────────────┐
│  STEP 7: BLOCK                     │
│                                    │
│  Hold DOWN on the D-Pad to block   │
│  incoming attacks.                 │
│                                    │
│  [↓] ← Animated highlight          │
│                                    │
│  Block the dummy's attack!         │
└────────────────────────────────────┘

// Dummy attacks after 2 seconds (slow, telegraphed)
// Wait for user to block
```

### Step 8: Free Practice
```
┌────────────────────────────────────┐
│  STEP 8: READY TO BATTLE!          │
│                                    │
│  You've learned the basics!        │
│  Defeat the Training Dummy to      │
│  complete the tutorial.            │
│                                    │
│  Good luck!                        │
└────────────────────────────────────┘

// Remove overlay after 2 seconds
// Full battle begins
// Dummy has LOW HP (3 hits to defeat) - GUARANTEED VICTORY
```

---

## Component Specifications

### Tutorial Overlay Box
```typescript
{
  position: 'absolute',
  top: 60,
  left: 40,
  right: 40,
  backgroundColor: 'rgba(15, 56, 15, 0.95)',  // Deep forest, 95% opacity
  borderWidth: 4,
  borderColor: '#9BBC0F',                      // Neon grass
  borderRadius: 0,                             // MANDATORY: No rounded corners
  padding: 20,
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 0,                             // MANDATORY: Hard pixel shadow
  zIndex: 1000,
}

// Tutorial Title
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  color: '#9BBC0F',
  marginBottom: 12,
  textAlign: 'center',
}

// Tutorial Text
{
  fontFamily: 'Montserrat',
  fontSize: 14,
  lineHeight: 20,
  color: '#9BBC0F',
  textAlign: 'center',
  marginBottom: 16,
}

// Instruction Highlight (e.g., button indicator)
{
  alignSelf: 'center',
  marginBottom: 12,
}
```

### Button Highlight Animation
```typescript
// Pulsing glow effect on highlighted button (respects Reduce Motion)
const prefersReducedMotion = useReducedMotion();

const highlightAnimation = prefersReducedMotion
  ? { opacity: 1 }  // Static highlight
  : Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.3,
          duration: 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

// Highlight overlay
{
  position: 'absolute',
  backgroundColor: '#9BBC0F',
  opacity: glowOpacity,
  borderRadius: 0,                             // MANDATORY: No rounded corners
  // Positioned over target button
}
```

---

## Usability Compliance

> **Reference**: front-end-spec.md "Usability Traps Prevention" section

### Trap 1: Information Density ✅
- **Compliance**: One instruction at a time
- **Implementation**: Progressive disclosure - each step shows only relevant info

### Trap 2: AI Summaries ✅
- **Compliance**: No AI-generated content
- **Implementation**: Static, predefined tutorial steps

### Trap 3: Punishment Mechanics ✅
- **Compliance**: No negative consequences for failed attempts
- **Implementation**:
  - Training dummy is forgiving (low damage, low HP)
  - No time pressure during tutorial steps
  - Hints appear after 5 attempts (helpful, not critical)
  - No "you failed" messaging
  - **GUARANTEED VICTORY** - Tutorial cannot result in defeat

### Trap 4: Onboarding Overload ✅
- **Compliance**: 8 simple steps, each isolated
- **Implementation**:
  - One action per step
  - Clear visual indicators
  - Auto-advance on success

### Trap 5: Feature Labyrinths ✅
- **Compliance**: Linear progression, no branching
- **Implementation**: Step 1 → Step 2 → ... → Step 8 → Victory → Home Dashboard

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| D-Pad (each direction) | 40×40dp | 50×50dp | ✅ |
| D-Pad (total) | 80×80dp | 120×120dp | ✅ |
| LP Button | 50×50dp | 50×50dp | ✅ |
| HP Button | 50×50dp | 50×50dp | ✅ |
| Pause Button | 44×44dp | 44×44dp | ✅ |
| Skip Button (in modal) | Full width × 48dp | Full width × 48dp | ✅ |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Tutorial step announcement
accessibilityLabel={`Step ${currentStep} of 8: ${stepTitle}. ${stepInstruction}`}
accessibilityRole="alert"
accessibilityLiveRegion="polite"

// D-Pad
accessibilityLabel="Directional pad. Use left, right, up to move and jump. Hold down to block."
accessibilityRole="button"
accessibilityHint="Swipe in direction to move"

// LP Button
accessibilityLabel="Light Punch button"
accessibilityRole="button"
accessibilityHint="Double tap for light attack"

// HP Button
accessibilityLabel="Heavy Punch button"
accessibilityRole="button"
accessibilityHint="Double tap for heavy attack"

// Step completion
accessibilityLabel="Step completed successfully"
accessibilityRole="alert"
```

### Focus Order
1. Tutorial Overlay (when visible)
2. D-Pad
3. LP Button
4. HP Button
5. Pause Button

### Reduce Motion Support
```typescript
const prefersReducedMotion = useReducedMotion();

// Tutorial step transition
const stepTransition = prefersReducedMotion
  ? null  // Instant swap
  : fadeTransition;

// Button highlight
const buttonHighlight = prefersReducedMotion
  ? { opacity: 1 }  // Static
  : pulsingAnimation;

// Combat animations in Phaser
// Controlled via bridge message
webSocketBridge.send({
  type: 'SET_REDUCED_MOTION',
  enabled: prefersReducedMotion,
});
```

### Color Contrast Verification

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Tutorial title | #9BBC0F | rgba(15,56,15,0.95) | 5.8:1 | ✅ AA |
| Tutorial text | #9BBC0F | rgba(15,56,15,0.95) | 5.8:1 | ✅ AA |
| HUD text | Per SF2 palette | Battle background | Varies | ✅ |

---

## Tutorial State Management

### Tutorial Progress Tracking
```typescript
interface TutorialState {
  currentStep: number;
  completed: boolean;
  stepProgress: {
    [key: number]: {
      started: boolean;
      completed: boolean;
      attempts: number;
    };
  };
}

const tutorialSteps = [
  { id: 1, name: 'Movement', condition: 'moved_left_and_right' },
  { id: 2, name: 'Jump', condition: 'jumped' },
  { id: 3, name: 'Light Punch', condition: 'hit_with_lp' },
  { id: 4, name: 'Combo', condition: 'performed_3_hit_combo' },
  { id: 5, name: 'Heavy Attack', condition: 'hit_with_hp' },
  { id: 6, name: 'Energy System', condition: 'viewed_for_3s' },
  { id: 7, name: 'Block', condition: 'blocked_attack' },
  { id: 8, name: 'Free Practice', condition: 'defeated_dummy' },
];
```

### Step Validation
```typescript
const validateStepCompletion = (step: number, action: string) => {
  switch (step) {
    case 1: // Movement
      if (action === 'MOVE_LEFT') setMovedLeft(true);
      if (action === 'MOVE_RIGHT') setMovedRight(true);
      if (movedLeft && movedRight) advanceToNextStep();
      break;

    case 2: // Jump
      if (action === 'JUMP') advanceToNextStep();
      break;

    case 3: // Light Punch
      if (action === 'HIT_LANDED' && attackType === 'LP') {
        advanceToNextStep();
      }
      break;

    case 4: // Combo
      if (comboCount >= 3) advanceToNextStep();
      break;

    case 5: // Heavy Attack
      if (action === 'HIT_LANDED' && attackType === 'HP') {
        advanceToNextStep();
      }
      break;

    case 6: // Energy System (informational)
      setTimeout(() => advanceToNextStep(), 3000);
      break;

    case 7: // Block
      if (action === 'BLOCKED_ATTACK') advanceToNextStep();
      break;

    case 8: // Free Practice
      if (action === 'DUMMY_DEFEATED') completeTutorial();
      break;
  }
};
```

---

## Animations & Effects

### Step Transition
```typescript
// Fade out current step, fade in next step (respects Reduce Motion)
const transitionToNextStep = () => {
  if (prefersReducedMotion) {
    setCurrentStep(currentStep + 1);
    return;
  }

  Animated.sequence([
    Animated.timing(overlayOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }),
    Animated.timing(overlayOpacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }),
  ]).start();
};

// Play transition sound
SoundManager.play('tutorial_advance');
```

### Success Feedback
```typescript
// When step completed (no failure states - only success)
SoundManager.play('tutorial_success');
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

// Show checkmark briefly
setShowCheckmark(true);
setTimeout(() => setShowCheckmark(false), 1000);
```

---

## Edge Cases & Error Handling

### User Struggles (Multiple Failed Attempts)
```typescript
// After 5 failed attempts on a step - show HELPFUL hint (not critical)
if (stepAttempts >= 5) {
  showHint(currentStep);
}

// Hints are encouraging, not punishing
const hints = {
  1: "Try tapping the left arrow, then the right arrow!",
  2: "Tap the up arrow on the D-Pad to jump!",
  3: "Tap the LP button on the right side!",
  4: "Keep tapping LP quickly - you've got this!",
  5: "Tap the HP button for a powerful hit!",
  6: null, // No hint needed (auto-advance)
  7: "Hold down on the D-Pad when you see the attack coming!",
  8: "Use everything you learned to defeat the dummy!",
};
```

### User Skips Tutorial
```
// Pause button shows skip option - no guilt messaging
┌────────────────────────────────────┐
│  ╔═══════════════════════════╗   │
│  ║  SKIP TUTORIAL?           ║   │
│  ║                           ║   │
│  ║  You can replay it later  ║   │
│  ║  from Settings.           ║   │
│  ║                           ║   │
│  ║  ┌───────────────────┐    ║   │
│  ║  │   CONTINUE        │    ║   │  ← Touch: 44dp height
│  ║  └───────────────────┘    ║   │
│  ║  ┌───────────────────┐    ║   │
│  ║  │   SKIP            │    ║   │  ← Touch: 44dp height
│  ║  └───────────────────┘    ║   │
│  ╚═══════════════════════════╝   │
└────────────────────────────────────┘
```

---

## Bridge Communication

### Tutorial Events (React Native → Phaser)
```typescript
// Notify Phaser of current tutorial step
webSocketBridge.send(msgpack.encode({
  type: 'TUTORIAL_STEP',
  step: currentStep,
  instruction: tutorialSteps[currentStep].name,
}));
```

### Action Events (Phaser → React Native)
```javascript
// Phaser sends action events for validation
this.bridge.send({
  type: 'TUTORIAL_ACTION',
  action: 'HIT_LANDED',
  attackType: 'LP',
  comboCount: this.player.comboCount,
});
```

---

## Implementation Notes

### Tutorial Completion (Party Mode Aligned)
```typescript
/**
 * Tutorial Completion - Party Mode (2025-12-29)
 * 
 * Victory Ceremony is DEPRECATED. Results are:
 * 1. Applied silently to user stats
 * 2. Avatar shows victory pose on Home Dashboard
 * 3. Evolution overlay triggered if XP threshold met
 */
const completeTutorial = async () => {
  // Mark tutorial as complete
  const userId = user?.id || deferredProfile?.id;

  await supabase
    .from('user_profiles')
    .update({
      tutorial_completed: true,
      onboarding_completed: true,  // FTUE complete!
      last_battle_outcome: 'victory',  // For avatar pose
    })
    .eq('id', userId);

  // Apply rewards silently (no ceremony screen)
  await applyRewards({
    xp: 50,
    battleTicket: 0,  // No ticket for tutorial
    stats: tutorialStats,
  });

  // Send completion to Phaser (exit battle mode)
  bridge.send('TUTORIAL_COMPLETE', {
    outcome: 'victory',  // ALWAYS victory for tutorial (guaranteed)
    xpGained: 50,
    unlockedBattleMode: true,
  });

  // Play Battle Mode Transition Video (exit, landscape → portrait)
  await playBattleModeTransitionVideo({ direction: 'exit' });

  // Navigate to Home Dashboard (avatar will show victory pose)
  navigation.navigate('Home');
};
```

> ⚠️ **Note:** Victory Ceremony screen is DEPRECATED (Party Mode 2025-12-29). Battle results are reflected in avatar pose on Home Dashboard, not a standalone ceremony.

---

## Navigation

### Entry Points
- From Battle Mode Transition Video (FTUE flow)
- **Note:** Cartridge Load Animation is NOT used for tutorial - that's for post-onboarding workouts only

### Exit Points
- To Home Dashboard (via Battle Mode Transition Video exit) - on completion
- To Home Dashboard (if skipped via pause menu)

### Flow Diagram

```
Simulated Workout Complete
    │
    ▼
Battle Mode Transition Video (portrait → landscape)
    │
    ▼
TUTORIAL BATTLE SCREEN (this screen)
(Phaser, Landscape, Default champion: Sean)
    │
    ├─ [Tutorial Steps 1-7] (guided learning)
    │
    ├─ [Step 8: Defeat Training Dummy] (GUARANTEED VICTORY)
    │
    ▼
Battle Mode Transition Video (landscape → portrait)
    │
    ▼
Home Dashboard (avatar shows VICTORY POSE)
(Evolution overlay if XP threshold met)
```

---

## Related Screens

- **Previous**: Battle Mode Transition Video (from Simulated Workout)
- **Next**: Home Dashboard (via Battle Mode Transition Video exit)
- **Flow**: FTUE Phase 1 - Core Loop (Screen 6 of 8)
- **Deprecated**: Victory Ceremony (merged into Home Dashboard avatar reactions)

---

## Design System Compliance Checklist

- [x] Tutorial overlay uses DMG palette (translucent)
- [x] Battle scene uses SF2 palette (documented exception)
- [x] No border radius (`borderRadius: 0`)
- [x] Typography: Press Start 2P (titles) + Montserrat (instructions)
- [x] All touch targets ≥ 44×44dp
- [x] Screen reader labels on all interactive elements
- [x] Reduce Motion preference respected
- [x] Progressive disclosure (one step at a time)
- [x] No punishment mechanics (forgiving training dummy)
- [x] Helpful hints (not critical feedback)
- [x] **GUARANTEED VICTORY** (No-Defeat Philosophy)
- [x] Default champion (Sean) for tutorial
- [x] Victory Ceremony DEPRECATED - results via avatar pose

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-11-30 | 1.0 | Initial specification |
| 2025-12-06 | 2.0 | Added bridge communication, accessibility updates |
| 2026-01-02 | 3.0 | **Party Mode Alignment:** Default champion (Sean) for tutorial. GUARANTEED VICTORY emphasized. Victory Ceremony DEPRECATED - results reflected in avatar pose on Home Dashboard. Updated navigation to use Battle Mode Transition Video. Updated FTUE position to Screen 6 of 8. Added Party Mode alignment section. |

---

**Priority**: MEDIUM - Essential for FTUE but not daily loop
**Target Duration**: 30-45 seconds (tutorial battle) + ~75 seconds (tutorial steps)
**FTUE Position**: Screen 6 of 8 (Core Loop)
**Estimated Implementation**: 12-16 hours (tutorial system + validation)
**Default Champion**: Sean (MMA Fighter) - no selection in FTUE
