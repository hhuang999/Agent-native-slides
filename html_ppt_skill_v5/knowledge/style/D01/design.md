# D01 — swiss-international

**Style ID:** D01  
**Family:** Swiss / International Typographic (D)  
**Scheme:** Light-Neutral (white · near-black · signal-red)  
**Mood:** precise · authoritative · systematic · objective · institutional  
**Occasion:** standards-document · infrastructure-report · institutional-communication · architecture · policy · corporate-annual-report  
**Academic Fit:** High (design, architecture, urban planning, policy)

---

## Design Philosophy

Swiss International — the International Typographic Style originating at the Basel and Zurich schools in the 1950s — is not a visual style in the decorative sense. It is a discipline: the conviction that objective, clear communication serves every audience equally, and that ornament should yield completely to structure. The grid is the design. Type is set flush-left, ragged-right, never centered, never justified. Helvetica (or its spiritual successors) and Univers were the canonical faces; their defining quality is neutral transparency — a typeface that does not compete with the message. White space is not emptiness; it is the grid's rest state.

In practice for presentation: white background at full value, near-black text with no warmth or cool cast, one accent applied sparingly — the classic Swiss choice is Signal Red, used for section numbers, column markers, and the occasional heavy rule, never for decorative fills. The layout is column-based, with visible grid rhythm even where columns are not drawn. Photographs are content, not decoration; they sit in the grid and are never cropped for mood.

IBM Plex Sans (OFL, Google Fonts) is the closest contemporary match to Univers in licensing terms — designed with similar optical neutrality, a wide weight range, and a condensed variant that allows the heavy condensed headline treatment central to Swiss poster and publication typography. IBM Plex Sans Condensed at Bold (700) at 88–96px creates the statement-text weight that Swiss design is known for. IBM Plex Sans at Regular and Medium handles all body and functional text.

There are no card containers, no gradients, no shadows. Rules and columns organize the space. The Signal Red accent appears at most three times per slide.

5D Evaluation:
- **Philosophy:** The grid is the design philosophy made visible. Swiss International assumes the audience is capable of reading structured information; it does not use visual noise to manage attention. The slide is a form with meaning — every element is placed by a rule, not by feeling.
- **Hierarchy:** IBM Plex Sans Condensed Bold at 88–96px creates immediate scale contrast. At display size the condensed form adds density without crowding — the same horizontal space holds significantly more information than a regular-width face, true to the Swiss tradition of information density. IBM Plex Sans 400 at 18px is the transparent body register; IBM Plex Sans 300 at 13px handles captions and footnotes.
- **Detail:** Section numbers in Signal Red, 11px, uppercase, tracked: the indexing principle of the Swiss grid. A 3px Signal Red rule above slide headlines; horizontal rules at `oklch(0.78 0 0)` at 1px separating sections. Column widths governed by an implicit 12-column grid. Page number and section title in small caps (IBM Plex Sans 500 at 10px) at bottom right — the Swiss "folio" position, not the top.
- **Function:** Strongest for institutional reports, standards documents, technical briefs, and any deck where the credibility of the information must carry the presentation. Not appropriate for consumer, entertainment, or emotional contexts — the style reads as academic-institutional, which is a feature, not a limitation.
- **Innovation:** Using IBM Plex Sans Condensed Bold for the headline — rather than a distinct display font — maintains the single-family principle. The condensed variant's dense letterforms at large size create a very different visual register from the body text without introducing a second typeface, consistent with Swiss single-family practice (Univers was designed as a complete system; IBM Plex Sans follows the same logic).

---

## Color System (OKLCH)

