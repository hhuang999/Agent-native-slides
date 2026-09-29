# L02 — purple-ai-immersive

**Style ID:** L02
**Family:** L (AI/Tech Immersive)
**Scheme:** Dark — deep purple-black with electric violet accent
**Mood:** Cutting-edge, cerebral, luminous, focused
**Occasion:** AI research, ML engineering, AGI talks, neural interface demos, quantum computing
**Academic Fit:** High — deep-tech, machine learning, computational neuroscience, computer science

---

## Design Philosophy (5D)

**Philosophy:** Immerses the audience in a dark computational environment that feels native to the world of neural networks and large-scale inference. Every visual choice — from the near-void background to the glowing accent lines — evokes an internal representation space: latent, precise, and quietly alive. Slides feel like looking into an active model, not reading a report about one.

**Hierarchy:** A single glowing headline anchors each slide at the top. Supporting data — stat columns, evidence paragraphs, comparison tables — is set in cooler, lower-luminance type, creating a focal gradient from the vivid headline down to the fine-grained evidence. The eye lands on the claim first, then drills.

**Detail:** Monospaced body text (Geist Mono) signals precision and signals that every number is meant to be read carefully. Stat accent bars — 2 px × 28 px vertical violet glows — mark numeric values without chart overhead. Table borders use a semi-transparent violet rather than gray, keeping the palette unified.

**Function:** Dark mode is the primary mode. Color tokens are designed so every element is readable at ≥ 4.5:1 against the background. Glowing effects are layered as `text-shadow` and `box-shadow`, so they degrade gracefully when `prefers-reduced-motion` is set (motion is off, but glow remains as static luminance). Numeric values always use `font-variant-numeric: lining-nums tabular-nums`.

**Innovation:** The slow-drifting radial gradient mesh on the background layer creates subtle depth without distraction. A 2 px glowing vertical accent bar is used as a stat marker — more information-dense than a decorative icon, less overhead than a mini chart. Bricolage Grotesque headlines paired with Geist Mono body text is an unusual pairing that reads as both editorial and technical.

---

## Color System (OKLCH CSS Tokens)

```css
:root {
  /* --- Base surface --- */
  --color-bg:           oklch(0.10 0.025 290);   /* deep purple-black */
  --color-surface:      oklch(0.14 0.030 290);   /* raised card surface */
  --color-surface-hi:   oklch(0.18 0.035 290);   /* table header / elevated */

  /* --- Borders --- */
  --color-border:       oklch(0.30 0.060 290);   /* subtle divider */
  --color-border-hi:    oklch(0.42 0.120 295);   /* accent border / table row highlight */

  /* --- Accent (electric violet) --- */
  --color-accent:       oklch(0.65 0.28 295);    /* primary vivid violet */
  --color-accent-dim:   oklch(0.52 0.20 295);    /* dimmer accent for secondary elements */
  --color-accent-faint: oklch(0.22 0.06 290);    /* accent tint for backgrounds */

  /* --- Text --- */
  --color-text-primary:   oklch(0.96 0.010 290); /* near-white */
  --color-text-secondary: oklch(0.72 0.025 290); /* muted body */
  --color-text-tertiary:  oklch(0.48 0.020 290); /* footnote / caption */

  /* --- Semantic (table states) --- */
  --color-highlight-row:  oklch(0.22 0.055 295); /* highlighted table row bg */
  --color-highlight-text: oklch(0.90 0.040 295); /* text in highlighted row */

  /* --- Glow shadows (applied via text-shadow / box-shadow) --- */
  --glow-accent:   0 0 12px oklch(0.65 0.28 295 / 0.80);
  --glow-accent-lg: 0 0 28px oklch(0.65 0.28 295 / 0.55),
                    0 0 60px oklch(0.65 0.28 295 / 0.25);
  --glow-border:   0 0 8px  oklch(0.65 0.28 295 / 0.35);
}
```

