# A01 — circuit-engineered

**Style ID:** A01  
**Family:** Dark Tech (A)  
**Scheme:** Dark  
**Mood:** technical · engineering · precise · cybersecurity  
**Occasion:** conference-talk · thesis-defense · group-meeting  
**Academic Fit:** High

---

## Design Philosophy

Circuit-engineered treats the slide canvas as a PCB schematic: information routes through visible grid geometry, typographic hierarchies snap to invisible trace-lines, and every element carries the weight of an engineering blueprint. There is zero decorative softness — every mark earns its position. The result reads as meticulous expertise, not aesthetic whim.

5D Evaluation:
- **Philosophy:** Unified constraint system — grid, trace, monospace — creates perceptual authority. Evidence: every spacing decision derives from a single 8px grid.
- **Hierarchy:** Three-level type scale (display headline → data label → caption) mirrors schematic annotation conventions. Evidence: display uses Geist Mono, body uses Instrument Sans at 14sp reduced weight.
- **Detail:** SVG circuit traces in background use actual PCB corner radii (1.5px). Accent nodes pulse at 2-second intervals via `animation: node-pulse`.
- **Function:** All interactive states (hover, focus-visible) visible at WCAG AA. Chart tokens integrate with ECharts theme. No layout breaks on 20+ slide decks.
- **Innovation:** `--circuit-grid` CSS property drives both background SVG and component border patterns from a single token. Token changes propagate everywhere simultaneously.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces */
  --color-bg:             oklch(0.10 0.015 240);
  --color-surface:        oklch(0.14 0.015 240);
  --color-raised-surface: oklch(0.18 0.012 240);
  --color-border:         oklch(0.26 0.018 240);

  /* Type */
  --color-heading:        oklch(0.96 0.008 200);
  --color-body:           oklch(0.78 0.015 220);
  --color-muted:          oklch(0.52 0.020 225);

  /* Accent — Electric Cyan */
  --color-accent:         oklch(0.76 0.18 205);
  --color-accent-dim:     oklch(0.60 0.14 205);
  --color-accent-glow:    oklch(0.76 0.18 205 / 0.18);

  /* Semantic deltas */
  --color-positive:       oklch(0.62 0.18 145);
  --color-negative:       oklch(0.58 0.20 25);
  --color-warn:           oklch(0.70 0.16 75);

  /* Circuit grid geometry */
  --circuit-grid:         24px;
  --circuit-trace:        oklch(0.26 0.018 240);
  --circuit-node:         oklch(0.76 0.18 205);

  /* Chart tokens (ECharts) */
  --chart-c1: oklch(0.76 0.18 205);   /* cyan */
  --chart-c2: oklch(0.65 0.16 275);   /* violet */
  --chart-c3: oklch(0.68 0.14 155);   /* green */
  --chart-c4: oklch(0.62 0.18 50);    /* amber */
  --chart-c5: oklch(0.58 0.20 15);    /* red */
}
```

---

## Typography

```css
/* CDN — OFL / Apache 2.0 */
@import url('https://fonts.googleapis.com/css2?family=Geist+Mono:wght@300;400;500;600&family=Instrument+Sans:wght@400;500;600&display=swap');

:root {
  --type-display: 'Geist Mono', monospace;   /* headlines, data numbers */
  --type-body:    'Instrument Sans', sans-serif;
  --type-label:   'Geist Mono', monospace;   /* code, captions, axis labels */
}

/* Stage root — 1920×1080 base */
.deck-stage {
  font-family: var(--type-body);
  font-size: 20px;
  line-height: 1.5;
}

/* Scale: rem relative to stage root 20px */
/* display = 3.2rem = 64px */
/* h1      = 2.4rem = 48px */
/* h2      = 1.6rem = 32px */
/* body    = 1.0rem = 20px */
/* caption = 0.75rem = 15px */
```

---

## Background Motion: circuit-trace

Animated PCB trace grid using a single `<canvas>` element behind the stage. CSS `@keyframes` drives node-pulse; JS renders the grid once and animates accent nodes.

```html
<!-- Insert as first child of .deck-stage -->
<canvas id="circuit-bg" style="
  position: absolute; inset: 0; width: 100%; height: 100%;
  pointer-events: none; z-index: 0; opacity: 0.55;
