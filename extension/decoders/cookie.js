'use strict';

const decoder = {
  id: 'cookie',
  label: 'Cookie',
  accepts: 'string',
  decode(input) {
    if (input === '') return { text: '' };

    const pairs = input.split(';');
    const result = {};
    for (const pair of pairs) {
      const idx = pair.indexOf('=');
      if (idx === -1) {
        const k = pair.trim();
        if (k) result[k] = '';
        continue;
      }
      const key = pair.slice(0, idx).trim();
      let val = pair.slice(idx + 1).trim();
      // URL-decode value（Cookie 值常用 URL 编码）
      try { val = decodeURIComponent(val); } catch { /* keep raw */ }
      result[key] = val;
    }

    if (Object.keys(result).length === 0) {
      return { text: '', error: 'No valid cookie pairs found' };
    }
    return { text: JSON.stringify(result, null, 2) };
  },
};

module.exports = decoder;
