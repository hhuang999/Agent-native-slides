# G03 — neutral-academic-beige

**Style ID:** G03
**Family:** G (Academic/Journal)
**Scheme:** Warm Neutral
**Mood:** Calm, Institutional, Readable
**Occasion:** Social sciences, economics, archaeology, anthropology, cultural geography
**Academic Fit:** High — suited for policy briefs, working papers, conference posters, university press presentations

---

## Design Philosophy (5D)

**Philosophy:** Rooted in the typographic tradition of well-designed university press books and policy briefs. The palette evokes aged parchment and archival documents — trustworthy, unhurried, and deeply readable. Visual noise is minimized so that argument structure carries the weight.

**Hierarchy:** Three-tier headline hierarchy via Source Serif 4 weight (700 → 600 → 400) paired with Source Sans 3 for captions and data labels. Headline size differential is generous (48 → 32 → 20 px at 1920 px stage) to create immediate scanning order.

**Detail:** Rust/terracotta accent appears only as a functional marker: stat accent squares (8×8 px), active dot indicators, table highlight row left border, and the A-E headline rule line. Restraint ensures every accent pixel carries meaning.

**Function:** All numeric values use `font-variant-numeric: lining-nums tabular-nums` for column alignment. Table cells have consistent vertical padding. Stat columns stack in three equal-width tiles with a thin left border in rust accent.

**Innovation:** The "matching serifs and sans" approach (Source Serif 4 + Source Sans 3, both Adobe OFL releases) creates family coherence while preserving the functional serif/sans distinction. This is uncommon in presentation design, where headline and body fonts are typically from unrelated families.

---

## Color System (OKLCH CSS Tokens)

```css
:root {
  /* Surfaces */
  --color-bg:           oklch(0.96 0.018 72);   /* warm beige / parchment */
  --color-surface:      oklch(0.93 0.022 74);   /* slightly deeper warm card */
  --color-surface-alt:  oklch(0.98 0.010 72);   /* near-white warm tint */
  --color-border:       oklch(0.84 0.025 70);   /* warm mid-tone rule */
  --color-border-light: oklch(0.89 0.018 70);   /* subtle divider */

  /* Text */
  --color-text-primary: oklch(0.18 0.022 60);   /* near-black warm brown */
  --color-text-secondary: oklch(0.38 0.025 62); /* mid-tone warm gray-brown */
  --color-text-muted:   oklch(0.55 0.020 64);   /* muted caption tone */

  /* Accent — terracotta/rust */
  --color-accent:       oklch(0.42 0.14 38);    /* deep rust/terracotta */
  --color-accent-light: oklch(0.78 0.08 42);    /* pale terracotta tint */
  --color-accent-mid:   oklch(0.60 0.11 40);    /* mid rust for hover states */

  /* Semantic */
  --color-highlight-bg: oklch(0.90 0.035 72);   /* table highlight row */
  --color-footnote-bg:  oklch(0.94 0.016 72);   /* footnote strip */
}
```

**Contrast ratios (WCAG):**
- `--color-text-primary` on `--color-bg`: ~14:1 (AAA)
- `--color-text-secondary` on `--color-bg`: ~6.5:1 (AA)
- `--color-text-muted` on `--color-bg`: ~4.6:1 (AA)
- `--color-accent` on `--color-bg`: ~4.9:1 (AA for large text; not used as body text)
- `--color-text-primary` on `--color-surface`: ~12:1 (AAA)

---

## Typography (Google Fonts CDN Import)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400&family=Source+Sans+3:wght@400;500;600&display=swap" rel="stylesheet">
```

```css
:root {
  --font-serif:  'Source Serif 4', Georgia, 'Slides CJK Serif', 'Times New Roman', serif;
  --font-sans:   'Source Sans 3', Arial, 'Slides CJK Sans', system-ui, sans-serif;

  /* Scale — 1920×1080 stage */
  --text-display:    48px;   /* slide title headline */
  --text-h2:         32px;   /* section headline (A-E sentence) */
  --text-h3:         22px;   /* sub-headline / stat label */
  --text-body:       18px;   /* body paragraph */
  --text-caption:    14px;   /* captions, footnotes, labels */
  --text-micro:      12px;   /* folio, table footnote */

  --leading-tight:   1.20;
  --leading-normal:  1.55;
  --leading-loose:   1.70;
}
```

**Usage rules:**
- Headlines (display, h2, h3): `font-family: var(--font-serif); font-weight: 700 / 600`
- Abstract / body prose: `font-family: var(--font-serif); font-weight: 400; font-style: normal`
- Labels, captions, UI text, table data: `font-family: var(--font-sans); font-weight: 400 / 500`
- All numerics in tables and stats: `font-variant-numeric: lining-nums tabular-nums`

---

## Background and Structural Elements (CSS)

```css
/* Stage background — warm parchment texture effect via radial gradient */
.slide-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 120% 80% at 15% 10%,
      oklch(0.98 0.012 70 / 0.6) 0%,
      transparent 60%),
    oklch(0.96 0.018 72);
}

