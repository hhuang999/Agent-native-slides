# A08 — dark-vaporwave

**Style ID:** A08  
**Family:** Dark Tech (A)  
**Scheme:** Dark  
**Mood:** nostalgic · dreamlike · surreal · retro-futuristic  
**Occasion:** music-release · creative-portfolio · brand-identity · cultural-event  
**Academic Fit:** None

---

## Design Philosophy

Dark-vaporwave remixes the aesthetic vocabulary of 1980s–90s computer graphics through a contemporary lens: sun-faded pastels over near-black, glitchy scan textures, and grid-perspective geometry. Where neon-cyberpunk is aggressive and sharp, vaporwave is melancholic and soft — gradients bleed into each other, text is set in display widths that feel like vintage signage, and every element seems slightly too nostalgic to be real. Silkscreen gives headlines the chunky pixel authority of CGA/EGA display fonts without actual pixelation, and Josefin Sans provides mid-weight body copy that reads like 90s desktop publishing.

5D Evaluation:
- **Philosophy:** Nostalgia through color. The palette takes pastel pink, lavender, and teal — colors bleached by imagined cathode decay — and stacks them over a near-black base whose chroma hints at a deep burgundy-violet, subtly different from the neutral blacks of other dark styles. Everything feels pre-faded, as if printed once and left in indirect sunlight.
- **Hierarchy:** Silkscreen at 72px is intentionally coarse — the pixel grid is part of the aesthetic. Body uses Josefin Sans at generous tracking (+0.04em) because the style budget is wide type with air between characters, not compressed information density.
- **Detail:** Background: a CSS `repeating-linear-gradient` horizon grid (converging perspective lines) at 6% opacity, combined with a diagonal `grain` texture achieved by layering two translucent `radial-gradient` patterns offset by 1px. The grain layer creates a faint halftone noise without JS or images.
- **Function:** Data slides are possible but subdued — the grid and pastel palette demand restraint. Use this style for one big visual statement per slide rather than dense charts. Stat values use the pink accent at large size; body tables are kept minimal.
- **Innovation:** The perspective grid is built from a single `repeating-linear-gradient` conic fan emanating from a vanishing point at the bottom-center of the slide — all lines converge mathematically, not hand-drawn. No SVG, no canvas.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — violet-tinted dark */
  --color-bg:             oklch(0.07 0.024 295);
  --color-surface:        oklch(0.11 0.020 295);
  --color-raised-surface: oklch(0.15 0.016 295);
  --color-border:         oklch(0.22 0.018 295);

  /* Type */
  --color-heading:        oklch(0.97 0.006 310);
  --color-body:           oklch(0.80 0.014 305);
  --color-muted:          oklch(0.52 0.016 300);

  /* Accent — Vaporwave Pink */
  --color-accent:         oklch(0.78 0.24 350);
  --color-accent-dim:     oklch(0.58 0.18 350);
  --color-accent-glow:    oklch(0.78 0.24 350 / 0.16);
  --color-accent-light:   oklch(0.90 0.14 350);

  /* Secondary — Lavender */
  --color-accent-2:       oklch(0.72 0.20 285);
  --color-accent-2-dim:   oklch(0.54 0.15 285);

  /* Tertiary — Vaporwave Teal */
  --color-accent-3:       oklch(0.74 0.18 192);

  /* Semantic */
  --color-positive:       oklch(0.70 0.20 162);
  --color-negative:       oklch(0.64 0.22 25);

  /* Chart tokens */
  --chart-c1: oklch(0.78 0.24 350);   /* pink */
  --chart-c2: oklch(0.72 0.20 285);   /* lavender */
  --chart-c3: oklch(0.74 0.18 192);   /* teal */
  --chart-c4: oklch(0.76 0.18 60);    /* peach-gold */
  --chart-c5: oklch(0.68 0.18 228);   /* sky */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=Josefin+Sans:wght@300;400;600&display=swap');

:root {
  --type-display: 'Silkscreen', monospace;       /* headlines — pixel grid aesthetic */
  --type-body:    'Josefin Sans', sans-serif;    /* body — tracked geometric */
  --type-label:   'Josefin Sans', sans-serif;   /* labels — smaller weight */
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 20px;
  line-height: 1.6;
  letter-spacing: 0.04em;
}

/* Note: Silkscreen is a bitmap-style font designed at small sizes;
   at 72px it renders as intentionally chunky pixel display type.
   Do not apply letter-spacing to Silkscreen — the pixel rhythm is
   designed to be tight. */

