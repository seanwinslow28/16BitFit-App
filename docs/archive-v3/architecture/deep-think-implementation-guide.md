# Deep Think Implementation Guide

**16BitFit V3 - Phase 4 Cross-Validation Summary**

**Date:** 2025-12-28
**Reviewer:** Gemini 3 Deep Think
**Version:** 1.0

---

## Executive Summary

This document consolidates all findings from the Deep Think cross-validation of 16BitFit V3's Phase 4 architecture. It serves as the **single source of truth** for critical implementation decisions and should be referenced by all agents working on Stories 1.3-1.8.

### Critical Pivots (Must Implement)

| Area | Original Plan | Corrected Approach | Risk if Ignored |
|:-----|:--------------|:-------------------|:----------------|
| **BigInt Scale** | 1000n or 10^18 | **10^9 (9 decimals)** | int64 overflow crash |
| **LoRA Selection** | Retro Diffusion | **Pixel Art XL** | IP-Adapter incompatibility |
| **Dithering** | Simple quantization | **Bayer Dithering** | Loss of facial detail |
| **Image Library** | sharp | **ImageScript** | Deno deployment failure |
| **Asset Loading** | WebView fetch() | **RNFS → Bridge injection** | iOS CORS failure |
| **Audio** | WebView HTML5 Audio | **react-native-sound** | 100-300ms latency |

---

## 1. Avatar Generation Pipeline (Story 1.5)

### API Configuration

```typescript
// Runware API - Exact payload
const runwareRequest = {
  taskType: 'imageInference',
  model: 'runware:100@1',  // SDXL 1.0 Base
  positivePrompt: '(DMG Game Boy pixel art, 4-color palette, flat shading:1.5), portrait, [archetype], facing forward <lora:civitai:120096@135931:1.2>',
  negativePrompt: '(realistic, photorealistic, dslr, 3d render, skin texture:1.5), gradient, anti-aliasing',
  width: 1024,
  height: 1024,
  steps: 30,
  cfgScale: 7.5,
  ipAdapters: [{
    model: 'runware:105@1',  // ip-adapter-plus-face_sdxl_vit-h
    guideImage: userPhotoUrl,
    weight: 0.58,  // CRITICAL: 0.55-0.60 range
  }],
};
```

### IP-Adapter Weight Tuning

| Weight | Result |
|:-------|:-------|
| `< 0.55` | Facial features lost |
| **`0.55 - 0.60`** | **OPTIMAL** |
| `> 0.65` | Realistic texture fights pixel art |

### LoRA Decision: Pixel Art XL (NOT Retro Diffusion)

**Why NOT Retro Diffusion?**
1. Based on SD 1.5 (512×512), incompatible with SDXL IP-Adapters
2. Not in Runware's public library (requires manual upload + fees)
3. Quantization still required regardless of model choice

### Bayer Dithering Algorithm

```typescript
import { Image } from 'https://deno.land/x/imagescript@1.2.15/mod.ts';

const PALETTE = [
  [15, 56, 15], [48, 98, 48], [139, 172, 15], [155, 188, 15]
];
const PALETTE_LUMA = PALETTE.map(([r,g,b]) => r*0.299 + g*0.587 + b*0.114);
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export function applyDmgDither(image: Image): void {
  const bitmap = image.bitmap;
  const SPREAD = 30.0;
  for (let y = 0; y < image.height; y++) {
    for (let x = 0; x < image.width; x++) {
      const idx = (y * image.width + x) * 4;
      const luma = bitmap[idx]*0.299 + bitmap[idx+1]*0.587 + bitmap[idx+2]*0.114;
      const threshold = ((BAYER[(y%4)*4+(x%4)] / 16.0) - 0.5) * SPREAD;
      const ditheredLuma = luma + threshold;
      let bestIdx = 0, minDiff = Infinity;
      for (let i = 0; i < 4; i++) {
        const diff = Math.abs(ditheredLuma - PALETTE_LUMA[i]);
        if (diff < minDiff) { minDiff = diff; bestIdx = i; }
      }
      bitmap[idx] = PALETTE[bestIdx][0];
      bitmap[idx+1] = PALETTE[bestIdx][1];
      bitmap[idx+2] = PALETTE[bestIdx][2];
      bitmap[idx+3] = 255;
    }
  }
}
```

---

## 2. HealthKit Integration (Story 1.3)

### Dual-Source Pattern: Speedometer vs. Odometer

| Component | Role | Latency | Usage |
|:----------|:-----|:--------|:------|
| **CMPedometer** | Speedometer | < 2s | **UI only** - real-time step counter |
| **HealthKit** | Odometer | Background | **Economy** - awards Energy/Coins |

### Phantom Permission Issue

On iOS, denied HealthKit returns "Success" with 0 steps (privacy). **Always check `getAuthStatus()` before querying.**

### Hydration Gate Pattern

Do NOT render Home Screen until HealthKit sync completes:

