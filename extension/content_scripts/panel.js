/* global document, window, requestAnimationFrame, module */

'use strict';

var _i18n = (function () {
  try { return require('./i18n'); } catch (e) { return { t: function (k) { return k; } }; }
})();
var t = _i18n.t;
var setLanguage = _i18n.setLanguage || function () {};
var getLanguage = _i18n.getLanguage || function () { return 'en'; };

var PANEL_ID = 'decodec-panel-host';

// ---------------------------------------------------------------------------
// CSS
// ---------------------------------------------------------------------------

var PANEL_CSS = [
  ':host { all: initial; }',
  '.panel {',
  '  background: #fff;',
  '  border: 1px solid rgba(0,0,0,0.12);',
  '  border-radius: 10px;',
  '  width: min(400px, calc(100vw - 16px));',
  '  max-width: calc(100vw - 16px);',
  '  box-sizing: border-box;',
  '  max-height: 560px;',
  '  overflow-y: auto;',
  '  box-shadow: 0 4px 20px rgba(0,0,0,0.15);',
  '  font-family: system-ui, -apple-system, sans-serif;',
  '  font-size: 13px;',
  '  color: #1a1a1a;',
  '  user-select: none;',
  '}',
  // header
  '.header {',
  '  display: flex;',
  '  align-items: center;',
  '  justify-content: space-between;',
  '  padding: 9px 12px 7px;',
  '  border-bottom: 1px solid #f0f0f0;',
  '}',
  '.header-title {',
  '  font-weight: 600;',
  '  font-size: 12px;',
  '  color: #1a73e8;',
  '  letter-spacing: 0.03em;',
  '}',
  '.close-btn {',
  '  cursor: pointer;',
  '  background: none;',
  '  border: none;',
  '  color: #5f6368;',
  '  font-size: 16px;',
  '  line-height: 1;',
  '  padding: 0 2px;',
  '}',
  '.close-btn:hover { color: #333; }',
  // 双栏按钮区
  '.toolbar {',
  '  display: flex;',
  '  border-bottom: 1px solid #ebebeb;',
  '}',
  '.col {',
  '  flex: 1;',
  '  padding: 8px 10px;',
  '}',
  '.col + .col {',
  '  border-left: 1px solid #ebebeb;',
  '}',
  '.col-title {',
  '  font-size: 10px;',
  '  font-weight: 700;',
  '  text-transform: uppercase;',
  '  letter-spacing: 0.06em;',
  '  color: #5f6368;',
  '  margin-bottom: 6px;',
  '}',
  '.btn-wrap {',
  '  display: flex;',
  '  flex-wrap: wrap;',
  '  gap: 4px;',
  '}',
  '.decoder-btn {',
  '  padding: 3px 9px;',
  '  font-size: 11px;',
  '  border: 1px solid #ddd;',
  '  border-radius: 12px;',
  '  background: #fff;',
  '  cursor: pointer;',
  '  color: #444;',
  '  transition: background 0.1s, border-color 0.1s;',
  '}',
  '.decoder-btn:hover { background: #e8f0fe; border-color: #1a73e8; color: #1a73e8; }',
  '.decoder-btn.decompress:hover { background: #fce8f1; border-color: #c2185b; color: #c2185b; }',
  '.decoder-btn[disabled] { opacity: 0.35; cursor: default; }',
  '.decoder-btn.loading { opacity: 0.7; cursor: wait; }',
  '.icon-btn { background: none; border: 1px solid #d1d5db; border-radius: 4px; color: #5f6368; cursor: pointer; font-size: 11px; line-height: 1; padding: 3px 5px; }',
  '.icon-btn:hover { background: #f1f3f4; color: #1a73e8; border-color: #1a73e8; }',
  '.decoder-control { display: inline-flex; align-items: center; gap: 2px; }',
  '.pin-btn { background: none; border: none; color: #9aa0a6; cursor: pointer; font-size: 12px; line-height: 1; padding: 2px; }',
  '.pin-btn:hover, .pin-btn.pinned { color: #f9ab00; }',
  '.history-area { padding: 8px 12px; }',
  '.history-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; color: #5f6368; font-size: 10px; font-weight: 700; text-transform: uppercase; }',
  '.history-clear { background: none; border: none; color: #6b7280; cursor: pointer; font-size: 10px; padding: 2px; }',
  '.history-clear:hover { color: #d93025; }',
  '.history-item { border-top: 1px solid #f0f0f0; padding: 7px 0; }',
  '.history-item-label { color: #5f6368; font-size: 10px; font-weight: 600; }',
  '.history-item-input, .history-item-output { color: #3c4043; font-family: "SF Mono","Fira Code","Consolas",monospace; font-size: 10px; margin-top: 3px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }',
  '.history-item-output { color: #5f6368; }',
  '.recommendation {',
  '  padding: 7px 12px;',
  '  border-bottom: 1px solid #ebebeb;',
  '  background: #f8fbff;',
  '  color: #1a73e8;',
  '  font-size: 11px;',
  '}',
  // 结果步骤
  '.step {',
  '  padding: 8px 12px;',
  '  border-bottom: 1px solid #f5f5f5;',
  '}',
  '.step:last-child { border-bottom: none; }',
  '.step-label {',
  '  display: flex;',
  '  align-items: center;',
  '  justify-content: space-between;',
  '  font-size: 10px;',
  '  font-weight: 600;',
  '  text-transform: uppercase;',
  '  letter-spacing: 0.05em;',
  '  color: #5f6368;',
  '  margin-bottom: 4px;',
  '}',
  '.step-dismiss {',
  '  background: none;',
  '  border: none;',
  '  cursor: pointer;',
  '  color: #6b7280;',
  '  font-size: 13px;',
  '  line-height: 1;',
  '  padding: 0 0 0 4px;',
  '  flex-shrink: 0;',
  '}',
  '.step-dismiss:hover { color: #3c4043; }',
  '.step-text {',
  '  font-family: "SF Mono","Fira Code","Consolas",monospace;',
  '  font-size: 11px;',
  '  background: #f7f7f7;',
  '  border-radius: 4px;',
  '  padding: 5px 8px;',
  '  word-break: break-all;',
  '  max-height: 130px;',
  '  overflow-y: auto;',
  '  white-space: pre-wrap;',
  '  cursor: text;',
  '  user-select: text;',
  '}',
  '.step-error {',
  '  font-size: 11px;',
  '  color: #d93025;',
  '  margin-top: 2px;',
  '}',
  '.row-btns {',
  '  display: flex;',
  '  gap: 6px;',
  '  margin-top: 5px;',
  '}',
  '.copy-btn {',
  '  padding: 3px 8px;',
  '  font-size: 11px;',
  '  border: 1px solid #ddd;',
  '  border-radius: 4px;',
  '  background: #fff;',
  '  cursor: pointer;',
  '  color: #333;',
  '}',
  '.copy-btn:hover { background: #f0f0f0; }',
  '.download-btn {',
  '  padding: 3px 8px;',
  '  font-size: 11px;',
  '  border: 1px solid #1a73e8;',
  '  border-radius: 4px;',
  '  background: #e8f0fe;',
  '  cursor: pointer;',
  '  color: #1a73e8;',
  '}',
  '.download-btn:hover { background: #d2e3fc; }',
  '.empty-hint {',
  '  padding: 10px 12px;',
  '  font-size: 11px;',
  '  color: #6b7280;',
  '  font-style: italic;',
  '}',
  '.close-btn:focus-visible, .decoder-btn:focus-visible, .mode-btn:focus-visible, .step-dismiss:focus-visible { outline: 2px solid #1a73e8; outline-offset: 2px; }',
  // 编码模式
  '.mode-btn {',
  '  cursor: pointer;',
  '  background: none;',
  '  border: 1px solid #ddd;',
  '  border-radius: 4px;',
  '  color: #5f6368;',
  '  font-size: 11px;',
  '  line-height: 1;',
  '  padding: 2px 5px;',
  '  margin-right: 4px;',
  '}',
  '.mode-btn:hover { color: #333; border-color: #aaa; }',
  '.mode-btn.active { color: #1a73e8; border-color: #1a73e8; background: #e8f0fe; }',
  '.encode-area {',
  '  padding: 8px 12px;',
  '}',
  '.encode-textarea {',
  '  width: 100%;',
  '  box-sizing: border-box;',
  '  font-family: "SF Mono","Fira Code","Consolas",monospace;',
  '  font-size: 11px;',
  '  border: 1px solid #e0e0e0;',
  '  border-radius: 4px;',
  '  padding: 5px 8px;',
  '  resize: vertical;',
  '  min-height: 70px;',
  '  outline: none;',
  '  color: #1a1a1a;',
  '  background: #fafafa;',
  '}',
  '.encode-textarea:focus { border-color: #1a73e8; background: #fff; }',
  '.encode-fmts {',
  '  display: flex;',
  '  flex-wrap: wrap;',
  '  gap: 4px;',
  '  margin-top: 6px;',
  '}',
  '.fmt-btn {',
  '  padding: 3px 9px;',
  '  font-size: 11px;',
  '  border: 1px solid #ddd;',
  '  border-radius: 12px;',
  '  background: #fff;',
  '  cursor: pointer;',
  '  color: #444;',
  '  transition: background 0.1s, border-color 0.1s;',
  '}',
  '.fmt-btn:hover { background: #e8f0fe; border-color: #1a73e8; color: #1a73e8; }',
  '.fmt-btn.selected { background: #1a73e8; border-color: #1a73e8; color: #fff; }',
  '.encode-output {',
  '  margin-top: 8px;',
  '  font-family: "SF Mono","Fira Code","Consolas",monospace;',
  '  font-size: 11px;',
  '  background: #f7f7f7;',
  '  border-radius: 4px;',
  '  padding: 5px 8px;',
  '  word-break: break-all;',
  '  max-height: 130px;',
  '  overflow-y: auto;',
  '  white-space: pre-wrap;',
  '  cursor: text;',
  '  user-select: text;',
  '  color: #1a1a1a;',
  '  min-height: 28px;',
  '}',
  '.encode-output.empty { color: #6b7280; font-style: italic; }',
  '.step.active-source { border-left: 3px solid #1a73e8; padding-left: 9px; }',
  '.step-source { color: #1a73e8; font-size: 9px; font-weight: 500; text-transform: none; letter-spacing: 0; margin-left: 6px; }',
  '@media (prefers-color-scheme: dark) {',
  '  .panel { background: #202124; color: #e8eaed; border-color: #3c4043; box-shadow: 0 4px 20px rgba(0,0,0,0.45); }',
  '  .header, .toolbar, .step { border-color: #3c4043; }',
  '  .close-btn { color: #9aa0a6; } .close-btn:hover { color: #e8eaed; }',
  '  .decoder-btn, .fmt-btn, .copy-btn, .mode-btn, .icon-btn { background: #292a2d; border-color: #5f6368; color: #e8eaed; }',
  '  .decoder-btn:hover, .fmt-btn:hover, .copy-btn:hover, .mode-btn:hover { background: #3c4043; }',
  '  .step-text, .encode-output { background: #303134; color: #e8eaed; }',
  '  .encode-textarea { background: #292a2d; border-color: #5f6368; color: #e8eaed; }',
  '  .encode-textarea:focus { background: #303134; }',
  '  .col-title, .empty-hint { color: #9aa0a6; }',
  '  .recommendation { background: #1e3a5f; color: #8ab4f8; border-color: #3c4043; }',
  '  .history-header, .history-item-label, .history-item-output { color: #bdc1c6; } .history-item { border-color: #3c4043; } .history-item-input { color: #e8eaed; }',
  '}',
].join('\n');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isBinary(output) {
  return output && output.bytes instanceof Uint8Array && !output.text;
}

