const decoder = require('../../extension/decoders/utf16');

describe('utf16 decoder', () => {
  test('metadata', () => {
    expect(decoder.id).toBe('utf16');
    expect(decoder.accepts).toBe('string');
  });

  test('decodes UTF-16 LE (no BOM) from Base64', () => {
    // "Hi" in UTF-16 LE: 48 00 69 00
    const b64 = Buffer.from([0x48, 0x00, 0x69, 0x00]).toString('base64');
    const result = decoder.decode(b64);
    expect(result.error).toBeUndefined();
    expect(result.text).toBe('Hi');
  });

  test('decodes UTF-16 LE with BOM from Base64', () => {
    // BOM + "Hi" in UTF-16 LE
    const b64 = Buffer.from([0xff, 0xfe, 0x48, 0x00, 0x69, 0x00]).toString('base64');
    const result = decoder.decode(b64);
    expect(result.error).toBeUndefined();
    expect(result.text).toBe('Hi');
  });

  test('odd-length bytes (invalid UTF-16) returns error', () => {
    // Single byte → invalid for UTF-16
    const b64 = Buffer.from([0x41]).toString('base64'); // 'QQ=='
    const result = decoder.decode(b64);
    expect(result.error).toBeDefined();
  });

  test('empty string returns empty', () => {
    expect(decoder.decode('')).toEqual({ text: '' });
  });
});
