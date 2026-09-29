# I04 — soft-bento

| Field | Value |
|---|---|
| Style ID | I04 |
| Family | I — Texture / Organic |
| Scheme | Soft warm pastel, bento-grid |
| Mood | Calm, friendly, approachable, grounded |
| Occasion | Product design reviews, SaaS pitches, edtech demos, wellness apps, startup decks |
| Academic Fit | Moderate — suited to edtech, learning science, UX research, product-led growth |

---

## Design Philosophy

**Philosophy** — Soft-bento draws from the "bento UI" design trend: information arranged as a grid of distinct, well-padded cards that feel like compartments in a lunch box. Each card holds exactly one idea. Nothing overflows, nothing crowds. The palette is warm off-white with sage green accents, evoking calm productivity without clinical coldness.

**Hierarchy** — Size hierarchy is gentle. The headline card spans full width or two-thirds. Evidence cards share a row with equal weight. A single highlighted cell or pill carries the most visual emphasis on each slide. There are no bold-italic combos or dramatic size jumps — everything lands one deliberate step above the last.

**Detail** — Borders are soft (1px, low-opacity warm tone). Rounded corners 16–24px everywhere — inner cards 16px, outer stage container 24px. Shadows are barely there: `0 2px 12px oklch(0.18 0.008 55 / 0.08)`. Stat pills are small rounded badges with the accent background. Table cells get even padding and a gentle alternating tint.

**Function** — Display:none / display:flex slide switching keeps transitions instant (no motion). Folio is position:absolute bottom-right. The nav pill floats at bottom-center. Keyboard nav is fully wired. The ?preview=N param hides the nav bar for embed contexts.

**Innovation** — The bento grid itself is the differentiator: each content type maps to a named card size (headline-card, stat-card, aside-card, table-card) making layouts composable. The "pill badge" stat accent replaces the big-number approach of other styles with a contained, readable label+value unit.

---

## Color System

All tokens in OKLCH. Copy these as CSS custom properties.

```css
:root {
  /* --- Surfaces --- */
  --bg-page:        oklch(0.97 0.008 65);   /* warm off-white page/stage bg */
  --bg-card:        oklch(0.99 0.004 70);   /* card fill — slightly lighter */
  --bg-card-alt:    oklch(0.95 0.010 65);   /* alternate card, section marker */
  --bg-accent-pill: oklch(0.90 0.045 155);  /* sage pill badge bg */
  --bg-table-row:   oklch(0.96 0.006 65);   /* table alternate row tint */
  --bg-row-hl:      oklch(0.91 0.040 155);  /* highlighted table row */

  /* --- Text --- */
  --text-heading:   oklch(0.22 0.012 50);   /* warm dark brown-black */
  --text-body:      oklch(0.32 0.010 52);   /* body text, slightly lighter */
  --text-muted:     oklch(0.52 0.008 55);   /* captions, labels, footnotes */
  --text-accent:    oklch(0.30 0.080 155);  /* sage-tinted text on light bg */
  --text-on-pill:   oklch(0.18 0.060 155);  /* text inside sage pill */

  /* --- Accent / Sage green --- */
  --accent:         oklch(0.58 0.12 155);   /* primary accent */
  --accent-mid:     oklch(0.72 0.09 155);   /* softer accent for borders */
  --accent-light:   oklch(0.90 0.045 155);  /* light tint (pill bg) */

  /* --- Borders --- */
  --border-card:    oklch(0.88 0.010 60);   /* card border, warm neutral */
  --border-accent:  oklch(0.75 0.07 155);   /* accent border for highlight row */
  --border-table:   oklch(0.90 0.008 60);   /* table inner lines */

  /* --- Folio & nav --- */
  --folio-text:     oklch(0.60 0.008 55);
  --nav-bg:         oklch(0.99 0.004 70 / 0.92);
  --nav-border:     oklch(0.88 0.010 60);
  --dot-active:     oklch(0.58 0.12 155);
  --dot-idle:       oklch(0.80 0.020 60);
}
```

### Accessibility Contrast Ratios

