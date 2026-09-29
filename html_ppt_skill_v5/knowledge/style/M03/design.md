# M03 — risograph-print

**Style ID:** M03
**Family:** M (Illustration/Artistic)
**Scheme:** Duotone / Limited Palette
**Mood:** Raw, handcrafted, zine-culture, tactile, independent
**Occasion:** Independent design, zines, arts festivals, independent cultural events, creative technology conferences, maker showcases
**Academic Fit:** Low (arts/design programmes, creative technology research presentations only)

---

## Design Philosophy (5D)

**Philosophy:** Risograph printing is a mechanical reproductive process — silk-screen-speed, eco-ink, layered colour registration that never quite aligns. M03 captures that honest imperfection: content matters more than polish, ink is precious, every dot counts. Two colours only, always.

**Hierarchy:** Size and weight carry all hierarchy. The limited palette means colour cannot be used to differentiate importance — use scale, weight (700 vs 400), and spatial separation instead. Headlines are large and assertive; body copy is small and matter-of-fact.

**Detail:** Texture lives in CSS halftone dot patterns layered over accent fields. Misregistration is simulated via a two-shadow `text-shadow` on display headings — RISO red behind, RISO teal ahead — at very low opacity so it reads as a printing artefact rather than a design choice.

**Function:** Navigation and affordances are stark and functional: thick-rule underlines, high-contrast labels, no gradients. Layouts lean on generous white/newsprint space with tight typographic grids inside content blocks.

**Innovation:** Pure CSS halftone via `radial-gradient` repeating patterns creates authentic dot-screen texture without images. The two-colour constraint forces editorial economy; every slide must earn its ink.

---

## Color System (OKLCH CSS tokens)

```css
:root {
  /* Base surface */
  --color-paper:        oklch(0.95 0.018 72);   /* cream/newsprint */
  --color-paper-warm:   oklch(0.92 0.022 72);   /* slightly deeper cream for offsets */

  /* Near-black ink */
  --color-ink:          oklch(0.12 0.010 40);   /* warm near-black */
  --color-ink-mid:      oklch(0.30 0.012 40);   /* mid-tone for secondary text */
  --color-ink-ghost:    oklch(0.55 0.008 40);   /* tertiary / captions */

  /* RISO primary inks */
  --color-riso-red:     oklch(0.58 0.20 22);    /* RISO Fluorescent Red */
  --color-riso-teal:    oklch(0.58 0.16 192);   /* RISO Teal */

  /* Derived tints (halftone simulation via opacity) */
  --color-riso-red-20:  oklch(0.58 0.20 22 / 0.20);
  --color-riso-red-12:  oklch(0.58 0.20 22 / 0.12);
  --color-riso-teal-20: oklch(0.58 0.16 192 / 0.20);
  --color-riso-teal-12: oklch(0.58 0.16 192 / 0.12);

  /* Misregistration shadow (very low opacity) */
  --color-mis-red:      oklch(0.58 0.20 22 / 0.18);
  --color-mis-teal:     oklch(0.58 0.16 192 / 0.18);
}
```

**Usage rules:**
- Background: always `--color-paper`
- All body text, data: `--color-ink`
- Primary accent fills (stat blocks, rule-lines, table headers): `--color-riso-red`
- Secondary accent fills (asides, highlights, selected rows): `--color-riso-teal`
- Halftone overlays use `--color-riso-red-12` or `--color-riso-teal-12` layered over fills
- No gradients, no intermediate interpolated colours, no shadows for elevation

---

## Typography (Google Fonts CDN, OFL)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;700&display=swap" rel="stylesheet">
```

```css
:root {
  /* Font family */
  --font-primary: 'Space Grotesk', system-ui, sans-serif;

  /* Type scale — all slides at 1920×1080 base */
  --text-display:   clamp(3rem, 4.2vw, 5.4rem);   /* slide 1 title */
  --text-headline:  clamp(1.6rem, 2.2vw, 2.8rem);  /* slide 2–3 A-E headline */
  --text-label:     clamp(0.65rem, 0.85vw, 1.1rem); /* section markers, captions */
  --text-stat:      clamp(2.4rem, 3.2vw, 4.0rem);  /* large numeric stat */
  --text-body:      clamp(0.75rem, 0.95vw, 1.15rem);/* body paragraph */
  --text-table:     clamp(0.68rem, 0.82vw, 1.0rem); /* table cell */
  --text-folio:     clamp(0.6rem, 0.75vw, 0.9rem);  /* folio / page number */

  /* Weights */
  --weight-bold:    700;
  --weight-medium:  500;
  --weight-regular: 400;
  --weight-light:   300;

  /* Numeric rendering */
  --nums: lining-nums tabular-nums;

  /* Line heights */
  --lh-display:   1.05;
  --lh-headline:  1.15;
  --lh-body:      1.6;
  --lh-stat:      1.0;
}
```

**Rationale:** Space Grotesk (OFL via Google Fonts) has slightly irregular, humanist geometry that echoes the analogue imperfection of RISO printing. Its weight range (300–700) provides sufficient hierarchy without adding a second typeface. Its relatively wide apertures maintain legibility even over halftone dot backgrounds.

---

## Background and Structural Elements (CSS)

```css
/* Halftone dot texture — for use on accent fill blocks */
.halftone-red {
  background-image:
    radial-gradient(circle, var(--color-riso-red) 1.5px, transparent 1.5px);
  background-size: 8px 8px;
  background-color: var(--color-riso-red-20);
}

