# M01 — watercolor-wash

**Style ID:** M01
**Family:** M (Illustration / Artistic)
**Scheme:** Warm neutral ground + soft rose accent
**Mood:** Gentle, poetic, humanistic, contemplative
**Occasion:** Arts, culture, creative writing, poetry, museum communications, children's book publishing, design education
**Academic Fit:** Humanities, arts education, cultural studies, curatorial studies, literary studies

---

## Design Philosophy (5D)

**Philosophy**
Watercolor-wash evokes the materiality of handmade illustration: cream-tinted paper, pigment pooling in wet washes, and the warmth of analog mark-making. Every design choice serves that felt sense — texture without noise, warmth without kitsch, elegance without coldness.

**Hierarchy**
Tonal contrast drives hierarchy rather than bold weight contrasts. Playfair Display headlines carry authority through optical letterform weight and serifs; body copy in Lato 300 recedes gently. Color hierarchy uses the warm rose accent sparingly — only for the single most important number or label per slide.

**Detail**
The watercolor illusion comes from three layered radial gradients at very low opacity (3–6%) in soft pink, lilac, and pale gold, blurred with `filter: blur(80px)` on a pseudo-element. These pools shift position per slide to create variety while maintaining the same palette DNA.

**Function**
Legibility is paramount. All text sits on near-white ground well above WCAG AA. Stat columns use tabular lining numerals. The nav pill and folio are low-contrast enough not to compete with content but visible enough to locate at a glance.

**Innovation**
Multi-layer CSS radial gradient watercolor simulation achieves a hand-painted feel with zero image assets. The gradient positions vary per slide class, simulating different paper compositions within a single stylesheet.

**Differentiators from sibling M-family styles**
- M01 (watercolor-wash): warm, light, wet-media feel; pink/lilac/gold pool palette
- M02+ siblings would use different illustrative registers (e.g., risograph, linocut, gouache)

---

## Color System (OKLCH CSS tokens)

```css
:root {
  /* Ground */
  --color-surface:        oklch(0.97 0.010 65);   /* warm near-white — paper base */
  --color-surface-raised: oklch(0.95 0.012 65);   /* slightly warmer card surface */
  --color-border:         oklch(0.88 0.012 65);   /* soft warm separator */

  /* Text */
  --color-text-primary:   oklch(0.18 0.010 50);   /* warm near-black */
  --color-text-secondary: oklch(0.42 0.010 55);   /* warm mid-gray for captions */
  --color-text-muted:     oklch(0.62 0.008 60);   /* footnotes, folios */

  /* Accent */
  --color-accent:         oklch(0.58 0.14  10);   /* soft warm rose — primary accent */
  --color-accent-subtle:  oklch(0.92 0.030 10);   /* rose tint surface for aside panels */
  --color-accent-dim:     oklch(0.72 0.080 10);   /* mid rose for secondary marks */

  /* Watercolor pool pigments (used only as gradient stops, very low opacity) */
  --pool-pink:  oklch(0.90 0.030 10);
  --pool-lilac: oklch(0.88 0.025 300);
  --pool-gold:  oklch(0.92 0.025 72);

  /* Data / semantic */
  --color-highlight-row:  oklch(0.94 0.018 10);   /* table row highlight */
  --color-rule:           oklch(0.85 0.012 65);   /* thin HR / divider */
}
```

---

## Typography

### Google Fonts CDN import (OFL fonts only)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet">
```

### CSS typography variables

```css
:root {
  --font-display: 'Playfair Display', Georgia, 'Slides CJK Serif', 'Times New Roman', serif;
  --font-body:    'Lato', Arial, 'Slides CJK Sans', system-ui, sans-serif;

  /* Type scale (1920×1080 stage) */
  --text-xs:   13px;   /* footnotes, folios */
  --text-sm:   16px;   /* captions, labels */
  --text-base: 20px;   /* body copy */
  --text-md:   26px;   /* lead / abstract */
  --text-lg:   36px;   /* section markers, stat labels */
  --text-xl:   52px;   /* slide headline */
  --text-2xl:  72px;   /* hero title */
  --text-3xl:  96px;   /* large stat numerals */

  /* Line heights */
  --lh-tight:   1.15;
  --lh-heading: 1.25;
  --lh-body:    1.6;
  --lh-loose:   1.8;

  /* Numeric rendering */
  --nums: "lnum" 1, "tnum" 1;  /* lining + tabular */
}
```

### Usage rules
- All headlines: `font-family: var(--font-display); font-weight: 600; line-height: var(--lh-heading);`
- Italic pull-quote / aside: `font-family: var(--font-display); font-style: italic; font-weight: 400;`
- Body, captions, labels: `font-family: var(--font-body); font-weight: 300;`
- Stat numerals: `font-family: var(--font-display); font-variant-numeric: lining-nums tabular-nums;`

---

## Background and Structural Elements (CSS)

```css
/* Deck stage */
.deck-stage {
  width:  1920px;
  height: 1080px;
  background-color: var(--color-surface);
  position: relative;
  overflow: hidden;
}

