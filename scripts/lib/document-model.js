import { randomUUID, createHash } from "node:crypto";

export const VERSION = 1;
export const CONTENT_TYPES = new Set([
  "text",
  "code",
  "formula",
  "image",
  "shape",
  "connector",
  "diagram",
  "table",
  "chart",
]);
export const uid = () => randomUUID();
export const digest = (value) =>
  createHash("sha256")
    .update(typeof value === "string" ? value : JSON.stringify(value))
    .digest("hex");

export function validateDocument(doc) {
  const errors = [];
  const bad = (path, message) => errors.push(`${path}: ${message}`);
  if (!doc || typeof doc !== "object") return ["document: object required"];
  if (doc.version !== VERSION) bad("version", `expected ${VERSION}`);
  if (!doc.id || typeof doc.id !== "string")
    bad("id", "stable string required");
  if (!Array.isArray(doc.pages) || !doc.pages.length)
    bad("pages", "at least one page required");
  const ids = new Set();
  const checkId = (id, path) => {
    if (!id || typeof id !== "string") bad(path, "stable string ID required");
    else if (ids.has(id)) bad(path, `duplicate ID ${id}`);
    else ids.add(id);
  };
  const box = (value, path) => {
    if (!value || ["x", "y", "w", "h"].some((k) => !Number.isFinite(value[k])))
      bad(path, "finite x,y,w,h required");
    else if (value.w <= 0 || value.h <= 0)
      bad(path, "positive width and height required");
  };
  for (const [pi, page] of (doc.pages || []).entries()) {
    const path = `pages[${pi}]`;
    checkId(page.id, `${path}.id`);
    if (!["absolute", "flex", "grid"].includes(page.layout || "absolute"))
      bad(`${path}.layout`, "absolute, flex or grid required");
    if (!Array.isArray(page.objects)) {
      bad(`${path}.objects`, "array required");
      continue;
    }
    for (const [oi, obj] of page.objects.entries()) {
      const p = `${path}.objects[${oi}]`;
      checkId(obj.id, `${p}.id`);
      if (!CONTENT_TYPES.has(obj.type)) {
        bad(`${p}.type`, `no editor/export adapter for ${obj.type}`);
        continue;
      }
      if (
        (page.layout || "absolute") === "absolute" ||
        obj.placement === "absolute"
      )
        box(obj.box, `${p}.box`);
      if (
        ["text", "code", "formula"].includes(obj.type) &&
        typeof obj.text !== "string"
      )
        bad(`${p}.text`, "string required");
      if (
        obj.type === "image" &&
        !/^data:image\//.test(doc.resources?.[obj.resourceId]?.data || "")
      )
        bad(`${p}.resourceId`, "embedded image resource required");
      if (obj.type === "connector" && (!obj.from || !obj.to))
        bad(p, "from and to coordinates required");
      if (
        obj.type === "shape" &&
        !["rect", "ellipse"].includes(obj.shape || "rect")
      )
        bad(`${p}.shape`, "rect or ellipse required");
      if (obj.type === "diagram") {
        if (!Array.isArray(obj.nodes) || !Array.isArray(obj.edges))
          bad(p, "nodes and edges required");
        else {
          const nodes = new Set(obj.nodes.map((n) => n.id));
          for (const e of obj.edges)
            if (!nodes.has(e.from) || !nodes.has(e.to))
              bad(`${p}.edges`, "edge refers to missing node");
        }
      }
      if (
        obj.type === "table" &&
        (!Array.isArray(obj.rows) || !obj.rows.every(Array.isArray))
      )
        bad(p, "rows matrix required");
      if (obj.type === "chart") {
        if (
          !["bar", "line", "pie", "scatter"].includes(obj.chartType) ||
          !Array.isArray(obj.categories) ||
          !Array.isArray(obj.series)
        )
          bad(p, "bar/line/pie/scatter, categories and series required");
        else
          for (const series of obj.series)
            if (
              !Array.isArray(series.values) ||
              series.values.length !== obj.categories.length ||
              series.values.some((v) => !Number.isFinite(Number(v)))
            )
              bad(`${p}.series`, "numeric values required for every category");
      }
      if (obj.animation && !["none", "fade", "rise"].includes(obj.animation))
        bad(`${p}.animation`, "none/fade/rise required");
      if (
        obj.step !== undefined &&
        (!Number.isInteger(obj.step) || obj.step < 0)
      )
        bad(`${p}.step`, "nonnegative integer required");
    }
  }
  return errors;
}

export function assertDocument(doc) {
  const errors = validateDocument(doc);
  if (errors.length)
    throw new Error(`Invalid editable deck:\n${errors.join("\n")}`);
  return doc;
}
