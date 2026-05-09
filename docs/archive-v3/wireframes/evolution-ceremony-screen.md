# Evolution Ceremony Screen - Wireframe Specification

**Screen ID**: CEREMONY-03
**Batch**: 4 (LOWER - Secondary Features)
**Status**: ✅ Spec Complete
**Design Date**: 2025-11-30
**Last Updated**: 2025-12-29
**Spec Version**: 3.0

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

## Changelog

### v3.0 (2025-12-29)
- **NEW:** Two-phase evolution ceremony (Phase 1: Home overlay, Phase 2: Results screen)
- **NEW:** Pokemon Red/Blue-style blinking animation with accelerating rhythm
- **NEW:** "Tap to skip" option for user control
- **NEW:** Reduce Motion: crossfade instead of blinking
- **NEW:** Comprehensive audio specification with sound cues
- **CHANGED:** Entry point is now always Home Dashboard (not Victory Ceremony)

---

## Purpose

Celebrate avatar evolution from Stage 1 to Stage 2 (and beyond), using a **two-phase ceremony** inspired by Pokemon Red/Blue's evolution sequence. **Pure celebration** - no "finally" or "at last" phrasing that implies previous inadequacy.

---

## Two-Phase Architecture

### Phase 1: Evolution Overlay (on Home Dashboard)
- **Location:** Modal overlay on Home Dashboard screen
- **Duration:** ~5-8 seconds (skippable)
- **Animation:** Pokemon-style blinking between old/new sprite with accelerating rhythm
- **Purpose:** Create suspenseful, nostalgic transformation moment

### Phase 2: Results Screen (standalone)
- **Location:** Full screen (replaces Home temporarily)
- **Duration:** User-controlled (Continue button)
- **Content:** Side-by-side comparison, new abilities, stat bonuses
- **Purpose:** Celebrate and display tangible progress

---

## Phase 1: Evolution Overlay

### Visual Layout (329×584pt LCD overlay)

```
┌─────────────────────────────────────┐
│  HOME DASHBOARD (dimmed)            │
│  [Semi-transparent overlay]         │
├─────────────────────────────────────┤
│                                     │
│   ╔═══════════════════════════╗   │
│   ║                           ║   │
│   ║  YOUR CHAMPION IS         ║   │ ← Title text
│   ║  EVOLVING!                ║   │   Font: Press Start 2P, 14px
│   ║                           ║   │   Color: #0F380F
│   ╚═══════════════════════════╝   │
│                                     │
│         ┌─────────────────┐         │
│         │                 │         │
│         │   [BLINKING]    │         │ ← 128×128 sprite
│         │   Old ↔ New     │         │   Alternates between sprites
│         │                 │         │
│         └─────────────────┘         │
│                                     │
│         ░░░░░░░░░░░░░░░░           │ ← Progress bar (visual only)
│         [Accelerating blink]        │   Fills as blink speed increases
│                                     │
│                                     │
│         Tap to skip                 │ ← Subtle skip hint
│                                     │   Font: Montserrat, 10px
│                                     │   Color: #306230
└─────────────────────────────────────┘
```

### Pokemon-Style Blinking Animation

```typescript
/**
 * Pokemon Red/Blue Evolution Blink Sequence
 *
 * The sprite alternates between old and new forms with
 * accelerating frequency, building anticipation.
 *
 * Timing pattern (ms between toggles):
 * Phase A: 800, 800, 800              // Slow introduction
 * Phase B: 600, 600, 600              // Building
 * Phase C: 400, 400, 400              // Accelerating
 * Phase D: 200, 200, 200, 200         // Fast
 * Phase E: 100, 100, 100, 100, 100    // Very fast
 * Phase F: 50, 50, 50, 50, 50, 50     // Rapid
 * Final: Hold new sprite + flash
 *
 * Total duration: ~5.5 seconds
 */

const BLINK_SEQUENCE = [
  // Phase A: Slow (3 blinks)
  800, 800, 800,
  // Phase B: Building (3 blinks)
  600, 600, 600,
  // Phase C: Accelerating (3 blinks)
  400, 400, 400,
  // Phase D: Fast (4 blinks)
  200, 200, 200, 200,
  // Phase E: Very fast (5 blinks)
  100, 100, 100, 100, 100,
  // Phase F: Rapid (6 blinks)
  50, 50, 50, 50, 50, 50,
];

const playEvolutionBlinkSequence = async (
  oldSprite: string,
  newSprite: string,
  onComplete: () => void
) => {
  let showingNew = false;

  for (const delay of BLINK_SEQUENCE) {
    showingNew = !showingNew;
    setCurrentSprite(showingNew ? newSprite : oldSprite);
    await sleep(delay);
  }

  // Final: Hold new sprite
  setCurrentSprite(newSprite);

  // Flash effect (#8BAC0F, not white)
  await flashScreen('#8BAC0F', 300);

  // Play evolution complete sound
  SoundManager.play('evolution_complete');

  // Haptic: Success
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  onComplete();
};
```

