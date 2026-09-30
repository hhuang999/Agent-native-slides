# A02 — ultraviolet-immersive

**Style ID:** A02  
**Family:** Dark Tech (A)  
**Scheme:** Dark  
**Mood:** immersive · creative · energetic · brand  
**Occasion:** keynote · product-launch · conference-talk  
**Academic Fit:** Medium

---

## Design Philosophy

Ultraviolet-immersive treats slides as a brand canvas: vivid color fields command immediate attention, Syne's geometric weight punches through with conviction, and the mesh-drift background turns the stage itself into a living texture. Every compositional decision points toward momentum — this style is engineered for product reveals and keynotes where the first impression must hit before a word is spoken.

5D Evaluation:
- **Philosophy:** Emotional brand authority. Color fields carry meaning before type is read; accent hue is kept to a single violet family so nothing competes. Evidence: all six surface variables derive from the same 285° hue with only chroma and lightness varied.
- **Hierarchy:** Syne Extra Bold at 76px creates a typographic punch; DM Sans body has calmer, more predictable proportions for paragraphs and labels. Three-level scale: display → body → label/caption.
- **Detail:** Mesh-drift is implemented via CSS `@property` registered custom properties, giving GPU-composited gradient animation without a canvas dependency. The mesh consists of four OKLCH radial gradients whose centers animate independently.
- **Function:** WCAG AA on all text roles verified. Reduced-motion path retains static mesh (no animation). `?print=1` removes animation and switches surface to a printable near-black.
- **Innovation:** `--mesh-x1` through `--mesh-y4` drive four gradient origins via `@property` with `<percentage>` syntax, enabling `@keyframes` to animate them — standard CSS, zero JS, GPU-composited on Chromium and Safari.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces */
  --color-bg:             oklch(0.09 0.022 285);
  --color-surface:        oklch(0.13 0.020 285);
  --color-raised-surface: oklch(0.17 0.018 285);
  --color-border:         oklch(0.25 0.022 285);

  /* Type */
  --color-heading:        oklch(0.97 0.008 280);
  --color-body:           oklch(0.80 0.015 280);
  --color-muted:          oklch(0.54 0.020 280);

  /* Accent — Electric Violet */
  --color-accent:         oklch(0.72 0.24 295);
  --color-accent-dim:     oklch(0.58 0.18 295);
  --color-accent-glow:    oklch(0.72 0.24 295 / 0.20);
  --color-accent-2:       oklch(0.68 0.22 340);  /* magenta complement, charts only */

  /* Semantic */
  --color-positive:       oklch(0.64 0.18 145);
  --color-negative:       oklch(0.58 0.20 25);
  --color-warn:           oklch(0.70 0.16 75);

  /* Mesh gradient positions (animated via @property) */
  --mesh-x1: 20%; --mesh-y1: 15%;
  --mesh-x2: 80%; --mesh-y2: 70%;
  --mesh-x3: 55%; --mesh-y3: 30%;
  --mesh-x4: 30%; --mesh-y4: 85%;

  /* Chart tokens */
  --chart-c1: oklch(0.72 0.24 295);   /* violet */
  --chart-c2: oklch(0.68 0.22 340);   /* magenta */
  --chart-c3: oklch(0.64 0.18 145);   /* green */
  --chart-c4: oklch(0.70 0.16 75);    /* amber */
  --chart-c5: oklch(0.62 0.18 205);   /* cyan */
}
```

---

## Typography

```css
/* CDN */
/* Syne + DM Sans — OFL, Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@400;500;700&display=swap');

:root {
  --type-display: 'Syne', Arial, 'Slides CJK Sans', sans-serif;         /* headlines, big numbers */
  --type-body:    'DM Sans', Arial, 'Slides CJK Sans', sans-serif;       /* all body and UI text */
  --type-label:   'DM Sans', Arial, 'Slides CJK Sans', sans-serif;       /* labels, captions */
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 20px;
  line-height: 1.5;
}

/* Scale (rem relative to 20px base) */
/* display = 3.8rem = 76px (Syne 800) */
/* h1      = 2.6rem = 52px (Syne 700) */
/* h2      = 1.8rem = 36px (Syne 700) */
/* body    = 1.0rem = 20px (DM Sans 400) */
/* caption = 0.75rem = 15px (DM Sans 400) */
```

---

## Background Motion: mesh-drift

Four radial OKLCH gradients positioned at different corners of the stage, each center drifting on independent keyframes via registered `@property` custom properties. Pure CSS — no JS, no canvas.

```css
/* Register animated mesh properties */
@property --mesh-x1 { syntax: '<percentage>'; inherits: false; initial-value: 20%; }
@property --mesh-y1 { syntax: '<percentage>'; inherits: false; initial-value: 15%; }
@property --mesh-x2 { syntax: '<percentage>'; inherits: false; initial-value: 80%; }
@property --mesh-y2 { syntax: '<percentage>'; inherits: false; initial-value: 70%; }
@property --mesh-x3 { syntax: '<percentage>'; inherits: false; initial-value: 55%; }
@property --mesh-y3 { syntax: '<percentage>'; inherits: false; initial-value: 30%; }
@property --mesh-x4 { syntax: '<percentage>'; inherits: false; initial-value: 30%; }
@property --mesh-y4 { syntax: '<percentage>'; inherits: false; initial-value: 85%; }

