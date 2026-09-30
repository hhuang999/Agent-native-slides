# I02 — wabi-sabi-japanese

| Field | Value |
|---|---|
| Style ID | I02 |
| Family | I — Texture/Organic |
| Scheme | Warm neutral monochrome with ai-iro indigo accent and vermilion micro-accent |
| Mood | Still · contemplative · imperfect · meditative · profound |
| Occasion | Japanese business, traditional crafts, slow design, wellness, tea ceremony, ceramics, cultural heritage |
| Academic Fit | Cultural studies, traditional arts & crafts, humanities, sustainability research, East Asian studies |

---

## Design Philosophy

**1. Philosophy — Wabi as Worldview**
Beauty emerges from incompleteness, transience, and restraint. Every empty space is intentional; every asymmetry is deliberate. The deck surface reads like aged washi paper — warm, not clinical. Information arrives in silence rather than competing for attention.

**2. Hierarchy — Space Over Weight**
Typographic hierarchy is built through scale and spatial distance, not through bold weights or color floods. A Shippori Mincho headline at 52–64 px separated by 80 px of vertical breathing room commands more attention than a heavy sans-serif at the same size ever could.

**3. Detail — The Single Thread**
One thin horizontal rule (0.5–1 px, ai-iro indigo) marks each section boundary. One thin vermilion rule (0.5 px) separates micro-sections or footnotes. No other decorative elements. The folio number is positioned asymmetrically — right-anchored — following shodo compositional logic.

**4. Function — Negative Space as Content**
Generous whitespace is not wasted space. Slide margins of 120 px left/right and 80 px top/bottom ensure text never crowds the edge. Evidence blocks float in the field rather than filling it. The aside panel is offset, not symmetrically balanced.

**5. Innovation — Kanji-Era Serif Meets Modern Data**
Shippori Mincho (OFL, Google Fonts) is a Japanese digital typeface designed for modern legibility while preserving authentic Ming/Mincho stroke geometry. Pairing it with Noto Sans JP body text creates a traditional display + modernist body hierarchy that is rare in Western presentation tools, immediately legible to Japanese readers, and visually distinctive to international audiences.

---

## Color System

All colors expressed in OKLCH. Reference white point: D65.

```css
:root {
  /* ── Surfaces ───────────────────────────── */
  --c-bg:           oklch(0.96 0.014 65);   /* warm off-white — aged washi */
  --c-surface:      oklch(0.93 0.016 65);   /* slightly deeper warm surface */
  --c-surface-alt:  oklch(0.91 0.018 65);   /* card / aside background */

  /* ── Text ───────────────────────────────── */
  --c-text:         oklch(0.18 0.018 65);   /* warm near-black */
  --c-text-muted:   oklch(0.45 0.014 65);   /* secondary labels, captions */
  --c-text-subtle:  oklch(0.62 0.012 65);   /* footnotes, metadata */

  /* ── Borders ────────────────────────────── */
  --c-border:       oklch(0.80 0.012 65);   /* general dividers */
  --c-border-soft:  oklch(0.87 0.010 65);   /* subtle row separators */

  /* ── Accent — ai-iro indigo ─────────────── */
  --c-accent:       oklch(0.28 0.12 270);   /* primary: section rule, folio, dots */
  --c-accent-mid:   oklch(0.40 0.10 270);   /* active dot, highlight cell text */
  --c-accent-light: oklch(0.82 0.06 270);   /* tinted background on highlighted row */

  /* ── Micro-accent — vermilion ───────────── */
  --c-vermilion:    oklch(0.58 0.18 24);    /* section separator rule only */

  /* ── Semantic ───────────────────────────── */
  --c-positive:     oklch(0.42 0.10 145);   /* positive delta values */
  --c-highlight-bg: oklch(0.90 0.04 270);   /* highlighted table row bg */
}
```

**Differentiator from sibling I-family styles:** I02 uses a pure warm-neutral ground with zero cool gray. Every surface is subtly warm (hue ~65, slightly amber). The accent is limited to a single indigo with no saturation ramp — it appears only as thin rules, folio, and interactive dots. Vermilion appears only as a 0.5 px horizontal rule for micro-section separation, never as fill or background.

---

## Typography

```html
<!-- Google Fonts CDN — OFL licensed -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Shippori+Mincho:wght@400;500;600&family=Noto+Sans+JP:wght@300;400;500&display=swap" rel="stylesheet">
```

