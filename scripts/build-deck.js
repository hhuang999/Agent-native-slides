#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname, extname } from "node:path";
import { assertDocument } from "./lib/document-model.js";

const [, , input, output] = process.argv;
if (!input || !output) {
  console.error("Usage: node scripts/build-deck.js document.json output.html");
  process.exit(1);
}
const root = resolve(import.meta.dirname, "..");
const source = resolve(input),
  out = resolve(output);
const doc = JSON.parse(readFileSync(source, "utf8"));
const styles = JSON.parse(
  readFileSync(resolve(root, "knowledge/style/index.json"), "utf8"),
).styles;
if (!styles.some((s) => s.id === doc.styleId))
  throw Error(
    `Select one of the 53 style IDs before building; got ${doc.styleId}`,
  );
const mime = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".ttf": "font/ttf",
  ".otf": "font/otf",
};
for (const [key, res] of Object.entries(doc.resources || {})) {
  if (res.path && !res.data) {
    const p = resolve(dirname(source), res.path),
      ext = extname(p).toLowerCase();
    if (!mime[ext]) throw Error(`Unsupported resource ${p}`);
    res.data = `data:${mime[ext]};base64,${readFileSync(p).toString("base64")}`;
    delete res.path;
  }
}
assertDocument(doc);
const css = readFileSync(resolve(root, "workbench/workbench.css"), "utf8");
const i18n = readFileSync(resolve(root, "workbench/i18n.js"), "utf8");
const runtime = readFileSync(resolve(root, "workbench/runtime.js"), "utf8");
function inlineCss(css) {
  if (/@import\b/i.test(css))
    throw Error(
      "Theme CSS @import is not self-contained; embed the font or stylesheet.",
    );
  return css.replace(/url\(\s*(['"]?)(.*?)\1\s*\)/gi, (whole, quote, ref) => {
    if (/^data:/i.test(ref)) return whole;
    if (/^(https?:|\/\/)/i.test(ref))
      throw Error(`Remote theme asset is not self-contained: ${ref}`);
    const p = resolve(dirname(source), ref.split(/[?#]/)[0]),
      ext = extname(p).toLowerCase();
    if (!mime[ext]) throw Error(`Unsupported theme asset: ${ref}`);
    return `url("data:${mime[ext]};base64,${readFileSync(p).toString("base64")}")`;
  });
}
doc.theme ??= {};
doc.theme.css = inlineCss(doc.theme.css || "");
for (const variant of doc.theme?.variants || [])
  variant.css = inlineCss(variant.css || "");
const escape = (s) => s.replace(/<\//g, "<\\/");
const html = `<!doctype html>\n<html lang="${doc.language || "en"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${String(doc.title || "Deck").replace(/[<&]/g, "")}</title><style>${css}</style><style id="ans-theme-style"></style></head><body><div id="ans-stage" class="slide-stage"></div><div id="ans-overview-panel" hidden></div><div id="ans-speaker-panel" hidden><header><strong>Presenter view</strong><span id="ans-speaker-clock">00:00</span><button id="ans-speaker-close">Close ×</button></header><main><div><div id="ans-speaker-current-preview"></div><p id="ans-speaker-index"></p></div><aside><h2>Notes</h2><p id="ans-speaker-notes"></p><h2>Next slide</h2><p id="ans-speaker-next"></p><div><button id="ans-speaker-prev">Previous</button><button id="ans-speaker-forward">Next</button></div></aside></main></div><div id="ans-blackout" hidden></div><button id="ans-edit">Edit deck</button><div id="ans-shell" hidden><header class="ans-top"><div class="ans-top-row"><span class="ans-brand">AGENT / SLIDES</span><strong id="ans-title"></strong><span class="ans-spacer"></span><select id="ans-ui-language" aria-label="Language"><option value="zh-CN">中文</option><option value="en">English</option></select><button id="ans-undo">Undo</button><button id="ans-redo">Redo</button><button id="ans-present">Present</button><button id="ans-overview">Overview</button><button id="ans-speaker">Speaker</button><select id="ans-theme"><option value="">Theme</option></select></div><div class="ans-top-row ans-top-tools"><button id="ans-save" class="ans-primary">Save</button><button id="ans-saveas">Save as</button><button id="ans-associate">Link file</button><button id="ans-download">Download HTML</button><button id="ans-restore">Restore draft</button><button id="ans-backup">Backup</button><span class="ans-toolbar-divider"></span><input id="ans-helper-token" title="Local helper token" placeholder="Helper token"><button id="ans-helper-connect">Connect helper</button><select id="ans-export-mode"><option value="editable">Editable PPTX</option><option value="image">Image PPTX</option><option value="pdf">PDF</option></select><button id="ans-export">Export current</button></div></header><aside class="ans-side"><h2 class="ans-left-title-pages">Pages</h2><div id="ans-pages"></div><div class="ans-tools"><button id="ans-new-page">New page</button><button id="ans-add-page">Duplicate</button><button id="ans-del-page">Delete</button><button id="ans-up">↑</button><button id="ans-down">↓</button></div><h2 class="ans-left-title-insert">Insert</h2><select id="ans-insert"><option value="">Choose object…</option>${["text", "image", "shape", "connector", "diagram", "table", "chart", "formula", "code"].map((x) => `<option value="${x}">${x}</option>`).join("")}</select><h2 class="ans-left-title-layers">Layers</h2><div id="ans-layers"></div><h2>${"Align"}</h2><div class="ans-tools ans-align-tools"><button data-align="left" title="Align left">⇤</button><button data-align="center" title="Align center">↔</button><button data-align="right" title="Align right">⇥</button><button data-align="distribute-horizontal" title="Distribute horizontal">⋯↔</button><button data-align="distribute-vertical" title="Distribute vertical">⋮↕</button></div></aside><main class="ans-center"><div class="ans-canvas"><div id="ans-editor-stage-placeholder"></div></div></main><aside class="ans-side ans-right"><h2 class="ans-right-title-props">Properties</h2><div id="ans-props"></div><h2 class="ans-right-title-notes">Speaker notes</h2><textarea id="ans-notes"></textarea><h2 class="ans-right-title-zoom">Canvas zoom</h2><div class="ans-zoom-row"><input id="ans-zoom" type="range" min="20" max="120" value="56"><button id="ans-fit">Fit</button></div><h2 class="ans-right-title-history">File history</h2><div id="ans-git-panel"><p id="ans-file-info"></p><div class="ans-actions"><button id="ans-history-enable">Enable history</button><button id="ans-history-refresh">Refresh history</button><button id="ans-history-record">Record version</button></div><label class="ans-toggle"><input id="ans-history-auto" type="checkbox"> Auto version</label><div id="ans-history-list"></div><div id="ans-history-preview"></div></div></aside><footer class="ans-foot"><span id="ans-status"></span></footer><div id="ans-task-panel" hidden><button id="ans-task-close" aria-label="Close">×</button><strong id="ans-task-title"></strong><p id="ans-task-details"></p><div class="ans-actions"><button id="ans-task-retry">Retry snapshot</button><button id="ans-task-latest">Export latest</button><a id="ans-task-download" hidden download>Download</a></div></div></div><script id="ans-document" type="application/json">${escape(JSON.stringify(doc))}</script><script>${i18n}</script><script>${runtime}</script></body></html>`;
writeFileSync(out, html);
console.log(
  `Built ${out} from ${source}; ${doc.pages.length} slides, ${Object.values(doc.resources || {}).length} embedded resources`,
);
