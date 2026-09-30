# H03 — executive-dark-bold

| Field | Value |
|---|---|
| Style ID | H03 |
| Family | H (Corporate/Business) |
| Scheme | Dark |
| Mood | Authoritative, Premium, High-Stakes |
| Occasion | Board presentations, C-suite strategy, major investment pitches, executive summaries |
| Academic Fit | Low — purpose-built for commercial/investment contexts |

---

## Design Philosophy

**Philosophy:** Power through restraint. Every element earns its place. The dark surface absorbs visual noise, leaving only data and conviction. Inspired by the physical gravitas of a printed Goldman Sachs pitch deck — not decoration, information architecture.

**Hierarchy:** Headlines carry the entire argument; body copy supports but never competes. Large numbers command attention at first glance. Supporting text recedes into the surface rather than demanding equal weight.

**Detail:** 3 px electric-blue left borders on stat values create a precision instrument feel. Subtle radial gradients in corners suggest depth without distraction. Horizontal rules are 1 px at 15% opacity — present but never loud.

**Function:** Optimized for projected display in darkened boardrooms and video calls with screen share. High luminance contrast (18:1+ for body text) ensures legibility at distance. Folio placement keeps slide number visible without visual competition.

**Innovation:** OKLCH color tokens allow systematic chroma adjustment across themes without hue drift. The Syne + Space Grotesk pairing reads as "premium tech executive" — geometric structure with professional warmth. Neither font is overused in the presentation-design space.

---

## Color System

```css
/* ── H03 Executive Dark Bold — OKLCH Color Tokens ── */
:root {
  /* Surfaces */
  --h03-bg-base:        oklch(0.10 0.008 260);   /* near-black, slight blue cast */
  --h03-bg-raised:      oklch(0.14 0.010 260);   /* card / panel surface */
  --h03-bg-recessed:    oklch(0.08 0.006 260);   /* inset / well */

  /* Gradient (subtle corner tint) */
  --h03-bg-gradient:    radial-gradient(
                          ellipse 80% 60% at 0% 100%,
                          oklch(0.13 0.025 255 / 0.55) 0%,
                          transparent 65%
                        ),
                        radial-gradient(
                          ellipse 70% 50% at 100% 0%,
                          oklch(0.12 0.022 262 / 0.45) 0%,
                          transparent 60%
                        );

  /* Accent — electric blue */
  --h03-accent:         oklch(0.60 0.20 258);    /* primary CTA / highlight */
  --h03-accent-dim:     oklch(0.52 0.16 258);    /* muted accent / borders */
  --h03-accent-glow:    oklch(0.60 0.20 258 / 0.18); /* accent glow bg */

  /* Text */
  --h03-text-primary:   oklch(0.97 0.004 260);   /* near-white body */
  --h03-text-secondary: oklch(0.72 0.012 260);   /* supporting / labels */
  --h03-text-muted:     oklch(0.50 0.010 260);   /* footnotes / metadata */
  --h03-text-accent:    oklch(0.70 0.18 258);    /* accent-colored text */

  /* Borders / Dividers */
  --h03-border:         oklch(0.25 0.012 260 / 0.6);
  --h03-border-accent:  oklch(0.60 0.20 258 / 0.9);
  --h03-divider:        oklch(0.30 0.008 260 / 0.25);

  /* Semantic — table row highlight */
  --h03-row-highlight:  oklch(0.60 0.20 258 / 0.12);
  --h03-row-highlight-border: oklch(0.60 0.20 258 / 0.50);

  /* Status */
  --h03-positive:       oklch(0.72 0.14 155);    /* green — OFL-safe OKLCH */
  --h03-caution:        oklch(0.76 0.16 68);     /* amber */
  --h03-negative:       oklch(0.63 0.20 22);     /* red */
}
```

---

## Typography

