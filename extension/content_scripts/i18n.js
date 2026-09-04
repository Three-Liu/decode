/* global navigator, module */

'use strict';

// Load a persisted choice first, then fall back to browser language.
// Matches 'zh', 'zh-CN', 'zh-TW', etc. -> Chinese; everything else -> English.
var _lang = (function () {
  try {
    var saved = localStorage.getItem('decodec-language');
    if (saved === 'zh' || saved === 'en') return saved;
    var lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
    return lang.startsWith('zh') ? 'zh' : 'en';
  } catch (e) {
    return 'en';
  }
})();

var _strings = {
  zh: {
    title:          'DeCode',
    colDecompress:  '解压',
    colDecode:      '解码',
    emptyHint:      '点击上方按钮开始解码',
    switchToEncode: '切换到编码',
    switchToDecode: '切换到解码',
    copy:           '复制',
    copied:         '✓ 已复制',
    download:       '⬇ 下载',
    binaryInfo:     'ℹ️ 这是二进制数据，无法显示为文本。',
    encodePrompt:   '在此输入要编码的文字…',
    encodeOutput:   '编码结果将显示于此',
    badgeTitle:     'DeCode: 解码选中文本',
    recommendation: '推荐：{format}',
    binaryHint:     '输出为二进制数据，可下载。',
    activeSource:   '↳ 下一步基于此',
    close:           '关闭',
    history:         '历史',
    noHistory:       '暂无历史记录',
    clearHistory:    '清空历史',
    language:        '切换语言',
    pin:             '固定格式',
    unpin:           '取消固定格式',
  },
  en: {
    title:          'DeCode',
    colDecompress:  'Decompress',
    colDecode:      'Decode',
    emptyHint:      'Click a button above to start decoding',
    switchToEncode: 'Encode mode',
    switchToDecode: 'Decode mode',
    copy:           'Copy',
    copied:         '✓ Copied',
    download:       '⬇ Download',
    binaryInfo:     'ℹ️ Binary data — cannot display as text.',
    encodePrompt:   'Type text to encode…',
    encodeOutput:   'Encoded output will appear here',
    badgeTitle:     'DeCode: decode selected text',
    recommendation: 'Recommended: {format}',
    binaryHint:     'Binary output is ready to download.',
    activeSource:   '↳ next step uses this',
    close:           'Close',
    history:         'History',
    noHistory:       'No recent decodes',
    clearHistory:    'Clear history',
    language:        'Switch language',
    pin:             'Pin format',
    unpin:           'Unpin format',
  },
};

function t(key) {
  return (_strings[_lang] || _strings.en)[key] || key;
}

function setLanguage(language) {
  if (language !== 'zh' && language !== 'en') return _lang;
  _lang = language;
  try { localStorage.setItem('decodec-language', language); } catch (e) { /* storage unavailable */ }
  return _lang;
}

function getLanguage() {
  return _lang;
}

if (typeof module !== 'undefined') {
  module.exports = { t, setLanguage, getLanguage, get _lang() { return _lang; } };
}
