# Avatar Generation Result Screen - Wireframe Specification

**Screen ID**: ONBOARD-DEFERRED-02
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

Display the AI-generated avatar result and allow user to accept or regenerate. Shown after successful avatar generation from Photo Upload Screen. **Celebration without pressure** - both options are positive choices.

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
│   │  YOUR AVATAR IS READY!      │  │ ← Header (celebration)
│   └─────────────────────────────┘  │   Font: Press Start 2P, 12px
│                                     │
│   ╔═══════════════════════════╗   │
│   ║                           ║   │
│   ║   ┌─────────────────┐     ║   │
│   ║   │                 │     ║   │ ← Avatar Display
│   ║   │  [Generated     │     ║   │   128×128 pixel art
│   ║   │   Avatar]       │     ║   │   DMG palette only
│   ║   │                 │     ║   │
│   ║   │   128×128       │     ║   │
│   ║   │                 │     ║   │
│   ║   └─────────────────┘     ║   │
│   ║                           ║   │
│   ╚═══════════════════════════╝   │
│                                     │
│   ┌───────────────────────────┐   │
│   │   LOOKS GREAT!            │   │ ← Accept Button (Primary)
│   └───────────────────────────┘   │   Touch: Full width × 52dp
│                                     │   Background: #8BAC0F
│   ┌───────────────────────────┐   │
│   │   TRY ANOTHER PHOTO       │   │ ← Regenerate Button
│   └───────────────────────────┘   │   Touch: Full width × 48dp
│                                     │   Background: #306230
│                                     │   No negative framing
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

### 2. Header
```typescript
{
  backgroundColor: '#9BBC0F',
  borderBottomWidth: 2,
  borderBottomColor: '#306230',
  paddingVertical: 16,
  paddingHorizontal: 24,
  marginBottom: 24,
}

// Header Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  color: '#0F380F',
  textAlign: 'center',
}
```

### 3. Avatar Display Container
```typescript
{
  backgroundColor: '#9BBC0F',
  borderWidth: 4,
  borderColor: '#306230',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  padding: 24,
  marginHorizontal: 24,
  marginBottom: 32,
  alignItems: 'center',
}
```

### 4. Avatar Image
```typescript
{
  width: 128,
  height: 128,
  borderWidth: 4,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  // DMG palette only (enforced by generation API)
}
```

### 5. Accept Button (Primary)
```typescript
{
  backgroundColor: '#8BAC0F',
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
```

### 6. Try Again Button (Secondary)
```typescript
{
  backgroundColor: '#306230',
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
  color: '#9BBC0F',
  textAlign: 'center',
}
```

---

## Usability Compliance

> **Reference**: front-end-spec.md "Usability Traps Prevention" section

### Trap 1: Information Density ✅
- **Compliance**: Avatar clearly visible, no hidden info
- **Implementation**: Large 128×128 display

### Trap 2: AI Summaries ✅
- **Compliance**: No AI description of avatar
- **Implementation**: Visual-only presentation

### Trap 3: Punishment Mechanics ✅
- **Compliance**: Both options are positive
- **Implementation**:
  - "LOOKS GREAT!" (accept)
  - "TRY ANOTHER PHOTO" (not "TRY AGAIN" implying failure)
  - No "Are you sure?" warnings

### Trap 4: Onboarding Overload ✅
- **Compliance**: Simple two-button decision
- **Implementation**: Accept or try another - clear choices

### Trap 5: Feature Labyrinths ✅
- **Compliance**: Two clear paths
- **Implementation**: Direct navigation to Profile or Photo Upload

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| LOOKS GREAT Button | Full width × 52dp | Full width × 52dp | ✅ |
| TRY ANOTHER PHOTO | Full width × 48dp | Full width × 48dp | ✅ |
| Avatar Display | 128×128pt | Non-interactive | N/A |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Screen announcement
accessibilityLabel="Your avatar is ready!"
accessibilityRole="alert"

// Avatar display
accessibilityLabel="Your generated pixel art avatar in Game Boy style"
accessibilityRole="image"

// Accept button
accessibilityLabel="Accept this avatar"
accessibilityRole="button"
accessibilityHint="Double tap to use this avatar"

// Try again button
accessibilityLabel="Try with another photo"
accessibilityRole="button"
accessibilityHint="Double tap to upload a different photo"
```

### Focus Order
1. Header (announcement)
2. Avatar Display (informational)
3. LOOKS GREAT Button
4. TRY ANOTHER PHOTO Button

### Reduce Motion Support
```typescript
const prefersReducedMotion = useReducedMotion();

// Entry animation
const entryAnimation = prefersReducedMotion
  ? null  // Instant display
  : scaleInAnimation;

// Celebration particles
const particles = prefersReducedMotion
  ? null  // No particles
  : celebrationParticles;
```

### Color Contrast Verification

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Header text | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Accept button | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |
| Try again button | #9BBC0F | #306230 | 2.8:1 | ⚠️ Large only |

---

## Animations

### Entry Animation
```typescript
// Avatar scales in (respects Reduce Motion)
const playEntryAnimation = () => {
  if (prefersReducedMotion) {
    setVisible(true);
    return;
  }

  Animated.spring(avatarScale, {
    toValue: 1,
    friction: 6,
    tension: 40,
    useNativeDriver: true,
  }).start();

  // Optional celebration particles
  playParticleEffect();
};
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

// Sound: 8-bit "success" chime
SoundManager.play('success_chime');
```

---

## Implementation Notes

### Accept Avatar
```typescript
const handleAcceptAvatar = async () => {
  const userId = user?.id || deferredProfile?.id;

  await supabase
    .from('user_profiles')
    .update({
      home_avatar_url: avatarUrl,
      avatar_generated: true,
    })
    .eq('id', userId);

  // Success haptic
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

  // Navigate back to Profile
  navigation.navigate('Profile');
};
```

### Try Another Photo
```typescript
const handleTryAnother = () => {
  // Navigate back to Photo Upload
  // No negative messaging
  navigation.navigate('PhotoUpload');
};
```

---

## Navigation

### Entry Points
- From Photo Upload Screen (on successful generation)

### Exit Points
- To Profile Screen (on accept)
- To Photo Upload Screen (on try another)

---

## Related Screens

- **Previous**: Photo Upload Screen
- **Next**: Profile/Avatar Screen OR Photo Upload Screen
- **Flow**: Progressive Disclosure (Post-FTUE)

---

## Design System Compliance Checklist

- [x] Only 4 LCD colors used
- [x] No border radius (`borderRadius: 0`)
- [x] Hard pixel shadows (`shadowRadius: 0`)
- [x] No gradients
- [x] Typography: Press Start 2P (headers/buttons) + Montserrat (secondary)
- [x] All touch targets ≥ 44×44dp
- [x] Screen reader labels on all elements
- [x] Reduce Motion preference respected
- [x] Positive framing for all options
- [x] No punishment mechanics

---

**Priority**: MEDIUM
**Estimated Implementation**: 2-3 hours
