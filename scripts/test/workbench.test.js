import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync, spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { chromium } from "playwright";
import JSZip from "jszip";
import { launchChromium } from "../lib/browser.js";
const root = resolve(import.meta.dirname, "../.."),
  dir = mkdtempSync(join(tmpdir(), "ans-workbench-test-"));
const run = (name, args) => {
  const r = spawnSync(
    process.execPath,
    [resolve(root, "scripts", name), ...args],
    { encoding: "utf8", maxBuffer: 10_000_000 },
  );
  assert.equal(r.status, 0, `${name}: ${r.stdout}\n${r.stderr}`);
  return r.stdout;
};
const obj = (id, type, box, extra = {}) => ({ id, type, box, ...extra });
function model(style, language) {
  const dark = style === "A01";
  return {
    version: 1,
    id: "acceptance-" + style,
    title: `${style} ${language} 可编辑工作台`,
    language,
    styleId: style,
    theme: {
      css: dark
        ? ":root{--color-bg:#0d1e29;--color-body:#e9f5f7;--color-accent:#49d6d0}.slide{font-family:Consolas,Arial,sans-serif;background-image:linear-gradient(145deg,#0d1e29,#16313e)}"
        : ":root{--color-bg:#f5f2e9;--color-body:#28323b;--color-accent:#a35a43}.slide{font-family:Georgia,Arial,sans-serif;background-image:linear-gradient(145deg,#f5f2e9,#e9dfcf)}",
    },
    resources: {
      art: {
        id: "art",
        data:
          "data:image/svg+xml;base64," +
          Buffer.from(
            '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="#486d80"/><circle cx="150" cy="100" r="60" fill="#e6ba76"/></svg>',
          ).toString("base64"),
      },
    },
    pages: [
      {
        id: "page-1",
        title: "中英混排 · Research summary",
        layout: "absolute",
        notes: "中文备注 and English speaker notes",
        objects: [
          obj(
            "heading",
            "text",
            { x: 90, y: 65, w: 1400, h: 90 },
            {
              text:
                style === "G01"
                  ? "Research progress"
                  : "研究进展 · Research progress",
              style: { fontSize: 66, color: dark ? "#ffffff" : "#28323b" },
            },
          ),
          obj(
            "body",
            "text",
            { x: 90, y: 180, w: 800, h: 120 },
            {
              text:
                style === "G01"
                  ? "Editable evidence and data"
                  : "数据趋势与可编辑关系图 / editable evidence",
              style: { fontSize: 33, color: dark ? "#ffffff" : "#28323b" },
            },
          ),
          obj(
            "chart",
            "chart",
            { x: 90, y: 365, w: 760, h: 490 },
            {
              chartType: "bar",
              categories: ["2024", "2025", "2026"],
              series: [{ name: "增长 Growth", values: [3, 5, 9] }],
            },
          ),
          obj(
            "diagram",
            "diagram",
            { x: 970, y: 345, w: 790, h: 510 },
            {
              nodes: [
                {
                  id: "a",
                  label: style === "G01" ? "Input" : "输入 Input",
                  x: 3,
                  y: 35,
                  w: 28,
                },
                {
                  id: "b",
                  label: style === "G01" ? "Output" : "输出 Output",
                  x: 65,
                  y: 35,
                  w: 30,
                },
              ],
              edges: [{ from: "a", to: "b" }],
            },
          ),
        ],
      },
      {
        id: "page-2",
        title: "Objects",
        layout: "absolute",
        notes: "Second page notes",
        objects: [
          obj(
            "code",
            "code",
            { x: 90, y: 80, w: 770, h: 170 },
            {
              text: 'def hello():\n    return "世界"',
              style: { fontSize: 34, color: dark ? "#ffffff" : "#28323b" },
            },
          ),
          obj(
            "formula",
            "formula",
            { x: 970, y: 80, w: 700, h: 120 },
            {
              text: "E = mc^2",
              style: { fontSize: 54, color: dark ? "#ffffff" : "#28323b" },
            },
          ),
          obj(
            "table",
            "table",
            { x: 90, y: 350, w: 740, h: 330 },
            {
              rows: [
                ["项目 Item", "数值 Value"],
                ["A", "42"],
                ["B", "68"],
              ],
            },
          ),
          obj(
            "image",
            "image",
            { x: 1030, y: 330, w: 550, h: 360 },
            { resourceId: "art", alt: "Abstract art" },
          ),
          obj(
            "shape",
            "shape",
            { x: 90, y: 790, w: 170, h: 100 },
            { fill: "#49d6d0", shape: "ellipse" },
          ),
          obj(
            "connector",
            "connector",
            { x: 330, y: 800, w: 450, h: 100 },
            { from: { x: 0, y: 50 }, to: { x: 100, y: 50 } },
          ),
        ],
      },
    ],
  };
}

