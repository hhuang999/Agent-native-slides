# N02 — retro-modern-50s

**Style ID:** N02
**Family:** N (Retro/Historical)
**Scheme:** Warm Cream / Brown / Retro Red / Turquoise
**Mood:** Joyful, Optimistic, Bold, Nostalgic, Graphic
**Occasion:** Design history, architecture retrospectives, creative industries, brand strategy, advertising history, cultural exhibitions
**Academic Fit:** Design programs, art history, communication studies, marketing retrospectives

---

## Design Philosophy (5D)

**Philosophy:** Channels mid-century American commercial graphic design — the Saul Bass poster cut-outs, Paul Rand's geometric wit, TWA airline identity, and Eames-era optimism. Every element carries the bold confidence of an era that believed design could change the world.

**Hierarchy:** Dominant ALL-CAPS typographic headline using Bebas Neue creates immediate visual authority. Supporting Nunito body text at comfortable sizes provides readable contrast. Red accent numbers break hierarchy in a deliberately theatrical way — the number is the argument.

**Detail:** Diagonal decorative rules and geometric circle accents reference mid-century motifs without pastiche. Careful use of negative space echoes Swiss-influenced American modernism. The cream-warm-brown palette feels aged and premium simultaneously.

**Function:** Three-slide deck structure mirrors exhibition catalogue design: title card (provenance), evidence panel (argument with data), comparison matrix (critical analysis). Each slide is readable at distance — appropriate for gallery or auditorium projection.

**Innovation:** Combines authentic period typography with modern OKLCH color precision. The stat column design uses typographic number-as-display-element in the Saul Bass tradition: bold, declarative, slightly oversized.

---

## Color System (OKLCH CSS tokens)

```css
:root {
  /* ── Core Palette ── */
  --color-background:    oklch(0.96 0.018 72);   /* warm cream */
  --color-surface:       oklch(0.93 0.022 72);   /* slightly deeper cream for cards */
  --color-text-primary:  oklch(0.22 0.018 50);   /* warm brown, near-black */
  --color-text-secondary:oklch(0.42 0.022 50);   /* mid-brown for secondary copy */
  --color-text-muted:    oklch(0.58 0.018 55);   /* muted warm gray-brown */

  /* ── Accent Red (classic retro red) ── */
  --color-accent:        oklch(0.52 0.22 22);    /* retro red, vivid */
  --color-accent-dark:   oklch(0.38 0.20 22);    /* deeper red for hover/border */
  --color-accent-light:  oklch(0.72 0.14 22);    /* faded red for backgrounds */

  /* ── Secondary Turquoise ── */
  --color-secondary:     oklch(0.62 0.14 192);   /* classic turquoise */
  --color-secondary-dark:oklch(0.48 0.14 192);   /* deep turquoise */
  --color-secondary-light:oklch(0.80 0.09 192);  /* pale turquoise tint */

  /* ── Structural ── */
  --color-rule:          oklch(0.22 0.018 50);   /* warm brown rules/borders */
  --color-rule-light:    oklch(0.78 0.022 72);   /* light cream rule */
  --color-overlay:       oklch(0.22 0.018 50 / 0.08); /* subtle warm overlay */

  /* ── Print/Export ── */
  --color-print-bg:      #f7f2e8;
  --color-print-text:    #1f1810;
}
```

---

## Typography

```css
/* Google Fonts CDN Import (OFL licensed) */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Nunito:ital,wght@0,400;0,600;0,700;0,800;1,400&display=swap');

:root {
  /* Font Families */
  --font-display:  'Bebas Neue', 'Arial Black', sans-serif;  /* ALL-CAPS headlines */
  --font-body:     'Nunito', 'Trebuchet MS', sans-serif;     /* body, captions, data */

  /* Type Scale */
  --text-hero:     clamp(3.5rem, 6vw, 7.5rem);   /* slide 1 title */
  --text-h1:       clamp(2.4rem, 4vw, 5rem);     /* section headlines */
  --text-h2:       clamp(1.6rem, 2.4vw, 2.8rem); /* sub-headlines */
  --text-stat:     clamp(3.5rem, 5vw, 6.5rem);   /* stat numbers */
  --text-label:    clamp(0.65rem, 0.9vw, 0.85rem);/* labels, footnotes */
  --text-body:     clamp(0.9rem, 1.1vw, 1.1rem);  /* body copy */
  --text-caption:  clamp(0.75rem, 0.85vw, 0.9rem);/* captions */

  /* Line Heights */
  --leading-tight:  0.95;  /* Bebas Neue headlines */
  --leading-normal: 1.5;   /* body copy */
  --leading-loose:  1.7;   /* evidence paragraphs */

  /* Numeric style for all data */
  font-variant-numeric: lining-nums tabular-nums;
}
```

**Rationale:** Bebas Neue (OFL via Google Fonts) is quintessentially mid-century-adjacent — tall, geometric, condensed all-caps. Nunito provides warm, rounded humanist contrast that avoids harsh modernism. The pairing echoes poster typography traditions of the 1950s–60s American design era.

---

## Background and Structural Elements

