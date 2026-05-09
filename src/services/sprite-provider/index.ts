import {IPixelSpriteProvider} from './types';
import {OpenAISpriteProvider} from './openai';
import {NanoBananaSpriteProvider} from './nano-banana';
import {PixelLabSpriteProvider} from './pixellab';

export * from './types';
export {OpenAISpriteProvider, NanoBananaSpriteProvider, PixelLabSpriteProvider};

/**
 * Active provider — flip this single line once the evaluation is done.
 * Until then, this throws on use.
 */
export const spriteProvider: IPixelSpriteProvider = new OpenAISpriteProvider();