.halftone-teal {
  background-image:
    radial-gradient(circle, var(--color-riso-teal) 1.5px, transparent 1.5px);
  background-size: 8px 8px;
  background-color: var(--color-riso-teal-20);
}

/* Misregistration text-shadow for display headlines */
.mis-headline {
  text-shadow:
     1px  1px 0 var(--color-mis-teal),
    -1px -1px 0 var(--color-mis-red);
}

/* Stage background */
.slide-stage {
  background-color: var(--color-paper);
  color: var(--color-ink);
}

/* Rule accent — thick horizontal rule in RISO red */
.rule-accent {
  border: none;
  border-top: 3px solid var(--color-riso-red);
  margin: 0;
}

/* Section marker — all-caps label with thick underline */
.section-marker {
  font-size: var(--text-label);
  font-weight: var(--weight-bold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--color-riso-red);
  font-family: var(--font-primary);
}
```

---

## Layout Patterns (ASCII diagram)

### Slide 1 — Title

```
┌─────────────────────────────────────────────────────────────┐
│  [section marker — top left]                                │
│                                                             │
│  ┌───────────────────────────────────────────┐             │
│  │  DISPLAY HEADLINE (mis-reg shadow)        │             │
│  │  2–3 lines, left-aligned                 │             │
│  └───────────────────────────────────────────┘             │
│  ───────────────────────── (rule accent)                    │
│  Abstract body text, 2 sentences, 60-70% width             │
│                                                             │
│  ┌──────┬──────┬──────┬──────┐  (4-col detail row)         │
│  │ KEY  │ KEY  │ KEY  │ KEY  │                              │
│  │ val  │ val  │ val  │ val  │                              │
│  └──────┴──────┴──────┴──────┘                             │
│                                          [folio]            │
└─────────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence + Aside

```
┌─────────────────────────────────────────────────────────────┐
│  [section marker]                                           │
│  HEADLINE (A-E full sentence, 65% width)                    │
│  ───────────────────────── (rule accent)                    │
│                                                             │
│  ┌─────────┬─────────┬─────────┐  ┌─────────────────┐     │
│  │ STAT 1  │ STAT 2  │ STAT 3  │  │  ASIDE PANEL    │     │
│  │ number  │ number  │ number  │  │  (halftone-teal) │     │
│  │ label   │ label   │ label   │  │  stat + text    │     │
│  └─────────┴─────────┴─────────┘  └─────────────────┘     │
│                                                             │
│  Evidence paragraph body text (55% width)                   │
│                                          [folio]            │
└─────────────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison Table

```
┌─────────────────────────────────────────────────────────────┐
│  [section marker]                                           │
│  HEADLINE (A-E full sentence, 70% width)                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ HEADER ROW (halftone-red bg)                         │  │
│  ├──────────────────────────────────────────────────────┤  │
│  │ row 1                                                │  │
│  │ row 2 (highlighted — halftone-teal bg)               │  │
│  │ row 3                                                │  │
│  │ row 4                                                │  │
│  │ row 5                                                │  │
│  └──────────────────────────────────────────────────────┘  │
│  * footnote text                         [folio]            │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Tokens (stat columns, table, folio CSS)

