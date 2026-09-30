# H01 — primer-clean

**Style ID:** H01
**Family:** H (Corporate/Business)
**Scheme:** Light / White
**Mood:** Authoritative, minimal, zero-decoration
**Occasion:** Consulting, strategy, finance, corporate reporting, board presentations
**Academic Fit:** Low — purpose-built for professional business contexts

---

## Design Philosophy (5D)

**Philosophy:** Authority through restraint. Every pixel either carries information or creates breathing room — nothing decorates. Inspired by McKinsey, BCG, and Deloitte slide aesthetics where structure emerges entirely from typographic hierarchy and whitespace. The white field is the statement.

**Hierarchy:** Four-level typographic scale does all the work. Section marker → Headline → Body → Caption. Color is never used for emphasis — weight and size alone separate levels. The sole color accent appears only as a 1px top border on stat columns, anchoring data without ornamentation.

**Detail:** No icons, no rules, no gradients, no shadows. Table borders are hairlines. Stat numerals are large but not theatrical. The folio is the only element below the content field.

**Function:** Ultra-legible at projection distance. Dense tables remain readable because whitespace inside cells is generous. Three-column stat layout maps to a natural reading rhythm for executives scanning slides in 10 seconds.

**Innovation:** The "zero-decoration corporate default" is an active design decision, not a template. Competitors fill space with chevrons, brand bars, and footer logos. Primer-clean demonstrates that removing all of that improves perceived confidence.

---

## Color System (OKLCH CSS Tokens)

```css
:root {
  /* Surfaces */
  --c-bg:           oklch(0.99 0.000 0);      /* near-white page field */
  --c-surface:      oklch(0.965 0.004 80);    /* warm light grey card/aside */
  --c-surface-alt:  oklch(0.945 0.004 80);    /* slightly deeper grey for table rows */
  --c-border:       oklch(0.88 0.004 80);     /* hairline border */

  /* Text */
  --c-text-primary: oklch(0.18 0.004 252);    /* near-black with slight blue undertone */
  --c-text-body:    oklch(0.30 0.004 252);    /* body text */
  --c-text-muted:   oklch(0.52 0.006 252);    /* captions, footnotes, labels */

  /* Accent */
  --c-accent:       oklch(0.50 0.14 252);     /* medium clean blue */
  --c-accent-light: oklch(0.92 0.04 252);     /* very light blue tint for highlights */

  /* Semantic */
  --c-highlight-row: oklch(0.92 0.04 252);    /* comparison table highlighted row */
  --c-stat-border:   oklch(0.50 0.14 252);    /* 1px top border on stat columns */
}
```

**Contrast ratios (WCAG):**
- `--c-text-primary` on `--c-bg`: ≈ 17.2:1 — AAA
- `--c-text-body` on `--c-bg`: ≈ 10.8:1 — AAA
- `--c-text-muted` on `--c-bg`: ≈ 4.9:1 — AA
- `--c-accent` on `--c-bg`: ≈ 4.6:1 — AA (large text)
- `--c-text-primary` on `--c-surface`: ≈ 13.5:1 — AAA
- `--c-text-body` on `--c-highlight-row`: ≈ 8.2:1 — AAA

---

## Typography

```html
<!-- Google Fonts CDN — OFL licensed -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

```css
:root {
  --font-primary: 'Inter', system-ui, -apple-system, sans-serif;

  /* Type scale — based on 1920px stage */
  --ts-display:   clamp(2rem, 3.4vw, 4.2rem);   /* 80px @ 1920 */
  --ts-h1:        clamp(1.5rem, 2.5vw, 3.0rem);  /* 57px @ 1920 — headline */
  --ts-h2:        clamp(1rem, 1.5vw, 1.75rem);   /* 34px @ 1920 — section marker */
  --ts-stat:      clamp(2rem, 3.8vw, 4.8rem);    /* 92px @ 1920 — KPI numerals */
  --ts-body:      clamp(0.75rem, 0.95vw, 1.1rem);/* 21px @ 1920 — body */
  --ts-caption:   clamp(0.6rem, 0.7vw, 0.85rem); /* 16px @ 1920 — labels/footnotes */

  /* Line heights */
  --lh-tight:  1.15;  /* headlines */
  --lh-body:   1.6;   /* body paragraphs */
  --lh-loose:  1.8;   /* aside panels */

  /* Numeric rendering */
  --fvn: lining-nums tabular-nums;
}

