# C03 — light-editorial-magazine

**Style ID:** C03  
**Family:** Cinematic (C)  
**Scheme:** Light-Warm  
**Mood:** editorial · thoughtful · authoritative · print-quality · warm-paper  
**Occasion:** urban-policy · architecture · cultural-institution · design-research · journalism · annual-report  
**Academic Fit:** Medium (acceptable for design-forward academic contexts)

---

## Design Philosophy

Light-editorial-magazine is the visual language of the serious print journal: a spread in *Monocle*, a page from *The Economist* redesigned for 2026, the typeset annual report of a cultural institution. The background is a warm off-white — not pure paper, but the slightly cream quality of a well-made publication — and all depth comes from the typographic hierarchy and ruled column lines, not from surface elevation or glow.

Where C01 and C02 are both dark-background cinematic styles, C03 flips the relationship: the text field is light, the ink is dark, and the accent carries all the color. The palette is disciplined — warm off-white / dark warm ink / one editorial accent — with no secondary accent muddying the page. The accent color is a deep forest green `oklch(0.38 0.14 155)`: an editorial choice that reads as considered and unhurried rather than urgent or decorative.

The type pairing is DM Serif Display (OFL, Google Fonts) for headlines — a modern editorial serif with excellent display presence at 80–92px, full-bodied strokes at text size, and a warm personality that matches the paper background — and DM Sans (OFL, Google Fonts) for body and labels. The DM family was designed to work together; the visual relationship is coherent without being predictable. DM Serif Display at large sizes has a sturdy, confident presence that differs clearly from C02's Cormorant Garamond italic fragility or C01's Bebas Neue condensed power.

There are no card containers. Content lives directly on the warm-paper stage, organized by magazine-style column rules, folio lines, and typographic weight. A folio line at the top of each slide (section title + page indicator) anchors the editorial context.

5D Evaluation:
- **Philosophy:** Paper as the primary material. Every decision defers to the reading experience — wide enough margins, generous line height, text that would hold up at 300 DPI print. The slide is a spread, not a screen.
- **Hierarchy:** DM Serif Display at 80–88px for the headline assertion; 500-weight DM Sans at 22px for subhead and transition text; 400-weight DM Sans at 18px for body. Stat values break this hierarchy by using DM Serif Display italic at 72px in the accent forest-green — the editorial tradition of a large pull-quote number.
- **Detail:** Folio line: `oklch(0.72 0.008 80)` 1px rule full-width with section title (DM Sans 500, 10px, tracked +0.18em) left and page indicator right — the magazine's primary navigation. Accent rule: `oklch(0.38 0.14 155)` 2px at slide top, 56px wide — a color note, not a structure. Column rules between stat blocks: `oklch(0.78 0.008 80)` 1px. No other color decoration.
- **Function:** Excellent for evidence-forward decks, policy briefs, and annual reports. The light background makes data tables easy to read without the inversion fatigue of dark themes. Body text at 18px/1.75 is genuinely readable at 1080p. Works for wider text columns than dark styles.
- **Innovation:** The "pull-quote stat" pattern: a large DM Serif Display italic number in accent forest-green, with a cap label in DM Sans 500 above and an explanatory line in DM Sans 300 below, styled to look like a pulled quote from a magazine body article. The color breaks the otherwise monochrome palette with exactly one application per stat column — the single color touch per cell is an editorial restraint principle.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — warm off-white paper */
  --color-bg:             oklch(0.98 0.006 80);
  --color-surface:        oklch(0.94 0.008 78);         /* inset panels */
  --color-raised-surface: oklch(0.91 0.008 76);         /* sidebar panels */
  --color-border:         oklch(0.72 0.008 80);         /* column rules */
  --color-border-light:   oklch(0.84 0.006 78);         /* light dividers */
  --color-folio:          oklch(0.72 0.008 80);         /* folio line */

  /* Type — warm dark ink */
  --color-heading:        oklch(0.12 0.010 60);         /* near-black warm ink */
  --color-body:           oklch(0.22 0.010 62);         /* dark warm ink */
  --color-muted:          oklch(0.46 0.010 68);         /* mid warm grey */
  --color-dim:            oklch(0.64 0.008 72);         /* light grey */

  /* Accent — Editorial Forest Green */
  --color-accent:         oklch(0.38 0.14 155);         /* deep forest green */
  --color-accent-dim:     oklch(0.52 0.12 155);
  --color-accent-light:   oklch(0.62 0.14 155);         /* lighter green for pull-quote stats */
  --color-accent-bg:      oklch(0.94 0.04 155);         /* very pale green tint for highlights */

  /* Semantic */
  --color-positive:       oklch(0.42 0.18 145);
  --color-negative:       oklch(0.48 0.22 28);
  --color-warn:           oklch(0.54 0.18 68);

  /* Chart tokens */
  --chart-c1: oklch(0.38 0.14 155);    /* forest green */
  --chart-c2: oklch(0.54 0.18 28);     /* terracotta */
  --chart-c3: oklch(0.42 0.16 240);    /* slate blue */
  --chart-c4: oklch(0.56 0.12 280);    /* muted violet */
  --chart-c5: oklch(0.48 0.14 88);     /* warm ochre */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;700&display=swap');

