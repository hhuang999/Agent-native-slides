# L01 — deep-ai-dark（深色 AI 科技）

---

## 1. Thesis 与情绪词

**设计立场：** 这是 AI 产品在台上发布自己的语言。深空黑底，电光蓝弥散光晕，不是在模仿自然，而是在建造一个不存在于现实的数字空间。设计的目标是让观众相信：他们正在目睹某种真实的、强大的技术。

**情绪词：** Powerful（力量感）· Precise（精密）· Luminous（发光体）· Inevitable（不可避免）· Futuristic（未来感）

**与最相似风格的差异：**
- vs A01 circuit-engineered：A01 是电路板语言，冷青细线，工程师美学；L01 是弥散光晕，电光蓝，更接近 AI 产品发布会美学（OpenAI/Anthropic/Google DeepMind 风格）。
- vs A02 ultraviolet-immersive：A02 是有机紫色液态；L01 是电光蓝+冷白，从神秘感换成了精确感。

---

## 2. 色彩与光感

**光感隐喻：** 深空中的一个计算节点——周围是近绝对零度的黑暗，但节点本身在发光。蓝白光从中心向外弥散，越靠近边缘越微弱，越靠近中心越锐利。

```css
:root {
  --color-bg:      oklch(0.08 0.02 270);   /* 深宇宙黑，微蓝调 */
  --color-surface: oklch(0.13 0.03 265);   /* 深色表面 */
  --color-border:  oklch(0.28 0.06 240);   /* 冷蓝边缘线 */
  --color-muted:   oklch(0.50 0.08 230);   /* 次要文字，冷蓝灰 */
  --color-body:    oklch(0.78 0.04 225);   /* 正文，冷白偏蓝 */
  --color-heading: oklch(0.95 0.02 220);   /* 标题，近白冷调 */
  --color-accent:  oklch(0.65 0.22 235);   /* 电光蓝，主点缀 */
  --color-glow:    oklch(0.55 0.20 235);   /* 发光体，比accent略暗用于glow */
}
```

---

## 3. 材质质感

**表面类型：** mesh + glow — 弥散渐变底 + 外发光效果

**CSS 实现：**
```css
.surface-panel {
  background: oklch(0.13 0.03 265 / 0.7);
  border: 1px solid oklch(0.28 0.06 240 / 0.5);
  box-shadow:
    inset 0 1px 0 oklch(0.40 0.10 230 / 0.3),
    0 0 0 1px oklch(0.20 0.05 250 / 0.2),
    0 20px 60px oklch(0.04 0.02 270 / 0.8);
}

/* 强调元素发光 */
.glow-element {
  text-shadow: 0 0 20px oklch(0.65 0.22 235 / 0.6),
               0 0 60px oklch(0.55 0.20 235 / 0.25);
  filter: drop-shadow(0 0 8px oklch(0.60 0.20 235 / 0.4));
}
```

**视觉作用：** 材质是主角——深色底的弥散光感是整个风格的核心情绪。文字区域保持高对比，发光只用于点缀和关键数字。

---

## 4. 背景氛围

**动效名称：** mesh-drift + particle-float（双层叠加）

**技术实现：**
```css
/* 层一：mesh-drift — 弥散蓝光团漂移 */
@property --mx { syntax: '<percentage>'; inherits: false; initial-value: 25%; }
@property --my { syntax: '<percentage>'; inherits: false; initial-value: 60%; }

.bg-mesh {
  position: absolute; inset: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 65% 50% at var(--mx) var(--my),
      oklch(0.45 0.20 235 / 0.35), transparent 65%),
    radial-gradient(ellipse 45% 40% at 78% 25%,
      oklch(0.38 0.16 255 / 0.20), transparent 60%),
    radial-gradient(ellipse 35% 30% at 15% 20%,
      oklch(0.35 0.12 220 / 0.15), transparent 55%),
    oklch(0.08 0.02 270);
  animation: mesh-drift 20s ease-in-out infinite alternate;
  z-index: 0;
}

@keyframes mesh-drift {
  to { --mx: 65%; --my: 35%; }
}

/* 层二：particle-float — 低密度发光粒子 */
/* 使用 Canvas 2D 实现，见 preview.html */
```

**对比度要求：** 正文 `oklch(0.78 0.04 225)` vs 背景 `oklch(0.08 0.02 270)` — 对比度约 8:1，满足 WCAG AA。弥散光晕只出现在背景，文字区域保持暗底高对比。

**fallback：** 纯色 `oklch(0.08 0.02 270)` + 静态径向渐变。

