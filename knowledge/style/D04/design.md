# D04 — dark-swiss

**Style ID:** D04  
**Family:** Swiss / International Typographic (D)  
**Scheme:** Dark-Neutral (near-black · cool-white · electric-cyan)  
**Mood:** rigorous · austere · technical · precise · commanding  
**Occasion:** technology-strategy · systems-architecture · infrastructure-brief · engineering-leadership · data-center · annual-technology-report  
**Academic Fit:** High (computer science, systems engineering, technology policy, information science)

---

## Design Philosophy

Dark Swiss is the night mode of the International Typographic Style — the same grid discipline, the same functional austerity, but inverted into a dark field that reads as technical authority rather than academic neutrality. The reference frame is a control room display, a systems architecture brief, a data center operations dashboard designed with Swiss rigor. The visual register is Starlink's ground station UI, a CERN beam-control interface, the dark-mode documentation of a serious infrastructure product.

The background is a deep near-black cool neutral `oklch(0.08 0 0)` — no warmth, no color cast, pure neutral darkness — which distinguishes it from the cinematic near-blacks of C01/C04. The accent is Electric Cyan `oklch(0.80 0.16 200)`: the classic terminal/CRT accent, associated with technical precision, digital systems, and high-reliability environments. It appears sparingly: section numbers, accent rules, stat overlines, and `.win` table values — the same functional constraint as D01's Signal Red, applied to a dark field.

Typography continues the IBM Plex Sans + IBM Plex Sans Condensed pairing from D01 — the Swiss single-family principle on a dark field. This is a deliberate family connection: D01 and D04 share the same typographic DNA and grid structure, differentiating through surface inversion. D01 is institutional-daylight; D04 is technical-night.

There are no card containers, no gradients, no glow effects. The grid is the design. Surfaces are near-black; separators are `oklch(0.22 0 0)` — just enough to define structure without color noise. The accent appears at most three times per slide.

5D Evaluation:
- **Philosophy:** The dark field is not an aesthetic choice — it is a technical one. Engineers use dark interfaces because they reduce eye fatigue during long sessions and increase perceived contrast on stat-dense displays. This style treats that function as a design premise, producing slides that feel like they come from a team that works at night, staring at dashboards.
- **Hierarchy:** IBM Plex Sans Condensed Bold at 90–96px on a dark field has a different weight perception than on white — the letterforms appear to slightly lighten at extreme scale, softening compared to D01's command register. This is compensated by tracking in slightly at display size (-0.015em) and by the high-contrast stat block `--color-heading` against near-black.
- **Detail:** A 2px Electric Cyan rule above slide headlines (not full-width — 80px wide, a tight accent bar rather than D01's 3px full-width rule). Section numbers in `--color-accent` at 11px, tracked. Stat overlines at 28px×2px in cyan. The folio at bottom-right uses `--color-dim` — same position as D01 but lower contrast, appropriate to the dark field. Hairlines at `oklch(0.22 0 0)` — subtle, present.
- **Function:** Best for technology and engineering organizations presenting internal strategy, infrastructure briefings, or data-dense analysis. Not appropriate for consumer, creative, or emotionally sensitive contexts.
- **Innovation:** The D01/D04 pairing as deliberate day/night variants of the same typographic family is a design system capability: a deck could use D01 for executive outputs and D04 for technical working sessions using the same underlying structure. This is novel within the style library.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — pure cool dark */
  --color-bg:             oklch(0.08 0 0);               /* near-black */
  --color-surface:        oklch(0.13 0 0);               /* raised panel */
  --color-raised-surface: oklch(0.18 0 0);               /* elevated panel */
  --color-border:         oklch(0.22 0 0);               /* separator */
  --color-border-light:   oklch(0.16 0 0);               /* subtle divider */
  --color-border-bright:  oklch(0.30 0 0);               /* visible rule */

  /* Type — cool near-white */
  --color-heading:        oklch(0.97 0 0);               /* near-white */
  --color-body:           oklch(0.82 0 0);               /* light grey */
  --color-muted:          oklch(0.58 0 0);               /* mid grey */
  --color-dim:            oklch(0.40 0 0);               /* dim grey */

  /* Accent — Electric Cyan */
  --color-accent:         oklch(0.80 0.16 200);          /* electric cyan */
  --color-accent-dark:    oklch(0.62 0.14 200);          /* deep cyan */
  --color-accent-light:   oklch(0.90 0.10 200);          /* pale cyan */
  --color-accent-bg:      oklch(0.13 0.04 200);          /* very dark cyan tint */

  /* Semantic */
  --color-positive:       oklch(0.72 0.18 145);
  --color-negative:       oklch(0.62 0.22 22);
  --color-warn:           oklch(0.78 0.18 78);

  /* Chart — dark palette with cyan primary */
  --chart-c1: oklch(0.80 0.16 200);      /* electric cyan */
  --chart-c2: oklch(0.97 0 0);           /* near-white */
  --chart-c3: oklch(0.58 0 0);           /* mid grey */
  --chart-c4: oklch(0.40 0 0);           /* dim grey */
  --chart-c5: oklch(0.62 0.14 200);      /* deep cyan */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&family=IBM+Plex+Sans+Condensed:wght@400;700&display=swap');

:root {
  --type-display:    'IBM Plex Sans Condensed', Arial, 'Slides CJK Sans', sans-serif;   /* condensed headline */
  --type-body:       'IBM Plex Sans', Arial, 'Slides CJK Sans', sans-serif;             /* all other text */
  --type-label:      'IBM Plex Sans', Arial, 'Slides CJK Sans', sans-serif;
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 18px;
  line-height: 1.65;
  letter-spacing: 0.00em;
}

/* Scale */
/* display   = 5.0rem = 90px   (IBM Plex Sans Condensed 700) */
/* h1        = 2.8rem = 50px   (IBM Plex Sans Condensed 700) */
/* h2        = 1.5rem = 27px   (IBM Plex Sans 700) */
/* body      = 1.0rem = 18px   (IBM Plex Sans 400) */
/* caption   = 0.72rem = 13px  (IBM Plex Sans 300) */
/* section   = 0.60rem = 11px  (IBM Plex Sans 500, tracked +0.20em, uppercase) */
/* folio     = 0.56rem = 10px  (IBM Plex Sans 500, tracked +0.15em) */
```

---

## Background and Structural Elements

```css
#dark-swiss-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: var(--color-bg);
}

