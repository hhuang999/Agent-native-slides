# I01 — cream-paper-warm

**Style ID:** I01
**Family:** I (Texture / Organic)
**Scheme:** Warm monochrome — cream ground, dark brown ink, terracotta accent
**Mood:** Scholarly, editorial, unhurried, tactile
**Occasion:** Culture, arts, editorial, design agencies, branding, heritage, conservation, architecture
**Academic Fit:** Humanities, history, architecture, cultural studies, policy briefs

---

## Design Philosophy (5D)

**Philosophy:** The slide is a printed page, not a screen. Every decision mimics the constraints and pleasures of letterpress: ink weight, white space as intention, type as the primary visual element. No decoration competes with content.

**Hierarchy:** Size and weight alone separate levels. Display headline in Cormorant Garamond at a generous optical size establishes the thesis. Body in Jost carries evidence. Small-cap or tracked uppercase labels act as section markers — never colored, always spaced.

**Detail:** Hairline rules in muted warm gray replace colored dividers. Folio numbers in tabular lining numerals, bottom right. Paper grain via CSS SVG filter (very subtle, optional, disabled under prefers-reduced-motion). Column gutters wide enough to feel like margins in a book.

**Function:** Three-slide arc: title thesis → statistical evidence → comparative judgment. Each slide tells one complete sentence (Assertion-Evidence method). No bullet lists. Stats live in columnar stat-cells with large lining numerals.

**Innovation:** All color tokens in OKLCH so warm cream shifts remain perceptually smooth. The "paper" background is a programmatic CSS grain, not a raster image, keeping the file self-contained and vector-clean. Typography pairing — Cormorant Garamond (Renaissance optical serif) + Jost (contemporary geometric humanist) — is deliberately cross-era, creating tension between artifact and analysis.

---

## Color System (OKLCH CSS tokens)

```css
:root {
  /* Ground */
  --c-paper:        oklch(0.97 0.020 75);   /* warm cream — primary background */
  --c-paper-mid:    oklch(0.93 0.018 72);   /* slightly deeper cream — card/aside bg */
  --c-paper-deep:   oklch(0.88 0.018 70);   /* deeper cream — table zebra, borders */

  /* Ink */
  --c-ink:          oklch(0.18 0.020 55);   /* warm dark brown — primary text */
  --c-ink-mid:      oklch(0.35 0.018 55);   /* medium brown — secondary text, labels */
  --c-ink-light:    oklch(0.55 0.015 60);   /* muted warm gray-brown — captions, folio */

  /* Accent */
  --c-terra:        oklch(0.55 0.16  38);   /* terracotta — active accent, highlights */
  --c-terra-light:  oklch(0.72 0.10  38);   /* pale terracotta — highlight bands */
  --c-terra-dark:   oklch(0.40 0.14  38);   /* deep terracotta — accent text on light bg */

  /* Rule / Border */
  --c-rule:         oklch(0.80 0.012 70);   /* warm light gray — hairline rules */
  --c-rule-strong:  oklch(0.65 0.016 65);   /* stronger rule — table header underline */
}
```

**Palette rationale:** The entire scheme sits inside the 55–75° hue range (orange-yellow warm), giving perceptual unity. Only terracotta (38°) breaks out as a deliberate warm contrast accent. No cool hues enter the deck.

---

## Typography

```html
<!-- Google Fonts CDN — OFL licensed -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
```

