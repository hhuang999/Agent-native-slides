# J01 — terminal-monochrome

**Style ID:** J01
**Family:** J (Technical/Engineering)
**Scheme:** Monochrome — terminal green on near-black
**Mood:** Precise, austere, technical, high-contrast
**Occasion:** Developer talks, CLI tools, security research, low-level systems, DevOps, vulnerability disclosure
**Academic Fit:** Computer science, cybersecurity, systems programming, operating systems research

---

## Design Philosophy (5D)

**Philosophy:** Every element is a terminal artifact. Type is rendered output. Backgrounds are CRT glass. No decoration exists that a console would not produce. Authority comes from precision, not ornamentation.

**Hierarchy:** Monospaced type enforces visual equality; hierarchy is communicated only through size, brightness, and indentation — exactly as a terminal does. Headlines are bright green. Secondary information is dimmer green. Background is near-black.

**Detail:** CRT scanline overlay via repeating linear gradient creates depth without color. Subtle glow on key numbers echoes phosphor emission. All punctuation carries meaning.

**Function:** This style is designed for audiences who read terminals for a living. Noise is a bug. Every pixel is signal or it is removed.

**Innovation:** Applies terminal aesthetics at presentation scale — full 1920×1080 phosphor cinema — while maintaining strict two-hue discipline. No gradient washes, no decorative icons, no imagery.

---

## Color System (OKLCH CSS tokens)

```css
:root {
  /* Surface */
  --color-bg:           oklch(0.07 0 0);        /* near-black terminal glass */
  --color-surface:      oklch(0.10 0 0);        /* raised panel, slightly lighter */
  --color-border:       oklch(0.18 0.04 142);   /* dim green border */
  --color-scanline:     oklch(0.05 0 0);        /* scanline stripe, darker than bg */

  /* Text — green only */
  --color-text-primary: oklch(0.75 0.22 142);   /* bright terminal green — headlines */
  --color-text-body:    oklch(0.65 0.16 142);   /* standard output text */
  --color-text-muted:   oklch(0.45 0.08 142);   /* dim green — labels, captions */
  --color-text-faint:   oklch(0.30 0.05 142);   /* very dim — footnote, metadata */

  /* Accent */
  --color-accent:       oklch(0.75 0.22 142);   /* same as primary — green highlight */
  --color-accent-under: oklch(0.60 0.18 142);   /* underline on stat accent */
  --color-accent-glow:  oklch(0.75 0.22 142 / 0.15); /* phosphor glow behind key numbers */

  /* Semantic — no new hues, brightness only */
  --color-row-highlight: oklch(0.12 0.04 142);  /* highlighted table row */
  --color-tag-bg:        oklch(0.14 0.05 142);  /* inline tag / badge background */
}
```

---

## Typography (Google Fonts CDN)

```html
<!-- OFL font, Google Fonts CDN -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,100..800;1,100..800&display=swap" rel="stylesheet">
```

```css
:root {
  /* Font stack — monospace only */
  --font-mono: 'JetBrains Mono', 'Fira Mono', 'Consolas', monospace;

  /* Scale — px at 1920px stage */
  --text-xs:    14px;   /* footnote, folio */
  --text-sm:    16px;   /* muted labels, table cells */
  --text-base:  20px;   /* body copy, evidence paragraph */
  --text-md:    24px;   /* aside stat label, column label */
  --text-lg:    32px;   /* section marker, aside stat number */
  --text-xl:    44px;   /* stat column numbers */
  --text-2xl:   56px;   /* subtitle / abstract */
  --text-3xl:   72px;   /* headline font size */
  --text-title: 96px;   /* slide 1 title — dominant */

  /* Leading */
  --leading-tight:  1.15;
  --leading-normal: 1.5;
  --leading-loose:  1.7;

  /* Numeric rendering */
  font-variant-numeric: lining-nums tabular-nums;
}

/* Apply globally */
body {
  font-family: var(--font-mono);
  font-variant-numeric: lining-nums tabular-nums;
  -webkit-font-smoothing: antialiased;
}
```

---

## Background and Structural Elements (CSS)

```css
/* CRT scanline overlay — repeating horizontal stripes */
.slide {
  background-color: var(--color-bg);
  position: relative;
}

.slide::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 3px,
    var(--color-scanline) 3px,
    var(--color-scanline) 4px
  );
  opacity: 0.35;
}

/* All semantic content above scanline */
.slide > * {
  position: relative;
  z-index: 1;
}

/* Horizontal rule — terminal separator */
.rule {
  border: none;
  border-top: 1px solid var(--color-border);
  margin: 0;
}

/* Terminal prompt prefix on section markers */
.section-marker::before {
  content: '> ';
  color: var(--color-text-muted);
}

/* Phosphor glow on key numbers */
.stat-number {
  text-shadow: 0 0 24px var(--color-accent-glow);
}

@media (prefers-reduced-motion: reduce) {
  /* No animations in this style — scanline is static */
}
```

---

## Layout Patterns (ASCII diagram)

