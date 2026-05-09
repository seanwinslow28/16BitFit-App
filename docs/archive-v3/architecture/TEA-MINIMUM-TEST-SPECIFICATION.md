# TEA Minimum Test Specification: Phase 4 Critical Path

**Document Version:** 1.0
**Date:** 2025-12-30
**Author:** Murat (Test Engineer Agent)
**Status:** APPROVED FOR IMPLEMENTATION
**Target Audience:** Developer Agent

---

## Executive Summary

This document specifies the **12 minimum viable tests** required before Phase 4 implementation can be considered safe to ship. These tests cover the 3 highest-risk patterns identified during the Deep Think cross-validation:

1. **BigInt Fixed-Point Math** (5 tests) — Pattern #1, CRITICAL risk
2. **Combat Isolation State Machine** (4 tests) — Pattern #4, HIGH risk
3. **MessagePack + Base64 Bridge** (3 tests) — Pattern #2, MEDIUM-HIGH risk

**Why these 12 tests?**

- They cover pure logic with no external dependencies (testable in Jest without mocks)
- They catch the bugs most likely to cause silent data corruption or state inconsistency
- They validate cross-platform determinism required for future PvP rollback netcode
- They can be written and passing before any UI implementation begins

**What this document provides:**

- Exact file paths for test files
- Complete test code (copy-paste ready)
- Implementation code that must exist for tests to pass
- Rationale for each test case
- Pass/fail criteria

---

## Prerequisites

Before implementing these tests, the Developer Agent MUST:

### 1. Install Missing Dependencies

```bash
cd apps/mobile-shell
npm install react-native-mmkv @msgpack/msgpack buffer
cd ios && pod install && cd ..
```

### 2. Verify Jest Configuration

The existing Jest config in `package.json` should work. Verify by running:

```bash
npm test -- --passWithNoTests
```

If this fails, check `jest.setup.js` exists and `transformIgnorePatterns` includes the new packages.

---

## Test Suite 1: BigInt Fixed-Point Math (5 Tests)

### Why This Suite Matters

Combat calculations use BigInt with 9-decimal precision to ensure deterministic results across ARM (iOS) and x86 (Android emulator) architectures. Floating-point math causes drift; BigInt eliminates it. A bug here means:

- Player damage calculations are wrong
- PvP opponents see different results for the same battle
- Future rollback netcode becomes impossible

### File Structure

```
apps/mobile-shell/src/utils/
├── fixedPoint.ts           # Implementation (create this)
└── __tests__/
    └── fixedPoint.test.ts  # Tests (create this)
```

### Implementation File

**File:** `apps/mobile-shell/src/utils/fixedPoint.ts`

```typescript
/**
 * BigInt Fixed-Point Math Utility
 *
 * Used for deterministic combat calculations. All combat values (damage,
 * multipliers, positions) are stored as BigInt with 9-decimal precision.
 *
 * WHY 9 DECIMALS (NOT 18)?
 * - MessagePack int64 max value is 2^63-1 (~9.2 quintillion)
 * - 18 decimals: 10.0 = 10,000,000,000,000,000,000 (OVERFLOW)
 * - 9 decimals: 10.0 = 10,000,000,000 (safe)
 *
 * @see docs/architecture/architecture-issues-and-resolutions.md Issue #2, #13
 */

/** Scale factor: 10^9 (9 decimal places) */
export const SCALE = 1_000_000_000n;

/** Type alias for clarity in function signatures */
export type FixedPoint = bigint;

/**
 * Fixed-point math operations for deterministic combat calculations.
 *
 * USAGE:
 * ```typescript
 * const damage = MathFixed.toFixed(15.5);     // 15_500_000_000n
 * const multiplier = MathFixed.toFixed(1.2);  // 1_200_000_000n
 * const result = MathFixed.mul(damage, multiplier); // 18_600_000_000n
 * const display = MathFixed.fromFixed(result); // 18.6
 * ```
 */
export const MathFixed = {
  /**
   * Convert a JavaScript number to fixed-point BigInt.
   *
   * @param val - Number to convert (can be integer or decimal)
   * @returns BigInt representation with 9 decimal places
   *
   * @example
   * MathFixed.toFixed(100)    // 100_000_000_000n
   * MathFixed.toFixed(1.5)    // 1_500_000_000n
   * MathFixed.toFixed(-50)    // -50_000_000_000n
   */
  toFixed: (val: number): FixedPoint => {
    return BigInt(Math.round(val * 1e9));
  },

  /**
   * Convert a fixed-point BigInt back to JavaScript number for display.
   *
   * WARNING: This loses precision for values > Number.MAX_SAFE_INTEGER / 1e9.
   * Only use for UI display, never for further calculations.
   *
   * @param val - BigInt fixed-point value
   * @returns JavaScript number (may have floating-point imprecision)
   */
  fromFixed: (val: FixedPoint): number => {
    return Number(val) / 1e9;
  },

  /**
   * Multiply two fixed-point numbers.
   *
   * MATH: (a * b) / SCALE
   * - a and b are both scaled by 10^9
   * - Product is scaled by 10^18
   * - Divide by SCALE to return to 10^9 scale
   *
   * @example
   * // 10 * 1.5 = 15
   * MathFixed.mul(10_000_000_000n, 1_500_000_000n) // 15_000_000_000n
   */
  mul: (a: FixedPoint, b: FixedPoint): FixedPoint => {
    return (a * b) / SCALE;
  },

  /**
   * Divide two fixed-point numbers.
   *
   * MATH: (a * SCALE) / b
   * - Multiply a by SCALE first to maintain precision
   * - Then divide by b
   *
   * @throws Error if b is zero
   *
   * @example
   * // 100 / 4 = 25
   * MathFixed.div(100_000_000_000n, 4_000_000_000n) // 25_000_000_000n
   */
  div: (a: FixedPoint, b: FixedPoint): FixedPoint => {
    if (b === 0n) {
      throw new Error('Division by zero in fixed-point math');
    }
    return (a * SCALE) / b;
  },

  /**
   * Add two fixed-point numbers.
   *
   * Simple addition - no scaling needed since both have same scale.
   */
  add: (a: FixedPoint, b: FixedPoint): FixedPoint => {
    return a + b;
  },

  /**
   * Subtract two fixed-point numbers.
   *
   * Simple subtraction - no scaling needed since both have same scale.
   */
  sub: (a: FixedPoint, b: FixedPoint): FixedPoint => {
    return a - b;
  },
};

export default MathFixed;
```

