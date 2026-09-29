# C01 — film-noir

**Style ID:** C01  
**Family:** Cinematic (C)  
**Scheme:** Dark-Warm  
**Mood:** investigative · high-contrast · dramatic · archival · authoritative  
**Occasion:** legal · financial-investigation · journalism · insurance · forensics · security-research  
**Academic Fit:** Low (too theatrical for academic content)

---

## Design Philosophy

Film-noir takes its cues from the visual grammar of 1940s crime cinema and contemporary documentary journalism: dense shadow, cream-on-near-black type, a single hard-cut accent, and a surface that feels like it was printed rather than rendered. The background is a warm near-black — more dark charcoal-brown than cold dark grey — with a grain overlay that adds micro-texture visible at large display sizes but invisible at small type. A strong vignette deepens the corners, creating a natural focal center without any explicit spotlight.

This is a zero-glassmorphism style. Surfaces are opaque, borders are sharp, and depth is communicated entirely through value contrast — as it is in film. The accent color is a deep cinematic crimson, used sparingly: rule lines, stat callouts, highlighted table rows, and one typographic moment per slide. Everything else is restricted to the warm near-black / cream / mid-warm-grey triplet.

5D Evaluation:
- **Philosophy:** Print materiality in a screen context. Film noir's visual language is ultimately about information under pressure — headlines that read as verdicts, data that reads as evidence. The layout borrows from newspaper front pages and legal brief covers: dense, ruled, no decorative elements.
- **Hierarchy:** Bebas Neue (OFL, Google Fonts) at large sizes — all-caps, condensed, zero-letterspacing — reads as a broadsheet headline or documentary title card. IBM Plex Mono (OFL) gives the body and label type a typewriter-report quality; its tabular alignment at data sizes is excellent. The Bebas/Mono contrast is severe enough to feel stylistically deliberate, not accidental.
- **Detail:** No card backgrounds — content lives directly on the stage, separated by ruled lines and value contrast. Key stats are set in Bebas Neue at 80–88px, then capped with a thin crimson overline and labeled in IBM Plex Mono 300 at 11px in all-caps. Columns are separated by 1px `oklch(0.28 0.018 50)` vertical rules. The grain layer is a 200×200 SVG-based noise pattern at 4% opacity, tiled over the full stage — it appears as film grain but never muddies the text.
- **Function:** Strong for evidence-forward decks where credibility and gravity matter more than warmth. Works well for slides with one large typographic fact and supporting context, or for tabular comparison where the ruled-grid layout mirrors a financial statement.
- **Innovation:** The grain texture is achieved with an inline SVG `<feTurbulence>` filter as a CSS `mask` background-image, not a raster file dependency. The vignette is a `radial-gradient` from transparent center to `oklch(0.02 0.010 40 / 0.75)` at the corners, layered above the grain. Both are zero-weight and render-only.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — warm near-black (charcoal-brown base) */
  --color-bg:             oklch(0.10 0.016 50);
  --color-surface:        oklch(0.14 0.014 48);         /* card panels */
  --color-raised-surface: oklch(0.18 0.014 48);         /* elevated panels */
  --color-border:         oklch(0.28 0.018 50);         /* ruled lines */
  --color-border-light:   oklch(0.22 0.014 48);         /* subtle dividers */
  --color-shadow:         oklch(0.04 0.010 45 / 0.80);  /* deep shadow */

  /* Type */
  --color-heading:        oklch(0.96 0.010 80);         /* cream */
  --color-body:           oklch(0.82 0.012 75);         /* warm light grey */
  --color-muted:          oklch(0.54 0.014 68);         /* mid warm grey */
  --color-dim:            oklch(0.38 0.012 62);         /* faint ruled text */

  /* Accent — Cinematic Crimson */
  --color-accent:         oklch(0.52 0.24 22);
  --color-accent-dim:     oklch(0.36 0.18 22);
  --color-accent-glow:    oklch(0.52 0.24 22 / 0.20);
  --color-accent-light:   oklch(0.72 0.18 24);          /* lighter crimson for data */

  /* Semantic */
  --color-positive:       oklch(0.70 0.18 145);
  --color-negative:       oklch(0.62 0.22 22);
  --color-warn:           oklch(0.74 0.18 78);

  /* Grain + vignette overlay (applied via pseudo-element) */
  --vignette: radial-gradient(ellipse 80% 80% at 50% 50%, transparent 30%, oklch(0.02 0.010 40 / 0.75) 100%);
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;700&display=swap');

:root {
  --type-display: 'Bebas Neue', sans-serif;       /* condensed display — film titles, stats */
  --type-body:    'IBM Plex Mono', monospace;     /* all body, labels, captions */
  --type-label:   'IBM Plex Mono', monospace;     /* same — single-typeface body/label pair */
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 18px;
  line-height: 1.68;
  letter-spacing: 0.01em;
}

