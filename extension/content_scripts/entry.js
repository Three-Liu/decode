'use strict';

// Browser entry point — bundled by esbuild into dist/content_bundle.js
// Tests import content.js and panel.js directly (CommonJS, no bundling needed).

require('./i18n');  // ensure language detection runs before any UI
const { openPanel, removePanel } = require('./panel');
const { setup } = require('./content');

// Expose panel functions globally so content.js badge click can reference them.
// In the bundled IIFE, content.js and panel.js share the same closure, but
// the badge click handler uses `typeof openPanel === 'function'` which resolves
// to this global assignment.
globalThis.openPanel = openPanel;
globalThis.removePanel = removePanel;

setup();
