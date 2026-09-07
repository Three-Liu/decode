<p align="center">
  <img src="extension/icons/de-128.png" alt="DeCode 图标" width="112" height="112">
</p>

<h1 align="center">DeCode</h1>

<p align="center">
  无需离开当前页面，直接解码、解压或编码选中的文本。
  一个用于就地检查载荷、URL、Token 和二进制数据的轻量 Chrome 工具。
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-2f855a?style=flat-square" alt="MIT 许可证"></a>
  <a href="RELEASE_NOTES.md"><img src="https://img.shields.io/badge/release-v0.2.0-2563eb?style=flat-square" alt="v0.2.0 版本"></a>
  <a href="extension/manifest.json"><img src="https://img.shields.io/badge/Chrome-Manifest_V3-4285f4?style=flat-square&logo=googlechrome&logoColor=white" alt="Chrome Manifest V3"></a>
  <a href="privacy.html"><img src="https://img.shields.io/badge/%E6%95%B0%E6%8D%AE%E5%A4%84%E7%90%86-%E4%BB%85%E6%9C%AC%E5%9C%B0-147d64?style=flat-square" alt="仅本地处理"></a>
  <a href="README.md"><img src="https://img.shields.io/badge/English-README.md-4b5563?style=flat-square" alt="英文 README"></a>
</p>

DeCode 是一款面向开发者的 Chrome 扩展，适合处理日志、API 响应、控制台和技术文档中常见的编码文本。选中网页中的内容后，即可在轻量浮层中完成转换，无需切换标签页，也不会把内容发送给外部服务。

> [!IMPORTANT]
> 所有转换均在浏览器本地完成，扩展运行时不会发起网络请求。DeCode 请求网页访问权限，只是为了在你工作的页面中显示选区徽章和操作面板。

## 使用流程

```text
在网页中选中文本
        |
        v
点击 “de” 徽章、使用右键菜单或按下快捷键
        |
        v
自动处理高置信度输入，或手动选择格式
        |
        v
复制结果 | 继续链式处理 | 下载二进制输出
```

DeCode 会自动识别置信度较高的 JWT、Base64、URL 编码、Unicode 转义、gzip、zstd 和 deflate 输入。普通文本不会被贸然转换，需由用户手动选择操作。

## 支持的操作

| 类别 | 格式 | 行为 |
|---|---|---|
| 解压 | gzip、ZLIB/Deflate、zstd | 接收由 Base64/Base64url 包装的压缩数据，输出文本或可下载的字节数据 |
| 解码 | Base64、Base32、URL、Unicode 转义、UTF-16、JWT、Cookie、HTML 实体、Hex | 输出可读文本，并支持继续进行链式处理 |
| 编码 | Base64、URL、Hex、Unicode、Base32 | 在面板中直接转换文本，并支持一键复制 |

## 功能特性

- 连续执行多步解码或解压，并清楚标记下一步使用的输入来源。
- 无法表示为 UTF-8 文本时，将结果作为二进制文件直接下载。
- 支持选区徽章、右键菜单以及 `Ctrl+Shift+D` / `Command+Shift+D` 三种打开方式。
- 保留最近 20 条解码记录，并可固定常用格式。
- 可拖动面板标题栏，面板位置会根据视口剩余空间自动调整。
- 支持 Escape 关闭、合理的焦点恢复和小尺寸屏幕适配。
- 跟随浏览器深浅色主题，也可手动切换中英文。
- 界面封装在 Shadow DOM 中，避免网页样式影响操作面板。

## 快速开始

建议使用 Node.js 18 或更高版本进行开发构建。

```bash
git clone https://github.com/Three-Liu/decode.git
cd decode
npm install
npm run build
```

在 Chrome 中加载构建后的扩展：

1. 打开 `chrome://extensions`。
2. 开启右上角的**开发者模式**。
3. 点击**加载已解压的扩展程序**。
4. 选择仓库中的 `extension/` 目录。

请选择 `extension/`，不要选择仓库根目录或 ZIP 压缩包。生成文件 `extension/dist/content_bundle.js` 不纳入 Git 管理，因此克隆仓库后以及每次修改源码后都需要运行 `npm run build`。

## 使用方法

1. 在网页中选中至少三个字符。
2. 点击选区旁的蓝色 **de** 徽章；也可以右键选择 **Decode selection with DeCode**，或使用快捷键。
3. 直接查看自动识别结果，或在面板中手动选择解压/解码格式。
4. 基于任意结果继续处理、复制文本，或下载二进制输出。
5. 需要转换普通文本时，切换到编码模式。

## 隐私与权限

| 权限或存储 | 用途 |
|---|---|
| `<all_urls>` | 在选中文本的页面中注入选区徽章和操作面板 |
| `contextMenus` | 添加 **Decode selection with DeCode** 右键菜单项 |
| 浏览器本地存储 | 保存语言、最近历史和固定格式；DeCode 不会同步或上传这些内容 |

zstd 实现会直接打包进扩展。选中的文本和转换结果都不会发送到服务器。

## 开发与验证

```bash
# 运行测试
npm test

# 重新构建 content script bundle
npm run build
```

源码入口为 `extension/content_scripts/entry.js`。esbuild 会将 content scripts、decoders 和 `fzstd` 打包到 `extension/dist/content_bundle.js`。

## 项目结构

```text
decode/
|-- extension/
|   |-- background.js              右键菜单和快捷键处理
|   |-- content_scripts/           选区徽章、操作面板和翻译
|   |-- decoders/                  解码与解压实现
|   |-- dist/content_bundle.js     构建产物，不纳入 Git 管理
|   |-- icons/                     扩展图标
|   `-- manifest.json              Chrome Manifest V3 配置
|-- __tests__/                     Jest 单元测试与 DOM 测试
|-- build.js                       esbuild 配置
|-- privacy.html                   扩展隐私政策
|-- RELEASE_NOTES.md               当前版本说明
`-- STORE_LISTING.md               Chrome Web Store 文案
```

## 已知限制

- JWT 功能只解码 Header 和 Payload，不验证签名或 Token 有效性。
- gzip 和 deflate 依赖 Chrome 对 `DecompressionStream` 的支持。
- 自动识别有意采用保守策略，存在歧义的输入需要手动选择格式。
- 扩展无法在 `chrome://extensions` 等 Chrome 受保护页面中运行。

## 许可证

[MIT](LICENSE) (c) 2026 Three Liu。
