# 16BitFit Avatar Generation - Production Implementation Specification

## Document Overview

| Field | Value |
|-------|-------|
| **Version** | 1.0 |
| **Date** | 2025-12-31 |
| **Status** | APPROVED FOR IMPLEMENTATION |
| **Authors** | BMAD Party Mode Session + Gemini 3 Deep Think |
| **Supersedes** | `docs/12-30-Home Pixel Avatar Selfie Research/Claude Synthesis/16bitfit-avatar-architecture-v2-12-30.md` |

---

## Executive Summary

This document defines the production architecture for converting user selfies into DMG Game Boy-style pixel art avatars. The architecture uses a **"Smooth-to-Pixel" strategy**: AI generates cel-shaded vector art (not pixel art), and deterministic server-side processing handles pixelation with guaranteed 4-color palette compliance.

### Key Architecture Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| AI Strategy | "Smooth-to-Pixel" | AI generates smooth vector art; server pixelates. Separates concerns for reliability. |
| Base Model | DreamShaper XL Lightning | 4-step model, ~3s generation, optimized for illustration |
| Likeness Preservation | Tri-Signal Pipeline | ControlNet (geometry) + IP-Adapter (features) + Prompt (style) |
| Contrast Fix | CLAHE | Adaptive histogram equalization prevents "muddy" output |
| Dithering | Bayer 4×4 (spread: 45) | Authentic DMG aesthetic, works well with Lightning output |
| Processing Mode | Async Webhook | Non-blocking, prevents mobile timeouts |
| User Experience | "Draft Pick" | Generate 2 variants, user chooses |

---

## Part 1: AI Pipeline Configuration

### 1.1 Model IDs (Verified December 2025)

| Component | Runware AIR ID | Purpose |
|-----------|----------------|---------|
| **Base Model** | `civitai:112902@354657` | DreamShaper XL Lightning Alpha 2 |
| **ControlNet** | `runware:20@1` | SDXL Canny (edge detection) |
| **IP-Adapter** | `civitai:208846@235313` | FaceID Plus v2 (likeness) |

### 1.2 Generation Parameters

```typescript
const GENERATION_CONFIG = {
  // Base model settings
  model: "civitai:112902@354657",
  steps: 4,                          // STRICT - higher causes artifacts
  CFGScale: 2.0,                     // Low CFG required for Lightning
  scheduler: "DPMPP_SDE_KARRAS",     // Lightning fails with Euler
  width: 1024,
  height: 1024,

  // Prompt strategy - DO NOT request pixel art from AI
  positivePrompt: "(flat vector art:1.4), (cel shaded:1.3), clean lines, thick outlines, retro game asset, hero portrait, green palette, minimalist, 2d, masterpiece",
  negativePrompt: "photorealistic, 3d render, noise, grain, gradient, shading, texture, messy, glitch, photography, skin pores, complex background",
};
```

### 1.3 Tri-Signal Configuration

The "Tri-Signal" approach uses three complementary signals to achieve likeness + style balance:

#### Signal 1: ControlNet Canny (Geometry Lock)

```typescript
controlNet: [{
  model: "runware:20@1",
  guideImage: "<CANNY_MAP_UUID>",  // From preprocessing
  weight: 0.5,                      // Accuracy variant
  // weight: 0.45,                  // Retro variant
  startStep: 0,
  endStep: 0.5,                     // Stop early to let style dominate
  // endStep: 0.4,                  // Retro variant - even looser
}]
```

#### Signal 2: IP-Adapter FaceID (Feature Injection)

```typescript
ipAdapter: {
  model: "civitai:208846@235313",
  guideImage: "<ORIGINAL_SELFIE_URL>",
  weight: 0.55,                     // Accuracy variant (high likeness)
  // weight: 0.35,                  // Retro variant (more stylized)
}
```

#### Signal 3: Prompt (Style Direction)

The positive/negative prompts (Section 1.2) provide style direction. Weight is implicit via token emphasis `(term:1.4)`.

### 1.4 Variant Specifications ("Draft Pick")

| Variant | ControlNet Weight | ControlNet End | IP-Adapter Weight | Result |
|---------|-------------------|----------------|-------------------|--------|
| **Accuracy** | 0.50 | 0.5 | 0.55 | Higher likeness, tighter structure |
| **Retro** | 0.45 | 0.4 | 0.35 | More stylized, looser interpretation |

---

## Part 2: Post-Processing Pipeline

### 2.1 Pipeline Overview

```
AI Output (1024×1024, smooth vector art)
    ↓
Resize (Lanczos/Bilinear → 128×128)
    ↓
CLAHE (Contrast Limited Adaptive Histogram Equalization)
    ↓
Bayer Dither (4×4 matrix, spread: 45)
    ↓
Palette Quantization (4 DMG colors)
    ↓
Final Output (128×128, exactly 4 colors)
```

