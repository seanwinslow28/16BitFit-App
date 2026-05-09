# Phase 4 Implementation Blockers & Concerns

**Document Version:** 1.1
**Date:** 2025-12-30
**Author:** Amelia (Developer Agent)
**Source:** Deep Think Cross-Validation Review + Developer Feasibility Assessment
**Status:** PARTIALLY RESOLVED - See checkmarks below

---

## Executive Summary

This document catalogs **blockers**, **missing dependencies**, and **technical concerns** identified during the Developer Agent review of the Gemini 3 Deep Think cross-validation. These items must be addressed before beginning Phase 4 development (Stories 1.3, 1.5, 1.7, 1.8).

**Classification:**
- **BLOCKER:** Cannot proceed with story implementation until resolved
- **MISSING:** Required component not present in codebase
- **CONCERN:** Risk that should be documented and monitored

---

## BLOCKERS

### BLOCKER-001: dmg-avatar Edge Function Outdated

**Severity:** BLOCKER
**Affects:** Story 1.5 (Avatar Generation)
**File:** `supabase/functions/dmg-avatar/index.ts`

#### Current State

The existing Edge Function (lines 1-207) uses a **seed image strength approach**:

```typescript
// Current implementation (INCORRECT)
const payload: RunwareTask[] = [
  {
    taskType: "imageInference",
    model: RUNWARE_MODEL_ID,  // runware:101@1
    seedImage: body.imageUrl,
    strength: 0.8,
    // ... NO IP-Adapter, NO post-processing
  }
];
```

#### Required State (per Deep Think)

The function must use **IP-Adapter for facial feature preservation** and **Bayer dithering for DMG compliance**:

```typescript
// Required implementation (from Story 1.5 Deep Think Additions)
const response = await runware.imageInference({
  taskType: 'imageInference',
  model: 'runware:100@1',  // SDXL 1.0 Base (NOT 101)
  positivePrompt: `(DMG Game Boy pixel art, 4-color palette, flat shading:1.5), portrait, ${archetypePrompts[archetype]}, facing forward <lora:civitai:120096@135931:1.2>`,
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
});

// THEN apply Bayer dithering post-processing
const processedAvatar = await processAvatar(rawImageBuffer);
```

#### Missing Components

1. **IP-Adapter configuration** — Not present in current implementation
2. **Bayer dithering algorithm** — Not implemented at all
3. **ImageScript import** — Using no image processing library
4. **Correct model ID** — Using `runware:101@1` instead of `runware:100@1` (SDXL)
5. **LoRA reference** — Missing Pixel Art XL LoRA (`civitai:120096@135931`)

#### Resolution Steps

1. Rewrite `supabase/functions/dmg-avatar/index.ts` to match Story 1.5 specification
2. Add `dither.ts` module with Bayer algorithm from `docs/stories/1.5.avatar-generation.story.md` lines 161-222
3. Add `runware.ts` module with correct API payload
4. Test with actual user photos before deploying

#### References

- Story specification: `docs/stories/1.5.avatar-generation.story.md` lines 91-134 (Runware payload)
- Bayer algorithm: `docs/stories/1.5.avatar-generation.story.md` lines 161-239
- Deep Think rationale: `docs/architecture/architecture-issues-and-resolutions.md` Issue #3

---

### BLOCKER-002: AndroidManifest Missing configChanges

**Severity:** ~~BLOCKER~~ **RESOLVED**
**Affects:** Story 1.7 (WebView Bridge) on Android
**File:** `apps/mobile-shell/android/app/src/main/AndroidManifest.xml`
**Resolved:** 2025-12-30 (Already present in codebase)

#### Resolution

The AndroidManifest.xml already contains the required `configChanges` attribute on line 20:

```xml
android:configChanges="keyboard|keyboardHidden|orientation|screenLayout|screenSize|smallestScreenSize|uiMode"
```

This includes `orientation` and `screenSize` as required. No action needed.

---

## MISSING DEPENDENCIES

### MISSING-001: react-native-mmkv

**Severity:** ~~BLOCKER~~ **RESOLVED**
**Affects:** Story 1.8 (Combat Mechanics) - Combat Isolation Pattern
**Resolved:** 2025-12-30 - Installed v4.1.0

#### Why Required

The Combat Isolation Pattern requires **synchronous, crash-proof writes** for combat checkpoints. AsyncStorage is asynchronous—if app crashes during write, state is lost.

```typescript
// Combat store requires MMKV (from Story 1.8)
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

// Synchronous write - survives crashes
storage.set('COMBAT_STATUS', 'IN_COMBAT');
storage.set('SNAPSHOT_ENERGY', energy);
```

#### Installation

```bash
cd apps/mobile-shell
npm install react-native-mmkv
cd ios && pod install
```

