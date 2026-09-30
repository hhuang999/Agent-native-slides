# G04 — clean-academic-sans

**Style ID:** G04
**Family:** G (Academic/Journal)
**Scheme:** Monochromatic with institutional blue accent
**Mood:** Precise, authoritative, information-dense
**Occasion:** Natural sciences, engineering, quantitative social science, medical research
**Academic Fit:** Nature, Science, PNAS, Cell — high-impact STEM journals

---

## Design Philosophy (5D)

**Philosophy:** Every pixel serves evidence. Whitespace is used sparingly — the academic reader expects density, not breathing room. The slide reads like a well-typeset journal article: structured, hierarchical, no decorative distraction.

**Hierarchy:** Three visual tiers. Tier 1: section marker + headline (communicates the finding). Tier 2: data (stats, tables, charts — the evidence). Tier 3: annotation, caption, footnote (provenance and caveats). Each tier has a distinct size and weight so the reader can scan at any magnification.

**Detail:** Stat values carry a 2px left border in the accent blue — a deliberate citation-bracket motif. Table row stripes use near-white background alternation. Footnotes use small caps and hairline top border.

**Function:** DM Sans across all weights makes a single-family look that reads as editorial, not corporate. Tabular lining numerals throughout for column alignment.

**Innovation:** The section marker pattern (SECTION · TOPIC) mimics journal running heads, giving each slide a typographic address that tells the reader where they are in the argument. No icons, no illustrations — pure typographic hierarchy.

---

## Color System (OKLCH CSS Tokens)

```css
:root {
  /* Surfaces */
  --c-bg:          oklch(0.99 0 0);       /* near-white background */
  --c-bg-raised:   oklch(0.97 0 0);       /* card / aside background */
  --c-bg-stripe:   oklch(0.975 0 0);      /* table alternating row */
  --c-border:      oklch(0.88 0 0);       /* hairline borders */
  --c-border-mid:  oklch(0.82 0 0);       /* table column divider */

  /* Text */
  --c-text-head:   oklch(0.13 0 0);       /* headlines, near-black */
  --c-text-body:   oklch(0.22 0 0);       /* body copy */
  --c-text-muted:  oklch(0.48 0 0);       /* labels, captions */
  --c-text-faint:  oklch(0.65 0 0);       /* footnote, folio */

  /* Accent — institutional medium blue */
  --c-accent:      oklch(0.46 0.14 252);  /* primary accent */
  --c-accent-mid:  oklch(0.58 0.12 252);  /* hover / lighter blue */
  --c-accent-pale: oklch(0.93 0.04 252);  /* tint for highlight row */
  --c-accent-line: oklch(0.46 0.14 252);  /* stat left border */

  /* Semantic (tables) */
  --c-row-hl-bg:   oklch(0.93 0.04 252);  /* highlighted table row bg */
  --c-row-hl-text: oklch(0.22 0 0);       /* highlighted row text */
}
```

**Differentiators within G family:**
- G04 uses a single DM Sans family vs. G01's serif/sans pairing
- Accent blue is institutional (cooler, higher chroma) vs. G02's warm amber
- No animated elements; purely static for accessibility and print fidelity
- Stat accent is a left border, not a background fill — more inline with journal citation style

---

## Typography

```html
<!-- Google Fonts CDN (OFL licensed) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap" rel="stylesheet">
```

```css
:root {
  --font-main: 'DM Sans', Arial, 'Slides CJK Sans', system-ui, sans-serif;

  /* Type scale (base: 18px on 1920px stage) */
  --ts-xs:   14px;   /* footnote, folio */
  --ts-sm:   16px;   /* caption, label, section marker */
  --ts-base: 18px;   /* body paragraph */
  --ts-md:   22px;   /* aside stat label, table header */
  --ts-lg:   28px;   /* stat value */
  --ts-xl:   38px;   /* slide headline */
  --ts-2xl:  52px;   /* title slide headline */
  --ts-3xl:  72px;   /* large stat callout (if used) */

  /* Line heights */
  --lh-tight:  1.15;
  --lh-normal: 1.45;
  --lh-loose:  1.65;

  /* Weights */
  --fw-light:    300;
  --fw-regular:  400;
  --fw-medium:   500;
  --fw-semibold: 600;
  --fw-bold:     700;
}

/* Numeric alignment — applied to all stat/table values */
.num {
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: "lnum" 1, "tnum" 1;
}
```

