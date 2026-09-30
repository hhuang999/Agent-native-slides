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

For a full two-style, all-object generator and browser verification, see `scripts/test/workbench.test.js`.

| Object | HTML editor and saved data | Editable PPTX mapping | Conversion limit |
|---|---|---|---|
| Text | Content and typography | Text box; optional `style.pptxFontFamily` names an Office-installed fallback for a bundled webfont | Browser font metrics can differ |
| Code | Source and typography | Monospace text box | Syntax colors are not mapped |
| Formula | LaTeX source | Editable source text | Native PowerPoint equation semantics unavailable; logged per object |
| Image | Replace, alt text, crop offsets; embedded data URI | Independent picture | Crop offset may differ; logged |
| Shape | Kind, fill, box | Native rectangle or ellipse | Other shapes are rejected by validation |
| Connector | Endpoints and color | Native connector XML | Endpoint attachment to other shapes is not retained |
| Diagram | Node and edge JSON | Independent editable node boxes, labels and connectors | Node grouping is logical only |
| Table | TSV cell matrix | Native editable table | HTML and PowerPoint cell sizing can differ |
| Chart | Categories, series, chart type and values | Native bar/line/pie chart with embedded workbook; scatter uses editable markers and labels | Scatter has no embedded workbook; logged |
| Speaker notes | Page note text | PowerPoint notes slide | Plain text only |
| Page order | Duplicate, delete, move | PPTX slide order | None |
| Animation / reveal | Per-object `none`, `fade`, `rise` and integer `step` | Static final object | HTML motion and reveal sequence omitted and logged |
| Decorative background | Theme CSS/background motion | Independent static picture behind native objects | Browser-only effects become static; logged |

For a chart whose values are labeled elsewhere on the slide, `style.pptxChartMinimal: true` hides the PowerPoint value axis and grid lines. Leave it unset when the chart itself must show its numeric scale.

All conversions are written to `<output>.pptx.manifest.json`, with source HTML SHA-256, model SHA-256 and ordered page/object IDs. The image PPTX is a separate `--image` mode and contains one picture per slide. PDF prints the current saved HTML or helper snapshot.

## Workbench and files

Open the delivered HTML and choose **Edit deck**, or append `?edit=1`. Pages, object layers, content properties, notes, zoom, insert, duplicate, grouping, ordering and animations are available inside the file. Shift-click layers to select several objects, then group them. Drag absolute objects or groups; edit flex/grid content and order through properties. `Ctrl+S` writes an associated file after browser authorization. **Save as** chooses a target; **Link file** associates a reopened deck; **Download HTML** creates a copy without claiming to write the source. Unsupported File System Access API browsers use the download path. Browser drafts and pre-overwrite backups use IndexedDB; **Backup** downloads the pre-overwrite file. Writes compare the current disk SHA-256 to the associated baseline and stop on conflict. The browser cannot perform an operating-system atomic compare-and-swap if another process writes during the final write itself.

For exports of unsaved edits, start `node scripts/export-helper.js`, paste its token into the workbench, choose editable PPTX, image PPTX, or PDF, and press **Export current**. The loopback helper verifies the submitted snapshot hash, reports progress/failure, and returns a download. CLI export of a saved HTML uses `node scripts/export-pptx.js deck.html` or `node scripts/export-pdf.js deck.html`. The helper binds only `127.0.0.1`; the random token protects its routes from unrelated local pages.

`?preview=N` and `?print=1` hide the workbench; print and export show every final object. In presentation mode, arrows, Space, Home and End navigate; `O` opens the page overview, `P` opens presenter notes/timer/next slide, `B` blacks out the screen, and `E` returns to editing. Workbench keyboard shortcuts operate only while editing.

## References

The user-owned HHB-HTML-PPT project informed file association, conflict checks, editor interactions and editable export behavior. [lewislulu/html-ppt-skill](https://github.com/lewislulu/html-ppt-skill) informed themes, overview, animation and presenter experience. This repository keeps its own 1920×1080 model and 53 style design references; the workbench is fixed UI, not a fixed slide layout.