```css
:root {
  /* Surfaces — pure neutral */
  --color-bg:             oklch(0.99 0 0);              /* white paper */
  --color-surface:        oklch(0.95 0 0);              /* light grey panel */
  --color-raised-surface: oklch(0.91 0 0);              /* mid grey panel */
  --color-border:         oklch(0.78 0 0);              /* column rule */
  --color-border-light:   oklch(0.88 0 0);              /* light divider */
  --color-border-dark:    oklch(0.32 0 0);              /* heavy rule */

  /* Type — pure neutral */
  --color-heading:        oklch(0.08 0 0);              /* near-black */
  --color-body:           oklch(0.14 0 0);              /* dark */
  --color-muted:          oklch(0.42 0 0);              /* mid grey */
  --color-dim:            oklch(0.60 0 0);              /* light grey */

  /* Accent — Signal Red */
  --color-accent:         oklch(0.54 0.24 28);          /* Signal Red */
  --color-accent-dark:    oklch(0.40 0.22 28);          /* dark red */
  --color-accent-light:   oklch(0.72 0.18 28);          /* light red — tint */
  --color-accent-bg:      oklch(0.97 0.012 28);         /* very faint red tint */

  /* Semantic */
  --color-positive:       oklch(0.44 0.18 145);
  --color-negative:       oklch(0.54 0.24 28);          /* same as accent */
  --color-warn:           oklch(0.60 0.18 68);

  /* Chart tokens — desaturated with red primary */
  --chart-c1: oklch(0.08 0 0);          /* black */
  --chart-c2: oklch(0.54 0.24 28);      /* signal red */
  --chart-c3: oklch(0.42 0 0);          /* mid grey */
  --chart-c4: oklch(0.62 0 0);          /* light grey */
  --chart-c5: oklch(0.72 0.18 28);      /* light red */
}
```

---

## Typography

```css
/* CDN — OFL */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:ital,wght@0,300;0,400;0,500;0,700;1,400&family=IBM+Plex+Sans+Condensed:wght@400;700&display=swap');

:root {
  --type-display:    'IBM Plex Sans Condensed', sans-serif;   /* condensed headline — Swiss weight */
  --type-body:       'IBM Plex Sans', sans-serif;             /* all other text */
  --type-label:      'IBM Plex Sans', sans-serif;
}

.deck-stage {
  font-family: var(--type-body);
  font-size: 18px;
  line-height: 1.65;
  letter-spacing: 0.00em;
}

/* Scale */
/* display   = 5.2rem = 93px   (IBM Plex Sans Condensed 700) */
/* h1        = 3.0rem = 54px   (IBM Plex Sans Condensed 700) */
/* h2        = 1.5rem = 27px   (IBM Plex Sans 700) */
/* body      = 1.0rem = 18px   (IBM Plex Sans 400) */
/* caption   = 0.72rem = 13px  (IBM Plex Sans 300) */
/* section   = 0.60rem = 11px  (IBM Plex Sans 500, tracked +0.20em, uppercase) */
/* folio     = 0.56rem = 10px  (IBM Plex Sans 500, small caps pattern, tracked +0.15em) */
```

---

## Background: Pure Neutral, Grid-Structured

```css
#swiss-bg {
  position: absolute; inset: 0; z-index: 0; pointer-events: none;
  background: var(--color-bg);
}

/* No decoration — the grid is the design */

@media (prefers-reduced-motion: reduce) {
  /* Static — no change needed */
}
```

---

## Layout Patterns

### Title Slide
```
┌─────────────────────────────────────────────────────────┐
│  ○1  SECTION LABEL — Signal Red, 11px, +0.20em          │
│  ─────────────────────────────────────────────────────  │
│  ── 3px Signal Red rule, full width ──────────────────  │
│  Headline condensed bold, 93px, near-black              │
│  ── 1px rule ──────────────────────────────────────── │
│  Abstract / sub (IBM Plex Sans 400, 20px, muted)        │
│  Spacer                                                 │
│  [Detail row: labels + values in 4-col grid]            │
│  ─────────────────────────────────────────────────────  │
│                                  Section · Page · Year  │
└─────────────────────────────────────────────────────────┘
```