function base64Bytes(input) {
  try {
    var normalized = String(input).trim().replace(/-/g, '+').replace(/_/g, '/');
    if (!normalized || /[^A-Za-z0-9+/=]/.test(normalized)) return null;
    while (normalized.length % 4) normalized += '=';
    if (typeof Buffer !== 'undefined') return new Uint8Array(Buffer.from(normalized, 'base64'));
    var binary = atob(normalized);
    var bytes = new Uint8Array(binary.length);
    for (var i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  } catch (e) {
    return null;
  }
}

// Return the most specific, high-confidence decoder recommendation. Plain text
// deliberately returns null so opening the panel never creates a surprising
// failed step.
function recommendDecoder(input, decoders) {
  var text = String(input || '').trim();
  if (!text) return null;

  var byId = {};
  (decoders || []).forEach(function (decoder) { byId[decoder.id] = decoder; });

  // JWTs are structurally distinctive and must win over Base64.
  if (/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(text)) {
    if (byId.jwt) return byId.jwt;
  }

  // Compression decoders consume Base64 text. Also accept a directly selected
  // binary string when the browser exposes its byte values unchanged.
  var rawMagic = [];
  for (var ri = 0; ri < Math.min(text.length, 4); ri++) rawMagic.push(text.charCodeAt(ri) & 0xff);
  var bytes = base64Bytes(text);
  var magic = bytes && bytes.length >= 4 ? bytes : rawMagic;
  if (magic.length >= 2 && magic[0] === 0x1f && magic[1] === 0x8b && byId.gzip) return byId.gzip;
  if (magic.length >= 4 && magic[0] === 0x28 && magic[1] === 0xb5 && magic[2] === 0x2f && magic[3] === 0xfd && byId.zstd) return byId.zstd;
  if (magic.length >= 2 && magic[0] === 0x78 && (magic[1] === 0x01 || magic[1] === 0x5e || magic[1] === 0x9c || magic[1] === 0xda) && byId.deflate) return byId.deflate;

  if (/\\(?:u[0-9a-fA-F]{4}|U[0-9a-fA-F]{8})/.test(text) && byId.unicode) return byId.unicode;
  if (/(?:%[0-9a-fA-F]{2}){1,}/.test(text) && byId.url) return byId.url;

  // Require a useful length or explicit padding to avoid auto-decoding short
  // ordinary words such as "abc".
  if (text.length >= 4 || /=+$/.test(text)) {
    if (/^[A-Za-z0-9+/=_-]+$/.test(text) && bytes && bytes.length > 0 && byId.base64) return byId.base64;
  }
  return null;
}

function getDecoderGroups() {
  var mod;
  try { mod = require('../decoders/index'); } catch (e) { return { dc: [], dd: [] }; }
  return {
    dc: mod.DECOMPRESS_DECODERS || [],
    dd: mod.DECODE_DECODERS    || [],
  };
}

// ---------------------------------------------------------------------------
// Encoders
// ---------------------------------------------------------------------------

var ENCODERS = [
  {
    id: 'base64',
    label: 'Base64',
    encode: function (str) {
      try { return btoa(unescape(encodeURIComponent(str))); } catch (e) { return ''; }
    },
  },
  {
    id: 'url',
    label: 'URL',
    encode: function (str) {
      try { return encodeURIComponent(str); } catch (e) { return ''; }
    },
  },
  {
    id: 'hex',
    label: 'Hex',
    encode: function (str) {
      var out = [];
      for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        if (code > 0xff) {
          // surrogate pair / multi-byte: encode as UTF-8 bytes
          var bytes = unescape(encodeURIComponent(str[i]));
          for (var j = 0; j < bytes.length; j++) {
            out.push(('0' + bytes.charCodeAt(j).toString(16)).slice(-2));
          }
        } else {
          out.push(('0' + code.toString(16)).slice(-2));
        }
      }
      return out.join('');
    },
  },
  {
    id: 'unicode',
    label: 'Unicode',
    encode: function (str) {
      var out = [];
      for (var i = 0; i < str.length; i++) {
        var code = str.codePointAt(i);
        if (code > 0xffff) {
          out.push('\\U' + ('0000000' + code.toString(16)).slice(-8));
          i++; // skip surrogate pair
        } else if (code > 0x7e || code < 0x20) {
          out.push('\\u' + ('000' + code.toString(16)).slice(-4));
        } else {
          out.push(str[i]);
        }
      }
      return out.join('');
    },
  },
  {
    id: 'base32',
    label: 'Base32',
    encode: function (str) {
      var ALPHA = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
      // encode UTF-8 bytes
      var bytes;
      try {
        var escaped = unescape(encodeURIComponent(str));
        bytes = new Uint8Array(escaped.length);
        for (var k = 0; k < escaped.length; k++) bytes[k] = escaped.charCodeAt(k);
      } catch (e) { return ''; }
      var out = '';
      var buf = 0, bits = 0;
      for (var i = 0; i < bytes.length; i++) {
        buf = (buf << 8) | bytes[i];
        bits += 8;
        while (bits >= 5) {
          bits -= 5;
          out += ALPHA[(buf >> bits) & 0x1f];
        }
      }
      if (bits > 0) {
        out += ALPHA[(buf << (5 - bits)) & 0x1f];
      }
      // pad to multiple of 8
      while (out.length % 8 !== 0) out += '=';
      return out;
    },
  },
];

