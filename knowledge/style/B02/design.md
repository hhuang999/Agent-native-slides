# B02 — light-glassmorphism

**Style ID:** B02  
**Family:** Glassmorphism (B)  
**Scheme:** Light  
**Mood:** airy · luminous · soft-premium · approachable  
**Occasion:** consumer-product · wellness · fintech · lifestyle-brand · creative-agency  
**Academic Fit:** None

---

## Design Philosophy

Light-glassmorphism flips the dark variant's depth logic: instead of frosted panels catching color from dark gradient blobs below, here semi-transparent white cards sit above a pastel gradient wash — peach warm to sky cool — letting those soft background hues glow through the glass surface as a diffused warmth. The effect is spa-light rather than sci-fi: premium and tactile without being aggressive. Headlines stay in deep charcoal (not pure black) and the body type uses a slightly warm near-black, which prevents the stark contrast that makes light UIs feel clinical.

5D Evaluation:
- **Philosophy:** Warmth through diffused ambient color. The background gradient is never loud — it is a soft pastel aurora moving from warm peach at one corner to cool sky at another, with an ivory-white core in the center. Glass panels above it inherit just enough color at their edges to feel sun-warmed, not bleached.
- **Hierarchy:** DM Sans gives clean legibility at all weights; its wide apertures and generous x-height make it friendly without being decorative. Instrument Serif (a transitional-modern serif from Rodrigo Fuenzalida, OFL) provides a sharp contrast for display headlines — the sudden serif in an otherwise sans-serif field signals premium editorial in one typographic move.
- **Detail:** Glass card: `background: oklch(0.98 0.005 80 / 0.68)` + `backdrop-filter: blur(20px) saturate(140%)` + `border: 1px solid oklch(0.90 0.012 80 / 0.55)` + `box-shadow: 0 1px 0 oklch(1.0 0 0 / 0.90) inset` (top-edge catch light — white, not colored, because the light source is ambient/overhead on a light background). A drop shadow uses a warm-tinted umbra: `0 4px 20px oklch(0.70 0.08 60 / 0.12)`.
- **Function:** Best for 2–4 glass cards with breathing room between them. The background gradient must be partially visible around card edges. This style cannot support dense paragraph blocks in the glass surface — use it for bold stat values, short executive summaries, and generous whitespace layouts.
- **Innovation:** The glass `saturate(140%)` on a pastel background produces a subtle color-shift inside the card: near the warm blob corner the card reads faintly peach, near the cool blob it reads faintly sky. This passive chromatic gradient within the glass surface requires no direct color on the card itself — it emerges entirely from the background interaction.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — warm ivory base */
  --color-bg:             oklch(0.98 0.010 80);
  --color-surface:        oklch(0.98 0.005 80 / 0.68);    /* glass */
  --color-raised-surface: oklch(1.00 0.000 80 / 0.82);    /* elevated glass */
  --color-border:         oklch(0.90 0.012 80 / 0.55);    /* glass edge */
  --color-border-solid:   oklch(0.88 0.012 80);            /* non-glass */
  --color-glass-top:      oklch(1.00 0.000 0 / 0.90);     /* top rim catch-light */
  --color-shadow:         oklch(0.70 0.08 60 / 0.12);     /* warm drop shadow */

  /* Type */
  --color-heading:        oklch(0.18 0.014 280);
  --color-body:           oklch(0.32 0.010 260);
  --color-muted:          oklch(0.56 0.010 260);

  /* Accent — Warm Amber */
  --color-accent:         oklch(0.62 0.18 60);
  --color-accent-dim:     oklch(0.82 0.10 70);
  --color-accent-glow:    oklch(0.62 0.18 60 / 0.14);
  --color-accent-light:   oklch(0.50 0.18 58);             /* darker on light bg */

  /* Secondary — Sky Blue */
  --color-accent-2:       oklch(0.60 0.16 230);
  --color-accent-2-dim:   oklch(0.80 0.10 230);

  /* Semantic */
  --color-positive:       oklch(0.44 0.18 148);
  --color-negative:       oklch(0.50 0.22 25);
  --color-warn:           oklch(0.56 0.18 60);

  /* Ambient gradient blobs — background only */
  --blob-warm: oklch(0.92 0.08 50 / 0.80);    /* peach, top-right */
  --blob-cool: oklch(0.90 0.06 220 / 0.70);   /* sky, bottom-left */
  --blob-rose: oklch(0.93 0.06 0 / 0.50);     /* rose, bottom-right */

  /* Chart tokens */
  --chart-c1: oklch(0.62 0.18 60);    /* amber */
  --chart-c2: oklch(0.60 0.16 230);   /* sky */
  --chart-c3: oklch(0.56 0.18 148);   /* green */
  --chart-c4: oklch(0.58 0.18 0);     /* rose */
  --chart-c5: oklch(0.54 0.16 285);   /* violet */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap');

