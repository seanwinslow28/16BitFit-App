# Tech Stack

**Document Version:** 1.2
**Last Updated:** 2025-12-31
**Last Review:** BMAD Party Mode + Gemini Deep Think (2025-12-31)

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-12-31 | 1.2 | Updated AI (Avatar Gen) to Runware API with specific model IDs. Added AI Models section with Tri-Signal pipeline details. Expanded ImageScript documentation for CLAHE/dithering. |
| 2025-12-28 | 1.1 | Deep Think review: MessagePack pivot, MMKV addition, video pinning |
| 2025-10-XX | 1.0 | Initial tech stack document |

---

## Cloud Infrastructure

* **Provider:** Supabase
* **Key Services:** PostgreSQL Database, Realtime Subscriptions (Broadcast), Authentication, Edge Functions (Deno), PostgreSQL Functions (PL/pgSQL), Storage
* **Deployment Regions:** TBD (Likely US East/West for NA Launch)

---

## Technology Stack Table

| Category | Technology | Version | Purpose | Rationale |
| :---- | :---- | :---- | :---- | :---- |
| Frontend Language | TypeScript | ~5.x.x | Type safety, developer experience for RN | Standard for modern RN; enables shared types. |
| Frontend Framework | React Native | ~0.71.8 | Cross-platform mobile shell | Core tech from V2, proven viable; specific version for stability. |
| UI Components | Custom System | N/A | "Modern Retro Fusion" aesthetic | Required by UI Spec; ensures unique branding. |
| State Management | Zustand | ~4.x.x | Simple, lightweight global state for RN shell | Simplicity aligns with "strategic simplicity". |
| Routing | React Navigation | ~6.x.x | Navigation within the RN shell | Standard and robust navigation solution for React Native. |
| Animation | Reanimated | ~4.x.x | Performant UI animations in RN shell | Required by PRD/UI Spec for 60fps UI; V4 offers worklets. |
| Graphics Rendering | react-native-skia | ~1.x.x | Custom pixel rendering/effects in RN shell | Required by UI Spec for retro effects/UI. |
| Styling | NativeWind | ~4.x.x | Utility-first styling in RN | Tailwind-like experience for RN; confirmed approach. |
| Game Engine | Phaser 3 | ~3.70.0 | 2D Combat Engine within WebView | Core tech from V2, proven for 60fps combat. |
| Backend Language (Edge) | TypeScript | Deno Runtime | Language for Supabase Edge Functions | Supabase Edge Functions run Deno/TS. |
| Backend Language (DB) | PL/pgSQL | PostgreSQL Hosted | Language for PostgreSQL Functions | Standard for in-database logic; for data-intensive tasks. |
| Backend Platform | Supabase | Cloud Hosted | BaaS (DB, Auth, Realtime, Functions, Storage) | Core tech from V2, provides necessary services. |
| API Style | REST | N/A | Communication with Supabase / Edge Functions | Standard for Supabase client and Edge Functions. |
| Database | PostgreSQL | Supabase Hosted | Primary data storage | Provided by Supabase; robust relational DB. |
| Realtime | Supabase Realtime (Broadcast) | Supabase Hosted | Real-time data synchronization via PG triggers | Scalable approach recommended by research. |
| File Storage | Supabase Storage | Supabase Hosted | Avatar images, temp selfie uploads | Integrated Supabase service; `temp` and `avatars` buckets. |
| Authentication | Supabase Auth | Supabase Hosted | User authentication and management | Integrated Supabase service; supports Anon Sign-in. |
| **AI (Avatar Gen)** | **Runware API** | **v1** | **AI avatar generation with Tri-Signal pipeline** | **SDXL Lightning + ControlNet + IP-Adapter. See AI Models section.** |
| AI (Sprite Gen) | Gemini API / Imagen 4 (TBD) | Latest | Combat/Boss Sprite Generation (Post-MVP) | Proven cost-effective pipeline from V2. |
| Fitness Data | HealthKit / Health Connect | Native APIs | Step/Workout Data Sync | Required by PRD for core mechanic. |
| **Bridge Comm Library** | **@msgpack/msgpack** | **Latest Stable** | **Binary Serialization for Bridge** | **Supports BigInt via `useBigInt64` option; Deep Think verified**. |
| **Bridge Transport** | **postMessage + Base64** | **N/A** | **Transport layer for Bridge communication** | **PIVOT: Deep Think identified WebSocket Server as anti-pattern. postMessage is <10ms latency**. |
| **Crash-Proof Storage** | **react-native-mmkv** | **Latest Stable** | **Synchronous key-value storage** | **Deep Think: AsyncStorage is async, can lose state on crash. MMKV is synchronous**. |
| **Base64 Encoding** | **buffer** | **Latest Stable** | **Base64 encoding for MessagePack transport** | **Required for string-based postMessage transport**. |
| Frontend Testing | Jest + RNTL | Latest Stable | Unit/Integration Testing for RN components | Standard testing stack for React Native. |
| Backend Testing (Edge) | Deno Testing + SuperDeno | Latest Stable | Unit/Integration Testing for Edge Functions | Native Deno tooling. |
| Backend Testing (DB) | pgTAP (Recommended) | Latest Stable | Unit Testing for PostgreSQL Functions | Standard framework for testing PL/pgSQL. |
| E2E Testing | Detox / Maestro (TBD) | Latest Stable | End-to-end testing for the mobile app | Detox for deep RN integration; Maestro for simpler setup. |
| Build Tool | Metro | RN Default | React Native Bundler | Standard for React Native. |
| Bundler | Metro | RN Default | (As above) | (As above). |
| IaC Tool | Supabase CLI / Mgmt API | Latest | Managing Supabase resources (schema, functions) | Sufficient for MVP. |
| CI/CD | GitHub Actions (Recommended) | N/A | Continuous Integration & Delivery | Simple integration if using GitHub. |
| Monitoring | Sentry (Recommended) | Latest | Error Tracking (Client & Serverless) | Robust error tracking, integrates with RN and Deno. |
| Logging | Supabase Logs + RN Lib | N/A | Application Logging | Supabase provides backend logs; need client library. |
| **Video Playback** | **react-native-video** | **5.2.1** | **Transition videos for combat entry/exit** | **PINNED: Deep Think verified v5.2.1 is "Golden Standard" for RN 0.71.x. v6 requires RN 0.72+**. |
| **Image Processing (Deno)** | **ImageScript** | **1.2.15** | **CLAHE, resize, Bayer dithering, palette quantization** | **PIVOT: `sharp` not Deno-compatible. ImageScript is pure JS, works in Edge Functions**. |

