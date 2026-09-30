# J03 — light-engineering

**Style ID:** J03  
**Family:** J (Technical/Engineering)  
**Scheme:** Light / High-contrast  
**Mood:** Precise, Information-dense, Authoritative  
**Occasion:** Engineering presentations, technical specifications, academic CS/EE, product documentation, IEEE/ACM conference slides  
**Academic Fit:** Excellent — CS, EE, mechanical engineering, materials science, aerospace

---

## Design Philosophy (5D)

**Philosophy:** Fidelity to the engineering document aesthetic. Every pixel serves information. Whitespace is earned, not generous. The slide reads like a well-typeset technical report: structure is visible, hierarchy is unambiguous, ornament is absent. The blueprint grid recalls CAD annotation sheets and drafting tables — a quiet cultural signal for engineers.

**Hierarchy:** Two-typeface system. IBM Plex Serif carries headlines with institutional weight — the same family used in scientific publishing. IBM Plex Sans handles all body, labels, captions, and numerical values with the mono companion available for code, model IDs, and specimen labels. Size scale is conservative (headline 44px → body 16px) because information density is valued over impact.

**Detail:** Blueprint grid at 40px × 40px is rendered at 1% opacity so it disappears at a glance but rewards full-screen viewing with spatial reference. Dimension lines, tick marks, and rule accents are drawn with the accent blue at 1px — hairline weight matching engineering drawing conventions. Stat columns carry a 1px solid left border in accent blue, recalling measurement callouts.

**Function:** Three-slide structure maps directly to engineering report sections: introduction/claim (Title), evidence/analysis (Data), and comparative evaluation (Comparison Table). Folio at bottom-right mirrors the title-block conventions of engineering drawings.

**Innovation:** The sole decorative element is the repeating CSS grid. All other visual interest comes from precise typographic sizing, alignment to an 8px grid, and the restrained use of the accent blue. This self-imposes a discipline that generates trust with technical audiences.

---

## Color System (OKLCH CSS tokens)

```css
:root {
  /* Surfaces */
  --c-bg:           oklch(0.99 0 0);          /* slide background, near-white */
  --c-surface:      oklch(0.97 0.002 240);    /* card / aside background */
  --c-surface-alt:  oklch(0.94 0.003 240);    /* table row alt, rule fills */
  --c-grid-line:    oklch(0.90 0.004 200);    /* blueprint grid strokes */
  --c-border:       oklch(0.82 0.006 240);    /* table borders, dividers */

  /* Text */
  --c-text-head:    oklch(0.18 0.010 258);    /* headline, near-black blue-tinted */
  --c-text-body:    oklch(0.30 0.008 258);    /* body prose */
  --c-text-muted:   oklch(0.50 0.006 258);    /* captions, footnotes, folio */
  --c-text-label:   oklch(0.40 0.010 258);    /* column headers, section labels */

  /* Accent */
  --c-accent:       oklch(0.50 0.16 258);     /* primary blue — stat rules, links */
  --c-accent-dim:   oklch(0.65 0.10 258);     /* lighter accent — hover, inactive */
  --c-accent-bg:    oklch(0.95 0.030 258);    /* accent tint — highlighted row bg */

  /* Semantic */
  --c-success:      oklch(0.52 0.14 162);     /* green for positive deltas */
  --c-warning:      oklch(0.62 0.14  75);     /* amber for caution values */
  --c-danger:       oklch(0.52 0.16  25);     /* red for failure / negative */
}
```

**Contrast ratios (WCAG AA)**  
- `--c-text-head` on `--c-bg`: ≈ 14.8:1 (AAA)  
- `--c-text-body` on `--c-bg`: ≈ 9.4:1 (AAA)  
- `--c-text-muted` on `--c-bg`: ≈ 4.6:1 (AA)  
- `--c-accent` on `--c-bg`: ≈ 4.7:1 (AA, large text)  
- White on `--c-accent`: ≈ 4.7:1 (AA — suitable for filled badge chips ≥18px)

---

## Typography