:root {
  --type-display: 'Instrument Serif', Georgia, 'Slides CJK Serif', serif;     /* editorial display headlines */
  --type-body:    'DM Sans', Arial, 'Slides CJK Sans', sans-serif;         /* body — friendly sans */
  --type-label:   'DM Sans', Arial, 'Slides CJK Sans', sans-serif;         /* labels, captions */
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 20px;
  line-height: 1.62;
  letter-spacing: -0.01em;
}

/* Scale */
/* display = 3.8rem = 76px  (Instrument Serif, normal or italic) */
/* h1      = 2.5rem = 50px  (Instrument Serif) */
/* h2      = 1.7rem = 34px  (DM Sans 600) */
/* body    = 1.0rem = 20px  (DM Sans 400) */
/* caption = 0.75rem = 15px (DM Sans 300) */
```

---

## Background: Pastel Aurora Mesh

```css
#glass-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: var(--color-bg);
}
#glass-bg::before {
  content: '';
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 55% 58% at 85% 10%, var(--blob-warm) 0%, transparent 70%),
    radial-gradient(ellipse 48% 54% at 12% 90%, var(--blob-cool) 0%, transparent 70%),
    radial-gradient(ellipse 36% 40% at 80% 85%, var(--blob-rose) 0%, transparent 65%);
}

@media (prefers-reduced-motion: reduce) {
  /* Background is static — no change needed */
}
```

---

## Glass Card Pattern

```css
.glass-card {
  background: var(--color-surface);              /* oklch(0.98 0.005 80 / 0.68) */
  backdrop-filter: blur(20px) saturate(140%);
  -webkit-backdrop-filter: blur(20px) saturate(140%);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  box-shadow:
    inset 0 1px 0 var(--color-glass-top),        /* top-edge catch light */
    0 4px 20px var(--color-shadow);
  padding: 28px 26px;
}

.glass-card--raised {
  background: var(--color-raised-surface);
  backdrop-filter: blur(28px) saturate(160%);
  -webkit-backdrop-filter: blur(28px) saturate(160%);
  box-shadow:
    inset 0 1px 0 oklch(1.0 0 0 / 1.0),
    0 6px 32px oklch(0.70 0.08 60 / 0.16);
}
```

---

## Slide Layout Templates

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [pastel aurora bg — peach top-right, sky bottom-left]  │
│                                                         │
│  [TAG — DM Sans 12px, amber, tracked]                  │
│  ── warm amber rule ────────────────────────────────── │
│  DISPLAY: Headline (Instrument Serif, 76px, heading)   │
│  Subtitle (DM Sans 400, 22px, muted)                   │
│  Spacer                                                 │
│  [glass badge row — DM Sans]                           │
│  ── muted bottom rule ──────────────────────────────── │
└─────────────────────────────────────────────────────────┘
```

### Content Slide
```
┌─────────────────────────────────────────────────────────┐
│  [pastel aurora bg — partly visible around cards]       │
│  Counter | Headline (Instrument Serif, 50px)           │
│  ─ amber rule ─────────────────────────────────────────  │
│  [ glass-card 3-col stats ] + [ aside 36% ]            │
│  Stat values: DM Sans 600 44px, accent-light           │
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

/* Stat value */
.stat-value {
  font-family: var(--type-body); font-size: 44px; font-weight: 600;
  color: var(--color-accent-light); line-height: 1;
  font-variant-numeric: lining-nums tabular-nums; letter-spacing: -0.02em;
}

/* Light tag */
.light-tag {
  display: inline-flex; align-items: center;
  font-family: var(--type-label); font-size: 12px; font-weight: 500;
  color: var(--color-accent-light); letter-spacing: 0.10em; text-transform: uppercase;
  background: var(--color-surface);
  backdrop-filter: blur(10px) saturate(120%);
  -webkit-backdrop-filter: blur(10px) saturate(120%);
  border: 1px solid var(--color-border);
  padding: 4px 14px; border-radius: 6px; width: fit-content;
}

/* Counter */
.counter {
  font-family: var(--type-label); font-size: 12px; font-weight: 500;
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
    background: oklch(0.97 0.006 80);
    border: 1px solid oklch(0.88 0.010 80);
    box-shadow: none;
  }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
  :root {
    --color-bg: oklch(1.0 0 0);
    --color-heading: oklch(0.15 0.012 280);
    --color-body: oklch(0.30 0.008 260);
  }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 16.2:1 ✓
- `--color-body` over `--color-bg` = 10.8:1 ✓
- `--color-accent-light` (amber dark) over `--color-bg` = 5.1:1 ✓ (large text / graphical)
- `--color-accent-2` (sky blue dark) over `--color-bg` = 4.8:1 ✓ (large text)
- Stat values at 44px satisfy large-text 3:1 threshold; accent-light at that scale = 5.1:1 ✓
- Glass cards must never put light muted text over glass; use `--color-body` or `--color-heading`
- `backdrop-filter` is progressive enhancement — semi-transparent background color alone is still readable
- No animation — `prefers-reduced-motion` has no active concerns

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | Instrument Serif | Georgia | Slides CJK Serif |
| Body | DM Sans | Arial | Slides CJK Sans |
| Auxiliary / data | DM Sans | Arial | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.
