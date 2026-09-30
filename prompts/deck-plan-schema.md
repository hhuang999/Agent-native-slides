# Deck Plan JSON Schema

演讲稿转换的核心合同：在生成任何 HTML 之前确认内容结构。

Deck Plan 仅用于内容规划。新幻灯片必须把它转成 `docs/editable-workbench.md` 的版本化页面/对象模型，运行 `scripts/build-deck.js` 交付。以后修改以用户保存的 HTML 中 `#ans-document` 为准；`__deckPlan` 是兼容查看器的派生数据。每个标题、数据图、关系节点、代码、公式和图片都应成为有稳定 ID 的对象；没有编辑和 PPTX 导出适配器的内容类型应在生成时明确失败。

---

## Schema 定义

```json
{
  "title": "string — 演讲标题",
  "author": "string — 作者姓名",
  "venue": "string — 会议/场合（可选）",
  "date": "string — 日期（可选）",
  "style_id": "string — 从 style/index.json 选定的风格 ID",
  "mood": ["string"] — 情绪词，如 technical / academic / creative",
  "occasion": "string — 场合类型（见下表）",
  "language": "zh | en | zh-en",
  "density": "speaker | reading",
  "total_slides": "number",
  "slides": [
    {
      "index": "number (1-based)",
      "type": "slide type (见下表)",
      "assertion": "string — A-E 断言句标题（完整句子，≤12汉字/≤10英文词）",
      "visible_text": ["string — 实际显示在幻灯片上的短句、标签或关键数字"],
      "display_content": "string — 布局结构、视觉元素和数据；不粘贴讲稿",
      "visual_evidence_type": "chart | diagram | image | formula | code | table | none",
      "visual_spec": "object — 图表/图的具体说明（见下）",
      "speaker_notes": {
        "title": "string",
        "purpose": "string — 本页在叙事中的作用",
        "key_points": ["string"],
        "transition": "string — 过渡语",
        "timing": "number — 建议分钟数",
        "interaction": "string（可选）",
        "tone": "string（可选）"
      }
    }
  ]
}
```

---

## occasion 类型

| occasion | 说明 |
|---------|------|
| `conference-talk` | 顶会/学术会议报告（30-45 min） |
| `thesis-defense` | 学位论文答辩（20-30 min） |
| `group-meeting` | 组会/周会报告（15-20 min） |
| `seminar` | 研讨班/课堂教学（45-90 min） |
| `investor-pitch` | 投资者路演（5-10 min） |
| `product-launch` | 产品发布（15-30 min） |
| `team-update` | 团队进展同步（10-15 min） |
| `workshop` | 工作坊/培训（60-120 min） |
| `keynote` | 主题演讲（45-60 min） |

---

## slide type 类型

| type | 用途 |
|------|------|
| `cover` | 封面页：标题、作者、机构、日期 |
| `outline` | 目录/提纲：整个演讲结构 |
| `section` | 章节分隔页：进入新话题 |
| `claim-evidence` | 主体页（最常见）：断言 + 单一视觉证据 |
| `comparison` | 对比页：两个方案/结果的并排 |
| `diagram` | 架构/流程图页：系统结构、工作流 |
| `data` | 数据页：图表为主 |
| `formula` | 公式页：数学推导 |
| `code` | 代码示例页 |
| `quote` | 引用/金句页：大字引用 |
| `summary` | 总结页：要点回顾 |
| `conclusion` | 结论页：核心主张重申 |
| `qa` | Q&A 页：开放提问 |
| `appendix` | 备用/附录页 |

---

## visual_spec 字段

根据 `visual_evidence_type` 填写：

**chart（ECharts）**：
```json
{
  "chart_type": "bar | line | scatter | pie | heatmap | sankey | tree | ...",
  "x_label": "string",
  "y_label": "string",
  "data_description": "string — 描述数据含义和来源",
  "highlight": "string — 需要强调的数据点或趋势",
  "color_scheme": "academic | technical | warm | neutral"
}
```

**diagram（SVG/手工）**：
```json
{
  "diagram_type": "transformer | attention | cnn | rnn | diffusion | rag | moe | encoder-decoder | flowchart | timeline | ...",
  "nodes": ["string — 节点名称"],
  "edges": ["string — 关系描述"],
  "highlight": "string — 重点部分"
}
```

