const decoder = require('../../extension/decoders/hex');

describe('hex decoder', () => {
  test('lowercase: 48656c6c6f → Hello', () => {
    expect(decoder.decode('48656c6c6f')).toEqual({ text: 'Hello' });
  });

  test('uppercase: 48656C6C6F → Hello', () => {
    expect(decoder.decode('48656C6C6F')).toEqual({ text: 'Hello' });
  });

  test('with spaces: 48 65 6c 6c 6f → Hello', () => {
    expect(decoder.decode('48 65 6c 6c 6f')).toEqual({ text: 'Hello' });
  });

  test('0x prefix: 0x48656c6c6f → Hello', () => {
    expect(decoder.decode('0x48656c6c6f')).toEqual({ text: 'Hello' });
  });

  test('odd length → error', () => {
    const result = decoder.decode('48a');
    expect(result.error).toMatch(/odd length/);
    expect(result.text).toBe('');
  });

  test('non-hex character → error', () => {
    const result = decoder.decode('GGGG');
    expect(result.error).toMatch(/non-hex/);
    expect(result.text).toBe('');
  });
});
