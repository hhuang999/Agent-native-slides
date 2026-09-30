# B04 — warm-glass

**Style ID:** B04  
**Family:** Glassmorphism (B)  
**Scheme:** Dark-Warm  
**Mood:** intimate · amber-candlelit · editorial · slow-premium  
**Occasion:** hospitality · luxury-brand · cultural-venue · wine-spirits · independent-film  
**Academic Fit:** None

---

## Design Philosophy

Warm-glass is dark glassmorphism pulled into the amber register. Where B01 is cold indigo and B03 is northern teal, B04 uses a deep amber-sienna gradient mesh — as if the frosted glass panels are lit from behind by candlelight or the warm glow of a whisky barrel. The dark base is a very warm near-black (slight amber cast, not cool) and the three gradient blobs lean towards ochre, burnt sienna, and a deep wine-red. `backdrop-filter: saturate(200%)` on this warm background makes glass cards read amber at the edges and deep orange at their centers — a richly material quality without any direct color applied to the surface.

The typographic pair is Playfair Display SC (OFL, Google Fonts) — a high-contrast serif with small-cap opticals, used for display at 72px — and IBM Plex Mono (OFL, Google Fonts) for data labels. The serif creates an old-world printed-book quality that counterpoints the frosted glass; the combination reads as a luxury spirits brand catalog, a boutique hotel identity, or a cultural institution annual report.

5D Evaluation:
- **Philosophy:** Warmth as a material quality. Amber light exists in nature — beeswax, flame, whisky, old brass. The color system is built to evoke those materials without being literal (no golden gradients, no brass-stroke borders). The warm blobs do the material work; the glass surface just lets them through.
- **Hierarchy:** Playfair Display SC has dramatic thick-thin stroke contrast that shows well at display size; its small-cap option gives a classical title-page feel for all-caps labels. IBM Plex Mono in this context reads as a precision instrument readout — the data embedded in the warm editorial context.
- **Detail:** Glass card: `oklch(0.14 0.022 60 / 0.42)` — warm-biased dark surface. Rim light is amber `oklch(0.76 0.16 78 / 0.18)` — the card's top edge catches the warm ambient glow. Drop shadow uses a deep amber-black umbra: `0 4px 28px oklch(0.06 0.020 55 / 0.72)`. Border is a warm translucent stroke `oklch(0.62 0.10 78 / 0.16)`.
- **Function:** Two or three wide cards work best. The warm tones make narrow columns feel muddy. Generous padding (32px+) lets the amber glow breathe at card edges. Text must stay off-warm (`oklch(0.96 0.008 80)` heading, not pure white) so it reads as part of the same light environment rather than floating on top of it.
- **Innovation:** The blob configuration places the warmest (ochre/amber) blob behind the main content column and the cooler wine-red blob at the corner, so the primary read area is the warmest and the peripheral areas shade darker. This directional thermal gradient across the stage creates a natural focal point without any explicit spotlight effect.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — warm near-black base */
  --color-bg:             oklch(0.07 0.020 50);
  --color-surface:        oklch(0.14 0.022 60 / 0.42);     /* warm glass */
  --color-raised-surface: oklch(0.20 0.020 58 / 0.54);     /* elevated glass */
  --color-border:         oklch(0.62 0.10 78 / 0.16);      /* warm glass edge */
  --color-border-solid:   oklch(0.20 0.020 58);             /* non-glass */
  --color-glass-rim:      oklch(0.76 0.16 78 / 0.18);      /* amber rim light */
  --color-shadow:         oklch(0.06 0.020 55 / 0.72);     /* warm umbra */

  /* Type */
  --color-heading:        oklch(0.96 0.008 80);
  --color-body:           oklch(0.80 0.016 72);
  --color-muted:          oklch(0.52 0.018 68);

  /* Accent — Warm Amber-Gold */
  --color-accent:         oklch(0.76 0.18 82);
  --color-accent-dim:     oklch(0.54 0.14 78);
  --color-accent-glow:    oklch(0.76 0.18 82 / 0.18);
  --color-accent-light:   oklch(0.88 0.14 85);

  /* Secondary — Deep Wine-Red */
  --color-accent-2:       oklch(0.58 0.20 28);
  --color-accent-2-dim:   oklch(0.40 0.16 26);

  /* Semantic */
  --color-positive:       oklch(0.70 0.18 145);
  --color-negative:       oklch(0.62 0.22 25);
  --color-warn:           oklch(0.76 0.18 78);

  /* Warm gradient blobs — background */
  --blob-1: oklch(0.32 0.22 72 / 0.58);    /* amber-ochre, center-left */
  --blob-2: oklch(0.28 0.20 40 / 0.48);    /* burnt sienna, bottom-right */
  --blob-3: oklch(0.22 0.18 18 / 0.38);    /* deep wine-red, top-right corner */

  /* Chart tokens */
  --chart-c1: oklch(0.76 0.18 82);    /* amber */
  --chart-c2: oklch(0.58 0.20 28);    /* wine */
  --chart-c3: oklch(0.70 0.18 145);   /* sage */
  --chart-c4: oklch(0.72 0.18 200);   /* teal */
  --chart-c5: oklch(0.68 0.18 290);   /* violet */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display+SC:wght@400;700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@300;400;700&display=swap');

