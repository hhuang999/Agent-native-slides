# D03 — brutalist-editorial

**Style ID:** D03  
**Family:** Swiss / International Typographic (D)  
**Scheme:** Off-White (warm paper · near-black · industrial-orange)  
**Mood:** confrontational · raw · editorial · anti-decorative · urgent  
**Occasion:** design-critique · media-research · architecture-school · cultural-institution · investigative-editorial · urban-policy  
**Academic Fit:** High (media studies, design history, architecture, urban planning, cultural studies)

---

## Design Philosophy

Brutalist editorial is the anti-Swiss: it knows the rules and breaks them with intention. The reference frame is Wolfgang Weingart's typography experiments in Basel, Tibor Kalman's M&Co work, the early issues of Emigre, and the confrontational print culture of the 1980s–90s editorial underground. Where Swiss International uses the grid as a discipline, brutalist editorial exposes it — oversize numerals pushed into the background, thick structural rules in near-black rather than accent color, asymmetric column placement that creates productive discomfort.

The background is a warm off-white `oklch(0.97 0.008 80)` — the color of offset-printed paper, not clinical white — which gives the heavy near-black type a physical, ink-on-paper quality. The single accent is Industrial Orange `oklch(0.62 0.24 38)`: the color of construction barriers, warning tape, bridge paint. Warm enough to distinguish from Signal Red (D01) and yellow enough to distinguish from pure red, it has a specifically anti-decorative energy — it's a warning, not a brand color.

Typography is the confrontation. Barlow Condensed (OFL, Google Fonts) at Black weight (900) is an extreme condensed display face at maximum density — its letterforms at 96–120px have a poster-printing quality, slightly irregular at extreme scale, immediately arresting. Barlow Regular (400) provides the body contrast — same family, radically different register — implementing the brutalist principle that the system is the material, not a tool to be hidden.

There are no card containers. There are no rounded corners. There are no shadows. Structural elements are heavy 8px rules in `--color-heading` (near-black), not accent color — the structure is neutral, the accent is the signal. Oversize ghost numerals (section numbers at 320px, near-zero opacity) sit behind content as a printing-press artifact, not as decoration.

5D Evaluation:
- **Philosophy:** The slide is a printed object from before screens normalized softness. Every edge is hard. Every rule is functional. The asymmetry is a design decision, not an error. This style works when the message itself has confrontational weight — it does not soften what it presents.
- **Hierarchy:** Barlow Condensed Black at 96–120px is extreme — it reads before anything else on the page. It is far heavier than Archivo Black (D02) at the same size because its condensed form creates more ink per horizontal unit. The body text at Barlow Regular 400 is the exhale after the shout.
- **Detail:** Ghost numerals: position: absolute, z-index 0, `color: var(--color-heading)` at `opacity: 0.04`, font-size 320px, bottom-right of the slide background. 8px near-black rules divide sections; the accent appears only on data highlights, stat accent lines, and `.win` table values — never on decorative elements. The layout uses a deliberate 160px left margin (wider than the 120px used elsewhere) to emphasize the column weight on the left edge, with content body running to 1640px.
- **Function:** Best for contexts where the visual style itself communicates something about the message's seriousness or urgency. Cultural research, investigative media, design critique, architecture. Not appropriate for corporate finance, luxury, or soft emotional contexts.
- **Innovation:** The ghost numeral system translates overprinting — a printing-press accident made intentional by Weingart-era designers — into a slide background element. It creates depth without gradients, and establishes a visual layer hierarchy that is purely typographic.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — warm off-white, paper tone */
  --color-bg:             oklch(0.97 0.008 80);          /* warm off-white */
  --color-surface:        oklch(0.93 0.006 78);
  --color-raised-surface: oklch(0.90 0.005 76);
  --color-border:         oklch(0.74 0.006 78);          /* ruled line */
  --color-border-light:   oklch(0.86 0.005 78);
  --color-border-heavy:   oklch(0.12 0 0);               /* structural rule */

  /* Type — near-black, maximum contrast */
  --color-heading:        oklch(0.08 0 0);               /* near-black */
  --color-body:           oklch(0.14 0 0);
  --color-muted:          oklch(0.38 0 0);
  --color-dim:            oklch(0.56 0 0);

  /* Accent — Industrial Orange */
  --color-accent:         oklch(0.62 0.24 38);           /* industrial orange */
  --color-accent-dark:    oklch(0.48 0.22 36);
  --color-accent-light:   oklch(0.76 0.20 44);
  --color-accent-bg:      oklch(0.96 0.04 60);           /* pale orange tint */
  --color-accent-on:      oklch(0.98 0 0);               /* near-white on orange */

  /* Semantic */
  --color-positive:       oklch(0.44 0.18 145);
  --color-negative:       oklch(0.54 0.24 28);
  --color-warn:           oklch(0.62 0.24 38);           /* accent reused as warn */

  /* Chart — heavy editorial palette */
  --chart-c1: oklch(0.08 0 0);          /* near-black */
  --chart-c2: oklch(0.62 0.24 38);      /* industrial orange */
  --chart-c3: oklch(0.38 0 0);          /* dark grey */
  --chart-c4: oklch(0.60 0 0);          /* mid grey */
  --chart-c5: oklch(0.48 0.22 36);      /* dark orange */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@300;400;500;700&display=swap');

