# FTUE Workout Video Screen Wireframe

**Screen ID:** ftue-workout-video-screen
**Story:** 1.10 - FTUE Tutorial
**Sprint:** 4
**Model Assignment:** Gemini 3 Pro
**Complexity:** Low

---

## Purpose

A passive 8-12 second video demonstrating what workouts look like in 16BitFit. This is a "show, don't make them do" approach for onboarding. Users watch the video to understand the workout-to-battle connection without having to do a real workout during FTUE.

> **FTUE Video Update (2026-01-05):** Changed from interactive 60s simulated workout to passive 8-12s video clip.

---

## Layout (329×584pt LCD viewport)

```
┌─────────────────────────────────────────┐
│                                         │
│                 [16px]                  │
│                                         │
│           TUTORIAL WORKOUT              │  ← Press Start 2P, 16px, #0F380F
│                                         │
│                 [8px]                   │
│                                         │
│    See how workouts power your          │  ← Montserrat, 12px, #306230
│            champion!                    │
│                                         │
│                 [16px]                  │
│                                         │
│  ┌─────────────────────────────────────┐│
│  │                                     ││
│  │                                     ││
│  │                                     ││
│  │         [VIDEO PLAYER]              ││  ← 297×200px video container
│  │      Pixel-art workout clip         ││     Auto-playing, DMG palette
│  │         (auto-playing)              ││     No audio by default
│  │                                     ││
│  │                                     ││
│  │                                     ││
│  └─────────────────────────────────────┘│
│                                         │
│                 [12px]                  │
│                                         │
│        ████████████████░░░░░            │  ← Video progress bar
│                                         │     Fill: #8BAC0F, Track: #306230
│                 [24px]                  │
│                                         │
│    ┌──────────────────────────────────┐ │
│    │             SKIP                 │ │  ← Disabled for first 2 seconds
│    └──────────────────────────────────┘ │     Then enabled
│                                         │
│                 [12px]                  │
│                                         │
│   "This is how workouts power battles"  │  ← Montserrat Italic, 11px
│                                         │
│                 [16px]                  │
│                                         │
│              ● ● ● ○ ○                  │  ← Progress dots (3 of 5)
│                                         │
│                 [16px]                  │
│                                         │
└─────────────────────────────────────────┘
```

---

## Visual Specifications

### Header
- **Text:** "TUTORIAL WORKOUT"
- **Font:** Press Start 2P
- **Size:** 16px
- **Color:** #0F380F (darkest)
- **Alignment:** Center

### Subheader
- **Text:** "See how workouts power your champion!"
- **Font:** Montserrat Regular
- **Size:** 12px
- **Color:** #306230 (dark)
- **Alignment:** Center

### Video Container
- **Size:** 297×200px (maintains 16:9-ish aspect)
- **Border:** 3px solid #306230
- **Background:** #0F380F (darkest, for letterboxing if needed)
- **Corner radius:** 0 (pixel-perfect edges)

### Video Content
- **Duration:** 8-12 seconds
- **Style:** Pre-rendered pixel-art animation in DMG 4-color palette
- **Content:** Avatar doing exercises (squats, steps, punches)
- **Shows:** Visual connection between workout → energy → battle power
- **Audio:** Muted by default (optional 8-bit SFX)
- **File:** `assets/videos/ftue-workout-demo.mp4`

### Progress Bar
- **Width:** 280px
- **Height:** 8px
- **Track color:** #306230 (dark)
- **Fill color:** #8BAC0F (light)
- **Border:** 2px solid #0F380F
- **Animation:** Fill progresses with video playback

### Skip Button
- **Component:** PixelButton (secondary variant)
- **Text:** "SKIP"
- **Width:** 280px
- **Height:** 48px
- **Initial state:** Disabled (opacity 0.4) for first 2 seconds
- **After 2s:** Enabled (full opacity)
- **Haptic:** impactMedium on press

### Informational Text
- **Text:** "This is how workouts power battles"
- **Font:** Montserrat Italic
- **Size:** 11px
- **Color:** #306230 (dark)
- **Alignment:** Center

### Progress Indicator
- **Steps:** 5 total
- **Current:** 3
- **Active dot:** #8BAC0F
- **Inactive dot:** #306230

---

## States

### Video Playing (Default)
- Video auto-plays on screen mount
- Progress bar animates with playback
- Skip button disabled (opacity 0.4)

