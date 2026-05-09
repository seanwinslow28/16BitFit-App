# Avatar Prompt Library

> **Version:** 1.0
> **Last Updated:** 2026-01-01
> **Purpose:** Complete prompt specifications for generating personalized DMG-style avatars across 5 archetypes and 5 evolution stages.

---

## Table of Contents

1. [Overview](#overview)
2. [Technical Configuration](#technical-configuration)
3. [Universal Prompt Blocks](#universal-prompt-blocks)
4. [Trainer Archetype](#trainer-archetype)
5. [Runner Archetype](#runner-archetype)
6. [Yoga Archetype](#yoga-archetype)
7. [Bodybuilder Archetype](#bodybuilder-archetype)
8. [Cyclist Archetype](#cyclist-archetype)
9. [Implementation Notes](#implementation-notes)

---

## Overview

### Architecture: "Smooth-to-Pixel" Strategy

These prompts generate **cel-shaded vector art** (NOT pixel art). The post-processing pipeline (CLAHE + Bayer dithering) converts the output to DMG 4-color compliance.

### Prompt Count

- **5 Archetypes:** Trainer, Runner, Yoga, Bodybuilder, Cyclist
- **5 Evolution Stages:** Novice, Dedicated, Athlete, Elite, Transcendent
- **Total:** 25 unique prompts

### Variant Generation

Each prompt generates **two variants** via different ControlNet/IP-Adapter weights (not different prompts):

| Variant | ControlNet Weight | ControlNet End | IP-Adapter Weight | Result |
|---------|-------------------|----------------|-------------------|--------|
| **Accuracy** | 0.50 | 0.5 | 0.55 | Higher likeness |
| **Retro** | 0.45 | 0.4 | 0.35 | More stylized |

---

## Technical Configuration

### Model & Parameters

```typescript
const GENERATION_CONFIG = {
  model: "civitai:112902@354657",      // DreamShaper XL Lightning Alpha 2
  controlNet: "runware:20@1",           // SDXL Canny
  ipAdapter: "civitai:208846@235313",   // FaceID Plus v2
  steps: 4,                             // STRICT - higher causes artifacts
  CFGScale: 2.0,                        // Low CFG required for Lightning
  scheduler: "DPMPP_SDE_KARRAS",        // Lightning requires this scheduler
  width: 1024,
  height: 1024,
};
```

### Post-Processing Pipeline

```
AI Output (1024×1024, smooth vector art)
    ↓
Resize (Lanczos → 128×128)
    ↓
CLAHE (clipLimit: 2.0, gridSize: 8)
    ↓
Bayer Dither (4×4 matrix, spread: 45)
    ↓
Palette Quantization (4 DMG colors)
    ↓
Final Output (128×128, exactly 4 colors)
```

### DMG Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Darkest | `#0F380F` | Outlines, shadows, text |
| Dark | `#306230` | Mid-shadows, details |
| Light | `#8BAC0F` | Highlights, skin mid-tones |
| Lightest | `#9BBC0F` | Background, brightest areas |

---

## Universal Prompt Blocks

### Style Block (All Prompts)

```
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece
```

### Negative Prompt (All Prompts)

```
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

### Background Block (All Prompts)

```
plain solid light green background, no details, clean, simple backdrop
```

### Framing Reference

| Stages | Camera Angle | Framing |
|--------|--------------|---------|
| 1-3 | 3/4 view | Upper body portrait from chest up, shoulders visible, arms partially visible |
| 4-5 | Slight low angle | Upper body portrait from chest up, heroic perspective, shoulders visible |

---

## Trainer Archetype

**Archetype Flavor:** Friendly, approachable, everyman, welcoming energy

**Visual Journey:** Regular gym-goer → Fitness hero others aspire to be

### Stage 1: Novice

**Camera:** 3/4 view

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, three-quarter view, shoulders and upper arms visible,

friendly welcoming expression, hopeful smile, approachable demeanor,

average soft build, relatable everyday physique, relaxed casual posture,

wearing loose fitting plain cotton t-shirt with crew neck,

small towel draped over one shoulder,

soft front lighting with subtle top-down shadows,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 2: Dedicated

**Camera:** 3/4 view

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, three-quarter view, shoulders and upper arms visible,

confident warm smile, determined eyes, growing self-assurance,

slightly toned physique, hints of arm definition, straighter upright posture with shoulders back,

wearing fitted athletic t-shirt with moisture-wicking appearance,

towel draped over shoulder, water bottle held at chest level,

soft front lighting with subtle top-down shadows,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 3: Athlete

**Camera:** 3/4 view

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, three-quarter view, shoulders and upper arms visible,

focused determined expression, confident intensity, owns their presence,

clearly muscular athletic build, defined arms and shoulders, strong stance with chest out,

wearing form-fitting performance compression shirt,

athletic headband on forehead, towel on shoulder,

soft front lighting with subtle top-down shadows,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 4: Elite

**Camera:** Slight low angle (heroic)

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, slight low angle heroic perspective, shoulders and upper arms visible,

intense confident expression, powerful commanding presence, fierce readiness,

impressive fitness model physique, well-defined muscular arms and shoulders, powerful stance that commands respect,

wearing premium fitted athletic gear with subtle trim details,

athletic headband, water bottle held confidently,

soft front lighting with subtle top-down shadows, faint rim lighting around figure, subtle backlight glow suggesting power,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 5: Transcendent

**Camera:** Slight low angle (heroic)

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, slight low angle heroic perspective, shoulders and upper arms visible,

serene mastery expression, knowing peaceful smile, transcendent inner calm radiating outward,

greek god proportions, perfect symmetry, idealized peak human fitness, heroic statue-like posture,

wearing sleek modern athletic wear with almost superhero-like quality,

athletic headband as signature mark,

soft front lighting, radiant aura surrounding figure, divine light emanating from character, heroic backlight halo effect, glowing energy suggesting legendary status,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

## Runner Archetype

**Archetype Flavor:** Dynamic, forward momentum, lean, streamlined, kinetic energy

**Visual Journey:** Casual jogger → Marathon legend who could run forever

### Stage 1: Novice

**Camera:** 3/4 view

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, three-quarter view, shoulders and upper arms visible,

eager expression, slightly nervous but excited smile, ready to begin,

average untrained build, soft physique, casual relaxed stance,

wearing basic cotton running t-shirt,

simple athletic headband keeping hair back,

soft front lighting with subtle top-down shadows,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 2: Dedicated

**Camera:** 3/4 view

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, three-quarter view, shoulders and upper arms visible,

determined ready expression, confident smile, building endurance mindset,

leaner physique losing softness, beginning of runner build, more athletic upright posture,

wearing lightweight breathable running singlet,

athletic headband, fitness watch visible on wrist,

soft front lighting with subtle top-down shadows,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 3: Athlete

**Camera:** 3/4 view

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, three-quarter view, shoulders and upper arms visible,

focused intensity expression, eyes locked on distant goal, streamlined determination,

lean defined runner build, visible muscle definition without bulk, forward-leaning energetic posture,

wearing technical running shirt with reflective accent details,

athletic headband, prominent running watch on wrist,

soft front lighting with subtle top-down shadows,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 4: Elite

**Camera:** Slight low angle (heroic)

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, slight low angle heroic perspective, shoulders and upper arms visible,

fierce determination expression, intense competitor eyes, coiled spring energy,

extremely lean physique, zero excess body fat, visible tendons and sinew suggesting peak endurance, explosive ready stance,

wearing aerodynamic racing singlet,

athletic headband, race bib number pinned to chest, running watch,

soft front lighting with subtle top-down shadows, faint rim lighting around figure, subtle motion energy emanating,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 5: Transcendent

**Camera:** Slight low angle (heroic)

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, slight low angle heroic perspective, shoulders and upper arms visible,

serene mastery expression, peaceful intensity, completely in the zone, transcendent calm of effortless motion,

ethereal lean physique, wind-like graceful form, body built for infinite endurance, appears to be in motion while standing still,

wearing legendary racing kit with flowing fabric suggesting speed,

athletic headband as signature mark, championship race bib,

soft front lighting, radiant aura surrounding figure, faint blue-tinted energy suggesting speed and wind, heroic backlight halo, motion lines emanating from figure,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

## Yoga Archetype

**Archetype Flavor:** Peaceful, centered, graceful lines, serene, balanced

**Visual Journey:** Yoga beginner → Enlightened monk-like master

### Stage 1: Novice

**Camera:** 3/4 view

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, three-quarter view, shoulders and upper arms visible,

peaceful welcoming expression, gentle serene smile, calm open demeanor,

soft flexible-looking build, graceful natural physique, relaxed gentle posture,

wearing relaxed flowy tank top with soft draping fabric,

hands pressed together in prayer position at chest level, namaste pose,

soft front lighting with subtle top-down shadows,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 2: Dedicated

**Camera:** 3/4 view

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, three-quarter view, shoulders and upper arms visible,

calm confident expression, inner peace beginning to show, centered steady gaze,

toned graceful physique, elegant lines developing, balanced centered posture,

wearing fitted yoga tank top with clean lines,

hands in prayer position at chest, mala beads visible on wrist,

soft front lighting with subtle top-down shadows,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 3: Athlete

**Camera:** 3/4 view

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, three-quarter view, shoulders and upper arms visible,

serene focused expression, deep calm radiating from eyes, unshakeable centeredness,

lean strong dancer-like physique, sculpted but graceful, effortlessly perfect aligned posture,

wearing premium yoga wear with elegant design,

hands in prayer position, prominent mala beads on wrist,

soft front lighting with subtle top-down shadows,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 4: Elite

**Camera:** Slight low angle (heroic)

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, slight low angle heroic perspective, shoulders and upper arms visible,

deep inner peace expression, profound serenity radiating outward, half-lidded eyes of deep meditation,

sculpted but not bulky physique, fluid graceful lines, effortlessly perfect stance suggesting complete body mastery,

wearing flowing athletic top with elegant draping,

mala beads prominent, hands in prayer position,

soft front lighting with subtle top-down shadows, faint rim lighting around figure, subtle inner glow emanating from within,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 5: Transcendent

**Camera:** Slight low angle (heroic)

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, slight low angle heroic perspective, shoulders and upper arms visible,

serene mastery expression, eyes closed or half-lidded in enlightened peace, transcendent calm of complete awakening, bodhisattva-like serenity,

idealized balanced ethereal physique, perfect harmony of strength and flexibility, levitating energy in posture,

wearing large flowing monk robe with elegant draping folds, traditional spiritual garment,

mala beads as sacred adornment,

soft front lighting, radiant soft white and golden aura surrounding figure, divine peaceful light emanating, gentle halo effect suggesting enlightenment, subtle lotus imagery in energy,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

## Bodybuilder Archetype

**Archetype Flavor:** Powerful, strong presence, impressive physique, imposing, solid

**Visual Journey:** Gym beginner → Herculean god of strength

### Stage 1: Novice

**Camera:** 3/4 view

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, three-quarter view, shoulders and upper arms visible,

eager motivated expression, excited smile, ready to begin the journey,

average build with some natural size, untrained but potential visible, basic relaxed stance with arms at sides,

wearing basic plain tank top,

arms in simple relaxed flex pose at chest level,

soft front lighting with subtle top-down shadows,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 2: Dedicated

**Camera:** 3/4 view

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, three-quarter view, shoulders and upper arms visible,

growing confidence expression, determined proud smile, strength building inside,

noticeable muscular size, arms visibly growing, broader shoulders, wider powerful stance,

wearing stringer tank top showing shoulder development,

lifting gloves visible on hands, arms in casual flex pose,

soft front lighting with subtle top-down shadows,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 3: Athlete

**Camera:** 3/4 view

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, three-quarter view, shoulders and upper arms visible,

intense powerful expression, serious focused determination, raw strength in eyes,

clearly muscular impressive build, defined striated muscles, classic bodybuilder proportions, powerful stance claiming space,

wearing deep-cut stringer tank showing maximum muscle visibility,

lifting gloves, wrist wraps visible, arms in proud flex pose,

soft front lighting with subtle top-down shadows,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 4: Elite

**Camera:** Slight low angle (heroic)

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, slight low angle heroic perspective, shoulders and upper arms visible,

fierce commanding expression, god-like confidence, absolute dominance radiating,

competition-ready elite physique, striated defined muscles, visible vascularity suggesting peak condition, ultimate powerful flex pose,

wearing competition-style tank top,

wrist wraps, chalk dust visible on shoulders, powerful flex pose,

soft front lighting with subtle top-down shadows, faint rim lighting around massive frame, subtle power glow emanating from muscles,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 5: Transcendent

**Camera:** Slight low angle (heroic)

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, slight low angle heroic perspective, shoulders and upper arms visible,

serene mastery expression, god-like calm confidence, almost peaceful in absolute power, transcendent strength,

herculean mythic proportions, legendary muscle mass, ancient greek statue perfection, awe-inspiring without being grotesque, ultimate power pose,

wearing championship gold-trimmed stringer tank,

chalk dust on massive shoulders as badge of honor,

soft front lighting, radiant power aura surrounding figure, veins with faint golden glow, divine strength emanating, heroic backlight suggesting mythological power,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

## Cyclist Archetype

**Archetype Flavor:** Sleek, efficient form, endurance athlete, aerodynamic, streamlined

**Visual Journey:** Weekend rider → Tour de France champion legend

### Stage 1: Novice

**Camera:** 3/4 view

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, three-quarter view, shoulders and upper arms visible,

friendly enthusiastic expression, excited smile, eager to ride,

average untrained build, casual physique, relaxed comfortable stance,

wearing casual cycling jersey with simple solid color,

cycling helmet held at chest level with one hand,

soft front lighting with subtle top-down shadows,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 2: Dedicated

**Camera:** 3/4 view

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, three-quarter view, shoulders and upper arms visible,

determined confident expression, growing passion for cycling, focused ready smile,

leaner developing physique, endurance build starting to show, more athletic posture,

wearing fitted cycling jersey with team-style design,

cycling helmet held at chest, fingerless cycling gloves visible on hands,

soft front lighting with subtle top-down shadows,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 3: Athlete

**Camera:** 3/4 view

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, three-quarter view, shoulders and upper arms visible,

focused intensity expression, competitor mindset visible, streamlined determination,

lean aerodynamic upper body, defined cyclist physique, confident athletic posture,

wearing aero cycling jersey with sleek performance design,

cycling gloves, sunglasses hanging from jersey collar,

soft front lighting with subtle top-down shadows,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 4: Elite

**Camera:** Slight low angle (heroic)

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, slight low angle heroic perspective, shoulders and upper arms visible,

fierce competitor expression, elite racer intensity, absolute focus on victory,

extremely lean defined physique, perfect cycling efficiency, pro athlete aerodynamic form, powerful confident stance,

wearing pro team cycling jersey with sponsor-style graphics,

cycling gloves, sunglasses on collar, helmet held proudly,

soft front lighting with subtle top-down shadows, faint rim lighting around figure, subtle motion energy suggesting speed,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

### Stage 5: Transcendent

**Camera:** Slight low angle (heroic)

```
POSITIVE PROMPT:
(flat vector art:1.4), (cel shaded:1.3), 2D, flat color, toon shading, clean lines, thick black outlines, strong outlines, high contrast, retro 1989 handheld game character, portable gaming hero portrait, green monochrome palette, minimalist illustration, centered image, unframed, masterpiece,

upper body portrait from chest up, slight low angle heroic perspective, shoulders and upper arms visible,

serene mastery expression, victorious champion calm, transcendent confidence of a legend, peaceful knowing smile,

perfect cycling physique, legendary endurance form, tour champion body built for conquering mountains, effortless power,

wearing yellow champion jersey with gold accents suggesting tour victory,

cycling gloves, sunglasses hanging from collar as signature style,

soft front lighting, radiant golden aura surrounding figure, subtle speed lines emanating, champion glow effect, heroic backlight of victory,

plain solid light green background, no details, clean, simple backdrop

NEGATIVE PROMPT:
photorealistic, 3d render, 3D, render, cgi, noise, grain, gradient, complex shading, texture, pixel art, pixelated, dithering, messy, glitch, photography, skin pores, complex background, multiple people, blurry, ugly, deformed, low contrast
```

---

## Implementation Notes

### Prompt Assembly in Code

```typescript
// Example: Building a complete prompt
const buildPrompt = (archetype: Archetype, stage: EvolutionStage): string => {
  const prompt = PROMPTS[archetype][stage];
  return prompt.positive;
};

const buildNegativePrompt = (): string => {
  return UNIVERSAL_NEGATIVE_PROMPT;
};
```

### Database Schema Integration

Each generated avatar should store:

```sql
INSERT INTO avatars (
  user_id,
  archetype,        -- 'trainer' | 'runner' | 'yoga' | 'bodybuilder' | 'cyclist'
  evolution_stage,  -- 1 | 2 | 3 | 4 | 5
  prompt_version,   -- '1.0' (this document version)
  url_accuracy,
  url_retro,
  selected_variant,
  final_url
) VALUES (...);
```

### Testing Matrix

Before production deployment, validate each prompt with diverse inputs:

| Test Category | Sample Size | Pass Criteria |
|---------------|-------------|---------------|
| Fitzpatrick I-II (Pale skin) | 5 per archetype | Facial features distinguishable |
| Fitzpatrick V-VI (Dark skin) | 5 per archetype | Face has ≥2 distinct tones |
| Accessories (Glasses, Hijab) | 3 per archetype | Accessory outline preserved |
| Age Range (20s, 40s, 60s) | 3 per archetype | Age characteristics maintained |

### Version Control

When updating prompts:

1. Increment version number in this document
2. Update `prompt_version` in database schema
3. Consider backward compatibility for existing avatars
4. Document changes in changelog below

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-01 | Initial prompt library with 25 prompts across 5 archetypes and 5 evolution stages |

---

## References

- [Avatar Generation Implementation Spec](./avatar-generation-implementation-spec.md)
- [Story 1.5: Avatar Generation](../stories/1.5.avatar-generation.story.md)
- [DreamShaper XL Lightning - Civitai](https://civitai.com/models/112902/dreamshaper-xl)
- [Stable Diffusion Blog - Cel Shaded Art](https://www.stablediffusion.blog/sdxl-styles/cel-shaded-art)
