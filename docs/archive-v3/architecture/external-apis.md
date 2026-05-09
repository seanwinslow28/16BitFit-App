# External APIs

This document details the external APIs required for 16BitFit-V3 functionality and how they are integrated.

---

## Changelog

| Date | Version | Changes |
|------|---------|---------|
| 2025-12-31 | 2.0 | Complete rewrite for Runware API integration. Removed deprecated gpt-image-1/DALL-E references. Added async webhook architecture, model IDs, and error handling. |
| 2025-10-XX | 1.0 | Initial placeholder documentation |

---

## API: Runware AI Image Generation

**Purpose:** Generate personalized DMG-style pixel art avatars from user selfies using a "Smooth-to-Pixel" architecture. AI generates cel-shaded vector art via SDXL models, and server-side post-processing handles pixelation with guaranteed 4-color DMG palette compliance.

### Connection Details

| Field | Value |
|-------|-------|
| **Base URL** | `https://api.runware.ai/v1` |
| **Authentication** | Bearer Token (`Authorization: Bearer <RUNWARE_API_KEY>`) |
| **API Key Storage** | Supabase Edge Function environment variable: `RUNWARE_API_KEY` |
| **Documentation** | https://docs.runware.ai |

### Model IDs (Verified December 2025)

| Component | Runware AIR ID | Purpose |
|-----------|----------------|---------|
| **Base Model** | `civitai:112902@354657` | DreamShaper XL Lightning Alpha 2 (4-step, ~3s generation) |
| **ControlNet** | `runware:20@1` | SDXL Canny (edge detection for geometry lock) |
| **IP-Adapter** | `civitai:208846@235313` | FaceID Plus v2 (likeness preservation) |

**Model Selection Rationale:**
- **DreamShaper XL Lightning** was chosen over Juggernaut XL because it's fine-tuned for illustration and "2.5D" art, producing cleaner flat regions optimal for dithering
- **IP-Adapter FaceID Plus v2** provides the best SDXL-compatible face likeness transfer
- **SDXL Canny** is Runware's optimized edge detection model for structural guidance

---

### Endpoints Used

#### 1. ControlNet Preprocessing (Synchronous)

Generates a Canny edge map from the user's selfie. This runs **synchronously** because the client needs the Canny URL immediately for the "Scanning Biometrics..." UI feedback.

**Request:**
```http
POST https://api.runware.ai/v1
Content-Type: application/json
Authorization: Bearer <RUNWARE_API_KEY>
```

**Payload:**
```json
[
  {
    "taskType": "controlNetPreprocess",
    "taskUUID": "<uuid-v4>",
    "inputImage": "<selfie_public_url>",
    "preProcessorType": "canny",
    "outputType": "URL"
  }
]
```

**Response:**
```json
{
  "data": [
    {
      "taskType": "controlNetPreprocess",
      "taskUUID": "<uuid-v4>",
      "guideImageUUID": "<uuid-for-generation-task>",
      "guideImageURL": "<public-url-for-client-display>"
    }
  ]
}
```

**Notes:**
- `guideImageUUID` is used in the generation task's `controlNet.guideImage` field
- `guideImageURL` is returned to the client for the "Scanning Biometrics" animation
- Typical latency: ~800ms-1.5s

---

#### 2. Image Generation (Asynchronous with Webhook)

Generates two avatar variants ("Accuracy" and "Retro") using the Tri-Signal pipeline: ControlNet (geometry) + IP-Adapter (likeness) + Prompt (style).

**Request:**
```http
POST https://api.runware.ai/v1
Content-Type: application/json
Authorization: Bearer <RUNWARE_API_KEY>
```