// ---------------------------------------------------------------------------
// 状态
// ---------------------------------------------------------------------------

var _panelState = null;
var _panelKeydownHandler = null;
var _panelPreviousFocus = null;
var HISTORY_KEY = 'decodec-history-v1';
var PINS_KEY = 'decodec-pinned-formats-v1';

function readStoredJson(key, fallback) {
  try {
    var parsed = JSON.parse(localStorage.getItem(key) || 'null');
    return parsed == null ? fallback : parsed;
  } catch (e) {
    return fallback;
  }
}

function writeStoredJson(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage unavailable */ }
}

function getHistory() {
  var history = readStoredJson(HISTORY_KEY, []);
  return Array.isArray(history) ? history : [];
}

function addHistory(decoder, input, output) {
  if (!decoder || !output || !String(input || '').trim()) return;
  var value;
  if (output.error) value = 'Error: ' + output.error;
  else if (isBinary(output)) value = '[' + output.bytes.length + ' bytes]';
  else value = String(output.text == null ? '' : output.text);
  var entry = {
    decoderId: decoder.id,
    label: decoder.label,
    input: String(input).slice(0, 500),
    output: value.slice(0, 1000),
    createdAt: Date.now(),
  };
  var history = getHistory().filter(function (item) {
    return !(item.decoderId === entry.decoderId && item.input === entry.input);
  });
  history.unshift(entry);
  writeStoredJson(HISTORY_KEY, history.slice(0, 20));
}