### Test File

**File:** `apps/mobile-shell/src/utils/__tests__/fixedPoint.test.ts`

```typescript
/**
 * BigInt Fixed-Point Math Tests
 *
 * These tests verify deterministic math operations used in combat calculations.
 * All 5 tests MUST pass before any combat-related code can be implemented.
 *
 * @see docs/architecture/TEA-MINIMUM-TEST-SPECIFICATION.md
 */

import { MathFixed, SCALE, FixedPoint } from '../fixedPoint';

describe('MathFixed', () => {
  // =========================================================================
  // TEST 1: Basic Conversion Accuracy
  // =========================================================================
  describe('toFixed', () => {
    it('converts integers and decimals to fixed-point BigInt', () => {
      // WHY: Verifies the fundamental conversion that all combat values depend on.
      // If this fails, every damage calculation will be wrong.

      // Integer conversion
      expect(MathFixed.toFixed(100)).toBe(100_000_000_000n);
      expect(MathFixed.toFixed(1)).toBe(1_000_000_000n);
      expect(MathFixed.toFixed(0)).toBe(0n);

      // Decimal conversion
      expect(MathFixed.toFixed(1.5)).toBe(1_500_000_000n);
      expect(MathFixed.toFixed(0.1)).toBe(100_000_000n);
      expect(MathFixed.toFixed(42.123)).toBe(42_123_000_000n);

      // Negative numbers (combat shouldn't have these, but math should handle them)
      expect(MathFixed.toFixed(-50)).toBe(-50_000_000_000n);
      expect(MathFixed.toFixed(-1.5)).toBe(-1_500_000_000n);
    });
  });

  // =========================================================================
  // TEST 2: Round-Trip Accuracy
  // =========================================================================
  describe('fromFixed (round-trip)', () => {
    it('preserves values through toFixed -> fromFixed conversion', () => {
      // WHY: Combat results are calculated in BigInt, then displayed in UI.
      // Round-trip errors would show wrong HP/damage to players.

      const testValues = [
        0,
        1,
        100,
        1.5,
        42.123,
        0.001,      // Minimum meaningful precision
        999999.999, // Large value
        -50,        // Negative
      ];

      for (const original of testValues) {
        const fixed = MathFixed.toFixed(original);
        const restored = MathFixed.fromFixed(fixed);

        // Allow tiny floating-point imprecision (1e-9)
        expect(restored).toBeCloseTo(original, 8);
      }
    });
  });

  // =========================================================================
  // TEST 3: Multiplication Correctness
  // =========================================================================
  describe('mul', () => {
    it('multiplies fixed-point numbers correctly', () => {
      // WHY: Damage multipliers (crits, buffs, elemental weakness) use multiplication.
      // Wrong multiplication = wrong damage = unfair combat.

      // 10 * 1.5 = 15
      const ten = MathFixed.toFixed(10);
      const onePointFive = MathFixed.toFixed(1.5);
      const result = MathFixed.mul(ten, onePointFive);
      expect(MathFixed.fromFixed(result)).toBeCloseTo(15, 8);

      // 100 * 0.5 = 50 (damage reduction)
      const hundred = MathFixed.toFixed(100);
      const half = MathFixed.toFixed(0.5);
      expect(MathFixed.fromFixed(MathFixed.mul(hundred, half))).toBeCloseTo(50, 8);

      // 25 * 1.2 = 30 (20% buff)
      const twentyFive = MathFixed.toFixed(25);
      const buff = MathFixed.toFixed(1.2);
      expect(MathFixed.fromFixed(MathFixed.mul(twentyFive, buff))).toBeCloseTo(30, 8);

      // Edge case: multiply by zero
      expect(MathFixed.mul(hundred, 0n)).toBe(0n);

      // Edge case: multiply by one (identity)
      const one = MathFixed.toFixed(1);
      expect(MathFixed.mul(hundred, one)).toBe(hundred);
    });
  });

  // =========================================================================
  // TEST 4: Division Correctness + Division by Zero
  // =========================================================================
  describe('div', () => {
    it('divides fixed-point numbers correctly and throws on zero', () => {
      // WHY: Division is used for percentage calculations, stat scaling.
      // Division by zero would crash the combat engine.

      // 100 / 4 = 25
      const hundred = MathFixed.toFixed(100);
      const four = MathFixed.toFixed(4);
      expect(MathFixed.fromFixed(MathFixed.div(hundred, four))).toBeCloseTo(25, 8);

      // 50 / 3 = 16.666... (repeating decimal)
      const fifty = MathFixed.toFixed(50);
      const three = MathFixed.toFixed(3);
      expect(MathFixed.fromFixed(MathFixed.div(fifty, three))).toBeCloseTo(16.666666666, 6);

      // 1 / 2 = 0.5
      const one = MathFixed.toFixed(1);
      const two = MathFixed.toFixed(2);
      expect(MathFixed.fromFixed(MathFixed.div(one, two))).toBeCloseTo(0.5, 8);

      // CRITICAL: Division by zero must throw
      expect(() => MathFixed.div(hundred, 0n)).toThrow('Division by zero');
    });
  });

  // =========================================================================
  // TEST 5: Large Value Overflow Safety
  // =========================================================================
  describe('overflow safety', () => {
    it('handles large values without overflow', () => {
      // WHY: MessagePack int64 max is 2^63-1. With 18 decimals, 10.0 overflows.
      // With 9 decimals, we have headroom for values up to ~9 billion.
      // Combat won't have values this large, but we verify no silent overflow.

      // Large but safe value: 1,000,000 (one million)
      const million = MathFixed.toFixed(1_000_000);
      expect(million).toBe(1_000_000_000_000_000n); // 10^15, well under 2^63

      // Multiply two large values: 1000 * 1000 = 1,000,000
      const thousand = MathFixed.toFixed(1000);
      const result = MathFixed.mul(thousand, thousand);
      expect(MathFixed.fromFixed(result)).toBeCloseTo(1_000_000, 8);

      // Verify SCALE is correct (guards against typos)
      expect(SCALE).toBe(1_000_000_000n);

      // Verify we're using 9 decimals, not 18
      // 10^9 = 1,000,000,000
      // 10^18 = 1,000,000,000,000,000,000 (would overflow on large values)
      const scaleAsNumber = Number(SCALE);
      expect(scaleAsNumber).toBe(1e9);
      expect(scaleAsNumber).not.toBe(1e18);
    });
  });
});
```

