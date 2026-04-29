// build.js — esbuild bundler for Chrome extension content scripts
// Run: node build.js
// Output: extension/dist/content_bundle.js

const esbuild = require('esbuild');
const path = require('path');
const fs = require('fs');

const outDir = path.join(__dirname, 'extension/dist');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

esbuild.build({
  entryPoints: [path.join(__dirname, 'extension/content_scripts/entry.js')],
  bundle: true,
  outfile: path.join(outDir, 'content_bundle.js'),
  platform: 'browser',
  format: 'iife',
  // fzstd is pure-JS, bundle it directly (no WASM needed)
}).then(() => {
  console.log('Build complete: extension/dist/content_bundle.js');
}).catch((e) => {
  console.error(e);
  process.exit(1);
});
