# F01 — aurora-borealis-dark（北极光暗色）

---

## 1. Thesis 与情绪词

**设计立场：** 色彩是主角，不是装饰。整个视觉语言建立在极光的物理现象上：深夜蓝黑的天幕，流动的绿紫青光带，星光点缀其间。设计的工作是让文字在这个环境中清晰而不破坏氛围。

**情绪词：** Ethereal（空灵）· Alive（有生命感）· Immersive（沉浸）· Luminous（发光）· Expansive（广阔）

**与最相似风格的差异：**
- vs A02 ultraviolet-immersive：A02 是有机液态紫色弥散，无方向感；F01 是有方向感的横向极光带动效，光带有明确的流向。
- vs B03 aurora-glass：B03 是玻璃卡片折射极光，卡片是主体；F01 是直接沐浴在极光背景中，文字直接与光交互。

---

## 2. 色彩与光感

**光感隐喻：** 北纬70度的深冬夜空。近纯黑的天幕，绿色极光带横向流过，紫色、青色渗透其间。没有人造光，只有自然发光体。

```css
:root {
  --color-bg:      oklch(0.07 0.02 265);   /* 深夜蓝黑 */
  --color-surface: oklch(0.12 0.03 260);   /* 深色卡片底（半透明叠用） */
  --color-border:  oklch(0.25 0.05 255);   /* 极光边缘蓝紫 */
  --color-muted:   oklch(0.52 0.08 190);   /* 次要文字，极光青调 */
  --color-body:    oklch(0.82 0.03 200);   /* 正文，冷白青色调 */
  --color-heading: oklch(0.95 0.02 200);   /* 标题，近白冷调 */
  --color-accent:  oklch(0.72 0.22 160);   /* 极光绿，主点缀 */
  --color-accent2: oklch(0.62 0.20 295);   /* 极光紫，辅助点缀 */
}
```

---

## 3. 材质质感

**表面类型：** glass + glow — 半透明毛玻璃 + 外发光

**CSS 实现：**
```css
.surface-card {
  background: oklch(0.12 0.03 260 / 0.55);
  backdrop-filter: blur(16px) saturate(1.4);
  border: 1px solid oklch(0.35 0.08 200 / 0.4);
  box-shadow:
    0 0 0 1px oklch(0.55 0.15 160 / 0.1),
    0 8px 32px oklch(0.07 0.02 265 / 0.6);
}
```

**视觉作用：** 玻璃面是观察极光的窗户，不完全透明，让极光的色彩渗透进来，同时保持文字可读。

---

## 4. 背景氛围

**动效名称：** aurora-band + mesh-drift（双层叠加）

**技术实现：**
```css
/* 层一：mesh-drift — 底层极光色团 */
@property --au-x { syntax: '<percentage>'; inherits: false; initial-value: 20%; }
@property --au-y { syntax: '<percentage>'; inherits: false; initial-value: 40%; }

.bg-aurora {
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 80% 40% at var(--au-x) var(--au-y),
      oklch(0.55 0.22 160 / 0.45), transparent 65%),
    radial-gradient(ellipse 60% 35% at 75% 30%,
      oklch(0.45 0.20 295 / 0.35), transparent 60%),
    radial-gradient(ellipse 50% 25% at 40% 70%,
      oklch(0.50 0.18 185 / 0.25), transparent 55%),
    oklch(0.07 0.02 265);
  animation: aurora-drift 18s ease-in-out infinite alternate;
}

@keyframes aurora-drift {
  to { --au-x: 60%; --au-y: 25%; }
}

/* 层二：aurora-band — 横向光带 */
.bg-band {
  position: absolute; inset: 0;
  background: linear-gradient(
    to right,
    transparent 0%,
    oklch(0.62 0.18 160 / 0.08) 20%,
    oklch(0.65 0.22 160 / 0.14) 40%,
    oklch(0.58 0.20 185 / 0.10) 60%,
    oklch(0.50 0.15 295 / 0.07) 80%,
    transparent 100%
  );
  transform: translateY(var(--band-y, 38%)) scaleY(0.15);
  animation: band-float 22s ease-in-out infinite alternate;
  filter: blur(40px);
}

@keyframes band-float {
  0%   { --band-y: 35%; opacity: 0.7; }
  50%  { --band-y: 28%; opacity: 1; }
  100% { --band-y: 42%; opacity: 0.8; }
}
```

