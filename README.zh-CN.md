<div align="center">

# Agent-Native Slides

**Agent 负责规划与设计；你在交付文件中继续编辑；下一轮 AI 修改从你保存的版本开始。**

53 种设计语言 · 可独立打开的 HTML · 内嵌编辑工作台 · PDF · 元素级可编辑 PPTX

[English](README.md) · [体验单文件样例](examples/workflow.html) · [浏览 53 种风格](docs/style-gallery.md) · [对象与导出说明](docs/editable-workbench.md)

<img src="docs/readme/hero-current.jpg" width="100%" alt="真实浏览器截取的幻灯片及其内嵌编辑工作台">

<sub>两张实拍画面均来自仓库内的 <a href="examples/workflow.html">工作流样例</a>；编辑器就在同一份 HTML 里。</sub>

</div>

## 一份文稿，一段可以继续的协作

Agent 先把资料整理为**论点与证据**，让你从真实预览中选风格，再以版本化对象模型生成 **1920 × 1080 单文件 HTML**。打开交付文件即可演示，也可以在工作台修改页面、对象、数据和备注。保存后的 HTML 是下一轮 Agent 修改与导出的输入。

| 阶段 | 做什么 | 留下什么 |
| --- | --- | --- |
| **规划 → 设计** | 将资料化为逐页论点与证据；对照实际风格预览选方向。 | Deck Plan 和设计决策。 |
| **生成 → 校验** | 编写可编辑对象，并把运行时、字体、资源与工作台打包进一份 HTML。 | 具有稳定页面/对象 ID 的文档模型。 |
| **编辑 → 保存** | 在交付 HTML 中改内容、图表数据、属性、备注和页序。 | 用户保存的 HTML、浏览器草稿与文件冲突检查。 |
| **演示 → 导出** | 翻页、看总览/演讲备注、输出 PDF 或 PowerPoint。 | 默认元素级可编辑 PPTX；另有独立图片保真模式。 |
| **继续交给 AI** | 从**用户保存的** HTML 提取当前模型，再次修改。 | 人工修改成为下一轮起点。 |

53 种风格决定页面设计；工作台是一套固定操作界面，不会把幻灯片变成同一种模板。

<img src="docs/readme/collaboration.jpg" width="100%" alt="样例真实幻灯片展示 Agent、独立 HTML 与用户编辑的协作流程">

<sub>单文件样例的第 3 页；图中的节点、文字和连接均是可编辑对象。</sub>

## 看得到的功能

### 编辑交付的那份文件

<img src="docs/readme/workbench.jpg" width="100%" alt="内嵌工作台正在编辑柱状图数据的真实截图">

这是[单文件样例](examples/workflow.html)中选中图表时的真实画面。工作台**默认简体中文**，可切换 English；界面语言不改变幻灯片内容。页面栏、可缩放画布、图层、属性、备注、撤销重做、版本历史和导出任务都打包在 HTML 内。自由定位对象可拖动、缩放、对齐和分组；表格可逐格改，图表有数据表，关系图可直接改节点与连接。文字、代码、公式源、图片、形状和连线各有编辑控件；未知内容类型会在构建时失败。[逐对象能力与限制见矩阵。](docs/editable-workbench.md)

