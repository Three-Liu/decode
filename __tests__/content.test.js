'use strict';

/**
 * content.test.js — content script 单元测试
 * 环境: Jest + jsdom (见 jest.config.js)
 *
 * content.js 在 require 时不会调用 setup()，因为文件末尾的 bootstrap 代码
 * 检测了 typeof module !== 'undefined'，在 Node 环境下只导出函数而不调用 setup()。
 */

const {
  injectBadge,
  removeBadge,
  handleSelectionChange,
  setup,
  teardown,
} = require('../extension/content_scripts/content.js');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * 构造一个仿 DOMRect 对象
 */
function makeRect({ top = 100, bottom = 120, left = 50, right = 200 } = {}) {
  return { top, bottom, left, right, width: right - left, height: bottom - top };
}

/**
 * Mock window.getSelection，使其返回给定文本和 rect
 */
function mockSelection(text, rect) {
  const range = {
    getBoundingClientRect: jest.fn().mockReturnValue(rect || makeRect()),
  };
  const selection = {
    toString: jest.fn().mockReturnValue(text),
    getRangeAt: jest.fn().mockReturnValue(range),
  };
  jest.spyOn(window, 'getSelection').mockReturnValue(selection);
  return { selection, range };
}

/**
 * 清除所有注入的宿主元素
 */
function cleanupDOM() {
  document.getElementById('decodec-badge-host')?.remove();
  document.getElementById('decodec-panel-host')?.remove();
}

// ---------------------------------------------------------------------------
// Setup / teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  cleanupDOM();
  jest.restoreAllMocks();
  // jsdom 没有实现 CSSStyleSheet.replaceSync / adoptedStyleSheets，
  // content.js 里已有 try/catch fallback，这里确保全局 CSSStyleSheet 存在且不报错
  if (typeof global.CSSStyleSheet === 'undefined') {
    global.CSSStyleSheet = class {
      replaceSync() {}
    };
  } else if (!CSSStyleSheet.prototype.replaceSync) {
    CSSStyleSheet.prototype.replaceSync = function () {};
  }
});

afterEach(() => {
  cleanupDOM();
  teardown(); // 重置 AbortController
});

// ---------------------------------------------------------------------------
// 1. 选区为空 → 不注入徽章
// ---------------------------------------------------------------------------

test('选区为空时不注入徽章', () => {
  mockSelection('');
  handleSelectionChange();
  expect(document.getElementById('decodec-badge-host')).toBeNull();
});

// ---------------------------------------------------------------------------
// 2. 选区 < 3 字符 → 不注入徽章
// ---------------------------------------------------------------------------

test('选区少于 3 字符时不注入徽章', () => {
  mockSelection('ab');
  handleSelectionChange();
  expect(document.getElementById('decodec-badge-host')).toBeNull();
});

test('选区恰好 2 字符（含空白 trim 后 < 3）不注入徽章', () => {
  mockSelection('  a  '); // trim 后为 'a'，长度 1
  handleSelectionChange();
  expect(document.getElementById('decodec-badge-host')).toBeNull();
});

// ---------------------------------------------------------------------------
// 3. 选区 >= 3 字符 → 注入徽章
// ---------------------------------------------------------------------------

test('选区 >= 3 字符时注入徽章宿主元素', () => {
  mockSelection('abc', makeRect());
  handleSelectionChange();
  const host = document.getElementById('decodec-badge-host');
  expect(host).not.toBeNull();
});

test('选区恰好 3 字符时注入徽章', () => {
  mockSelection('xyz', makeRect());
  handleSelectionChange();
  expect(document.getElementById('decodec-badge-host')).not.toBeNull();
});

test('选区为长文本时注入徽章', () => {
  mockSelection('SGVsbG8gV29ybGQ=', makeRect());
  handleSelectionChange();
  expect(document.getElementById('decodec-badge-host')).not.toBeNull();
});

// ---------------------------------------------------------------------------
// 4. Shadow host 使用 position: fixed
// ---------------------------------------------------------------------------

test('徽章宿主元素使用 position: fixed', () => {
  const rect = makeRect({ top: 100, bottom: 120, left: 50, right: 200 });
  injectBadge('hello world', rect);

  const host = document.getElementById('decodec-badge-host');
  expect(host).not.toBeNull();
  expect(host.style.position).toBe('fixed');
});

// ---------------------------------------------------------------------------
// 5. Shadow host 使用 z-index 2147483647
// ---------------------------------------------------------------------------

test('徽章宿主元素 z-index 为 2147483647', () => {
  const rect = makeRect();
  injectBadge('test text', rect);

  const host = document.getElementById('decodec-badge-host');
  expect(host).not.toBeNull();
  expect(host.style.zIndex).toBe('2147483647');
});

// ---------------------------------------------------------------------------
// 6. fixed 定位时 top 使用 rect.bottom（不加 scrollY）
// ---------------------------------------------------------------------------

test('徽章 top 等于 rect.bottom（视口坐标，不加 scrollY）', () => {
  const rect = makeRect({ bottom: 350, left: 80 });
  injectBadge('decoded text', rect);

  const host = document.getElementById('decodec-badge-host');
  expect(host.style.top).toBe('350px');
  expect(host.style.left).toBe('80px');
});

// ---------------------------------------------------------------------------
// 7. mousedown 在外部 → 徽章被移除
// ---------------------------------------------------------------------------

test('mousedown 在徽章外部时移除徽章', () => {
  mockSelection('hello world', makeRect());
  handleSelectionChange();
  expect(document.getElementById('decodec-badge-host')).not.toBeNull();

  // 触发 setup 注册监听器
  setup();

  // 模拟点击页面其他元素
  const outsideEl = document.createElement('div');
  document.body.appendChild(outsideEl);

  const mousedown = new MouseEvent('mousedown', { bubbles: true });
  Object.defineProperty(mousedown, 'target', { value: outsideEl });
  outsideEl.dispatchEvent(mousedown);

  expect(document.getElementById('decodec-badge-host')).toBeNull();
  outsideEl.remove();
});

// ---------------------------------------------------------------------------
// 8. 第二次选区变化 → 旧徽章被移除，新徽章注入
// ---------------------------------------------------------------------------

test('第二次选区变化替换旧徽章', () => {
  const rect1 = makeRect({ bottom: 120, left: 50 });
  injectBadge('first selection', rect1);

  const firstHost = document.getElementById('decodec-badge-host');
  expect(firstHost).not.toBeNull();
  expect(firstHost.style.top).toBe('120px');

  const rect2 = makeRect({ bottom: 200, left: 100 });
  injectBadge('second selection', rect2);

  const secondHost = document.getElementById('decodec-badge-host');
  expect(secondHost).not.toBeNull();
  expect(secondHost.style.top).toBe('200px');

  // 旧徽章不再在 DOM 中
  expect(firstHost.isConnected).toBe(false);
});

// ---------------------------------------------------------------------------
// 9. removeBadge：多次调用不抛出错误
// ---------------------------------------------------------------------------

test('removeBadge 在无徽章时不抛出', () => {
  expect(() => removeBadge()).not.toThrow();
  expect(() => removeBadge()).not.toThrow();
});

// ---------------------------------------------------------------------------
// 10. handleSelectionChange：选区消失后移除现有徽章
// ---------------------------------------------------------------------------

test('选区消失后移除已有徽章', () => {
  // 先注入
  mockSelection('some encoded text', makeRect());
  handleSelectionChange();
  expect(document.getElementById('decodec-badge-host')).not.toBeNull();

  // 选区变空
  mockSelection('');
  handleSelectionChange();
  expect(document.getElementById('decodec-badge-host')).toBeNull();
});
