# K03 — dusty-rose-editorial

**Style ID:** K03  
**Family:** K (Premium/Luxury)  
**Scheme:** Muted Warm Rose  
**Mood:** Serene, Editorial, Contemplative  
**Occasion:** Luxury beauty, wellness, hospitality, fashion editorial, premium consumer goods, lifestyle brands  
**Academic Fit:** Low — best for brand storytelling, executive lifestyle presentations, investor aesthetics for premium consumer companies

---

## Design Philosophy (5D)

**Philosophy:** Restraint as luxury. Every element earns its place through negative space and tonal relationships rather than decoration. The palette reads as warmth without asserting itself — rose that has been left out in the light until it softened. Inspired by Kinfolk and Cereal magazines: content-forward, unhurried, quietly confident.

**Hierarchy:** Headlines carry all assertion weight through size and weight contrast alone. No color-coded hierarchy — rank is communicated through typographic scale: Libre Baskerville at display size for the claim, Raleway 300 for support. The eye moves top-to-bottom, not side-to-side.

**Detail:** The 12 × 12 px mauve square is the only decorative mark allowed. It appears as a stat accent bullet, a section separator, and a table row indicator. Used sparingly — never more than four on a slide. Hairline rules (1px, 20% opacity) separate content zones without weight.

**Function:** Data must be scannable: tabular numerals, consistent column widths, clear row separation. The aside panel introduces a secondary information register without competing with the main argument. Footnotes use Raleway 300 at 11px — present but recessive.

**Innovation:** The muted palette is systemically derived — every swatch is the base hue shifted in OKLCH lightness and chroma, not a hand-picked color. This guarantees the palette looks like one surface lit differently rather than a collage of similar colors.

---

## Color System (OKLCH CSS Tokens)

```css
:root {
  /* Background surfaces */
  --color-bg-stage:     oklch(0.93 0.022 10);   /* warm rose parchment — deck stage */
  --color-bg-card:      oklch(0.96 0.012 12);   /* slightly lighter card surface */
  --color-bg-aside:     oklch(0.89 0.030 12);   /* deeper rose for aside panel */
  --color-bg-table-row: oklch(0.91 0.018 10);   /* alternating row tint */
  --color-bg-highlight: oklch(0.87 0.038 330);  /* mauve-tinted highlight row */

  /* Text */
  --color-text-primary:   oklch(0.16 0.012 15); /* warm near-black for headlines */
  --color-text-secondary: oklch(0.30 0.014 15); /* mid-dark for body text */
  --color-text-muted:     oklch(0.52 0.010 15); /* captions, footnotes */
  --color-text-on-aside:  oklch(0.18 0.014 15); /* text inside aside panel */

  /* Accent — deep dusty mauve */
  --color-accent:         oklch(0.42 0.10 330);  /* primary accent: stat marks, links */
  --color-accent-light:   oklch(0.62 0.06 330);  /* lighter mauve for borders, icons */
  --color-accent-rule:    oklch(0.72 0.04 330);  /* very light mauve hairline */

  /* Functional */
  --color-border:         oklch(0.82 0.018 12);  /* card/table border */
  --color-border-strong:  oklch(0.65 0.025 15);  /* section divider */
  --color-folio:          oklch(0.52 0.010 15);  /* slide number */
}
```

---

## Typography