### Skip Enabled (After 2 seconds)
- Skip button opacity: 1.0
- Skip button interactable
- Haptic available

### Video Complete
- Progress bar full (100%)
- Auto-advance triggered (or tap to continue)
- Haptic: impactMedium pulse

### Reduce Motion
- Video: Shows static representative frame
- Skip button: Immediately available (no 2s wait)
- Progress bar: Instant state (no fill animation)

---

## Animation Specifications

### Screen Entry
- **Type:** Fade in
- **Duration:** 200ms
- **Easing:** ease-out

### Progress Bar Fill
- **Type:** Width expansion
- **Duration:** Matches video duration (8-12s)
- **Easing:** linear

### Skip Button Enable
- **Type:** Opacity
- **Values:** 0.4 → 1.0
- **Trigger:** After 2000ms
- **Duration:** 200ms

### Video Complete Pulse
- **Type:** Haptic + visual flash
- **Haptic:** impactMedium
- **Visual:** Brief border flash (#8BAC0F)

---

## Accessibility

| Element | accessibilityLabel | accessibilityRole | accessibilityHint |
|---------|-------------------|-------------------|-------------------|
| Screen | "Tutorial workout video, step 3 of 5" | - | - |
| Header | "Tutorial workout" | header | - |
| Video container | "Workout demonstration video" | video | "Shows how workouts power your champion" |
| Progress bar | "Video progress: [X] percent" | progressbar | - |
| Skip button (disabled) | "Skip, available in [X] seconds" | button | "Wait to skip the video" |
| Skip button (enabled) | "Skip tutorial video" | button | "Skips to the next step" |
| Info text | "This is how workouts power battles" | text | - |
| Progress indicator | "Step 3 of 5" | progressbar | - |

### Dynamic Announcements
- On video start: "Tutorial video playing"
- On skip available: "Skip button now available"
- On video complete: "Video complete, proceeding to battle tutorial"

---

## Navigation

| Action | Destination | Transition |
|--------|-------------|------------|
| Video completes | Battle Mode Transition Video | Fade (300ms) |
| Tap Skip (after 2s) | Battle Mode Transition Video | Fade (300ms) |
| Back gesture | TutorialWorkoutAssignmentScreen | Slide right |

### Post-Video Flow
```
FTUE Workout Video → Battle Mode Transition Video → Tutorial Battle Screen
```

---

## Component Mapping

| UI Element | Component | Import Path |
|------------|-----------|-------------|
| Header | PixelText | @/components/atoms/PixelText |
| Subheader | PixelText | @/components/atoms/PixelText |
| Video container | PixelBorder | @/components/atoms/PixelBorder |
| Video player | expo-av Video | expo-av |
| Progress bar | PixelProgressBar | @/components/atoms/PixelProgressBar |
| Skip button | PixelButton | @/components/atoms/PixelButton |
| Info text | PixelText | @/components/atoms/PixelText |
| Progress indicator | ProgressIndicator | @/components/molecules/ProgressIndicator |

---

## Video Asset Requirements

### File Details
- **Path:** `assets/videos/ftue-workout-demo.mp4`
- **Duration:** 8-12 seconds
- **Resolution:** 594×400px (2x for retina, displays at 297×200)
- **Format:** MP4 (H.264)
- **File size:** <2MB
- **Frame rate:** 12fps (pixel-art aesthetic)

### Content Requirements
- DMG 4-color palette ONLY (#9BBC0F, #8BAC0F, #306230, #0F380F)
- Shows pixel-art avatar doing exercises
- Visual "energy meter" filling up
- Ends with avatar powering up / ready for battle
- No text overlays (accessible via screen reader labels)

---

## Terminology Compliance

- "Workout" not "Quest"
- "Training" for mode references
- "Champion" not "Fighter"
- "Power" / "Energy" for workout-to-battle connection

---

## File Path

```
apps/mobile-shell/src/screens/onboarding/FTUEWorkoutVideoScreen/index.tsx
```

---

## Notes

- This is PASSIVE viewing - no user interaction required except optional skip
- 2-second skip delay ensures users see at least some of the video
- Video should clearly communicate: workout → energy → battle power
- Keep file size small for fast loading
- Reduce Motion users see static frame with immediate skip option
- No negative messaging - this is exciting and empowering

---

**Document Version:** 1.0
**Created:** 2026-01-06
**Last Updated:** 2026-01-06
**FTUE Update:** 2026-01-05 (changed from 60s interactive to 8-12s passive video)
