(() => {
  "use strict";
  const source = document.getElementById("ans-document");
  // Capture the packaged shell before language, task, and history UI mutate it.
  // Saves are derived from this stable shell plus the current document model.
  const packagedShell =
    "<!doctype html>\n" + document.documentElement.outerHTML;
  const T = (key, values) => window.ANSI18N.t(key, values);
  let doc = JSON.parse(source.textContent),
    current = 0,
    selected = null,
    selectedIds = new Set(),
    stepIndex = 0,
    editing = false;
  let saved = JSON.stringify(doc),
    history = [],
    future = [],
    fileHandle = null,
    baseline = null,
    busy = false;
  let statusMessage = null,
    helperInfo = null,
    autoTimer = null,
    autoPaused = false;
  const $ = (s) => document.querySelector(s),
    el = (tag, cls, text) => {
      const n = document.createElement(tag);
      if (cls) n.className = cls;
      if (text !== undefined) n.textContent = text;
      return n;
    };
  const clone = (x) => JSON.parse(JSON.stringify(x)),
    id = () => crypto.randomUUID(),
    page = () => doc.pages[current];
  const contentLabel = (zh, en) => (doc.language?.startsWith("zh") ? zh : en);
  const hash = async (s) =>
    Array.from(
      new Uint8Array(
        await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)),
      ),
    )
      .map((x) => x.toString(16).padStart(2, "0"))
      .join("");
  const safe = (s) => String(s ?? "").replace(/<\//g, "<\\/");
  function serialize() {
    const copy = new DOMParser().parseFromString(packagedShell, "text/html");
    copy.querySelector("#ans-document").textContent = safe(JSON.stringify(doc));
    copy.documentElement.classList.remove("ans-editing", "ans-presenting");
    copy.querySelector("#ans-theme-style").textContent = "";
    copy.querySelector("#ans-shell").hidden = true;
    for (const n of copy.querySelectorAll(
      "#ans-overview-panel,#ans-speaker-panel,#ans-blackout",
    ))
      n.hidden = true;
    copy.querySelector("#ans-overview-panel").replaceChildren();
    copy.querySelector("#ans-speaker-current-preview").replaceChildren();
    const stage = copy.querySelector("#ans-stage");
    stage.replaceChildren();
    copy.body.insertBefore(stage, copy.querySelector("#ans-edit"));
    return "<!doctype html>\n" + copy.documentElement.outerHTML;
  }
  function status(message) {
    if (message !== undefined) statusMessage = message;
    $("#ans-status").textContent =
      statusMessage ||
      T(
        JSON.stringify(doc) === saved
          ? "Saved snapshot"
          : "Unsaved changes · browser draft active",
      );
    $("#ans-title").textContent = doc.title || T("Untitled deck");
  }
  function validateCurrent() {
    if (
      doc.version !== 1 ||
      !doc.id ||
      !Array.isArray(doc.pages) ||
      !doc.pages.length
    )
      throw Error("Invalid document model");
    const ids = new Set(),
      types = new Set([
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
    const unique = (value) => {
      if (!value || ids.has(value))
        throw Error(T("Duplicate or missing ID: {id}", { id: value }));
      ids.add(value);
    };
    for (const p of doc.pages) {
      unique(p.id);
      if (
        !["absolute", "flex", "grid"].includes(p.layout || "absolute") ||
        !Array.isArray(p.objects)
      )
        throw Error("Invalid page layout");
      for (const o of p.objects) {
        unique(o.id);
        if (!types.has(o.type))
          throw Error(T("Unknown object type: {type}", { type: o.type }));
        if (p.layout === "absolute" || o.placement === "absolute") {
          if (
            !o.box ||
            ["x", "y", "w", "h"].some((k) => !Number.isFinite(o.box[k])) ||
            o.box.w <= 0 ||
            o.box.h <= 0
          )
            throw Error("Invalid object box");
        }
        if (
          ["text", "code", "formula"].includes(o.type) &&
          typeof o.text !== "string"
        )
          throw Error("Text source required");
        if (
          o.type === "image" &&
          !/^data:image\//.test(doc.resources?.[o.resourceId]?.data || "")
        )
          throw Error("Embedded image required");
        if (
          o.type === "shape" &&
          !["rect", "ellipse"].includes(o.shape || "rect")
        )
          throw Error("Shape must be rect or ellipse");
        if (
          o.type === "connector" &&
          [o.from?.x, o.from?.y, o.to?.x, o.to?.y].some(
            (v) => !Number.isFinite(v),
          )
        )
          throw Error("Connector endpoints must be numeric");
        if (o.type === "diagram") {
          if (!Array.isArray(o.nodes) || !Array.isArray(o.edges))
            throw Error("Diagram nodes and edges required");
          const nodes = new Set();
          for (const n of o.nodes) {
            if (
              !n.id ||
              nodes.has(n.id) ||
              [n.x, n.y, n.w ?? 18, n.h ?? 14].some(
                (v) =>
                  !Number.isFinite(Number(v)) ||
                  Number(v) < 0 ||
                  Number(v) > 100,
              )
            )
              throw Error("Invalid diagram node");
            nodes.add(n.id);
          }
          for (const e of o.edges)
            if (!nodes.has(e.from) || !nodes.has(e.to))
              throw Error("Diagram edge refers to missing node");
        }
        if (
          o.type === "table" &&
          (!Array.isArray(o.rows) ||
            !o.rows.length ||
            !o.rows.every(
              (r) => Array.isArray(r) && r.length === o.rows[0].length,
            ))
        )
          throw Error("Table rows must have equal columns");
        if (o.type === "chart") {
          if (
            !["bar", "line", "pie", "scatter"].includes(o.chartType) ||
            !Array.isArray(o.categories) ||
            !o.categories.length ||
            !Array.isArray(o.series) ||
            !o.series.length
          )
            throw Error("Chart needs type, categories and series");
          for (const s of o.series)
            if (
              !s.name ||
              !Array.isArray(s.values) ||
              s.values.length !== o.categories.length ||
              s.values.some((v) => !Number.isFinite(Number(v)))
            )
              throw Error("Chart values must match categories and be numeric");
        }
        if (o.animation && !["none", "fade", "rise"].includes(o.animation))
          throw Error("Unsupported animation");
        if (o.step !== undefined && (!Number.isInteger(o.step) || o.step < 0))
          throw Error("Nonnegative integer required");
        if (o.order !== undefined && !Number.isFinite(o.order))
          throw Error("Invalid object order");
      }
    }
  }
  function mutate(fn) {
    const before = clone(doc);
    try {
      fn();
      validateCurrent();
    } catch (error) {
      doc = before;
      status(T("Invalid value: {error}", { error: T(error.message) }));
      drawProps();
      return false;
    }
    history.push(before);
    if (history.length > 100) history.shift();
    future = [];
    statusMessage = null;
    render();
    draft();
    queueAutoSave();
    return true;
  }
  function undo() {
    if (!history.length) return;
    future.push(clone(doc));
    doc = history.pop();
    render();
    draft();
    queueAutoSave();
  }
  function redo() {
    if (!future.length) return;
    history.push(clone(doc));
    doc = future.pop();
    render();
    draft();
    queueAutoSave();
  }
  const db = () =>
    new Promise((resolve, reject) => {
      const r = indexedDB.open("ans-workbench", 1);
      r.onupgradeneeded = () => {
        for (const s of ["drafts", "backups"])
          if (!r.result.objectStoreNames.contains(s))
            r.result.createObjectStore(s);
      };
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    });
  async function record(store, key, value) {
    const d = await db();
    try {
      return await new Promise((resolve, reject) => {
        const t = d.transaction(
            store,
            value === undefined ? "readonly" : "readwrite",
          ),
          r =
            value === undefined
              ? t.objectStore(store).get(key)
              : t.objectStore(store).put(value, key);
        let v;
        r.onsuccess = () => (v = r.result);
        t.oncomplete = () => resolve(v);
        t.onerror = () => reject(t.error);
      });
    } finally {
      d.close();
    }
  }
  let draftTimer;
  function draft() {
    clearTimeout(draftTimer);
    draftTimer = setTimeout(async () => {
      try {
        await record("drafts", doc.id, {
          date: new Date().toISOString(),
          document: doc,
        });
        status(T("Draft saved"));
      } catch (e) {
        status(T("Draft unavailable: {error}", { error: e.message }));
      }
    }, 700);
  }
  async function restore() {
    const r = await record("drafts", doc.id);
    if (!r) return alert(T("No browser draft"));
    if (!confirm(T("Restore browser draft from {date}?", { date: r.date })))
      return;
    mutate(() => {
      doc = r.document;
    });
    status(T("Browser draft restored · save to keep it"));
  }
  function styleObject(n, o) {
    n.dataset.objectId = o.id;
    n.classList.add("ans-object", "ans-" + o.type);
    if (o.placement === "absolute" || page().layout === "absolute") {
      Object.assign(n.style, {
        position: "absolute",
        left: o.box.x + "px",
        top: o.box.y + "px",
        width: o.box.w + "px",
        height: o.box.h + "px",
      });
    } else {
      n.style.order = o.order || 0;
      if (o.box) {
        n.style.width = o.box.w + "px";
        n.style.minHeight = o.box.h + "px";
      }
    }
    if (o.style)
      for (const [k, v] of Object.entries(o.style))
        if (
          [
            "color",
            "background",
            "backgroundColor",
            "fontSize",
            "fontFamily",
            "fontWeight",
            "textAlign",
            "borderRadius",
            "borderColor",
            "borderWidth",
            "opacity",
          ].includes(k)
        )
          n.style[k] =
            typeof v === "number" &&
            ["fontSize", "borderRadius", "borderWidth"].includes(k)
              ? v + "px"
              : v;
    if (o.animation && o.animation !== "none") n.dataset.motion = o.animation;
    if (o.step > 0) {
      n.dataset.step = o.step;
      if (
        stepIndex < o.step &&
        !editing &&
        !document.documentElement.classList.contains("preview-mode") &&
        !document.documentElement.classList.contains("print-mode")
      )
        n.classList.add("ans-step-hidden");
    }
  }
  function drawObject(o) {
    let n;
    if (["text", "code", "formula"].includes(o.type)) {
      n = el(o.type === "code" ? "pre" : "div", "", o.text);
      if (o.type === "formula") n.title = "LaTeX source: " + o.text;
    } else if (o.type === "image") {
      n = el("img");
      n.src = doc.resources[o.resourceId].data;
      n.alt = o.alt || "";
      n.style.objectFit = "cover";
      n.style.objectPosition = `${o.crop?.x ?? 50}% ${o.crop?.y ?? 50}%`;
    } else if (o.type === "shape") {
      n = el("div");
      n.style.background = o.fill || "var(--color-accent,#4bb)";
      n.style.borderRadius =
        o.shape === "ellipse" ? "50%" : (o.radius || 0) + "px";
    } else if (o.type === "connector") {
      n = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      n.setAttribute("viewBox", "0 0 100 100");
      n.innerHTML = `<line x1="${Number(o.from.x)}" y1="${Number(o.from.y)}" x2="${Number(o.to.x)}" y2="${Number(o.to.y)}" stroke="${o.color || "#68bed0"}" stroke-width="2"/>`;
    } else if (o.type === "diagram") {
      n = el("div", "ans-diagram");
      const edges = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg",
      );
      edges.setAttribute("viewBox", "0 0 100 100");
      edges.setAttribute("preserveAspectRatio", "none");
      Object.assign(edges.style, {
        position: "absolute",
        inset: "0",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      });
      for (const e of o.edges) {
        let a = o.nodes.find((x) => x.id === e.from),
          b = o.nodes.find((x) => x.id === e.to);
        if (!a || !b) continue;
        const line = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "line",
        );
        line.setAttribute("x1", a.x + (a.w || 18) / 2);
        line.setAttribute("y1", a.y + (a.h || 14) / 2);
        line.setAttribute("x2", b.x + (b.w || 18) / 2);
        line.setAttribute("y2", b.y + (b.h || 14) / 2);
        line.style.stroke = "var(--color-accent, #d9b879)";
        line.style.strokeWidth = "3px";
        line.style.vectorEffect = "non-scaling-stroke";
        edges.append(line);
      }
      n.append(edges);
      for (const a of o.nodes) {
        let box = el("div", "ans-node", a.label);
        Object.assign(box.style, {
          left: a.x + "%",
          top: a.y + "%",
          width: (a.w || 18) + "%",
          height: (a.h || 14) + "%",
        });
        n.append(box);
      }
    } else if (o.type === "table") {
      n = el("table", "ans-table");
      for (const row of o.rows) {
        let tr = n.insertRow();
        for (const value of row) tr.insertCell().textContent = value;
      }
    } else if (o.type === "chart") {
      n = el("div", "ans-chart");
      const palette = [1, 2, 3, 4].map(
        (i) =>
          getComputedStyle(document.documentElement)
            .getPropertyValue("--chart-c" + i)
            .trim() || ["#49d6d0", "#e8b964", "#8587e9", "#f28291"][i - 1],
      );
      const max = Math.max(1, ...o.series.flatMap((s) => s.values.map(Number)));
      if (o.chartType === "pie") {
        let vals = o.series[0]?.values || [];
        let total = vals.reduce((a, b) => a + Number(b), 0) || 1,
          angle = 0;
        let stops = vals.map((v, i) => {
          let start = angle;
          angle += (Number(v) / total) * 100;
          return `${palette[i % 4]} ${start}% ${angle}%`;
        });
        let pie = el("div", "ans-pie");
        pie.style.background = `conic-gradient(${stops.join(",")})`;
        n.append(pie);
      } else if (o.chartType === "line" || o.chartType === "scatter") {
        const svg = document.createElementNS(
          "http://www.w3.org/2000/svg",
          "svg",
        );
        svg.setAttribute("viewBox", "0 0 1000 600");
        svg.style.width = "100%";
        svg.style.height = "100%";
        const make = (name, attrs) => {
          const x = document.createElementNS(
            "http://www.w3.org/2000/svg",
            name,
          );
          for (const [k, v] of Object.entries(attrs)) x.setAttribute(k, v);
          svg.append(x);
          return x;
        };
        make("line", {
          x1: 70,
          y1: 520,
          x2: 970,
          y2: 520,
          stroke: "#90a9b2",
          "stroke-width": 2,
        });
        o.series.forEach((series, j) => {
          const pts = series.values.map((v, i) => ({
            x: 95 + (i * 840) / Math.max(1, o.categories.length - 1),
            y: 500 - (Number(v) / max) * 430,
          }));
          if (o.chartType === "line")
            make("polyline", {
              points: pts.map((p) => `${p.x},${p.y}`).join(" "),
              fill: "none",
              stroke: palette[j % 3],
              "stroke-width": 7,
            });
          pts.forEach((p) =>
            make("circle", {
              cx: p.x,
              cy: p.y,
              r: o.chartType === "scatter" ? 11 : 8,
              fill: palette[j % 3],
            }),
          );
        });
        o.categories.forEach((c, i) => {
          let label = make("text", {
            x: 95 + (i * 840) / Math.max(1, o.categories.length - 1),
            y: 560,
            fill: "currentColor",
            "font-size": 24,
            "text-anchor": "middle",
          });
          label.textContent = c;
        });
        n.append(svg);
      } else {
        for (let i = 0; i < o.categories.length; i++) {
          let col = el("div", "ans-chart-col");
          for (let j = 0; j < o.series.length; j++) {
            let bar = el("div", "ans-bar");
            bar.style.height =
              Math.max(2, (Number(o.series[j].values[i]) / max) * 80) + "%";
            bar.style.background = palette[j % 3];
            col.append(bar);
          }
          col.append(el("span", "", o.categories[i]));
          n.append(col);
        }
      }
    }
    styleObject(n, o);
    return n;
  }
  function derivedPlan() {
    window.__deckPlan = {
      title: doc.title,
      total_slides: doc.pages.length,
      slides: doc.pages.map((p, i) => ({
        index: i + 1,
        type: p.type || "claim-evidence",
        assertion: p.title || "",
        speaker_notes: { key_points: [p.notes || ""] },
      })),
    };
  }
  function scale() {
    if (editing) return;
    document.documentElement.style.setProperty(
      "--scale",
      Math.min(innerWidth / 1920, innerHeight / 1080),
    );
  }
  function render() {
    source.textContent = safe(JSON.stringify(doc));
    derivedPlan();
    applyTheme();
    const stage = $("#ans-stage");
    stage.replaceChildren();
    doc.pages.forEach((p, i) => {
      const s = el("section", "slide" + (i === current ? " is-active" : ""));
      s.dataset.slide = i + 1;
      s.dataset.pageId = p.id;
      if (p.background) s.style.background = p.background;
      if (p.color) s.style.color = p.color;
      if (p.layout === "flex" || p.layout === "grid") {
        s.classList.add("ans-layout-" + p.layout);
        if (p.layout === "grid" && p.columns)
          s.style.gridTemplateColumns = p.columns;
      }
      for (const o of p.objects) s.append(drawObject(o));
      stage.append(s);
    });
    window.__currentSlide = current + 1;
    const rail = $("#ans-pages");
    rail.replaceChildren();
    doc.pages.forEach((p, i) => {
      const b = el(
        "button",
        "ans-page" + (i === current ? " active" : ""),
        `${String(i + 1).padStart(2, "0")}  ${p.title || T("Slide")}`,
      );
      b.onclick = () => {
        current = i;
        selected = null;
        selectedIds.clear();
        render();
      };
      rail.append(b);
    });
    const layers = $("#ans-layers");
    layers.replaceChildren();
    [...page().objects].reverse().forEach((o) => {
      const b = el(
        "button",
        "ans-layer" + (selectedIds.has(o.id) ? " active" : ""),
        `${T(o.type)} · ${o.text?.slice(0, 20) || o.id.slice(0, 8)}`,
      );
      b.onclick = (e) => {
        if (e.shiftKey) {
          selectedIds.add(o.id);
          if (!selected) selected = o.id;
        } else {
          selected = o.id;
          selectedIds = new Set([o.id]);
        }
        render();
      };
      layers.append(b);
    });
    $("#ans-notes").value = page().notes || "";
    $("#ans-notes").dataset.pageId = page().id;
    if ($("#ans-page-title")) {
      $("#ans-page-title").value = page().title || "";
      $("#ans-page-title").dataset.pageId = page().id;
    }
    for (const item of stage.querySelectorAll(".ans-object")) {
      item.classList.toggle(
        "ans-selected",
        editing && selectedIds.has(item.dataset.objectId),
      );
      if (
        editing &&
        selectedIds.has(item.dataset.objectId) &&
        (page().layout === "absolute" ||
          page().objects.find((o) => o.id === item.dataset.objectId)
            ?.placement === "absolute")
      ) {
        item.append(el("span", "ans-resize-handle"));
      }
    }
    drawProps();
    status();
    scale();
  }
  function drawProps() {
    const panel = $("#ans-props");
    panel.replaceChildren();
    const o = page().objects.find((x) => x.id === selected);
    if (!o) {
      panel.append(
        el(
          "p",
          "ans-hint",
          T("Select an object to edit its content and style."),
        ),
      );
      return;
    }
    panel.append(el("h3", "", T(o.type).toUpperCase()));
    function field(label, value, apply, multi = false) {
      let wrap = el("label", "ans-field"),
        title = el("span", "", T(label)),
        input = el(multi ? "textarea" : "input");
      input.value = value ?? "";
      let last = input.value;
      input.onchange = () => {
        if (input.value === last) return;
        const previous = last;
        last = input.value;
        const valid = mutate(() =>
          apply(
            page().objects.find((x) => x.id === o.id),
            input.value,
          ),
        );
        if (!valid) last = previous;
      };
      wrap.append(title, input);
      panel.append(wrap);
    }
    function advancedField(label, value, apply, multi = false, group = null) {
      field(label, value, apply, multi);
      const wrap = panel.lastElementChild;
      const details = group || el("details", "ans-advanced");
      if (!group) details.append(el("summary", "", T("Advanced source")));
      details.append(wrap);
      if (!group) panel.append(details);
    }
    function choice(label, value, options, apply) {
      const wrap = el("label", "ans-field"),
        title = el("span", "", T(label)),
        select = el("select");
      for (const value of options) {
        const option = el("option", "", T(value));
        option.value = value;
        select.append(option);
      }
      select.value = value;
      select.onchange = () =>
        mutate(() =>
          apply(
            page().objects.find((x) => x.id === o.id),
            select.value,
          ),
        );
      wrap.append(title, select);
      panel.append(wrap);
    }
    const objectChange = (fn) =>
      mutate(() => fn(page().objects.find((x) => x.id === o.id)));
    const changeOnce = (input, original, apply) => {
      let last = String(original ?? "");
      input.onchange = () => {
        if (input.value === last) return;
        const previous = last;
        last = input.value;
        if (!objectChange((x) => apply(x, input.value))) last = previous;
      };
    };
    if (["text", "code", "formula"].includes(o.type))
      field(
        o.type === "formula" ? "LaTeX source" : "Content",
        o.text,
        (x, v) => (x.text = v),
        true,
      );
    if (o.type === "image") {
      field("Alt text", o.alt, (x, v) => (x.alt = v));
      for (const k of ["x", "y"])
        field("Crop " + k + " %", o.crop?.[k] ?? 50, (x, v) => {
          if (
            !v.trim() ||
            !Number.isFinite(Number(v)) ||
            Number(v) < 0 ||
            Number(v) > 100
          )
            throw Error("Crop must be 0–100");
          x.crop ??= {};
          x.crop[k] = Number(v);
        });
      const input = el("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async () => {
        const file = input.files[0];
        if (!file) return;
        const data = await new Promise((res) => {
          const r = new FileReader();
          r.onload = () => res(r.result);
          r.readAsDataURL(file);
        });
        mutate(() => {
          const rid = id();
          doc.resources[rid] = { id: rid, data, name: file.name };
          page().objects.find((x) => x.id === o.id).resourceId = rid;
        });
      };
      panel.append(input);
    }
    if (o.type === "shape") {
      choice(
        "Shape: rect / ellipse",
        o.shape || "rect",
        ["rect", "ellipse"],
        (x, v) => (x.shape = v),
      );
      field("Fill", o.fill || "#49d6d0", (x, v) => {
        if (!v.trim() || !CSS.supports("color", v))
          throw Error("Invalid color");
        x.fill = v;
      });
    }
    if (o.type === "connector") {
      for (const end of ["from", "to"])
        for (const k of ["x", "y"])
          field(`${end}.${k}`, o[end][k], (x, v) => {
            if (
              !v.trim() ||
              !Number.isFinite(Number(v)) ||
              Number(v) < 0 ||
              Number(v) > 100
            )
              throw Error("Endpoint must be 0–100");
            x[end][k] = Number(v);
          });
    }
    if (o.type === "diagram") {
      const section = el("div", "ans-structured-editor");
      section.append(el("h4", "", T("Nodes")));
      o.nodes.forEach((node, index) => {
        const row = el("div", "ans-data-row");
        const label = el("input");
        label.value = node.label || "";
        label.title = T("Node label");
        changeOnce(label, node.label, (x, value) => {
          x.nodes[index].label = value;
        });
        const remove = el("button", "", "×");
        remove.title = T("Delete node");
        remove.onclick = () =>
          objectChange((x) => {
            const nodeId = x.nodes[index].id;
            x.nodes.splice(index, 1);
            x.edges = x.edges.filter(
              (e) => e.from !== nodeId && e.to !== nodeId,
            );
          });
        row.append(label, remove);
        section.append(row);
        const geometry = el("div", "ans-data-row");
        for (const key of ["x", "y", "w", "h"]) {
          const input = el("input");
          input.type = "number";
          input.min = "0";
          input.max = "100";
          input.step = "1";
          input.value = node[key] ?? (key === "w" ? 18 : key === "h" ? 14 : 0);
          input.title = `${T("Node")} ${key} %`;
          changeOnce(input, input.value, (x, raw) => {
            const value = Number(raw);
            if (!raw || !Number.isFinite(value) || value < 0 || value > 100)
              throw Error(T("Percent must be 0–100"));
            x.nodes[index][key] = value;
          });
          geometry.append(input);
        }
        section.append(geometry);
      });
      const addNode = el("button", "", T("Add node"));
      addNode.onclick = () =>
        objectChange((x) =>
          x.nodes.push({
            id: id(),
            label: contentLabel("节点", "Node"),
            x: 10 + x.nodes.length * 15,
            y: 35,
            w: 20,
            h: 18,
          }),
        );
      section.append(addNode, el("h4", "", T("Connections")));
      o.edges.forEach((edge, index) => {
        const row = el("div", "ans-data-row");
        for (const end of ["from", "to"]) {
          const select = el("select");
          for (const node of o.nodes) {
            const option = el("option", "", node.label || node.id);
            option.value = node.id;
            select.append(option);
          }
          select.value = edge[end];
          select.onchange = () =>
            objectChange((x) => {
              x.edges[index][end] = select.value;
            });
          row.append(select);
        }
        const remove = el("button", "", "×");
        remove.title = T("Delete connection");
        remove.onclick = () => objectChange((x) => x.edges.splice(index, 1));
        row.append(remove);
        section.append(row);
      });
      const addEdge = el("button", "", T("Add connection"));
      addEdge.disabled = o.nodes.length < 2;
      addEdge.onclick = () =>
        objectChange((x) =>
          x.edges.push({ from: x.nodes[0].id, to: x.nodes[1].id }),
        );
      section.append(addEdge);
      panel.append(section);
      advancedField(
        "Nodes / edges JSON",
        JSON.stringify({ nodes: o.nodes, edges: o.edges }, null, 2),
        (x, v) => {
          const d = JSON.parse(v);
          x.nodes = d.nodes;
          x.edges = d.edges;
        },
        true,
      );
    }
    if (o.type === "table") {
      const grid = el("div", "ans-data-grid");
      grid.style.gridTemplateColumns = `repeat(${o.rows[0]?.length || 1}, minmax(64px,1fr))`;
      o.rows.forEach((row, ri) =>
        row.forEach((cell, ci) => {
          const input = el("input");
          input.value = cell;
          input.title = `${T("Row")} ${ri + 1}, ${T("Column")} ${ci + 1}`;
          changeOnce(input, cell, (x, value) => {
            x.rows[ri][ci] = value;
          });
          grid.append(input);
        }),
      );
      panel.append(grid);
      const actions = el("div", "ans-actions");
      for (const [label, fn] of [
        ["Add row", (x) => x.rows.push(Array(x.rows[0].length).fill(""))],
        ["Add column", (x) => x.rows.forEach((r) => r.push(""))],
        [
          "Remove row",
          (x) => {
            if (x.rows.length > 1) x.rows.pop();
          },
        ],
        [
          "Remove column",
          (x) => {
            if (x.rows[0].length > 1) x.rows.forEach((r) => r.pop());
          },
        ],
      ]) {
        const button = el("button", "", T(label));
        button.onclick = () => objectChange(fn);
        actions.append(button);
      }
      panel.append(actions);
      advancedField(
        "Rows (TSV)",
        o.rows.map((r) => r.join("\t")).join("\n"),
        (x, v) => (x.rows = v.split("\n").map((r) => r.split("\t"))),
        true,
      );
    }
    if (o.type === "chart") {
      choice(
        "Chart type",
        o.chartType,
        ["bar", "line", "pie", "scatter"],
        (x, v) => (x.chartType = v),
      );
      const grid = el("div", "ans-data-grid");
      grid.style.gridTemplateColumns = `repeat(${o.series.length + 1}, minmax(66px,1fr))`;
      grid.append(el("strong", "", T("Category")));
      o.series.forEach((series, si) => {
        const name = el("input");
        name.value = series.name;
        name.title = T("Series name");
        changeOnce(name, series.name, (x, value) => {
          x.series[si].name = value;
        });
        grid.append(name);
      });
      o.categories.forEach((category, ci) => {
        const cat = el("input");
        cat.value = category;
        cat.title = T("Category");
        changeOnce(cat, category, (x, value) => {
          x.categories[ci] = value;
        });
        grid.append(cat);
        o.series.forEach((series, si) => {
          const value = el("input");
          value.type = "number";
          value.step = "any";
          value.value = series.values[ci];
          value.title = series.name;
          changeOnce(value, series.values[ci], (x, raw) => {
            if (!raw.trim() || !Number.isFinite(Number(raw)))
              throw Error("Numeric value required");
            x.series[si].values[ci] = Number(raw);
          });
          grid.append(value);
        });
      });
      panel.append(grid);
      const actions = el("div", "ans-actions");
      for (const [label, fn] of [
        [
          "Add category",
          (x) => {
            x.categories.push(contentLabel("分类", "Category"));
            x.series.forEach((s) => s.values.push(0));
          },
        ],
        [
          "Remove category",
          (x) => {
            if (x.categories.length > 1) {
              x.categories.pop();
              x.series.forEach((s) => s.values.pop());
            }
          },
        ],
        [
          "Add series",
          (x) =>
            x.series.push({
              name: contentLabel("系列", "Series"),
              values: x.categories.map(() => 0),
            }),
        ],
        [
          "Remove series",
          (x) => {
            if (x.series.length > 1) x.series.pop();
          },
        ],
      ]) {
        const b = el("button", "", T(label));
        b.onclick = () => objectChange(fn);
        actions.append(b);
      }
      panel.append(actions);
      const advanced = el("details", "ans-advanced");
      advanced.append(el("summary", "", T("Advanced source")));
      advancedField(
        "Categories (comma separated)",
        o.categories.join(","),
        (x, v) => {
          const categories = v.split(",").map((t) => t.trim());
          if (categories.length !== x.series[0].values.length)
            throw Error("Category count must match series length");
          x.categories = categories;
        },
        false,
        advanced,
      );
      advancedField(
        "Series JSON",
        JSON.stringify(o.series, null, 2),
        (x, v) => (x.series = JSON.parse(v)),
        true,
        advanced,
      );
      panel.append(advanced);
    }
    if (page().layout === "absolute" || o.placement === "absolute")
      for (const k of ["x", "y", "w", "h"])
        field(k, o.box[k], (x, v) => {
          if (!v.trim() || !Number.isFinite(Number(v)))
            throw Error("Finite number required");
          x.box[k] = Number(v);
        });
    else
      field("Order", o.order || 0, (x, v) => {
        if (!v.trim() || !Number.isFinite(Number(v)))
          throw Error("Finite number required");
        x.order = Number(v);
      });
    for (const k of [
      "color",
      "background",
      "fontSize",
      "fontFamily",
      "fontWeight",
      "textAlign",
    ])
      field(k, o.style?.[k] || "", (x, v) => {
        if (
          k === "fontSize" &&
          (!v.trim() || !Number.isFinite(Number(v)) || Number(v) <= 0)
        )
          throw Error("Positive font size required");
        if (
          ["color", "background"].includes(k) &&
          v &&
          !CSS.supports("color", v)
        )
          throw Error("Invalid color");
        if (
          ["fontWeight", "textAlign"].includes(k) &&
          v &&
          !CSS.supports(k === "fontWeight" ? "font-weight" : "text-align", v)
        )
          throw Error("Invalid style value");
        x.style ??= {};
        x.style[k] = k === "fontSize" ? Number(v) : v;
      });
    field("Group ID", o.group || "", (x, v) => (x.group = v));
    choice(
      "Animation: none / fade / rise",
      o.animation || "none",
      ["none", "fade", "rise"],
      (x, v) => (x.animation = v),
    );
    field("Reveal step", o.step || 0, (x, v) => {
      if (!v.trim() || !Number.isInteger(Number(v)) || Number(v) < 0)
        throw Error("Nonnegative integer required");
      x.step = Number(v);
    });
    const actions = el("div", "ans-actions");
    for (const [label, fn] of [
      [
        "Duplicate",
        () =>
          mutate(() => {
            const copy = clone(o);
            copy.id = id();
            page().objects.push(copy);
          }),
      ],
      [
        "Front",
        () =>
          mutate(() => {
            const a = page().objects;
            const i = a.findIndex((x) => x.id === o.id);
            a.push(...a.splice(i, 1));
          }),
      ],
      [
        "Back",
        () =>
          mutate(() => {
            const a = page().objects;
            const i = a.findIndex((x) => x.id === o.id);
            a.unshift(...a.splice(i, 1));
          }),
      ],
      [
        "Delete",
        () =>
          mutate(() => {
            page().objects = page().objects.filter((x) => x.id !== o.id);
            selected = null;
          }),
      ],
    ]) {
      let b = el("button", "", T(label));
      b.onclick = fn;
      actions.append(b);
    }
    const group = el("button", "", T("Group selected"));
    group.onclick = () => {
      if (selectedIds.size < 2) return;
      mutate(() => {
        const gid = id();
        for (const x of page().objects)
          if (selectedIds.has(x.id)) x.group = gid;
      });
    };
    actions.append(group);
    const ungroup = el("button", "", T("Ungroup"));
    ungroup.onclick = () =>
      mutate(() => {
        for (const x of page().objects)
          if (selectedIds.has(x.id)) delete x.group;
      });
    actions.append(ungroup);
    panel.append(actions);
  }
  function add(type) {
    mutate(() => {
      let o = {
        id: id(),
        type,
        box: { x: 170, y: 230, w: 520, h: 240 },
        style: { fontSize: 34 },
      };
      Object.assign(
        o,
        {
          text: {
            text: doc.language?.startsWith("zh") ? "编辑文字" : "Edit text",
          },
          code: { text: 'print("Hello")' },
          formula: { text: "E = mc^2" },
          shape: { shape: "rect", fill: "#49d6d0" },
          connector: { from: { x: 5, y: 50 }, to: { x: 95, y: 50 } },
          diagram: {
            nodes: [
              { id: "a", label: "A", x: 5, y: 25 },
              { id: "b", label: "B", x: 65, y: 25 },
            ],
            edges: [{ from: "a", to: "b" }],
          },
          table: {
            rows: [
              ["Name", "Value"],
              ["A", "1"],
            ],
          },
          chart: {
            chartType: "bar",
            categories: ["A", "B"],
            series: [{ name: contentLabel("系列", "Series"), values: [3, 5] }],
          },
          image: { resourceId: null },
        }[type],
      );
      if (type === "image") {
        const rid = id();
        doc.resources[rid] = {
          id: rid,
          data:
            "data:image/svg+xml;base64," +
            btoa(
              '<svg xmlns="http://www.w3.org/2000/svg" width="500" height="300"><rect width="500" height="300" fill="#657a8f"/></svg>',
            ),
        };
        o.resourceId = rid;
      }
      page().objects.push(o);
      selected = o.id;
      selectedIds = new Set([o.id]);
    });
  }
  function download(blob, name) {
    const a = el("a");
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 30000);
  }
  async function backupDownload() {
    const backup = await record("backups", doc.id);
    if (!backup) {
      status(T("No overwrite backup for this deck yet"));
      return;
    }
    download(
      new Blob([backup.html], { type: "text/html" }),
      (doc.title || "deck") + ".backup.html",
    );
    status(
      T("Downloaded pre-overwrite backup from {date}", { date: backup.date }),
    );
  }
  const helperBase = "http://127.0.0.1:8765";
  async function helperRequest(path, data, method = data ? "POST" : "GET") {
    const token = $("#ans-helper-token").value.trim();
    if (!token)
      throw Error(T("Start local export helper, then enter its token"));
    let response;
    try {
      response = await fetch(helperBase + path, {
        method,
        headers: { "content-type": "application/json", "x-ans-token": token },
        ...(data ? { body: JSON.stringify(data) } : {}),
      });
    } catch (error) {
      let healthy = false;
      try {
        await fetch(helperBase + "/health", {
          headers: { "x-ans-token": token },
          signal: AbortSignal.timeout(1500),
        });
        healthy = true;
      } catch {}
      throw Error(
        T(healthy ? "Helper connection failed" : "Helper is not running"),
      );
    }
    if (!response.ok) {
      let detail = await response
        .json()
        .catch(() => ({ error: response.statusText }));
      const err = Error(window.ANSI18N.error(detail.code, detail.error));
      err.code = detail.code;
      throw err;
    }
    return response;
  }
  function displayFileInfo(info) {
    if (!info) return;
    $("#ans-file-info").textContent = T(
      "File {path} · document {id} · disk {hash}",
      {
        path: info.path,
        id: info.documentId,
        hash: info.diskSha256?.slice(0, 12),
      },
    );
    if (info.historyEnabled)
      $("#ans-file-info").textContent +=
        "\n" +
        T("History stored at {path}", { path: info.historyPath }) +
        "\n" +
        T("Version {id} · {date}", {
          id: info.version?.slice(0, 10) || "—",
          date: info.versionDate || "",
        });
    $("#ans-history-enable").hidden = !!info.historyEnabled;
    $("#ans-history-auto").disabled = !info.historyEnabled;
  }
  function detachHelper() {
    helperInfo = null;
    clearTimeout(autoTimer);
    $("#ans-history-auto").checked = false;
    $("#ans-history-auto").disabled = true;
    $("#ans-file-info").textContent = "";
    $("#ans-history-list").replaceChildren();
  }
  async function connectHelper() {
    const info = await (await helperRequest("/file/info")).json();
    if (info.documentId !== doc.id)
      throw Error(T("Choose the current deck file"));
    if (!confirm(T("Connect to selected file {path}?", { path: info.path })))
      return;
    helperInfo = info;
    baseline = info.diskSha256;
    displayFileInfo(info);
    await refreshHistory().catch(() => {});
    status(T("Associated with {name}", { name: info.path }));
    queueAutoSave();
  }
  async function refreshHistory() {
    if (!helperInfo?.historyEnabled) {
      $("#ans-history-list").textContent = T("History is disabled");
      return;
    }
    const result = await (await helperRequest("/history")).json();
    helperInfo = result;
    displayFileInfo(result);
    const list = $("#ans-history-list");
    list.replaceChildren();
    if (!result.versions.length) list.textContent = T("No versions yet");
    for (const version of result.versions) {
      const button = el(
        "button",
        "",
        `${version.id.slice(0, 10)} · ${version.date}\n${version.message}`,
      );
      button.onclick = () =>
        previewVersion(version.id).catch((e) => status(e.message));
      list.append(button);
    }
  }
  async function previewVersion(versionId) {
    const result = await (await helperRequest("/history/" + versionId)).json();
    const panel = $("#ans-history-preview");
    panel.replaceChildren();
    panel.append(
      el(
        "p",
        "",
        `${result.id.slice(0, 10)} · ${result.sha256.slice(0, 12)}\n${result.document.title} · ${result.document.pages.map((p) => p.title).join(" / ")}`,
      ),
    );
    const frame = el("iframe", "ans-history-frame");
    frame.title = T("Preview version");
    frame.setAttribute("sandbox", "allow-scripts");
    frame.srcdoc = result.html.replace(
      "</head>",
      "<style>#ans-edit,#ans-shell{display:none!important}</style></head>",
    );
    panel.append(frame);
    const button = el("button", "", T("Restore version"));
    button.onclick = () =>
      restoreVersion(versionId).catch((e) => status(e.message));
    panel.append(button);
  }
  async function restoreVersion(versionId) {
    if (!confirm(T("Confirm restore as a new version?"))) return;
    if (JSON.stringify(doc) !== saved) await save();
    const result = await (
      await helperRequest("/history/restore", { id: versionId, baseline })
    ).json();
    const match = new DOMParser()
      .parseFromString(result.html, "text/html")
      .querySelector("#ans-document");
    const restored = JSON.parse(match.textContent);
    mutate(() => {
      doc = restored;
      current = Math.min(current, doc.pages.length - 1);
      selected = null;
      selectedIds.clear();
    });
    source.textContent = safe(JSON.stringify(doc));
    saved = JSON.stringify(doc);
    baseline = result.diskSha256;
    helperInfo = result;
    clearTimeout(draftTimer);
    await record("drafts", doc.id, {
      date: new Date().toISOString(),
      document: doc,
    }).catch(() => {});
    await refreshHistory();
    status(
      T("Restored as new version {id}", { id: result.version.slice(0, 10) }),
    );
  }
  async function enableHistory() {
    if (!helperInfo) throw Error(T("Select current HTML in helper"));
    const result = await (
      await helperRequest("/file/enable-history", {})
    ).json();
    helperInfo = { ...helperInfo, ...result, historyEnabled: true };
    displayFileInfo(helperInfo);
    await refreshHistory();
    queueAutoSave();
    status(T("Version recorded {id}", { id: result.commit.slice(0, 10) }));
  }
  async function recordVersion() {
    if (!helperInfo?.historyEnabled) throw Error(T("History is disabled"));
    const result = await (
      await helperRequest("/history/record", {
        baseline,
        message: $("#ans-version-message")?.value.trim() || "Record saved deck",
      })
    ).json();
    helperInfo = { ...helperInfo, ...result };
    await refreshHistory();
    status(
      result.changed
        ? T("Version recorded {id}", { id: result.commit.slice(0, 10) })
        : T("No changes to record"),
    );
  }
  async function helperSave(auto = false) {
    if (busy) return;
    busy = true;
    status(T("Saving"));
    try {
      const html = serialize(),
        sha256 = await hash(html);
      if (JSON.stringify(doc) !== saved) {
        const previous = await (await helperRequest("/file/current")).json();
        if (previous.sha256 !== baseline) {
          const error = Error(
            T("Disk file changed; save as a new file or reopen it."),
          );
          error.code = "DISK_CONFLICT";
          throw error;
        }
        await record("backups", doc.id, {
          date: new Date().toISOString(),
          html: previous.html,
          hash: previous.sha256,
        }).catch(() => {});
      }
      const message = auto
        ? "Automatic deck version"
        : $("#ans-version-message")?.value.trim() || "Save deck";
      const response = await helperRequest("/file/write", {
        html,
        sha256,
        baseline,
      });
      const result = await response.json();
      baseline = result.diskSha256;
      helperInfo = { ...helperInfo, ...result };
      saved = JSON.stringify(doc);
      source.textContent = safe(JSON.stringify(doc));
      clearTimeout(draftTimer);
      await record("drafts", doc.id, {
        date: new Date().toISOString(),
        document: doc,
      }).catch(() => {});
      status(T("Saved to {name}", { name: result.path }));
      if (helperInfo.historyEnabled && !result.versionSaved) {
        status(T("Git recording"));
        try {
          const version = await (
            await helperRequest("/history/record", { baseline, message })
          ).json();
          helperInfo = { ...helperInfo, ...version };
          status(
            version.changed
              ? T("Version recorded {id}", { id: version.commit.slice(0, 10) })
              : T("No changes to record"),
          );
        } catch (error) {
          status(
            T("File saved; version not recorded: {error}", {
              error: error.message,
            }),
          );
        }
      }
      displayFileInfo(helperInfo);
      if (helperInfo.historyEnabled) await refreshHistory().catch(() => {});
      if (!auto && $("#ans-version-message"))
        $("#ans-version-message").value = "";
      autoPaused = false;
    } catch (error) {
      if (
        error.code === "DISK_CONFLICT" ||
        [T("Helper is not running"), T("Helper connection failed")].includes(
          error.message,
        )
      ) {
        autoPaused = true;
        $("#ans-history-auto").checked = false;
        $("#ans-history-auto").disabled = true;
        status(
          (error.code === "DISK_CONFLICT" ? T("Conflict") + " · " : "") +
            T("Auto version paused") +
            " · " +
            error.message,
        );
      } else status(T("Save failed: {error}", { error: error.message }));
      throw error;
    } finally {
      busy = false;
    }
  }
  function queueAutoSave() {
    clearTimeout(autoTimer);
    if (
      !$("#ans-history-auto")?.checked ||
      !helperInfo?.historyEnabled ||
      autoPaused
    )
      return;
    autoTimer = setTimeout(() => {
      if (JSON.stringify(doc) !== saved) helperSave(true).catch(() => {});
    }, 60000);
  }
  async function saveFile(handle, initial) {
    if (busy) return;
    busy = true;
    try {
      const old = await (await handle.getFile()).text();
      const oldHash = await hash(old);
      if (initial && oldHash !== initial)
        throw Error(T("Disk file changed; save as a new file or reopen it."));
      await record("backups", doc.id, {
        date: new Date().toISOString(),
        html: old,
        hash: oldHash,
      });
      const html = serialize();
      const writer = await handle.createWritable();
      await writer.write(html);
      await writer.close();
      fileHandle = handle;
      baseline = await hash(html);
      saved = JSON.stringify(doc);
      clearTimeout(draftTimer);
      await record("drafts", doc.id, {
        date: new Date().toISOString(),
        document: doc,
      }).catch(() => {});
      status(T("Saved to {name}", { name: handle.name }));
    } catch (e) {
      status(
        e.message === T("Disk file changed; save as a new file or reopen it.")
          ? T("Conflict") + " · " + e.message
          : T("Save failed: {error}", { error: e.message }),
      );
      throw e;
    } finally {
      busy = false;
    }
  }
  async function associate() {
    if (!window.showOpenFilePicker) {
      status(T("Direct write unavailable; use Download HTML"));
      return;
    }
    const [h] = await showOpenFilePicker({
      types: [{ description: "HTML deck", accept: { "text/html": [".html"] } }],
    });
    const old = await (await h.getFile()).text();
    const other = new DOMParser()
      .parseFromString(old, "text/html")
      .querySelector("#ans-document");
    if (!other || JSON.parse(other.textContent).id !== doc.id)
      throw Error(T("Choose the current deck file"));
    fileHandle = h;
    detachHelper();
    baseline = await hash(old);
    status(T("Associated with {name}", { name: h.name }));
  }
  async function saveAs() {
    if (!window.showSaveFilePicker) {
      download(
        new Blob([serialize()], { type: "text/html" }),
        (doc.title || "deck") + ".html",
      );
      status(T("Downloaded HTML copy; source file unchanged"));
      detachHelper();
      return;
    }
    const h = await showSaveFilePicker({
      suggestedName: (doc.title || "deck") + ".html",
      types: [{ description: "HTML deck", accept: { "text/html": [".html"] } }],
    });
    await saveFile(h, await hash(await (await h.getFile()).text()));
    detachHelper(); // The helper remains bound to the previous explicitly selected file.
  }
  async function save() {
    if (helperInfo) await helperSave();
    else if (fileHandle) await saveFile(fileHandle, baseline);
    else await saveAs();
  }
  let lastExport = null;
  function taskDisplay(title, details, show = true) {
    $("#ans-task-title").textContent = title;
    $("#ans-task-details").textContent = details;
    if (show) $("#ans-task-panel").hidden = false;
  }
  async function exportCurrent(retry = null) {
    const mode = retry?.mode || $("#ans-export-mode").value,
      html = retry?.html || serialize(),
      sha256 = retry?.sha256 || (await hash(html));
    lastExport = { mode, html, sha256 };
    const started = Date.now();
    taskDisplay(
      T("Export has not started"),
      `${T(mode === "editable" ? "Editable PPTX" : mode === "image" ? "Image PPTX" : "PDF")} · ${sha256.slice(0, 12)}`,
    );
    $("#ans-task-download").hidden = true;
    try {
      status(
        T("Submitting current snapshot {hash}…", { hash: sha256.slice(0, 12) }),
      );
      const res = await helperRequest("/export", { html, sha256, mode });
      const { id } = await res.json();
      let task;
      do {
        await new Promise((r) => setTimeout(r, 700));
        task = await (await helperRequest("/task/" + id)).json();
        if (task.sha256 !== sha256)
          throw Error(T("Task snapshot hash mismatch"));
        taskDisplay(
          T("Exporting in background"),
          `${T(mode === "editable" ? "Editable PPTX" : mode === "image" ? "Image PPTX" : "PDF")} · ${T(task.stage === "converting" ? "Converting" : "Accepted")} · ${Math.round((Date.now() - started) / 1000)}s · SHA256 ${sha256}`,
        );
      } while (task.state === "running" || task.state === "queued");
      if (task.state !== "done") throw Error(task.error || "Export failed");
      const file = await helperRequest("/result/" + id);
      const blob = await file.blob();
      const name =
        (doc.title || "deck") +
        (mode === "image" ? ".image.pptx" : mode === "pdf" ? ".pdf" : ".pptx");
      download(blob, name);
      const link = $("#ans-task-download");
      if (link.href.startsWith("blob:")) URL.revokeObjectURL(link.href);
      link.href = URL.createObjectURL(blob);
      link.download = name;
      link.textContent = T("Download");
      link.hidden = false;
      if (mode !== "pdf") {
        const manifest = await helperRequest("/manifest/" + id).catch(
          () => null,
        );
        if (manifest.ok)
          download(
            await manifest.blob(),
            (doc.title || "deck") + ".pptx.manifest.json",
          );
      }
      taskDisplay(
        T("Complete"),
        `${T(mode === "editable" ? "Editable PPTX" : mode === "image" ? "Image PPTX" : "PDF")} · SHA256 ${sha256}`,
      );
      status(
        T("Downloaded {mode} · input SHA256 {hash}", { mode, hash: sha256 }),
      );
    } catch (e) {
      taskDisplay(T("Failed"), `${e.message} · SHA256 ${sha256}`);
      status(T("Export failed: {error}", { error: e.message }));
      throw e;
    }
  }
  function maxStep() {
    return Math.max(0, ...page().objects.map((o) => Number(o.step) || 0));
  }
  function next() {
    if (stepIndex < maxStep()) {
      stepIndex++;
      render();
    } else go(current + 2, false);
  }
  function go(n, revealAll = true) {
    current = Math.min(Math.max(0, n - 1), doc.pages.length - 1);
    stepIndex = revealAll ? maxStep() : 0;
    selected = null;
    selectedIds.clear();
    render();
  }
  window.__goToSlide = go;
  function applyTheme() {
    const tag = $("#ans-theme-style");
    if (!tag) return;
    const variant = doc.theme?.variants?.find((v) => v.id === doc.theme.active);
    tag.textContent = (doc.theme?.css || "") + "\n" + (variant?.css || "");
    const sel = $("#ans-theme");
    if (sel && sel.options.length === 1) {
      for (const v of doc.theme?.variants || []) {
        const op = el("option", "", v.label || v.id);
        op.value = v.id;
        sel.append(op);
      }
    }
    if (sel) sel.value = doc.theme?.active || "";
  }
  function overview() {
    const panel = $("#ans-overview-panel");
    panel.replaceChildren();
    panel.hidden = false;
    const close = el("button", "ans-close", T("Close overview ×"));
    close.onclick = () => (panel.hidden = true);
    panel.append(close);
    const grid = el("div", "ans-overview-grid");
    doc.pages.forEach((p, i) => {
      const tile = el("button", "ans-overview-tile");
      const frame = el("div", "ans-overview-frame");
      const clone = $("#ans-stage").children[i].cloneNode(true);
      Object.assign(clone.style, {
        position: "absolute",
        inset: "0",
        visibility: "visible",
        opacity: "1",
        transform: "scale(.2)",
        transformOrigin: "top left",
        pointerEvents: "none",
      });
      frame.append(clone);
      tile.append(frame, el("div", "", `${i + 1}. ${p.title || T("Slide")}`));
      tile.onclick = () => {
        panel.hidden = true;
        go(i + 1);
      };
      grid.append(tile);
    });
    panel.append(grid);
  }
  let speakerStart = Date.now(),
    speakerTimer;
  function speaker(open = true) {
    const p = $("#ans-speaker-panel");
    if (!open) {
      p.hidden = true;
      clearInterval(speakerTimer);
      return;
    }
    p.hidden = false;
    const refresh = () => {
      const m = Math.floor((Date.now() - speakerStart) / 60000),
        s = Math.floor((Date.now() - speakerStart) / 1000) % 60;
      $("#ans-speaker-clock").textContent =
        `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      $("#ans-speaker-notes").textContent = page().notes || T("No notes");
      $("#ans-speaker-index").textContent =
        `${current + 1} / ${doc.pages.length}`;
      const next = doc.pages[current + 1];
      $("#ans-speaker-next").textContent = next
        ? next.title || `${T("Slide")} ${current + 2}`
        : T("End of deck");
      const frame = $("#ans-speaker-current-preview");
      if (frame.dataset.index !== String(current)) {
        frame.replaceChildren();
        const clone = $("#ans-stage").children[current].cloneNode(true);
        Object.assign(clone.style, {
          visibility: "visible",
          opacity: "1",
          transform: "scale(.34)",
          transformOrigin: "top left",
          pointerEvents: "none",
        });
        frame.append(clone);
        frame.dataset.index = String(current);
      }
    };
    clearInterval(speakerTimer);
    speakerTimer = setInterval(refresh, 1000);
    refresh();
  }
  function setEditing(v) {
    editing = v;
    document.documentElement.classList.toggle("ans-editing", v);
    document.documentElement.classList.toggle("ans-presenting", !v);
    $("#ans-shell").hidden = !v;
    const stage = $("#ans-stage");
    if (v) $(".ans-canvas").append(stage);
    else document.body.insertBefore(stage, $("#ans-edit"));
    scale();
    render();
    if (v) requestAnimationFrame(fitCanvas);
  }
  function setZoom(value) {
    const bounded = Math.max(0.2, Math.min(1.2, value));
    document.documentElement.style.setProperty("--editor-scale", bounded);
    $("#ans-zoom").value = Math.round(bounded * 100);
  }
  function fitCanvas() {
    const center = $(".ans-center");
    setZoom(
      Math.min(
        (center.clientWidth - 72) / 1920,
        (center.clientHeight - 72) / 1080,
      ),
    );
    $(".ans-canvas").style.translate = "0px 0px";
    $(".ans-canvas").dataset.panX = "0";
    $(".ans-canvas").dataset.panY = "0";
  }
  function alignSelected(mode) {
    const items = page().objects.filter((o) => selectedIds.has(o.id) && o.box);
    if (
      items.length < (mode.startsWith("distribute") ? 3 : 2) ||
      (page().layout !== "absolute" &&
        items.some((o) => o.placement !== "absolute"))
    )
      return;
    mutate(() => {
      const boxes = page()
        .objects.filter((o) => selectedIds.has(o.id) && o.box)
        .map((o) => o.box);
      if (mode.startsWith("distribute")) {
        const horizontal = mode === "distribute-horizontal",
          key = horizontal ? "x" : "y",
          size = horizontal ? "w" : "h";
        boxes.sort((a, b) => a[key] - b[key]);
        const total = boxes.reduce((sum, b) => sum + b[size], 0);
        const gap =
          (boxes.at(-1)[key] + boxes.at(-1)[size] - boxes[0][key] - total) /
          (boxes.length - 1);
        let next = boxes[0][key] + boxes[0][size] + gap;
        for (let i = 1; i < boxes.length - 1; i++) {
          boxes[i][key] = Math.round(next);
          next += boxes[i][size] + gap;
        }
      } else if (["top", "middle", "bottom"].includes(mode)) {
        const top = Math.min(...boxes.map((b) => b.y)),
          bottom = Math.max(...boxes.map((b) => b.y + b.h));
        for (const b of boxes)
          b.y =
            mode === "top"
              ? top
              : mode === "bottom"
                ? bottom - b.h
                : (top + bottom - b.h) / 2;
      } else {
        const left = Math.min(...boxes.map((b) => b.x)),
          right = Math.max(...boxes.map((b) => b.x + b.w));
        for (const b of boxes)
          b.x =
            mode === "left"
              ? left
              : mode === "right"
                ? right - b.w
                : (left + right - b.w) / 2;
      }
    });
  }
  function clearGuides() {
    $(".ans-canvas")
      .querySelectorAll(".ans-guide,.ans-marquee")
      .forEach((n) => n.remove());
  }
  function guide(axis, value) {
    const n = el(
      "div",
      `ans-guide ${axis === "x" ? "vertical" : "horizontal"}`,
    );
    n.style[axis === "x" ? "left" : "top"] =
      value * (Number($("#ans-zoom").value) / 100) + "px";
    $(".ans-canvas").append(n);
  }
  function snap(value, candidates) {
    let nearest = null,
      distance = 9;
    for (const other of candidates)
      if (Math.abs(value - other) < distance) {
        nearest = other;
        distance = Math.abs(value - other);
      }
    return nearest;
  }
  function bind() {
    const alignTools = $(".ans-align-tools");
    for (const [mode, icon] of [
      ["top", "↥"],
      ["middle", "↕"],
      ["bottom", "↧"],
    ]) {
      const button = el("button", "", icon);
      button.dataset.align = mode;
      alignTools.append(button);
    }
    const pageTitle = el("label", "ans-field");
    pageTitle.id = "ans-page-title-wrap";
    pageTitle.append(el("span", "", T("Page title")));
    const pageTitleInput = el("input");
    pageTitleInput.id = "ans-page-title";
    pageTitleInput.onchange = () => {
      const pageId = pageTitleInput.dataset.pageId,
        value = pageTitleInput.value;
      if (doc.pages.find((p) => p.id === pageId)?.title === value) return;
      mutate(() => {
        const target = doc.pages.find((p) => p.id === pageId);
        if (target) target.title = value;
      });
    };
    pageTitle.append(pageTitleInput);
    $("#ans-notes").before(pageTitle);
    const versionMessage = el("input");
    versionMessage.id = "ans-version-message";
    versionMessage.placeholder = T("Name this version (optional)");
    versionMessage.setAttribute(
      "aria-label",
      T("Name this version (optional)"),
    );
    $("#ans-git-panel").insertBefore(versionMessage, $("#ans-history-list"));
    $("#ans-edit").onclick = () => setEditing(!editing);
    $("#ans-present").onclick = () => setEditing(false);
    $("#ans-undo").onclick = undo;
    $("#ans-redo").onclick = redo;
    $("#ans-save").onclick = () => save().catch((e) => alert(e.message));
    $("#ans-saveas").onclick = () => saveAs().catch((e) => alert(e.message));
    $("#ans-helper-connect").onclick = () =>
      connectHelper().catch((e) => status(e.message));
    $("#ans-history-enable").onclick = () =>
      enableHistory().catch((e) => status(e.message));
    $("#ans-history-refresh").onclick = () =>
      refreshHistory().catch((e) => status(e.message));
    $("#ans-history-record").onclick = () =>
      recordVersion().catch((e) => status(e.message));
    $("#ans-history-auto").onchange = () => {
      autoPaused = false;
      queueAutoSave();
    };
    $("#ans-history-auto").disabled = true;
    $("#ans-task-close").onclick = () => {
      $("#ans-task-panel").hidden = true;
    };
    $("#ans-task-retry").onclick = () => {
      if (lastExport) exportCurrent(lastExport).catch(() => {});
    };
    $("#ans-task-latest").onclick = () => exportCurrent().catch(() => {});
    $("#ans-ui-language").onchange = (e) =>
      window.ANSI18N.setLanguage(e.target.value);
    for (const button of document.querySelectorAll("[data-align]"))
      button.onclick = () => alignSelected(button.dataset.align);
    $("#ans-associate").onclick = () =>
      associate().catch((e) => alert(e.message));
    $("#ans-download").onclick = () => {
      download(
        new Blob([serialize()], { type: "text/html" }),
        (doc.title || "deck") + ".html",
      );
      status(T("Downloaded HTML copy; source file unchanged"));
    };
    $("#ans-restore").onclick = restore;
    $("#ans-notes").onchange = (e) => {
      const pageId = e.target.dataset.pageId,
        value = e.target.value;
      if (doc.pages.find((p) => p.id === pageId)?.notes === value) return;
      mutate(() => {
        const target = doc.pages.find((p) => p.id === pageId);
        if (target) target.notes = value;
      });
    };
    $("#ans-add-page").onclick = () =>
      mutate(() => {
        const p = clone(page());
        p.id = id();
        p.title += " copy";
        p.objects.forEach((o) => (o.id = id()));
        doc.pages.splice(++current, 0, p);
      });
    $("#ans-new-page").onclick = () =>
      mutate(() => {
        const p = {
          id: id(),
          title: doc.language?.startsWith("zh") ? "新页面" : "New page",
          layout: page().layout,
          notes: "",
          objects: [],
        };
        doc.pages.splice(++current, 0, p);
        selected = null;
        selectedIds.clear();
      });
    $("#ans-del-page").onclick = () => {
      if (doc.pages.length > 1)
        mutate(() => {
          doc.pages.splice(current, 1);
          current = Math.max(0, current - 1);
        });
    };
    $("#ans-up").onclick = () => {
      if (current > 0)
        mutate(() => {
          [doc.pages[current - 1], doc.pages[current]] = [
            doc.pages[current],
            doc.pages[current - 1],
          ];
          current--;
        });
    };
    $("#ans-down").onclick = () => {
      if (current < doc.pages.length - 1)
        mutate(() => {
          [doc.pages[current + 1], doc.pages[current]] = [
            doc.pages[current],
            doc.pages[current + 1],
          ];
          current++;
        });
    };
    $("#ans-insert").onchange = (e) => {
      if (e.target.value) add(e.target.value);
      e.target.value = "";
    };
    $("#ans-zoom").oninput = (e) => setZoom(Number(e.target.value) / 100);
    $("#ans-fit").onclick = fitCanvas;
    $(".ans-center").addEventListener(
      "wheel",
      (e) => {
        if (!editing || !e.ctrlKey) return;
        e.preventDefault();
        setZoom(
          Number($("#ans-zoom").value) / 100 + (e.deltaY > 0 ? -0.05 : 0.05),
        );
      },
      { passive: false },
    );
    let pan = null;
    $(".ans-center").addEventListener("pointerdown", (e) => {
      if (!editing || e.button !== 1) return;
      e.preventDefault();
      const canvas = $(".ans-canvas");
      pan = {
        x: e.clientX,
        y: e.clientY,
        tx: Number(canvas.dataset.panX || 0),
        ty: Number(canvas.dataset.panY || 0),
      };
      $(".ans-center").classList.add("ans-panning");
      const move = (ev) => {
        canvas.dataset.panX = pan.tx + ev.clientX - pan.x;
        canvas.dataset.panY = pan.ty + ev.clientY - pan.y;
        canvas.style.translate = `${canvas.dataset.panX}px ${canvas.dataset.panY}px`;
      };
      const end = () => {
        removeEventListener("pointermove", move);
        removeEventListener("pointerup", end);
        $(".ans-center").classList.remove("ans-panning");
        pan = null;
      };
      addEventListener("pointermove", move);
      addEventListener("pointerup", end);
    });
    let suppressClick = false;
    $("#ans-stage").onclick = (e) => {
      if (!editing) return;
      if (suppressClick) {
        suppressClick = false;
        return;
      }
      const target = e.target.closest("[data-object-id]");
      if (e.shiftKey && target) {
        selectedIds.add(target.dataset.objectId);
        selected ??= target.dataset.objectId;
      } else {
        selected = target?.dataset.objectId || null;
        selectedIds = new Set(selected ? [selected] : []);
      }
      render();
    };
    $("#ans-stage").onpointerdown = (e) => {
      if (!editing || e.button !== 0) return;
      const target = e.target.closest("[data-object-id]");
      if (!target) {
        const origin = $("#ans-stage").getBoundingClientRect(),
          scale = Number($("#ans-zoom").value) / 100;
        const start = {
          x: (e.clientX - origin.left) / scale,
          y: (e.clientY - origin.top) / scale,
        };
        const marquee = el("div", "ans-marquee");
        $(".ans-canvas").append(marquee);
        const move = (ev) => {
          const x = (ev.clientX - origin.left) / scale,
            y = (ev.clientY - origin.top) / scale;
          Object.assign(marquee.style, {
            left: Math.min(start.x, x) * scale + "px",
            top: Math.min(start.y, y) * scale + "px",
            width: Math.abs(x - start.x) * scale + "px",
            height: Math.abs(y - start.y) * scale + "px",
          });
        };
        const end = (ev) => {
          removeEventListener("pointermove", move);
          removeEventListener("pointerup", end);
          marquee.remove();
          const x = (ev.clientX - origin.left) / scale,
            y = (ev.clientY - origin.top) / scale;
          if (Math.abs(x - start.x) + Math.abs(y - start.y) < 8) return;
          const bounds = {
            left: Math.min(start.x, x),
            right: Math.max(start.x, x),
            top: Math.min(start.y, y),
            bottom: Math.max(start.y, y),
          };
          selectedIds = new Set(
            page()
              .objects.filter(
                (o) =>
                  o.box &&
                  o.box.x < bounds.right &&
                  o.box.x + o.box.w > bounds.left &&
                  o.box.y < bounds.bottom &&
                  o.box.y + o.box.h > bounds.top,
              )
              .map((o) => o.id),
          );
          selected = selectedIds.values().next().value || null;
          suppressClick = true;
          render();
        };
        addEventListener("pointermove", move);
        addEventListener("pointerup", end);
        return;
      }
      const o = page().objects.find((x) => x.id === target.dataset.objectId);
      if (
        !o?.box ||
        (page().layout !== "absolute" && o.placement !== "absolute")
      )
        return;
      const resizing = !!e.target.closest(".ans-resize-handle");
      if (!selectedIds.has(o.id) && !e.shiftKey) selectedIds = new Set([o.id]);
      const active = page().objects.filter(
        (item) =>
          item.box &&
          (selectedIds.has(item.id) || (o.group && item.group === o.group)),
      );
      const start = {
          x: e.clientX,
          y: e.clientY,
          boxes: new Map(active.map((item) => [item.id, clone(item.box)])),
        },
        s =
          Number(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--editor-scale",
            ),
          ) || 0.56;
      let moved = false,
        lastDx = 0,
        lastDy = 0,
        lastW = 0,
        lastH = 0;
      function move(ev) {
        let dx = (ev.clientX - start.x) / s,
          dy = (ev.clientY - start.y) / s;
        if (Math.abs(dx) + Math.abs(dy) < 3) return;
        moved = true;
        clearGuides();
        if (resizing) {
          const box = start.boxes.get(o.id);
          let w = Math.max(24, box.w + dx),
            h = Math.max(24, box.h + dy);
          if (ev.shiftKey) {
            const ratio = box.w / box.h;
            if (Math.abs(dx) > Math.abs(dy)) h = w / ratio;
            else w = h * ratio;
          }
          target.style.width = w + "px";
          target.style.height = h + "px";
          lastW = w - box.w;
          lastH = h - box.h;
          return;
        }
        const box = start.boxes.get(o.id);
        const others = page().objects.filter(
          (item) => item.box && !active.includes(item),
        );
        const xs = [
          0,
          960,
          1920,
          ...others.flatMap((item) => [
            item.box.x,
            item.box.x + item.box.w / 2,
            item.box.x + item.box.w,
          ]),
        ];
        const ys = [
          0,
          540,
          1080,
          ...others.flatMap((item) => [
            item.box.y,
            item.box.y + item.box.h / 2,
            item.box.y + item.box.h,
          ]),
        ];
        const sx =
          snap(box.x + dx, xs) ??
          snap(box.x + box.w / 2 + dx, xs) ??
          snap(box.x + box.w + dx, xs);
        const sy =
          snap(box.y + dy, ys) ??
          snap(box.y + box.h / 2 + dy, ys) ??
          snap(box.y + box.h + dy, ys);
        if (sx !== null) {
          dx +=
            sx -
            (Math.abs(sx - (box.x + dx)) < 9
              ? box.x + dx
              : Math.abs(sx - (box.x + box.w / 2 + dx)) < 9
                ? box.x + box.w / 2 + dx
                : box.x + box.w + dx);
          guide("x", sx);
        }
        if (sy !== null) {
          dy +=
            sy -
            (Math.abs(sy - (box.y + dy)) < 9
              ? box.y + dy
              : Math.abs(sy - (box.y + box.h / 2 + dy)) < 9
                ? box.y + box.h / 2 + dy
                : box.y + box.h + dy);
          guide("y", sy);
        }
        lastDx = dx;
        lastDy = dy;
        for (const item of active) {
          const node = $("#ans-stage").querySelector(
              `[data-object-id="${item.id}"]`,
            ),
            initial = start.boxes.get(item.id);
          if (node) {
            node.style.left = initial.x + dx + "px";
            node.style.top = initial.y + dy + "px";
          }
        }
      }
      function end(ev) {
        removeEventListener("pointermove", move);
        removeEventListener("pointerup", end);
        clearGuides();
        if (moved) {
          suppressClick = true;
          mutate(() => {
            for (const x of page().objects.filter((item) =>
              start.boxes.has(item.id),
            )) {
              if (resizing && x.id === o.id) {
                x.box.w = Math.max(24, Math.round(x.box.w + lastW));
                x.box.h = Math.max(24, Math.round(x.box.h + lastH));
              } else if (!resizing) {
                x.box.x += Math.round(lastDx);
                x.box.y += Math.round(lastDy);
              }
            }
          });
        }
      }
      addEventListener("pointermove", move);
      addEventListener("pointerup", end);
    };
    addEventListener("resize", scale);
    addEventListener("resize", () => {
      if (editing) fitCanvas();
    });
    addEventListener("beforeunload", (e) => {
      if (JSON.stringify(doc) !== saved) {
        e.preventDefault();
        e.returnValue = "";
      }
    });
    document.addEventListener("keydown", (e) => {
      const input = e.target.closest("input,textarea,[contenteditable]");
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        save().catch((x) => status(x.message));
        return;
      }
      if (editing) {
        if (input) return;
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
          e.preventDefault();
          e.shiftKey ? redo() : undo();
        }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "y") {
          e.preventDefault();
          redo();
        }
        if (
          ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key) &&
          selectedIds.size &&
          (page().layout === "absolute" ||
            page().objects.some(
              (o) => selectedIds.has(o.id) && o.placement === "absolute",
            ))
        ) {
          e.preventDefault();
          const amount = e.shiftKey ? 10 : 1;
          mutate(() => {
            for (const o of page().objects)
              if (selectedIds.has(o.id) && o.box) {
                o.box.x +=
                  e.key === "ArrowLeft"
                    ? -amount
                    : e.key === "ArrowRight"
                      ? amount
                      : 0;
                o.box.y +=
                  e.key === "ArrowUp"
                    ? -amount
                    : e.key === "ArrowDown"
                      ? amount
                      : 0;
              }
          });
        }
        return;
      }
      if (input) return;
      if (["ArrowRight", "ArrowDown", " ", "PageDown"].includes(e.key)) {
        e.preventDefault();
        next();
      } else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) {
        e.preventDefault();
        go(current, false);
      } else if (e.key === "Home") go(1, false);
      else if (e.key === "End") go(doc.pages.length, false);
    });
  }
  window.ANSWorkbench = {
    get document() {
      return clone(doc);
    },
    serialize,
    save,
    saveAs,
    associate,
    restore,
    undo,
    redo,
    setEditing,
    exportCurrent,
    connectHelper,
    refreshHistory,
    enableHistory,
    restoreVersion,
    fitCanvas,
    alignSelected,
    hash: () => hash(JSON.stringify(doc)),
  };
  const q = new URLSearchParams(location.search);
  window.ANSI18N.translateStatic();
  document.addEventListener("ans-language-change", () => {
    statusMessage = null;
    render();
    $("#ans-page-title-wrap span").textContent = T("Page title");
    const versionMessage = $("#ans-version-message");
    if (versionMessage) {
      versionMessage.placeholder = T("Name this version (optional)");
      versionMessage.setAttribute("aria-label", versionMessage.placeholder);
    }
    if (!$("#ans-overview-panel").hidden) overview();
    if (!$("#ans-speaker-panel").hidden) speaker(true);
    if (helperInfo) displayFileInfo(helperInfo);
  });
  $("#ans-overview").onclick = overview;
  $("#ans-speaker").onclick = () => {
    setEditing(false);
    speaker(true);
  };
  $("#ans-speaker-close").onclick = () => speaker(false);
  $("#ans-speaker-prev").onclick = () => go(current);
  $("#ans-speaker-forward").onclick = next;
  $("#ans-theme").onchange = (e) =>
    mutate(() => {
      doc.theme ??= {};
      doc.theme.active = e.target.value;
    });
  document.addEventListener("keydown", (e) => {
    if (editing || e.target.closest("input,textarea")) return;
    if (e.key.toLowerCase() === "e") setEditing(true);
    if (e.key.toLowerCase() === "o") overview();
    if (e.key.toLowerCase() === "p") speaker($("#ans-speaker-panel").hidden);
    if (e.key.toLowerCase() === "b")
      $("#ans-blackout").hidden = !$("#ans-blackout").hidden;
  });
  if (q.has("print")) document.documentElement.classList.add("print-mode");
  if (q.has("preview")) document.documentElement.classList.add("preview-mode");
  bind();
  $("#ans-backup").onclick = () =>
    backupDownload().catch((e) => status(e.message));
  $("#ans-export").onclick = () =>
    exportCurrent().catch((e) => alert(e.message));
  go(Number(q.get("preview")) || 1, q.has("preview") || q.has("print"));
  if (!q.has("print") && !q.has("preview") && q.get("edit") === "1")
    setEditing(true);
  if (q.get("present") === "1")
    document.documentElement.classList.add("ans-presenting");
  document.fonts.ready.then(scale);
  record("drafts", doc.id)
    .then((r) => {
      if (r && JSON.stringify(r.document) !== saved)
        status(T("Browser draft available · Restore from File menu"));
    })
    .catch(() => {});
})();
