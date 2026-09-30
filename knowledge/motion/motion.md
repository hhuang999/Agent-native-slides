# Motion Library

HTML PPT Skill v5 — 动效规范

---

## 动效四大类别

1. **背景氛围（Background Atmosphere）** — 持续运行，永远在底层
2. **入场动效（Entrance）** — 幻灯片切入时元素登场
3. **强调动效（Emphasis）** — 演讲者 highlight 某个元素
4. **数据叙事（Data Narrative）** — 图表动态绘制

---

## 第一类：背景氛围动效（14 种）

每套风格都必须有背景氛围动效。极简风格用克制版。

### 1. mesh-drift
**适用风格**：A02, A04, F01, F02, F03, L01, L02, L03  
**技术**：CSS `@property` + `@keyframes`，OKLCH 色值插值  
**特性**：0 依赖，纯 CSS，支持 GPU 合成层

```css
@property --mesh-hue {
  syntax: '<number>';
  inherits: false;
  initial-value: 260;
}
@keyframes mesh-cycle {
  to { --mesh-hue: 320; }
}
.bg-mesh {
  animation: mesh-cycle 12s ease-in-out infinite alternate;
  background: radial-gradient(
    ellipse 80% 60% at 30% 40%,
    oklch(0.25 0.18 var(--mesh-hue)) 0%,
    transparent 70%
  ),
  radial-gradient(
    ellipse 60% 80% at 70% 60%,
    oklch(0.20 0.22 calc(var(--mesh-hue) + 40)) 0%,
    transparent 70%
  );
}
```

**reduced-motion fallback**：静态背景，使用渐变的终态颜色

---

### 2. aurora-band
**适用风格**：A03, B03, F01  
**技术**：CSS `@keyframes` translateY + opacity，多层极光带叠加  
**特性**：纯 CSS，极光带沿屏幕宽度横向飘移

```css
.aurora-band {
  position: absolute;
  width: 200%;
  height: 40%;
  background: linear-gradient(
    180deg,
    transparent 0%,
    oklch(0.55 0.25 160 / 0.3) 30%,
    oklch(0.60 0.22 200 / 0.2) 60%,
    transparent 100%
  );
  animation: aurora-drift 8s ease-in-out infinite alternate;
  transform-origin: center;
}
@keyframes aurora-drift {
  from { transform: translateX(-25%) translateY(-10%) rotate(-2deg); }
  to   { transform: translateX(0%)   translateY(10%)  rotate(2deg); }
}
```

---

### 3. particle-float
**适用风格**：A04, B01, B02, J02  
**技术**：tsParticles MIT（`@tsparticles/engine@3`）或纯 Canvas 2D  
**配置示例（tsParticles）**：

```js
tsParticles.load('bg-canvas', {
  particles: {
    number: { value: 40 },
    size: { value: { min: 1, max: 3 } },
    move: { enable: true, speed: 0.6, direction: 'none', random: true },
    opacity: { value: { min: 0.1, max: 0.5 }, animation: { enable: true, speed: 0.5 } },
    color: { value: 'oklch(0.75 0.18 235)' }
  },
  background: { opacity: 0 }
})
```

---

### 4. shader-grain
**适用风格**：A06, A08, I03  
**技术**：`@paper-design/shaders@0.4.1`（Apache-2.0）

```js
import { Grain } from 'https://cdn.jsdelivr.net/npm/@paper-design/shaders@0.4.1/dist/index.js'
const grain = new Grain({ canvas: document.getElementById('bg-canvas') })
grain.setParams({ speed: 0.3, colorBack: [0.08, 0.02, 0.12], colorFront: [0.20, 0.12, 0.28] })
```

---

### 5. dot-pulse
**适用风格**：D02, M03  
**技术**：Canvas 2D，网点矩阵 opacity 脉冲

```js
function drawDotGrid(ctx, w, h, phase) {
  const spacing = 40, r = 2
  ctx.clearRect(0, 0, w, h)
  for (let x = spacing/2; x < w; x += spacing) {
    for (let y = spacing/2; y < h; y += spacing) {
      const dist = Math.hypot(x - w/2, y - h/2)
      const alpha = 0.06 + 0.04 * Math.sin(phase - dist * 0.008)
      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.arc(x, y, r, 0, Math.PI * 2)
      ctx.fill()
    }
  }
}
```

---

### 6. liquid-blob
**适用风格**：O01  
**技术**：SVG `<animate>` + `<filter>` feTurbulence，有机 blob 慢变形

```html
<svg class="bg-blob" viewBox="0 0 800 600">
  <filter id="blob-filter">
    <feTurbulence type="fractalNoise" baseFrequency="0.012" numOctaves="3" result="noise">
      <animate attributeName="baseFrequency" values="0.010;0.015;0.010" dur="8s" repeatCount="indefinite"/>
    </feTurbulence>
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="60"/>
  </filter>
  <ellipse cx="400" cy="300" rx="280" ry="200" fill="oklch(0.28 0.10 140 / 0.5)" filter="url(#blob-filter)"/>
</svg>
```

