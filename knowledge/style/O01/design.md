# O01 — organic-moss

**Style ID:** O01  
**Family:** O (Nature/Earth)  
**Scheme:** Warm neutrals + deep moss green  
**Mood:** Grounded, trustworthy, alive, contemplative  
**Occasion:** Environmental science, conservation, sustainability, ecology, botany, natural history  
**Academic Fit:** High — environmental journals, NGO reports, conservation briefs, field research presentations

---

## Design Philosophy (5D)

**Philosophy:** Organic-moss draws from botanical illustration and nature conservancy publishing traditions. Every visual decision asks: "Does this feel like it grew here?" Hairlines echo plant veins, data panels read like field-collection cards, and the warm off-white background evokes archival natural-history paper. Authority comes from restraint — no gradient spectacle, no digital glow — only quiet precision.

**Hierarchy:** Headlines are the assertion (Lora serif, large, dark warm-black). Body and evidence text breathe in Nunito. Section markers in moss green act as taxonomic labels, giving the eye a consistent anchor at the top-left of every content slide. Stat columns follow an 8 × 8 organic rounded-square marker system that replaces the typical bullet.

**Detail:** Warm hairlines (0.5 px, oklch(0.38 0.14 152 / 0.25)) divide content zones like pressed-plant specimen borders. Table rows use alternating warm-tinted fills rather than hard stripes. Folio in Nunito monospaced numerals, positioned bottom-right outside the live-area margin.

**Function:** Fixed 1920 × 1080 stage with CSS scale transform ensures pixel-accurate rendering in all display contexts. Slide switching via display:none / display:flex avoids layout repaint artifacts. All runtime APIs (window.__goToSlide, window.__deckPlan, window.__currentSlide) enable programmatic navigation by wrapper shells.

**Innovation:** The stat-column accent marker is an 8 × 8 px organic rounded square (border-radius: 2px) in moss green — a micro-specimen tag. Section markers use a 3 px left-border line in moss, not a background chip, keeping the palette sparse and natural. The "paper texture suggestion" is achieved with a single radial-gradient noise layer at 2 % opacity — no external image asset required.

---

## Color System (OKLCH CSS tokens)

```css
:root {
  /* Base surface */
  --c-bg:           oklch(0.97 0.012 78);   /* warm off-white, paper */
  --c-surface:      oklch(0.94 0.010 76);   /* slightly deeper panel fill */
  --c-surface-alt:  oklch(0.92 0.009 75);   /* table zebra row, aside bg */

  /* Text */
  --c-text:         oklch(0.14 0.008 70);   /* warm near-black */
  --c-text-muted:   oklch(0.42 0.010 72);   /* secondary / footnote */
  --c-text-inverse: oklch(0.97 0.008 78);   /* text on moss backgrounds */

  /* Accent — deep moss green */
  --c-accent:       oklch(0.38 0.14 152);   /* primary moss green */
  --c-accent-mid:   oklch(0.52 0.12 150);   /* hover / mid-tone moss */
  --c-accent-light: oklch(0.72 0.09 148);   /* tint for highlights */
  --c-accent-dim:   oklch(0.38 0.14 152 / 0.12); /* ghost fill */

  /* Hairline / border */
  --c-border:       oklch(0.38 0.14 152 / 0.25); /* warm moss hairline */
  --c-border-light: oklch(0.14 0.008 70 / 0.10); /* very faint warm rule */

  /* Data highlight (table row) */
  --c-highlight-bg: oklch(0.38 0.14 152 / 0.10); /* moss tint row fill */
  --c-highlight-text: oklch(0.14 0.008 70);        /* same dark text */
}
```

**Differentiator from sibling Nature/Earth styles:**  
O01 uses a warm-hue neutral axis (hue ~70–78°, orange-amber family) rather than a cool or achromatic gray. This keeps the background "alive" while avoiding the cool austerity common to minimal styles. The single accent hue (moss green, hue ~148–152°) sits in complementary tension with the warm background, creating natural contrast without digital brightness.

---

## Typography

