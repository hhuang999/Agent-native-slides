# O02 — sand-dune

**Style ID:** O02  
**Family:** O (Nature/Earth)  
**Scheme:** Warm Arid Desert  
**Mood:** Elemental, dry, meditative, grounded  
**Occasion:** Middle East research, arid ecology, desert architecture, archaeological studies, climate adaptation  
**Academic Fit:** Earth sciences, environmental humanities, MENA regional studies, historical ecology, climate policy

---

## Design Philosophy (5D)

**Philosophy:** Desert as epistemic landscape — knowledge that endures like sandstone, stripped of ornament, shaped by necessity. The palette references adobe walls at dusk, the cross-section of a dried wadi, and the layered sediment visible in exposed cliff faces. Every element earns its place; nothing decorative survives the arid logic of the design.

**Hierarchy:** Headlines carry structural weight in Fraunces optical display italics — a typeface engineered for long-distance reading and intrinsic visual authority. Subheads and labels shift to Plus Jakarta Sans, a geometric humanist that reads cleanly at 14–18 px. The contrast between serif display and grotesque body creates legibility without requiring aggressive size differentials.

**Detail:** A 20 px × 1 px sienna rule replaces conventional bullet leaders and section markers — referencing desert strata and the incised lines of rammed-earth construction. Thin full-width border lines in muted sand separate zones without imposing hard containers. Table rows hover with a trace of warm amber rather than gray.

**Function:** For research-heavy audiences (academics, policy analysts, field scientists) who need data density without visual fatigue. The warm background reduces eye strain across long sessions. Terracotta accents direct attention without introducing chromatic noise; all data values receive tabular numeral treatment for column alignment.

**Innovation:** Fraunces' optical-size axis is exploited — headlines use `opsz 72` for maximum display quality, while running text shifts to `opsz 14` for comfortable body weight. The stat column format replaces drop shadows with a subtle warm border and a 20 px terracotta underline accent, creating a structural identity marker unique to the sand-dune family.

---

## Color System (OKLCH CSS Tokens)

```css
:root {
  /* Base surfaces */
  --color-bg:           oklch(0.94 0.030 68);   /* warm sandy beige */
  --color-bg-raised:    oklch(0.91 0.028 66);   /* slightly darker sand */
  --color-bg-sunken:    oklch(0.96 0.018 70);   /* bleached sand highlight */

  /* Borders */
  --color-border:       oklch(0.82 0.040 60);   /* sienna-tinted rule */
  --color-border-light: oklch(0.88 0.028 65);   /* soft divider */

  /* Text */
  --color-text-primary:   oklch(0.22 0.030 50); /* warm dark sienna */
  --color-text-secondary: oklch(0.40 0.032 55); /* medium sienna-brown */
  --color-text-muted:     oklch(0.58 0.028 60); /* dry sand caption */
  --color-text-inverse:   oklch(0.97 0.012 72); /* near-white on dark */

  /* Accent — terracotta / burnt orange */
  --color-accent:         oklch(0.52 0.18 36);  /* terracotta burnt orange */
  --color-accent-warm:    oklch(0.60 0.15 42);  /* lighter terracotta hover */
  --color-accent-deep:    oklch(0.42 0.16 32);  /* dark clay active */
  --color-accent-tint:    oklch(0.90 0.040 50); /* very pale terracotta wash */

  /* Semantic */
  --color-success:  oklch(0.52 0.12 148); /* dusty sage */
  --color-warning:  oklch(0.68 0.14 60);  /* amber sand */
  --color-danger:   oklch(0.46 0.18 28);  /* dark clay */
  --color-info:     oklch(0.52 0.10 230); /* arid sky blue */

  /* Stat accent bar */
  --stat-bar-color: var(--color-accent);  /* terracotta 20×1 px rule */
  --stat-bar-w:     20px;
  --stat-bar-h:     1px;
}
```

**Dark mode token overrides** (reduce chroma ~20%, raise lightness ~8–12% for accents):

```css
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg:             oklch(0.18 0.022 50);
    --color-bg-raised:      oklch(0.22 0.024 52);
    --color-bg-sunken:      oklch(0.15 0.018 48);
    --color-border:         oklch(0.32 0.030 55);
    --color-border-light:   oklch(0.28 0.022 52);
    --color-text-primary:   oklch(0.94 0.018 68);
    --color-text-secondary: oklch(0.76 0.022 64);
    --color-text-muted:     oklch(0.58 0.018 62);
    --color-accent:         oklch(0.62 0.15 36);
    --color-accent-warm:    oklch(0.68 0.13 40);
    --color-accent-tint:    oklch(0.26 0.06 42);
  }
}
```

---

## Typography (Google Fonts CDN, OFL Licenses)

