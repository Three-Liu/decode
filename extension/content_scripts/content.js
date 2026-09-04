/* global document, window, module */

'use strict';

var _i18n = (function () {
  try { return require('./i18n'); } catch (e) { return { t: function (k) { return k; } }; }
})();
var t = _i18n.t;

const MIN_SELECTION_LENGTH = 3;
const DEBOUNCE_MS = 200;
const BADGE_ID = 'decodec-badge-host';

let controller = new AbortController();
let runtimeListener = null;

function getPanelOpener() {
  return (typeof globalThis !== 'undefined' && globalThis.openPanel)
    || (typeof window !== 'undefined' && window.openPanel);
}

function getSelectionRect() {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount) return null;
  return selection.getRangeAt(0).getBoundingClientRect();
}

function fallbackRect() {
  const width = 1;
  const height = 1;
  return {
    top: Math.max(0, Math.round(window.innerHeight / 2)),
    bottom: Math.max(0, Math.round(window.innerHeight / 2) + height),
    left: Math.max(0, Math.round(window.innerWidth / 2) - width),
    right: Math.max(0, Math.round(window.innerWidth / 2)),
    width,
    height,
  };
}

function openSelectedText(text, rect) {
  const value = String(text || '').trim();
  if (value.length < MIN_SELECTION_LENGTH) return;
  const opener = getPanelOpener();
  if (typeof opener === 'function') opener(value, rect || getSelectionRect() || fallbackRect());
}

function positionBadge(host, rect) {
  const badgeSize = 24;
  const maxLeft = Math.max(0, window.innerWidth - badgeSize);
  const left = Math.min(Math.max(0, Number(rect.left) || 0), maxLeft);
  const belowTop = Number(rect.bottom) || 0;
  const aboveTop = (Number(rect.top) || 0) - badgeSize;
  const top = belowTop + badgeSize <= window.innerHeight ? belowTop : Math.max(0, aboveTop);
  host.style.top = top + 'px';
  host.style.left = left + 'px';
}

// ---------------------------------------------------------------------------
// Badge injection
// ---------------------------------------------------------------------------

function injectBadge(text, rect) {
  const previous = document.getElementById(BADGE_ID);
  if (previous && previous._decodecBadge) {
    previous._decodecText = text;
    previous._decodecRect = rect;
    positionBadge(previous, rect);
    return previous;
  }

  // Reuse the existing host during drag selection; only its data and position
  // change, which prevents the Shadow DOM from flashing on every update.
  const host = document.createElement('div');
  host.id = BADGE_ID;
  host._decodecText = text;
  host._decodecRect = rect;
  // position: fixed — top/left 直接使用视口坐标，不加 scrollY
  host.style.cssText = [
    'position: fixed',
    'z-index: 2147483647',
    'pointer-events: none',
  ].join('; ');
  positionBadge(host, rect);

  // 3. 挂载 Shadow DOM
  const shadow = host.attachShadow({ mode: 'open' });

  // 4. 注入样式（try/catch 处理 CSP 限制）
  const badgeCSS = [
    '.decodec-badge {',
    '  display: inline-flex;',
    '  align-items: center;',
    '  justify-content: center;',
    '  width: 24px;',
    '  height: 24px;',
    '  background: #1a73e8;',
    '  color: white;',
    '  border-radius: 4px;',
    '  font-size: 11px;',
    '  font-weight: 600;',
    '  font-family: monospace;',
    '  cursor: pointer;',
    '  pointer-events: all;',
    '  user-select: none;',
    '  box-shadow: 0 2px 4px rgba(0,0,0,0.2);',
    '  transition: background 0.1s;',
    '  border: none;',
    '  padding: 0;',
    '}',
    '.decodec-badge:hover { background: #1557b0; }',
  ].join('\n');

  try {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(badgeCSS);
    shadow.adoptedStyleSheets = [sheet];
  } catch (e) {
    // CSP fallback：内联 style 元素
    const style = document.createElement('style');
    style.textContent = badgeCSS;
    shadow.appendChild(style);
  }

  // 5. 创建徽章按钮
  const badge = document.createElement('button');
  badge.className = 'decodec-badge';
  badge.textContent = 'de';
  badge.title = t('badgeTitle');
  badge.addEventListener('click', function (e) {
    e.stopPropagation();
    openSelectedText(host._decodecText, host._decodecRect);
  });

  shadow.appendChild(badge);
  document.body.appendChild(host);
  host._decodecBadge = badge;
  return host;
}

function removeBadge() {
  const host = document.getElementById(BADGE_ID);
  if (host) host.remove();
}

// ---------------------------------------------------------------------------
// Selection handler
// ---------------------------------------------------------------------------

function handleSelectionChange() {
  const selection = window.getSelection();
  const text = selection ? selection.toString().trim() : '';

  if (text.length < MIN_SELECTION_LENGTH) {
    removeBadge();
    return;
  }

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  injectBadge(text, rect);
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

function setup() {
  let debounceTimer = null;

  document.addEventListener(
    'selectionchange',
    function () {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(handleSelectionChange, DEBOUNCE_MS);
    },
    { signal: controller.signal }
  );

  document.addEventListener(
    'mousedown',
    function (e) {
      const host = document.getElementById(BADGE_ID);
      if (host && !host.contains(e.target)) {
        removeBadge();
      }
    },
    { signal: controller.signal }
  );

  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    runtimeListener = function (message) {
      if (!message || message.type !== 'decodec-open') return;
      const value = String(message.text || '').trim()
        || (window.getSelection() ? window.getSelection().toString().trim() : '');
      openSelectedText(value, getSelectionRect() || fallbackRect());
    };
    chrome.runtime.onMessage.addListener(runtimeListener);
  }
}

function teardown() {
  controller.abort();
  controller = new AbortController();
  if (runtimeListener && typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.removeListener(runtimeListener);
  }
  runtimeListener = null;
  removeBadge();
}

// ---------------------------------------------------------------------------
// Node / Jest 导出
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined') {
  module.exports = { injectBadge, removeBadge, handleSelectionChange, setup, teardown };
}
