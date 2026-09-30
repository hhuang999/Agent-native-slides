# E02 — pale-birch-nordic

**Style ID:** E02  
**Family:** Nordic / Scandinavian Minimalist (E)  
**Scheme:** Light-Natural (birch cream · warm grey · deep forest green)  
**Mood:** calm · spacious · warm-minimal · grounded · honest  
**Occasion:** sustainability · environmental-policy · social-design · public-health · education · human-centered-research  
**Academic Fit:** High (environmental science, social work, public health, education research, human geography)

---

## Design Philosophy

Pale Birch Nordic is the warmest register of the E-family — the softness of birch bark and natural linen, not the cold white of a clinical report. Where E01 is cool and neutral, E02 has the temperature of natural materials: unbleached paper, light pine, a Scandinavian forest interior at midday. The reference frame is a well-designed Swedish government publication, a Norwegian health ministry brief, a Finnish education white paper.

The background is birch cream `oklch(0.97 0.012 84)` — a warm off-white with a trace of yellow warmth that reads as paper rather than screen. The accent is Deep Forest Green `oklch(0.38 0.12 150)` — a restrained forest hue that reads as natural authority, not corporate color. It appears on structural hairlines, section markers, small stat accents, and `.win` table values. The warmth of the background and the coolness of the accent create a natural tension that holds the palette together.

Typography pairs DM Serif Display (OFL, Google Fonts) — a high-contrast oldstyle serif with calligraphic warmth — with DM Sans (OFL, Google Fonts) for body and labels. The serif display face is used only for large headlines; everything functional uses DM Sans, following the principle that warmth should be applied with restraint, not everywhere.

There are no heavy rules, no geometric insistence, no Bauhaus confrontation. Structure comes from generous white space, quiet hairlines, and careful typographic scale. The grid has a wide left margin (120px) but no aggressive asymmetry — this is not a design manifesto, it is a human document.

5D Evaluation:
- **Philosophy:** This style communicates through understatement. The warm cream and forest green suggest respect for natural systems — appropriate for environmental, public health, and social research where the content must carry the authority, not the visual design. The restraint is not timidity; it is editorial confidence.
- **Hierarchy:** DM Serif Display at 82–88px has a calligraphic warmth that makes headlines feel considered rather than commanded. It pairs cleanly with DM Sans at body scale. The serif is used once per slide, at headline — reinforcing its role as the single expressive element.
- **Detail:** A 1px Forest Green hairline below the section marker (not a thick rule) establishes section identity without weight. Stat values in DM Serif Display — using the serif face for numerics creates an unexpected warmth in data-heavy slides. The folio is smaller and dimmer than other D-family styles — this document does not announce itself.
- **Function:** Best for research, policy, sustainability, education, and social sector communications where a warm, human register signals respect for the audience and subject. Not appropriate for technology infrastructure, finance, or confrontational contexts.
- **Innovation:** Using a high-contrast oldstyle serif (DM Serif Display) for stat numerics — rather than a geometric condensed face — shifts data display from technical precision to considered measurement. Numbers feel selected rather than extracted.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — warm birch cream */
  --color-bg:             oklch(0.97 0.012 84);          /* birch cream */
  --color-surface:        oklch(0.94 0.010 82);
  --color-raised-surface: oklch(0.91 0.008 80);
  --color-border:         oklch(0.82 0.008 78);          /* warm hairline */
  --color-border-light:   oklch(0.89 0.008 80);
  --color-border-dark:    oklch(0.66 0.010 76);          /* stronger rule */

  /* Type — warm-offset near-black */
  --color-heading:        oklch(0.14 0.008 80);          /* near-black warm */
  --color-body:           oklch(0.22 0.006 78);
  --color-muted:          oklch(0.48 0.006 78);
  --color-dim:            oklch(0.64 0.005 76);

  /* Accent — Deep Forest Green */
  --color-accent:         oklch(0.38 0.12 150);          /* forest green */
  --color-accent-mid:     oklch(0.50 0.11 148);
  --color-accent-light:   oklch(0.65 0.10 146);
  --color-accent-bg:      oklch(0.95 0.028 148);         /* pale mint tint */
  --color-accent-on:      oklch(0.97 0 0);               /* near-white on green */

  /* Semantic */
  --color-positive:       oklch(0.40 0.13 148);
  --color-negative:       oklch(0.54 0.20 28);
  --color-warn:           oklch(0.64 0.16 72);

  /* Chart — natural palette */
  --chart-c1: oklch(0.38 0.12 150);      /* forest green */
  --chart-c2: oklch(0.22 0.006 78);      /* near-black warm */
  --chart-c3: oklch(0.60 0.08 148);      /* mid sage */
  --chart-c4: oklch(0.74 0.006 78);      /* warm mid-grey */
  --chart-c5: oklch(0.50 0.11 148);      /* accent mid */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap');

