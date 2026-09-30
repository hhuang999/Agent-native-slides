---
name: agent-native-slides
description: Design and generate animated, editable 1920x1080 HTML presentations from .docx/.md/.txt input, with 53 styles, an embedded workbench, single-file saving, PDF and native editable PPTX export. Use for new slides, presentations, decks, or PPT.
---

# Agent-Native Slides

**Core philosophy:** Teach AI how to design — not a template library.

This skill produces beautiful, animated HTML presentations from any text input. It works in 8 steps (described below) using a four-layer knowledge system: Elements → Components → Styles → Motion.

---

## Quick Start

```
User provides: .docx / .md / .txt
↓
AI produces: Deck Plan JSON (confirm structure)
↓
AI renders: 2–3 style preview.html candidates (real dynamic effects)
↓
User picks style
↓
AI generates: versioned object document + authored theme CSS
↓
build-deck.js validates and packages the standalone HTML with workbench
↓
Edit or present in that HTML → save → export PDF / editable PPTX / image PPTX
```

---

## 8-Step Workflow

### Step 1 — Read input
- Accept `.docx`, `.md`, or `.txt`
- `.docx` → Markdown: `npx --yes mammoth@1.8.0 input.docx --output-format=markdown > input.md`
- Extract title, author, venue, approximate length

### Step 2 — Build Deck Plan
- Split source material into ~100–200 word ideas for planning; this is **not** a visible-text allowance
- Each slide: one `assertion` headline, a short `visible_text` list, visual `display_content`, and fuller `speaker_notes`
- Keep speaker slides to one claim and one visual; put explanations in notes. If a claim, labels, or evidence need more room, simplify or split the slide before changing type size.
- Mark `visual_evidence_type`: `chart | diagram | image | formula | code | none`
- Output: Deck Plan JSON (see `prompts/deck-plan-schema.md`)

### Step 3 — Style selection (3-preview rule)
- Read `mood` + `occasion` from Deck Plan
- Query `knowledge/style/index.json` for 2–3 candidates
- Render each candidate's `preview.html` in an iframe or side-by-side
- **Stop and show user the real dynamic previews — never skip this step**
- After user picks, load `knowledge/style/[id]/design.md`

### Step 4 — AI image generation (optional)
- Only for decorative/atmospheric images (cover background, section divider)
- If running in Codex: call built-in image tool
- Otherwise: `node scripts/imagegen.js "<prompt>" <deck-dir>/assets/<name>.jpg [--model id] [--size WxH]`
  - Configure the project-root `.env` using `.env.example`: `IMAGE_PROVIDER`, `IMAGE_API_URL`, `IMAGE_API_KEY`, `IMAGE_MODEL`. The process environment overrides `.env`; the original `AIHUBMIX_API_KEY` environment variable still works for AIHubMix. Never write keys into decks or logs.
  - Default provider: AIHubMix native API, model `gpt-image-2.5-sunburst`, auto-fallback `gpt-image-2`; also good: `flux-2-pro` (fastest), `gemini-3.1-flash-image`
  - `openai-compatible` supports only synchronous Images API requests returning `data[0].b64_json` or `data[0].url`. Do not use this adapter for a native provider API with a different contract.
  - Ask for a 16:9-ish size (`2048x1152`, `1920x1088`); prompt for empty space where the title sits and say "no text"
  - Save as `.jpg` — several times smaller than PNG once inlined
- Embed by relative path, then dim it so text stays readable:
  `<img class="gen-bg" src="assets/cover.jpg" alt="">` (`position:absolute; inset:0; object-fit:cover; z-index:-1; opacity:.5`)
  or `background-image: linear-gradient(…), url(assets/cover.jpg)`
- Data charts use chart objects with editable categories and series; decorative images may use the image API.

