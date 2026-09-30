# B01 — dark-glassmorphism

**Style ID:** B01  
**Family:** Glassmorphism (B)  
**Scheme:** Dark  
**Mood:** sophisticated · premium · modern · depth-layered  
**Occasion:** enterprise-saas · product-launch · tech-keynote · finance-tech  
**Academic Fit:** None

---

## Design Philosophy

Dark-glassmorphism layers frosted glass panels over a rich multi-blob gradient background, exploiting `backdrop-filter: blur() saturate()` to create the impression that each card is a physical pane of smoked glass held in front of a luminous surface. The glass panels catch color from the ambient gradient beneath — indigo bleeds through at the upper edges, teal glows at the lower — giving each card a subtle chromatic quality without any color being applied directly to the surface itself. Where neon-cyberpunk asserts with direct glow, dark-glassmorphism suggests with transparency; the hierarchy reads through depth, not brightness.

5D Evaluation:
- **Philosophy:** Depth through translucency. Three radial gradient blobs (indigo top-right, teal bottom-left, violet center) are placed in the background layer; the glass surfaces above them pick up this color passively through blur, which means the ambient color distribution is the composition, not decoration on top of it.
- **Hierarchy:** Plus Jakarta Sans at 700/800 sets a clean, slightly techy authority. Its proportions are slightly extended compared to Inter, giving the same neutrality with more visual presence. Space Mono anchors data values in a terminal-legible column grid.
- **Detail:** Glass card: `background: oklch(0.18 0.015 260 / 0.45)` + `backdrop-filter: blur(24px) saturate(180%)` + `border: 1px solid oklch(0.55 0.010 260 / 0.18)` + `box-shadow: inset 0 1px 0 oklch(0.80 0.010 260 / 0.12)`. The `inset 0 1px` creates a top-edge rim light that reads as reflected ambient light on the glass. No opacity trick needed — the translucency comes from the rgba background, not from `opacity`.
- **Function:** Glassmorphism imposes a constraint: background gradients must be visible beneath the cards, so the stage needs some of each gradient blob partially exposed around card edges. Place cards so the gradient peeking around them forms a visible frame. This style suits 2–4 stat cards, not dense paragraph text — the blur effect degrades legibility of text in the background layer if cards cover everything.
- **Innovation:** `saturate(180%)` on the backdrop filter amplifies the color of whatever is behind the glass. On a near-neutral dark background the effect would be invisible; on a richly chromatic gradient it creates vivid color saturation inside the glass edges — a free color gradient effect entirely from the background layer.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — deep indigo-dark base */
  --color-bg:             oklch(0.07 0.020 265);
  --color-surface:        oklch(0.18 0.015 260 / 0.45);   /* glass: semi-transparent */
  --color-raised-surface: oklch(0.24 0.014 260 / 0.55);   /* elevated glass */
  --color-border:         oklch(0.55 0.010 260 / 0.18);   /* glass edge */
  --color-border-solid:   oklch(0.22 0.016 262);           /* non-glass contexts */

  /* Type */
  --color-heading:        oklch(0.97 0.005 260);
  --color-body:           oklch(0.82 0.012 255);
  --color-muted:          oklch(0.56 0.014 258);

  /* Rim light — inset highlight on glass top edge */
  --color-glass-rim:      oklch(0.80 0.010 260 / 0.12);

  /* Accent — Indigo */
  --color-accent:         oklch(0.72 0.22 265);
  --color-accent-dim:     oklch(0.54 0.18 265);
  --color-accent-glow:    oklch(0.72 0.22 265 / 0.18);
  --color-accent-light:   oklch(0.86 0.16 265);

  /* Secondary — Teal-Cyan */
  --color-accent-2:       oklch(0.76 0.20 200);
  --color-accent-2-dim:   oklch(0.56 0.16 200);

  /* Semantic */
  --color-positive:       oklch(0.72 0.20 160);
  --color-negative:       oklch(0.64 0.22 25);
  --color-warn:           oklch(0.74 0.18 78);

  /* Ambient gradient blobs — background only */
  --blob-1: oklch(0.30 0.26 268 / 0.55);   /* indigo, top-right */
  --blob-2: oklch(0.26 0.22 198 / 0.45);   /* teal, bottom-left */
  --blob-3: oklch(0.28 0.24 285 / 0.35);   /* violet, center */

  /* Chart tokens */
  --chart-c1: oklch(0.72 0.22 265);   /* indigo */
  --chart-c2: oklch(0.76 0.20 200);   /* teal */
  --chart-c3: oklch(0.74 0.18 310);   /* violet */
  --chart-c4: oklch(0.76 0.18 60);    /* amber */
  --chart-c5: oklch(0.68 0.18 25);    /* coral */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap');

:root {
  --type-display: 'Plus Jakarta Sans', sans-serif;   /* headlines */
  --type-body:    'Plus Jakarta Sans', sans-serif;   /* body — lower weight */
  --type-label:   'Space Mono', monospace;           /* data, code, captions */
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 19px;
  line-height: 1.6;
  letter-spacing: -0.01em;
}