/* Watercolor wash layer — z-index 0, always behind all content */
.deck-stage::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  /* Three radial pools simulating wet-on-wet watercolor bleeding */
  background:
    radial-gradient(ellipse 900px 600px at 15% 20%,
      color-mix(in oklch, var(--pool-pink) 22%, transparent) 0%,
      transparent 70%),
    radial-gradient(ellipse 700px 500px at 85% 75%,
      color-mix(in oklch, var(--pool-lilac) 18%, transparent) 0%,
      transparent 65%),
    radial-gradient(ellipse 600px 400px at 60% 15%,
      color-mix(in oklch, var(--pool-gold) 20%, transparent) 0%,
      transparent 60%);
  filter: blur(60px);
  pointer-events: none;
}

/* Slide content wrapper — always z-index 1 */
.slide {
  position: absolute;
  inset: 0;
  z-index: 1;
  display: none;
  flex-direction: column;
  padding: 80px 120px;
  box-sizing: border-box;
}
.slide.active {
  display: flex;
}

/* Slide variants shift pool positions for variety */
.slide--evidence::before {
  background:
    radial-gradient(ellipse 800px 550px at 80% 10%,
      color-mix(in oklch, var(--pool-pink) 20%, transparent) 0%, transparent 70%),
    radial-gradient(ellipse 650px 450px at 10% 80%,
      color-mix(in oklch, var(--pool-lilac) 16%, transparent) 0%, transparent 65%),
    radial-gradient(ellipse 500px 380px at 50% 50%,
      color-mix(in oklch, var(--pool-gold) 18%, transparent) 0%, transparent 60%);
}

/* Thin decorative rule — used below section markers */
.rule {
  width: 48px;
  height: 2px;
  background: var(--color-accent);
  border: none;
  margin: 16px 0;
  border-radius: 1px;
}
```

---

## Layout Patterns (ASCII diagram)

### Slide 1 — Title

```
┌─────────────────────────────────────────────────────────────────────────┐
│  [watercolor pool background, z-index 0]                                │
│                                                                         │
│  [logo / institution mark — top left]                [date — top right] │
│                                                                         │
│        ┌─────────────────────────────────────────────────────┐         │
│        │  INSTITUTION / SUBTITLE  (Lato 300, sm, muted)      │         │
│        │                                                     │         │
│        │  Headline full sentence                             │         │
│        │  (Playfair 600, xl–2xl, 3-4 lines, warm near-black) │         │
│        │                                                     │         │
│        │  Abstract paragraph (Lato 300, md, 2 sentences)    │         │
│        └─────────────────────────────────────────────────────┘         │
│                                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Detail 1 │  │ Detail 2 │  │ Detail 3 │  │ Detail 4 │  (4-col row)  │
│  │  label   │  │  label   │  │  label   │  │  label   │               │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘               │
│                                                              [folio]   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SECTION MARKER  [rule]                                                 │
│                                                                         │
│  Headline (Playfair 600, xl, 3 lines)                                  │
│                                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   ┌─────────────┐  │
│  │  Stat col 1 │  │  Stat col 2 │  │  Stat col 3 │   │ Aside panel │  │
│  │  numeral    │  │  numeral    │  │  numeral    │   │ (rose tint) │  │
│  │  label      │  │  label      │  │  label      │   │ italic pull │  │
│  └─────────────┘  └─────────────┘  └─────────────┘   └─────────────┘  │
│                                                                         │
│  Evidence paragraph (Lato 300, base, 3–4 lines)                        │
│                                                                         │
│                                                              [folio]   │
└─────────────────────────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison

```
┌─────────────────────────────────────────────────────────────────────────┐
│  SECTION MARKER  [rule]                                                 │
│                                                                         │
│  Headline (Playfair 600, xl, 3 lines)                                  │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │ Col 1          Col 2        Col 3        Col 4        Col 5       │  │
│  ├───────────────────────────────────────────────────────────────────┤  │
│  │ row 1                                                             │  │
│  │ row 2  ← highlighted                                              │  │
│  │ row 3                                                             │  │
│  │ row 4                                                             │  │
│  │ row 5                                                             │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│  Footnote (Lato 300, xs, muted)                                         │
│                                                              [folio]   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat columns

```css
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.stat-numeral {
  font-family: var(--font-display);
  font-size: var(--text-3xl);
  font-weight: 700;
  line-height: 1;
  color: var(--color-accent);
  font-variant-numeric: lining-nums tabular-nums;
}
.stat-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 300;
  color: var(--color-text-secondary);
  line-height: var(--lh-body);
  max-width: 220px;
}
```

### Data table

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: var(--text-sm);
}
.data-table th {
  font-weight: 400;
  color: var(--color-text-muted);
  text-align: left;
  padding: 10px 16px;
  border-bottom: 1.5px solid var(--color-border);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.data-table td {
  padding: 12px 16px;
  color: var(--color-text-primary);
  font-weight: 300;
  border-bottom: 1px solid var(--color-rule);
  font-variant-numeric: lining-nums tabular-nums;
}
.data-table tr.highlight td {
  background: var(--color-highlight-row);
  font-weight: 400;
}
.data-table tr.highlight td:first-child {
  border-left: 3px solid var(--color-accent);
}
```

### Folio

```css
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 300;
  color: var(--color-text-muted);
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: 0.04em;
}
```

### Aside panel

```css
.aside-panel {
  background: var(--color-accent-subtle);
  border-left: 3px solid var(--color-accent);
  border-radius: 4px;
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.aside-numeral {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 700;
  color: var(--color-accent);
  font-variant-numeric: lining-nums tabular-nums;
}
.aside-text {
  font-family: var(--font-display);
  font-style: italic;
  font-size: var(--text-base);
  font-weight: 400;
  color: var(--color-text-secondary);
  line-height: var(--lh-body);
}
```

### Detail row (slide 1)

```css
.detail-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border-top: 1px solid var(--color-border);
  margin-top: 40px;
}
.detail-cell {
  padding: 20px 0;
  border-right: 1px solid var(--color-border);
  padding-right: 32px;
  padding-left: 0;
}
.detail-cell:not(:first-child) {
  padding-left: 32px;
}
.detail-cell:last-child {
  border-right: none;
}
.detail-label {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 400;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 6px;
}
.detail-value {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 300;
  color: var(--color-text-primary);
  line-height: var(--lh-body);
}
```

---

## Print / Export Mode

```css
@media print {
  .deck-stage::before { display: none; }
  .nav-bar            { display: none !important; }
  .slide              { display: flex !important; page-break-after: always; }
  .slide:last-child   { page-break-after: auto; }
  body                { background: white; }
}
```

---

## Accessibility (contrast ratios)

| Token pair                              | Approx ratio | WCAG level |
|-----------------------------------------|-------------|------------|
| `--color-text-primary` on `--surface`  | ~16:1       | AAA        |
| `--color-text-secondary` on `--surface`| ~8.5:1      | AAA        |
| `--color-text-muted` on `--surface`    | ~4.8:1      | AA         |
| `--color-accent` on `--surface`        | ~4.6:1      | AA (large) |
| `--color-text-primary` on `--highlight-row` | ~14:1 | AAA        |
| Table header (`muted`) on surface      | ~4.8:1      | AA         |

All interactive elements (nav dots, prev/next buttons) have `:focus-visible` rings using `outline: 2px solid var(--color-accent); outline-offset: 3px`.

Watercolor pool pseudo-element is `pointer-events: none` and carries no semantic content.

`prefers-reduced-motion` fallback: no transitions or animations are applied by default (the style is static). If animation is added (e.g., slide fade-in), wrap in `@media (prefers-reduced-motion: no-preference)`.

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | Playfair Display | Georgia | Slides CJK Serif |
| Body | Lato | Arial | Slides CJK Sans |
| Auxiliary / data | Lato | Arial | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.