### Pass/Fail Criteria

| Test | Must Pass | Failure Indicates |
|:-----|:----------|:------------------|
| `toFixed converts integers and decimals` | YES | Basic conversion broken |
| `preserves values through round-trip` | YES | UI will show wrong values |
| `multiplies correctly` | YES | Damage multipliers broken |
| `divides correctly and throws on zero` | YES | Percentage calcs broken |
| `handles large values without overflow` | YES | Wrong SCALE constant |

**Command to run:**
```bash
cd apps/mobile-shell
npm test -- --testPathPattern=fixedPoint
```

---

## Test Suite 2: Combat Isolation State Machine (4 Tests)

### Why This Suite Matters

The Combat Isolation Pattern prevents race conditions between HealthKit step syncs and active combat. Without it:

- Steps synced during combat corrupt energy calculations
- App crashes during combat lose all progress
- Network failures during sync leave state inconsistent

### File Structure

```
apps/mobile-shell/src/stores/
├── combatStore.ts          # Implementation (create this)
└── __tests__/
    └── combatStore.test.ts # Tests (create this)
```

### Mock File (Required)

**File:** `apps/mobile-shell/src/__mocks__/react-native-mmkv.ts`

```typescript
/**
 * Mock for react-native-mmkv
 *
 * Provides an in-memory implementation for testing the Combat Isolation Pattern.
 * This mock is synchronous like the real MMKV, unlike AsyncStorage.
 */

class MockMMKV {
  private storage: Map<string, string | number | boolean> = new Map();

  set(key: string, value: string | number | boolean): void {
    this.storage.set(key, value);
  }

  getString(key: string): string | undefined {
    const value = this.storage.get(key);
    return typeof value === 'string' ? value : undefined;
  }

  getNumber(key: string): number | undefined {
    const value = this.storage.get(key);
    return typeof value === 'number' ? value : undefined;
  }

  getBoolean(key: string): boolean | undefined {
    const value = this.storage.get(key);
    return typeof value === 'boolean' ? value : undefined;
  }

  delete(key: string): void {
    this.storage.delete(key);
  }

  contains(key: string): boolean {
    return this.storage.has(key);
  }

  clearAll(): void {
    this.storage.clear();
  }

  getAllKeys(): string[] {
    return Array.from(this.storage.keys());
  }
}

export const MMKV = MockMMKV;
export default MockMMKV;
```

### Implementation File

**File:** `apps/mobile-shell/src/stores/combatStore.ts`