function getPinnedFormats() {
  var pins = readStoredJson(PINS_KEY, []);
  return Array.isArray(pins) ? pins : [];
}

function togglePinnedFormat(id) {
  var pins = getPinnedFormats();
  var index = pins.indexOf(id);
  if (index >= 0) pins.splice(index, 1);
  else pins.unshift(id);
  writeStoredJson(PINS_KEY, pins);
}

function orderedDecoders(decoders) {
  var pins = getPinnedFormats();
  return (decoders || []).slice().sort(function (a, b) {
    var ai = pins.indexOf(a.id);
    var bi = pins.indexOf(b.id);
    if (ai < 0 && bi < 0) return 0;
    if (ai < 0) return 1;
    if (bi < 0) return -1;
    return ai - bi;
  });
}

function removePanel() {
  if (_panelKeydownHandler) {
    document.removeEventListener('keydown', _panelKeydownHandler, true);
    _panelKeydownHandler = null;
  }
  var host = document.getElementById(PANEL_ID);
  if (host) host.remove();
  if (_panelPreviousFocus && _panelPreviousFocus.isConnected && typeof _panelPreviousFocus.focus === 'function') {
    _panelPreviousFocus.focus();
  }
  _panelPreviousFocus = null;
  _panelState = null;
}

// ---------------------------------------------------------------------------
// 渲染
// ---------------------------------------------------------------------------

