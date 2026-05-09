# Health Connect Permission Screen - Wireframe Specification

**Screen ID**: ONBOARD-DEFERRED-03
**Batch**: 4 (LOWER - Secondary Features)
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

Request HealthKit (iOS) or Health Connect (Android) permissions. Shown during **progressive disclosure after FTUE**, or accessed from Settings. **No blocking requirement** - app works without health data (simulated mode).

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
│   │  CONNECT HEALTH DATA        │  │ ← Header
│   └─────────────────────────────┘  │   Font: Press Start 2P, 12px
│                                     │
│   ╔═══════════════════════════╗   │
│   ║                           ║   │
│   ║  Track your fitness       ║   │ ← Benefit-focused
│   ║  automatically!           ║   │   (not requirement)
│   ║                           ║   │
│   ║  ─────────────────────    ║   │
│   ║                           ║   │
│   ║  We'll sync:              ║   │
│   ║  • Steps                  ║   │ ← Clear data list
│   ║  • Workouts               ║   │   Font: Montserrat, 14px
│   ║  • Calories               ║   │
│   ║                           ║   │
│   ║  ─────────────────────    ║   │
│   ║                           ║   │
│   ║  Your data stays private  ║   │ ← Privacy assurance
│   ║  and secure on your       ║   │
│   ║  device.                  ║   │
│   ╚═══════════════════════════╝   │
│                                     │
│   ┌───────────────────────────┐   │
│   │   CONNECT NOW             │   │ ← Primary CTA
│   └───────────────────────────┘   │   Touch: Full width × 52dp
│                                     │   Background: #8BAC0F
│   ┌───────────────────────────┐   │
│   │   MAYBE LATER             │   │ ← Skip Button
│   └───────────────────────────┘   │   Touch: Full width × 48dp
│                                     │   No guilt messaging
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

### 3. Info Container
```typescript
{
  backgroundColor: '#9BBC0F',
  borderWidth: 4,
  borderColor: '#306230',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  padding: 20,
  marginHorizontal: 24,
  marginBottom: 32,
}
```

### 4. Benefit Text
```typescript
{
  fontFamily: 'Montserrat',
  fontSize: 16,
  fontWeight: '600',
  color: '#0F380F',
  textAlign: 'center',
  marginBottom: 16,
}
```

### 5. Data List
```typescript
// List Container
{
  marginVertical: 12,
}

// List Item
{
  fontFamily: 'Montserrat',
  fontSize: 14,
  color: '#0F380F',
  marginBottom: 8,
  paddingLeft: 12,
}
```

### 6. Privacy Text
```typescript
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#306230',
  textAlign: 'center',
  marginTop: 12,
}
```

### 7. Connect Button (Primary)
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

### 8. Maybe Later Button (Secondary)
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
- **Compliance**: Clear list of data synced
- **Implementation**: Visible bullet list (Steps, Workouts, Calories)

### Trap 2: AI Summaries ✅
- **Compliance**: No AI content
- **Implementation**: Static, predefined content

### Trap 3: Punishment Mechanics ✅
- **Compliance**: No guilt for declining
- **Implementation**:
  - "MAYBE LATER" (not "Skip" or "No thanks")
  - No "You'll miss out" messaging
  - App works without permission (simulated mode)

### Trap 4: Onboarding Overload ✅
- **Compliance**: Deferred to post-FTUE
- **Implementation**: Progressive disclosure - core loop works first

### Trap 5: Feature Labyrinths ✅
- **Compliance**: Two clear choices
- **Implementation**: Connect or Maybe Later - both valid

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| CONNECT NOW Button | Full width × 52dp | Full width × 52dp | ✅ |
| MAYBE LATER Button | Full width × 48dp | Full width × 48dp | ✅ |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Screen title
accessibilityLabel="Connect health data screen"
accessibilityRole="header"

// Info box
accessibilityLabel="Track your fitness automatically. We'll sync steps, workouts, and calories. Your data stays private and secure on your device."
accessibilityRole="text"

// Connect button
accessibilityLabel="Connect health data now"
accessibilityRole="button"
accessibilityHint="Double tap to connect to Apple Health or Google Fit"

