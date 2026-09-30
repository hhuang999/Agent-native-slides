#!/usr/bin/env node
/** Build the bilingual, collapsible 53-style index from the authoritative style catalog. */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const styles = JSON.parse(readFileSync(resolve(root, "knowledge/style/index.json"), "utf8")).styles;
const fontPolicy = JSON.parse(readFileSync(resolve(root, "knowledge/style/font-policy.json"), "utf8"));
const families = {
  A: "Dark tech / 深色科技", B: "Glass / 玻璃质感", C: "Cinematic / 电影叙事",
  D: "Swiss / 瑞士排版", E: "Nordic / 北欧极简", F: "Gradient / 氛围渐变",
  G: "Academic / 学术期刊", H: "Business / 商业", I: "Organic / 有机肌理",
  J: "Engineering / 工程技术", K: "Luxury / 高级质感", L: "AI immersive / AI 沉浸",
  M: "Illustration / 插画艺术", N: "Retro / 复古", O: "Nature / 自然"
};
const out = [
  "# Style gallery / 风格画廊",
  "",
  "[English README](../README.md) · [中文 README](../README.zh-CN.md)",
  "",
  "53 working `preview.html` decks in 15 families. Every strip below shows slides 1–3 captured from the current browser render after a font-load wait. The preview pages use the style's declared Latin face when available and the bundled CJK/offline fallbacks otherwise. The screenshot represents that browser session; live font availability can change line breaks.",
  "",
  "53 个可运行的 `preview.html`，分属 15 个风格家族。每张长图依次展示当前浏览器渲染的前三页；字体会按风格策略使用可用的拉丁字体与内置中文/离线回退字体。不同设备上的字体可用性可能改变换行。",
  "",
  "<img src=\"readme/styles-overview.jpg\" width=\"100%\" alt=\"The 53 current style covers\">",
  "",
  "Open a preview locally and use `←` / `→`, `?preview=N`, or `?print=1`. These are design references; new editable files are built from a versioned object document with `scripts/build-deck.js`.",
  "",
];
for (const [prefix, family] of Object.entries(families)) {
  const group = styles.filter((s) => s.id.startsWith(prefix));
  out.push(`<details><summary><strong>${prefix} · ${family} (${group.length})</strong></summary>`, "");
  for (const s of group) {
    const p = fontPolicy[s.id];
    out.push(`### ${s.id} · ${s.name}`, "", `**${s.scheme}** · ${s.mood.slice(0, 3).join(" / ")} · ${p.display} + ${p.body} · [live preview](../knowledge/style/${s.id}/preview.html) · [design rules](../knowledge/style/${s.id}/design.md)`, "", `<img src="readme/styles/${s.id}.jpg" width="100%" alt="${s.id} ${s.name}: three current preview slides">`, "");
  }
  out.push("</details>", "");
}
out.push("[Font policy / 字体策略](font-audit.md) · [Style index JSON](../knowledge/style/index.json)", "");
writeFileSync(resolve(root, "docs/style-gallery.md"), out.join("\n"));
console.log(`Wrote docs/style-gallery.md for ${styles.length} styles in ${Object.keys(families).length} families`);
