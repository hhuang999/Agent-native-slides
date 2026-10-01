# Editable deck contract / 可编辑幻灯片协议

New decks use `scripts/build-deck.js document.json deck.html`. The embedded `#ans-document` JSON is the **only saved authority**. The DOM and `window.__deckPlan` are derived views. Existing HTML is left intact; use `export-pptx.js --image` for its original fidelity export. For subsequent AI changes, run `extract-document.js saved.html current.json` and modify that extracted document. Do not regenerate from the original Deck Plan.

## Document model

`version: 1`, stable document/page/object/resource IDs, `title`, `language`, `styleId`, `theme.css`, optional `theme.variants`, `resources`, and ordered `pages`. Each page has `id`, `title`, `notes`, `layout` (`absolute`, `flex`, `grid`), optional background and ordered `objects`. A content object needs `id`, `type` and, for absolute placement, a 1920×1080 pixel `box: {x,y,w,h}`. Flex/grid objects use their container layout and `order`; rendered geometry is measured for PPTX export. Build embeds local CSS assets into the authoritative model. A selected theme variant is appended to the base CSS, so fonts and shared rules stay available after saving and reopening. Build validation rejects unknown content types and missing image resources.

Minimal build input:

```json
{
  "version": 1,
  "id": "research-deck-001",
  "title": "Research update",
  "language": "en",
  "styleId": "G01",
  "theme": { "css": ":root{--color-bg:#f5f2e9;--color-body:#28323b}.slide{font-family:Georgia,serif}" },
  "resources": {},
  "pages": [{
    "id": "opening-001", "title": "Progress", "layout": "absolute",
    "notes": "Explain the result before the method.",
    "objects": [{ "id": "heading-001", "type": "text",
      "box": { "x": 100, "y": 100, "w": 1500, "h": 140 },
      "text": "Our result is reproducible", "style": { "fontSize": 70, "color": "#28323b" } }]
  }]
}
```

For a full two-style, all-object generator and browser verification, see `scripts/test/workbench.test.js`. The language, canvas, Git, conflict, and task flow is exercised in `scripts/test/workbench-upgrade.test.js`.

| Object | HTML editor and saved data | Editable PPTX mapping | Conversion limit |
|---|---|---|---|
| Text | Content and typography; drag/resize in absolute layout | Text box; optional `style.pptxFontFamily` names an Office-installed fallback for a bundled webfont | Browser font metrics can differ |
| Code | Source and typography | Monospace text box | Syntax colors are not mapped |
| Formula | LaTeX source | Editable source text | Native PowerPoint equation semantics unavailable; logged per object |
| Image | Local replacement, alt text, crop offsets; embedded data URI survives reopen | Independent picture | Crop offset may differ; logged |
| Shape | Kind, fill, box | Native rectangle or ellipse | Other shapes are rejected by validation |
| Connector | Endpoints and color | Native connector XML | Endpoint attachment to other shapes is not retained |
| Diagram | Node labels and geometry, add/remove nodes, connect/disconnect with node selectors; JSON for advanced edits | Independent editable node boxes, labels and connectors | Node grouping is logical only |
| Table | Direct cell grid, add/remove rows and columns; TSV for bulk edits | Native editable table | HTML and PowerPoint cell sizing can differ |
| Chart | Visual data grid, series/category controls, type selector; JSON for bulk edits | Native bar/line/pie chart with embedded workbook; scatter uses editable markers and labels | Scatter has no embedded workbook; logged |
| Speaker notes | Page note text | PowerPoint notes slide | Plain text only |
| Page order | Duplicate, delete, move | PPTX slide order | None |
| Animation / reveal | Per-object `none`, `fade`, `rise` and integer `step` | Static final object | HTML motion and reveal sequence omitted and logged |
| Decorative background | Theme CSS/background motion | Independent static picture behind native objects | Browser-only effects become static; logged |

For a chart whose values are labeled elsewhere on the slide, `style.pptxChartMinimal: true` hides the PowerPoint value axis and grid lines. Leave it unset when the chart itself must show its numeric scale.

All conversions are written to `<output>.pptx.manifest.json`, with source HTML SHA-256, model SHA-256 and ordered page/object IDs. The image PPTX is a separate `--image` mode and contains one picture per slide. PDF prints the current saved HTML or helper snapshot.

## Workbench, language and canvas

Open the delivered HTML and choose **编辑文稿** (Edit deck), or append `?edit=1`. The workbench UI defaults to 简体中文, with a 中文/English switch. Its preference is local to the browser; changing it leaves `document.language`, slide content, `#ans-document`, export input and dirty state unchanged. A copy opened in a new browser starts in Chinese. UI strings, interpolation and helper error codes live in `workbench/i18n.js`.