---

## Background and Structural Elements

```css
/* Stage */
.deck-stage {
  width: 1920px;
  height: 1080px;
  background: var(--c-bg);
  font-family: var(--font-main);
  color: var(--c-text-body);
  position: relative;
  overflow: hidden;
}

/* Top rule — journal-page header line */
.slide::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 4px;
  background: var(--c-accent);
  z-index: 0;
}

/* Section marker strip */
.section-marker {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: var(--ts-sm);
  font-weight: var(--fw-semibold);
  color: var(--c-text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 24px;
}
.section-marker::before {
  content: '';
  display: block;
  width: 28px;
  height: 2px;
  background: var(--c-accent);
  flex-shrink: 0;
}

/* Structural grid — three-column content area */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 48px;
  align-items: start;
}

/* Two-column with aside */
.content-aside {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 56px;
  align-items: start;
}
```

---

## Layout Patterns

### Slide 1 — Title

```
┌─────────────────────────────────────────────────────────────────┐
│ [4px blue top bar]                                              │
│                                                                 │
│  [Institution logotype — all-caps, muted]         [folio]      │
│                                                                 │
│  ──────────────────────────────                                │
│                                                                 │
│  [HEADLINE: full A-E sentence, 52px bold, 60% width, centered] │
│                                                                 │
│  [Abstract: 2-sentence italic body, 420px wide, centered]      │
│                                                                 │
│  ──────────────────────────────                                │
│                                                                 │
│  [ Detail col 1 ] [ Detail col 2 ] [ Detail col 3 ] [ Col 4 ] │
│  label · value    label · value    label · value    label·val  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence (Stats + Aside)

```
┌─────────────────────────────────────────────────────────────────┐
│ [4px blue top bar]                                              │
│  SECTION MARKER                             [folio]            │
│  [HEADLINE: full A-E sentence, 38px bold, 55% width]           │
│                                                                 │
│  ┌──────────────────────────────┐  ┌─────────────────────┐     │
│  │ [stat] [stat] [stat]         │  │ ASIDE               │     │
│  │  (3-col stat row)            │  │ supplementary stat  │     │
│  │                              │  │ supporting text     │     │
│  │ [evidence paragraph, 18px]   │  └─────────────────────┘     │
│  └──────────────────────────────┘                               │
└─────────────────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison Table