```css
/* ── Google Fonts CDN Import (OFL/Apache only) ── */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Space+Grotesk:wght@300;400;500;600&display=swap');

:root {
  /* Font families */
  --h03-font-display: 'Syne', Arial, 'Slides CJK Sans', system-ui, sans-serif;      /* headlines */
  --h03-font-body:    'Space Grotesk', Arial, 'Slides CJK Sans', system-ui, sans-serif; /* body / UI */

  /* Type scale (1920×1080 stage) */
  --h03-size-hero:    clamp(2.6rem, 3.2vw, 3.6rem);  /* slide 1 title */
  --h03-size-h1:      clamp(1.9rem, 2.4vw, 2.6rem);  /* slide headline */
  --h03-size-h2:      clamp(1.3rem, 1.6vw, 1.75rem); /* section marker */
  --h03-size-stat:    clamp(3.2rem, 4.8vw, 5.6rem);  /* big numbers */
  --h03-size-body:    clamp(0.9rem, 1.1vw, 1.1rem);  /* paragraph */
  --h03-size-label:   clamp(0.7rem, 0.85vw, 0.85rem);/* labels / caps */
  --h03-size-folio:   0.75rem;                        /* slide number */

  /* Weights */
  --h03-weight-display: 800;   /* Syne headings */
  --h03-weight-strong:  600;
  --h03-weight-body:    400;
  --h03-weight-light:   300;

  /* Line heights */
  --h03-lh-headline: 1.08;
  --h03-lh-body:     1.62;

  /* Letter spacing */
  --h03-ls-hero:    -0.02em;
  --h03-ls-label:    0.08em;
  --h03-ls-caps:     0.12em;

  /* Numeric styling */
  --h03-nums: lining-nums tabular-nums;
}

/* All numeric values must apply: font-variant-numeric: lining-nums tabular-nums */
.stat-value, td, .folio { font-variant-numeric: lining-nums tabular-nums; }
```

---

## Background and Structural Elements

```css
/* ── Stage background ── */
.stage {
  background-color: var(--h03-bg-base);
  background-image: var(--h03-bg-gradient);
  background-attachment: local;
}

/* ── Slide layout ── */
.slide {
  position: relative;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
}

/* Background layer — always z-index 0 */
.slide__bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--h03-bg-base);
  background-image: var(--h03-bg-gradient);
}

/* All semantic content — z-index 1 */
.slide__content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

/* ── Structural rule ── */
.rule {
  width: 100%;
  height: 1px;
  background: var(--h03-divider);
  margin: 0;
  border: none;
}

/* ── Section marker pill ── */
.section-marker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--h03-font-body);
  font-size: var(--h03-size-label);
  font-weight: var(--h03-weight-strong);
  letter-spacing: var(--h03-ls-caps);
  text-transform: uppercase;
  color: var(--h03-text-accent);
}

.section-marker::before {
  content: '';
  display: block;
  width: 28px;
  height: 2px;
  background: var(--h03-accent);
}

/* ── Decorative corner accent ── */
.corner-accent {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 420px;
  height: 300px;
  background: radial-gradient(ellipse at 0% 100%, oklch(0.60 0.20 258 / 0.08), transparent 70%);
  z-index: 0;
  pointer-events: none;
}
```

---

## Layout Patterns

### Slide 1 — Title

```
┌─────────────────────────────────────────────────────────────┐
│  [logo / wordmark]                           [org / date]   │
│                                                             │
│                                                             │
│   ┌──────────────────────────────────────────────────────┐  │
│   │  SECTION MARKER                                       │  │
│   │  HEADLINE                                             │  │
│   │  (2–3 lines, Syne 800, very large)                   │  │
│   │                                                       │  │
│   │  Abstract (2 sentences, Space Grotesk 300)           │  │
│   └──────────────────────────────────────────────────────┘  │
│                                                             │
│   ╔══════════╦══════════╦══════════╦══════════╗            │
│   ║  Detail  ║  Detail  ║  Detail  ║  Detail  ║            │
│   ╚══════════╩══════════╩══════════╩══════════╝            │
│                                                             │
│                                          [folio]            │
└─────────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence (Stats + Aside)

```
┌─────────────────────────────────────────────────────────────┐
│  SECTION MARKER                                             │
│  HEADLINE (full sentence)                                   │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌───────┐  │
│   │ STAT 1   │   │ STAT 2   │   │ STAT 3   │   │ ASIDE │  │
│   │  big #   │   │  big #   │   │  big #   │   │ panel │  │
│   │  label   │   │  label   │   │  label   │   │       │  │
│   └──────────┘   └──────────┘   └──────────┘   └───────┘  │
│                                                             │
│   Evidence paragraph (2–3 sentences)                       │
│                                                             │
│                                          [folio]            │
└─────────────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison Table

