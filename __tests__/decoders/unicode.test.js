const decoder = require('../../extension/decoders/unicode');

describe('unicode decoder', () => {
  test('pure escapes: \\u0048\\u0065\\u006c\\u006c\\u006f → Hello', () => {
    expect(decoder.decode('\\u0048\\u0065\\u006c\\u006c\\u006f')).toEqual({ text: 'Hello' });
  });

  test('mixed: he\\u006c\\u006co → hello', () => {
    expect(decoder.decode('he\\u006c\\u006co')).toEqual({ text: 'hello' });
  });

  test('invalid escape: \\uxyz → error', () => {
    const result = decoder.decode('\\uxyz1');
    expect(result.error).toMatch(/Invalid unicode escape/);
    expect(result.text).toBe('');
  });
});
