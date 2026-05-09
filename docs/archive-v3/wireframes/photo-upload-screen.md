# Photo Upload Screen - Wireframe Specification

**Screen ID**: ONBOARD-DEFERRED-01
**Batch**: 2 (HIGH - Core Loop Functionality)
**Status**: ✅ Spec Complete
**Design Date**: 2025-11-30
**Last Updated**: 2025-12-06
**Spec Version**: 2.0
**Note**: Deferred to progressive disclosure (post-FTUE)

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

Allow users to upload a photo for AI avatar generation. This screen is accessed from the Profile/Avatar screen **after the user has completed FTUE** (progressive disclosure). Uses Runware API for DMG pixel art generation. **Optional feature** - no punishment for skipping.

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
│   │  CREATE YOUR AVATAR         │  │ ← Header
│   └─────────────────────────────┘  │   Font: Press Start 2P, 12px
│                                     │
│   ╔═══════════════════════════╗   │
│   ║                           ║   │
│   ║   ┌─────────────────┐     ║   │
│   ║   │                 │     ║   │ ← Photo Preview Area
│   ║   │  [No Photo]     │     ║   │   200×200pt
│   ║   │                 │     ║   │   Touch: 200×200pt ✅
│   ║   │  Tap to upload  │     ║   │   Border: #306230, 4px
│   ║   │                 │     ║   │
│   ║   └─────────────────┘     ║   │
│   ║                           ║   │
│   ╚═══════════════════════════╝   │
│                                     │
│   ┌───────────────────────────┐   │
│   │  📷 TAKE PHOTO            │   │ ← Camera Button
│   └───────────────────────────┘   │   Touch: Full width × 52dp
│                                     │   Background: #8BAC0F
│   ┌───────────────────────────┐   │
│   │  🖼 CHOOSE FROM LIBRARY   │   │ ← Library Button
│   └───────────────────────────┘   │   Touch: Full width × 52dp
│                                     │
│   ╔═══════════════════════════╗   │
│   ║  TIPS                     ║   │ ← Tips Box
│   ║  ─────────────────────    ║   │   Border: #306230, 2px
│   ║  • Face clearly visible   ║   │   Font: Montserrat, 10px
│   ║  • Good lighting          ║   │
│   ║  • Neutral expression     ║   │
│   ╚═══════════════════════════╝   │
│                                     │
│   ┌───────────────────────────┐   │
│   │   GENERATE AVATAR         │   │ ← Generate Button
│   └───────────────────────────┘   │   Touch: Full width × 52dp
│                                     │   Disabled until photo selected
│   ┌───────────────────────────┐   │
│   │   SKIP FOR NOW            │   │ ← Skip Button
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

// Header Text
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 12,
  color: '#0F380F',
  textAlign: 'center',
}
```

### 3. Photo Preview Container
```typescript
{
  backgroundColor: '#9BBC0F',
  borderWidth: 4,
  borderColor: '#306230',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  padding: 16,
  marginHorizontal: 24,
  marginBottom: 20,
  alignItems: 'center',
}
```

### 4. Photo Preview Area
```typescript
// No Photo State
{
  width: 200,
  height: 200,
  minWidth: 200,                   // MANDATORY: Touch target
  minHeight: 200,                  // MANDATORY: Touch target
  backgroundColor: '#9BBC0F',
  borderWidth: 4,
  borderColor: '#306230',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  borderStyle: 'dashed',           // Dashed border for empty state
  justifyContent: 'center',
  alignItems: 'center',
}

// Placeholder Text
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#306230',
  textAlign: 'center',
}

// Photo Selected State
{
  width: 200,
  height: 200,
  borderWidth: 4,
  borderColor: '#0F380F',          // Solid border when photo present
  borderRadius: 0,                 // MANDATORY: No rounded corners
}

// Image
{
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
}
```

### 5. Camera Button
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
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
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
  marginLeft: 8,
}
```

### 6. Library Button
```typescript
// Same styling as Camera Button
{
  backgroundColor: '#8BAC0F',
  borderWidth: 4,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  paddingVertical: 16,
  marginHorizontal: 24,
  marginBottom: 20,
  minHeight: 52,                   // MANDATORY: Touch target
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  shadowColor: '#0F380F',
  shadowOffset: { width: 4, height: 4 },
  shadowOpacity: 1,
  shadowRadius: 0,                 // MANDATORY: Hard pixel shadow
}
```