```html
<!-- Google Fonts CDN import -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

```css
:root {
  /* Families */
  --font-display: 'Fraunces', Georgia, serif;
  --font-body:    'Plus Jakarta Sans', system-ui, sans-serif;

  /* Scale (1.25 major third) */
  --fs-xs:   11px;  /* captions, footnotes */
  --fs-sm:   13px;  /* labels, folio */
  --fs-base: 15px;  /* body text */
  --fs-md:   18px;  /* subheads, stat labels */
  --fs-lg:   22px;  /* section markers */
  --fs-xl:   28px;  /* slide subheadlines */
  --fs-2xl:  36px;  /* evidence headlines */
  --fs-3xl:  46px;  /* title slide headline */
  --fs-4xl:  58px;  /* hero display (rare) */

  /* Weights */
  --fw-light:    300;
  --fw-regular:  400;
  --fw-medium:   500;
  --fw-semibold: 600;
  --fw-bold:     700;

  /* Leading */
  --lh-tight:  1.15;
  --lh-snug:   1.30;
  --lh-base:   1.55;
  --lh-loose:  1.75;

  /* Tracking */
  --ls-tight:  -0.02em;
  --ls-normal:  0;
  --ls-wide:    0.06em;
  --ls-wider:   0.12em;
}
```

**Fraunces usage:** `font-optical-sizing: auto` or explicit `font-variation-settings: "opsz" 72` for large headlines, `"opsz" 14` for body-level display text. Use italic variant for section-marker labels.

**Numerics everywhere data appears:**
```css
.numeric {
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: "tnum" 1, "lnum" 1;
}
```

---

## Background and Structural Elements (CSS)

```css
/* Deck stage base */
.slide {
  background: var(--color-bg);
  position: relative;
  overflow: hidden;
}

/* Sandy grain texture (pure CSS — no image dependency) */
.slide::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 3px,
      oklch(0.90 0.022 66 / 0.18) 3px,
      oklch(0.90 0.022 66 / 0.18) 4px
    );
  pointer-events: none;
}

/* Horizontal strata rule — full width, 1 px */
.strata-rule {
  width: 100%;
  height: 1px;
  background: var(--color-border);
  margin: 0;
}

/* Strata rule (light) */
.strata-rule--light {
  background: var(--color-border-light);
}

/* Vertical sienna accent line (left-border variant) */
.accent-rail {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: var(--color-accent);
}

/* Dust vignette — very subtle warm darkening at bottom */
.slide::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background: radial-gradient(
    ellipse 120% 80% at 50% 120%,
    oklch(0.72 0.040 56 / 0.12) 0%,
    transparent 70%
  );
  pointer-events: none;
}
```

---

## Layout Patterns (ASCII Diagram)

### Slide 1 — Title

```
┌──────────────────────────────────────────────────────┐
│ [logo/org mark 32px]        [tag line small caps]    │ ← header row, z:1
├──────────────────────────────────────────────────────┤  ← strata rule
│                                                      │
│  Section label (italic Fraunces, fs-lg, muted)      │
│                                                      │
│  Headline                                            │
│  (Fraunces opsz:72, fw:700, lh:tight, 3xl–4xl)      │
│                                                      │
│  Abstract para (Plus Jakarta Sans, fs-base, lh:1.6) │
│                                                      │
├──────────────────────────────────────────────────────┤  ← strata rule
│  [detail col 1] │ [detail col 2] │ [detail col 3] │ [detail col 4]
└──────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence (Stats + Aside)

```
┌──────────────────────────────────────────────────────┐
│ [section marker]                                     │
│                                                      │
│  Headline (Fraunces, 2xl, fw:700, lh:snug)          │
│                                                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐             │
│  │ STAT    │  │ STAT    │  │ STAT    │             │
│  │ ──────  │  │ ──────  │  │ ──────  │  ← terracotta bar
│  │ label   │  │ label   │  │ label   │             │
│  └─────────┘  └─────────┘  └─────────┘             │
│                                                      │
│  Evidence paragraph (fs-base, lh:base)              │
├──────────────────────────────────────────────────────┤  ← strata rule
│  [Aside panel: supplementary stat + brief text]     │
└──────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison (Data Table + Footnote)

```
┌──────────────────────────────────────────────────────┐
│ [section marker]                                     │
│                                                      │
│  Headline (Fraunces, 2xl, fw:700, lh:snug)          │
│                                                      │
│  ┌────────────────────────────────────────────────┐  │
│  │ COL1     │ COL2  │ COL3  │ COL4  │ COL5  │    │  │
│  │──────────┼───────┼───────┼───────┼───────┼────│  │
│  │ row 1    │  ...  │  ...  │  ...  │  ...  │    │  │ ← highlighted
│  │ row 2    │  ...  │  ...  │  ...  │  ...  │    │  │
│  │ ...      │       │       │       │       │    │  │
│  └────────────────────────────────────────────────┘  │
│                                                      │
│  [Footnote text fs-xs muted]               [folio]  │
└──────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat Column

