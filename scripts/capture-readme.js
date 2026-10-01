#!/usr/bin/env node
/** Regenerate README artwork from the current browser runtime and live previews. */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { launchChromium, toFileUrl } from "./lib/browser.js";

const root = resolve(import.meta.dirname, "..");
const artwork = resolve(root, "docs/readme");
const styles = JSON.parse(
  readFileSync(resolve(root, "knowledge/style/index.json"), "utf8"),
).styles;
const browser = await launchChromium();
const context = await browser.newContext({
  viewport: { width: 640, height: 360 },
  deviceScaleFactor: 1,
  reducedMotion: "reduce",
});
const page = await context.newPage();

const dataUrl = (buffer) =>
  `data:image/jpeg;base64,${buffer.toString("base64")}`;
const safe = (s) =>
  s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
async function poster(html, width, height, file, quality = 88) {
  const artPage = await context.newPage({ viewport: { width, height } });
  await artPage.setViewportSize({ width, height });
  await artPage.setContent(html, { waitUntil: "load" });
  await artPage.screenshot({
    path: resolve(artwork, file),
    type: "jpeg",
    quality,
  });
  await artPage.close();
}
async function ready() {
  await page.locator(".slide.is-active").first().waitFor({ timeout: 10000 });
  await page.evaluate(() =>
    Promise.race([
      document.fonts.ready,
      new Promise((r) => setTimeout(r, 1400)),
    ]),
  );
  await page.waitForTimeout(120);
}

