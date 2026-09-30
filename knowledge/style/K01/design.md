# K01 — monochrome-luxury

**Style ID:** K01  
**Family:** K — Premium/Luxury  
**Scheme:** Pure Monochrome  
**Mood:** Still, authoritative, restrained, editorial  
**Occasion:** Luxury brand identity, ultra-prime real estate, high fashion, premium lifestyle, private wealth management, family office presentations  
**Academic Fit:** Low — better suited to corporate and brand contexts; acceptable for design theory or art history lectures  

---

## Design Philosophy (5D)

**Philosophy:** The restraint IS the luxury. Inspired by high-end fashion photography and marque brand identity systems such as Chanel and Loro Piana, this style treats negative space as the primary design material. Every element earns its place through the rigorous removal of everything unnecessary. Color accent is zero — the chromatic silence signals confidence.

**Hierarchy:** Hierarchy is communicated exclusively through scale, weight, and spatial interval. Headlines are oversized and light-weight (Cormorant Garamond at optical-display size, weight 300). Data is set in Jost 300, upright. Section markers are small caps with tracked spacing. No colored rule, no icon, no badge communicates importance — only position and proportion.

**Detail:** The only structural ornament is a single 1 px solid `oklch(0.10 0 0)` horizontal rule — used above stat values as an accent separator, and as the sole page-level divider between zones. Stat values use `font-variant-numeric: lining-nums tabular-nums` throughout.

**Function:** Stillness supports reading. There is no animation in K01 — motion is absent by principle, not by fallback. `prefers-reduced-motion` is trivially satisfied because no keyframes exist. Slide folio anchors orientation. The nav bar is the only interactive chrome.

**Innovation:** Ultra-high-contrast editorial serif (Cormorant) paired with a geometric grotesque at minimum weight (Jost 300) creates a tension between archaic and industrial that reads as contemporary luxury. The combination is rare in presentation design; its closest analogs are found in print editorial and luxury packaging.

---

## Color System (OKLCH CSS tokens)

```css
:root {
  /* --- Base Pair --- */
  --c-bg:          oklch(0.99 0 0);   /* near-white — field */
  --c-ink:         oklch(0.10 0 0);   /* near-black — primary text, rules */

  /* --- Grey Ramp (7 steps, zero chroma) --- */
  --c-grey-95:     oklch(0.95 0 0);   /* very light — subtle tint */
  --c-grey-85:     oklch(0.85 0 0);   /* light — inactive dot, aside bg */
  --c-grey-70:     oklch(0.70 0 0);   /* mid-light — muted body, captions */
  --c-grey-55:     oklch(0.55 0 0);   /* mid — secondary labels */
  --c-grey-40:     oklch(0.40 0 0);   /* mid-dark — subheads, table body */
  --c-grey-25:     oklch(0.25 0 0);   /* dark — emphasis, table header row */
  --c-grey-15:     oklch(0.15 0 0);   /* near-ink — folio, footnotes */

  /* --- Semantic Aliases --- */
  --c-surface:      var(--c-bg);
  --c-surface-alt:  var(--c-grey-95);
  --c-border:       var(--c-grey-85);
  --c-rule:         var(--c-ink);
  --c-text-primary: var(--c-ink);
  --c-text-body:    var(--c-grey-25);
  --c-text-muted:   var(--c-grey-55);
  --c-text-caption: var(--c-grey-70);
  --c-dot-active:   var(--c-ink);
  --c-dot-idle:     var(--c-grey-70);

  /* --- Zero accent --- */
  /* No accent hue. Emphasis is structural only. */
}
```

---

## Typography (Google Fonts CDN import, CSS vars, scale comments)

```html
<!-- Google Fonts CDN — OFL licensed -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@200;300;400&display=swap" rel="stylesheet">
```

```css
:root {
  /* --- Font Families --- */
  --f-display:  'Cormorant Garamond', Georgia, serif;
  --f-body:     'Jost', system-ui, sans-serif;

  /* --- Type Scale (1920×1080 stage) --- */
  /* Display — slide headline, A-E sentence */
  --t-display:  clamp(36px, 3.8vw, 72px);
  --t-display-lh: 1.08;
  --t-display-ls: -0.01em;

  /* Title — slide 1 hero */
  --t-hero:     clamp(52px, 5.5vw, 96px);
  --t-hero-lh:  1.05;

  /* Stat — large numeric value */
  --t-stat:     clamp(44px, 4.8vw, 88px);
  --t-stat-lh:  1.0;

  /* Section marker — eyebrow label */
  --t-eyebrow:  11px;
  --t-eyebrow-ls: 0.22em;

  /* Body — evidence paragraph */
  --t-body:     16px;
  --t-body-lh:  1.72;

  /* Caption / footnote */
  --t-caption:  12px;
  --t-caption-lh: 1.6;

  /* Table cell */
  --t-table:    14px;
  --t-table-lh: 1.5;

  /* Folio */
  --t-folio:    11px;
  --t-folio-ls: 0.14em;

  /* Numeric variant — apply on all stat and table numbers */
  --t-numeric:  lining-nums tabular-nums;
}

/* Utility class */
.num { font-variant-numeric: lining-nums tabular-nums; }
```