```css
:root {
  /* ── Font stacks ────────────────────────── */
  --ff-display: 'Shippori Mincho', 'Hiragino Mincho ProN', 'Yu Mincho', serif;
  --ff-body:    'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic', sans-serif;

  /* ── Type scale (1920×1080 stage) ──────── */
  --fs-hero:     clamp(52px, 3.5vw, 64px);  /* slide 1 main headline */
  --fs-headline: clamp(36px, 2.6vw, 48px);  /* slide 2–3 A-E headline */
  --fs-subhead:  clamp(20px, 1.6vw, 26px);  /* section marker, labels */
  --fs-body:     clamp(16px, 1.2vw, 20px);  /* evidence paragraphs */
  --fs-stat:     clamp(40px, 3vw, 56px);    /* stat numerals */
  --fs-stat-unit:clamp(18px, 1.4vw, 22px);  /* stat unit labels */
  --fs-caption:  clamp(13px, 1vw, 16px);    /* captions, footnotes */
  --fs-folio:    14px;                       /* folio number */

  /* ── Leading ────────────────────────────── */
  --lh-display: 1.25;
  --lh-headline:1.30;
  --lh-body:    1.70;
  --lh-caption: 1.55;

  /* ── Numerics ───────────────────────────── */
  --fvn-tabular: "tnum" 1, "lnum" 1; /* font-variant-numeric shorthand */
}

/* Apply globally */
body {
  font-family: var(--ff-body);
  font-feature-settings: "palt" 1; /* proportional alternates for Japanese */
}

.display, h1, h2 {
  font-family: var(--ff-display);
  line-height: var(--lh-display);
}

.stat-value {
  font-family: var(--ff-body);
  font-variant-numeric: lining-nums tabular-nums;
  font-weight: 300;
}
```

**Scale rationale:** Shippori Mincho carries the headline weight with its elegant stroke modulation. Noto Sans JP at weight 300–400 provides maximum legibility for evidence text without competing with the display face.

---

## Background and Structural Elements

```css
/* ── Slide surface ───────────────────────── */
.slide {
  background-color: var(--c-bg);
  /* No gradient, no texture — washi is smooth with natural variation */
}

/* ── Section marker rule (indigo) ──────── */
.section-rule {
  display: block;
  width: 48px;
  height: 1px;
  background: var(--c-accent);
  margin-bottom: 24px;
}

/* ── Micro-section vermilion rule ─────── */
.vermilion-rule {
  display: block;
  width: 100%;
  height: 0.5px;
  background: var(--c-vermilion);
  margin: 32px 0;
  opacity: 0.6;
}

/* ── Aside panel ─────────────────────── */
.aside-panel {
  background: var(--c-surface-alt);
  border-left: 2px solid var(--c-accent);
  padding: 36px 40px;
}

/* ── Folio ───────────────────────────── */
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--ff-body);
  font-size: var(--fs-folio);
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--c-text-subtle);
  letter-spacing: 0.08em;
}
```

---

## Layout Patterns

### Slide 1 — Title / Abstract

```
┌─────────────────────────────────────────────────────────────────┐
│  [120px margin L/R, 80px margin T/B]                            │
│                                                                  │
│                                                                  │
│  ─────  (48px indigo rule)                                      │
│  INSTITUTION · REPORT SERIES             [top-left, muted]      │
│                                                                  │
│                                                                  │
│  Headline: Full A-E sentence, Shippori Mincho 56px              │
│  max-width 900px, left-anchored                                  │
│                                                                  │
│                                                                  │
│  Abstract 1–2 sentences, Noto Sans JP 18px, muted               │
│  max-width 700px                                                 │
│                                                                  │
│  ···vermilion rule···                                            │
│                                                                  │
│  [col 1]  [col 2]  [col 3]  [col 4]    (4-col detail row)       │
│  label    label    label    label                                │
│                                                                  │
│                                                             [01] │
└─────────────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence / Stats

```
┌─────────────────────────────────────────────────────────────────┐
│  ─── SECTION MARKER + marker text (indigo rule + small caps)    │
│                                                                  │
│  A-E Headline 44px, max-width 840px                             │
│                                                                  │
│  [stat col 1]    [stat col 2]    [stat col 3]                   │
│   big number      big number      big number                    │
│   unit label      unit label      unit label                    │
│   caption         caption         caption                       │
│                                                                  │
│  ···vermilion rule···                                            │
│                                                                  │
│  [evidence paragraph — 2/3 width] │ [aside panel — 1/3 width]  │
│                                   │  supplementary stat         │
│                                   │  supplementary text         │
│                                                             [02] │
└─────────────────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison Table