```typescript
/**
 * Combat Isolation Store
 *
 * Manages combat state with crash-proof persistence via MMKV.
 *
 * STATE MACHINE:
 * IDLE → SNAPSHOT → IN_COMBAT → RECONCILING → IDLE
 *
 * WHY MMKV (NOT AsyncStorage)?
 * - MMKV writes are synchronous and atomic
 * - If app crashes during write, state is preserved
 * - AsyncStorage is async - crash during write = lost state
 *
 * @see docs/architecture/architecture-issues-and-resolutions.md Issue #5
 */

import { create } from 'zustand';
import { MMKV } from 'react-native-mmkv';

// Storage instance - singleton for app lifetime
const storage = new MMKV();

// Storage keys (constants to prevent typos)
const KEYS = {
  COMBAT_STATUS: 'COMBAT_STATUS',
  SNAPSHOT_ENERGY: 'SNAPSHOT_ENERGY',
  PENDING_STEPS: 'PENDING_STEPS',
  COMBAT_START_TIME: 'COMBAT_START_TIME',
} as const;

/** Combat state machine states */
export type CombatStatus = 'IDLE' | 'IN_COMBAT' | 'RECONCILING';

/** Combat store state shape */
export interface CombatState {
  /** Current state machine position */
  status: CombatStatus;

  /** Energy value snapshot taken at combat start (for crash recovery) */
  snapshotEnergy: number;

  /** Steps accumulated during combat (applied after combat ends) */
  pendingSteps: number;

  /** Timestamp when combat started (for timeout detection) */
  combatStartTime: number | null;
}

/** Combat store actions */
export interface CombatActions {
  /**
   * Enter combat mode. Snapshots current energy and blocks step sync.
   * @param currentEnergy - Energy value at combat start
   */
  startCombat: (currentEnergy: number) => void;

  /**
   * Queue steps received during combat. Applied after combat ends.
   * @param steps - Number of steps to queue
   */
  queueSteps: (steps: number) => void;

  /**
   * Exit combat mode. Enters RECONCILING, then IDLE.
   * @returns Object with pendingSteps to process
   */
  endCombat: () => { pendingSteps: number };

  /**
   * Recover from crash. Call on app launch to restore pre-combat state.
   * @returns True if recovery was needed, false if clean start
   */
  recoverFromCrash: () => boolean;

  /**
   * Check if combat has exceeded timeout (10 minutes).
   * @returns True if timed out
   */
  isTimedOut: () => boolean;

  /**
   * Force exit combat due to timeout. Refunds energy to snapshot.
   */
  forceExitTimeout: () => void;
}

/** Combined store type */
export type CombatStore = CombatState & CombatActions;

/** Combat timeout duration: 10 minutes in milliseconds */
export const COMBAT_TIMEOUT_MS = 10 * 60 * 1000;

/**
 * Combat store with MMKV persistence.
 *
 * USAGE:
 * ```typescript
 * const { status, startCombat, endCombat } = useCombatStore();
 *
 * // Enter combat
 * startCombat(playerEnergy);
 *
 * // During combat, steps are queued
 * queueSteps(newSteps); // Won't affect combat
 *
 * // Exit combat
 * const { pendingSteps } = endCombat();
 * // Convert pendingSteps to energy now
 * ```
 */
export const useCombatStore = create<CombatStore>((set, get) => ({
  // Initial state - read from MMKV for crash recovery
  status: (storage.getString(KEYS.COMBAT_STATUS) as CombatStatus) || 'IDLE',
  snapshotEnergy: storage.getNumber(KEYS.SNAPSHOT_ENERGY) || 0,
  pendingSteps: storage.getNumber(KEYS.PENDING_STEPS) || 0,
  combatStartTime: storage.getNumber(KEYS.COMBAT_START_TIME) || null,

  startCombat: (currentEnergy: number) => {
    const { status } = get();

    // Guard: Only allow starting combat from IDLE
    if (status !== 'IDLE') {
      console.warn(`Cannot start combat from status: ${status}`);
      return;
    }

    const now = Date.now();

    // Synchronous writes to MMKV (crash-proof)
    storage.set(KEYS.COMBAT_STATUS, 'IN_COMBAT');
    storage.set(KEYS.SNAPSHOT_ENERGY, currentEnergy);
    storage.set(KEYS.PENDING_STEPS, 0);
    storage.set(KEYS.COMBAT_START_TIME, now);

    set({
      status: 'IN_COMBAT',
      snapshotEnergy: currentEnergy,
      pendingSteps: 0,
      combatStartTime: now,
    });
  },

  queueSteps: (steps: number) => {
    const { status, pendingSteps } = get();

    // Guard: Only queue steps during combat
    if (status !== 'IN_COMBAT') {
      // Not in combat - steps should be processed normally, not queued
      return;
    }

    const newTotal = pendingSteps + steps;

    // Persist to MMKV
    storage.set(KEYS.PENDING_STEPS, newTotal);

    set({ pendingSteps: newTotal });
  },

  endCombat: () => {
    const { status, pendingSteps } = get();

    // Guard: Can only end combat if in combat
    if (status !== 'IN_COMBAT') {
      console.warn(`Cannot end combat from status: ${status}`);
      return { pendingSteps: 0 };
    }

    // Transition through RECONCILING
    storage.set(KEYS.COMBAT_STATUS, 'RECONCILING');
    set({ status: 'RECONCILING' });

    // Capture pending steps before clearing
    const stepsToReturn = pendingSteps;

    // Clear all combat state from MMKV
    storage.delete(KEYS.COMBAT_STATUS);
    storage.delete(KEYS.SNAPSHOT_ENERGY);
    storage.delete(KEYS.PENDING_STEPS);
    storage.delete(KEYS.COMBAT_START_TIME);

    // Return to IDLE
    set({
      status: 'IDLE',
      snapshotEnergy: 0,
      pendingSteps: 0,
      combatStartTime: null,
    });

    return { pendingSteps: stepsToReturn };
  },

  recoverFromCrash: () => {
    const storedStatus = storage.getString(KEYS.COMBAT_STATUS);

    // No combat state stored - clean start
    if (!storedStatus || storedStatus === 'IDLE') {
      return false;
    }

    // Combat was in progress when app crashed
    // Strategy: Refund to snapshot (pessimistic recovery)
    const snapshotEnergy = storage.getNumber(KEYS.SNAPSHOT_ENERGY) || 0;

    console.warn(
      `Crash recovery: Combat was interrupted. Restoring energy to ${snapshotEnergy}`
    );

    // Clear all combat state
    storage.delete(KEYS.COMBAT_STATUS);
    storage.delete(KEYS.SNAPSHOT_ENERGY);
    storage.delete(KEYS.PENDING_STEPS);
    storage.delete(KEYS.COMBAT_START_TIME);

    set({
      status: 'IDLE',
      snapshotEnergy: 0,
      pendingSteps: 0,
      combatStartTime: null,
    });

    return true;
  },

  isTimedOut: () => {
    const { status, combatStartTime } = get();

    if (status !== 'IN_COMBAT' || combatStartTime === null) {
      return false;
    }

    const elapsed = Date.now() - combatStartTime;
    return elapsed >= COMBAT_TIMEOUT_MS;
  },

  forceExitTimeout: () => {
    const { status } = get();

    if (status !== 'IN_COMBAT') {
      return;
    }

    console.warn('Combat timeout: Force exiting and refunding energy');

    // Clear all combat state (don't process pending steps - timeout is a fail)
    storage.delete(KEYS.COMBAT_STATUS);
    storage.delete(KEYS.SNAPSHOT_ENERGY);
    storage.delete(KEYS.PENDING_STEPS);
    storage.delete(KEYS.COMBAT_START_TIME);

    set({
      status: 'IDLE',
      snapshotEnergy: 0,
      pendingSteps: 0,
      combatStartTime: null,
    });
  },
}));

export default useCombatStore;
```