body {
  font-family: var(--font-primary);
  font-variant-numeric: lining-nums tabular-nums;
  -webkit-font-smoothing: antialiased;
}
```

---

## Background and Structural Elements

```css
/* Stage */
.stage {
  width: 1920px;
  height: 1080px;
  background: var(--c-bg);
  position: relative;
  overflow: hidden;
}

/* No background decorations — pure white field */

/* Header zone */
.slide-header {
  position: absolute;
  top: 80px;
  left: 120px;
  right: 120px;
}

/* Content zone */
.slide-content {
  position: absolute;
  top: 260px;
  left: 120px;
  right: 120px;
  bottom: 100px;
}

/* Folio */
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-size: var(--ts-caption);
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--c-text-muted);
  letter-spacing: 0.04em;
}

/* Thin top rule on section slides — only structural element */
.section-rule {
  width: 48px;
  height: 2px;
  background: var(--c-accent);
  margin-bottom: 24px;
}
```

---

## Layout Patterns

### Slide 1 — Title
```
┌─────────────────────────────────────────────────────┐
│ [left: 120]                          [right: 120]   │
│                                                     │
│  [section label — muted, caps, 14px]                │
│                                                     │
│  [display headline — 2-3 lines max]                 │
│                                                     │
│  [abstract — 2 sentences body text]                 │
│                                                     │
│  ┌──────────┬──────────┬──────────┬──────────┐      │
│  │ detail 1 │ detail 2 │ detail 3 │ detail 4 │      │
│  └──────────┴──────────┴──────────┴──────────┘      │
│                                        [folio]      │
└─────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence (stats + aside)
```
┌─────────────────────────────────────────────────────┐
│  [section marker + rule]                            │
│  [A-E headline]                                     │
│                                                     │
│  ┌──────────┬──────────┬──────────┐  ┌───────────┐  │
│  │ stat 1   │ stat 2   │ stat 3   │  │  ASIDE    │  │
│  │ [value]  │ [value]  │ [value]  │  │  [stat]   │  │
│  │ [label]  │ [label]  │ [label]  │  │  [text]   │  │
│  └──────────┴──────────┴──────────┘  └───────────┘  │
│  [evidence paragraph — body text]                   │
│                                        [folio]      │
└─────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison table
```
┌─────────────────────────────────────────────────────┐
│  [section marker + rule]                            │
│  [A-E headline]                                     │
│                                                     │
│  ┌────────┬─────────┬─────────┬─────────┬─────────┐  │
│  │ KPI    │ Early   │ Late    │ Δ Gap   │ Trend   │  │
│  ├────────┼─────────┼─────────┼─────────┼─────────┤  │
│  │ row 1  │         │         │         │         │  │
│  │ row 2★ │ [blue]  │         │         │         │  │  ← highlighted
│  │ row 3  │         │         │         │         │  │
│  │ row 4  │         │         │         │         │  │
│  │ row 5  │         │         │         │         │  │
│  └────────┴─────────┴─────────┴─────────┴─────────┘  │
│  [footnote — caption size]                 [folio]  │
└─────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat Column
```css
.stat-col {
  flex: 1;
  padding: 32px 0 28px;
  border-top: 1px solid var(--c-stat-border);  /* accent 1px top rule */
}

.stat-value {
  font-size: var(--ts-stat);
  font-weight: 700;
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--c-text-primary);
  line-height: 1;
  margin-bottom: 12px;
}

.stat-unit {
  font-size: var(--ts-h2);
  font-weight: 400;
  color: var(--c-accent);
}

.stat-label {
  font-size: var(--ts-caption);
  font-weight: 500;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  line-height: var(--lh-body);
}
```