```html
<!-- Google Fonts CDN — OFL licensed -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Nunito:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

```css
:root {
  /* Font families */
  --font-headline: 'Lora', Georgia, 'Slides CJK Serif', serif;
  --font-body:     'Nunito', Arial, 'Slides CJK Sans', system-ui, sans-serif;

  /* Type scale (base 16px, major-third ~1.25) */
  --text-xs:   12px;   /* footnote, folio */
  --text-sm:   14px;   /* table cell, caption */
  --text-base: 17px;   /* body paragraph */
  --text-md:   20px;   /* aside headline, stat label */
  --text-lg:   26px;   /* stat value */
  --text-xl:   34px;   /* slide sub-headline */
  --text-2xl:  44px;   /* slide headline (evidence/comparison) */
  --text-3xl:  58px;   /* title slide headline */

  /* Line heights */
  --lh-tight:  1.15;
  --lh-body:   1.65;
  --lh-loose:  1.75;

  /* Letter spacing */
  --ls-headline: -0.01em;
  --ls-section:   0.10em;   /* section marker, all-caps */
  --ls-mono:      0em;

  /* Numeric rendering */
  --fvn: "lnum" 1, "tnum" 1;   /* lining, tabular */
}

/* Section marker label */
.section-marker {
  font-family: var(--font-body);
  font-size: var(--text-xs);
  font-weight: 600;
  letter-spacing: var(--ls-section);
  text-transform: uppercase;
  color: var(--c-accent);
  border-left: 3px solid var(--c-accent);
  padding-left: 10px;
  font-variant-numeric: lining-nums tabular-nums;
}

/* Stat values */
.stat-value {
  font-family: var(--font-body);
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--c-accent);
  font-variant-numeric: lining-nums tabular-nums;
}
```

---

## Background and Structural Elements (CSS)

```css
/* Deck stage — always 1920×1080, scaled by JS */
.deck-stage {
  width: 1920px;
  height: 1080px;
  position: relative;
  overflow: hidden;
  background-color: var(--c-bg);
  font-family: var(--font-body);
  color: var(--c-text);
}

/* Subtle warm paper texture — z-index 0, no asset needed */
.deck-stage::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(ellipse 120% 60% at 15% 80%, oklch(0.82 0.04 80 / 0.06) 0%, transparent 70%),
    radial-gradient(ellipse 80% 80% at 85% 20%, oklch(0.72 0.06 120 / 0.04) 0%, transparent 65%);
  pointer-events: none;
}

/* All semantic content above texture */
.slide-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

/* Moss green accent band — left edge, title slide */
.accent-band {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 8px;
  background: var(--c-accent);
  z-index: 1;
}

/* Warm hairline divider */
.hairline {
  border: none;
  border-top: 0.5px solid var(--c-border);
  margin: 0;
}

/* Organic rounded square stat marker */
.stat-marker {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 2px;
  background: var(--c-accent);
  margin-bottom: 2px;
  flex-shrink: 0;
}
```

---

## Layout Patterns (ASCII diagram)

### Slide 1 — Title

```
┌─[8px moss band]──────────────────────────────────────────────────────────────────┐
│                                                                                    │
│  [org logo / foundation name — top-left, muted]             [folio: 01 / 03]      │
│                                                                                    │
│  ┌─────────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                             │  │
│  │  [Headline: full A-E sentence, Lora 58px, warm-black, max ~16 words/line]  │  │
│  │                                                                             │  │
│  │  [Abstract: Nunito 17px, muted, 2 sentences, max 420px wide]               │  │
│  │                                                                             │  │
│  └─────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                    │
│  [hairline rule]                                                                   │
│                                                                                    │
│  [detail row: 4 cols, each: stat-marker + label + value, Nunito]                  │
│   col1            col2            col3            col4                             │
│                                                                                    │
└───────────────────────────────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence + Aside

```
┌───────────────────────────────────────────────────────────┬───────────────────────┐
│  [section-marker]                                         │                       │
│                                                           │  [aside panel]        │
│  [Headline: Lora 44px, 2–3 lines]                         │  --c-surface-alt bg   │
│                                                           │  supplementary stat   │
│  [3 stat columns — equal width]                           │  + 2-line context     │
│  col: marker + value (700) + label (400) + sub-note       │                       │
│                                                           │  hairline top border  │
│  [hairline]                                               │                       │
│                                                           │                       │
│  [evidence paragraph: Nunito 17px, 3–4 lines]             │                       │
│                                                           │                       │
│                                               [folio]     │           [folio]     │
└───────────────────────────────────────────────────────────┴───────────────────────┘
```

### Slide 3 — Comparison Table

