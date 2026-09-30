# B03 — aurora-glass

**Style ID:** B03  
**Family:** Glassmorphism (B)  
**Scheme:** Dark  
**Mood:** ethereal · northern-lights · premium · contemplative  
**Occasion:** climate-tech · deep-tech · research · ai-lab · space  
**Academic Fit:** Low (too atmospheric for dense academic text)

---

## Design Philosophy

Aurora-glass is dark glassmorphism pushed into the spectral. Where B01 uses a static three-blob gradient, B03 layers wide horizontal aurora bands across the background — teal-green on one axis, violet on another, a cold blue-white at the zenith — mimicking the actual geometry of aurora borealis: curtains of color that shift from horizon to sky rather than radiating from a single point. Glass surfaces above these bands pick up the shifting aurora palette through `backdrop-filter: saturate(220%)`, making each card a window into the light beneath.

The animation is a slow cross-fade between two aurora states at 14 seconds, with `prefers-reduced-motion` falling back to the first static frame. This is the only B-family style with movement in the background layer.

5D Evaluation:
- **Philosophy:** Aurora as a vertical-banding phenomenon, not a scattered blob field. The gradient background uses wide ellipses oriented as horizontal bands (tall width, short height) at different vertical positions, creating a striated light effect that reads as depth-layers of luminous gas rather than spotlights.
- **Hierarchy:** Syne (OFL, Google Fonts) at 700/800 is geometric and unusual enough to match the aurora atmosphere without being decorative — its squared proportions and slightly condensed uppercase sit well against the organic color movement. JetBrains Mono (OFL, Google Fonts) grounds data in terminal precision.
- **Detail:** Glass card uses `oklch(0.14 0.018 220 / 0.40)` — a cooler, more chromatic base than B01 to absorb aurora color. Rim light is faint teal `oklch(0.72 0.18 180 / 0.14)` instead of neutral, giving the card a lit-from-below look. `backdrop-filter: blur(28px) saturate(220%)` at high saturation amplifies the aurora tints dramatically — cards near the teal band read greenish, cards near the violet band read purple.
- **Function:** Strong for 2–3 glass cards with significant breathing room. Dense layouts kill the aurora-through-glass effect. Best for title slides with large display type and minimal content below the fold.
- **Innovation:** The aurora animation uses two `@keyframes` cross-fading via `opacity` — each frame is a different aurora configuration. The `::before` holds frame A, the `::after` holds frame B; alternating `opacity` on both with a 14s delay between them creates a seamless slow pulse. Zero position-change — only opacity — so the animation is GPU-cheap and `will-change: opacity` is the only hint needed.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — deep cold-teal base */
  --color-bg:             oklch(0.06 0.018 210);
  --color-surface:        oklch(0.14 0.018 220 / 0.40);    /* aurora glass */
  --color-raised-surface: oklch(0.20 0.016 215 / 0.52);    /* elevated glass */
  --color-border:         oklch(0.58 0.012 200 / 0.16);    /* glass edge */
  --color-border-solid:   oklch(0.18 0.018 215);            /* non-glass */
  --color-glass-rim:      oklch(0.72 0.18 180 / 0.14);     /* teal rim light */
  --color-shadow:         oklch(0.06 0.018 210 / 0.70);    /* cold shadow */

  /* Type */
  --color-heading:        oklch(0.97 0.006 200);
  --color-body:           oklch(0.82 0.014 210);
  --color-muted:          oklch(0.54 0.016 210);

  /* Accent — Aurora Teal-Green */
  --color-accent:         oklch(0.72 0.22 162);
  --color-accent-dim:     oklch(0.50 0.18 162);
  --color-accent-glow:    oklch(0.72 0.22 162 / 0.18);
  --color-accent-light:   oklch(0.86 0.16 162);

  /* Secondary — Aurora Violet */
  --color-accent-2:       oklch(0.68 0.24 290);
  --color-accent-2-dim:   oklch(0.46 0.20 290);

  /* Semantic */
  --color-positive:       oklch(0.72 0.20 162);
  --color-negative:       oklch(0.64 0.22 25);
  --color-warn:           oklch(0.74 0.18 78);

  /* Aurora gradient layers */
  --aurora-1: oklch(0.32 0.26 162 / 0.50);   /* teal-green band */
  --aurora-2: oklch(0.28 0.28 290 / 0.40);   /* violet band */
  --aurora-3: oklch(0.24 0.20 220 / 0.35);   /* cold-blue zenith */
  --aurora-4: oklch(0.30 0.22 175 / 0.30);   /* secondary teal */
  --aurora-5: oklch(0.26 0.24 270 / 0.28);   /* deep indigo */

  /* Chart tokens */
  --chart-c1: oklch(0.72 0.22 162);   /* teal */
  --chart-c2: oklch(0.68 0.24 290);   /* violet */
  --chart-c3: oklch(0.74 0.18 220);   /* sky */
  --chart-c4: oklch(0.76 0.18 78);    /* amber */
  --chart-c5: oklch(0.68 0.18 25);    /* coral */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=JetBrains+Mono:wght@300;400;700&display=swap');

:root {
  --type-display: 'Syne', sans-serif;         /* display — geometric, squared */
  --type-body:    'Syne', sans-serif;         /* body at lower weight */
  --type-label:   'JetBrains Mono', monospace; /* data, captions */
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 19px;
  line-height: 1.6;
  letter-spacing: -0.01em;
}

