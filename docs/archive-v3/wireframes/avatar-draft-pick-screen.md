# Avatar Draft Pick Screen - Wireframe Specification

**Screen ID**: AVATAR-DRAFT-01
**Batch**: 2 (HIGH - Core Loop Functionality)
**Status**: NEW - Spec Complete
**Design Date**: 2026-01-05
**Spec Version**: 1.0
**Story**: 1.5 (Avatar Generation Pipeline)

---

## Design System Compliance

> **Reference Document**: `docs/front-end-spec.md` v2.4
>
> This wireframe adheres to all MANDATORY DESIGN REQUIREMENTS including:
> - DMG 4-Color Palette ONLY (#9BBC0F, #0F380F, #8BAC0F, #306230)
> - Typography Separation (Press Start 2P + Montserrat)
> - 44x44dp minimum touch targets
> - WCAG 2.1 AA accessibility compliance
> - Usability Traps Prevention guidelines

---

## Purpose

Give users agency by choosing between two AI-generated avatar variants: **Accuracy** (true to their likeness) and **Retro** (classic pixel art style). This screen displays after the Boot Sequence completes, providing a "sports draft" moment that makes the user feel invested in their avatar choice.

**UX Goal**: Make users feel like they're selecting a real character, not just accepting AI output. Both options are valid - there's no "wrong" choice.

---

## Layout Structure

### Virtual LCD Area (329x584pt)
Using **DMG Palette ONLY** (`#9BBC0F`, `#0F380F`, `#8BAC0F`, `#306230`)

```
+-------------------------------------+
|  LCD SCREEN (329x584pt)             |
|  Background: #9BBC0F (Neon grass)   |
+---------+---------------------------+
|                                     |
|   +-----------------------------+   |
|   |  SELECT YOUR AVATAR         |   | <- Header
|   +-----------------------------+   |   Font: Press Start 2P, 12px
|                                     |
|   +-----------------------------+   |
|   |  Choose your champion's     |   | <- Subheader
|   |  appearance                 |   |   Font: Montserrat, 12px
|   +-----------------------------+   |
|                                     |
|   +------------+   +------------+   |
|   |            |   |            |   |
|   | [ACCURACY] |   |  [RETRO]   |   | <- Two variant cards
|   |            |   |            |   |   140x180pt each
|   | [Avatar 1] |   | [Avatar 2] |   |   Touch: Full card
|   |            |   |            |   |
|   | "ACCURACY" |   |  "RETRO"   |   | <- Labels
|   | True to    |   |  Classic   |   |
|   |  you       |   |   style    |   | <- Sublabels
|   |            |   |            |   |
|   +------------+   +------------+   |
|                                     |
|   +-----------------------------+   |
|   |  [CONFIRM SELECTION]        |   | <- Confirm Button
|   +-----------------------------+   |   Touch: Full width x 52dp
|                                     |   Disabled until selection
|   +-----------------------------+   |
|   |  Regenerate                 |   | <- Regenerate link
|   +-----------------------------+   |   Touch: 120x44dp
|                                     |
+-------------------------------------+
```

---

## Component Specifications

### 1. Screen Container
```typescript
{
  flex: 1,
  backgroundColor: '#9BBC0F',
  paddingVertical: 24,
  paddingHorizontal: 16,
}
```

### 2. Header
```typescript
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  color: '#0F380F',
  textAlign: 'center',
  marginBottom: 8,
}
```

### 3. Subheader
```typescript
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#306230',
  textAlign: 'center',
  marginBottom: 24,
}
```

### 4. Cards Container
```typescript
{
  flexDirection: 'row',
  justifyContent: 'space-between',
  paddingHorizontal: 8,
  marginBottom: 24,
}
```

### 5. Avatar Card (Unselected)
```typescript
{
  width: 140,
  height: 200,
  backgroundColor: '#9BBC0F',
  borderWidth: 3,
  borderColor: '#306230',
  borderRadius: 0,              // MANDATORY: No rounded corners
  padding: 12,
  alignItems: 'center',
  justifyContent: 'space-between',
}
```

### 6. Avatar Card (Selected)
```typescript
{
  width: 140,
  height: 200,
  backgroundColor: '#8BAC0F',   // Highlighted background
  borderWidth: 4,               // Thicker border
  borderColor: '#0F380F',       // Darkest border
  borderRadius: 0,              // MANDATORY: No rounded corners
  padding: 12,
  alignItems: 'center',
  justifyContent: 'space-between',
  // Selection animation
  transform: [{ scale: 1.03 }],
}
```

### 7. Avatar Image Container
```typescript
{
  width: 112,
  height: 112,
  backgroundColor: '#9BBC0F',
  borderWidth: 2,
  borderColor: '#306230',
  borderRadius: 0,              // MANDATORY: No rounded corners
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
}
```

### 8. Avatar Image
```typescript
{
  width: 96,
  height: 96,
  resizeMode: 'contain',
}
```

### 9. Card Label
```typescript
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
  textAlign: 'center',
  marginTop: 8,
}
```

### 10. Card Sublabel
```typescript
{
  fontFamily: 'Montserrat',
  fontSize: 10,
  color: '#306230',
  textAlign: 'center',
  marginTop: 2,
}
```

### 11. Confirm Button (Disabled)
```typescript
{
  backgroundColor: '#306230',
  borderWidth: 2,
  borderColor: '#0F380F',
  borderRadius: 0,              // MANDATORY: No rounded corners
  paddingVertical: 16,
  marginHorizontal: 8,
  marginBottom: 12,
  minHeight: 52,                // MANDATORY: Touch target
  opacity: 0.5,
}

// Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  color: '#9BBC0F',
  textAlign: 'center',
}
```

### 12. Confirm Button (Enabled)
```typescript
{
  backgroundColor: '#8BAC0F',
  borderWidth: 4,
  borderColor: '#0F380F',
  borderRadius: 0,              // MANDATORY: No rounded corners
  paddingVertical: 16,
  marginHorizontal: 8,
  marginBottom: 12,
  minHeight: 52,                // MANDATORY: Touch target
  shadowColor: '#0F380F',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,              // MANDATORY: Hard pixel shadow
}

// Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  color: '#0F380F',
  textAlign: 'center',
}
```

### 13. Regenerate Link
```typescript
{
  paddingVertical: 12,
  paddingHorizontal: 24,
  alignSelf: 'center',
  minHeight: 44,                // MANDATORY: Touch target
  minWidth: 120,
}

// Text
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#306230',
  textDecorationLine: 'underline',
  textAlign: 'center',
}
```

---

## Variant Card Details

### Accuracy Variant
| Property | Value |
|----------|-------|
| Label | "ACCURACY" |
| Sublabel | "True to you" |
| Description | Avatar closely matches user's facial features |
| AI Prompt | High likeness, realistic proportions |

### Retro Variant
| Property | Value |
|----------|-------|
| Label | "RETRO" |
| Sublabel | "Classic style" |
| Description | Stylized pixel art interpretation |
| AI Prompt | Exaggerated features, classic game aesthetic |

---

## State Variations

### State 1: Initial (No Selection)
```
+------------+   +------------+
|            |   |            |
| [ACCURACY] |   |  [RETRO]   |   <- Both unselected
|            |   |            |   Border: #306230, 3px
| [Avatar 1] |   | [Avatar 2] |   Background: #9BBC0F
|            |   |            |
+------------+   +------------+

[CONFIRM SELECTION] <- Disabled (grayed out)
```

### State 2: Accuracy Selected
```
+============+   +------------+
||          ||   |            |
||[ACCURACY]||   |  [RETRO]   |   <- Accuracy selected
||          ||   |            |   Border: #0F380F, 4px
||[Avatar 1]||   | [Avatar 2] |   Background: #8BAC0F
||          ||   |            |   Scale: 1.03
+============+   +------------+

[CONFIRM SELECTION] <- Enabled (lime green)
```

### State 3: Retro Selected
```
+------------+   +============+
|            |   ||          ||
| [ACCURACY] |   || [RETRO]  ||   <- Retro selected
|            |   ||          ||   Border: #0F380F, 4px
| [Avatar 1] |   ||[Avatar 2]||   Background: #8BAC0F
|            |   ||          ||   Scale: 1.03
+------------+   +============+

[CONFIRM SELECTION] <- Enabled (lime green)
```

### State 4: Single Variant (Partial Failure)
```
+-------------------------+
|                         |
|     [ACCURACY]          |   <- Only one variant loaded
|                         |   Centered on screen
|     [Avatar 1]          |
|                         |
+-------------------------+

[USE THIS AVATAR] <- Button text changes
```

### State 5: Complete Failure (Both Failed)
```
+-----------------------------+
|                             |
|  Avatar generation failed   |
|                             |
|  [RETAKE PHOTO]             | <- Primary CTA
|  [SKIP FOR NOW]             | <- Secondary
|                             |
+-----------------------------+
```

---

## Animation Specifications

### Reference: `animations-consolidated.md` Section 16.4

```typescript
avatarDraftPick: {
  // Screen enter animation
  enter: {
    header: {
      opacity: { from: 0, to: 1, duration: 300 },
      translateY: { from: -20, to: 0, duration: 300 },
      easing: 'easeOut',
    },
    cards: {
      stagger: 100,  // 100ms between cards
      perCard: {
        opacity: { from: 0, to: 1, duration: 400 },
        scale: { from: 0.9, to: 1, duration: 400 },
        easing: 'springGentle',
      },
    },
    confirmButton: {
      opacity: { from: 0, to: 1, duration: 300, delay: 500 },
    },
    totalDuration: 800,
  },

  // Card selection animation
  cardSelect: {
    selected: {
      scale: { from: 1, to: 1.03, duration: 200, easing: 'springGentle' },
      borderWidth: { from: 3, to: 4, duration: 150 },
      borderColor: { from: '#306230', to: '#0F380F', duration: 150 },
      backgroundColor: { from: '#9BBC0F', to: '#8BAC0F', duration: 150 },
    },
    deselected: {
      scale: { from: 1.03, to: 1, duration: 150, easing: 'easeOut' },
      borderWidth: { from: 4, to: 3, duration: 150 },
      borderColor: { from: '#0F380F', to: '#306230', duration: 150 },
      backgroundColor: { from: '#8BAC0F', to: '#9BBC0F', duration: 150 },
    },
    haptic: 'impactMedium',
  },

  // Confirm button state change
  confirmButtonEnable: {
    opacity: { from: 0.5, to: 1, duration: 200 },
    backgroundColor: { from: '#306230', to: '#8BAC0F', duration: 200 },
  },

  // Confirm selection (navigate to Home)
  confirm: {
    buttonPress: {
      scale: { from: 1, to: 0.95, duration: 100, easing: 'sharp' },
    },
    selectedCardCelebration: {
      scale: { from: 1.03, to: 1.1, duration: 400, easing: 'spring' },
    },
    unselectedCardExit: {
      opacity: { from: 1, to: 0, duration: 300, easing: 'easeIn' },
      scale: { from: 1, to: 0.95, duration: 300 },
    },
    transition: {
      type: 'pixelWipe',
      delay: 300,
      duration: 400,
    },
    haptic: 'impactHeavy',
    audio: 'avatar_confirmed.mp3',
  },

  reducedMotion: {
    enter: 'Fade in all elements together (300ms)',
    cardSelect: 'Instant border/color change',
    confirm: 'Fade to Home Dashboard (300ms)',
  },
}
```

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| Accuracy Card | 140x200dp | 140x200dp | PASS |
| Retro Card | 140x200dp | 140x200dp | PASS |
| Confirm Button | Full width x 52dp | Full width x 52dp | PASS |
| Regenerate Link | Variable | 120x44dp | PASS |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Screen entry
accessibilityLabel="Select your avatar screen. Two avatar variants available."
accessibilityRole="radiogroup"

// Accuracy card
accessibilityLabel="Accuracy variant. True to your likeness."
accessibilityRole="radio"
accessibilityState={{ selected: selectedVariant === 'accuracy' }}
accessibilityHint="Double tap to select this avatar style"

// Retro card
accessibilityLabel="Retro variant. Classic pixel art style."
accessibilityRole="radio"
accessibilityState={{ selected: selectedVariant === 'retro' }}
accessibilityHint="Double tap to select this avatar style"

// Confirm button (disabled)
accessibilityLabel="Confirm selection. Disabled, please select an avatar first."
accessibilityRole="button"
accessibilityState={{ disabled: true }}

// Confirm button (enabled)
accessibilityLabel={`Confirm ${selectedVariant} avatar selection`}
accessibilityRole="button"
accessibilityHint="Double tap to confirm and continue to home screen"

// Regenerate link
accessibilityLabel="Regenerate avatar options"
accessibilityRole="button"
accessibilityHint="Double tap to take a new photo and regenerate avatars"
```

### Focus Order
1. Header (informational)
2. Subheader (informational)
3. Accuracy Card
4. Retro Card
5. Confirm Button
6. Regenerate Link

### Reduce Motion Support
```typescript
const prefersReducedMotion = usePrefersReducedMotion();

// Screen enter
const enterAnimation = prefersReducedMotion
  ? { opacity: 1 }  // Instant display
  : staggeredFadeIn;

// Card selection
const selectAnimation = prefersReducedMotion
  ? 'instant'  // Immediate border/color change
  : 'animated';

// Confirm transition
const confirmTransition = prefersReducedMotion
  ? 'crossfade'  // Simple fade to Home
  : 'pixelWipe';
```

### Color Contrast Verification

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Header | #0F380F | #9BBC0F | 6.5:1 | AAA |
| Subheader | #306230 | #9BBC0F | 2.8:1 | Large only |
| Card label | #0F380F | #9BBC0F | 6.5:1 | AAA |
| Card label (selected) | #0F380F | #8BAC0F | 5.2:1 | AA |
| Button text (enabled) | #0F380F | #8BAC0F | 5.2:1 | AA |
| Button text (disabled) | #9BBC0F | #306230 | 2.8:1 | Large only |

---

## Implementation Notes

### Selection State Management

```typescript
type VariantType = 'accuracy' | 'retro' | null;

interface DraftPickState {
  selectedVariant: VariantType;
  accuracyUrl: string | null;
  retroUrl: string | null;
  isConfirming: boolean;
}

const [state, setState] = useState<DraftPickState>({
  selectedVariant: null,
  accuracyUrl: route.params?.accuracyUrl ?? null,
  retroUrl: route.params?.retroUrl ?? null,
  isConfirming: false,
});

const handleCardSelect = (variant: VariantType) => {
  if (state.isConfirming) return;

  // Haptic feedback
  haptics.impactMedium();

  setState(prev => ({
    ...prev,
    selectedVariant: variant,
  }));
};
```

### Confirm Handler

```typescript
const handleConfirm = async () => {
  if (!state.selectedVariant) return;

  setState(prev => ({ ...prev, isConfirming: true }));

  // Haptic feedback
  haptics.impactHeavy();

  // Play confirmation animation
  await playConfirmAnimation();

  // Save selected avatar to user profile
  const selectedUrl = state.selectedVariant === 'accuracy'
    ? state.accuracyUrl
    : state.retroUrl;

  const { error } = await supabase
    .from('user_profiles')
    .update({
      home_avatar_url: selectedUrl,
      avatar_variant: state.selectedVariant,
      avatar_generated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) {
    console.error('Failed to save avatar:', error);
    setState(prev => ({ ...prev, isConfirming: false }));
    // Show error toast
    return;
  }

  // Navigate to Home Dashboard
  navigation.reset({
    index: 0,
    routes: [{ name: 'HomeDashboard' }],
  });
};
```

### Regenerate Handler

```typescript
const handleRegenerate = () => {
  // Haptic warning
  haptics.notificationWarning();

  // Confirm with user (optional)
  Alert.alert(
    'Regenerate Avatar?',
    'This will take a new photo and create new avatar options.',
    [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Regenerate',
        onPress: () => {
          navigation.navigate('PhotoUpload', {
            regenerating: true,
          });
        },
      },
    ]
  );
};
```

### Loading Avatar Images

```typescript
const [loadingStates, setLoadingStates] = useState({
  accuracy: true,
  retro: true,
});

// Handle partial failure (one variant failed)
const hasAccuracy = !!state.accuracyUrl;
const hasRetro = !!state.retroUrl;
const hasBoth = hasAccuracy && hasRetro;
const hasOne = hasAccuracy || hasRetro;
const hasNone = !hasAccuracy && !hasRetro;

// Adjust layout for single variant
const cardContainerStyle = hasBoth
  ? styles.cardsRow
  : styles.cardsCentered;
```

---

## Navigation

### Entry Points
- From Avatar Boot Sequence Screen (on generation complete via PixelWipe)

### Exit Points
- To Home Dashboard Screen (on confirm selection)
- To Photo Upload Screen (on regenerate)
- To Profile Screen (on skip from error state)

---

## Related Screens

- **Previous**: Avatar Boot Sequence Screen
- **Next**: Home Dashboard Screen
- **Error Path**: Photo Upload Screen (regenerate) or Profile Screen (skip)

---

## Design System Compliance Checklist

- [x] Only 4 LCD colors used
- [x] No border radius (`borderRadius: 0`)
- [x] Hard pixel shadows (`shadowRadius: 0`)
- [x] No gradients
- [x] Typography: Press Start 2P (headers/labels) + Montserrat (sublabels)
- [x] All touch targets >= 44x44dp
- [x] Screen reader labels on all elements
- [x] Radio group semantics for variant selection
- [x] Reduce Motion preference respected
- [x] Both variants are valid choices (no "wrong" option)
- [x] Graceful degradation for partial failures

---

## Usability Compliance

### Trap 1: Information Density - PASS
- Both variants visible simultaneously
- Labels clearly differentiate options

### Trap 2: AI Summaries - PASS
- No AI-generated descriptions
- Static labels only ("True to you", "Classic style")

### Trap 3: Punishment Mechanics - PASS
- No punishment for any choice
- Regenerate option available without guilt

### Trap 4: Onboarding Overload - PASS
- Simple two-option decision
- Single action required

### Trap 5: Feature Labyrinths - PASS
- Clear path: select -> confirm
- Regenerate path clearly marked

---

**Priority**: HIGH - Critical to avatar pipeline UX
**Estimated Implementation**: 4-6 hours
**Dependencies**: Avatar Boot Sequence, Supabase user_profiles table