test("skill build, browser edit and native export across two styles", async () => {
  let browser;
  try {
    browser = await chromium.launch({ headless: true });
  } catch {
    browser = await chromium.launch({ headless: true, channel: "msedge" });
  }
  try {
    for (const [style, language] of [
      ["A01", "zh-CN"],
      ["G01", "en"],
    ]) {
      const source = join(dir, style + ".json"),
        html = join(dir, style + ".html"),
        pptx = join(dir, style + ".pptx"),
        pdf = join(dir, style + ".pdf");
      writeFileSync(source, JSON.stringify(model(style, language)));
      run("build-deck.js", [source, html]);
      const page = await browser.newPage({
        viewport: { width: 1920, height: 1080 },
      });
      await page.goto("file:///" + html.replaceAll("\\", "/"));
      await page.locator("#ans-edit").click();
      await page.locator("#ans-ui-language").selectOption("en");
      assert.equal(await page.locator("#ans-pages button").count(), 2);
      await page
        .locator("#ans-layers button")
        .filter({ hasText: "text" })
        .last()
        .click();
      const content = page.locator("#ans-props textarea").first();
      await content.fill("已编辑 Edited · " + style);
      await content.dispatchEvent("change");
      assert.equal(
        await page.locator(".slide.is-active .ans-text").first().textContent(),
        "已编辑 Edited · " + style,
      );
      await page.locator("#ans-undo").click();
      assert.notEqual(
        await page.locator(".slide.is-active .ans-text").first().textContent(),
        "已编辑 Edited · " + style,
      );
      await page.locator("#ans-redo").click();
      assert.equal(
        await page.locator(".slide.is-active .ans-text").first().textContent(),
        "已编辑 Edited · " + style,
      );
      const snapshot = await page.evaluate(() => ANSWorkbench.serialize());
      writeFileSync(html, snapshot);
      await page.close();
      const reopened = await browser.newPage({
        viewport: { width: 1920, height: 1080 },
      });
      await reopened.goto("file:///" + html.replaceAll("\\", "/"));
      assert.equal(
        await reopened
          .locator(".slide.is-active .ans-text")
          .first()
          .textContent(),
        "已编辑 Edited · " + style,
      );
      assert.equal(
        await reopened.evaluate(() => ANSWorkbench.document.pages[0].notes),
        "中文备注 and English speaker notes",
      );
      await reopened.close();
      run("export-pptx.js", [html, pptx]);
      run("export-pdf.js", [html, pdf]);
      assert.ok(existsSync(pptx) && existsSync(pdf));
      const zip = await JSZip.loadAsync(readFileSync(pptx));
      const slide1 = await zip.file("ppt/slides/slide1.xml").async("string");
      const slide2 = await zip.file("ppt/slides/slide2.xml").async("string");
      assert.match(slide1, /已编辑 Edited/);
      assert.match(slide1, /<c:chart/);
      assert.match(slide2, /<a:tbl>/);
      assert.match(slide2, /<p:cxnSp>/);
      assert.match(slide2, /<p:pic>/);
      assert.match(slide2, /E = mc\^2/);
      assert.ok(zip.file("ppt/notesSlides/notesSlide1.xml"));
      assert.ok(zip.file("ppt/embeddings/Microsoft_Excel_Worksheet1.xlsx"));
      const manifest = JSON.parse(readFileSync(pptx + ".manifest.json"));
      assert.equal(manifest.pages[0].id, "page-1");
      assert.equal(
        manifest.inputSha256,
        createHash("sha256").update(readFileSync(html)).digest("hex"),
      );
    }
  } finally {
    await browser.close();
  }
});

