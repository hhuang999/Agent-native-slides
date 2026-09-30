# C04 — cinematic-amber

**Style ID:** C04  
**Family:** Cinematic (C)  
**Scheme:** Dark-Warm-Gold  
**Mood:** golden-hour · prestige · immersive · contemplative · rich  
**Occasion:** film-fund · luxury-automotive · travel · whisky-spirits · architecture · award-ceremony  
**Academic Fit:** None

---

## Design Philosophy

Cinematic-amber is the visual language of golden-hour cinematography: the quality of light forty minutes before sunset, diffused through haze, when every surface picks up a warm luminous cast. The reference frame is a Villeneuve-era production still, a Lubezki wide-angle, or the amber panel lighting of a prestige automotive campaign. This is not the investigative warmth of C01 (noir) — it is slower, richer, and more contemplative.

The background is a deep amber near-black, warmer and more saturated than C01, with a soft vertical warm wash applied via a linear gradient — slightly cooler at the top (cinematic deep sky) and marginally warmer at the bottom (ground reflection). The accent is a rich amber-gold at high chroma `oklch(0.78 0.22 78)` — fuller and more saturated than C02's champagne. Used sparingly, it reads as a light source caught in frame rather than a decorative element.

The typographic signature is Fraunces (OFL, Google Fonts, variable with optical size `opsz` axis) — an unusual display serif with deliberate "wonky" letterforms, drawn to reference 20th-century advertising type, golden-era film posters, and optical type at large sizes. At 80–88px with `opsz` set high, Fraunces has a richly material quality that no other system font can reproduce. Plus Jakarta Sans (OFL, Google Fonts) handles body and functional text — contemporary, warm, clean without sterility.

There are no card containers, no glassmorphism. Content lives directly on the stage behind the warm wash. Depth is conveyed by value contrast and the directional quality of the amber accent — it appears where light would catch an edge — not by elevation.

5D Evaluation:
- **Philosophy:** Golden-hour light as a design material. Amber light has specific emotional registers — warmth, time passing, richness, the end of something beautiful. The color system tries to hold that quality without using it as a literal warm filter; the warm wash is subtle and the base stays dark.
- **Hierarchy:** Fraunces at variable `opsz:144` and display size creates an immediately distinctive typographic voice. Its thick-thin contrast is dramatic but not fragile; its slightly eccentric letterforms read as considered rather than decorated. Plus Jakarta Sans at 400/500/700 provides modern, legible contrast.
- **Detail:** No grain, no vignette — those belong to C01's investigative register. Instead: a subtle warm vertical wash via `linear-gradient(to bottom, ...)`, a 2px amber overline above stat values, and horizontal ruled hairlines in warm-amber `oklch(0.30 0.022 65)`. The amber accent appears only on the overline, the key stat value, and one decorative element per slide — three touches maximum.
- **Function:** Best for decks where the visual quality is part of the message — where the slide should feel like a considered art object, not a business document. Works well for reveal slides (one large number), comparison slides (few rows), and title slides with a single strong assertion.
- **Innovation:** The `opsz` variable axis on Fraunces means the headline and the eyebrow use the same font family but look completely different — the headline at `opsz:144` has rich ink-trap details and distinctive letterforms; a smaller instance at `opsz:9` tightens to a more restrained newspaper-style appearance. The result is a single-family stack that covers both display and functional text roles while maintaining strong visual differentiation.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — deep warm near-black, amber cast */
  --color-bg:             oklch(0.08 0.022 55);
  --color-surface:        oklch(0.12 0.020 58);         /* raised panels */
  --color-raised-surface: oklch(0.17 0.018 58);         /* elevated panels */
  --color-border:         oklch(0.28 0.022 60);         /* ruled lines */
  --color-border-light:   oklch(0.20 0.018 58);         /* subtle dividers */
  --color-shadow:         oklch(0.04 0.018 50 / 0.85);

  /* Warm wash — applied via pseudo-element gradient */
  --wash-top:    oklch(0.06 0.018 240 / 0.08);   /* faint cool-dark at top */
  --wash-bottom: oklch(0.20 0.030 68 / 0.12);    /* warm amber at bottom */

  /* Type */
  --color-heading:        oklch(0.97 0.008 82);         /* warm off-white */
  --color-body:           oklch(0.80 0.014 74);         /* warm mid-light */
  --color-muted:          oklch(0.52 0.014 68);         /* mid warm grey */
  --color-dim:            oklch(0.36 0.012 62);         /* dim warm grey */

  /* Accent — Rich Amber-Gold */
  --color-accent:         oklch(0.78 0.22 78);          /* rich amber, high chroma */
  --color-accent-dim:     oklch(0.56 0.18 76);
  --color-accent-glow:    oklch(0.78 0.22 78 / 0.18);
  --color-accent-light:   oklch(0.88 0.16 84);          /* lighter amber for stat values */
  --color-accent-bg:      oklch(0.14 0.028 72 / 0.32);  /* very dark amber tint for highlight rows */

  /* Semantic */
  --color-positive:       oklch(0.70 0.18 145);
  --color-negative:       oklch(0.62 0.22 22);
  --color-warn:           oklch(0.74 0.18 78);

  /* Chart tokens */
  --chart-c1: oklch(0.78 0.22 78);    /* amber */
  --chart-c2: oklch(0.70 0.18 145);   /* sage */
  --chart-c3: oklch(0.72 0.18 200);   /* teal */
  --chart-c4: oklch(0.68 0.18 290);   /* violet */
  --chart-c5: oklch(0.64 0.18 22);    /* coral */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,700;1,9..144,400;1,9..144,700&family=Plus+Jakarta+Sans:wght@300;400;500;700&display=swap');