---

## Background and Structural Elements (CSS)

```css
/* Deck stage */
.stage {
  width: 1920px;
  height: 1080px;
  background: var(--c-bg);
  position: relative;
  overflow: hidden;
}

/* Primary structural rule */
.rule-h {
  display: block;
  width: 100%;
  height: 1px;
  background: var(--c-rule);
  border: none;
}

/* Rule above stat value — stat accent */
.stat-rule {
  display: block;
  width: 40px;
  height: 1px;
  background: var(--c-ink);
  margin-bottom: 20px;
}

/* Thin border — aside panel, table outline */
.border-thin {
  border: 1px solid var(--c-border);
}

/* Section divider — generous whitespace + 1 px rule */
.section-divider {
  margin: 0 120px;
  height: 1px;
  background: var(--c-grey-85);
}

/* Aside panel */
.aside-panel {
  background: var(--c-grey-95);
  border-left: 1px solid var(--c-grey-85);
  padding: 48px 48px;
}
```

---

## Layout Patterns (ASCII diagram)

### Slide 1 — Title

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│   [LOGO / FUND NAME]            top-left 120px, 64px         │
│                                                              │
│   ─────────────────────────────────────── (rule, y≈180)      │
│                                                              │
│                                                              │
│         HERO HEADLINE                                        │
│         (Cormorant 96px, weight 300, col 120–1560)           │
│                                                              │
│         Abstract line 1. (Jost 300, 18px, grey-40)          │
│         Abstract line 2.                                     │
│                                                              │
│   ─────────────────────────────────────── (rule, y≈780)      │
│                                                              │
│   [COL1]    [COL2]    [COL3]    [COL4]  (4-col detail row)   │
│   Label     Label     Label     Label                        │
│   Value     Value     Value     Value                        │
│                                                              │
│                                         [folio]  ①           │
└──────────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence + Aside

```
┌───────────────────────────────────┬──────────────────────────┐
│  [EYEBROW]                        │                          │
│  ──────────────────               │  ASIDE PANEL             │
│  HEADLINE (Cormorant display)     │  ┌──────────────────┐   │
│                                   │  │  Stat            │   │
│  ─── STAT1    ─── STAT2    ─── ST3│  │  ──────          │   │
│  Value        Value        Value  │  │  Value           │   │
│  Label        Label        Label  │  │  subtext         │   │
│                                   │  └──────────────────┘   │
│  Evidence paragraph body text     │                          │
│  (Jost 300 16px, measure ~65ch)   │  Additional note text    │
│                                   │                          │
│                                                [folio]  ②   │
└───────────────────────────────────┴──────────────────────────┘
  ← main col: 1200px →                ← aside: 540px →
  left edge: 120px                    right edge: 120px
```

### Slide 3 — Comparison Table

```
┌──────────────────────────────────────────────────────────────┐
│  [EYEBROW]                                                   │
│  HEADLINE (Cormorant display, 2 lines)                       │
│                                                              │
│  ─────────────────────────────────────── (rule under head)   │
│  ┌──────────────┬────────┬────────┬────────┬────────┬──────┐ │
│  │ Structure    │ Net    │ Volat. │ Liquid.│ Tax    │ K01  │ │  ← header row (grey-25 bg)
│  ├──────────────┼────────┼────────┼────────┼────────┼──────┤ │
│  │ Direct Own.  │ 12.3%  │ Low    │ Low    │ Eff.   │ ★    │ │  ← highlighted row (grey-95)
│  │ REIT         │  8.1%  │ High   │ High   │ Pass.  │      │ │
│  │ Synd. Debt   │  7.4%  │ Med    │ Med    │ Struct.│      │ │
│  │ Disc. Fund   │  6.9%  │ Low    │ Low    │ Fund   │      │ │
│  │ Listed Equit.│  5.2%  │ High   │ High   │ Pass.  │      │ │
│  └──────────────┴────────┴────────┴────────┴────────┴──────┘ │
│                                                              │
│  * Footnote text (Jost 300, 12px, grey-55)                  │
│                                                              │
│                                         [folio]  ③           │
└──────────────────────────────────────────────────────────────┘
```

---

## Component Tokens (stat columns, table, folio CSS)