:root {
  --type-display: 'DM Serif Display', serif;   /* editorial headline serif */
  --type-body:    'DM Sans', sans-serif;        /* body, labels, functional text */
  --type-label:   'DM Sans', sans-serif;        /* same — unified DM pair */
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 18px;
  line-height: 1.75;
  letter-spacing: 0.00em;
}

/* Scale */
/* display = 4.7rem = 84-92px  (DM Serif Display, upright or italic) */
/* h1      = 2.6rem = 47px     (DM Serif Display) */
/* h2      = 1.5rem = 27px     (DM Sans 500) */
/* body    = 1.0rem = 18px     (DM Sans 400) */
/* caption = 0.72rem = 13px    (DM Sans 300) */
/* folio   = 0.56rem = 10px    (DM Sans 500, tracked +0.18em, uppercase) */
```

---

## Background: Warm Paper, No Decoration

```css
#magazine-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: var(--color-bg);
}

/* No grain, no gradient — pure warm paper */

@media (prefers-reduced-motion: reduce) {
  /* Static — no change needed */
}
```

---

## Layout Patterns

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  SECTION TITLE ─────────────────── Issue · Date  folio  │
│  ── 2px forest-green rule, 56px wide ───────────────── │
│  Headline in DM Serif Display, 88px, warm near-black    │
│  ── 1px warm rule ──────────────────────────────────── │
│  Deck sub / abstract (DM Sans 400, 20px, muted)        │
│  Spacer                                                 │
│  [tag row — plain-type labels, no borders]             │
│  ── 1px warm rule ──────────────────────────────────── │
│  Publication info / credit (DM Sans 300, 11px, dim)    │
└─────────────────────────────────────────────────────────┘
```

### Evidence Slide (Stats)
```
┌─────────────────────────────────────────────────────────┐
│  SECTION LABEL ─────────────────────── 02 / 04  folio  │
│  Headline assertion (DM Serif Display 47px)             │
│  ── 1px muted rule ─────────────────────────────────── │
│  │ pull-quote stat │ pull-quote stat │ pull-quote stat │ │
│  │ DM Serif Disp   │ italic 72px     │ accent green   │ │
│  ── 1px muted rule ─────────────────────────────────── │
│  Body text column + [narrow sidebar]                   │
└─────────────────────────────────────────────────────────┘
```

---

## Component Tokens

```css
/* Folio — top bar */
.folio {
  width: 100%; height: 1px;
  background: var(--color-folio);
  margin-bottom: 10px;
}
.folio-bar {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 20px;
}
.folio-text {
  font-family: var(--type-label); font-size: 10px; font-weight: 500;
  color: var(--color-dim); text-transform: uppercase; letter-spacing: 0.18em;
}

/* Accent rule — short forest-green stroke */
.accent-stroke {
  width: 56px; height: 2px; background: var(--color-accent);
  margin-bottom: 20px;
}

/* Pull-quote stat */
.pull-stat { display: flex; flex-direction: column; padding: 0 44px 0 0; }
.pull-stat:first-child { padding-left: 0; }
.pull-stat:last-child { padding-right: 0; padding-left: 44px; }
.pull-stat:nth-child(2) { padding-left: 44px; }
.pull-stat__cap {
  font-family: var(--type-label); font-size: 10px; font-weight: 500;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.16em;
  margin-bottom: 6px;
}
.pull-stat__value {
  font-family: var(--type-display); font-size: 72px; font-style: italic;
  color: var(--color-accent); line-height: 0.92;
  font-variant-numeric: lining-nums tabular-nums;
}
.pull-stat__desc {
  font-family: var(--type-label); font-size: 13px; font-weight: 300;
  color: var(--color-muted); margin-top: 10px; line-height: 1.55;
}

/* Magazine tag — plain tracked text, no border */
.mag-tag {
  font-family: var(--type-label); font-size: 11px; font-weight: 500;
  color: var(--color-muted); letter-spacing: 0.12em; text-transform: uppercase;
}
```

---

## Print / Export Mode

```css
@media print {
  #magazine-bg { background: #fff; }
  :root {
    --color-bg: oklch(1.0 0 0);
    --color-heading: oklch(0.08 0.008 60);
    --color-body: oklch(0.18 0.008 60);
    --color-muted: oklch(0.40 0.008 68);
    --color-border: oklch(0.65 0.006 78);
    --color-accent: oklch(0.32 0.14 155);
  }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 17.8:1 ✓
- `--color-body` over `--color-bg` = 11.4:1 ✓
- `--color-accent` (forest green) over `--color-bg` = 5.9:1 ✓ — large text / graphical; do not use as body text at small size
- `--color-muted` over `--color-bg` = 4.1:1 — large-text threshold; captions and tracked labels only
- DM Serif Display: warm-register serif, excellent at 47px+; above 72px italic reads clearly; do not use below 32px
- DM Sans 300 at 13px: only for descriptors below pull-quote stats, never for essential navigation
- No animation — `prefers-reduced-motion` has no active concerns
- All semantic content at z-index 1 above background at z-index 0
- Light background: standard reading environment, no inversion fatigue concerns
