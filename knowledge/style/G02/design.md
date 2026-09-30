# G02 — dark-journal-academic

**Style ID:** G02
**Family:** G — Academic / Journal
**Scheme:** Dark surface, warm ivory text, wine / crimson accent
**Mood:** Austere, authoritative, typographic
**Occasion:** Humanities lectures, law seminars, history conferences, literary studies, philosophy symposia
**Academic Fit:** Victorian studies, legal history, classical philology, archival research, close-reading disciplines

---

## Design Philosophy

**Philosophy:** Typographic authority over visual spectacle. Every element derives weight from letterform, leading, and negative space rather than from color fill or decorative geometry. The near-black ground eliminates eye strain in prolonged reading sessions and recalls the deep-charcoal lecture boards and the heavy boards of academic monographs.

**Hierarchy:** Three weights of Playfair Display (400, 500, 700) carry all headline hierarchy. EB Garamond Italic distinguishes epigraphs, captions, and running footnotes from roman body text. Horizontal rules at 1 px separate major zones without introducing a new visual element.

**Detail:** Running headers and folios echo journal pagination conventions. Evidence rows render as footnote-style compact tables at 0.80 rem. The aside panel mimics a journal sidebar column in narrow measure, delimited by a 3 px left border in wine.

**Function:** Dense information density appropriate for expert audiences. Stat columns display two to three lines of context (label, figure, interpretive clause) rather than isolated numerals. Data tables use one wine-tinted highlighted row to focus attention on the key finding.

**Innovation:** No gradients, no box shadows, no icon elements. The entire visual language is achieved through type scale, column measure, rule weight, and leading. The slide prints cleanly on a laser printer with nothing lost.

---

## Color System

```css
:root {
  /* — Surface ——————————————————————————————— */
  --clr-bg:          oklch(0.07  0.005 250);   /* near-black charcoal, cool blue-grey tint */
  --clr-surface:     oklch(0.10  0.006 250);   /* raised surface: cards, panels */
  --clr-border:      oklch(0.20  0.008 250);   /* rule / separator */
  --clr-border-sub:  oklch(0.14  0.006 250);   /* subtle secondary divider */

  /* — Text ————————————————————————————————— */
  --clr-text:        oklch(0.95  0.010  80);   /* warm ivory — body text */
  --clr-text-muted:  oklch(0.72  0.012  80);   /* captions, labels, footnotes */
  --clr-text-faint:  oklch(0.48  0.010 250);   /* tertiary / disabled */

  /* — Accent ——————————————————————————————— */
  --clr-accent:      oklch(0.38  0.150  12);   /* dark crimson / wine — primary accent */
  --clr-accent-sub:  oklch(0.28  0.100  12);   /* deeper wine — borders, rules */
  --clr-accent-muted:oklch(0.22  0.060  12);   /* wine wash — table row highlight bg */

  /* — Rule / ornament ————————————————————— */
  --clr-rule:        oklch(0.22  0.008 250);   /* horizontal rules across slides */
}
```

---

## Typography

```html
<!-- Google Fonts CDN (OFL licensed) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,700&family=EB+Garamond:ital,wght@0,400;0,500;1,400;1,500&display=swap" rel="stylesheet">
```