---

## AI Models (Avatar Generation)

The avatar generation pipeline uses a "Smooth-to-Pixel" strategy with Runware's API. AI generates cel-shaded vector art, and server-side post-processing handles pixelation.

### Runware API Configuration

| Field | Value |
|-------|-------|
| **Base URL** | `https://api.runware.ai/v1` |
| **Authentication** | Bearer Token (`RUNWARE_API_KEY`) |
| **Documentation** | https://docs.runware.ai |

### Model IDs (Verified December 2025)

| Component | Runware AIR ID | Purpose |
|-----------|----------------|---------|
| **Base Model** | `civitai:112902@354657` | DreamShaper XL Lightning Alpha 2 |
| **ControlNet** | `runware:20@1` | SDXL Canny (edge detection) |
| **IP-Adapter** | `civitai:208846@235313` | FaceID Plus v2 (likeness preservation) |

### Tri-Signal Pipeline

The avatar generation uses three complementary signals:

| Signal | Technology | Weight (Accuracy) | Weight (Retro) | Purpose |
|--------|------------|-------------------|----------------|---------|
| **Geometry** | ControlNet Canny | 0.50 | 0.45 | Locks facial structure |
| **Likeness** | IP-Adapter FaceID | 0.55 | 0.35 | Preserves facial features |
| **Style** | Text Prompt | Implicit | Implicit | Directs cel-shaded output |

### Generation Parameters

```typescript
const GENERATION_CONFIG = {
  model: "civitai:112902@354657",  // DreamShaper XL Lightning
  steps: 4,                         // STRICT - higher causes artifacts
  CFGScale: 2.0,                    // Low CFG required for Lightning
  scheduler: "DPMPP_SDE_KARRAS",    // Lightning fails with Euler
  width: 1024,
  height: 1024,
};
```

### Why Runware Over Alternatives

