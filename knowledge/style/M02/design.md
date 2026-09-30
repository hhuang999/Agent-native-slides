# M02 — ink-illustration

**Style ID:** M02  
**Family:** M (Illustration/Artistic)  
**Scheme:** Warm cream + deep ink + vermilion accent  
**Mood:** Literary, contemplative, editorial gravitas  
**Occasion:** Literary publishing, cultural journalism, arts foundations, book design, independent media  
**Academic Fit:** Humanities, literary studies, cultural criticism, arts administration

---

## Design Philosophy (5D)

**Philosophy:** The deck surface is treated as a laid-paper page — the kind of heavy cream stock a fine literary journal prints on. All marks have the precision and restraint of a good ink drawing: thin rules, small deliberate blots, no fill effects, no gradients. Every element earns its place the way a caption earns its column inch.

**Hierarchy:** A single large serif headline anchors each slide. Secondary text — statistics, captions, footnotes — sets in the lighter weight of the same family, always smaller, never competing. The ink blot accent dot signals a statistic's lead figure; it is the only decoration. Rules divide; they do not decorate.

**Detail:** Ink-trap details in the display serif (Spectral) become legible at large sizes, lending authenticity. Numbers in stat columns use `font-variant-numeric: lining-nums tabular-nums` so figures grid reliably. Table hairlines are 0.5 px warm-dark, never heavier. The folio is a simple numeral at bottom-right, understated.

**Function:** No motion of any kind. The reading experience is print-static. Nav dots and folio are the only persistent UI chrome. The comparison table uses a single row highlight (light cream tint deepened slightly) rather than alternating zebra stripes, because the paper already has texture.

**Innovation:** The "ink blot" stat accent — a 10 × 10 px circle in deep vermilion — replaces every decorative flourish. It is the only element that uses the accent color in a purely graphic (non-text) role. Section markers use a fine 0.5 px vermilion rule spanning 48 px, followed by a small-caps label in ink, creating a chapter-opening cadence familiar from literary journalism.

---

## Color System (OKLCH CSS tokens)

```css
:root {
  /* Surfaces */
  --c-paper:       oklch(0.96 0.014 68);   /* warm cream — main background */
  --c-paper-deep:  oklch(0.92 0.016 68);   /* slightly richer cream for table highlight */
  --c-ink:         oklch(0.10 0.012 40);   /* very dark warm ink — primary text */
  --c-ink-mid:     oklch(0.30 0.012 40);   /* mid ink — secondary text, captions */
  --c-ink-light:   oklch(0.52 0.010 40);   /* pale ink — footnotes, table rules */
  --c-rule:        oklch(0.18 0.012 40);   /* thin rule color — near-ink, just lighter */

  /* Accent */
  --c-vermilion:   oklch(0.48 0.18 24);    /* deep vermilion / ink red — accent, blot */
  --c-vermilion-dk: oklch(0.38 0.16 24);  /* darker vermilion for hover/active states */

  /* Semantic aliases */
  --c-bg:          var(--c-paper);
  --c-text:        var(--c-ink);
  --c-text-2:      var(--c-ink-mid);
  --c-text-3:      var(--c-ink-light);
  --c-border:      var(--c-rule);
  --c-accent:      var(--c-vermilion);
  --c-highlight:   var(--c-paper-deep);    /* table row highlight */
}
```

**Contrast ratios (WCAG):**
- `--c-ink` on `--c-paper`: ≈ 17.2:1 — AAA
- `--c-ink-mid` on `--c-paper`: ≈ 7.9:1 — AAA
- `--c-ink-light` on `--c-paper`: ≈ 3.8:1 — AA large text
- `--c-vermilion` on `--c-paper`: ≈ 5.1:1 — AA
- `--c-ink` on `--c-paper-deep`: ≈ 15.4:1 — AAA

---

## Typography

```css
/* Google Fonts CDN — OFL licensed */
@import url('https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

:root {
  --f-serif:  'Spectral', Georgia, 'Times New Roman', serif;
  --f-sans:   'Jost', system-ui, sans-serif;

  /* Type scale — base 18 px on 1920 px stage */
  --t-display:  clamp(2.4rem, 4.8vw, 5.2rem);   /* slide 1 title */
  --t-headline: clamp(1.6rem, 2.6vw, 3.0rem);   /* slide 2–3 headline */
  --t-subhead:  clamp(1.0rem, 1.4vw, 1.55rem);  /* section marker label, abstract */
  --t-body:     clamp(0.85rem, 1.0vw, 1.15rem);  /* body, table cells */
  --t-stat:     clamp(2.0rem, 3.2vw, 3.6rem);    /* stat figure */
  --t-label:    clamp(0.65rem, 0.75vw, 0.85rem); /* stat label, footnote */

  --lh-display: 1.10;
  --lh-headline: 1.20;
  --lh-body:  1.65;
  --lh-stat:  1.00;
}

/* Numeric figures */
.numeric, .stat-figure, td.num {
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: "lnum" 1, "tnum" 1;
}
```