### 2.2 DMG Palette (Non-Negotiable)

```typescript
const DMG_PALETTE = {
  darkest:  0x0F380FFF,  // #0F380F - Deep forest shadow
  dark:     0x306230FF,  // #306230 - Pine border
  light:    0x8BAC0FFF,  // #8BAC0F - Lime highlight
  lightest: 0x9BBC0FFF,  // #9BBC0F - Neon grass glow
};

// As array for indexing
const PALETTE = [0x0F380FFF, 0x306230FF, 0x8BAC0FFF, 0x9BBC0FFF];
```

### 2.3 CLAHE Implementation

**Why CLAHE is Mandatory:** Simple contrast stretching affects the whole image globally. CLAHE (Contrast Limited Adaptive Histogram Equalization) enhances *local* contrast, critical for:
- Separating eyes from dark skin tones
- Preserving nose/brow detail on pale skin
- Handling varied lighting conditions

**Parameters:**
- `clipLimit`: 2.0
- `gridSize`: 8

**Full Implementation:** See `supabase/functions/generate-avatar/utils/clahe.ts`

```typescript
// utils/clahe.ts
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";

export function applyCLAHE(img: Image, clipLimit: number = 2.0, gridSize: number = 8): Image {
  const width = img.width;
  const height = img.height;
  const output = img.clone();

  // 1. Extract Luminance
  const lumChannel = new Float32Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const r = img.bitmap[i * 4];
    const g = img.bitmap[i * 4 + 1];
    const b = img.bitmap[i * 4 + 2];
    lumChannel[i] = 0.299 * r + 0.587 * g + 0.114 * b;
  }

  // 2. Tile & Histogram
  const tileW = Math.ceil(width / gridSize);
  const tileH = Math.ceil(height / gridSize);
  const numTilesX = Math.ceil(width / tileW);
  const numTilesY = Math.ceil(height / tileH);

  const cdfs: Float32Array[] = [];

  for (let ty = 0; ty < numTilesY; ty++) {
    for (let tx = 0; tx < numTilesX; tx++) {
      const hist = new Float32Array(256).fill(0);
      const startX = tx * tileW;
      const startY = ty * tileH;
      const endX = Math.min(startX + tileW, width);
      const endY = Math.min(startY + tileH, height);
      let count = 0;

      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          hist[Math.floor(lumChannel[y * width + x])]++;
          count++;
        }
      }

      // Clip
      const limit = Math.max(1, (clipLimit * count) / 256);
      let excess = 0;
      for (let i = 0; i < 256; i++) {
        if (hist[i] > limit) {
          excess += hist[i] - limit;
          hist[i] = limit;
        }
      }

      // Redistribute & CDF
      const inc = excess / 256;
      let sum = 0;
      const cdf = new Float32Array(256);
      for (let i = 0; i < 256; i++) {
        hist[i] += inc;
        sum += hist[i];
        cdf[i] = (sum / count) * 255;
      }
      cdfs.push(cdf);
    }
  }

  // 3. Bilinear Interpolation
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const tx = (x / tileW) - 0.5;
      const ty = (y / tileH) - 0.5;
      const col1 = Math.max(0, Math.floor(tx));
      const col2 = Math.min(numTilesX - 1, col1 + 1);
      const row1 = Math.max(0, Math.floor(ty));
      const row2 = Math.min(numTilesY - 1, row1 + 1);

      const xW = tx - col1;
      const yW = ty - row1;
      const val = Math.floor(lumChannel[y * width + x]);

      const c1 = cdfs[row1 * numTilesX + col1][val];
      const c2 = cdfs[row1 * numTilesX + col2][val];
      const c3 = cdfs[row2 * numTilesX + col1][val];
      const c4 = cdfs[row2 * numTilesX + col2][val];

      const top = c1 * (1 - xW) + c2 * xW;
      const bot = c3 * (1 - xW) + c4 * xW;
      const final = Math.min(255, Math.max(0, top * (1 - yW) + bot * yW));

      // Write Grayscale
      const idx = (y * width + x) * 4;
      const v = Math.floor(final);
      output.bitmap[idx] = v;
      output.bitmap[idx + 1] = v;
      output.bitmap[idx + 2] = v;
    }
  }
  return output;
}
```

### 2.4 Bayer Dithering Implementation