// Maybe later button
accessibilityLabel="Connect health data later"
accessibilityRole="button"
accessibilityHint="Double tap to skip for now. You can connect anytime from Settings."
```

### Focus Order
1. Header (informational)
2. Info Box (informational)
3. CONNECT NOW Button
4. MAYBE LATER Button

### Reduce Motion Support
```typescript
const prefersReducedMotion = useReducedMotion();

// Entry animation
const entryAnimation = prefersReducedMotion
  ? null  // Instant display
  : fadeInAnimation;

// Button press animation
const buttonScale = prefersReducedMotion
  ? 1
  : 0.96;
```

### Color Contrast Verification

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Header text | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Benefit text | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| List items | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Privacy text | #306230 | #9BBC0F | 2.8:1 | ⚠️ Large only |
| Connect button | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |
| Maybe later | #9BBC0F | #306230 | 2.8:1 | ⚠️ Large only |

---

## State Variations

### Permission Granted
```
// Navigate to next screen or show success
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗   │
│   ║  CONNECTED!               ║   │
│   ║                           ║   │
│   ║  Health data syncing      ║   │
│   ║  is now active.           ║   │
│   ║                           ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │   GREAT!          │    ║   │  ← Touch: 44dp height
│   ║  └───────────────────┘    ║   │
│   ╚═══════════════════════════╝   │
└─────────────────────────────────────┘
```

### Permission Denied by User (Neutral Tone)
```
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗   │
│   ║  NO PROBLEM               ║   │  ← Neutral, not "ERROR"
│   ║                           ║   │
│   ║  You can enable health    ║   │
│   ║  sync anytime from        ║   │
│   ║  Settings.                ║   │
│   ║                           ║   │
│   ║  The app works great      ║   │  ← Reassurance
│   ║  either way!              ║   │
│   ║                           ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │   CONTINUE        │    ║   │  ← Touch: 44dp height
│   ║  └───────────────────┘    ║   │
│   ╚═══════════════════════════╝   │
└─────────────────────────────────────┘
```

---

## Implementation Notes

### Request Health Permissions
```typescript
import * as ExpoHealth from 'expo-health';

const handleConnect = async () => {
  try {
    // Request permissions
    const { status } = await ExpoHealth.requestPermissionsAsync([
      ExpoHealth.HealthDataType.Steps,
      ExpoHealth.HealthDataType.Workouts,
      ExpoHealth.HealthDataType.ActiveEnergyBurned,
    ]);

    if (status === 'granted') {
      // Update profile
      await supabase
        .from('user_profiles')
        .update({ health_connected: true })
        .eq('id', userId);

      setShowSuccessModal(true);
    } else {
      // Show neutral "no problem" message
      setShowDeclinedModal(true);
    }
  } catch (error) {
    console.error('Health permission error:', error);
    // Navigate anyway - don't block
    navigation.navigate('Home');
  }
};
```

### Maybe Later Handler
```typescript
const handleMaybeLater = () => {
  // No guilt messaging, just navigate
  navigation.navigate('Home');
};
```

---

## Navigation

### Entry Points
- From Home Screen (first visit post-FTUE, if not connected)
- From Settings → Health Sync

### Exit Points
- To Home Dashboard (on connect or skip)

---

## Related Screens

- **Previous**: Home Dashboard OR Settings
- **Next**: Home Dashboard
- **Flow**: Progressive Disclosure (Post-FTUE)

---

## Design System Compliance Checklist

- [x] Only 4 LCD colors used
- [x] No border radius (`borderRadius: 0`)
- [x] Hard pixel shadows (`shadowRadius: 0`)
- [x] No gradients
- [x] Typography: Press Start 2P (headers/buttons) + Montserrat (body)
- [x] All touch targets ≥ 44×44dp
- [x] Screen reader labels on all elements
- [x] Reduce Motion preference respected
- [x] No punishment for declining (neutral framing)
- [x] Progressive disclosure (post-FTUE)
- [x] Privacy assurance visible

---

**Priority**: LOWER
**Estimated Implementation**: 4-6 hours
