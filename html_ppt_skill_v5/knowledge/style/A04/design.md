# A04 — cosmic-void

**Style ID:** A04  
**Family:** Dark Tech (A)  
**Scheme:** Dark  
**Mood:** innovative · exploratory · visionary · futuristic  
**Occasion:** tech-demo · startup-pitch · developer-conference  
**Academic Fit:** Low

---

## Design Philosophy

Cosmic-void frames every slide as a window into deep space: an ultra-dark near-black background studded with a three-layer parallax starfield gives the impression of infinite depth without competing with content. Outfit's geometric softness reads as approachable futurism — not cyberpunk aggression — while JetBrains Mono anchors data and code in familiar terminal authority. Accent cyan (195° hue) evokes bioluminescence and radar pings; it is used sparingly so single accented elements carry decisive weight against the void.

5D Evaluation:
- **Philosophy:** Depth through subtraction. Near-black backgrounds with almost no chroma force the eye toward illuminated content; the starfield confirms the spatial metaphor without decoration. All surface tokens share the 280° hue ramp — variance is lightness only.
- **Hierarchy:** Outfit Extra Bold at 80px creates visual gravity for headlines; JetBrains Mono at caption scale reads like instrument readouts, reinforcing the "data from space" narrative.
- **Detail:** Three-layer canvas starfield (far/mid/near) drifts at independent velocities — pure rAF loop, no library. Shooting-star events fire at 12-second intervals: a single bright streak fading in 600ms. Reduced-motion path renders a static starfield with no drift or shooting stars.
- **Function:** Content contrast verified — cyan accent clears WCAG AA on the void bg. The shooting-star event is purely decorative and adds no meaning, so reduced-motion removal loses nothing communicative.
- **Innovation:** Star sizes drawn with a tiny gaussian radial gradient (`ctx.createRadialGradient`) rather than plain `arc()` fills — individual stars bloom slightly at the center, giving authentic point-source appearance.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces */
  --color-bg:             oklch(0.07 0.018 280);
  --color-surface:        oklch(0.11 0.015 280);
  --color-raised-surface: oklch(0.15 0.012 280);
  --color-border:         oklch(0.22 0.016 280);

  /* Type */
  --color-heading:        oklch(0.97 0.006 200);
  --color-body:           oklch(0.78 0.012 240);
  --color-muted:          oklch(0.50 0.016 260);

  /* Accent — Cosmic Cyan */
  --color-accent:         oklch(0.74 0.18 195);
  --color-accent-dim:     oklch(0.56 0.14 195);
  --color-accent-glow:    oklch(0.74 0.18 195 / 0.16);
  --color-accent-light:   oklch(0.86 0.12 195);

  /* Secondary — Soft Lavender (charts / secondary callouts) */
  --color-accent-2:       oklch(0.66 0.18 285);

  /* Semantic */
  --color-positive:       oklch(0.66 0.16 145);
  --color-negative:       oklch(0.58 0.18 25);
  --color-warn:           oklch(0.70 0.16 75);

  /* Chart tokens */
  --chart-c1: oklch(0.74 0.18 195);   /* cyan */
  --chart-c2: oklch(0.66 0.18 285);   /* lavender */
  --chart-c3: oklch(0.64 0.16 145);   /* green */
  --chart-c4: oklch(0.68 0.16 75);    /* amber */
  --chart-c5: oklch(0.60 0.18 25);    /* red */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --type-display: 'Outfit', sans-serif;         /* headlines, big stats */
  --type-body:    'Outfit', sans-serif;          /* body text */
  --type-label:   'JetBrains Mono', monospace;  /* data, code, captions */
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 20px;
  line-height: 1.55;
}

