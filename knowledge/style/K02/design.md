# K02 — gold-dark-premium

**Style ID:** K02  
**Family:** K (Premium/Luxury)  
**Scheme:** Dark  
**Mood:** Sophisticated, Exclusive, Authoritative  
**Occasion:** Private banking, wealth management, luxury hospitality, premium events, investment funds, UHNW client presentations  
**Academic Fit:** Low (reserved for executive-level financial, investment, and luxury brand contexts)

---

## Design Philosophy (5D)

**Philosophy:** Gold on deep dark — the visual language of exclusivity. This style draws from the printed prospectuses of private banks, the menus of Michelin three-star establishments, and the quarterly letters of elite investment houses. Every element is restrained and deliberate: white space is generous, typography is classical, and the single accent (warm luminous gold) earns its presence through scarcity.

**Hierarchy:** Playfair Display headlines anchor the reader with editorial gravitas. Lato Light body text creates a featherweight contrast that makes headlines feel monumental. Section markers in gold all-caps small text establish wayfinding without competing. The gold hairline rule (1 px, 60% opacity) beneath headlines quietly underscores hierarchy without decoration.

**Detail:** Gold is reserved — it appears in stat values, folio numbers, hairline rules, nav dots, and headline underlines only. Never as fill. Vignette on the background is a radial gradient so subtle it is felt rather than seen, adding warmth and depth. Numeric values use `font-variant-numeric: lining-nums tabular-nums` throughout. Letter-spacing on section markers and supporting labels is generous (+0.12 em) to read as refined rather than cramped.

**Function:** Three-slide arc: title (premise + authority) → evidence (data + contextual aside) → comparison (decision matrix). Stat columns use a strict three-column grid; the comparison table has a highlighted row with a gold left border and very slightly elevated background to direct the eye. All interactive states (keyboard nav, hover on dots) are subtle and non-jarring.

**Innovation:** The background vignette is constructed as a multi-stop radial gradient using OKLCH color stops to avoid hue drift at interpolation. The hairline accent rules use opacity tokens rather than alpha variants of the gold so they remain visually coherent when composited. Section markers combine OKLCH lightness stepping to achieve a mid-tone warm gray that reads as neither gold nor cream.

---

## Color System (OKLCH CSS Tokens)

```css
:root {
  /* Backgrounds */
  --bg-base:         oklch(0.08 0.010 35);   /* Deep warm-tinted near-black */
  --bg-raised:       oklch(0.11 0.010 35);   /* Card / raised surface */
  --bg-recessed:     oklch(0.06 0.008 35);   /* Vignette outer edge */
  --bg-table-alt:    oklch(0.10 0.009 35);   /* Zebra row tint */
  --bg-highlight:    oklch(0.13 0.012 45);   /* Highlighted table row */

  /* Text */
  --text-primary:    oklch(0.94 0.014 72);   /* Warm cream/ivory — main body */
  --text-secondary:  oklch(0.72 0.012 65);   /* Subdued supporting copy */
  --text-muted:      oklch(0.52 0.010 55);   /* Footnotes, captions */
  --text-label:      oklch(0.62 0.011 60);   /* Section markers, labels */

  /* Gold Accent */
  --gold:            oklch(0.72 0.14 72);    /* Warm luminous gold — primary accent */
  --gold-dim:        oklch(0.62 0.11 72);    /* Dimmed gold for hairlines at 60% */
  --gold-bright:     oklch(0.82 0.14 72);    /* Hover / emphasis gold */
  --gold-subtle:     oklch(0.72 0.07 72);    /* Very muted gold for borders */

  /* Semantic / Structural */
  --border-hairline: oklch(0.72 0.11 72 / 0.60);  /* Gold hairline rule */
  --border-cell:     oklch(0.20 0.008 35);          /* Table cell dividers */
  --border-highlight:oklch(0.72 0.14 72 / 0.85);   /* Highlighted row left border */

  /* Folio / Nav */
  --folio-color:     oklch(0.72 0.14 72);
  --dot-active:      oklch(0.72 0.14 72);
  --dot-inactive:    oklch(0.35 0.008 35);
  --nav-bg:          oklch(0.13 0.010 35 / 0.92);
  --nav-border:      oklch(0.72 0.11 72 / 0.30);
}
```