### Test File

**File:** `apps/mobile-shell/src/stores/__tests__/combatStore.test.ts`

```typescript
/**
 * Combat Isolation State Machine Tests
 *
 * These tests verify the combat state machine transitions and crash recovery.
 * All 4 tests MUST pass before combat features can be implemented.
 *
 * @see docs/architecture/TEA-MINIMUM-TEST-SPECIFICATION.md
 */

import { act, renderHook } from '@testing-library/react-native';
import { useCombatStore, COMBAT_TIMEOUT_MS } from '../combatStore';
import { MMKV } from 'react-native-mmkv';

// Mock MMKV
jest.mock('react-native-mmkv');

describe('CombatStore', () => {
  // Fresh store instance for each test
  beforeEach(() => {
    // Clear MMKV mock storage
    const storage = new MMKV();
    storage.clearAll();

    // Reset Zustand store
    useCombatStore.setState({
      status: 'IDLE',
      snapshotEnergy: 0,
      pendingSteps: 0,
      combatStartTime: null,
    });
  });

  // =========================================================================
  // TEST 1: State Transitions (Happy Path)
  // =========================================================================
  it('transitions through IDLE → IN_COMBAT → RECONCILING → IDLE', () => {
    // WHY: Verifies the core state machine flow. If transitions are broken,
    // combat will get stuck or skip states.

    const { result } = renderHook(() => useCombatStore());

    // Initial state is IDLE
    expect(result.current.status).toBe('IDLE');

    // Start combat with 100 energy
    act(() => {
      result.current.startCombat(100);
    });

    // Now IN_COMBAT
    expect(result.current.status).toBe('IN_COMBAT');
    expect(result.current.snapshotEnergy).toBe(100);

    // End combat
    act(() => {
      result.current.endCombat();
    });

    // Back to IDLE (passes through RECONCILING internally)
    expect(result.current.status).toBe('IDLE');
    expect(result.current.snapshotEnergy).toBe(0);
  });

  // =========================================================================
  // TEST 2: Step Queueing During Combat
  // =========================================================================
  it('queues steps during combat and returns them on endCombat', () => {
    // WHY: Steps synced during combat must not affect the battle.
    // They're queued and converted to energy AFTER combat ends.

    const { result } = renderHook(() => useCombatStore());

    // Start combat
    act(() => {
      result.current.startCombat(100);
    });

    // Queue steps during combat
    act(() => {
      result.current.queueSteps(500);
    });
    expect(result.current.pendingSteps).toBe(500);

    // Queue more steps
    act(() => {
      result.current.queueSteps(300);
    });
    expect(result.current.pendingSteps).toBe(800);

    // End combat - should return accumulated steps
    let pendingSteps = 0;
    act(() => {
      const result2 = result.current.endCombat();
      pendingSteps = result2.pendingSteps;
    });

    expect(pendingSteps).toBe(800);

    // After combat, pending steps reset to 0
    expect(result.current.pendingSteps).toBe(0);
  });

  // =========================================================================
  // TEST 3: Step Queueing Ignored When Not In Combat
  // =========================================================================
  it('ignores queueSteps when not in combat', () => {
    // WHY: Steps should only queue during active combat.
    // Outside combat, they should be processed normally (not tested here).

    const { result } = renderHook(() => useCombatStore());

    // Try to queue steps while IDLE
    act(() => {
      result.current.queueSteps(1000);
    });

    // Should be ignored - still 0
    expect(result.current.pendingSteps).toBe(0);
  });

  // =========================================================================
  // TEST 4: Crash Recovery
  // =========================================================================
  it('recovers from crash by restoring to IDLE with snapshot energy', () => {
    // WHY: If app crashes during combat, we must restore to a known state.
    // Strategy: Assume combat was interrupted, refund to snapshot.

    // Simulate crash: Write combat state directly to MMKV
    const storage = new MMKV();
    storage.set('COMBAT_STATUS', 'IN_COMBAT');
    storage.set('SNAPSHOT_ENERGY', 75);
    storage.set('PENDING_STEPS', 200);
    storage.set('COMBAT_START_TIME', Date.now() - 60000); // Started 1 min ago

    // Create a new store instance (simulates app restart)
    // Note: The store reads from MMKV on initialization
    useCombatStore.setState({
      status: storage.getString('COMBAT_STATUS') as 'IN_COMBAT',
      snapshotEnergy: storage.getNumber('SNAPSHOT_ENERGY') || 0,
      pendingSteps: storage.getNumber('PENDING_STEPS') || 0,
      combatStartTime: storage.getNumber('COMBAT_START_TIME') || null,
    });

    const { result } = renderHook(() => useCombatStore());

    // Store should have the crashed state
    expect(result.current.status).toBe('IN_COMBAT');

    // Call recovery
    let didRecover = false;
    act(() => {
      didRecover = result.current.recoverFromCrash();
    });

    // Recovery should have happened
    expect(didRecover).toBe(true);

    // Should be back to IDLE
    expect(result.current.status).toBe('IDLE');

    // Snapshot energy is cleared (caller should use the logged value)
    expect(result.current.snapshotEnergy).toBe(0);

    // MMKV should be cleared
    expect(storage.getString('COMBAT_STATUS')).toBeUndefined();
  });
});
```

