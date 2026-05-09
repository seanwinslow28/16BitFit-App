# Architecture Issues & Resolutions

**Document Version:** 1.2
**Date:** 2025-12-29
**Author:** Cloud Dragonborn (Game Architect)
**Status:** Active Reference Document
**Last Review:** Gemini 3 Deep Think - Detailed Implementation Review (2025-12-29)

---

## Executive Summary

This document catalogs architectural issues, potential bugs, and blockers identified during the comprehensive review of the 16BitFit-V3 PRD and Architecture documents. Each issue includes severity classification, root cause analysis, proposed resolution, and implementation status.

**Total Issues Identified:** 18
- **Critical (Blocking):** 4 (all resolved)
- **High (Significant Risk):** 7 (3 new from Deep Think Detailed Review)
- **Medium (Bug Traps):** 7 (4 new from Deep Think Detailed Review)

> **Note:** This document was updated on 2025-12-29 following a **Detailed Implementation Review** by Gemini 3 Deep Think. Six additional issues were identified covering BigInt overflow, HealthKit edge cases, bridge optimization, and audio latency.

---

## Issue Classification

| Severity | Definition | Action Required |
|:---------|:-----------|:----------------|
| **CRITICAL** | Blocks development or causes fundamental system failure | Must resolve before implementation |
| **HIGH** | Significant risk of bugs, performance issues, or UX degradation | Resolve during implementation planning |
| **MEDIUM** | Potential edge cases or device-specific issues | Address during development, test thoroughly |

---

## Critical Issues

### Issue #1: WebView Bridge Protocol Discrepancy

**Severity:** CRITICAL
**Status:** ✅ RESOLVED (Deep Think Review 2025-12-28)

#### Problem Statement

The architecture documents contain conflicting specifications for the React Native ↔ Phaser WebView bridge:

| Document | Specification |
|:---------|:-------------|
| `architecture.md` | Local WebSocket Server + MessagePack |
| `deep_research_synthesis.md` | TurboModule + Protobuf (recommended as superior) |

This inconsistency will cause implementation confusion and potential performance issues if the wrong approach is chosen.

#### Root Cause Analysis

The deep research was conducted after the initial architecture was drafted, and the findings weren't fully reconciled with the main architecture document.

#### Resolution (UPDATED - Deep Think)

**Adopted Approach:** `postMessage` + MessagePack + Base64

> **PIVOT:** Deep Think identified that running a local WebSocket server on mobile is an anti-pattern. It triggers background execution limits, security prompts, and port-in-use race conditions.

**Final Decision:**
1. **Abandon WebSocket Server** - Use `window.ReactNativeWebView.postMessage` instead
2. **Keep MessagePack** - Encode binary data to Base64 for string transport
3. **Latency:** postMessage in modern WebViews is <10ms, indistinguishable from WebSocket for turn-based RPG

**Implementation:**

```typescript
// utils/GameBridge.ts
import { encode, decode } from '@msgpack/msgpack';
import { Buffer } from 'buffer';

const MSG_OPTS = { useBigInt64: true }; // Enable BigInt support

export const Bridge = {
  // React Native → WebView
  serialize: (payload: any): string => {
    const binary = encode(payload, MSG_OPTS);
    return Buffer.from(binary).toString('base64');
  },

  // WebView → React Native
  deserialize: (base64String: string): any => {
    const binary = Buffer.from(base64String, 'base64');
    return decode(binary, MSG_OPTS);
  }
};
```

**Benefits:**
- Removes ~500 lines of native WebSocket code
- No native module compilation required
- No port conflicts or background execution issues
- Testable in isolation

#### References

- [Deep Think Response](../COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/12-28-%20Google%20Gemini%203%20-%20Deep%20Think%20Response%20To%20Developer.md)

---

### Issue #2: Fixed-Point Math for Deterministic Combat NOT SPECIFIED

**Severity:** CRITICAL
**Status:** ✅ RESOLVED (Deep Think Review 2025-12-28)

#### Problem Statement

The architecture requires deterministic combat for rollback netcode readiness (post-MVP PvP), but **fixed-point math is not explicitly specified** in the Phaser combat logic implementation guidelines.

Without fixed-point math:
- Floating-point drift causes state divergence between clients
- Rollback re-simulation produces different results
- PvP becomes impossible without complete architecture redesign

#### Root Cause Analysis

Rollback netcode section mentions fixed-point conceptually but doesn't provide implementation patterns or library recommendations.

#### Resolution (UPDATED - Deep Think Detailed Review 2025-12-29)

**Adopted Approach:** Use **BigInt with 9-decimal precision** (NOT 2 decimals)

> **PIVOT:** Deep Think identified that `Math.round(float * 100)` is prone to floating-point drift. BigInt eliminates all drift and is natively supported in RN 0.71+.
>
> **CRITICAL UPDATE (2025-12-29):** Use **9 decimals** (10^9 scale), NOT 18 decimals. MessagePack's int64 type has a max value of 2^63-1. Using 18 decimals causes overflow when values exceed ~9.2.

**Implementation Pattern:**

