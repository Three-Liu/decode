const { DECODERS, DECOMPRESS_DECODERS, DECODE_DECODERS, decode } = require('../../extension/decoders/index');

describe('index', () => {
  test('DECODERS array contains all required decoders', () => {
    const ids = DECODERS.map((d) => d.id);
    ['base64', 'base32', 'url', 'html', 'hex', 'zstd', 'jwt', 'unicode', 'utf16', 'gzip', 'deflate', 'cookie'].forEach((id) => {
      expect(ids).toContain(id);
    });
  });

  test('DECOMPRESS_DECODERS contains gzip, deflate, zstd', () => {
    const ids = DECOMPRESS_DECODERS.map((d) => d.id);
    expect(ids).toContain('gzip');
    expect(ids).toContain('deflate');
    expect(ids).toContain('zstd');
  });

  test('DECODE_DECODERS contains base64, base32, url, unicode, utf16, jwt, cookie', () => {
    const ids = DECODE_DECODERS.map((d) => d.id);
    ['base64', 'base32', 'url', 'unicode', 'utf16', 'jwt', 'cookie'].forEach((id) => {
      expect(ids).toContain(id);
    });
  });

  test('every decoder has id, label, accepts fields', () => {
    DECODERS.forEach((d) => {
      expect(typeof d.id).toBe('string');
      expect(typeof d.label).toBe('string');
      expect(['string', 'bytes', 'both']).toContain(d.accepts);
    });
  });

  test("decode('base64', 'SGVsbG8=') → { text: 'Hello' }", () => {
    expect(decode('base64', 'SGVsbG8=')).toEqual({ text: 'Hello' });
  });

  test("decode('unknown_format', 'xxx') → error", () => {
    const result = decode('unknown_format', 'xxx');
    expect(result.error).toMatch(/Unknown decoder/);
    expect(result.text).toBe('');
  });
});
