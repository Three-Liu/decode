/* global document, window, requestAnimationFrame, module */

'use strict';

var _i18n = (function () {
  try { return require('./i18n'); } catch (e) { return { t: function (k) { return k; } }; }
})();
var t = _i18n.t;

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
  '  width: 400px;',
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
  '  color: #999;',
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
  '  color: #aaa;',
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
  '  color: #888;',
  '  margin-bottom: 4px;',
  '}',
  '.step-dismiss {',
  '  background: none;',
  '  border: none;',
  '  cursor: pointer;',
  '  color: #ccc;',
  '  font-size: 13px;',
  '  line-height: 1;',
  '  padding: 0 0 0 4px;',
  '  flex-shrink: 0;',
  '}',
  '.step-dismiss:hover { color: #999; }',
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
  '  color: #bbb;',
  '  font-style: italic;',
  '}',
  // 编码模式
  '.mode-btn {',
  '  cursor: pointer;',
  '  background: none;',
  '  border: 1px solid #ddd;',
  '  border-radius: 4px;',
  '  color: #999;',
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
  '.encode-output.empty { color: #bbb; font-style: italic; }',
].join('\n');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isBinary(output) {
  return output && output.bytes instanceof Uint8Array && !output.text;
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

function removePanel() {
  var host = document.getElementById(PANEL_ID);
  if (host) host.remove();
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

  // ---- Header ----
  var header = document.createElement('div');
  header.className = 'header';
  var title = document.createElement('span');
  title.className = 'header-title';
  title.textContent = t('title');
  var headerRight = document.createElement('div');
  headerRight.style.cssText = 'display:flex;align-items:center;gap:4px;';
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
  closeBtn.addEventListener('click', removePanel);
  headerRight.appendChild(modeBtn);
  headerRight.appendChild(closeBtn);
  header.appendChild(title);
  header.appendChild(headerRight);
  panel.appendChild(header);

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
  for (var si = state.steps.length - 1; si >= 0; si--) {
    if (!state.steps[si].output.error) {
      lastSuccessOutput = state.steps[si].output;
      break;
    }
  }
  var toolbar = document.createElement('div');
  toolbar.className = 'toolbar';

  function makeCol(colTitle, decoders, cssClass) {
    var col = document.createElement('div');
    col.className = 'col';
    var ct = document.createElement('div');
    ct.className = 'col-title';
    ct.textContent = colTitle;
    col.appendChild(ct);
    var wrap = document.createElement('div');
    wrap.className = 'btn-wrap';

    decoders.forEach(function (d) {
      var enabled = d.accepts === 'string';

      var btn = document.createElement('button');
      btn.className = 'decoder-btn' + (cssClass ? ' ' + cssClass : '');
      btn.textContent = d.label;
      if (!enabled) {
        btn.setAttribute('disabled', '');
      } else {
        btn.addEventListener('click', function () {
          var currentInput = lastSuccessOutput ? lastSuccessOutput.text : state.input;
          var output = d.decode(currentInput);
          if (output && typeof output.then === 'function') {
            output.then(function (resolved) {
              state.steps.push({ decoderId: d.id, label: d.label, output: resolved });
              buildPanelContent(shadow);
            });
          } else {
            state.steps.push({ decoderId: d.id, label: d.label, output: output });
            buildPanelContent(shadow);
          }
        });
      }
      wrap.appendChild(btn);
    });

    col.appendChild(wrap);
    return col;
  }

  toolbar.appendChild(makeCol(t('colDecompress'), groups.dc, 'decompress'));
  toolbar.appendChild(makeCol(t('colDecode'), groups.dd, ''));
  panel.appendChild(toolbar);

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
    stepDiv.className = 'step';

    var stepLabel = document.createElement('div');
    stepLabel.className = 'step-label';
    var stepLabelText = document.createElement('span');
    stepLabelText.textContent = (step.label || step.decoderId).toUpperCase();
    var dismissBtn = document.createElement('button');
    dismissBtn.className = 'step-dismiss';
    dismissBtn.textContent = '\u00d7';
    dismissBtn.title = '';
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

  _panelState = { input: text, steps: [], mode: 'decode', encodeFmt: 'base64', encodeInput: '' };

  var host = document.createElement('div');
  host.id = PANEL_ID;
  host.style.cssText = [
    'position: fixed',
    'left: -9999px',
    'top: 0',
    'z-index: 2147483646',
    'pointer-events: all',
    'visibility: hidden',
    'width: 400px',
  ].join('; ');

  var shadow = host.attachShadow({ mode: 'open' });
  buildPanelContent(shadow);
  document.body.appendChild(host);

  requestAnimationFrame(function () {
    var panelHeight = host.offsetHeight || 0;
    var panelWidth  = 400;
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

    // 拖拽支持：拖 header 区域移动面板
    var headerEl = host.shadowRoot && host.shadowRoot.querySelector('.header');
    if (headerEl) {
      headerEl.style.cursor = 'move';
      headerEl.addEventListener('mousedown', function (e) {
        // 排除关闭按钮和模式切换按钮
        if (e.target && e.target.classList && (e.target.classList.contains('close-btn') || e.target.classList.contains('mode-btn'))) return;
        e.preventDefault();
        var startX = e.clientX;
        var startY = e.clientY;
        var origLeft = parseInt(host.style.left, 10) || 0;
        var origTop  = parseInt(host.style.top,  10) || 0;

        function onMove(ev) {
          var dx = ev.clientX - startX;
          var dy = ev.clientY - startY;
          host.style.left = (origLeft + dx) + 'px';
          host.style.top  = (origTop  + dy) + 'px';
        }
        function onUp() {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
        }
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    }
  });
}

// ---------------------------------------------------------------------------
// Node / Jest 导出
// ---------------------------------------------------------------------------

if (typeof module !== 'undefined') {
  module.exports = { openPanel, removePanel, buildPanelContent };
}
