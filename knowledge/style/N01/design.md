# N01 — art-deco-gold

**Style ID:** N01  
**Family:** N (Retro/Historical)  
**Scheme:** Dark luxury — warm black ground, cream type, gold accent  
**Mood:** Authoritative, ceremonial, timeless opulence  
**Occasion:** Luxury events, heritage brands, financial institutions with long history, auction houses, fine wine, jewelry, private banking  
**Academic Fit:** Low — reserved for prestige communications, not scholarly papers

---

## Design Philosophy (5D)

**Philosophy:** Art Deco as a design language treats geometry as ceremony. Every rule, every bracket, every stepped form signals that the content within deserves reverence. N01 channels the visual vocabulary of 1920s–1930s luxury hotels, Lalique glass, and Cassandre poster typography: bilateral symmetry, hierarchical layering of gold lines, and the contrast of matte black against luminous gold.

**Hierarchy:** Headlines carry absolute authority — Cinzel in large tracked caps evokes Roman inscription on a frieze. Below it, Cormorant Garamond body text breathes in open line-height, never competing. Gold accent elements (rules, overlines, borders) frame rather than decorate, drawing the eye to numbered evidence without shouting.

**Detail:** Three-line Art Deco divider (1px / 4px gap / 1px in gold) between sections. Corner brackets on content panels using CSS `::before`/`::after`. Stepped tab motifs on slide markers using layered box-shadows. Stat overline: 40px × 1px warm gold, above the numeral.

**Function:** Dark backgrounds demand discipline — text must be off-white (never pure white), gold must be muted-warm (never chrome-yellow). All interactive states meet WCAG AA. Stat columns align numerals with `font-variant-numeric: lining-nums tabular-nums`. Table rows use alternating transparency, not alternating hues.

**Innovation:** Uses CSS `oklch()` directly in custom properties so designers can adjust lightness/chroma systematically. Gold accent derives from a single hue angle (74°) with lightness steps, not disparate hex values. The three-line divider is a reusable CSS class, not an image.

---

## Color System (OKLCH CSS tokens)

```css
:root {
  /* --- Backgrounds --- */
  --c-bg-base:       oklch(0.08 0.008 40);   /* warm near-black, slight warm undertone */
  --c-bg-raised:     oklch(0.12 0.010 42);   /* card / panel surface */
  --c-bg-inset:      oklch(0.06 0.006 38);   /* recessed wells */
  --c-bg-overlay:    oklch(0.16 0.012 44);   /* hover overlay, modal scrim */

  /* --- Text --- */
  --c-text-primary:  oklch(0.94 0.014 68);   /* warm cream, main body */
  --c-text-secondary:oklch(0.70 0.016 64);   /* supporting text, captions */
  --c-text-muted:    oklch(0.52 0.012 60);   /* footnotes, disabled */
  --c-text-inverse:  oklch(0.08 0.008 40);   /* text on gold surfaces */

  /* --- Gold accent ramp (hue 74°) --- */
  --c-gold-900:      oklch(0.38 0.08  74);   /* deep burnished gold for shadows */
  --c-gold-700:      oklch(0.56 0.13  74);   /* mid-tone gold, rules, borders */
  --c-gold-500:      oklch(0.74 0.16  74);   /* primary art-deco gold — accent */
  --c-gold-300:      oklch(0.86 0.11  74);   /* highlight, hover state */
  --c-gold-100:      oklch(0.95 0.05  74);   /* near-cream tinted gold */

  /* --- Semantic --- */
  --c-border:        oklch(0.26 0.020 66);   /* default border — dark gold-tinted */
  --c-border-accent: var(--c-gold-700);      /* highlighted border */
  --c-focus-ring:    var(--c-gold-500);      /* keyboard focus outline */
  --c-divider:       var(--c-gold-700);      /* art-deco three-line divider */

  /* --- Folio --- */
  --c-folio-text:    var(--c-text-muted);
}
```

---

## Typography (Google Fonts CDN import, CSS vars, scale comments)