---

## 5. 字体气质（含中文）

**标题字体：** Syne（OFL）
- Google Fonts：`https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&display=swap`
- 气质：宽体几何无衬线，字间距宽松，有一种高冷的未来感；800 字重时极具冲击力

**辅助字体：** Geist Mono（OFL）
- Google Fonts：`https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500&display=swap`
- 气质：精密等宽，适合数据标注、代码、指标数字

**中文字体（如适用）：** Noto Sans SC（OFL）Light + Bold（不用Regular）
- CDN：`https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;700&display=swap`
- 配合 Syne 的宽体气质：中文用 Light 做正文，Bold 做强调

**字号比例：** 标题 120px+ Syne 800，副标题 20px Geist Mono，形成极端跳跃。中间没有缓冲层。发光标题用 text-shadow 增强光感。

---

## 6. 图形语言

**线条语言：** 极细线（0.5-1px），冷蓝调 `oklch(0.35 0.10 235 / 0.5)`；允许细线发光（`box-shadow: 0 0 4px var(--color-accent)`）；水平线优先，暗示数据网格感

**形状词汇：** 矩形面板（带冷蓝边框）；圆形粒子点；水平线段。禁止有机曲线和圆角大于4px的装饰块。

**图标风格：** Lucide 细线图标，电光蓝色，配极淡发光。16-20px，不超过 24px。

**装饰语法：**
- 允许：细线网格底纹（低透明度）、发光数字、弥散光团、粒子点、水平分割线
- 禁止：彩色装饰块、暖色任何元素、宽边框、实心圆角卡片

---

## 7. 动态氛围

**背景动效：** mesh-drift 20s alternate + particle-float Canvas 2D（低密度，50-80粒子，极慢移动）

**入场动效：** blur-to-sharp + scale-from-below — 元素从 `scale(0.96) blur(8px) opacity(0)` 渐入，300ms ease-out；关键数字额外有 text-shadow 渐强动效

**强调动效：** 关键数字/词的 `text-shadow` 发光从 `0 0 0` 增强到 `0 0 30px`，250ms ease-in-out；或边框发光 `box-shadow` 动态增强

**每套风格都必须有动态氛围**：mesh-drift 是这个风格的心跳，粒子是它的呼吸。

---

## 8. 空间节奏原则

**留白哲学：** 疏，且有方向感。大面积深空黑底是画布，内容区域聚集于中心或左侧，右侧留给光感弥散和装饰元素。不填满，留出"深空"感。

**视觉重心：** 每页最多两个：一个超大光感标题/数字（主），一个数据面板或辅助文字（辅）。背景光晕作为第三层，权重远低于前两者。

**间距节奏：** 8px 基准，大间距（96/128px）区分区域，小间距（8/16px）控制内部紧密感。对齐线要严格，数字必须右对齐。

---

## 9. 适用与禁用

**best_for：**
- AI/ML 产品发布、技术演示（学术或工业界均适合）
- 投资路演（科技方向，需要强视觉冲击）
- 技术大会主题演讲（conference keynote 氛围）

**worst_for：**
- 传统学术答辩（视觉感太强，会转移学术注意力）
- 医疗/法律/合规展示（暗色科技感与权威可信感相悖）
- 温暖/人文/创意类主题

---

## 10. 参考与借鉴点

**参考一：** https://www.behance.net/gallery/250361117/Savant-Brand-Identity-Pitch-Deck-Presentation
借鉴：深色底上弥散光晕的强度控制；大数字与精小辅助文字的极端字号对比；整体品牌感来自色彩克制（只有一个主色系）。

**参考二：** https://gamma.app/templates/company-presentation-template-ultraviolet-tnru4whdsc1fl6m
借鉴：标题在暗底上的文字发光处理；深色幻灯片中排版留白的节奏；页面中光感元素与文字区域的分区方式。

---

## 11. Checks

1. 背景弥散光晕在静止帧（无 CSS @property 支持时）是否仍有完整视觉效果？
2. 正文文字与背景的对比度是否 ≥ WCAG AA（4.5:1）？发光标题是否反而降低了可读性？
3. 电光蓝是否只用于 1-2 个视觉角色，没有到处发光？
4. 粒子密度是否足够低（< 80个），不干扰文字阅读？
5. 与 Gamma/Pitch 同类 AI 科技模板并排，是否不显廉价？

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | Syne | Arial | Slides CJK Sans |
| Body | Syne | Arial | Slides CJK Sans |
| Auxiliary / data | Geist Mono | Consolas | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.