```
┌─────────────────────────────────────────────────────────────────┐
│ [4px blue top bar]                                              │
│  SECTION MARKER                             [folio]            │
│  [HEADLINE: full A-E sentence, 38px bold, 60% width]           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ COL HDR 1 │ COL HDR 2 │ COL HDR 3 │ COL HDR 4 │ COL 5  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ row 1     │           │           │           │         │  │
│  │ row 2 ★  │ (highlight)│           │           │         │  │
│  │ row 3     │           │           │           │         │  │
│  │ row 4     │           │           │           │         │  │
│  │ row 5     │           │           │           │         │  │
│  └──────────────────────────────────────────────────────────┘  │
│  [footnote — hairline top, small caps, 14px]                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat Column

```css
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-left: 18px;
  border-left: 2px solid var(--c-accent-line);
}
.stat-col .stat-value {
  font-size: var(--ts-lg);          /* 28px */
  font-weight: var(--fw-bold);
  color: var(--c-text-head);
  font-variant-numeric: lining-nums tabular-nums;
  line-height: var(--lh-tight);
}
.stat-col .stat-label {
  font-size: var(--ts-sm);          /* 16px */
  font-weight: var(--fw-medium);
  color: var(--c-text-muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
.stat-col .stat-note {
  font-size: var(--ts-xs);          /* 14px */
  color: var(--c-text-faint);
  font-style: italic;
}
```

### Comparison Table

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--ts-base);
}
.data-table th {
  font-size: var(--ts-sm);
  font-weight: var(--fw-semibold);
  color: var(--c-text-muted);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 10px 20px;
  border-bottom: 2px solid var(--c-border-mid);
  text-align: left;
  font-variant-numeric: lining-nums tabular-nums;
}
.data-table td {
  padding: 14px 20px;
  border-bottom: 1px solid var(--c-border);
  color: var(--c-text-body);
  font-variant-numeric: lining-nums tabular-nums;
}
.data-table tr:nth-child(even) td {
  background: var(--c-bg-stripe);
}
.data-table tr.highlight td {
  background: var(--c-row-hl-bg);
  font-weight: var(--fw-semibold);
  color: var(--c-row-hl-text);
}
.data-table tr.highlight td:first-child {
  border-left: 3px solid var(--c-accent);
}
```

### Folio

```css
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-size: var(--ts-xs);
  color: var(--c-text-faint);
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: 0.05em;
}
```

### Footnote

```css
.footnote {
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px solid var(--c-border);
  font-size: var(--ts-xs);
  color: var(--c-text-faint);
  font-variant-small-caps: all-small-caps;
  line-height: var(--lh-loose);
  max-width: 1100px;
}
```

### Aside Panel

```css
.aside-panel {
  background: var(--c-bg-raised);
  border: 1px solid var(--c-border);
  border-radius: 4px;
  padding: 32px 28px;
}
.aside-panel .aside-stat {
  font-size: 42px;
  font-weight: var(--fw-bold);
  color: var(--c-accent);
  font-variant-numeric: lining-nums tabular-nums;
  line-height: 1;
  margin-bottom: 8px;
}
.aside-panel .aside-label {
  font-size: var(--ts-sm);
  font-weight: var(--fw-semibold);
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 16px;
}
.aside-panel .aside-text {
  font-size: var(--ts-sm);
  color: var(--c-text-body);
  line-height: var(--lh-loose);
}
```

---

## Print/Export Mode

```css
@media print {
  .nav-bar { display: none !important; }
  .slide { display: block !important; page-break-after: always; }
  :root {
    --c-bg: #fff;
    --c-text-head: #000;
    --c-text-body: #111;
  }
  .deck-stage {
    transform: none !important;
    width: 100%;
    height: auto;
  }
}
```

---

## Accessibility (Contrast Ratios)

| Pair | Foreground | Background | Ratio | Pass |
|---|---|---|---|---|
| Body text | `oklch(0.22 0 0)` ≈ #1f1f1f | `oklch(0.99 0 0)` ≈ #fcfcfc | ~15:1 | AAA |
| Headline | `oklch(0.13 0 0)` ≈ #111 | `oklch(0.99 0 0)` ≈ #fcfcfc | ~18:1 | AAA |
| Muted text | `oklch(0.48 0 0)` ≈ #6b6b6b | `oklch(0.99 0 0)` ≈ #fcfcfc | ~5.5:1 | AA |
| Accent text | `oklch(0.46 0.14 252)` ≈ #2d5fa6 | `oklch(0.99 0 0)` ≈ #fcfcfc | ~6.2:1 | AA |
| Aside stat | `oklch(0.46 0.14 252)` ≈ #2d5fa6 | `oklch(0.97 0 0)` ≈ #f7f7f7 | ~6.0:1 | AA |
| Faint text | `oklch(0.65 0 0)` ≈ #9a9a9a | `oklch(0.99 0 0)` ≈ #fcfcfc | ~3.1:1 | AA (large only) |

All interactive nav elements meet 4.5:1. Footnote and folio are non-essential metadata at small size; recommended to verify at actual rendering size.

---

## Differentiators from Sibling Styles in G Family

| Attribute | G04 clean-academic-sans | G01 (serif-academic) | G02 (warm-humanities) |
|---|---|---|---|
| Type family | DM Sans only (single-family) | Serif headline + sans body | Mixed warm palette |
| Accent hue | Institutional blue (cool, 252°) | Deep navy | Amber/warm |
| Stat treatment | 2px left border | Background fill | Icon + color |
| Animation | None | Subtle fade | Transition |
| Density | High — information-dense | Balanced | Spacious |
| Best for | STEM / quantitative | Humanities / social sci | Business / mixed |

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | DM Sans | Arial | Slides CJK Sans |
| Body | DM Sans | Arial | Slides CJK Sans |
| Auxiliary / data | DM Sans | Arial | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.
