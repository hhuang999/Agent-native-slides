# E01 · fog-grey-nordic — 设计语言文档

family: E 北欧极简 · scheme: light · academic_fit: high

---

## 1. Thesis 与情绪词

**核心美学意图：** 以斯堪的纳维亚设计哲学传递清醒的安静——不是冷漠，而是去除一切噪声后的专注。每一页都像冬日清晨的灰色海岸：色温冷静，线条干净，留白是意图的一部分而非填充的空隙。

**情绪词：**
- Hushed / 静谧的
- Deliberate / 审慎的
- Airy / 通透的
- Honest / 诚实的
- Nordic / 北欧的

**与最相似风格的差异：**
G01（light-journal-academic）同为浅色克制，但 G01 依赖衬线字体与纸纹质感，传达的是印刷学术权威；E01 使用无衬线字体与极淡冷灰底色，传达的是北欧功能主义美学，更接近设计工作室或产品文档风格。

---

## 2. 色彩与光感

**光感隐喻：** 北方冬日的漫射光，没有方向感，没有投影，所有事物都以自身的形状存在。灰色不是妥协，是选择。

**OKLCH 色彩系统：**

```css
:root {
  --color-bg:       oklch(0.940 0.005 205);  /* 雾灰白，极淡冷调 */
  --color-surface:  oklch(0.920 0.007 210);  /* 略深一阶，卡片/区块底色 */
  --color-border:   oklch(0.820 0.008 215);  /* 冷灰分割线 */
  --color-muted:    oklch(0.580 0.008 220);  /* 次要文字 */
  --color-body:     oklch(0.280 0.010 230);  /* 正文：深冷灰 */
  --color-heading:  oklch(0.180 0.012 235);  /* 标题：近黑，带蓝调 */
  --color-accent:   oklch(0.520 0.140 220);  /* 冰青点缀，克制饱和 */

  --font-heading:   'Hanken Grotesk', 'Noto Sans', sans-serif;
  --font-body:      'Hanken Grotesk', 'Noto Sans', sans-serif;
  --font-chinese:   'LXGW WenKai', 'Noto Sans SC', sans-serif;
}
```

---

## 3. 材质质感

- **表面类型：** matte（哑光），接近磨砂纸的感觉
- **CSS 技术：** 背景为纯色哑光冷灰，不加纹理；`gradient-breathe` 动效在极端克制下仅做 0.3% 的亮度浮动——让页面有呼吸感而非可感知的动效。
- **质感作用：** 质感即颜色本身——冷灰的克制就是质感，没有额外层叠。

---

## 4. 背景氛围

**动效：** `gradient-breathe`（冷灰渐变极慢漂移）

```css
@property --drift-l {
  syntax: '<number>';
  inherits: false;
  initial-value: 0.940;
}

.bg-nordic {
  background: radial-gradient(
    ellipse 120% 80% at 30% 50%,
    oklch(var(--drift-l) 0.008 200 / 0.6),
    oklch(0.930 0.005 215)
  );
  animation: nordic-drift 12s ease-in-out infinite alternate;
}

@keyframes nordic-drift {
  from { --drift-l: 0.940; }
  to   { --drift-l: 0.950; }
}

@media (prefers-reduced-motion: reduce) {
  .bg-nordic { animation: none; background: oklch(0.940 0.005 205); }
}
```

**对比度保障：** body oklch(0.28) 对 bg oklch(0.94)，对比度 > 10:1，远超 WCAG AA。渐变幅度极小，不影响对比度。

**Fallback：** 纯色 `oklch(0.940 0.005 205)`。

---

## 5. 字体气质（含中文）

**标题字体：** Hanken Grotesk（OFL，Google Fonts）
- 气质：几何无衬线，字形克制，字重从 100 到 900 梯度均匀，北欧系统字体的现代替代。大号用 Light 或 Regular 配合极大字号——字体纤细但字号巨大，传递安静的自信。