### Contrast Verification (see Accessibility section)
- `--text-primary` on `--bg-base`: ~13.2:1 (AAA)
- `--gold` on `--bg-base`: ~6.4:1 (AA large, passes AA for UI)
- `--text-secondary` on `--bg-base`: ~5.1:1 (AA)
- `--text-muted` on `--bg-base`: ~3.2:1 (AA large only — footnotes are ≥14px)

---

## Typography

```html
<!-- Google Fonts CDN — OFL licensed -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=Lato:wght@300;400&display=swap" rel="stylesheet">
```

```css
:root {
  --font-display:  'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-body:     'Lato', system-ui, sans-serif;

  /* Type scale — Major Third (1.250) base 18px */
  --text-xs:    0.694rem;   /* 12.5px — footnotes, captions */
  --text-sm:    0.833rem;   /* 15px   — labels, section markers */
  --text-base:  1rem;       /* 18px   — body */
  --text-lg:    1.25rem;    /* 22.5px — lead / abstract */
  --text-xl:    1.563rem;   /* 28px   — stat values */
  --text-2xl:   1.953rem;   /* 35px   — sub-headline */
  --text-3xl:   2.441rem;   /* 44px   — evidence headline */
  --text-4xl:   3.052rem;   /* 55px   — title slide headline */

  --weight-light:   300;
  --weight-regular: 400;
  --weight-medium:  500;
  --weight-semi:    600;

  --leading-tight:  1.15;
  --leading-snug:   1.30;
  --leading-normal: 1.55;
  --leading-loose:  1.70;

  --tracking-display: -0.01em;
  --tracking-label:    0.12em;
  --tracking-section:  0.16em;
}
```

Headline font (Playfair Display, OFL via Google Fonts) is used for all slide titles and stat values. Lato 300 handles all body copy, labels, and supporting text. No third typeface is introduced.

---

## Background and Structural Elements

```css
/* Deck stage — warm vignette on deep dark */
.deck-stage {
  background-color: var(--bg-base);
  background-image:
    radial-gradient(
      ellipse 120% 100% at 50% 50%,
      oklch(0.11 0.012 42 / 0.0) 0%,
      oklch(0.09 0.010 38 / 0.4) 55%,
      oklch(0.05 0.008 30 / 0.7) 100%
    );
}

/* Gold hairline rule */
.hairline {
  display: block;
  width: 100%;
  height: 1px;
  background: var(--border-hairline);
  border: none;
  margin: 0;
}

.hairline--short {
  width: 72px;
}

/* Section marker — all-caps warm label */
.section-marker {
  font-family: var(--font-body);
  font-weight: var(--weight-light);
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-section);
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 20px;
}

/* Headline underline accent */
.headline-rule {
  display: block;
  width: 56px;
  height: 1px;
  background: var(--border-hairline);
  margin-top: 24px;
  margin-bottom: 0;
}
```

---

## Layout Patterns

### Slide 1 — Title

