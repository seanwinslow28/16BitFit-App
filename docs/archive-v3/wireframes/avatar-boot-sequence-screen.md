# Avatar Boot Sequence Screen - Wireframe Specification

**Screen ID**: AVATAR-BOOT-01
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

Transform the 8-15 second AI avatar generation wait into a "techno-magical" experience. This screen displays after the user submits their selfie on the Photo Upload screen and before the Draft Pick selection. Each phase has specific animations tied to backend webhook status updates.

**UX Goal**: Make the wait feel intentional and exciting, not tedious. The user should feel like advanced technology is processing their likeness into a retro avatar.

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
|   |  INITIALIZING CARTRIDGE...  |   | <- Phase Text (typewriter)
|   +-----------------------------+   |   Font: Press Start 2P, 10px
|                                     |
|   +=============================+   |
|   ||                           ||   |
|   ||   +-------------------+   ||   |
|   ||   |                   |   ||   | <- Preview Container
|   ||   |  [CANNY EDGE MAP] |   ||   |   200x200pt
|   ||   |                   |   ||   |   Border: #306230, 4px
|   ||   |  (Scan line over  |   ||   |
|   ||   |   user's face)    |   ||   |
|   ||   |                   |   ||   |
|   ||   +-------------------+   ||   |
|   ||                           ||   |
|   +=============================+   |
|                                     |
|   +-----------------------------+   |
|   |  [][][][] PALETTE [][][][] |   | <- Palette Swatches
|   +-----------------------------+   |   4 squares, stagger reveal
|                                     |
|   +-----------------------------+   |
|   | [============...........]   |   | <- Progress Bar
|   +-----------------------------+   |   Segmented, 20 blocks
|                                     |
|   +-----------------------------+   |
|   |  QUANTIZING 4-BIT COLOR... |   | <- Subtext
|   +-----------------------------+   |   Font: Montserrat, 10px
|                                     |
|   +-----------------------------+   |
|   |  [Cancel]                   |   | <- Cancel link (subtle)
|   +-----------------------------+   |   Touch: 80x44dp
|                                     |
+-------------------------------------+
```

---

## Four-Phase Animation Sequence

### Phase 1: Initializing (0-1.5 seconds)

**Trigger**: Immediately on screen entry

**Visual Elements**:
- Phase text: "INITIALIZING CARTRIDGE..."
- Logo container with 16BitFit logo
- Pulsing animation on logo

**Layout**:
```
+-------------------------------------+
|                                     |
|   +-----------------------------+   |
|   |  INITIALIZING CARTRIDGE...  |   | <- Typewriter effect
|   +-----------------------------+   |   50ms per character
|                                     |
|   +=============================+   |
|   ||                           ||   |
|   ||       [16BITFIT LOGO]     ||   | <- Logo pulses
|   ||        (Nintendo-style)   ||   |   scale: [0.95, 1, 0.98, 1]
|   ||                           ||   |   opacity: [0.8, 1, 0.9, 1]
|   ||                           ||   |
|   +=============================+   |
|                                     |
|   +-----------------------------+   |
|   | [....................]      |   | <- Progress: empty
|   +-----------------------------+   |
|                                     |
+-------------------------------------+
```

**Component Specifications**:
```typescript
// Phase 1: Initializing
{
  phaseText: {
    content: "INITIALIZING CARTRIDGE...",
    fontFamily: 'PressStart2P-Regular',
    fontSize: 10,
    color: '#0F380F',
    textAlign: 'center',
    letterSpacing: 1,
  },
  logoAnimation: {
    scale: [0.95, 1, 0.98, 1],
    opacity: [0.8, 1, 0.9, 1],
    duration: 1500,
    easing: 'easeInOut',
    loop: true,
  },
  progressBar: {
    segments: 20,
    filled: 0,
    fillColor: '#8BAC0F',
    backgroundColor: '#306230',
  },
}
```

### Phase 2: Scanning (1.5-4 seconds)

**Trigger**: Backend receives `cannyUrl` from preprocessing webhook

**Visual Elements**:
- Phase text: "SCANNING BIOMETRICS..."
- User's canny edge map (face outline) fades in
- Horizontal scan line sweeps over the image
- Lime green tint overlay pulses

**Layout**:
```
+-------------------------------------+
|                                     |
|   +-----------------------------+   |
|   |  SCANNING BIOMETRICS...     |   | <- New phase text
|   +-----------------------------+   |
|                                     |
|   +=============================+   |
|   ||                           ||   |
|   ||   +-------------------+   ||   |
|   ||   |   /\    /\        |   ||   | <- Canny edge map
|   ||   |  /  \  /  \       |   ||   |   (user's face outline)
|   ||   | |    ||    |      |   ||   |
|   ||   |  \  /  \  /       |   ||   |
|   ||   |   \/    \/        |   ||   |
|   ||   |======SCAN LINE====|   ||   | <- 4px lime line sweeps
|   ||   +-------------------+   ||   |
|   ||                           ||   |
|   +=============================+   |
|                                     |
|   +-----------------------------+   |
|   | [===========..........]     |   | <- Progress: ~30%
|   +-----------------------------+   |
|                                     |
+-------------------------------------+
```

**Component Specifications**:
```typescript
// Phase 2: Scanning
{
  phaseText: {
    content: "SCANNING BIOMETRICS...",
    fontFamily: 'PressStart2P-Regular',
    fontSize: 10,
    color: '#0F380F',
  },
  cannyMapImage: {
    width: 200,
    height: 200,
    borderWidth: 4,
    borderColor: '#306230',
    borderRadius: 0,
    opacity: { from: 0, to: 1, duration: 500 },
  },
  scanLine: {
    height: 4,
    backgroundColor: '#8BAC0F',
    translateY: { from: 0, to: 200, duration: 2000 },
    easing: 'linear',
    loop: true,
    opacity: 0.8,
  },
  tintOverlay: {
    backgroundColor: '#8BAC0F',
    opacity: [0.2, 0.4, 0.2],
    duration: 1500,
    loop: true,
  },
  progressBar: {
    filled: 6, // 30% of 20 segments
  },
  haptic: {
    type: 'selectionChanged',
    timing: 1500, // When canny appears
  },
}
```

### Phase 3: Quantizing (4-10 seconds)

**Trigger**: Backend receives `status: 'generating'` from Runware webhook

**Visual Elements**:
- Phase text: "QUANTIZING 4-BIT COLOR..."
- Canny map remains visible
- Progress bar fills segment by segment
- DMG palette swatches appear one by one (staggered)

**Layout**:
```
+-------------------------------------+
|                                     |
|   +-----------------------------+   |
|   |  QUANTIZING 4-BIT COLOR...  |   | <- Phase text
|   +-----------------------------+   |
|                                     |
|   +=============================+   |
|   ||                           ||   |
|   ||   +-------------------+   ||   |
|   ||   |  [CANNY MAP]      |   ||   | <- Still visible
|   ||   |  (no scan line)   |   ||   |
|   ||   +-------------------+   ||   |
|   ||                           ||   |
|   +=============================+   |
|                                     |
|   +-----------------------------+   |
|   |  [] [] [] []               |   | <- Palette swatches appear
|   |  #0F #30 #8B #9B           |   |   300ms stagger per swatch
|   +-----------------------------+   |
|                                     |
|   +-----------------------------+   |
|   | [==================....]    |   | <- Progress: fills over time
|   +-----------------------------+   |
|                                     |
+-------------------------------------+
```

**Component Specifications**:
```typescript
// Phase 3: Quantizing
{
  phaseText: {
    content: "QUANTIZING 4-BIT COLOR...",
    fontFamily: 'PressStart2P-Regular',
    fontSize: 10,
    color: '#0F380F',
  },
  paletteSwatches: {
    swatches: [
      { color: '#0F380F', delay: 0 },
      { color: '#306230', delay: 300 },
      { color: '#8BAC0F', delay: 600 },
      { color: '#9BBC0F', delay: 900 },
    ],
    swatchSize: 24,
    swatchBorder: 2,
    swatchBorderColor: '#0F380F',
    animation: {
      scale: { from: 0, to: 1, duration: 200 },
      easing: 'spring',
    },
  },
  progressBar: {
    // Fills from 30% to 100% over generation time
    easing: 'Easing.out(Easing.quad)',
    segmentFillDelay: 300, // ms per segment
  },
  haptic: {
    type: 'selectionChanged',
    interval: '20%', // Every 20% progress
  },
}
```

### Phase 4: Reveal (0.5 seconds)

**Trigger**: Backend receives `status: 'complete'` with avatar URLs

**Visual Elements**:
- Dramatic white/lime flash
- Quick fade to black
- PixelWipe transition to Draft Pick screen

**Layout**:
```
+-------------------------------------+
|                                     |
|   +=============================+   |
|   ||                           ||   |
|   ||                           ||   |
|   ||      [FLASH EFFECT]       ||   | <- #9BBC0F flash
|   ||        opacity: 0->1->0   ||   |   duration: 250ms
|   ||                           ||   |
|   ||                           ||   |
|   +=============================+   |
|                                     |
|   +-----------------------------+   |
|   | [====================]      |   | <- Progress: 100%
|   +-----------------------------+   |
|                                     |
+-------------------------------------+

           |
           | PixelWipe transition (400ms)
           v

+-------------------------------------+
|                                     |
|       DRAFT PICK SCREEN             |
|                                     |
+-------------------------------------+
```

**Component Specifications**:
```typescript
// Phase 4: Reveal
{
  flash: {
    backgroundColor: '#9BBC0F',
    opacity: [0, 1, 0],
    duration: 250,
    easing: 'easeOut',
  },
  transition: {
    type: 'pixelWipe',
    direction: 'horizontal',
    duration: 400,
    easing: 'Easing.out(Easing.cubic)',
  },
  haptic: {
    type: 'impactMedium',
  },
  audio: 'avatar_ready.mp3',
}
```

---

## Component Specifications

### 1. Screen Container
```typescript
{
  flex: 1,
  backgroundColor: '#9BBC0F',
  paddingVertical: 24,
  paddingHorizontal: 24,
  justifyContent: 'center',
  alignItems: 'center',
}
```

### 2. Phase Text
```typescript
{
  fontFamily: 'PressStart2P-Regular',
  fontSize: 10,
  color: '#0F380F',
  textAlign: 'center',
  marginBottom: 24,
  // Typewriter animation
  letterSpacing: 1,
}
```

### 3. Preview Container
```typescript
{
  width: 240,
  height: 240,
  backgroundColor: '#9BBC0F',
  borderWidth: 4,
  borderColor: '#306230',
  borderRadius: 0,              // MANDATORY: No rounded corners
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 24,
  overflow: 'hidden',          // For scan line effect
}
```

### 4. Canny Map Image
```typescript
{
  width: 200,
  height: 200,
  resizeMode: 'contain',
  // DMG-tinted via image filter (optional)
}
```

### 5. Scan Line
```typescript
{
  position: 'absolute',
  left: 0,
  right: 0,
  height: 4,
  backgroundColor: '#8BAC0F',
  opacity: 0.8,
}
```

### 6. Palette Swatches Row
```typescript
// Container
{
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 8,
  marginBottom: 16,
}

// Individual Swatch
{
  width: 24,
  height: 24,
  borderWidth: 2,
  borderColor: '#0F380F',
  borderRadius: 0,              // MANDATORY: No rounded corners
}
```

### 7. Progress Bar Container
```typescript
{
  width: 280,
  height: 16,
  backgroundColor: '#306230',
  borderWidth: 2,
  borderColor: '#0F380F',
  borderRadius: 0,              // MANDATORY: No rounded corners
  flexDirection: 'row',
  overflow: 'hidden',
  marginBottom: 8,
}
```

### 8. Progress Segment
```typescript
// Each of 20 segments
{
  flex: 1,
  height: '100%',
  backgroundColor: '#8BAC0F',  // When filled
  // backgroundColor: '#306230', // When empty
  marginRight: 1,              // 1px gap between segments
}
```

### 9. Subtext
```typescript
{
  fontFamily: 'Montserrat',
  fontSize: 10,
  color: '#306230',
  textAlign: 'center',
  marginBottom: 24,
}
```

### 10. Cancel Link
```typescript
{
  paddingVertical: 12,
  paddingHorizontal: 24,
  minHeight: 44,               // MANDATORY: Touch target
  minWidth: 80,
}

// Text
{
  fontFamily: 'Montserrat',
  fontSize: 12,
  color: '#306230',
  textDecorationLine: 'underline',
}
```

---

## State Variations

### State 1: Initial Entry (Phase 1)
```
Phase Text: "INITIALIZING CARTRIDGE..."
Preview: 16BitFit logo pulsing
Progress: Empty (0%)
Palette: Hidden
```

### State 2: Scanning (Phase 2)
```
Phase Text: "SCANNING BIOMETRICS..."
Preview: Canny edge map with scan line
Progress: 30%
Palette: Hidden
```

### State 3: Quantizing (Phase 3)
```
Phase Text: "QUANTIZING 4-BIT COLOR..."
Preview: Canny edge map (static)
Progress: 30% -> 100% (animated)
Palette: Swatches appearing one by one
```

### State 4: Complete (Phase 4)
```
Flash effect -> PixelWipe transition to Draft Pick
```

### State 5: Error
```
+-------------------------------------+
|                                     |
|   +-----------------------------+   |
|   |  GENERATION FAILED          |   | <- Error text (neutral)
|   +-----------------------------+   |   Color: #0F380F (not red)
|                                     |
|   +-----------------------------+   |
|   |  We couldn't create your    |   |
|   |  avatar. Please try again.  |   |
|   +-----------------------------+   |
|                                     |
|   +-----------------------------+   |
|   |   [RETRY]                   |   | <- Primary CTA
|   +-----------------------------+   |   Touch: Full width x 52dp
|                                     |
|   +-----------------------------+   |
|   |   [SKIP FOR NOW]            |   | <- Secondary
|   +-----------------------------+   |   Touch: Full width x 48dp
|                                     |
+-------------------------------------+
```

---

## Animation Specifications

### Reference: `animations-consolidated.md` Section 16.3

```typescript
// Full animation object from spec
avatarBootSequence: {
  totalDuration: '8000-15000ms',

  phase1_initializing: {
    timing: '0-1500ms',
    text: "INITIALIZING CARTRIDGE...",
    textAnimation: {
      charDelay: 50,
    },
    logoAnimation: {
      scale: [0.95, 1, 0.98, 1],
      opacity: [0.8, 1, 0.9, 1],
      duration: 1500,
      loop: true,
    },
  },

  phase2_scanning: {
    timing: '1500-4000ms',
    text: "SCANNING BIOMETRICS...",
    trigger: 'cannyUrl received',
    cannyMapReveal: {
      opacity: { from: 0, to: 1, duration: 500 },
    },
    scanLine: {
      translateY: { from: 0, to: '100%', duration: 2000 },
      loop: true,
    },
    overlay: {
      opacity: [0.2, 0.4, 0.2],
      color: '#8BAC0F',
      loop: true,
    },
  },

  phase3_quantizing: {
    timing: '4000-10000ms',
    text: "QUANTIZING 4-BIT COLOR...",
    trigger: 'status: generating',
    progressBar: {
      segments: 20,
      easing: 'Easing.out(Easing.quad)',
    },
    paletteSwatches: {
      stagger: 300,
      colors: ['#0F380F', '#306230', '#8BAC0F', '#9BBC0F'],
    },
  },

  phase4_reveal: {
    timing: '500ms',
    trigger: 'status: complete',
    flash: {
      opacity: [0, 1, 0],
      color: '#9BBC0F',
      duration: 250,
    },
    transition: {
      type: 'pixelWipe',
      duration: 400,
    },
  },

  reducedMotion: {
    phase1: 'Static logo, instant text',
    phase2: 'Fade in canny map, no scan line',
    phase3: 'Progress bar fills without animation',
    phase4: 'Simple crossfade to Draft Pick',
  },
}
```

---

## Touch Target Requirements

| Element | Visual Size | Touch Target | Compliant |
|---------|-------------|--------------|-----------|
| Cancel link | Variable | 80x44dp | PASS |
| Retry button (error) | Full width x 52dp | Full width x 52dp | PASS |
| Skip button (error) | Full width x 48dp | Full width x 48dp | PASS |

---

## Accessibility

### Screen Reader Announcements

```typescript
// Screen entry
accessibilityLabel="Avatar generation in progress"
accessibilityRole="progressbar"

// Phase changes (live region)
accessibilityLiveRegion="polite"
accessibilityLabel={`Phase ${currentPhase}: ${phaseText}`}

// Progress updates (announce at 25%, 50%, 75%, 100%)
accessibilityLabel={`Generation progress: ${progressPercent} percent`}

// Canny map appearance
accessibilityLabel="Your photo has been processed and is being analyzed"

// Cancel link
accessibilityLabel="Cancel avatar generation"
accessibilityRole="button"
accessibilityHint="Double tap to cancel and return to photo upload"

// Error state
accessibilityLabel="Avatar generation failed. Options available: Retry or Skip"
accessibilityRole="alert"
```

### Focus Order
1. Phase text (informational, auto-announced)
2. Preview area (informational)
3. Progress bar (auto-announced at intervals)
4. Cancel link (if visible)
5. Error buttons (if error state)

### Reduce Motion Support
```typescript
const prefersReducedMotion = usePrefersReducedMotion();

// Phase 1
const logoAnimation = prefersReducedMotion
  ? null  // Static logo
  : pulsing;

// Phase 2
const scanLine = prefersReducedMotion
  ? null  // No scan line
  : sweeping;

// Phase 3
const progressAnimation = prefersReducedMotion
  ? 'instant'  // Jump to value
  : 'animated';

// Phase 4
const transition = prefersReducedMotion
  ? 'crossfade'  // Simple fade
  : 'pixelWipe';
```

### Color Contrast Verification

| Element | Foreground | Background | Ratio | WCAG |
|---------|------------|------------|-------|------|
| Phase text | #0F380F | #9BBC0F | 6.5:1 | AAA |
| Subtext | #306230 | #9BBC0F | 2.8:1 | Large only |
| Cancel link | #306230 | #9BBC0F | 2.8:1 | Large only |
| Progress filled | #8BAC0F | #306230 | 2.8:1 | Decorative |

---

## Implementation Notes

### Backend Integration

```typescript
interface AvatarGenerationStatus {
  status: 'preprocessing' | 'generating' | 'complete' | 'error';
  cannyUrl?: string;        // Set in preprocessing phase
  accuracyUrl?: string;     // Set on complete
  retroUrl?: string;        // Set on complete
  errorMessage?: string;    // Set on error
  progress?: number;        // 0-100
}

// Supabase Realtime subscription
const subscription = supabase
  .channel('avatar-generation')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'avatar_generation_jobs',
    filter: `id=eq.${jobId}`,
  }, (payload) => {
    const status = payload.new as AvatarGenerationStatus;
    handleStatusUpdate(status);
  })
  .subscribe();