```typescript
const BAYER_MATRIX = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5]
];

const SPREAD_FACTOR = 45; // Tuned for SDXL Lightning output

function applyBayerDither(img: Image): Image {
  const PALETTE = [0x0F380FFF, 0x306230FF, 0x8BAC0FFF, 0x9BBC0FFF];

  for (let y = 0; y < 128; y++) {
    for (let x = 0; x < 128; x++) {
      const idx = (y * 128 + x) * 4;
      const lum = img.bitmap[idx]; // Already grayscale from CLAHE

      // Apply dither noise
      const threshold = BAYER_MATRIX[y % 4][x % 4];
      const noise = (threshold / 16.0 - 0.5) * SPREAD_FACTOR;
      const ditheredLum = Math.max(0, Math.min(255, lum + noise));

      // Quantize to 4 colors
      let paletteColor: number;
      if (ditheredLum < 64) {
        paletteColor = PALETTE[0]; // Darkest
      } else if (ditheredLum < 128) {
        paletteColor = PALETTE[1]; // Dark
      } else if (ditheredLum < 192) {
        paletteColor = PALETTE[2]; // Light
      } else {
        paletteColor = PALETTE[3]; // Lightest
      }

      img.setPixelAt(x, y, paletteColor);
    }
  }

  return img;
}
```

---

## Part 3: System Architecture

### 3.1 Async Webhook Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (React Native)                       │
├─────────────────────────────────────────────────────────────────────┤
│  1. Capture selfie                                                   │
│  2. Upload to temp storage                                           │
│  3. POST /generate-avatar { selfieUrl, userId }                      │
│  4. Receive { jobId, cannyUrl } immediately (~1s)                    │
│  5. Display cannyUrl as "Scanning Biometrics..."                     │
│  6. Subscribe to Realtime: avatars.id = jobId                        │
│  7. Wait for url_accuracy AND url_retro to populate                  │
│  8. Display "Draft Pick" selection UI                                │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    EDGE FUNCTION (generate-avatar)                   │
├─────────────────────────────────────────────────────────────────────┤
│  CLIENT REQUEST HANDLER:                                             │
│  1. Receive selfieUrl, userId                                        │
│  2. Call Runware controlNetPreprocess (SYNC, ~1s)                    │
│  3. Get guideImageUUID (for AI) and guideImageURL (for client)       │
│  4. Create DB record: avatars { status: 'processing', canny_url }    │
│  5. Fire async generation (2 variants) with webhook                  │
│  6. Return { jobId, cannyUrl } immediately                           │
├─────────────────────────────────────────────────────────────────────┤
│  WEBHOOK HANDLER (called twice, once per variant):                   │
│  1. Receive { taskUUID, imageURL } from Runware                      │
│  2. Parse taskUUID to get jobId and variant                          │
│  3. Download AI image                                                │
│  4. Resize to 128×128                                                │
│  5. Apply CLAHE                                                      │
│  6. Apply Bayer dither                                               │
│  7. Upload to avatars storage bucket                                 │
│  8. Update DB: url_accuracy or url_retro                             │
│  9. (Realtime automatically notifies client)                         │
└─────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│                           RUNWARE API                                │
├─────────────────────────────────────────────────────────────────────┤
│  PREPROCESSING (Sync):                                               │
│  - taskType: "controlNetPreprocess"                                  │
│  - preProcessorType: "canny"                                         │
│  - Returns: guideImageUUID, guideImageURL                            │
├─────────────────────────────────────────────────────────────────────┤
│  GENERATION (Async):                                                 │
│  - taskType: "imageInference"                                        │
│  - deliveryMethod: "async"                                           │
│  - webhookURL: Edge function URL                                     │
│  - Calls webhook when complete                                       │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Database Schema

```sql
-- Migration: 20251231_avatar_generation_v2.sql

CREATE TABLE IF NOT EXISTS public.avatars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'complete', 'failed')),
  canny_url TEXT,           -- Canny edge map URL (shown during "Scanning")
  url_accuracy TEXT,        -- High-likeness variant
  url_retro TEXT,           -- High-style variant
  selected_variant TEXT,    -- 'accuracy' | 'retro' - user's choice
  final_url TEXT,           -- The chosen avatar URL (copied from url_accuracy or url_retro)
  error_message TEXT,       -- If status = 'failed'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Realtime for client subscriptions
ALTER PUBLICATION supabase_realtime ADD TABLE public.avatars;

-- RLS Policies
ALTER TABLE public.avatars ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own avatars"
  ON public.avatars FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own avatars"
  ON public.avatars FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own avatars"
  ON public.avatars FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can do anything (for Edge Functions)
CREATE POLICY "Service role full access"
  ON public.avatars FOR ALL
  USING (auth.role() = 'service_role');

-- Index for fast lookups
CREATE INDEX idx_avatars_user_id ON public.avatars(user_id);
CREATE INDEX idx_avatars_status ON public.avatars(status);
```

### 3.3 Storage Buckets