### Google Fonts CDN Import

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Raleway:wght@300;400;500&display=swap" rel="stylesheet">
```

Both fonts are OFL (SIL Open Font License) — fully free.

### CSS Variables and Scale

```css
:root {
  --font-display:  'Libre Baskerville', Georgia, serif;   /* headlines, deck title */
  --font-body:     'Raleway', system-ui, sans-serif;      /* body, stats, captions */

  /* Type scale */
  --text-display:  clamp(2.4rem, 3.8vw, 3.6rem);  /* slide title */
  --text-h1:       clamp(1.6rem, 2.4vw, 2.2rem);  /* section headline */
  --text-h2:       clamp(1.1rem, 1.6vw, 1.4rem);  /* stat number */
  --text-body:     clamp(0.9rem, 1.2vw, 1.05rem); /* body paragraph */
  --text-label:    0.75rem;                        /* caption, column label */
  --text-footnote: 0.688rem;                       /* footnote (11px) */

  /* Leading */
  --lh-display: 1.20;
  --lh-h1:      1.28;
  --lh-body:    1.72;  /* generous — editorial breathing room */
  --lh-label:   1.45;

  /* Tracking */
  --ls-label:   0.08em;  /* spaced-out uppercase labels */
  --ls-display: -0.01em; /* slight negative for large serif */

  /* Numeric rendering */
  font-variant-numeric: lining-nums tabular-nums; /* applied to all numeric elements */
}
```

---

## Background and Structural Elements

```css
/* Stage */
.slide-stage {
  background-color: var(--color-bg-stage);
  /* No gradient, no texture — flat warm rose */
}

/* Stat accent mark — 12×12 mauve square */
.stat-mark {
  display: inline-block;
  width: 12px;
  height: 12px;
  background-color: var(--color-accent);
  flex-shrink: 0;
}

/* Section marker label */
.section-marker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-body);
  font-weight: 300;
  font-size: var(--text-label);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--color-accent);
}

/* Hairline rule */
.rule-h {
  border: none;
  border-top: 1px solid var(--color-accent-rule);
  margin: 0;
}

/* Card surface */
.card {
  background: var(--color-bg-card);
  border: 1px solid var(--color-border);
  border-radius: 2px; /* near-flush — editorial, not rounded */
}

/* Aside panel */
.aside-panel {
  background: var(--color-bg-aside);
  border-left: 3px solid var(--color-accent);
  padding: 32px 28px;
}

/* Z-index contract */
.bg-layer  { z-index: 0; position: absolute; inset: 0; }
.content   { z-index: 1; position: relative; }
```

---

## Layout Patterns

### Slide 1 — Title Slide

```
┌─────────────────────────────────────────────────────────────────┐
│  [48px top padding]                                             │
│  SECTION MARKER (small caps, mauve)                            │
│  ─────────────────────────── hairline                         │
│                                                                 │
│  HEADLINE (Libre Baskerville, display, warm black)              │
│  [3-4 lines, left-aligned, generous leading]                    │
│                                                                 │
│  Abstract paragraph (Raleway 300, body size, secondary color)   │
│  [2 sentences, 60-char measure]                                 │
│                                                                 │
│  ─────────────────────────── hairline                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│  │ LABEL    │ │ LABEL    │ │ LABEL    │ │ LABEL    │          │
│  │ Value    │ │ Value    │ │ Value    │ │ Value    │          │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘          │
│                                                                 │
│                                              [folio] ●●●       │
└─────────────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence + Aside

```
┌──────────────────────────────────────┬──────────────────────────┐
│  SECTION MARKER                      │  ASIDE PANEL             │
│  ─────────────── hairline            │  (deeper rose bg)        │
│  HEADLINE (display serif)            │  ■ Stat                  │
│                                      │  Supporting text         │
│  ┌────────┐ ┌────────┐ ┌────────┐    │                          │
│  │■ STAT  │ │■ STAT  │ │■ STAT  │    │                          │
│  │ label  │ │ label  │ │ label  │    │                          │
│  └────────┘ └────────┘ └────────┘    │                          │
│                                      │                          │
│  Evidence paragraph (Raleway 300)    │                          │
│                                      │                          │
│                          [folio] ●●● │                          │
└──────────────────────────────────────┴──────────────────────────┘
  ~65% main                              ~35% aside
```

### Slide 3 — Comparison Table

