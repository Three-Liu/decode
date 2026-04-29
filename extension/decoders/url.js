const decoder = {
  id: 'url',
  label: 'URL',
  accepts: 'string',
  decode(input) {
    if (input === '') return { text: '' };

    const withSpaces = input.replace(/\+/g, ' ');
    try {
      const text = decodeURIComponent(withSpaces);
      return { text };
    } catch (e) {
      return { text: '', error: `Invalid URL encoding: ${e.message}` };
    }
  },
};

module.exports = decoder;
