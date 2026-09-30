#!/usr/bin/env node
/** Local link, artwork, and exported-example audit for the GitHub presentation. */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { resolve, dirname, relative, sep } from "node:path";
import { createHash } from "node:crypto";

const root = resolve(import.meta.dirname, "..");
const docs = ["README.md", "README.zh-CN.md", "docs/style-gallery.md", "docs/image-generation.md", "docs/readme/ASSETS.md"];
const errors = [];
let links = 0, images = 0;
function caseExact(file) {
  let dir = root;
  for (const part of relative(root, file).split(sep)) {
    if (part === "..") return false;
    if (!readdirSync(dir).includes(part)) return false;
    dir = resolve(dir, part);
  }
  return true;
}
function verifyPath(source, target, isImage) {
  if (/^(?:https?:|mailto:|#)/i.test(target)) return;
  const pathname = decodeURIComponent(target.split(/[?#]/)[0]);
  if (!pathname) return;
  const file = resolve(dirname(resolve(root, source)), pathname);
  links++;
  if (!existsSync(file) || !caseExact(file)) return errors.push(`${source}: missing or case-mismatched ${target}`);
  if (isImage) {
    images++;
    const b = readFileSync(file);
    if (b[0] !== 0xff || b[1] !== 0xd8 || b[b.length - 2] !== 0xff || b[b.length - 1] !== 0xd9)
      errors.push(`${source}: invalid JPEG ${target}`);
  }
}
for (const file of docs) {
  const md = readFileSync(resolve(root, file), "utf8");
  for (const match of md.matchAll(/!?(?:\[[^\]]*\])\(([^)]+)\)/g)) verifyPath(file, match[1], match[0].startsWith("!"));
  for (const match of md.matchAll(/<img\s+[^>]*src="([^"]+)"/g)) verifyPath(file, match[1], true);
  for (const match of md.matchAll(/<a\s+[^>]*href="([^"]+)"/g)) verifyPath(file, match[1], false);
}
const styles = JSON.parse(readFileSync(resolve(root, "knowledge/style/index.json"), "utf8")).styles;
if (styles.length !== 53) errors.push(`Style index has ${styles.length}, expected 53`);
const gallery = readFileSync(resolve(root, "docs/style-gallery.md"), "utf8");
for (const s of styles) {
  if (!gallery.includes(`readme/styles/${s.id}.jpg`)) errors.push(`Gallery omits ${s.id}`);
  for (const suffix of ["preview.html", "design.md"])
    if (!existsSync(resolve(root, "knowledge/style", s.id, suffix))) errors.push(`${s.id} lacks ${suffix}`);
}
const html = readFileSync(resolve(root, "examples/workflow.html"));
if (!html.includes(Buffer.from('id="ans-document"')) || !html.includes(Buffer.from('id="ans-shell"')))
  errors.push("Standalone example lacks its model or workbench");
if ((html.toString("utf8").match(/<script id="ans-document"/g) || []).length !== 1)
  errors.push("Standalone example has duplicate document injection");
const digest = createHash("sha256").update(html).digest("hex");
for (const mode of ["editable", "image"]) {
  const pptx = resolve(root, `examples/workflow.${mode}.pptx`);
  const manifest = JSON.parse(readFileSync(pptx + ".manifest.json", "utf8"));
  if (manifest.inputSha256 !== digest) errors.push(`${mode} PPTX does not match current HTML hash`);
  if (manifest.source !== "examples/workflow.html") errors.push(`${mode} sample manifest has a non-portable source path`);
  if (!statSync(pptx).size) errors.push(`${mode} PPTX is empty`);
}
if (!statSync(resolve(root, "examples/workflow.pdf")).size) errors.push("PDF is empty");
if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log(`PASS ${links} local links, ${images} JPEG references, ${styles.length} styles, current example/export hashes ${digest}`);
