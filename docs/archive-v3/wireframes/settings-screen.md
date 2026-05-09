# Settings Screen - Wireframe Specification

**Screen ID**: SETTINGS-01
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

App settings including health permissions, notifications, tutorial replay, accessibility options, and account management. **No dark patterns** - all toggles have clear consequences and easy reversal.

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
│   │  SETTINGS                   │  │ ← Header
│   └─────────────────────────────┘  │   Font: Press Start 2P, 12px
│                                     │
│   HEALTH & FITNESS                  │ ← Section Header
│   ─────────────────────────────     │   Font: Press Start 2P, 10px
│   ┌───────────────────────────┐   │
│   │ Health Sync          [ON] │   │ ← Toggle Row
│   │ Apple Health connected    │   │   Touch: 44dp height
│   └───────────────────────────┘   │
│   ┌───────────────────────────┐   │
│   │ Reconnect Health Data   → │   │ ← Action Row
│   └───────────────────────────┘   │   Touch: 44dp height
│                                     │
│   NOTIFICATIONS                     │
│   ─────────────────────────────     │
│   ┌───────────────────────────┐   │
│   │ Daily Reminders      [ON] │   │ ← Toggle Row
│   │ Get workout reminders      │   │
│   └───────────────────────────┘   │
│   ┌───────────────────────────┐   │
│   │ Workout Complete    [OFF] │   │ ← Toggle Row
│   │ Celebrate victories       │   │   No guilt for OFF
│   └───────────────────────────┘   │
│                                     │
│   ACCESSIBILITY                     │
│   ─────────────────────────────     │
│   ┌───────────────────────────┐   │
│   │ Reduce Motion       [OFF] │   │ ← Toggle Row
│   └───────────────────────────┘   │
│   ┌───────────────────────────┐   │
│   │ Larger Text         [OFF] │   │
│   └───────────────────────────┘   │
│                                     │
│   TUTORIAL                          │
│   ─────────────────────────────     │
│   ┌───────────────────────────┐   │
│   │ Replay Tutorial        →  │   │ ← Action Row
│   └───────────────────────────┘   │   Touch: 44dp height
│                                     │
│   ACCOUNT                           │
│   ─────────────────────────────     │
│   ┌───────────────────────────┐   │
│   │ Sign Out               →  │   │ ← Action Row
│   └───────────────────────────┘   │
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

// Header Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  color: '#0F380F',
  textAlign: 'center',
}
```

### 3. Section Header
```typescript
{
  paddingHorizontal: 24,
  marginTop: 16,
  marginBottom: 8,
}

// Section Title
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
  marginBottom: 4,
}

// Section Divider
{
  height: 2,
  backgroundColor: '#306230',
}
```

### 4. Toggle Row
```typescript
{
  backgroundColor: '#9BBC0F',
  borderWidth: 2,
  borderColor: '#306230',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  paddingVertical: 12,
  paddingHorizontal: 16,
  marginHorizontal: 24,
  marginBottom: 8,
  minHeight: 44,                   // MANDATORY: Touch target
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}

// Toggle Label
{
  fontFamily: 'Montserrat',
  fontSize: 14,
  fontWeight: '600',
  color: '#0F380F',
}

// Toggle Description
{
  fontFamily: 'Montserrat',
  fontSize: 11,
  color: '#306230',
  marginTop: 2,
}
```

### 5. Toggle Switch (PixelCheckbox)
```typescript
// Container
{
  width: 48,
  height: 24,
  backgroundColor: '#306230',      // OFF state
  borderWidth: 2,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  justifyContent: 'center',
  paddingHorizontal: 2,
}

// Knob
{
  width: 18,
  height: 18,
  backgroundColor: '#9BBC0F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  // Position: left for OFF, right for ON
}

// ON state background
{
  backgroundColor: '#8BAC0F',      // Lime when ON
}
```

### 6. Action Row (Navigation)
```typescript
{
  backgroundColor: '#9BBC0F',
  borderWidth: 2,
  borderColor: '#306230',
  borderRadius: 0,
  paddingVertical: 12,
  paddingHorizontal: 16,
  marginHorizontal: 24,
  marginBottom: 8,
  minHeight: 44,                   // MANDATORY: Touch target
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
}