```
┌─────────────────────────────────────────────────────────────┐
│  SECTION MARKER                                             │
│  HEADLINE (full sentence)                                   │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│   ┌──────┬─────────┬────────┬──────────┬────────┬────────┐ │
│   │ Opt. │ Region  │ IRR    │ Cap-Ex   │ Risk   │ Payb.  │ │
│   ├──────┼─────────┼────────┼──────────┼────────┼────────┤ │
│   │  A   │ SGP     │ 34%  ✓ │ $122M    │ Low    │ 3.1 yr │ │ ← highlighted
│   │  B   │ TYO     │ 29%    │ $98M     │ Med    │ 3.8 yr │ │
│   │  C   │ SYD     │ 24%    │ $76M     │ Low    │ 4.2 yr │ │
│   │  D   │ HKG     │ 21%    │ $65M     │ High   │ 4.6 yr │ │
│   │  E   │ SEA+SYD │ 31%    │ $158M    │ Med    │ 3.4 yr │ │
│   └──────┴─────────┴────────┴──────────┴────────┴────────┘ │
│                                                             │
│   Footnote                                                  │
│                                          [folio]            │
└─────────────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat Column

```css
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 28px 32px 28px 28px;
  border-left: 3px solid var(--h03-accent);  /* the signature 3px accent border */
  background: oklch(0.14 0.010 260 / 0.6);
  border-radius: 0 6px 6px 0;
}

.stat-label {
  font-family: var(--h03-font-body);
  font-size: var(--h03-size-label);
  font-weight: var(--h03-weight-strong);
  letter-spacing: var(--h03-ls-caps);
  text-transform: uppercase;
  color: var(--h03-text-secondary);
}

.stat-value {
  font-family: var(--h03-font-display);
  font-size: var(--h03-size-stat);
  font-weight: 800;
  line-height: 1;
  color: var(--h03-text-primary);
  font-variant-numeric: lining-nums tabular-nums;
}

.stat-desc {
  font-family: var(--h03-font-body);
  font-size: var(--h03-size-label);
  font-weight: var(--h03-weight-light);
  color: var(--h03-text-muted);
  line-height: 1.4;
}
```

### Comparison Table

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--h03-font-body);
  font-variant-numeric: lining-nums tabular-nums;
}

.data-table thead th {
  font-size: var(--h03-size-label);
  font-weight: var(--h03-weight-strong);
  letter-spacing: var(--h03-ls-caps);
  text-transform: uppercase;
  color: var(--h03-text-secondary);
  padding: 14px 20px;
  text-align: left;
  border-bottom: 1px solid var(--h03-border);
}

.data-table tbody td {
  font-size: var(--h03-size-body);
  font-weight: var(--h03-weight-body);
  color: var(--h03-text-primary);
  padding: 18px 20px;
  border-bottom: 1px solid var(--h03-divider);
}

.data-table tbody tr.row-highlight {
  background: var(--h03-row-highlight);
  outline: 1px solid var(--h03-row-highlight-border);
  outline-offset: -1px;
}

.data-table tbody tr.row-highlight td {
  color: var(--h03-text-primary);
}
```

### Folio

```css
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--h03-font-body);
  font-size: var(--h03-size-folio);
  font-weight: var(--h03-weight-strong);
  letter-spacing: var(--h03-ls-caps);
  text-transform: uppercase;
  color: var(--h03-text-muted);
  font-variant-numeric: lining-nums tabular-nums;
  z-index: 1;
}

.folio span { color: var(--h03-accent); }
```

### Aside Panel