```typescript
// apps/game-engine/src/combat/FixedPoint.ts

// Use BigInt for all combat calculations
// SCALE: 10^9 (9 decimals) - fits safely in int64
type FixedPoint = bigint;

const SCALE = 1_000_000_000n; // 10^9

// Utility functions
export const MathFixed = {
  // Convert UI number to fixed-point
  toFixed: (val: number): bigint => BigInt(Math.round(val * 1e9)),

  // Convert fixed-point to UI number
  fromFixed: (val: bigint): number => Number(val) / 1e9,

  // Multiply two fixed-point numbers
  mul: (a: bigint, b: bigint): bigint => (a * b) / SCALE,

  // Divide two fixed-point numbers
  div: (a: bigint, b: bigint): bigint => (a * SCALE) / b,
};

interface CharacterState {
  positionX: FixedPoint;  // BigInt, 1/100th pixel
  positionY: FixedPoint;
  velocityX: FixedPoint;
  velocityY: FixedPoint;
  health: number;         // Integer HP
  state: CharacterStateEnum;
  stateFrameCount: number;
}

// Example usage
const damage = 1500n; // Represents 15.00

// Seeded RNG for deterministic randomness
class SeededRNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    // Mulberry32 algorithm - deterministic
    let t = this.seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  }
}
```

**MessagePack Compatibility:**
- `@msgpack/msgpack` supports BigInt via `useBigInt64: true` option
- Must be enabled on both RN and WebView sides

#### References

- [docs/architecture.md](../architecture.md) - Rollback Netcode Readiness section
- [Deep Think Response](../COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/12-28-%20Google%20Gemini%203%20-%20Deep%20Think%20Response%20To%20Developer.md)

---

### Issue #3: Avatar Generation API Limitation

**Severity:** CRITICAL (Resolved)
**Status:** RESOLVED

#### Problem Statement

The original architecture specified DALL-E 3 / gpt-image-1 for avatar generation, but:
- DALL-E 3 API does NOT support inpainting or image reference input
- Cannot take user photo as reference
- Cannot guarantee DMG 4-color palette output

#### Resolution

**Adopted Approach:** IP-Adapter Pipeline with Server-Side Quantization

| Component | Specification |
|:----------|:-------------|
| **Resolution** | 128×128 pixels |
| **Face Integration** | IP-Adapter (extracts face features from photo) |
| **Primary Provider** | Runware (Stable Diffusion + LoRA support) |
| **Alternative Provider** | Fal.ai |
| **Color Compliance** | Server-side palette quantization (MANDATORY) |
| **Fallback** | Non-AI pixelation with DMG dithering |

**Key Insight:** AI models cannot guarantee exact 4-color output. The **post-processing quantization layer** is the actual compliance mechanism.

#### Implementation Notes (UPDATED - Deep Think)

- Local testing via ComfyUI before API spending
- Recommended models: Pixel Art XL, Pixelwave, 8bit Diffusion, Retro Diffusion
- Custom LoRA training for best DMG palette results

**Deno Quantization Library:** Use **ImageScript** (not `sharp`)

> **PIVOT:** Deep Think identified that `sharp` requires libvips (C++ bindings) which are not supported in Supabase Edge Runtime. ImageScript is a zero-dependency, pure JavaScript/WebAssembly library that runs natively in Deno.

```typescript
// supabase/functions/quantize-avatar/index.ts
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

const PALETTE = [
  [15, 56, 15],   // Darkest
  [48, 98, 48],   // Dark
  [139, 172, 15], // Light
  [155, 188, 15]  // Lightest
];

function getNearestColor(r: number, g: number, b: number): number[] {
  let min = Infinity;
  let best = PALETTE[0];
  for (const p of PALETTE) {
    const dist = (r-p[0])**2 + (g-p[1])**2 + (b-p[2])**2;
    if (dist < min) { min = dist; best = p; }
  }
  return best;
}

export async function quantize(buffer: Uint8Array): Promise<Uint8Array> {
  const img = await Image.decode(buffer);
  img.resize(64, 64); // Resize to avatar spec

  // Direct bitmap access (ImageScript verified API)
  const data = img.bitmap;

  // Iterate 4 bytes at a time (R, G, B, A)
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 128) continue; // Skip transparent

    const [nr, ng, nb] = getNearestColor(r, g, b);

    data[i] = nr;
    data[i + 1] = ng;
    data[i + 2] = nb;
  }

  return await img.encode();
}
```

**Additional Note:** Perform center-crop before resize to prevent squashed avatars from non-square uploads.

#### References

- [docs/stories/1.5.avatar-generation.story.md](../stories/1.5.avatar-generation.story.md) - Full implementation details
- [Deep Think Response](../COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/12-28-%20Google%20Gemini%203%20-%20Deep%20Think%20Response%20To%20Developer.md)

---

## High-Risk Issues

### Issue #4: Phaser 3 WebView Memory Management

**Severity:** HIGH
**Status:** DOCUMENTED (Implementation Required)

#### Problem Statement

Phaser 3 in WebView has known memory management challenges:
- Texture memory not automatically released
- Scene transitions can leak memory
- <150MB target requires active management

On low-end devices, memory pressure can cause:
- WebView crashes
- Frame rate degradation
- App termination by OS

#### Resolution

**Implement Memory Management Protocol:**