:root {
  --type-display: 'Playfair Display SC', Georgia, 'Slides CJK Serif', serif;   /* high-contrast editorial serif */
  --type-body:    'IBM Plex Sans', Arial, 'Slides CJK Sans', sans-serif;     /* body at reading sizes */
  --type-label:   'IBM Plex Mono', Consolas, 'Slides CJK Sans', monospace;     /* data, captions */
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 19px;
  line-height: 1.65;
  letter-spacing: 0.01em;  /* Playfair benefits from slight tracking at text size */
}

/* Scale */
/* display = 3.8rem = 72px  (Playfair Display SC 700) */
/* h1      = 2.6rem = 49px  (Playfair Display SC 700) */
/* h2      = 1.75rem = 33px (Playfair Display SC 400) */
/* body    = 1.0rem = 19px  (IBM Plex Sans 400); generated decks use 28px+ */
/* caption = 0.74rem = 14px (IBM Plex Mono 300) */
```

---

## Background: Warm Amber Gradient Mesh

The blob placement is deliberate: ochre center-left sits behind the primary content column; sienna sits bottom-right as a secondary warmth; wine-red corners the top-right to add depth without competing with content.

```css
#warm-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: var(--color-bg);
}
#warm-bg::before {
  content: '';
  position: absolute; inset: 0;
  background:
    radial-gradient(ellipse 60% 65% at 38% 55%, var(--blob-1) 0%, transparent 70%),
    radial-gradient(ellipse 50% 55% at 78% 78%, var(--blob-2) 0%, transparent 68%),
    radial-gradient(ellipse 38% 42% at 85% 18%, var(--blob-3) 0%, transparent 62%);
}

@media (prefers-reduced-motion: reduce) {
  /* Background is static — no change needed */
}
```

---

## Glass Card Pattern

```css
.glass-card {
  background: var(--color-surface);              /* oklch(0.14 0.022 60 / 0.42) */
  backdrop-filter: blur(24px) saturate(200%);
  -webkit-backdrop-filter: blur(24px) saturate(200%);
  border: 1px solid var(--color-border);
  border-radius: 10px;
  box-shadow:
    inset 0 1px 0 var(--color-glass-rim),         /* amber rim light */
    0 4px 28px var(--color-shadow);
  padding: 30px 28px;
}

