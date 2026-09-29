# I03 — warm-film-grain

**Style ID:** I03
**Family:** I (Texture/Organic)
**Scheme:** Dark warm analog
**Mood:** Cinematic, contemplative, editorial
**Occasion:** Photography, documentary film, cultural journalism, analog design, archival
**Academic Fit:** Humanities, film studies, journalism, design history, cultural studies

---

## Design Philosophy (5D)

**Philosophy:** Channels the darkroom and the projection booth — warmth through chemical light rather than digital clarity. Every surface carries grain; every edge breathes.

**Hierarchy:** Headline leads with editorial weight (Instrument Serif), resting on a deep warm ground. Subheadings and section markers are set in Space Grotesk caps. Body text is loose, cream-toned, never pure white.

**Detail:** Film grain implemented as a layered CSS background noise pattern using radial gradients and pseudo-element overlays. A vignette darkens the edges of every slide, drawing the eye center. Folio and captions use monospaced digits for precise registration.

**Function:** High contrast between cream text and near-black ground ensures readability at projection scale. Amber-gold accent guides the eye to key data. Tables and stat columns use subtle grain-over-container texture.

**Innovation:** The "grain" effect is pure CSS — no image assets. A multi-stop radial noise pattern on the `::before` pseudo-element is composited at low opacity over every slide, creating analog texture without HTTP cost. Vignette is a second radial gradient on the slide root, separate from content z-stack.

---

## Color System (OKLCH CSS tokens)

```css
:root {
  /* Backgrounds */
  --c-ground:        oklch(0.12 0.020 40);   /* deep warm dark brown */
  --c-ground-raised: oklch(0.16 0.022 42);   /* lifted card surface */
  --c-vignette:      oklch(0.07 0.015 38);   /* vignette edge / deep shadow */

  /* Text */
  --c-text-primary:  oklch(0.94 0.014 72);   /* warm cream / ivory */
  --c-text-secondary:oklch(0.72 0.018 66);   /* warm mid-tone sand */
  --c-text-muted:    oklch(0.52 0.016 60);   /* receded warm gray */

  /* Accent */
  --c-accent:        oklch(0.68 0.16  68);   /* warm amber-gold */
  --c-accent-dim:    oklch(0.54 0.12  68);   /* subdued amber */
  --c-accent-glow:   oklch(0.74 0.18  70);   /* highlight / hover */

  /* Semantic */
  --c-positive:      oklch(0.65 0.10  140);  /* warm sage green */
  --c-caution:       oklch(0.72 0.14  55);   /* amber warning */
  --c-border:        oklch(0.22 0.018 45);   /* warm dark border */
  --c-border-subtle: oklch(0.18 0.015 42);   /* very subtle separator */
}
```

---

## Typography

```css
/* Google Fonts CDN (OFL) */
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Space+Grotesk:wght@300;400;500;600&display=swap');

:root {
  /* Font stacks */
  --font-display: 'Instrument Serif', 'Georgia', serif;
  --font-body:    'Space Grotesk', 'system-ui', sans-serif;

  /* Type scale (1920px base) */
  --ts-xs:   clamp(0.75rem, 0.9vw,  0.875rem);  /* captions, folios */
  --ts-sm:   clamp(0.875rem,1.0vw,  1.0rem);    /* footnotes, labels */
  --ts-base: clamp(1.0rem,  1.15vw, 1.125rem);  /* body */
  --ts-md:   clamp(1.125rem,1.4vw,  1.375rem);  /* aside, lead */
  --ts-lg:   clamp(1.5rem,  1.9vw,  2.0rem);    /* section markers */
  --ts-xl:   clamp(2.0rem,  2.8vw,  3.0rem);    /* evidence headlines */
  --ts-2xl:  clamp(2.8rem,  3.8vw,  4.25rem);   /* title slide headline */

  /* Line heights */
  --lh-tight:  1.15;
  --lh-snug:   1.3;
  --lh-normal: 1.55;
  --lh-loose:  1.75;

  /* Numeric rendering */
  font-variant-numeric: lining-nums tabular-nums;
}

/* Headline (Instrument Serif, editorial) */
.hed { font-family: var(--font-display); font-weight: 400; line-height: var(--lh-tight); }
.hed-italic { font-family: var(--font-display); font-style: italic; }

/* UI / data (Space Grotesk) */
.ui  { font-family: var(--font-body); font-weight: 500; letter-spacing: 0.01em; }
.caps { font-family: var(--font-body); font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; font-size: var(--ts-xs); }
```

