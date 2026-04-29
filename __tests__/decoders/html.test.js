const decoder = require('../../extension/decoders/html');

describe('html decoder', () => {
  test('named entity: &amp; → &', () => {
    expect(decoder.decode('&amp;')).toEqual({ text: '&' });
  });

  test('named entity: &lt; → <', () => {
    expect(decoder.decode('&lt;')).toEqual({ text: '<' });
  });

  test('decimal entity: &#72; → H', () => {
    expect(decoder.decode('&#72;')).toEqual({ text: 'H' });
  });

  test('hex entity: &#x48; → H', () => {
    expect(decoder.decode('&#x48;')).toEqual({ text: 'H' });
  });

  test('mixed: &lt;br&gt; → <br>', () => {
    expect(decoder.decode('&lt;br&gt;')).toEqual({ text: '<br>' });
  });

  test('unknown entity passes through: &unknown; → &unknown;', () => {
    expect(decoder.decode('&unknown;')).toEqual({ text: '&unknown;' });
  });
});