### Overlay Component Styles

```typescript
// Overlay container (dims Home Dashboard)
{
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(155, 188, 15, 0.9)',  // #9BBC0F at 90%
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 100,
}

// Title container
{
  backgroundColor: '#8BAC0F',
  borderWidth: 4,
  borderColor: '#0F380F',
  borderRadius: 0,
  paddingVertical: 16,
  paddingHorizontal: 24,
  marginBottom: 32,
  shadowColor: '#0F380F',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,
}

// Title text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 14,
  color: '#0F380F',
  textAlign: 'center',
}

// Sprite container
{
  width: 128,
  height: 128,
  borderWidth: 4,
  borderColor: '#0F380F',
  borderRadius: 0,
  backgroundColor: '#9BBC0F',
  justifyContent: 'center',
  alignItems: 'center',
}

// Progress bar container
{
  width: 200,
  height: 12,
  backgroundColor: '#306230',
  borderWidth: 2,
  borderColor: '#0F380F',
  borderRadius: 0,
  marginTop: 24,
  overflow: 'hidden',
}

// Progress bar fill (animated)
{
  height: '100%',
  backgroundColor: '#8BAC0F',
  // Width animates from 0% to 100% over blink sequence
}

// Skip hint text
{
  fontFamily: 'Montserrat',
  fontSize: 10,
  color: '#306230',
  marginTop: 48,
  opacity: 0.7,
}
```

### Reduce Motion Support (Phase 1)

```typescript
const prefersReducedMotion = useReducedMotion();

const playEvolutionPhase1 = async () => {
  if (prefersReducedMotion) {
    // Crossfade instead of blinking
    // Old sprite fades out, new sprite fades in
    await Animated.parallel([
      Animated.timing(oldSpriteOpacity, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(newSpriteOpacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();

    onComplete();
  } else {
    // Full blink sequence
    await playEvolutionBlinkSequence(oldSprite, newSprite, onComplete);
  }
};
```

### Tap to Skip Behavior

```typescript
const handleTapToSkip = () => {
  // Cancel blink animation
  cancelBlinkSequence();

  // Jump to final state
  setCurrentSprite(newSprite);

  // Quick flash
  flashScreen('#8BAC0F', 150);

  // Proceed to Phase 2
  navigateToPhase2();
};

// Touch handler covers entire overlay
<TouchableOpacity
  style={overlayStyles}
  onPress={handleTapToSkip}
  accessibilityLabel="Tap to skip evolution animation"
  accessibilityHint="Skips to evolution results"
>
  {/* Overlay content */}
</TouchableOpacity>
```

---

