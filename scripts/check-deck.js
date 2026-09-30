#!/usr/bin/env node
/**
 * check-deck.js — HTML PPT Skill v5
 *
 * Validates a deck / preview.html against the Runtime API contract in
 * knowledge/RUNTIME.md (§2 slide switching, §3 ?preview=N, §3.1 API, §7 print/PDF).
 *
 * Usage:
 *   node scripts/check-deck.js <deck.html> [more.html ...] [--shots <dir>] [--json <out.json>]
 *
 * Exit code 0 = every file passed, 1 = at least one failure.
 */

import { mkdirSync, writeFileSync } from 'fs'
import { resolve, basename, dirname, join } from 'path'
import { launchChromium, toFileUrl } from './lib/browser.js'

const args = process.argv.slice(2)
const files = []
let shotsDir = null
let jsonOut = null
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--shots') shotsDir = resolve(args[++i])
  else if (args[i] === '--json') jsonOut = resolve(args[++i])
  else files.push(resolve(args[i]))
}
if (!files.length) {
  console.error('Usage: node check-deck.js <deck.html> [more.html ...] [--shots <dir>] [--json <out.json>]')
  process.exit(1)
}
if (shotsDir) mkdirSync(shotsDir, { recursive: true })

const VIEWPORT = { width: 1920, height: 1080 }
const SETTLE_MS = 2500

async function open(browser, url, contextOptions = {}) {
  const context = await browser.newContext({ viewport: VIEWPORT, ...contextOptions })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', err => errors.push(String(err.message || err)))
  await page.goto(url, { waitUntil: 'load', timeout: 60_000 })
  await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 10_000))]))
  await page.waitForTimeout(300)
  return { context, page, errors }
}

// Resolves once slide n (1-indexed) is the only visible slide; returns false on timeout.
async function waitShown(page, n) {
  try {
    await page.waitForFunction(target => {
      const slides = Array.from(document.querySelectorAll('.slide'))
      const shown = slides.map(s => {
        const cs = getComputedStyle(s)
        const r = s.getBoundingClientRect()
        return cs.display !== 'none' && cs.visibility === 'visible' && parseFloat(cs.opacity) > 0.9 && r.width > 0
      })
      return shown.filter(Boolean).length === 1 && shown[target - 1] === true
    }, n, { timeout: SETTLE_MS })
    return true
  } catch {
    return false
  }
}

function slideStates(page) {
  return page.evaluate(() => Array.from(document.querySelectorAll('.slide')).map((s, i) => {
    const cs = getComputedStyle(s)
    return `${i + 1}:${cs.display}/${cs.visibility}/${(+cs.opacity).toFixed(2)}${s.classList.contains('is-active') ? '*' : ''}`
  }).join(' '))
}

function countPdfPages(buf) {
  return (buf.toString('latin1').match(/\/Type\s*\/Page(?![a-zA-Z])/g) || []).length
}

