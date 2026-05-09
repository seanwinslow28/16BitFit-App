import {IPixelSpriteProvider, SpriteRequest, SpriteResult} from './types';

export class PixelLabSpriteProvider implements IPixelSpriteProvider {
  readonly id = 'pixellab' as const;
  async generate(_req: SpriteRequest): Promise<SpriteResult> {
    throw new Error('PixelLabSpriteProvider not implemented yet — pending API selection.');
  }
}
