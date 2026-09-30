# C02 — dark-editorial-cinema

**Style ID:** C02  
**Family:** Cinematic (C)  
**Scheme:** Dark-Cool  
**Mood:** cinematic · editorial · contemplative · prestige · spare  
**Occasion:** film · art-direction · cultural-institution · awards · creative-agency · streaming  
**Academic Fit:** None

---

## Design Philosophy

Dark-editorial-cinema is the visual language of prestige editorial and art-house film identity: the Criterion spine, the A24 trailer title card, the MoMA gallery placard. Where C01 (film-noir) is warm, dense, and investigative, C02 is cool, spare, and composed. The stage is a near-black with the faintest blue-cool cast — the absence of a warm source. The single accent is a muted champagne-gold: rich but unsaturated, like aged printing ink rather than a trophy. Typographically, the signature move is a pairing of Cormorant Garamond italic at large display sizes (OFL, Google Fonts) — one of the few display serifs that holds its composure at 80px — with Space Grotesk (OFL, Google Fonts) for functional text. The combination creates a tension between cinematic gravitas and modern editorial clarity.

There are no card containers. Content lives directly on the stage, separated by ruled hairlines, generous margin, and the typographic weight hierarchy alone. The deck has a cinematic widescreen quality: 1920×1080 already maps to a 16:9 cinema ratio, and this style leans into that — tall top and bottom margins, strong horizontal rules, and type that breathes.

5D Evaluation:
- **Philosophy:** Restraint as the primary statement. Every element on stage earns its place by subtracting everything that didn't. The champagne accent appears on at most three elements per slide — overline rules, key numbers, and one label — and everywhere else is controlled by the cool-dark / body-text / muted-text triplet.
- **Hierarchy:** Cormorant Garamond Italic at 80–92px creates the title-card moment; its high-contrast hairline serifs hold admirably at display size and read as distinctly editorial rather than classical. Space Grotesk at 400/500 handles body and functional text — its softened geometric construction avoids the cold precision of Inter while staying highly legible.
- **Detail:** Hairline rules at `oklch(0.24 0.006 250)` — cool, dark, barely visible — separate sections without visual weight. Champagne overlines above stat values: `oklch(0.82 0.10 88)`, 1px, 36px wide. No borders on labels or tags — they sit in the negative space by tracking and weight alone.
- **Function:** Best for title cards, statement slides, and evidence slides where one major fact carries the slide. Does not support dense tables well — the spare layout needs white space, so table rows require extra height and the style should use only 4–5 data rows.
- **Innovation:** The slide heading uses a combined typographic treatment: a small-caps Space Grotesk eyebrow at 11px tracked +0.18em in muted champagne, a 1px hairline, then Cormorant Garamond Italic at 80px for the assertion. This three-element stack — label / rule / display-serif — appears in film title sequences and editorial photography captions; it reads as a single designed unit rather than a heading hierarchy.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — near-black, blue-cool cast */
  --color-bg:             oklch(0.06 0.008 250);
  --color-surface:        oklch(0.10 0.008 248);        /* raised panels */
  --color-raised-surface: oklch(0.14 0.008 245);
  --color-border:         oklch(0.24 0.006 250);        /* hairline rules */
  --color-border-light:   oklch(0.16 0.006 248);        /* subtle sub-rules */
  --color-shadow:         oklch(0.03 0.006 245 / 0.80);

  /* Type */
  --color-heading:        oklch(0.97 0.005 80);         /* warm off-white — print ink quality */
  --color-body:           oklch(0.80 0.010 70);         /* warm mid-light */
  --color-muted:          oklch(0.52 0.010 68);         /* mid-grey */
  --color-dim:            oklch(0.34 0.008 62);         /* faint ruled text */

  /* Accent — Champagne-Gold */
  --color-accent:         oklch(0.82 0.10 88);          /* muted champagne, primary accent */
  --color-accent-dim:     oklch(0.60 0.08 86);
  --color-accent-glow:    oklch(0.82 0.10 88 / 0.16);
  --color-accent-light:   oklch(0.90 0.08 90);          /* lighter champagne for stats */

  /* Semantic */
  --color-positive:       oklch(0.70 0.18 145);
  --color-negative:       oklch(0.62 0.22 22);
  --color-warn:           oklch(0.74 0.18 78);

  /* Chart tokens */
  --chart-c1: oklch(0.82 0.10 88);    /* champagne */
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
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=Space+Grotesk:wght@300;400;500;700&display=swap');

:root {
  --type-display: 'Cormorant Garamond', Georgia, 'Slides CJK Serif', serif;   /* cinematic display — italic at large sizes */
  --type-body:    'Space Grotesk', Arial, 'Slides CJK Sans', sans-serif;   /* functional text — modern geometric */
  --type-label:   'Space Grotesk', Arial, 'Slides CJK Sans', sans-serif;   /* same — tight tracking at small sizes */
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 18px;
  line-height: 1.70;
  letter-spacing: 0.00em;
}