test("direct save, conflict guard, and download fallback", async () => {
  const src = join(dir, "file.json"),
    html = join(dir, "file.html");
  writeFileSync(src, JSON.stringify(model("A01", "zh-CN")));
  run("build-deck.js", [src, html]);
  const browser = await launchChromium();
  try {
    const page = await browser.newPage({ acceptDownloads: true });
    await page.goto("file:///" + html.replaceAll("\\", "/"));
    await page.evaluate(() => {
      window.__disk = document.documentElement.outerHTML;
      const h = {
        kind: "file",
        name: "file.html",
        getFile: async () => ({ text: async () => window.__disk }),
        createWritable: async () => ({
          write: async (s) => {
            window.__pending = s;
          },
          close: async () => {
            window.__disk = window.__pending;
          },
        }),
      };
      Object.defineProperty(window, "showSaveFilePicker", {
        configurable: true,
        value: async () => h,
      });
    });
    await page.locator("#ans-edit").click();
    await page.locator("#ans-ui-language").selectOption("en");
    await page
      .locator("#ans-layers button")
      .filter({ hasText: "text" })
      .last()
      .click();
    await page.locator("#ans-props textarea").first().fill("Saved to disk");
    await page.locator("#ans-saveas").click();
    await assert.doesNotReject(async () =>
      page.waitForFunction(() => window.__disk.includes("Saved to disk")),
    );
    const backup = page.waitForEvent("download");
    await page.locator("#ans-backup").click();
    assert.match((await backup).suggestedFilename(), /backup\.html$/);
    await page
      .locator("#ans-layers button")
      .filter({ hasText: "text" })
      .last()
      .click();
    await page.locator("#ans-props textarea").first().fill("Second edit");
    await page.evaluate(() => (window.__disk += "<!-- external edit -->"));
    await page.keyboard.press("Control+S");
    assert.match(
      await page.locator("#ans-status").textContent(),
      /Disk file changed/,
    );
    await page.evaluate(() =>
      Object.defineProperty(window, "showSaveFilePicker", {
        configurable: true,
        value: undefined,
      }),
    );
    const download = page.waitForEvent("download");
    await page.locator("#ans-saveas").click();
    assert.match((await download).suggestedFilename(), /\.html$/);
  } finally {
    await browser.close();
  }
});

test("helper exports unsaved browser snapshot and records matching input hash", async () => {
  const src = join(dir, "helper.json"),
    html = join(dir, "helper.html");
  writeFileSync(src, JSON.stringify(model("G01", "en")));
  run("build-deck.js", [src, html]);
  const browser = await launchChromium(),
    helper = spawn(
      process.execPath,
      [resolve(root, "scripts/export-helper.js")],
      { windowsHide: true },
    );
  try {
    let token = "";
    await new Promise((resolve, reject) => {
      helper.stdout.on("data", (chunk) => {
        const m = String(chunk).match(/Workbench token: ([a-f0-9]+)/);
        if (m) {
          token = m[1];
          resolve();
        }
      });
      helper.on("error", reject);
      setTimeout(() => reject(Error("Helper startup timeout")), 6000);
    });
    const page = await browser.newPage();
    await page.goto("file:///" + html.replaceAll("\\", "/"));
    await page.locator("#ans-edit").click();
    await page.locator("#ans-ui-language").selectOption("en");
    await page
      .locator("#ans-layers button")
      .filter({ hasText: "text" })
      .last()
      .click();
    await page
      .locator("#ans-props textarea")
      .first()
      .fill("UNSAVED HELPER SNAPSHOT");
    await page.locator("#ans-props textarea").first().dispatchEvent("change");
    const snap = await page.evaluate(() => ANSWorkbench.serialize()),
      sha = createHash("sha256").update(snap).digest("hex");
    const r = await fetch("http://127.0.0.1:8765/export", {
      method: "POST",
      headers: { "x-ans-token": token, "content-type": "application/json" },
      body: JSON.stringify({ html: snap, sha256: sha, mode: "editable" }),
    });
    assert.equal(r.status, 202);
    const { id } = await r.json();
    let task;
    for (let i = 0; i < 60; i++) {
      await new Promise((r) => setTimeout(r, 300));
      task = await (
        await fetch("http://127.0.0.1:8765/task/" + id, {
          headers: { "x-ans-token": token },
        })
      ).json();
      if (task.state === "done" || task.state === "failed") break;
    }
    assert.equal(task.state, "done", task.error);
    assert.equal(task.sha256, sha);
    const data = Buffer.from(
      await (
        await fetch("http://127.0.0.1:8765/result/" + id, {
          headers: { "x-ans-token": token },
        })
      ).arrayBuffer(),
    );
    const zip = await JSZip.loadAsync(data);
    assert.match(
      await zip.file("ppt/slides/slide1.xml").async("string"),
      /UNSAVED HELPER SNAPSHOT/,
    );
    const manifest = await (
      await fetch("http://127.0.0.1:8765/manifest/" + id, {
        headers: { "x-ans-token": token },
      })
    ).json();
    assert.equal(manifest.inputSha256, sha);
    for (const mode of ["pdf", "image"]) {
      const request = await fetch("http://127.0.0.1:8765/export", {
        method: "POST",
        headers: { "x-ans-token": token, "content-type": "application/json" },
        body: JSON.stringify({ html: snap, sha256: sha, mode }),
      });
      assert.equal(request.status, 202);
      const job = await request.json();
      let result;
      for (let i = 0; i < 60; i++) {
        await new Promise((r) => setTimeout(r, 300));
        result = await (
          await fetch("http://127.0.0.1:8765/task/" + job.id, {
            headers: { "x-ans-token": token },
          })
        ).json();
        if (result.state === "done" || result.state === "failed") break;
      }
      assert.equal(result.state, "done", result.error);
      assert.equal(result.sha256, sha);
      const body = Buffer.from(
        await (
          await fetch("http://127.0.0.1:8765/result/" + job.id, {
            headers: { "x-ans-token": token },
          })
        ).arrayBuffer(),
      );
      if (mode === "pdf") assert.equal(body.subarray(0, 4).toString(), "%PDF");
      else {
        const imgZip = await JSZip.loadAsync(body);
        assert.match(
          await imgZip.file("ppt/slides/slide1.xml").async("string"),
          /<p:pic>/,
        );
      }
    }
    await page.close();
  } finally {
    helper.kill();
    await browser.close();
  }
});

