#!/usr/bin/env node
/**
 * export-pptx.js — Agent-Native Slides
 *
 * Exports a deck HTML file to a 16:9 PPTX (LAYOUT_WIDE = 13.33"×7.5")
 * via Playwright screenshot + pptxgenjs slide assembly.
 *
 * Usage:
 *   node scripts/export-pptx.js <deck.html> [deck-plan.json] [output.pptx]
 *
 * Dependencies (run once in scripts/):
 *   npm install
 *   npx playwright install chromium   (optional — falls back to local Chrome / Edge)
 *
 * The deck must implement the Runtime API in knowledge/RUNTIME.md §3.1
 * (1-indexed window.__goToSlide(n), window.__deckPlan.total_slides).
 * Speaker notes come from [deck-plan.json] or, if omitted, window.__deckPlan.slides.
 *
 * Environment variables:
 *   AIHUBMIX_API_KEY  — optional, only needed if the deck calls the API at runtime
 */

import { readFileSync, existsSync } from 'fs'
import { resolve, basename, dirname } from 'path'
import { fileURLToPath } from 'url'
import pptxgen from 'pptxgenjs'
import { launchChromium, toFileUrl } from './lib/browser.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── CLI args ──────────────────────────────────────────────
const [,, deckArg, planArg, outArg] = process.argv

if (!deckArg) {
  console.error('Usage: node export-pptx.js <deck.html> [deck-plan.json] [output.pptx]')
  process.exit(1)
}

const deckPath  = resolve(deckArg)
const planPath  = planArg ? resolve(planArg) : null
const outPath   = outArg  ? resolve(outArg)  : deckPath.replace(/\.html$/, '.pptx')

if (!existsSync(deckPath)) {
  console.error('Deck file not found:', deckPath)
  process.exit(1)
}

// ── Load deck plan (optional but enhances notes) ──────────
let deckPlan = null
if (planPath && existsSync(planPath)) {
  try {
    deckPlan = JSON.parse(readFileSync(planPath, 'utf8'))
    console.log(`Deck plan loaded: ${deckPlan.title || '(untitled)'}, ${deckPlan.total_slides} slides`)
  } catch (e) {
    console.warn('Could not parse deck plan JSON:', e.message)
  }
}

// ── Main export ───────────────────────────────────────────
async function exportToPptx() {
  console.log('Launching browser…')
  const browser = await launchChromium()
  const page    = await browser.newPage()

  // Fixed 1920×1080 stage — must match deck's CSS transform stage
  await page.setViewportSize({ width: 1920, height: 1080 })

  const fileUrl = toFileUrl(deckPath)
  console.log('Loading deck:', fileUrl)
  await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 30_000 })

  // Wait for fonts
  await page.evaluate(() => document.fonts.ready)

  // Hide on-screen deck chrome (prev/next buttons, dots, counters) so it is not
  // baked into the slide images — same selectors as the decks' @media print.
  const HIDE_NAV = `.deck-nav, .deck-controls, .wh-ui, .hwp-ui,
    #nav, #nav-bar, #navBar, .nav-bar, .nav-dots, .nav-dot, .nav-btn, .nav-arrows,
    [id*="nav-"], [id*="-nav"], [id*="navBar"], [id*="nav_"],
    #slide-info, #prev, #next, #prevBtn, #nextBtn { display: none !important; }`
  await page.addStyleTag({ content: HIDE_NAV })

  // Discover slide count: prefer __deckPlan, fall back to [data-slide] count
  const totalSlides = await page.evaluate(() => {
    if (window.__deckPlan) return window.__deckPlan.total_slides
    return document.querySelectorAll('[data-slide]').length || 1
  })
  const total = deckPlan?.total_slides ?? totalSlides
  console.log(`Slides to export: ${total}`)

  // No plan file given: take speaker notes from the deck's embedded __deckPlan
  if (!deckPlan) {
    const embedded = await page.evaluate(() => window.__deckPlan || null)
    if (embedded && Array.isArray(embedded.slides)) deckPlan = embedded
  }

  // Build PPTX
  const pptx = new pptxgen()
  pptx.layout = 'LAYOUT_WIDE'   // 13.33" × 7.5" = 16:9
  if (deckPlan?.title) pptx.title = deckPlan.title
  if (deckPlan?.author) pptx.author = deckPlan.author

  for (let i = 1; i <= total; i++) {
    process.stdout.write(`  Slide ${i}/${total}…`)

    // Navigate to slide
    const moved = await page.evaluate((n) => {
      if (typeof window.__goToSlide === 'function') {
        window.__goToSlide(n)
        return true
      }
      return false
    }, i)

    if (!moved) {
      // Reload with ?preview=N if __goToSlide not available
      await page.goto(`${fileUrl}?preview=${i}`, { waitUntil: 'networkidle', timeout: 20_000 })
      await page.evaluate(() => document.fonts.ready)
      await page.addStyleTag({ content: HIDE_NAV })
    }

    // Let entrance animations settle (300 ms is enough for CSS transitions)
    await page.waitForTimeout(350)

    // Screenshot at full 1920×1080
    const screenshot = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 1920, height: 1080 }
    })

    // Add slide to PPTX
    const slide = pptx.addSlide()
    slide.addImage({
      data: 'image/png;base64,' + screenshot.toString('base64'),
      x: 0, y: 0, w: '100%', h: '100%'
    })

    // Speaker notes from Deck Plan JSON
    const slideData = deckPlan?.slides?.[i - 1]
    if (slideData?.speaker_notes) {
      const sn = slideData.speaker_notes
      const lines = [
        slideData.assertion ? `[Assertion]\n${slideData.assertion}` : null,
        sn.purpose  ? `[Purpose]\n${sn.purpose}` : null,
        sn.key_points?.length
          ? `[Key Points]\n${sn.key_points.map((p, idx) => `  ${idx + 1}. ${p}`).join('\n')}`
          : null,
        sn.transition ? `[Transition]\n${sn.transition}` : null,
        sn.timing ? `[Timing] ${sn.timing}` : null,
        sn.tone   ? `[Tone] ${sn.tone}` : null,
      ].filter(Boolean)

      if (lines.length) slide.addNotes(lines.join('\n\n'))
    }

    process.stdout.write(' ✓\n')
  }

  await browser.close()
  console.log('Browser closed.')

  // Write PPTX file
  await pptx.writeFile({ fileName: outPath })
  console.log(`\nPPTX saved: ${outPath}`)
}

exportToPptx().catch(err => {
  console.error('Export failed:', err)
  process.exit(1)
})
