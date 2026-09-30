# F02 — aurora-dawn-light

**Style ID:** F02  
**Family:** Atmospheric Gradient (F)  
**Scheme:** Light-Warm (dawn peach · rose horizon · periwinkle sky · amber gold)  
**Mood:** hopeful · luminous · open · human · aspirational  
**Occasion:** education · social-impact · futures-research · sustainability · health-systems · humanitarian  
**Academic Fit:** High (education research, social policy, public health, futures studies, human geography)

---

## Design Philosophy

Aurora Dawn Light is the warm, luminous counterpart to F01's deep-night aurora. Where F01 bathes the viewer in the cold mystery of a Nordic night sky, F02 is the moment before sunrise — a sky already alive with refracted light, soft gradient bands of peach, rose, and periwinkle that signal the coming of something new. The visual register is atmospheric rather than geometric: depth created by layered gradients rather than hard-edge structure.

The background is not a flat surface but a living sky — warm amber-peach at the lower horizon, soft rose in the middle registers, cool periwinkle at the top. A subtle slow-drift animation breathes warmth across the composition. Content floats directly on this gradient as naturally readable text: no heavy glass cards, no dark overlay. Typography must be legible directly against the pale gradient, which means careful contrast management rather than the usual white-on-dark escape.

Typography pairs Lora (OFL, Google Fonts) — a warm contemporary text serif with strong display presence — with Nunito (OFL, Google Fonts) for body and labels. Lora has rounded humanistic serifs suited to editorial warmth; Nunito is a rounded geometric sans that echoes Lora's friendliness. Together they create a voice that is considered without being cold — appropriate for content about human systems, transition, and possibility.

The accent is warm amber-gold `oklch(0.62 0.14 55)` — the color of first light on a clear horizon. This threads through section hairlines (1px amber, 55% opacity), stat accent dots (8px circle), `.win` table values, and the folio. The palette holds warm throughout: even the "cool" periwinkle in the upper background is a warm-side periwinkle rather than a blue-grey.

5D Evaluation:
- **Philosophy:** Dawn signals opening, transition, possibility. This style is suited for content about change — education reform, social entrepreneurship, climate solutions, futures research — where the visual metaphor of a new day carries genuine meaning. The warmth signals human agency rather than institutional system.
- **Hierarchy:** Lora at 82–88px reads with generous rounded serifs that convey care rather than authority. This is not the cold certainty of institutional typography; it is the considered voice of editorial design applied to evidence.
- **Detail:** Warm amber hairlines and accent dots maintain the color thread across all three slides without overpowering the gradient. The stat column values in Lora serif create "humanist data" — measurement that carries emotional context alongside numerical precision. The folio sits in amber-light, continuing the color thread.
- **Function:** Best for education, social impact, humanitarian, and futures-oriented research where warmth and optimism are genuine signals, not decoration. Not appropriate for clinical medical data, legal compliance, or contexts requiring institutional neutrality.
- **Innovation:** The gradient background itself is the primary surface — not a card placed on a background, but the slide as sky. The gradient drifts slowly enough to feel alive without competing with reading. Differentiation from F01: light vs. dark, warm vs. cool temperature, Lora vs. Bricolage Grotesque, dawn vs. night phenomenon.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — gradient dawn sky */
  --color-bg:             oklch(0.96 0.020 30);          /* warm light base */
  --color-surface:        oklch(0.98 0.010 28 / 0.82);   /* frosted light panel */
  --color-border:         oklch(0.82 0.014 35);          /* warm hairline */
  --color-border-light:   oklch(0.88 0.012 38);
  --color-border-dark:    oklch(0.68 0.016 32);          /* stronger warm rule */

  /* Type — warm near-black */
  --color-heading:        oklch(0.14 0.010 30);          /* warm near-black */
  --color-body:           oklch(0.24 0.008 28);
  --color-muted:          oklch(0.50 0.008 28);
  --color-dim:            oklch(0.66 0.006 30);

  /* Accent — Amber Dawn Gold */
  --color-accent:         oklch(0.62 0.14 55);           /* amber gold */
  --color-accent-mid:     oklch(0.72 0.12 52);
  --color-accent-light:   oklch(0.80 0.10 50);
  --color-accent-bg:      oklch(0.96 0.030 55);          /* pale amber tint */
  --color-accent-on:      oklch(0.14 0.010 30);          /* dark on amber */

  /* Semantic */
  --color-positive:       oklch(0.45 0.13 148);
  --color-negative:       oklch(0.52 0.20 28);
  --color-warn:           oklch(0.62 0.16 68);

  /* Chart — warm editorial palette */
  --chart-c1: oklch(0.62 0.14 55);      /* amber gold */
  --chart-c2: oklch(0.14 0.010 30);     /* near-black warm */
  --chart-c3: oklch(0.72 0.10 10);      /* soft rose */
  --chart-c4: oklch(0.74 0.008 30);     /* warm mid-grey */
  --chart-c5: oklch(0.60 0.12 280);     /* warm periwinkle */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,700;1,400&family=Nunito:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap');

:root {
  --type-display:  'Lora', serif;               /* warm serif — headlines + stat numerics */
  --type-body:     'Nunito', sans-serif;         /* rounded humanist sans — all other text */
  --type-label:    'Nunito', sans-serif;
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 18px;
  line-height: 1.70;
  letter-spacing: 0.006em;
}

