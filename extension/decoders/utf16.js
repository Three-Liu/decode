'use strict';

const decoder = {
  id: 'utf16',
  label: 'UTF-16',
  accepts: 'string',
  decode(input) {
    if (input === '') return { text: '' };

    // Base64 → bytes → UTF-16 decode
    let bytes;
    try {
      let normalized = input.trim().replace(/-/g, '+').replace(/_/g, '/');
      const pad = normalized.length % 4;
      if (pad === 2) normalized += '==';
      else if (pad === 3) normalized += '=';
      if (typeof Buffer !== 'undefined') {
        bytes = new Uint8Array(Buffer.from(normalized, 'base64'));
      } else {
        const binaryStr = atob(normalized);
        bytes = new Uint8Array(binaryStr.length);
        for (let i = 0; i < binaryStr.length; i++) bytes[i] = binaryStr.charCodeAt(i);
      }
    } catch (e) {
      return { text: '', error: `UTF-16: Base64 decode failed — ${e.message}` };
    }

    // 检测 BOM 决定字节序；默认 LE
    let encoding = 'utf-16le';
    let start = 0;
    if (bytes.length >= 2) {
      if (bytes[0] === 0xff && bytes[1] === 0xfe) { encoding = 'utf-16le'; start = 2; }
      else if (bytes[0] === 0xfe && bytes[1] === 0xff) { encoding = 'utf-16be'; start = 2; }
    }

    try {
      const text = new TextDecoder(encoding, { fatal: true }).decode(bytes.slice(start));
      return { text };
    } catch (e) {
      // 若 LE 失败，尝试 BE
      if (encoding === 'utf-16le') {
        try {
          const text = new TextDecoder('utf-16be', { fatal: true }).decode(bytes.slice(start));
          return { text };
        } catch {}
      }
      return { text: '', error: `UTF-16 decode failed: ${e.message}` };
    }
  },
};

module.exports = decoder;