#### References

- Usage pattern: `docs/architecture/architecture-issues-and-resolutions.md` Issue #5 (lines 396-459)
- Story requirement: `docs/stories/1.8.combat-mechanics.story.md` lines 175-288

---

### MISSING-002: @msgpack/msgpack

**Severity:** ~~BLOCKER~~ **RESOLVED**
**Affects:** Story 1.7 (WebView Bridge), Story 1.8 (Combat Mechanics)
**Resolved:** 2025-12-30 - Installed v3.1.3

#### Why Required

Bridge protocol uses MessagePack for binary serialization with BigInt support:

```typescript
import { encode, decode } from '@msgpack/msgpack';

// Encode with BigInt support
const binary = encode(message, { useBigInt64: true });
const base64 = Buffer.from(binary).toString('base64');
```

#### Installation

```bash
cd apps/mobile-shell
npm install @msgpack/msgpack
```

#### References

- Bridge implementation: `docs/stories/1.7.webview-bridge.story.md` lines 143-226
- BigInt serialization: `docs/stories/1.8.combat-mechanics.story.md` lines 472-491

---

### MISSING-003: buffer

**Severity:** ~~BLOCKER~~ **RESOLVED**
**Affects:** Story 1.7 (WebView Bridge)
**Resolved:** 2025-12-30 - Installed v6.0.3

#### Why Required

React Native doesn't have Node's `Buffer` by default. Required for Base64 encoding of MessagePack binary:

```typescript
import { Buffer } from 'buffer';

const base64 = Buffer.from(binary).toString('base64');
```

#### Installation

```bash
cd apps/mobile-shell
npm install buffer
```

---

### MISSING-004: react-native-fs

**Severity:** BLOCKER
**Affects:** Story 1.7 (WebView Bridge) - iOS Asset Loading
**Current Status:** Not in `package.json`

#### Why Required

iOS WKWebView has CORS restrictions on `file://` sub-resources. Assets must be loaded via React Native and injected through bridge:

```typescript
import RNFS from 'react-native-fs';

const base64Data = await RNFS.readFile(filePath, 'base64');
bridgeService.send('INJECT_ASSET', {
  key: assetKey,
  data: `data:image/png;base64,${base64Data}`,
});
```

#### Installation

```bash
cd apps/mobile-shell
npm install react-native-fs
cd ios && pod install
```

#### References

- iOS CORS issue: `docs/architecture/architecture-issues-and-resolutions.md` Issue #17 (lines 1010-1068)
- Usage pattern: `docs/stories/1.7.webview-bridge.story.md` lines 453-513

---

### MISSING-005: react-native-sound

**Severity:** BLOCKER
**Affects:** Story 1.7 (WebView Bridge) - Combat Audio
**Current Status:** Not in `package.json`

#### Why Required

WebView HTML5 Audio has 100-300ms latency on Android. Native audio provides <20ms latency for combat SFX:

```typescript
import Sound from 'react-native-sound';

const sounds = {
  hit: new Sound('hit.mp3', Sound.MAIN_BUNDLE),
  punch: new Sound('punch.mp3', Sound.MAIN_BUNDLE),
};

bridgeService.on('PLAY_SFX', (payload) => {
  sounds[payload.key]?.play();
});
```

#### Installation

```bash
cd apps/mobile-shell
npm install react-native-sound
cd ios && pod install
```

#### References

- Audio latency issue: `docs/architecture/architecture-issues-and-resolutions.md` Issue #16 (lines 965-1006)
- Usage pattern: `docs/stories/1.7.webview-bridge.story.md` lines 515-555

---

## CONCERNS

### CONCERN-001: Dual-Source HealthKit Complexity

**Severity:** CONCERN (Recommend Deferral)
**Affects:** Story 1.3 (HealthKit Integration)

#### Issue

Deep Think recommends using **both CMPedometer and HealthKit** for different purposes:
- CMPedometer: Real-time UI updates (< 2s latency)
- HealthKit: Economy/energy conversion (source of truth)

#### Concerns

1. **react-native-pedometer** is less maintained than react-native-health
2. Android has no CMPedometer equivalent (Google Fit only)
3. Discrepancies between sources require complex UX handling
4. Adds significant complexity for marginal UX improvement

#### Recommendation

**Defer dual-source pattern to Phase 2.** For MVP:
1. Use single-source (HealthKit/Health Connect)
2. Add manual "Refresh" button with 2s animation (perceived responsiveness)
3. Re-evaluate real-time step updates based on user feedback

#### References

- Dual-source pattern: `docs/stories/1.3.healthkit-integration.story.md` lines 141-181
- Architecture rationale: `docs/architecture/architecture-issues-and-resolutions.md` Issue #14

