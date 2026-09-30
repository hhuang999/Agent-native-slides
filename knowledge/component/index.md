# Component Library Index

Agent-Native Slides — 组件层索引

组件是可复用的视觉构件。每个组件通过 CSS custom properties 继承当前风格 token，不硬编码颜色或字体。

---

## 组件原则

1. **Token 继承，不硬编码**：颜色、字体、间距全部用 `var(--token)` 引用
2. **一个组件，一个职责**：Data Card 只做数字展示，Timeline 只做历程，不混用
3. **无布局假设**：组件不假设自己在页面哪个位置，由父容器决定
4. **风格无关**：同一个组件在 G01（学术）和 L01（AI）中只换 token，HTML/CSS 结构不变

---

## 组件速查表

| 组件 | 文件 | 用途 | 关键 token |
|------|------|------|-----------|
| Data Card | 本文件 | KPI / 统计数字 | `--color-surface`, `--color-accent` |
| Timeline | 本文件 | 历程 / 路线图 | `--color-accent`, `--color-muted` |
| Comparison | 本文件 | A vs B / Before-After | `--color-surface`, `--color-border` |
| Bento Grid | 本文件 | 多维度特性展示 | `--color-surface`, `--color-border` |
| Step Flow | 本文件 | 操作流程 / 方法论 | `--color-accent`, `--color-body` |
| Count-Up | 本文件 | 大数字动效 | `--color-heading`, `--color-accent` |
| Code Block | `code-math.md` | 代码高亮展示 | `--color-surface`, `--type-label` |
| Math Formula | `code-math.md` | KaTeX 公式 | `--color-body`, `--type-display` |
| ECharts | `charts.md` | 数据图表 | accent + neutral ramp |
| ML Diagrams | `ml-visuals.md` | Transformer / Attention / etc. | SVG + CSS token |

---

## 通用 CSS Token 约定

所有组件必须用以下 token，不引入新 token：

```css
/* 颜色 */
--color-bg              /* 页面背景 */
--color-surface         /* 卡片/区块背景 */
--color-raised-surface  /* 悬浮元素背景 */
--color-border          /* 边框 */
--color-muted           /* 次要文字、标签 */
--color-body            /* 正文文字 */
--color-heading         /* 标题文字 */
--color-accent          /* 强调色（数据点、高亮、链接） */

/* 排版 */
--type-display          /* 展示字体（大标题） */
--type-body             /* 正文字体 */
--type-label            /* 标签字体（等宽或小字） */

/* 字号 */
--text-hero   --text-title   --text-subtitle
--text-body   --text-caption --text-code

/* 间距 */
--space-xs  --space-sm  --space-md  --space-lg  --space-xl

/* 圆角 */
--radius-sm  --radius-md  --radius-lg
```

---

## Data Card（数据卡片）

**用途**：KPI、统计数字、单项指标展示

```html
<div class="data-card">
  <div class="data-card__label">Validation Accuracy</div>
  <div class="data-card__value" data-countup="94.3">0</div>
  <div class="data-card__unit">%</div>
  <div class="data-card__delta data-card__delta--up">+2.1 vs baseline</div>
</div>
```

```css
.data-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}
.data-card__label {
  font-family: var(--type-label);
  font-size: var(--text-caption);
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.data-card__value {
  font-family: var(--type-display);
  font-size: var(--text-title);
  color: var(--color-heading);
  line-height: 1;
  font-variant-numeric: tabular-nums;
}
.data-card__unit {
  font-family: var(--type-label);
  font-size: var(--text-body);
  color: var(--color-muted);
}
.data-card__delta--up   { color: oklch(0.55 0.18 145); } /* 语义绿 */
.data-card__delta--down { color: oklch(0.55 0.20 25);  } /* 语义红 */
```

---

## Timeline（时间线）

**用途**：历程、路线图、方法论步骤（横向或纵向）

```html
<div class="timeline timeline--horizontal">
  <div class="timeline__item">
    <div class="timeline__dot"></div>
    <div class="timeline__label">2017</div>
    <div class="timeline__text">Transformer architecture introduced</div>
  </div>
  <!-- repeat -->
</div>
```

```css
.timeline--horizontal {
  display: flex;
  align-items: flex-start;
  gap: 0;
  position: relative;
}
.timeline--horizontal::before {
  content: '';
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  height: 1px;
  background: var(--color-border);
}
.timeline__dot {
  width: 20px; height: 20px;
  border-radius: 50%;
  background: var(--color-accent);
  border: 2px solid var(--color-bg);
  box-shadow: 0 0 0 2px var(--color-accent);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
.timeline__label {
  font-family: var(--type-label);
  font-size: var(--text-caption);
  color: var(--color-accent);
  margin-top: var(--space-xs);
  font-variant-numeric: tabular-nums;
}
.timeline__text {
  font-family: var(--type-body);
  font-size: var(--text-caption);
  color: var(--color-body);
  margin-top: 4px;
  max-width: 180px;
}
```

---

## Comparison（对比）

**用途**：两方案并排比较（A vs B，Before/After，Model A vs B）

```html
<div class="comparison">
  <div class="comparison__col comparison__col--a">
    <div class="comparison__label">Baseline</div>
    <div class="comparison__content">...</div>
  </div>
  <div class="comparison__divider">vs</div>
  <div class="comparison__col comparison__col--b">
    <div class="comparison__label">Ours</div>
    <div class="comparison__content">...</div>
  </div>
</div>
```