### Evidence Slide (Stats)
```
┌─────────────────────────────────────────────────────────┐
│  ○2  SECTION LABEL                                      │
│  ── 3px Signal Red rule ─────────────────────────────  │
│  Headline condensed bold 54px                           │
│  ── 1px rule ─────────────────────────────────────── │
│  │     stat     │     stat     │     stat     │         │
│  │ cond.bold    │ 80px, near-  │ black, no   │         │
│  │ large        │ black        │ color accent│         │
│  ── 1px rule ─────────────────────────────────────── │
│  Body + 380px sidebar                                   │
└─────────────────────────────────────────────────────────┘
```

---

## Component Tokens

```css
/* Section number + label */
.section-marker {
  display: flex; align-items: center; gap: 12px; margin-bottom: 10px;
}
.section-num {
  font-family: var(--type-label); font-size: 11px; font-weight: 500;
  color: var(--color-accent); letter-spacing: 0.20em;
}
.section-label {
  font-family: var(--type-label); font-size: 11px; font-weight: 500;
  color: var(--color-muted); letter-spacing: 0.20em; text-transform: uppercase;
}

/* Swiss accent rule — 3px red */
.accent-rule-heavy {
  width: 100%; height: 3px; background: var(--color-accent); margin-bottom: 0;
}

/* Standard hairline */
.hairline {
  width: 100%; height: 1px; background: var(--color-border);
}

/* Stat column — Swiss data block */
.stat-col {
  display: flex; flex-direction: column;
  padding-right: 48px; border-right: 1px solid var(--color-border);
}
.stat-col:first-child { padding-left: 0; }
.stat-col:last-child  { border-right: none; padding-left: 48px; padding-right: 0; }
.stat-col:nth-child(2){ padding-left: 48px; }
.stat-col__value {
  font-family: var(--type-display); font-size: 80px; font-weight: 700;
  color: var(--color-heading); line-height: 0.90; letter-spacing: -0.01em;
  font-variant-numeric: lining-nums tabular-nums;
}
.stat-col__label {
  font-family: var(--type-label); font-size: 11px; font-weight: 500;
  color: var(--color-muted); text-transform: uppercase; letter-spacing: 0.14em;
  margin-top: 14px; line-height: 1.55;
}

/* Swiss data label — small caps pattern */
.data-label {
  font-family: var(--type-label); font-size: 10px; font-weight: 500;
  color: var(--color-dim); text-transform: uppercase; letter-spacing: 0.20em;
}

/* Folio — bottom right */
.slide-folio {
  position: absolute; bottom: 36px; right: 120px;
  font-family: var(--type-label); font-size: 10px; font-weight: 500;
  color: var(--color-dim); text-transform: uppercase; letter-spacing: 0.15em;
}

/* Red highlight on table row */
.data-table tr.highlight td { background: var(--color-accent-bg); }
.data-table tr.highlight td:first-child { color: var(--color-accent); font-weight: 700; }
```

---

## Print / Export Mode

```css
@media print {
  /* #swiss-bg is already white — no changes needed */
  .slide { page-break-after: always; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

---

## Accessibility

- `--color-heading` over `--color-bg` = 19.8:1 ✓
- `--color-body` over `--color-bg` = 17.1:1 ✓
- `--color-muted` over `--color-bg` = 5.2:1 ✓ — passes AA for normal text
- `--color-accent` (Signal Red) over `--color-bg` = 4.9:1 ✓ — large text / graphical, section numbers only
- `--color-dim` over `--color-bg` = 3.0:1 — large-text graphical threshold; footnotes and folios only
- IBM Plex Sans Condensed Bold at 80px+: excellent legibility; condensed weight at body size (below 20px) is not recommended — this style uses it only at display and headline scales
- No animation — `prefers-reduced-motion` has no active concerns
- Light background: standard institutional reading environment
- All semantic content at z-index 1 above background at z-index 0
