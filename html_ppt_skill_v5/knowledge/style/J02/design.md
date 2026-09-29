# J02 — data-dashboard

**Style ID:** J02
**Family:** J (Technical/Engineering)
**Scheme:** Dark Dashboard
**Mood:** Precise, Dense, Analytical, Authoritative
**Occasion:** Analytics Reporting, Business Intelligence, DevOps Monitoring, Financial Trading, Real-Time Systems
**Academic Fit:** Engineering, Data Science, Operations Research, Quantitative Finance

---

## Design Philosophy (5D)

**Philosophy:** Radiate the confidence of a live monitoring dashboard. Every element earns its pixel through information density; white space is rationed, not given. The aesthetic borrows from Grafana's dark-panel language, Tableau's data trustworthiness, and Bloomberg Terminal's numeric precision — reformatted for presentation rather than interaction.

**Hierarchy:** Data is the hero. Headlines in IBM Plex Sans at high contrast carry the assertion; IBM Plex Mono delivers the numeric evidence directly below. Panel borders and subtle grid-line backgrounds create visual grouping without heavy chrome. A single electric-cyan accent fires for primary KPIs and interactive indicators.

**Detail:** Monospaced numerals via `font-variant-numeric: lining-nums tabular-nums` ensure columns align without manual spacing. Cyan badge tags mark stat units. Amber serves as a secondary signal color for comparisons and delta indicators, never competing with cyan.

**Function:** Slides are information dashboards, not decoration. Three-column stat grids, data tables with alternating row stripes, and sidebar panels with supplementary KPIs mimic the panel layout of BI tools. Tight 4/8 px spacing rhythm maximizes content area on 1920×1080.

**Innovation:** The background carries a subtle grid of `0.5px` rules at `oklch(0.22 0.015 258 / 0.4)` — just visible enough to evoke graph paper without drawing attention. Raised surface panels use a `1px` border at `oklch(0.28 0.018 258)` rather than box-shadows for a crisp, low-noise look consistent with dark monitoring UIs.

---

## Color System (OKLCH CSS Tokens)

```css
:root {
  /* Surfaces */
  --c-base:        oklch(0.10 0.012 258);        /* dark navy base */
  --c-surface:     oklch(0.15 0.015 258);        /* raised panel */
  --c-surface-hi:  oklch(0.18 0.015 258);        /* elevated inner */
  --c-border:      oklch(0.28 0.018 258);        /* panel / table border */
  --c-grid:        oklch(0.22 0.015 258 / 0.4); /* bg grid lines */

  /* Text */
  --c-text-hi:     oklch(0.97 0.006 258);  /* headline / primary */
  --c-text-body:   oklch(0.82 0.010 258);  /* body / label */
  --c-text-muted:  oklch(0.58 0.012 258);  /* secondary / metadata */

  /* Accent — Electric Cyan (primary) */
  --c-cyan:        oklch(0.72 0.18 198);   /* primary accent */
  --c-cyan-dim:    oklch(0.62 0.14 198);   /* hover / softer */
  --c-cyan-bg:     oklch(0.18 0.04 198);   /* tinted panel bg */

  /* Accent — Warm Amber (secondary / delta) */
  --c-amber:       oklch(0.70 0.16 62);    /* secondary accent */
  --c-amber-dim:   oklch(0.60 0.12 62);    /* subdued amber */
  --c-amber-bg:    oklch(0.18 0.04 62);    /* amber tinted bg */

  /* Status palette */
  --c-success:     oklch(0.68 0.15 145);   /* green */
  --c-danger:      oklch(0.62 0.18 25);    /* red */
  --c-warn:        oklch(0.70 0.16 62);    /* reuses amber */
}
```

---

## Typography (Google Fonts CDN)

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

```css
:root {
  /* Font families */
  --ff-label:  'IBM Plex Sans', system-ui, sans-serif;   /* UI labels, body */
  --ff-data:   'IBM Plex Mono', 'Courier New', monospace; /* stats, numbers, code */

  /* Type scale */
  --fs-2xs:   0.625rem;   /* 10px — badge labels */
  --fs-xs:    0.75rem;    /* 12px — table cell, metadata */
  --fs-sm:    0.875rem;   /* 14px — body, aside */
  --fs-base:  1rem;       /* 16px — label default */
  --fs-md:    1.25rem;    /* 20px — stat label */
  --fs-lg:    1.5rem;     /* 24px — section marker */
  --fs-xl:    2rem;       /* 32px — sub-headline */
  --fs-2xl:   2.75rem;    /* 44px — headline */
  --fs-3xl:   3.5rem;     /* 56px — hero stat */
  --fs-hero:  5rem;       /* 80px — title slide display */

  /* Numeric rendering — always tabular */
  --fvn-table: lining-nums tabular-nums;

  /* Line heights */
  --lh-tight:  1.15;
  --lh-snug:   1.3;
  --lh-normal: 1.5;
}
```