```typescript
if (!isHydrated || !isHealthKitReady) {
  return <LoadingSpinner message="Syncing Pedometer..." />;
}
```

---

## 3. WebView Bridge (Story 1.7)

### Serialization: MessagePack + Base64

```typescript
import { encode, decode } from '@msgpack/msgpack';
const binary = encode(message, { useBigInt64: true });
const base64 = Buffer.from(binary).toString('base64');
webViewRef.current.postMessage(base64);
```

### GAME_READY Handshake

**Critical:** Wait for Phaser to signal ready before sending commands.

```typescript
// Phaser sends on load complete:
window.ReactNativeWebView?.postMessage(encode({ type: 'GAME_READY' }));

// React Native waits:
await bridgeService.waitFor('GAME_READY', 5000);
```

### iOS Asset Loading: RNFS → Bridge

Do NOT use `fetch()` in WebView for local assets. Use RNFS:

```typescript
const base64 = await RNFS.readFile(path, 'base64');
bridgeService.send('INJECT_ASSET', {
  key: 'hero',
  data: `data:image/png;base64,${base64}`,
});
```

### Native Audio for Combat SFX

Use `react-native-sound` instead of WebView HTML5 Audio:

```typescript
bridgeService.on('PLAY_SFX', ({ key }) => sounds[key]?.play());
```

### Bridge 60FPS Trap: Command Pattern

**WRONG:** Per-frame sync (60 messages/second)
**CORRECT:** High-level commands, autonomous simulation, results-only sync

---

## 4. Combat Mechanics (Story 1.8)

### BigInt 9-Decimal Scale

```typescript
const SCALE = 1_000_000_000n; // 10^9

export const MathFixed = {
  toFixed: (val: number): bigint => BigInt(Math.round(val * 1e9)),
  fromFixed: (val: bigint): number => Number(val) / 1e9,
  mul: (a: bigint, b: bigint): bigint => (a * b) / SCALE,
  div: (a: bigint, b: bigint): bigint => (a * SCALE) / b,
};
```

### Why 9 Decimals (NOT 18)?

18 decimals causes int64 overflow in MessagePack:
- `10.0` with 18 decimals = `10,000,000,000,000,000,000` (exceeds max)
- `10.0` with 9 decimals = `10,000,000,000` (safe)

### MessagePack BigInt Configuration

```typescript
encode(message, { useBigInt64: true });
decode(binary, { useBigInt64: true });
```

---

## 5. Critical Warnings

### WebView Background Throttling

WebView JS execution is paused when app is backgrounded. **All time-sensitive logic must run in React Native.**

### Combat Isolation Pattern

Snapshot energy at combat start, queue any HealthKit syncs during combat, reconcile on exit.

### MMKV for Crash Recovery

Use MMKV (synchronous) instead of AsyncStorage for combat checkpoints.

---

## 6. Dependencies to Install

```bash
# Avatar Pipeline
npm install @runware/sdk-js

# Bridge Protocol
npm install @msgpack/msgpack buffer

# Asset Loading
npm install react-native-fs

# Native Audio
npm install react-native-sound

# Local Storage
npm install react-native-mmkv
```

---

## 7. File References

| Topic | Primary Document |
|:------|:-----------------|
| All Issues | [architecture-issues-and-resolutions.md](./architecture-issues-and-resolutions.md) |
| Avatar Pipeline | [1.5.avatar-generation.story.md](../stories/1.5.avatar-generation.story.md) |
| HealthKit | [1.3.healthkit-integration.story.md](../stories/1.3.healthkit-integration.story.md) |
| WebView Bridge | [1.7.webview-bridge.story.md](../stories/1.7.webview-bridge.story.md) |
| Combat Mechanics | [1.8.combat-mechanics.story.md](../stories/1.8.combat-mechanics.story.md) |
| Deep Think Responses | [PM COPIED FILES FOR DEEP THINK/RESPONSE/](../PM%20COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/) |

---

## 8. Quick Reference Checklist

Before implementing any Phase 4 story, verify:

- [ ] BigInt uses 10^9 scale (NOT 10^18)
- [ ] MessagePack initialized with `{ useBigInt64: true }`
- [ ] Avatar uses Pixel Art XL LoRA (NOT Retro Diffusion)
- [ ] IP-Adapter weight is 0.55-0.60
- [ ] Dithering uses Bayer algorithm (NOT simple quantization)
- [ ] Image processing uses ImageScript (NOT sharp)
- [ ] iOS assets loaded via RNFS → Bridge (NOT WebView fetch)
- [ ] Combat SFX uses react-native-sound (NOT WebView audio)
- [ ] GAME_READY handshake implemented
- [ ] HealthKit permission checked before querying
- [ ] Hydration Gate prevents "flash of zero"
- [ ] All timers run in React Native (NOT WebView)

---

**Document Version:** 1.0
**Last Updated:** 2025-12-28
**Approved By:** Sean (Product Owner)
