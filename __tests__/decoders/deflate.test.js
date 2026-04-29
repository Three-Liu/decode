const decoder = require('../../extension/decoders/deflate');

describe('deflate decoder', () => {
  test('metadata', () => {
    expect(decoder.id).toBe('deflate');
    expect(decoder.accepts).toBe('string');
  });

  test('DecompressionStream unavailable → error', async () => {
    const orig = global.DecompressionStream;
    delete global.DecompressionStream;
    const result = await decoder.decode('eJwrSS0uAQADYAF/');
    expect(result.error).toMatch(/ZLIB/);
    expect(result.text).toBe('');
    if (orig) global.DecompressionStream = orig;
  });

  test('valid Base64 but not deflate returns error', async () => {
    // "AAECBA==" decodes to bytes [0x00, 0x01, 0x02, 0x04] — not deflate
    const result = await decoder.decode('AAECBA==');
    expect(result.error).toMatch(/decompression failed/);
    expect(result.text).toBe('');
  });
});
