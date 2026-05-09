# Test Engineer Agent Handoff: Phase 4 Testing Strategy

**Document Version:** 1.0
**Date:** 2025-12-29
**Author:** Amelia (Developer Agent)
**Handoff From:** Developer Agent Feasibility Review
**Handoff To:** TEA (Test Engineer Agent)
**Status:** READY FOR TEA REVIEW

---

## Context & Background

### Source of This Work

This handoff originates from a **Gemini 3 Deep Think cross-validation workflow** that reviewed 16BitFit V3's Phase 4 architecture. The workflow involved:

1. **PM Context Package:** PRD, architecture docs, and story files were compiled
2. **Gemini 3 Deep Think:** Extended reasoning mode reviewed and identified critical pivots
3. **Follow-Up Clarifications:** Detailed questions were answered for ambiguous areas
4. **Developer Review:** Developer Agent assessed feasibility, estimated complexity, identified blockers
5. **TEA Handoff:** You are now receiving this for test strategy development

### What Changed

Deep Think identified **18 architectural issues** and recommended **6 critical pivots** that affect implementation patterns. All story files have been updated with "Deep Think Additions" sections containing exact code patterns.

### Your Role

As the Test Engineer Agent, your responsibilities are:

1. **Review documented edge cases** from Deep Think analysis
2. **Identify gaps in test coverage** for the 6 critical patterns
3. **Recommend a testing strategy** covering unit, integration, and visual testing
4. **Validate the blockers** identified by Developer Agent are addressed before implementation
5. **Create test specifications** for critical paths

---

## Required Reading (In This Order)

### 1. Deep Think Implementation Guide (5 min)

**File:** `docs/architecture/deep-think-implementation-guide.md`

This is the consolidated summary of all Deep Think findings. Contains:
- Executive summary of 6 critical pivots
- Quick reference checklist
- Code patterns for each area
- File references for deeper reading

**Key sections to focus on:**
- Section 1: Avatar Generation Pipeline (Runware + Bayer dithering)
- Section 2: HealthKit Integration (Dual-source pattern)
- Section 3: WebView Bridge (MessagePack + Base64)
- Section 4: Combat Mechanics (BigInt fixed-point math)

---

### 2. Architecture Issues & Resolutions (15 min)

**File:** `docs/architecture/architecture-issues-and-resolutions.md`

Version 1.2 - Updated 2025-12-29. Contains all 18 identified issues with resolutions.

**Pay special attention to these issues:**

| Issue # | Lines | Topic | Testing Implications |
|:--------|:------|:------|:---------------------|
| #2 | 103-193 | BigInt 9-decimal fixed-point | Math edge cases, overflow |
| #5 | 359-471 | Combat Isolation Pattern | State machine transitions, crash recovery |
| #13 | 832-861 | BigInt overflow warning | MessagePack int64 limits |
| #14 | 865-909 | HealthKit phantom permission | Permission state detection |
| #15 | 913-961 | Bridge 60FPS trap | Message frequency limits |
| #16 | 965-1006 | WebView audio latency | Native audio latency measurement |
| #17 | 1010-1068 | iOS file:// CORS | Asset injection verification |
| #18 | 1072-1122 | Hydration Gate | Loading state transitions |

---

### 3. Phase 4 Blockers & Concerns (10 min)

**File:** `docs/architecture/phase-4-blockers-and-concerns.md`

Created by Developer Agent during feasibility review. Contains:
- 2 BLOCKERS that must be resolved before implementation
- 5 MISSING dependencies that must be installed
- 5 CONCERNS that require monitoring during implementation
- Pre-implementation checklist

**Critical blockers to validate:**
- BLOCKER-001: dmg-avatar Edge Function outdated (Story 1.5)
- BLOCKER-002: AndroidManifest missing configChanges (Story 1.7)

---

### 4. Updated Story Files (20 min)

Each story has a **"Deep Think Additions"** section with implementation patterns. Read these sections carefully:

| Story | File | Deep Think Section | Key Patterns to Test |
|:------|:-----|:-------------------|:---------------------|
| 1.3 | `docs/stories/1.3.healthkit-integration.story.md` | Lines 141-293 | Dual-source pattern, phantom permission detection, hydration gate |
| 1.5 | `docs/stories/1.5.avatar-generation.story.md` | Lines 91-243 | Runware API payload, IP-Adapter weight, Bayer dithering algorithm |
| 1.7 | `docs/stories/1.7.webview-bridge.story.md` | Lines 382-616 | GAME_READY handshake, RNFS injection, native audio, 60FPS trap |
| 1.8 | `docs/stories/1.8.combat-mechanics.story.md` | Lines 410-535 | BigInt MathFixed, MessagePack serialization, combat isolation |

