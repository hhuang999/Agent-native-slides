# README visual provenance

The screenshots in this directory are generated from project files, not UI mockups.

| Files | Source | Capture |
| --- | --- | --- |
| `styles/<ID>.jpg`, `styles-overview.jpg` | `knowledge/style/<ID>/preview.html` for all 53 IDs | Real Chromium, 640 × 360 viewport; three slides per strip; reduced motion for repeatability; font-load wait. The overview uses each first slide. |
| `workbench.jpg`, `presentation.jpg`, `collaboration.jpg`, `presenter-current.jpg`, `overview-current.jpg` | `examples/workflow.html`, built from `examples/workflow.json` | Real Chromium, 1920 × 1080 viewport. The workbench screenshot uses the current default Chinese UI and selects the visual source-data grid of a bar chart. Presenter and overview images are cropped captures of the actual overlay. |
| `hero-current.jpg` | The presentation and workbench captures above | Editorial composition of two real browser captures, labeled as such in the image. |
| `exports-current.jpg`, `exports-current.json` | `examples/workflow.editable.pptx` and `examples/workflow.image.pptx` | Counts read from the actual OOXML packages. Both panels show the **source HTML slide preview** to compare package structure; they are not screenshots of PowerPoint. |

To regenerate after a runtime, font, preview, or example change:

```bash
npm ci --prefix scripts
node scripts/build-deck.js examples/workflow.json examples/workflow.html
node scripts/export-pdf.js examples/workflow.html examples/workflow.pdf
node scripts/export-pptx.js examples/workflow.html examples/workflow.editable.pptx
node scripts/export-pptx.js examples/workflow.html examples/workflow.image.pptx --image
node scripts/capture-readme.js
node scripts/capture-export-proof.js
node scripts/build-style-gallery.js
node scripts/check-readme.js
```

For a workbench-only change, `node scripts/capture-readme.js --showcase-only` refreshes the current workbench/hero/presentation/presenter/overview captures without recapturing all 53 style strips. Rebuild the example and both PPTX modes first so asset hashes and export proof describe the same HTML.

The style previews request their declared Latin web fonts where available and fall back to local/system faces. Bundled CJK faces are loaded by `font-fallback.css`. A user's browser may render different line breaks when a web font is unavailable. The still captures turn off motion; the preview HTML itself remains animated in browsers that allow motion.
