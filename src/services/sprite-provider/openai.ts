import {IPixelSpriteProvider, SpriteRequest, SpriteResult} from './types';

export class OpenAISpriteProvider implements IPixelSpriteProvider {
  readonly id = 'openai' as const;
  async generate(_req: SpriteRequest): Promise<SpriteResult> {
    throw new Error('OpenAISpriteProvider not implemented yet — pending API selection.');
  }
}