---

### 5. Original Deep Think Responses (Optional - 30 min)

**Folder:** `docs/PM COPIED FILES FOR DEEP THINK/RESPONSE/`

Read these if you need full context on why decisions were made:

1. `12-28- Google Gemini 3 - Deep Think Response To PM.md` — Initial review
2. `12-28 - Google Gemini 3 Deep Think - PM Followup Questions Response.md` — LoRA decision, IP-Adapter clarifications
3. `12-28 - Google Gemini 3 Deep Think - PM DETAILED Followup Questions Response.md` — Exact API payloads, Bayer code, BigInt overflow warning

---

### 6. Existing Codebase (10 min)

Review these files to understand current test patterns:

**Existing Tests:**
- `apps/mobile-shell/src/screens/__tests__/HomeScreen.test.tsx`
- `apps/mobile-shell/src/screens/onboarding/__tests__/OnboardingContext.test.tsx`
- `apps/mobile-shell/src/design-system/__tests__/tokens.test.ts`

**Services to Test:**
- `apps/mobile-shell/src/services/authService.ts` — Pattern for service tests
- `apps/mobile-shell/src/services/avatarService.ts` — Needs tests for Runware integration
- `apps/mobile-shell/src/services/imageService.ts` — Has test file, verify coverage

**Edge Function to Test:**
- `supabase/functions/dmg-avatar/index.ts` — Needs complete rewrite + tests

---

## Critical Patterns Requiring Test Strategy

### Pattern 1: BigInt Fixed-Point Math (Story 1.8)

**Code Location:** To be created at `apps/mobile-shell/src/utils/fixedPoint.ts`

**Pattern:**
```typescript
const SCALE = 1_000_000_000n; // 10^9

export const MathFixed = {
  toFixed: (val: number): bigint => BigInt(Math.round(val * 1e9)),
  fromFixed: (val: bigint): number => Number(val) / 1e9,
  mul: (a: bigint, b: bigint): bigint => (a * b) / SCALE,
  div: (a: bigint, b: bigint): bigint => (a * SCALE) / b,
};
```

**Edge Cases to Test:**
- [ ] Conversion accuracy: `toFixed(1.5)` → `1_500_000_000n`
- [ ] Multiplication: `mul(toFixed(10), toFixed(1.5))` → `15_000_000_000n`
- [ ] Division: `div(toFixed(100), toFixed(4))` → `25_000_000_000n`
- [ ] Division by zero: Should throw or return specific value?
- [ ] Negative numbers: Combat shouldn't have negative damage, but test anyway
- [ ] Maximum safe value: `9_000_000_000n * 9_000_000_000n` should not overflow
- [ ] Precision loss: `toFixed(0.123456789)` → verify 9 decimals preserved
- [ ] Round-trip: `fromFixed(toFixed(val))` ≈ `val` for all typical combat values

**Testing Approach:**
- **Unit tests** with Jest
- **Property-based tests** (optional) with fast-check for mathematical invariants
- **Determinism tests**: Same inputs on ARM vs x86 must produce identical outputs

---

### Pattern 2: MessagePack + Base64 Bridge (Story 1.7, 1.8)

**Code Location:** To be created at `apps/mobile-shell/src/services/bridgeService.ts`

**Pattern:**
```typescript
import { encode, decode } from '@msgpack/msgpack';
import { Buffer } from 'buffer';

const MSG_OPTS = { useBigInt64: true };

export const Bridge = {
  serialize: (payload: any): string => {
    const binary = encode(payload, MSG_OPTS);
    return Buffer.from(binary).toString('base64');
  },
  deserialize: (base64String: string): any => {
    const binary = Buffer.from(base64String, 'base64');
    return decode(binary, MSG_OPTS);
  },
};
```

**Edge Cases to Test:**
- [ ] Round-trip: `deserialize(serialize(obj))` === `obj` for all types
- [ ] BigInt preservation: Serialize `{ hp: 100_000_000_000n }`, verify BigInt on deserialize
- [ ] Empty payload: `serialize({})` should work
- [ ] Large payload: 10KB message should serialize/deserialize correctly
- [ ] Invalid Base64: `deserialize('not-valid-base64')` should throw gracefully
- [ ] Corrupted MessagePack: Invalid binary should throw gracefully
- [ ] Unicode strings: Ensure UTF-8 handling is correct
- [ ] Nested objects: Deep nesting should serialize correctly

