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
- Automatic high-confidence format detection for JWT, Base64, URL, Unicode, and compressed data
- Binary results disable further decode actions and can be downloaded directly
- Context-menu action and `Ctrl+Shift+D` / `Command+Shift+D` shortcut for opening the panel
- Panel supports Escape to close, dark mode, responsive sizing, and active chain-source indication
- Recent decode history (up to 20 entries), with clear action and pinned decoder formats
- Manual English/Chinese language toggle, persisted across panel sessions
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

Then load **only the `extension/` directory** as an **unpacked extension** in Chrome
(the exact path is `/Users/liusirui/projects/chrome-plugins/decodec/extension`):
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Click **Load unpacked** → select the `extension/` folder

Do not select the repository root (`decodec/`), which contains `__tests__/` and
other development files, and do not select `decodec.zip` directly. If using the
archive, unzip it first and select its nested `extension/` folder.

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
- 可查看最近 20 条解码记录并固定常用格式
- 可手动切换中英文，语言选择会持久化

### 安装（开发模式）

```bash
git clone <repo-url>
cd decodec
npm install
node build.js
```

然后在 Chrome 中以「开发者模式」只加载项目中的 `extension/` 文件夹
（完整路径为 `/Users/liusirui/projects/chrome-plugins/decodec/extension`）：
1. 打开 `chrome://extensions`
2. 开启右上角的**开发者模式**
3. 点击**加载已解压的扩展程序** → 选择项目中的 `extension/` 文件夹

不要选择仓库根目录 `decodec/`，因为其中包含 `__tests__/` 等开发文件；也不要
直接选择 `decodec.zip`。如果使用压缩包，请先解压，再选择里面的 `extension/` 文件夹。

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