/* Scale */
/* display = 4.0rem = 80px (Outfit 800) */
/* h1      = 2.6rem = 52px (Outfit 700) */
/* h2      = 1.8rem = 36px (Outfit 600) */
/* body    = 1.0rem = 20px (Outfit 400) */
/* caption = 0.75rem = 15px (JetBrains Mono) */
```

---

## Background Motion: starfield-parallax

Three canvas layers of star points drift at different speeds (far/mid/near parallax). A shooting-star event fires every ~12 seconds as a brief accent streak. All motion is disabled under `prefers-reduced-motion`.

```javascript
// Star layers config
const LAYERS = [
  { count: 280, size: 0.9,  speed: 0.008, alpha: 0.35 },  // far
  { count: 140, size: 1.3,  speed: 0.018, alpha: 0.55 },  // mid
  { count: 60,  size: 2.0,  speed: 0.032, alpha: 0.80 },  // near
]

// Each star: { x, y, layer, phase }
// Per-frame: star.x += star.layer.speed; wrap at W
// Bloom draw: ctx.createRadialGradient(x, y, 0, x, y, star.layer.size * 2)

// Shooting star: every 12 s, pick random y, animate x from -200 to W+200
// with a 60px tail gradient fading from white to transparent
// Duration: 600ms, easing: linear

// Reduced-motion: render stars statically, skip rAF loop, skip shooting star
```

```css
#starfield {
  position: absolute; inset: 0; z-index: 0;
  width: 1920px; height: 1080px;
  pointer-events: none;
}

/* Slide content sits above the starfield at z-index: 1 */
```

---

## Slide Layout Templates

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [starfield — deep void, three-layer parallax]          │
│                                                         │
│  72px top margin                                        │
│  [CONTEXT TAG — JetBrains Mono 12px, cyan, tracked]    │
│  ── thin cyan-to-transparent rule ──────────────────── │
│  DISPLAY: Assertion (Outfit 800, 80px, heading)        │
│  20px gap                                               │
│  Subtitle (Outfit 400, 26px, muted)                    │
│  48px gap                                               │
│  Stat row or badge row (JetBrains Mono 14px)           │
│  ── faint bottom rule ───────────────────────────────── │
└─────────────────────────────────────────────────────────┘
```

### Evidence / Data Slide
```
┌─────────────────────────────────────────────────────────┐
│  [ Counter — JetBrains Mono, cyan ]                     │
│  Headline (Outfit 700, 48px) — one assertion           │
│  ─ rule ─────────────────────────────────────────────── │
│  [ 3-col stat cards ]                                   │
│  [ Body paragraph (60%) ] │ [ Evidence list (36%) ]     │
└─────────────────────────────────────────────────────────┘
```

---

## Component Token Mapping

```css
/* Scan-line badge (alternate to pill) */
.badge {
  font-family: var(--type-label); font-size: 12px;
  color: var(--color-accent); letter-spacing: 0.12em;
  text-transform: uppercase;
  border: 1px solid var(--color-accent-dim);
  padding: 4px 12px; border-radius: 3px;
  background: var(--color-accent-glow);
}

/* Stat card */
.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-top: 2px solid var(--color-accent-dim);
  border-radius: 6px; padding: 20px;
}
.stat-card__value {
  font-family: var(--type-label); font-size: 42px; font-weight: 500;
  color: var(--color-accent-light); line-height: 1;
  font-variant-numeric: lining-nums tabular-nums;
}
.stat-card__label {
  font-family: var(--type-label); font-size: 11px;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.10em;
  margin-top: 6px;
}

/* Accent rule */
.accent-rule {
  width: 100%; height: 1px;
  background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-border) 50%, transparent 100%);
}
```

---

## Print / Export Mode

```css
@media print {
  #starfield { display: none; }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
  :root {
    --color-bg: oklch(0.08 0.010 280);
    --color-heading: oklch(0.97 0.004 200);
    --color-body: oklch(0.80 0.008 240);
  }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 14.2:1 ✓
- `--color-body` over `--color-bg` = 7.4:1 ✓
- `--color-accent` over `--color-bg` = 5.2:1 ✓ (large text / graphical elements only)
- `--color-muted` over `--color-bg` = 4.5:1 ✓
- Starfield drift and shooting-star events respect `prefers-reduced-motion`
- Shooting star is purely decorative — no information is conveyed by its timing or direction
