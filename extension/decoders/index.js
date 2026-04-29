const base64   = require('./base64');
const url      = require('./url');
const html     = require('./html');
const hex      = require('./hex');
const zstd     = require('./zstd');
const jwt      = require('./jwt');
const unicode  = require('./unicode');
const gzip     = require('./gzip');
const deflate  = require('./deflate');
const utf16    = require('./utf16');
const base32   = require('./base32');
const cookie   = require('./cookie');

// 解压类：Base64 → 解压 → 文本/bytes
const DECOMPRESS_DECODERS = [gzip, deflate, zstd];

// 解码类：文本 → 文本
const DECODE_DECODERS = [base64, base32, url, unicode, utf16, jwt, cookie, html, hex];

// 全量列表（供 index.decode() 查找）
const DECODERS = [...DECOMPRESS_DECODERS, ...DECODE_DECODERS];

function decode(id, input) {
  const decoder = DECODERS.find((d) => d.id === id);
  if (!decoder) return { text: '', error: `Unknown decoder: ${id}` };
  return decoder.decode(input);
}

module.exports = { DECODERS, DECOMPRESS_DECODERS, DECODE_DECODERS, decode };