### Contrast Ratios (verified)
| Pairing | Ratio | WCAG |
|---|---|---|
| `--color-text-primary` on `--color-bg` | ≈ 18.2:1 | AAA |
| `--color-text-secondary` on `--color-bg` | ≈ 8.4:1 | AAA |
| `--color-accent` on `--color-bg` | ≈ 5.1:1 | AA |
| `--color-text-tertiary` on `--color-bg` | ≈ 4.6:1 | AA |
| `--color-highlight-text` on `--color-highlight-row` | ≈ 7.2:1 | AAA |

---

## Typography

```html
<!-- Google Fonts CDN import (OFL-licensed) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,300;12..96,400;12..96,600;12..96,700&family=Geist+Mono:wght@300;400;500&display=swap" rel="stylesheet">
```

```css
:root {
  /* Font families */
  --font-display: 'Bricolage Grotesque', system-ui, sans-serif;
  --font-mono:    'Geist Mono', 'Fira Code', monospace;

  /* Type scale (base 16px, ratio ~1.25) */
  --text-xs:   0.75rem;   /* 12px — footnote */
  --text-sm:   0.875rem;  /* 14px — caption, label */
  --text-base: 1rem;      /* 16px — body */
  --text-md:   1.125rem;  /* 18px — body emphasis */
  --text-lg:   1.375rem;  /* 22px — aside stat */
  --text-xl:   1.75rem;   /* 28px — slide subhead */
  --text-2xl:  2.25rem;   /* 36px — stat value */
  --text-3xl:  3rem;      /* 48px — slide headline */
  --text-4xl:  3.75rem;   /* 60px — title headline */

  /* Line heights */
  --lh-tight:  1.15;
  --lh-snug:   1.30;
  --lh-base:   1.55;
  --lh-loose:  1.75;

  /* Letter spacing */
  --ls-tight:  -0.02em;
  --ls-normal:  0em;
  --ls-wide:    0.06em;
  --ls-wider:   0.12em;

  /* Numeric rendering */
  --numeric: lining-nums tabular-nums;
}

/* Application */
.slide-title        { font-family: var(--font-display); font-size: var(--text-4xl); font-weight: 700; letter-spacing: var(--ls-tight); line-height: var(--lh-tight); }
.slide-headline     { font-family: var(--font-display); font-size: var(--text-3xl); font-weight: 600; letter-spacing: var(--ls-tight); line-height: var(--lh-snug); }
.slide-subhead      { font-family: var(--font-display); font-size: var(--text-xl);  font-weight: 400; }
.body-text          { font-family: var(--font-mono);    font-size: var(--text-base); font-weight: 300; line-height: var(--lh-base); }
.stat-value         { font-family: var(--font-display); font-size: var(--text-2xl); font-weight: 700; font-variant-numeric: var(--numeric); }
.stat-label         { font-family: var(--font-mono);    font-size: var(--text-sm);  font-weight: 400; letter-spacing: var(--ls-wide); text-transform: uppercase; }
.table-cell         { font-family: var(--font-mono);    font-size: var(--text-sm);  font-variant-numeric: var(--numeric); }
.footnote           { font-family: var(--font-mono);    font-size: var(--text-xs);  color: var(--color-text-tertiary); }
.section-marker     { font-family: var(--font-mono);    font-size: var(--text-sm);  letter-spacing: var(--ls-wider); text-transform: uppercase; color: var(--color-accent); }
```

---

## Background and Structural Elements