/* Scale */
/* display = 3.8rem = 72px  (Plus Jakarta Sans 800) */
/* h1      = 2.6rem = 49px  (Plus Jakarta Sans 700) */
/* h2      = 1.75rem = 33px (Plus Jakarta Sans 600) */
/* body    = 1.0rem = 19px  (Plus Jakarta Sans 400) */
/* caption = 0.74rem = 14px (Space Mono 400) */
```

---

## Background: Multi-Blob Gradient Mesh

A static three-blob radial gradient creates the ambient color field that bleeds through glass surfaces. No animation — the glass `backdrop-filter` itself is the visual event.

```css
#glass-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: var(--color-bg);
}
#glass-bg::before {
  content: '';
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 55% 60% at 82% 12%, var(--blob-1) 0%, transparent 70%),
    radial-gradient(ellipse 50% 55% at 18% 88%, var(--blob-2) 0%, transparent 70%),
    radial-gradient(ellipse 38% 42% at 46% 52%, var(--blob-3) 0%, transparent 65%);
}

/* Noise grain over the gradient — same pattern as A08 at even lower opacity */
#glass-bg::after {
  content: '';
  position: absolute; inset: 0;
  background-image:
    radial-gradient(circle, oklch(0.90 0.00 0 / 0.025) 1px, transparent 1px),
    radial-gradient(circle, oklch(0.72 0.10 265 / 0.015) 1px, transparent 1px);
  background-size: 3px 3px, 5px 5px;
  background-position: 0 0, 1px 1px;
}

@media (prefers-reduced-motion: reduce) {
  /* Background is already static — no changes needed */
}
```

---

## Glass Card Pattern

```css
.glass-card {
  background: var(--color-surface);           /* oklch(0.18 0.015 260 / 0.45) */
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid var(--color-border);      /* oklch(0.55 0.010 260 / 0.18) */
  border-radius: 12px;
  box-shadow:
    inset 0 1px 0 var(--color-glass-rim),     /* top-edge rim light */
    0 4px 24px oklch(0.07 0.020 265 / 0.60);  /* depth shadow */
  padding: 28px 26px;
}

/* Elevated glass — for featured/highlight cards */
.glass-card--raised {
  background: var(--color-raised-surface);
  backdrop-filter: blur(32px) saturate(200%);
  -webkit-backdrop-filter: blur(32px) saturate(200%);
  box-shadow:
    inset 0 1px 0 oklch(0.90 0.010 260 / 0.16),
    0 8px 40px oklch(0.07 0.020 265 / 0.80);
}
```

---

## Slide Layout Templates

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [3-blob gradient bg — indigo top-right, teal bot-left] │
│                                                         │
│  [TAG — Space Mono, 12px, accent, tracked]             │
│  ── thin accent rule (1px, full width) ──────────────── │
│  Headline (Plus Jakarta Sans 800, 72px, heading)       │
│  Subtitle (Plus Jakarta Sans 400, 23px, muted)         │
│  Spacer                                                 │
│  [glass-card badge row — Space Mono labels]            │
│                                                         │
│  [bottom-right: colophon — Space Mono, muted]          │
└─────────────────────────────────────────────────────────┘
```

### Stat Cards Slide
```
┌─────────────────────────────────────────────────────────┐
│  [gradient bg visible around cards]                     │
│  Counter | Headline (700, 49px)                        │
│  ─ rule ──────────────────────────────────────────────  │
│  [ glass-card 3-col main ]           │ [ aside 38% ]   │
│  glass-card--raised: stat value (Space Mono, 44px)     │
│  glass-card body text                                   │
└─────────────────────────────────────────────────────────┘
```

---

## Component Token Mapping

```css
/* Accent rule */
.accent-rule {
  width: 100%; height: 1px;
  background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-border-solid) 55%, transparent 100%);
}

/* Stat value inside glass card */
.stat-value {
  font-family: var(--type-label); font-size: 44px; font-weight: 700;
  color: var(--color-accent-light); line-height: 1;
  font-variant-numeric: lining-nums tabular-nums; letter-spacing: -0.02em;
}

/* Glass tag */
.glass-tag {
  display: inline-flex; align-items: center;
  font-family: var(--type-label); font-size: 12px;
  color: var(--color-accent); letter-spacing: 0.10em; text-transform: uppercase;
  background: var(--color-surface);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  border: 1px solid var(--color-border);
  padding: 4px 14px; border-radius: 6px; width: fit-content;
}

/* Counter */
.counter {
  font-family: var(--type-label); font-size: 12px;
  color: var(--color-accent-2); letter-spacing: 0.10em;
  margin-bottom: 12px;
}
```

---

## Print / Export Mode

```css
@media print {
  #glass-bg { display: none; }
  .glass-card, .glass-card--raised {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: oklch(0.13 0.012 265);
    border: 1px solid oklch(0.24 0.014 262);
    box-shadow: none;
  }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
  :root {
    --color-bg: oklch(0.09 0.014 265);
    --color-heading: oklch(0.97 0.004 260);
    --color-body: oklch(0.82 0.008 255);
  }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 14.1:1 ✓
- `--color-body` over `--color-bg` = 7.6:1 ✓
- `--color-accent-light` over glass surface (0.18 L approx.) = 8.8:1 ✓
- Glass card text must use heading/body tokens, never the semi-transparent surface color
- `backdrop-filter` is progressive enhancement — falls back gracefully to the semi-transparent background color alone in environments without filter support
- Gradient blobs are purely decorative at z-index 0; all semantic content is above at z-index 1
- No animation in this style — `prefers-reduced-motion` has no active concerns
