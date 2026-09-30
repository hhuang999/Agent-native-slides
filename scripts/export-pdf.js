#!/usr/bin/env node
/**
 * export-pdf.js — HTML PPT Skill v5
 *
 * Exports a deck HTML file to a 16:9 PDF (1920×1080 px per page)
 * using Playwright headless print.
 *
 * Usage:
 *   node scripts/export-pdf.js <deck.html> [output.pdf]
 *
 * Dependencies (run once in scripts/):
 *   npm install
 *   npx playwright install chromium   (optional — falls back to local Chrome / Edge)
 *
 * The deck's @media print rules (knowledge/RUNTIME.md §7) must:
 *   - Show all slides as stacked 1920×1080 blocks in document flow
 *   - Disable all animations and transitions
 *   - Apply page-break-after: always to each .slide
 * ?print=1 is also appended so decks can add html.print-mode.
 */

import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { launchChromium, toFileUrl } from './lib/browser.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ── CLI args ──────────────────────────────────────────────
const [,, deckArg, outArg] = process.argv

if (!deckArg) {
  console.error('Usage: node export-pdf.js <deck.html> [output.pdf]')
  process.exit(1)
}

const deckPath = resolve(deckArg)
const outPath  = outArg ? resolve(outArg) : deckPath.replace(/\.html$/, '.pdf')

if (!existsSync(deckPath)) {
  console.error('Deck file not found:', deckPath)
  process.exit(1)
}

// ── Main export ───────────────────────────────────────────
async function exportToPdf() {
  console.log('Launching browser…')
  const browser = await launchChromium()
  const page    = await browser.newPage()

  // 1920×1080 viewport — matches fixed stage size
  await page.setViewportSize({ width: 1920, height: 1080 })

  // Add ?print=1 to activate print mode in the deck
  const fileUrl = toFileUrl(deckPath, '?print=1')
  console.log('Loading deck in print mode:', fileUrl)

  await page.goto(fileUrl, { waitUntil: 'networkidle', timeout: 30_000 })

  // Wait for fonts to fully load before capturing
  await page.evaluate(() => document.fonts.ready)

  // Small settle delay for any remaining layout shifts
  await page.waitForTimeout(500)

  // Print to PDF — each slide is a 1920×1080 page at screen resolution
  // Playwright converts px → inches using 96 dpi, so 1920px = 20in, 1080px = 11.25in
  await page.pdf({
    path: outPath,
    width:  '1920px',
    height: '1080px',
    printBackground: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
    // scale 1 = 96dpi — gives native pixel-perfect output
    scale: 1,
  })

  await browser.close()
  console.log(`\nPDF saved: ${outPath}`)
}

exportToPdf().catch(err => {
  console.error('Export failed:', err)
  process.exit(1)
})