```css
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.stat-col__bar {
  width: var(--stat-bar-w);   /* 20px */
  height: var(--stat-bar-h);  /* 1px */
  background: var(--stat-bar-color);
  flex-shrink: 0;
}

.stat-col__value {
  font-family: var(--font-display);
  font-variation-settings: "opsz" 48, "wght" 700;
  font-size: var(--fs-3xl);
  line-height: var(--lh-tight);
  color: var(--color-text-primary);
  font-variant-numeric: lining-nums tabular-nums;
}

.stat-col__unit {
  font-family: var(--font-body);
  font-size: var(--fs-md);
  font-weight: var(--fw-medium);
  color: var(--color-accent);
  margin-left: 2px;
  vertical-align: top;
  line-height: 1.8;
}

.stat-col__label {
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  font-weight: var(--fw-medium);
  color: var(--color-text-secondary);
  letter-spacing: var(--ls-wide);
  text-transform: uppercase;
  line-height: var(--lh-snug);
}

.stat-col__note {
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  line-height: var(--lh-base);
}
```

### Comparison Table

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  font-variant-numeric: lining-nums tabular-nums;
}

.data-table th {
  font-size: var(--fs-xs);
  font-weight: var(--fw-semibold);
  letter-spacing: var(--ls-wider);
  text-transform: uppercase;
  color: var(--color-text-muted);
  padding: 10px 14px;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
  white-space: nowrap;
}

.data-table th.numeric,
.data-table td.numeric {
  text-align: right;
}

.data-table td {
  padding: 11px 14px;
  border-bottom: 1px solid var(--color-border-light);
  color: var(--color-text-primary);
  line-height: var(--lh-snug);
}

.data-table tr:hover td {
  background: oklch(0.90 0.035 58 / 0.50);
}

.data-table tr.highlighted td {
  background: var(--color-accent-tint);
  font-weight: var(--fw-semibold);
}

.data-table tr.highlighted td:first-child {
  border-left: 3px solid var(--color-accent);
  padding-left: 11px;
}
```

### Folio

```css
.slide-folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--font-body);
  font-size: var(--fs-xs);
  color: var(--color-text-muted);
  letter-spacing: var(--ls-wide);
  font-variant-numeric: lining-nums tabular-nums;
  z-index: 2;
}
```

### Aside Panel

```css
.aside-panel {
  background: var(--color-bg-raised);
  border-top: 1px solid var(--color-border);
  padding: 24px 48px;
  display: flex;
  align-items: center;
  gap: 40px;
}

.aside-panel__stat-value {
  font-family: var(--font-display);
  font-variation-settings: "opsz" 48, "wght" 700;
  font-size: var(--fs-2xl);
  color: var(--color-accent);
  font-variant-numeric: lining-nums tabular-nums;
  white-space: nowrap;
}

.aside-panel__text {
  font-family: var(--font-body);
  font-size: var(--fs-sm);
  color: var(--color-text-secondary);
  line-height: var(--lh-base);
}
```

---

## Print/Export Mode

```css
@media print {
  :root {
    --color-bg:           #f5ede0;
    --color-text-primary: #2a1a10;
    --color-accent:       #a0421a;
    --color-border:       #c8a882;
  }

  .nav-bar,
  .slide:not(.active) {
    display: none !important;
  }

  .slide.active {
    break-inside: avoid;
    page-break-after: always;
  }

  .slide::before,
  .slide::after {
    display: none;
  }
}
```

---

## Accessibility (Contrast Ratios)

| Pair | WCAG Ratio | Grade |
|------|-----------|-------|
| `--color-text-primary` on `--color-bg` | ~9.2:1 | AAA |
| `--color-text-secondary` on `--color-bg` | ~5.8:1 | AA |
| `--color-text-muted` on `--color-bg` | ~3.1:1 | AA Large |
| `--color-accent` on `--color-bg` | ~3.4:1 | AA Large |
| `--color-text-primary` on `--color-bg-raised` | ~8.6:1 | AAA |
| `--color-text-inverse` on `--color-accent` | ~4.6:1 | AA |

All body text uses `--color-text-primary` or `--color-text-secondary` which meet AA. Muted text restricted to non-informational captions. Accent color used for decorative elements and large-display stat values (>18pt) only — never as sole state indicator.

---

## Differentiators from Sibling Styles (O Family)

| | **O01 (assumed: forest/moss)** | **O02 sand-dune** | **O03 (assumed: ocean/coastal)** |
|---|---|---|---|
| Background | cool green-grey | warm sandy beige | cool blue-grey |
| Headline font | (varies) | Fraunces opsz italic | (varies) |
| Accent | moss green | terracotta | ocean teal |
| Rule style | organic | thin sienna strata | (varies) |
| Mood | humid, lush | arid, elemental | fluid, expansive |
| Stat bar | — | 20×1 px terracotta | — |

O02 is the only O-family style with variable-font optical-size exploitation in headlines, the Fraunces/Jakarta Sans pairing, and the horizontal strata rule system borrowed from geological section drawings.
