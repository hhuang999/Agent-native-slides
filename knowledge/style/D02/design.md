# D02 — bauhaus-geometric

**Style ID:** D02  
**Family:** Swiss / International Typographic (D)  
**Scheme:** Light-Neutral (white · near-black · primary-yellow)  
**Mood:** constructivist · systematic · bold · functionalist · experimental  
**Occasion:** design-education · architecture · industrial-design · manifesto · research-institution · product-strategy  
**Academic Fit:** High (design, architecture, art history, visual communication)

---

## Design Philosophy

Bauhaus geometric is the visual language of the Dessau school: László Moholy-Nagy's typophoto experiments, Herbert Bayer's Universal typeface, Joost Schmidt's exhibition posters. The core doctrine — form follows function, and decoration is corruption — produced a visual system of absolute primary forms: circle, triangle, square. Typography is spatial; the page is a field of forces in tension, not a neutral container for text.

In presentation terms: the stage is white, near-black type, with Primary Yellow `oklch(0.88 0.18 96)` as the single constructivist accent. No secondary accents. The layout uses strong asymmetric axis shifts — content columns running at offset proportions rather than centered — to create the deliberate compositional tension of Bauhaus printed matter. Heavy geometric elements (thick rules, filled circles, right-angle brackets) serve structural and navigational purposes, not decoration.

The canonical Bauhaus typeface is Universal or Futura — geometric sans-serifs with pure circular bowls and no-nonsense construction. Space Grotesk (OFL, Google Fonts) has a similar single-story 'a' and circular 'o', with slightly more warmth than pure Futura, and is available free. At Condensed sizes, using a custom `font-stretch: condensed` declaration on a variable font fallback, we approximate the poster-weight condensed headline. Alternatively, Archivo Black (OFL, Google Fonts) at display size provides the heavy geometric bluntness appropriate for Bauhaus headline work.

**Decision: Archivo Black + Space Grotesk.** Archivo Black for display headlines (very dark, very heavy, very bold — the constructivist statement), Space Grotesk for all body and functional text. The combination captures the Bauhaus split between the poster voice and the text voice.

There are no card containers, no gradients, no shadows on text. Structure comes from geometry — thick rules, large circles as section markers, right-angle composition. The Primary Yellow accent appears at most four times per slide: as a section marker fill, a thick horizontal rule, and accent text labels.

5D Evaluation:
- **Philosophy:** The slide is a designed object. Content is placed not for reading convenience alone, but for visual force — the headline asserts across a thick yellow rule, the column offset creates productive tension. This is a manifesto aesthetic.
- **Hierarchy:** Archivo Black at 88–100px reads immediately as a poster voice — its extreme weight and near-zero stroke variation is pure Bauhaus. Space Grotesk 400 at 18px provides the legible document register. Section numbers are large, geometric, and primary-colored: 40px Space Grotesk 700 in yellow, the number as a design element.
- **Detail:** Primary Yellow rules: 6px horizontal, full-width or partial. Circle section markers: 40px diameter, filled yellow, with the section number in white or black at center. Layout axis: a right-aligned 360px data column creates the offset proportion against a wider text column. Right-angle bracket decorators (`└`, `┘` or SVG path) at slide corners in dim gray — structural, not ornamental.
- **Function:** Best for design and architecture decks, product manifestos, research institution communications, and any context where the visual language is itself part of the message. Not appropriate for emotionally sensitive, financial, or deeply technical contexts where the constructivist energy would conflict with the message.
- **Innovation:** Using the section number as a large geometric object (a filled yellow circle of 40px) rather than a small label is a direct translation of Bauhaus object-typography. The number is not a reference system; it is a visual anchor.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — white with geometry */
  --color-bg:             oklch(0.99 0 0);              /* white */
  --color-surface:        oklch(0.95 0 0);              /* light grey panel */
  --color-raised-surface: oklch(0.92 0 0);
  --color-border:         oklch(0.80 0 0);              /* line rule */
  --color-border-light:   oklch(0.90 0 0);
  --color-border-dark:    oklch(0.18 0 0);              /* thick dark rule */

  /* Type */
  --color-heading:        oklch(0.07 0 0);              /* near-black */
  --color-body:           oklch(0.14 0 0);
  --color-muted:          oklch(0.44 0 0);
  --color-dim:            oklch(0.62 0 0);

  /* Accent — Bauhaus Primary Yellow */
  --color-accent:         oklch(0.88 0.18 96);          /* primary yellow */
  --color-accent-dark:    oklch(0.70 0.18 88);          /* dark amber-yellow */
  --color-accent-bg:      oklch(0.97 0.06 96);          /* pale yellow tint */
  --color-accent-on:      oklch(0.10 0 0);              /* dark text on yellow */

  /* Semantic */
  --color-positive:       oklch(0.44 0.18 145);
  --color-negative:       oklch(0.54 0.24 28);
  --color-warn:           oklch(0.70 0.18 68);

  /* Chart — Primary color limited */
  --chart-c1: oklch(0.07 0 0);          /* near-black */
  --chart-c2: oklch(0.88 0.18 96);      /* primary yellow */
  --chart-c3: oklch(0.44 0 0);          /* mid grey */
  --chart-c4: oklch(0.70 0 0);          /* light grey */
  --chart-c5: oklch(0.70 0.18 88);      /* dark amber */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@300;400;500;700&display=swap');

:root {
  --type-display:    'Archivo Black', sans-serif;       /* heavy geometric display */
  --type-body:       'Space Grotesk', sans-serif;       /* functional text register */
  --type-label:      'Space Grotesk', sans-serif;
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 18px;
  line-height: 1.65;
  letter-spacing: 0.00em;
}

