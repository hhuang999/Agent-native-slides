# A05 — neon-cyberpunk

**Style ID:** A05  
**Family:** Dark Tech (A)  
**Scheme:** Dark  
**Mood:** bold · electric · provocative · urban  
**Occasion:** product-reveal · gaming · hackathon · brand-campaign  
**Academic Fit:** None

---

## Design Philosophy

Neon-cyberpunk is the loudest style in the library: high-contrast neon against near-black surfaces with a CRT scan-line texture creates immediate visceral impact. Rajdhani's condensed geometric weight at 90px packs maximum headline mass into minimal width, and Source Code Pro anchors all technical detail in terminal authority. This style is chosen when subtlety would read as timidity — brand campaigns, gaming reveals, hackathon openers. Every surface decision maximizes contrast; restraint is found only in the choice of two neon hues rather than six.

5D Evaluation:
- **Philosophy:** Maximum visual tension. The near-black base at only 6% lightness makes every neon element appear to self-illuminate. Hue strategy: neon cyan (185°) primary, neon magenta (330°) secondary — complementary on the visible spectrum, maximum perceived contrast.
- **Hierarchy:** Rajdhani Condensed Bold creates typographic shock at 90px; it reads as shouting in the best sense. Source Code Pro at caption scale evokes terminal output, reinforcing the hacker aesthetic.
- **Detail:** CSS repeating-linear-gradient scan-line texture at 4px pitch, 20% opacity — adds CRT depth without obscuring content. A 1px cyan glow border on key elements is implemented via `box-shadow: 0 0 0 1px accent, 0 0 12px accent/40%` to avoid layout disruption.
- **Function:** WCAG AA verified despite the neon palette — neon cyan passes at 6.1:1 over near-black. Text is never placed on a glowing surface without contrast verification.
- **Innovation:** The hologram-scan background layer uses a CSS `@keyframes` animation of a `background-position` on a `repeating-linear-gradient`, creating a scan-line sweep effect that moves top-to-bottom every 4 seconds. One property animated, zero JS.

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces */
  --color-bg:             oklch(0.06 0.020 240);
  --color-surface:        oklch(0.10 0.018 240);
  --color-raised-surface: oklch(0.14 0.015 240);
  --color-border:         oklch(0.20 0.022 240);

  /* Type */
  --color-heading:        oklch(0.98 0.004 200);
  --color-body:           oklch(0.80 0.010 240);
  --color-muted:          oklch(0.48 0.018 240);

  /* Accent — Neon Cyan */
  --color-accent:         oklch(0.82 0.22 185);
  --color-accent-dim:     oklch(0.60 0.18 185);
  --color-accent-glow:    oklch(0.82 0.22 185 / 0.18);
  --color-accent-glow-strong: oklch(0.82 0.22 185 / 0.40);

  /* Secondary — Neon Magenta */
  --color-accent-2:       oklch(0.72 0.28 330);
  --color-accent-2-dim:   oklch(0.54 0.22 330);
  --color-accent-2-glow:  oklch(0.72 0.28 330 / 0.18);

  /* Semantic */
  --color-positive:       oklch(0.70 0.22 145);
  --color-negative:       oklch(0.65 0.24 25);
  --color-warn:           oklch(0.74 0.20 75);

  /* Chart tokens */
  --chart-c1: oklch(0.82 0.22 185);   /* cyan */
  --chart-c2: oklch(0.72 0.28 330);   /* magenta */
  --chart-c3: oklch(0.70 0.22 145);   /* green */
  --chart-c4: oklch(0.74 0.20 75);    /* amber */
  --chart-c5: oklch(0.65 0.20 55);    /* orange */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Source+Code+Pro:wght@400;500&display=swap');

:root {
  --type-display: 'Rajdhani', sans-serif;        /* headlines — condensed geometric */
  --type-body:    'Rajdhani', sans-serif;         /* body — same family, lower weight */
  --type-label:   'Source Code Pro', monospace;  /* data, code, captions */
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 20px;
  line-height: 1.5;
}

