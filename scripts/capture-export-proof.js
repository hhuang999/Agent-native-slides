#!/usr/bin/env node
/** Create a visual of the two actual PPTX packages, using counts inspected from their OOXML. */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import JSZip from "jszip";
import { launchChromium } from "./lib/browser.js";

const root = resolve(import.meta.dirname, "..");
const artwork = resolve(root, "docs/readme");
async function inspect(name) {
  const zip = await JSZip.loadAsync(readFileSync(resolve(root, `examples/${name}`)));
  const slides = Object.keys(zip.files).filter((p) => /^ppt\/slides\/slide\d+\.xml$/.test(p));
  const xml = (await Promise.all(slides.map((p) => zip.file(p).async("string")))).join("");
  return {
    slides: slides.length,
    shapes: (xml.match(/<p:sp>/g) || []).length,
    pictures: (xml.match(/<p:pic>/g) || []).length,
    charts: Object.keys(zip.files).filter((p) => /^ppt\/charts\/chart\d+\.xml$/.test(p)).length,
    workbooks: Object.keys(zip.files).filter((p) => /^ppt\/embeddings\/.*\.xlsx$/.test(p)).length,
    notes: Object.keys(zip.files).filter((p) => /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(p)).length,
    connectors: (xml.match(/<p:cxnSp>/g) || []).length,
  };
}
const native = await inspect("workflow.editable.pptx");
const image = await inspect("workflow.image.pptx");
if (!(native.charts && native.workbooks && native.notes && native.shapes && native.connectors)) throw Error("Native PPTX structure missing");
if (image.shapes || image.charts || image.pictures !== image.slides) throw Error("Image PPTX structure changed");
const screenshot = `data:image/jpeg;base64,${readFileSync(resolve(artwork, "presentation.jpg")).toString("base64")}`;
const html = `<!doctype html><meta charset="utf-8"><style>*{box-sizing:border-box}html,body{margin:0;background:#08131a;color:#eaf5f4;font-family:Arial,sans-serif}.wrap{width:1600px;height:760px;padding:48px 58px;background:radial-gradient(circle at 80% 0%,#143c44,#08131a 56%)}.eyebrow{font:700 17px Consolas,monospace;color:#5bd8d2;letter-spacing:2px}.title{font-size:46px;font-weight:700;margin:12px 0 28px;letter-spacing:-1.5px}.cols{display:grid;grid-template-columns:1fr 1fr;gap:22px}.card{border:1px solid #35535b;border-radius:13px;background:#10232c;overflow:hidden}.card.native{border-color:#58c9c4}.top{display:flex;align-items:center;justify-content:space-between;padding:21px 26px;border-bottom:1px solid #35535b}.top strong{font-size:25px}.tag{font:700 13px Consolas,monospace;border-radius:20px;padding:8px 12px;color:#07151a;background:#5bd8d2}.image .tag{color:#d7e4e6;background:#34505a}.preview{height:282px;background:#07141b;padding:18px}.preview img{width:100%;height:100%;object-fit:cover;border-radius:5px}.metrics{display:flex;gap:13px;padding:24px 25px}.metric{flex:1}.metric b{display:block;font-size:38px;color:#65dfd8}.metric span{font:15px Consolas,monospace;color:#9bb7bb}.note{padding:0 26px 25px;color:#b0c8ca;font-size:18px}.foot{color:#82a3a9;font:15px Consolas,monospace;margin-top:20px}</style><div class="wrap"><div class="eyebrow">ACTUAL EXPORTS / OOXML INSPECTION</div><div class="title">Same deck. Different PowerPoint structures.</div><div class="cols"><div class="card native"><div class="top"><strong>Editable PPTX</strong><span class="tag">DEFAULT</span></div><div class="preview"><img src="${screenshot}"></div><div class="metrics"><div class="metric"><b>${native.shapes}</b><span>text + shapes</span></div><div class="metric"><b>${native.charts}</b><span>native chart</span></div><div class="metric"><b>${native.workbooks}</b><span>data workbook</span></div><div class="metric"><b>${native.notes}</b><span>notes pages</span></div></div><div class="note">Includes ${native.connectors} editable connectors and a separate static decorative background.</div></div><div class="card image"><div class="top"><strong>Image PPTX</strong><span class="tag">FIDELITY OPTION</span></div><div class="preview"><img src="${screenshot}"></div><div class="metrics"><div class="metric"><b>${image.pictures}</b><span>slide pictures</span></div><div class="metric"><b>${image.shapes}</b><span>native shapes</span></div><div class="metric"><b>${image.charts}</b><span>native charts</span></div><div class="metric"><b>${image.slides}</b><span>slides</span></div></div><div class="note">One full-slide picture per page; contents are not element-level editable.</div></div></div><div class="foot">Preview image is the same source HTML slide. Counts come from the generated PPTX packages.</div></div>`;
const browser = await launchChromium();
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 760 }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  await page.screenshot({ path: resolve(artwork, "exports-current.jpg"), type: "jpeg", quality: 90 });
} finally { await browser.close(); }
writeFileSync(resolve(artwork, "exports-current.json"), JSON.stringify({ native, image }, null, 2) + "\n");
console.log(JSON.stringify({ native, image }));
