# TODOS

## v2 候选
- [ ] 自动识别编码类型（选中文本后推断最可能的格式）— v1 不做，避免误判；v2 可以加"猜一猜"按钮
- [ ] ROT13 解码器（P2，CTF 用户场景）
- [ ] Punycode 解码器（P2，国际化域名解析）

## 技术债
- [ ] JWT 边界情况处理（2-part JWT、非 JSON payload）— v1 按设计忽略，但真实 JWT 有各种变体
- [ ] 移动端 Chrome 支持 — Chrome 移动版扩展 API 受限，v1 仅桌面
- [ ] 历史记录/收藏功能 — 方便开发者复用常用解码链

## 待验证的开放问题
- [ ] content script 中 `WebAssembly.instantiateStreaming(fetch(chrome.runtime.getURL(...)))` 是否在所有页面 CSP 下都能正常工作，需要尽早写最小复现验证
- [ ] "de" 图标是否足够直觉？发布后社区反馈收集，考虑换成 `{}` 或 `🔓`