**对比度要求：** 正文 `oklch(0.82 0.03 200)` vs 背景 `oklch(0.07 0.02 265)` — 对比度约 10:1，WCAG AA。光带在文字区域的透明度控制确保阅读不受干扰。

**fallback：** 纯色 `oklch(0.07 0.02 265)` + 静态顶部极光渐变。

---

## 5. 字体气质（含中文）

**标题字体：** Bricolage Grotesque（OFL）
- Google Fonts：`https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,700&display=swap`
- 气质：介于几何无衬线与有机变体字体之间，宽松而有力，和极光的流动感形成张力

**正文字体：** Geist Mono（OFL）
- Google Fonts：`https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400&display=swap`
- 气质：精密、科技、干净，和极光这种自然奇观的神秘感形成反差，共同构成"自然+技术"的审美张力

**中文字体（如适用）：** Noto Sans SC Light（OFL）+ Noto Serif SC 作为标题备选
- 冷调无衬线配合冷色调极光背景

**字号比例：** 标题极大（110px+），辅助文字退到小号（16px），形成强烈视觉张力。标题轻字重（300/400）而非粗体——大尺寸下轻字重反而更有力量感。

---

## 6. 图形语言

**线条语言：** 细线（0.5-1px），冷青色调 `oklch(0.55 0.12 185 / 0.5)`；极光感曲线，不是直角。允许微弱的发光描边。

**形状词汇：** 水平线条（模拟极光带）；圆角矩形玻璃卡片；不规则有机光团。禁止锐角装饰。

**图标风格：** 细线图标（Lucide），冷青色，16-20px。图标本身带极淡的外发光（`filter: drop-shadow(0 0 3px var(--color-accent))`）。

**装饰语法：**
- 允许：极光色线条分割、半透明玻璃卡片、发光点装饰、星点背景噪点
- 禁止：暖色系元素、实体色块背景、硬边界装饰

---

## 7. 动态氛围

**背景动效：** aurora-drift 18s + band-float 22s，双层异相位交错，形成自然感

**入场动效：** blur-to-sharp + fade-up — 元素从 `filter:blur(8px)` + `opacity:0` + `y:20px` 渐入，350ms ease-out；标题先于内容 100ms 入场

**强调动效：** 关键词/数字的极光绿 `text-shadow: 0 0 12px var(--color-accent)`，300ms ease-in-out 渐亮

**每套风格都必须有动态氛围**：极光是整个风格的生命线，动效停止则风格失去灵魂。

---

## 8. 空间节奏原则

**留白哲学：** 疏。背景本身是内容——极光占据大量视觉空间是设计意图，不是浪费。文字区域有意聚集，周围留给极光表演。

**视觉重心：** 每页最多两个主视觉重心：极光背景（环境主角）+ 文字断言（内容主角）。两者不竞争，各守其位。

**间距节奏：** 8px 基准，大间距（64/96/128px）优先于小间距，让每个内容区块呼吸充分。

---

## 9. 适用与禁用

**best_for：**
- AI/ML技术演讲（学术或工业界）
- 创新产品发布（尤其是科技/气候/宇宙相关主题）
- 创意作品展示、设计portfolio

**worst_for：**
- 传统学术答辩（过于视觉化，分散学术注意力）
- 财务/法律合规报告（氛围感与严肃性不匹配）
- 医疗/临床数据展示

---

## 10. 参考与借鉴点

**参考一：** https://dribbble.com/shots/19842765-Aurora-Gradient-Presentation-Template
借鉴：极光色带的横向流动方向感；文字在深色底上的高亮处理方式。

**参考二：** https://dribbble.com/shots/22350195-Aurora-Glassmorphism-UI-Kit
借鉴：半透明玻璃卡片与极光背景的结合；卡片描边的发光效果处理；颜色分层（底层色团 + 上层光带）的技术思路。

---

## 11. Checks

1. 极光背景在静止帧（页面加载前）是否仍然美观，不显空洞？
2. 任意一段正文文字与背景的对比度是否 ≥ WCAG AA（4.5:1）？
3. 极光绿点缀色是否只用于 1-2 个视觉角色，不满屏绿色？
4. 玻璃卡片的 backdrop-filter blur 在 GPU 不可用时是否有静态 fallback？
5. 与 Gamma/Pitch 同类暗色极光模板并排，是否不显廉价？

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | Bricolage Grotesque | Arial | Slides CJK Sans |
| Body | Geist Mono | Consolas | Slides CJK Sans |
| Auxiliary / data | Geist Mono | Consolas | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.
