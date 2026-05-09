# **Testing Strategy**

## **Testing Pyramid**

Manual QA \> E2E (Detox/Maestro) \> Integration (RNTL / SuperDeno) \> Unit (Jest / Deno / pgTAP).

## **Test Organization**

Tests co-located or in dedicated folders within apps and packages. E2E tests likely in apps/mobile-shell/e2e/. PG Function tests (\*.test.sql) alongside migrations.

### **Frontend Tests (React Native Shell)**

Jest \+ RNTL for unit/integration tests (\*.test.tsx).

### **Backend Tests (Supabase Edge Functions)**

Deno Testing \+ SuperDeno for unit/integration tests (\*.test.ts).

### **Backend Tests (PostgreSQL Functions)**

pgTAP for unit testing PL/pgSQL functions within migrations (\*.test.sql).

### **E2E Tests**

Detox or Maestro for critical user flows (\*.test.ts).

## **Test Examples**

(Conceptual templates provided previously for RN Component, Edge Function, E2E flow). PG function tests would use pgTAP syntax.

---

## **Avatar Generation Pipeline Tests**

**Added:** 2025-12-31
**Source:** `docs/architecture/avatar-generation-implementation-spec.md` Part 8 + Gemini Deep Think Response Section C

The avatar generation pipeline requires specialized testing due to its AI + deterministic processing architecture and demographic bias risks.

### **Unit Tests (Jest / Deno)**

| Test ID | Component | Description | Pass Criteria |
|---------|-----------|-------------|---------------|
| `AVATAR-U01` | `clahe.ts` | CLAHE produces valid grayscale output | Output image has single channel values 0-255; no RGB drift |
| `AVATAR-U02` | `applyBayerDither()` | Bayer dither produces exactly 4 colors | `Set(outputPixels).size === 4` and all values ∈ `[0x0F380FFF, 0x306230FF, 0x8BAC0FFF, 0x9BBC0FFF]` |
| `AVATAR-U03` | Palette quantization | Quantization thresholds map correctly | Luminance 0-63 → darkest, 64-127 → dark, 128-191 → light, 192-255 → lightest |
| `AVATAR-U04` | TaskUUID parsing | Edge cases handled gracefully | `"uuid_accuracy"` → `["uuid", "accuracy"]`; `"uuid-with-dashes_retro"` → `["uuid-with-dashes", "retro"]`; `"malformed"` → error thrown |
| `AVATAR-U05` | Contrast stretch | Histogram normalization stretches range | Input: min=50, max=200 → Output: min≈0, max≈255 |
| `AVATAR-U06` | Bayer matrix application | Dither noise correctly applied | Verify `BAYER[y%4][x%4]` indexing; spread factor 45 produces expected noise range |

### **Integration Tests (SuperDeno / RNTL)**

| Test ID | Flow | Description | Pass Criteria |
|---------|------|-------------|---------------|
| `AVATAR-I01` | Preprocessing | ControlNet Canny preprocessing returns valid map | Response contains `guideImageUUID` and `guideImageURL`; URL resolves to valid image |
| `AVATAR-I02` | Webhook dispatch | Async generation webhook fires correctly | Runware receives webhook URL; mock server receives callback within 60s |
| `AVATAR-I03` | Post-processing chain | Full chain: download → resize → CLAHE → dither → encode | Output PNG is exactly 128×128, contains exactly 4 DMG palette colors |
| `AVATAR-I04` | Storage upload | Processed avatar uploads to `avatars` bucket | `supabase.storage.from('avatars').getPublicUrl()` returns valid URL |
| `AVATAR-I05` | Database update | Webhook updates correct columns | After webhook: `url_accuracy` OR `url_retro` is non-null; `status` updates to `'complete'` when both populated |
| `AVATAR-I06` | Realtime notifications | Client receives Realtime update | Subscribe to `avatars:id=eq.{jobId}` receives `UPDATE` event within 5s of DB write |
| `AVATAR-I07` | Error propagation | AI failure triggers correct fallback | Mock Runware 500 → Edge function marks `status: 'failed'`, `error_message` populated |
| `AVATAR-I08` | Concurrent webhooks | Both variants arriving simultaneously | Race condition test: both webhooks arrive within 100ms → both URLs saved, `status: 'complete'` |

### **Demographic Testing Matrix (Manual + Automated)**

**Risk Context:** The 4-color DMG palette combined with CLAHE + Bayer dithering creates algorithmic bias risks:
- **Dark skin tones:** Can be "crushed" entirely to `#0F380F` (darkest), resulting in silhouette-only output
- **Pale skin tones:** Can "wash out" to `#9BBC0F` (lightest), losing facial feature definition
- **Accessories:** ControlNet must capture outlines for glasses, hijab, etc.

**Test Corpus Requirements:** N=20 minimum across 4 categories