function buildPanelContent(shadow) {
  var state = _panelState;

  while (shadow.firstChild) shadow.removeChild(shadow.firstChild);

  try {
    var sheet = new CSSStyleSheet();
    sheet.replaceSync(PANEL_CSS);
    shadow.adoptedStyleSheets = [sheet];
  } catch (e) {
    var styleEl = document.createElement('style');
    styleEl.textContent = PANEL_CSS;
    shadow.appendChild(styleEl);
  }

  var panel = document.createElement('div');
  panel.className = 'panel';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-label', t('title'));
  panel.setAttribute('aria-modal', 'false');

  // ---- Header ----
  var header = document.createElement('div');
  header.className = 'header';
  var title = document.createElement('span');
  title.className = 'header-title';
  title.textContent = t('title');
  var headerRight = document.createElement('div');
  headerRight.style.cssText = 'display:flex;align-items:center;gap:4px;';
  var historyBtn = document.createElement('button');
  historyBtn.className = 'icon-btn';
  historyBtn.textContent = '\u21ba';
  historyBtn.title = t('history');
  historyBtn.setAttribute('aria-label', t('history'));
  historyBtn.addEventListener('click', function () {
    state.showHistory = !state.showHistory;
    buildPanelContent(shadow);
  });
  var languageBtn = document.createElement('button');
  languageBtn.className = 'icon-btn';
  languageBtn.textContent = getLanguage() === 'zh' ? 'EN' : '中';
  languageBtn.title = t('language');
  languageBtn.setAttribute('aria-label', t('language'));
  languageBtn.addEventListener('click', function () {
    setLanguage(getLanguage() === 'zh' ? 'en' : 'zh');
    buildPanelContent(shadow);
  });
  var modeBtn = document.createElement('button');
  modeBtn.className = 'mode-btn' + (state.mode === 'encode' ? ' active' : '');
  modeBtn.textContent = state.mode === 'encode' ? t('switchToDecode') : t('switchToEncode');
  modeBtn.title = state.mode === 'encode' ? t('switchToDecode') : t('switchToEncode');
  modeBtn.addEventListener('click', function () {
    state.mode = state.mode === 'encode' ? 'decode' : 'encode';
    buildPanelContent(shadow);
  });
  var closeBtn = document.createElement('button');
  closeBtn.className = 'close-btn';
  closeBtn.textContent = '\u00d7';
  closeBtn.setAttribute('aria-label', t('close'));
  closeBtn.addEventListener('click', removePanel);
  headerRight.appendChild(historyBtn);
  headerRight.appendChild(languageBtn);
  headerRight.appendChild(modeBtn);
  headerRight.appendChild(closeBtn);
  header.appendChild(title);
  header.appendChild(headerRight);
  panel.appendChild(header);

  // 拖拽支持：每次重渲染后重新绑定，避免 buildPanelContent 销毁旧节点后监听器丢失
  var dragHost = shadow.host;
  header.style.cursor = 'move';
  header.addEventListener('mousedown', function (e) {
    if (e.target && e.target.classList &&
        (e.target.classList.contains('close-btn') || e.target.classList.contains('mode-btn')
          || e.target.classList.contains('icon-btn') || e.target.classList.contains('pin-btn')
          || e.target.classList.contains('history-clear'))) return;
    e.preventDefault();
    var startX = e.clientX;
    var startY = e.clientY;
    var origLeft = parseInt(dragHost.style.left, 10) || 0;
    var origTop  = parseInt(dragHost.style.top,  10) || 0;
    function onMove(ev) {
      dragHost.style.left = (origLeft + ev.clientX - startX) + 'px';
      dragHost.style.top  = (origTop  + ev.clientY - startY) + 'px';
    }
    function onUp() {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    }
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });

  if (state.showHistory) {
    var historyArea = document.createElement('div');
    historyArea.className = 'history-area';
    var historyHeader = document.createElement('div');
    historyHeader.className = 'history-header';
    var historyTitle = document.createElement('span');
    historyTitle.textContent = t('history');
    historyHeader.appendChild(historyTitle);
    var clearHistoryBtn = document.createElement('button');
    clearHistoryBtn.className = 'history-clear';
    clearHistoryBtn.textContent = t('clearHistory');
    clearHistoryBtn.addEventListener('click', function () {
      writeStoredJson(HISTORY_KEY, []);
      buildPanelContent(shadow);
    });
    historyHeader.appendChild(clearHistoryBtn);
    historyArea.appendChild(historyHeader);

    var history = getHistory();
    if (history.length === 0) {
      var noHistory = document.createElement('div');
      noHistory.className = 'empty-hint';
      noHistory.textContent = t('noHistory');
      historyArea.appendChild(noHistory);
    } else {
      history.forEach(function (entry) {
        var item = document.createElement('div');
        item.className = 'history-item';
        var label = document.createElement('div');
        label.className = 'history-item-label';
        label.textContent = entry.label || entry.decoderId || '';
        item.appendChild(label);
        var input = document.createElement('div');
        input.className = 'history-item-input';
        input.textContent = entry.input || '';
        input.title = entry.input || '';
        item.appendChild(input);
        var output = document.createElement('div');
        output.className = 'history-item-output';
        output.textContent = entry.output || '';
        output.title = entry.output || '';
        item.appendChild(output);
        historyArea.appendChild(item);
      });
    }
    panel.appendChild(historyArea);
    shadow.appendChild(panel);
    return;
  }

  // ---- Toolbar: 双栏按钮 ----
  if (state.mode === 'encode') {
    // ---- 编码模式 ----
    var encodeArea = document.createElement('div');
    encodeArea.className = 'encode-area';

    var textarea = document.createElement('textarea');
    textarea.className = 'encode-textarea';
    textarea.placeholder = t('encodePrompt');
    textarea.value = state.encodeInput || '';
    encodeArea.appendChild(textarea);

    var fmtRow = document.createElement('div');
    fmtRow.className = 'encode-fmts';
    ENCODERS.forEach(function (enc) {
      var btn = document.createElement('button');
      btn.className = 'fmt-btn' + (state.encodeFmt === enc.id ? ' selected' : '');
      btn.textContent = enc.label;
      btn.addEventListener('click', function () {
        state.encodeFmt = enc.id;
        buildPanelContent(shadow);
      });
      fmtRow.appendChild(btn);
    });
    encodeArea.appendChild(fmtRow);

    var outputDiv = document.createElement('div');
    var currentEnc = ENCODERS.filter(function (e) { return e.id === state.encodeFmt; })[0] || ENCODERS[0];
    var encoded = state.encodeInput ? currentEnc.encode(state.encodeInput) : '';
    outputDiv.className = 'encode-output' + (encoded ? '' : ' empty');
    outputDiv.textContent = encoded || t('encodeOutput');
    encodeArea.appendChild(outputDiv);

    var encRowBtns = document.createElement('div');
    encRowBtns.className = 'row-btns';
    var encCopyBtn = document.createElement('button');
    encCopyBtn.className = 'copy-btn';
    encCopyBtn.textContent = t('copy');
    encCopyBtn.setAttribute('disabled', !encoded ? '' : null);
    if (encoded) {
      (function (txt, btn) {
        btn.addEventListener('click', function () {
          navigator.clipboard.writeText(txt).then(function () {
            btn.textContent = t('copied');
            setTimeout(function () { btn.textContent = t('copy'); }, 1500);
          });
        });
      })(encoded, encCopyBtn);
    }
    encRowBtns.appendChild(encCopyBtn);
    encodeArea.appendChild(encRowBtns);

    // live update on input
    textarea.addEventListener('input', function () {
      state.encodeInput = textarea.value;
      var enc2 = ENCODERS.filter(function (e) { return e.id === state.encodeFmt; })[0] || ENCODERS[0];
      var result = state.encodeInput ? enc2.encode(state.encodeInput) : '';
      outputDiv.className = 'encode-output' + (result ? '' : ' empty');
      outputDiv.textContent = result || t('encodeOutput');
      encCopyBtn.textContent = t('copy');
      if (result) {
        encCopyBtn.removeAttribute('disabled');
        encCopyBtn.onclick = function () {
          navigator.clipboard.writeText(result).then(function () {
            encCopyBtn.textContent = t('copied');
            setTimeout(function () { encCopyBtn.textContent = t('copy'); }, 1500);
          });
        };
      } else {
        encCopyBtn.setAttribute('disabled', '');
      }
    });

    panel.appendChild(encodeArea);
    shadow.appendChild(panel);
    return;
  }

  var groups = getDecoderGroups();

  // 找最后一个【成功】的输出作为下一步的输入来源
  // error 步骤只是提示，不影响后续按钮的可用性
  var lastSuccessOutput = null;
  var lastSuccessIndex = -1;
  for (var si = state.steps.length - 1; si >= 0; si--) {
    if (!state.steps[si].output.error) {
      lastSuccessOutput = state.steps[si].output;
      lastSuccessIndex = si;
      break;
    }
  }
  var hasBinaryOutput = isBinary(lastSuccessOutput);
  var isLoading = !!state.loadingDecoderId;
  var toolbar = document.createElement('div');
  toolbar.className = 'toolbar';

  function runDecoder(d) {
    if (isLoading || hasBinaryOutput) return;
    var currentInput = lastSuccessOutput ? lastSuccessOutput.text : state.input;
    if (typeof currentInput !== 'string') return;

    state.loadingDecoderId = d.id;
    buildPanelContent(shadow);

    var result;
    try {
      result = d.decode(currentInput);
    } catch (e) {
      result = { text: '', error: e && e.message ? e.message : String(e) };
    }
    Promise.resolve(result).then(function (resolved) {
      // The panel may have been closed while an async decoder was running.
      if (!_panelState || _panelState !== state) return;
      var finalOutput = resolved || { text: '', error: 'Decoder returned no output' };
      state.steps.push({ decoderId: d.id, label: d.label, output: finalOutput });
      addHistory(d, currentInput, finalOutput);
    }).catch(function (e) {
      if (!_panelState || _panelState !== state) return;
      var failedOutput = { text: '', error: e && e.message ? e.message : String(e) };
      state.steps.push({ decoderId: d.id, label: d.label, output: failedOutput });
      addHistory(d, currentInput, failedOutput);
    }).then(function () {
      if (!_panelState || _panelState !== state) return;
      state.loadingDecoderId = null;
      buildPanelContent(shadow);
    });
  }

  var recommendation = state.steps.length === 0 && !isLoading
    ? recommendDecoder(state.input, groups.dc.concat(groups.dd))
    : null;
  if (recommendation) {
    var recommendationDiv = document.createElement('div');
    recommendationDiv.className = 'recommendation';
    recommendationDiv.textContent = t('recommendation').replace('{format}', recommendation.label);
    panel.appendChild(recommendationDiv);
  }

  function makeCol(colTitle, decoders, cssClass) {
    var col = document.createElement('div');
    col.className = 'col';
    var ct = document.createElement('div');
    ct.className = 'col-title';
    ct.textContent = colTitle;
    col.appendChild(ct);
    var wrap = document.createElement('div');
    wrap.className = 'btn-wrap';

    orderedDecoders(decoders).forEach(function (d) {
      var enabled = d.accepts === 'string' && !hasBinaryOutput && !isLoading;

      var control = document.createElement('span');
      control.className = 'decoder-control';
      var btn = document.createElement('button');
      btn.className = 'decoder-btn' + (cssClass ? ' ' + cssClass : '')
        + (state.loadingDecoderId === d.id ? ' loading' : '');
      btn.textContent = state.loadingDecoderId === d.id ? d.label + '...' : d.label;
      if (!enabled) {
        btn.setAttribute('disabled', '');
      } else {
        btn.addEventListener('click', function () {
          runDecoder(d);
        });
      }
      control.appendChild(btn);
      var pinBtn = document.createElement('button');
      var pinned = getPinnedFormats().indexOf(d.id) >= 0;
      pinBtn.className = 'pin-btn' + (pinned ? ' pinned' : '');
      pinBtn.textContent = pinned ? '\u2605' : '\u2606';
      pinBtn.title = pinned ? t('unpin') : t('pin');
      pinBtn.setAttribute('aria-label', pinBtn.title);
      pinBtn.addEventListener('click', function (event) {
        event.stopPropagation();
        togglePinnedFormat(d.id);
        buildPanelContent(shadow);
      });
      control.appendChild(pinBtn);
      wrap.appendChild(control);
    });

    col.appendChild(wrap);
    return col;
  }

  toolbar.appendChild(makeCol(t('colDecompress'), groups.dc, 'decompress'));
  toolbar.appendChild(makeCol(t('colDecode'), groups.dd, ''));
  panel.appendChild(toolbar);

  if (hasBinaryOutput) {
    var binaryHint = document.createElement('div');
    binaryHint.className = 'empty-hint';
    binaryHint.textContent = t('binaryHint');
    panel.appendChild(binaryHint);
  }

  // ---- 结果步骤 ----
  if (state.steps.length === 0) {
    var hint = document.createElement('div');
    hint.className = 'empty-hint';
    hint.textContent = t('emptyHint');
    panel.appendChild(hint);
  }

  for (var i = 0; i < state.steps.length; i++) {
    var step = state.steps[i];
    var stepDiv = document.createElement('div');
    stepDiv.className = 'step' + (i === lastSuccessIndex ? ' active-source' : '');

    var stepLabel = document.createElement('div');
    stepLabel.className = 'step-label';
    var stepLabelText = document.createElement('span');
    stepLabelText.textContent = (step.label || step.decoderId).toUpperCase();
    if (i === lastSuccessIndex) {
      var sourceMarker = document.createElement('span');
      sourceMarker.className = 'step-source';
      sourceMarker.textContent = t('activeSource');
      stepLabelText.appendChild(sourceMarker);
    }
    var dismissBtn = document.createElement('button');
    dismissBtn.className = 'step-dismiss';
    dismissBtn.textContent = '\u00d7';
    dismissBtn.title = t('close');
    dismissBtn.setAttribute('aria-label', t('close'));
    (function (idx) {
      dismissBtn.addEventListener('click', function () {
        state.steps.splice(idx, state.steps.length - idx);
        buildPanelContent(shadow);
      });
    })(i);
    stepLabel.appendChild(stepLabelText);
    stepLabel.appendChild(dismissBtn);
    stepDiv.appendChild(stepLabel);

    if (step.output.error) {
      var errDiv = document.createElement('div');
      errDiv.className = 'step-error';
      errDiv.textContent = '\u26a0\ufe0f ' + step.output.error;
      stepDiv.appendChild(errDiv);
    } else if (isBinary(step.output)) {
      var textDiv2 = document.createElement('div');
      textDiv2.className = 'step-text';
      textDiv2.textContent = t('binaryInfo') + ' ' + step.output.bytes.length + ' bytes';
      stepDiv.appendChild(textDiv2);

      var rowBtns2 = document.createElement('div');
      rowBtns2.className = 'row-btns';
      var dlBtn = document.createElement('button');
      dlBtn.className = 'download-btn';
      dlBtn.textContent = t('download');
      (function (bytes) {
        dlBtn.addEventListener('click', function () {
          var blob = new Blob([bytes], { type: 'application/octet-stream' });
          var url = URL.createObjectURL(blob);
          var a = document.createElement('a');
          a.href = url; a.download = 'decodec-output.bin'; a.click();
          URL.revokeObjectURL(url);
        });
      })(step.output.bytes);
      rowBtns2.appendChild(dlBtn);
      stepDiv.appendChild(rowBtns2);
    } else {
      var textDiv = document.createElement('div');
      textDiv.className = 'step-text';
      textDiv.textContent = step.output.text;
      stepDiv.appendChild(textDiv);

      var rowBtns = document.createElement('div');
      rowBtns.className = 'row-btns';

      var copyBtn = document.createElement('button');
      copyBtn.className = 'copy-btn';
      copyBtn.textContent = t('copy');
      (function (txt, btn) {
        btn.addEventListener('click', function () {
          navigator.clipboard.writeText(txt).then(function () {
            btn.textContent = t('copied');
            setTimeout(function () { btn.textContent = t('copy'); }, 1500);
          });
        });
      })(step.output.text, copyBtn);
      rowBtns.appendChild(copyBtn);

      stepDiv.appendChild(rowBtns);
    }

    panel.appendChild(stepDiv);
  }

  shadow.appendChild(panel);
}

