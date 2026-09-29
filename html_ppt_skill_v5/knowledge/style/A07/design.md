# A07 — holographic-iridescent

**Style ID:** A07  
**Family:** Dark Tech (A)  
**Scheme:** Dark  
**Mood:** futuristic · prismatic · premium · otherworldly  
**Occasion:** product-launch · brand-campaign · immersive-demo · fashion-tech  
**Academic Fit:** None

---

## Design Philosophy

Holographic-iridescent channels the visual language of diffraction gratings and thin-film optics: a near-black base with hue-shifting prismatic gradients that slide across the spectrum as the eye moves. Where neon-cyberpunk uses single-hue neon, holographic-iridescent uses the full visible spectrum compressed to a razor-thin interference band — suggesting depth, surface, and light simultaneously. Lexend Mega's ultra-wide geometric letterforms function as display canvases: the gradient is meant to live *inside* the letters as a background-clip fill, making each headline feel printed on foil. JetBrains Mono anchors data in terminal contrast against the shimmer.

5D Evaluation:
- **Philosophy:** Iridescence through hue rotation. The hero gradient sweeps 120° of hue in OKLCH (from 200° teal to 320° magenta), holding chroma near maximum and lightness at 70–80% — this is the perceptual "rainbow foil" band without the muddy desaturated transitions you get from RGB rainbows.
- **Hierarchy:** Lexend Mega at 88px creates visual shock proportional to the style's premium register. Headlines use `background-clip: text` with the prismatic gradient for the foil headline effect. Subheadings and body text stay in near-white to prevent compete with the headline shimmer.
- **Detail:** Background: a slow-rotating conic gradient (full 360° hue sweep at 8% opacity) over near-black creates subtle ambient iridescence. A second `@keyframes` rotates the gradient start point 360° over 12 seconds with `animation: holo-spin`. The scan-line layer from A05 is borrowed at even lower opacity (3%) for CRT texture depth.
- **Function:** WCAG AA is maintained by keeping iridescent fills to headlines only; body text uses `--color-body` which is near-white against near-black. Gradient text on interactive elements always has a solid-color fallback.
- **Innovation:** The prismatic gradient is defined in `oklch` space at fixed chroma 0.26 across the full hue range — this produces a perceptually uniform rainbow where each hue step has identical perceived brightness, eliminating the dark blue trough that ruins RGB rainbow gradients.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces */
  --color-bg:             oklch(0.06 0.018 260);
  --color-surface:        oklch(0.10 0.015 260);
  --color-raised-surface: oklch(0.14 0.012 260);
  --color-border:         oklch(0.20 0.018 260);

  /* Type */
  --color-heading:        oklch(0.97 0.004 260);
  --color-body:           oklch(0.80 0.010 240);
  --color-muted:          oklch(0.50 0.016 250);

  /* Prismatic gradient — foil headline fill */
  --gradient-prism: linear-gradient(
    135deg,
    oklch(0.78 0.26 200) 0%,
    oklch(0.78 0.26 240) 20%,
    oklch(0.78 0.26 280) 40%,
    oklch(0.78 0.26 310) 60%,
    oklch(0.78 0.26 330) 80%,
    oklch(0.78 0.26 200) 100%
  );

  /* Accent — Teal anchor (primary interactive) */
  --color-accent:         oklch(0.78 0.22 195);
  --color-accent-dim:     oklch(0.58 0.16 195);
  --color-accent-glow:    oklch(0.78 0.22 195 / 0.14);

  /* Secondary — Prismatic Magenta */
  --color-accent-2:       oklch(0.74 0.26 330);
  --color-accent-2-dim:   oklch(0.56 0.20 330);

  /* Semantic */
  --color-positive:       oklch(0.70 0.22 155);
  --color-negative:       oklch(0.62 0.24 25);
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=Lexend+Mega:wght@400;700;900&family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --type-display: 'Lexend Mega', sans-serif;      /* foil headlines */
  --type-body:    'Lexend Mega', sans-serif;       /* body — lower weight */
  --type-label:   'JetBrains Mono', monospace;    /* data, code, captions */
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 18px;
  line-height: 1.55;
}

/* Note: Lexend Mega has wide character advance — budget for it.
   At 88px the tracking should be -0.01em to avoid gaps. */