### Table
```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--ts-body);
}

.data-table th {
  text-align: left;
  font-weight: 600;
  font-size: var(--ts-caption);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--c-text-muted);
  padding: 14px 20px;
  border-bottom: 1px solid var(--c-border);
}

.data-table td {
  padding: 18px 20px;
  color: var(--c-text-body);
  border-bottom: 1px solid var(--c-border);
  font-variant-numeric: lining-nums tabular-nums;
}

.data-table tr.highlighted td {
  background: var(--c-highlight-row);
  font-weight: 600;
  color: var(--c-text-primary);
}

.data-table td.positive {
  color: var(--c-accent);
  font-weight: 600;
}
```

### Aside Panel
```css
.aside-panel {
  background: var(--c-surface);
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.aside-stat {
  font-size: var(--ts-h1);
  font-weight: 700;
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--c-accent);
  line-height: 1;
}

.aside-text {
  font-size: var(--ts-caption);
  color: var(--c-text-muted);
  line-height: var(--lh-loose);
}
```

### Detail Row (Slide 1)
```css
.detail-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border-top: 1px solid var(--c-border);
  margin-top: 48px;
}

.detail-item {
  padding: 28px 32px 28px 0;
  border-right: 1px solid var(--c-border);
}
.detail-item:last-child { border-right: none; }

.detail-label {
  font-size: var(--ts-caption);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--c-text-muted);
  margin-bottom: 8px;
}

.detail-value {
  font-size: var(--ts-body);
  font-weight: 600;
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--c-text-primary);
}
```

### Folio
```css
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-size: 13px;
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--c-text-muted);
  letter-spacing: 0.04em;
}
```

---

## Print/Export Mode

```css
@media print {
  .nav-bar { display: none !important; }
  .slide { display: flex !important; page-break-after: always; }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
```

---

## Accessibility

| Element | Foreground | Background | Ratio | Pass |
|---|---|---|---|---|
| Body text | `--c-text-body` oklch(0.30) | `--c-bg` oklch(0.99) | ~10.8:1 | AAA |
| Headlines | `--c-text-primary` oklch(0.18) | `--c-bg` oklch(0.99) | ~17.2:1 | AAA |
| Muted / captions | `--c-text-muted` oklch(0.52) | `--c-bg` oklch(0.99) | ~4.9:1 | AA |
| Accent text | `--c-accent` oklch(0.50) | `--c-bg` oklch(0.99) | ~4.6:1 | AA (large) |
| Aside body text | `--c-text-muted` | `--c-surface` oklch(0.965) | ~4.5:1 | AA |
| Highlighted row text | `--c-text-primary` | `--c-highlight-row` oklch(0.92) | ~11.4:1 | AAA |

No animation is used — prefers-reduced-motion has no effect on this style. Focus rings use `outline: 2px solid var(--c-accent); outline-offset: 4px`.

---

## Differentiators from Sibling Styles

| Feature | H01 primer-clean | H02+ |
|---|---|---|
| Decoration | None — zero rules, icons, bg patterns | Branded bar, rule, or bg tint |
| Color usage | Blue only as 1px stat border | Multiple accent uses |
| Animations | None — static only | May include entrance transitions |
| Font | Inter only | May add display or condensed face |
| Background | Pure near-white | May use off-white, tinted, or dark |
| Best for | Consultant-facing deliverables, board decks | Internal reporting, marketing |

---

## Fixed-stage content fit

The vw / clamp(...vw...) type values above are preview references. For a generated 1920×1080 deck, use fixed pixel type tokens and let the stage transform handle window scaling; otherwise text shrinks twice. Essential body copy follows knowledge/element/elements.md (normally 28–36px for speaker slides). Shorten copy, change layout, move explanation into speaker notes, or split the slide before reducing type size.
