# 全风格字体适配审查

审查对象：53 个风格的 `design.md`、`preview.html`，以及按相同字体角色生成的 53 张中/英/中英混排测试页。测试页使用 1920×1080 舞台、60px 标题、30px 正文、22px 辅助文字，分别在网页字体正常加载与阻断外部字体两种状态下渲染。

## 方法与结果

- 逐一核对标题、正文、辅助字体的角色、字重请求、字宽、字形来源、`display=swap`、本地简体中文回退和离线英文字体备选。浏览器 DevTools 的实际字形来源用于确认字体，不把 `document.fonts.check()` 当作字形覆盖证明。
- 53 个真实预览页在加载/回退两种状态下逐页检查屏幕与打印布局。发现 I03、M01 的长断言，以及 H03、I02 的回退布局问题后，已通过精简文字或增加间距修复。最终 106 次预览检查均为 0 项溢出、裁切或重叠；修复页也通过 `check-deck.js --font-fallback` 复核。
- 53 张生成测试页在两种字体状态下均完成 HTML 渲染、PDF 导出和 PPTX 截图导出。每种状态生成 53 份单页 PDF 与一份 53 页 PPTX；53 张 PPTX 内嵌图像与浏览器截图逐字节一致。未发现文字越界、裁切或重叠；标题和正文在回退后的换行变化均不超过一行。
- 简体中文在所有测试页的标题、正文和辅助文字中均由项目自带的 Noto Sans SC、Noto Serif SC 或 LXGW WenKai 字体绘制。网页字体正常加载时，英文字形由各风格指定的网页字体绘制；断网时使用 Arial、Georgia 或 Consolas。

## 逐风格字体角色

`黑/宋/楷` 分别表示本地 `Slides CJK Sans`、`Slides CJK Serif`、`Slides CJK WenKai`。表中回退列按「标题/正文/辅助」排列。风格名链接到实际 `design.md`；每个目录中的 `preview.html` 也已同步。

