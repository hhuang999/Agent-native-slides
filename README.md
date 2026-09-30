# HTML PPT Skill

An agent skill (Claude Code / Codex) that designs and builds **animated HTML presentation decks** from a document.
The skill teaches the model how to design slides. It is not a template pack.

> 一个让 AI 学会"设计"演示文稿的 Skill：输入 .docx / .md / .txt，产出 1920×1080 的动态 HTML 幻灯片，可在浏览器中预览、演讲，并导出单文件 HTML / PDF / PPTX。

## What it does

1. **Plan**: splits your document into a Deck Plan JSON (assertion–evidence headlines, speaker notes).
2. **Pick a style**: shows 2–3 live `preview.html` candidates from **53 visual aesthetics**.
3. **Generate**: writes a single-file HTML deck that follows the chosen style's `design.md`.
4. **Review & present**: in-browser studio (thumbnails, notes) and presenter view (current + next slide, notes, timer).
5. **Export**: single-file HTML, PDF (16:9, one slide per page), and PPTX (slide images + speaker notes).

## Install

Clone into your skills directory:

```bash
# Claude Code
git clone <repo-url> ~/.claude/skills/html-ppt
```

`SKILL.md` is the entry point the agent reads.

Export and check scripts need Node.js 18+:

```bash
cd ~/.claude/skills/html-ppt/scripts
npm install
npx playwright install chromium   # optional; falls back to local Chrome / Edge
```

## Scripts

Run from the skill root:

| Command | Purpose |
|---|---|
| `node scripts/check-deck.js <deck.html>` | Validate a deck against the Runtime API contract (`knowledge/RUNTIME.md`) |
| `node scripts/export-pdf.js <deck.html> [out.pdf]` | Export a 16:9 PDF, one 1920×1080 page per slide |
| `node scripts/export-pptx.js <deck.html> [deck-plan.json] [out.pptx]` | Export a PPTX: one full-slide image per slide + speaker notes (text not editable) |
| `node scripts/inline-assets.js <deck.html> [out.html]` | Inline local images/fonts so the deck is a single portable file |
| `node scripts/imagegen.js "<prompt>" <out.jpg>` | Generate a decorative image via AIHubMix (optional) |

### AI images (optional)

`imagegen.js` calls the [AIHubMix](https://aihubmix.com) image API. The default model is `gpt-image-2.5-sunburst`, with `gpt-image-2` as fallback; any model on AIHubMix works via `--model`.
It reads the key **only** from the environment:

```bash
export AIHUBMIX_API_KEY=...        # never commit this; .env is git-ignored
node scripts/imagegen.js "soft aurora background, empty left third, no text" deck/assets/cover.jpg --size 2048x1152
# reference it from the deck as assets/cover.jpg, then make a portable single file:
node scripts/inline-assets.js deck/deck.html
```

Async-only models (e.g. `flux-2-*`) need async tasks enabled in the AIHubMix console.

Tested 2026-09-30 (1536×1024 cover prompt):

| Model | Time | Notes |
|---|---|---|
| `gpt-image-2.5-sunburst` | ~35 s | Best composition and detail; default |
| `gpt-image-2.5-flare` | ~25 s | Similar look, faster; may add objects not asked for |
| `gpt-image-2` | ~20 s | Reliable fallback |
| `flux-2-pro` | ~11 s | Fastest; stylized, renders stray numbers on contour lines |
| `flux-2-flex` | ~15 s | Soft, painterly |
| `gemini-3.1-flash-image` | ~11 s | Takes aspect ratio only (script maps `--size`) |
| `qwen-image-2.0-pro` | ~25 s | Hazy, low contrast; returns PNG only |

`imagen-4.0` and `doubao-seedream-5.0-pro` are listed but returned `model_not_found` for this account.

Charts and data visuals are rendered with ECharts. They never go through the image API.

## Layout

```
SKILL.md            entry point: 8-step workflow
SOURCES.md          every external resource with version + license
knowledge/
  RUNTIME.md        deck runtime contract (stage, slide switching, print, ?preview=N)
  element/          typography, density, spacing rules
  component/        charts, ML diagrams, formulas, code blocks (+ live demos)
  style/            53 styles: <id>/design.md + <id>/preview.html, index.json
  motion/           background atmospheres, entrance / emphasis / data motion
prompts/            Deck Plan JSON schema
scripts/            check / export / inline-assets / imagegen (Node)
studio/             editor.html + presenter.html
assets/fonts/       bundled CJK + mono fonts (OFL)
```

## Viewing the style previews

Any `knowledge/style/<id>/preview.html` opens directly in a browser. Use `←` / `→` to move between slides.
`?preview=N` jumps to slide N, and `?print=1` shows the print layout.
The studio is a viewer (thumbnails, notes, presenter), not an editor. It loads decks through `?deck=`, so serve the folder over HTTP:

```bash
npx serve .   # then open http://localhost:3000/studio/editor.html?deck=/path/to/deck.html
```

## License

MIT for this repository's code and docs. Bundled fonts are under the SIL OFL 1.1. CDN libraries keep their own licenses. See [LICENSE](LICENSE) and [SOURCES.md](SOURCES.md).
Everything used is free / open source. Paid platforms (Gamma, Pitch, etc.) are cited as visual reference only; no code or assets are taken from them.
