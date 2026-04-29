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

// ---------------------------------------------------------------------------
// Badge injection
// ---------------------------------------------------------------------------

function injectBadge(text, rect) {
  // 1. 移除旧徽章
  removeBadge();

  // 2. 创建 Shadow DOM 宿主
  const host = document.createElement('div');
  host.id = BADGE_ID;
  // position: fixed — top/left 直接使用视口坐标，不加 scrollY
  host.style.cssText = [
    'position: fixed',
    'top: ' + rect.bottom + 'px',
    'left: ' + rect.left + 'px',
    'z-index: 2147483647',
    'pointer-events: none',
  ].join('; ');

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
    // openPanel is set by entry.js on globalThis after bundling
    var fn = (typeof globalThis !== 'undefined' && globalThis.openPanel)
      || (typeof window !== 'undefined' && window.openPanel);
    if (typeof fn === 'function') fn(text, rect);
  });

  shadow.appendChild(badge);
  document.body.appendChild(host);
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
}

function teardown() {
  controller.abort();
  controller = new AbortController();
  removeBadge();
}

// ---------------------------------------------------------------------------
// Node / Jest 导出
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined') {
  module.exports = { injectBadge, removeBadge, handleSelectionChange, setup, teardown };
}
