const decoder = {
  id: 'gzip',
  label: 'Gzip',
  accepts: 'string',
  async decode(input) {
    if (typeof DecompressionStream === 'undefined') {
      return { text: '', error: 'gzip 解压需要 Chrome 80+ 或现代浏览器' };
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
      return { text: '', error: `gzip: Base64 decode failed — ${e.message}` };
    }

    try {
      const ds = new DecompressionStream('gzip');
      const writer = ds.writable.getWriter();
      const reader = ds.readable.getReader();

      // Write and close; attach error handler to suppress unhandled rejection
      // from the writer side when decompression fails
      const writePromise = writer.write(bytes).then(() => writer.close()).catch(() => {});

      const chunks = [];
      try {
        let done = false;
        while (!done) {
          const { value, done: d } = await reader.read();
          if (d) {
            done = true;
          } else {
            chunks.push(value);
          }
        }
      } catch (e) {
        // Drain writePromise to avoid unhandled rejection
        await writePromise;
        return { text: '', error: `gzip decompression failed: ${e.message}` };
      }

      await writePromise;

      const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of chunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }

      try {
        const text = new TextDecoder('utf-8', { fatal: true }).decode(combined);
        return { text };
      } catch {
        return { text: '', bytes: combined };
      }
    } catch (e) {
      return { text: '', error: `gzip decompression failed: ${e.message}` };
    }
  },
};

module.exports = decoder;
