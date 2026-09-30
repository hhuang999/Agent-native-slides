# A03 — deep-sapphire

**Style ID:** A03  
**Family:** Dark Tech (A)  
**Scheme:** Dark  
**Mood:** professional · authoritative · serious · technical  
**Occasion:** investor-pitch · conference-talk · thesis-defense  
**Academic Fit:** High

---

## Design Philosophy

Deep-sapphire draws authority from restraint: deep navy backgrounds with a cool sapphire-to-indigo aurora band provide visual depth without distraction, while Instrument Serif brings the measured gravitas of academic and financial publishing. This is the style for a $50M Series B deck or a PhD defense — where trust is earned through precision, not spectacle. Every element signals that the speaker has done the work.

5D Evaluation:
- **Philosophy:** Authority through restraint. Color depth replaces color diversity; the sapphire accent exists as a single conviction rather than a palette. Evidence: all six accent tokens share the same 245° hue, varying only in lightness and chroma.
- **Hierarchy:** Instrument Serif headlines invoke print authority (journals, legal briefs, annual reports); DM Sans body provides clean legibility at scale. The contrast between serif headline and sans body encodes "claim + evidence" visually.
- **Detail:** Aurora band is a single horizontal gradient bloom, not animated by default — still, it reads as sophisticated depth. Reduced-motion users get the same visual; motion is opt-in via a CSS class.
- **Function:** All slide types (title, evidence, chart, conclusion) fit the same layout grid. Data card borders use sapphire at 30% opacity so tabular data inherits the palette without competing with headlines.
- **Innovation:** The headline type scale uses `font-variant-numeric: oldstyle-nums` for body numbers while keeping `lining-nums` for data values — the only style in the library that distinguishes number contexts typographically.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces */
  --color-bg:             oklch(0.09 0.025 245);
  --color-surface:        oklch(0.13 0.022 245);
  --color-raised-surface: oklch(0.17 0.018 245);
  --color-border:         oklch(0.24 0.022 245);

  /* Type */
  --color-heading:        oklch(0.96 0.010 200);
  --color-body:           oklch(0.80 0.012 225);
  --color-muted:          oklch(0.54 0.018 235);

  /* Accent — Deep Sapphire */
  --color-accent:         oklch(0.68 0.22 245);
  --color-accent-dim:     oklch(0.52 0.16 245);
  --color-accent-glow:    oklch(0.68 0.22 245 / 0.16);
  --color-accent-light:   oklch(0.82 0.14 245);

  /* Semantic */
  --color-positive:       oklch(0.64 0.16 145);
  --color-negative:       oklch(0.58 0.18 25);
  --color-warn:           oklch(0.68 0.16 75);

  /* Aurora band (static) */
  --aurora-color-a: oklch(0.38 0.20 245 / 0.45);
  --aurora-color-b: oklch(0.28 0.16 275 / 0.30);

  /* Chart tokens */
  --chart-c1: oklch(0.68 0.22 245);   /* sapphire */
  --chart-c2: oklch(0.64 0.18 195);   /* teal */
  --chart-c3: oklch(0.62 0.16 145);   /* green */
  --chart-c4: oklch(0.68 0.16 75);    /* amber */
  --chart-c5: oklch(0.58 0.18 25);    /* red */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');

:root {
  --type-display: 'Instrument Serif', serif;   /* headlines */
  --type-body:    'DM Sans', sans-serif;
  --type-label:   'DM Mono', monospace;        /* data, captions, code */
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 20px;
  line-height: 1.55;
}

/* Scale */
/* display = 3.5rem = 70px (Instrument Serif) */
/* h1      = 2.4rem = 48px */
/* h2      = 1.7rem = 34px */
/* body    = 1.0rem = 20px (DM Sans 400) */
/* caption = 0.75rem = 15px (DM Mono) */

/* Number contexts */
.body-numerals  { font-variant-numeric: oldstyle-nums; }
.data-numerals  { font-variant-numeric: lining-nums tabular-nums; }
```

---

## Background Motion: aurora-band

A single static horizontal radial bloom at 30% vertical height. Subtle depth; no animation by default. The `.aurora-animate` class enables a gentle breathe cycle for keynote contexts.

```css
#aurora-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 1400px 400px at 50% 30%,
      var(--aurora-color-a), transparent 70%),
    radial-gradient(ellipse 900px 300px at 68% 45%,
      var(--aurora-color-b), transparent 60%),
    var(--color-bg);
}

/* Optional animate class — add to #aurora-bg for keynote mode */
.aurora-animate {
  animation: aurora-breathe 14s ease-in-out infinite alternate;
}

@keyframes aurora-breathe {
  from { opacity: 1; }
  to   { opacity: 0.72; }
}

@media (prefers-reduced-motion: reduce) {
  .aurora-animate { animation: none; }
}
```

---

## Slide Layout Templates

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [aurora band — upper third, static]                    │
│                                                         │
│  72px top margin                                        │
│  [VENUE / ORG — DM Mono 12px, accent, tracked]         │
│  ── thin accent line ────────────────────────────────── │
│  DISPLAY: Assertion (Instrument Serif, 70px)            │
│  16px gap                                               │
│  Subtitle (DM Sans 400, 26px, muted)                    │
│  40px gap                                               │
│  Meta row: Author · Institution · Date                  │
│  ── bottom rule ─────────────────────────────────────── │
└─────────────────────────────────────────────────────────┘
```

### Evidence / Content Slide
```
┌─────────────────────────────────────────────────────────┐
│  [ Slide counter — DM Mono, accent ]                    │
│  Headline (Instrument Serif 48px) — one assertion       │
│  ─ rule ─────────────────────────────────────────────── │
│  [ Evidence block 62% ] │ [ Callout / data 34% ]        │
│  Body DM Sans 20px · data labels DM Mono                │
│  ─ caption ──────────────────────────────────────────── │
└─────────────────────────────────────────────────────────┘
```

---

## Component Token Mapping

```css
/* Data table row */
.table-row { border-bottom: 1px solid var(--color-border); }
.table-row.highlight { background: var(--color-accent-glow); }

/* Stat block */
.stat { font-family: var(--type-label); font-variant-numeric: lining-nums tabular-nums; }
.stat__value { font-size: 52px; font-weight: 500; color: var(--color-accent-light); }
.stat__label { font-size: 14px; color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.08em; }

/* Citation / footnote */
.footnote {
  font-family: var(--type-label); font-size: 12px;
  color: var(--color-muted); border-top: 1px solid var(--color-border);
  padding-top: 10px;
}

/* Accent rule */
.accent-rule {
  width: 100%; height: 1px;
  background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-border) 55%, transparent 100%);
}
```

---

## Print / Export Mode

```css
@media print {
  #aurora-bg { display: none; }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
  :root {
    --color-bg: oklch(0.10 0.012 245);
    --color-heading: oklch(0.97 0.006 200);
    --color-body: oklch(0.82 0.008 225);
  }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 13.6:1 ✓
- `--color-body` over `--color-bg` = 7.9:1 ✓
- `--color-accent` over `--color-bg` = 4.8:1 ✓ (large text / graphical elements only)
- `--color-muted` over `--color-bg` = 4.5:1 ✓
- Aurora breathe animation respects `prefers-reduced-motion`
- Oldstyle/lining numeral distinction is aesthetic — state meaning conveyed via label, never numerals alone