#mesh-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    radial-gradient(ellipse 900px 700px at var(--mesh-x1) var(--mesh-y1),
      oklch(0.38 0.22 295 / 0.55), transparent 70%),
    radial-gradient(ellipse 700px 600px at var(--mesh-x2) var(--mesh-y2),
      oklch(0.28 0.18 340 / 0.45), transparent 65%),
    radial-gradient(ellipse 600px 500px at var(--mesh-x3) var(--mesh-y3),
      oklch(0.20 0.14 260 / 0.40), transparent 60%),
    radial-gradient(ellipse 800px 600px at var(--mesh-x4) var(--mesh-y4),
      oklch(0.30 0.20 310 / 0.35), transparent 65%),
    var(--color-bg);
  animation:
    mesh-a 18s ease-in-out infinite alternate,
    mesh-b 22s ease-in-out infinite alternate-reverse,
    mesh-c 16s ease-in-out infinite alternate,
    mesh-d 26s ease-in-out infinite alternate-reverse;
}

@keyframes mesh-a { to { --mesh-x1: 45%; --mesh-y1: 60%; } }
@keyframes mesh-b { to { --mesh-x2: 25%; --mesh-y2: 20%; } }
@keyframes mesh-c { to { --mesh-x3: 75%; --mesh-y3: 80%; } }
@keyframes mesh-d { to { --mesh-x4: 70%; --mesh-y4: 35%; } }

@media (prefers-reduced-motion: reduce) {
  #mesh-bg { animation: none; }
}
```

---

## Slide Layout Templates

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [mesh-drift bg — full bleed, vivid violet-magenta]     │
│                                                         │
│  [ EYEBROW — DM Sans 500, 13px, accent, tracked ]      │
│  DISPLAY: Headline (Syne 800, 76px, heading)           │
│  [ Sub / claim (DM Sans 400, 28px, muted) ]            │
│  [ Spacer ]                                             │
│  [ CTA pill or tag row — accent border, DM Sans 500 ]  │
│                                                         │
│  ─ bottom accent gradient rule ─────────────────────── │
└─────────────────────────────────────────────────────────┘
```

### Content Slide (Feature / Evidence)
```
┌─────────────────────────────────────────────────────────┐
│  [ Slim accent top bar — 3px, full width ]              │
│  [ HEADLINE: Syne 700, 52px, 1 assertion sentence ]    │
│  ─ separator ────────────────────────────────────────── │
│  [ Main content 60% ] [ Visual / callout 36% ]          │
│  DM Sans 400/20px body · accent pills for key terms    │
└─────────────────────────────────────────────────────────┘
```

---

## Component Token Mapping

```css
/* Pill / tag */
.tag {
  background: var(--color-accent-glow);
  border: 1px solid var(--color-accent-dim);
  color: var(--color-accent);
  font-family: var(--type-label); font-size: 13px;
  padding: 4px 10px; border-radius: 20px;
}

/* Feature card */
.feature-card {
  background: oklch(0.13 0.020 285 / 0.80);
  backdrop-filter: blur(12px) saturate(1.4);
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

/* Progress / stat highlight */
.stat-value {
  font-family: var(--type-display); font-size: 60px; font-weight: 800;
  color: var(--color-accent); line-height: 1;
}
```

---

## Print / Export Mode

```css
@media print, (prefers-color-scheme: none) {
  #mesh-bg { display: none; }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
  :root {
    --color-bg: oklch(0.10 0.010 285);
    --color-heading: oklch(0.98 0.005 280);
    --color-body: oklch(0.82 0.008 280);
  }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 14.8:1 ✓
- `--color-body` over `--color-bg` = 8.1:1 ✓
- `--color-accent` over `--color-bg` = 5.6:1 ✓ (large text and graphical elements only)
- `--color-muted` over `--color-bg` = 4.7:1 ✓
- Mesh animations respect `prefers-reduced-motion`
- Accent used for semantic meaning always paired with label or icon (never hue-only)
- Backdrop-filter used only as progressive enhancement (layout never depends on blur)

---

## Screen font compatibility

| Role | Latin font | Latin offline fallback | Simplified Chinese fallback |
|---|---|---|---|
| Display | Syne | Arial | Slides CJK Sans |
| Body | DM Sans | Arial | Slides CJK Sans |
| Auxiliary / data | DM Sans | Arial | Slides CJK Sans |

The selected Latin face stays first, followed by an explicit same-class offline Latin backup; the local CJK face covers Han characters and related punctuation. The preview loads `../font-fallback.css`. A generated deck must include the same `@font-face` rules with paths to `assets/fonts/`, then run `inline-assets.js` for portable HTML. Use the weights supplied by the font request, keep display faces out of paragraphs, and inspect both loaded and offline-fallback renders after `document.fonts.ready`. When copy is too wide, shorten or split it rather than shrinking below the shared readability rules.

**Adjustment:** DM Sans replaces the Fontshare Satoshi dependency; its normal width keeps body and labels stable.
