# Code & Math — 代码块与公式渲染

Agent-Native Slides — 代码层 + 数学层

---

## 数学公式：KaTeX（MIT）

CDN：`https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/`

### 同步渲染（推荐，无闪烁）

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"
  onload="renderMathInElement(document.body, {
    delimiters: [
      {left: '$$', right: '$$', display: true},
      {left: '$', right: '$',   display: false}
    ],
    throwOnError: false
  })">
</script>
```

### 手动渲染单个公式

```js
// display 模式（居中大号）
katex.render(
  '\\text{Attention}(Q,K,V) = \\text{softmax}\\!\\left(\\frac{QK^\\top}{\\sqrt{d_k}}\\right)V',
  document.getElementById('attn-formula'),
  { displayMode: true, throwOnError: false }
)
```

### 公式容器样式

```css
.formula-block {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: var(--space-lg) var(--space-xl);
  font-size: 1.35rem; /* scale for 1920×1080 stage */
}

/* KaTeX 本身不带颜色 token，手动注入 */
.formula-block .katex {
  color: var(--color-heading);
}

/* 行内公式与正文颜色一致 */
.katex-inline {
  color: var(--color-body);
}

/* 高亮某个符号（用 \class{hl}{x} 配合） */
.katex .hl {
  color: var(--color-accent);
}
```

### 逐步揭示公式（data-step 集成）

```html
<!-- 公式分步展示：先显示输入，再显示 Attention，再显示输出 -->
<div class="formula-block">
  <div data-step="1">$$Q, K, V \in \mathbb{R}^{n \times d}$$</div>
  <div data-step="2" style="opacity:0">
    $$\text{Attention}(Q,K,V) = \text{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V$$
  </div>
  <div data-step="3" style="opacity:0">$$O = W^O \cdot \text{Concat}(\text{head}_1, \ldots, \text{head}_h)$$</div>
</div>
```

```js
// data-step 驱动的逐步显示
let currentStep = 0
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') {
    currentStep++
    document.querySelectorAll(`[data-step="${currentStep}"]`).forEach(el => {
      gsap.to(el, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
    })
  }
})
```

---

## 代码高亮：Shiki（MIT）

CDN：`https://cdn.jsdelivr.net/npm/shiki@1.25.0/dist/index.browser.mjs`

### 初始化（异步，页面加载后）

```js
import { createHighlighter } from 'https://cdn.jsdelivr.net/npm/shiki@1.25.0/dist/index.browser.mjs'

let highlighter = null

async function initShiki() {
  highlighter = await createHighlighter({
    themes: ['github-dark-dimmed', 'github-light'],
    langs: ['python', 'javascript', 'typescript', 'bash', 'rust', 'go', 'json', 'yaml']
  })
}

function highlightCode(code, lang = 'python', darkMode = true) {
  if (!highlighter) return `<pre><code>${escapeHtml(code)}</code></pre>`
  return highlighter.codeToHtml(code, {
    lang,
    theme: darkMode ? 'github-dark-dimmed' : 'github-light'
  })
}
```

### 代码块容器

```html
<div class="code-block" data-lang="python">
  <div class="code-block__header">
    <span class="code-block__lang">Python</span>
    <span class="code-block__filename">train.py</span>
  </div>
  <div class="code-block__content" id="code-slot-1"></div>
</div>
```

```css
.code-block {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
  font-size: 0.85rem;  /* 调小一级适配幻灯片 */
}
.code-block__header {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 6px var(--space-md);
  background: var(--color-raised-surface);
  border-bottom: 1px solid var(--color-border);
}
.code-block__lang {
  font-family: var(--type-label);
  font-size: 10px;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.code-block__filename {
  font-family: var(--type-label);
  font-size: 11px;
  color: var(--color-body);
}
/* Shiki 生成的 pre 透明背景 */
.code-block__content pre {
  margin: 0;
  padding: var(--space-md);
  background: transparent !important;
  overflow-x: auto;
}
/* Mac 风格红绿灯（可选） */
.code-block__dots {
  display: flex; gap: 5px; margin-right: auto;
}
.code-block__dots span {
  width: 10px; height: 10px; border-radius: 50%;
}
.code-block__dots span:nth-child(1) { background: oklch(0.55 0.22 25); }
.code-block__dots span:nth-child(2) { background: oklch(0.65 0.20 90); }
.code-block__dots span:nth-child(3) { background: oklch(0.55 0.22 145); }
```

### 代码高亮行（diff / focus）

Shiki 支持 `// [!code highlight]` 和 `// [!code focus]` 注释：

```python
def attention(Q, K, V):
    d_k = Q.shape[-1]
    scores = Q @ K.transpose(-2, -1) / d_k ** 0.5  # [!code highlight]
    weights = F.softmax(scores, dim=-1)              # [!code highlight]
    return weights @ V
```

对应 CSS（Shiki 自动生成 `.highlighted` 类）：
```css
.shiki .highlighted {
  background: oklch(var(--accent-l) var(--accent-c) var(--accent-h) / 0.12);
  margin: 0 -16px;
  padding: 0 16px;
  border-left: 2px solid var(--color-accent);
}
```

---

## 代码高亮备选：highlight.js（BSD）

当不需要 Shiki 的精细功能时，用 highlight.js 更轻量：

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlight.js@11.10.0/styles/github-dark-dimmed.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.10.0/highlight.min.js"></script>
<script>
  // 页面就绪后批量渲染
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el))
  })
</script>
```

---

## 代码 + 公式混排（算法伪代码页面）

```html
<div class="algo-block">
  <div class="algo-block__title">Algorithm 1: Scaled Dot-Product Attention</div>
  <div class="algo-block__body">
    <div class="algo-line"><span class="algo-kw">Input:</span> $Q, K, V \in \mathbb{R}^{n \times d}$</div>
    <div class="algo-line algo-comment">// Compute attention scores</div>
    <div class="algo-line"><span class="algo-lnum">1:</span> $A \leftarrow QK^\top / \sqrt{d}$</div>
    <div class="algo-line"><span class="algo-lnum">2:</span> $\hat{A} \leftarrow \text{softmax}(A)$</div>
    <div class="algo-line algo-hl"><span class="algo-lnum">3:</span> <span class="algo-kw">return</span> $\hat{A}V$</div>
  </div>
</div>
```

```css
.algo-block {
  font-family: var(--type-label);
  font-size: 0.9rem;
  line-height: 2;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
}
.algo-block__title {
  font-weight: 600; color: var(--color-heading);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-sm); margin-bottom: var(--space-sm);
}
.algo-lnum { color: var(--color-muted); width: 2em; display: inline-block; }
.algo-kw { color: var(--color-accent); font-weight: 600; }
.algo-comment { color: var(--color-muted); font-style: italic; }
.algo-hl { background: oklch(var(--accent-l) var(--accent-c) var(--accent-h) / 0.1); }
```

---

## 注意事项

1. **KaTeX 必须同步渲染**：在 `document.fonts.ready` 之后调用 `renderMathInElement`，防止字体未加载导致布局抖动
2. **Shiki 异步初始化**：在幻灯片加载前完成，可以在 `DOMContentLoaded` 时启动，渲染在 `document.fonts.ready` 后执行
3. **代码字体**：用 `--type-label` token，各风格应映射到等宽字体（JetBrains Mono、Fira Code 等 OFL 字体）
4. **字号适配 1920×1080**：stage 内代码块字号建议 `0.8rem` 到 `0.9rem`（相对于 stage 根 font-size 20px → 约 16-18px）