/* Scale */
/* display = 5rem = 88-96px  (Bebas Neue — stats, hero numbers) */
/* h1      = 3.5rem = 63px   (Bebas Neue — slide headline) */
/* h2      = 1.9rem = 34px   (IBM Plex Mono 700 — section label) */
/* body    = 1.0rem = 18px   (IBM Plex Mono 400) */
/* caption = 0.72rem = 13px  (IBM Plex Mono 300) */
```

---

## Background: Film Grain + Vignette

```css
#noir-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: var(--color-bg);
}

/* Grain — inline SVG turbulence, zero external dependency */
#noir-bg::before {
  content: '';
  position: absolute; inset: 0;
  opacity: 0.04;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.72' numOctaves='4' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23grain)'/%3E%3C/svg%3E");
  background-size: 200px 200px;
  background-repeat: repeat;
}

/* Vignette */
#noir-bg::after {
  content: '';
  position: absolute; inset: 0;
  background: var(--vignette);
}

@media (prefers-reduced-motion: reduce) {
  /* Static — no change needed */
}
```

---

## Layout Patterns

Unlike glassmorphism, film-noir uses direct-on-stage layout with ruled separators rather than card containers.

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [warm near-black + grain + vignette]                   │
│                                                         │
│  ████ FIRM NAME · CATEGORY — IBM Plex Mono 300, muted   │
│  ── 2px crimson rule ────────────────────────────────── │
│  HEADLINE IN BEBAS NEUE 63px, heading cream             │
│  body sub (IBM Plex Mono 400, 22px, muted)              │
│  Spacer                                                 │
│  [tag row — opaque surface panels]                     │
│  ── 1px border rule ────────────────────────────────── │
│  DATE / MATTER — IBM Plex Mono 300, dim                │
└─────────────────────────────────────────────────────────┘
```

### Evidence Slide (Stats)
```
┌─────────────────────────────────────────────────────────┐
│  MATTER NO. XX / SECTION TITLE — counters              │
│  ── accent rule ────────────────────────────────────── │
│  [ col 1: large Bebas stat ] | [ col 2 ] | [ col 3 ]   │
│  ── 1px vertical rules between columns ─────────────── │
│  Supporting text block (IBM Plex Mono 400, 18px)        │
│  ── horizontal rule ─────────────────────────────────── │
│  Aside text strip (IBM Plex Mono 300, 13px, muted)      │
└─────────────────────────────────────────────────────────┘
```

---

## Component Tokens

```css
/* Crimson overline rule */
.accent-rule {
  width: 100%; height: 2px;
  background: var(--color-accent);
}

/* Thin separator */
.sep-rule {
  width: 100%; height: 1px;
  background: var(--color-border);
}

/* Stat callout — Bebas + overline + label */
.stat-block__overline {
  width: 48px; height: 2px; background: var(--color-accent);
  margin-bottom: 8px;
}
.stat-block__value {
  font-family: var(--type-display); font-size: 88px;
  color: var(--color-heading); line-height: 0.9; letter-spacing: 0.01em;
}
.stat-block__label {
  font-family: var(--type-label); font-size: 11px; font-weight: 300;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.14em;
  margin-top: 10px; line-height: 1.5;
}

/* Eyebrow / counter */
.eyebrow {
  font-family: var(--type-label); font-size: 11px; font-weight: 300;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.14em;
}

/* Tag panel — opaque (no glass) */
.noir-tag {
  display: inline-flex; align-items: center;
  font-family: var(--type-label); font-size: 12px; font-weight: 300;
  color: var(--color-body); letter-spacing: 0.10em; text-transform: uppercase;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 5px 16px; border-radius: 2px;
}
```

---

## Print / Export Mode

```css
@media print {
  #noir-bg { display: none; }
  :root {
    --color-bg: oklch(1.0 0 0);
    --color-heading: oklch(0.08 0.010 50);
    --color-body: oklch(0.24 0.010 50);
    --color-muted: oklch(0.42 0.010 50);
    --color-border: oklch(0.70 0.008 50);
    --color-accent: oklch(0.38 0.22 22);
  }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 14.6:1 ✓
- `--color-body` over `--color-bg` = 6.8:1 ✓
- Bebas Neue: all-caps condensed sans — do not use below 32px for legibility
- IBM Plex Mono 300 at 11px (captions): `--color-muted` over `--color-bg` = 3.8:1 — large-text threshold only; do not use muted at this scale for essential information
- `--color-accent-light` (lighter crimson) over `--color-bg` = 4.9:1 ✓ (large text / graphical)
- Grain overlay: `opacity: 0.04` — imperceptible to text legibility, preserved as texture only
- No animation — `prefers-reduced-motion` has no active concerns
- All semantic content at z-index 1 above background at z-index 0
