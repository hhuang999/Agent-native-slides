<div align="center">

# Agent-Native Slides

**一个让 AI 编程助手学会"设计"演示文稿的 Agent Skill，不是模板包。**

输入 `.docx` / `.md` / `.txt`，产出 1920×1080 的动态 HTML 幻灯片：**53 种可实时预览的风格**、演讲者备注、演讲者视图，
并可导出单文件 HTML / PDF / PPTX。

[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
![Styles](https://img.shields.io/badge/风格-53-7c3aed)
![Families](https://img.shields.io/badge/风格家族-15-0ea5e9)
![Build](https://img.shields.io/badge/构建步骤-无-lightgrey)
![Agents](https://img.shields.io/badge/适用-Claude_Code_·_Codex_·_Cursor_·_任意_Agent-orange)

[English](README.md) · **中文**

<img src="docs/readme/hero.gif" width="100%" alt="Agent-Native Slides：53 种风格中 14 种的封面">

<sub>每一帧都是本仓库中真实 <code>preview.html</code> 的截图，没有任何效果图。</sub>

</div>

---

## 为什么叫 "Agent-Native"？

大多数幻灯片 Skill 给 Agent 一堆模板；这个 Skill 给它的是一套**能推理的设计体系**，外加一份足够严格的运行时合同：Agent 写出的任何 deck 都能被脚本校验、演示和导出。

| | |
|---|---|
| 🧠 **设计知识，而不是模板** | 四层知识按需加载：**元素**（字号层级、信息密度、留白）→ **组件**（图表、公式、代码、ML 示意图）→ **风格**（53 套设计语言）→ **动效**（14 种背景氛围 + 入场 / 强调 / 数据动效）。 |
| 📐 **论点–证据式规划** | 动手画之前，先把文档变成 **Deck Plan JSON**：每页一个完整句子的论点标题、证据类型（`chart · diagram · image · formula · code`）和演讲者备注。 |
| 👀 **看了再选** | Agent 按"情绪 × 场合"检索风格索引，打开 **2–3 个真实的动态预览**给你挑。你只需要对看到的东西做反应，不用描述"感觉"。 |
| 🎨 **53 种风格 · 15 个家族** | 从电路板暗色科技到期刊级学术风，瑞士网格、玻璃拟态、孔版印刷、装饰艺术……每种风格都有 `design.md`（OKLCH 色彩 token、字体搭配、版式规则）**和**一个可运行的 3 页 `preview.html`。 |
| 📊 **科研级组件** | ECharts 图表、KaTeX 公式、代码高亮、手绘 SVG 的 ML 示意图（模型架构、注意力、检索流程），全部由 CSS token 统一着色。 |
| 🖼️ **AI 配图（可选）** | 用你自己的 [AIHubMix](https://aihubmix.com) key 生成封面和章节配图（实测 7 个生图模型），再内联成单个可移动的文件。数据图表永远不走生图模型。 |
| ✅ **统一的运行时合同** | 每个 deck 都提供 `__goToSlide(n)`、`?preview=N`、`?print=1`、自适应窗口缩放和统一的打印样式（`knowledge/RUNTIME.md`）。`check-deck.js` 负责校验，导出和演讲工具因此开箱即用。仓库自带的 57 个 deck 全部通过。 |
| 📤 **真正可用的导出** | 单文件 HTML（图片、字体内联）、16:9 PDF（每页一张幻灯片）、带演讲者备注的 PPTX。 |
| 🔓 **只用免费开源资源** | 所有依赖开源并锁定版本；内置中文和等宽字体（OFL）。付费平台仅作视觉参考。 |

## 安装

**一条命令**（适用于 [`skills`](https://www.npmjs.com/package/skills) CLI 支持的所有 Agent）：

```bash
npx skills add https://github.com/hhuang999/agent-native-slides
```

**或者克隆到 Agent 的 skills 目录：**

```bash
# Claude Code
git clone https://github.com/hhuang999/agent-native-slides ~/.claude/skills/agent-native-slides
# Codex
git clone https://github.com/hhuang999/agent-native-slides ~/.codex/skills/agent-native-slides
```

**其他 Agent**（Cursor、Gemini CLI、OpenCode……）：把本仓库或 `SKILL.md` 发给 Agent 即可。`SKILL.md` 是入口，其余文件按需加载。

校验和导出脚本需要 Node.js 18+：

```bash
cd <skill 目录>/scripts && npm install
npx playwright install chromium   # 可选；没装时会自动使用本机的 Chrome / Edge
```

## 怎么用

直接说：

> "把 `thesis.docx` 做成 15 分钟的答辩 PPT。"
> "按这个大纲做 10 页融资路演，要暗色、高级感。"
> "把这份周报做成 8 页的汇报 PPT，学术风。"

Agent 会这样做：

```mermaid
flowchart LR
  A[".docx / .md / .txt"] --> B["Deck Plan JSON<br/>论点 · 证据 · 备注"]
  B --> C["2–3 个动态风格预览"]
  C -->|你来挑| D["生成 HTML deck<br/>design.md + 组件 + 动效"]
  D --> E["check-deck.js 校验"]
  E --> F["演示<br/>演讲者视图"]
  E --> G["导出<br/>HTML · PDF · PPTX"]
  B -. 可选 .-> H["AI 封面配图<br/>AIHubMix"] -.-> D
```

1. **读入**：`.docx` 用 mammoth 转成 Markdown，提取标题、场合和篇幅。
2. **规划**：生成 Deck Plan JSON（`prompts/deck-plan-schema.md`），每页一个论点标题、证据类型和演讲者备注。
3. **选风格**：按情绪 × 场合检索 `knowledge/style/index.json`，展示 2–3 个动态预览，这一步从不跳过。
4. **配图（可选）**：`imagegen.js` 生成装饰性配图；图表始终用 ECharts。
5. **生成**：按所选风格的 `design.md`，用知识层里的组件和动效写出单文件 HTML deck。
6. **审阅**：Studio 查看器显示缩略图和备注。
7. **演示**：键盘翻页、`data-step` 逐项揭示、演讲者视图。
8. **导出**：先通过 `check-deck`，再内联 / 导出 PDF / 导出 PPTX。

## 风格一览

<img src="docs/readme/styles-overview.jpg" width="100%" alt="53 种风格总览">

下面每种风格展示预览中的三页：**封面**、**证据页**、**数据 / 细节页**。它们都能直接用浏览器打开：`knowledge/style/<id>/preview.html`（`←` `→` 翻页，`?preview=N` 只显示第 N 页，`?print=1` 查看打印版式）。

<!-- GALLERY:START -->
### A · Dark Tech (8)

**A01 · circuit-engineered** — dark — technical · engineering · precise — for conference-talk / thesis-defense — type Geist Mono + Instrument Sans — motion `circuit-trace` — [design.md](knowledge/style/A01/design.md) · [preview.html](knowledge/style/A01/preview.html)

<img src="docs/readme/styles/A01.jpg" width="100%" alt="A01 circuit-engineered">

**A02 · ultraviolet-immersive** — dark — immersive · creative · energetic — for keynote / product-launch — type Syne + Satoshi — motion `mesh-drift` — [design.md](knowledge/style/A02/design.md) · [preview.html](knowledge/style/A02/preview.html)

<img src="docs/readme/styles/A02.jpg" width="100%" alt="A02 ultraviolet-immersive">

**A03 · deep-sapphire** — dark — professional · authoritative · serious — for investor-pitch / conference-talk — type Instrument Serif + DM Sans — motion `aurora-band` — [design.md](knowledge/style/A03/design.md) · [preview.html](knowledge/style/A03/preview.html)

<img src="docs/readme/styles/A03.jpg" width="100%" alt="A03 deep-sapphire">

**A04 · cosmic-void** — dark — futuristic · expansive · science — for keynote / conference-talk — type Outfit + JetBrains Mono — motion `starfield-parallax` — [design.md](knowledge/style/A04/design.md) · [preview.html](knowledge/style/A04/preview.html)

<img src="docs/readme/styles/A04.jpg" width="100%" alt="A04 cosmic-void">

**A05 · neon-cyberpunk** — dark — edgy · gaming · hacker — for keynote / product-launch — type Rajdhani + Source Code Pro — motion `hologram-scan` — [design.md](knowledge/style/A05/design.md) · [preview.html](knowledge/style/A05/preview.html)

<img src="docs/readme/styles/A05.jpg" width="100%" alt="A05 neon-cyberpunk">

**A06 · deep-ocean** — dark — serene · organic · science — for conference-talk / keynote — type Fraunces + DM Mono — motion `wave-sine` — [design.md](knowledge/style/A06/design.md) · [preview.html](knowledge/style/A06/preview.html)

<img src="docs/readme/styles/A06.jpg" width="100%" alt="A06 deep-ocean">

**A07 · holographic-iridescent** — dark — futuristic · creative · fashion — for keynote / product-launch — type Lexend Mega + JetBrains Mono — motion `hologram-scan` — [design.md](knowledge/style/A07/design.md) · [preview.html](knowledge/style/A07/preview.html)

<img src="docs/readme/styles/A07.jpg" width="100%" alt="A07 holographic-iridescent">

**A08 · dark-vaporwave** — dark — retro · nostalgic · pop-culture — for keynote / product-launch — type Silkscreen + Josefin Sans — motion `shader-grain` — [design.md](knowledge/style/A08/design.md) · [preview.html](knowledge/style/A08/preview.html)

<img src="docs/readme/styles/A08.jpg" width="100%" alt="A08 dark-vaporwave">

### B · Glassmorphism (4)

**B01 · dark-glassmorphism** — dark — modern · sleek · tech — for product-launch / investor-pitch — type Plus Jakarta Sans + JetBrains Mono — motion `particle-float` — [design.md](knowledge/style/B01/design.md) · [preview.html](knowledge/style/B01/preview.html)

<img src="docs/readme/styles/B01.jpg" width="100%" alt="B01 dark-glassmorphism">

**B02 · light-glassmorphism** — light — airy · modern · clean — for product-launch / team-update — type Manrope + Geist Mono — motion `particle-float` — [design.md](knowledge/style/B02/design.md) · [preview.html](knowledge/style/B02/preview.html)

<img src="docs/readme/styles/B02.jpg" width="100%" alt="B02 light-glassmorphism">

**B03 · aurora-glass** — dark — immersive · colorful · creative — for keynote / product-launch — type Bricolage Grotesque + Geist Mono — motion `aurora-band` — [design.md](knowledge/style/B03/design.md) · [preview.html](knowledge/style/B03/preview.html)

<img src="docs/readme/styles/B03.jpg" width="100%" alt="B03 aurora-glass">

**B04 · warm-glass** — light — warm · elegant · premium — for investor-pitch / keynote — type Instrument Serif + DM Sans — motion `gradient-breathe` — [design.md](knowledge/style/B04/design.md) · [preview.html](knowledge/style/B04/preview.html)

<img src="docs/readme/styles/B04.jpg" width="100%" alt="B04 warm-glass">

### C · Cinematic (4)

**C01 · film-noir** — dark — cinematic · dramatic · editorial — for keynote / product-launch — type IM Fell English + Courier Prime — motion `film-grain` — [design.md](knowledge/style/C01/design.md) · [preview.html](knowledge/style/C01/preview.html)

<img src="docs/readme/styles/C01.jpg" width="100%" alt="C01 film-noir">

**C02 · dark-editorial-cinema** — dark — editorial · cinematic · creative — for keynote / product-launch — type Cormorant Garamond + Karla — motion `film-grain` — [design.md](knowledge/style/C02/design.md) · [preview.html](knowledge/style/C02/preview.html)

<img src="docs/readme/styles/C02.jpg" width="100%" alt="C02 dark-editorial-cinema">

**C03 · light-editorial-magazine** — light — editorial · refined · literary — for seminar / conference-talk — type Libre Baskerville + Mulish — motion `light-sweep` — [design.md](knowledge/style/C03/design.md) · [preview.html](knowledge/style/C03/preview.html)

<img src="docs/readme/styles/C03.jpg" width="100%" alt="C03 light-editorial-magazine">

**C04 · cinematic-amber** — dark — warm · nostalgic · cinematic — for keynote / seminar — type Fraunces + DM Sans — motion `film-grain` — [design.md](knowledge/style/C04/design.md) · [preview.html](knowledge/style/C04/preview.html)

<img src="docs/readme/styles/C04.jpg" width="100%" alt="C04 cinematic-amber">

### D · Swiss / International (4)

**D01 · swiss-international** — light — minimal · rational · precise — for conference-talk / thesis-defense — type DM Sans + DM Mono — motion `grain-breathe` — [design.md](knowledge/style/D01/design.md) · [preview.html](knowledge/style/D01/preview.html)

<img src="docs/readme/styles/D01.jpg" width="100%" alt="D01 swiss-international">

**D02 · bauhaus-geometric** — light — geometric · artistic · bold — for seminar / keynote — type Josefin Sans + EB Garamond — motion `dot-pulse` — [design.md](knowledge/style/D02/design.md) · [preview.html](knowledge/style/D02/preview.html)

<img src="docs/readme/styles/D02.jpg" width="100%" alt="D02 bauhaus-geometric">

**D03 · brutalist-editorial** — light — bold · editorial · raw — for keynote / conference-talk — type League Gothic + Source Code Pro — motion `grain-breathe` — [design.md](knowledge/style/D03/design.md) · [preview.html](knowledge/style/D03/preview.html)

<img src="docs/readme/styles/D03.jpg" width="100%" alt="D03 brutalist-editorial">

**D04 · dark-swiss** — dark — minimal · serious · technical — for conference-talk / thesis-defense — type Hanken Grotesk + JetBrains Mono — motion `grain-breathe` — [design.md](knowledge/style/D04/design.md) · [preview.html](knowledge/style/D04/preview.html)

<img src="docs/readme/styles/D04.jpg" width="100%" alt="D04 dark-swiss">

### E · Nordic Minimal (3)

**E01 · fog-grey-nordic** — light — minimal · calm · scholarly — for thesis-defense / seminar — type Hanken Grotesk + LXGW WenKai — motion `gradient-breathe` — [design.md](knowledge/style/E01/design.md) · [preview.html](knowledge/style/E01/preview.html)

<img src="docs/readme/styles/E01.jpg" width="66%" alt="E01 fog-grey-nordic">

**E02 · pale-birch-nordic** — light — warm · natural · calm — for seminar / thesis-defense — type Instrument Serif + DM Sans — motion `light-sweep` — [design.md](knowledge/style/E02/design.md) · [preview.html](knowledge/style/E02/preview.html)

<img src="docs/readme/styles/E02.jpg" width="100%" alt="E02 pale-birch-nordic">

**E03 · glacier-blue-nordic** — light — cool · minimal · science — for thesis-defense / conference-talk — type Bricolage Grotesque + Geist Mono — motion `gradient-breathe` — [design.md](knowledge/style/E03/design.md) · [preview.html](knowledge/style/E03/preview.html)

<img src="docs/readme/styles/E03.jpg" width="100%" alt="E03 glacier-blue-nordic">

### F · Atmospheric Gradient (3)

**F01 · aurora-borealis-dark** — dark — dramatic · colorful · creative — for keynote / conference-talk — type Bricolage Grotesque + Geist Mono — motion `aurora-band` — [design.md](knowledge/style/F01/design.md) · [preview.html](knowledge/style/F01/preview.html)

<img src="docs/readme/styles/F01.jpg" width="66%" alt="F01 aurora-borealis-dark">

**F02 · aurora-dawn-light** — light — optimistic · creative · fresh — for product-launch / keynote — type Syne + Satoshi — motion `mesh-drift` — [design.md](knowledge/style/F02/design.md) · [preview.html](knowledge/style/F02/preview.html)

<img src="docs/readme/styles/F02.jpg" width="100%" alt="F02 aurora-dawn-light">

**F03 · mesh-gradient-vivid** — light — vibrant · brand · creative — for product-launch / keynote — type Outfit + DM Mono — motion `mesh-drift` — [design.md](knowledge/style/F03/design.md) · [preview.html](knowledge/style/F03/preview.html)

<img src="docs/readme/styles/F03.jpg" width="100%" alt="F03 mesh-gradient-vivid">

### G · Academic / Journal (4)

**G01 · light-journal-academic** — light — academic · scholarly · rigorous — for conference-talk / thesis-defense — type EB Garamond + Source Code Pro — motion `grain-breathe` — [design.md](knowledge/style/G01/design.md) · [preview.html](knowledge/style/G01/preview.html)

<img src="docs/readme/styles/G01.jpg" width="66%" alt="G01 light-journal-academic">

**G02 · dark-journal-academic** — dark — academic · focused · nocturnal — for conference-talk / thesis-defense — type Playfair Display + Source Code Pro — motion `grain-breathe` — [design.md](knowledge/style/G02/design.md) · [preview.html](knowledge/style/G02/preview.html)

<img src="docs/readme/styles/G02.jpg" width="100%" alt="G02 dark-journal-academic">

**G03 · neutral-academic-beige** — light — academic · bilingual · neutral — for thesis-defense / seminar — type Lato + Noto Serif CJK — motion `light-sweep` — [design.md](knowledge/style/G03/design.md) · [preview.html](knowledge/style/G03/preview.html)

<img src="docs/readme/styles/G03.jpg" width="100%" alt="G03 neutral-academic-beige">

**G04 · clean-academic-sans** — light — academic · engineering · technical — for thesis-defense / conference-talk — type Noto Sans + Noto Sans CJK — motion `gradient-breathe` — [design.md](knowledge/style/G04/design.md) · [preview.html](knowledge/style/G04/preview.html)

<img src="docs/readme/styles/G04.jpg" width="100%" alt="G04 clean-academic-sans">

### H · Corporate / Business (3)

**H01 · primer-clean** — light — corporate · professional · clear — for team-update / investor-pitch — type Plus Jakarta Sans + IBM Plex Mono — motion `gradient-breathe` — [design.md](knowledge/style/H01/design.md) · [preview.html](knowledge/style/H01/preview.html)

<img src="docs/readme/styles/H01.jpg" width="100%" alt="H01 primer-clean">

**H02 · trust-blue** — light — authoritative · financial · corporate — for investor-pitch / team-update — type Source Sans 3 + Source Serif 4 — motion `light-sweep` — [design.md](knowledge/style/H02/design.md) · [preview.html](knowledge/style/H02/preview.html)

<img src="docs/readme/styles/H02.jpg" width="100%" alt="H02 trust-blue">

**H03 · executive-dark-bold** — dark — premium · executive · bold — for investor-pitch / keynote — type Playfair Display + DM Sans — motion `grain-breathe` — [design.md](knowledge/style/H03/design.md) · [preview.html](knowledge/style/H03/preview.html)

<img src="docs/readme/styles/H03.jpg" width="100%" alt="H03 executive-dark-bold">

### I · Texture / Organic (4)

**I01 · cream-paper-warm** — light — warm · scholarly · tactile — for seminar / thesis-defense — type EB Garamond + Source Code Pro — motion `grain-breathe` — [design.md](knowledge/style/I01/design.md) · [preview.html](knowledge/style/I01/preview.html)

<img src="docs/readme/styles/I01.jpg" width="100%" alt="I01 cream-paper-warm">

**I02 · wabi-sabi-japanese** — light — zen · minimalist · japanese — for seminar / keynote — type Noto Serif JP + Noto Sans JP — motion `grain-breathe` — [design.md](knowledge/style/I02/design.md) · [preview.html](knowledge/style/I02/preview.html)

<img src="docs/readme/styles/I02.jpg" width="100%" alt="I02 wabi-sabi-japanese">

**I03 · warm-film-grain** — dark — nostalgic · cinematic · warm — for keynote / seminar — type Playfair Display + Karla — motion `film-grain` — [design.md](knowledge/style/I03/design.md) · [preview.html](knowledge/style/I03/preview.html)

<img src="docs/readme/styles/I03.jpg" width="100%" alt="I03 warm-film-grain">

**I04 · soft-bento** — light — modern · playful · structured — for product-launch / team-update — type Instrument Sans + DM Mono — motion `gradient-breathe` — [design.md](knowledge/style/I04/design.md) · [preview.html](knowledge/style/I04/preview.html)

<img src="docs/readme/styles/I04.jpg" width="100%" alt="I04 soft-bento">

### J · Technical / Engineering (3)

**J01 · terminal-monochrome** — dark — hacker · engineering · retro — for conference-talk / workshop — type Geist Mono + Hanken Grotesk — motion `circuit-trace` — [design.md](knowledge/style/J01/design.md) · [preview.html](knowledge/style/J01/preview.html)

<img src="docs/readme/styles/J01.jpg" width="100%" alt="J01 terminal-monochrome">

**J02 · data-dashboard** — dark — data · analytical · technical — for conference-talk / group-meeting — type DM Mono + DM Sans — motion `particle-float` — [design.md](knowledge/style/J02/design.md) · [preview.html](knowledge/style/J02/preview.html)

<img src="docs/readme/styles/J02.jpg" width="100%" alt="J02 data-dashboard">

**J03 · light-engineering** — light — precise · technical · engineering — for conference-talk / thesis-defense — type IBM Plex Mono + IBM Plex Sans — motion `light-sweep` — [design.md](knowledge/style/J03/design.md) · [preview.html](knowledge/style/J03/preview.html)

<img src="docs/readme/styles/J03.jpg" width="100%" alt="J03 light-engineering">

### K · Premium / Luxury (3)

**K01 · monochrome-luxury** — light — luxury · fashion · minimal — for keynote / investor-pitch — type Cormorant Garamond + Mulish — motion `light-sweep` — [design.md](knowledge/style/K01/design.md) · [preview.html](knowledge/style/K01/preview.html)

<img src="docs/readme/styles/K01.jpg" width="100%" alt="K01 monochrome-luxury">

**K02 · gold-dark-premium** — dark — luxury · premium · exclusive — for keynote / investor-pitch — type Playfair Display + Instrument Sans — motion `gradient-breathe` — [design.md](knowledge/style/K02/design.md) · [preview.html](knowledge/style/K02/preview.html)

<img src="docs/readme/styles/K02.jpg" width="100%" alt="K02 gold-dark-premium">

**K03 · dusty-rose-editorial** — light — fashion · editorial · feminine — for keynote / product-launch — type Fraunces + DM Sans — motion `gradient-breathe` — [design.md](knowledge/style/K03/design.md) · [preview.html](knowledge/style/K03/preview.html)

<img src="docs/readme/styles/K03.jpg" width="100%" alt="K03 dusty-rose-editorial">

### L · AI / Tech Immersive (3)

**L01 · deep-ai-dark** — dark — ai · futuristic · technical — for conference-talk / keynote — type Syne + Geist Mono — motion `mesh-drift` — [design.md](knowledge/style/L01/design.md) · [preview.html](knowledge/style/L01/preview.html)

<img src="docs/readme/styles/L01.jpg" width="66%" alt="L01 deep-ai-dark">

**L02 · purple-ai-immersive** — dark — ai · creative · mysterious — for keynote / product-launch — type Outfit + JetBrains Mono — motion `mesh-drift` — [design.md](knowledge/style/L02/design.md) · [preview.html](knowledge/style/L02/preview.html)

<img src="docs/readme/styles/L02.jpg" width="100%" alt="L02 purple-ai-immersive">

**L03 · teal-ai-light** — light — ai · fresh · modern — for product-launch / conference-talk — type Bricolage Grotesque + Geist Mono — motion `gradient-breathe` — [design.md](knowledge/style/L03/design.md) · [preview.html](knowledge/style/L03/preview.html)

<img src="docs/readme/styles/L03.jpg" width="100%" alt="L03 teal-ai-light">

### M · Illustration / Artistic (3)

**M01 · watercolor-wash** — light — artistic · organic · creative — for seminar / keynote — type Fraunces + Mulish — motion `gradient-breathe` — [design.md](knowledge/style/M01/design.md) · [preview.html](knowledge/style/M01/preview.html)

<img src="docs/readme/styles/M01.jpg" width="100%" alt="M01 watercolor-wash">

**M02 · ink-illustration** — light — traditional · scholarly · east-asian — for seminar / thesis-defense — type Noto Serif CJK + Noto Sans — motion `grain-breathe` — [design.md](knowledge/style/M02/design.md) · [preview.html](knowledge/style/M02/preview.html)

<img src="docs/readme/styles/M02.jpg" width="100%" alt="M02 ink-illustration">

**M03 · risograph-print** — light — retro · print · indie — for keynote / workshop — type Josefin Sans + EB Garamond — motion `dot-pulse` — [design.md](knowledge/style/M03/design.md) · [preview.html](knowledge/style/M03/preview.html)

<img src="docs/readme/styles/M03.jpg" width="100%" alt="M03 risograph-print">

### N · Retro / Historical (2)

**N01 · art-deco-gold** — dark — art-deco · luxurious · geometric — for keynote / investor-pitch — type Playfair Display + DM Sans — motion `gradient-breathe` — [design.md](knowledge/style/N01/design.md) · [preview.html](knowledge/style/N01/preview.html)

<img src="docs/readme/styles/N01.jpg" width="100%" alt="N01 art-deco-gold">

**N02 · retro-modern-50s** — light — retro · playful · optimistic — for keynote / product-launch — type League Gothic + Source Code Pro — motion `light-sweep` — [design.md](knowledge/style/N02/design.md) · [preview.html](knowledge/style/N02/preview.html)

<img src="docs/readme/styles/N02.jpg" width="100%" alt="N02 retro-modern-50s">

### O · Nature / Earth (2)

**O01 · organic-moss** — dark — organic · nature · environmental — for keynote / seminar — type Fraunces + DM Sans — motion `liquid-blob` — [design.md](knowledge/style/O01/design.md) · [preview.html](knowledge/style/O01/preview.html)

<img src="docs/readme/styles/O01.jpg" width="100%" alt="O01 organic-moss">

**O02 · sand-dune** — light — warm · expansive · natural — for keynote / seminar — type EB Garamond + Instrument Sans — motion `gradient-breathe` — [design.md](knowledge/style/O02/design.md) · [preview.html](knowledge/style/O02/preview.html)

<img src="docs/readme/styles/O02.jpg" width="100%" alt="O02 sand-dune">
<!-- GALLERY:END -->

## 动效

<img src="docs/readme/motion.gif" width="100%" alt="实时背景动效：极光、星空、电路走线、粒子">

14 种背景氛围（`circuit-trace`、`aurora-band`、`starfield-parallax`、`mesh-drift`、`hologram-scan`、`wave-sine`、`shader-grain`、`particle-float`、`gradient-breathe`、`film-grain`、`light-sweep`、`grain-breathe`、`dot-pulse`、`liquid-blob`），以及 `knowledge/motion/motion.md` 里的入场、强调和数据动效片段。全部遵循 `prefers-reduced-motion`，打印时自动关闭。

## 组件

<img src="docs/readme/components.jpg" width="100%" alt="组件演示：图表、代码与公式、ML 示意图、演示基础组件">

| 演示 | 内容 |
|---|---|
| `knowledge/component/charts-demo.html` | ECharts 折线 / 柱状 / 热力图，颜色取自 deck 的 CSS token |
| `knowledge/component/code-math-demo.html` | highlight.js 代码高亮、KaTeX 公式，算法与推导对照 |
| `knowledge/component/ml-visuals-demo.html` | 手绘 SVG：Transformer 结构、注意力路由、检索增强生成流程，不用任何图片文件 |
| `knowledge/component/presentation-primitives-demo.html` | 数字指标、对比、时间线、引语、数据表 |

## AI 配图（可选，自备 key）

<img src="docs/readme/ai-embed.jpg" width="100%" alt="生成的封面图分别以 img 背景和 CSS 背景嵌入">

```bash
export AIHUBMIX_API_KEY=...      # 只从环境变量读取，绝不写进 deck
node scripts/imagegen.js "soft aurora over dark sea, empty left third, no text" deck/assets/cover.jpg --size 2048x1152
# 在 deck 里以 assets/cover.jpg 引用，然后打包成单个可移动的文件：
node scripts/inline-assets.js deck/deck.html
```

脚本会读取每个模型的参数定义（自动发送 `size` 或最接近的 `aspect_ratio`），轮询异步任务；所选模型失败时自动回退到 `gpt-image-2`。

<details>
<summary><b>模型对比</b>：同一提示词，1536×1024，2026-09-30 实测</summary>

<img src="docs/readme/ai-models.jpg" width="100%" alt="同一封面提示词在六个模型上的结果">

| 模型 | 耗时 | 评价 |
|---|---|---|
| `gpt-image-2.5-sunburst` | ~35 秒 | 构图和细节最好，**默认** |
| `gpt-image-2.5-flare` | ~25 秒 | 画风接近、更快；可能自己加东西 |
| `gpt-image-2` | ~20 秒 | 稳定，**自动兜底** |
| `flux-2-pro` | ~11 秒 | 最快；偏插画风，可能出现乱码数字 |
| `flux-2-flex` | ~15 秒 | 柔和，偏油画感 |
| `gemini-3.1-flash-image` | ~11 秒 | 只接受宽高比（脚本自动换算 `--size`） |
| `qwen-image-2.0-pro` | ~25 秒 | 发灰、对比度低；只出 PNG |

仅支持异步的模型（`flux-2-*`）需要在 AIHubMix 控制台开启异步任务。`imagen-4.0` 和 `doubao-seedream-5.0-pro` 在模型列表里有，但测试账号调用时返回 `model_not_found`。

</details>

## 演示

<table>
<tr>
<td width="50%"><img src="docs/readme/presenter.jpg" alt="演讲者视图：当前页、下一页、备注、计时"></td>
<td width="50%"><img src="docs/readme/studio.jpg" alt="Studio 查看器：缩略图和 Deck Plan 备注"></td>
</tr>
<tr>
<td><b>演讲者视图</b>：当前页、下一页、演讲者备注、计时器。</td>
<td><b>Studio</b>：缩略图、Deck Plan 备注、全屏、一键打开演讲者视图。</td>
</tr>
</table>

两者都用 `?preview=N` 加载 deck 本身，所以和观众看到的 CSS、字体、主题完全一致。Studio 只是查看器；要改内容就改 HTML，然后按 `R` 刷新。

```
Deck        ← → Space PgUp PgDn   翻页            Home / End   首页 / 末页
            ?preview=N            只显示第 N 页，无控件
            ?print=1              打印版式
Studio      F 全屏   P 演讲者视图   R 刷新   ? 帮助
演讲者视图   ← → Space PgUp PgDn   翻页   Home / End   B 黑屏
```

Studio 需要用 HTTP 打开 skill 根目录（`npx serve .`），然后访问 `studio/editor.html?deck=/path/to/deck.html`。

## 导出

| 命令 | 结果 |
|---|---|
| `node scripts/check-deck.js deck.html` | 校验运行时合同（翻页 API、每页一个 `data-slide`、不用 `display:none` 切换、窗口自适应、打印样式、CDN 地址可用） |
| `node scripts/inline-assets.js deck.html [out.html]` | **单文件 HTML**：本地图片和字体转为 data URI，移动或发邮件都不会丢图 |
| `node scripts/export-pdf.js deck.html [out.pdf]` | **PDF**，16:9，每页一张 1920×1080 |
| `node scripts/export-pptx.js deck.html [plan.json] [out.pptx]` | **PPTX**：每页一张整页图片 + 演讲者备注（页面文字不可编辑） |
| `node scripts/imagegen.js "<prompt>" out.jpg` | 通过 AIHubMix 生成装饰性配图 |

## 目录结构

```
SKILL.md              入口：Agent 遵循的 8 步流程
knowledge/
  RUNTIME.md          deck 运行时合同：舞台、翻页、?preview、打印
  element/            字号、密度、留白
  component/          图表 · 代码与公式 · ML 示意图 · 基础组件（含可运行演示）
  style/              53 × { design.md, preview.html } + index.json
  motion/             背景氛围、入场 / 强调 / 数据动效
prompts/              Deck Plan JSON schema
scripts/              check-deck · inline-assets · export-pdf · export-pptx · imagegen
studio/               editor.html（查看器）· presenter.html
assets/fonts/         内置中文和等宽字体（SIL OFL 1.1）
docs/readme/          仅用于 README 的图片，运行时不需要
SOURCES.md            所有外部资源的版本与许可证
```

## 设计理念

- **教设计，不给模板。** 一种风格是一组理由（token、层级、节奏），Agent 可以把它用在从没见过的内容上。
- **论点先行。** 每页标题都是一个完整句子的论点，正文是它的证据。
- **让人做反应。** 真实的动态预览胜过一堆形容词。
- **合同胜过约定。** 一个很小的运行时 API，让每个 deck 都可校验、可演示、可导出。
- **单文件更长寿。** 无构建步骤、CDN 版本锁定，还能内联成完全可移动的单文件。

## 许可证

本仓库代码和文档采用 [MIT](LICENSE)。内置字体采用 SIL OFL 1.1；CDN 库保留各自的许可证（见 [SOURCES.md](SOURCES.md)）。
付费平台（Gamma、Pitch、Magic UI Pro、Aceternity Pro 等）仅作视觉参考，未使用其任何代码或素材。
