const decoder = require('../../extension/decoders/jwt');

const HEADER = { alg: 'HS256', typ: 'JWT' };
const PAYLOAD = { sub: '1234567890', name: 'John Doe', iat: 1516239022 };

function base64UrlEncode(obj) {
  const json = JSON.stringify(obj);
  return Buffer.from(json, 'utf8').toString('base64')
    .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

describe('jwt decoder', () => {
  test('standard 3-part JWT → header + payload JSON', () => {
    const token = `${base64UrlEncode(HEADER)}.${base64UrlEncode(PAYLOAD)}.fakesignature`;
    const result = decoder.decode(token);
    expect(result.text).toBeTruthy();
    const parsed = JSON.parse(result.text);
    expect(parsed.header).toEqual(HEADER);
    expect(parsed.payload).toEqual(PAYLOAD);
    expect(result.text).not.toContain('fakesignature');
  });

  test('2-part JWT (alg:none) → success', () => {
    const noneHeader = { alg: 'none', typ: 'JWT' };
    const token = `${base64UrlEncode(noneHeader)}.${base64UrlEncode(PAYLOAD)}`;
    const result = decoder.decode(token);
    expect(result.text).toBeTruthy();
    const parsed = JSON.parse(result.text);
    expect(parsed.header.alg).toBe('none');
    expect(parsed.payload).toEqual(PAYLOAD);
  });

  test('1-part → error', () => {
    const result = decoder.decode('onlyonepart');
    expect(result.error).toMatch(/expected 2-3/);
    expect(result.text).toBe('');
  });

  test('non-JSON payload → error', () => {
    const badPayload = btoa('not-json').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    const token = `${base64UrlEncode(HEADER)}.${badPayload}.sig`;
    const result = decoder.decode(token);
    expect(result.error).toMatch(/not valid JSON/);
    expect(result.text).toBe('');
  });
});