/* No decoration — the grid is the design (dark field) */

@media (prefers-reduced-motion: reduce) {
  /* Static — no change needed */
}
```

---

## Layout Patterns

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [near-black · cool neutral · no decoration]            │
│  ○1  SECTION LABEL — cyan, 11px, +0.20em                │
│  ── 2px Electric Cyan short accent bar (80px wide) ──   │
│  ── 3px border-bright rule, full width ─────────────    │
│  Headline IBM Plex Sans Condensed 700, 90px, near-white │
│  ── 1px separator rule ──────────────────────────────   │
│  Abstract (IBM Plex Sans 400, 20px, muted)              │
│  Spacer                                                 │
│  [Detail row — 5-col, left-aligned]                     │
│                                    Section · Page · Yr  │
└─────────────────────────────────────────────────────────┘
```

### Evidence Slide
```
┌─────────────────────────────────────────────────────────┐
│  ○2  SECTION LABEL                                      │
│  ── accent bar + rule ─────────────────────────────     │
│  Headline Condensed Bold 50px                           │
│  ── separator ──────────────────────────────────────    │
│  │ stat │ stat │ stat │ — cyan overlines + condensed   │
│  ── separator ──────────────────────────────────────    │
│  Body + 420px sidebar                                   │
└─────────────────────────────────────────────────────────┘
```

---

## Component Tokens

```css
/* Section marker */
.section-marker { display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
.section-num {
  font-family: var(--type-label); font-size: 11px; font-weight: 500;
  color: var(--color-accent); letter-spacing: 0.20em;
}
.section-label {
  font-family: var(--type-label); font-size: 11px; font-weight: 500;
  color: var(--color-muted); letter-spacing: 0.20em; text-transform: uppercase;
}

/* Accent bar — short cyan, above the structural rule */
.accent-bar { width: 80px; height: 2px; background: var(--color-accent); margin-bottom: 4px; }

/* Structural rule — visible bright separator */
.struct-rule { width: 100%; height: 1px; background: var(--color-border-bright); margin-bottom: 0; }

/* Hairline */
.hairline { width: 100%; height: 1px; background: var(--color-border); }

/* Stat column — dark field */
.stat-col { display: flex; flex-direction: column; padding-right: 48px; border-right: 1px solid var(--color-border); }
.stat-col:first-child { padding-left: 0; }
.stat-col:last-child  { border-right: none; padding-left: 48px; padding-right: 0; }
.stat-col:nth-child(2){ padding-left: 48px; }
.stat-col__overline   { width: 28px; height: 2px; background: var(--color-accent); margin-bottom: 10px; }
.stat-col__value {
  font-family: var(--type-display); font-size: 80px; font-weight: 700;
  color: var(--color-heading); line-height: 0.90; letter-spacing: -0.015em;
  font-variant-numeric: lining-nums tabular-nums;
}
.stat-col__label {
  font-family: var(--type-label); font-size: 11px; font-weight: 500;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.14em;
  margin-top: 14px; line-height: 1.55;
}

/* Table — dark field */
.data-table th {
  font-family: var(--type-label); font-size: 11px; font-weight: 500;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.12em;
  text-align: left; padding: 9px 14px;
  border-bottom: 1px solid var(--color-border-bright);
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

/* Folio — bottom right */
.slide-folio {
  position: absolute; bottom: 36px; right: 120px;
  font-family: var(--type-label); font-size: 10px; font-weight: 500;
  color: var(--color-dim); text-transform: uppercase; letter-spacing: 0.15em;
}
```

---

## Print / Export Mode

```css
@media print {
  #dark-swiss-bg { background: oklch(0.98 0 0); }
  :root {
    --color-bg:      oklch(0.98 0 0);
    --color-heading: oklch(0.08 0 0);
    --color-body:    oklch(0.14 0 0);
    --color-muted:   oklch(0.44 0 0);
    --color-border:  oklch(0.80 0 0);
    --color-border-bright: oklch(0.60 0 0);
    --color-accent:  oklch(0.45 0.14 200);
    --color-accent-bg: oklch(0.94 0.04 200);
  }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 20.2:1 ✓
- `--color-body` over `--color-bg` = 11.4:1 ✓
- `--color-muted` over `--color-bg` = 4.2:1 ✓ — passes AA large text
- `--color-accent` (Electric Cyan) over `--color-bg` = 8.1:1 ✓ — section numbers, overlines
- `--color-dim` over `--color-bg` = 2.5:1 — folio/caption only; purely navigational
- IBM Plex Sans Condensed Bold at 80px+ on dark: excellent legibility; the condensed form adds density but large scale compensates on dark backgrounds
- No animation — `prefers-reduced-motion` has no active concerns
- All semantic content at z-index 1 above background at z-index 0
- Print mode overrides dark field to near-white for paper output — custom properties ensure a clean reversion

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | IBM Plex Sans Condensed | Arial | Slides CJK Sans |
| Body | IBM Plex Sans | Arial | Slides CJK Sans |
| Auxiliary / data | IBM Plex Sans | Arial | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.