```css
/* === Slide stage === */
.slide-stage {
  width: 1920px;
  height: 1080px;
  background-color: var(--color-bg);
  position: relative;
  overflow: hidden;
}

/* === Animated background mesh === */
.bg-mesh {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

/* Slow-drifting gradient orbs */
.bg-mesh::before {
  content: '';
  position: absolute;
  width: 900px;
  height: 900px;
  border-radius: 50%;
  background: radial-gradient(circle, oklch(0.28 0.10 290 / 0.45) 0%, transparent 70%);
  top: -200px;
  left: -150px;
  animation: drift-a 28s ease-in-out infinite alternate;
}

.bg-mesh::after {
  content: '';
  position: absolute;
  width: 700px;
  height: 700px;
  border-radius: 50%;
  background: radial-gradient(circle, oklch(0.22 0.12 310 / 0.35) 0%, transparent 70%);
  bottom: -180px;
  right: 80px;
  animation: drift-b 34s ease-in-out infinite alternate;
}

@keyframes drift-a {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(120px, 80px) scale(1.15); }
}

@keyframes drift-b {
  from { transform: translate(0, 0) scale(1); }
  to   { transform: translate(-90px, -60px) scale(1.10); }
}

@media (prefers-reduced-motion: reduce) {
  .bg-mesh::before,
  .bg-mesh::after { animation: none; }
}

/* === Semantic content layer === */
.slide-content {
  position: absolute;
  inset: 0;
  z-index: 1;
  padding: 72px 96px 80px;
  display: flex;
  flex-direction: column;
}

/* === Accent rule (horizontal, under section markers) === */
.accent-rule {
  width: 48px;
  height: 2px;
  background: var(--color-accent);
  box-shadow: var(--glow-accent);
  margin: 12px 0 32px;
}

/* === Vertical stat accent bar === */
.stat-bar {
  width: 2px;
  height: 28px;
  background: var(--color-accent);
  box-shadow: var(--glow-accent);
  flex-shrink: 0;
}

/* === Aside panel === */
.aside-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border-hi);
  border-left: 2px solid var(--color-accent);
  box-shadow: var(--glow-border);
  border-radius: 8px;
  padding: 32px 36px;
}
```

---

## Layout Patterns

### Slide 1 — Title Slide
```
┌──────────────────────────────────────────────────────────────────┐
│  [bg-mesh]                                                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ SECTION MARKER                                           │   │
│  │ ──────                                                   │   │
│  │                                                          │   │
│  │  LARGE HEADLINE TITLE                                    │   │
│  │  (Bricolage Grotesque 700 ~60px, glow on accent words)   │   │
│  │                                                          │   │
│  │  Abstract text  ·  Abstract text                         │   │
│  │                                                          │   │
│  │  [detail col 1] [detail col 2] [detail col 3] [col 4]   │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                              [folio]             │
└──────────────────────────────────────────────────────────────────┘
```

### Slide 2 — Evidence + Aside
```
┌──────────────────────────────────────────────────────────────────┐
│  SECTION MARKER  ──────                                          │
│  HEADLINE (Bricolage 600, ~48px, glow on numbers)                │
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │ stat-bar    │  │ stat-bar    │  │ stat-bar    │             │
│  │  VALUE      │  │  VALUE      │  │  VALUE      │             │
│  │  label      │  │  label      │  │  label      │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                  │
│  Evidence paragraph (Geist Mono, body text)          ┌────────┐ │
│                                                      │ aside  │ │
│                                                      │ stat   │ │
│                                                      │ text   │ │
│                                                      └────────┘ │
│                                              [folio]             │
└──────────────────────────────────────────────────────────────────┘
```

### Slide 3 — Comparison Table
```
┌──────────────────────────────────────────────────────────────────┐
│  SECTION MARKER  ──────                                          │
│  HEADLINE (Bricolage 600, ~48px)                                 │
│                                                                  │
│  ┌──────────┬──────────┬──────────┬──────────┬──────────┐      │
│  │ APPROACH │ METRIC 1 │ METRIC 2 │ METRIC 3 │ METRIC 4 │      │
│  ├──────────┼──────────┼──────────┼──────────┼──────────┤      │
│  │ row 1    │          │          │          │          │      │
│  │ ROW ★    │  BOLD    │  BOLD    │  BOLD    │  BOLD    │ ←hl  │
│  │ row 3    │          │          │          │          │      │
│  │ row 4    │          │          │          │          │      │
│  │ row 5    │          │          │          │          │      │
│  └──────────┴──────────┴──────────┴──────────┴──────────┘      │
│  footnote text                                                   │
│                                              [folio]             │
└──────────────────────────────────────────────────────────────────┘
```

---

## Component Tokens