| Pair | Approx. Ratio | WCAG |
|---|---|---|
| `--text-heading` on `--bg-page` | ~14:1 | AAA |
| `--text-body` on `--bg-card` | ~9:1 | AAA |
| `--text-muted` on `--bg-page` | ~4.8:1 | AA |
| `--text-on-pill` on `--bg-accent-pill` | ~6:1 | AA |
| `--text-accent` on `--bg-card` | ~5.5:1 | AA |

---

## Typography

```html
<!-- Google Fonts CDN — OFL licensed -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

```css
:root {
  --font-sans: 'Nunito', system-ui, sans-serif;

  /* Type scale — ratio ~1.25 */
  --text-xs:   0.75rem;   /* 12px — folio, fine print */
  --text-sm:   0.875rem;  /* 14px — table cells, captions */
  --text-base: 1rem;      /* 16px — body, aside */
  --text-lg:   1.125rem;  /* 18px — stat labels, sub-heads */
  --text-xl:   1.375rem;  /* 22px — section markers, slide sub-title */
  --text-2xl:  1.75rem;   /* 28px — stat values */
  --text-3xl:  2.25rem;   /* 36px — slide headline */
  --text-4xl:  3rem;      /* 48px — title slide main headline */

  --leading-tight:  1.25;
  --leading-normal: 1.55;
  --leading-loose:  1.70;

  --font-numeric: 'Nunito', system-ui, sans-serif;
  --numeric-feat: lining-nums tabular-nums;  /* applied to all stat values */
}
```

Nunito's rounded letterforms reinforce the soft-bento aesthetic. Use weight 700–800 for headlines, 600 for sub-heads and labels, 400–500 for body.

---

## Background and Structural Elements

```css
/* Stage — fixed 1920×1080 canvas */
.slide-stage {
  width: 1920px;
  height: 1080px;
  background-color: var(--bg-page);
  position: relative;
  overflow: hidden;
  font-family: var(--font-sans);
  color: var(--text-body);
}

/* Subtle warm dot-grid texture — pure CSS, no image */
.slide-stage::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  background-image: radial-gradient(
    circle,
    oklch(0.82 0.010 60 / 0.55) 1px,
    transparent 1px
  );
  background-size: 32px 32px;
  pointer-events: none;
}