```typescript
// apps/game-engine/src/utils/MemoryManager.ts

class MemoryManager {
  private textureCache: Map<string, Phaser.Textures.Texture>;
  private readonly MAX_TEXTURE_MEMORY_MB = 100;

  // Track texture usage
  loadTexture(key: string, url: string): void {
    if (this.getTextureMemoryMB() > this.MAX_TEXTURE_MEMORY_MB) {
      this.evictLeastRecentlyUsed();
    }
    // Load texture...
  }

  // Clean up on scene exit
  onSceneDestroy(scene: Phaser.Scene): void {
    // Remove scene-specific textures
    // Clear sprite pools
    // Force garbage collection hint
  }

  // Periodic memory check
  checkMemoryPressure(): void {
    if (this.getUsedMemoryMB() > 140) {
      this.emergencyCleanup();
    }
  }
}
```

**Additional Measures:**
- Object pooling for frequently created/destroyed objects
- Texture atlasing to reduce draw calls and memory fragmentation
- Lazy loading of combat assets
- Aggressive cleanup on scene transitions

#### References

- [docs/architecture.md](../architecture.md) - Performance Optimization section

---

### Issue #5: Energy Meter Race Condition

**Severity:** HIGH
**Status:** RESOLVED

#### Problem Statement

Without isolation, health sync during combat creates state divergence:

```
TIME    SHELL                 COMBAT
─────────────────────────────────────────
0ms     Energy: 100          Start Battle
50ms    Health sync: +500    [IN COMBAT]
        steps → +50 energy
100ms   Energy: 150          Use 30 energy
        (NOT VISIBLE)        for special
150ms   Combat ends          Energy: 70?
        Energy: ???          or 120???
```

#### Resolution

**Adopted Approach:** Combat Isolation Pattern

| Decision | Choice |
|:---------|:-------|
| Steps during combat | Applied AFTER battle ends |
| Crash recovery | Combat state checkpointed to **MMKV** (not AsyncStorage) |
| Combat timeout | 10 minutes auto-exit |
| Reconciliation timeout | 15 seconds with offline queue fallback |

**State Machine:**
```
IDLE → SNAPSHOT → IN_COMBAT → RECONCILING → IDLE
```

#### Implementation Notes (UPDATED - Deep Think)

> **PIVOT:** Deep Think identified that AsyncStorage is asynchronous. If the app crashes *during* a write, state is lost. Switch to **react-native-mmkv** for synchronous, atomic writes.

**Crash-Proof Combat Store:**

```typescript
// stores/combatStore.ts
import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

type CombatState = 'IDLE' | 'IN_COMBAT' | 'RECONCILING';

interface CombatStore {
  status: CombatState;
  pendingSteps: number;
  startCombat: (energy: number) => void;
  queueSteps: (steps: number) => void;
  endCombat: (results: any) => Promise<void>;
}

export const useCombatStore = create<CombatStore>((set, get) => ({
  status: (storage.getString('COMBAT_STATUS') as CombatState) || 'IDLE',
  pendingSteps: storage.getNumber('PENDING_STEPS') || 0,

  startCombat: (energy) => {
    // Sync write to MMKV (crash-proof)
    storage.set('COMBAT_STATUS', 'IN_COMBAT');
    storage.set('SNAPSHOT_ENERGY', energy);
    storage.set('PENDING_STEPS', 0);
    set({ status: 'IN_COMBAT', pendingSteps: 0 });
  },

  queueSteps: (steps) => {
    if (get().status === 'IN_COMBAT') {
      const newTotal = get().pendingSteps + steps;
      storage.set('PENDING_STEPS', newTotal);
      set({ pendingSteps: newTotal });
    }
  },

  endCombat: async (results) => {
    set({ status: 'RECONCILING' });

    try {
      // Race: Supabase sync vs 15s timeout
      await Promise.race([
        supabase.rpc('sync_combat', results),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('TIMEOUT')), 15000)
        )
      ]);
      storage.delete('OFFLINE_QUEUE');
    } catch (error) {
      // Optimistic offline queue
      const queue = JSON.parse(storage.getString('OFFLINE_QUEUE') || '[]');
      queue.push({ results, timestamp: Date.now() });
      storage.set('OFFLINE_QUEUE', JSON.stringify(queue));
    } finally {
      storage.delete('COMBAT_STATUS');
      set({ status: 'IDLE', pendingSteps: 0 });
    }
  }
}));
```

**Key Changes:**
- MMKV for synchronous writes (crash-proof)
- 15-second reconciliation timeout
- Offline queue for network failures
- Queue processor runs on app launch

#### References

- [docs/stories/1.8.combat-mechanics.story.md](../stories/1.8.combat-mechanics.story.md) - Full implementation
- [Deep Think Response](../COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/12-28-%20Google%20Gemini%203%20-%20Deep%20Think%20Response%20To%20Developer.md)

---

### Issue #6: Health API Permission Timing

**Severity:** HIGH
**Status:** RESOLVED

#### Problem Statement

What happens when users:
1. Deny HealthKit/Health Connect permissions?
2. Revoke permissions later?
3. Use devices without health tracking?

Blocking these users entirely loses them; letting them proceed without fallback makes combat unplayable.

#### Resolution

**Adopted Approach:** Three-Tier Permission System

| Tier | Name | Condition | Capabilities |
|:-----|:-----|:----------|:-------------|
| **1** | Full Access | HealthKit/Health Connect granted | Auto-sync steps, workouts, calories |
| **2** | Manual Entry | Permission denied | User enters steps manually. Daily cap: 15,000 |
| **3** | Demo Mode | No health device | Fixed 100 energy/day. 5 battles/day limit |

