# DeCode v0.2.0

Release date: 2026-09-04

## Highlights

- High-confidence automatic detection and one-click decoding for JWT, Base64,
  URL, Unicode, gzip, zstd, and deflate inputs.
- Binary output now disables further decode actions and supports direct download.
- Async decoders show a loading state and prevent duplicate clicks.
- Added Escape close, keyboard shortcut, and context-menu entry points.
- Badge positioning flips at the viewport edge and reuses its host during
  selection changes.
- Added chain-source indication, dark mode, responsive sizing, focus management,
  recent history, pinned formats, and manual English/Chinese switching.

## Validation

- 87 tests passing
- Production bundle built with `npm run build`
- Release archive: `decodec-v0.2.0.zip`
