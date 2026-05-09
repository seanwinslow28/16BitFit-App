# Welcome Screen Wireframe

**Screen ID:** welcome-screen
**Story:** 1.4 - Onboarding & Profile Setup
**Sprint:** 1
**Model Assignment:** Gemini 3 Pro
**Complexity:** Low

---

## Purpose

The Welcome Screen is the very first screen users see when launching 16BitFit. It's a "PRESS START" moment that introduces the app and begins the onboarding journey. No account required, no friction.

---

## Layout (329×584pt LCD viewport)

```
┌─────────────────────────────────────────┐
│                                         │
│                 [24px]                  │
│                                         │
│              16BITFIT                   │  ← Press Start 2P, 24px, #0F380F
│                                         │
│        Fitness Battles Fueled           │  ← Montserrat, 14px, #306230
│          by Your Steps                  │
│                                         │
│                 [32px]                  │
│                                         │
│           ┌─────────────┐               │
│           │             │               │  ← 128×128 animated pixel logo
│           │   [LOGO]    │               │     Idle pulse animation
│           │             │               │     Centered horizontally
│           └─────────────┘               │
│                                         │
│                 [48px]                  │
│                                         │
│    ┌──────────────────────────────────┐ │
│    │       START YOUR JOURNEY         │ │  ← PixelButton, primary variant
│    └──────────────────────────────────┘ │     280px wide, 56px height
│                                         │     impactMedium haptic on press
│                 [16px]                  │
│                                         │
│           No account needed             │  ← Montserrat, 12px, #306230
│                                         │
│                 [24px]                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## Visual Specifications

### Hero Title
- **Text:** "16BITFIT"
- **Font:** Press Start 2P
- **Size:** 24px
- **Color:** #0F380F (darkest)
- **Alignment:** Center

### Tagline
- **Text:** "Fitness Battles Fueled by Your Steps"
- **Font:** Montserrat Regular
- **Size:** 14px
- **Color:** #306230 (dark)
- **Alignment:** Center
- **Line height:** 1.4

### Logo Container
- **Size:** 128×128px
- **Background:** transparent
- **Border:** 3px solid #306230
- **Content:** Animated pixel logo sprite
- **Animation:** Subtle pulse (scale 1.0 → 1.02 → 1.0, 2s loop)

### Primary CTA Button
- **Component:** PixelButton (primary variant)
- **Text:** "START YOUR JOURNEY"
- **Width:** 280px
- **Height:** 56px
- **Background:** #8BAC0F (light)
- **Text color:** #0F380F (darkest)
- **Border:** 3px solid #0F380F
- **Shadow:** 4px offset, #0F380F
- **Press animation:** scale 0.95, shadow to 2px
- **Haptic:** impactMedium

### Footer Text
- **Text:** "No account needed"
- **Font:** Montserrat Regular
- **Size:** 12px
- **Color:** #306230 (dark)
- **Purpose:** Reduce friction, reassure users

---

## Spacing

| Element | Spacing |
|---------|---------|
| Top safe area to title | 24px |
| Title to tagline | 8px |
| Tagline to logo | 32px |
| Logo to CTA button | 48px |
| CTA button to footer text | 16px |
| Footer text to bottom | 24px |

---

## States

### Default
- Logo animating (pulse)
- Button in default state

### Button Pressed
- Button scale: 0.95
- Shadow offset: 2px
- Haptic: impactMedium triggered

### Reduce Motion
- Logo: Static (no pulse animation)
- Button press: Scale 0.95 still applies (brief, essential feedback)

---

## Animation Specifications

### Screen Entry
- **Type:** Fade in
- **Duration:** 300ms
- **Easing:** ease-out

### Logo Pulse
- **Type:** Scale
- **Values:** 1.0 → 1.02 → 1.0
- **Duration:** 2000ms
- **Easing:** ease-in-out
- **Loop:** Infinite
- **Reduce Motion:** Disabled (static)

### Button Press
- **Type:** Scale + shadow shift
- **Scale:** 1.0 → 0.95 → 1.0
- **Shadow:** 4px → 2px → 4px
- **Duration:** 150ms
- **Easing:** ease-out

---

## Accessibility

| Element | accessibilityLabel | accessibilityRole | accessibilityHint |
|---------|-------------------|-------------------|-------------------|
| Screen container | "Welcome to 16BitFit" | - | - |
| Hero title | "16BitFit" | header | - |
| Tagline | "Fitness Battles Fueled by Your Steps" | text | - |
| Logo | "16BitFit animated logo" | image | - |
| CTA button | "Start your journey" | button | "Begins the onboarding process" |
| Footer text | "No account needed" | text | - |

---

## Navigation

| Action | Destination | Transition |
|--------|-------------|------------|
| Tap "Start Your Journey" | ArchetypeSelectionScreen | Slide left (300ms) |

---

## Component Mapping

| UI Element | Component | Import Path |
|------------|-----------|-------------|
| Hero title | PixelText | @/components/atoms/PixelText |
| Tagline | PixelText | @/components/atoms/PixelText |
| Logo container | PixelBorder | @/components/atoms/PixelBorder |
| Logo sprite | PixelSprite | @/components/atoms/PixelSprite |
| CTA button | PixelButton | @/components/atoms/PixelButton |
| Footer text | PixelText | @/components/atoms/PixelText |

---

## File Path

```
apps/mobile-shell/src/screens/onboarding/WelcomeScreen/index.tsx
```

---

## Notes

- This is the "PRESS START" moment - keep it clean, minimal, and inviting
- NO progress dots on this screen (they appear starting from Archetype Selection)
- Logo animation should feel alive but not distracting
- Emphasize zero friction with "No account needed" messaging
- Screen should load instantly - no loading states

---

**Document Version:** 1.0
**Created:** 2026-01-06
**Last Updated:** 2026-01-06