**Additional Features:**
- Workout metadata tracking (type, duration, count)
- Anti-gaming validation (soft, educational)
- Re-permission prompts (max once per week, after 3 manual entries)

#### Implementation Notes

- Workout types: walking, running, jogging, weightlifting, cycling, crossfit, yoga, swimming, hiit, other
- Gentle UX for permission denial ("No Problem, Adventurer!")
- Settings page allows reconnection at any time

#### References

- [docs/stories/1.3.healthkit-integration.story.md](../stories/1.3.healthkit-integration.story.md) - Full implementation

---

### Issue #7: Orientation Lock Timing

**Severity:** HIGH
**Status:** RESOLVED

#### Problem Statement

Combat uses landscape orientation; shell uses portrait. Incorrect sequencing causes:
- Screen flicker during rotation
- Partially rendered combat UI
- Animation interruption
- Black frames between states

#### Resolution

**Adopted Approach:** 4-Phase Combat Transition Pipeline with Two-Part Video

| Phase | Duration | Activity |
|:------|:---------|:---------|
| **1: Preparation** | ~100ms | Disable input, snapshot energy, pre-mount WebView |
| **2: Visual Transition** | 600-800ms | Play VIDEO A (portrait → black) |
| **3: Orientation Switch** | 200-400ms | Lock to landscape (screen is black) |
| **4: Combat Reveal** | 600-800ms | Play VIDEO B (black → arena), show WebView |

**Two-Part Video System:**
- VIDEO A: Portrait, DMG 4-color → pixel warp → black (~300-500KB)
- VIDEO B: Landscape, black → color explosion → arena (~400-700KB)
- Custom Veo 3.1 generated transitions
- Fallback: Instant pixel dissolve if video unavailable

**Edge Case Handling:**

| Scenario | Handling |
|:---------|:---------|
| App backgrounded | Abort, restore portrait, checkpoint |
| Orientation lock failure | Run combat in portrait (fallback UI) |
| WebView crash | Abort, refund energy, show error |
| Video failure | Fall back to pixel dissolve |
| 10-minute timeout | Auto-exit, reconcile energy |

#### References

- [docs/architecture.md](../architecture.md) - Combat Transition Pipeline section

---

### Issue #8: Android Activity Restart on Orientation Change (NEW - Deep Think)

**Severity:** HIGH
**Status:** ✅ RESOLVED (Deep Think Review 2025-12-28)

#### Problem Statement

> **Deep Think Alert:** Rotating the device (Phase 3 of Combat Transition) triggers an Activity restart on Android, killing the app state.

Without proper configuration, orientation changes cause:
- Activity destruction and recreation
- Loss of in-memory state
- Combat state potentially corrupted
- WebView may be destroyed mid-transition

#### Resolution

**Required:** Add `android:configChanges` to `AndroidManifest.xml`

```xml
<!-- android/app/src/main/AndroidManifest.xml -->
<activity
  android:name=".MainActivity"
  android:configChanges="orientation|screenSize|keyboardHidden"
  ...
>
```

This tells Android to NOT restart the Activity on orientation/screen size changes. React Native will handle the configuration change internally.

#### Implementation Notes

- This is a **BLOCKER** for Combat Transition Pipeline
- Must be added before Story 1.7 implementation
- Also add `android:largeHeap="true"` for memory headroom

#### References

- [Deep Think Response](../COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/12-28-%20Google%20Gemini%203%20-%20Deep%20Think%20Response%20To%20Developer.md)

---

## Medium-Risk Issues (Bug Traps)

### Issue #9: Phaser Bundle Serving via file:// CORS Issues (NEW - Deep Think)

**Severity:** MEDIUM
**Status:** ✅ RESOLVED (Deep Think Review 2025-12-28)

#### Problem Statement

Loading Phaser bundle via `file://` causes CORS issues for JSON tilemaps and audio assets on Android WebViews.

Original plan considered `react-native-static-server` to serve from `http://localhost:8080`.

#### Resolution

**Adopted Approach:** Use `file://` with WebView CORS bypass flags

> **PIVOT:** Deep Think recommended abandoning the static server for production. Using `file://` URIs is the industry standard for offline-first hybrid apps. The server adds complexity and battery drain.

**WebView Configuration:**

```typescript
import { Platform } from 'react-native';
import { WebView } from 'react-native-webview';

const GAME_URI = Platform.select({
  android: 'file:///android_asset/game/index.html',
  ios: './game/index.html',
});

export const CombatWebView = () => (
  <WebView
    source={{ uri: GAME_URI }}
    originWhitelist={['*']}

    // CRITICAL: Bypass CORS for local files
    allowFileAccess={true}
    allowFileAccessFromFileURLs={true}
    allowUniversalAccessFromFileURLs={true}

    javaScriptEnabled={true}
  />
);
```

**Asset Placement:**
- **Android:** `android/app/src/main/assets/game/`
- **iOS:** Add `game` folder to Xcode as **Folder Reference** (blue icon)

**Tradeoffs:**
- Cannot hot-swap game assets via CodePush (requires store update)
- Gains significant stability and battery savings

#### References

