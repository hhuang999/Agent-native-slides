# H02 — trust-blue

**Style ID:** H02
**Family:** H (Corporate/Business)
**Scheme:** Dark authority — deep navy + gold accent
**Mood:** Authoritative, institutional, trustworthy, gravitas
**Occasion:** Financial services, government, insurance, large enterprise, public sector, regulatory bodies
**Academic Fit:** Low (policy reports, public-sector research briefs)

---

## Design Philosophy (5D)

**Philosophy:** Trust is built through visual restraint and historical association. Navy and gold have signaled institutional authority for centuries — central banks, government seals, military commissions. This palette asks the audience to trust the source before they read the argument. Every design decision reinforces that signal: serif headlines for editorial credibility, generous white space for confidence, gold used sparingly so it commands attention when it appears.

**Hierarchy:** Three-tier reading order anchored by type weight and gold accents. Primary level: headline in Libre Baskerville, white, large — carries the Assertion-Evidence claim. Secondary level: stats and supporting labels in Libre Franklin semibold — quantitative evidence. Tertiary level: body prose in Franklin regular — elaboration and context. The gold horizontal rule is a visual gate that separates stat values from their labels, drawing the eye to the number first.

**Detail:** Gold is applied at 1px horizontal rules (32px wide) above stat values, table header underlines, and section marker text. No gradients, no shadows, no bevels. Borders in low-opacity gold or white. Texture comes entirely from typographic contrast — serif vs. sans, light vs. heavy.

**Function:** Designed for projection in formal settings (boardrooms, legislative chambers, conference rooms) and for print-to-PDF annual report export. Fixed 1920×1080 stage scales cleanly. Data tables and stat columns are the primary evidence formats. Footnote and folio provide sourcing and pagination cues typical of formal reports.

**Innovation:** The gold rule as stat separator is borrowed from financial report typography rather than presentation software conventions. Section markers use gold uppercase tracking (letter-spacing: 0.15em) rather than color blocks, preserving the dark background throughout for unbroken authority.

---

## Color System (OKLCH CSS tokens)

```css
:root {
  /* Core surfaces */
  --c-bg:            oklch(0.22 0.06 255);   /* Deep navy — main deck background */
  --c-bg-raised:     oklch(0.26 0.055 255);  /* Slightly lighter navy — cards, asides */
  --c-bg-overlay:    oklch(0.19 0.065 255);  /* Deeper navy — table header row */

  /* Accent */
  --c-gold:          oklch(0.72 0.14 68);    /* Warm gold — primary accent */
  --c-gold-dim:      oklch(0.62 0.11 68);    /* Muted gold — secondary uses, borders */
  --c-gold-subtle:   oklch(0.35 0.06 68);    /* Very muted gold — table row highlights */

  /* Text */
  --c-text-primary:  oklch(0.97 0.00 0);     /* Near-white — headlines, body */
  --c-text-secondary:oklch(0.82 0.02 255);   /* Soft blue-white — labels, captions */
  --c-text-muted:    oklch(0.65 0.04 255);   /* Mid-tone — footnotes, metadata */

  /* Borders */
  --c-border:        oklch(0.35 0.05 255);   /* Subtle navy border */
  --c-border-gold:   oklch(0.55 0.09 68);    /* Gold border — table, stat rules */

  /* Semantic — status */
  --c-positive:      oklch(0.78 0.12 160);   /* Muted teal-green — positive delta */
  --c-negative:      oklch(0.72 0.14 25);    /* Muted amber-red — negative delta */
  --c-neutral:       oklch(0.72 0.03 255);   /* Cool grey — neutral delta */

  /* Table highlight row */
  --c-row-highlight: oklch(0.29 0.07 255);   /* Slightly lifted navy */
  --c-row-highlight-border: var(--c-gold);
}
```

---

## Typography (Google Fonts CDN import, CSS vars, scale comments)