test("overview, theme, presenter, visual reopen, draft recovery, and explicit image PPTX", async () => {
  const src = join(dir, "visual.json"),
    html = join(dir, "visual.html"),
    imagePptx = join(dir, "visual.image.pptx");
  const doc = model("A01", "zh-CN");
  doc.theme.variants = [
    {
      id: "warm",
      label: "Warm",
      css: ":root{--color-bg:#543a29;--color-body:#fff4e2}.slide{background:#543a29!important}",
    },
  ];
  writeFileSync(src, JSON.stringify(doc));
  run("build-deck.js", [src, html]);
  const browser = await launchChromium();
  try {
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });
    const page = await context.newPage();
    await page.goto("file:///" + html.replaceAll("\\", "/"));
    await page.locator("#ans-edit").click();
    await page.locator("#ans-ui-language").selectOption("en");
    await page.screenshot({ path: join(dir, "workbench.png") });
    await page.locator("#ans-theme").selectOption("warm");
    await page.locator("#ans-overview").click();
    assert.equal(await page.locator(".ans-overview-tile").count(), 2);
    await page.locator(".ans-close").click();
    await page
      .locator("#ans-layers button")
      .filter({ hasText: "text" })
      .last()
      .click();
    await page
      .locator("#ans-props textarea")
      .first()
      .fill("Visual and draft check");
    await page.locator("#ans-props textarea").first().dispatchEvent("change");
    await page.waitForTimeout(1100);
    const saved = await page.evaluate(() => ANSWorkbench.serialize());
    await page.locator("#ans-present").click();
    const before = await page
      .locator("#ans-stage > .slide.is-active")
      .screenshot();
    await page.close();
    const recovered = await context.newPage();
    await recovered.goto("file:///" + html.replaceAll("\\", "/"));
    await recovered.locator("#ans-edit").click();
    recovered.once("dialog", (d) => d.accept());
    await recovered.locator("#ans-restore").click();
    await recovered.waitForFunction(
      () =>
        ANSWorkbench.document.pages[0].objects[0].text ===
        "Visual and draft check",
    );
    await recovered.close();
    writeFileSync(html, saved);
    const reopened = await context.newPage();
    await reopened.goto("file:///" + html.replaceAll("\\", "/"));
    assert.equal(
      await reopened.evaluate(() => ANSWorkbench.document.theme.active),
      "warm",
    );
    await reopened.evaluate(() => ANSWorkbench.setEditing(false));
    const after = await reopened
      .locator("#ans-stage > .slide.is-active")
      .screenshot();
    writeFileSync(join(dir, "before.png"), before);
    writeFileSync(join(dir, "after.png"), after);
    assert.equal(
      createHash("sha256").update(after).digest("hex"),
      createHash("sha256").update(before).digest("hex"),
      "slide pixels should match after save and reopen",
    );
    await reopened.keyboard.press("p");
    assert.equal(
      await reopened.locator("#ans-speaker-panel").isVisible(),
      true,
    );
    await reopened.locator("#ans-speaker-close").click();
    await reopened.close();
    run("export-pptx.js", [html, imagePptx, "--image"]);
    const zip = await JSZip.loadAsync(readFileSync(imagePptx));
    const slide = await zip.file("ppt/slides/slide1.xml").async("string");
    assert.match(slide, /<p:pic>/);
    assert.doesNotMatch(slide, /<c:chart/);
    const imageManifest = JSON.parse(
      readFileSync(imagePptx + ".manifest.json", "utf8"),
    );
    assert.equal(
      imageManifest.inputSha256,
      createHash("sha256").update(readFileSync(html)).digest("hex"),
    );
  } finally {
    await browser.close();
  }
});

