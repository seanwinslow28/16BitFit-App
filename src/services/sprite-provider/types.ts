/**
 * Pixel-sprite provider abstraction.
 *
 * The user is evaluating OpenAI Images, Nano Banana 2, and PixelLab.ai. All
 * three implement IPixelSpriteProvider so the calling code does not change
 * when the winner is chosen.
 */

export interface SpriteRequest {
  selfieDataUri: string;       // base64 data URI from the device picker
  styleHint?: string;          // optional flavor (e.g., "fitness archetype: powerlifter")
  evolutionStage?: number;     // 0..n — Pokemon-style evolution stage
}

export interface SpriteResult {
  spriteUrl: string;           // remote URL or data URI
  width: number;
  height: number;
  providerId: 'openai' | 'nano-banana' | 'pixellab';
  rawProviderResponse?: unknown;
}

export interface IPixelSpriteProvider {
  readonly id: 'openai' | 'nano-banana' | 'pixellab';
  generate(request: SpriteRequest): Promise<SpriteResult>;
}