```css
:root {
  /* — Font families ————————————————————————*/
  --ff-display: 'Playfair Display', Georgia, serif;   /* headlines, section markers */
  --ff-body:    'EB Garamond', Garamond, serif;        /* body, captions, footnotes */

  /* — Scale (1.250 Major Third) ————————————*/
  --fs-hero:    clamp(2.40rem, 3.2vw, 3.20rem);   /* slide 1 headline */
  --fs-h1:      clamp(1.60rem, 2.2vw, 2.20rem);   /* evidence/comparison headline */
  --fs-h2:      clamp(1.20rem, 1.6vw, 1.60rem);   /* section marker */
  --fs-body:    clamp(0.95rem, 1.1vw, 1.10rem);   /* body paragraph */
  --fs-stat:    clamp(2.00rem, 2.8vw, 3.00rem);   /* stat figure */
  --fs-label:   0.78rem;                           /* stat label, table header */
  --fs-caption: 0.80rem;                           /* aside body, footnote */
  --fs-folio:   0.72rem;                           /* slide folio */

  /* — Leading ——————————————————————————————*/
  --lh-tight:   1.15;   /* large display text */
  --lh-heading: 1.30;   /* h1/h2 */
  --lh-body:    1.75;   /* body paragraphs, footnotes */
  --lh-label:   1.25;   /* compact label rows */

  /* — Numeric variant ——————————————————————*/
  /* Apply to all elements containing figures: */
  /* font-variant-numeric: lining-nums tabular-nums; */
}
```

**Scale notes:**
- Playfair Display 400 italic for abstract / epigraph lines
- Playfair Display 700 for stat labels and section separators
- EB Garamond 400 italic for aside panel body and footnote citations
- Letter-spacing –0.01em on hero headline; 0.08em uppercase on section markers

---

## Background and Structural Elements

```css
/* Deck stage */
.deck-stage {
  width: 1920px;
  height: 1080px;
  background-color: var(--clr-bg);
  position: relative;
  overflow: hidden;
}

/* Full-bleed decorative spine rule — left edge */
.slide::before {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 6px; height: 100%;
  background: var(--clr-accent-sub);
  z-index: 0;
}

/* Horizontal cap rule — top of content zone */
.cap-rule {
  width: 100%;
  height: 1px;
  background: var(--clr-rule);
  margin-bottom: 2.4rem;
}

/* Section marker — journal running head style */
.section-marker {
  font-family: var(--ff-display);
  font-size: var(--fs-label);
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--clr-accent);
  margin-bottom: 1.2rem;
}

/* Slide content wrapper */
.slide-content {
  position: absolute;
  inset: 0;
  z-index: 1;
  padding: 80px 140px 80px 160px;
  display: flex;
  flex-direction: column;
}

/* Aside panel */
.aside-panel {
  border-left: 3px solid var(--clr-accent);
  padding-left: 1.6rem;
  background: var(--clr-surface);
}
```

---

## Layout Patterns

```
Slide 1 — Title
┌─────────────────────────────────────────────────────────────────────────┐
│ ▌ [cap-rule]                                                             │
│   [section marker — journal name + volume]                               │
│   [hero headline — Playfair 700, 2–3 lines]                             │
│   [abstract — EB Garamond italic, 2 sentences]                           │
│   [cap-rule]                                                             │
│   [4-col detail row: Author · Year · Institution · Keywords]             │
│                                              [folio — bottom right]      │
└─────────────────────────────────────────────────────────────────────────┘

Slide 2 — Evidence
┌─────────────────────────────────────────────────────────────────────────┐
│ ▌ [section marker]                                                       │
│   [h1 headline — 2 lines max]                                            │
│   [3-col stat row: figure + label + interpretation clause]               │
│   ────────────────────────────────────────────────────────               │
│   [evidence paragraph — 3–4 sentences]   │ [aside panel: stat + text]   │
│                                              [folio — bottom right]      │
└─────────────────────────────────────────────────────────────────────────┘

Slide 3 — Comparison Table
┌─────────────────────────────────────────────────────────────────────────┐
│ ▌ [section marker]                                                       │
│   [h1 headline]                                                          │
│   [comparison table: 5 rows, 5–6 cols, 1 highlighted row]               │
│   [footnote — EB Garamond italic, 0.80rem, muted]                       │
│                                              [folio — bottom right]      │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Tokens

```css
/* ── Stat columns ───────────────────────────────────────────────────── */
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.stat-figure {
  font-family: var(--ff-display);
  font-size: var(--fs-stat);
  font-weight: 700;
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--clr-accent);
  line-height: var(--lh-tight);
  letter-spacing: -0.02em;
}
.stat-label {
  font-family: var(--ff-body);
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--clr-text-muted);
}
.stat-clause {
  font-family: var(--ff-body);
  font-size: var(--fs-caption);
  font-style: italic;
  color: var(--clr-text-muted);
  line-height: var(--lh-body);
}

