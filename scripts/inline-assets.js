#!/usr/bin/env node
/**
 * inline-assets.js — HTML PPT Skill v5
 *
 * Turns a deck that references local images/fonts by relative path into a
 * single self-contained HTML file by replacing each reference with a data: URI.
 * Covers src=, href= (image files only), poster=, srcset=, and CSS url(...)
 * in <style> blocks and style="" attributes. Remote (http/https/data:) URLs
 * are left untouched.
 *
 * Usage:
 *   node scripts/inline-assets.js <deck.html> [output.html]
 *   (default output: <deck>.inline.html next to the input)
 *
 * Typical flow with generated images:
 *   node scripts/imagegen.js "<prompt>" decks/q3/assets/cover.jpg
 *   # deck: <div class="cover" style="background-image:url(assets/cover.jpg)">
 *   node scripts/inline-assets.js decks/q3/deck.html
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { resolve, dirname, extname } from 'path'

const MIME = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp',
  '.gif': 'image/gif', '.svg': 'image/svg+xml', '.avif': 'image/avif',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.ttf': 'font/ttf', '.otf': 'font/otf',
}

// ── CLI args ──────────────────────────────────────────────
const [,, deckArg, outArg] = process.argv
if (!deckArg) {
  console.error('Usage: node inline-assets.js <deck.html> [output.html]')
  process.exit(1)
}
const deckPath = resolve(deckArg)
const outPath  = outArg ? resolve(outArg) : deckPath.replace(/\.html?$/i, '') + '.inline.html'
if (!existsSync(deckPath)) {
  console.error('Deck file not found:', deckPath)
  process.exit(1)
}

const baseDir = dirname(deckPath)
let html = readFileSync(deckPath, 'utf8')
const inlined = new Map()
const missing = new Set()

// Use the real bytes to pick the image type, so a .jpg that holds a PNG still works.
function mimeOf(buf, ext) {
  if (buf[0] === 0x89 && buf[1] === 0x50) return 'image/png'
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'image/jpeg'
  if (buf.slice(8, 12).toString() === 'WEBP') return 'image/webp'
  return MIME[ext]
}

function toDataUri(ref) {
  const clean = ref.trim().replace(/^['"]|['"]$/g, '')
  if (!clean || /^(data:|https?:|\/\/|#|blob:)/i.test(clean)) return null
  const path = decodeURI(clean.split(/[?#]/)[0])
  const ext = extname(path).toLowerCase()
  if (!MIME[ext]) return null
  const file = resolve(baseDir, path)
  if (!existsSync(file)) { missing.add(clean); return null }
  if (!inlined.has(file)) {
    const buf = readFileSync(file)
    inlined.set(file, `data:${mimeOf(buf, ext)};base64,${buf.toString('base64')}`)
  }
  return inlined.get(file)
}

// CSS url(...) anywhere (style blocks and style attributes)
html = html.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/gi, (m, q, ref) => {
  const uri = toDataUri(ref)
  return uri ? `url("${uri}")` : m
})
// Attribute references
html = html.replace(/\b(src|href|poster|xlink:href)=(["'])([^"']+)\2/gi, (m, attr, q, ref) => {
  if (/href$/i.test(attr) && !/\.(png|jpe?g|webp|gif|svg|avif)([?#]|$)/i.test(ref)) return m
  const uri = toDataUri(ref)
  return uri ? `${attr}=${q}${uri}${q}` : m
})
html = html.replace(/\bsrcset=(["'])([^"']+)\1/gi, (m, q, set) =>
  `srcset=${q}${set.split(',').map(part => {
    const [ref, ...desc] = part.trim().split(/\s+/)
    return [toDataUri(ref) ?? ref, ...desc].join(' ')
  }).join(', ')}${q}`)

writeFileSync(outPath, html)
console.log(`Inlined ${inlined.size} file(s) → ${outPath} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KB)`)
if (missing.size) {
  console.error('Missing (left as-is):', [...missing].join(', '))
  process.exitCode = 1
}