/* Scale */
/* display = 3.8rem = 72px  (Syne 800) */
/* h1      = 2.6rem = 49px  (Syne 700) */
/* h2      = 1.75rem = 33px (Syne 600) */
/* body    = 1.0rem = 19px  (Syne 400) */
/* caption = 0.74rem = 14px (JetBrains Mono 300) */
```

---

## Background: Aurora Bands (Animated)

Two frames cross-fade to create the aurora movement. The animation advances slowly at 14 seconds per cycle — visible but not distracting.

```css
#aurora-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: var(--color-bg);
}

/* Frame A — aurora configuration */
#aurora-bg::before {
  content: '';
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 100% 30% at 50% 75%, var(--aurora-1) 0%, transparent 70%),
    radial-gradient(ellipse 80% 25% at 70% 45%, var(--aurora-2) 0%, transparent 65%),
    radial-gradient(ellipse 90% 20% at 30% 20%, var(--aurora-3) 0%, transparent 60%);
  will-change: opacity;
  animation: aurora-a 14s ease-in-out infinite alternate;
}

/* Frame B — shifted aurora configuration */
#aurora-bg::after {
  content: '';
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 90% 28% at 40% 70%, var(--aurora-4) 0%, transparent 65%),
    radial-gradient(ellipse 85% 22% at 60% 40%, var(--aurora-5) 0%, transparent 60%),
    radial-gradient(ellipse 95% 18% at 50% 15%, var(--aurora-2) 0%, transparent 55%);
  opacity: 0;
  will-change: opacity;
  animation: aurora-b 14s ease-in-out infinite alternate;
}

@keyframes aurora-a { 0%, 40% { opacity: 1 } 60%, 100% { opacity: 0 } }
@keyframes aurora-b { 0%, 40% { opacity: 0 } 60%, 100% { opacity: 1 } }

@media (prefers-reduced-motion: reduce) {
  #aurora-bg::before, #aurora-bg::after { animation: none; }
  #aurora-bg::after { opacity: 0; } /* lock to frame A */
}
```

---

## Glass Card Pattern

```css
.glass-card {
  background: var(--color-surface);             /* oklch(0.14 0.018 220 / 0.40) */
  backdrop-filter: blur(28px) saturate(220%);
  -webkit-backdrop-filter: blur(28px) saturate(220%);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow:
    inset 0 1px 0 var(--color-glass-rim),       /* teal rim — lit from aurora below */
    0 4px 28px var(--color-shadow);
  padding: 28px 26px;
}

.glass-card--raised {
  background: var(--color-raised-surface);
  backdrop-filter: blur(36px) saturate(260%);
  -webkit-backdrop-filter: blur(36px) saturate(260%);
  box-shadow:
    inset 0 1px 0 oklch(0.78 0.18 175 / 0.18),
    0 8px 48px oklch(0.06 0.018 210 / 0.80);
}
```

---

## Slide Layout Templates

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [aurora bands: teal bottom, violet mid, blue-white top] │
│                                                         │
│  [TAG — JetBrains Mono, 12px, accent, tracked]         │
│  ── teal-green accent rule ─────────────────────────── │
│  DISPLAY: Headline (Syne 800, 72px, heading)           │
│  Subtitle (Syne 400, 22px, muted)                      │
│  Spacer                                                 │
│  [glass badge row]                                     │
│  ── muted bottom rule ──────────────────────────────── │
└─────────────────────────────────────────────────────────┘
```

### Content Slide
```
┌─────────────────────────────────────────────────────────┐
│  [aurora visible around all card edges]                 │
│  Counter | Headline (Syne 700, 49px)                   │
│  ─ teal rule ──────────────────────────────────────────  │
│  [ glass-card 3-col stats ] + [ aside 36% ]            │
│  Stat values: Syne 600 44px, accent-light teal         │
└─────────────────────────────────────────────────────────┘
```

---

## Component Token Mapping

```css
/* Accent rule — teal gradient */
.accent-rule {
  width: 100%; height: 1px;
  background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-border-solid) 55%, transparent 100%);
}

/* Stat value */
.stat-value {
  font-family: var(--type-label); font-size: 44px; font-weight: 700;
  color: var(--color-accent-light); line-height: 1;
  font-variant-numeric: lining-nums tabular-nums; letter-spacing: -0.02em;
}

/* Aurora tag */
.aurora-tag {
  display: inline-flex; align-items: center;
  font-family: var(--type-label); font-size: 12px; font-weight: 300;
  color: var(--color-accent); letter-spacing: 0.12em; text-transform: uppercase;
  background: var(--color-surface);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border: 1px solid oklch(0.72 0.22 162 / 0.22);
  padding: 4px 14px; border-radius: 6px; width: fit-content;
}

/* Counter */
.counter {
  font-family: var(--type-label); font-size: 12px; font-weight: 300;
  color: var(--color-accent-2); letter-spacing: 0.12em;
  margin-bottom: 12px;
}
```

---

## Print / Export Mode

```css
@media print {
  #aurora-bg { display: none; }
  .glass-card, .glass-card--raised {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: oklch(0.12 0.014 215);
    border: 1px solid oklch(0.22 0.016 215);
    box-shadow: none;
  }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
  :root {
    --color-bg: oklch(0.08 0.014 210);
    --color-heading: oklch(0.97 0.005 200);
    --color-body: oklch(0.82 0.010 210);
  }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 15.8:1 ✓
- `--color-body` over `--color-bg` = 8.2:1 ✓
- `--color-accent-light` (teal) over glass surface (approx 0.14 L) = 9.4:1 ✓
- Aurora animation: `will-change: opacity` only — no layout or geometry changes, GPU-composited
- `prefers-reduced-motion`: animation is cut entirely, static frame A displayed
- `backdrop-filter` is progressive enhancement — `oklch(0.14 0.018 220 / 0.40)` alone is legible
- All semantic content at z-index 1 above aurora background at z-index 0