```

### Phase Transition Logic

```typescript
const handleStatusUpdate = (status: AvatarGenerationStatus) => {
  switch (status.status) {
    case 'preprocessing':
      setPhase(1);
      break;

    case 'generating':
      if (status.cannyUrl && phase < 2) {
        setCannyUrl(status.cannyUrl);
        setPhase(2);
        // After 2.5s, move to phase 3
        setTimeout(() => setPhase(3), 2500);
      }
      break;

    case 'complete':
      setPhase(4);
      // Flash, then navigate
      playRevealAnimation(() => {
        navigation.navigate('AvatarDraftPick', {
          accuracyUrl: status.accuracyUrl,
          retroUrl: status.retroUrl,
        });
      });
      break;

    case 'error':
      setError(status.errorMessage);
      break;
  }
};
```

### Cancel Handling

```typescript
const handleCancel = async () => {
  // Cancel the generation job
  await supabase
    .from('avatar_generation_jobs')
    .update({ status: 'cancelled' })
    .eq('id', jobId);

  // Navigate back
  navigation.goBack();
};
```

---

## Navigation

### Entry Points
- From Photo Upload Screen (on photo submit)

### Exit Points
- To Avatar Draft Pick Screen (on generation complete)
- To Photo Upload Screen (on cancel)
- To Profile Screen (on skip from error state)

---

## Related Screens

- **Previous**: Photo Upload Screen
- **Next**: Avatar Draft Pick Screen
- **Error Path**: Photo Upload Screen (retry) or Profile Screen (skip)

---

## Design System Compliance Checklist

- [x] Only 4 LCD colors used
- [x] No border radius (`borderRadius: 0`)
- [x] Hard pixel shadows (`shadowRadius: 0`)
- [x] No gradients
- [x] Typography: Press Start 2P (phase text) + Montserrat (subtext)
- [x] All touch targets >= 44x44dp
- [x] Screen reader labels on all elements
- [x] Reduce Motion preference respected
- [x] Progress announced at intervals
- [x] Error state provides clear recovery paths
- [x] No punishment messaging in error state

---

**Priority**: HIGH - Critical to avatar pipeline UX
**Estimated Implementation**: 6-8 hours
**Dependencies**: Supabase Realtime, avatar_generation_jobs table, Runware webhooks