async function checkFile(browser, file) {
  const fails = []
  const fail = (check, detail) => fails.push({ check, detail })
  const url = toFileUrl(file)
  const tag = basename(dirname(file)) + '/' + basename(file)

  // ── Base load: API shape ─────────────────────────────────
  const { context, page, errors } = await open(browser, url)
  const info = await page.evaluate(() => {
    const slides = Array.from(document.querySelectorAll('.slide'))
    const dp = window.__deckPlan
    return {
      count: slides.length,
      dpType: dp === undefined ? 'undefined' : Array.isArray(dp) ? 'array' : typeof dp,
      total: dp && !Array.isArray(dp) ? dp.total_slides : undefined,
      slidesLen: dp && Array.isArray(dp.slides) ? dp.slides.length : null,
      indexOk: !!(dp && Array.isArray(dp.slides) && dp.slides.every((s, i) => s && s.index === i + 1)),
      dataSlide: slides.map(s => s.dataset.slide ?? null),
      cur: window.__currentSlide,
      goType: typeof window.__goToSlide,
    }
  })
  const n = info.count
  if (n < 1) fail('slides', 'no .slide elements found')
  if (info.dpType !== 'object') fail('deckPlan-object', `window.__deckPlan is ${info.dpType}`)
  else {
    if (info.total !== n) fail('total_slides', `__deckPlan.total_slides=${info.total}, .slide count=${n}`)
    if (info.slidesLen !== n || !info.indexOk) fail('deckPlan-slides', `slides length=${info.slidesLen}, index 1..n ok=${info.indexOk}`)
  }
  if (!info.dataSlide.every((v, i) => v === String(i + 1))) fail('data-slide', `data-slide values: ${JSON.stringify(info.dataSlide)}`)
  if (info.cur !== 1) fail('initial-current', `__currentSlide at load = ${JSON.stringify(info.cur)}`)
  if (info.goType !== 'function') {
    fail('goToSlide', '__goToSlide is not a function')
    await context.close()
    return { file: tag, pass: false, slides: n, fails, errors }
  }

  // ── __goToSlide(1..n), switching method, screenshots ─────
  for (let i = 1; i <= n; i++) {
    await page.evaluate(k => window.__goToSlide(k), i)
    const ok = await waitShown(page, i)
    const cur = await page.evaluate(() => window.__currentSlide)
    const active = await page.evaluate(k => document.querySelectorAll('.slide')[k - 1]?.classList.contains('is-active'), i)
    if (!ok || cur !== i || !active) fail('goToSlide', `goTo(${i}): current=${cur}, is-active=${active}, states=[${await slideStates(page)}]`)
    const hiddenByDisplay = await page.evaluate(() => Array.from(document.querySelectorAll('.slide'))
      .filter(s => getComputedStyle(s).display === 'none').length)
    if (hiddenByDisplay) fail('no-display-none', `goTo(${i}): ${hiddenByDisplay} slide(s) hidden with display:none`)
    if (shotsDir) {
      await page.waitForTimeout(600)
      await page.screenshot({ path: join(shotsDir, `${tag.replace(/[\\/]/g, '__').replace(/\.html$/, '')}-s${i}.png`) })
    }
  }

  // ── Clamping ─────────────────────────────────────────────
  await page.evaluate(k => window.__goToSlide(k), n + 5)
  const hi = await page.evaluate(() => window.__currentSlide)
  await page.evaluate(() => window.__goToSlide(0))
  const lo = await page.evaluate(() => window.__currentSlide)
  if (hi !== n || lo !== 1) fail('clamp', `goTo(${n + 5}) -> ${hi}, goTo(0) -> ${lo}`)

  // ── Keyboard ─────────────────────────────────────────────
  await page.evaluate(() => window.__goToSlide(1))
  await page.waitForTimeout(100)
  const keySeq = n >= 2
    ? [['ArrowRight', 2], ['ArrowLeft', 1], ['End', n], ['Home', 1]]
    : [['End', 1], ['Home', 1]]
  for (const [key, want] of keySeq) {
    await page.keyboard.press(key)
    await page.waitForTimeout(150)
    const got = await page.evaluate(() => window.__currentSlide)
    if (got !== want) { fail('keyboard', `${key} -> ${got}, expected ${want}`); break }
  }
  await context.close()

  // ── ?preview=N (1-indexed) ───────────────────────────────
  const target = Math.min(2, n)
  const pv = await open(browser, toFileUrl(file, `?preview=${target}`))
  const pvOk = await waitShown(pv.page, target)
  const pvInfo = await pv.page.evaluate(() => ({
    cur: window.__currentSlide,
    mode: document.documentElement.classList.contains('preview-mode'),
  }))
  if (!pvOk || pvInfo.cur !== target) fail('preview', `?preview=${target}: current=${pvInfo.cur}, states=[${await slideStates(pv.page)}]`)
  if (!pvInfo.mode) fail('preview-mode', '?preview=N did not add html.preview-mode')
  errors.push(...pv.errors)
  await pv.context.close()

  // ── Print / PDF ──────────────────────────────────────────
  const pr = await open(browser, toFileUrl(file, '?print=1'))
  await pr.page.emulateMedia({ media: 'print' })
  await pr.page.waitForTimeout(200)
  const printInfo = await pr.page.evaluate(() => Array.from(document.querySelectorAll('.slide')).map(s => {
    const cs = getComputedStyle(s)
    const r = s.getBoundingClientRect()
    return { shown: cs.display !== 'none' && cs.visibility === 'visible' && parseFloat(cs.opacity) > 0.9, h: Math.round(r.height), top: Math.round(r.top + window.scrollY) }
  }))
  const notShown = printInfo.map((p, i) => p.shown ? null : i + 1).filter(Boolean)
  if (notShown.length) fail('print-visible', `slides not visible in print media: ${notShown.join(',')}`)
  const badHeight = printInfo.map((p, i) => Math.abs(p.h - 1080) <= 2 ? null : `${i + 1}:${p.h}`).filter(Boolean)
  if (badHeight.length) fail('print-size', `slide heights in print media (want 1080): ${badHeight.join(' ')}`)
  const stacked = printInfo.every((p, i) => i === 0 || p.top - printInfo[i - 1].top >= 1078)
  if (!stacked) fail('print-flow', `slides overlap in print flow; tops=${printInfo.map(p => p.top).join(',')}`)
  const pdf = await pr.page.pdf({ width: '1920px', height: '1080px', printBackground: true, margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' } })
  const pages = countPdfPages(pdf)
  if (pages !== n) fail('pdf-pages', `PDF has ${pages} page(s), expected ${n}`)
  errors.push(...pr.errors)
  await pr.context.close()

  // ── prefers-reduced-motion ───────────────────────────────
  const rm = await open(browser, url, { reducedMotion: 'reduce' })
  await rm.page.evaluate(k => window.__goToSlide(k), target)
  if (!(await waitShown(rm.page, target))) fail('reduced-motion', `goTo(${target}) under reduced motion: states=[${await slideStates(rm.page)}]`)
  errors.push(...rm.errors)
  await rm.context.close()

  if (errors.length) fail('pageerror', [...new Set(errors)].slice(0, 3).join(' | '))
  return { file: tag, pass: fails.length === 0, slides: n, fails }
}

const browser = await launchChromium()
const results = []
for (const file of files) {
  let r
  try {
    r = await checkFile(browser, file)
  } catch (err) {
    r = { file: basename(dirname(file)) + '/' + basename(file), pass: false, slides: 0, fails: [{ check: 'crash', detail: String(err.message || err).split('\n')[0] }] }
  }
  results.push(r)
  console.log(`${r.pass ? 'PASS' : 'FAIL'}  ${r.file}  (${r.slides} slides)`)
  for (const f of r.fails) console.log(`      - ${f.check}: ${f.detail}`)
}
await browser.close()

const failed = results.filter(r => !r.pass).length
console.log(`\n${results.length - failed}/${results.length} passed`)
if (jsonOut) writeFileSync(jsonOut, JSON.stringify(results, null, 2))
process.exit(failed ? 1 : 0)