```html
<!-- In <head> — OFL fonts only -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap" rel="stylesheet">
```

```css
:root {
  /* Font families */
  --f-display:  'Cinzel', Georgia, 'Slides CJK Serif', 'Trajan Pro', serif;       /* headlines, labels, folios */
  --f-body:     'Cormorant Garamond', Georgia, 'Slides CJK Serif', 'Garamond', serif; /* body, captions */

  /* Type scale (base 18px → 1920px stage) */
  --t-hero:     clamp(2.4rem, 3.2vw, 3.6rem);  /* slide 1 title */
  --t-h1:       clamp(1.6rem, 2.1vw, 2.4rem);  /* evidence headline */
  --t-h2:       clamp(1.1rem, 1.4vw, 1.5rem);  /* stat label, section marker */
  --t-body-lg:  clamp(1.0rem, 1.2vw, 1.25rem); /* main body paragraph */
  --t-body:     clamp(0.9rem, 1.0vw, 1.05rem); /* normal body */
  --t-small:    clamp(0.75rem, 0.85vw, 0.875rem); /* captions, footnotes */
  --t-micro:    clamp(0.65rem, 0.72vw, 0.75rem);  /* folio, labels */

  /* Spacing */
  --lh-display: 1.12;
  --lh-body:    1.65;
  --lh-caption: 1.45;

  /* Tracking */
  --ls-wide:    0.12em;   /* Cinzel section labels */
  --ls-normal:  0.04em;   /* Cinzel body labels */
  --ls-tight:   -0.01em;  /* large display text */

  /* Numeric formatting */
  --fvn-table:  lining-nums tabular-nums;
  --fvn-stat:   lining-nums proportional-nums;
}
```

---

## Background and Structural Elements (CSS)

```css
/* Slide base */
.slide {
  background-color: var(--c-bg-base);
  color: var(--c-text-primary);
  font-family: var(--f-body);
  position: relative;
  overflow: hidden;
}

/* ── Geometric background texture: subtle radial glow center-top ── */
.slide::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background:
    radial-gradient(
      ellipse 60% 40% at 50% -5%,
      oklch(0.74 0.10 74 / 0.07) 0%,
      transparent 70%
    );
  pointer-events: none;
}

/* ── Art Deco corner brackets on panels ── */
.deco-panel {
  position: relative;
  padding: 32px 36px;
}
.deco-panel::before,
.deco-panel::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: var(--c-gold-700);
  border-style: solid;
}
.deco-panel::before {
  top: 10px; left: 10px;
  border-width: 1px 0 0 1px;
}
.deco-panel::after {
  bottom: 10px; right: 10px;
  border-width: 0 1px 1px 0;
}

/* ── Art Deco three-line section divider ── */
.deco-divider {
  display: flex;
  flex-direction: column;
  gap: 0;
  width: 100%;
  margin: 20px 0;
}
.deco-divider::before {
  content: '';
  display: block;
  height: 1px;
  background: var(--c-divider);
}
.deco-divider::after {
  content: '';
  display: block;
  height: 1px;
  background: var(--c-divider);
  margin-top: 5px; /* 1px + 4px gap + 1px = 6px total */
}

/* ── Gold double rule border (top of slide, decorative) ── */
.slide-border-top {
  position: absolute;
  top: 0; left: 0; right: 0;
  z-index: 1;
  height: 6px;
  border-top: 1px solid var(--c-gold-700);
  border-bottom: 1px solid var(--c-gold-700);
  background: transparent;
}

/* ── Stepped section marker ── */
.section-marker {
  font-family: var(--f-display);
  font-size: var(--t-micro);
  font-weight: 600;
  letter-spacing: var(--ls-wide);
  text-transform: uppercase;
  color: var(--c-gold-500);
  display: inline-flex;
  align-items: center;
  gap: 12px;
}
.section-marker::before {
  content: '';
  display: inline-block;
  width: 32px;
  height: 1px;
  background: var(--c-gold-500);
}
```

---