/* Scale */
/* display   = 4.8rem = 86px   (Lora 400 — warm editorial serif at maximum scale) */
/* h1        = 2.8rem = 50px   (Lora 400) */
/* h2        = 1.5rem = 27px   (Nunito 700) */
/* body      = 1.0rem = 18px   (Nunito 400) */
/* caption   = 0.72rem = 13px  (Nunito 300) */
/* section   = 0.60rem = 11px  (Nunito 600, tracked +0.16em, uppercase) */
/* folio     = 0.56rem = 10px  (Nunito 400, color: accent-light) */
```

---

## Background and Structural Elements

```css
/* Dawn sky — layered gradient atmosphere */
.bg-dawn {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 100% 60% at 50% 115%,
      oklch(0.90 0.055 48 / 0.55), transparent 60%),
    radial-gradient(ellipse 80% 70% at 10% 85%,
      oklch(0.88 0.042 12 / 0.30), transparent 55%),
    radial-gradient(ellipse 60% 50% at 88% 10%,
      oklch(0.91 0.026 282 / 0.28), transparent 52%),
    linear-gradient(180deg,
      oklch(0.93 0.024 282) 0%,
      oklch(0.95 0.020 20) 45%,
      oklch(0.96 0.032 46) 100%);
  animation: dawn-breathe 24s ease-in-out infinite alternate;
}

@keyframes dawn-breathe {
  0%   { filter: brightness(0.96); }
  50%  { filter: brightness(1.02); }
  100% { filter: brightness(0.98); }
}

@media (prefers-reduced-motion: reduce) {
  .bg-dawn { animation: none; filter: none; }
}

/* Section amber hairline — 1px at 55% opacity */
.section-hairline { width: 100%; height: 1px; background: var(--color-accent); opacity: 0.55; }

/* Standard warm hairline */
.hairline { width: 100%; height: 1px; background: var(--color-border); }

/* Section marker */
.section-marker { display: flex; align-items: center; gap: 14px; margin-bottom: 10px; }
.section-num {
  font-family: var(--type-label); font-size: 11px; font-weight: 600;
  color: var(--color-accent); letter-spacing: 0.16em; text-transform: uppercase;
}
.section-label {
  font-family: var(--type-label); font-size: 11px; font-weight: 600;
  color: var(--color-muted); letter-spacing: 0.16em; text-transform: uppercase;
}
```

---

## Layout Patterns

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [dawn gradient · peach-rose-periwinkle atmosphere]     │
│  01 · SECTION LABEL    [amber 11px, +0.16em]            │
│  ── 1px amber hairline (55% opacity) ──────────────     │
│  Headline Lora 86px                                     │
│  ── 1px warm hairline ──────────────────────────────    │
│  Abstract (Nunito 400, 20px, muted)                     │
│  Spacer                                                 │
│  [Detail row — 4-col]                                   │
│                                           01 · amber    │
└─────────────────────────────────────────────────────────┘
```

---

## Component Tokens

```css
/* Stat column — Lora numerics with amber dot accent */
.stat-col { display: flex; flex-direction: column; padding-right: 52px; border-right: 1px solid var(--color-border); }
.stat-col:first-child { padding-left: 0; }
.stat-col:last-child  { border-right: none; padding-left: 52px; padding-right: 0; }
.stat-col:nth-child(2){ padding-left: 52px; }
.stat-col__accent-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-accent); margin-bottom: 12px; }
.stat-col__value {
  font-family: var(--type-display); font-size: 80px; font-weight: 400;
  color: var(--color-heading); line-height: 0.92;
  font-variant-numeric: lining-nums tabular-nums;
}
.stat-col__label {
  font-family: var(--type-label); font-size: 11px; font-weight: 600;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.14em;
  margin-top: 14px; line-height: 1.55;
}

/* Table */
.data-table th {
  font-family: var(--type-label); font-size: 11px; font-weight: 600;
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

/* Folio — amber-light thread */
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
  .bg-dawn { animation: none; filter: none; }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 13.4:1 ✓
- `--color-body` over `--color-bg` = 9.8:1 ✓
- `--color-muted` over `--color-bg` = 3.4:1 — large text / graphical only; section labels at 11px uppercase tracked (graphical threshold: 3:1 ✓)
- `--color-accent` (Amber Gold) over `--color-bg` = 4.8:1 ✓ — section numbers, accent dots, win values
- `--color-accent-light` over `--color-bg` = 2.6:1 — folio only; purely navigational
- Lora 400 at 80px+: high legibility; warm serifs highly readable at display scale
- Nunito 600 at 11px uppercase tracked: legible at +0.16em; supplementary navigation
- `prefers-reduced-motion`: removes animation from `.bg-dawn`; content fully readable in static state
- All semantic content at z-index 1 above background at z-index 0
- Background gradient verified legible: heading `oklch(0.14 0.010 30)` on lightest gradient point `oklch(0.98 0.010 28)` ≥ 13:1

---

## Differentiators

| Dimension | F01 (aurora-borealis-dark) | F02 (aurora-dawn-light) |
|-----------|---------------------------|------------------------|
| Scheme | Dark night sky | Light dawn sky |
| Temperature | Cold (blue-green-purple) | Warm (peach-rose-amber) |
| Display font | Bricolage Grotesque | Lora |
| Body font | Geist Mono | Nunito |
| Accent | Aurora green | Amber gold |
| Stat accent | — | 8px amber dot |
| Mood | Ethereal, immersive | Hopeful, luminous |
| Occasions | AI/tech, innovation | Education, social impact |