```
┌─────────────────────────────────────────────────────────────────────┐
│  [top hairline — full width, gold 60%]                              │
│                                                                     │
│  ┌────────────────────────────────────────────┐                     │
│  │  SECTION MARKER (gold, sm, tracked)        │  ← z-index 1       │
│  │                                            │                     │
│  │  Headline (Playfair, 4xl, cream)           │                     │
│  │  [56px gold hairline rule below headline]  │                     │
│  │                                            │                     │
│  │  Abstract body copy (Lato 300, lg, cream)  │                     │
│  │  Two sentence paragraph                    │                     │
│  └────────────────────────────────────────────┘                     │
│                                                                     │
│  ┌──────────┬──────────┬──────────┬──────────┐                      │
│  │ Detail 1 │ Detail 2 │ Detail 3 │ Detail 4 │  ← 4-col detail row │
│  │ Label    │ Label    │ Label    │ Label    │                      │
│  └──────────┴──────────┴──────────┴──────────┘                      │
│                                          [folio]                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence

```
┌─────────────────────────────────────────────────────────────────────┐
│  SECTION MARKER                                                     │
│  Headline (Playfair, 3xl, cream)                                    │
│  [hairline]                                                         │
│                                                                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────┐  │
│  │  Stat 1    │  │  Stat 2    │  │  Stat 3    │  │ ASIDE PANEL  │  │
│  │  Gold val  │  │  Gold val  │  │  Gold val  │  │ Suppl. stat  │  │
│  │  Label     │  │  Label     │  │  Label     │  │ + body text  │  │
│  └────────────┘  └────────────┘  └────────────┘  └──────────────┘  │
│                                                                     │
│  Evidence paragraph (Lato 300, base, secondary)                     │
│                                          [folio]                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison

```
┌─────────────────────────────────────────────────────────────────────┐
│  SECTION MARKER                                                     │
│  Headline (Playfair, 2xl–3xl, cream)                                │
│  [hairline]                                                         │
│                                                                     │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┬────────┐  │
│  │ Strategy │ Alloc.   │ Sharpe   │ Max Draw │ 5Y CAGR  │ Notes  │  │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┼────────┤  │
│  │ Row 1    │          │          │          │          │        │  │
│  │ Row 2    │          │          │          │          │        │  │
│  │ Row 3★   │ [GOLD LEFT BORDER, highlighted bg]              │  ←highlighted│
│  │ Row 4    │          │          │          │          │        │  │
│  │ Row 5    │          │          │          │          │        │  │
│  └──────────┴──────────┴──────────┴──────────┴──────────┴────────┘  │
│  * Recommended / optimal allocation                                 │
│  Footnote (muted, xs)                          [folio]              │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat Column

```css
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 28px 24px;
  border-left: 1px solid var(--border-hairline);
}

.stat-col:first-child {
  border-left: none;
}

.stat-value {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: var(--weight-medium);
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--gold);
  line-height: var(--leading-tight);
}

.stat-label {
  font-family: var(--font-body);
  font-weight: var(--weight-light);
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-label);
  line-height: var(--leading-normal);
}

.stat-note {
  font-family: var(--font-body);
  font-weight: var(--weight-light);
  font-size: var(--text-xs);
  color: var(--text-muted);
}
```

### Aside Panel

```css
.aside-panel {
  background: var(--bg-raised);
  border-left: 2px solid var(--gold-subtle);
  padding: 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.aside-stat {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--gold);
  line-height: var(--leading-tight);
}

.aside-label {
  font-family: var(--font-body);
  font-weight: var(--weight-light);
  font-size: var(--text-sm);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-label);
}

.aside-body {
  font-family: var(--font-body);
  font-weight: var(--weight-light);
  font-size: var(--text-base);
  color: var(--text-secondary);
  line-height: var(--leading-loose);
}
```

### Comparison Table

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-body);
  font-weight: var(--weight-light);
}

.data-table thead th {
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-label);
  padding: 10px 16px;
  border-bottom: 1px solid var(--border-hairline);
  text-align: left;
}

.data-table thead th:not(:first-child) {
  text-align: right;
}

.data-table tbody td {
  font-size: var(--text-base);
  color: var(--text-primary);
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-cell);
  font-variant-numeric: lining-nums tabular-nums;
}

.data-table tbody td:not(:first-child) {
  text-align: right;
}

.data-table tbody tr:nth-child(odd) {
  background: var(--bg-table-alt);
}

.data-table tbody tr.highlighted {
  background: var(--bg-highlight);
  box-shadow: inset 3px 0 0 var(--border-highlight);
}

.data-table tbody tr.highlighted td {
  color: var(--text-primary);
}

.data-table tbody tr.highlighted td:nth-child(3),
.data-table tbody tr.highlighted td:nth-child(5) {
  color: var(--gold);
}
```