```css
/* Google Fonts CDN — OFL licensed */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,300;0,400;0,600;1,400&family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');

:root {
  --font-head:  'IBM Plex Serif', Georgia, 'Slides CJK Serif', serif;    /* headlines, slide title */
  --font-body:  'IBM Plex Sans', Arial, 'Slides CJK Sans', system-ui, sans-serif;  /* body, labels, UI */
  --font-mono:  'IBM Plex Mono', Consolas, 'Slides CJK Sans', 'Courier New', monospace; /* code, IDs, values */

  /* Scale — 1.250 major third */
  --fs-display: 44px;   /* slide title */
  --fs-h1:      32px;   /* section headline */
  --fs-h2:      24px;   /* sub-section */
  --fs-body:    16px;   /* body prose */
  --fs-label:   13px;   /* column headers, metadata */
  --fs-caption: 11px;   /* footnotes, folio */

  /* Leading */
  --lh-head:    1.20;
  --lh-body:    1.65;
  --lh-tight:   1.10;

  /* Numeric rendering */
  font-variant-numeric: lining-nums tabular-nums;
}
```

**Usage notes:**  
- Headlines in IBM Plex Serif weight 300 (light) or 600 (semibold) — avoid 400 for large display, it reads too neutral  
- IBM Plex Sans 400 for body, 500 for labels/headers, 600 for stat values only  
- IBM Plex Mono for model names, specimen IDs, measurement values in tables  
- All numeric strings: `font-variant-numeric: lining-nums tabular-nums`

---

## Background and Structural Elements (CSS)

```css
/* Blueprint grid — dual-pitch repeating gradient */
.slide-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: var(--c-bg);
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 39px,
      oklch(0.90 0.004 200 / 0.10) 39px,
      oklch(0.90 0.004 200 / 0.10) 40px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 39px,
      oklch(0.90 0.004 200 / 0.10) 39px,
      oklch(0.90 0.004 200 / 0.10) 40px
    );
}

/* Accent left rule — used on stat columns and aside panels */
.rule-left {
  border-left: 1px solid var(--c-accent);
  padding-left: 16px;
}

/* Section label chip — uppercase, monospaced, muted */
.section-label {
  font-family: var(--font-mono);
  font-size: var(--fs-label);
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-text-muted);
}

/* Hairline horizontal rule */
.rule-h {
  border: none;
  border-top: 1px solid var(--c-border);
  margin: 0;
}

/* Dimension line accent — decorative top rule on slide */
.slide-accent-bar {
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 2px;
  background: var(--c-accent);
  z-index: 2;
}
```

---

## Layout Patterns (ASCII diagram)

### Slide 1 — Title

```
┌──────────────────────────────────────────────────────┐
│ ▐ 2px accent top bar                                 │
│                                                       │
│  SECTION LABEL  ·  INSTITUTION NAME           folio  │
│  ───────────────────────────────────────────────────  │
│                                                       │
│  [IBM Plex Serif 44px, weight 300, max-width 860px]  │
│   HEADLINE — full A-E sentence, 2–3 lines            │
│                                                       │
│  [Abstract body text, 2 sentences, IBM Plex Sans]    │
│                                                       │
│  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐            │
│  │ COL1 │  │ COL2 │  │ COL3 │  │ COL4 │  4-col row  │
│  └──────┘  └──────┘  └──────┘  └──────┘            │
│                                                       │
│                                              folio    │
└──────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence + Aside

```
┌──────────────────────────────────────────────────────┐
│ ▐ accent bar                                          │
│  SECTION §2                                           │
│  HEADLINE (IBM Plex Serif 32px)                       │
│  ────────────────────────────────────────────────     │
│                                                       │
│  ┌──────┐  ┌──────┐  ┌──────┐   ┌───────────────┐  │
│  │ STAT │  │ STAT │  │ STAT │   │ ASIDE PANEL   │  │
│  │  ◀─  │  │  ◀─  │  │  ◀─  │   │ supp. stat +  │  │
│  │ rule │  │ rule │  │ rule │   │ note text     │  │
│  └──────┘  └──────┘  └──────┘   └───────────────┘  │
│                                                       │
│  Evidence paragraph (prose, IBM Plex Sans 16px)       │
│                                                       │
│                                               folio   │
└──────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison Table