---

## Background and Structural Elements (CSS)

```css
/* Slide root */
.slide {
  position: relative;
  width: 1920px;
  height: 1080px;
  background-color: var(--c-ground);
  overflow: hidden;
  font-family: var(--font-body);
  color: var(--c-text-primary);
}

/* Film grain — pure CSS noise overlay */
.slide::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 2;  /* above content layer, blended */
  pointer-events: none;
  background-image:
    radial-gradient(ellipse 1px 1px at 15% 22%, oklch(0.92 0.01 70 / 0.18) 0%, transparent 100%),
    radial-gradient(ellipse 1px 1px at 45% 67%, oklch(0.88 0.01 65 / 0.14) 0%, transparent 100%),
    radial-gradient(ellipse 1px 1px at 73% 14%, oklch(0.90 0.01 68 / 0.16) 0%, transparent 100%),
    radial-gradient(ellipse 1px 1px at 88% 50%, oklch(0.85 0.01 62 / 0.12) 0%, transparent 100%),
    radial-gradient(ellipse 1px 1px at 32% 85%, oklch(0.93 0.01 72 / 0.15) 0%, transparent 100%),
    radial-gradient(ellipse 1px 1px at 60% 38%, oklch(0.87 0.01 66 / 0.13) 0%, transparent 100%),
    radial-gradient(ellipse 2px 2px at 20% 55%, oklch(0.80 0.01 58 / 0.08) 0%, transparent 100%),
    radial-gradient(ellipse 1px 1px at 52% 92%, oklch(0.91 0.01 70 / 0.17) 0%, transparent 100%);
  background-size: 180px 180px;
  mix-blend-mode: overlay;
  opacity: 0.55;
}

/* Vignette */
.slide::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 3;
  pointer-events: none;
  background: radial-gradient(
    ellipse 90% 85% at 50% 50%,
    transparent 40%,
    oklch(0.07 0.015 38 / 0.55) 75%,
    oklch(0.07 0.015 38 / 0.85) 100%
  );
}

/* Content layer */
.slide-content {
  position: absolute;
  inset: 0;
  z-index: 1;
  padding: 80px 100px;
}

/* Accent rule (horizontal bar) */
.accent-rule {
  display: block;
  width: 64px;
  height: 3px;
  background: var(--c-accent);
  margin-bottom: 28px;
  border-radius: 2px;
}

/* Section marker pill */
.section-marker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: oklch(0.20 0.025 45 / 0.7);
  border: 1px solid var(--c-border);
  border-radius: 4px;
  padding: 6px 16px;
  font-family: var(--font-body);
  font-size: var(--ts-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--c-accent);
  margin-bottom: 36px;
}
```

---

## Layout Patterns (ASCII diagram)

### Title slide
```
┌──────────────────────────────────────────────────────────────────┐
│  [section marker — small]              [folio]                    │
│                                                                   │
│  ─── accent rule ───                                              │
│                                                                   │
│  HEADLINE (Instrument Serif, 2xl, cream, 60% width)               │
│                                                                   │
│  Abstract paragraph (body, 42% width)                             │
│                                                                   │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐                  │
│  │ detail │  │ detail │  │ detail │  │ detail │  4-col row        │
│  │ label  │  │ label  │  │ label  │  │ label  │                   │
│  └────────┘  └────────┘  └────────┘  └────────┘                  │
└──────────────────────────────────────────────────────────────────┘
```

### Evidence slide (slide 2)
```
┌────────────────────────────────────────── ─── ─── ──────────────┐
│  [section marker]                                                 │
│  HEADLINE (xl, 64% width)              ┌─────────────────────┐   │
│                                        │  ASIDE panel        │   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  big stat + text  │   │
│  │  stat 1  │  │  stat 2  │  │  stat 3  │                   │   │
│  └──────────┘  └──────────┘  └──────────┘  └───────────────┘   │
│                                                                   │
│  Evidence paragraph (body, 58% width)         [folio]            │
└──────────────────────────────────────────────────────────────────┘
```

