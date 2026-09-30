#!/usr/bin/env node
/** Native editable export for workbench decks. --image calls the explicit legacy fidelity path. */
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { resolve, relative, isAbsolute } from "node:path";
import { spawnSync } from "node:child_process";
import pptxgen from "pptxgenjs";
import JSZip from "jszip";
import { launchChromium, toFileUrl } from "./lib/browser.js";
import { assertDocument, digest } from "./lib/document-model.js";

const args = process.argv.slice(2),
  image = args.includes("--image"),
  deckPath = resolve(args[0] || ""),
  outPath = resolve(
    args.find((a, i) => i > 0 && !a.startsWith("--")) ||
      deckPath.replace(/\.html?$/i, image ? ".image.pptx" : ".pptx"),
  );
const sourceLabel = (() => {
  const fromCwd = relative(process.cwd(), deckPath);
  return fromCwd && !fromCwd.startsWith("..") && !isAbsolute(fromCwd)
    ? fromCwd.replaceAll("\\", "/")
    : deckPath;
})();
if (!args[0] || !existsSync(deckPath)) {
  console.error(
    "Usage: node scripts/export-pptx.js deck.html [output.pptx] [--image]",
  );
  process.exit(1);
}
if (image) {
  const r = spawnSync(
    process.execPath,
    [
      resolve(import.meta.dirname, "export-pptx-image.js"),
      deckPath,
      "",
      outPath,
    ],
    { stdio: "inherit" },
  );
  if (r.error) throw r.error;
  if (r.status === 0)
    writeFileSync(
      outPath + ".manifest.json",
      JSON.stringify(
        {
          mode: "image",
          source: sourceLabel,
          inputSha256: digest(readFileSync(deckPath, "utf8")),
          conversions: [
            {
              reason:
                "Every slide captured as one full-slide image; content is not editable",
            },
          ],
        },
        null,
        2,
      ),
    );
  process.exit(r.status === 0 ? 0 : 1);
}
const html = readFileSync(deckPath, "utf8"),
  match = html.match(
    /<script id="ans-document" type="application\/json">([\s\S]*?)<\/script>/,
  );
if (!match)
  throw Error(
    "Editable document missing. Generate this deck with build-deck.js; use --image only for legacy HTML.",
  );
const doc = assertDocument(JSON.parse(match[1])),
  inputHash = digest(html),
  modelHash = digest(doc);
const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.title = doc.title;
pptx.subject = `Agent-native-slides input SHA256 ${inputHash}`;
const SW = 13.333333,
  SH = 7.5,
  sx = (x) => (x / 1920) * SW,
  sy = (y) => (y / 1080) * SH;