---

## Background and Structural Elements (CSS)

```css
/* Deck stage — fixed 1920 × 1080 */
.deck-stage {
  width: 1920px;
  height: 1080px;
  background-color: var(--c-paper);
  position: relative;
  overflow: hidden;
}

/* Background layer — z-index 0 */
.slide-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: var(--c-paper);
  /* Subtle laid-paper texture via CSS noise — no image dependency */
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      oklch(0.94 0.012 68 / 0.25) 3px,
      oklch(0.94 0.012 68 / 0.25) 4px
    );
}

/* All semantic content — z-index 1 */
.slide-content {
  position: relative;
  z-index: 1;
}

/* Thin ink rule — horizontal */
.ink-rule {
  width: 100%;
  height: 0.5px;
  background-color: var(--c-rule);
  border: none;
}

/* Section marker — vermilion rule + small-caps label */
.section-marker {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 40px;
}
.section-marker::before {
  content: '';
  display: block;
  width: 48px;
  height: 0.5px;
  background-color: var(--c-vermilion);
  flex-shrink: 0;
}
.section-marker span {
  font-family: var(--f-sans);
  font-size: var(--t-label);
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-ink-mid);
}

/* Ink blot accent dot */
.ink-blot {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: var(--c-vermilion);
  flex-shrink: 0;
}

/* Folio */
.slide-folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--f-sans);
  font-size: var(--t-label);
  color: var(--c-ink-light);
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: 0.06em;
  z-index: 1;
}
```

---

## Layout Patterns (ASCII diagram)

**Slide 1 — Title**
```
┌─────────────────────────────────────────────────────────┐
│  [margin 120px]                                         │
│                                                         │
│  SECTION MARKER (rule + label)          top ~220px      │
│                                                         │
│  DISPLAY HEADLINE (serif, large)                        │
│  (max ~60% width, left-aligned)                         │
│                                                         │
│  ABSTRACT PARAGRAPH (2 sentences)                       │
│  (max 52% width)                                        │
│                                                         │
│  ── ink rule ────────────────────────────────────────   │
│  4-COL DETAIL ROW  |  detail  |  detail  |  detail      │
│                                                         │
│  [margin 120px]                                [folio]  │
└─────────────────────────────────────────────────────────┘
```

**Slide 2 — Evidence**
```
┌─────────────────────────────────────────────────────────┐
│  SECTION MARKER                          top ~180px     │
│                                                         │
│  HEADLINE (serif, ~72% width)                           │
│                                                         │
│  3-COL STAT ROW:                                        │
│  [blot] FIGURE   [blot] FIGURE   [blot] FIGURE          │
│  LABEL           LABEL           LABEL                  │
│                                                         │
│  EVIDENCE PARAGRAPH (~52% width, left)  │  ASIDE PANEL │
│                                         │  (32% width) │
│                                         │  stat + text │
│  [margin 120px]                                [folio]  │
└─────────────────────────────────────────────────────────┘
```

**Slide 3 — Comparison**
```
┌─────────────────────────────────────────────────────────┐
│  SECTION MARKER                          top ~180px     │
│                                                         │
│  HEADLINE (~68% width)                                  │
│                                                         │
│  COMPARISON TABLE (full width with margins)             │
│  ┌────────┬──────┬──────┬──────┬──────┬──────┐         │
│  │ header │  h2  │  h3  │  h4  │  h5  │  h6  │         │
│  ├────────┼──────┼──────┼──────┼──────┼──────┤         │
│  │  row   │      │      │      │      │      │ ← hi    │
│  │  row   │      │      │      │      │      │         │
│  └────────┴──────┴──────┴──────┴──────┴──────┘         │
│  FOOTNOTE (ink-light, small)                            │
│  [margin 120px]                                [folio]  │
└─────────────────────────────────────────────────────────┘
```

---

## Component Tokens