test("flex/grid objects, grouping, and unsupported adapter gate", async () => {
  const d = model("G01", "en");
  d.pages = [
    {
      id: "flex-page",
      title: "Flex",
      layout: "flex",
      notes: "Flex notes",
      objects: [
        {
          id: "flex-a",
          type: "text",
          text: "First",
          order: 1,
          style: { fontSize: 44, color: "#28323b" },
        },
        {
          id: "flex-b",
          type: "text",
          text: "Second",
          order: 2,
          style: { fontSize: 44, color: "#28323b" },
        },
      ],
    },
    {
      id: "grid-page",
      title: "Grid",
      layout: "grid",
      columns: "1fr 1fr",
      notes: "Grid notes",
      objects: [
        {
          id: "grid-a",
          type: "text",
          text: "左 Left",
          style: { fontSize: 44, color: "#28323b" },
        },
        {
          id: "grid-b",
          type: "text",
          text: "右 Right",
          style: { fontSize: 44, color: "#28323b" },
        },
      ],
    },
  ];
  const src = join(dir, "flow.json"),
    html = join(dir, "flow.html"),
    pptx = join(dir, "flow.pptx");
  writeFileSync(src, JSON.stringify(d));
  run("build-deck.js", [src, html]);
  const first = readFileSync(html);
  run("build-deck.js", [src, html]);
  assert.deepEqual(readFileSync(html), first, "packaging is repeatable");
  const browser = await launchChromium();
  try {
    const page = await browser.newPage();
    await page.goto("file:///" + html.replaceAll("\\", "/"));
    await page.locator("#ans-edit").click();
    await page.locator("#ans-ui-language").selectOption("en");
    const layers = page.locator("#ans-layers button");
    await layers.first().click();
    await layers.last().click({ modifiers: ["Shift"] });
    await page.getByRole("button", { name: "Group selected" }).click();
    const grouped = await page.evaluate(() =>
      ANSWorkbench.document.pages[0].objects.map((o) => o.group),
    );
    assert.equal(grouped[0], grouped[1]);
    await page.locator("#ans-pages button").nth(1).click();
    assert.equal(
      await page
        .locator("#ans-stage > .slide.is-active")
        .evaluate((n) => getComputedStyle(n).display),
      "grid",
    );
    const serialized = await page.evaluate(() => ANSWorkbench.serialize());
    assert.match(serialized, /<style id="ans-theme-style"><\/style>/);
    writeFileSync(html, serialized);
    await page.close();
  } finally {
    await browser.close();
  }
  run("export-pptx.js", [html, pptx]);
  const zip = await JSZip.loadAsync(readFileSync(pptx));
  assert.match(
    await zip.file("ppt/slides/slide2.xml").async("string"),
    /左 Left/,
  );
  d.pages[0].objects[0].type = "unknown-content";
  writeFileSync(src, JSON.stringify(d));
  const rejected = spawnSync(
    process.execPath,
    [resolve(root, "scripts/build-deck.js"), src, html],
    { encoding: "utf8" },
  );
  assert.notEqual(rejected.status, 0);
  assert.match(rejected.stderr, /no editor\/export adapter/);
});

