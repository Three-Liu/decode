# DeCode — Chrome Extension

**[English](#english) · [中文](#chinese)**

---

<a name="english"></a>
## English

### What it does

DeCode is a Chrome extension that lets you decode or encode any text you select on a webpage — instantly, without leaving the page.

Select any encoded text → click the **de** badge → a floating panel appears with decode and compress buttons. Chain multiple operations. Switch to encode mode to convert plain text into any format.

### Features

- **Decompress**: gzip · ZLIB/Deflate · zstd
- **Decode**: Base64 · Base32 · URL · Unicode escapes · UTF-16 · JWT · Cookie · HTML entities · Hex
- **Encode**: Base64 · URL · Hex · Unicode · Base32
- Chained decoding — apply multiple steps in sequence
- Smart panel positioning — appears above or below selection based on available space
- Draggable panel
- Bilingual UI — English and Chinese (follows browser language)

### Installation (development)

```bash
git clone <repo-url>
cd decodec
npm install
node build.js
```

Then load `extension/` as an **unpacked extension** in Chrome:
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the `extension/` folder

### Development

```bash
# Run tests
npm test

# Rebuild bundle after changes
node build.js
```

Tests live in `__tests__/`. The bundle entry point is `extension/content_scripts/entry.js`, built with esbuild into `extension/dist/content_bundle.js`.

### Project structure

```
extension/
  content_scripts/
    i18n.js          ← language detection & strings
    content.js       ← selection listener + badge
    panel.js         ← floating decode/encode panel
    entry.js         ← bundle entry point
  decoders/
    index.js         ← decoder registry
    base64.js · base32.js · url.js · unicode.js
    utf16.js · jwt.js · cookie.js · html.js · hex.js
    gzip.js · deflate.js · zstd.js
  dist/
    content_bundle.js  ← built output (do not edit)
  icons/
  manifest.json
__tests__/
build.js
```

---

<a name="chinese"></a>
## 中文

### 功能介绍

DeCode 是一个 Chrome 浏览器插件，让你在网页上选中任意编码文本后，无需离开页面即可立刻解码或编码。

选中任意编码文本 → 点击出现的 **de** 徽章 → 弹出浮动面板，包含解压和解码按钮。支持链式多步操作，也可切换到编码模式将普通文本转换为指定格式。

### 功能列表

- **解压**：gzip · ZLIB/Deflate · zstd
- **解码**：Base64 · Base32 · URL · Unicode 转义 · UTF-16 · JWT · Cookie · HTML 实体 · Hex
- **编码**：Base64 · URL · Hex · Unicode · Base32
- 链式解码——对结果连续执行多步操作
- 智能定位——根据页面剩余空间自动决定面板显示在选区上方或下方
- 面板可拖拽移动
- 双语界面——跟随浏览器语言自动切换中英文

### 安装（开发模式）

```bash
git clone <repo-url>
cd decodec
npm install
node build.js
```

然后在 Chrome 中以「开发者模式」加载扩展：
1. 打开 `chrome://extensions`
2. 开启右上角的**开发者模式**
3. 点击**加载已解压的扩展程序** → 选择项目中的 `extension/` 文件夹

### 开发

```bash
# 运行测试
npm test

# 修改代码后重新构建
node build.js
```

测试文件位于 `__tests__/` 目录。Bundle 入口为 `extension/content_scripts/entry.js`，由 esbuild 构建输出到 `extension/dist/content_bundle.js`。

### 项目结构

```
extension/
  content_scripts/
    i18n.js          ← 语言检测与字符串
    content.js       ← 选区监听 + 徽章注入
    panel.js         ← 浮动解码/编码面板
    entry.js         ← 构建入口
  decoders/
    index.js         ← 解码器注册表
    base64.js · base32.js · url.js · unicode.js
    utf16.js · jwt.js · cookie.js · html.js · hex.js
    gzip.js · deflate.js · zstd.js
  dist/
    content_bundle.js  ← 构建输出（勿直接编辑）
  icons/
  manifest.json
__tests__/
build.js
```