:root {
  --type-display:    'Barlow Condensed', sans-serif;     /* condensed black — the confrontation */
  --type-body:       'Barlow', sans-serif;               /* regular width — the voice */
  --type-label:      'Barlow', sans-serif;
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 18px;
  line-height: 1.65;
  letter-spacing: 0.00em;
}

/* Scale */
/* display   = 6.0rem = 108px  (Barlow Condensed 900 — extreme poster weight) */
/* h1        = 3.2rem = 57px   (Barlow Condensed 900) */
/* h2        = 1.5rem = 27px   (Barlow 700) */
/* body      = 1.0rem = 18px   (Barlow 400) */
/* caption   = 0.72rem = 13px  (Barlow 300) */
/* section   = 0.60rem = 11px  (Barlow 700, tracked +0.18em, uppercase) */
/* ghost     = 20.0rem = 320px (Barlow Condensed 900, opacity 0.04 — background layer) */
```

---

## Background and Structural Elements

```css
#brutal-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: var(--color-bg);
}

/* Ghost numeral — printing-press artifact */
.ghost-num {
  position: absolute; bottom: -40px; right: 80px; z-index: 0;
  font-family: var(--type-display); font-size: 320px; font-weight: 900;
  color: var(--color-heading); opacity: 0.04;
  line-height: 1; user-select: none; pointer-events: none;
  letter-spacing: -0.04em;
}

/* Structural heavy rule — near-black, not accent */
.brutal-rule { width: 100%; height: 8px; background: var(--color-border-heavy); }

/* Thin divider */
.hairline { width: 100%; height: 1px; background: var(--color-border); }

/* Section row */
.section-row { display: flex; align-items: baseline; gap: 16px; margin-bottom: 6px; }
.section-num {
  font-family: var(--type-label); font-size: 11px; font-weight: 700;
  color: var(--color-accent); letter-spacing: 0.18em;
}
.section-label {
  font-family: var(--type-label); font-size: 11px; font-weight: 700;
  color: var(--color-muted); letter-spacing: 0.18em; text-transform: uppercase;
}

@media (prefers-reduced-motion: reduce) { /* Static — no change needed */ }
```

---

## Layout Patterns

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [warm off-white + ghost numeral bottom-right, z=0]     │
│  ○1  SECTION LABEL              [orange num, tracked]   │
│  ════════════════════════  [8px near-black rule]        │
│  HEADLINE BARLOW COND. BLACK 100px                      │
│  ───────────────────────  [1px rule, softer]            │
│  Sub (Barlow 400, 20px, muted), max 1060px              │
│  Spacer                                                 │
│  [Detail row — 4-col, left edge flush to 160px]        │
│                                              01 ·  deck │
└─────────────────────────────────────────────────────────┘
```

### Evidence Slide
```
┌─────────────────────────────────────────────────────────┐
│  ○2  SECTION LABEL                                      │
│  ════════════════════════                               │
│  HEADLINE Barlow Condensed Black 57px                   │
│  ───────────────────────────────────                    │
│  │ stat │ stat │ stat │ — orange accent lines, cond.   │
│  ───────────────────────────────────                    │
│  Body 2-col + editorial aside                           │
└─────────────────────────────────────────────────────────┘
```

---

## Component Tokens

```css
/* Stat block — editorial weight */
.stat-block { display: flex; flex-direction: column; padding-right: 48px; border-right: 1px solid var(--color-border); }
.stat-block:first-child { padding-left: 0; }
.stat-block:last-child  { border-right: none; padding-left: 48px; padding-right: 0; }
.stat-block:nth-child(2){ padding-left: 48px; }
.stat-block__accent-line { width: 36px; height: 8px; background: var(--color-accent); margin-bottom: 10px; }
.stat-block__value {
  font-family: var(--type-display); font-size: 80px; font-weight: 900;
  color: var(--color-heading); line-height: 0.90;
  font-variant-numeric: lining-nums tabular-nums; letter-spacing: -0.01em;
}
.stat-block__label {
  font-family: var(--type-label); font-size: 11px; font-weight: 700;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.14em;
  margin-top: 14px; line-height: 1.55;
}

/* Data grid item */
.grid-item { display: flex; flex-direction: column; gap: 3px; }
.grid-item__label {
  font-family: var(--type-label); font-size: 10px; font-weight: 700;
  color: var(--color-dim); text-transform: uppercase; letter-spacing: 0.22em;
}
.grid-item__value { font-family: var(--type-body); font-size: 15px; font-weight: 400; color: var(--color-muted); }

/* Table — editorial structure */
.data-table th {
  font-family: var(--type-label); font-size: 11px; font-weight: 700;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.14em;
  text-align: left; padding: 9px 14px;
  border-bottom: 3px solid var(--color-border-heavy);
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
  /* Warm off-white — acceptable for print */
  .slide { page-break-after: always; }
  .ghost-num { display: none; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 18.9:1 ✓
- `--color-body` over `--color-bg` = 15.2:1 ✓
- `--color-muted` over `--color-bg` = 6.8:1 ✓
- `--color-accent` (Industrial Orange) over `--color-bg` = 4.2:1 ✓ — large text / graphical; acceptable for section numbers at 11px uppercase tracked
- `--color-dim` over `--color-bg` = 2.9:1 — folio/caption only; large graphical threshold
- Barlow Condensed 900 at 80px+: excellent legibility; condensed weight at body scale is not used
- Ghost numeral at opacity 0.04 is purely decorative; no semantic content
- No animation — `prefers-reduced-motion` has no active concerns
- All semantic content at z-index 1 above background at z-index 0
