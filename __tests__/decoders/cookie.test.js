const decoder = require('../../extension/decoders/cookie');

describe('cookie decoder', () => {
  test('metadata', () => {
    expect(decoder.id).toBe('cookie');
    expect(decoder.accepts).toBe('string');
  });

  test('parses standard cookie string', () => {
    const result = decoder.decode('session=abc123; user=alice; theme=dark');
    expect(result.error).toBeUndefined();
    const obj = JSON.parse(result.text);
    expect(obj.session).toBe('abc123');
    expect(obj.user).toBe('alice');
    expect(obj.theme).toBe('dark');
  });

  test('URL-decodes values', () => {
    const result = decoder.decode('name=Hello%20World');
    const obj = JSON.parse(result.text);
    expect(obj.name).toBe('Hello World');
  });

  test('handles flag-only key (no value)', () => {
    const result = decoder.decode('HttpOnly; Secure; session=abc');
    const obj = JSON.parse(result.text);
    expect(obj.HttpOnly).toBe('');
    expect(obj.Secure).toBe('');
    expect(obj.session).toBe('abc');
  });

  test('empty string returns empty', () => {
    expect(decoder.decode('')).toEqual({ text: '' });
  });
});