---

### 7. starfield-parallax
**适用风格**：A04  
**技术**：Canvas 2D，三层视差星场

```js
const layers = [
  { count: 60,  speed: 0.1, size: 1,   alpha: 0.4 },
  { count: 30,  speed: 0.2, size: 1.5, alpha: 0.6 },
  { count: 15,  speed: 0.4, size: 2.5, alpha: 0.9 }
]
```

---

### 8. film-grain
**适用风格**：C01, C02, C04, I03  
**技术**：SVG feTurbulence data-URI overlay，opacity 脉冲

```html
<div class="film-grain-overlay" aria-hidden="true"
  style="
    position: absolute; inset: 0; pointer-events: none;
    background-image: url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%221920%22 height=%221080%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/><feColorMatrix type=%22saturate%22 values=%220%22/></filter><rect width=%221920%22 height=%221080%22 filter=%22url(%23n)%22 opacity=%220.5%22/></svg>');
    animation: grain-flicker 0.15s steps(1) infinite;
  ">
</div>
@keyframes grain-flicker {
  0%   { background-position: 0 0 }
  25%  { background-position: -50px -30px }
  50%  { background-position: 30px 50px }
  75%  { background-position: -20px 40px }
  100% { background-position: 0 0 }
}
```

---

### 9. circuit-trace
**适用风格**：A01, J01  
**技术**：SVG `stroke-dashoffset` 动画，电路路径循环绘制

```html
<svg class="bg-circuit" viewBox="0 0 1920 1080" aria-hidden="true">
  <path class="circuit-line" d="M100,540 H600 V300 H900 V600 H1400 V200 H1820"/>
  <style>
    .circuit-line {
      fill: none;
      stroke: oklch(0.75 0.22 195 / 0.25);
      stroke-width: 1;
      stroke-dasharray: 2400;
      stroke-dashoffset: 2400;
      animation: trace 4s ease-out forwards, trace-loop 8s 4s linear infinite;
    }
    @keyframes trace { to { stroke-dashoffset: 0; } }
    @keyframes trace-loop {
      0%   { stroke-dashoffset: 0; }
      50%  { stroke-dashoffset: -2400; }
      50.01% { stroke-dashoffset: 2400; }
      100% { stroke-dashoffset: 0; }
    }
  </style>
</svg>
```

---

### 10. wave-sine
**适用风格**：A06  
**技术**：Canvas 2D 正弦波，多层叠加

```js
function drawWaves(ctx, w, h, t) {
  ctx.clearRect(0, 0, w, h)
  const waves = [
    { amp: 30, freq: 0.003, speed: 0.8, y: h * 0.6, alpha: 0.12, color: '185' },
    { amp: 20, freq: 0.005, speed: 1.2, y: h * 0.7, alpha: 0.08, color: '200' }
  ]
  waves.forEach(w => {
    ctx.beginPath()
    ctx.strokeStyle = `oklch(0.78 0.18 ${w.color} / ${w.alpha})`
    ctx.lineWidth = 1.5
    for (let x = 0; x <= canvas.width; x += 2) {
      const y = w.y + Math.sin(x * w.freq + t * w.speed) * w.amp
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
    }
    ctx.stroke()
  })
}
```

---

### 11. hologram-scan
**适用风格**：A05, A07  
**技术**：CSS conic-gradient 旋转 + scan line overlay

```css
.hologram-bg {
  background: conic-gradient(
    from var(--holo-angle),
    oklch(0.55 0.28 300 / 0.3),
    oklch(0.60 0.25 240 / 0.2),
    oklch(0.50 0.30 180 / 0.3),
    oklch(0.55 0.28 300 / 0.3)
  );
  animation: holo-spin 6s linear infinite;
}
@keyframes holo-spin { to { --holo-angle: 360deg; } }

.scan-line {
  background: repeating-linear-gradient(
    0deg, transparent, transparent 3px,
    oklch(0.9 0 0 / 0.03) 3px, oklch(0.9 0 0 / 0.03) 4px
  );
  animation: scan 3s linear infinite;
}
@keyframes scan { to { background-position: 0 100%; } }
```

---

### 12. lottie-ambient
**适用风格**：（可选，用于 M01/M02 有机插画底图）  
**技术**：lottie-web 5.12.2，MIT

```js
import lottie from 'https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.12.2/lottie.min.js'
const anim = lottie.loadAnimation({
  container: document.getElementById('bg-lottie'),
  renderer: 'svg',
  loop: true,
  autoplay: true,
  path: 'assets/ambient.json'
})
anim.setSpeed(0.3)
```

---