```
┌─────────────────────────────────────────────────────────────────┐
│  ─── SECTION MARKER                                             │
│                                                                  │
│  A-E Headline 40px, max-width 960px                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │ Header row (indigo bg, white text)                     │    │
│  ├────────────────────────────────────────────────────────┤    │
│  │ Row 1                                                  │    │
│  │ Row 2  ◀ highlighted (accent-light bg)                 │    │
│  │ Row 3                                                  │    │
│  │ Row 4                                                  │    │
│  │ Row 5                                                  │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ···vermilion rule···  footnote text, 13px muted               │
│                                                             [03] │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat Columns

```css
.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 48px;
  padding: 40px 0;
}

.stat-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-left: 1px solid var(--c-border);
  padding-left: 32px;
}

.stat-col:first-child {
  border-left: 2px solid var(--c-accent);
}

.stat-value {
  font-family: var(--ff-body);
  font-size: var(--fs-stat);
  font-weight: 300;
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--c-text);
  line-height: 1;
}

.stat-unit {
  font-family: var(--ff-body);
  font-size: var(--fs-stat-unit);
  font-weight: 400;
  color: var(--c-accent-mid);
  letter-spacing: 0.04em;
}

.stat-caption {
  font-family: var(--ff-body);
  font-size: var(--fs-caption);
  color: var(--c-text-muted);
  line-height: var(--lh-caption);
  max-width: 280px;
}
```

### Comparison Table

```css
.comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--ff-body);
  font-size: var(--fs-body);
}

.comparison-table th {
  background: var(--c-accent);
  color: oklch(0.97 0.005 270);
  font-weight: 500;
  font-size: var(--fs-caption);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 14px 20px;
  text-align: left;
  font-variant-numeric: lining-nums tabular-nums;
}

.comparison-table td {
  padding: 14px 20px;
  border-bottom: 1px solid var(--c-border-soft);
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--c-text);
}

.comparison-table tr.highlighted td {
  background: var(--c-highlight-bg);
  color: var(--c-accent-mid);
  font-weight: 500;
}

.comparison-table tr:hover td {
  background: var(--c-surface);
}
```

### Folio

```css
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--ff-body);
  font-size: 14px;
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--c-text-subtle);
  letter-spacing: 0.12em;
}
```

### Detail Row (Slide 1, 4-col)

```css
.detail-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32px;
  padding-top: 32px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.detail-label {
  font-family: var(--ff-body);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--c-text-muted);
}

.detail-value {
  font-family: var(--ff-body);
  font-size: 17px;
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--c-text);
}
```

---

## Print/Export Mode

```css
@media print {
  .nav-bar { display: none !important; }
  .slide { display: flex !important; page-break-after: always; }
  body { background: white; }
  :root {
    --c-bg: #fff;
    --c-text: #1a1614;
  }
}
```

---

## Accessibility

| Pair | OKLCH | Approx contrast | WCAG |
|---|---|---|---|
| `--c-text` on `--c-bg` | 0.18 on 0.96 | ~13.5:1 | AAA |
| `--c-text-muted` on `--c-bg` | 0.45 on 0.96 | ~5.8:1 | AA |
| `--c-text-subtle` on `--c-bg` | 0.62 on 0.96 | ~3.2:1 | AA large |
| White on `--c-accent` | 0.97 on 0.28 | ~9.8:1 | AAA |
| `--c-accent-mid` on `--c-bg` | 0.40 on 0.96 | ~7.1:1 | AA |
| `--c-accent-mid` on `--c-highlight-bg` | 0.40 on 0.90 | ~4.6:1 | AA |

All interactive focus rings: `outline: 2px solid var(--c-accent); outline-offset: 3px`

Color is never the sole carrier of meaning: highlighted table row also receives font-weight 500. Stat unit labels are paired with numeric values that carry the data independently of color.

---

## Differentiators from Sibling Styles

| Attribute | I02 wabi-sabi | I01 (if exists) | I03 (if exists) |
|---|---|---|---|
| Ground color | Warm off-white (~65 hue) | — | — |
| Accent count | 1 primary + 1 micro | — | — |
| Typography model | Mincho + Sans JP | — | — |
| Structural motif | Single thin rule | — | — |
| Whitespace ratio | Highest in family | — | — |
| Cultural register | Japanese minimalism | — | — |

---

## Fixed-stage content fit

The vw / clamp(...vw...) type values above are preview references. For a generated 1920×1080 deck, use fixed pixel type tokens and let the stage transform handle window scaling; otherwise text shrinks twice. Essential body copy follows knowledge/element/elements.md (normally 28–36px for speaker slides). Shorten copy, change layout, move explanation into speaker notes, or split the slide before reducing type size.
