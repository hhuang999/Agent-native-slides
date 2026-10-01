# Runtime Technical Reference

Agent-Native Slides — 技术规范文档

---

## 1. 固定舞台 (Fixed Stage)

所有 preview.html 和生成的 deck HTML 必须使用 1920×1080 固定舞台，通过 CSS transform 缩放适应窗口。

```css
.slide-stage {
  position: relative;
  width: 1920px;
  height: 1080px;
  transform-origin: top left;
  transform: scale(var(--scale));
  overflow: hidden;
}
```

缩放 JS（必须在 `document.fonts.ready` 后执行）：

```js
const setScale = () => {
  const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080)
  document.documentElement.style.setProperty('--scale', s)
}
window.addEventListener('resize', setScale)
document.fonts.ready.then(() => {
  setScale()
  // 字体加载完成后启动背景动效
  document.querySelector('.slide-stage')?.classList.add('fonts-ready')
})
```

---

## 2. 幻灯片切换（禁止 display:none）

```css
/* ✅ 正确 */
.slide {
  position: absolute;
  inset: 0;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}
.slide.is-active {
  visibility: visible;
  opacity: 1;
  pointer-events: auto;
}

/* ❌ 禁止 — 会导致 display:flex 覆盖，且 display:none→flex 无法触发入场过渡 */
.slide { display: none; }
.slide.is-active { display: block; }
```

需要 flex 布局的页面直接写 `.slide { display: flex; flex-direction: column; }`（始终 flex），只用 visibility/opacity 切换。入场动效挂在 `.slide.is-active .reveal` 上。

切换 JS 见 §3.1（统一的 Runtime API，1-indexed）。

---

## 3. 演讲者预览（?preview=N）

用于 studio（editor / presenter）iframe 嵌入：`?preview=N` 直接打开第 N 页（**1-indexed**，与 Deck Plan 的 `index`、`__goToSlide(n)` 一致），并隐藏翻页控件（加 `html.preview-mode`）。越界值钳制到 1..total。

```js
const q = new URLSearchParams(location.search)
if (q.has('preview')) {
  document.documentElement.classList.add('preview-mode')   // .preview-mode .deck-nav { display:none }
  goToSlide(parseInt(q.get('preview'), 10) || 1)
}
```

## 3.1 Runtime API 合同（所有 deck / preview.html / demo 必须实现）

消费方：`scripts/export-pptx.js`（新文稿读取内嵌对象模型并测量实际布局；`--image` 才循环截图）、`scripts/export-pdf.js`（`?print=1`）、`studio/editor.html` 与 `studio/presenter.html`（`?preview=N`、`__deckPlan.total_slides`、`__deckPlan.slides[n-1].speaker_notes`）、`scripts/check-deck.js`（合同校验）。新文稿的 `__deckPlan` 由 `#ans-document` 派生，不能作为保存权威。

| 项 | 要求 |
|----|------|
| `.slide` | 每页一个 `.slide`，按 DOM 顺序排列，带 `data-slide="n"`（1-indexed）；当前页加 `.is-active` |
| `window.__deckPlan` | **对象**（不是数组）：`{ title, total_slides, slides: [{ index, type, assertion, speaker_notes? }] }`，`total_slides` === `.slide` 数量，`slides[i].index === i + 1` |
| `window.__currentSlide` | 当前页码，1-indexed，初始为 1 |
| `window.__goToSlide(n)` | 1-indexed，钳制到 1..total，同步更新 `__currentSlide` 与 `.is-active` |
| 键盘 | → / ↓ / Space / PageDown 下一页；← / ↑ / PageUp 上一页；Home / End 首尾页 |
| `?preview=N` | 见 §3 |
| `?print=1` | 加 `html.print-mode` 标记；PDF 由 `@media print` 规则保证所有页可见并逐页排列（见 §7） |