## Phase 2: Results Screen

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
│   ║   EVOLUTION COMPLETE!     ║   │ ← Header (celebration)
│   ║                           ║   │   Font: Press Start 2P, 12px
│   ╚═══════════════════════════╝   │
│                                     │
│   ┌───────────────────────────┐   │
│   │  STAGE 1    →    STAGE 2  │   │ ← Transformation Label
│   │                           │   │   Font: Press Start 2P, 10px
│   │                           │   │
│   │  ┌───────┐    ┌───────┐   │   │
│   │  │       │    │       │   │   │
│   │  │ Before│    │ After │   │   │ ← Avatar Comparison
│   │  │ 64×64 │ →  │128×128│   │   │   DMG palette only
│   │  │       │    │       │   │   │
│   │  └───────┘    └───────┘   │   │
│   │                           │   │
│   └───────────────────────────┘   │
│                                     │
│   ╔═══════════════════════════╗   │
│   ║  NEW ABILITIES            ║   │ ← Section Title
│   ║  ─────────────────────    ║   │   Font: Press Start 2P, 10px
│   ║                           ║   │
│   ║  • Idle animation         ║   │ ← Abilities gained
│   ║  • Happy expression       ║   │   Font: Montserrat, 12px
│   ║  • Stage 2 sprite         ║   │   Positive framing only
│   ║                           ║   │
│   ╚═══════════════════════════╝   │
│                                     │
│   ╔═══════════════════════════╗   │
│   ║  STAT BONUSES             ║   │ ← RAW DATA visible
│   ║  ─────────────────────    ║   │
│   ║  HP Max:    50 → 65       ║   │ ← Before → After format
│   ║  Attack:    10 → 12       ║   │   Clear numerical change
│   ║  Defense:   8 → 10        ║   │
│   ║  Speed:     7 → 8         ║   │
│   ╚═══════════════════════════╝   │
│                                     │
│   ┌───────────────────────────┐   │
│   │        AWESOME!           │   │ ← Continue Button
│   └───────────────────────────┘   │   Touch: Full width × 52dp
│                                     │
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
  backgroundColor: '#8BAC0F',      // Lime highlight for celebration
  borderWidth: 4,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  paddingVertical: 16,
  paddingHorizontal: 24,
  marginHorizontal: 24,
  marginBottom: 20,
  shadowColor: '#0F380F',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,                 // MANDATORY: Hard pixel shadow
}

// Header Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  color: '#0F380F',
  textAlign: 'center',
}
```

### 3. Transformation Container
```typescript
{
  backgroundColor: '#9BBC0F',
  borderWidth: 4,
  borderColor: '#306230',
  borderRadius: 0,
  padding: 16,
  marginHorizontal: 24,
  marginBottom: 16,
  alignItems: 'center',
}

// Stage Label Row
{
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  width: '100%',
  marginBottom: 12,
}

// Stage Label
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
}

// Arrow
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  color: '#306230',
}
```

### 4. Avatar Comparison Row
```typescript
{
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  width: '100%',
}

// Before Avatar (Stage 1)
{
  width: 64,
  height: 64,
  borderWidth: 2,
  borderColor: '#306230',
  borderRadius: 0,
  opacity: 0.7,                    // Slightly faded (past)
}

// After Avatar (Stage 2)
{
  width: 128,
  height: 128,
  borderWidth: 4,
  borderColor: '#0F380F',
  borderRadius: 0,
}
```

### 5. New Abilities Section
```typescript
{
  backgroundColor: '#9BBC0F',
  borderWidth: 4,
  borderColor: '#306230',
  borderRadius: 0,
  padding: 16,
  marginHorizontal: 24,
  marginBottom: 16,
}

// Section Title
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
  marginBottom: 8,
  borderBottomWidth: 2,
  borderBottomColor: '#306230',
  paddingBottom: 4,
}

// Ability Item
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#0F380F',
  marginBottom: 6,
  paddingLeft: 8,
}
```

### 6. Stat Bonuses Section (RAW DATA)
```typescript
{
  backgroundColor: '#9BBC0F',
  borderWidth: 4,
  borderColor: '#306230',
  borderRadius: 0,
  padding: 16,
  marginHorizontal: 24,
  marginBottom: 24,
}

// Section Title
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
  marginBottom: 8,
  borderBottomWidth: 2,
  borderBottomColor: '#306230',
  paddingBottom: 4,
}

// Stat Row
{
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 6,
}

// Stat Label
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#306230',
  width: 80,
}

// Stat Value (Before → After)
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  fontWeight: '600',
  color: '#0F380F',
}