**Usage guidance:**
- Titles and headlines: `IBM Plex Sans` Bold/SemiBold
- Stat values: `IBM Plex Mono` SemiBold with `font-variant-numeric: lining-nums tabular-nums`
- Table data: `IBM Plex Mono` Regular for numeric columns, `IBM Plex Sans` for text columns
- Badges/labels: `IBM Plex Sans` Medium, UPPERCASE, letter-spacing 0.08em

---

## Background and Structural Elements (CSS)

```css
/* Grid-line background — evokes monitoring dashboard graph paper */
.slide-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  background-color: var(--c-base);
  background-image:
    linear-gradient(to right,  var(--c-grid) 0.5px, transparent 0.5px),
    linear-gradient(to bottom, var(--c-grid) 0.5px, transparent 0.5px);
  background-size: 40px 40px;
}

/* Raised panel / data card */
.panel {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 4px;
  padding: 20px 24px;
}

/* Section marker bar — thin cyan left border */
.section-marker {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--ff-label);
  font-size: var(--fs-sm);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-cyan);
}
.section-marker::before {
  content: '';
  display: block;
  width: 3px;
  height: 1em;
  background: var(--c-cyan);
  border-radius: 2px;
}

/* Cyan stat badge / unit tag */
.stat-badge {
  display: inline-block;
  background: var(--c-cyan-bg);
  border: 1px solid oklch(0.72 0.18 198 / 0.4);
  color: var(--c-cyan);
  font-family: var(--ff-label);
  font-size: var(--fs-2xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 3px;
}

/* Amber delta badge */
.delta-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--c-amber-bg);
  border: 1px solid oklch(0.70 0.16 62 / 0.4);
  color: var(--c-amber);
  font-family: var(--ff-data);
  font-size: var(--fs-xs);
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 3px;
  font-variant-numeric: lining-nums tabular-nums;
}

/* Horizontal divider — subtle */
.h-rule {
  border: none;
  border-top: 1px solid var(--c-border);
  margin: 0;
}

/* Slide folio */
.slide-folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--ff-data);
  font-size: var(--fs-xs);
  color: var(--c-text-muted);
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: 0.08em;
}
```

---

## Layout Patterns (ASCII Diagram)

### Slide 1 — Title / Overview
```
┌─────────────────────────────────────────────────────┐
│  [SECTION MARKER]              [logo area]          │ <- top 60px bar
├─────────────────────────────────────────────────────┤
│                                                     │
│  [PLATFORM NAME — display text]                     │ <- hero name
│  [Full A-E sentence headline — 2-3 lines]           │ <- headline
│  [Abstract 1]  [Abstract 2]                         │ <- 2-col body
│                                                     │
│ ┌──────┬──────┬──────┬──────┐                       │
│ │ COL  │ COL  │ COL  │ COL  │                       │ <- 4-col detail row
│ │ data │ data │ data │ data │                       │
│ └──────┴──────┴──────┴──────┘                       │
│                                                [1/3]│ <- folio
└─────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence / Stats + Aside
```
┌─────────────────────────────────────────────────────┐
│  [SECTION MARKER]                                   │
│  [A-E headline — 2 lines]                           │
├──────────────────────────┬──────────────────────────┤
│  ┌────┐  ┌────┐  ┌────┐  │  ┌──────────────────┐   │
│  │STAT│  │STAT│  │STAT│  │  │ ASIDE PANEL      │   │
│  │ #  │  │ #  │  │ #  │  │  │ supplementary    │   │
│  └────┘  └────┘  └────┘  │  │ KPI + text       │   │
│  [evidence paragraph]    │  └──────────────────┘   │
│                          │                         │
└──────────────────────────┴─────────────────────────┘
                                                 [2/3]