### Slide 1 — Title

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  [top padding ~160px]                                                        │
│                                                                              │
│  HEADLINE TEXT                                                    [96px bold]│
│  (2 lines max, bright green)                                                 │
│                                                                              │
│  ──────────────────────────────────────────────────────────────             │
│                                                                              │
│  Abstract sentence one. Abstract sentence two.              [20px body]     │
│                                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐                    │
│  │  LABEL   │  │  LABEL   │  │  LABEL   │  │  LABEL   │  [4-col detail]    │
│  │  value   │  │  value   │  │  value   │  │  value   │  [muted text]      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘                    │
│                                                            folio: bottom-R  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence + Aside

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  > SECTION MARKER                                [section-marker, muted]    │
│  Headline sentence (bright green, 48px, 2 lines)                            │
│  ──────────────────────────────────────────────────────────────             │
│                                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │  ┌───────────────────────┐   │
│  │  STAT#   │  │  STAT#   │  │  STAT#   │  │  │  aside stat number    │   │
│  │  label   │  │  label   │  │  label   │  │  │  aside label          │   │
│  └──────────┘  └──────────┘  └──────────┘  │  │                       │   │
│                                             │  │  aside body text      │   │
│  evidence paragraph body text (20px)        │  └───────────────────────┘   │
│                                                            folio: bottom-R  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison Table

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  > SECTION MARKER                                                            │
│  Headline sentence (bright green, 48px, 2 lines)                            │
│  ──────────────────────────────────────────────────────────────             │
│                                                                              │
│  ┌──────────┬────────┬────────┬────────┬────────┬────────┐                  │
│  │ Strategy │ Col B  │ Col C  │ Col D  │ Col E  │ Col F  │  [header row]   │
│  ├──────────┼────────┼────────┼────────┼────────┼────────┤                  │
│  │ row 1    │        │        │        │        │        │                  │
│  │ ROW 2 ★  │ ██████ │        │        │        │        │  [highlighted]  │
│  │ row 3    │        │        │        │        │        │                  │
│  │ row 4    │        │        │        │        │        │                  │
│  │ row 5    │        │        │        │        │        │                  │
│  └──────────┴────────┴────────┴────────┴────────┴────────┘                  │
│                                                                              │
│  ¹ footnote text (14px muted)                      folio: bottom-R         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat Columns

```css
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-number {
  font-size: var(--text-xl);       /* 44px */
  font-weight: 700;
  color: var(--color-text-primary);
  font-variant-numeric: lining-nums tabular-nums;
  text-shadow: 0 0 24px var(--color-accent-glow);
  /* accent underline on stat */
  border-bottom: 2px solid var(--color-accent-under);
  padding-bottom: 6px;
  display: inline-block;
}

.stat-label {
  font-size: var(--text-sm);       /* 16px */
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 500;
}

.stat-desc {
  font-size: var(--text-sm);
  color: var(--color-text-faint);
  line-height: var(--leading-normal);
}
```

### Table

```css
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
  color: var(--color-text-body);
}

.data-table th {
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: var(--color-text-muted);
  border-bottom: 1px solid var(--color-border);
  padding: 10px 16px;
  font-weight: 600;
  text-align: left;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid oklch(0.13 0.03 142);
  font-variant-numeric: lining-nums tabular-nums;
  vertical-align: middle;
}

.data-table tr.highlight {
  background: var(--color-row-highlight);
  color: var(--color-text-primary);
  font-weight: 600;
}

.data-table td.numeric {
  font-variant-numeric: lining-nums tabular-nums;
  text-align: right;
}
```

### Folio

```css
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-size: var(--text-xs);
  color: var(--color-text-faint);
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: 0.08em;
}
```

### Aside Panel

```css
.aside-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-left: 3px solid var(--color-accent);
  padding: 32px 28px;
}

.aside-stat {
  font-size: var(--text-lg);       /* 32px */
  font-weight: 700;
  color: var(--color-text-primary);
  font-variant-numeric: lining-nums tabular-nums;
}

.aside-label {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.aside-body {
  font-size: 15px;
  color: var(--color-text-faint);
  line-height: var(--leading-normal);
  margin-top: 12px;
}
```

### Section Marker

```css
.section-marker {
  font-size: var(--text-sm);
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.15em;
  font-weight: 500;
  margin-bottom: 16px;
}

.section-marker::before {
  content: '> ';
  color: var(--color-accent);
}
```

---

## Print/Export Mode

```css
@media print {
  .slide {
    background: #000 !important;
    color: #00cc44 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .slide::after {
    display: none; /* remove scanlines in print */
  }
  .nav-bar {
    display: none !important;
  }
}
```

---

## Accessibility (Contrast Ratios)

| Pair | Lightness (OKLCH) | Approx. WCAG ratio | Pass level |
|---|---|---|---|
| `--color-text-primary` on `--color-bg` | 0.75 on 0.07 | ~11:1 | AAA |
| `--color-text-body` on `--color-bg` | 0.65 on 0.07 | ~8:1 | AAA |
| `--color-text-muted` on `--color-bg` | 0.45 on 0.07 | ~4.8:1 | AA |
| `--color-text-faint` on `--color-bg` | 0.30 on 0.07 | ~3.2:1 | AA large |
| `--color-text-primary` on `--color-surface` | 0.75 on 0.10 | ~10:1 | AAA |
| Table highlight row text on row bg | 0.75 on 0.12 | ~9:1 | AAA |

Focus indicators: `outline: 2px solid var(--color-text-primary); outline-offset: 3px;` on all interactive elements (nav dots, buttons).

No information is conveyed by hue alone — all state differences use brightness contrast or text labels.

---

## Differentiators from Sibling Styles in Family J

| Dimension | J01 terminal-monochrome | Sibling J styles |
|---|---|---|
| Hue count | Exactly two (terminal green + black) | Typically 3–4 |
| Font | JetBrains Mono only — zero proportional | May mix sans + mono |
| Texture | CRT scanline via CSS gradient | No scanline |
| Color space | OKLCH green hue 142 exclusively | Varied |
| Metaphor | Unix terminal / CRT phosphor | General technical |
| Number decoration | Phosphor glow + green underline on stats | No glow |
| Occasion fit | Security/DevOps/CLI — strongest in family | Broader technical |