| 风格 | 标题 | 正文 | 辅助文字 | 拉丁离线备选 | 简体中文备选 |
|---|---|---|---|---|---|
| [A01 circuit-engineered](../knowledge/style/A01/design.md) | Geist Mono | Instrument Sans | Geist Mono | Consolas/Arial/Consolas | 黑/黑/黑 |
| [A02 ultraviolet-immersive](../knowledge/style/A02/design.md) | Syne | DM Sans | DM Sans | Arial/Arial/Arial | 黑/黑/黑 |
| [A03 deep-sapphire](../knowledge/style/A03/design.md) | Instrument Serif | DM Sans | DM Mono | Georgia/Arial/Consolas | 宋/黑/黑 |
| [A04 cosmic-void](../knowledge/style/A04/design.md) | Outfit | Outfit | JetBrains Mono | Arial/Arial/Consolas | 黑/黑/黑 |
| [A05 neon-cyberpunk](../knowledge/style/A05/design.md) | Rajdhani | Instrument Sans | Source Code Pro | Arial/Arial/Arial | 黑/黑/黑 |
| [A06 deep-ocean](../knowledge/style/A06/design.md) | Fraunces | DM Sans | DM Mono | Georgia/Arial/Consolas | 宋/黑/黑 |
| [A07 holographic-iridescent](../knowledge/style/A07/design.md) | Lexend Mega | Lexend | JetBrains Mono | Arial/Arial/Consolas | 黑/黑/黑 |
| [A08 dark-vaporwave](../knowledge/style/A08/design.md) | Silkscreen | Josefin Sans | Josefin Sans | Consolas/Arial/Arial | 黑/黑/黑 |
| [B01 dark-glassmorphism](../knowledge/style/B01/design.md) | Plus Jakarta Sans | Plus Jakarta Sans | Space Mono | Arial/Arial/Consolas | 黑/黑/黑 |
| [B02 light-glassmorphism](../knowledge/style/B02/design.md) | Instrument Serif | DM Sans | DM Sans | Georgia/Arial/Arial | 宋/黑/黑 |
| [B03 aurora-glass](../knowledge/style/B03/design.md) | Syne | Instrument Sans | JetBrains Mono | Arial/Arial/Consolas | 黑/黑/黑 |
| [B04 warm-glass](../knowledge/style/B04/design.md) | Playfair Display SC | IBM Plex Sans | IBM Plex Mono | Georgia/Arial/Consolas | 宋/黑/黑 |
| [C01 film-noir](../knowledge/style/C01/design.md) | Bebas Neue | IBM Plex Mono | IBM Plex Mono | Arial/Consolas/Consolas | 黑/黑/黑 |
| [C02 dark-editorial-cinema](../knowledge/style/C02/design.md) | Cormorant Garamond | Space Grotesk | Space Grotesk | Georgia/Arial/Arial | 宋/黑/黑 |
| [C03 light-editorial-magazine](../knowledge/style/C03/design.md) | DM Serif Display | DM Sans | DM Sans | Georgia/Arial/Arial | 宋/黑/黑 |
| [C04 cinematic-amber](../knowledge/style/C04/design.md) | Fraunces | Plus Jakarta Sans | Plus Jakarta Sans | Georgia/Arial/Arial | 宋/黑/黑 |
| [D01 swiss-international](../knowledge/style/D01/design.md) | IBM Plex Sans Condensed | IBM Plex Sans | IBM Plex Sans | Arial/Arial/Arial | 黑/黑/黑 |
| [D02 bauhaus-geometric](../knowledge/style/D02/design.md) | Archivo Black | Space Grotesk | Space Grotesk | Arial/Arial/Arial | 黑/黑/黑 |
| [D03 brutalist-editorial](../knowledge/style/D03/design.md) | Barlow Condensed | Barlow | Barlow | Arial/Arial/Arial | 黑/黑/黑 |
| [D04 dark-swiss](../knowledge/style/D04/design.md) | IBM Plex Sans Condensed | IBM Plex Sans | IBM Plex Sans | Arial/Arial/Arial | 黑/黑/黑 |
| [E01 fog-grey-nordic](../knowledge/style/E01/design.md) | Hanken Grotesk | Hanken Grotesk | Hanken Grotesk | Arial/Arial/Arial | 黑/楷/黑 |
| [E02 pale-birch-nordic](../knowledge/style/E02/design.md) | DM Serif Display | DM Sans | DM Sans | Georgia/Arial/Arial | 宋/黑/黑 |
| [E03 glacier-blue-nordic](../knowledge/style/E03/design.md) | Fraunces | Plus Jakarta Sans | Plus Jakarta Sans | Georgia/Arial/Arial | 宋/黑/黑 |
| [F01 aurora-borealis-dark](../knowledge/style/F01/design.md) | Bricolage Grotesque | Geist Mono | Geist Mono | Arial/Consolas/Consolas | 黑/黑/黑 |
| [F02 aurora-dawn-light](../knowledge/style/F02/design.md) | Lora | Nunito | Nunito | Georgia/Arial/Arial | 宋/黑/黑 |
| [F03 mesh-gradient-vivid](../knowledge/style/F03/design.md) | Syne | Space Grotesk | Space Grotesk | Arial/Arial/Arial | 黑/黑/黑 |
| [G01 light-journal-academic](../knowledge/style/G01/design.md) | EB Garamond | EB Garamond | Source Code Pro | Georgia/Georgia/Arial | 宋/宋/黑 |
| [G02 dark-journal-academic](../knowledge/style/G02/design.md) | Playfair Display | EB Garamond | EB Garamond | Georgia/Georgia/Georgia | 宋/宋/宋 |
| [G03 neutral-academic-beige](../knowledge/style/G03/design.md) | Source Serif 4 | Source Serif 4 | Source Sans 3 | Georgia/Georgia/Arial | 宋/宋/黑 |
| [G04 clean-academic-sans](../knowledge/style/G04/design.md) | DM Sans | DM Sans | DM Sans | Arial/Arial/Arial | 黑/黑/黑 |
| [H01 primer-clean](../knowledge/style/H01/design.md) | Inter | Inter | Inter | Arial/Arial/Arial | 黑/黑/黑 |
| [H02 trust-blue](../knowledge/style/H02/design.md) | Libre Baskerville | Libre Franklin | Libre Franklin | Georgia/Arial/Arial | 宋/黑/黑 |
| [H03 executive-dark-bold](../knowledge/style/H03/design.md) | Syne | Space Grotesk | Space Grotesk | Arial/Arial/Arial | 黑/黑/黑 |
| [I01 cream-paper-warm](../knowledge/style/I01/design.md) | Cormorant Garamond | Jost | Jost | Georgia/Arial/Arial | 宋/黑/黑 |
| [I02 wabi-sabi-japanese](../knowledge/style/I02/design.md) | Shippori Mincho | Noto Sans JP | Noto Sans JP | Georgia/Arial/Arial | 宋/黑/黑 |
| [I03 warm-film-grain](../knowledge/style/I03/design.md) | Instrument Serif | Space Grotesk | Space Grotesk | Georgia/Arial/Arial | 宋/黑/黑 |
| [I04 soft-bento](../knowledge/style/I04/design.md) | Nunito | Nunito | Nunito | Arial/Arial/Arial | 黑/黑/黑 |
| [J01 terminal-monochrome](../knowledge/style/J01/design.md) | JetBrains Mono | JetBrains Mono | JetBrains Mono | Consolas/Consolas/Consolas | 黑/黑/黑 |
| [J02 data-dashboard](../knowledge/style/J02/design.md) | IBM Plex Sans | IBM Plex Sans | IBM Plex Mono | Arial/Arial/Consolas | 黑/黑/黑 |
| [J03 light-engineering](../knowledge/style/J03/design.md) | IBM Plex Serif | IBM Plex Sans | IBM Plex Mono | Georgia/Arial/Consolas | 宋/黑/黑 |
| [K01 monochrome-luxury](../knowledge/style/K01/design.md) | Cormorant Garamond | Jost | Jost | Georgia/Arial/Arial | 宋/黑/黑 |
| [K02 gold-dark-premium](../knowledge/style/K02/design.md) | Playfair Display | Lato | Lato | Georgia/Arial/Arial | 宋/黑/黑 |
| [K03 dusty-rose-editorial](../knowledge/style/K03/design.md) | Libre Baskerville | Raleway | Raleway | Georgia/Arial/Arial | 宋/黑/黑 |
| [L01 deep-ai-dark](../knowledge/style/L01/design.md) | Syne | Syne | Geist Mono | Arial/Arial/Consolas | 黑/黑/黑 |
| [L02 purple-ai-immersive](../knowledge/style/L02/design.md) | Bricolage Grotesque | Geist Mono | Geist Mono | Arial/Consolas/Consolas | 黑/黑/黑 |
| [L03 teal-ai-light](../knowledge/style/L03/design.md) | Plus Jakarta Sans | Plus Jakarta Sans | Plus Jakarta Sans | Arial/Arial/Arial | 黑/黑/黑 |
| [M01 watercolor-wash](../knowledge/style/M01/design.md) | Playfair Display | Lato | Lato | Georgia/Arial/Arial | 宋/黑/黑 |
| [M02 ink-illustration](../knowledge/style/M02/design.md) | Spectral | Spectral | Jost | Georgia/Georgia/Arial | 宋/宋/黑 |
| [M03 risograph-print](../knowledge/style/M03/design.md) | Space Grotesk | Space Grotesk | Space Grotesk | Arial/Arial/Arial | 黑/黑/黑 |
| [N01 art-deco-gold](../knowledge/style/N01/design.md) | Cinzel | Cormorant Garamond | Cinzel | Georgia/Georgia/Georgia | 宋/宋/宋 |
| [N02 retro-modern-50s](../knowledge/style/N02/design.md) | Bebas Neue | Nunito | Nunito | Arial/Arial/Arial | 黑/黑/黑 |
| [O01 organic-moss](../knowledge/style/O01/design.md) | Lora | Nunito | Nunito | Georgia/Arial/Arial | 宋/黑/黑 |
| [O02 sand-dune](../knowledge/style/O02/design.md) | Fraunces | Plus Jakarta Sans | Plus Jakarta Sans | Georgia/Arial/Arial | 宋/黑/黑 |