### Step 5 — Author the editable document
- Read `knowledge/element/elements.md` before the selected style's `design.md`. Its readability and content-fit rules take precedence over small example type sizes in style previews.
- Read the selected entry in `knowledge/style/font-policy.json`. Use its display, body, and auxiliary faces with the listed Latin offline backups and local CJK fallback. Set the HTML language (`zh-CN`, `en`, or `ja`); I02 uses Simplified Chinese glyph forms when `lang=zh`.
- Put the relevant `@font-face` rules and selected style rules into `theme.css` in the versioned JSON model. Point local font URLs at files relative to the model JSON; `build-deck.js` embeds them. Remote `@import` and remote CSS assets fail packaging.
- Follow design language from `knowledge/style/[id]/design.md`
- Pull components from `knowledge/component/`
- Pull motion snippets from `knowledge/motion/motion.md`
- Read `docs/editable-workbench.md` and author **every meaningful item** as one of its supported objects. Use stable IDs, page notes, ordered pages, embedded resources and absolute/flex/grid placement. Never hide content in a decorative bitmap. Unknown content types and unsupported shapes/charts fail validation.
- Keep the chosen style's composition in `theme.css`, page background and object geometry. The fixed workbench UI does not determine the slide layout.
- Run `node scripts/build-deck.js document.json deck.html` as a mandatory delivery step. It validates the model, embeds resources, runtime and workbench, and produces the standalone HTML. Repeating the build from the same JSON produces one workbench.
- After `document.fonts.ready`, inspect every rendered slide at 1920×1080, including Chinese, English, and mixed-script lines where present. Fix text overflow, clipping, and overlap by shortening copy, changing layout, or splitting slides; retain readable type sizes. Repeat with remote web fonts blocked.
- All CDN deps must pin version numbers

### Step 6 — Review and edit in the delivered HTML
- Open `deck.html` and choose **Edit deck** or use `?edit=1`. Use the page rail, overview, layers, properties, notes, zoom and export controls.
- Save with `Ctrl+S` after authorizing a file target, **Save as**, or **Download HTML**. Restore a browser draft when offered. A reopened deck can be linked to its file to regain direct writes.
- For later AI revisions, first run `node scripts/extract-document.js saved.html current.json`. Treat the user's saved HTML as authoritative; continue from its extracted model and rebuild. Do not use the original Deck Plan as an editing source.
- `studio/editor.html` remains a separate read-only viewer for legacy decks and generated decks.

### Step 7 — Present
- Deck: ← → / Space / PageUp / PageDown navigate; Home / End jump
- `data-step` attribute for per-element reveal within a slide (see RUNTIME.md §5)
- `O` opens page overview; `P` opens embedded presenter view with notes, timer and next page; `B` blacks out the screen. Object `step` values reveal items before advancing to the next page. The separate `studio/presenter.html` remains available.

### Step 8 — Export
- **Single-file HTML**: `build-deck.js` output, or the workbench's Save/Download HTML. `inline-assets.js` remains for old decks.
- **PDF 16:9**: `node scripts/export-pdf.js <saved.html>`.
- **Editable PPTX by default**: `node scripts/export-pptx.js <saved.html> [output.pptx]`. It emits a conversion manifest and source SHA-256. Verify native objects and chart workbook in the package.
- **Image PPTX**: `node scripts/export-pptx.js <saved.html> [output.pptx] --image`, labeled as full-slide fidelity mode.
- **Current unsaved snapshot**: start `node scripts/export-helper.js`, paste its token into the workbench, choose PDF/editable PPTX/image PPTX and export. The helper verifies the submitted HTML hash and offers progress, failure and download.
- Validate first: `node scripts/check-deck.js <deck.html>` must pass
- Run `node scripts/check-deck.js <deck.html> --font-fallback` before delivery to verify offline Latin and local CJK reflow in both screen and print layouts.
- `check-deck.js` audits text geometry in screen and print layouts after fonts load; PDF/PPTX export also stops if its capture layout has text overflow, clipping, or overlap.

---

## Knowledge Layer Index

| Layer | Path | Contents |
|-------|------|----------|
| Elements | `knowledge/element/elements.md` | Title format, body density, spacing rules |
| Components | `knowledge/component/index.md` | ML diagrams, charts, formulas, code, generic blocks |
| Styles | `knowledge/style/index.json` | 53 visual aesthetics, each with design.md + preview.html |
| Motion | `knowledge/motion/motion.md` | 14 bg atmospheres + entrance/emphasis/transition snippets |

## Technical Reference

See `knowledge/RUNTIME.md` for:
- Fixed stage CSS
- Slide switching (visibility/opacity, NOT display:none)
- Scale JS (document.fonts.ready)
- Speaker preview (?preview=N)
- Export paths

## Style Selection Quick Reference

| mood + occasion | suggested candidates |
|----------------|---------------------|
| technical + conference | A01 circuit-engineered, L01 deep-ai-dark, J02 data-dashboard |
| academic + thesis | G01 light-journal-academic, G03 neutral-academic-beige, G04 clean-academic-sans |
| data + report | D01 swiss-international, J03 light-engineering, H01 primer-clean |
| creative + portfolio | F01 aurora-borealis-dark, C02 dark-editorial-cinema, I04 soft-bento |
| brand + pitch | K02 gold-dark-premium, L02 purple-ai-immersive, F03 mesh-gradient-vivid |
| teaching + lecture | E01 fog-grey-nordic, G02 dark-journal-academic, D02 bauhaus-geometric |
