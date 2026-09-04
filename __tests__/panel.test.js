'use strict';

const { openPanel, removePanel, recommendDecoder, isBinary } = require('../extension/content_scripts/panel.js');

const decoders = [
  { id: 'gzip', label: 'Gzip' },
  { id: 'zstd', label: 'Zstd' },
  { id: 'deflate', label: 'Deflate' },
  { id: 'jwt', label: 'JWT' },
  { id: 'unicode', label: 'Unicode' },
  { id: 'url', label: 'URL' },
  { id: 'base64', label: 'Base64' },
];

describe('panel format recommendations', () => {
  test('prefers JWT structure over generic Base64', () => {
    expect(recommendDecoder('eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxIn0.sig', decoders).id).toBe('jwt');
  });

  test('recognizes compression magic bytes encoded as Base64', () => {
    expect(recommendDecoder('H4sIAAAAAAA=', decoders).id).toBe('gzip');
    expect(recommendDecoder('KLUv/Q==', decoders).id).toBe('zstd');
  });

  test('recognizes URL and Unicode escape syntax', () => {
    expect(recommendDecoder('%48%65%6c%6c%6f', decoders).id).toBe('url');
    expect(recommendDecoder('hello\\u0020world', decoders).id).toBe('unicode');
  });

  test('does not guess short ordinary text', () => {
    expect(recommendDecoder('abc', decoders)).toBeNull();
    expect(recommendDecoder('hello world', decoders)).toBeNull();
  });
});

test('binary output is identified only when bytes are present', () => {
  expect(isBinary({ text: '', bytes: new Uint8Array([1, 2]) })).toBe(true);
  expect(isBinary({ text: 'text', bytes: new Uint8Array([1]) })).toBe(false);
  expect(isBinary({ text: '' })).toBe(false);
});

describe('panel automatic decode', () => {
  afterEach(() => {
    removePanel();
    localStorage.clear();
  });

  test('automatically decodes a high-confidence Base64 selection', async () => {
    openPanel('SGVsbG8=', { top: 20, bottom: 40, left: 20 });
    await new Promise((resolve) => setTimeout(resolve, 0));
    const host = document.getElementById('decodec-panel-host');
    expect(host.shadowRoot.textContent).toContain('Hello');
    expect(host.shadowRoot.querySelector('.step.active-source')).not.toBeNull();
  });

  test('closes the panel with Escape', () => {
    openPanel('plain text', { top: 20, bottom: 40, left: 20 });
    expect(document.getElementById('decodec-panel-host')).not.toBeNull();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.getElementById('decodec-panel-host')).toBeNull();
  });

  test('shows recent decode history and supports language switching', async () => {
    openPanel('SGVsbG8=', { top: 20, bottom: 40, left: 20 });
    await new Promise((resolve) => setTimeout(resolve, 0));
    const host = document.getElementById('decodec-panel-host');
    host.shadowRoot.querySelector('.icon-btn').click();
    expect(host.shadowRoot.querySelector('.history-item')).not.toBeNull();
    host.shadowRoot.querySelector('.icon-btn').click();
    const buttons = host.shadowRoot.querySelectorAll('.icon-btn');
    const languageButton = buttons[1];
    languageButton.click();
    expect(host.shadowRoot.querySelector('.mode-btn').textContent).toContain('切换到编码');
  });

});