**保存状态清楚可见。** 浏览器支持 File System Access API 且用户授权后，可用 `Ctrl+S` 写回；其他浏览器可下载新的可编辑 HTML，原文件不会被改写。IndexedDB 保存草稿和最近一次覆盖前备份。可选的 Git 历史通过用户主动启动、指定当前 HTML 的本地助手工作：手动保存记录版本，约 60 秒空闲自动记录的开关默认关闭。历史在文稿专属目录，原 HTML 始终是下一轮 AI 的输入。[保存与版本历史说明。](docs/editable-workbench.md#saving-and-history)

### 保留设计自由

<img src="docs/readme/styles-overview.jpg" width="100%" alt="当前浏览器渲染的 53 种风格封面总览">

**15 个家族、53 种风格**，每种都有设计规则和可运行的三页预览。[字体策略](docs/font-audit.md)为每种风格定义展示字、正文字与内置中文/离线回退。[完整画廊](docs/style-gallery.md)提供每种风格的当前三页截图、在线预览文件、字体与规则。这些预览是设计参考；新文稿仍应按内容自行编排。

<details>
<summary>近看四种风格：深色科技、瑞士排版、学术期刊与鲜艳渐变</summary>

<p><strong>A01 · circuit-engineered</strong></p>
<img src="docs/readme/styles/A01.jpg" width="100%" alt="A01 三页预览">
<p><strong>D01 · swiss-international</strong></p>
<img src="docs/readme/styles/D01.jpg" width="100%" alt="D01 三页预览">
<p><strong>G01 · light-journal-academic</strong></p>
<img src="docs/readme/styles/G01.jpg" width="100%" alt="G01 三页预览">
<p><strong>F03 · mesh-gradient-vivid</strong></p>
<img src="docs/readme/styles/F03.jpg" width="100%" alt="F03 三页预览">

</details>

### 带着上下文演示

<table>
<tr><td width="50%"><img src="docs/readme/overview-current.jpg" alt="三页幻灯片的真实页面总览"></td><td width="50%"><img src="docs/readme/presenter-current.jpg" alt="包含当前页、备注和计时器的真实演讲者视图"></td></tr>
<tr><td>按 <code>O</code> 打开页面总览并跳转。</td><td>按 <code>P</code> 查看页面、备注、下一页和计时器。</td></tr>
</table>

方向键和空格翻页，`B` 黑屏；`?preview=N` 只显示指定页，`?print=1` 准备 PDF 打印版式。运行时校验会检查翻页协议、屏幕与打印布局的文字几何；`--font-fallback` 还会阻断外部字体后再检查。

### 两种 PowerPoint 结构，明确区分

<img src="docs/readme/exports-current.jpg" width="100%" alt="从样例实际导出的两种 PPTX 包结构检查">

图中左右采用同一份源 HTML 的页面预览，数字来自**实际生成 PPTX 的包内检查**。默认模式保留独立 PowerPoint 对象、备注和带工作簿的图表；`--image` 则每页保存一张整图以获得视觉保真。原生导出还会在 JSON 清单中记录输入 SHA-256 与逐项转换说明。可直接下载[可编辑 PPTX](examples/workflow.editable.pptx)、[图片版 PPTX](examples/workflow.image.pptx)和 [PDF](examples/workflow.pdf)。

## 本地上手

生成、校验和导出需要 **Node.js 18+**。仓库附带的 [HTML 样例](examples/workflow.html)下载后可直接打开；无需服务器或生图密钥。

```bash
git clone https://github.com/hhuang999/Agent-native-slides.git
cd Agent-native-slides
npm ci --prefix scripts
node scripts/build-deck.js examples/workflow.json examples/workflow.html
node scripts/check-deck.js examples/workflow.html --font-fallback
```

在浏览器打开 `examples/workflow.html`，点击 **编辑文稿**（或加上 `?edit=1`）。工作台默认中文，可在顶部切换 English。改一个图表数值后，使用 **下载 HTML 副本**；若浏览器支持并已授权，也可用 **另存为**。关闭页面并重新打开保存的副本，即可继续编辑。导出磁盘上的已保存版本：

```bash
node scripts/export-pdf.js examples/workflow.html output.pdf
node scripts/export-pptx.js examples/workflow.html output.pptx
node scripts/export-pptx.js examples/workflow.html output.image.pptx --image
```

导出**工作台中尚未保存的当前快照**：运行 `node scripts/export-helper.js`，把终端打印的令牌填入工作台，点击 **导出当前快照**。任务区显示接收、转换、完成或失败，可重试同一快照，也可导出之后的新编辑，并显示准确的输入 SHA-256。

如需可选的本地 Git 历史，先安装 Git，再用同一个助手明确指定要保存的 HTML：

```bash
node scripts/export-helper.js --file /absolute/path/to/deck.html
```

在工作台填写令牌、点击 **连接助手**，核对显示的路径和文档 ID，再主动启用历史。历史位于 `~/.agent-native-slides/history/<路径与文档ID哈希>/`；只跟踪这份文稿，不自动推送 GitHub。版本可预览、以新提交恢复；约 60 秒空闲自动记录默认关闭。普通单文件编辑和浏览器下载不需要 Git 或助手。

制作新文稿时，把源资料交给编码 Agent，并让它遵循 [SKILL.md](SKILL.md)，例如：“把这篇论文做成 12 页答辩幻灯片。先给我看风格预览，再交付可编辑 HTML。”Agent 按规划与风格规则编写[版本化对象文档](docs/editable-workbench.md)，交付前必须运行 `build-deck.js` 和 `check-deck.js`。AI 封面配图[完全可选](docs/image-generation.md)。

下一轮修改必须从**你保存的 HTML** 开始：

```bash
node scripts/extract-document.js saved.html current.json
# 修改 current.json，再重新打包。
node scripts/build-deck.js current.json revised.html
```

## 能力边界

- 内嵌的 `#ans-document` 是唯一保存权威；DOM 与 `__deckPlan` 从它派生。模型有版本号，未知内容对象会被拒绝。[运行时协议](knowledge/RUNTIME.md) · [对象协议](docs/editable-workbench.md)
- 原生 PPTX 将文字、形状、连线、图片、表格、备注、关系图节点/边和支持的图表映射为可编辑对象。公式保留可编辑 LaTeX 源文本，并非 Office 原生公式；散点图是可编辑标记与标签，没有内嵌工作簿。HTML 动效在 PowerPoint 中为静态。装饰效果可成为独立静态图片；清单会记录转换。
- 写回磁盘需要浏览器能力和用户授权；下载的 HTML 仍可编辑，但浏览器草稿不等于磁盘文件。旧 HTML 不会自动转成新模型；其 PPTX 路径是明确的 `--image` 模式。
- 不同机器的字体可用性可能改变换行。`check-deck.js` 能发现几何问题；图表 canvas 标签和整体视觉密度仍需人工查看。

独立的 `studio/editor.html` 是供旧文稿使用的只读查看器；本页展示的工作台位于**新生成的单文件 HTML 内**。HHB-HTML-PPT 提供了编辑、保存和导出行为参考；[lewislulu/html-ppt-skill](https://github.com/lewislulu/html-ppt-skill) 提供了主题、总览、动效与演讲体验参考。本项目保留自己的 1920 × 1080 舞台和 53 种风格设计参考。

## 仓库导航

| 位置 | 用途 |
| --- | --- |
| [SKILL.md](SKILL.md)、[内容规划规则](prompts/deck-plan-schema.md) | Agent 工作流与论点/证据规划 |
| [风格目录](knowledge/style)、[完整画廊](docs/style-gallery.md) | 53 种设计语言及预览 |
| [workbench](workbench)、[对象协议](docs/editable-workbench.md) | 内嵌编辑器、保存模型、对象能力 |
| [scripts](scripts) | 打包、校验、提取、PDF/PPTX 导出与本地助手 |
| [examples/workflow.html](examples/workflow.html) | 真实生成的独立样例与导出源文件 |

构建并导出样例后，可用 `node scripts/capture-readme.js` 和 `node scripts/capture-export-proof.js` 重现首页图片；[视觉素材来源与再生成步骤](docs/readme/ASSETS.md)逐项说明。53 张风格长图与总览均来自当前浏览器渲染，而非幻灯片效果图。

[MIT 许可证](LICENSE) · [字体与依赖来源](SOURCES.md)