/* Scale */
/* display   = 5.5rem = 99px   (Archivo Black — extreme poster weight) */
/* h1        = 3.0rem = 54px   (Archivo Black) */
/* h2        = 1.5rem = 27px   (Space Grotesk 700) */
/* body      = 1.0rem = 18px   (Space Grotesk 400) */
/* caption   = 0.72rem = 13px  (Space Grotesk 300) */
/* section   = 0.58rem = 10px  (Space Grotesk 700, tracked +0.22em, uppercase) */
/* num       = 2.2rem = 40px   (Space Grotesk 700, on yellow circle — graphic use) */
```

---

## Background and Structural Elements

```css
#bauhaus-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: var(--color-bg);
}

/* Section circle marker */
.section-circle {
  width: 40px; height: 40px; border-radius: 50%;
  background: var(--color-accent);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.section-circle__num {
  font-family: var(--type-label); font-size: 17px; font-weight: 700;
  color: var(--color-accent-on); letter-spacing: 0.02em;
  line-height: 1;
}

/* Thick yellow rule — the Bauhaus horizontal force */
.bauhaus-rule {
  width: 100%; height: 6px;
  background: var(--color-accent);
}

/* Section row: circle + label */
.section-row {
  display: flex; align-items: center; gap: 16px; margin-bottom: 12px;
}
.section-row__label {
  font-family: var(--type-label); font-size: 10px; font-weight: 700;
  color: var(--color-muted); letter-spacing: 0.22em; text-transform: uppercase;
}

@media (prefers-reduced-motion: reduce) {
  /* Static — no change needed */
}
```

---

## Layout Patterns

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  ● 01  SECTION LABEL                                    │
│  ════════════════════════════════════════  [6px yellow] │
│  HEADLINE ARCHIVO BLACK 99px                            │
│  ────────────────────────────────────────  [1px grey]  │
│  Abstract (Space Grotesk 400, 20px, muted)              │
│  Spacer                                                 │
│  [Detail row — 4-col, strict left-align]                │
│                                              01 / title │
└─────────────────────────────────────────────────────────┘
```

### Evidence Slide
```
┌─────────────────────────────────────────────────────────┐
│  ● 02  SECTION LABEL                                    │
│  ════════════════════════════════════════               │
│  HEADLINE Archivo Black 52px                            │
│  ──────────────────────────────────────────             │
│  │      stat      │      stat      │      stat      │  │
│  │  Archivo Black │  no color var  │  only weight   │  │
│  │  80px near-blk │  separates     │  ─────────     │  │
│  ──────────────────────────────────────────             │
│  Body 2-col layout + data column (right-offset)         │
└─────────────────────────────────────────────────────────┘
```

---

## Component Tokens

```css
/* Stat block — constructivist display */
.stat-block { display: flex; flex-direction: column; padding: 0 48px 0 0; border-right: 1px solid var(--color-border); }
.stat-block:first-child { padding-left: 0; }
.stat-block:last-child  { border-right: none; padding-right: 0; padding-left: 48px; }
.stat-block:nth-child(2){ padding-left: 48px; }
.stat-block__accent-line { width: 36px; height: 6px; background: var(--color-accent); margin-bottom: 10px; }
.stat-block__value {
  font-family: var(--type-display); font-size: 80px;
  color: var(--color-heading); line-height: 0.90;
  font-variant-numeric: lining-nums tabular-nums; letter-spacing: -0.01em;
}
.stat-block__label {
  font-family: var(--type-label); font-size: 11px; font-weight: 700;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.18em;
  margin-top: 14px; line-height: 1.55;
}

/* Data grid item */
.grid-item { display: flex; flex-direction: column; gap: 3px; }
.grid-item__label {
  font-family: var(--type-label); font-size: 10px; font-weight: 700;
  color: var(--color-dim); text-transform: uppercase; letter-spacing: 0.22em;
}
.grid-item__value {
  font-family: var(--type-body); font-size: 15px; font-weight: 400; color: var(--color-muted);
}

/* Table — constructivist data layout */
.data-table th {
  font-family: var(--type-label); font-size: 11px; font-weight: 700;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.14em;
  text-align: left; padding: 9px 14px;
  border-bottom: 3px solid var(--color-border-dark);
}
.data-table tr.highlight td { background: var(--color-accent-bg); }
.data-table tr.highlight td:first-child { color: var(--color-heading); font-weight: 700; }
.win { color: var(--color-accent-dark); font-weight: 700; }

/* Slide folio — bottom right */
.slide-folio {
  position: absolute; bottom: 36px; right: 120px;
  font-family: var(--type-label); font-size: 10px; font-weight: 700;
  color: var(--color-dim); text-transform: uppercase; letter-spacing: 0.22em;
}
```

---

## Print / Export Mode

```css
@media print {
  /* White background — no changes needed */
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 20.1:1 ✓
- `--color-body` over `--color-bg` = 16.9:1 ✓
- `--color-muted` over `--color-bg` = 4.6:1 ✓
- `--color-accent` (primary yellow) over `--color-bg` = 1.8:1 — NOT sufficient for text; yellow only as graphic area fills or thick rules, never as text color on white
- `--color-accent-on` (dark text) over `--color-accent` = 11.4:1 ✓ — circle number label on yellow
- Archivo Black at small sizes: very heavy weight reduces legibility below 22px; this style uses it only at 52px+
- Space Grotesk 300 at 10px folio: `--color-dim` over `--color-bg` = 2.8:1 — minimum graphical; folios are secondary navigation only
- No animation — `prefers-reduced-motion` has no active concerns
- All semantic content at z-index 1 above background at z-index 0