```css
.aside-panel {
  background: oklch(0.14 0.010 260 / 0.7);
  border: 1px solid var(--h03-border);
  border-top: 3px solid var(--h03-accent);
  border-radius: 6px;
  padding: 28px 24px;
}

.aside-stat {
  font-family: var(--h03-font-display);
  font-size: clamp(2rem, 3vw, 3.2rem);
  font-weight: 800;
  color: var(--h03-accent);
  line-height: 1;
  font-variant-numeric: lining-nums tabular-nums;
}
```

### Detail Row (Slide 1)

```css
.detail-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2px;
}

.detail-cell {
  background: oklch(0.14 0.010 260 / 0.55);
  padding: 20px 24px;
}

.detail-cell:first-child { border-radius: 6px 0 0 6px; }
.detail-cell:last-child  { border-radius: 0 6px 6px 0; }

.detail-cell__label {
  font-family: var(--h03-font-body);
  font-size: var(--h03-size-label);
  font-weight: var(--h03-weight-strong);
  text-transform: uppercase;
  letter-spacing: var(--h03-ls-caps);
  color: var(--h03-text-secondary);
  margin-bottom: 6px;
}

.detail-cell__value {
  font-family: var(--h03-font-body);
  font-size: calc(var(--h03-size-body) * 1.15);
  font-weight: var(--h03-weight-strong);
  color: var(--h03-text-primary);
  font-variant-numeric: lining-nums tabular-nums;
}
```

---

## Print/Export Mode

```css
@media print {
  .slide {
    /* Force white background for print */
    background: #fff !important;
    color: #111 !important;
  }

  .nav-bar { display: none !important; }

  .stat-value { color: #0a0a1a !important; }

  .stat-col {
    border-left-color: #1a4fd6 !important;
    background: #f4f6ff !important;
  }

  .data-table tbody tr.row-highlight {
    background: #e8eeff !important;
    outline-color: #1a4fd6 !important;
  }

  .folio { color: #666 !important; }
}
```

---

## Accessibility

| Element | Token | Approx. Contrast | WCAG Grade |
|---|---|---|---|
| Body text on bg-base | text-primary / bg-base | ~19:1 | AAA |
| Secondary text on bg-base | text-secondary / bg-base | ~8.5:1 | AAA |
| Muted text on bg-base | text-muted / bg-base | ~4.8:1 | AA |
| Accent text on bg-base | text-accent / bg-base | ~5.5:1 | AA |
| Accent on bg-raised | accent / bg-raised | ~7.2:1 | AA (large) |
| Table text on row-highlight | text-primary / row-highlight | ~17:1 | AAA |

Notes:
- All interactive controls (nav dots, prev/next) have visible focus rings using `outline: 2px solid var(--h03-accent)`.
- `prefers-reduced-motion` collapses all transitions to `0ms`.
- Section markers use `:before` decoration only; semantic content is not dependent on it.
- Color alone is never used to distinguish table row highlight — row also receives `outline` border.

---

## Differentiators from Sibling H-Family Styles

| Attribute | H03 executive-dark-bold | H01 (assumed light corp.) | H02 (assumed mid-tone) |
|---|---|---|---|
| Surface | Near-black with blue gradient | Light / white | Mid-gray or navy |
| Accent | Electric blue oklch(0.60 0.20 258) | Corporate blue | Varies |
| Stat treatment | 3 px left border, very large Syne 800 | Smaller, underline | Varies |
| Font pairing | Syne + Space Grotesk | Likely Inter or similar | Varies |
| Mood | High-stakes boardroom | Professional / accessible | Varies |
| Best context | Investment pitch, M&A, board | Annual report, all-hands | Varies |

---

## Fixed-stage content fit

The vw / clamp(...vw...) type values above are preview references. For a generated 1920×1080 deck, use fixed pixel type tokens and let the stage transform handle window scaling; otherwise text shrinks twice. Essential body copy follows knowledge/element/elements.md (normally 28–36px for speaker slides). Shorten copy, change layout, move explanation into speaker notes, or split the slide before reducing type size.

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | Syne | Arial | Slides CJK Sans |
| Body | Space Grotesk | Arial | Slides CJK Sans |
| Auxiliary / data | Space Grotesk | Arial | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.