**Testing Approach:**
- **Unit tests** for serialize/deserialize functions
- **Integration tests** with mock WebView (verify postMessage receives correct format)
- **Benchmark tests** (optional): Compare MessagePack vs JSON for typical message sizes

---

### Pattern 3: Bayer Dithering (Story 1.5)

**Code Location:** To be created at `supabase/functions/dmg-avatar/dither.ts`

**Pattern:**
```typescript
const PALETTE = [
  [15, 56, 15], [48, 98, 48], [139, 172, 15], [155, 188, 15]
];
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

export function applyDmgDither(image: Image): void {
  // ... Bayer dithering algorithm
}
```

**Edge Cases to Test:**
- [ ] Output colors: Every pixel must be one of 4 DMG palette colors
- [ ] Transparent pixels: Alpha < 128 should be skipped (or handled consistently)
- [ ] Small images: 1x1, 2x2, 4x4 images should process correctly
- [ ] Large images: 1024x1024 should process without timeout (< 5s)
- [ ] Non-square images: Should resize/crop correctly before dithering
- [ ] Pure black input: Should produce mostly darkest palette color
- [ ] Pure white input: Should produce mostly lightest palette color
- [ ] Gradient input: Should show characteristic Bayer checkerboard pattern

**Testing Approach:**
- **Unit tests** for palette color validation (every output pixel in PALETTE)
- **Visual regression tests**: Compare output against known-good reference images
- **Performance tests**: Measure processing time for various input sizes
- **Edge Function integration test**: Deploy and call with real image

---

### Pattern 4: Combat Isolation State Machine (Story 1.8)

**Code Location:** To be created in `apps/mobile-shell/src/stores/combatStore.ts`

**State Machine:**
```
IDLE → SNAPSHOT → IN_COMBAT → RECONCILING → IDLE
```

**Edge Cases to Test:**
- [ ] Happy path: IDLE → enterCombat() → IN_COMBAT → exitCombat() → IDLE
- [ ] Step sync during combat: Steps should queue, not apply immediately
- [ ] Crash recovery: MMKV has COMBAT_STATUS on launch → restore to pre-combat state
- [ ] Combat timeout: 10 minutes elapsed → auto-exit with energy reconciliation
- [ ] Double enterCombat: Should be idempotent or throw
- [ ] exitCombat when not in combat: Should be no-op or throw
- [ ] Pending steps applied after combat: Verify queued steps convert to energy
- [ ] Network failure during reconciliation: Should queue for retry

**Testing Approach:**
- **Unit tests** for state transitions
- **Integration tests** for MMKV persistence (mock MMKV or use actual)
- **Timeout tests** using Jest fake timers
- **Crash simulation**: Write COMBAT_STATUS to MMKV, then test recovery on "app launch"

---

### Pattern 5: GAME_READY Handshake (Story 1.7)

**Code Location:** `apps/mobile-shell/src/screens/BattleScreen.tsx` and `apps/game-engine/src/scenes/PreloadScene.ts`

**Pattern:**
```typescript
// React Native waits for Phaser to signal ready
await bridgeService.waitFor('GAME_READY', 5000);
```

**Edge Cases to Test:**
- [ ] Happy path: GAME_READY received within timeout → proceed
- [ ] Timeout: GAME_READY not received within 5s → error handling
- [ ] Multiple GAME_READY: Receiving twice should be idempotent
- [ ] Commands before GAME_READY: Should be queued or rejected
- [ ] WebView crash: Never sends GAME_READY → proper error state

**Testing Approach:**
- **Unit tests** for waitFor timeout behavior
- **Integration tests** with mock WebView emitting GAME_READY at various timings
- **Error handling tests**: Verify UI shows appropriate error on timeout

---

### Pattern 6: HealthKit Phantom Permission (Story 1.3)

**Code Location:** `apps/mobile-shell/src/services/health/healthServiceImpl.ios.ts`

**Pattern:**
```typescript
const checkHealthKitPermission = async (): Promise<'granted' | 'denied' | 'notDetermined'> => {
  return new Promise((resolve) => {
    AppleHealthKit.getAuthStatus({ ... }, (err, results) => {
      const status = results.permissions.read.StepCount;
      resolve(status === 2 ? 'granted' : status === 1 ? 'denied' : 'notDetermined');
    });
  });
};
```

**Edge Cases to Test:**
- [ ] Permission granted: Returns 'granted', queries return real data
- [ ] Permission denied: Returns 'denied', does NOT query (would get misleading 0)
- [ ] Permission not requested: Returns 'notDetermined', prompts user
- [ ] HealthKit unavailable: Simulator without HealthKit → graceful fallback
- [ ] Permission revoked: Was granted, now denied → detect and handle