### Comparison slide (slide 3)
```
┌──────────────────────────────────────────────────────────────────┐
│  [section marker]                                                 │
│  HEADLINE (xl, 72% width)                                         │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │  strategy │ total aud │ critic % │ lic value │ ROI │ rank  │  │
│  │  ─────── │ highlighted row ──────────────────────────────  │  │
│  │  ...      │ ...       │ ...      │ ...       │ ...  │ ...  │  │
│  └────────────────────────────────────────────────────────────┘  │
│  † Footnote text                               [folio]            │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat column
```css
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 28px 32px;
  background: oklch(0.16 0.022 42 / 0.8);
  border: 1px solid var(--c-border);
  border-top: 3px solid var(--c-accent);
  border-radius: 2px;
  font-variant-numeric: lining-nums tabular-nums;
}
.stat-col__value {
  font-family: var(--font-display);
  font-size: var(--ts-xl);
  color: var(--c-accent);
  line-height: 1;
}
.stat-col__label {
  font-family: var(--font-body);
  font-size: var(--ts-xs);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-text-secondary);
}
.stat-col__sub {
  font-family: var(--font-body);
  font-size: var(--ts-sm);
  color: var(--c-text-muted);
  margin-top: 4px;
}
```

### Table
```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-size: var(--ts-sm);
  font-variant-numeric: lining-nums tabular-nums;
}
.data-table th {
  padding: 14px 20px;
  text-align: left;
  background: oklch(0.18 0.020 43);
  color: var(--c-text-secondary);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  font-size: 0.78rem;
  border-bottom: 1px solid var(--c-border);
}
.data-table td {
  padding: 14px 20px;
  border-bottom: 1px solid var(--c-border-subtle);
  color: var(--c-text-primary);
  vertical-align: middle;
}
.data-table tr.highlight td {
  background: oklch(0.20 0.030 55 / 0.55);
  color: var(--c-accent-glow);
  font-weight: 500;
  border-left: 3px solid var(--c-accent);
}
.data-table .num { text-align: right; }
```

### Folio
```css
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--font-body);
  font-size: var(--ts-xs);
  color: var(--c-text-muted);
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: 0.06em;
  z-index: 10;
}
```

### Aside panel
```css
.aside-panel {
  background: oklch(0.17 0.024 44 / 0.85);
  border: 1px solid var(--c-border);
  border-left: 4px solid var(--c-accent-dim);
  border-radius: 2px;
  padding: 32px 28px;
}
.aside-panel__stat {
  font-family: var(--font-display);
  font-size: var(--ts-xl);
  color: var(--c-accent);
  font-variant-numeric: lining-nums tabular-nums;
  line-height: 1;
  margin-bottom: 12px;
}
.aside-panel__text {
  font-size: var(--ts-sm);
  color: var(--c-text-secondary);
  line-height: var(--lh-normal);
}
```

---

## Print/Export Mode

```css
@media print {
  .slide {
    background: #1a1210 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .slide::before { opacity: 0.3; }   /* reduce grain for toner */
  .slide::after  { opacity: 0.4; }   /* soften vignette */
  .nav-bar { display: none; }
}
```

---

## Accessibility (contrast ratios)

| Pair | Approx. ratio | WCAG level |
|------|:---:|:---:|
| `--c-text-primary` on `--c-ground` (cream/brown) | ~14.5:1 | AAA |
| `--c-accent` on `--c-ground` (amber/brown) | ~7.2:1 | AAA |
| `--c-text-secondary` on `--c-ground` | ~5.8:1 | AA |
| `--c-text-muted` on `--c-ground` | ~3.5:1 | AA large |
| `--c-accent` on `--c-ground-raised` | ~6.4:1 | AA |
| `--c-text-primary` on raised card | ~11.8:1 | AAA |

All interactive focus rings use `--c-accent` at 2px solid with 2px offset on dark ground — visible at all required levels.

---

## Differentiators from sibling styles in Family I

| Style | Grain type | Ground | Accent | Typography |
|-------|-----------|--------|--------|------------|
| **I03 warm-film-grain** | CSS radial noise overlay + vignette | Deep warm brown | Amber-gold | Instrument Serif + Space Grotesk |
| I01 (paper-texture) | SVG filter / noise | Off-white cream | Ink black | Playfair + DM Sans |
| I02 (concrete-grid) | CSS repeating-linear grid | Cool mid-gray | Lime accent | JetBrains Mono + Inter |

I03 is unique in combining darkroom-warm ground, editorial serif headline, and a true film-grain composited overlay — the other organic siblings either go light/neutral or use geometric textures.