/* Title slide decorative rule — thin horizontal rust line */
.title-rule {
  width: 80px;
  height: 3px;
  background: var(--color-accent);
  margin: 20px 0 24px;
}

/* Section marker pill */
.section-marker {
  display: inline-block;
  font-family: var(--font-sans);
  font-size: var(--text-caption);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
  border: 1.5px solid var(--color-accent);
  border-radius: 3px;
  padding: 4px 12px;
  margin-bottom: 20px;
}

/* Horizontal rule — warm tone */
.rule-warm {
  border: none;
  border-top: 1.5px solid var(--color-border);
  margin: 24px 0;
}

/* Slide content area — single consistent side margin */
.slide-content {
  position: relative;
  z-index: 1;
  padding: 72px 120px 72px 120px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
```

---

## Layout Patterns (ASCII Diagram)

### Slide 1 — Title
```
┌─────────────────────────────────────────────────────────────┐
│ [Institution / org label — sans caps 14px rust]             │
│                                                             │
│ ████ Title headline (serif 700 48px, 2-3 lines)            │
│ ─── [3px rust rule 80px]                                    │
│                                                             │
│ Abstract paragraph (serif 400 18px, max 2 sentences)        │
│                                                             │
│ ┌──────────┬──────────┬──────────┬──────────┐              │
│ │ Detail 1 │ Detail 2 │ Detail 3 │ Detail 4 │  ← 4-col row │
│ └──────────┴──────────┴──────────┴──────────┘              │
│                                               [folio] 1/3   │
└─────────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence + Aside
```
┌─────────────────────────────────────────────────────────────┐
│ [SECTION MARKER pill]                                       │
│ Headline sentence (serif 700 36px)                          │
│                                                             │
│ ┌─────────┐  ┌─────────┐  ┌─────────┐   ┌───────────────┐ │
│ │ ■ STAT  │  │ ■ STAT  │  │ ■ STAT  │   │ ASIDE PANEL   │ │
│ │  value  │  │  value  │  │  value  │   │ supplementary │ │
│ │  label  │  │  label  │  │  label  │   │ stat + text   │ │
│ └─────────┘  └─────────┘  └─────────┘   └───────────────┘ │
│ Evidence paragraph (serif 400 17px)       [folio] 2/3      │
└─────────────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison Table
```
┌─────────────────────────────────────────────────────────────┐
│ [SECTION MARKER pill]                                       │
│ Headline sentence (serif 700 32px)                          │
│                                                             │
│ ┌────┬──────────┬──────┬──────┬──────┬──────┐             │
│ │City│ Quintile │Infra │Educ. │Labor │Expl. │ ← table     │
│ ├────┼──────────┼──────┼──────┼──────┼──────┤             │
│ │ …  │          │      │      │      │      │             │
│ │ ██ HIGHLIGHTED ROW (rust left border)     │             │
│ │ …  │          │      │      │      │      │             │
│ └────┴──────────┴──────┴──────┴──────┴──────┘             │
│ [footnote strip — sans 12px muted]        [folio] 3/3      │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat Column
```css
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 28px;
  background: var(--color-surface-alt);
  border-left: 3px solid var(--color-accent);
  flex: 1;
}

.stat-accent-square {
  width: 8px;
  height: 8px;
  background: var(--color-accent);
  flex-shrink: 0;
}

.stat-value {
  font-family: var(--font-serif);
  font-size: 44px;
  font-weight: 700;
  line-height: 1;
  color: var(--color-text-primary);
  font-variant-numeric: lining-nums tabular-nums;
}

.stat-label {
  font-family: var(--font-sans);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-secondary);
  line-height: 1.4;
}
```

### Data Table
```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-sans);
  font-size: 15px;
}

.data-table thead th {
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  border-bottom: 2px solid var(--color-border);
  padding: 10px 14px;
  text-align: left;
}

.data-table tbody td {
  padding: 11px 14px;
  border-bottom: 1px solid var(--color-border-light);
  color: var(--color-text-primary);
  font-variant-numeric: lining-nums tabular-nums;
}

.data-table tbody tr.highlight {
  background: var(--color-highlight-bg);
  border-left: 4px solid var(--color-accent);
}

.data-table tbody tr.highlight td:first-child {
  padding-left: 10px;
}
```

### Folio
```css
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--color-text-muted);
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: 0.04em;
  z-index: 1;
}
```

### Aside Panel
```css
.aside-panel {
  background: var(--color-surface);
  border-left: 4px solid var(--color-accent-light);
  padding: 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 220px;
}

.aside-stat {
  font-family: var(--font-serif);
  font-size: 36px;
  font-weight: 700;
  color: var(--color-accent);
  font-variant-numeric: lining-nums tabular-nums;
}

.aside-text {
  font-family: var(--font-sans);
  font-size: 13px;
  color: var(--color-text-secondary);
  line-height: 1.5;
}
```

### 4-Col Detail Row (Slide 1)
```css
.detail-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--color-border);
  border: 1px solid var(--color-border);
  margin-top: 32px;
}

.detail-cell {
  background: var(--color-surface-alt);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-cell-label {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--color-text-muted);
}

.detail-cell-value {
  font-family: var(--font-serif);
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}
```

---

## Print/Export Mode

```css
@media print {
  .nav-bar { display: none !important; }
  .slide { display: block !important; page-break-after: always; }
  .slide-bg {
    background: white !important;
    print-color-adjust: exact;
    -webkit-print-color-adjust: exact;
  }
  /* Ensure accent colors survive print */
  .stat-col { border-left-color: oklch(0.42 0.14 38) !important; }
  .data-table tbody tr.highlight { background: oklch(0.93 0.022 74) !important; }
}
```

---

## Accessibility

| Element | Foreground | Background | Ratio | Level |
|---------|-----------|------------|-------|-------|
| Body text | `oklch(0.18 0.022 60)` | `oklch(0.96 0.018 72)` | ~14:1 | AAA |
| Secondary text | `oklch(0.38 0.025 62)` | `oklch(0.96 0.018 72)` | ~6.5:1 | AA |
| Muted / caption | `oklch(0.55 0.020 64)` | `oklch(0.96 0.018 72)` | ~4.6:1 | AA |
| Accent on surface | `oklch(0.42 0.14 38)` | `oklch(0.96 0.018 72)` | ~4.9:1 | AA (large) |
| Table body text | `oklch(0.18 0.022 60)` | `oklch(0.93 0.022 74)` | ~12:1 | AAA |

All interactive nav elements (dots, prev/next buttons) have `:focus-visible` outlines in rust accent. No state encoded by color alone — active dot uses both fill-change and `aria-current`. Keyboard navigation covers ArrowLeft / ArrowRight / ArrowUp / ArrowDown / Space.

---

## Differentiators from Sibling Styles (G Family)

| Feature | G01 | G02 | **G03** | G04 |
|---------|-----|-----|---------|-----|
| Surface tone | Cool white | Dark slate | **Warm beige** | Off-white cool |
| Headline font | Playfair | IBM Plex Serif | **Source Serif 4** | Libre Baskerville |
| Body font | Libre Baskerville | IBM Plex Sans | **Source Sans 3** | Source Sans 3 |
| Accent | Gold | Cyan-teal | **Rust/terracotta** | Forest green |
| Mood | Classical elegant | Dark scholarly | **Warm institutional** | Understated modern |
| Best for | Humanities, history | STEM policy | **Social sci, econ** | Natural sciences |

G03 is the warmest and most tactile of the G family, evoking physical documents (printed policy briefs, archival reports) rather than screen-native design. The Source Serif / Source Sans pairing is intentionally chosen as a matched family from the same Adobe design lineage.

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | Source Serif 4 | Georgia | Slides CJK Serif |
| Body | Source Serif 4 | Georgia | Slides CJK Serif |
| Auxiliary / data | Source Sans 3 | Arial | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.