```sql
-- Storage bucket for temporary selfie uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('temp', 'temp', true);

-- Storage bucket for processed avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);

-- RLS for temp bucket
CREATE POLICY "Authenticated users can upload to temp"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'temp' AND auth.role() = 'authenticated');

CREATE POLICY "Public read for temp"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'temp');

-- RLS for avatars bucket (service role writes, public reads)
CREATE POLICY "Service role can write avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'service_role');

CREATE POLICY "Public read for avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
```

---

## Part 4: Edge Function Implementation

### 4.1 Main Handler (`generate-avatar/index.ts`)

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Image } from "https://deno.land/x/imagescript@1.2.15/mod.ts";
import { applyCLAHE } from "./utils/clahe.ts";

const RUNWARE_API = "https://api.runware.ai/v1";
const RUNWARE_API_KEY = Deno.env.get("RUNWARE_API_KEY")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const WEBHOOK_URL = `${SUPABASE_URL}/functions/v1/generate-avatar?webhook=true`;

// DMG Palette
const PALETTE = [0x0F380FFF, 0x306230FF, 0x8BAC0FFF, 0x9BBC0FFF];

// Bayer Matrix
const BAYER = [[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]];

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const url = new URL(req.url);

  // ═══════════════════════════════════════════════════════════════
  // CLIENT REQUEST HANDLER
  // ═══════════════════════════════════════════════════════════════
  if (req.method === "POST" && !url.searchParams.get("webhook")) {
    try {
      const { selfieUrl, userId } = await req.json();

      if (!selfieUrl || !userId) {
        return new Response(
          JSON.stringify({ error: "selfieUrl and userId are required" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Step 1: Preprocess (Synchronous - we need the Canny URL for client)
      const preRes = await fetch(RUNWARE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RUNWARE_API_KEY}`
        },
        body: JSON.stringify([{
          taskType: "controlNetPreprocess",
          taskUUID: crypto.randomUUID(),
          inputImage: selfieUrl,
          preProcessorType: "canny",
          outputType: "URL"
        }])
      });

      const preData = await preRes.json();

      if (preData.errors || !preData.data?.[0]) {
        console.error("Preprocessing failed:", preData);
        return new Response(
          JSON.stringify({ error: "Preprocessing failed", details: preData }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const guideUUID = preData.data[0].guideImageUUID;
      const guideURL = preData.data[0].guideImageURL;

      // Step 2: Create DB Record
      const { data: job, error: dbError } = await supabase
        .from("avatars")
        .insert({
          user_id: userId,
          status: "processing",
          canny_url: guideURL
        })
        .select()
        .single();

      if (dbError) {
        console.error("DB insert failed:", dbError);
        return new Response(
          JSON.stringify({ error: "Database error", details: dbError }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Step 3: Fire Async Generation (2 variants)
      const generationPayload = [
        // Variant A: Accuracy (High Likeness)
        {
          taskType: "imageInference",
          taskUUID: `${job.id}_accuracy`,
          model: "civitai:112902@354657",
          positivePrompt: "(flat vector art:1.4), (cel shaded:1.3), clean lines, thick outlines, retro game asset, hero portrait, green palette, minimalist, 2d, masterpiece",
          negativePrompt: "photorealistic, 3d render, noise, grain, gradient, shading, texture, messy, glitch, photography, skin pores, complex background",
          width: 1024,
          height: 1024,
          steps: 4,
          scheduler: "DPMPP_SDE_KARRAS",
          CFGScale: 2.0,
          deliveryMethod: "async",
          webhookURL: WEBHOOK_URL,
          controlNet: [{
            model: "runware:20@1",
            guideImage: guideUUID,
            weight: 0.5,
            startStep: 0,
            endStep: 0.5
          }],
          ipAdapter: {
            model: "civitai:208846@235313",
            guideImage: selfieUrl,
            weight: 0.55
          }
        },
        // Variant B: Retro (High Style)
        {
          taskType: "imageInference",
          taskUUID: `${job.id}_retro`,
          model: "civitai:112902@354657",
          positivePrompt: "(flat vector art:1.4), (cel shaded:1.3), clean lines, thick outlines, retro game asset, hero portrait, green palette, minimalist, 2d, masterpiece",
          negativePrompt: "photorealistic, 3d render, noise, grain, gradient, shading, texture, messy, glitch, photography, skin pores, complex background",
          width: 1024,
          height: 1024,
          steps: 4,
          scheduler: "DPMPP_SDE_KARRAS",
          CFGScale: 2.0,
          deliveryMethod: "async",
          webhookURL: WEBHOOK_URL,
          controlNet: [{
            model: "runware:20@1",
            guideImage: guideUUID,
            weight: 0.45,
            startStep: 0,
            endStep: 0.4
          }],
          ipAdapter: {
            model: "civitai:208846@235313",
            guideImage: selfieUrl,
            weight: 0.35
          }
        }
      ];

      // Fire and forget - don't await
      fetch(RUNWARE_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RUNWARE_API_KEY}`
        },
        body: JSON.stringify(generationPayload)
      }).catch(err => console.error("Generation dispatch error:", err));

      // Return immediately with job info
      return new Response(
        JSON.stringify({ jobId: job.id, cannyUrl: guideURL }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      console.error("Client handler error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // WEBHOOK HANDLER (called by Runware when generation completes)
  // ═══════════════════════════════════════════════════════════════
  if (req.method === "POST" && url.searchParams.get("webhook")) {
    try {
      const { data } = await req.json();

      if (!data || !data[0]) {
        return new Response("No data", { status: 200 });
      }

      const { taskUUID, imageURL } = data[0];
      const [jobId, variant] = taskUUID.split("_");

      console.log(`Processing webhook: job=${jobId}, variant=${variant}`);

      // 1. Download AI image
      const imgRes = await fetch(imageURL);
      const imgBuffer = new Uint8Array(await imgRes.arrayBuffer());
      let img = await Image.decode(imgBuffer);

      // 2. Resize to 128×128
      img.resize(128, 128);

      // 3. Apply CLAHE
      img = applyCLAHE(img, 2.0, 8);

      // 4. Apply Bayer Dither
      for (let y = 0; y < 128; y++) {
        for (let x = 0; x < 128; x++) {
          const idx = (y * 128 + x) * 4;
          const lum = img.bitmap[idx];

          const threshold = BAYER[y % 4][x % 4];
          const noise = (threshold / 16.0 - 0.5) * 45;
          const dithered = Math.max(0, Math.min(255, lum + noise));

          let color: number;
          if (dithered < 64) color = PALETTE[0];
          else if (dithered < 128) color = PALETTE[1];
          else if (dithered < 192) color = PALETTE[2];
          else color = PALETTE[3];

          img.setPixelAt(x, y, color);
        }
      }

      // 5. Encode and upload
      const pngData = await img.encode();
      const storagePath = `${jobId}/${variant}.png`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(storagePath, pngData, {
          contentType: "image/png",
          upsert: true
        });

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return new Response("Upload failed", { status: 500 });
      }

      // 6. Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(storagePath);

      // 7. Update database
      const column = variant === "accuracy" ? "url_accuracy" : "url_retro";

      await supabase
        .from("avatars")
        .update({ [column]: publicUrl })
        .eq("id", jobId);

      // Check if both variants are complete
      const { data: record } = await supabase
        .from("avatars")
        .select("url_accuracy, url_retro")
        .eq("id", jobId)
        .single();

      if (record?.url_accuracy && record?.url_retro) {
        await supabase
          .from("avatars")
          .update({ status: "complete" })
          .eq("id", jobId);
      }

      console.log(`Processed ${variant} for job ${jobId}`);
      return new Response("OK", { status: 200 });

    } catch (error) {
      console.error("Webhook handler error:", error);
      return new Response("Error", { status: 500 });
    }
  }

  return new Response("Not found", { status: 404 });
});
```

---

## Part 5: React Native Client Implementation

### 5.1 Avatar Generation Hook

```typescript
// hooks/useAvatarGeneration.ts
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

type GenerationStatus = 'idle' | 'uploading' | 'scanning' | 'generating' | 'complete' | 'error';

interface AvatarGenerationState {
  status: GenerationStatus;
  jobId: string | null;
  cannyUrl: string | null;
  accuracyUrl: string | null;
  retroUrl: string | null;
  error: string | null;
}

interface UseAvatarGenerationReturn extends AvatarGenerationState {
  startGeneration: (photoUri: string) => Promise<void>;
  selectVariant: (variant: 'accuracy' | 'retro') => Promise<void>;
  reset: () => void;
}

export function useAvatarGeneration(): UseAvatarGenerationReturn {
  const [state, setState] = useState<AvatarGenerationState>({
    status: 'idle',
    jobId: null,
    cannyUrl: null,
    accuracyUrl: null,
    retroUrl: null,
    error: null,
  });

  // Subscribe to Realtime updates when we have a jobId
  useEffect(() => {
    if (!state.jobId || state.status === 'complete') return;

    const channel = supabase
      .channel(`avatar-${state.jobId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'avatars',
          filter: `id=eq.${state.jobId}`,
        },
        (payload) => {
          const record = payload.new as any;

          setState(prev => ({
            ...prev,
            accuracyUrl: record.url_accuracy || prev.accuracyUrl,
            retroUrl: record.url_retro || prev.retroUrl,
            status: record.status === 'complete' ? 'complete' : 'generating',
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [state.jobId, state.status]);

  const startGeneration = useCallback(async (photoUri: string) => {
    try {
      setState(prev => ({ ...prev, status: 'uploading', error: null }));

      // 1. Upload selfie to temp storage
      const fileExt = photoUri.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const response = await fetch(photoUri);
      const blob = await response.blob();

      const { error: uploadError } = await supabase.storage
        .from('temp')
        .upload(filePath, blob, {
          contentType: `image/${fileExt}`,
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('temp')
        .getPublicUrl(filePath);

      // 2. Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      setState(prev => ({ ...prev, status: 'scanning' }));

      // 3. Call Edge Function
      const { data, error } = await supabase.functions.invoke('generate-avatar', {
        body: { selfieUrl: publicUrl, userId: user.id },
      });

      if (error) throw error;

      setState(prev => ({
        ...prev,
        status: 'generating',
        jobId: data.jobId,
        cannyUrl: data.cannyUrl,
      }));

    } catch (error: any) {
      console.error('Generation error:', error);
      setState(prev => ({
        ...prev,
        status: 'error',
        error: error.message || 'Generation failed',
      }));
    }
  }, []);

  const selectVariant = useCallback(async (variant: 'accuracy' | 'retro') => {
    if (!state.jobId) return;

    const finalUrl = variant === 'accuracy' ? state.accuracyUrl : state.retroUrl;

    await supabase
      .from('avatars')
      .update({
        selected_variant: variant,
        final_url: finalUrl,
      })
      .eq('id', state.jobId);

    // Also update user profile with avatar
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('user_profiles')
        .update({ home_avatar_url: finalUrl })
        .eq('id', user.id);
    }
  }, [state.jobId, state.accuracyUrl, state.retroUrl]);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      jobId: null,
      cannyUrl: null,
      accuracyUrl: null,
      retroUrl: null,
      error: null,
    });
  }, []);

  return {
    ...state,
    startGeneration,
    selectVariant,
    reset,
  };
}
```

### 5.2 Boot Sequence Component

```typescript
// components/organisms/AvatarBootSequence/index.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { PixelText } from '../../atoms/PixelText';
import { PixelProgressBar } from '../../atoms/PixelProgressBar';
import { tokens } from '../../../design-system';

interface AvatarBootSequenceProps {
  status: 'scanning' | 'generating' | 'complete';
  cannyUrl: string | null;
}

const PHASES = [
  { label: 'INITIALIZING CARTRIDGE...', duration: 1500 },
  { label: 'SCANNING BIOMETRICS...', duration: 2000 },
  { label: 'QUANTIZING 4-BIT COLOR...', duration: 2500 },
  { label: 'GENERATION COMPLETE', duration: 500 },
];

export function AvatarBootSequence({ status, cannyUrl }: AvatarBootSequenceProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const progress = useSharedValue(0);
  const cannyOpacity = useSharedValue(0);

  useEffect(() => {
    if (status === 'scanning') {
      setCurrentPhase(1);
      cannyOpacity.value = withDelay(500, withTiming(1, { duration: 500 }));
    } else if (status === 'generating') {
      setCurrentPhase(2);
      progress.value = withTiming(0.75, { duration: 3000 });
    } else if (status === 'complete') {
      setCurrentPhase(3);
      progress.value = withTiming(1, { duration: 300 });
    }
  }, [status]);

  const cannyStyle = useAnimatedStyle(() => ({
    opacity: cannyOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Phase Label */}
      <PixelText variant="label" style={styles.label}>
        {PHASES[currentPhase].label}
      </PixelText>

      {/* Canny Map Display (Phase 1-2) */}
      {cannyUrl && currentPhase >= 1 && currentPhase < 3 && (
        <Animated.View style={[styles.cannyContainer, cannyStyle]}>
          <Image
            source={{ uri: cannyUrl }}
            style={styles.cannyImage}
            resizeMode="contain"
          />
          {/* Green tint overlay */}
          <View style={styles.greenOverlay} />
        </Animated.View>
      )}

      {/* Progress Bar (Phase 2) */}
      {currentPhase === 2 && (
        <View style={styles.progressContainer}>
          <PixelProgressBar
            progress={progress}
            width={200}
            height={16}
            showPercentage
          />
          <View style={styles.palettePreview}>
            {['#0F380F', '#306230', '#8BAC0F', '#9BBC0F'].map((color, i) => (
              <View
                key={color}
                style={[styles.paletteColor, { backgroundColor: color }]}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.dmg.lightest,
    padding: tokens.spacing.lg,
  },
  label: {
    marginBottom: tokens.spacing.lg,
    textAlign: 'center',
  },
  cannyContainer: {
    width: 200,
    height: 200,
    borderWidth: tokens.borderWidth.medium,
    borderColor: tokens.colors.dmg.darkest,
    overflow: 'hidden',
    position: 'relative',
  },
  cannyImage: {
    width: '100%',
    height: '100%',
  },
  greenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: tokens.colors.dmg.light,
    opacity: 0.3,
  },
  progressContainer: {
    alignItems: 'center',
    marginTop: tokens.spacing.lg,
  },
  palettePreview: {
    flexDirection: 'row',
    marginTop: tokens.spacing.md,
  },
  paletteColor: {
    width: 32,
    height: 32,
    borderWidth: 2,
    borderColor: tokens.colors.dmg.darkest,
    marginHorizontal: 2,
  },
});
```

### 5.3 Draft Pick Selection Component

```typescript
// components/organisms/AvatarDraftPick/index.tsx
import React from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { PixelText } from '../../atoms/PixelText';
import { PixelButton } from '../../atoms/PixelButton';
import { PixelBorder } from '../../atoms/PixelBorder';
import { tokens } from '../../../design-system';

interface AvatarDraftPickProps {
  accuracyUrl: string;
  retroUrl: string;
  onSelect: (variant: 'accuracy' | 'retro') => void;
}

export function AvatarDraftPick({ accuracyUrl, retroUrl, onSelect }: AvatarDraftPickProps) {
  const [selected, setSelected] = React.useState<'accuracy' | 'retro' | null>(null);

  return (
    <View style={styles.container}>
      <PixelText variant="heading" style={styles.title}>
        SELECT YOUR AVATAR
      </PixelText>

      <View style={styles.cardsContainer}>
        {/* Accuracy Variant */}
        <TouchableOpacity
          style={[styles.card, selected === 'accuracy' && styles.cardSelected]}
          onPress={() => setSelected('accuracy')}
          activeOpacity={0.8}
        >
          <PixelBorder style={styles.cardBorder}>
            <Image source={{ uri: accuracyUrl }} style={styles.avatarImage} />
          </PixelBorder>
          <PixelText variant="label" style={styles.cardLabel}>
            ACCURACY
          </PixelText>
          <PixelText variant="body" style={styles.cardDesc}>
            True to you
          </PixelText>
        </TouchableOpacity>

        {/* Retro Variant */}
        <TouchableOpacity
          style={[styles.card, selected === 'retro' && styles.cardSelected]}
          onPress={() => setSelected('retro')}
          activeOpacity={0.8}
        >
          <PixelBorder style={styles.cardBorder}>
            <Image source={{ uri: retroUrl }} style={styles.avatarImage} />
          </PixelBorder>
          <PixelText variant="label" style={styles.cardLabel}>
            RETRO
          </PixelText>
          <PixelText variant="body" style={styles.cardDesc}>
            Classic style
          </PixelText>
        </TouchableOpacity>
      </View>

      <PixelButton
        title="CONFIRM SELECTION"
        onPress={() => selected && onSelect(selected)}
        disabled={!selected}
        style={styles.confirmButton}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.dmg.lightest,
    padding: tokens.spacing.lg,
    alignItems: 'center',
  },
  title: {
    marginBottom: tokens.spacing.xl,
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: tokens.spacing.lg,
  },
  card: {
    alignItems: 'center',
    padding: tokens.spacing.md,
    borderWidth: tokens.borderWidth.medium,
    borderColor: tokens.colors.dmg.dark,
    backgroundColor: tokens.colors.dmg.lightest,
  },
  cardSelected: {
    borderColor: tokens.colors.dmg.darkest,
    borderWidth: tokens.borderWidth.thick,
    backgroundColor: tokens.colors.dmg.light,
  },
  cardBorder: {
    marginBottom: tokens.spacing.sm,
  },
  avatarImage: {
    width: 128,
    height: 128,
  },
  cardLabel: {
    marginTop: tokens.spacing.sm,
  },
  cardDesc: {
    color: tokens.colors.dmg.dark,
  },
  confirmButton: {
    marginTop: tokens.spacing.xl,
    width: 250,
  },
});
```

---

## Part 6: Cost Analysis

### 6.1 Per-Avatar Cost Breakdown

| Component | Cost |
|-----------|------|
| Runware Preprocessing (Canny) | ~$0.001 |
| Runware Generation (SDXL Lightning × 2) | ~$0.004 |
| Supabase Edge Function | ~$0.0001 |
| Supabase Storage | Negligible |
| **Total per avatar** | **~$0.005** |

### 6.2 Monthly Projections

| MAU | Avatars/Month | Monthly Cost |
|-----|---------------|--------------|
| 1,000 | ~200 | $1 |
| 10,000 | ~2,000 | $10 |
| 100,000 | ~20,000 | $100 |
| 1,000,000 | ~200,000 | $1,000 |

**Budget Check:** At $100/day ($3,000/month), we can support **600,000 avatar generations per month** — sufficient for 3M+ MAU.

---

## Part 7: Error Handling & Fallbacks

### 7.1 Error Recovery Matrix

| Error Type | Detection | Recovery Action |
|------------|-----------|-----------------|
| Runware preprocessing timeout | No response in 10s | Retry once, then DSP fallback |
| Runware generation timeout | No webhook in 60s | Mark job failed, notify user |
| Runware API error | HTTP 4xx/5xx | Log error, retry with backoff |
| Quality failure (ghosting) | Manual review (MVP) | Offer regeneration |
| Post-processing failure | Exception in webhook | Log, mark failed |
| Storage upload failure | Supabase error | Retry 3x with backoff |

### 7.2 DSP Fallback (Game Boy Camera Style)

If AI generation fails completely, apply this deterministic filter:

```typescript
async function dspFallback(selfieBuffer: Uint8Array): Promise<Uint8Array> {
  let img = await Image.decode(selfieBuffer);

  // 1. Crop to square (center)
  const size = Math.min(img.width, img.height);
  const x = (img.width - size) / 2;
  const y = (img.height - size) / 2;
  img.crop(x, y, size, size);

  // 2. Resize to 128×128
  img.resize(128, 128);

  // 3. Convert to grayscale
  for (let i = 0; i < img.width * img.height; i++) {
    const idx = i * 4;
    const gray = 0.299 * img.bitmap[idx] + 0.587 * img.bitmap[idx+1] + 0.114 * img.bitmap[idx+2];
    img.bitmap[idx] = img.bitmap[idx+1] = img.bitmap[idx+2] = gray;
  }

  // 4. Apply CLAHE
  img = applyCLAHE(img, 2.5, 8); // Slightly higher clip for photos

  // 5. Apply Bayer dither (same as AI path)
  // ... (same dithering code)

  return img.encode();
}
```

---

## Part 8: Testing Checklist

### 8.1 Unit Tests

- [ ] CLAHE produces valid grayscale output
- [ ] Bayer dither produces exactly 4 colors
- [ ] Palette quantization maps correctly
- [ ] TaskUUID parsing handles edge cases

### 8.2 Integration Tests

- [ ] Preprocessing returns valid Canny map
- [ ] Generation webhook fires correctly
- [ ] Post-processing chain completes
- [ ] Storage upload succeeds
- [ ] Database updates correctly
- [ ] Realtime notifications work

### 8.3 Demographic Testing (N=20)

| Category | Count | Pass Criteria |
|----------|-------|---------------|
| Fitzpatrick V-VI (Dark skin) | 5 | Face has ≥2 distinct colors |
| Fitzpatrick I-II (Pale skin) | 5 | Nose/brows visible |
| Accessories (Glasses, Hijab) | 5 | Outline captured |
| Lighting (Side-lit, Low light) | 5 | Histogram spread >15% |

---

## Appendix A: Environment Variables

```bash
# Supabase
SUPABASE_URL=https://noxwzelpibuytttlgztq.supabase.co
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Runware
RUNWARE_API_KEY=<your-runware-api-key>
```

---

## Appendix B: File Structure

```
supabase/
├── functions/
│   └── generate-avatar/
│       ├── index.ts           # Main Edge Function
│       └── utils/
│           └── clahe.ts       # CLAHE implementation
├── migrations/
│   └── 20251231_avatar_generation_v2.sql

apps/mobile-shell/src/
├── hooks/
│   └── useAvatarGeneration.ts
├── components/
│   └── organisms/
│       ├── AvatarBootSequence/
│       │   └── index.tsx
│       └── AvatarDraftPick/
│           └── index.tsx
└── screens/
    └── onboarding/
        └── PhotoUploadScreen.tsx  # Integrate components here
```

---

## Document History

| Version | Date | Changes | Author |
|---------|------|---------|--------|
| 1.0 | 2025-12-31 | Initial production spec from Deep Think analysis | BMAD Party Mode |
| 1.1 | 2026-01-01 | Added reference to Avatar Prompt Library | BMAD |

---

## Related Documents

- **[Avatar Prompt Library](./avatar-prompt-library.md)** - Complete prompts for all 5 archetypes × 5 evolution stages (25 total prompts)
- [Story 1.5: Avatar Generation](../stories/1.5.avatar-generation.story.md) - User story and acceptance criteria
- Original Deep Think responses: `docs/COPIED FILES FOR DEEP THINK FULL PARTY/RESPONSE/`

---

*This document supersedes all previous avatar generation architecture documents.*