test("every content adapter edits, saves, and reopens its source", async () => {
  const source = join(dir, "adapters.json");
  const html = join(dir, "adapters.html");
  writeFileSync(source, JSON.stringify(model("A01", "zh-CN")));
  run("build-deck.js", [source, html]);
  const browser = await launchChromium();
  try {
    const page = await browser.newPage();
    await page.goto("file:///" + html.replaceAll("\\", "/"));
    await page.locator("#ans-edit").click();
    await page.locator("#ans-ui-language").selectOption("en");
    const choose = (type) =>
      page
        .locator("#ans-layers button")
        .filter({ hasText: new RegExp(`^${type} ·`) })
        .first()
        .click();
    const change = async (label, value) => {
      const field = page.locator(".ans-field").filter({ hasText: label });
      const advanced = field.locator("xpath=ancestor::details[1]");
      if (await advanced.count()) await advanced.locator("summary").click();
      const input = field.locator("input,textarea").first();
      await input.fill(value);
      await input.dispatchEvent("change");
    };
    await choose("chart");
    await change(
      "Series JSON",
      JSON.stringify([{ name: "Growth", values: [4, 6, 10] }]),
    );
    await choose("diagram");
    await change(
      "Nodes / edges JSON",
      JSON.stringify({
        nodes: [
          { id: "a", label: "输入 Input", x: 3, y: 35, w: 28 },
          { id: "b", label: "输出 Output", x: 65, y: 35, w: 30 },
          { id: "c", label: "检查 Check", x: 35, y: 65, w: 25 },
        ],
        edges: [
          { from: "a", to: "b" },
          { from: "a", to: "c" },
        ],
      }),
    );
    await page.locator("#ans-pages button").nth(1).click();
    await choose("code");
    await change("Content", "print('editable')");
    await choose("formula");
    await change("LaTeX source", "a^2+b^2=c^2");
    await choose("table");
    await change("Rows (TSV)", "Name\tValue\nA\t99");
    await choose("shape");
    await change("Fill", "#123456");
    await choose("connector");
    await change("from.x", "12");
    await choose("image");
    await page.locator("#ans-props input[type=file]").setInputFiles({
      name: "replacement.svg",
      mimeType: "image/svg+xml",
      buffer: Buffer.from(
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"><rect width="20" height="20" fill="red"/></svg>',
      ),
    });
    await page.locator("#ans-notes").fill("Edited speaker notes");
    await page.locator("#ans-notes").dispatchEvent("change");
    await page.locator("#ans-up").click();
    assert.equal(
      await page.evaluate(() => ANSWorkbench.document.pages[0].id),
      "page-2",
    );
    await page.locator("#ans-down").click();
    writeFileSync(html, await page.evaluate(() => ANSWorkbench.serialize()));
    await page.close();
    const reopened = await browser.newPage();
    await reopened.goto("file:///" + html.replaceAll("\\", "/"));
    const saved = await reopened.evaluate(() => ANSWorkbench.document);
    assert.deepEqual(
      saved.pages.map((p) => p.id),
      ["page-1", "page-2"],
    );
    assert.deepEqual(
      saved.pages[0].objects.find((o) => o.id === "chart").series[0].values,
      [4, 6, 10],
    );
    assert.equal(
      saved.pages[0].objects.find((o) => o.id === "diagram").nodes.length,
      3,
    );
    assert.equal(
      saved.pages[1].objects.find((o) => o.id === "code").text,
      "print('editable')",
    );
    assert.equal(
      saved.pages[1].objects.find((o) => o.id === "formula").text,
      "a^2+b^2=c^2",
    );
    assert.deepEqual(
      saved.pages[1].objects.find((o) => o.id === "table").rows,
      [
        ["Name", "Value"],
        ["A", "99"],
      ],
    );
    assert.equal(
      saved.pages[1].objects.find((o) => o.id === "shape").fill,
      "#123456",
    );
    assert.equal(
      saved.pages[1].objects.find((o) => o.id === "connector").from.x,
      12,
    );
    assert.match(
      saved.resources[
        saved.pages[1].objects.find((o) => o.id === "image").resourceId
      ].data,
      /^data:image\/svg\+xml;base64,/,
    );
    assert.equal(saved.pages[1].notes, "Edited speaker notes");
    await reopened.close();
    const extracted = join(dir, "adapters-current.json"),
      rebuilt = join(dir, "adapters-rebuilt.html");
    run("extract-document.js", [html, extracted]);
    assert.deepEqual(JSON.parse(readFileSync(extracted, "utf8")), saved);
    run("build-deck.js", [extracted, rebuilt]);
    assert.equal(
      (readFileSync(rebuilt, "utf8").match(/id="ans-shell"/g) || []).length,
      1,
    );
  } finally {
    await browser.close();
  }
});

