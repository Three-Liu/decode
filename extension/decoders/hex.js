const decoder = {
  id: 'hex',
  label: 'Hex',
  accepts: 'string',
  decode(input) {
    if (input === '') return { text: '' };

    let hex = input.trim();
    if (hex.startsWith('0x') || hex.startsWith('0X')) {
      hex = hex.slice(2);
    }
    hex = hex.replace(/\s+/g, '');

    if (hex.length % 2 !== 0) {
      return { text: '', error: 'Invalid hex: odd length' };
    }

    if (/[^0-9a-fA-F]/.test(hex)) {
      return { text: '', error: 'Invalid hex: non-hex character' };
    }

    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.slice(i, i + 2), 16);
    }

    try {
      let text;
      if (typeof TextDecoder !== 'undefined') {
        text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      } else {
        text = Buffer.from(bytes).toString('utf8');
        // Node's toString doesn't throw on invalid UTF-8, use a stricter check
        if (Buffer.from(text, 'utf8').compare(bytes) !== 0) {
          throw new Error('invalid utf-8');
        }
      }
      return { text };
    } catch {
      return { text: '', bytes };
    }
  },
};

module.exports = decoder;
