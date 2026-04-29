/* global navigator, module */

'use strict';

// Detect language once at load time.
// Matches 'zh', 'zh-CN', 'zh-TW', etc. → Chinese; everything else → English.
var _lang = (function () {
  try {
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
  },
};

function t(key) {
  return (_strings[_lang] || _strings.en)[key] || key;
}

if (typeof module !== 'undefined') {
  module.exports = { t, _lang };
}