/* ── Comparison table ───────────────────────────────────────────────── */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--ff-body);
  font-size: 0.88rem;
  font-variant-numeric: lining-nums tabular-nums;
}
.data-table th {
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--clr-text-muted);
  border-bottom: 1px solid var(--clr-border);
  padding: 0.5rem 1rem 0.5rem 0;
  text-align: left;
}
.data-table td {
  padding: 0.55rem 1rem 0.55rem 0;
  border-bottom: 1px solid var(--clr-border-sub);
  color: var(--clr-text);
  line-height: var(--lh-label);
}
.data-table tr.highlight td {
  background: var(--clr-accent-muted);
  color: var(--clr-text);
  font-weight: 500;
}
.data-table td:not(:first-child),
.data-table th:not(:first-child) {
  text-align: right;
}

/* ── Slide folio ────────────────────────────────────────────────────── */
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--ff-body);
  font-size: var(--fs-folio);
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--clr-text-faint);
  letter-spacing: 0.06em;
}

/* ── Detail row (slide 1) ───────────────────────────────────────────── */
.detail-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0 2rem;
  border-top: 1px solid var(--clr-rule);
  padding-top: 1.2rem;
  margin-top: auto;
}
.detail-cell-label {
  font-family: var(--ff-body);
  font-size: 0.72rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--clr-text-muted);
  margin-bottom: 0.25rem;
}
.detail-cell-value {
  font-family: var(--ff-body);
  font-size: 0.90rem;
  color: var(--clr-text);
}
```

---

## Print / Export Mode

```css
@media print {
  :root {
    --clr-bg:       #ffffff;
    --clr-surface:  #f5f5f5;
    --clr-text:     #0f0f0f;
    --clr-text-muted: #444444;
    --clr-accent:   #7a1a1a;
    --clr-border:   #cccccc;
  }
  .nav-bar { display: none !important; }
  .deck-stage {
    transform: none !important;
    width: 100% !important;
    height: auto !important;
  }
}
```

---

## Accessibility

| Pair | Ratio | WCAG Level |
|---|---|---|
| Ivory text `oklch(0.95 0.010 80)` over dark bg `oklch(0.07 0.005 250)` | ≈ 16.8:1 | AAA |
| Muted text `oklch(0.72 0.012 80)` over dark bg | ≈ 7.4:1 | AAA |
| Accent crimson `oklch(0.38 0.15 12)` over dark bg | ≈ 4.9:1 | AA (large) |
| Table highlight bg `oklch(0.22 0.060 12)` — ivory text over it | ≈ 9.2:1 | AAA |

Hue alone is never the sole differentiator: the highlighted table row also receives `font-weight: 500`. Section markers are distinguished by letter-spacing, case, and family — not hue alone.

---

## Differentiators from Sibling Styles

| Attribute | G02 dark-journal-academic | G01 (light academic) | G03 (if defined) |
|---|---|---|---|
| Surface | Near-black charcoal | Warm off-white | — |
| Type families | Playfair Display + EB Garamond | — | — |
| Accent | Dark wine / crimson | — | — |
| Animation | None — pure typographic | — | — |
| Occasions | Humanities, law, history, literary | STEM / lab | — |
| Texture approach | Leading + rule weight | Grid + space | — |

---

## Fixed-stage content fit

The vw / clamp(...vw...) type values above are preview references. For a generated 1920×1080 deck, use fixed pixel type tokens and let the stage transform handle window scaling; otherwise text shrinks twice. Essential body copy follows knowledge/element/elements.md (normally 28–36px for speaker slides). Shorten copy, change layout, move explanation into speaker notes, or split the slide before reducing type size.