## 调整理由

- **A02**：Syne 保留品牌感标题；正文与标签改用 DM Sans，替代 Fontshare Satoshi 依赖，避免跨服务字体元数据异常。
- **A05、A07**：Rajdhani 与 Lexend Mega 的窄/宽极端字形留在标题；正文分别改用 Instrument Sans 和普通 Lexend，减少连续阅读的字宽波动。
- **A06、B03、B04**：保留 Fraunces、Syne、Playfair Display SC 的展示性标题；正文改为 DM Sans、Instrument Sans、IBM Plex Sans，避免把装饰性或小型大写字形用于段落。
- **E01**：英文仍用 Hanken Grotesk，中文正文用本地 LXGW WenKai 呼应柔和风格；标题使用 Noto Sans SC 保持结构感。
- **I02**：日文页面保留 Shippori Mincho / Noto Sans JP；`lang="zh-CN"` 时优先选本地简体中文字形，防止日文字形替代简体汉字。
- **I03、M01、I02**：断网字体较宽时，原有长标题或证据段落挤出画布。已精简可见文字，并将限定条件移入演讲备注；H03 的统计值与标签改用更宽的间距。

## 加载与生成规则

所有预览页加载 `knowledge/style/font-fallback.css`。其中三个本地 `@font-face` 使用 CJK `unicode-range` 与 `font-display: swap`；字体栈明确列出拉丁字体、同类型离线备选、本地中文字体及通用族。生成独立 HTML 时，只复制该风格用到的字体规则，设置正确的 `<html lang>`，并用 `inline-assets.js` 内联所需 WOFF2。导出前运行 `node scripts/check-deck.js deck.html --font-fallback`。

本地中文字体文件仅包含常规字重。较粗标题由浏览器合成加粗；已在测试页的 HTML、PDF 和 PPTX 渲染中检查。自动几何检测无法判断图表 canvas 内文字或未知内容的语义密度，具体成品仍需查看导出页。仓库没有额外提供用户成品 deck；本次“生成页”是按每种风格的字体政策制作的一致性测试页。

## 参考依据

- [MDN：Font Loading API 与 `document.fonts.ready`](https://developer.mozilla.org/en-US/docs/Web/API/Document/fonts)
- [MDN：`font-display` 的加载和回退时序](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face/font-display)
- [MDN：`unicode-range` 控制字符覆盖和下载](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face/unicode-range)
- [Google Fonts CSS API：精确请求字体样式](https://developers.google.com/fonts/docs/css2)
- [W3C：文字间距变化时避免内容丢失](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing)