**Testing Approach:**
- **Unit tests** with mocked AppleHealthKit module
- **Manual testing** on physical device (simulator doesn't support HealthKit)
- **State machine tests**: Verify Tier transitions (1 → 2 → 3)

---

### Pattern 7: Hydration Gate (Story 1.3, 1.7)

**Code Location:** `apps/mobile-shell/src/screens/home/HomeScreen.tsx`

**Pattern:**
```typescript
if (!isHydrated || !isHealthKitReady) {
  return <LoadingSpinner message="Syncing Pedometer..." />;
}
return <GameBoyShell>...</GameBoyShell>;
```

**Edge Cases to Test:**
- [ ] Fast sync: HealthKit responds in 100ms → brief loading, then content
- [ ] Slow sync: HealthKit responds in 2s → loading visible, then content
- [ ] Timeout: HealthKit never responds → proceed with cached/default after 3s
- [ ] Error during sync: Should not block indefinitely
- [ ] Race condition: Multiple syncs in flight → should coalesce

**Testing Approach:**
- **Unit tests** with mocked health store
- **Snapshot tests** for loading state UI
- **Timeout tests** using Jest fake timers

---

## Test Infrastructure Requirements

### Unit Testing
- **Framework:** Jest (already configured in `apps/mobile-shell/package.json`)
- **Mocking:** Jest mock functions for external services
- **Coverage target:** 80% for new code (consistent with CLAUDE.md)

### Integration Testing
- **WebView mocking:** Create mock for `react-native-webview` that simulates postMessage
- **MMKV mocking:** Create mock for `react-native-mmkv` or use actual in test environment
- **Edge Function testing:** Use Supabase CLI for local function testing

### Visual/Regression Testing
- **Dithering output:** Compare PNG output hash against reference images
- **Consider:** Percy, Chromatic, or manual snapshot comparison

### Performance Testing
- **Bridge latency:** Measure round-trip time (target: < 50ms)
- **Dithering speed:** Measure processing time (target: < 200ms for 1024x1024)
- **Combat frame rate:** Verify 60fps maintained (manual testing on device)

---

## Expected Deliverables from TEA

### 1. Test Coverage Analysis

For each of the 7 patterns above, identify:
- Current test coverage (if any exists)
- Required test cases (minimum viable)
- Optional test cases (nice-to-have)
- Testing approach (unit/integration/manual)

### 2. Test Specification Document

Create specifications for critical tests:
- Test name
- Input/setup
- Expected output/behavior
- Edge cases covered

### 3. Test Infrastructure Recommendations

- Mock requirements (which modules need mocks)
- Test data fixtures (sample images, combat states, etc.)
- CI/CD integration (where tests should run)

### 4. Blocker Validation

Confirm that the 2 blockers in `phase-4-blockers-and-concerns.md` are valid:
- BLOCKER-001: Verify dmg-avatar Edge Function is indeed missing IP-Adapter + dithering
- BLOCKER-002: Verify AndroidManifest needs configChanges

### 5. Risk Assessment

Rank the 7 patterns by testing risk:
- Which patterns are most likely to have bugs?
- Which patterns have the hardest-to-test edge cases?
- What's the minimum testing needed to ship safely?

---

## Questions for TEA to Answer

1. **Coverage gaps:** What edge cases are NOT covered by the proposed tests?
2. **Mock strategy:** How should we mock the WebView for bridge testing?
3. **Visual testing:** Is automated visual regression testing worth the setup cost for Bayer dithering, or is manual verification sufficient for MVP?
4. **Performance baselines:** What metrics should we capture before/after implementation?
5. **CI integration:** Should all tests run on every PR, or should some (e.g., Edge Function) run only on specific paths?

---

## Handoff Confirmation

**From:** Amelia (Developer Agent)
**To:** TEA (Test Engineer Agent)
**Date:** 2025-12-29

**Summary:**
- 7 critical patterns identified requiring test strategy
- 2 blockers documented that must be resolved before implementation
- 5 missing dependencies that must be installed
- Deep Think analysis provides exact code patterns and edge cases
- All documentation is updated and ready for review

**Next Steps After TEA Review:**
1. TEA produces test specification document
2. PM reviews and approves test strategy
3. Developer Agent resolves blockers (dmg-avatar rewrite, AndroidManifest fix)
4. Dependencies installed
5. Phase 4 implementation begins with Story 1.7 (WebView Bridge)

---

**End of Handoff Document**