## Layout Patterns (ASCII diagram)

### Slide 1 — Title

```
┌──────────────────────────── 1920px ─────────────────────────────┐
│ [gold double-rule top]                                          │
│                                                                 │
│         ┌──────────────────────────────────────────┐           │
│         │  [section marker: AUCTION RESULTS 2024]  │           │
│         │                                          │           │
│         │  [HERO HEADLINE — Cinzel 700]            │           │
│         │  [Abstract line 1 — Cormorant]           │           │
│         │  [Abstract line 2 — Cormorant]           │           │
│         │                                          │           │
│         │  [─── Art Deco three-line divider ───]   │           │
│         │                                          │           │
│         │  [ col1 ] [ col2 ] [ col3 ] [ col4 ]     │           │
│         └──────────────────────────────────────────┘           │
│                                                      [folio]   │
└─────────────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence + Aside

```
┌───────────────────────────────────────────────────────────────────┐
│ [gold double-rule top]                                            │
│                                                                   │
│  [section marker]                                                 │
│  [H1 Headline — 2 lines max]                                      │
│                                                                   │
│  ┌─ stat col ─┐  ┌─ stat col ─┐  ┌─ stat col ─┐  ┌──aside───┐   │
│  │ [overline] │  │ [overline] │  │ [overline] │  │ [sup stat]│   │
│  │  [number]  │  │  [number]  │  │  [number]  │  │ [text]   │   │
│  │  [label]   │  │  [label]   │  │  [label]   │  │          │   │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘   │
│                                                                   │
│  [evidence paragraph — Cormorant body]                            │
│                                                      [folio]     │
└───────────────────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison Table

```
┌────────────────────────────────────────────────────────────────────┐
│ [gold double-rule top]                                             │
│                                                                    │
│  [section marker]                                                  │
│  [H1 Headline — 2 lines max]                                       │
│                                                                    │
│  ┌──────────────────────────────── table ─────────────────────┐   │
│  │  Category │ Total Value │ Avg/Lot │ YoY Change │ Rank      │   │
│  │ ─────────────────────────────────────────────────────────  │   │
│  │  row 1    │             │         │            │           │   │
│  │  row 2    │             │         │            │           │   │
│  │ [★ row 3 HIGHLIGHTED]                                      │   │
│  │  row 4    │             │         │            │           │   │
│  │  row 5    │             │         │            │           │   │
│  └────────────────────────────────────────────────────────────┘   │
│  [footnote — dagger symbol + small text]             [folio]      │
└────────────────────────────────────────────────────────────────────┘
```

---

## Component Tokens (stat columns, table, folio CSS)

```css
/* ── Stat column ── */
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.stat-overline {
  width: 40px;
  height: 1px;
  background: var(--c-gold-500);
  flex-shrink: 0;
}
.stat-number {
  font-family: var(--f-display);
  font-size: clamp(2rem, 3vw, 3.2rem);
  font-weight: 600;
  color: var(--c-gold-500);
  font-variant-numeric: lining-nums proportional-nums;
  line-height: 1;
  letter-spacing: -0.01em;
}
.stat-label {
  font-family: var(--f-body);
  font-size: var(--t-small);
  color: var(--c-text-secondary);
  line-height: var(--lh-caption);
  max-width: 180px;
}

/* ── Aside panel ── */
.aside-panel {
  background: var(--c-bg-raised);
  border-left: 2px solid var(--c-gold-700);
  padding: 24px 28px;
}
.aside-stat {
  font-family: var(--f-display);
  font-size: clamp(1.4rem, 2vw, 2rem);
  font-weight: 600;
  color: var(--c-gold-300);
  font-variant-numeric: lining-nums proportional-nums;
}
.aside-text {
  font-family: var(--f-body);
  font-size: var(--t-small);
  color: var(--c-text-secondary);
  margin-top: 8px;
  line-height: var(--lh-body);
}

/* ── Data table ── */
.deco-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--f-body);
  font-size: var(--t-body);
}
.deco-table th {
  font-family: var(--f-display);
  font-size: var(--t-micro);
  font-weight: 600;
  letter-spacing: var(--ls-wide);
  text-transform: uppercase;
  color: var(--c-gold-700);
  border-bottom: 1px solid var(--c-gold-700);
  padding: 10px 16px;
  text-align: left;
  font-variant-numeric: var(--fvn-table);
}
.deco-table td {
  padding: 12px 16px;
  color: var(--c-text-primary);
  border-bottom: 1px solid oklch(0.26 0.020 66 / 0.5);
  font-variant-numeric: var(--fvn-table);
}
.deco-table tr:nth-child(even) td {
  background: oklch(0.12 0.010 42 / 0.4);
}
.deco-table tr.row-highlight td {
  background: oklch(0.74 0.10 74 / 0.12);
  color: var(--c-gold-300);
  font-weight: 600;
}
.deco-table tr.row-highlight td:first-child {
  border-left: 2px solid var(--c-gold-500);
}

/* ── Slide folio ── */
.slide-folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--f-display);
  font-size: var(--t-micro);
  letter-spacing: var(--ls-wide);
  color: var(--c-folio-text);
  font-variant-numeric: lining-nums tabular-nums;
}
```