### 13. gradient-breathe
**适用风格**：E01, E03, G04, H01, I04, K02, K03, O02（极简首选）  
**技术**：纯 CSS `@keyframes`，OKLCH mesh 慢速漂移，最克制

```css
@keyframes gradient-breathe {
  0%, 100% {
    background: radial-gradient(ellipse 70% 50% at 30% 40%, oklch(0.94 0.01 215) 0%, oklch(0.97 0.005 205) 100%);
  }
  50% {
    background: radial-gradient(ellipse 70% 50% at 70% 60%, oklch(0.92 0.02 215) 0%, oklch(0.97 0.005 205) 100%);
  }
}
.bg-breathe {
  animation: gradient-breathe 8s ease-in-out infinite;
}
```

---

### 14. light-sweep
**适用风格**：C03, D03, E02, G03, H02, J03, K01, N02（浅色克制首选）  
**技术**：纯 CSS，横向极淡光带扫过，opacity ≤ 8%

```css
.bg-light-sweep::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 20%,
    oklch(1 0 0 / 0.06) 50%,
    transparent 80%
  );
  background-size: 200% 100%;
  animation: light-sweep 6s ease-in-out infinite;
}
@keyframes light-sweep {
  from { background-position: -100% 0; }
  to   { background-position: 200% 0; }
}
```

---

### grain-breathe（极简 variant）
**适用风格**：D01, D03, D04, G01, G02, H03, I01  
**技术**：SVG feTurbulence data-URI，opacity 微脉冲（3%→6%）

```css
.bg-grain {
  background-image: url("data:image/svg+xml,..."); /* feTurbulence */
  opacity: 0.04;
  animation: grain-breathe 4s ease-in-out infinite;
}
@keyframes grain-breathe {
  0%, 100% { opacity: 0.03; }
  50%       { opacity: 0.06; }
}
```

---

## 第二类：入场动效（Entrance）

### fade-up（默认推荐）
```js
// GSAP
gsap.from(el, { opacity: 0, y: 24, duration: 0.5, ease: 'power2.out' })
```

### reveal-mask（高端感文字揭示）
```css
.reveal-mask {
  overflow: hidden;
}
.reveal-mask > * {
  transform: translateY(100%);
  animation: reveal 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
@keyframes reveal {
  to { transform: translateY(0); }
}
```

### scale-in（图表/图片）
```js
gsap.from(chartEl, { scale: 0.92, opacity: 0, duration: 0.5, ease: 'back.out(1.2)' })
```

### stagger-list（多要点依次出现）
```js
gsap.from('.step-item', {
  opacity: 0, x: -16,
  stagger: 0.12,
  duration: 0.4,
  ease: 'power2.out'
})
```

---

## 第三类：强调动效（Emphasis）

### rough-underline（关键词粗糙下划线）
```js
import { annotate } from 'https://unpkg.com/rough-notation@0.6.1/lib/rough-notation.iife.js'
const a = annotate(el, { type: 'underline', color: 'var(--color-accent)', strokeWidth: 2 })
a.show()
```

### count-up（数字滚动）
```js
function countUp(el, end, duration = 1200) {
  const start = Date.now()
  const raf = () => {
    const p = Math.min((Date.now() - start) / duration, 1)
    const ease = 1 - Math.pow(1 - p, 3) // cubic ease-out
    el.textContent = Math.round(ease * end).toLocaleString()
    if (p < 1) requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)
}
```

### highlight-pulse（色块闪烁提示）
```css
@keyframes highlight-pulse {
  0%, 100% { background-color: transparent; }
  40%      { background-color: oklch(var(--accent-l) var(--accent-c) var(--accent-h) / 0.2); }
}
.highlighted { animation: highlight-pulse 1.2s ease-in-out; }
```

---

## 第四类：数据叙事（Data Narrative）

### ECharts 图表绘制动效
```js
const chart = echarts.init(el)
chart.setOption({
  animation: true,
  animationDuration: 800,
  animationEasing: 'cubicOut',
  animationDelay: idx => idx * 80  // 分组柱逐一出现
})
```

### 折线绘制（path-draw）
```js
// SVG path 描边动画
path.style.strokeDasharray = path.getTotalLength()
path.style.strokeDashoffset = path.getTotalLength()
path.style.transition = 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)'
path.style.strokeDashoffset = '0'
```

---

## 通用规则

### timing
- 背景氛围：6–12s，无限循环，ease-in-out
- 入场动效：0.4–0.6s，cubic-bezier(0.16, 1, 0.3, 1)（expo out 感觉）
- 强调动效：0.3–0.8s，根据需要
- 数据绘制：0.6–1.2s，cubicOut

### prefers-reduced-motion
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

### 性能
- 只动 `transform` 和 `opacity`（不动 `top/left/width/height`）
- 背景层加 `will-change: transform`（谨慎使用，每页最多 1–2 个元素）
- Canvas 用 `requestAnimationFrame`，切换到非活跃页时停止动效