```css
:root {
  /* Families */
  --f-display: 'Cormorant Garamond', Georgia, 'Times New Roman', serif;
  --f-body:    'Jost', 'Gill Sans', Optima, sans-serif;

  /* Scale (1920×1080 deck stage, px) */
  --fs-hero:     88px;   /* Slide 1 headline — full thesis sentence */
  --fs-title:    64px;   /* Slide 2–3 headline */
  --fs-subhead:  32px;   /* Section markers, kickers */
  --fs-stat:     72px;   /* Stat numeral */
  --fs-stat-sm:  48px;   /* Smaller stat numeral */
  --fs-body:     26px;   /* Body paragraph */
  --fs-caption:  20px;   /* Table cells, captions */
  --fs-label:    17px;   /* Tiny labels, folio */

  /* Weights */
  --fw-light:   300;
  --fw-regular: 400;
  --fw-medium:  500;
  --fw-semi:    600;

  /* Leading */
  --lh-hero:    1.08;
  --lh-tight:   1.2;
  --lh-normal:  1.55;
  --lh-loose:   1.75;

  /* Numeric variant — always lining tabular for stats/tables */
  --fvn-lining: "lnum" 1, "tnum" 1;
}

/* Utility — lining tabular numerals */
.num { font-variant-numeric: lining-nums tabular-nums; }

/* Section marker style */
.section-marker {
  font-family: var(--f-body);
  font-size: var(--fs-label);
  font-weight: var(--fw-semi);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--c-terra);
}
```

---

## Background and Structural Elements (CSS)

```css
/* Paper grain — SVG feTurbulence, subtle */
.slide-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: var(--c-paper);
  background-image:
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23grain)' opacity='0.045'/%3E%3C/svg%3E");
}

/* Reduced-motion: kill grain entirely */
@media (prefers-reduced-motion: reduce) {
  .slide-bg {
    background-image: none;
  }
}

/* Hairline rule — horizontal */
.rule-h {
  display: block;
  width: 100%;
  height: 1px;
  background: var(--c-rule);
  border: none;
}

/* Decorative thick-thin rule pair (letterpress style) */
.rule-press {
  border: none;
  border-top: 3px solid var(--c-ink);
  box-shadow: 0 2px 0 0 var(--c-rule);
  margin: 0;
}

/* Terracotta accent bar — left border variant */
.accent-bar {
  border-left: 4px solid var(--c-terra);
  padding-left: 28px;
}
```

---

## Layout Patterns (ASCII diagram)

### Slide 1 — Title

```
┌─────────────────────────────────────────────────────────┐
│  [paper bg with subtle grain]                           │
│                                                         │
│  ══════════════════════════════════════════════════     │ ← thick-thin rule
│                                                         │
│  INSTITUTION NAME · REPORT YEAR          [section mark] │
│                                                         │
│  Headline (A-E full sentence)                           │
│  in Cormorant Garamond, --fs-hero                       │
│  max 3 lines, --lh-hero                                 │
│                                                         │
│  ── hairline rule ─────────────────────────             │
│                                                         │
│  Abstract text, 1–2 sentences, --fs-body, Jost          │
│                                                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │ ← 4-col detail
│  │ Label    │ │ Label    │ │ Label    │ │ Label    │  │
│  │ Value    │ │ Value    │ │ Value    │ │ Value    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                         │
│  ══════════════════════════════════════════════════     │ ← bottom rule
│                                              [folio 01] │
└─────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence + Aside

```
┌─────────────────────────────────────────────────┬───────┐
│  SECTION MARK                                   │ ASIDE │
│  Headline (full sentence, --fs-title)           │       │
│                                                 │ stat  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │ text  │
│  │ STAT     │ │ STAT     │ │ STAT     │        │       │
│  │ numeral  │ │ numeral  │ │ numeral  │        │       │
│  │ label    │ │ label    │ │ label    │        │       │
│  └──────────┘ └──────────┘ └──────────┘        │       │
│                                                 │       │
│  Evidence paragraph, --fs-body                  │       │
│                                       [folio 02]│       │
└─────────────────────────────────────────────────┴───────┘
```

### Slide 3 — Comparison Table

```
┌─────────────────────────────────────────────────────────┐
│  SECTION MARK                                           │
│  Headline (full sentence, --fs-title)                   │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │ Col A    │ Col B  │ Col C  │ Col D  │ Col E    │    │
│  ├──────────┼────────┼────────┼────────┼──────────┤    │
│  │ row 1    │        │        │        │          │    │
│  │ row 2    │        │        │        │          │    │
│  │▓ row 3 ▓ │        │        │        │          │    │ ← highlighted
│  │ row 4    │        │        │        │          │    │
│  │ row 5    │        │        │        │          │    │
│  └──────────┴────────┴────────┴────────┴──────────┘    │
│                                                         │
│  † Footnote text                          [folio 03]    │
└─────────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat columns

