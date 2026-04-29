const decoder = require('../../extension/decoders/base64');

describe('base64 decoder', () => {
  test('standard Base64: SGVsbG8= → Hello', () => {
    expect(decoder.decode('SGVsbG8=')).toEqual({ text: 'Hello' });
  });

  test('URL-safe Base64: - and _ replace + and /', () => {
    // "Man" standard Base64 = "TWFu" (no special chars), use a string whose b64 has + or /
    // bytes [0xfb, 0xef, 0xbe] → standard: "++++..." — use "~?" → standard "+/8=" → url-safe "-_8="
    // Simplest: encode the bytes [0xfb, 0xff, 0xfe] = "++/+" → take "-_8" (no padding) → binary
    // Use a known mapping: "Man>" standard="TWFuPg==" no special chars
    // Use bytes [0x00, 0xf9, 0xff] → standard "APn/" → url-safe "APn_" → binary output
    const result = decoder.decode('APn_');
    expect(result.bytes).toBeDefined();
    expect(Array.from(result.bytes)).toEqual([0x00, 0xf9, 0xff]);
  });

  test('no padding: SGVsbG8 → Hello', () => {
    expect(decoder.decode('SGVsbG8')).toEqual({ text: 'Hello' });
  });

  test('empty string → { text: "" }', () => {
    expect(decoder.decode('')).toEqual({ text: '' });
  });

  test('invalid character → error', () => {
    const result = decoder.decode('SGVs!G8=');
    expect(result.error).toMatch(/Invalid Base64/);
    expect(result.text).toBe('');
  });

  test('UTF-8 Chinese characters decoded correctly', () => {
    const chinese = '你好';
    const bytes = Buffer.from(chinese, 'utf8');
    const encoded = bytes.toString('base64');
    expect(decoder.decode(encoded)).toEqual({ text: chinese });
  });
});