**正文字体：** Hanken Grotesk（OFL）
- 在 16–18px 正文下表现良好；字距不需要额外调整，字形自然开敞。

**中文字体：** LXGW WenKai（OFL，GitHub: lxgw/LxgwWenKai）
- 楷体风格带来与无衬线拉丁字体相似的「手写结构感」，在冷灰背景上有温度而不失克制。

**字号对比哲学：** 标题极大（浅字重）+ 辅助说明极小（Light 字重），不设中间层。两级之间的空白比字号本身更有力量。

---

## 6. 图形语言

**线条语言：** 1px 极细线，实线，颜色 `--color-border`；偶用 0.5px 线作次级分割（仅在密度较高的表格类页面）。
**形状词汇：** 矩形为主，圆角 4px；允许无圆角（0px）用于硬边界分割；不使用圆形作装饰元素。
**图标风格：** Lucide 细线（stroke 1.25px），色彩用 `--color-muted`；图标只作功能指示，不作装饰。
**装饰语法：**
- 允许：左侧细竖线标注引用区块（`--color-accent` 2px 实线）；页码用 `--color-muted` 极小字号
- 禁止：任何渐变图形、色块背景、装饰性圆点、图标堆叠

---

## 7. 动态氛围

**背景动效：** gradient-breathe · 12s · ease-in-out · infinite alternate（仅亮度 0.3% 浮动，几乎不可察觉）
**入场动效：** fade-up（y +8px → 0，opacity 0→1，280ms ease-out；标题先，正文延迟 100ms）
**强调动效：** 无额外强调——颜色从 `--color-muted` 变为 `--color-heading` 即是强调，不用动效叠加

北欧极简原则：动效存在的意义是证明「页面是活的」，而非驱动用户注意力。一切动效都应在移除后不被用户发现缺失。

---

## 8. 空间节奏原则

**留白哲学：** 极疏。标题上方留白是字号的 2.5 倍；单页内容占可用面积不超过 50%，剩余空间是设计的一部分而非浪费。非对称布局优先——标题与证据不需要等分页面。

**视觉重心：** 每页一个主视觉重心（断言标题），辅以一个轻量支撑元素（数据点、引言、单图）。避免两个等重元素竞争。

**间距节奏：** 8px 基准单位；标题与正文之间 32px；区块分割线上下各 24px；页边距不低于 80px（在 1920px 舞台上约为 4% 单侧）。

---

## 9. 适用与禁用

**best_for：**
- 设计/建筑/工业产品展示
- 技术文档类演讲（语言清晰优先）
- 学术场合需要「现代感」的报告（替代 G01 的传统学术感）

**worst_for：**
- 需要强烈视觉冲击力的品牌 pitch
- 数据密集型分析报告（密度不足以支撑大量图表）
- 电影/创意娱乐类展示

---

## 10. 参考与借鉴点

**参考 1：** https://dribbble.com/shots/19432705-Nordic-Minimal-Presentation-Concept
借鉴：单一无衬线字体在不同字重间的克制使用方式——Light 标题 + Regular 正文，之间不加任何中间层字重过渡。

**参考 2：** https://www.canva.com/templates/EAGMdq9FRR8-gray-minimal-presentation/
借鉴：冷灰背景上的分割线使用密度——分割线是稀疏的，每页至多一条，不形成网格感。

---

## 11. Checks

1. 所有背景颜色是否都带有轻微冷色调（偏 200–220 色相），没有引入暖色？
2. 标题字重是否为 Light 或 Regular（不是 Bold），字号是否足够大以弥补字重轻带来的存在感缺失？
3. 页面是否保持了 50% 以上的留白比例，没有被内容填满？
4. accent 色是否仅出现在 1–2 处（细竖线、单个数字），没有被泛化使用？
5. 与 Canva 同类极简模板截图并排时，冷色调是否一致，字距是否更精准？