```css
/* Deck Stage */
.stage {
  background-color: var(--color-background);
  width: 1920px;
  height: 1080px;
  position: relative;
  overflow: hidden;
}

/* Horizontal rule — warm brown, double-weight */
.rule-heavy {
  width: 100%;
  height: 4px;
  background: var(--color-rule);
}
.rule-accent {
  width: 100%;
  height: 4px;
  background: var(--color-accent);
  margin-top: 3px;
}

/* Diagonal decorative rule — mid-century motif */
.rule-diagonal {
  position: absolute;
  width: 200px;
  height: 4px;
  background: var(--color-accent);
  transform: rotate(-12deg);
  transform-origin: left center;
}

/* Circle accent — geometric marker */
.circle-accent {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: var(--color-secondary);
  display: inline-block;
  flex-shrink: 0;
}
.circle-accent-lg {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: var(--color-accent);
  position: absolute;
}

/* Section stripe — full-bleed color band */
.section-stripe {
  background: var(--color-text-primary);
  color: var(--color-background);
  padding: 6px 24px;
  font-family: var(--font-body);
  font-weight: 800;
  font-size: var(--text-label);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  display: inline-block;
}

/* Card surface */
.card {
  background: var(--color-surface);
  border: 2px solid var(--color-rule);
  padding: 32px;
}
.card-accent {
  border-left: 6px solid var(--color-accent);
  background: var(--color-surface);
  padding: 28px 32px;
}
```

---

## Layout Patterns (ASCII diagram)

### Slide 1 — Title

```
┌──────────────────────────────────────────────────────────────────────┐
│  [CIRCLE ●]  DESIGN MUSEUM                  [corner circle accent]   │
│  ════════════════════════════════════════                             │
│  [RULE RED]                                                           │
│                                                                       │
│  BEBAS NEUE HERO TITLE                                                │
│  ALL-CAPS, FLUSH LEFT                                                 │
│  WRAPS TO 3-4 LINES                                                   │
│                                                                       │
│  ────────────────────────────────────                                 │
│  Abstract text, Nunito 400/600, 2 sentences                          │
│                                                                       │
│  [DETAIL COL 1]  [DETAIL COL 2]  [DETAIL COL 3]  [DETAIL COL 4]     │
│  label           label           label           label               │
│  VALUE           VALUE           VALUE           VALUE               │
│                                                              [folio]  │
└──────────────────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence

```
┌──────────────────────────────────────────────────────────────────────┐
│  [SECTION MARKER ▌ EVIDENCE]                                         │
│                                                                       │
│  BEBAS NEUE H1 HEADLINE                                               │
│  FULL-SENTENCE ASSERTION                                              │
│                                                                       │
│  ┌─STAT COL 1─┐  ┌─STAT COL 2─┐  ┌─STAT COL 3─┐  ┌─ASIDE PANEL─┐ │
│  │ RED NUMBER  │  │ RED NUMBER  │  │ RED NUMBER  │  │ ● SUPP STAT │ │
│  │ [● turq]   │  │ [● turq]   │  │ [● turq]   │  │ body text   │ │
│  │ label text  │  │ label text  │  │ label text  │  │ supplement  │ │
│  └────────────┘  └────────────┘  └────────────┘  └─────────────┘ │
│                                                                       │
│  Evidence paragraph, Nunito, 3-4 sentences                           │
│                                                              [folio]  │
└──────────────────────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison

```
┌──────────────────────────────────────────────────────────────────────┐
│  [SECTION MARKER ▌ COMPARISON]                                       │
│                                                                       │
│  BEBAS NEUE H1 HEADLINE                                               │
│                                                                       │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┬──────────┐│
│  │ CATEGORY │  COL A   │  COL B   │  COL C   │  COL D   │  COL E  ││
│  ├──────────┼──────────┼──────────┼──────────┼──────────┼──────────┤│
│  │  row 1   │  value   │  value   │  value   │  value   │  value  ││
│  │  ROW 2*  │  VALUE   │  VALUE   │  VALUE   │  VALUE   │  VALUE  ││  ← highlighted
│  │  row 3   │  value   │  value   │  value   │  value   │  value  ││
│  │  row 4   │  value   │  value   │  value   │  value   │  value  ││
│  │  row 5   │  value   │  value   │  value   │  value   │  value  ││
│  └──────────┴──────────┴──────────┴──────────┴──────────┴──────────┘│
│                                                                       │
│  * Footnote text                                              [folio] │
└──────────────────────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat Columns

```css
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 28px 24px;
  background: var(--color-surface);
  border-top: 4px solid var(--color-accent);
  flex: 1;
}
.stat-number {
  font-family: var(--font-display);
  font-size: var(--text-stat);
  line-height: var(--leading-tight);
  color: var(--color-accent);
  letter-spacing: 0.02em;
  font-variant-numeric: lining-nums tabular-nums;
}
.stat-marker {
  display: flex;
  align-items: center;
  gap: 8px;
}
.stat-label {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: var(--text-label);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
}
```

### Comparison Table

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: var(--text-caption);
  font-variant-numeric: lining-nums tabular-nums;
}
.data-table th {
  background: var(--color-text-primary);
  color: var(--color-background);
  font-weight: 800;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  padding: 12px 16px;
  text-align: left;
  border: 1px solid var(--color-text-primary);
}
.data-table td {
  padding: 11px 16px;
  border: 1px solid var(--color-rule-light);
  color: var(--color-text-primary);
}
.data-table tr:nth-child(even) td {
  background: var(--color-surface);
}
.data-table tr.highlight td {
  background: var(--color-accent);
  color: var(--color-background);
  font-weight: 700;
}
.data-table tr.highlight td:first-child {
  border-left: 4px solid var(--color-accent-dark);
}
```