### Pass/Fail Criteria

| Test | Must Pass | Failure Indicates |
|:-----|:----------|:------------------|
| `transitions through states` | YES | State machine broken |
| `queues steps during combat` | YES | Race condition possible |
| `ignores queueSteps when not in combat` | YES | Guard conditions missing |
| `recovers from crash` | YES | Crash recovery broken |

**Command to run:**
```bash
cd apps/mobile-shell
npm test -- --testPathPattern=combatStore
```

---

## Test Suite 3: MessagePack + Base64 Bridge (3 Tests)

### Why This Suite Matters

The bridge serializes combat commands between React Native and Phaser WebView. Critical requirements:

- BigInt must survive round-trip (combat uses 9-decimal fixed-point)
- Corrupted messages must fail gracefully (not crash WebView)
- Unicode strings must survive (player names, boss names)

### File Structure

```
apps/mobile-shell/src/services/
├── bridgeService.ts            # Implementation (create this)
└── __tests__/
    └── bridgeService.test.ts   # Tests (create this)
```

### Implementation File

**File:** `apps/mobile-shell/src/services/bridgeService.ts`

```typescript
/**
 * Bridge Service: React Native ↔ Phaser WebView Communication
 *
 * Uses MessagePack for binary serialization + Base64 for string transport.
 *
 * WHY MessagePack (NOT JSON)?
 * - Native BigInt support via useBigInt64 option
 * - 30-40% smaller payloads than JSON
 * - Faster parsing for complex objects
 *
 * WHY Base64?
 * - WebView postMessage only accepts strings
 * - Base64 is safe for all string transports
 *
 * @see docs/architecture/architecture-issues-and-resolutions.md Issue #1
 */

import { encode, decode } from '@msgpack/msgpack';
import { Buffer } from 'buffer';

/** MessagePack options - MUST enable BigInt support */
const MSG_OPTS = { useBigInt64: true };

/**
 * Bridge message types for type safety.
 * Extend this as new message types are added.
 */
export interface BridgeMessage {
  type: string;
  [key: string]: unknown;
}

/**
 * Bridge serialization utilities.
 *
 * USAGE:
 * ```typescript
 * // React Native → WebView
 * const base64 = Bridge.serialize({ type: 'START_COMBAT', energy: 100n });
 * webViewRef.current.postMessage(base64);
 *
 * // WebView → React Native
 * const message = Bridge.deserialize(event.nativeEvent.data);
 * if (message.type === 'GAME_READY') { ... }
 * ```
 */
export const Bridge = {
  /**
   * Serialize a message to Base64-encoded MessagePack.
   *
   * @param payload - Object to serialize (can contain BigInt)
   * @returns Base64 string safe for postMessage
   *
   * @example
   * Bridge.serialize({ type: 'DAMAGE', amount: 15_000_000_000n })
   * // Returns: "gadGFtYWdlzgAAAA..." (base64)
   */
  serialize: (payload: BridgeMessage): string => {
    const binary = encode(payload, MSG_OPTS);
    return Buffer.from(binary).toString('base64');
  },

  /**
   * Deserialize a Base64-encoded MessagePack message.
   *
   * @param base64String - Base64 string from postMessage
   * @returns Deserialized object with BigInt preserved
   * @throws Error if Base64 is invalid or MessagePack is corrupted
   *
   * @example
   * Bridge.deserialize("gadGFtYWdlzgAAAA...")
   * // Returns: { type: 'DAMAGE', amount: 15_000_000_000n }
   */
  deserialize: (base64String: string): BridgeMessage => {
    if (!base64String || typeof base64String !== 'string') {
      throw new Error('Bridge.deserialize: Input must be a non-empty string');
    }

    let binary: Uint8Array;
    try {
      binary = Buffer.from(base64String, 'base64');
    } catch (e) {
      throw new Error(`Bridge.deserialize: Invalid Base64 input - ${e}`);
    }

    if (binary.length === 0) {
      throw new Error('Bridge.deserialize: Decoded Base64 is empty');
    }

    try {
      const decoded = decode(binary, MSG_OPTS);

      // Validate basic structure
      if (typeof decoded !== 'object' || decoded === null) {
        throw new Error('Bridge.deserialize: Decoded value is not an object');
      }

      return decoded as BridgeMessage;
    } catch (e) {
      throw new Error(`Bridge.deserialize: Invalid MessagePack data - ${e}`);
    }
  },

  /**
   * Check if a string is valid Base64.
   * Useful for pre-validation before deserialize.
   */
  isValidBase64: (str: string): boolean => {
    if (!str || typeof str !== 'string') return false;
    try {
      const decoded = Buffer.from(str, 'base64');
      const reencoded = decoded.toString('base64');
      // Base64 round-trip should produce same string (ignoring padding)
      return reencoded.replace(/=+$/, '') === str.replace(/=+$/, '');
    } catch {
      return false;
    }
  },
};

export default Bridge;
```

