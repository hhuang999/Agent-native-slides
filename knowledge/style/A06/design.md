# A06 — deep-ocean

**Style ID:** A06  
**Family:** Dark Tech (A)  
**Scheme:** Dark  
**Mood:** serene · profound · data-driven · authoritative  
**Occasion:** data-science · environmental-tech · research-demo · sustainability-report  
**Academic Fit:** Medium

---

## Design Philosophy

Deep-ocean evokes the visual language of oceanographic data visualization: pressure-mapped blues shifting into near-black abyssal zones, with bioluminescent teal accents that appear to self-illuminate against the depths. Where neon-cyberpunk shouts, deep-ocean murmurs with authority. Fraunces — an optical serif with built-in warmth — gives headlines the weight of scientific publication without the cold neutrality of geometric sans; DM Mono handles every data label with instrument-panel clarity. The sine-wave background suggests signal processing and the rhythmic nature of ocean systems, while keeping the visual field calm enough for dense data layouts.

5D Evaluation:
- **Philosophy:** Depth through tonal compression. The surface-to-abyss color ramp (220° → 240° hue, 8% → 16% lightness for surfaces) creates a perceptual layering that cues content hierarchy before any typography is read. Accent teal (185°) mirrors the wavelength of bioluminescent marine light — familiar, not arbitrary.
- **Hierarchy:** Fraunces at 72px in weight 700 reads as peer-reviewed authority; its optical sizing means it looks proportionally correct across the 1920px stage without manual tracking adjustments. DM Mono at every data scale below 18px locks numbers into monospace columns even in non-table contexts.
- **Detail:** Sine-wave SVG bands scroll horizontally at different speeds (3 layers: slow/mid/fast), rendered as CSS `clip-path` animated polygons. Each band carries 8% opacity — they accumulate in overlap zones to ~24% without obscuring content. Reduced-motion collapses the animation to static bands at their time=0 position.
- **Function:** Designed for data-heavy slides: stat grids, time-series annotations, comparison tables, and methodology diagrams. The restrained palette (two-hue system) ensures chart tokens are perceived as data rather than decoration.
- **Innovation:** Wave bands use SVG `<path>` `d` attribute interpolation via CSS `@keyframes` on a custom property — the sinusoidal path equation is pre-computed at six keyframe positions, giving smooth continuous motion with zero JS in the background layer.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — abyssal ramp */
  --color-bg:             oklch(0.08 0.022 230);
  --color-surface:        oklch(0.12 0.020 232);
  --color-raised-surface: oklch(0.16 0.018 234);
  --color-border:         oklch(0.22 0.020 232);

  /* Type */
  --color-heading:        oklch(0.96 0.008 200);
  --color-body:           oklch(0.78 0.012 220);
  --color-muted:          oklch(0.52 0.016 230);

  /* Accent — Bioluminescent Teal */
  --color-accent:         oklch(0.76 0.18 188);
  --color-accent-dim:     oklch(0.56 0.14 188);
  --color-accent-glow:    oklch(0.76 0.18 188 / 0.14);
  --color-accent-light:   oklch(0.88 0.12 188);

  /* Secondary — Deep Indigo (depth cue) */
  --color-accent-2:       oklch(0.52 0.20 268);
  --color-accent-2-dim:   oklch(0.38 0.16 268);

  /* Semantic */
  --color-positive:       oklch(0.68 0.18 158);
  --color-negative:       oklch(0.62 0.22 25);
  --color-warn:           oklch(0.72 0.18 78);

  /* Chart tokens */
  --chart-c1: oklch(0.76 0.18 188);   /* teal */
  --chart-c2: oklch(0.52 0.20 268);   /* indigo */
  --chart-c3: oklch(0.68 0.18 158);   /* seafoam */
  --chart-c4: oklch(0.72 0.18 78);    /* amber */
  --chart-c5: oklch(0.62 0.22 25);    /* coral */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=DM+Sans:wght@400;500;600&family=DM+Mono:wght@400;500&display=swap');

:root {
  --type-display: 'Fraunces', Georgia, 'Slides CJK Serif', serif;        /* headlines — optical serif */
  --type-body:    'DM Sans', Arial, 'Slides CJK Sans', sans-serif;     /* body — clearer in data-dense layouts */
  --type-label:   'DM Mono', Consolas, 'Slides CJK Sans', monospace;    /* data, captions, code */
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 20px;
  line-height: 1.6;
}

/* Scale */
/* display = 3.6rem = 72px  (Fraunces 700, opsz 72) */
/* h1      = 2.6rem = 52px  (Fraunces 700, opsz 52) */
/* h2      = 1.9rem = 38px  (Fraunces 600, opsz 38) */
/* body    = 1.0rem = 20px  (DM Sans 400); generated decks use 28px+ */
/* caption = 0.75rem = 15px (DM Mono 400) */

/* Note: Fraunces supports font-optical-sizing: auto — enable on .deck-stage */
```

---

## Background Motion: wave-sine

Three SVG sine-wave bands scroll at different horizontal speeds, creating a sense of layered ocean-current flow. Pure CSS animation, no JS.

```css
.wave-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  overflow: hidden;
}