- [Deep Think Follow-Up Response](../COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/12-28%20-%20Google%20Gemini%203%20Deep%20Think%20-%20Developer%20Followup%20Questions%20Response.md)

---

### Issue #10: DMG Palette Shader on Low-End Android

**Severity:** MEDIUM
**Status:** DOCUMENTED

#### Problem Statement

The DMG 4-color palette enforcement via Skia shader may cause performance issues on low-end Android devices:
- GPU fragment shader overhead
- Some older GPUs don't optimize simple shaders well
- Could drop below 60fps target

#### Resolution

**Implement Quality Tier System:**

```typescript
// apps/mobile-shell/src/config/qualityTiers.ts

type QualityTier = 'low' | 'medium' | 'high';

const QUALITY_TIERS = {
  low: {
    useShader: false,           // Pre-quantized assets instead
    particleCount: 10,
    shadowsEnabled: false,
  },
  medium: {
    useShader: true,
    particleCount: 25,
    shadowsEnabled: false,
  },
  high: {
    useShader: true,
    particleCount: 50,
    shadowsEnabled: true,
  },
};

// Auto-detect tier based on device
const detectQualityTier = async (): Promise<QualityTier> => {
  const { totalMemory, apiLevel } = await DeviceInfo.getDeviceInfo();

  if (totalMemory < 3 * 1024 * 1024 * 1024 || apiLevel < 28) {
    return 'low';
  } else if (totalMemory < 6 * 1024 * 1024 * 1024) {
    return 'medium';
  }
  return 'high';
};
```

**Low Tier Fallback:**
- Use pre-quantized PNG assets instead of runtime shader
- Reduce particle effects
- Disable optional visual polish

#### Testing Required

- Test on Android API 26-28 devices
- Test on devices with <3GB RAM
- Verify 60fps maintained across all tiers

---

### Issue #11: Tab Bar + Combat State Conflict

**Severity:** MEDIUM
**Status:** DOCUMENTED

#### Problem Statement

If the tab bar remains visible/active during combat:
1. User could tap Home tab while in combat
2. Navigation occurs, combat state orphaned
3. Energy not reconciled, WebView left running

#### Resolution

**Implement Combat Lock:**

```typescript
// apps/mobile-shell/src/navigation/TabNavigator.tsx

const TabNavigator = () => {
  const combatState = useEnergyStore(state => state.combatState);
  const isCombatActive = combatState === 'IN_COMBAT';

  return (
    <Tab.Navigator
      screenListeners={{
        tabPress: (e) => {
          if (isCombatActive) {
            // Prevent navigation
            e.preventDefault();

            // Show toast
            showToast('Finish your battle first!');
          }
        },
      }}
      tabBar={(props) => (
        <CustomTabBar
          {...props}
          disabled={isCombatActive}
          style={isCombatActive ? styles.hidden : styles.visible}
        />
      )}
    >
      {/* Tab screens */}
    </Tab.Navigator>
  );
};
```

**Additional Measures:**
- Hide tab bar during combat (orientation is landscape anyway)
- Block hardware back button during combat
- Show "Exit Battle?" confirmation if user force-quits

---

### Issue #12: Orientation Lock Failure on Tablets/Foldables (NEW - Deep Think)

**Severity:** MEDIUM
**Status:** ✅ RESOLVED (Deep Think Review 2025-12-28)

#### Problem Statement

Foldables and tablets often ignore programmatic orientation locks. If we attempt to run landscape combat in a portrait-locked view, the game will be squashed and unplayable.

#### Resolution

**Adopted Approach:** Soft Lock UI with User Prompt

Do NOT attempt to run landscape combat in a squashed portrait view. Instead, detect the failure and prompt the user.

```typescript
// After orientation lock request
const { width, height } = Dimensions.get('window');
const isLandscape = width > height;

if (!isLandscape) {
  // Orientation lock failed - show overlay
  return (
    <View style={styles.rotateOverlay}>
      <PixelText>Please Rotate Device to Fight</PixelText>
      <PixelIcon name="rotate" />
    </View>
  );
}

// Proceed with combat
return <CombatWebView />;
```

#### Implementation Notes

- Check `Dimensions.get()` AFTER lock request
- If still portrait, show rotation prompt overlay
- Do not proceed until device is landscape
- Consider: Allow portrait combat with adjusted UI as future enhancement

#### References

- [Deep Think Response](../COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/12-28-%20Google%20Gemini%203%20-%20Deep%20Think%20Response%20To%20Developer.md)

---

### Issue #13: BigInt Overflow with 18-Decimal Scale (NEW - Deep Think Detailed Review)

**Severity:** CRITICAL
**Status:** ✅ RESOLVED (Deep Think Detailed Review 2025-12-29)

#### Problem Statement

> **Deep Think Alert:** Using 18-decimal fixed-point math (standard Solidity/Ethers format) causes int64 overflow in MessagePack serialization.

- MessagePack int64 max value: 2^63-1 (~9.2 quintillion)
- 10.0 with 18 decimals = 10,000,000,000,000,000,000 (10 quintillion)
- This EXCEEDS the max safe value, causing silent overflow or crash

#### Resolution

**Use 9 decimals (10^9 scale) instead of 18 decimals.**