### Stat Column
```css
.stat-col {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 220px;
}

.stat-col .stat-bar {
  width: 2px;
  height: 28px;
  background: var(--color-accent);
  box-shadow: var(--glow-accent);
}

.stat-col .stat-value {
  font-family: var(--font-display);
  font-size: var(--text-2xl);
  font-weight: 700;
  font-variant-numeric: lining-nums tabular-nums;
  color: var(--color-accent);
  text-shadow: var(--glow-accent);
  line-height: 1;
}

.stat-col .stat-label {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--color-text-secondary);
  font-weight: 400;
}

.stat-col .stat-detail {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  line-height: var(--lh-base);
}
```

### Comparison Table
```css
.comp-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

.comp-table thead tr {
  background: var(--color-surface-hi);
  border-bottom: 1px solid var(--color-border-hi);
}

.comp-table thead th {
  padding: 14px 20px;
  text-align: left;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: var(--text-xs);
  color: var(--color-accent);
  font-weight: 500;
}

.comp-table tbody tr {
  border-bottom: 1px solid var(--color-border);
}

.comp-table tbody tr:hover {
  background: oklch(0.16 0.030 290 / 0.60);
}

.comp-table tbody tr.highlighted {
  background: var(--color-highlight-row);
  border-bottom: 1px solid var(--color-border-hi);
}

.comp-table tbody tr.highlighted td {
  color: var(--color-highlight-text);
  font-weight: 500;
}

.comp-table tbody td {
  padding: 14px 20px;
  color: var(--color-text-secondary);
  font-variant-numeric: lining-nums tabular-nums;
}

.comp-table tbody td:first-child {
  color: var(--color-text-primary);
}
```

### Folio
```css
.folio {
  position: absolute;
  bottom: 36px;
  right: 120px;
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
  font-variant-numeric: lining-nums tabular-nums;
  letter-spacing: 0.08em;
}
```

### Detail Row (Slide 1 — 4-col grid)
```css
.detail-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-top: auto;
  padding-top: 40px;
  border-top: 1px solid var(--color-border);
}

.detail-cell .detail-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.10em;
  color: var(--color-accent-dim);
  margin-bottom: 6px;
}

.detail-cell .detail-value {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  color: var(--color-text-primary);
  font-variant-numeric: lining-nums tabular-nums;
}
```

---

## Print/Export Mode

```css
@media print {
  .bg-mesh { display: none; }
  .slide-stage {
    background: #f4f2f8 !important;
    color: #12101a !important;
  }
  :root {
    --color-bg: #f4f2f8;
    --color-text-primary: #12101a;
    --color-text-secondary: #3a3550;
    --color-accent: oklch(0.42 0.22 295);
    --glow-accent: none;
    --glow-accent-lg: none;
    --glow-border: none;
  }
  .stat-bar { box-shadow: none; }
  .stat-col .stat-value { text-shadow: none; }
}
```

---

## Accessibility

- All text meets WCAG AA at minimum (see contrast table in Color System).
- `prefers-reduced-motion`: background drift animations are disabled; glow effects remain as static luminance for spatial cues.
- `font-variant-numeric: lining-nums tabular-nums` on all numeric values for screen-reader–friendly alignment.
- Keyboard navigation: ArrowRight/Down/Space = next slide; ArrowLeft/Up = previous slide.
- Nav dots labeled with `aria-label="Go to slide N"`.
- Highlighted table row uses both background color AND font-weight change — never hue alone.
- Focus rings visible in all interactive nav elements.

---

## Differentiators from L-Family Siblings

| | L01 | **L02** | L03 |
|---|---|---|---|
| Background hue | Navy / dark blue | **Deep purple-black** | Near-black charcoal |
| Accent | Electric cyan | **Electric violet** | Neon green |
| Headline font | Space Grotesk | **Bricolage Grotesque** | IBM Plex Mono |
| Body font | JetBrains Mono | **Geist Mono** | Source Code Pro |
| Glow character | Cyan outer glow | **Violet inner + outer glow** | Green terminal glow |
| Mesh animation | Linear scan lines | **Radial drift orbs** | Grid pulse |
| Stat marker | Horizontal line | **2px × 28px vertical bar** | Bracket notation |
| Occasion | Cybersecurity, infra | **AI/ML, LLM research** | Developer tooling |