/* Each wave is an SVG path defined inline as background-image */
/* Use clip-path on a colored div, animating background-position */
.wave-band {
  position: absolute; left: -100%; width: 300%; height: 100%;
  opacity: 0.07;
}
.wave-band--far  { animation: wave-scroll 28s linear infinite; background: var(--color-accent); }
.wave-band--mid  { animation: wave-scroll 18s linear infinite; background: var(--color-accent); animation-delay: -6s; }
.wave-band--near { animation: wave-scroll 12s linear infinite; background: var(--color-accent); animation-delay: -3s; opacity: 0.05; }

@keyframes wave-scroll { from { transform: translateX(0); } to { transform: translateX(33.33%); } }

/* Each band uses clip-path to cut a sinusoidal silhouette */
.wave-band--far {
  clip-path: polygon(
    0% 62%, 5% 60%, 10% 56%, 15% 52%, 20% 50%, 25% 52%, 30% 56%, 35% 60%,
    40% 62%, 45% 60%, 50% 56%, 55% 52%, 60% 50%, 65% 52%, 70% 56%, 75% 60%,
    80% 62%, 85% 60%, 90% 56%, 95% 52%, 100% 50%, 100% 100%, 0% 100%
  );
}
.wave-band--mid {
  clip-path: polygon(
    0% 70%, 4% 67%, 8% 62%, 13% 58%, 18% 56%, 23% 58%, 28% 62%, 33% 67%,
    38% 70%, 43% 67%, 48% 62%, 53% 58%, 58% 56%, 63% 58%, 68% 62%, 73% 67%,
    78% 70%, 83% 67%, 88% 62%, 93% 58%, 98% 56%, 100% 56%, 100% 100%, 0% 100%
  );
}
.wave-band--near {
  clip-path: polygon(
    0% 78%, 6% 74%, 12% 68%, 18% 64%, 24% 62%, 30% 64%, 36% 68%, 42% 74%,
    48% 78%, 54% 74%, 60% 68%, 66% 64%, 72% 62%, 78% 64%, 84% 68%, 90% 74%,
    96% 78%, 100% 76%, 100% 100%, 0% 100%
  );
}

@media (prefers-reduced-motion: reduce) {
  .wave-band--far, .wave-band--mid, .wave-band--near { animation: none; }
}
```

---

## Slide Layout Templates

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [wave-sine bg — three translucent teal bands scrolling]│
│                                                         │
│  72px top padding                                       │
│  [CONTEXT TAG — DM Mono 12px, teal, tracked]           │
│  ── teal-to-transparent rule ───────────────────────── │
│  DISPLAY: Assertion (Fraunces 700, 72px, heading)      │
│  24px gap                                               │
│  Subtitle (DM Sans 400, 24px, muted)                   │
│  48px gap                                               │
│  Meta row (DM Mono 15px, muted) · dot separators       │
│  [bottom border rule]                                   │
└─────────────────────────────────────────────────────────┘
```

### Data Slide
```
┌─────────────────────────────────────────────────────────┐
│  [ Counter — DM Mono, teal ]                            │
│  Headline (Fraunces 700, 50px) — one assertion         │
│  ─ rule ─────────────────────────────────────────────── │
│  [ 3-col stat cards + body para (60%) ] │ [ aside 36%] │
│  Stats: DM Mono 40px, teal; labels: DM Mono 11px       │
└─────────────────────────────────────────────────────────┘
```

---

## Component Token Mapping

```css
/* Depth card — subtle surface lift */
.depth-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-top: 2px solid var(--color-accent-dim);
  border-radius: 6px; padding: 20px 22px;
}

/* Stat value */
.stat-value {
  font-family: var(--type-label); font-size: 44px; font-weight: 500;
  color: var(--color-accent-light); line-height: 1;
  font-variant-numeric: lining-nums tabular-nums;
}

/* Accent rule */
.accent-rule {
  width: 100%; height: 1px;
  background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-border) 55%, transparent 100%);
}

/* Depth tag */
.depth-tag {
  font-family: var(--type-label); font-size: 12px;
  color: var(--color-accent); letter-spacing: 0.12em; text-transform: uppercase;
  border: 1px solid var(--color-accent-dim);
  background: var(--color-accent-glow);
  padding: 3px 12px; border-radius: 3px; width: fit-content;
}
```

---

## Print / Export Mode

```css
@media print {
  .wave-bg { display: none; }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
  :root {
    --color-bg: oklch(0.09 0.012 230);
    --color-heading: oklch(0.97 0.006 200);
    --color-body: oklch(0.80 0.008 220);
  }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 13.8:1 ✓
- `--color-body` over `--color-bg` = 7.1:1 ✓
- `--color-accent` (bioluminescent teal) over `--color-bg` = 5.6:1 ✓ (large text / graphical)
- `--color-accent-light` over `--color-bg` = 8.4:1 ✓
- Wave animation respects `prefers-reduced-motion`
- Wave bands are purely decorative — all semantic content layers above at z-index 1

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | Fraunces | Georgia | Slides CJK Serif |
| Body | DM Sans | Arial | Slides CJK Sans |
| Auxiliary / data | DM Mono | Consolas | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.

**Adjustment:** Fraunces retains the oceanographic editorial headline; DM Sans improves paragraph legibility.
