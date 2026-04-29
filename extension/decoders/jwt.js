function base64UrlDecode(str) {
  let normalized = str.replace(/-/g, '+').replace(/_/g, '/');
  const pad = normalized.length % 4;
  if (pad === 2) normalized += '==';
  else if (pad === 3) normalized += '=';

  if (typeof Buffer !== 'undefined') {
    return Buffer.from(normalized, 'base64').toString('utf8');
  }
  const binaryStr = atob(normalized);
  const bytes = new Uint8Array(binaryStr.length);
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i);
  }
  return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
}

const decoder = {
  id: 'jwt',
  label: 'JWT',
  accepts: 'string',
  decode(input) {
    if (input === '') return { text: '' };

    const parts = input.split('.');
    if (parts.length < 2 || parts.length > 3) {
      return { text: '', error: 'Invalid JWT: expected 2-3 dot-separated parts' };
    }

    let header, payload;
    try {
      header = JSON.parse(base64UrlDecode(parts[0]));
    } catch (e) {
      return { text: '', error: `JWT decode failed: header - ${e.message}` };
    }

    let payloadStr;
    try {
      payloadStr = base64UrlDecode(parts[1]);
    } catch (e) {
      return { text: '', error: `JWT decode failed: payload - ${e.message}` };
    }

    try {
      payload = JSON.parse(payloadStr);
    } catch {
      return { text: '', error: 'JWT payload is not valid JSON' };
    }

    return { text: JSON.stringify({ header, payload }, null, 2) };
  },
};

module.exports = decoder;
