const decoder = require('../../extension/decoders/zstd');

// Base64-encoded zstd fixtures (the decoder now accepts Base64 strings)
const HELLO_WORLD_B64 = 'KLUv/SQLWQAASGVsbG8gV29ybGTCWyQZ';          // → "Hello World"
const BASE64_STR_B64  = 'KLUv/SQQgQAAU0dWc2JHOGdWMjl5YkdRPZbCsj8='; // → "SGVsbG8gV29ybGQ="
const BINARY_B64      = 'KLUv/SQDGQAA//79EKFFeA==';                   // → [0xff, 0xfe, 0xfd]

describe('zstd decoder', () => {
  test('decoder has correct metadata', () => {
    expect(decoder.id).toBe('zstd');
    expect(decoder.accepts).toBe('string');
  });

  test('decompresses Base64-encoded zstd → "Hello World"', () => {
    const result = decoder.decode(HELLO_WORLD_B64);
    expect(result.error).toBeUndefined();
    expect(result.text).toBe('Hello World');
  });

  test('decompresses Base64-encoded zstd → base64 string content', () => {
    const result = decoder.decode(BASE64_STR_B64);
    expect(result.error).toBeUndefined();
    expect(result.text).toBe('SGVsbG8gV29ybGQ=');
  });

  test('binary output (non-UTF-8) returns bytes instead of text', () => {
    const result = decoder.decode(BINARY_B64);
    expect(result.text).toBe('');
    expect(result.bytes).toBeDefined();
    expect(Array.from(result.bytes)).toEqual([0xff, 0xfe, 0xfd]);
  });

  test('invalid Base64 returns error', () => {
    const result = decoder.decode('!!!not-base64!!!');
    expect(result.error).toBeDefined();
    expect(result.text).toBe('');
  });

  test('valid Base64 but not zstd data returns error', () => {
    // "AAEC" decodes to bytes [0x00, 0x01, 0x02] — not a valid zstd frame
    const result = decoder.decode('AAEC');
    expect(result.error).toMatch(/zstd decompression failed/);
    expect(result.text).toBe('');
  });
});