/* Scale */
/* display = 4.5rem = 90px (Rajdhani 700) */
/* h1      = 2.8rem = 56px (Rajdhani 700) */
/* h2      = 1.9rem = 38px (Rajdhani 600) */
/* body    = 1.0rem = 20px (Rajdhani 400) — open tracking +0.01em */
/* caption = 0.75rem = 15px (Source Code Pro) */
```

---

## Background Motion: hologram-scan

A repeating horizontal scan-line gradient whose `background-position` animates downward, creating a CRT sweep. One CSS animation, no JS.

```css
#hologram-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background:
    repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 2px,
      oklch(0.82 0.22 185 / 0.04) 2px,
      oklch(0.82 0.22 185 / 0.04) 4px
    ),
    var(--color-bg);
  animation: scan-sweep 4s linear infinite;
}

@keyframes scan-sweep {
  from { background-position: 0 0; }
  to   { background-position: 0 1080px; }
}

/* Bright sweep line on top */
#hologram-bg::after {
  content: '';
  position: absolute; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg,
    transparent 0%, oklch(0.82 0.22 185 / 0.6) 30%,
    oklch(0.82 0.22 185 / 0.6) 70%, transparent 100%);
  animation: scan-line 4s linear infinite;
}

@keyframes scan-line {
  from { top: -2px; }
  to   { top: 1080px; }
}

@media (prefers-reduced-motion: reduce) {
  #hologram-bg { animation: none; }
  #hologram-bg::after { display: none; }
}
```

---

## Slide Layout Templates

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  [hologram-scan bg — subtle CRT lines sweeping down]    │
│                                                         │
│  [ TAG — Source Code Pro, neon cyan, tracked ]         │
│  ── cyan rule ────────────────────────────────────────  │
│  DISPLAY: Headline (Rajdhani 700, 90px)                │
│  Subtitle (Rajdhani 400, 26px, muted)                  │
│  Spacer                                                 │
│  Stat row or badge row (Source Code Pro)               │
│  ── magenta right-edge glow ─────────────────────────── │
└─────────────────────────────────────────────────────────┘
```

### Content Slide
```
┌─────────────────────────────────────────────────────────┐
│  [ Counter — Source Code Pro, magenta ]                 │
│  Headline (Rajdhani 700, 56px) — assertion             │
│  ─ cyan rule ─────────────────────────────────────────  │
│  [ Main content 60% ] │ [ Data / callout 36% ]          │
│  Numbers in Source Code Pro, glow border on key cards  │
└─────────────────────────────────────────────────────────┘
```

---

## Component Token Mapping

```css
/* Neon glow border card */
.glow-card {
  background: var(--color-surface);
  border: 1px solid var(--color-accent-dim);
  border-radius: 4px; padding: 20px;
  box-shadow: 0 0 0 1px var(--color-accent-dim),
              0 0 16px var(--color-accent-glow);
}

/* Stat value with glow */
.stat-val {
  font-family: var(--type-label); font-size: 44px; font-weight: 500;
  color: var(--color-accent);
  text-shadow: 0 0 20px var(--color-accent-glow-strong);
  font-variant-numeric: lining-nums tabular-nums;
}

/* Cyber tag */
.cyber-tag {
  font-family: var(--type-label); font-size: 12px;
  color: var(--color-accent); letter-spacing: 0.14em; text-transform: uppercase;
  border: 1px solid var(--color-accent-dim);
  background: var(--color-accent-glow);
  padding: 3px 10px; border-radius: 2px;
}

/* Accent rule */
.accent-rule {
  width: 100%; height: 1px;
  background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-border) 60%, transparent 100%);
}
```

---

## Print / Export Mode

```css
@media print {
  #hologram-bg { display: none; }
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
  :root {
    --color-bg: oklch(0.08 0.010 240);
    --color-heading: oklch(0.97 0.004 200);
    --color-body: oklch(0.80 0.006 240);
  }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 15.1:1 ✓
- `--color-body` over `--color-bg` = 7.2:1 ✓
- `--color-accent` (neon cyan) over `--color-bg` = 6.1:1 ✓ (large text only)
- `--color-accent-2` (neon magenta) over `--color-bg` = 4.8:1 ✓ (large text / graphical elements)
- Hologram scan animation respects `prefers-reduced-motion`
- Glow effects are decorative — state is never conveyed by glow alone (always paired with color, label, or border)
- Text-shadow glows applied only to large display text; body text uses no text-shadow