```js
const slideEls = Array.from(document.querySelectorAll('.slide'))
slideEls.forEach((s, i) => { s.dataset.slide = i + 1 })

window.__deckPlan = {
  title: 'Deck title',
  total_slides: slideEls.length,
  slides: [ /* { index: 1, type: 'title', assertion: '…', speaker_notes: {…} }, … */ ]
}
window.__currentSlide = 1

function goToSlide(n) {
  const total = slideEls.length
  n = Math.min(Math.max(1, Math.round(+n) || 1), total)
  slideEls.forEach((s, i) => s.classList.toggle('is-active', i === n - 1))
  window.__currentSlide = n
}
window.__goToSlide = goToSlide

document.addEventListener('keydown', e => {
  const k = e.key
  if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown') { e.preventDefault(); goToSlide(window.__currentSlide + 1) }
  else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') { e.preventDefault(); goToSlide(window.__currentSlide - 1) }
  else if (k === 'Home') goToSlide(1)
  else if (k === 'End') goToSlide(slideEls.length)
})

const q = new URLSearchParams(location.search)
if (q.has('print')) document.documentElement.classList.add('print-mode')
if (q.has('preview')) document.documentElement.classList.add('preview-mode')
goToSlide(q.has('preview') ? parseInt(q.get('preview'), 10) || 1 : 1)
```

若页内有 `data-step` 逐步揭示（§5），键盘"下一页"先调用 `advanceStep()`，返回 false 时再翻页；`__goToSlide(n)` 直接跳页并把目标页所有 step 设为已揭示（导出截图要看到完整内容）。

---

## 4. 背景动效必要规范

所有背景动效层必须：

```css
/* reduced-motion 降级 */
@media (prefers-reduced-motion: reduce) {
  .bg-motion,
  .bg-motion * {
    animation: none !important;
    transition: none !important;
  }
}

/* 氛围层永远低于内容层 */
.bg-atmosphere {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}
.slide-content {
  position: relative;
  z-index: 1;
}
```

**对比度要求：** 正文与背景对比度 ≥ WCAG AA (4.5:1)。背景动效层不得干扰阅读。

---

## 5. 数据步骤揭示 (data-step)

用于在同一页内逐步揭示元素：

```html
<div class="slide" data-steps="3">
  <h1>Main claim</h1>
  <div data-step="1" class="step-item">Point 1</div>
  <div data-step="2" class="step-item">Point 2</div>
  <div data-step="3" class="step-item">Point 3</div>
</div>
```

```css
.step-item { opacity: 0; transform: translateY(12px); transition: opacity 0.3s, transform 0.3s; }
.step-item.revealed { opacity: 1; transform: none; }
```

```js
let stepIndex = 0
function advanceStep() {
  const slide = document.querySelector('.slide.is-active')
  const maxSteps = +(slide?.dataset.steps || 0)
  if (stepIndex < maxSteps) {
    stepIndex++
    slide.querySelectorAll(`[data-step="${stepIndex}"]`)
      .forEach(el => el.classList.add('revealed'))
    return true // consumed
  }
  return false // go to next slide
}
```

---

## 6. 色彩 token 约定

所有风格使用 OKLCH 定义色彩 token，组件通过 CSS 变量继承：

```css
:root {
  /* 核心 token — 每个风格重新定义 */
  --color-bg:            oklch(0.97 0.01 88);
  --color-surface:       oklch(0.99 0.005 90);
  --color-raised-surface:oklch(0.95 0.01 85);
  --color-border:        oklch(0.82 0.01 80);
  --color-muted:         oklch(0.55 0.02 80);
  --color-body:          oklch(0.22 0.01 255);
  --color-heading:       oklch(0.10 0.01 255);
  --color-accent:        oklch(0.48 0.16 255);

  /* 间距 token */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 32px;
  --space-lg: 64px;
  --space-xl: 96px;

  /* 圆角 token */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 16px;

  /* 字体 token */
  --type-display: 'EB Garamond', serif;  /* 标题字体 */
  --type-body:    'Source Code Pro', monospace; /* 正文字体 */
  --type-label:   var(--type-body);

  /* 固定 1920×1080 舞台字号；窗口适配仅由舞台 transform 负责 */
  --text-hero:    104px;
  --text-title:   64px;
  --text-subtitle:36px;
  --text-body:    30px;
  --text-caption: 20px;
  --text-code:    24px;
}
```