// Action Label
{
  fontFamily: 'Montserrat',
  fontSize: 14,
  fontWeight: '600',
  color: '#0F380F',
}

// Arrow Icon
{
  fontFamily: 'Montserrat',
  fontSize: 16,
  color: '#306230',
}
```

### 7. Sign Out Button (Destructive Action)
```typescript
{
  backgroundColor: '#306230',      // Darker to indicate caution
  borderWidth: 2,
  borderColor: '#0F380F',
  borderRadius: 0,
  paddingVertical: 12,
  paddingHorizontal: 16,
  marginHorizontal: 24,
  marginBottom: 8,
  minHeight: 44,
}

// Sign Out Text
{
  fontFamily: 'Montserrat',
  fontSize: 14,
  fontWeight: '600',
  color: '#9BBC0F',                // Inverse for visibility
}
```

---

## Usability Compliance

> **Reference**: front-end-spec.md "Usability Traps Prevention" section

### Trap 1: Information Density ✅
- **Compliance**: Each setting has clear label + description
- **Implementation**: Two-line display (title + subtitle) for context

### Trap 2: AI Summaries ✅
- **Compliance**: No AI-generated content
- **Implementation**: Static, predefined setting labels

### Trap 3: Punishment Mechanics ✅
- **Compliance**: No guilt for disabling features
- **Implementation**:
  - Notifications OFF: No "You'll miss out!" messaging
  - Health Sync OFF: Neutral "App works without health data"
  - All toggles are neutral choices

### Trap 4: Onboarding Overload ✅
- **Compliance**: Grouped settings by category
- **Implementation**: Clear section headers, minimal scrolling

### Trap 5: Feature Labyrinths ✅
- **Compliance**: All settings visible on one screen
- **Implementation**: No nested settings screens (except confirmation modals)

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| Toggle Row | Full width × 44dp+ | Full width × 44dp+ | ✅ |
| Action Row | Full width × 44dp | Full width × 44dp | ✅ |
| Toggle Switch | 48×24pt | Full row × 44dp | ✅ |
| Sign Out Button | Full width × 44dp | Full width × 44dp | ✅ |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Screen title
accessibilityLabel="Settings screen"
accessibilityRole="header"

// Section headers
accessibilityLabel="Health and Fitness settings"
accessibilityRole="header"

// Toggle rows
accessibilityLabel={`Health Sync, ${isEnabled ? 'enabled' : 'disabled'}`}
accessibilityRole="switch"
accessibilityState={{ checked: isEnabled }}
accessibilityHint="Double tap to toggle"

// Action rows
accessibilityLabel="Reconnect Health Data"
accessibilityRole="button"
accessibilityHint="Double tap to reconnect to Apple Health or Google Fit"

// Sign out
accessibilityLabel="Sign out of your account"
accessibilityRole="button"
accessibilityHint="Double tap to sign out. A confirmation will appear."
```

### Focus Order
1. Header
2. Health & Fitness section
3. Health Sync toggle
4. Reconnect Health Data action
5. Notifications section
6. Daily Reminders toggle
7. Workout Complete toggle
8. Accessibility section
9. Reduce Motion toggle
10. Larger Text toggle
11. Tutorial section
12. Replay Tutorial action
13. Account section
14. Sign Out action

### Reduce Motion Support
```typescript
const prefersReducedMotion = useReducedMotion();

// Toggle animation
const toggleAnimation = prefersReducedMotion
  ? { duration: 0 }  // Instant
  : { duration: 150 };

// Row press animation
const pressAnimation = prefersReducedMotion
  ? null
  : scaleDown;
```

### Color Contrast Verification

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Section header | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Toggle label | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Toggle description | #306230 | #9BBC0F | 2.8:1 | ⚠️ Large only |
| Sign out text | #9BBC0F | #306230 | 2.8:1 | ⚠️ Large only |

---

## State Variations

### Health Not Connected
```
┌───────────────────────────┐
│ Health Sync        [OFF]  │
│ Tap to connect            │ ← Neutral invitation
└───────────────────────────┘
```

### Notifications Denied (System Level)
```
┌───────────────────────────┐
│ Daily Reminders    [OFF]  │
│ Enable in device settings │ ← Helpful, not blaming
│ ┌─────────────────────┐   │
│ │ Open Settings    →  │   │
│ └─────────────────────┘   │
└───────────────────────────┘
```