| Consideration | Runware | OpenAI (DALL-E/gpt-image-1) | Fal.ai |
|---------------|---------|------------------------------|--------|
| **Likeness Control** | IP-Adapter FaceID | None (prompt only) | Limited |
| **Structure Control** | ControlNet Canny | None | Available |
| **Cost per Avatar** | ~$0.005 | ~$0.04 | ~$0.01 |
| **Generation Time** | ~3-5s | ~10-15s | ~5-8s |
| **Async Webhooks** | Yes | No | Yes |

---

## Image Processing (Edge Functions)

### ImageScript

**Import:** `https://deno.land/x/imagescript@1.2.15/mod.ts`

**Purpose:** All image processing in the `generate-avatar` Edge Function webhook handler.

**Operations Used:**

| Operation | Method | Purpose |
|-----------|--------|---------|
| Decode | `Image.decode(buffer)` | Load image from Uint8Array |
| Resize | `img.resize(128, 128)` | Downscale to avatar size |
| Pixel Access | `img.bitmap[idx]` | Direct RGBA manipulation for CLAHE |
| Pixel Write | `img.setPixelAt(x, y, color)` | Set DMG palette colors |
| Encode | `img.encode()` | Export as PNG |

**Why ImageScript:**

- **Pure JavaScript:** No native dependencies, works in Supabase Edge runtime
- **WASM-free:** Avoids cold start issues that plague `photon-wasm`
- **Direct bitmap access:** Required for CLAHE implementation
- **Fast enough:** <50ms for 128×128 images

**Custom Implementations Required:**

1. **CLAHE (Contrast Limited Adaptive Histogram Equalization)**
   - File: `supabase/functions/generate-avatar/utils/clahe.ts`
   - Purpose: Local contrast enhancement for diverse skin tones
   - Parameters: `clipLimit: 2.0`, `gridSize: 8`

2. **Bayer Dithering**
   - Inline in webhook handler
   - 4×4 matrix with `spread: 45`
   - Purpose: Authentic DMG aesthetic

---

## Removed Dependencies (Deep Think Review)

The following dependencies were removed based on Deep Think's architectural review:

| Package | Reason for Removal |
|:--------|:-------------------|
| `react-native-tcp-socket` | WebSocket Server approach abandoned; postMessage is simpler and sufficient |
| `react-native-static-server` | file:// with CORS bypass flags is industry standard; server adds complexity and battery drain |
| `sharp` | Not compatible with Deno runtime in Supabase Edge Functions |
| `msgpack-lite` | Replaced with `@msgpack/msgpack` which supports BigInt natively |

---

## Deprecated AI APIs

The following AI APIs were evaluated but not selected:

| API | Status | Reason |
|-----|--------|--------|
| OpenAI gpt-image-1 | **Not Used** | No likeness control, higher cost (~$0.04/image), slower generation |
| DALL-E 3 | **Not Used** | Same limitations as gpt-image-1 |
| Fal.ai | **Fallback Only** | Could be used if Runware has extended outages |

---

## Version Pinning Requirements

| Package | Pinned Version | Reason |
|:--------|:---------------|:-------|
| `react-native` | 0.71.8 | Stable base; upgrading to 0.72+ carries breaking change risk |
| `react-native-video` | 5.2.1 | Last version compatible with RN 0.71.x; v6 requires New Architecture |
| `imagescript` (Deno) | 1.2.15 | Verified API; `.bitmap` direct access pattern confirmed |

---

## AndroidManifest.xml Required Changes (Deep Think)

```xml
<application
  android:name=".MainApplication"
  android:largeHeap="true"
  android:hardwareAccelerated="true"
  ...>

  <activity
    android:name=".MainActivity"
    android:configChanges="orientation|screenSize|keyboardHidden"
    ...>
  </activity>
</application>
```

**Rationale:**
- `largeHeap="true"` - Raises memory ceiling for video transitions and Base64 bridge data
- `configChanges` - Prevents Activity restart on orientation change (critical for combat transitions)

---

## Related Documentation

- [External APIs - Runware](./external-apis.md) - Full API documentation
- [Avatar Generation Workflow](./core-workflows.md#workflow-2-avatar-generation-async-webhook-architecture)
- [Implementation Spec](./avatar-generation-implementation-spec.md) - Complete code examples

---

*Last Updated: 2025-12-31*
*Document Version: 1.2*