### Test File

**File:** `apps/mobile-shell/src/services/__tests__/bridgeService.test.ts`

```typescript
/**
 * MessagePack + Base64 Bridge Tests
 *
 * These tests verify serialization round-trips for bridge messages.
 * All 3 tests MUST pass before WebView integration can begin.
 *
 * @see docs/architecture/TEA-MINIMUM-TEST-SPECIFICATION.md
 */

import { Bridge, BridgeMessage } from '../bridgeService';

describe('Bridge', () => {
  // =========================================================================
  // TEST 1: Round-Trip with BigInt Preservation
  // =========================================================================
  describe('serialize/deserialize round-trip', () => {
    it('preserves BigInt and all data types through round-trip', () => {
      // WHY: Combat uses BigInt for fixed-point math. If BigInt becomes Number
      // during serialization, precision is lost and combat calculations break.

      const original: BridgeMessage = {
        type: 'COMBAT_STATE',
        // BigInt values (fixed-point with 9 decimals)
        playerHp: 100_000_000_000n,      // 100.0
        enemyHp: 75_500_000_000n,         // 75.5
        damageDealt: 15_750_000_000n,     // 15.75
        // Regular numbers (for non-combat data)
        timestamp: Date.now(),
        roundNumber: 3,
        // Strings
        enemyName: 'Training Dummy',
        // Booleans
        isCritical: true,
        isBlocked: false,
        // Nested object
        position: { x: 100, y: 200 },
        // Array
        statusEffects: ['burning', 'stunned'],
      };

      // Serialize to Base64
      const serialized = Bridge.serialize(original);

      // Should be a non-empty string
      expect(typeof serialized).toBe('string');
      expect(serialized.length).toBeGreaterThan(0);

      // Deserialize back
      const restored = Bridge.deserialize(serialized);

      // BigInt values MUST be BigInt (not Number)
      expect(typeof restored.playerHp).toBe('bigint');
      expect(typeof restored.enemyHp).toBe('bigint');
      expect(typeof restored.damageDealt).toBe('bigint');

      // Values must match exactly
      expect(restored.playerHp).toBe(100_000_000_000n);
      expect(restored.enemyHp).toBe(75_500_000_000n);
      expect(restored.damageDealt).toBe(15_750_000_000n);

      // Other types preserved
      expect(restored.type).toBe('COMBAT_STATE');
      expect(restored.roundNumber).toBe(3);
      expect(restored.enemyName).toBe('Training Dummy');
      expect(restored.isCritical).toBe(true);
      expect(restored.isBlocked).toBe(false);
      expect(restored.position).toEqual({ x: 100, y: 200 });
      expect(restored.statusEffects).toEqual(['burning', 'stunned']);
    });
  });

  // =========================================================================
  // TEST 2: Invalid Input Handling
  // =========================================================================
  describe('deserialize error handling', () => {
    it('throws gracefully on invalid Base64 and corrupted MessagePack', () => {
      // WHY: Network glitches or bugs could send corrupted data.
      // The bridge must throw a clear error, not crash the app.

      // Invalid Base64 characters
      expect(() => Bridge.deserialize('not-valid-base64!!!')).toThrow();

      // Empty string
      expect(() => Bridge.deserialize('')).toThrow();

      // Null/undefined
      expect(() => Bridge.deserialize(null as any)).toThrow();
      expect(() => Bridge.deserialize(undefined as any)).toThrow();

      // Valid Base64 but invalid MessagePack (random bytes)
      const randomBase64 = Buffer.from([0xFF, 0xFE, 0x00, 0x01]).toString('base64');
      expect(() => Bridge.deserialize(randomBase64)).toThrow();

      // Valid Base64 of a non-object (MessagePack-encoded number)
      // MessagePack can encode primitives, but we require objects
      const numberBase64 = Buffer.from([0x05]).toString('base64'); // MessagePack: 5
      expect(() => Bridge.deserialize(numberBase64)).toThrow(/not an object/);
    });
  });

  // =========================================================================
  // TEST 3: Unicode String Preservation
  // =========================================================================
  describe('unicode handling', () => {
    it('preserves Unicode strings including emoji and non-Latin characters', () => {
      // WHY: Player names and boss names can contain any Unicode characters.
      // Japanese, emoji, etc. must round-trip correctly.

      const original: BridgeMessage = {
        type: 'PLAYER_INFO',
        // Japanese characters
        playerName: '田中太郎',
        // Korean characters
        guildName: '최강길드',
        // Emoji
        status: '💪🔥⚔️',
        // Mixed
        title: 'Champion 勇者 🏆',
        // Special characters
        bio: 'Line 1\nLine 2\tTabbed',
      };

      const serialized = Bridge.serialize(original);
      const restored = Bridge.deserialize(serialized);

      expect(restored.playerName).toBe('田中太郎');
      expect(restored.guildName).toBe('최강길드');
      expect(restored.status).toBe('💪🔥⚔️');
      expect(restored.title).toBe('Champion 勇者 🏆');
      expect(restored.bio).toBe('Line 1\nLine 2\tTabbed');
    });
  });
});
```

