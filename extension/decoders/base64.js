const decoder = {
  id: 'base64',
  label: 'Base64',
  accepts: 'string',
  decode(input) {
    if (input === '') return { text: '' };

    let normalized = input.replace(/-/g, '+').replace(/_/g, '/');
    const pad = normalized.length % 4;
    if (pad === 2) normalized += '==';
    else if (pad === 3) normalized += '=';

    if (/[^A-Za-z0-9+/=]/.test(normalized)) {
      const match = normalized.match(/[^A-Za-z0-9+/=]/);
      const pos = normalized.indexOf(match[0]);
      return { text: '', error: `Invalid Base64: unexpected character at position ${pos}` };
    }

    let bytes;
    try {
      if (typeof Buffer !== 'undefined') {
        bytes = Buffer.from(normalized, 'base64');
      } else {
        const binaryStr = atob(normalized);
        bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
      }
    } catch (e) {
      return { text: '', error: `Invalid Base64: ${e.message}` };
    }

    try {
      const td = typeof TextDecoder !== 'undefined'
        ? new TextDecoder('utf-8', { fatal: true })
        : { decode: (b) => Buffer.from(b).toString('utf8') };
      const text = td.decode(bytes);
      return { text };
    } catch {
      return { text: '', bytes: bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes) };
    }
  },
};

module.exports = decoder;