---

### CONCERN-002: MessagePack vs JSON Tradeoff

**Severity:** CONCERN
**Affects:** Story 1.7, 1.8

#### Issue

MessagePack adds complexity (extra dependencies, WebView bundling) for ~30-40% message size reduction on small payloads (<1KB).

#### Recommendation

Implement MessagePack as specified, but add JSON fallback mode for debugging:

```typescript
const BRIDGE_MODE = __DEV__ ? 'json' : 'msgpack';
```

This allows easier debugging in development while maintaining production performance.

---

### CONCERN-003: Base64 Asset Injection Memory Overhead

**Severity:** CONCERN
**Affects:** Story 1.7

#### Issue

Base64 encoding adds 33% overhead. A 200KB spritesheet becomes ~260KB in bridge message. Multiple assets could pressure memory on low-end devices.

#### Recommendation

1. For **static assets**: Bundle directly into WebView HTML (no bridge injection needed)
2. For **dynamic assets** (user avatars): Use bridge injection
3. Add memory monitoring before implementing multiple asset injection

---

### CONCERN-004: Sound Pooling Required for Native Audio

**Severity:** CONCERN
**Affects:** Story 1.7

#### Issue

react-native-sound doesn't handle polyphony well. Rapid combat sounds (punch-punch-punch) need multiple instances:

```typescript
// REQUIRED: Create pool of sound instances
const hitSounds = Array(4).fill(null).map(() =>
  new Sound('hit.mp3', Sound.MAIN_BUNDLE)
);
let hitIndex = 0;

const playHit = () => {
  hitSounds[hitIndex].stop();
  hitSounds[hitIndex].play();
  hitIndex = (hitIndex + 1) % hitSounds.length;
};
```

#### Recommendation

Document this pattern in Story 1.7 implementation notes. Ensure implementer creates sound pools, not single instances.

---

### CONCERN-005: Combat State Split-Brain Risk

**Severity:** CONCERN
**Affects:** Story 1.8

#### Issue

If app crashes during combat sync (Phaser → RN), Phaser and RN could disagree on combat outcome. Which state wins?

#### Recommendation

1. **MMKV is source of truth** — If COMBAT_STATUS exists on app launch, assume crash occurred
2. **Refund energy** — Restore to pre-combat snapshot (pessimistic recovery)
3. **Log crash for analytics** — Track frequency of combat crashes

---

## Pre-Implementation Checklist

Before starting any Phase 4 story, verify:

### Blockers Resolved
- [ ] dmg-avatar Edge Function rewritten with IP-Adapter + Bayer dithering
- [x] AndroidManifest.xml updated with configChanges (2025-12-30)

### Dependencies Installed
- [x] `react-native-mmkv` installed and pods updated (2025-12-30)
- [x] `@msgpack/msgpack` installed (2025-12-30)
- [x] `buffer` installed (2025-12-30)
- [ ] `react-native-fs` installed and pods updated
- [ ] `react-native-sound` installed and pods updated

### Utilities Created
- [x] `MathFixed` BigInt utility created and tested (2025-12-30) — `src/utils/fixedPoint.ts`
- [x] Bridge service skeleton with MessagePack (2025-12-30) — `src/services/bridgeService.ts`
- [x] Combat isolation store created and tested (2025-12-30) — `src/stores/combatStore.ts`

### Testing
- [x] 12 critical path tests passing (2025-12-30):
  - 5 tests: `fixedPoint.test.ts`
  - 4 tests: `combatStore.test.ts`
  - 3 tests: `bridgeService.test.ts`

### Documentation Updated
- [x] This document reviewed by TEA
- [x] Test strategy approved (TEA-MINIMUM-TEST-SPECIFICATION.md)
- [ ] Story files have clear acceptance criteria

---

## Estimated Effort

| Item | Story Points | Priority |
|:-----|:-------------|:---------|
| dmg-avatar rewrite | 5 | P0 |
| AndroidManifest fix | 1 | P0 |
| Install dependencies | 2 | P0 |
| MathFixed utility | 2 | P0 |
| **Pre-work Total** | **10** | - |

---

## Document Maintenance

Update this document when:
- Blocker status changes (Resolved)
- New blockers identified during implementation
- Concerns materialize into actual issues

**Last Updated:** 2025-12-30
**Next Review:** Before Story 1.7 implementation begins

---

## Change Log

| Date | Version | Changes |
|:-----|:--------|:--------|
| 2025-12-29 | 1.0 | Initial document created |
| 2025-12-30 | 1.1 | BLOCKER-002 resolved (already present). MISSING-001/002/003 resolved (dependencies installed). Utilities created: fixedPoint.ts, bridgeService.ts, combatStore.ts. 12 critical tests passing. |