```html
<!-- OFL fonts from Google Fonts CDN -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Libre+Franklin:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

```css
:root {
  /* Families */
  --font-serif:  'Libre Baskerville', Georgia, 'Slides CJK Serif', serif;
  --font-sans:   'Libre Franklin', Arial, 'Slides CJK Sans', system-ui, sans-serif;

  /* Scale — base 16px, slide context 1920×1080 */
  --fs-display:  72px;   /* Slide 1 title */
  --fs-h1:       52px;   /* Slide 2/3 main headline */
  --fs-h2:       36px;   /* Section marker, aside headline */
  --fs-h3:       28px;   /* Stat value label, table column header */
  --fs-body-lg:  22px;   /* Lead paragraph */
  --fs-body:     18px;   /* Standard body */
  --fs-caption:  15px;   /* Captions, footnotes */
  --fs-label:    13px;   /* Metadata, folio */

  /* Leading */
  --lh-display:  1.08;
  --lh-heading:  1.18;
  --lh-body:     1.6;

  /* Tracking */
  --ls-section:  0.15em;   /* Section marker uppercase */
  --ls-label:    0.06em;   /* Column headers */

  /* Numeric rendering */
  font-variant-numeric: lining-nums tabular-nums;
}

/* Headline — serif */
.slide-headline {
  font-family: var(--font-serif);
  font-weight: 700;
  line-height: var(--lh-heading);
  color: var(--c-text-primary);
}

/* Body — sans */
.body-text {
  font-family: var(--font-sans);
  font-weight: 400;
  line-height: var(--lh-body);
  color: var(--c-text-secondary);
}
```

**Font rationale:** Libre Baskerville (OFL) brings editorial gravitas — wide serifs, high x-height, strong contrast at large sizes. Libre Franklin (OFL) is its sans companion in the same type family, ensuring optical cohesion while providing the clarity and tabular legibility needed for data labels and body text.

---

## Background and Structural Elements (CSS)

```css
/* Deck stage — fixed 1920×1080 */
.deck-stage {
  width: 1920px;
  height: 1080px;
  background-color: var(--c-bg);
  position: relative;
  overflow: hidden;
  /* z-index 0 for background layer */
}

/* Subtle vertical gradient for depth — background layer */
.deck-stage::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    160deg,
    oklch(0.25 0.07 258) 0%,
    oklch(0.22 0.06 255) 45%,
    oklch(0.18 0.065 252) 100%
  );
  z-index: 0;
}

/* Gold accent bar — left edge vertical rule */
.deck-stage::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 6px;
  height: 100%;
  background: var(--c-gold);
  z-index: 0;
}

/* All semantic content above background */
.slide-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

/* Section marker — gold uppercase tracking */
.section-marker {
  font-family: var(--font-sans);
  font-size: var(--fs-label);
  font-weight: 600;
  color: var(--c-gold);
  text-transform: uppercase;
  letter-spacing: var(--ls-section);
}

/* Gold horizontal rule — stat separator */
.stat-rule {
  display: block;
  width: 32px;
  height: 1px;
  background: var(--c-gold);
  margin-bottom: 12px;
}

/* Institution wordmark area — top-right */
.slide-wordmark {
  position: absolute;
  top: 48px;
  right: 96px;
  font-family: var(--font-sans);
  font-size: var(--fs-caption);
  font-weight: 600;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  z-index: 1;
}

/* Decorative divider line */
.divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, var(--c-gold-dim) 0%, transparent 80%);
  margin: 32px 0;
}
```

---

## Layout Patterns (ASCII diagram)

### Slide 1 — Title

```
┌────────────────────────────────────────────────────────────────┐
│ [6px gold bar]  [wordmark top-right]                           │
│                                                                  │
│  ░░ 96px left margin ░░                                         │
│                                                                  │
│  [section label gold uppercase]         96px ▲                 │
│                                                                  │
│  [Display headline — serif 72px]                                │
│  [max-width 1360px, 2-3 lines]                                  │
│                                                                  │
│  ─ gold divider ─────────────────                               │
│                                                                  │
│  [Abstract 2 sentences — sans 22px]                             │
│  [max-width 960px]                                              │
│                                                                  │
│  [4-col detail row — sans 15px]                                 │
│  Program  │  Period  │  Coverage  │  Status                     │
│                                               [folio] ▼ 36px   │
└────────────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence + Aside

