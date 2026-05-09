import {IPixelSpriteProvider, SpriteRequest, SpriteResult} from './types';

export class NanoBananaSpriteProvider implements IPixelSpriteProvider {
  readonly id = 'nano-banana' as const;
  async generate(_req: SpriteRequest): Promise<SpriteResult> {
    throw new Error('NanoBananaSpriteProvider not implemented yet — pending API selection.');
  }
}