```css
/* Stat column */
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.stat-blot-row {
  display: flex;
  align-items: center;
  gap: 12px;
}
.stat-figure {
  font-family: var(--f-serif);
  font-size: var(--t-stat);
  font-weight: 300;
  line-height: var(--lh-stat);
  color: var(--c-ink);
  font-variant-numeric: lining-nums tabular-nums;
}
.stat-label {
  font-family: var(--f-sans);
  font-size: var(--t-label);
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--c-ink-mid);
  text-transform: uppercase;
  line-height: 1.4;
}

/* Comparison table */
.comp-table {
  width: 100%;
  border-collapse: collapse;
  border-top: 0.5px solid var(--c-rule);
  border-bottom: 0.5px solid var(--c-rule);
}
.comp-table th {
  font-family: var(--f-sans);
  font-size: var(--t-label);
  font-weight: 500;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--c-ink-mid);
  text-align: left;
  padding: 14px 18px;
  border-bottom: 0.5px solid var(--c-rule);
}
.comp-table th.num, .comp-table td.num {
  text-align: right;
  font-variant-numeric: lining-nums tabular-nums;
}
.comp-table td {
  font-family: var(--f-serif);
  font-size: var(--t-body);
  color: var(--c-ink);
  padding: 14px 18px;
  border-bottom: 0.5px solid oklch(0.18 0.012 40 / 0.25);
  vertical-align: top;
}
.comp-table tr.highlight td {
  background-color: var(--c-highlight);
  font-weight: 600;
}
.comp-table tr:last-child td {
  border-bottom: none;
}

/* Folio */
.slide-folio {
  font-family: var(--f-sans);
  font-size: var(--t-label);
  color: var(--c-ink-light);
  letter-spacing: 0.06em;
  font-variant-numeric: lining-nums tabular-nums;
}

/* Aside panel */
.aside-panel {
  border-left: 0.5px solid var(--c-rule);
  padding-left: 40px;
}
.aside-panel .aside-stat {
  font-family: var(--f-serif);
  font-size: 2.4rem;
  font-weight: 300;
  color: var(--c-vermilion);
  font-variant-numeric: lining-nums tabular-nums;
}
.aside-panel .aside-text {
  font-family: var(--f-serif);
  font-size: var(--t-body);
  color: var(--c-ink-mid);
  line-height: var(--lh-body);
  margin-top: 16px;
}

/* Detail row item */
.detail-item {
  flex: 1;
}
.detail-item .detail-label {
  font-family: var(--f-sans);
  font-size: var(--t-label);
  text-transform: uppercase;
  letter-spacing: 0.10em;
  color: var(--c-ink-light);
  margin-bottom: 6px;
}
.detail-item .detail-value {
  font-family: var(--f-serif);
  font-size: var(--t-body);
  color: var(--c-ink);
  line-height: 1.45;
}
```

---

## Print/Export Mode

```css
@media print {
  .nav-bar, .slide-folio { display: none; }
  .deck-stage {
    transform: none !important;
    width: 100vw;
    height: auto;
  }
  .slide { page-break-after: always; }
  /* Ink colors print well on white stock */
  :root {
    --c-paper: #faf7f1;
    --c-ink: #1a1714;
  }
}
```

---

## Accessibility (contrast ratios)

| Pairing | Ratio | WCAG |
|---|---|---|
| `--c-ink` on `--c-paper` | 17.2:1 | AAA |
| `--c-ink-mid` on `--c-paper` | 7.9:1 | AAA |
| `--c-ink-light` on `--c-paper` | 3.8:1 | AA (large text) |
| `--c-vermilion` on `--c-paper` | 5.1:1 | AA |
| `--c-ink` on `--c-paper-deep` | 15.4:1 | AAA |
| Table header (`--c-ink-mid`) on `--c-paper` | 7.9:1 | AAA |

All interactive UI (nav dots, prev/next) include `:focus-visible` ring in `--c-vermilion` at 2 px offset. Focus rings reach 3:1 against both surface and background. No information conveyed by color alone — table highlight row also uses bold weight.

---

## Differentiators from Sibling Styles (M Family)

| | M02 ink-illustration | Sibling styles (M family) |
|---|---|---|
| Color base | Warm cream + near-black ink + vermilion | Varies by sibling |
| Texture | Laid-paper CSS line pattern | May use SVG or image texture |
| Accent usage | Single 10 px ink blot + thin vermilion rules | May use brush stroke SVG or watercolor washes |
| Motion | None — fully static | Siblings may use reveal transitions |
| Typography | Spectral (serif with ink traps) + Jost | May use display/script fonts |
| Table style | Hairline 0.5 px rules, single highlight row | Siblings may use banded rows or bold borders |
| Occasion | Literary / cultural journalism | Siblings target different cultural niches |

---

## Fixed-stage content fit

The vw / clamp(...vw...) type values above are preview references. For a generated 1920×1080 deck, use fixed pixel type tokens and let the stage transform handle window scaling; otherwise text shrinks twice. Essential body copy follows knowledge/element/elements.md (normally 28–36px for speaker slides). Shorten copy, change layout, move explanation into speaker notes, or split the slide before reducing type size.