| Category | Count | Description | Pass Criteria |
|----------|-------|-------------|---------------|
| **Fitzpatrick V-VI (Dark skin)** | 5 | Subjects with dark skin tones | Face region contains ≥2 distinct palette colors (not silhouette-only) |
| **Fitzpatrick I-II (Pale skin)** | 5 | Subjects with very light skin tones | Nose and brows remain visually distinct from surrounding skin tone |
| **Accessories** | 5 | Subjects with glasses, hijab, headwear | ControlNet Canny map captures accessory outline; accessory visible in final output |
| **Challenging Lighting** | 5 | Side-lit, low light, backlit photos | Post-CLAHE histogram spread >15% (not compressed to <3 colors) |

**Test Execution:**

1. **Automated pixel analysis:** Script analyzes output images for color distribution per region
2. **Visual inspection:** Human reviewer confirms facial features are recognizable
3. **Histogram analysis:** Verify CLAHE is expanding dynamic range before dither

**Test Data Location:** `tests/fixtures/demographic-corpus/` (to be created)

**Failure Escalation:** Any demographic test failure is **P0 blocker** for production release.

### **Performance Benchmarks**

| Metric | Target | Measurement |
|--------|--------|-------------|
| Preprocessing (Canny) | <2s | Runware API response time |
| Full generation (per variant) | <8s | Webhook arrival time from dispatch |
| Post-processing chain | <500ms | Edge function execution time |
| End-to-end (client perception) | <20s | Photo capture to "Draft Pick" display |

### **Edge Function Test Examples**

```typescript
// supabase/functions/generate-avatar/__tests__/clahe.test.ts
import { assertEquals } from "https://deno.land/std@0.168.0/testing/asserts.ts";
import { applyCLAHE } from "../utils/clahe.ts";
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

Deno.test("AVATAR-U01: CLAHE produces valid grayscale output", async () => {
  // Create test image with known values
  const img = new Image(128, 128);
  for (let i = 0; i < 128 * 128; i++) {
    img.bitmap[i * 4] = 100;     // R
    img.bitmap[i * 4 + 1] = 150; // G
    img.bitmap[i * 4 + 2] = 200; // B
    img.bitmap[i * 4 + 3] = 255; // A
  }

  const result = applyCLAHE(img, 2.0, 8);

  // Verify output is grayscale (R === G === B)
  for (let i = 0; i < 128 * 128; i++) {
    const r = result.bitmap[i * 4];
    const g = result.bitmap[i * 4 + 1];
    const b = result.bitmap[i * 4 + 2];
    assertEquals(r, g, `Pixel ${i}: R !== G`);
    assertEquals(g, b, `Pixel ${i}: G !== B`);
  }
});

Deno.test("AVATAR-U02: Bayer dither produces exactly 4 DMG colors", async () => {
  const PALETTE = new Set([0x0F380FFF, 0x306230FF, 0x8BAC0FFF, 0x9BBC0FFF]);

  // ... apply dithering to test image ...

  const outputColors = new Set<number>();
  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      outputColors.add(img.getPixelAt(x, y));
    }
  }

  assertEquals(outputColors.size, 4, "Output should have exactly 4 colors");
  for (const color of outputColors) {
    assertEquals(PALETTE.has(color), true, `Invalid color: ${color.toString(16)}`);
  }
});

Deno.test("AVATAR-U04: TaskUUID parsing handles edge cases", () => {
  // Valid cases
  assertEquals("uuid123_accuracy".split("_"), ["uuid123", "accuracy"]);
  assertEquals("uuid-with-dashes_retro".split("_"), ["uuid-with-dashes", "retro"]);

  // Edge case: underscore in UUID (should split on LAST underscore)
  const malformed = "uuid_with_underscore_accuracy";
  const parts = malformed.split("_");
  const variant = parts.pop();
  const jobId = parts.join("_");
  assertEquals(jobId, "uuid_with_underscore");
  assertEquals(variant, "accuracy");
});
```

### **React Native Test Examples**

```typescript
// apps/mobile-shell/src/hooks/__tests__/useAvatarGeneration.test.ts
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAvatarGeneration } from '../useAvatarGeneration';

describe('useAvatarGeneration', () => {
  it('AVATAR-I06: receives Realtime updates', async () => {
    const { result } = renderHook(() => useAvatarGeneration());

    await act(async () => {
      await result.current.startGeneration('file:///test-photo.jpg');
    });

    // Simulate Realtime update
    await waitFor(() => {
      expect(result.current.status).toBe('generating');
    }, { timeout: 5000 });

    // Verify Realtime subscription is active
    expect(result.current.jobId).toBeTruthy();
  });

  it('handles error states correctly', async () => {
    // Mock Supabase to return error
    const { result } = renderHook(() => useAvatarGeneration());

    await act(async () => {
      await result.current.startGeneration('file:///invalid.jpg');
    });

    expect(result.current.status).toBe('error');
    expect(result.current.error).toBeTruthy();
  });
});
```

---

## **Change Log**

| Date | Change | Author |
|------|--------|--------|
| 2025-12-31 | Added Avatar Generation Pipeline Tests section with unit tests, integration tests, demographic testing matrix, and performance benchmarks | TEA (Murat) |