**Payload (Two Variants in Single Request):**
```json
[
  {
    "taskType": "imageInference",
    "taskUUID": "<job_id>_accuracy",
    "model": "civitai:112902@354657",
    "positivePrompt": "(flat vector art:1.4), (cel shaded:1.3), clean lines, thick outlines, retro game asset, hero portrait, green palette, minimalist, 2d, masterpiece",
    "negativePrompt": "photorealistic, 3d render, noise, grain, gradient, shading, texture, messy, glitch, photography, skin pores, complex background",
    "width": 1024,
    "height": 1024,
    "steps": 4,
    "scheduler": "DPMPP_SDE_KARRAS",
    "CFGScale": 2.0,
    "deliveryMethod": "async",
    "webhookURL": "https://<supabase-ref>.functions.supabase.co/generate-avatar?webhook=true",
    "controlNet": [{
      "model": "runware:20@1",
      "guideImage": "<guide_image_uuid>",
      "weight": 0.5,
      "startStep": 0,
      "endStep": 0.5
    }],
    "ipAdapter": {
      "model": "civitai:208846@235313",
      "guideImage": "<original_selfie_url>",
      "weight": 0.55
    }
  },
  {
    "taskType": "imageInference",
    "taskUUID": "<job_id>_retro",
    "model": "civitai:112902@354657",
    "positivePrompt": "(flat vector art:1.4), (cel shaded:1.3), clean lines, thick outlines, retro game asset, hero portrait, green palette, minimalist, 2d, masterpiece",
    "negativePrompt": "photorealistic, 3d render, noise, grain, gradient, shading, texture, messy, glitch, photography, skin pores, complex background",
    "width": 1024,
    "height": 1024,
    "steps": 4,
    "scheduler": "DPMPP_SDE_KARRAS",
    "CFGScale": 2.0,
    "deliveryMethod": "async",
    "webhookURL": "https://<supabase-ref>.functions.supabase.co/generate-avatar?webhook=true",
    "controlNet": [{
      "model": "runware:20@1",
      "guideImage": "<guide_image_uuid>",
      "weight": 0.45,
      "startStep": 0,
      "endStep": 0.4
    }],
    "ipAdapter": {
      "model": "civitai:208846@235313",
      "guideImage": "<original_selfie_url>",
      "weight": 0.35
    }
  }
]
```

**Generation Parameters Explained:**

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| `steps` | 4 | **Strict** - Lightning models optimized for 4 steps. Higher causes artifacts. |
| `CFGScale` | 2.0 | Low CFG required for Lightning models |
| `scheduler` | `DPMPP_SDE_KARRAS` | Lightning fails with Euler schedulers |
| `width/height` | 1024 | SDXL native resolution |

**Variant Differences:**

| Variant | ControlNet Weight | ControlNet End | IP-Adapter Weight | Result |
|---------|-------------------|----------------|-------------------|--------|
| **Accuracy** | 0.50 | 0.5 | 0.55 | Higher likeness, tighter structure |
| **Retro** | 0.45 | 0.4 | 0.35 | More stylized, looser interpretation |

**Important:** Do NOT use `numberResults: 2`. That replicates identical settings. Use the array format to specify different weights per variant.

---

### Webhook Configuration

**Delivery Method:** Set `"deliveryMethod": "async"` and `"webhookURL"` on each task.

**Webhook URL Format:**
```
https://<supabase-project-ref>.functions.supabase.co/generate-avatar?webhook=true
```

**Webhook Payload (from Runware):**
```json
{
  "data": [
    {
      "taskType": "imageInference",
      "taskUUID": "<job_id>_accuracy",
      "imageUUID": "<uuid>",
      "imageURL": "<generated-image-url>",
      "cost": 0.002
    }
  ]
}
```

**TaskUUID Correlation Pattern:**
- Format: `<job_id>_<variant>` (e.g., `550e8400-e29b-41d4-a716-446655440000_accuracy`)
- Parse with: `const [jobId, variant] = taskUUID.split("_");`
- Use `jobId` to find the database record
- Use `variant` to determine which column to update (`url_accuracy` or `url_retro`)

**Webhook Handler Responsibilities:**
1. Download generated image from `imageURL`
2. Resize to 128x128 (Lanczos)
3. Apply CLAHE contrast enhancement
4. Apply Bayer 4x4 dithering (spread: 45)
5. Quantize to 4 DMG palette colors
6. Upload to Supabase Storage
7. Update database record with public URL
8. Supabase Realtime notifies client automatically

---

### Rate Limits & Quotas

| Metric | Limit | Notes |
|--------|-------|-------|
| Concurrent requests | Varies by tier | Check Runware dashboard |
| Requests per minute | Varies by tier | Implement exponential backoff |
| Max image size | 10MB | Selfies typically <5MB |

**Recommendation:** Monitor usage via Runware dashboard and implement request queuing if approaching limits.

---

### Cost Estimates

| Operation | Cost (Approx.) |
|-----------|----------------|
| ControlNet Preprocessing | ~$0.001 per image |
| SDXL Lightning Generation (per image) | ~$0.002-0.003 |
| **Total per avatar (2 variants)** | ~$0.005-0.007 |

**Monthly Projections:**

| MAU | Avatars/Month | Estimated Cost |
|-----|---------------|----------------|
| 1,000 | ~200 | $1-2 |
| 10,000 | ~2,000 | $10-15 |
| 100,000 | ~20,000 | $100-150 |

**Budget Note:** At $100/day ($3,000/month), the system supports ~500,000 avatar generations per month.

---

### Error Handling

#### HTTP Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Bad Request (invalid payload) | Log error, check model IDs and parameters |
| 401 | Unauthorized | Check API key validity |
| 402 | Insufficient credits | Alert ops, add credits |
| 429 | Rate limited | Exponential backoff, retry after delay |
| 500 | Server error | Retry with backoff (max 3 attempts) |

