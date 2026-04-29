const decoder = require('../../extension/decoders/base32');

describe('base32 decoder', () => {
  test('metadata', () => {
    expect(decoder.id).toBe('base32');
    expect(decoder.accepts).toBe('string');
  });

  test('decodes "JBSWY3DPFQQFO33SNRSCC===" → "Hello, World!"', () => {
    const result = decoder.decode('JBSWY3DPFQQFO33SNRSCC===');
    expect(result.error).toBeUndefined();
    expect(result.text).toBe('Hello, World!');
  });

  test('decodes "JBSWY3DPEBLW64TMMQ======" → "Hello World"', () => {
    const result = decoder.decode('JBSWY3DPEBLW64TMMQ======');
    expect(result.error).toBeUndefined();
    expect(result.text).toBe('Hello World');
  });

  test('decodes lowercase input', () => {
    const result = decoder.decode('jbswy3dpfqqfo33snrscc===');
    expect(result.error).toBeUndefined();
    expect(result.text).toBe('Hello, World!');
  });

  test('invalid character returns error', () => {
    const result = decoder.decode('JBSWY3DP!!!!');
    expect(result.error).toMatch(/Invalid Base32/);
    expect(result.text).toBe('');
  });

  test('empty string returns empty', () => {
    expect(decoder.decode('')).toEqual({ text: '' });
  });
});