try {
  mkdirSync(resolve(artwork, "styles"), { recursive: true });
  const covers = [];
  const list = process.argv.includes("--showcase-only")
    ? []
    : process.argv.includes("--quick")
      ? styles.filter((s) => ["A01", "F03"].includes(s.id))
      : styles;
  for (const s of list) {
    await page.goto(
      toFileUrl(
        resolve(root, `knowledge/style/${s.id}/preview.html`),
        "?preview=1",
      ),
      { waitUntil: "domcontentloaded" },
    );
    await ready();
    const frames = [];
    for (let n = 1; n <= 3; n++) {
      if (n > 1) {
        await page.evaluate((index) => window.__goToSlide(index), n);
        await page.waitForTimeout(100);
      }
      frames.push(
        dataUrl(await page.screenshot({ type: "jpeg", quality: 88 })),
      );
    }
    covers.push({ ...s, image: frames[0] });
    const strip = `<!doctype html><style>*{box-sizing:border-box}html,body{margin:0;background:#081018}main{display:flex;gap:6px}img{width:640px;height:360px;object-fit:cover}</style><main>${frames.map((f) => `<img src="${f}">`).join("")}</main>`;
    await poster(strip, 1932, 360, `styles/${s.id}.jpg`, 88);
    console.log(`${s.id} ${s.name}: 3 current-browser frames`);
  }
  if (process.argv.includes("--quick")) {
    await browser.close();
    process.exit(0);
  }

  if (covers.length) {
    const tileW = 292,
      tileH = 196,
      columns = 6,
      rows = Math.ceil(covers.length / columns);
    const overview = `<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;background:#081018;color:#dce9ea;font:14px Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(${columns},${tileW}px);gap:13px;padding:20px}.tile{width:${tileW}px;height:${tileH}px}.tile img{width:${tileW}px;height:164px;object-fit:cover;border:1px solid #31515b;border-radius:7px}.label{display:flex;gap:8px;padding-top:6px;white-space:nowrap;overflow:hidden}.label b{color:#62ded8;font:700 13px Consolas,monospace}.label span{color:#9bb4b9;font-size:12px}</style><div class="grid">${covers.map((s) => `<div class="tile"><img src="${s.image}"><div class="label"><b>${s.id}</b><span>${safe(s.name)}</span></div></div>`).join("")}</div>`;
    await poster(
      overview,
      columns * tileW + (columns - 1) * 13 + 40,
      rows * tileH + (rows - 1) * 13 + 40,
      "styles-overview.jpg",
      87,
    );
  }

  await page.setViewportSize({ width: 1920, height: 1080 });
  const example = resolve(root, "examples/workflow.html");
  await page.goto(toFileUrl(example, "?preview=1"), {
    waitUntil: "domcontentloaded",
  });
  await ready();
  const slide = dataUrl(await page.screenshot({ type: "jpeg", quality: 92 }));
  await page.goto(toFileUrl(example, "?preview=3"), {
    waitUntil: "domcontentloaded",
  });
  await ready();
  await page.screenshot({
    path: resolve(artwork, "collaboration.jpg"),
    type: "jpeg",
    quality: 91,
  });
  await page.goto(toFileUrl(example, "?edit=1"), {
    waitUntil: "domcontentloaded",
  });
  await page.locator("#ans-shell").waitFor({ state: "visible" });
  await page.locator("#ans-pages .ans-page").nth(1).click();
  await page
    .locator("#ans-layers .ans-layer")
    .filter({ hasText: /^图表 · evidence/ })
    .click();
  await page.waitForTimeout(200);
  const workbench = dataUrl(
    await page.screenshot({ type: "jpeg", quality: 90 }),
  );
  writeFileSync(
    resolve(artwork, "workbench.jpg"),
    Buffer.from(workbench.split(",")[1], "base64"),
  );

  await page.goto(toFileUrl(example, "?preview=2"), {
    waitUntil: "domcontentloaded",
  });
  await ready();
  await page.screenshot({
    path: resolve(artwork, "presentation.jpg"),
    type: "jpeg",
    quality: 91,
  });
  await page.goto(toFileUrl(example), { waitUntil: "domcontentloaded" });
  await ready();
  await page.keyboard.press("p");
  await page.locator("#ans-speaker-panel").waitFor({ state: "visible" });
  await page.screenshot({
    path: resolve(artwork, "presenter-current.jpg"),
    type: "jpeg",
    quality: 90,
    clip: { x: 0, y: 0, width: 1560, height: 575 },
  });
  await page.locator("#ans-speaker-close").click();
  await page.keyboard.press("o");
  await page.locator("#ans-overview-panel").waitFor({ state: "visible" });
  await page.screenshot({
    path: resolve(artwork, "overview-current.jpg"),
    type: "jpeg",
    quality: 90,
    clip: { x: 0, y: 0, width: 1480, height: 440 },
  });

  const hero = `<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;background:#071219;color:#eaf7f5;font-family:Arial,sans-serif}.frame{position:relative;width:1600px;height:810px;padding:52px 64px;background:radial-gradient(circle at 82% 22%,#153943,#071219 61%)}.eyebrow{color:#61dcd4;font:700 16px Consolas,monospace;letter-spacing:3px}.title{font-size:47px;font-weight:700;letter-spacing:-2px;margin:14px 0 30px}.slide{width:1140px;height:641px;object-fit:cover;border:1px solid #40636b;border-radius:12px;box-shadow:0 30px 80px #0009}.editor{position:absolute;right:52px;bottom:58px;width:625px;height:352px;object-fit:cover;border:2px solid #5ccfc9;border-radius:11px;box-shadow:0 26px 60px #000c}.caption{position:absolute;left:64px;bottom:23px;color:#8baeb3;font:14px Consolas,monospace;letter-spacing:1px}</style><div class="frame"><div class="eyebrow">AGENT-NATIVE SLIDES</div><div class="title">The deck is the workspace.</div><img class="slide" src="${slide}"><img class="editor" src="${workbench}"><div class="caption">REAL BROWSER CAPTURES · STANDALONE HTML + EMBEDDED EDITOR</div></div>`;
  await poster(hero, 1600, 810, "hero-current.jpg", 91);
  console.log(
    "Captured workbench, presentation, presenter, overview and hero from examples/workflow.html",
  );
} finally {
  await browser.close();
}
