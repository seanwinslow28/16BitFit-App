import {
  OpenAISpriteProvider,
  NanoBananaSpriteProvider,
  PixelLabSpriteProvider,
} from '../index';

describe('sprite providers (stubs)', () => {
  const req = {selfieDataUri: 'data:image/png;base64,xxx'};

  it('OpenAI provider throws not-implemented', async () => {
    await expect(new OpenAISpriteProvider().generate(req)).rejects.toThrow(/not implemented/i);
  });
  it('Nano Banana provider throws not-implemented', async () => {
    await expect(new NanoBananaSpriteProvider().generate(req)).rejects.toThrow(/not implemented/i);
  });
  it('PixelLab provider throws not-implemented', async () => {
    await expect(new PixelLabSpriteProvider().generate(req)).rejects.toThrow(/not implemented/i);
  });
});