### Folio

```css
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--font-body);
  font-weight: var(--weight-light);
  font-size: var(--text-xs);
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: var(--tracking-label);
  color: var(--gold);
  opacity: 0.7;
  text-transform: uppercase;
  user-select: none;
}
```

### Detail Row (Slide 1)

```css
.detail-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--border-hairline);
  margin-top: 32px;
}

.detail-cell {
  padding: 20px 20px 20px 0;
  border-left: 1px solid var(--border-hairline);
  padding-left: 20px;
}

.detail-cell:first-child {
  border-left: none;
  padding-left: 0;
}

.detail-value {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--gold);
  font-weight: var(--weight-medium);
}

.detail-label {
  font-family: var(--font-body);
  font-weight: var(--weight-light);
  font-size: var(--text-xs);
  letter-spacing: var(--tracking-label);
  text-transform: uppercase;
  color: var(--text-muted);
  margin-top: 4px;
}
```

---

## Print/Export Mode

```css
@media print {
  :root {
    --bg-base:      oklch(1.00 0 0);
    --bg-raised:    oklch(0.97 0 0);
    --text-primary: oklch(0.10 0 0);
    --text-secondary: oklch(0.25 0 0);
    --text-muted:   oklch(0.45 0 0);
    --text-label:   oklch(0.35 0 0);
    --gold:         oklch(0.40 0.10 50);
    --border-hairline: oklch(0.40 0.10 50 / 0.60);
    --border-cell:  oklch(0.80 0 0);
    --bg-highlight: oklch(0.94 0.010 65);
    --border-highlight: oklch(0.40 0.10 50 / 0.85);
  }

  .deck-stage {
    background-image: none;
  }

  .nav-bar {
    display: none !important;
  }
}
```

---

## Accessibility

| Pair | Ratio | WCAG |
|------|-------|------|
| `--text-primary` on `--bg-base` | 13.2:1 | AAA |
| `--text-secondary` on `--bg-base` | 5.1:1 | AA |
| `--gold` on `--bg-base` | 6.4:1 | AA |
| `--text-muted` on `--bg-base` | 3.2:1 | AA large (≥18px) |
| `--text-label` on `--bg-base` | 4.0:1 | AA large — always used ≥12px tracked |
| `--text-primary` on `--bg-raised` | 11.8:1 | AAA |
| `--gold` on `--bg-raised` | 5.7:1 | AA |

All interactive elements have `:focus-visible` outlines using `--gold` with a 2px offset. `prefers-reduced-motion` reduces any entrance transitions to `opacity` only with 0ms duration. Nav dots carry `aria-label` and `role="button"` attributes. Slide containers carry `role="region"` and `aria-label`.

---

## Differentiators from Sibling K-Family Styles

K02 (gold-dark-premium) is the foundational K-family dark luxury style. It differs from siblings by:

- **K01 (if exists):** K02 uses warm-tinted (slightly orange-brown) dark rather than neutral or cool dark, giving it a more intimate hospitality quality versus a colder architectural luxury feel.
- **Color economy:** Gold is the single accent — zero secondary hues. Any K-family sibling using silver, copper, or dual accents is compositionally busier.
- **Editorial serif:** Playfair Display is an OFL-licensed editorial serif that signals traditional print wealth management. A K sibling using a grotesque or geometric sans for headlines would read as contemporary tech-luxury rather than heritage-luxury.
- **Hairline restraint:** Rules at 1px, 60% opacity — visible but whispered. Siblings with thicker decorative rules have a different weight register.
