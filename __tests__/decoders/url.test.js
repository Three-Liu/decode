const decoder = require('../../extension/decoders/url');

describe('url decoder', () => {
  test('basic: %48%65%6c%6c%6f → Hello', () => {
    expect(decoder.decode('%48%65%6c%6c%6f')).toEqual({ text: 'Hello' });
  });

  test('mixed: Hello%20World → Hello World', () => {
    expect(decoder.decode('Hello%20World')).toEqual({ text: 'Hello World' });
  });

  test('plus sign: hello+world → hello world', () => {
    expect(decoder.decode('hello+world')).toEqual({ text: 'hello world' });
  });

  test('double encoded (single step): %2548 → %48', () => {
    expect(decoder.decode('%2548')).toEqual({ text: '%48' });
  });

  test('invalid sequence: %%invalid → error', () => {
    const result = decoder.decode('%%invalid');
    expect(result.error).toMatch(/Invalid URL/);
    expect(result.text).toBe('');
  });

  test('empty string → { text: "" }', () => {
    expect(decoder.decode('')).toEqual({ text: '' });
  });
});