```
┌───────────────────────────────────────────────────────────────────────────────────┐
│  [section-marker]                                                                  │
│                                                                                    │
│  [Headline: Lora 44px]                                                             │
│                                                                                    │
│  [comparison table: 5 rows × 5-6 cols, 1 row highlighted in moss tint]            │
│  ┌────────────────┬──────────┬──────────┬──────────┬──────────┬──────────┐        │
│  │ Model          │ Metric 1 │ Metric 2 │ Metric 3 │ Metric 4 │ Metric 5 │        │
│  ├────────────────┼──────────┼──────────┼──────────┼──────────┼──────────┤        │
│  │ [row 1]        │ ...      │ ...      │ ...      │ ...      │ ...      │        │
│  │ [row 2] ★      │ highlighted in --c-highlight-bg                       │        │
│  │ [row 3–5]      │ ...      │ ...      │ ...      │ ...      │ ...      │        │
│  └────────────────┴──────────┴──────────┴──────────┴──────────┴──────────┘        │
│                                                                                    │
│  [footnote: Nunito 12px muted, source citation]               [folio: 03 / 03]    │
└───────────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat Column

```css
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 28px 32px;
  border-top: 0.5px solid var(--c-border);
}

.stat-col .stat-marker { margin-bottom: 8px; }

.stat-col .stat-value {
  font-family: var(--font-body);
  font-size: var(--text-lg);    /* 26px */
  font-weight: 700;
  color: var(--c-accent);
  font-variant-numeric: lining-nums tabular-nums;
  line-height: 1;
}

.stat-col .stat-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);    /* 14px */
  font-weight: 500;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.stat-col .stat-note {
  font-family: var(--font-body);
  font-size: var(--text-xs);    /* 12px */
  color: var(--c-text-muted);
  line-height: 1.5;
}
```

### Comparison Table

```css
.comparison-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: var(--text-sm);    /* 14px */
}

.comparison-table th {
  background: var(--c-surface);
  color: var(--c-text-muted);
  font-weight: 600;
  font-size: var(--text-xs);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 12px 20px;
  text-align: left;
  border-bottom: 0.5px solid var(--c-border);
}

.comparison-table td {
  padding: 14px 20px;
  color: var(--c-text);
  border-bottom: 0.5px solid var(--c-border-light);
  font-variant-numeric: lining-nums tabular-nums;
}

.comparison-table tr:nth-child(even) td {
  background: oklch(0.96 0.010 76 / 0.6);
}

.comparison-table tr.highlighted td {
  background: var(--c-highlight-bg);
  font-weight: 600;
}

.comparison-table td:first-child { font-weight: 500; }
```

### Folio

```css
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--font-body);
  font-size: var(--text-xs);    /* 12px */
  font-weight: 400;
  color: var(--c-text-muted);
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: 0.04em;
  z-index: 2;
}
```

### Aside Panel

```css
.aside-panel {
  background: var(--c-surface-alt);
  border-top: 3px solid var(--c-accent);
  padding: 36px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  height: 100%;
  box-sizing: border-box;
}

.aside-panel .aside-stat {
  font-family: var(--font-body);
  font-size: 36px;
  font-weight: 700;
  color: var(--c-accent);
  font-variant-numeric: lining-nums tabular-nums;
  line-height: 1;
}

.aside-panel .aside-label {
  font-family: var(--font-body);
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.07em;
}

.aside-panel .aside-body {
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--c-text);
  line-height: var(--lh-body);
}
```

---

## Print/Export Mode

```css
@media print {
  .nav-bar { display: none !important; }
  .slide { display: flex !important; page-break-after: always; }
  .deck-stage { transform: none !important; width: 100% !important; height: auto !important; }
  .deck-wrapper { overflow: visible !important; }
  body { background: white !important; }
  .accent-band { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  .stat-marker { print-color-adjust: exact; }
  .section-marker { print-color-adjust: exact; }
}
```

---

## Accessibility

| Pairing | OKLCH values | Approx contrast ratio | WCAG level |
|---|---|---|---|
| Body text on --c-bg | 0.14 vs 0.97 | ~16:1 | AAA |
| Muted text on --c-bg | 0.42 vs 0.97 | ~5.2:1 | AA |
| Moss accent on --c-bg | 0.38 vs 0.97 | ~6.8:1 | AA (large) |
| Inverse text on --c-accent | 0.97 vs 0.38 | ~6.8:1 | AA |
| Stat value (accent) on --c-bg | 0.38 vs 0.97 | ~6.8:1 | AA |
| Table header on --c-surface | 0.42 vs 0.94 | ~4.6:1 | AA |
| Highlighted row text on tint | 0.14 vs ~0.90 | ~13:1 | AAA |

State is never conveyed by hue alone — the highlighted table row uses both background fill and font-weight 600. Section markers combine color with a left-border affordance. Stat markers are decorative (aria-hidden). All interactive elements (nav dots, prev/next) have visible focus rings (outline: 2px solid var(--c-accent); outline-offset: 2px).

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | Lora | Georgia | Slides CJK Serif |
| Body | Nunito | Arial | Slides CJK Sans |
| Auxiliary / data | Nunito | Arial | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.