```css
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 32px 28px;
  border-top: 3px solid var(--c-terra);
  background: var(--c-paper-mid);
}

.stat-numeral {
  font-family: var(--f-display);
  font-size: var(--fs-stat);
  font-weight: var(--fw-light);
  color: var(--c-ink);
  line-height: 1;
  font-variant-numeric: lining-nums tabular-nums;
}

.stat-label {
  font-family: var(--f-body);
  font-size: var(--fs-label);
  font-weight: var(--fw-medium);
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--c-ink-mid);
}
```

### Comparison table

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--f-body);
  font-size: var(--fs-caption);
  color: var(--c-ink);
}

.data-table th {
  font-weight: var(--fw-semi);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-align: left;
  padding: 12px 18px;
  border-bottom: 2px solid var(--c-rule-strong);
  color: var(--c-ink-mid);
}

.data-table td {
  padding: 14px 18px;
  border-bottom: 1px solid var(--c-rule);
  font-variant-numeric: lining-nums tabular-nums;
}

.data-table tr.highlight td {
  background: var(--c-terra-light);
  font-weight: var(--fw-medium);
}

.data-table td.num-cell {
  text-align: right;
  font-variant-numeric: lining-nums tabular-nums;
}
```

### Folio

```css
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--f-body);
  font-size: var(--fs-label);
  font-weight: var(--fw-regular);
  color: var(--c-ink-light);
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: 0.05em;
}
```

### Aside panel

```css
.aside-panel {
  background: var(--c-paper-deep);
  border-left: 4px solid var(--c-terra);
  padding: 36px 32px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.aside-stat {
  font-family: var(--f-display);
  font-size: var(--fs-stat-sm);
  font-weight: var(--fw-light);
  color: var(--c-terra-dark);
  font-variant-numeric: lining-nums tabular-nums;
}
```

---

## Print / Export Mode

```css
@media print {
  .slide-bg { background-image: none; }
  .nav-bar  { display: none !important; }
  .slide    { page-break-after: always; display: block !important; }
  body      { background: white; }
  .folio    { color: var(--c-ink-light); }
}
```

---

## Accessibility (contrast ratios)

| Pair | Foreground | Background | Ratio | Pass |
|------|-----------|------------|-------|------|
| Body text | `--c-ink` (L≈18%) | `--c-paper` (L≈97%) | ~11.2:1 | AAA |
| Secondary text | `--c-ink-mid` (L≈35%) | `--c-paper` | ~6.8:1 | AA |
| Caption/folio | `--c-ink-light` (L≈55%) | `--c-paper` | ~3.8:1 | AA large |
| Accent label | `--c-terra-dark` (L≈40%) | `--c-paper` | ~5.9:1 | AA |
| Table highlight | `--c-ink` | `--c-terra-light` (L≈72%) | ~7.4:1 | AAA |
| Stat numeral | `--c-ink` | `--c-paper-mid` (L≈93%) | ~10.1:1 | AAA |

---

## Differentiators from Sibling Styles

Within Family I (Texture / Organic):

| Trait | I01 cream-paper-warm | Other I-family styles |
|-------|---------------------|----------------------|
| Temperature | Fully warm (55–75° hue band) | Varies by sibling |
| Grain | Programmatic SVG feTurbulence, no raster | May use canvas or pseudo |
| Color count | 2-hue (cream + terracotta) | Potentially richer palette |
| Motion | None — paper is static | May include transitions |
| Type character | Cormorant + Jost cross-era tension | Different pairings |
| Primary occasion | Editorial / cultural / heritage | Varies |
