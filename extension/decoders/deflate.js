'use strict';

const decoder = {
  id: 'deflate',
  label: 'ZLIB / Deflate',
  accepts: 'string',
  async decode(input) {
    if (typeof DecompressionStream === 'undefined') {
      return { text: '', error: 'ZLIB 解压需要 Chrome 80+ 或现代浏览器' };
    }

    // Base64/Base64url → bytes
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
      return { text: '', error: `ZLIB: Base64 decode failed — ${e.message}` };
    }

    // 尝试 deflate-raw（Java Deflater 默认无 zlib 头，也叫 raw deflate）
    // 再尝试 deflate（有 zlib 头，78 9C / 78 DA 等）
    const modes = ['deflate-raw', 'deflate'];
    for (const mode of modes) {
      const result = await tryDecompress(bytes, mode);
      if (result) return result;
    }
    return { text: '', error: 'ZLIB decompression failed: invalid deflate data' };
  },
};

async function tryDecompress(bytes, mode) {
  try {
    const ds = new DecompressionStream(mode);
    const writer = ds.writable.getWriter();
    const reader = ds.readable.getReader();
    const writePromise = writer.write(bytes).then(() => writer.close()).catch(() => {});
    const chunks = [];
    try {
      let done = false;
      while (!done) {
        const { value, done: d } = await reader.read();
        if (d) done = true; else chunks.push(value);
      }
    } catch {
      await writePromise;
      return null; // 这个 mode 失败，继续试下一个
    }
    await writePromise;
    const total = chunks.reduce((s, c) => s + c.length, 0);
    const combined = new Uint8Array(total);
    let off = 0;
    for (const c of chunks) { combined.set(c, off); off += c.length; }
    try {
      return { text: new TextDecoder('utf-8', { fatal: true }).decode(combined) };
    } catch {
      return { text: '', bytes: combined };
    }
  } catch {
    return null;
  }
}

module.exports = decoder;