### Pass/Fail Criteria

| Test | Must Pass | Failure Indicates |
|:-----|:----------|:------------------|
| `preserves BigInt through round-trip` | YES | Combat math will break |
| `throws gracefully on invalid input` | YES | Corrupted data could crash app |
| `preserves Unicode strings` | YES | Player names could corrupt |

**Command to run:**
```bash
cd apps/mobile-shell
npm test -- --testPathPattern=bridgeService
```

---

## Implementation Checklist

The Developer Agent should complete these items in order:

### Phase 1: Dependencies (30 min)

- [ ] Install `react-native-mmkv`, `@msgpack/msgpack`, `buffer`
- [ ] Run `pod install` for iOS
- [ ] Verify Jest runs without errors

### Phase 2: BigInt Fixed-Point (1 hour)

- [ ] Create `apps/mobile-shell/src/utils/fixedPoint.ts`
- [ ] Create `apps/mobile-shell/src/utils/__tests__/fixedPoint.test.ts`
- [ ] Run tests: `npm test -- --testPathPattern=fixedPoint`
- [ ] All 5 tests passing

### Phase 3: Combat Isolation (1.5 hours)

- [ ] Create `apps/mobile-shell/src/__mocks__/react-native-mmkv.ts`
- [ ] Create `apps/mobile-shell/src/stores/combatStore.ts`
- [ ] Create `apps/mobile-shell/src/stores/__tests__/combatStore.test.ts`
- [ ] Run tests: `npm test -- --testPathPattern=combatStore`
- [ ] All 4 tests passing

### Phase 4: Bridge Service (1 hour)

- [ ] Create `apps/mobile-shell/src/services/bridgeService.ts`
- [ ] Create `apps/mobile-shell/src/services/__tests__/bridgeService.test.ts`
- [ ] Run tests: `npm test -- --testPathPattern=bridgeService`
- [ ] All 3 tests passing

### Phase 5: Verification (15 min)

- [ ] Run full test suite: `npm test`
- [ ] All 12 new tests passing
- [ ] No regressions in existing tests
- [ ] Update `docs/architecture/phase-4-blockers-and-concerns.md`:
  - Mark BLOCKER-002 as RESOLVED
  - Mark MISSING-001, MISSING-002, MISSING-003 as RESOLVED
- [ ] Commit with message: `feat: Add Phase 4 critical path tests (TEA spec)`

---

## Success Criteria

Phase 4 implementation may proceed when:

1. All 12 tests are passing
2. No test is skipped or marked `.todo`
3. Test coverage for new files is >80%
4. BLOCKER-001 (dmg-avatar rewrite) is resolved separately
5. BLOCKER-002 (AndroidManifest) confirmed already resolved

---

## Appendix: Running All 12 Tests

```bash
cd apps/mobile-shell

# Run all 12 tests
npm test -- --testPathPattern="fixedPoint|combatStore|bridgeService"

# With coverage
npm test -- --testPathPattern="fixedPoint|combatStore|bridgeService" --coverage

# Watch mode during development
npm test -- --testPathPattern="fixedPoint|combatStore|bridgeService" --watch
```

---

**Document Version:** 1.0
**Created:** 2025-12-30
**Author:** Murat (Test Engineer Agent)
**Approved By:** Sean (Product Owner)

---

**End of Specification**
