#!/usr/bin/env node
/** Continue AI work from the user's saved HTML, preserving every edited object. */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { assertDocument, digest } from "./lib/document-model.js";
const [, , input, output] = process.argv;
if (!input || !output) {
  console.error(
    "Usage: node scripts/extract-document.js saved.html current.json",
  );
  process.exit(1);
}
const html = readFileSync(resolve(input), "utf8"),
  m = html.match(
    /<script id="ans-document" type="application\/json">([\s\S]*?)<\/script>/,
  );
if (!m) throw Error("Editable document not found in saved HTML");
const doc = assertDocument(JSON.parse(m[1]));
writeFileSync(resolve(output), JSON.stringify(doc, null, 2));
console.log(
  `Extracted ${doc.pages.length} pages; source SHA256 ${digest(html)}`,
);