```typescript
// SAFE: 9 decimals
const SCALE = 1_000_000_000n; // 10^9
const hp100 = 100_000_000_000n; // 100 * 10^9 = 100 billion ✅

// UNSAFE: 18 decimals
const SCALE_18 = 1_000_000_000_000_000_000n; // 10^18
const hp100_18 = 100_000_000_000_000_000_000n; // OVERFLOW ❌
```

#### References

- [Deep Think Detailed Response](../PM%20COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/12-28%20-%20Google%20Gemini%203%20Deep%20Think%20-%20PM%20DETAILED%20Followup%20Questions%20Response.md)

---

### Issue #14: HealthKit "Phantom Permission" Detection (NEW - Deep Think Detailed Review)

**Severity:** HIGH
**Status:** ✅ RESOLVED (Deep Think Detailed Review 2025-12-29)

#### Problem Statement

On iOS, when a user denies HealthKit permission, queries often return "Success" with **0 steps** (for privacy). The app cannot distinguish:
1. User denied permission (should prompt re-request)
2. User granted but hasn't walked today (legitimate 0)
3. HealthKit unavailable on device

#### Resolution

**Check `getAuthStatus()` explicitly before querying:**

```typescript
import AppleHealthKit from 'react-native-health';

const detectHealthKitStatus = async (): Promise<
  'GRANTED' | 'DENIED' | 'UNAVAILABLE' | 'NOT_REQUESTED'
> => {
  return new Promise((resolve) => {
    AppleHealthKit.getAuthStatus(
      { permissions: { read: [AppleHealthKit.Constants.Permissions.Steps] } },
      (err, result) => {
        if (err) {
          resolve('UNAVAILABLE');
          return;
        }
        const status = result.permissions.read[0];
        if (status === 2) resolve('GRANTED');
        else if (status === 1) resolve('DENIED');
        else resolve('NOT_REQUESTED');
      }
    );
  });
};
```

**Important:** Do NOT rely on query results (0 steps) to detect permission status.

#### References

- [Deep Think PM Response](../PM%20COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/12-28-%20Google%20Gemini%203%20-%20Deep%20Think%20Response%20To%20PM.md)

---

### Issue #15: Bridge 60FPS Trap (NEW - Deep Think Detailed Review)

**Severity:** HIGH
**Status:** ✅ RESOLVED (Deep Think Detailed Review 2025-12-29)

#### Problem Statement

Sending bridge messages every frame (16ms) for `UPDATE_HP` or `PLAYER_MOVED` will overwhelm the bridge and cause:
- Message queue buildup
- Increased latency
- Potential dropped messages
- Battery drain

#### Resolution

**Use Command Pattern, not State Streaming:**

```typescript
// ❌ BAD: Sending every frame
update() {
  bridge.send('PLAYER_STATE', { x: this.x, y: this.y, hp: this.hp });
}

// ✅ GOOD: Send commands, let Phaser simulate autonomously
// React Native sends:
bridge.send('START_COMBAT', {
  seed: 12345,           // Deterministic RNG seed
  playerEnergy: 100,
  enemyType: 'training_dummy'
});

// Phaser simulates combat internally
// Only sends results back:
bridge.send('COMBAT_COMPLETE', {
  result: 'WIN',
  energySpent: 45,
  damageDealt: 100,
  combatLog: [...]
});
```

**Sync only critical state changes:**
- `HEALTH_CHANGED` (when HP changes significantly)
- `ROUND_END` (between rounds)
- `COMBAT_COMPLETE` (battle finished)

#### References

- [Deep Think PM Response](../PM%20COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/12-28-%20Google%20Gemini%203%20-%20Deep%20Think%20Response%20To%20PM.md)

---

### Issue #16: WebView Audio Latency on Android (NEW - Deep Think Detailed Review)

**Severity:** HIGH
**Status:** ✅ RESOLVED (Deep Think Detailed Review 2025-12-29)

#### Problem Statement

HTML5 Audio in Android WebView has 100-300ms latency for sound effects. Combat SFX (punch, kick, hit) will feel unresponsive.

#### Resolution

**Use Native Audio (react-native-sound) triggered via Bridge:**

```typescript
// React Native: Preload sounds on combat screen mount
import Sound from 'react-native-sound';

const sounds = {
  hit: new Sound('hit.mp3', Sound.MAIN_BUNDLE),
  punch: new Sound('punch.mp3', Sound.MAIN_BUNDLE),
  kick: new Sound('kick.mp3', Sound.MAIN_BUNDLE),
};

// Listen for SFX commands from Phaser
bridge.on('SFX', (payload) => {
  sounds[payload.key]?.play();
});

// Phaser: Send SFX command (don't play locally)
onHitConfirmed() {
  this.bridge.send('SFX', { key: 'hit' });
}
```

**Benefits:**
- Native audio latency: <20ms
- Consistent across iOS and Android
- Can use device haptics simultaneously

#### References

- [Deep Think PM Response](../PM%20COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/12-28-%20Google%20Gemini%203%20-%20Deep%20Think%20Response%20To%20PM.md)

---

### Issue #17: iOS file:// Sub-Resource CORS (NEW - Deep Think Detailed Review)

**Severity:** MEDIUM
**Status:** ✅ RESOLVED (Deep Think Detailed Review 2025-12-29)

#### Problem Statement

On iOS WKWebView, `file://` pages have `Origin: null`. While the main HTML loads, sub-resource loading via `fetch()` or `XHR` fails due to CORS:

```javascript
// This FAILS on iOS with file://
this.load.json('enemies', './data/enemies.json');
```

#### Resolution

**Inject assets via Bridge instead of fetch:**

```typescript
// React Native: Load asset and inject
import RNFS from 'react-native-fs';

const injectGameData = async (webviewRef) => {
  const data = await RNFS.readFile(`${RNFS.MainBundlePath}/assets/enemies.json`, 'utf8');

  webviewRef.current.postMessage(JSON.stringify({
    type: 'INJECT_DATA',
    key: 'enemies',
    data: JSON.parse(data)
  }));
};

// Phaser: Receive and use
window.addEventListener('message', (event) => {
  const msg = JSON.parse(event.data);
  if (msg.type === 'INJECT_DATA') {
    window.GAME_DATA[msg.key] = msg.data;
  }
});
```

**For binary assets (spritesheets):**
```typescript
// Base64 encode PNG, inject via bridge
const spriteBase64 = await RNFS.readFile(path, 'base64');
webviewRef.current.postMessage(JSON.stringify({
  type: 'INJECT_ASSET',
  key: 'hero',
  data: `data:image/png;base64,${spriteBase64}`,
  frameConfig: { frameWidth: 32, frameHeight: 32 }
}));

// Phaser: Use textures.addBase64()
this.textures.addBase64(msg.key, msg.data);
```

#### References

- [Deep Think Detailed Response](../PM%20COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/12-28%20-%20Google%20Gemini%203%20Deep%20Think%20-%20PM%20DETAILED%20Followup%20Questions%20Response.md)

---

### Issue #18: HealthKit Hydration Gate (NEW - Deep Think Detailed Review)

**Severity:** MEDIUM
**Status:** ✅ RESOLVED (Deep Think Detailed Review 2025-12-29)

#### Problem Statement

HealthKit queries are asynchronous and take 500ms-2s. If combat screen loads immediately, user sees "0 Energy/0 Steps" before HealthKit resolves.

#### Resolution

**Implement Hydration Gate - don't mount WebView until ready:**

```typescript
// CombatScreen.tsx
const CombatScreen = () => {
  const [isHealthSynced, setIsHealthSynced] = useState(false);
  const [isAssetsLoaded, setIsAssetsLoaded] = useState(false);

  useEffect(() => {
    const hydrate = async () => {
      try {
        await Promise.race([
          healthService.syncSteps(),
          new Promise((_, reject) => setTimeout(() => reject('TIMEOUT'), 3000))
        ]);
      } catch (e) {
        console.warn('HealthKit hydration timeout, proceeding with cached data');
      }
      setIsHealthSynced(true);
    };
    hydrate();
  }, []);

  // Gate: Don't mount WebView until hydrated
  if (!isHealthSynced || !isAssetsLoaded) {
    return <LoadingScreen status="Preparing Battle..." />;
  }

  return <PhaserWebView onAssetsLoaded={() => setIsAssetsLoaded(true)} />;
};
```

**Timeout Behavior:**
- If HealthKit takes >3s, proceed with cached/default values
- Combat can start with 0 energy (user will see "Low Energy" warning)
- Background sync continues and updates on next combat

#### References

- [Deep Think PM Response](../PM%20COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/12-28-%20Google%20Gemini%203%20-%20Deep%20Think%20Response%20To%20PM.md)

---

## Implementation Priority (UPDATED - Deep Think Detailed Review)

### Day 1: Bridge Architecture (Unblocks Game Team)

1. **Issue #1:** Implement `postMessage` + MessagePack bridge (NOT WebSocket)
2. **Issue #8:** Add `android:configChanges` to AndroidManifest.xml
3. **Issue #13:** Use 9-decimal BigInt scale (NOT 18 decimals)

### Day 2: Edge Functions (Unblocks Avatar Story)

4. **Issue #3:** Deploy ImageScript quantization with Bayer dithering to Supabase Edge Functions

### Day 3: Shell Stability

5. **Issue #9:** Configure WebView with `file://` CORS bypass flags
6. **Issue #17:** Implement RNFS → Bridge asset injection for iOS
7. Add `android:largeHeap="true"` to AndroidManifest.xml
8. Pin `react-native-video@5.2.1`

### Day 4: State Machine & Audio

9. **Issue #5:** Connect Zustand combat store to MMKV
10. **Issue #2:** Implement BigInt fixed-point math for combat state
11. **Issue #16:** Implement native audio via `react-native-sound`

### Phase 2: Foundation Stories (1.3, 1.5, 1.7, 1.8)

12. **Issue #6:** Implement 3-tier permission system (Story 1.3)
13. **Issue #14:** Implement phantom permission detection
14. **Issue #3:** Complete IP-Adapter pipeline with Runware (Story 1.5)
15. **Issue #7:** Implement Combat Transition Pipeline (Story 1.7)
16. **Issue #15:** Implement Command Pattern for bridge (not state streaming)
17. **Issue #18:** Implement Hydration Gate for combat screen
18. **Issue #5:** Complete Combat Isolation Pattern (Story 1.8)

### Phase 3: Polish & Edge Cases

19. **Issue #4:** Implement memory management protocol
20. **Issue #10:** Implement quality tier system for low-end devices
21. **Issue #11:** Implement combat navigation lock
22. **Issue #12:** Implement soft orientation lock with user prompt

