# ML Visuals — 机器学习架构图

HTML PPT Skill v5 — 手绘 SVG 方案，纯 CSS token 着色，零图片依赖

所有图均用内联 SVG 实现，通过 `currentColor` 和 CSS 变量适配风格 token。

---

## 通用绘图约定

```css
/* 所有 ML 图 SVG 注入此 CSS */
.ml-svg {
  --node-bg:      var(--color-surface);
  --node-border:  var(--color-border);
  --node-text:    var(--color-body);
  --arrow:        var(--color-muted);
  --highlight-bg: var(--color-accent);
  --highlight-fg: var(--color-bg);
  --label:        var(--color-muted);
  font-family: var(--type-label);
}
```

线宽规范：
- 主连接线：`stroke-width="1.5"`
- 箭头：`marker-end="url(#arrowhead)"`
- 高亮框：`stroke-width="2"`, `stroke: var(--color-accent)`

---

## 1. Transformer 整体架构

```html
<!-- 核心骨架，完整版见代码 -->
<svg class="ml-svg" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="var(--arrow)"/>
    </marker>
  </defs>

  <!-- Encoder stack (left) -->
  <g class="encoder-stack">
    <rect x="40" y="80" width="320" height="440" rx="8"
      fill="var(--node-bg)" stroke="var(--node-border)" stroke-width="1"/>
    <text x="200" y="60" text-anchor="middle" font-size="13" fill="var(--label)">Encoder × N</text>

    <!-- Multi-Head Attention -->
    <rect x="60" y="120" width="280" height="60" rx="6"
      fill="var(--color-raised-surface)" stroke="var(--highlight-bg)" stroke-width="1.5"/>
    <text x="200" y="156" text-anchor="middle" font-size="12" fill="var(--node-text)">Multi-Head Attention</text>

    <!-- Add & Norm -->
    <rect x="60" y="200" width="280" height="36" rx="4"
      fill="var(--node-bg)" stroke="var(--node-border)"/>
    <text x="200" y="223" text-anchor="middle" font-size="11" fill="var(--color-muted)">Add &amp; Norm</text>

    <!-- Feed Forward -->
    <rect x="60" y="256" width="280" height="60" rx="6"
      fill="var(--color-raised-surface)" stroke="var(--node-border)" stroke-width="1.5"/>
    <text x="200" y="292" text-anchor="middle" font-size="12" fill="var(--node-text)">Feed Forward</text>

    <!-- Add & Norm 2 -->
    <rect x="60" y="336" width="280" height="36" rx="4"
      fill="var(--node-bg)" stroke="var(--node-border)"/>
    <text x="200" y="359" text-anchor="middle" font-size="11" fill="var(--color-muted)">Add &amp; Norm</text>
  </g>

  <!-- Decoder stack (right) -->
  <g class="decoder-stack" transform="translate(420, 0)">
    <rect x="20" y="80" width="340" height="440" rx="8"
      fill="var(--node-bg)" stroke="var(--node-border)" stroke-width="1"/>
    <text x="190" y="60" text-anchor="middle" font-size="13" fill="var(--label)">Decoder × N</text>

    <!-- Masked Multi-Head Attention -->
    <rect x="40" y="120" width="300" height="60" rx="6"
      fill="var(--color-raised-surface)" stroke="var(--node-border)" stroke-width="1.5"/>
    <text x="190" y="152" text-anchor="middle" font-size="11" fill="var(--node-text)">Masked Multi-Head Attn</text>

    <!-- Cross-Attention (highlighted) -->
    <rect x="40" y="220" width="300" height="60" rx="6"
      fill="var(--highlight-bg)" stroke="transparent"/>
    <text x="190" y="248" text-anchor="middle" font-size="11" fill="var(--highlight-fg)" font-weight="600">Cross-Attention</text>
    <text x="190" y="265" text-anchor="middle" font-size="10" fill="var(--highlight-fg)" opacity="0.8">(K, V from Encoder)</text>
  </g>

  <!-- Cross connection arrow -->
  <path d="M 360,250 Q 395,250 420,250" stroke="var(--highlight-bg)" stroke-width="2"
    stroke-dasharray="4,3" fill="none" marker-end="url(#arrow)"/>

  <!-- Input labels -->
  <text x="200" y="545" text-anchor="middle" font-size="11" fill="var(--label)">Source Sequence</text>
  <text x="610" y="545" text-anchor="middle" font-size="11" fill="var(--label)">Target Sequence (shifted)</text>
</svg>
```

