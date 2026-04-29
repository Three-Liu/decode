const decoder = require('../../extension/decoders/gzip');

// Base64-encoded gzip fixture: gzip("Hello World")
// Generated: echo -n "Hello World" | gzip | base64
const HELLO_WORLD_GZ_B64 = 'H4sIAAAAAAAAE/NIzcnJVwjPL8pJAQBWsRdKCwAAAA==';

describe('gzip decoder', () => {
  test('decoder has correct metadata', () => {
    expect(decoder.id).toBe('gzip');
    expect(decoder.accepts).toBe('string');
  });

  test('DecompressionStream unavailable → error with Chrome 80 message', async () => {
    const originalDS = global.DecompressionStream;
    delete global.DecompressionStream;

    const result = await decoder.decode(HELLO_WORLD_GZ_B64);
    expect(result.error).toMatch(/Chrome 80/);
    expect(result.text).toBe('');

    if (originalDS) global.DecompressionStream = originalDS;
  });

  test('invalid Base64 input returns error', async () => {
    const result = await decoder.decode('!!!not-base64!!!');
    expect(result.error).toBeDefined();
    expect(result.text).toBe('');
  });
});