```
┌────────────────────────────────────────────────────────────────┐
│ [6px gold bar]  [wordmark]                                      │
│                                                                  │
│  [section marker]                                               │
│  [Headline — serif 52px, max 1100px]                            │
│                                                                  │
│  ┌─────────────┬─────────────┬─────────────┐  ┌─────────────┐ │
│  │ [gold rule] │ [gold rule] │ [gold rule] │  │ Aside panel │ │
│  │  Stat value │  Stat value │  Stat value │  │ supplt stat │ │
│  │  label      │  label      │  label      │  │ + 2-3 lines │ │
│  └─────────────┴─────────────┴─────────────┘  └─────────────┘ │
│                                                                  │
│  [Evidence paragraph — sans 18px, max 860px]                   │
│                                               [folio] ▼ 36px   │
└────────────────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison Table

```
┌────────────────────────────────────────────────────────────────┐
│ [6px gold bar]  [wordmark]                                      │
│                                                                  │
│  [section marker]                                               │
│  [Headline — serif 52px, max 1100px]                            │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ [table header row — dark overlay bg, gold bottom border] │  │
│  │ Model │ Cost Eff. │ Coverage │ Maintenance │ Overall     │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ Row 1                                                    │  │
│  │ Row 2 ← highlighted (gold left border + raised bg)      │  │
│  │ Row 3                                                    │  │
│  │ Row 4                                                    │  │
│  │ Row 5                                                    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  [Footnote — sans 13px muted]         [folio] ▼ 36px          │
└────────────────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat columns (Slide 2)

```css
.stat-columns {
  display: flex;
  gap: 0;
  margin: 48px 0 40px;
}

.stat-col {
  flex: 1;
  padding: 0 48px 0 0;
  border-right: 1px solid var(--c-border);
}
.stat-col:last-child { border-right: none; }

.stat-rule {           /* 32px×1px gold rule above value */
  display: block;
  width: 32px;
  height: 1px;
  background: var(--c-gold);
  margin-bottom: 16px;
}

.stat-value {
  font-family: var(--font-sans);
  font-size: 64px;
  font-weight: 700;
  line-height: 1;
  color: var(--c-text-primary);
  font-variant-numeric: lining-nums tabular-nums;
}

.stat-unit {
  font-family: var(--font-sans);
  font-size: 28px;
  font-weight: 400;
  color: var(--c-gold);
  margin-left: 4px;
}

.stat-label {
  font-family: var(--font-sans);
  font-size: var(--fs-caption);
  font-weight: 500;
  color: var(--c-text-secondary);
  margin-top: 10px;
  line-height: 1.4;
  max-width: 220px;
}
```

### Aside panel

```css
.aside-panel {
  background: var(--c-bg-raised);
  border-left: 3px solid var(--c-gold);
  padding: 32px 36px;
  min-width: 320px;
  max-width: 380px;
}

.aside-stat {
  font-family: var(--font-sans);
  font-size: 52px;
  font-weight: 700;
  color: var(--c-gold);
  font-variant-numeric: lining-nums tabular-nums;
  line-height: 1;
}

.aside-text {
  font-family: var(--font-sans);
  font-size: var(--fs-caption);
  color: var(--c-text-secondary);
  line-height: 1.55;
  margin-top: 12px;
}
```

### Data table

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-sans);
  font-variant-numeric: lining-nums tabular-nums;
}

.data-table thead tr {
  background: var(--c-bg-overlay);
  border-bottom: 2px solid var(--c-gold);
}

.data-table thead th {
  font-size: var(--fs-caption);
  font-weight: 600;
  color: var(--c-gold);
  text-transform: uppercase;
  letter-spacing: var(--ls-label);
  padding: 18px 24px;
  text-align: left;
}
.data-table thead th:not(:first-child) { text-align: right; }