---

---

## PM Sign-Off

**Review Date:** 2025-12-28
**Reviewer:** John (Product Manager)
**Status:** ✅ APPROVED FOR PHASE 4 IMPLEMENTATION

### Decisions Finalized

| Decision | Choice | Authority |
|:---------|:-------|:----------|
| Avatar API Provider | Runware (Fal.ai fallback) | Sean (PO) |
| Tier 3 Demo Mode | 100 energy/day, 5 battles/day | Sean (PO) |
| Avatar Cost Cap | $0.15/avatar, $100/day budget | John (PM) |

### PRD Alignment Score: 9.2/10

All 18 architectural issues (4 critical, 7 high, 7 medium) have been addressed with solutions that align with PRD requirements and the "Celebration Without Punishment" philosophy.

### Outstanding Recommendations (Non-Blocking)

1. Pre-cache transition videos during archetype selection
2. Design portrait combat fallback UI for tablets
3. User test manual entry flow (Tier 2)

---

## Document Maintenance

This document should be updated when:
- New architectural issues are discovered
- Issue status changes (Documented → Resolved)
- Implementation details are refined during development
- Post-MVP issues are identified

**Last Updated:** 2025-12-28
**Next Review:** Before Story 1.7 implementation

---

## Appendix: Deep Think Review Summary

**Initial Review Date:** 2025-12-28
**Detailed Review Date:** 2025-12-29
**Reviewer:** Gemini 3 Deep Think (Extended Reasoning Mode)

### Strategic Pivots Made

| Original Plan | Deep Think Recommendation | Status |
|:--------------|:--------------------------|:-------|
| WebSocket Server + MessagePack | `postMessage` + MessagePack + Base64 | ✅ Adopted |
| `sharp` for image quantization | ImageScript (Deno-native) | ✅ Adopted |
| `Math.round(float * 100)` | BigInt for fixed-point | ✅ Adopted |
| AsyncStorage for crash recovery | react-native-mmkv | ✅ Adopted |
| `react-native-static-server` | `file://` with CORS bypass | ✅ Adopted |
| `react-native-video` latest | Pin to v5.2.1 | ✅ Adopted |
| 18-decimal fixed-point | 9-decimal fixed-point | ✅ Adopted |
| `HKAnchoredObjectQuery` | Timestamp-based sync | ✅ Adopted |
| WebView audio | Native audio via `react-native-sound` | ✅ Adopted |
| Phaser `fetch()` for assets | RNFS → Bridge injection | ✅ Adopted |

### Dependencies Updated

| Package | Action | Rationale |
|:--------|:-------|:----------|
| `react-native-video@5.2.1` | **PIN** | RN 0.71.8 compatible |
| `react-native-mmkv` | **ADD** | Synchronous crash-proof storage |
| `@msgpack/msgpack` | **ADD** | Bridge serialization with BigInt |
| `buffer` | **ADD** | Base64 encoding in RN |
| `react-native-sound` | **ADD** | Native audio for low-latency SFX |
| `react-native-fs` | **ADD** | Asset loading for Bridge injection |
| `react-native-static-server` | **REMOVE** | file:// approach is simpler |
| `react-native-tcp-socket` | **REMOVE** | postMessage replaces WebSocket |
| `sharp` | **REMOVE** | Not Deno-compatible |

### Issues Identified by Review

**Initial Review (2025-12-28):**
- **Issue #8:** Android Activity Restart on Orientation Change
- **Issue #9:** Phaser Bundle Serving via file:// CORS Issues
- **Issue #12:** Orientation Lock Failure on Tablets/Foldables

**Detailed Review (2025-12-29):**
- **Issue #13:** BigInt Overflow with 18-Decimal Scale (CRITICAL)
- **Issue #14:** HealthKit "Phantom Permission" Detection
- **Issue #15:** Bridge 60FPS Trap
- **Issue #16:** WebView Audio Latency on Android
- **Issue #17:** iOS file:// Sub-Resource CORS
- **Issue #18:** HealthKit Hydration Gate

### Key Implementation Specifications

**Runware API (Story 1.5):**
```
Base Model: runware:100@1 (SDXL 1.0)
LoRA: civitai:120096@135931 (Pixel Art XL v1.1)
IP-Adapter: runware:105@1 (strength: 0.58)
Output: 1024x1024 → downscale to 128x128
```

**Fixed-Point Math (Story 1.8):**
```
Scale: 10^9 (9 decimals)
100 HP = 100_000_000_000n
MessagePack: { useBigInt64: true }
```

**HealthKit Strategy (Story 1.3):**
```
CMPedometer: 3s polling → UI only
HealthKit: Resume + 10min interval → Economy
```

### References

- [Initial Deep Think Response](../PM%20COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/12-28-%20Google%20Gemini%203%20-%20Deep%20Think%20Response%20To%20PM.md)
- [Follow-Up Response](../PM%20COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/12-28%20-%20Google%20Gemini%203%20Deep%20Think%20-%20PM%20Followup%20Questions%20Response.md)
- [Detailed Implementation Response](../PM%20COPIED%20FILES%20FOR%20DEEP%20THINK/RESPONSE/12-28%20-%20Google%20Gemini%203%20Deep%20Think%20-%20PM%20DETAILED%20Followup%20Questions%20Response.md)