```
┌──────────────────────────────────────────────────────┐
│ ▐ accent bar                                          │
│  SECTION §3                                           │
│  HEADLINE (IBM Plex Serif 32px)                       │
│  ────────────────────────────────────────────────     │
│                                                       │
│  ┌──────────────────────────────────────────────┐    │
│  │ COL HDR │ COL HDR │ COL HDR │ COL HDR │ …   │    │
│  ├──────────────────────────────────────────────┤    │
│  │ row …   │   val   │   val   │   val   │ …   │    │
│  │ BEST ★  │   val   │   val   │   val   │ …   │◀── highlighted row
│  │ row …   │   val   │   val   │   val   │ …   │    │
│  └──────────────────────────────────────────────┘    │
│                                                       │
│  † Footnote text (mono, 11px, muted)          folio  │
└──────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat Column

```css
.stat-col {
  border-left: 1px solid var(--c-accent);
  padding-left: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.stat-col__value {
  font-family: var(--font-body);
  font-size: 40px;
  font-weight: 600;
  line-height: 1.0;
  color: var(--c-text-head);
  font-variant-numeric: lining-nums tabular-nums;
}
.stat-col__unit {
  font-family: var(--font-mono);
  font-size: 13px;
  font-weight: 500;
  color: var(--c-accent);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.stat-col__label {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--c-text-muted);
  line-height: 1.4;
  max-width: 180px;
}
```

### Comparison Table

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: 15px;
  font-variant-numeric: lining-nums tabular-nums;
}
.data-table th {
  font-family: var(--font-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-text-label);
  border-bottom: 1px solid var(--c-border);
  padding: 8px 12px;
  text-align: left;
}
.data-table th:not(:first-child) { text-align: right; }
.data-table td {
  padding: 9px 12px;
  border-bottom: 1px solid var(--c-surface-alt);
  color: var(--c-text-body);
  vertical-align: middle;
}
.data-table td:not(:first-child) {
  text-align: right;
  font-family: var(--font-mono);
}
.data-table tr:nth-child(even) td { background: var(--c-surface); }
.data-table tr.highlight td {
  background: var(--c-accent-bg);
  color: var(--c-text-head);
  font-weight: 500;
}
.data-table tr.highlight td:first-child::before {
  content: '★ ';
  color: var(--c-accent);
  font-size: 12px;
}
```

### Folio

```css
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--c-text-muted);
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: 0.04em;
}
```

### Aside Panel

```css
.aside-panel {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-left: 2px solid var(--c-accent);
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.aside-panel__stat {
  font-size: 32px;
  font-weight: 600;
  color: var(--c-text-head);
  font-variant-numeric: lining-nums tabular-nums;
}
.aside-panel__text {
  font-size: 13px;
  color: var(--c-text-muted);
  line-height: 1.55;
}
```

---

## Print/Export Mode

```css
@media print {
  .slide-bg {
    background-image: none !important; /* remove grid for print */
    background-color: #fff;
  }
  .slide-accent-bar { display: none; }
  .nav-bar { display: none !important; }
  .folio { color: #666; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
```

For PDF export: render at 1920×1080, scale 1:1. Blueprint grid is intentionally suppressed in print mode to reduce toner cost and maintain readability.

---

## Accessibility (contrast ratios)

| Token pair | Ratio | WCAG level |
|---|---|---|
| `--c-text-head` on `--c-bg` | 14.8:1 | AAA |
| `--c-text-body` on `--c-bg` | 9.4:1 | AAA |
| `--c-text-muted` on `--c-bg` | 4.6:1 | AA |
| `--c-text-label` on `--c-bg` | 6.8:1 | AAA |
| `--c-accent` on `--c-bg` | 4.7:1 | AA (large) |
| `--c-text-head` on `--c-accent-bg` | 11.2:1 | AAA |
| `--c-text-body` on `--c-surface` | 8.6:1 | AAA |

All interactive controls meet 44px minimum touch target. Focus rings use `outline: 2px solid var(--c-accent); outline-offset: 2px`. Reduced-motion: all CSS transitions and animations gated by `@media (prefers-reduced-motion: reduce)`.

---

## Differentiators from J-family siblings

| Aspect | J03 light-engineering | J01 blueprint-dark | J02 datasheet |
|---|---|---|---|
| Background | Near-white, day use | Deep navy, dramatic | Pure white, minimal |
| Grid | Subtle warm-grid, 10% opacity | Dense blue-white grid | No grid |
| Typography | IBM Plex Serif + Sans | Space Grotesk mono | Inter, tabular only |
| Accent | Medium blue 258° | Cyan 200° | Orange-amber |
| Stat rule | 1px solid left rule | 2px accent glow | Bottom rule |
| Tone | Technical report | Night-mode dashboard | Product datasheet |

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | IBM Plex Serif | Georgia | Slides CJK Serif |
| Body | IBM Plex Sans | Arial | Slides CJK Sans |
| Auxiliary / data | IBM Plex Mono | Consolas | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.