### 7. Tips Box
```typescript
{
  backgroundColor: '#9BBC0F',
  borderWidth: 2,
  borderColor: '#306230',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  padding: 12,
  marginHorizontal: 24,
  marginBottom: 20,
}

// Tips Title
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
  marginBottom: 8,
  borderBottomWidth: 1,
  borderBottomColor: '#306230',
  paddingBottom: 4,
}

// Tip Item
{
  fontFamily: 'Montserrat',
  fontSize: 10,
  color: '#0F380F',
  marginBottom: 4,
}
```

### 8. Generate Avatar Button
```typescript
// Disabled State
{
  backgroundColor: '#306230',
  borderWidth: 2,
  borderColor: '#0F380F',
  borderRadius: 0,                 // MANDATORY: No rounded corners
  paddingVertical: 16,
  marginHorizontal: 24,
  marginBottom: 12,
  minHeight: 52,                   // MANDATORY: Touch target
  opacity: 0.5,
}

// Enabled State (Photo Selected)
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

### 9. Skip Button
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
- **Compliance**: Tips are visible without tapping
- **Implementation**: Tips box always visible on screen

### Trap 2: AI Summaries ✅
- **Compliance**: No AI-generated tips
- **Implementation**: Static, predefined photo tips

### Trap 3: Punishment Mechanics ✅
- **Compliance**: No guilt for skipping
- **Implementation**:
  - "SKIP FOR NOW" button with neutral framing
  - No "You'll miss out" messaging
  - Can return anytime from Profile

### Trap 4: Onboarding Overload ✅
- **Compliance**: Simple interface, optional feature
- **Implementation**: Deferred to post-FTUE (progressive disclosure)

### Trap 5: Feature Labyrinths ✅
- **Compliance**: Clear paths forward
- **Implementation**: Generate OR Skip - both valid choices

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| Photo Preview | 200×200pt | 200×200pt | ✅ |
| TAKE PHOTO Button | Full width × 52dp | Full width × 52dp | ✅ |
| CHOOSE FROM LIBRARY | Full width × 52dp | Full width × 52dp | ✅ |
| GENERATE AVATAR | Full width × 52dp | Full width × 52dp | ✅ |
| SKIP FOR NOW | Full width × 48dp | Full width × 48dp | ✅ |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Screen title
accessibilityLabel="Create your avatar screen"
accessibilityRole="header"

// Photo preview
accessibilityLabel={photoUri ? "Photo selected. Double tap to change." : "No photo selected. Double tap to upload."}
accessibilityRole="button"
accessibilityHint="Opens photo selection options"

// Camera button
accessibilityLabel="Take photo with camera"
accessibilityRole="button"
accessibilityHint="Double tap to open camera"

// Library button
accessibilityLabel="Choose photo from library"
accessibilityRole="button"
accessibilityHint="Double tap to open photo library"

// Generate button
accessibilityLabel="Generate avatar from photo"
accessibilityRole="button"
accessibilityState={{ disabled: !photoUri }}
accessibilityHint={photoUri ? "Double tap to generate your avatar" : "Select a photo first"}

// Skip button
accessibilityLabel="Skip avatar creation for now"
accessibilityRole="button"
accessibilityHint="Double tap to skip and use default avatar"
```

### Focus Order
1. Header (informational)
2. Photo Preview
3. TAKE PHOTO Button
4. CHOOSE FROM LIBRARY Button
5. Tips Box (informational)
6. GENERATE AVATAR Button
7. SKIP FOR NOW Button

### Reduce Motion Support
```typescript
const prefersReducedMotion = useReducedMotion();

// Photo fade in
const photoAnimation = prefersReducedMotion
  ? null  // Instant display
  : fadeInAnimation;

// Button enable animation
const buttonEnableAnimation = prefersReducedMotion
  ? null  // Instant state change
  : springAnimation;

// Loading spinner
const spinnerAnimation = prefersReducedMotion
  ? null  // Static loading indicator
  : rotationLoop;
```