---

## 2. Scaled Dot-Product Attention

```html
<svg class="ml-svg" viewBox="0 0 500 380" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <marker id="arrow2" markerWidth="8" markerHeight="6" refX="6" refY="3" orient="auto">
      <path d="M0,0 L0,6 L8,3 z" fill="var(--arrow)"/>
    </marker>
  </defs>

  <!-- Q, K, V inputs -->
  <g font-size="13" text-anchor="middle">
    <text x="100" y="340" fill="var(--color-accent)" font-weight="600">Q</text>
    <text x="250" y="340" fill="var(--color-accent)" font-weight="600">K</text>
    <text x="400" y="340" fill="var(--color-accent)" font-weight="600">V</text>
  </g>

  <!-- MatMul QK -->
  <rect x="150" y="270" width="150" height="40" rx="5"
    fill="var(--color-raised-surface)" stroke="var(--node-border)"/>
  <text x="225" y="295" text-anchor="middle" font-size="11" fill="var(--node-text)">MatMul (Q·Kᵀ)</text>

  <!-- Scale -->
  <rect x="175" y="210" width="100" height="36" rx="5"
    fill="var(--node-bg)" stroke="var(--node-border)"/>
  <text x="225" y="233" text-anchor="middle" font-size="11" fill="var(--node-text)">Scale ÷ √dₖ</text>

  <!-- Softmax -->
  <rect x="175" y="155" width="100" height="36" rx="5"
    fill="var(--color-raised-surface)" stroke="var(--highlight-bg)" stroke-width="1.5"/>
  <text x="225" y="178" text-anchor="middle" font-size="11" fill="var(--node-text)">Softmax</text>

  <!-- MatMul with V -->
  <rect x="150" y="90" width="150" height="40" rx="5"
    fill="var(--color-raised-surface)" stroke="var(--node-border)"/>
  <text x="225" y="115" text-anchor="middle" font-size="11" fill="var(--node-text)">MatMul · V</text>

  <!-- Output -->
  <text x="225" y="55" text-anchor="middle" font-size="13" fill="var(--color-accent)" font-weight="600">Output</text>

  <!-- Arrows -->
  <line x1="225" y1="320" x2="225" y2="310" stroke="var(--arrow)" stroke-width="1.5" marker-end="url(#arrow2)"/>
  <line x1="225" y1="270" x2="225" y2="248" stroke="var(--arrow)" stroke-width="1.5" marker-end="url(#arrow2)"/>
  <line x1="225" y1="210" x2="225" y2="193" stroke="var(--arrow)" stroke-width="1.5" marker-end="url(#arrow2)"/>
  <line x1="225" y1="155" x2="225" y2="132" stroke="var(--arrow)" stroke-width="1.5" marker-end="url(#arrow2)"/>
  <line x1="225" y1="90" x2="225" y2="65" stroke="var(--arrow)" stroke-width="1.5" marker-end="url(#arrow2)"/>
  <!-- V bypass line -->
  <path d="M400,325 L400,100 L300,100" stroke="var(--color-accent)" stroke-width="1.5"
    stroke-dasharray="5,3" fill="none" marker-end="url(#arrow2)" opacity="0.7"/>
</svg>
```

---

## 3. Diffusion Process（扩散过程）