### Folio

```css
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  font-variant-numeric: lining-nums tabular-nums;
  display: flex;
  align-items: center;
  gap: 10px;
}
.folio::before {
  content: '';
  display: inline-block;
  width: 20px;
  height: 2px;
  background: var(--color-accent);
}
```

### Aside Panel

```css
.aside-panel {
  background: var(--color-text-primary);
  color: var(--color-background);
  padding: 32px 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 280px;
  max-width: 320px;
}
.aside-stat {
  font-family: var(--font-display);
  font-size: 3.5rem;
  line-height: 1;
  color: var(--color-secondary);
  font-variant-numeric: lining-nums tabular-nums;
}
.aside-label {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 0.72rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-background);
  opacity: 0.7;
}
.aside-body {
  font-family: var(--font-body);
  font-size: 0.85rem;
  line-height: 1.6;
  color: var(--color-background);
  opacity: 0.88;
}
```

### Detail Row (Slide 1)

```css
.detail-row {
  display: flex;
  gap: 0;
  border-top: 3px solid var(--color-rule);
  margin-top: 32px;
}
.detail-col {
  flex: 1;
  padding: 20px 24px;
  border-right: 1px solid var(--color-rule-light);
}
.detail-col:last-child { border-right: none; }
.detail-col-label {
  font-family: var(--font-body);
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--color-text-muted);
  margin-bottom: 6px;
}
.detail-col-value {
  font-family: var(--font-display);
  font-size: 1.7rem;
  line-height: 1;
  color: var(--color-text-primary);
  font-variant-numeric: lining-nums tabular-nums;
}
```

---

## Print/Export Mode

```css
@media print {
  .stage {
    transform: none !important;
    width: 297mm;
    height: 167mm;
    background: var(--color-print-bg) !important;
  }
  .nav-bar { display: none !important; }
  .slide { display: flex !important; }
  .slide:not(.active) { display: none !important; }

  /* Force warm brown, no accent color on black-and-white output */
  @media (color: 0) {
    .stat-number { color: var(--color-text-primary) !important; }
    .data-table tr.highlight td { background: #ccc !important; color: #000 !important; }
  }
}
```

---

## Accessibility (Contrast Ratios)

| Pair | Ratio | WCAG Level |
|------|-------|-----------|
| Warm brown text `oklch(0.22 0.018 50)` on cream bg `oklch(0.96 0.018 72)` | ~14.8:1 | AAA |
| Cream text `oklch(0.96 0.018 72)` on dark brown `oklch(0.22 0.018 50)` (aside, table header) | ~14.8:1 | AAA |
| Retro red `oklch(0.52 0.22 22)` on cream bg — stat numbers (large text ≥18pt) | ~5.1:1 | AA (large) |
| Muted text `oklch(0.58 0.018 55)` on cream bg | ~4.6:1 | AA |
| Turquoise `oklch(0.62 0.14 192)` on dark brown (aside stat) | ~6.2:1 | AA |
| Cream text on retro red (highlighted table row) | ~4.9:1 | AA |

All body text meets WCAG AA. The red stat numbers are decorative display-size text (≥36px in practice) exceeding the large-text 3:1 minimum. Focus rings use `outline: 3px solid oklch(0.52 0.22 22)` with 2px offset.

**prefers-reduced-motion:** All animated decorative elements (diagonal rule entrance, circle scale) must respect:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Differentiators from Sibling Styles (N Family)

- **vs. N01 (Art Deco):** Where N01 uses geometric gold symmetry and luxury hotel grandeur, N02 is asymmetric, populist, and poster-bold. Red+turquoise vs. gold+navy.
- **vs. N03+ (other retro):** N02 is specifically 1950s–60s American commercial design. It references identifiable designers (Bass, Rand) and design objects (TWA poster, IBM packaging). Other N-family styles may reference different periods or geographies.
- **Signature move:** The Bebas Neue ALL-CAPS headline + diagonal red rule combination is unique to N02 within this skill's style library. No other style uses Bebas Neue as primary display face.

---

## Fixed-stage content fit

The vw / clamp(...vw...) type values above are preview references. For a generated 1920×1080 deck, use fixed pixel type tokens and let the stage transform handle window scaling; otherwise text shrinks twice. Essential body copy follows knowledge/element/elements.md (normally 28–36px for speaker slides). Shorten copy, change layout, move explanation into speaker notes, or split the slide before reducing type size.