```css
/* --- Stat column --- */
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 28px 24px;
  border-top: 3px solid var(--color-riso-red);
}
.stat-col__number {
  font-size: var(--text-stat);
  font-weight: var(--weight-bold);
  font-variant-numeric: var(--nums);
  line-height: var(--lh-stat);
  color: var(--color-riso-red);
}
.stat-col__label {
  font-size: var(--text-label);
  font-weight: var(--weight-medium);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-ink-mid);
}

/* --- Aside panel --- */
.aside-panel {
  padding: 28px 24px;
  position: relative;
  overflow: hidden;
}
.aside-panel::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--color-riso-teal) 1.5px, transparent 1.5px);
  background-size: 8px 8px;
  background-color: var(--color-riso-teal-12);
  z-index: 0;
}
.aside-panel > * { position: relative; z-index: 1; }
.aside-panel__stat {
  font-size: var(--text-stat);
  font-weight: var(--weight-bold);
  font-variant-numeric: var(--nums);
  line-height: 1;
  color: var(--color-ink);
}
.aside-panel__text {
  font-size: var(--text-body);
  color: var(--color-ink-mid);
  margin-top: 8px;
  line-height: var(--lh-body);
}

/* --- Comparison table --- */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-table);
  font-family: var(--font-primary);
}
.data-table thead tr {
  background-image:
    radial-gradient(circle, var(--color-riso-red) 1.5px, transparent 1.5px);
  background-size: 8px 8px;
  background-color: var(--color-riso-red-20);
  color: var(--color-ink);
}
.data-table th {
  padding: 12px 16px;
  font-weight: var(--weight-bold);
  text-align: left;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  font-size: calc(var(--text-table) * 0.88);
  font-variant-numeric: var(--nums);
}
.data-table td {
  padding: 11px 16px;
  border-bottom: 1px solid oklch(0.82 0.010 72);
  font-variant-numeric: var(--nums);
}
.data-table tr.highlighted {
  background-image:
    radial-gradient(circle, var(--color-riso-teal) 1.5px, transparent 1.5px);
  background-size: 8px 8px;
  background-color: var(--color-riso-teal-12);
  font-weight: var(--weight-medium);
}

/* --- Folio (slide number) --- */
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-size: var(--text-folio);
  font-family: var(--font-primary);
  font-weight: var(--weight-medium);
  letter-spacing: 0.08em;
  color: var(--color-ink-ghost);
  font-variant-numeric: var(--nums);
  z-index: 2;
}
```

---

## Print/Export Mode

```css
@media print {
  .nav-bar, .folio { display: none; }
  .slide { display: block !important; page-break-after: always; }
  body { background: white; }
  /* Halftone dots print well — no suppression needed */
  /* Misregistration shadow may optionally be removed for clean print */
  .mis-headline { text-shadow: none; }
}
```

---

## Accessibility (contrast ratios)

| Pair | Foreground | Background | Ratio | WCAG |
|---|---|---|---|---|
| Body text on paper | `--color-ink` (L≈12%) | `--color-paper` (L≈95%) | ≈16.5:1 | AAA |
| Mid-ink on paper | `--color-ink-mid` (L≈30%) | `--color-paper` (L≈95%) | ≈8.5:1 | AAA |
| RISO red stat on paper | `--color-riso-red` (L≈58%) | `--color-paper` (L≈95%) | ≈3.2:1 | AA (large text ≥24px) |
| Table header ink on halftone-red | `--color-ink` | `--color-riso-red-20` over paper | ≈12:1 | AAA |
| Aside ink on halftone-teal | `--color-ink` | `--color-riso-teal-12` over paper | ≈14:1 | AAA |
| Ghost ink on paper (folio) | `--color-ink-ghost` (L≈55%) | `--color-paper` | ≈4.7:1 | AA |

**Notes:**
- RISO red used only for large display numbers (≥36px) and decorative rules — meets AA for large text
- State is never communicated by colour alone; shape (rule lines, border-top) and typographic weight reinforce all colour distinctions
- Halftone dot pattern is purely decorative; underlying fill contrast meets AA
- `prefers-reduced-motion` removes misregistration animation if any motion is added in future

---

## Differentiators from sibling styles in M family

| | M03 risograph-print | M01 (editorial illustration) | M02 (collage cut-up) |
|---|---|---|---|
| Palette | Strict 2-colour RISO duotone | Full editorial palette | Archival multi-tint |
| Texture | CSS halftone dots | Flat ink fields | Torn-edge patterns |
| Type | Space Grotesk irregular geometric | Serif editorial | Mixed weight grotesque |
| Personality | Zine / independent press | Magazine / editorial | Archive / found-object |
| Ink economy | Extreme (two inks only) | Moderate | Moderate |

M03's defining constraint is **editorial austerity under a two-colour RISO printing metaphor** — it reads as printed artefact rather than screen design, and that physicality is its core differentiator.