在固定舞台内不要用 `vw` 或随浏览器窗口变化的 `clamp(...vw...)` 给正文定字号：舞台已按窗口缩放，再按视口缩字会造成双重缩小。具体风格可以调整比例，但核心正文须遵循 `knowledge/element/elements.md` 的可读性下限；若装不下，先删减、重排或拆页。

### 6.1 文字版面检查

生成后等待 `document.fonts.ready`，逐页在 1920×1080 屏幕布局中检查，再在 `@media print` 布局中复查。`scripts/check-deck.js` 使用实际文本片段的位置报告：

- `text-overflow`：文字伸出幻灯片边界；
- `text-clipped`：文字被某个 `overflow: hidden/clip/auto/scroll` 容器裁切；
- `text-overlap`：两段可见文字的渲染区域明显重叠。

运行 `node scripts/check-deck.js deck.html --json layout-report.json` 查看页码、元素路径和位置。报告不输出正文，避免把敏感内容写入日志。屏幕与打印布局都必须通过。只可给纯装饰且不承载内容的文字加 `data-layout-ignore` 或 `aria-hidden="true"`；不能用它们跳过必要正文。自动几何检查不能判断语义密度或图表画布中的字，应同时审看每页截图。

---

## 7. 导出路径

| 格式 | 方式 | 说明 |
|------|------|------|
| HTML | 直接交付单文件 | 主产物，所有资源内联或 CDN（版本号 pin） |
| PDF 16:9 | `scripts/export-pdf.js` → Playwright headless print（`?print=1`） | `@page { size: 1920px 1080px; margin: 0 }` |
| PPTX 默认 | `scripts/export-pptx.js` → 对象模型 + 布局测量 + pptxgenjs | 元素级可编辑；逐对象转换清单与输入 SHA-256 |
| PPTX 保真 | `scripts/export-pptx.js --image` → Playwright 截图 + pptxgenjs | 每页整图，明确标注图片版 |

PDF 与图片版 PPTX 在导出前检查其捕获版面；默认可编辑 PPTX 验证对象模型并测量每个对象的屏幕布局。交付前运行 `check-deck.js`，并核对导出的视觉效果与原生对象。

新文稿对象协议、工作台保存与导出路径、逐对象限制见 `docs/editable-workbench.md`。新文稿的打包命令会拒绝无适配器的内容对象；导出必须读取已保存 HTML 或本地助手收到的当前快照。旧文稿继续使用原有截图导出路径。

## 9. 工作台隔离与状态协议

`build-deck.js` 把 `workbench/i18n.js`、`workbench/runtime.js` 和 `workbench/workbench.css` 一起内联。工作台首次进入默认简体中文；界面语言保存在浏览器本地，与 `document.language` 和 `#ans-document` 分离。重新打包从版本化 JSON 开始，用户后续修改必须从其**已保存 HTML** 用 `extract-document.js` 提取。

编辑中的 `doc` 是内存工作副本，每次渲染同步更新 `#ans-document`；序列化使用初次载入时的固定工作台壳和当前 `doc`，排除令牌、语言、任务、选中框、辅助线与临时 DOM。保存和快照导出由这份序列化结果计算 SHA-256。`__deckPlan` 始终从 `doc` 派生，不参与保存。

绝对定位对象支持多选、框选、拖动、尺寸手柄、吸附辅助线及键盘微调；一次拖动只写入一条撤销记录。flex/grid 对象保持容器布局，通过内容、顺序与适用属性编辑。`?preview=N`、`?print=1`、浏览器打印、PDF 和 PPTX 捕获隐藏工作台；切换演示模式还要清除编辑选中框。工作台快捷键仅在编辑模式生效，不抢占演示翻页键。

可选本地助手 `node scripts/export-helper.js --file <绝对路径>` 在回环地址提供固定文件写回和 Git 版本历史。它只接受启动时指定的 HTML，令牌保护所有操作。文件写入与版本提交是可区分的两阶段状态；Git 仓库位于该文稿专属历史目录，原 HTML 仍是当前文件。未启动助手时，普通浏览器保存、下载与自动草稿照常工作。

PDF 导出 CSS（`page.pdf()` 会自动启用 print media；舞台和页面改为文档流，每页一张 1920×1080）：

