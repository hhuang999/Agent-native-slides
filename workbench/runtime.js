(() => {
  "use strict";
  const source = document.getElementById("ans-document");
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
    source.textContent = safe(JSON.stringify(doc));
    const copy = new DOMParser().parseFromString(
      "<!doctype html>\n" + document.documentElement.outerHTML,
      "text/html",
    );
    copy.documentElement.classList.remove("ans-editing", "ans-presenting");
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
    $("#ans-status").textContent =
      message ||
      (JSON.stringify(doc) === saved
        ? "Saved snapshot"
        : "Unsaved changes · browser draft active");
    $("#ans-title").textContent = doc.title || "Untitled deck";
  }
  function mutate(fn) {
    history.push(clone(doc));
    if (history.length > 100) history.shift();
    future = [];
    fn();
    render();
    draft();
  }
  function undo() {
    if (!history.length) return;
    future.push(clone(doc));
    doc = history.pop();
    render();
    draft();
  }
  function redo() {
    if (!future.length) return;
    history.push(clone(doc));
    doc = future.pop();
    render();
    draft();
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
        status();
      } catch (e) {
        status("Draft unavailable: " + e.message);
      }
    }, 700);
  }
  async function restore() {
    const r = await record("drafts", doc.id);
    if (!r) return alert("No browser draft");
    if (!confirm("Restore browser draft from " + r.date + "?")) return;
    mutate(() => {
      doc = r.document;
    });
    status("Browser draft restored · save to keep it");
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
      for (const e of o.edges) {
        let line = el("div", "ans-edge");
        let a = o.nodes.find((x) => x.id === e.from),
          b = o.nodes.find((x) => x.id === e.to);
        if (!a || !b) continue;
        let dx = b.x - a.x,
          dy = b.y - a.y;
        Object.assign(line.style, {
          left: a.x + 5 + "%",
          top: a.y + 5 + "%",
          width: Math.hypot(dx, dy) + "%",
          transform: `rotate(${Math.atan2(dy, dx)}rad)`,
        });
        n.append(line);
      }
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
        `${String(i + 1).padStart(2, "0")}  ${p.title || "Slide"}`,
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
        `${o.type} · ${o.text?.slice(0, 20) || o.id.slice(0, 8)}`,
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
        el("p", "ans-hint", "Select an object to edit its content and style."),
      );
      return;
    }
    panel.append(el("h3", "", o.type.toUpperCase()));
    function field(label, value, apply, multi = false) {
      let wrap = el("label", "ans-field"),
        title = el("span", "", label),
        input = el(multi ? "textarea" : "input");
      input.value = value ?? "";
      let last = input.value;
      input.onchange = () => {
        if (input.value === last) return;
        last = input.value;
        mutate(() =>
          apply(
            page().objects.find((x) => x.id === o.id),
            input.value,
          ),
        );
      };
      wrap.append(title, input);
      panel.append(wrap);
    }
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
      field(
        "Shape: rect / ellipse",
        o.shape || "rect",
        (x, v) => (x.shape = v),
      );
      field("Fill", o.fill || "#49d6d0", (x, v) => (x.fill = v));
    }
    if (o.type === "connector") {
      for (const end of ["from", "to"])
        for (const k of ["x", "y"])
          field(`${end}.${k}`, o[end][k], (x, v) => (x[end][k] = Number(v)));
    }
    if (o.type === "diagram")
      field(
        "Nodes / edges JSON",
        JSON.stringify({ nodes: o.nodes, edges: o.edges }, null, 2),
        (x, v) => {
          let d = JSON.parse(v);
          x.nodes = d.nodes;
          x.edges = d.edges;
        },
        true,
      );
    if (o.type === "table")
      field(
        "Rows (TSV)",
        o.rows.map((r) => r.join("\t")).join("\n"),
        (x, v) => (x.rows = v.split("\n").map((r) => r.split("\t"))),
        true,
      );
    if (o.type === "chart") {
      field("Chart type", o.chartType, (x, v) => (x.chartType = v));
      field(
        "Categories (comma separated)",
        o.categories.join(","),
        (x, v) => (x.categories = v.split(",").map((t) => t.trim())),
      );
      field(
        "Series JSON",
        JSON.stringify(o.series, null, 2),
        (x, v) => (x.series = JSON.parse(v)),
        true,
      );
    }
    if (page().layout === "absolute" || o.placement === "absolute")
      for (const k of ["x", "y", "w", "h"])
        field(k, o.box[k], (x, v) => (x.box[k] = Number(v)));
    else field("Order", o.order || 0, (x, v) => (x.order = Number(v)));
    for (const k of [
      "color",
      "background",
      "fontSize",
      "fontFamily",
      "fontWeight",
      "textAlign",
    ])
      field(k, o.style?.[k] || "", (x, v) => {
        x.style ??= {};
        x.style[k] = v;
      });
    field("Group ID", o.group || "", (x, v) => (x.group = v));
    field(
      "Animation: none / fade / rise",
      o.animation || "none",
      (x, v) => (x.animation = v),
    );
    field(
      "Reveal step",
      o.step || 0,
      (x, v) => (x.step = Math.max(0, Math.round(Number(v) || 0))),
    );
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
      let b = el("button", "", label);
      b.onclick = fn;
      actions.append(b);
    }
    const group = el("button", "", "Group selected");
    group.onclick = () => {
      if (selectedIds.size < 2) return;
      mutate(() => {
        const gid = id();
        for (const x of page().objects)
          if (selectedIds.has(x.id)) x.group = gid;
      });
    };
    actions.append(group);
    const ungroup = el("button", "", "Ungroup");
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
          text: { text: "Edit text" },
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
            series: [{ name: "Series", values: [3, 5] }],
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
      status("No overwrite backup for this deck yet");
      return;
    }
    download(
      new Blob([backup.html], { type: "text/html" }),
      (doc.title || "deck") + ".backup.html",
    );
    status("Downloaded pre-overwrite backup from " + backup.date);
  }
  async function saveFile(handle, initial) {
    if (busy) return;
    busy = true;
    try {
      const old = await (await handle.getFile()).text();
      const oldHash = await hash(old);
      if (initial && oldHash !== initial)
        throw Error("Disk file changed; save as a new file or reopen it.");
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
      status("Saved to " + handle.name);
    } catch (e) {
      status("Save failed: " + e.message);
      throw e;
    } finally {
      busy = false;
    }
  }
  async function associate() {
    if (!window.showOpenFilePicker) {
      status("Direct write unavailable; use Download HTML");
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
      throw Error("Choose the current deck file");
    fileHandle = h;
    baseline = await hash(old);
    status("Associated with " + h.name);
  }
  async function saveAs() {
    if (!window.showSaveFilePicker) {
      download(
        new Blob([serialize()], { type: "text/html" }),
        (doc.title || "deck") + ".html",
      );
      status("Downloaded HTML copy");
      return;
    }
    const h = await showSaveFilePicker({
      suggestedName: (doc.title || "deck") + ".html",
      types: [{ description: "HTML deck", accept: { "text/html": [".html"] } }],
    });
    await saveFile(h, await hash(await (await h.getFile()).text()));
  }
  async function save() {
    if (fileHandle) await saveFile(fileHandle, baseline);
    else await saveAs();
  }
  async function exportCurrent() {
    const mode = $("#ans-export-mode").value,
      token = $("#ans-helper-token").value.trim();
    if (!token) {
      status("Start local export helper, then enter its token");
      return;
    }
    const html = serialize(),
      sha256 = await hash(html);
    try {
      status("Submitting current snapshot " + sha256.slice(0, 12) + "…");
      const base = "http://127.0.0.1:8765",
        res = await fetch(base + "/export", {
          method: "POST",
          headers: { "content-type": "application/json", "x-ans-token": token },
          body: JSON.stringify({ html, sha256, mode }),
        });
      if (!res.ok) throw Error(await res.text());
      const { id } = await res.json();
      let task;
      do {
        await new Promise((r) => setTimeout(r, 700));
        const q = await fetch(base + "/task/" + id, {
          headers: { "x-ans-token": token },
        });
        task = await q.json();
        status(`${mode}: ${task.state} · ${task.progress || ""}`);
      } while (task.state === "running" || task.state === "queued");
      if (task.state !== "done") throw Error(task.error || "Export failed");
      const file = await fetch(base + "/result/" + id, {
        headers: { "x-ans-token": token },
      });
      if (!file.ok) throw Error(await file.text());
      download(
        await file.blob(),
        (doc.title || "deck") +
          (mode === "image"
            ? ".image.pptx"
            : mode === "pdf"
              ? ".pdf"
              : ".pptx"),
      );
      if (mode !== "pdf") {
        const manifest = await fetch(base + "/manifest/" + id, {
          headers: { "x-ans-token": token },
        });
        if (manifest.ok)
          download(
            await manifest.blob(),
            (doc.title || "deck") + ".pptx.manifest.json",
          );
      }
      status(`Downloaded ${mode} · input SHA256 ${sha256}`);
    } catch (e) {
      status("Export failed: " + e.message + " · Retry after checking helper");
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
    tag.textContent =
      doc.theme?.variants?.find((v) => v.id === doc.theme.active)?.css ||
      doc.theme?.css ||
      "";
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
    const close = el("button", "ans-close", "Close overview ×");
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
      tile.append(frame, el("div", "", `${i + 1}. ${p.title || "Slide"}`));
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
      $("#ans-speaker-notes").textContent = page().notes || "No notes";
      $("#ans-speaker-index").textContent =
        `${current + 1} / ${doc.pages.length}`;
      const next = doc.pages[current + 1];
      $("#ans-speaker-next").textContent = next
        ? next.title || `Slide ${current + 2}`
        : "End of deck";
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
  }
  function bind() {
    $("#ans-edit").onclick = () => setEditing(!editing);
    $("#ans-present").onclick = () => setEditing(false);
    $("#ans-undo").onclick = undo;
    $("#ans-redo").onclick = redo;
    $("#ans-save").onclick = () => save().catch((e) => alert(e.message));
    $("#ans-saveas").onclick = () => saveAs().catch((e) => alert(e.message));
    $("#ans-associate").onclick = () =>
      associate().catch((e) => alert(e.message));
    $("#ans-download").onclick = () => {
      download(
        new Blob([serialize()], { type: "text/html" }),
        (doc.title || "deck") + ".html",
      );
      status("Downloaded HTML copy; source file unchanged");
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
    $("#ans-zoom").oninput = (e) =>
      document.documentElement.style.setProperty(
        "--editor-scale",
        Number(e.target.value) / 100,
      );
    $("#ans-stage").onclick = (e) => {
      if (!editing) return;
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
      if (!target) return;
      const o = page().objects.find((x) => x.id === target.dataset.objectId);
      if (
        !o?.box ||
        (page().layout !== "absolute" && o.placement !== "absolute")
      )
        return;
      const start = { x: e.clientX, y: e.clientY, box: clone(o.box) },
        s =
          Number(
            getComputedStyle(document.documentElement).getPropertyValue(
              "--editor-scale",
            ),
          ) || 0.56;
      let moved = false;
      function move(ev) {
        const dx = (ev.clientX - start.x) / s,
          dy = (ev.clientY - start.y) / s;
        if (Math.abs(dx) + Math.abs(dy) < 3) return;
        moved = true;
        target.style.left = start.box.x + dx + "px";
        target.style.top = start.box.y + dy + "px";
      }
      function end(ev) {
        removeEventListener("pointermove", move);
        removeEventListener("pointerup", end);
        if (moved)
          mutate(() => {
            const dx = Math.round((ev.clientX - start.x) / s),
              dy = Math.round((ev.clientY - start.y) / s);
            for (const x of o.group
              ? page().objects.filter((item) => item.group === o.group)
              : [o])
              if (x.box) {
                x.box.x += dx;
                x.box.y += dy;
              }
          });
      }
      addEventListener("pointermove", move);
      addEventListener("pointerup", end);
    };
    addEventListener("resize", scale);
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
    hash: () => hash(JSON.stringify(doc)),
  };
  const q = new URLSearchParams(location.search);
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
        status("Browser draft available · Restore from File menu");
    })
    .catch(() => {});
})();
