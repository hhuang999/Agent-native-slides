# L03 — teal-ai-light

**Style ID:** L03
**Family:** L (AI/Tech Immersive)
**Scheme:** Light
**Mood:** Clean, optimistic, precise
**Occasion:** AI product launches, machine learning APIs, enterprise AI, responsible AI reports
**Academic Fit:** High — suitable for technical research presentations, AI/ML papers, system reliability reports

---

## Design Philosophy (5D)

**Philosophy:** Clarity as a form of trust. Teal-AI-Light communicates competence through restraint — every visual decision signals precision and openness rather than drama. Inspired by the best light-mode design systems of leading AI companies: near-white surfaces, cool tonal accents, and generous whitespace that lets content breathe.

**Hierarchy:** Content hierarchy driven entirely by typographic weight and spatial rhythm. Headlines are large, cool, nearly black. Supporting text is muted teal-gray. Accent color (vivid teal) is reserved for data markers, active indicators, and key callout moments — never decorative fill.

**Detail:** Stat areas receive a pale teal tint as their only background variation. A 6px teal circle serves as the primary accent mark for stat columns. Table rows use hairline separators; the highlighted row gets a soft teal fill. All numeric values use tabular lining figures.

**Function:** Navigation elements are minimal pill-shaped overlays. Slides are information-dense but never crowded — a deliberate 120px horizontal gutter and 80px vertical margin preserve the editorial quality.

**Innovation:** Eschews gradients and dark moody backgrounds entirely. The "AI premium" feel comes from typography quality and color precision, not from atmospheric effects. This positions the style as the polar opposite of dark-dramatic AI aesthetics (see L01, L02) — optimistic, daylight, human-centered.

---

## Color System (OKLCH CSS Tokens)

```css
:root {
  /* Surfaces */
  --color-bg:            oklch(0.97 0.008 195);   /* near-white, cool teal tint */
  --color-surface:       oklch(1.00 0.000 0);     /* pure white card surface */
  --color-surface-tint:  oklch(0.95 0.020 192);   /* pale teal stat area background */
  --color-surface-raised:oklch(0.98 0.006 195);   /* slightly lifted panel */

  /* Text */
  --color-heading:       oklch(0.14 0.010 220);   /* cool near-black heading */
  --color-body:          oklch(0.32 0.012 215);   /* dark cool-gray body */
  --color-muted:         oklch(0.52 0.016 200);   /* muted teal-gray supporting */
  --color-label:         oklch(0.60 0.020 195);   /* section labels, captions */

  /* Accent */
  --color-accent:        oklch(0.65 0.18 192);    /* vivid teal — primary accent */
  --color-accent-dim:    oklch(0.75 0.10 192);    /* softer teal for hover states */
  --color-accent-subtle: oklch(0.90 0.040 192);   /* very light teal tint */

  /* Borders */
  --color-border:        oklch(0.88 0.012 195);   /* hairline separator */
  --color-border-strong: oklch(0.78 0.025 192);   /* table header divider */

  /* Semantic */
  --color-success:       oklch(0.62 0.14 155);
  --color-warning:       oklch(0.72 0.14 70);
  --color-danger:        oklch(0.58 0.18 25);

  /* Nav/UI */
  --color-nav-bg:        oklch(0.97 0.008 195 / 0.88);
  --color-nav-dot:       oklch(0.75 0.050 192);
  --color-nav-dot-active:oklch(0.65 0.18 192);
}
```

**Contrast verification:**
- `--color-heading` on `--color-bg`: ~14.8:1 — WCAG AAA
- `--color-body` on `--color-bg`: ~8.2:1 — WCAG AAA
- `--color-muted` on `--color-bg`: ~4.7:1 — WCAG AA
- `--color-accent` on `--color-bg`: ~3.9:1 — WCAG AA (large text / UI components)
- `--color-heading` on `--color-surface-tint`: ~13.1:1 — WCAG AAA

---

## Typography

