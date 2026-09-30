# Deck Plan JSON Schema

演讲稿转换的核心合同：在生成任何 HTML 之前确认内容结构。

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
      "display_content": "string — 观众看到什么：布局结构、视觉元素、数据",
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

## ~200 字拆分规则

单张幻灯片的 `display_content` 描述超过约 200 字时，AI 应自动拆分为两页。衡量标准：

1. 观众能在 ≤15 秒内吸收这页的核心内容吗？
2. 这页是否有两个平等的视觉重心？

如有，拆分。

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
| `display_content` | 幻灯片可见区域 | 描述观众看到什么：布局结构、核心视觉元素。**不是演讲者说的话。** |
| `speaker_notes` | 演讲者注释面板 | 结构化字段：purpose / key_points / transition / timing。辅助口头解说，观众看不到。 |