#### Timeout Recommendations

| Operation | Timeout | Rationale |
|-----------|---------|-----------|
| Preprocessing | 10 seconds | Typically completes in <2s |
| Generation (webhook) | 60 seconds | Lightning models are fast, but allow buffer |

#### Retry Strategy

```typescript
const RETRY_CONFIG = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};
```

#### Fallback: DSP (Digital Signal Processing)

If AI generation fails completely, apply a deterministic "Game Boy Camera" style filter:
1. Crop selfie to square (center)
2. Resize to 128x128
3. Convert to grayscale
4. Apply CLAHE (clipLimit: 2.5)
5. Apply Bayer dithering (spread: 45)
6. Quantize to DMG palette

This produces a recognizable but less stylized avatar as a fallback.

---

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    React Native Client                           │
│  1. Capture selfie → 2. Upload to temp storage                   │
│  3. POST /generate-avatar → 4. Receive jobId + cannyUrl          │
│  5. Show "Scanning..." with cannyUrl                             │
│  6. Subscribe to Realtime (avatars table)                        │
│  7. Display "Draft Pick" when both variants ready                │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│               Supabase Edge Function (generate-avatar)           │
│  CLIENT REQUEST:                                                 │
│  - Call Runware preprocessing (sync, ~1s)                        │
│  - Create DB record with canny_url                               │
│  - Fire async generation (2 variants) with webhook               │
│  - Return {jobId, cannyUrl} immediately                          │
│                                                                  │
│  WEBHOOK HANDLER:                                                │
│  - Download AI image → Resize → CLAHE → Dither → Quantize        │
│  - Upload to avatars bucket → Update DB                          │
│  - Realtime auto-notifies client                                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Runware API                               │
│  - Preprocessing: controlNetPreprocess (canny)                   │
│  - Generation: imageInference (SDXL Lightning + ControlNet       │
│                + IP-Adapter FaceID)                              │
│  - Delivery: Async webhook callback                              │
└─────────────────────────────────────────────────────────────────┘
```

---

### Environment Variables

```bash
# Required for Edge Function
RUNWARE_API_KEY=<your-runware-api-key>
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

---

### Related Documentation

- **Full Implementation Spec:** [avatar-generation-implementation-spec.md](./avatar-generation-implementation-spec.md)
- **Edge Function Code:** `supabase/functions/generate-avatar/index.ts`
- **Database Schema:** Migration `20251231_avatar_generation_v2.sql`
- **React Native Hook:** `apps/mobile-shell/src/hooks/useAvatarGeneration.ts`

---

## API: Supabase (Backend-as-a-Service)

**Purpose:** Authentication, PostgreSQL database, Realtime subscriptions, Storage buckets, and Edge Functions.

| Field | Value |
|-------|-------|
| **Project URL** | `https://noxwzelpibuytttlgztq.supabase.co` |
| **Documentation** | https://supabase.com/docs |
| **Authentication** | JWT tokens (anon key for client, service role for Edge Functions) |

**Services Used:**
- **Auth:** User registration and session management
- **Database:** PostgreSQL with Row Level Security (RLS)
- **Realtime:** WebSocket subscriptions for avatar generation status
- **Storage:** `temp` bucket (selfie uploads), `avatars` bucket (processed avatars)
- **Edge Functions:** `generate-avatar` (Runware integration)

See [SUPABASE_SETUP_GUIDE.md](../guides/SUPABASE_SETUP_GUIDE.md) for detailed configuration.

---

## Deprecated/Archived APIs

### OpenAI gpt-image-1 / DALL-E 3 (REMOVED)

**Status:** Deprecated as of 2025-12-31

**Reason:** Replaced by Runware's Tri-Signal architecture (SDXL Lightning + ControlNet + IP-Adapter) which provides:
- Better likeness preservation via IP-Adapter FaceID
- More control over output style via ControlNet weights
- Lower cost (~$0.005 vs ~$0.04 per generation)
- Faster generation (~3s vs ~15s)

### Fal.ai (NOT IMPLEMENTED)

**Status:** Documented as potential fallback but not currently implemented

**Note:** If Runware experiences extended outages, Fal.ai could be integrated as an alternative SDXL host. API structure is similar but model IDs and authentication differ.

---

## Future APIs (Post-MVP)

### AI Sprite Generation (Placeholder)

**Purpose:** Generate combat character sprites and boss sprites (Post-MVP Phase 2)

**Candidate Providers:**
- Google Imagen 3
- Runware (using different models)
- Custom fine-tuned models

**Integration Notes:** Will likely use anchor-reference techniques for consistent sprite sheets. Detailed specification pending MVP completion.

---

*Last Updated: 2025-12-31*
*Document Version: 2.0*
