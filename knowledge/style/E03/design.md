# E03 — glacier-blue-nordic

**Style ID:** E03  
**Family:** Nordic / Scandinavian Minimalist (E)  
**Scheme:** Light-Cool (glacier white · steel-cool grey · deep cobalt)  
**Mood:** cool · precise · credible · open · institutional  
**Occasion:** climate · oceanography · atmospheric-science · public-policy · international-development · marine-research  
**Academic Fit:** High (climate science, environmental policy, physical geography, marine biology, international relations)

---

## Design Philosophy

Glacier Blue Nordic is the coolest, most open register of the E-family — the visual temperature of a Nordic government science publication, a climate research institute's annual report, a UN Environment Programme brief. Where E01 is neutral and E02 is warm, E03 shifts definitively into cool-blue territory that communicates scientific objectivity and institutional credibility.

The background is glacier white `oklch(0.97 0 220)` — barely perceptibly cool, a trace of blue-grey that distinguishes it from clinical neutral white without becoming a coloured background. The accent is Deep Cobalt `oklch(0.35 0.16 250)` — a serious, saturated blue-purple that has institutional authority and scientific precision, distinct from both corporate blue and the electric cyan of D04. It appears on section markers, structural hairlines, stat accents, and `.win` table values. Against glacier white it reads as authoritative and trustworthy.

Typography pairs Fraunces (OFL, Google Fonts) — a slow-ink optical display serif with subtle quirk — with Plus Jakarta Sans (OFL, Google Fonts) for body and labels. Fraunces has a softer, more considered quality than DM Serif Display (E02) — its gentle optical weight variation and slight informality make it ideal for science communication to general policy audiences. Plus Jakarta Sans is a geometric humanist sans that pairs naturally with institutional serif display.

The layout uses restrained generous white space and a full 1680px content width. Structure comes from quiet 1px cobalt hairlines (at reduced opacity) and the typographic scale. No heavy rules, no geometric assertiveness — the whiteness of the page and the precision of the type system carry the authority.

5D Evaluation:
- **Philosophy:** Scientific evidence presented with restraint and precision. The blue temperature signals environmental and climate contexts naturally — water, atmosphere, sky — while the cobalt is institutional rather than decorative. This style communicates that the organization behind the document cares about accuracy more than impression.
- **Hierarchy:** Fraunces at 86–90px has a quality of slow consideration that is distinct from DM Serif Display's calligraphic sharpness. At display scale it retains legibility while carrying a slightly more nuanced editorial voice. Plus Jakarta Sans 400 at body scale is clean, warm, and unobtrusive.
- **Detail:** A 1px cobalt hairline (40% opacity) below the section marker establishes document hierarchy without visual weight. Stat values use Fraunces — the old-style figures in Fraunces create a deliberately humanist data register, appropriate for science communication. The folio uses Plus Jakarta Sans at the same muted cobalt to maintain the cool accent thread through the full slide.
- **Function:** Best for climate, environmental, oceanographic, and international policy research. The cool palette and scientific-feeling precision are naturally suited to organizations working in STEM-adjacent policy. Not appropriate for warm consumer, creative, or emotionally sensitive contexts.
- **Innovation:** Using Fraunces (with its subtle optical personality) for stat numerics creates a data register that feels humanist and considered — appropriate for science communication where raw precision can alienate non-specialist policy audiences. The numerals feel measured, not extracted.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — cool glacier white */
  --color-bg:             oklch(0.97 0.004 220);         /* glacier white */
  --color-surface:        oklch(0.94 0.004 218);
  --color-raised-surface: oklch(0.91 0.004 216);
  --color-border:         oklch(0.82 0.006 220);         /* cool hairline */
  --color-border-light:   oklch(0.89 0.005 218);
  --color-border-dark:    oklch(0.66 0.008 220);         /* stronger rule */

  /* Type — cool-offset near-black */
  --color-heading:        oklch(0.12 0.010 240);         /* near-black cool */
  --color-body:           oklch(0.20 0.008 235);
  --color-muted:          oklch(0.46 0.008 230);
  --color-dim:            oklch(0.62 0.006 225);

  /* Accent — Deep Cobalt */
  --color-accent:         oklch(0.35 0.16 250);          /* deep cobalt */
  --color-accent-mid:     oklch(0.48 0.14 248);
  --color-accent-light:   oklch(0.62 0.12 245);
  --color-accent-bg:      oklch(0.95 0.030 240);         /* pale blue tint */
  --color-accent-on:      oklch(0.97 0 0);               /* near-white on cobalt */

  /* Semantic */
  --color-positive:       oklch(0.40 0.14 160);
  --color-negative:       oklch(0.52 0.20 28);
  --color-warn:           oklch(0.62 0.16 68);

  /* Chart — cool scientific palette */
  --chart-c1: oklch(0.35 0.16 250);      /* deep cobalt */
  --chart-c2: oklch(0.20 0.008 235);     /* near-black cool */
  --chart-c3: oklch(0.58 0.10 248);      /* mid cobalt */
  --chart-c4: oklch(0.76 0.006 220);     /* cool mid-grey */
  --chart-c5: oklch(0.48 0.14 248);      /* accent mid */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap');

