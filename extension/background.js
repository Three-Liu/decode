'use strict';

const MENU_ID = 'decodec-decode-selection';

function sendOpenMessage(tabId, text, frameId) {
  if (!tabId || !chrome.tabs || !chrome.tabs.sendMessage) return;
  const options = typeof frameId === 'number' ? { frameId } : undefined;
  Promise.resolve(chrome.tabs.sendMessage(tabId, { type: 'decodec-open', text: text || '' }, options)).catch(() => {});
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: 'Decode selection with DeCode',
    contexts: ['selection'],
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== MENU_ID || !tab) return;
  sendOpenMessage(tab.id, info.selectionText, info.frameId);
});

chrome.commands.onCommand.addListener((command) => {
  if (command !== 'open-decodec') return;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) sendOpenMessage(tabs[0].id, '', 0);
  });
});