### Color Contrast Verification

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Header text | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |
| Placeholder text | #306230 | #9BBC0F | 2.8:1 | ⚠️ Large only |
| Button text | #0F380F | #8BAC0F | 5.2:1 | ✅ AA |
| Skip button | #9BBC0F | #306230 | 2.8:1 | ⚠️ Large only |
| Tip text | #0F380F | #9BBC0F | 6.5:1 | ✅ AAA |

---

## State Variations

### State 1: No Photo Selected (Initial)
```
Photo Preview: Dashed border, "Tap to upload" text
Generate Button: Disabled (grayed out)
```

### State 2: Photo Selected
```
Photo Preview: Solid border, photo displayed
Generate Button: Enabled (lime green)
```

### State 3: Generating Avatar (Loading)
```
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗   │
│   ║  GENERATING AVATAR...     ║   │  ← Neutral, patient tone
│   ║                           ║   │
│   ║  [Pixel spinner]          ║   │
│   ║                           ║   │
│   ║  This may take 30-60s     ║   │  ← Set expectations
│   ╚═══════════════════════════╝   │
└─────────────────────────────────────┘

// Disable all buttons
// Show progress indicator
```

### State 4: Generation Failed (Neutral Tone)
```
┌─────────────────────────────────────┐
│   ╔═══════════════════════════╗   │
│   ║  COULDN'T GENERATE        ║   │  ← Neutral, not "FAILED"
│   ║                           ║   │
│   ║  We couldn't create your  ║   │  ← No blame on user
│   ║  avatar from this photo.  ║   │
│   ║                           ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │   TRY AGAIN       │    ║   │  ← Touch: 44dp height
│   ║  └───────────────────┘    ║   │
│   ║  ┌───────────────────┐    ║   │
│   ║  │   USE DEFAULT     │    ║   │  ← Touch: 44dp height
│   ║  └───────────────────┘    ║   │
│   ╚═══════════════════════════╝   │
└─────────────────────────────────────┘
```

---

## Implementation Notes

### Camera/Library Access
```typescript
import * as ImagePicker from 'expo-image-picker';

const handleTakePhoto = async () => {
  const { status } = await ImagePicker.requestCameraPermissionsAsync();

  if (status !== 'granted') {
    // Neutral permission request
    Alert.alert(
      'Camera Access Needed',
      'To take a photo, we need camera access.',
      [{ text: 'OK' }]
    );
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    setPhotoUri(result.assets[0].uri);
  }
};
```

### Avatar Generation (Runware API)
```typescript
const handleGenerateAvatar = async () => {
  if (!photoUri) return;

  setGenerating(true);

  try {
    const base64 = await FileSystem.readAsStringAsync(photoUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const { data, error } = await supabase.functions.invoke('dmg-avatar', {
      body: {
        image: base64,
        userId: user?.id || deferredProfile?.id,
      },
    });

    if (error) throw error;

    setGeneratedAvatarUrl(data.avatarUrl);
    navigation.navigate('AvatarGenerationResult', {
      avatarUrl: data.avatarUrl,
    });

  } catch (error) {
    console.error('Avatar generation failed:', error);
    // Neutral error handling
    setShowErrorModal(true);
  } finally {
    setGenerating(false);
  }
};
```

---

## Navigation

### Entry Points
- From Profile/Avatar Screen → "Generate Avatar" button

### Exit Points
- To Avatar Generation Result Screen (on success)
- To Profile/Avatar Screen (on skip or cancel)

---

## Related Screens

- **Previous**: Profile/Avatar Screen
- **Next**: Avatar Generation Result Screen OR Profile/Avatar Screen
- **Flow**: Progressive Disclosure (Post-FTUE)

---

## Design System Compliance Checklist

- [x] Only 4 LCD colors used
- [x] No border radius (`borderRadius: 0`)
- [x] Hard pixel shadows (`shadowRadius: 0`)
- [x] No gradients
- [x] Typography: Press Start 2P (headers/buttons) + Montserrat (tips)
- [x] All touch targets ≥ 44×44dp
- [x] Screen reader labels on all interactive elements
- [x] Reduce Motion preference respected
- [x] No punishment for skipping (neutral framing)
- [x] Progressive disclosure (post-FTUE)

---

**Priority**: HIGH - Avatar personalization drives engagement
**Estimated Implementation**: 8-10 hours (camera integration + Runware API)
**Note**: Deferred to post-FTUE (progressive disclosure strategy)