/* Scale */
/* display = 4.4rem = 88px  (Lexend Mega 900) */
/* h1      = 2.6rem = 52px  (Lexend Mega 700) */
/* h2      = 1.8rem = 36px  (Lexend Mega 400) */
/* body    = 1.0rem = 18px  (Lexend Mega 300/400) */
/* caption = 0.75rem = 14px (JetBrains Mono) */
```

---

## Background Motion: holo-spin

A slow-rotating conic gradient sweeps the full hue range at low opacity over the near-black surface, creating ambient prismatic iridescence.

```css
#holo-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: var(--color-bg);
}
#holo-bg::before {
  content: '';
  position: absolute; inset: -50%;
  width: 200%; height: 200%;
  background: conic-gradient(
    from 0deg at 50% 50%,
    oklch(0.78 0.26 200 / 0.08),
    oklch(0.78 0.26 240 / 0.06),
    oklch(0.78 0.26 280 / 0.08),
    oklch(0.78 0.26 310 / 0.06),
    oklch(0.78 0.26 330 / 0.08),
    oklch(0.78 0.26 360 / 0.06),
    oklch(0.78 0.26 200 / 0.08)
  );
  animation: holo-spin 12s linear infinite;
  transform-origin: center;
}
/* CRT texture overlay — scan lines at 3% */
#holo-bg::after {
  content: '';
  position: absolute; inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent 0px, transparent 2px,
    oklch(0.78 0.26 260 / 0.03) 2px, oklch(0.78 0.26 260 / 0.03) 4px
  );
  pointer-events: none;
}
@keyframes holo-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  #holo-bg::before { animation: none; }
}
```

---

## Foil Headline Technique

```css
/* Apply to any headline that should read as prismatic foil */
.foil-text {
  background: var(--gradient-prism);
  background-size: 200% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent; /* fallback */
}

/* Optional: animate the gradient sweep */
.foil-text--animated {
  animation: foil-sweep 4s linear infinite;
}
@keyframes foil-sweep {
  from { background-position: 0% 50%; }
  to   { background-position: 200% 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .foil-text--animated { animation: none; }
}
```

---

## Slide Layout Templates

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [holo-spin bg — slow-rotating prismatic conic + CRT]   │
│                                                         │
│  [TAG — JetBrains Mono, teal, tracked]                 │
│  ── prismatic rule (gradient border) ─────────────────  │
│  DISPLAY: Headline (Lexend Mega 900, 88px, foil fill)  │
│  Subtitle (Lexend Mega 400, 22px, muted)               │
│  Spacer                                                 │
│  Badge row (JetBrains Mono, surface cards)             │
└─────────────────────────────────────────────────────────┘
```

### Content Slide
```
┌─────────────────────────────────────────────────────────┐
│  [ Counter — JetBrains Mono, teal ]                     │
│  Headline (Lexend Mega 700, 50px, foil fill)           │
│  ─ prismatic rule ─────────────────────────────────────  │
│  [ Iridescent cards 3-col ] + [ Evidence aside 36% ]    │
│  Cards: prismatic top-border, glow on hover/accent      │
└─────────────────────────────────────────────────────────┘
```

---

## Component Token Mapping

```css
/* Prismatic rule — replaces plain accent rule */
.prism-rule {
  width: 100%; height: 1px;
  background: var(--gradient-prism);
  opacity: 0.60;
}

/* Iridescent card */
.iris-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px; padding: 24px;
  position: relative; overflow: hidden;
}
.iris-card::before {
  content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  background: var(--gradient-prism);
}

/* Foil stat value */
.foil-stat {
  font-family: var(--type-label); font-size: 48px; font-weight: 500;
  background: var(--gradient-prism);
  background-size: 200% 100%;
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent; color: transparent;
  font-variant-numeric: lining-nums tabular-nums;
}
```

---

## Print / Export Mode

```css
@media print {
  #holo-bg::before, #holo-bg::after { display: none; }
  .foil-text, .foil-stat {
    -webkit-text-fill-color: var(--color-heading);
    color: var(--color-heading);
    background: none;
  }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; }
  :root {
    --color-bg: oklch(0.08 0.010 260);
    --color-heading: oklch(0.97 0.004 260);
  }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 14.8:1 ✓
- `--color-body` over `--color-bg` = 7.0:1 ✓
- Foil headline text: decorative gradient; meaning conveyed by text not gradient — acceptable when used on display-size text only (≥48px)
- All body text uses solid `--color-body` — no gradient text below 36px
- `holo-spin` animation respects `prefers-reduced-motion`
- Glow and prismatic borders are decorative — state always paired with text or icon label
