<p align="center">
  <img src="extension/icons/de-128.png" alt="DeCode icon" width="112" height="112">
</p>

<h1 align="center">DeCode</h1>

<p align="center">
  Decode, decompress, and encode selected text without leaving the page.
  A compact Chrome tool for inspecting payloads, URLs, tokens, and binary data in place.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-2f855a?style=flat-square" alt="MIT license"></a>
  <a href="RELEASE_NOTES.md"><img src="https://img.shields.io/badge/release-v0.2.0-2563eb?style=flat-square" alt="Release v0.2.0"></a>
  <a href="extension/manifest.json"><img src="https://img.shields.io/badge/Chrome-Manifest_V3-4285f4?style=flat-square&logo=googlechrome&logoColor=white" alt="Chrome Manifest V3"></a>
  <a href="privacy.html"><img src="https://img.shields.io/badge/processing-local_only-147d64?style=flat-square" alt="Local-only processing"></a>
  <a href="README.zh-CN.md"><img src="https://img.shields.io/badge/%E4%B8%AD%E6%96%87-README.zh--CN.md-d63f3f?style=flat-square" alt="Chinese README"></a>
</p>

DeCode is a Chrome extension for developers who regularly encounter encoded text in logs, API responses, dashboards, and documentation. Select text on any page, open the lightweight panel, and transform it without switching tabs or sending the value to an external service.

> [!IMPORTANT]
> All transformations run locally in the browser. The extension runtime does not make network requests. DeCode needs access to webpages only so it can display the selection badge and panel where you are working.

## Workflow

```text
select text on a webpage
          |
          v
click the "de" badge, use the context menu, or press the shortcut
          |
          v
auto-decode high-confidence input or choose a format manually
          |
          v
copy the result | continue the chain | download binary output
```

High-confidence JWT, Base64, URL-encoded, Unicode-escaped, gzip, zstd, and deflate input is detected automatically. Ordinary text is left untouched until you choose an operation.

## Supported operations

| Category | Formats | Behavior |
|---|---|---|
| Decompress | gzip, ZLIB/Deflate, zstd | Accepts Base64/Base64url-wrapped compressed data and returns text or downloadable bytes |
| Decode | Base64, Base32, URL, Unicode escapes, UTF-16, JWT, Cookie, HTML entities, Hex | Produces readable text and supports chained operations |
| Encode | Base64, URL, Hex, Unicode, Base32 | Converts text directly in the panel and provides one-click copy |

## Features

- Chain multiple decode and decompress steps, with the active source clearly marked.
- Download binary results when output cannot be represented as UTF-8 text.
- Open DeCode from the selection badge, the context menu, or `Ctrl+Shift+D` / `Command+Shift+D`.
- Keep up to 20 recent decode results and pin frequently used formats.
- Move the panel by dragging its header; positioning adapts to the available viewport space.
- Close with Escape, retain keyboard focus correctly, and adapt to compact screens.
- Follow the browser color scheme and switch between English and Chinese manually.
- Isolate the interface in Shadow DOM so page styles do not leak into the panel.

## Quick start

Node.js 18 or newer is recommended for development builds.

```bash
git clone https://github.com/Three-Liu/decode.git
cd decode
npm install
npm run build
```

Load the built extension in Chrome:

1. Open `chrome://extensions`.
2. Enable **Developer mode**.
3. Click **Load unpacked**.
4. Select the repository's `extension/` directory.

Select `extension/`, not the repository root or a ZIP archive. The generated `extension/dist/content_bundle.js` is ignored by Git, so run `npm run build` after cloning and after every source change.

## Usage

1. Select at least three characters on a webpage.
2. Click the blue **de** badge next to the selection. You can also right-click the selection and choose **Decode selection with DeCode**, or use the keyboard shortcut.
3. Use the detected result or choose a decompressor/decoder from the panel.
4. Continue from any result, copy text, or download binary output.
5. Switch to encode mode when you need to transform plain text instead.

## Privacy and permissions

| Permission or storage | Why it is used |
|---|---|
| `<all_urls>` | Injects the selection badge and panel into the page where text is selected |
| `contextMenus` | Adds the **Decode selection with DeCode** action |
| Browser-local storage | Remembers language, recent history, and pinned formats; nothing is synced or uploaded by DeCode |

The zstd implementation is bundled with the extension. No selected text or transformed output is transmitted to a server.

## Development

```bash
# Run the test suite
npm test

# Rebuild the content-script bundle
npm run build
```

The source entry point is `extension/content_scripts/entry.js`. esbuild bundles the content scripts, decoders, and `fzstd` into `extension/dist/content_bundle.js`.

## Project layout

```text
decode/
|-- extension/
|   |-- background.js              context-menu and shortcut handlers
|   |-- content_scripts/           selection badge, panel, and translations
|   |-- decoders/                  decode and decompress implementations
|   |-- dist/content_bundle.js     generated bundle; not tracked
|   |-- icons/                     extension artwork
|   `-- manifest.json              Chrome Manifest V3 configuration
|-- __tests__/                     Jest unit and DOM tests
|-- build.js                       esbuild configuration
|-- privacy.html                   extension privacy policy
|-- RELEASE_NOTES.md               current release notes
`-- STORE_LISTING.md               Chrome Web Store copy
```

## Limitations

- JWT support decodes the header and payload; it does not verify the signature or token validity.
- gzip and deflate rely on Chrome's `DecompressionStream` support.
- Automatic detection is intentionally conservative. Ambiguous input must be decoded manually.
- The extension cannot run on Chrome-protected pages such as `chrome://extensions`.

## License

[MIT](LICENSE) (c) 2026 Three Liu.