**formula（KaTeX）**：
```json
{
  "latex": "string — LaTeX 公式代码",
  "annotation": "string — 各符号含义"
}
```

**code（Shiki/highlight.js）**：
```json
{
  "language": "python | javascript | bash | ...",
  "code": "string",
  "highlight_lines": [1, 3, 5],
  "caption": "string"
}
```

---

## 内容预算与拆页规则

步骤中提到的 100–200 词是**输入材料的规划块**，不是幻灯片可见文字量。`display_content` 描述布局；`visible_text` 才是打算上屏的原文。先写简短可见文字，把解释、推导和完整句子放入 `speaker_notes.key_points`。

- `speaker`：每页一个断言和一个视觉证据。正文初稿最多约 30 个汉字或 25 个英文词，最多 3 个短要点；标题另计，但应在目标字号下不超过两行。
- `reading`：正文初稿最多约 80 个汉字或 60 个英文词，最多两个文本块。更长内容进备注、附录或下一页。
- 中英混排、长单词、公式、代码和图例不能仅按字数判断；按实际字体和可用宽度测量。图表或代码占据较大区域时，进一步削减文字。
- 若标题超过两行、文字挤占证据区域、出现第二个视觉重心，或观众无法在约 15 秒内抓住要点，先精简或拆页。不要用更小字号、裁切或省略号掩盖超量内容。
- HTML 生成后必须等待字体加载，逐页用 `check-deck.js` 检查屏幕和打印布局；以真实渲染结果修订计划与页面。

---

## 完整示例

```json
{
  "title": "Scaling Laws for Neural Language Models",
  "author": "Kaplan et al.",
  "venue": "NeurIPS 2024 Workshop",
  "style_id": "L01",
  "mood": ["technical", "data-driven"],
  "occasion": "conference-talk",
  "language": "en",
  "density": "speaker",
  "total_slides": 12,
  "slides": [
    {
      "index": 1,
      "type": "cover",
      "assertion": "Compute-optimal training follows a power law",
      "visible_text": ["Compute-optimal training follows a power law", "Kaplan et al. · NeurIPS"],
      "display_content": "Large headline assertion + author/venue line + affiliation logos + minimal dark atmospheric background",
      "visual_evidence_type": "none",
      "speaker_notes": {
        "title": "Cover",
        "purpose": "Establish the single claim this talk will prove",
        "key_points": ["Power law: loss ∝ C^-0.05", "This determines how to allocate a fixed compute budget"],
        "transition": "Let's start with what we mean by scaling.",
        "timing": 1
      }
    },
    {
      "index": 2,
      "type": "claim-evidence",
      "assertion": "Doubling compute should go 50% to data, 50% to model",
      "visible_text": ["Doubling compute should go 50% to data, 50% to model", "GPT-3 is undertrained"],
      "display_content": "Assertion headline (large) + one ECharts scatter plot showing compute-optimal frontier curve (Chinchilla frontier vs GPT-3 training point highlighted)",
      "visual_evidence_type": "chart",
      "visual_spec": {
        "chart_type": "scatter",
        "x_label": "Model Parameters",
        "y_label": "Training Tokens",
        "data_description": "Compute-optimal (model size, tokens) pairs for different compute budgets C",
        "highlight": "GPT-3 is well below the optimal frontier — undertrained",
        "color_scheme": "technical"
      },
      "speaker_notes": {
        "title": "Optimal allocation",
        "purpose": "Show the core empirical finding — equal allocation beats fixed model scaling",
        "key_points": [
          "Each point on frontier: optimal (N, D) for given C",
          "GPT-3: 175B params but only 300B tokens — should have been 70B params × 1.4T tokens",
          "Implication: most large models are undertrained"
        ],
        "transition": "This has immediate practical consequences for how we train models.",
        "timing": 3
      }
    }
  ]
}
```

---

## display_content 与 speaker_notes 的区别

| 字段 | 位置 | 内容规则 |
|------|------|---------|
| `visible_text` | 幻灯片可见区域 | 上屏的确切短句、标签和关键数字；用它检查字数与渲染宽度。 |
| `display_content` | 布局规划 | 描述视觉结构和核心证据。**不是讲稿，也不是 200 字的上屏额度。** |
| `speaker_notes` | 演讲者注释面板 | 结构化字段：purpose / key_points / transition / timing。辅助口头解说，观众看不到。 |