```css
.comparison {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--space-md);
  align-items: start;
}
.comparison__col {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}
.comparison__col--b {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 1px var(--color-accent);
}
.comparison__divider {
  font-family: var(--type-display);
  font-size: var(--text-subtitle);
  color: var(--color-muted);
  align-self: center;
  padding: 0 var(--space-sm);
}
.comparison__label {
  font-family: var(--type-label);
  font-size: var(--text-caption);
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: var(--space-sm);
}
```

---

## Bento Grid（Bento 网格）

**用途**：多维度特性展示，不均等大小的模块拼合

```html
<div class="bento-grid">
  <div class="bento-item bento-item--wide">Large feature</div>
  <div class="bento-item">Small</div>
  <div class="bento-item">Small</div>
  <div class="bento-item bento-item--tall">Tall</div>
</div>
```

```css
.bento-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-auto-rows: 200px;
  gap: var(--space-sm);
}
.bento-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  overflow: hidden;
}
.bento-item--wide { grid-column: span 2; }
.bento-item--tall { grid-row: span 2; }
.bento-item--accent {
  background: var(--color-accent);
  border-color: transparent;
}
```

---

## Step Flow（步骤流程）

**用途**：操作流程、研究方法论、Pipeline 说明

```html
<div class="step-flow">
  <div class="step-flow__item" data-step="1">
    <div class="step-flow__num">01</div>
    <div class="step-flow__body">
      <div class="step-flow__title">Data Collection</div>
      <div class="step-flow__desc">Scrape 10M web pages with deduplication.</div>
    </div>
  </div>
  <!-- repeat -->
</div>
```

```css
.step-flow {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  position: relative;
}
.step-flow::before {
  content: '';
  position: absolute;
  left: 22px;
  top: 32px;
  bottom: 32px;
  width: 1px;
  background: var(--color-border);
}
.step-flow__item {
  display: flex;
  gap: var(--space-md);
  align-items: flex-start;
}
.step-flow__num {
  width: 44px; height: 44px;
  border-radius: var(--radius-sm);
  background: var(--color-accent);
  color: var(--color-bg);
  font-family: var(--type-label);
  font-size: var(--text-caption);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
}
.step-flow__title {
  font-family: var(--type-body);
  font-size: var(--text-body);
  font-weight: 600;
  color: var(--color-heading);
}
.step-flow__desc {
  font-family: var(--type-body);
  font-size: var(--text-caption);
  color: var(--color-muted);
  margin-top: 4px;
}
```

---

## Count-Up（数字滚动动效）

**用途**：在 `data-step` 揭示时触发数字动态滚动到目标值

```html
<span class="countup" data-target="94.3" data-decimals="1" data-suffix="%">0%</span>
```

```js
function initCountUp(el) {
  const target = parseFloat(el.dataset.target)
  const decimals = parseInt(el.dataset.decimals || '0')
  const suffix = el.dataset.suffix || ''
  const prefix = el.dataset.prefix || ''
  const duration = 1200

  let start = null
  const raf = (ts) => {
    if (!start) start = ts
    const progress = Math.min((ts - start) / duration, 1)
    const ease = 1 - Math.pow(1 - progress, 3) // cubic ease-out
    const value = (ease * target).toFixed(decimals)
    el.textContent = prefix + value + suffix
    if (progress < 1) requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}

// 与 data-step 系统集成：
document.querySelectorAll('.countup').forEach(el => {
  const observer = new MutationObserver(() => {
    if (el.closest('.revealed') || el.closest('.is-active')) {
      observer.disconnect()
      initCountUp(el)
    }
  })
  observer.observe(el.parentElement, { attributes: true, attributeFilter: ['class'] })
})
```

---

## Quote Block（引用块）

**用途**：学者引用、金句突出

```html
<blockquote class="quote-block">
  <p class="quote-block__text">
    "Attention is all you need."
  </p>
  <footer class="quote-block__attr">
    — Vaswani et al., NeurIPS 2017
  </footer>
</blockquote>
```

```css
.quote-block {
  position: relative;
  padding: var(--space-md) var(--space-lg);
  border-left: 3px solid var(--color-accent);
  margin: 0;
}
.quote-block::before {
  content: '\201C';
  position: absolute;
  top: -0.2em; left: var(--space-sm);
  font-family: var(--type-display);
  font-size: 6rem;
  line-height: 1;
  color: var(--color-accent);
  opacity: 0.25;
}
.quote-block__text {
  font-family: var(--type-display);
  font-size: var(--text-subtitle);
  color: var(--color-heading);
  font-style: italic;
  line-height: 1.4;
  margin: 0;
}
.quote-block__attr {
  font-family: var(--type-label);
  font-size: var(--text-caption);
  color: var(--color-muted);
  margin-top: var(--space-sm);
}
```

---

## 组件进阶文件

- `ml-visuals.md` — ML 架构图（Transformer、Attention、Diffusion 等 SVG 手绘方案）
- `charts.md` — ECharts 学术配色方案、常用图类型配置
- `code-math.md` — KaTeX 公式渲染、Shiki/highlight.js 代码块