const color = (value) => {
  const v = String(value || "").trim();
  return /^#?[0-9a-f]{6}$/i.test(v) ? v.replace(/^#/, "") : "FFFFFF";
};
const manifest = {
  mode: "editable",
  source: sourceLabel,
  inputSha256: inputHash,
  documentSha256: modelHash,
  pages: [],
  conversions: [],
};
function note(page, id, reason) {
  manifest.conversions.push({ pageId: page.id, objectId: id, reason });
}
function addText(slide, text, box, style = {}) {
  slide.addText(String(text ?? ""), {
    x: sx(box.x),
    y: sy(box.y),
    w: sx(box.w),
    h: sy(box.h),
    fontFace: style.pptxFontFamily || style.fontFamily || "Arial",
    fontSize: Math.max(6, Number.parseFloat(style.fontSize) || 30) / 2,
    color: color(style.color),
    bold: style.fontWeight === "bold" || Number(style.fontWeight) >= 600,
    align: style.textAlign || "left",
    breakLine: false,
    margin: 0,
    fit: "shrink",
  });
}
function addLine(slide, from, to, stroke = "68BED0") {
  let x1 = sx(from.x),
    y1 = sy(from.y),
    x2 = sx(to.x),
    y2 = sy(to.y);
  slide.addShape(pptx.ShapeType.line, {
    x: x1,
    y: y1,
    w: x2 - x1,
    h: y2 - y1,
    line: {
      color: color(stroke),
      width: 2,
      beginArrowType: "none",
      endArrowType: "triangle",
    },
  });
}
function addObject(slide, page, o, b) {
  const st = { ...(o.style || {}), ...(b?.style || {}) },
    box = b || o.box;
  if (!box) throw Error(`No rendered geometry for ${o.id}`);
  if (["text", "code", "formula"].includes(o.type)) {
    addText(slide, o.text, box, {
      ...st,
      fontFamily: o.type === "code" ? "Consolas" : st.fontFamily,
    });
    if (o.type === "formula")
      note(
        page,
        o.id,
        "LaTeX source exported as editable text; PowerPoint equation semantics unavailable",
      );
    return;
  }
  if (o.type === "image") {
    slide.addImage({
      data: doc.resources[o.resourceId].data,
      x: sx(box.x),
      y: sy(box.y),
      w: sx(box.w),
      h: sy(box.h),
    });
    if (o.crop)
      note(
        page,
        o.id,
        "Image crop represented by its full image bounds; crop offsets may differ",
      );
    return;
  }
  if (o.type === "shape") {
    slide.addShape(
      o.shape === "ellipse" ? pptx.ShapeType.ellipse : pptx.ShapeType.rect,
      {
        x: sx(box.x),
        y: sy(box.y),
        w: sx(box.w),
        h: sy(box.h),
        fill: { color: color(st.backgroundColor || o.fill) },
        line: { color: color(st.borderColor || st.backgroundColor || o.fill) },
      },
    );
    return;
  }
  if (o.type === "connector") {
    addLine(
      slide,
      {
        x: box.x + (box.w * o.from.x) / 100,
        y: box.y + (box.h * o.from.y) / 100,
      },
      { x: box.x + (box.w * o.to.x) / 100, y: box.y + (box.h * o.to.y) / 100 },
      st.strokeColor || o.color,
    );
    return;
  }
  if (o.type === "diagram") {
    for (const e of o.edges) {
      const a = o.nodes.find((n) => n.id === e.from),
        z = o.nodes.find((n) => n.id === e.to);
      if (!a || !z) throw Error(`Broken diagram edge ${o.id}`);
      addLine(
        slide,
        {
          x: box.x + (box.w * (a.x + (a.w || 18) / 2)) / 100,
          y: box.y + (box.h * (a.y + (a.h || 14) / 2)) / 100,
        },
        {
          x: box.x + (box.w * (z.x + (z.w || 18) / 2)) / 100,
          y: box.y + (box.h * (z.y + (z.h || 14) / 2)) / 100,
        },
      );
    }
    for (const n of o.nodes) {
      const nb = {
        x: box.x + (box.w * n.x) / 100,
        y: box.y + (box.h * n.y) / 100,
        w: (box.w * (n.w || 18)) / 100,
        h: (box.h * (n.h || 14)) / 100,
      };
      slide.addShape(pptx.ShapeType.roundRect, {
        x: sx(nb.x),
        y: sy(nb.y),
        w: sx(nb.w),
        h: sy(nb.h),
        rectRadius: 0.1,
        fill: { color: "244354" },
        line: { color: "7AD5D7" },
      });
      addText(slide, n.label, nb, { fontSize: 26, textAlign: "center" });
    }
    return;
  }
  if (o.type === "table") {
    slide.addTable(
      o.rows.map((r) => r.map(String)),
      {
        x: sx(box.x),
        y: sy(box.y),
        w: sx(box.w),
        h: sy(box.h),
        border: { type: "solid", color: "B2C6D0", pt: 1 },
        fontFace: "Arial",
        fontSize: 16,
        color: color(st.color),
        fill: { color: "193441" },
        margin: 0.07,
      },
    );
    return;
  }
  if (o.type === "chart") {
    if (o.chartType === "scatter") {
      const max = Math.max(1, ...o.series.flatMap((s) => s.values.map(Number)));
      o.categories.forEach((c, i) =>
        o.series.forEach((s, j) => {
          const v = Number(s.values[i]);
          const x = box.x + (box.w * (i + 1)) / (o.categories.length + 1),
            y = box.y + box.h * (1 - v / max);
          slide.addShape(pptx.ShapeType.ellipse, {
            x: sx(x),
            y: sy(y),
            w: 0.08,
            h: 0.08,
            fill: {
              color: (b.palette || ["49D6D0", "E8B964", "8587E9"])[j % 3],
            },
            line: { color: "FFFFFF" },
          });
          addText(
            slide,
            `${c}: ${v}`,
            { x: x + 12, y: y - 8, w: 110, h: 30 },
            { fontSize: 18, color: st.color },
          );
        }),
      );
      note(
        page,
        o.id,
        "Scatter rendered as editable markers and labels; no native chart data sheet",
      );
      return;
    }
    const type = {
      bar: pptx.ChartType.bar,
      line: pptx.ChartType.line,
      pie: pptx.ChartType.pie,
    }[o.chartType];
    slide.addChart(
      type,
      o.series.map((s) => ({
        name: s.name || "Series",
        labels: o.categories,
        values: s.values.map(Number),
      })),
      {
        x: sx(box.x),
        y: sy(box.y),
        w: sx(box.w),
        h: sy(box.h),
        showLegend: o.series.length > 1,
        showValue: false,
        showTitle: false,
        showCatName: true,
        showSerName: false,
        chartColors: b.palette || ["49D6D0", "E8B964", "8587E9", "F28291"],
        showMarker: o.chartType === "line",
        ...(st.pptxChartMinimal
          ? {
              catAxisLabelColor: color(st.color),
              catAxisLabelFontFace: "Arial",
              catAxisLabelFontSize: 15,
              catAxisLineShow: false,
              valAxisHidden: true,
              valGridLine: { style: "none" },
            }
          : {}),
      },
    );
    return;
  }
  throw Error(`No PPTX adapter for ${o.type} (${o.id})`);
}
const browser = await launchChromium();
try {
  const page = await browser.newPage({
    viewport: { width: 1920, height: 1080 },
  });
  await page.goto(toFileUrl(deckPath), { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  for (let i = 0; i < doc.pages.length; i++) {
    await page.evaluate((n) => window.__goToSlide(n), i + 1);
    const p = doc.pages[i],
      slide = pptx.addSlide();
    const geometry = await page.evaluate(() => {
      const s = document.querySelector(".slide.is-active"),
        base = s.getBoundingClientRect(),
        out = {};
      for (const n of s.querySelectorAll("[data-object-id]")) {
        const b = n.getBoundingClientRect();
        const c = getComputedStyle(n),
          canvas = document.createElement("canvas");
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext("2d"),
          hex = (value) => {
            ctx.clearRect(0, 0, 1, 1);
            ctx.fillStyle = value || "#000";
            ctx.fillRect(0, 0, 1, 1);
            return [...ctx.getImageData(0, 0, 1, 1).data]
              .slice(0, 3)
              .map((x) => x.toString(16).padStart(2, "0"))
              .join("")
              .toUpperCase();
          };
        const root = getComputedStyle(document.documentElement);
        out[n.dataset.objectId] = {
          x: b.x - base.x,
          y: b.y - base.y,
          w: b.width,
          h: b.height,
          style: {
            color: hex(c.color),
            backgroundColor: hex(c.backgroundColor),
            fontFamily: c.fontFamily.split(",")[0].replace(/[\"']/g, ""),
            fontSize: parseFloat(c.fontSize),
            fontWeight: c.fontWeight,
            textAlign: c.textAlign,
            strokeColor: hex(
              getComputedStyle(n.querySelector("line") || n).stroke,
            ),
          },
          palette: [1, 2, 3, 4].map((i) =>
            hex(
              root.getPropertyValue("--chart-c" + i).trim() ||
                ["#49D6D0", "#E8B964", "#8587E9", "#F28291"][i - 1],
            ),
          ),
        };
      }
      return out;
    });
    await page.addStyleTag({
      content:
        ".slide.is-active .ans-object{visibility:hidden!important}#ans-edit,#ans-shell,#ans-overview-panel,#ans-speaker-panel,#ans-blackout{display:none!important}",
    });
    const bg = await page.screenshot({
      type: "png",
      clip: { x: 0, y: 0, width: 1920, height: 1080 },
    });
    await page.evaluate(() =>
      document.querySelectorAll("style").forEach((s) => {
        if (
          s.textContent.includes(
            ".slide.is-active .ans-object{visibility:hidden",
          )
        )
          s.remove();
      }),
    );
    slide.addImage({
      data: "image/png;base64," + bg.toString("base64"),
      x: 0,
      y: 0,
      w: SW,
      h: SH,
    });
    note(
      p,
      null,
      "Decorative background captured as one independent static image",
    );
    for (const o of p.objects) {
      addObject(slide, p, o, geometry[o.id]);
      if (o.animation && o.animation !== "none")
        note(
          p,
          o.id,
          `HTML ${o.animation} animation has no PowerPoint animation mapping`,
        );
      if (o.step > 0)
        note(
          p,
          o.id,
          `HTML reveal step ${o.step} exported in its final visible state`,
        );
      if (o.group)
        note(
          p,
          o.id,
          `Group ${o.group} is logical in HTML; exported objects remain independently editable`,
        );
    }
    if (p.notes) slide.addNotes(p.notes);
    manifest.pages.push({
      id: p.id,
      index: i + 1,
      objects: p.objects.map((o) => o.id),
    });
    console.log(
      `Slide ${i + 1}/${doc.pages.length}: ${p.objects.length} native objects`,
    );
  }
  await pptx.writeFile({ fileName: outPath });
  const zip = await JSZip.loadAsync(readFileSync(outPath));
  for (const name of Object.keys(zip.files).filter((n) =>
    /^ppt\/slides\/slide\d+\.xml$/.test(n),
  )) {
    let xml = await zip.file(name).async("string");
    xml = xml.replace(/<p:sp>.*?<\/p:sp>/g, (block) =>
      block.includes('<a:prstGeom prst="line">')
        ? block
            .replaceAll("<p:sp>", "<p:cxnSp>")
            .replaceAll("</p:sp>", "</p:cxnSp>")
            .replaceAll("nvSpPr", "nvCxnSpPr")
            .replaceAll("cNvSpPr", "cNvCxnSpPr")
        : block,
    );
    zip.file(name, xml);
  }
  writeFileSync(
    outPath,
    await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE" }),
  );
  writeFileSync(outPath + ".manifest.json", JSON.stringify(manifest, null, 2));
  console.log(`Editable PPTX ${outPath}\nInput SHA256 ${inputHash}`);
} finally {
  await browser.close();
}