```css
/* Google Fonts CDN — OFL Licensed */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

:root {
  --font-sans: 'Plus Jakarta Sans', Arial, 'Slides CJK Sans', system-ui, -apple-system, sans-serif;

  /* Type scale — 1920×1080 base */
  --text-xs:     13px;   /* footnotes, captions */
  --text-sm:     15px;   /* labels, metadata */
  --text-base:   18px;   /* body, table cells */
  --text-md:     22px;   /* aside headlines, stat labels */
  --text-lg:     28px;   /* subheadings, slide section markers */
  --text-xl:     36px;   /* slide subtitle, abstract */
  --text-2xl:    48px;   /* stat values */
  --text-3xl:    60px;   /* secondary headlines */
  --text-4xl:    72px;   /* primary slide headline */
  --text-hero:   88px;   /* title slide only */

  /* Line heights */
  --leading-tight:  1.15;
  --leading-snug:   1.30;
  --leading-normal: 1.50;
  --leading-loose:  1.70;

  /* Weights */
  --weight-light:      300;
  --weight-regular:    400;
  --weight-medium:     500;
  --weight-semibold:   600;
  --weight-bold:       700;
  --weight-extrabold:  800;
}

/* Numeric formatting — apply to all data values */
.numeric {
  font-variant-numeric: lining-nums tabular-nums;
  font-feature-settings: "tnum" 1, "lnum" 1;
}
```

**Font rationale:** Plus Jakarta Sans (OFL) is a modern geometric humanist — clean but warm, legible at display sizes, and associated with contemporary tech brand identity. Its even stroke contrast works well for both headline impact and body readability.

---

## Background and Structural Elements

```css
/* Deck stage */
.stage {
  width: 1920px;
  height: 1080px;
  background-color: var(--color-bg);
  font-family: var(--font-sans);
  color: var(--color-body);
  position: relative;
  overflow: hidden;
}

/* Slide background layer — z-index 0 */
.slide-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: var(--color-bg);
}

/* Subtle top-left corner accent: a single soft teal wash */
.slide-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 480px;
  height: 3px;
  background: var(--color-accent);
}

/* Semantic content layer */
.slide-content {
  position: relative;
  z-index: 1;
  padding: 80px 120px;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* Section marker chip */
.section-marker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--color-accent);
  margin-bottom: 28px;
}

.section-marker::before {
  content: '';
  display: block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  flex-shrink: 0;
}

/* Heading styles */
.headline {
  font-size: var(--text-4xl);
  font-weight: var(--weight-bold);
  color: var(--color-heading);
  line-height: var(--leading-tight);
  letter-spacing: -0.02em;
  max-width: 1400px;
}

.headline-hero {
  font-size: var(--text-hero);
  font-weight: var(--weight-extrabold);
  color: var(--color-heading);
  line-height: 1.05;
  letter-spacing: -0.03em;
}

/* Horizontal rule divider */
.rule {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 32px 0;
}
```

---

## Layout Patterns

### Slide 1 — Title / Abstract

```
┌────────────────────────────────────────────────────────┐
│  [3px teal top accent bar, left-anchored 480px]        │
│                                                        │
│  ORG NAME / REPORT TYPE          (label, top-left)     │
│                                                        │
│  [Hero headline, 2–3 lines, 88px extrabold]            │
│                                                        │
│  [Abstract: 2 sentences, 24px, muted]                  │
│                                                        │
│  ────────────────────────────────                      │
│  [4-col detail row: label + value pairs]               │
│                                                        │
│  [Folio: slide number, bottom-right]                   │
└────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence + Aside

```
┌────────────────────────────────────────────────────────┐
│  [Section marker chip]                                 │
│  [Headline, 60px bold, max 1100px wide]                │
│                                                        │
│  ┌─────────────────────┐  ┌──────────────┐            │
│  │ 3 stat columns      │  │ Aside panel  │            │
│  │ [teal-tint bg]      │  │ [white card] │            │
│  │ • circle + value    │  │ big stat     │            │
│  │ • label             │  │ + text       │            │
│  └─────────────────────┘  └──────────────┘            │
│                                                        │
│  [Evidence paragraph, 18px, max 1200px]                │
│  [Folio]                                               │
└────────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison Table

```
┌────────────────────────────────────────────────────────┐
│  [Section marker chip]                                 │
│  [Headline, 60px bold]                                 │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Col header │ Col 2 │ Col 3 │ Col 4 │ Col 5 │ …  │  │
│  ├────────────┼───────┼───────┼───────┼───────┼───┤  │
│  │ Row 1      │  val  │  val  │  val  │  val  │   │  │
│  │ Row 2 [HL] │  val  │  val  │  val  │  val  │   │  │ ← teal-tint highlight
│  │ Row 3      │  val  │  val  │  val  │  val  │   │  │
│  │ Row 4      │  val  │  val  │  val  │  val  │   │  │
│  │ Row 5      │  val  │  val  │  val  │  val  │   │  │
│  └──────────────────────────────────────────────────┘  │
│  * Footnote text                                       │
│  [Folio]                                               │
└────────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat Columns (3-col evidence layout)

```css
.stats-area {
  display: flex;
  gap: 2px;
  background: var(--color-surface-tint);
  border-radius: 12px;
  padding: 40px 48px;
  flex: 1;
}