The editor has page rail, layers, direct object properties, structured data editors, notes, animation/reveal settings, zoom, fit and middle-button pan. Click or Shift-click objects/layers, or draw a marquee on empty stage. Absolute objects can be dragged and resized with a handle; Shift keeps aspect ratio while resizing. Dragging produces one undo step. Snap guides, align/distribute commands, keyboard arrow nudges (Shift = 10 px), grouping, layer order and duplicate/delete are available. Flex/grid objects keep their layout: edit content, order and applicable size fields instead of free dragging. Page title, add/duplicate/delete/reorder and notes are editable. Field changes are validated before entering undo history.

## Saving and history

The original HTML is the current file and the input for later AI changes. Its `#ans-document` is the saved content authority; task and language UI are regenerated from the packaged shell, so switching UI language does not alter file bytes or create Git versions.

| Mechanism | Scope | What it means |
|---|---|---|
| Undo/redo | Current editor session | Reverses model edits, including a whole drag as one step. |
| Browser draft | IndexedDB on this browser | Automatic recovery data; **not** a disk write. |
| Pre-overwrite backup | Latest previous HTML in IndexedDB | **覆盖前备份** downloads that previous file; not a timeline. |
| Direct file save | User-authorized File System Access API target | `Ctrl+S` writes the associated file after a disk SHA-256 conflict check. |
| Download HTML | New browser download | A portable editable copy; UI says **已下载副本，原文件未写回**. |
| Git history | Optional, helper-associated single HTML | Each changed manual save gets a commit; auto-versioning after about 60 seconds idle is off by default. |

Use **另存为** to choose a new file, or **关联文件** to authorize an existing saved HTML. Browsers without direct-write APIs use the actual download path. Unsaved changes prompt on close. A disk hash change stops writing and pauses auto-versioning; the browser cannot provide an operating-system atomic compare-and-swap if another process writes during the final write itself.

To enable optional Git history, install Git and explicitly start the same helper used for exports:

```bash
node scripts/export-helper.js --file /absolute/path/to/deck.html
```

Paste its token into the workbench, click **连接助手**, verify and confirm the displayed selected path/document ID/disk hash, then click **启用此文稿历史**. The helper binds to `127.0.0.1` only, accepts only that CLI-selected file and known routes, never a browser-supplied path or command, and never pushes to GitHub. History is stored in `~/.agent-native-slides/history/<SHA-256-of-canonical-path-and-document-ID-prefix>/` (or `ANS_HISTORY_ROOT` if explicitly set by the helper's operator). Inside that dedicated repository only `deck.html` is tracked. The original HTML is still the file you open, save and pass to `extract-document.js`; it does not become a checkout. Copying the HTML alone preserves editing/presentation/export but does not copy its external history.

The history panel lists commit ID, time and message, previews version title/pages, and restores a selected version by first recording the current file if needed, then writing the old content and creating a **new** commit. It never resets history. Optional version descriptions are available before save. If the file write succeeds but Git recording fails, the status says **文件已保存；版本未记录** and **重试记录版本** records the already saved file without rewriting it. The auto-version switch is off at startup; with it enabled, edits wait for about 60 seconds of inactivity before a real changed-file save/commit. A conflict or disconnected helper turns the switch off. No Git installation or helper is required for ordinary single-file editing.

## Export tasks

For unsaved edits, start `node scripts/export-helper.js` (or use the already-running `--file` helper), enter its token, choose editable PPTX, image PPTX, or PDF, and click **导出当前快照**. The loopback helper verifies the submitted HTML SHA-256, acknowledges a task, reports structured `accepted`/`converting`/`done`/`failed` stages and returns the output. The task panel shows format, elapsed time, snapshot hash, actual failure reason, retry of the **same** snapshot and a separate **导出最新状态** action. It does not display a fabricated percentage or ETA; editing remains available while polling. Wrong tokens and a stopped helper are shown as distinct failures. CLI export of a saved HTML uses `node scripts/export-pptx.js deck.html` or `node scripts/export-pdf.js deck.html`.

`?preview=N` and `?print=1` hide the workbench; print and export show every final object. In presentation mode, arrows, Space, Home and End navigate; `O` opens the page overview, `P` opens presenter notes/timer/next slide, `B` blacks out the screen, and `E` returns to editing. Workbench keyboard shortcuts operate only while editing.

## References

The user-owned HHB-HTML-PPT project informed file association, conflict checks, editor interactions and editable export behavior. [lewislulu/html-ppt-skill](https://github.com/lewislulu/html-ppt-skill) informed themes, overview, animation and presenter experience. This repository keeps its own 1920×1080 model and 53 style design references; the workbench is fixed UI, not a fixed slide layout.
