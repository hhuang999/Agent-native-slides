---
name: agent-native-slides
description: Design and generate animated, 1920x1080 HTML presentation decks from .docx/.md/.txt input — deck planning, style selection from 53 live-preview aesthetics, AI decorative images (AIHubMix), a browser presenter view, and single-file HTML / PDF / PPTX export. Use when the user asks for slides, a presentation, a deck, or PPT.
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
AI generates: complete HTML deck
↓
Review in Studio → Present → Export single-file HTML / PDF / PPTX
```

---

## 8-Step Workflow

### Step 1 — Read input
- Accept `.docx`, `.md`, or `.txt`
- `.docx` → Markdown: `npx --yes mammoth@1.8.0 input.docx --output-format=markdown > input.md`
- Extract title, author, venue, approximate length

### Step 2 — Build Deck Plan
- Split into ~100–200 word chunks per slide
- Each slide: `assertion` headline (Assertion-Evidence format), `display_content`, `speaker_notes`
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
  - Key from `AIHUBMIX_API_KEY` env var only — never write it into a deck or file
  - Default `gpt-image-2.5-sunburst`, auto-fallback `gpt-image-2`; also good: `flux-2-pro` (fastest), `gemini-3.1-flash-image`
  - Ask for a 16:9-ish size (`2048x1152`, `1920x1088`); prompt for empty space where the title sits and say "no text"
  - Save as `.jpg` — several times smaller than PNG once inlined
- Embed by relative path, then dim it so text stays readable:
  `<img class="gen-bg" src="assets/cover.jpg" alt="">` (`position:absolute; inset:0; object-fit:cover; z-index:-1; opacity:.5`)
  or `background-image: linear-gradient(…), url(assets/cover.jpg)`
- Data charts always use ECharts — never image API

### Step 5 — Generate HTML deck
- Follow design language from `knowledge/style/[id]/design.md`
- Pull components from `knowledge/component/`
- Pull motion snippets from `knowledge/motion/motion.md`
- Fixed 1920×1080 stage, visibility/opacity switching, `?preview=N` support
- All CDN deps must pin version numbers

### Step 6 — Review in Studio (optional)
- Serve the skill root over HTTP (`npx serve .`), open `studio/editor.html?deck=<url-path-to-deck.html>`
- Studio is a viewer: slide thumbnails, Deck Plan notes panel, fullscreen (F), presenter (P), reload (R)
- It does not edit the deck — make changes in the HTML, then press R

### Step 7 — Present
- Deck: ← → / Space / PageUp / PageDown navigate; Home / End jump
- `data-step` attribute for per-element reveal within a slide (see RUNTIME.md §5)
- Presenter (`studio/presenter.html`, or P in Studio): current + next slide, notes, timer; B blacks out the screen

### Step 8 — Export
- **Single-file HTML**: `node scripts/inline-assets.js <deck.html> [out.html]` — inlines local images/fonts as data URIs so the deck works when moved or emailed (CDN libraries stay as CDN links)
- **PDF 16:9**: `node scripts/export-pdf.js <deck.html>` (Playwright headless print, one 1920×1080 page per slide)
- **PPTX**: `node scripts/export-pptx.js <deck.html> [deck-plan.json]` → one full-slide image per slide + speaker notes (text is not editable)
- Validate first: `node scripts/check-deck.js <deck.html>` must pass

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