---

## Print/Export Mode

```css
@media print {
  :root {
    --c-bg-base:      #1a1410;
    --c-bg-raised:    #211c17;
    --c-text-primary: #f0ece3;
    --c-gold-500:     #c8a84b;
    --c-gold-700:     #8a6e2a;
  }
  .slide-folio { color: #8a8078; }
  /* Force backgrounds to print */
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}
```

---

## Accessibility (contrast ratios)

| Pair | Foreground | Background | Ratio | WCAG |
|---|---|---|---|---|
| Body text on base | oklch(0.94 0.014 68) ≈ #f0ece3 | oklch(0.08 0.008 40) ≈ #111009 | ~17:1 | AAA |
| Secondary text on base | oklch(0.70 0.016 64) ≈ #b3a88e | oklch(0.08 0.008 40) ≈ #111009 | ~7.4:1 | AAA |
| Muted text on base | oklch(0.52 0.012 60) ≈ #7d7468 | oklch(0.08 0.008 40) ≈ #111009 | ~4.6:1 | AA |
| Gold accent on base | oklch(0.74 0.16 74) ≈ #c8a43a | oklch(0.08 0.008 40) ≈ #111009 | ~9.8:1 | AAA (large text) |
| Gold label on raised | oklch(0.74 0.16 74) | oklch(0.12 0.010 42) | ~8.2:1 | AAA |
| Inverse text on gold | oklch(0.08 0.008 40) | oklch(0.74 0.16 74) | ~9.8:1 | AAA |

All interactive focus states use `outline: 2px solid var(--c-gold-500)` with 2px offset, meeting WCAG 2.2 §2.4.11.

---

## Differentiators from Sibling N-Family Styles

- **N01 vs N02 (art-nouveau-ink):** N01 is geometric-angular; N02 is organic-curvilinear. N01 uses gold on black; N02 uses deep ink on parchment.
- **N01 vs N03 (bauhaus-primary):** N01 is ornamental luxury; N03 is functional minimalism. N01 uses serif display type; N03 uses grotesque sans.
- **N01 stands alone** as the only style in the family using a warm-black ground with gold type — all others use light or neutral grounds.

---

## Fixed-stage content fit

The vw / clamp(...vw...) type values above are preview references. For a generated 1920×1080 deck, use fixed pixel type tokens and let the stage transform handle window scaling; otherwise text shrinks twice. Essential body copy follows knowledge/element/elements.md (normally 28–36px for speaker slides). Shorten copy, change layout, move explanation into speaker notes, or split the slide before reducing type size.

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | Cinzel | Georgia | Slides CJK Serif |
| Body | Cormorant Garamond | Georgia | Slides CJK Serif |
| Auxiliary / data | Cinzel | Georgia | Slides CJK Serif |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.