```css
@media print {
  @page { size: 1920px 1080px; margin: 0; }
  html, body { margin: 0; width: 1920px; height: auto !important; overflow: visible !important; background: var(--color-bg); }
  .deck-stage, .slide-stage { position: static !important; transform: none !important; width: 1920px !important; height: auto !important; overflow: visible !important; }
  .slide { position: relative !important; inset: auto !important; width: 1920px !important; height: 1080px !important;
           visibility: visible !important; opacity: 1 !important; pointer-events: auto !important;
           break-after: page; page-break-after: always; overflow: hidden; }
  .slide:last-child { break-after: auto; page-break-after: auto; }
  .slide .reveal, .slide [data-step] { opacity: 1 !important; transform: none !important; }
  .deck-nav, .deck-controls, .wh-ui, .hwp-ui { display: none !important; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

`?print=1` 只是给 `html` 加 `.print-mode` 标记（可选地用于屏幕上预览打印排版），PDF 导出以 `@media print` 为准。`.slide` 在打印模式下必须保持原 `display`（flex/grid/block），不得写 `display: none`，否则 PDF 只剩当前页。

---

## 8. CDN 版本锁定（必须 pin）

```
ECharts:       https://cdn.jsdelivr.net/npm/echarts@5.4.3/dist/echarts.min.js
KaTeX CSS:     https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css
KaTeX JS:      https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js
GSAP:          https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js
Mermaid:       https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js
Lucide:        https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js
rough-notation: https://unpkg.com/rough-notation@0.6.1/lib/rough-notation.iife.js
shaders:       https://cdn.jsdelivr.net/npm/@paper-design/shaders@0.4.1/dist/index.js
lottie-web:    https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js
```

**Google Fonts** — 所有字体通过 `display=swap` 加载：

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet">
```

53 种风格的标题、正文、辅助字体及离线英文字体备选见 `knowledge/style/font-policy.json`。每个 `preview.html` 加载 `knowledge/style/font-fallback.css`，其中的本地简体中文字体使用 `font-display: swap` 与 CJK `unicode-range`，避免覆盖风格原有的拉丁字形。新文稿将对应 `@font-face` 规则放进模型的 `theme.css`，把相对路径指向本地字体，交给 `build-deck.js` 内联；旧文稿仍可使用 `inline-assets.js`。日文风格 I02 在 `<html lang="zh-CN">` 时把本地简体中文字形放在日文字体之前。

`document.fonts.ready` 表示已使用字体的加载及排版完成，并不证明某个字形由指定字体绘制。交付前运行 `node scripts/check-deck.js deck.html --font-fallback`，阻断外部字体请求，复查屏幕与打印版面的换行、越界和裁切；正常加载和回退状态都应通过。字体排版参考 [MDN CSS Font Loading API](https://developer.mozilla.org/en-US/docs/Web/API/Document/fonts)、[MDN font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/%40font-face/font-display) 与 [W3C 文字间距说明](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing)。

---

## 9. WebGL/Canvas fallback

```html
<!-- WebGL 背景降级 -->
<div class="bg-atmosphere">
  <canvas id="bg-canvas" aria-hidden="true"></canvas>
</div>
<noscript>
  <style>.bg-atmosphere { background: var(--color-bg); }</style>
</noscript>
```

Feature detection：

```js
function canWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch { return false }
}
if (!canWebGL()) {
  document.querySelector('.bg-canvas')?.remove()
  // fall back to CSS gradient-breathe
}
```

---

## 10. WCAG 对比度检查

Runtime API 合同（§3.1）、切换方式（§2）、文字版面（§6.1）和打印模式（§7）由 `node scripts/check-deck.js <deck.html>` 自动校验，交付前必须通过。

对比度检查逻辑：

```js
// 相对亮度
function luminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c /= 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

function contrastRatio(l1, l2) {
  const [lighter, darker] = [Math.max(l1, l2), Math.min(l1, l2)]
  return (lighter + 0.05) / (darker + 0.05)
}
// WCAG AA: ratio >= 4.5 (normal text), >= 3.0 (large text ≥18pt or bold ≥14pt)
```