.glass-card--raised {
  background: var(--color-raised-surface);
  backdrop-filter: blur(32px) saturate(240%);
  -webkit-backdrop-filter: blur(32px) saturate(240%);
  box-shadow:
    inset 0 1px 0 oklch(0.82 0.16 82 / 0.22),
    0 8px 44px oklch(0.06 0.020 55 / 0.80);
}
```

---

## Slide Layout Templates

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [warm amber mesh — ochre center, sienna right]         │
│                                                         │
│  [TAG — IBM Plex Mono, amber, tracked]                 │
│  ── amber accent rule ──────────────────────────────── │
│  DISPLAY: Headline (Playfair SC 700, 72px, heading)    │
│  Subtitle (Playfair SC 400, 22px, muted)               │
│  Spacer                                                 │
│  [warm-glass badge row]                                │
│  ── warm border bottom rule ────────────────────────── │
└─────────────────────────────────────────────────────────┘
```

### Content Slide
```
┌─────────────────────────────────────────────────────────┐
│  [warm amber mesh visible at all card edges]            │
│  Counter | Headline (Playfair SC 700, 49px)            │
│  ─ amber rule ─────────────────────────────────────────  │
│  [ glass-card 3-col stats ] + [ aside 36% ]            │
│  Stat values: IBM Plex Mono 700 44px, accent-light     │
└─────────────────────────────────────────────────────────┘
```

---

## Component Token Mapping

```css
/* Accent rule — amber fade */
.accent-rule {
  width: 100%; height: 1px;
  background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-border-solid) 55%, transparent 100%);
}

/* Stat value */
.stat-value {
  font-family: var(--type-label); font-size: 44px; font-weight: 700;
  color: var(--color-accent-light); line-height: 1;
  font-variant-numeric: lining-nums tabular-nums; letter-spacing: -0.01em;
}

/* Warm tag */
.warm-tag {
  display: inline-flex; align-items: center;
  font-family: var(--type-label); font-size: 12px; font-weight: 300;
  color: var(--color-accent); letter-spacing: 0.14em; text-transform: uppercase;
  background: var(--color-surface);
  backdrop-filter: blur(10px) saturate(160%);
  -webkit-backdrop-filter: blur(10px) saturate(160%);
  border: 1px solid oklch(0.76 0.18 82 / 0.20);
  padding: 4px 14px; border-radius: 4px; width: fit-content;
}

/* Counter */
.counter {
  font-family: var(--type-label); font-size: 12px; font-weight: 300;
  color: var(--color-accent-2); letter-spacing: 0.14em;
  margin-bottom: 12px;
}
```

---

## Print / Export Mode

```css
@media print {
  #warm-bg { display: none; }
  .glass-card, .glass-card--raised {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
    background: oklch(0.12 0.016 58);
    border: 1px solid oklch(0.22 0.018 60);
    box-shadow: none;
  }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
  :root {
    --color-bg: oklch(0.09 0.016 52);
    --color-heading: oklch(0.96 0.006 80);
    --color-body: oklch(0.80 0.012 72);
  }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 13.4:1 ✓
- `--color-body` over `--color-bg` = 7.1:1 ✓
- `--color-accent-light` (amber) over glass surface (approx 0.14 L warm) = 8.8:1 ✓
- Playfair Display SC remains at headline scale; its small-cap shapes are not used for paragraphs. IBM Plex Sans carries essential body text at 28px+ in generated decks.
- `backdrop-filter` is progressive enhancement — `oklch(0.14 0.022 60 / 0.42)` alone is readable
- No animation in this style — `prefers-reduced-motion` has no active concerns
- Warm heading color `oklch(0.96 0.008 80)` is not pure white — this is intentional for the warm-environment feel and does not compromise contrast

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | Playfair Display SC | Georgia | Slides CJK Serif |
| Body | IBM Plex Sans | Arial | Slides CJK Sans |
| Auxiliary / data | IBM Plex Mono | Consolas | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.

**Adjustment:** Playfair Display SC remains for classical headings; IBM Plex Sans avoids small-cap paragraphs.