/* Scale */
/* display = 4.4rem = 80-92px (Cormorant Garamond Italic 400 or 600) */
/* h1      = 2.7rem = 48px    (Cormorant Garamond Italic 600) */
/* h2      = 1.5rem = 27px    (Space Grotesk 500) */
/* body    = 1.0rem = 18px    (Space Grotesk 400) */
/* caption = 0.72rem = 13px   (Space Grotesk 300) */
/* eyebrow = 0.65rem = 11px   (Space Grotesk 500, tracked +0.18em, uppercase) */
```

---

## Background: Pure Dark, No Decoration

```css
#cinema-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: var(--color-bg);
}

/* No grain, no vignette — this style uses pure darkness */

@media (prefers-reduced-motion: reduce) {
  /* Static — no change needed */
}
```

---

## Layout Patterns

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [pure near-black — zero decoration]                    │
│                                                         │
│  EYEBROW — Space Grotesk 500, 11px, champagne, +0.18em  │
│  ── 1px hairline rule, champagne ───────────────────── │
│  Headline in Cormorant Garamond Italic 600, 88px        │
│  ── 1px hairline rule, muted ───────────────────────── │
│  Subtitle body (Space Grotesk 400, 21px, muted)        │
│  Spacer                                                 │
│  [small-text metadata row]                             │
│                                                         │
│  ── footer hairline ─────────────────────────────────── │
│  Page indicator, dim                                    │
└─────────────────────────────────────────────────────────┘
```

### Evidence Slide (Stats)
```
┌─────────────────────────────────────────────────────────┐
│  EYEBROW — section label                                │
│  ── accent hairline ────────────────────────────────── │
│  Headline assertion (Cormorant Garamond Italic 48px)    │
│  ── muted hairline ─────────────────────────────────── │
│  │ STAT BLOCK │ STAT BLOCK │ STAT BLOCK │              │
│  │ Champagne overline + Cormorant 80px + label │       │
│  ── muted hairline ─────────────────────────────────── │
│  Body text + [aside column]                            │
└─────────────────────────────────────────────────────────┘
```

---

## Component Tokens

```css
/* Eyebrow — cinematic section label */
.eyebrow {
  font-family: var(--type-label); font-size: 11px; font-weight: 500;
  color: var(--color-accent); letter-spacing: 0.18em; text-transform: uppercase;
}

/* Hairline rule — accent weight */
.accent-rule {
  width: 100%; height: 1px;
  background: var(--color-accent);
  opacity: 0.55;
}

/* Hairline rule — muted */
.hairline {
  width: 100%; height: 1px;
  background: var(--color-border);
}

/* Stat block */
.stat-block { display: flex; flex-direction: column; padding: 24px 0; }
.stat-block__line {
  width: 36px; height: 1px; background: var(--color-accent);
  margin-bottom: 10px;
}
.stat-block__value {
  font-family: var(--type-display); font-size: 80px; font-style: italic;
  color: var(--color-heading); line-height: 0.9; letter-spacing: -0.01em;
}
.stat-block__label {
  font-family: var(--type-label); font-size: 11px; font-weight: 300;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.12em;
  margin-top: 12px; line-height: 1.5;
}

/* Cinema tag — no border, tracked type only */
.cinema-tag {
  font-family: var(--type-label); font-size: 11px; font-weight: 500;
  color: var(--color-muted); letter-spacing: 0.12em; text-transform: uppercase;
}
```

---

## Print / Export Mode

```css
@media print {
  #cinema-bg { display: none; }
  :root {
    --color-bg: oklch(1.0 0 0);
    --color-heading: oklch(0.08 0.006 50);
    --color-body: oklch(0.24 0.006 50);
    --color-muted: oklch(0.44 0.008 50);
    --color-border: oklch(0.72 0.006 50);
    --color-accent: oklch(0.48 0.10 86);
  }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 16.4:1 ✓
- `--color-body` over `--color-bg` = 7.4:1 ✓
- `--color-accent` (champagne) over `--color-bg` = 8.1:1 ✓ — large text / graphical
- Cormorant Garamond at display size: high-contrast hairline serifs require minimum 48px for legibility; never use at body scale
- Space Grotesk 300 at 11px (eyebrow/caption): `--color-muted` over `--color-bg` = 3.6:1 — large-text threshold; only for uppercase tracked labels, not for essential body content
- No animation — `prefers-reduced-motion` has no active concerns
- All semantic content at z-index 1 above background at z-index 0

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | Cormorant Garamond | Georgia | Slides CJK Serif |
| Body | Space Grotesk | Arial | Slides CJK Sans |
| Auxiliary / data | Space Grotesk | Arial | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.
