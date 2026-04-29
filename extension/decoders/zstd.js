// zstd.js — Zstandard decoder using fzstd (pure-JS, no WASM)
// fzstd: https://github.com/101arrowz/fzstd

let fzstd = null;

function loadFzstd() {
  if (fzstd) return fzstd;
  try {
    fzstd = require('fzstd');
  } catch (e) {
    throw new Error('fzstd not available: ' + e.message);
  }
  return fzstd;
}

const decoder = {
  id: 'zstd',
  label: 'Zstd',
  accepts: 'string',
  decode(input) {
    let mod;
    try {
      mod = loadFzstd();
    } catch (e) {
      return { text: '', error: 'zstd: ' + e.message };
    }

    // 将 Base64/Base64url 字符串转成 bytes
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
        for (let i = 0; i < binaryStr.length; i++) {
          bytes[i] = binaryStr.charCodeAt(i);
        }
      }
    } catch (e) {
      return { text: '', error: `zstd: Base64 decode failed — ${e.message}` };
    }

    let result;
    try {
      result = mod.decompress(bytes);
    } catch (e) {
      return { text: '', error: 'zstd decompression failed: ' + e.message };
    }

    try {
      const text = new TextDecoder('utf-8', { fatal: true }).decode(result);
      return { text };
    } catch {
      return { text: '', bytes: result };
    }
  },
};

module.exports = decoder;