:root {
  --type-display: 'Fraunces', serif;          /* variable display serif — opsz axis */
  --type-body:    'Plus Jakarta Sans', sans-serif;
  --type-label:   'Plus Jakarta Sans', sans-serif;
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 18px;
  line-height: 1.72;
  letter-spacing: 0.00em;
}

/* Scale */
/* display = 4.7rem = 84-92px  (Fraunces, font-variation-settings: 'opsz' 144, optionally italic) */
/* h1      = 2.8rem = 50px     (Fraunces, 'opsz' 72) */
/* h2      = 1.5rem = 27px     (Plus Jakarta Sans 500) */
/* body    = 1.0rem = 18px     (Plus Jakarta Sans 400) */
/* caption = 0.72rem = 13px    (Plus Jakarta Sans 300) */
/* eyebrow = 0.62rem = 11px    (Fraunces, 'opsz' 9, 400, tracked +0.14em, uppercase) */

/* Variable axis usage */
/* .display { font-variation-settings: 'opsz' 144; }  — dramatic, full ink detail */
/* .eyebrow  { font-variation-settings: 'opsz' 9; }   — compact newspaper register */
```

---

## Background: Deep Amber + Warm Vertical Wash

```css
#amber-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: var(--color-bg);
}

/* Subtle directional wash — cinematic depth, not decoration */
#amber-bg::before {
  content: '';
  position: absolute; inset: 0;
  background: linear-gradient(
    to bottom,
    var(--wash-top) 0%,
    transparent 45%,
    var(--wash-bottom) 100%
  );
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
│  [deep warm dark + subtle warm wash bottom]             │
│                                                         │
│  EYEBROW — Fraunces opsz:9, 11px, amber, +0.14em       │
│  ── 2px amber rule ──────────────────────────────────── │
│  Headline in Fraunces opsz:144, 88px, heading          │
│  ── 1px warm hairline ───────────────────────────────── │
│  Subtitle (Plus Jakarta Sans 400, 20px, muted)         │
│  Spacer                                                 │
│  [metadata tags — Plus Jakarta Sans 300, dim]          │
│  ── footer hairline ─────────────────────────────────── │
│  Footer text                                            │
└─────────────────────────────────────────────────────────┘
```

### Evidence Slide (Stats)
```
┌─────────────────────────────────────────────────────────┐
│  EYEBROW — section label                                │
│  ── accent rule ────────────────────────────────────── │
│  Headline (Fraunces opsz:72, 50px)                      │
│  ── hairline ───────────────────────────────────────── │
│  │ stat │ stat │ stat │ — amber overlines + Fraunces   │
│  ── hairline ───────────────────────────────────────── │
│  Body text + aside column                               │
└─────────────────────────────────────────────────────────┘
```

---

## Component Tokens

```css
/* Eyebrow — Fraunces optical small register */
.eyebrow {
  font-family: var(--type-display); font-size: 11px; font-weight: 400;
  font-variation-settings: 'opsz' 9;
  color: var(--color-accent); letter-spacing: 0.14em; text-transform: uppercase;
}

/* Accent rule */
.accent-rule {
  width: 100%; height: 2px;
  background: var(--color-accent);
  opacity: 0.60;
}

/* Hairline rule */
.hairline {
  width: 100%; height: 1px;
  background: var(--color-border);
}

/* Stat column */
.stat-col {
  display: flex; flex-direction: column;
  padding: 24px 44px 24px 0;
  border-right: 1px solid var(--color-border-light);
}
.stat-col:first-child { padding-left: 0; }
.stat-col:last-child { border-right: none; padding-left: 44px; padding-right: 0; }
.stat-col:nth-child(2) { padding-left: 44px; }
.stat-col__overline {
  width: 32px; height: 2px; background: var(--color-accent);
  margin-bottom: 10px; opacity: 0.75;
}
.stat-col__value {
  font-family: var(--type-display); font-size: 80px; font-weight: 700;
  font-variation-settings: 'opsz' 144;
  color: var(--color-heading); line-height: 0.9;
  font-variant-numeric: lining-nums tabular-nums; letter-spacing: -0.01em;
}
.stat-col__label {
  font-family: var(--type-label); font-size: 11px; font-weight: 300;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.12em;
  margin-top: 12px; line-height: 1.55;
}

/* Amber tag — thin border, warm */
.amber-tag {
  display: inline-flex; align-items: center;
  font-family: var(--type-label); font-size: 11px; font-weight: 400;
  color: var(--color-muted); letter-spacing: 0.08em;
  border: 1px solid var(--color-border-light);
  padding: 4px 12px; border-radius: 2px;
}
```

---

## Print / Export Mode

```css
@media print {
  #amber-bg { display: none; }
  :root {
    --color-bg: oklch(1.0 0 0);
    --color-heading: oklch(0.10 0.008 55);
    --color-body: oklch(0.24 0.008 58);
    --color-muted: oklch(0.44 0.008 62);
    --color-border: oklch(0.70 0.006 68);
    --color-accent: oklch(0.52 0.18 76);
  }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 15.8:1 ✓
- `--color-body` over `--color-bg` = 7.2:1 ✓
- `--color-accent` (amber) over `--color-bg` = 6.9:1 ✓ — large text / graphical
- Fraunces at `opsz:9` at 11px: `--color-muted` over `--color-bg` = 3.6:1 — large-text threshold; uppercase tracked eyebrow only
- Fraunces variable font: requires `font-variation-settings: 'opsz' 144` for display — without it, the optical size defaults to body register and loses the dramatic thick-thin contrast
- `prefers-reduced-motion`: no animations in this style — no active concerns
- All semantic content at z-index 1 above background at z-index 0