/* Scale */
/* display = 3.6rem = 72px  (Silkscreen 700) */
/* h1      = 2.4rem = 48px  (Silkscreen 700) */
/* h2      = 1.6rem = 32px  (Silkscreen 400) */
/* body    = 1.0rem = 20px  (Josefin Sans 400, +0.04em) */
/* caption = 0.75rem = 15px (Josefin Sans 300, +0.06em) */
```

---

## Background Motion: shader-grain + perspective grid

A static perspective-grid layer combined with a subtle grain texture — all CSS, no JS, no images.

```css
#vapor-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: var(--color-bg);
}

/* Perspective grid: conic gradient fan from bottom-center */
#vapor-bg::before {
  content: '';
  position: absolute; inset: 0;
  background:
    /* Horizontal grid lines — fade from horizon */
    repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 54px,
      oklch(0.78 0.24 350 / 0.06) 54px,
      oklch(0.78 0.24 350 / 0.06) 55px
    ),
    /* Perspective fan lines from bottom-center */
    repeating-conic-gradient(
      from -90deg at 50% 110%,
      transparent 0deg,
      transparent 7deg,
      oklch(0.72 0.20 285 / 0.05) 7deg,
      oklch(0.72 0.20 285 / 0.05) 7.5deg,
      transparent 7.5deg,
      transparent 14deg
    );
}

/* Grain overlay — layered offset radial dots */
#vapor-bg::after {
  content: '';
  position: absolute; inset: 0;
  background-image:
    radial-gradient(circle, oklch(0.90 0.10 310 / 0.04) 1px, transparent 1px),
    radial-gradient(circle, oklch(0.72 0.20 285 / 0.03) 1px, transparent 1px);
  background-size: 3px 3px, 5px 5px;
  background-position: 0 0, 1px 1px;
}

@media (prefers-reduced-motion: reduce) {
  /* Grid and grain are already static — no change needed */
}
```

---

## Slide Layout Templates

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [perspective grid + grain bg — violet-dark]            │
│                                                         │
│  [TAG — Josefin Sans 12px, pink, +0.14em]              │
│  ── pink gradient rule ────────────────────────────── │
│  DISPLAY: Headline (Silkscreen 700, 72px, heading)     │
│  Subtitle (Josefin Sans 300, 24px, muted, +0.04em)     │
│  Spacer                                                 │
│  Badge row (Josefin Sans, surface chips)               │
│  ── lavender bottom rule ──────────────────────────── │
└─────────────────────────────────────────────────────────┘
```

### Content Slide
```
┌─────────────────────────────────────────────────────────┐
│  [ Counter — Josefin Sans, lavender ]                   │
│  Headline (Silkscreen 700, 48px) — assertion           │
│  ─ pink rule ──────────────────────────────────────────  │
│  [ Main 60% — stat cards + body ] │ [ Aside 36% ]       │
│  Stat values: Josefin Sans 600, 44px, pink accent      │
└─────────────────────────────────────────────────────────┘
```

---

## Component Token Mapping

```css
/* Vapor card — pastel border + faint glow */
.vapor-card {
  background: var(--color-surface);
  border: 1px solid var(--color-accent-dim);
  border-radius: 4px; padding: 22px 20px;
  box-shadow: 0 0 0 1px var(--color-accent-dim),
              0 0 18px oklch(0.78 0.24 350 / 0.07);
}

/* Pink stat value */
.stat-value {
  font-family: var(--type-body); font-size: 44px; font-weight: 600;
  color: var(--color-accent-light); line-height: 1;
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: 0.04em;
}

/* Retro tag */
.retro-tag {
  font-family: var(--type-label); font-size: 12px;
  color: var(--color-accent); letter-spacing: 0.14em; text-transform: uppercase;
  border: 1px solid var(--color-accent-dim);
  background: var(--color-accent-glow);
  padding: 3px 12px; border-radius: 2px; width: fit-content;
}

/* Accent rule */
.accent-rule {
  width: 100%; height: 1px;
  background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-border) 55%, transparent 100%);
}
```

---

## Print / Export Mode

```css
@media print {
  #vapor-bg { display: none; }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
  :root {
    --color-bg: oklch(0.08 0.012 295);
    --color-heading: oklch(0.97 0.004 310);
    --color-body: oklch(0.80 0.008 305);
  }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 14.4:1 ✓
- `--color-body` over `--color-bg` = 7.3:1 ✓
- `--color-accent` (vaporwave pink) over `--color-bg` = 5.8:1 ✓ (large text / graphical elements)
- `--color-accent-light` over `--color-bg` = 9.2:1 ✓
- Grid and grain layers are purely decorative at z-index 0
- Silkscreen display font: only used at ≥48px where legibility is adequate for the style register; body text always uses Josefin Sans