```

### Slide 3 — Comparison Table
```
┌─────────────────────────────────────────────────────┐
│  [SECTION MARKER]                                   │
│  [A-E headline — 2 lines]                           │
│  ┌───────────────────────────────────────────────┐  │
│  │ COL HDR │ COL HDR │ COL HDR │ COL HDR │ COL  │  │
│  ├─────────┼─────────┼─────────┼─────────┼──────┤  │
│  │ row 1   │         │         │         │      │  │
│  │ ROW 2*  │ ██████  │ ██████  │ ██████  │ ████ │  │ <- highlighted
│  │ row 3   │         │         │         │      │  │
│  │ row 4   │         │         │         │      │  │
│  │ row 5   │         │         │         │      │  │
│  └───────────────────────────────────────────────┘  │
│  [footnote text]                              [3/3] │
└─────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat Column
```css
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px 24px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-top: 2px solid var(--c-cyan);
  border-radius: 4px;
  min-width: 200px;
}
.stat-col .stat-value {
  font-family: var(--ff-data);
  font-size: var(--fs-3xl);
  font-weight: 600;
  color: var(--c-text-hi);
  line-height: 1;
  font-variant-numeric: lining-nums tabular-nums;
}
.stat-col .stat-label {
  font-family: var(--ff-label);
  font-size: var(--fs-sm);
  color: var(--c-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
}
```

### Data Table
```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--ff-label);
  font-size: var(--fs-sm);
}
.data-table th {
  background: var(--c-surface-hi);
  color: var(--c-text-muted);
  font-weight: 600;
  font-size: var(--fs-xs);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  padding: 10px 16px;
  text-align: left;
  border-bottom: 1px solid var(--c-border);
}
.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid oklch(0.22 0.015 258 / 0.5);
  color: var(--c-text-body);
  vertical-align: middle;
}
.data-table td.numeric {
  font-family: var(--ff-data);
  font-variant-numeric: lining-nums tabular-nums;
  text-align: right;
}
.data-table tr.highlight-row td {
  background: oklch(0.72 0.18 198 / 0.08);
  border-top: 1px solid oklch(0.72 0.18 198 / 0.3);
  border-bottom: 1px solid oklch(0.72 0.18 198 / 0.3);
  color: var(--c-text-hi);
  font-weight: 600;
}
```

### Folio
```css
.slide-folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--ff-data);
  font-size: 11px;
  color: var(--c-text-muted);
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: 0.06em;
}
```

---

## Print/Export Mode

```css
@media print {
  .slide-bg {
    background-color: #fff !important;
    background-image: none !important;
  }
  :root {
    --c-base:       #ffffff;
    --c-surface:    #f5f5f5;
    --c-border:     #cccccc;
    --c-text-hi:    #0a0a0a;
    --c-text-body:  #333333;
    --c-text-muted: #666666;
    --c-cyan:       #0077aa;
    --c-amber:      #b05800;
  }
  .nav-bar { display: none !important; }
}
```

---

## Accessibility (Contrast Ratios)

| Token pair | Approx. ratio | WCAG |
|---|---|---|
| `--c-text-hi` on `--c-base` | ~18:1 | AAA |
| `--c-text-body` on `--c-base` | ~9:1 | AAA |
| `--c-text-muted` on `--c-base` | ~4.6:1 | AA |
| `--c-cyan` on `--c-base` | ~7.2:1 | AA large |
| `--c-amber` on `--c-base` | ~5.8:1 | AA |
| `--c-text-hi` on `--c-surface` | ~14:1 | AAA |
| `--c-cyan` on `--c-surface` | ~5.9:1 | AA |

All body text and UI labels meet WCAG AA. Numeric data in Mono meets AA at any used size. Color is never the sole differentiator — table row highlights include weight and border changes; badge states include border+bg+text together.

---

## Differentiators from Sibling Styles (J Family)

| Trait | J02 data-dashboard | J01 (technical-blueprint) | J03 (hypothetical terminal) |
|---|---|---|---|
| Background | Dark navy + grid lines | Light paper + blueprint grid | Pure black + scanlines |
| Primary accent | Electric cyan | Blueprint blue | Green phosphor |
| Font pair | IBM Plex Mono + Sans | Source Code Pro + Roboto | Space Mono |
| Density | Very high — dashboard panels | Medium — diagram-first | High — CLI output |
| Data surface | Raised panels + border-top accent | Flat rows + dividers | Bordered box-drawing |
| Best for | BI, analytics, monitoring | System architecture, ops | Devops CLI output, code |