.data-table tbody tr {
  border-bottom: 1px solid var(--c-border);
}

.data-table tbody tr:hover {
  background: oklch(0.24 0.06 255);
}

.data-table tbody tr.row-highlight {
  background: var(--c-row-highlight);
  border-left: 4px solid var(--c-gold);
}

.data-table tbody tr.row-highlight td:first-child {
  padding-left: 20px;
}

.data-table tbody td {
  padding: 16px 24px;
  font-size: var(--fs-body);
  color: var(--c-text-primary);
}
.data-table tbody td:not(:first-child) {
  text-align: right;
  color: var(--c-text-secondary);
}

.data-table tbody tr.row-highlight td {
  color: var(--c-text-primary);
  font-weight: 600;
}

.tag {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 3px;
  font-size: 13px;
  font-weight: 600;
}
.tag-best    { background: oklch(0.28 0.08 160); color: var(--c-positive); }
.tag-good    { background: oklch(0.28 0.06 255); color: var(--c-text-secondary); }
.tag-average { background: oklch(0.26 0.04 255); color: var(--c-text-muted); }
```

### Folio

```css
.slide-folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--font-sans);
  font-size: var(--fs-label);
  font-weight: 500;
  color: var(--c-text-muted);
  font-variant-numeric: lining-nums tabular-nums;
  z-index: 1;
}
```

### Footnote

```css
.slide-footnote {
  font-family: var(--font-sans);
  font-size: var(--fs-label);
  color: var(--c-text-muted);
  border-top: 1px solid var(--c-border);
  padding-top: 16px;
  margin-top: 24px;
  line-height: 1.5;
}
```

---

## Print/Export Mode

```css
@media print {
  .deck-stage {
    transform: none !important;
    width: 100vw !important;
    height: auto !important;
    page-break-after: always;
  }
  .slide {
    page-break-after: always;
    background-color: #0d1a3a !important; /* fallback for print */
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .nav-bar { display: none !important; }
}
```

---

## Accessibility (contrast ratios)

All ratios measured against slide background `oklch(0.22 0.06 255)` (approx `#0d1a3a`).

| Element | Foreground | Approximate hex | Ratio | WCAG |
|---|---|---|---|---|
| Headline | `--c-text-primary` | `#f8f8fa` | ~15.8:1 | AAA |
| Body text | `--c-text-secondary` | `#c4cce0` | ~9.2:1 | AAA |
| Muted/caption | `--c-text-muted` | `#8898b8` | ~4.8:1 | AA |
| Gold accent text | `--c-gold` | `#c4952a` | ~5.6:1 | AA (large) |
| Gold dim | `--c-gold-dim` | `#a07820` | ~4.2:1 | AA (large) |
| Positive tag text | `--c-positive` | `#62c9a0` | ~6.4:1 | AA |

Gold used at body size meets AA only for large text (18px+ regular or 14px+ bold). Gold is used only for stat values (64px), section markers (13px bold uppercase), and accent rules — all qualify as large text or decorative. Body copy remains on `--c-text-primary` or `--c-text-secondary`, both AAA.

---

## Differentiators from sibling styles in H family

| Concern | H02 trust-blue | H01 (if exists) | Notes |
|---|---|---|---|
| Background | Deep navy `oklch(0.22 0.06 255)` | — | Dark authority vs. light corporate |
| Accent | Gold `oklch(0.72 0.14 68)` | — | Classic institutional, not tech blue |
| Headline font | Libre Baskerville (serif) | — | Editorial gravitas |
| Body font | Libre Franklin | — | Same-family sans companion |
| Stat separator | Gold 32px×1px horizontal rule | — | Report-typography convention |
| Primary use | Financial/government annual reports | — | Boardroom/print |
| Mood | Gravitas, trust, authority | — | Conservative, never trendy |

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | Libre Baskerville | Georgia | Slides CJK Serif |
| Body | Libre Franklin | Arial | Slides CJK Sans |
| Auxiliary / data | Libre Franklin | Arial | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.