test("reveal steps advance before pages and exports see the final state", async () => {
  const doc = model("A01", "zh-CN");
  doc.pages[0].objects[0].step = 1;
  doc.pages[0].objects[1].step = 2;
  const source = join(dir, "steps.json"),
    html = join(dir, "steps.html");
  writeFileSync(source, JSON.stringify(doc));
  run("build-deck.js", [source, html]);
  const browser = await launchChromium();
  try {
    const page = await browser.newPage();
    await page.goto("file:///" + html.replaceAll("\\", "/"));
    assert.equal(
      await page
        .locator('[data-object-id="heading"]')
        .evaluate((n) => getComputedStyle(n).opacity),
      "0",
    );
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.evaluate(() => window.__currentSlide), 1);
    assert.equal(
      await page
        .locator('[data-object-id="heading"]')
        .evaluate((n) => getComputedStyle(n).opacity),
      "1",
    );
    await page.keyboard.press("ArrowRight");
    assert.equal(
      await page
        .locator('[data-object-id="body"]')
        .evaluate((n) => getComputedStyle(n).opacity),
      "1",
    );
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.evaluate(() => window.__currentSlide), 2);
    await page.evaluate(() => window.__goToSlide(1));
    assert.equal(
      await page
        .locator('[data-object-id="body"]')
        .evaluate((n) => getComputedStyle(n).opacity),
      "1",
    );
    await page.close();
  } finally {
    await browser.close();
  }
});

test("diagram edges use stage geometry and local theme assets survive reopen", async () => {
  const source = join(dir, "geometry.json"),
    html = join(dir, "geometry.html");
  writeFileSync(
    join(dir, "decor.png"),
    Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9K+woAAAAASUVORK5CYII=",
      "base64",
    ),
  );
  const d = model("A01", "en");
  d.theme.css =
    ':root{--color-bg:#0d1e29}.slide{background-image:url("decor.png")}';
  d.theme.active = "alt";
  d.theme.variants = [
    { id: "alt", label: "Alt", css: ":root{--color-accent:#ffffff}" },
  ];
  const graph = d.pages[0].objects.find((o) => o.id === "diagram");
  graph.box = { x: 100, y: 400, w: 500, h: 200 };
  graph.nodes = [
    { id: "a", label: "A", x: 20, y: 10, w: 20, h: 20 },
    { id: "b", label: "B", x: 20, y: 70, w: 20, h: 20 },
  ];
  graph.edges = [{ from: "a", to: "b" }];
  writeFileSync(source, JSON.stringify(d));
  run("build-deck.js", [source, html]);
  const browser = await launchChromium();
  try {
    const page = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
    });
    await page.goto("file:///" + html.replaceAll("\\", "/"));
    const height = await page
      .locator('[data-object-id="diagram"] svg line')
      .evaluate((n) => n.getBoundingClientRect().height);
    assert.ok(
      Math.abs(height - 120) < 4,
      `vertical edge height ${height} should follow the 200px diagram height`,
    );
    assert.match(
      await page.evaluate(() => ANSWorkbench.document.theme.css),
      /data:image\/png;base64,/,
    );
    assert.match(
      await page.locator("#ans-theme-style").textContent(),
      /data:image\/png;base64,/,
    );
    writeFileSync(html, await page.evaluate(() => ANSWorkbench.serialize()));
    await page.close();
    const reopened = await browser.newPage({
      viewport: { width: 1920, height: 1080 },
    });
    await reopened.goto("file:///" + html.replaceAll("\\", "/"));
    assert.match(
      await reopened.locator("#ans-theme-style").textContent(),
      /data:image\/png;base64,/,
    );
    await reopened.close();
  } finally {
    await browser.close();
  }
});