// Increase Indicator
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  fontWeight: '700',
  color: '#0F380F',              // Same color - no "positive green"
}
```

### 7. Continue Button
```typescript
{
  backgroundColor: '#8BAC0F',
  borderWidth: 4,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  paddingVertical: 16,
  marginHorizontal: 24,
  minHeight: 52,                   // MANDATORY: Touch target
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
```

---

## Usability Compliance

> **Reference**: front-end-spec.md "Usability Traps Prevention" section

### Trap 1: Information Density ✅
- **Compliance**: All stat changes show raw numerical values
- **Implementation**: "50 → 65" format, not "+30%" (which hides base values)

### Trap 2: AI Summaries ✅
- **Compliance**: No AI-generated descriptions
- **Implementation**: Predefined ability lists per evolution stage

### Trap 3: Punishment Mechanics ✅
- **Compliance**: Pure celebration - no backhanded compliments
- **Implementation**:
  - "EVOLUTION COMPLETE!" (not "Finally evolved!")
  - "NEW ABILITIES" (not "Abilities you were missing")
  - No comparison to other users
  - No "took X days" shaming

### Trap 4: Onboarding Overload ✅
- **Compliance**: Single celebration screen
- **Implementation**: One Continue button, clear visual hierarchy

### Trap 5: Feature Labyrinths ✅
- **Compliance**: Single action path
- **Implementation**: One CTA → Return to Home/Profile

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| AWESOME Button | Full width × 52dp | Full width × 52dp | ✅ |
| Before Avatar | 64×64pt | Non-interactive | N/A |
| After Avatar | 128×128pt | Non-interactive | N/A |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Screen announcement
accessibilityLabel="Evolution complete! Your avatar has evolved from Stage 1 to Stage 2"
accessibilityRole="alert"

// Avatar comparison
accessibilityLabel={`Your avatar has evolved. Before: Stage ${prevStage}. After: Stage ${newStage}`}
accessibilityRole="image"

// New abilities
accessibilityLabel={`New abilities unlocked: ${abilities.join(', ')}`}
accessibilityRole="list"

// Stat bonuses
accessibilityLabel={`Stat bonuses: HP Max increased from ${oldHP} to ${newHP}. Attack increased from ${oldAttack} to ${newAttack}. Defense increased from ${oldDefense} to ${newDefense}. Speed increased from ${oldSpeed} to ${newSpeed}`}
accessibilityRole="text"

// Continue button
accessibilityLabel="Continue"
accessibilityRole="button"
accessibilityHint="Double tap to return to your profile"
```

### Focus Order
1. Header (announcement)
2. Transformation display (informational)
3. New Abilities section (informational)
4. Stat Bonuses section (informational)
5. AWESOME Button

### Reduce Motion Support
```typescript
const prefersReducedMotion = useReducedMotion();

// Evolution animation
const evolutionAnimation = prefersReducedMotion
  ? null  // Instant transformation
  : {
      beforeFadeOut: { duration: 500 },
      flash: { duration: 200 },
      afterFadeIn: { duration: 500 },
      particles: true,
    };

// Stat count-up animation
const statAnimation = prefersReducedMotion
  ? null  // Instant display
  : countUpAnimation;

// Button press animation
const buttonScale = prefersReducedMotion
  ? 1
  : 0.96;
```

### Color Contrast Verification

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Header text | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |
| Stage labels | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Ability items | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Stat labels | #306230 | #9BBC0F | 2.8:1 | ⚠️ Large only |
| Stat values | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Button text | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |

---

## Animations

### Evolution Sequence (Respects Reduce Motion)
```typescript
const playEvolutionSequence = async () => {
  if (prefersReducedMotion) {
    // Instant - show final state
    setShowAfterAvatar(true);
    setShowStats(true);
    return;
  }

  // Step 1: Flash effect using #8BAC0F (NOT white)
  await flashScreen('#8BAC0F', 200);

  // Step 2: Fade out before avatar
  await Animated.timing(beforeOpacity, {
    toValue: 0.3,
    duration: 300,
    useNativeDriver: true,
  }).start();

  // Step 3: Scale in after avatar
  await Animated.spring(afterScale, {
    toValue: 1,
    friction: 6,
    tension: 40,
    useNativeDriver: true,
  }).start();

  // Step 4: Celebration particles
  playParticleEffect();

  // Step 5: Count up stats
  animateStatChanges();

  // Haptic: Success notification
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  // Sound: Evolution chime
  SoundManager.play('evolution_complete');
};
```

### Button Press
```typescript
const pressedStyle = {
  transform: [{ scale: prefersReducedMotion ? 1 : 0.96 }],
  shadowOffset: { width: 2, height: 2 },
};

// Haptic: Light impact
Haptics.impact(Haptics.ImpactFeedbackStyle.Light);

// Sound: 8-bit confirm
SoundManager.play('button_confirm');
```

---

## Audio Specification

### Evolution Ceremony Sound Design

The evolution ceremony uses a carefully designed audio sequence inspired by Pokemon Red/Blue, creating an iconic and memorable transformation moment.

### Sound Assets Required

| Sound ID | Description | Duration | Format | Notes |
|----------|-------------|----------|--------|-------|
| `evolution_start` | Rising chiptune arpeggio | ~1.5s | .mp3/.ogg | Plays at Phase 1 overlay start |
| `evolution_blink` | Quick 8-bit "blip" | ~50ms | .mp3/.ogg | Plays on each sprite toggle |
| `evolution_accelerate` | Ascending pitch sequence | ~2s | .mp3/.ogg | Accompanies final rapid blinks |
| `evolution_complete` | Triumphant 8-bit fanfare | ~2s | .mp3/.ogg | Plays after flash, before Phase 2 |
| `stat_tick` | Single 8-bit tick | ~30ms | .mp3/.ogg | Plays during stat count-up |
| `button_confirm` | 8-bit selection sound | ~100ms | .mp3/.ogg | Continue button press |

### Audio Sequence Timeline

```
Phase 1 Timeline (5.5 seconds):
├─ 0.0s:   evolution_start plays
├─ 0.5s:   evolution_blink starts (synced with sprite toggles)
│   └─ Each blink triggers blink sound
├─ 4.0s:   evolution_accelerate fades in
├─ 5.0s:   evolution_blink intensifies (rapid phase)
├─ 5.5s:   Flash effect + evolution_complete fanfare
└─ 6.0s:   Transition to Phase 2

Phase 2 Timeline (user-controlled):
├─ 0.0s:   Silence (let fanfare echo fade)
├─ 0.5s:   stat_tick plays for each stat reveal
└─ User:   button_confirm on Continue press
```

### Audio Implementation

```typescript
/**
 * Evolution Audio Controller
 *
 * Manages the layered audio experience for evolution ceremony.
 * Respects device mute and app sound settings.
 */

class EvolutionAudioController {
  private blinkSoundRef: Audio.Sound | null = null;

  async playPhase1Audio(blinkSequence: number[]): Promise<void> {
    // Check audio enabled
    if (!SoundManager.isEnabled()) return;

    // Play start chime
    await SoundManager.play('evolution_start', { volume: 0.8 });

    // Sync blink sounds with visual sequence
    let elapsed = 0;
    for (const delay of blinkSequence) {
      setTimeout(() => {
        SoundManager.play('evolution_blink', {
          volume: 0.4,
          // Pitch increases as sequence accelerates
          pitch: 1.0 + (elapsed / 5500) * 0.3,
        });
      }, elapsed);
      elapsed += delay;
    }

    // Accelerate sound at 4 second mark
    setTimeout(() => {
      SoundManager.play('evolution_accelerate', { volume: 0.6 });
    }, 4000);

    // Fanfare at completion
    setTimeout(() => {
      SoundManager.play('evolution_complete', { volume: 0.9 });
    }, 5500);
  }

  async playStatReveal(): Promise<void> {
    await SoundManager.play('stat_tick', { volume: 0.5 });
  }

  cleanup(): void {
    this.blinkSoundRef?.unloadAsync();
  }
}
```

### Reduce Motion Audio Behavior

When Reduce Motion is enabled, the audio sequence is simplified:

```typescript
if (prefersReducedMotion) {
  // Skip blink sounds entirely
  // Play only the fanfare on crossfade complete
  await SoundManager.play('evolution_complete', { volume: 0.9 });
}
```

### Silent Mode Compliance

```typescript
// Respect device silent mode (iOS)
// React Native's Audio respects AVAudioSession settings automatically

// App-level mute toggle
if (!userSettings.soundEnabled) {
  // Skip all audio, haptics still play
}
```

---

## State Variations

### Stage 1 → Stage 2
```
STAGE 1    →    STAGE 2

NEW ABILITIES
─────────────────────
• Idle animation
• Happy expression
• Stage 2 sprite

STAT BONUSES
─────────────────────
HP Max:    50 → 65
Attack:    10 → 12
Defense:   8 → 10
Speed:     7 → 8
```

### Stage 2 → Stage 3 (Future)
```
STAGE 2    →    STAGE 3

NEW ABILITIES
─────────────────────
• Battle-ready pose
• Victory animation
• Stage 3 sprite

STAT BONUSES
─────────────────────
HP Max:    65 → 85
Attack:    12 → 15
Defense:   10 → 13
Speed:     8 → 10
```

### Loading Evolution Data
```
╔═══════════════════════════════╗
║                               ║
║   [Pixel spinner]             ║
║                               ║
║   Preparing evolution...      ║ ← Neutral, exciting
║                               ║
╚═══════════════════════════════╝
```

---

## Implementation Notes

### Evolution Data
```typescript
interface EvolutionData {
  previousStage: number;
  newStage: number;
  previousAvatarUrl: string;
  newAvatarUrl: string;
  abilities: string[];
  statChanges: {
    hpMax: { before: number; after: number };
    attack: { before: number; after: number };
    defense: { before: number; after: number };
    speed: { before: number; after: number };
  };
}

const evolutionStages: Record<number, { abilities: string[] }> = {
  2: {
    abilities: ['Idle animation', 'Happy expression', 'Stage 2 sprite'],
  },
  3: {
    abilities: ['Battle-ready pose', 'Victory animation', 'Stage 3 sprite'],
  },
};
```

### Handle Continue
```typescript
const handleContinue = async () => {
  // Update user profile with new stage
  await supabase
    .from('user_profiles')
    .update({
      avatar_stage: evolutionData.newStage,
      home_avatar_url: evolutionData.newAvatarUrl,
    })
    .eq('id', userId);

  // Haptic: Success
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  // Navigate to Profile
  navigation.navigate('Profile');
};
```

### Trigger Evolution
```typescript
// Evolution is triggered when XP threshold is met
const checkEvolution = async (userId: string, currentXP: number) => {
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('avatar_stage, xp')
    .eq('id', userId)
    .single();

  const xpThresholds = {
    2: 200,   // Stage 1 → 2
    3: 500,   // Stage 2 → 3
  };

  const nextStage = profile.avatar_stage + 1;
  const threshold = xpThresholds[nextStage];

  if (currentXP >= threshold) {
    // Generate evolved avatar
    const newAvatarUrl = await generateEvolvedAvatar(userId, nextStage);

    // Navigate to evolution ceremony
    navigation.navigate('EvolutionCeremony', {
      previousStage: profile.avatar_stage,
      newStage: nextStage,
      previousAvatarUrl: profile.home_avatar_url,
      newAvatarUrl: newAvatarUrl,
    });
  }
};
```

---

## Navigation

### Phase 1: Evolution Overlay

**Entry Point (Single):**
- Triggered on Home Dashboard when XP threshold is reached
- Home Dashboard checks evolution eligibility after:
  - Battle completion (stats applied)
  - Workout completion (stats applied)

**Exit Points:**
- Tap to skip → Phase 2 Results
- Animation completes → Phase 2 Results

### Phase 2: Results Screen

**Entry Point:**
- From Phase 1 overlay completion

**Exit Points:**
- Continue button → Home Dashboard

### Flow Diagram

```
Home Dashboard
     │
     ├─ [XP threshold reached after battle/workout]
     │
     ▼
Phase 1: Evolution Overlay
(Pokemon-style blink animation)
     │
     ├─ [Tap to skip] OR [Animation completes]
     │
     ▼
Phase 2: Results Screen
(Stats, abilities, Continue button)
     │
     └─ [Continue button]
          │
          ▼
     Home Dashboard
     (Updated avatar displayed)
```

---

## Related Screens

- **Triggers from**: Home Dashboard (after battle/workout completion)
- **Returns to**: Home Dashboard (with updated evolved avatar)
- **Flow**: Progression System
- **Note**: Victory Ceremony screen is DEPRECATED; evolution now triggers from Home

---

## Design System Compliance Checklist

- [x] Only 4 LCD colors used
- [x] No border radius (`borderRadius: 0`)
- [x] Hard pixel shadows (`shadowRadius: 0`)
- [x] No gradients
- [x] Typography: Press Start 2P (headers/buttons) + Montserrat (body)
- [x] All touch targets ≥ 44×44dp
- [x] Screen reader labels on all elements
- [x] Reduce Motion preference respected (crossfade instead of blink)
- [x] Raw numerical data for stat changes (no percentages hiding base values)
- [x] Pure celebration - no backhanded compliments
- [x] Flash uses #8BAC0F (not white - stays in palette)
- [x] Pokemon-style blink animation with accelerating rhythm
- [x] "Tap to skip" option for user control
- [x] Comprehensive audio specification

---

**Priority**: LOWER (but elevated for nostalgic experience)
**Estimated Implementation**: 8-10 hours (Phase 1 overlay + Phase 2 results + audio integration)