```html
<svg class="ml-svg" viewBox="0 0 900 200" xmlns="http://www.w3.org/2000/svg">
  <!-- 正向过程：x0 → xT（加噪） -->
  <g>
    <!-- x0 image box -->
    <rect x="20" y="60" width="100" height="80" rx="8"
      fill="var(--node-bg)" stroke="var(--color-accent)" stroke-width="2"/>
    <text x="70" y="105" text-anchor="middle" font-size="12" fill="var(--node-text)">x₀</text>
    <text x="70" y="158" text-anchor="middle" font-size="10" fill="var(--color-muted)">clean</text>

    <!-- Arrows with noise labels -->
    <path d="M125,100 L195,100" stroke="var(--color-muted)" stroke-width="1.5" marker-end="url(#arrow)"/>
    <text x="160" y="92" text-anchor="middle" font-size="9" fill="var(--color-muted)">+ε₁</text>

    <rect x="200" y="68" width="90" height="64" rx="6"
      fill="var(--node-bg)" stroke="var(--node-border)"/>
    <text x="245" y="104" text-anchor="middle" font-size="11" fill="var(--node-text)">x₁</text>

    <path d="M295,100 L345,100" stroke="var(--color-muted)" stroke-width="1.5" stroke-dasharray="3,2"/>
    <text x="320" y="92" text-anchor="middle" font-size="10" fill="var(--color-muted)">...</text>

    <rect x="350" y="68" width="90" height="64" rx="6"
      fill="var(--node-bg)" stroke="var(--node-border)"/>
    <text x="395" y="104" text-anchor="middle" font-size="11" fill="var(--node-text)">xₜ</text>

    <path d="M445,100 L495,100" stroke="var(--color-muted)" stroke-width="1.5" stroke-dasharray="3,2"/>

    <rect x="500" y="60" width="100" height="80" rx="8"
      fill="var(--color-raised-surface)" stroke="var(--node-border)" stroke-width="2"/>
    <text x="550" y="105" text-anchor="middle" font-size="12" fill="var(--color-muted)">x_T</text>
    <text x="550" y="158" text-anchor="middle" font-size="10" fill="var(--color-muted)">pure noise</text>

    <!-- Forward label -->
    <text x="310" y="25" text-anchor="middle" font-size="11" fill="var(--color-muted)">Forward (fixed, adds noise)</text>
    <path d="M80,35 L540,35" stroke="var(--color-muted)" stroke-width="1" stroke-dasharray="4,3" marker-end="url(#arrow)"/>
  </g>

  <!-- Reverse process arrow (U-Net θ) -->
  <g>
    <path d="M540,175 L80,175" stroke="var(--color-accent)" stroke-width="2" marker-end="url(#arrow)"/>
    <text x="310" y="165" text-anchor="middle" font-size="11" fill="var(--color-accent)" font-weight="600">Reverse (learned, U-Net θ)</text>
  </g>
</svg>
```

---

## 4. RAG（检索增强生成）架构

```html
<svg class="ml-svg" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
  <!-- Query -->
  <rect x="20" y="120" width="100" height="60" rx="6"
    fill="var(--color-accent)" stroke="transparent"/>
  <text x="70" y="155" text-anchor="middle" font-size="11" fill="var(--highlight-fg)" font-weight="600">Query</text>

  <!-- Retriever -->
  <rect x="160" y="110" width="120" height="80" rx="6"
    fill="var(--color-raised-surface)" stroke="var(--node-border)"/>
  <text x="220" y="148" text-anchor="middle" font-size="11" fill="var(--node-text)">Retriever</text>
  <text x="220" y="165" text-anchor="middle" font-size="9" fill="var(--color-muted)">(FAISS / BM25)</text>

  <!-- Vector DB -->
  <rect x="160" y="220" width="120" height="50" rx="6"
    fill="var(--node-bg)" stroke="var(--color-accent)" stroke-width="1.5"/>
  <text x="220" y="248" text-anchor="middle" font-size="11" fill="var(--node-text)">Vector DB</text>

  <!-- Context chunks -->
  <rect x="330" y="80" width="120" height="160" rx="6"
    fill="var(--node-bg)" stroke="var(--node-border)"/>
  <text x="390" y="108" text-anchor="middle" font-size="11" fill="var(--node-text)">Top-K Chunks</text>
  <rect x="345" y="118" width="90" height="24" rx="3" fill="var(--color-raised-surface)"/>
  <rect x="345" y="150" width="90" height="24" rx="3" fill="var(--color-raised-surface)"/>
  <rect x="345" y="182" width="90" height="24" rx="3" fill="var(--color-raised-surface)"/>

  <!-- LLM -->
  <rect x="500" y="100" width="120" height="100" rx="8"
    fill="var(--color-raised-surface)" stroke="var(--highlight-bg)" stroke-width="2"/>
  <text x="560" y="148" text-anchor="middle" font-size="12" fill="var(--node-text)" font-weight="600">LLM</text>
  <text x="560" y="165" text-anchor="middle" font-size="9" fill="var(--color-muted)">(prompt + context)</text>

  <!-- Output -->
  <rect x="670" y="120" width="100" height="60" rx="6"
    fill="var(--color-accent)"/>
  <text x="720" y="155" text-anchor="middle" font-size="11" fill="var(--highlight-fg)" font-weight="600">Answer</text>

  <!-- Arrows -->
  <path d="M120,150 L158,150" stroke="var(--arrow)" stroke-width="1.5" marker-end="url(#arrow)"/>
  <path d="M220,190 L220,218" stroke="var(--arrow)" stroke-width="1.5" stroke-dasharray="3,2" marker-end="url(#arrow)"/>
  <path d="M220,218 L220,190" stroke="var(--color-accent)" stroke-width="1" opacity="0.5"/>
  <path d="M280,150 L328,150" stroke="var(--arrow)" stroke-width="1.5" marker-end="url(#arrow)"/>
  <path d="M450,150 L498,150" stroke="var(--arrow)" stroke-width="1.5" marker-end="url(#arrow)"/>
  <!-- Query to LLM also -->
  <path d="M120,165 Q450,240 498,175" stroke="var(--color-muted)" stroke-width="1"
    stroke-dasharray="4,3" fill="none" marker-end="url(#arrow)"/>
  <path d="M620,150 L668,150" stroke="var(--arrow)" stroke-width="1.5" marker-end="url(#arrow)"/>
</svg>
```