// ---------------------------------------------------------------------------
// openPanel
// ---------------------------------------------------------------------------

function openPanel(text, rect) {
  removePanel();
  _panelPreviousFocus = document.activeElement;

  _panelState = { input: text, steps: [], mode: 'decode', encodeFmt: 'base64', encodeInput: text, loadingDecoderId: null, showHistory: false };

  var host = document.createElement('div');
  host.id = PANEL_ID;
  host.style.cssText = [
    'position: fixed',
    'left: -9999px',
    'top: 0',
    'z-index: 2147483646',
    'pointer-events: all',
    'visibility: hidden',
    'width: min(400px, calc(100vw - 16px))',
  ].join('; ');

  var shadow = host.attachShadow({ mode: 'open' });
  buildPanelContent(shadow);
  document.body.appendChild(host);

  _panelKeydownHandler = function (event) {
    if (event.key === 'Escape' || event.key === 'Esc') {
      event.preventDefault();
      removePanel();
      return;
    }
    if (event.key !== 'Tab') return;
    var focusables = Array.prototype.slice.call(shadow.querySelectorAll(
      'button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    ));
    if (focusables.length === 0) return;
    var active = shadow.activeElement || focusables[0];
    var index = focusables.indexOf(active);
    if (index < 0) index = event.shiftKey ? 0 : focusables.length - 1;
    if (event.shiftKey && index === 0) {
      event.preventDefault();
      focusables[focusables.length - 1].focus();
    } else if (!event.shiftKey && index === focusables.length - 1) {
      event.preventDefault();
      focusables[0].focus();
    }
  };
  document.addEventListener('keydown', _panelKeydownHandler, true);

  // Run a high-confidence recommendation immediately. The first render gives
  // the user a stable panel while async compression decoders are in flight.
  var groups = getDecoderGroups();
  var recommendation = recommendDecoder(text, (groups.dc || []).concat(groups.dd || []));
  if (recommendation) {
    var panelState = _panelState;
    var currentInput = String(text || '').trim();
    panelState.loadingDecoderId = recommendation.id;
    buildPanelContent(shadow);
    var result;
    try {
      result = recommendation.decode(currentInput);
    } catch (e) {
      result = { text: '', error: e && e.message ? e.message : String(e) };
    }
    Promise.resolve(result).then(function (resolved) {
      if (!_panelState || _panelState !== panelState) return;
      var finalOutput = resolved || { text: '', error: 'Decoder returned no output' };
      panelState.steps.push({ decoderId: recommendation.id, label: recommendation.label, output: finalOutput });
      addHistory(recommendation, currentInput, finalOutput);
    }).catch(function (e) {
      if (!_panelState || _panelState !== panelState) return;
      var failedOutput = { text: '', error: e && e.message ? e.message : String(e) };
      panelState.steps.push({ decoderId: recommendation.id, label: recommendation.label, output: failedOutput });
      addHistory(recommendation, currentInput, failedOutput);
    }).then(function () {
      if (!_panelState || _panelState !== panelState) return;
      panelState.loadingDecoderId = null;
      buildPanelContent(shadow);
    });
  }

  var initialFocus = shadow.querySelector('.close-btn');
  if (initialFocus && typeof initialFocus.focus === 'function') initialFocus.focus();

  requestAnimationFrame(function () {
    var panelHeight = host.offsetHeight || 0;
    var panelWidth  = Math.min(400, Math.max(0, window.innerWidth - 16));
    var GAP = 8;

    var spaceBelow = window.innerHeight - rect.bottom - GAP;
    var spaceAbove = rect.top - GAP;

    var top;
    if (spaceBelow >= panelHeight) {
      // 下方放得下，优先往下
      top = rect.bottom + GAP;
    } else {
      // 下方不够，翻到上方
      top = rect.top - panelHeight - GAP;
      if (top < GAP) top = GAP;
    }

    var left = rect.left;
    if (left + panelWidth > window.innerWidth - GAP) left = window.innerWidth - panelWidth - GAP;
    if (left < GAP) left = GAP;

    host.style.top        = top  + 'px';
    host.style.left       = left + 'px';
    host.style.visibility = 'visible';
  });
}

// ---------------------------------------------------------------------------
// Node / Jest 导出
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined') {
  module.exports = { openPanel, removePanel, buildPanelContent, recommendDecoder, isBinary };
}