```
┌─────────────────────────────────────────────────────────────────┐
│  SECTION MARKER + hairline                                      │
│  HEADLINE (display serif, 2-3 lines)                            │
│                                                                 │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐      │
│  │ PROG.    │ METRIC 1 │ METRIC 2 │ METRIC 3 │ METRIC 4 │      │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┤      │
│  │ Row A    │   —      │   —      │   —      │   —      │      │
│  │ ★Row B   │   —      │   —      │   —      │   —      │ ← highlight
│  │ Row C    │   —      │   —      │   —      │   —      │      │
│  │ Row D    │   —      │   —      │   —      │   —      │      │
│  │ Row E    │   —      │   —      │   —      │   —      │      │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘      │
│                                                                 │
│  ¹ Footnote text (Raleway 300, 11px, muted)         [folio] ●● │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat Column

```css
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px 24px;
  border-top: 1px solid var(--color-accent-rule);
}
.stat-col__mark {
  width: 12px; height: 12px;
  background: var(--color-accent);
  flex-shrink: 0;
}
.stat-col__number {
  font-family: var(--font-body);
  font-weight: 400;
  font-size: var(--text-h2);
  color: var(--color-text-primary);
  font-variant-numeric: lining-nums tabular-nums;
  line-height: 1.1;
}
.stat-col__label {
  font-family: var(--font-body);
  font-weight: 300;
  font-size: var(--text-label);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--color-text-muted);
}
```

### Comparison Table

```css
.comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-weight: 300;
  font-size: var(--text-body);
  font-variant-numeric: lining-nums tabular-nums;
}
.comparison-table th {
  font-weight: 400;
  font-size: var(--text-label);
  letter-spacing: var(--ls-label);
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border-strong);
  padding: 10px 16px;
  text-align: left;
}
.comparison-table td {
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text-secondary);
}
.comparison-table tr.highlight {
  background: var(--color-bg-highlight);
}
.comparison-table tr.highlight td {
  color: var(--color-text-primary);
  font-weight: 400;
}
```

### Folio

```css
.slide-folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--font-body);
  font-weight: 300;
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--color-folio);
  font-variant-numeric: lining-nums tabular-nums;
}
```

---

## Print/Export Mode

```css
@media print {
  .slide-nav { display: none !important; }
  .slide { display: block !important; page-break-after: always; }
  .slide-stage {
    transform: none !important;
    width: 297mm; height: 167mm; /* A4 landscape */
  }
  /* Preserve warm rose background in print */
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
```

---

## Accessibility (Contrast Ratios)

All ratios calculated against `--color-bg-stage` oklch(0.93 0.022 10) unless noted.

| Token pair | Approx ratio | WCAG level |
|---|---|---|
| `--color-text-primary` on `--color-bg-stage` | ~11.2:1 | AAA |
| `--color-text-secondary` on `--color-bg-stage` | ~7.8:1 | AAA |
| `--color-text-muted` on `--color-bg-stage` | ~4.6:1 | AA |
| `--color-accent` on `--color-bg-stage` | ~4.8:1 | AA |
| `--color-text-on-aside` on `--color-bg-aside` | ~9.4:1 | AAA |
| `--color-text-primary` on `--color-bg-highlight` | ~9.1:1 | AAA |

State indicators (focused, highlighted row) pair color change with border weight change — never color alone.

---

## Differentiators from Sibling K-Family Styles

| Dimension | K03 dusty-rose-editorial | K01/K02 (assumed dark luxury) |
|---|---|---|
| Base surface | Warm light rose — airy | Dark near-black — dramatic |
| Typeface mode | Serif display + thin sans | Likely sans-dominant |
| Animation | None — completely static | May include entrance motion |
| Accent mark | 12×12 mauve square | Likely gold or line motif |
| Density | Low — magazine breathing room | Medium — denser data tolerance |
| Color chroma | Deliberately desaturated | May use richer metallics |
| Best for | Lifestyle, wellness, beauty | Finance, spirits, hospitality |