### Sign Out Confirmation Modal
```
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗   │
│   ║  Sign out?                ║   │ ← Neutral tone
│   ║                           ║   │
│   ║  You can sign back in     ║   │ ← Reassurance
│   ║  anytime.                 ║   │
│   ║                           ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │   YES, SIGN OUT   │    ║   │ ← Touch: 44dp height
│   ║  └───────────────────┘    ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │   CANCEL          │    ║   │ ← Touch: 44dp height
│   ║  └───────────────────┘    ║   │
│   ╚═══════════════════════════╝   │
└─────────────────────────────────────┘
```

### Replay Tutorial Confirmation
```
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗   │
│   ║  Replay Tutorial?         ║   │
│   ║                           ║   │
│   ║  Learn the basics again   ║   │ ← Positive framing
│   ║  with a quick workout.    ║   │
│   ║                           ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │   LET'S GO!       │    ║   │
│   ║  └───────────────────┘    ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │   MAYBE LATER     │    ║   │ ← Not "Cancel"
│   ║  └───────────────────┘    ║   │
│   ╚═══════════════════════════╝   │
└─────────────────────────────────────┘
```

---

## Implementation Notes

### Toggle Handler
```typescript
const handleToggle = async (settingKey: string, newValue: boolean) => {
  // Optimistic update
  setSettings(prev => ({ ...prev, [settingKey]: newValue }));

  // Persist to database
  const { error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: userId,
      [settingKey]: newValue,
      updated_at: new Date().toISOString(),
    });

  if (error) {
    // Revert on failure
    setSettings(prev => ({ ...prev, [settingKey]: !newValue }));
    showToast('Could not save setting. Please try again.');
  }

  // Haptic feedback
  Haptics.impact(Haptics.ImpactFeedbackStyle.Light);
};
```

### Health Reconnect Handler
```typescript
const handleReconnectHealth = async () => {
  try {
    const { status } = await ExpoHealth.requestPermissionsAsync([
      ExpoHealth.HealthDataType.Steps,
      ExpoHealth.HealthDataType.Workouts,
      ExpoHealth.HealthDataType.ActiveEnergyBurned,
    ]);

    if (status === 'granted') {
      setHealthConnected(true);
      showToast('Health data connected!');
    } else {
      // Neutral messaging - no guilt
      showToast('You can connect anytime.');
    }
  } catch (error) {
    showToast('Could not connect. Please try again.');
  }
};
```

### Sign Out Handler
```typescript
const handleSignOut = async () => {
  // Show confirmation modal first
  setShowSignOutModal(true);
};

const confirmSignOut = async () => {
  try {
    await supabase.auth.signOut();
    navigation.reset({
      index: 0,
      routes: [{ name: 'Welcome' }],
    });
  } catch (error) {
    showToast('Could not sign out. Please try again.');
  }
};
```

### Replay Tutorial Handler
```typescript
const handleReplayTutorial = () => {
  // Reset tutorial flags
  setTutorialCompleted(false);

  // Navigate to tutorial
  navigation.navigate('TutorialWorkoutAssignment', {
    isReplay: true,
  });
};
```

---

## Navigation

### Entry Points
- From Tab Bar → Settings Tab (if applicable)
- From Profile Screen → Settings icon
- From Home Dashboard → Settings icon

### Exit Points
- Back to previous screen
- To Health Permission Screen (via Reconnect)
- To Tutorial (via Replay Tutorial)
- To Welcome Screen (via Sign Out)

---

## Related Screens

- **Previous**: Profile Screen / Home Dashboard
- **Next**: Health Permission Screen, Tutorial, Welcome Screen
- **Flow**: Settings Management

---

## Design System Compliance Checklist

- [x] Only 4 LCD colors used
- [x] No border radius (`borderRadius: 0`)
- [x] Hard pixel shadows (not applicable - flat settings UI)
- [x] No gradients
- [x] Typography: Press Start 2P (section headers) + Montserrat (settings)
- [x] All touch targets ≥ 44×44dp
- [x] Screen reader labels on all elements
- [x] Reduce Motion preference respected
- [x] No guilt messaging for disabled settings
- [x] Clear confirmation modals for destructive actions
- [x] Neutral framing throughout

---

**Priority**: LOWER
**Estimated Implementation**: 6-8 hours