:root {
  --type-display:  'DM Serif Display', serif;    /* warm serif — headlines + stat numerics */
  --type-body:     'DM Sans', sans-serif;         /* functional sans — all other text */
  --type-label:    'DM Sans', sans-serif;
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 18px;
  line-height: 1.68;
  letter-spacing: 0.005em;
}

/* Scale */
/* display   = 5.0rem = 90px   (DM Serif Display — calligraphic warmth) */
/* h1        = 2.8rem = 50px   (DM Serif Display) */
/* h2        = 1.5rem = 27px   (DM Sans 700) */
/* body      = 1.0rem = 18px   (DM Sans 400) */
/* caption   = 0.72rem = 13px  (DM Sans 300) */
/* section   = 0.60rem = 11px  (DM Sans 500, tracked +0.16em, uppercase) */
/* folio     = 0.56rem = 10px  (DM Sans 400, tracked +0.12em) */
```

---

## Background and Structural Elements

```css
#birch-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: var(--color-bg);
}

/* No decoration beyond the warm cream tone — space is the design element */

/* Section hairline — 1px forest green, not a heavy rule */
.section-hairline { width: 100%; height: 1px; background: var(--color-accent); opacity: 0.50; }

/* Standard hairline */
.hairline { width: 100%; height: 1px; background: var(--color-border); }

/* Section marker — quiet, no circle */
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
│  [birch cream · no decoration · warmth from surface]    │
│  01 · SECTION LABEL    [green 11px, +0.16em]            │
│  ── 1px green hairline (50% opacity) ──────────────     │
│  Headline DM Serif Display 90px                         │
│  ── 1px warm hairline ──────────────────────────────    │
│  Abstract (DM Sans 400, 20px, muted)                    │
│  Spacer                                                 │
│  [Detail row — 4-col]                                   │
│                                              01 · deck  │
└─────────────────────────────────────────────────────────┘
```

### Evidence Slide
```
┌─────────────────────────────────────────────────────────┐
│  01 · SECTION LABEL                                     │
│  ── hairline ─────────────────────────────────────      │
│  Headline DM Serif Display 50px                         │
│  ── hairline ─────────────────────────────────────      │
│  │ stat │ stat │ stat │ — DM Serif Display numerics     │
│  ── hairline ─────────────────────────────────────      │
│  Body + warm aside                                      │
└─────────────────────────────────────────────────────────┘
```

---

## Component Tokens

```css
/* Stat column — serif numerics for warmth */
.stat-col { display: flex; flex-direction: column; padding-right: 52px; border-right: 1px solid var(--color-border); }
.stat-col:first-child { padding-left: 0; }
.stat-col:last-child  { border-right: none; padding-left: 52px; padding-right: 0; }
.stat-col:nth-child(2){ padding-left: 52px; }
.stat-col__accent-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-accent); margin-bottom: 12px; }
.stat-col__value {
  font-family: var(--type-display); font-size: 80px;
  color: var(--color-heading); line-height: 0.92;
  font-variant-numeric: lining-nums tabular-nums;
}
.stat-col__label {
  font-family: var(--type-label); font-size: 11px; font-weight: 500;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.14em;
  margin-top: 14px; line-height: 1.55;
}

/* Table — warm Nordic */
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

/* Folio */
.slide-folio {
  position: absolute; bottom: 36px; right: 120px;
  font-family: var(--type-label); font-size: 10px; font-weight: 400;
  color: var(--color-dim); letter-spacing: 0.12em;
}
```

---

## Print / Export Mode

```css
@media print {
  /* Birch cream — acceptable for print */
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 13.8:1 ✓
- `--color-body` over `--color-bg` = 11.1:1 ✓
- `--color-muted` over `--color-bg` = 3.6:1 — large text / graphical only; used at 11px uppercase tracked for section labels (graphical threshold: 3:1 ✓)
- `--color-accent` (Forest Green) over `--color-bg` = 5.2:1 ✓ — section numbers, accent dots, win values
- DM Serif Display at 80px+: excellent legibility; high contrast strokes visible at display scale
- DM Sans 500 at 11px uppercase tracked: legible at +0.16em; section labels are supplementary navigation only
- No animation — `prefers-reduced-motion` has no active concerns
- All semantic content at z-index 1 above background at z-index 0
