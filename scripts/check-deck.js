#!/usr/bin/env node
/**
 * check-deck.js — Agent-Native Slides
 *
 * Validates a deck / preview.html against the Runtime API contract in
 * knowledge/RUNTIME.md (§1 fit-to-window stage, §2 slide switching, §3 ?preview=N,
 * §3.1 API, §6.1 rendered text fit, §7 print/PDF, §8 pinned CDN URLs).
 *
 * Usage:
 *   node scripts/check-deck.js <deck.html> [more.html ...] [--shots <dir>] [--json <out.json>]
 *
 * Exit code 0 = every file passed, 1 = at least one failure.
 */

import { mkdirSync, writeFileSync, readFileSync } from 'fs'
import { resolve, basename, dirname, join } from 'path'
import { launchChromium, toFileUrl } from './lib/browser.js'
import { auditSlideLayout, layoutIssueDetail, settleSlideMotion, waitForFonts } from './lib/layout-audit.js'
import { validateDocument } from './lib/document-model.js'

const args = process.argv.slice(2)
const files = []
let shotsDir = null
let jsonOut = null
let fontFallback = false
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--shots') shotsDir = resolve(args[++i])
  else if (args[i] === '--json') jsonOut = resolve(args[++i])
  else if (args[i] === '--font-fallback') fontFallback = true
  else files.push(resolve(args[i]))
}
if (!files.length) {
  console.error('Usage: node check-deck.js <deck.html> [more.html ...] [--shots <dir>] [--json <out.json>] [--font-fallback]')
  process.exit(1)
}
if (shotsDir) mkdirSync(shotsDir, { recursive: true })

const VIEWPORT = { width: 1920, height: 1080 }
const SETTLE_MS = 2500

async function open(browser, url, contextOptions = {}, blockWebFonts = false) {
  const context = await browser.newContext({ viewport: VIEWPORT, ...contextOptions })
  if (blockWebFonts) await context.route('**/*', route => {
    const request = route.request()
    const remoteFont = request.resourceType() === 'font' && /^https?:/i.test(request.url())
    if (remoteFont || /fonts\.googleapis\.com|fonts\.gstatic\.com|api\.fontshare\.com/.test(request.url())) route.abort()
    else route.continue()
  })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', err => errors.push(String(err.message || err)))
  // A pinned CDN URL that 404s silently breaks the deck (e.g. an init script never loads).
  // Network failures (offline) are not reported — only real HTTP errors.
  page.on('response', res => { if (res.status() >= 400) errors.push(`HTTP ${res.status()} ${res.url()}`) })
  await page.goto(url, { waitUntil: 'load', timeout: 60_000 })
  if (!(await waitForFonts(page))) errors.push('fonts did not finish loading before layout inspection')
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
  const layout = []
  const fail = (check, detail) => fails.push({ check, detail })
  const embedded = readFileSync(file, 'utf8').match(/<script id="ans-document" type="application\/json">([\s\S]*?)<\/script>/)
  if (embedded) {
    try { for (const issue of validateDocument(JSON.parse(embedded[1]))) fail('document-model', issue) }
    catch (err) { fail('document-model', `Invalid embedded JSON: ${err.message}`) }
  }
  const checkLayout = async (page, index, mode) => {
    const issues = await auditSlideLayout(page, index)
    layout.push(...issues.map(issue => ({ mode, ...issue })))
    for (const issue of issues.slice(0, 5)) fail(issue.type, layoutIssueDetail(issue, mode))
    if (issues.length > 5) fail('layout-more', `${mode} slide ${index}: ${issues.length - 5} more layout issue(s); see --json output`)
  }
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
    return { file: tag, pass: false, slides: n, fails, layout, errors }
  }

  // ── __goToSlide(1..n), switching method, screenshots ─────
  for (let i = 1; i <= n; i++) {
    await page.evaluate(k => window.__goToSlide(k), i)
    const ok = await waitShown(page, i)
    const cur = await page.evaluate(() => window.__currentSlide)
    const active = await page.evaluate(k => document.querySelectorAll('.slide')[k - 1]?.classList.contains('is-active'), i)
    if (!ok || cur !== i || !active) fail('goToSlide', `goTo(${i}): current=${cur}, is-active=${active}, states=[${await slideStates(page)}]`)
    if (!(await waitForFonts(page))) fail('fonts-ready', `screen slide ${i}: fonts did not finish loading`)
    await settleSlideMotion(page, i)
    await checkLayout(page, i, 'screen')
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

  // ── Fit to window (RUNTIME.md §1) ────────────────────────
  const fit = await open(browser, url, { viewport: { width: 1280, height: 720 } })
  const box = await fit.page.evaluate(() => {
    const s = document.querySelector('.slide.is-active') || document.querySelector('.slide')
    const r = s.getBoundingClientRect()
    return { l: r.left, t: r.top, w: r.width, h: r.height }
  })
  const inside = box.l >= -2 && box.t >= -2 && box.l + box.w <= 1282 && box.t + box.h <= 722
  const filled = box.w >= 1270 || box.h >= 712
  if (!inside || !filled) fail('fit', `at 1280x720 the slide is ${Math.round(box.w)}x${Math.round(box.h)} at (${Math.round(box.l)},${Math.round(box.t)}); the 1920x1080 stage must scale to fit the window`)
  errors.push(...fit.errors)
  await fit.context.close()

  // ── Print / PDF ──────────────────────────────────────────
  const pr = await open(browser, toFileUrl(file, '?print=1'))
  await pr.page.emulateMedia({ media: 'print' })
  if (!(await waitForFonts(pr.page))) fail('fonts-ready', 'print layout: fonts did not finish loading')
  await pr.page.waitForTimeout(200)
  for (let i = 1; i <= n; i++) await checkLayout(pr.page, i, 'print')
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

  // Optional offline-font pass: local CJK faces remain available, remote Latin faces do not.
  if (fontFallback) {
    const fb = await open(browser, url, {}, true)
    for (let i = 1; i <= n; i++) {
      await fb.page.evaluate(k => window.__goToSlide(k), i)
      if (!(await waitForFonts(fb.page))) fail('fonts-ready', `fallback screen slide ${i}: fonts did not finish loading`)
      await settleSlideMotion(fb.page, i)
      await checkLayout(fb.page, i, 'fallback-screen')
    }
    errors.push(...fb.errors)
    await fb.context.close()

    const fp = await open(browser, toFileUrl(file, '?print=1'), {}, true)
    await fp.page.emulateMedia({ media: 'print' })
    if (!(await waitForFonts(fp.page))) fail('fonts-ready', 'fallback print layout: fonts did not finish loading')
    for (let i = 1; i <= n; i++) await checkLayout(fp.page, i, 'fallback-print')
    errors.push(...fp.errors)
    await fp.context.close()
  }

  if (errors.length) fail('pageerror', [...new Set(errors)].slice(0, 3).join(' | '))
  return { file: tag, pass: fails.length === 0, slides: n, fails, layout }
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