```css
/* ── Stat Column ── */
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 0;
  min-width: 200px;
}
.stat-col .stat-rule {
  width: 40px;
  height: 1px;
  background: var(--c-ink);
  margin-bottom: 20px;
  flex-shrink: 0;
}
.stat-col .stat-value {
  font-family: var(--f-display);
  font-size: var(--t-stat);
  font-weight: 300;
  line-height: var(--t-stat-lh);
  color: var(--c-ink);
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: -0.02em;
}
.stat-col .stat-label {
  font-family: var(--f-body);
  font-size: 13px;
  font-weight: 300;
  color: var(--c-text-muted);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-top: 12px;
}

/* ── Comparison Table ── */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--f-body);
  font-size: var(--t-table);
  font-weight: 300;
  color: var(--c-text-body);
  font-variant-numeric: lining-nums tabular-nums;
}
.data-table thead tr {
  background: var(--c-grey-25);
  color: var(--c-bg);
}
.data-table thead th {
  padding: 14px 24px;
  text-align: left;
  font-weight: 300;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  font-size: 11px;
  border: none;
}
.data-table tbody tr {
  border-bottom: 1px solid var(--c-border);
}
.data-table tbody tr.row-highlight {
  background: var(--c-grey-95);
  color: var(--c-ink);
  font-weight: 400;
}
.data-table tbody td {
  padding: 16px 24px;
  vertical-align: middle;
}
.data-table tbody td:first-child {
  color: var(--c-ink);
}

/* ── Slide Folio ── */
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--f-body);
  font-size: var(--t-folio);
  font-weight: 300;
  letter-spacing: var(--t-folio-ls);
  color: var(--c-text-caption);
  text-transform: uppercase;
  font-variant-numeric: lining-nums tabular-nums;
}

/* ── Eyebrow / Section marker ── */
.eyebrow {
  font-family: var(--f-body);
  font-size: var(--t-eyebrow);
  font-weight: 300;
  letter-spacing: var(--t-eyebrow-ls);
  text-transform: uppercase;
  color: var(--c-text-muted);
  margin-bottom: 24px;
}
```

---

## Print/Export Mode

```css
@media print {
  body { background: white; }
  .nav-bar { display: none !important; }
  .slide { display: flex !important; page-break-after: always; }
  .stage { transform: none !important; width: 100%; height: auto; }

  /* Ensure rules print at 1px */
  .rule-h, .stat-rule { print-color-adjust: exact; -webkit-print-color-adjust: exact; }

  /* Table header needs background */
  .data-table thead tr { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
}
```

---

## Accessibility (contrast ratios)

All ratios calculated against `--c-bg` oklch(0.99 0 0) ≈ #FCFCFC unless noted.

| Token pair | Approx ratio | WCAG level |
|---|---|---|
| `--c-ink` on `--c-bg` | 19.4 : 1 | AAA |
| `--c-grey-25` on `--c-bg` | 10.5 : 1 | AAA |
| `--c-grey-40` on `--c-bg` | 6.8 : 1 | AA |
| `--c-grey-55` on `--c-bg` | 4.6 : 1 | AA |
| `--c-grey-70` on `--c-bg` | 3.2 : 1 | AA large (≥18px) |
| `--c-bg` on `--c-grey-25` (table header) | 10.5 : 1 | AAA |
| `--c-ink` on `--c-grey-95` (aside/highlight) | 18.1 : 1 | AAA |

Note: `--c-grey-70` used only for captions at 12 px is marginal at 3.2 : 1; meets AA for large text and is acceptable for decorative captions. Upgrade to `--c-grey-55` for body contexts if stricter compliance is needed.

**No animation** — `prefers-reduced-motion` trivially satisfied.  
**Focus rings** — nav buttons use `outline: 1.5px solid var(--c-ink)` with 2 px offset on `:focus-visible`.  
**ARIA** — slides use `role="region"` with `aria-label`; nav dots use `aria-label="Go to slide N"` and `aria-pressed`.  

---

## Differentiators from sibling K-family styles

| Dimension | K01 monochrome-luxury | Expected K02+ |
|---|---|---|
| Accent color | Zero — pure achromatic | At least one OKLCH hue |
| Animation | None by principle | Likely subtle entrances |
| Display font | Cormorant Garamond (editorial serif) | May use sans or slab |
| Mood | Still, fashion-editorial | Varies |
| Target context | Ultra-prime RE, luxury brand | Broadened premium |
| Structural ornament | 1 px horizontal rule only | May add geometric motifs |

---

## Fixed-stage content fit

The vw / clamp(...vw...) type values above are preview references. For a generated 1920×1080 deck, use fixed pixel type tokens and let the stage transform handle window scaling; otherwise text shrinks twice. Essential body copy follows knowledge/element/elements.md (normally 28–36px for speaker slides). Shorten copy, change layout, move explanation into speaker notes, or split the slide before reducing type size.