:root {
  --type-display:  'Fraunces', Georgia, 'Slides CJK Serif', serif;               /* optical serif — headlines + stat numerics */
  --type-body:     'Plus Jakarta Sans', Arial, 'Slides CJK Sans', sans-serif;  /* geometric humanist sans — all other text */
  --type-label:    'Plus Jakarta Sans', Arial, 'Slides CJK Sans', sans-serif;
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 18px;
  line-height: 1.68;
  letter-spacing: 0.004em;
}

/* Scale */
/* display   = 5.0rem = 90px   (Fraunces opsz=144, 400 — optical maximum weight) */
/* h1        = 2.8rem = 50px   (Fraunces opsz=72, 400) */
/* h2        = 1.5rem = 27px   (Plus Jakarta Sans 700) */
/* body      = 1.0rem = 18px   (Plus Jakarta Sans 400) */
/* caption   = 0.72rem = 13px  (Plus Jakarta Sans 300) */
/* section   = 0.60rem = 11px  (Plus Jakarta Sans 500, tracked +0.16em, uppercase) */
/* folio     = 0.56rem = 10px  (Plus Jakarta Sans 400, color: accent-light) */
```

---

## Background and Structural Elements

```css
#glacier-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: var(--color-bg);
}

/* Section cobalt hairline — 1px at 40% opacity */
.section-hairline { width: 100%; height: 1px; background: var(--color-accent); opacity: 0.40; }

/* Standard hairline */
.hairline { width: 100%; height: 1px; background: var(--color-border); }

/* Section marker */
.section-marker { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
.section-num {
  font-family: var(--type-label); font-size: 11px; font-weight: 500;
  color: var(--color-accent); letter-spacing: 0.16em; text-transform: uppercase;
}
.section-label {
  font-family: var(--type-label); font-size: 11px; font-weight: 500;
  color: var(--color-muted); letter-spacing: 0.16em; text-transform: uppercase;
}

@media (prefers-reduced-motion: reduce) { /* Static — no change needed */ }
```

---

## Layout Patterns

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [glacier white · trace cool · open field]              │
│  01 · SECTION LABEL    [cobalt 11px, +0.16em]           │
│  ── 1px cobalt hairline (40% opacity) ──────────────    │
│  Headline Fraunces opsz=144 90px                        │
│  ── 1px cool hairline ──────────────────────────────    │
│  Abstract (Plus Jakarta Sans 400, 20px, muted)          │
│  Spacer                                                 │
│  [Detail row — 4-col]                                   │
│                                           01 · cobalt   │
└─────────────────────────────────────────────────────────┘
```

---

## Component Tokens

```css
/* Stat column — Fraunces numerics */
.stat-col { display: flex; flex-direction: column; padding-right: 52px; border-right: 1px solid var(--color-border); }
.stat-col:first-child { padding-left: 0; }
.stat-col:last-child  { border-right: none; padding-left: 52px; padding-right: 0; }
.stat-col:nth-child(2){ padding-left: 52px; }
.stat-col__accent-bar { width: 20px; height: 1px; background: var(--color-accent); margin-bottom: 14px; }
.stat-col__value {
  font-family: var(--type-display); font-size: 80px; font-weight: 400;
  font-optical-sizing: auto;
  color: var(--color-heading); line-height: 0.92;
  font-variant-numeric: lining-nums tabular-nums;
}
.stat-col__label {
  font-family: var(--type-label); font-size: 11px; font-weight: 500;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.14em;
  margin-top: 14px; line-height: 1.55;
}

/* Table */
.data-table th {
  font-family: var(--type-label); font-size: 11px; font-weight: 500;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.12em;
  text-align: left; padding: 9px 14px;
  border-bottom: 1px solid var(--color-border-dark);
}
.data-table td {
  font-family: var(--type-body); font-size: 16px; font-weight: 400;
  color: var(--color-body); padding: 12px 14px;
  border-bottom: 1px solid var(--color-border);
  font-variant-numeric: lining-nums tabular-nums;
}
.data-table tr.highlight td { background: var(--color-accent-bg); }
.data-table tr.highlight td:first-child { color: var(--color-heading); font-weight: 700; }
.win  { color: var(--color-accent); font-weight: 700; }
.good { color: var(--color-positive); }

/* Folio — cobalt-light */
.slide-folio {
  position: absolute; bottom: 36px; right: 120px;
  font-family: var(--type-label); font-size: 10px; font-weight: 400;
  color: var(--color-accent-light); letter-spacing: 0.12em;
}
```

---

## Print / Export Mode

```css
@media print {
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 15.6:1 ✓
- `--color-body` over `--color-bg` = 11.8:1 ✓
- `--color-muted` over `--color-bg` = 3.8:1 — large text / graphical (11px uppercase tracked section labels: graphical threshold 3:1 ✓)
- `--color-accent` (Deep Cobalt) over `--color-bg` = 7.2:1 ✓ — section numbers, accent bars, win values
- `--color-accent-light` over `--color-bg` = 2.8:1 — folio only; purely navigational, not body text
- Fraunces 400 at 80px+ with `font-optical-sizing: auto`: maximum optical weight, excellent legibility at display scale; old-style numerals at 80px are highly readable
- Plus Jakarta Sans 500 at 11px uppercase tracked: legible at +0.16em; section labels are supplementary navigation
- No animation — `prefers-reduced-motion` has no active concerns
- All semantic content at z-index 1 above background at z-index 0

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | Fraunces | Georgia | Slides CJK Serif |
| Body | Plus Jakarta Sans | Arial | Slides CJK Sans |
| Auxiliary / data | Plus Jakarta Sans | Arial | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.
