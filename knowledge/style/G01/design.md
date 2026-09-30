# G01 — light-journal-academic（浅色期刊学术）

---

## 1. Thesis 与情绪词

**设计立场：** 学术严肃感来自极度克制，而非装饰。排版即设计：字体比例、留白节奏、细线结构构成视觉语言的全部。没有多余的颜色，没有装饰图案，只有内容的力量。

**情绪词：** Scholarly（学术庄重）· Precise（精确）· Trustworthy（可信）· Quiet（静谧）· Rigorous（严谨）

**与最相似风格的差异：**
- vs G04 clean-academic-sans：G01 用衬线字体为主，模拟纸质印刷质感；G04 是无衬线字体，面向工程/CS报告，更现代理工感。
- vs D01 swiss-international：D01 完全没有色彩点缀；G01 引入学术蓝作为超链接/强调色，保留学术文本的视觉语言。

---

## 2. 色彩与光感

**光感隐喻：** 优质学术期刊用纸——微黄纸白，墨色铅字，偶尔出现学术蓝的超链接。不是白色屏幕，是被翻阅过的纸张。

```css
:root {
  --color-bg:      oklch(0.97 0.01 88);   /* 纸白，微暖 */
  --color-surface: oklch(0.99 0.005 90);  /* 极浅卡片底，接近白 */
  --color-border:  oklch(0.82 0.01 80);   /* 淡铅色细线 */
  --color-muted:   oklch(0.55 0.02 80);   /* 次要注释文字 */
  --color-body:    oklch(0.22 0.01 255);  /* 近黑墨色正文 */
  --color-heading: oklch(0.10 0.01 255);  /* 深墨标题 */
  --color-accent:  oklch(0.48 0.16 255);  /* 学术蓝，用于链接/强调 */
}
```

---

## 3. 材质质感

**表面类型：** paper — 纸质印刷感

**CSS 实现：** SVG feTurbulence 极淡纸纹叠加（mix-blend-mode: multiply）

```css
.bg-paper::after {
  content: '';
  position: absolute; inset: 0; pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  mix-blend-mode: multiply;
  opacity: 0.6;
}
```

**视觉作用：** 底层质感，不争夺注意力，只在仔细观察时可见。

---

## 4. 背景氛围

**动效名称：** grain-breathe（纸纹脉冲）

**技术实现：**
```css
@keyframes grain-breathe {
  0%, 100% { opacity: 0.4; }
  50%       { opacity: 0.7; }
}

.bg-grain-layer {
  animation: grain-breathe 6s ease-in-out infinite;
}
```

**对比度要求：** 正文 `oklch(0.22 0.01 255)` vs 背景 `oklch(0.97 0.01 88)` — 对比度约 12:1，远超 WCAG AA。氛围层 opacity < 0.08，不干扰阅读。

**fallback：** 纯色 `oklch(0.97 0.01 88)`，无动效时视觉完整。

---

## 5. 字体气质（含中文）

**标题字体：** EB Garamond（OFL）
- Google Fonts：`https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap`
- 气质：16世纪威尼斯衬线，学术出版经典选择，大号时优雅稳重，有历史感但不守旧

**正文字体：** Source Code Pro（OFL）用于代码段；正文本身使用 EB Garamond 中等字重
- 代码字体 CDN：`https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;500&display=swap`

**中文字体（如适用）：** Noto Serif CJK SC（OFL）
- 与 EB Garamond 共享衬线语言，字重相近，笔画粗细协调
- CDN：`https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;500;700&display=swap`

**字号比例：** 标题使用大尺寸（100px+），辅助注释退到极小（16-18px），中间不设缓冲层。跳跃式对比，不是渐变。

**生成页的可读性边界：** 100px+ 只适合短标题；断言超过两行时先精简或拆页。16–18px 仅用于页码、来源等非核心注释，解释性正文须使用至少 28px，并为图表保留独立区域；较长论述放进演讲备注。此规则优先于预览页的字体示例。

---

## 6. 图形语言

**线条语言：** 细实线（1px），仅用于分割线和表格；无圆角装饰边框；严格直角

**形状词汇：** 矩形（只有矩形）。无圆形、无有机曲线、无多边形装饰

**图标风格：** 细线图标（Lucide），尺寸小，仅用于功能性信息（如箭头、外链标志）；不做装饰用途

**装饰语法：**
- 允许：横向细分割线、页码点、上标数字角标、脚注细线
- 禁止：图案背景、渐变装饰块、彩色卡片背景、任何装饰性几何图形

---

## 7. 动态氛围

**背景动效：** grain-breathe — 6s ease-in-out，opacity 0.4→0.7→0.4 极慢脉冲，模拟印刷纸在光线下的微妙变化

**入场动效：** fade-up — 元素从 y+12px 渐入，200ms ease-out，stagger 间隔 60ms

**强调动效：** rough-notation 下划线（粗铅色），200ms 手绘扫过感；或文字颜色变为 `--color-accent` 的 150ms 过渡

**克制原则：** 动效服务于内容节奏，不是视觉娱乐。grain-breathe 在背后无声运行，不抢镜。

---

## 8. 空间节奏原则

**留白哲学：** 疏。留白是主动设计手段——观众看到大面积留白，知道这页只有一件事。不填满空间。

**视觉重心：** 每页最多两个主视觉重心：标题断言（主）+ 单一视觉证据（辅）。第三个元素的权重必须远低于前两者。

**间距节奏：** 8px 基准，关键间距从 8 的倍数中选（8/16/24/32/48/64/96）。内部间距比外部间距小一档。

---

## 9. 适用与禁用

**best_for：**
- 学术论文/研究报告答辩（理工文医均适用）
- 学术会议演讲（严肃场合，受众以研究者为主）
- 年报/白皮书（需要可信度背书的机构内容）

**worst_for：**
- 创意/品牌/消费者营销
- 需要强视觉冲击的产品发布
- 面向大众的科普娱乐内容

---

## 10. 参考与借鉴点

**参考一：** https://www.canva.com/templates/EAGwX2VN8ps-emerald-and-beige-minimalist-simple-thesis-defense-presentation/
借鉴：米色底+细线分割的排版节奏；衬线标题配无衬线辅助文字的字体搭配层次。

**参考二：** https://pitch.com/templates/Market-Research-5C8Stu46spdE4tLwwm5rWRZg
借鉴：数据展示页面的极简布局——大数字独占空间，来源注释退到角落；色彩严格克制于一个主题色。

---

## 11. Checks

1. 背景纸纹在静止帧（无动效）下视觉是否仍然完整、不显单调？
2. 学术蓝点缀色是否只用于 1 个语义角色（链接/强调），不超过 3 处？
3. 正文 EB Garamond 在 28px 以下是否通过 WCAG AA（对比度 ≥ 4.5:1）？
4. 页面中是否没有任何装饰性几何图形、渐变色块或图标装饰？
5. 与 Canva/Pitch 付费学术模板并排，是否不显廉价？