/* All semantic content above texture */
.slide-content {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

/* Bento card base */
.bento-card {
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: 20px;
  box-shadow: 0 2px 12px oklch(0.18 0.008 55 / 0.08);
  padding: 36px 40px;
  box-sizing: border-box;
}

/* Bento card — accent tint variant */
.bento-card--tint {
  background: var(--bg-card-alt);
}

/* Bento card — accent border */
.bento-card--accent {
  border-color: var(--border-accent);
  background: oklch(0.96 0.018 155);
}
```

---

## Layout Patterns

### Slide 1 — Title

```
┌──────────────────────────────────────────────────────┐
│  [logo/org label — top-left]                         │
│                                                       │
│  ┌────────────────────────────────────────────────┐  │
│  │  HEADLINE (2–3 lines, weight 800, text-4xl)    │  │
│  └────────────────────────────────────────────────┘  │
│                                                       │
│  ┌──────────────────┐  abstract text (2 sentences)   │
│  │  section label   │                                 │
│  └──────────────────┘                                 │
│                                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐  │
│  │ detail 1 │ │ detail 2 │ │ detail 3 │ │ det. 4 │  │
│  └──────────┘ └──────────┘ └──────────┘ └────────┘  │
│                                              [folio] │
└──────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence

```
┌──────────────────────────────────────────────────────┐
│  [section marker pill]                                │
│  HEADLINE (full sentence, weight 700, text-3xl)       │
│                                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐              │
│  │ stat 1   │ │ stat 2   │ │ stat 3   │  ┌─────────┐ │
│  │ [pill]   │ │ [pill]   │ │ [pill]   │  │  aside  │ │
│  └──────────┘ └──────────┘ └──────────┘  │  panel  │ │
│  evidence paragraph (body text)           └─────────┘ │
│                                              [folio] │
└──────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison Table

```
┌──────────────────────────────────────────────────────┐
│  [section marker pill]                                │
│  HEADLINE (full sentence, weight 700, text-3xl)       │
│                                                       │
│  ┌──────────────────────────────────────────────────┐ │
│  │ comparison table (5 rows × 5-6 cols)             │ │
│  │  highlighted row = best performer                │ │
│  └──────────────────────────────────────────────────┘ │
│                                                       │
│  footnote text                            [folio]    │
└──────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat Pill Badge

```css
.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--bg-accent-pill);
  color: var(--text-on-pill);
  border-radius: 999px;
  padding: 6px 16px;
  font-size: var(--text-sm);
  font-weight: 700;
  font-variant-numeric: var(--numeric-feat);
  letter-spacing: 0.01em;
  border: 1px solid var(--border-accent);
}

.stat-value {
  font-size: var(--text-2xl);
  font-weight: 800;
  color: var(--text-heading);
  font-variant-numeric: lining-nums tabular-nums;
  line-height: 1.1;
  display: block;
  margin-bottom: 6px;
}

.stat-label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-muted);
  line-height: var(--leading-normal);
}
```

### Comparison Table

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
  font-variant-numeric: lining-nums tabular-nums;
}
.data-table th {
  background: var(--bg-card-alt);
  color: var(--text-muted);
  font-weight: 700;
  text-transform: uppercase;
  font-size: var(--text-xs);
  letter-spacing: 0.06em;
  padding: 14px 20px;
  text-align: left;
  border-bottom: 1px solid var(--border-table);
}
.data-table td {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-table);
  color: var(--text-body);
}
.data-table tr:nth-child(even) td {
  background: var(--bg-table-row);
}
.data-table tr.row-highlight td {
  background: var(--bg-row-hl);
  color: var(--text-on-pill);
  font-weight: 700;
  border-left: 3px solid var(--accent);
}
```

### Slide Folio

```css
.slide-folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-size: var(--text-xs);
  color: var(--folio-text);
  font-weight: 600;
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: 0.04em;
  z-index: 2;
}
```

### Section Marker Pill

```css
.section-marker {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-accent-pill);
  border: 1px solid var(--border-accent);
  border-radius: 999px;
  padding: 6px 18px;
  font-size: var(--text-sm);
  font-weight: 700;
  color: var(--text-on-pill);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  margin-bottom: 20px;
}
```

---

## Print/Export Mode

```css
@media print {
  .nav-bar { display: none !important; }
  .slide { display: flex !important; page-break-after: always; }
  .slide-stage::before { display: none; }
  .bento-card { box-shadow: none; border-color: oklch(0.75 0.008 60); }
}
```

---

## Accessibility

- All interactive nav elements carry `aria-label` and `role="button"` or native `<button>`.
- Dot indicators include `aria-label="Go to slide N"` and `aria-current="true"` on the active dot.
- Color contrast verified at WCAG AA or better for all text/background pairs (see Color System table).
- No information is conveyed by color alone — stat values carry text labels; table highlight row carries a left border.
- Keyboard navigation: ArrowRight/Down/Space = next; ArrowLeft/Up = prev; supported from `keydown` on `window`.
- `prefers-reduced-motion` removes any transition/animation (none present in this style by design).
- Font-variant-numeric: lining-nums tabular-nums applied to all numeric display elements.
- Background texture layer at z-index 0; all semantic content at z-index 1+.

---

## Differentiators from Sibling Styles (Family I)

| Dimension | I04 soft-bento | Other I-family styles |
|---|---|---|
| Layout paradigm | Bento grid — named card slots | Organic free-form / editorial columns |
| Corners | Aggressive rounding (16–24px) | Varies |
| Stat display | Pill badge (contained value+label) | Large standalone numbers |
| Motion | None — calm by design | May include subtle scroll or fade |
| Texture | Subtle dot-grid on stage bg | Noise, grain, or watercolor washes |
| Font | Nunito (rounded, friendly) | Variable; often serif or display |
| Occasion | Product/SaaS/edtech | Varies by sub-style |