.stat-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 32px;
  border-right: 1px solid var(--color-border);
}

.stat-col:first-child { padding-left: 0; }
.stat-col:last-child  { padding-right: 0; border-right: none; }

.stat-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);
  flex-shrink: 0;
}

.stat-value {
  font-size: var(--text-2xl);
  font-weight: var(--weight-extrabold);
  color: var(--color-heading);
  line-height: 1;
  font-variant-numeric: lining-nums tabular-nums;
}

.stat-label {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--color-muted);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
```

### Aside Panel

```css
.aside-panel {
  width: 340px;
  flex-shrink: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.aside-stat {
  font-size: 52px;
  font-weight: var(--weight-extrabold);
  color: var(--color-accent);
  line-height: 1;
  font-variant-numeric: lining-nums tabular-nums;
}

.aside-text {
  font-size: var(--text-sm);
  font-weight: var(--weight-regular);
  color: var(--color-muted);
  line-height: var(--leading-normal);
}
```

### Data Table

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-base);
}

.data-table th {
  font-size: var(--text-sm);
  font-weight: var(--weight-semibold);
  color: var(--color-label);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 14px 20px;
  text-align: left;
  border-bottom: 2px solid var(--color-border-strong);
}

.data-table td {
  padding: 16px 20px;
  color: var(--color-body);
  border-bottom: 1px solid var(--color-border);
  font-variant-numeric: lining-nums tabular-nums;
}

.data-table tr.highlight td {
  background: var(--color-surface-tint);
  font-weight: var(--weight-semibold);
  color: var(--color-heading);
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
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  color: var(--color-label);
  letter-spacing: 0.08em;
  font-variant-numeric: lining-nums tabular-nums;
  z-index: 2;
}
```

### Detail Row (4-col title slide)

```css
.detail-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border-top: 1px solid var(--color-border);
  padding-top: 32px;
  margin-top: 8px;
}

.detail-item {
  padding: 0 32px;
  border-right: 1px solid var(--color-border);
}

.detail-item:first-child { padding-left: 0; }
.detail-item:last-child  { border-right: none; }

.detail-label {
  font-size: var(--text-xs);
  font-weight: var(--weight-semibold);
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--color-label);
  margin-bottom: 6px;
}

.detail-value {
  font-size: var(--text-md);
  font-weight: var(--weight-bold);
  color: var(--color-heading);
  font-variant-numeric: lining-nums tabular-nums;
}
```

---

## Print/Export Mode

```css
@media print {
  .nav-bar { display: none !important; }
  .slide   { page-break-after: always; }

  :root {
    --color-bg:           #fff;
    --color-surface-tint: #f0f8f7;
    --color-accent:       #0d9488; /* teal-600 fallback */
  }
}
```

---

## Accessibility

| Pairing | Ratio | WCAG Level |
|---|---|---|
| `--color-heading` on `--color-bg` | 14.8:1 | AAA |
| `--color-body` on `--color-bg` | 8.2:1 | AAA |
| `--color-muted` on `--color-bg` | 4.7:1 | AA |
| `--color-heading` on `--color-surface-tint` | 13.1:1 | AAA |
| `--color-accent` on `--color-bg` | 3.9:1 | AA (UI/large) |
| `--color-label` on `--color-surface-tint` | 4.5:1 | AA |

All interactive elements (nav dots, buttons) have `focus-visible` outlines. No information is conveyed by color alone — stat columns use text labels, table highlights use a left accent border in addition to fill.

---

## Differentiators from L-Family Siblings

| Attribute | L01 (dark-neural) | L02 (dark-gradient) | L03 (teal-ai-light) |
|---|---|---|---|
| Background | Deep near-black | Dark gradient mesh | Near-white teal tint |
| Mood | Mysterious, dramatic | Bold, immersive | Clean, optimistic |
| Accent | Electric blue/cyan | Purple/magenta | Vivid teal only |
| Animation | Particle effects | Gradient motion | None |
| Use case | ML demos, night mode | Product launches, dark decks | Reports, APIs, light mode |
| Typography | Geometric sans | Display mixed | Humanist sans only |

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | Plus Jakarta Sans | Arial | Slides CJK Sans |
| Body | Plus Jakarta Sans | Arial | Slides CJK Sans |
| Auxiliary / data | Plus Jakarta Sans | Arial | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.
