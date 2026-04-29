const decoder = {
  id: 'unicode',
  label: 'Unicode Escape',
  accepts: 'string',
  decode(input) {
    if (input === '') return { text: '' };

    let result = '';
    let i = 0;
    while (i < input.length) {
      if (input[i] === '\\' && input[i + 1] === 'u') {
        const hexPart = input.slice(i + 2, i + 6);
        if (/^[0-9a-fA-F]{4}$/.test(hexPart)) {
          result += String.fromCharCode(parseInt(hexPart, 16));
          i += 6;
        } else {
          return { text: '', error: `Invalid unicode escape: \\u${hexPart} at position ${i}` };
        }
      } else {
        result += input[i];
        i++;
      }
    }

    return { text: result };
  },
};

module.exports = decoder;