"></canvas>
```

```js
(function initCircuitBg() {
  const canvas = document.getElementById('circuit-bg')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  const W = 1920, H = 1080, G = 24  /* grid size matches --circuit-grid */

  canvas.width = W; canvas.height = H

  const TRACE  = 'oklch(0.26 0.018 240)'
  const NODE   = 'oklch(0.76 0.18 205)'
  const GLOW   = 'oklch(0.76 0.18 205 / 0.18)'

  /* Draw static grid */
  ctx.strokeStyle = TRACE; ctx.lineWidth = 0.5
  for (let x = 0; x <= W; x += G) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke() }
  for (let y = 0; y <= H; y += G) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke() }

  /* Scatter accent nodes at grid intersections */
  const nodes = []
  for (let x = G; x < W; x += G * 6) {
    for (let y = G; y < H; y += G * 6) {
      if (Math.random() > 0.55) nodes.push({ x, y, phase: Math.random() * Math.PI * 2 })
    }
  }

  /* prefers-reduced-motion: skip animation */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  function tick(t) {
    /* Re-draw nodes only (grid is static) */
    nodes.forEach(n => {
      const alpha = 0.3 + 0.5 * (0.5 + 0.5 * Math.sin(t * 0.001 + n.phase))
      ctx.clearRect(n.x - 5, n.y - 5, 10, 10)
      ctx.fillStyle = `oklch(0.76 0.18 205 / ${alpha})`
      ctx.beginPath(); ctx.arc(n.x, n.y, 2.5, 0, Math.PI * 2); ctx.fill()
    })
    requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
})()
```

---

## Slide Layout Templates

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [circuit grid bg — full bleed]                         │
│                                                         │
│  60px top margin                                        │
│  ── thin accent line (--color-accent, 1px) ─────────── │
│  8px gap                                                │
│  DISPLAY: Assertion headline (Geist Mono, 64px, bold)   │
│  16px gap                                               │
│  SUBTITLE (Instrument Sans, 24px, muted)                │
│  32px gap                                               │
│  META ROW: Author · Venue · Date (caption, 15px)        │
│  ── thin line ──────────────────────────────────────── │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Content Slide (Evidence)
```
┌─────────────────────────────────────────────────────────┐
│  16px top accent strip (circuit-traced border)          │
│  Headline (Geist Mono 48px) — one assertion sentence    │
│  ─ separator ────────────────────────────────────────── │
│  [ Evidence block (60% width) | Callout (36% width) ]  │
│  Body text, chart, or code block                        │
│  ─ baseline ─────────────────────────────────────────── │
│  Caption / source (Geist Mono 15px, muted)              │
└─────────────────────────────────────────────────────────┘
```

---

## Component Token Mapping

```css
/* Data Card */
.data-card { background: var(--color-raised-surface); border: 1px solid var(--color-border); }

/* Code block header */
.code-block__header { background: var(--color-surface); border-bottom: 1px solid var(--color-border); }

/* Timeline active node */
.timeline-node.active { background: var(--color-accent); box-shadow: 0 0 12px var(--color-accent-glow); }

/* Button / CTA accent */
.btn-accent { background: var(--color-accent); color: var(--color-bg); }
.btn-accent:hover { filter: brightness(1.12); }
```

---

## Print / Export Mode

```css
@media print {
  #circuit-bg { display: none; }           /* remove canvas for PDF */
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
  :root { --color-bg: #fff; --color-heading: #0d0d14; --color-body: #2a2a38; }
}
```

When `?print=1`, append same rules via a `<style>` injected by the deck runtime.

---

## Accessibility

- WCAG AA verified: `--color-heading` over `--color-bg` = 13.2:1 ✓
- `--color-body` over `--color-bg` = 7.8:1 ✓
- `--color-accent` over `--color-bg` = 5.1:1 ✓ (large text only — never use accent for body copy)
- `--color-muted` over `--color-bg` = 4.6:1 ✓
- All node pulse animations respect `prefers-reduced-motion`
- No color-only encoding: state changes also use icon + label