---

## 5. 通用 Encoder-Decoder 框图

```html
<svg class="ml-svg" viewBox="0 0 700 160" xmlns="http://www.w3.org/2000/svg">
  <!-- Input -->
  <rect x="10" y="50" width="100" height="60" rx="6"
    fill="var(--node-bg)" stroke="var(--node-border)"/>
  <text x="60" y="85" text-anchor="middle" font-size="11" fill="var(--node-text)">Input</text>

  <!-- Encoder -->
  <rect x="150" y="40" width="140" height="80" rx="8"
    fill="var(--color-raised-surface)" stroke="var(--color-accent)" stroke-width="2"/>
  <text x="220" y="85" text-anchor="middle" font-size="12" fill="var(--node-text)" font-weight="600">Encoder</text>

  <!-- Latent / Context -->
  <rect x="330" y="55" width="80" height="50" rx="5"
    fill="var(--color-accent)"/>
  <text x="370" y="84" text-anchor="middle" font-size="10" fill="var(--highlight-fg)" font-weight="600">z / context</text>

  <!-- Decoder -->
  <rect x="450" y="40" width="140" height="80" rx="8"
    fill="var(--color-raised-surface)" stroke="var(--color-accent)" stroke-width="2"/>
  <text x="520" y="85" text-anchor="middle" font-size="12" fill="var(--node-text)" font-weight="600">Decoder</text>

  <!-- Output -->
  <rect x="630" y="50" width="60" height="60" rx="6"
    fill="var(--node-bg)" stroke="var(--node-border)"/>
  <text x="660" y="85" text-anchor="middle" font-size="11" fill="var(--node-text)">Output</text>

  <!-- Arrows -->
  <path d="M110,80 L148,80" stroke="var(--arrow)" stroke-width="1.5" marker-end="url(#arrow)"/>
  <path d="M290,80 L328,80" stroke="var(--arrow)" stroke-width="1.5" marker-end="url(#arrow)"/>
  <path d="M410,80 L448,80" stroke="var(--arrow)" stroke-width="1.5" marker-end="url(#arrow)"/>
  <path d="M590,80 L628,80" stroke="var(--arrow)" stroke-width="1.5" marker-end="url(#arrow)"/>
</svg>
```

---

## 使用说明

1. 将 SVG 直接内联在 `<div class="slide-content">` 内
2. 确保父元素已设置风格 CSS token（`--color-surface` 等）
3. 需要高亮某个模块时，将其 `stroke` 改为 `var(--color-accent)`，添加 `stroke-width="2"`
4. 动效：配合 `data-step` 和 GSAP 逐步揭示模块
