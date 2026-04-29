'use strict';

// Base32 RFC 4648 alphabet: A-Z 2-7
const ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const LOOKUP = new Uint8Array(256).fill(255);
for (let i = 0; i < ALPHA.length; i++) LOOKUP[ALPHA.charCodeAt(i)] = i;

const decoder = {
  id: 'base32',
  label: 'Base32',
  accepts: 'string',
  decode(input) {
    if (input === '') return { text: '' };

    const clean = input.trim().toUpperCase().replace(/=+$/, '');
    const bytes = [];
    let bits = 0;
    let val = 0;

    for (let i = 0; i < clean.length; i++) {
      const c = LOOKUP[clean.charCodeAt(i)];
      if (c === 255) {
        return { text: '', error: `Invalid Base32 character at position ${i}: '${clean[i]}'` };
      }
      val = (val << 5) | c;
      bits += 5;
      if (bits >= 8) {
        bytes.push((val >>> (bits - 8)) & 0xff);
        bits -= 8;
      }
    }

    const uint8 = new Uint8Array(bytes);
    try {
      const text = new TextDecoder('utf-8', { fatal: true }).decode(uint8);
      return { text };
    } catch {
      return { text: '', bytes: uint8 };
    }
  },
};

module.exports = decoder;
