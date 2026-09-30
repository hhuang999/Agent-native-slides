#!/usr/bin/env node
/**
 * imagegen.js — HTML PPT Skill v5
 *
 * Generates a decorative image (cover art, section background) via AIHubMix
 * and saves it to disk. Charts/data visuals use ECharts — never this script.
 *
 * Usage:
 *   node scripts/imagegen.js "<prompt>" <output.jpg> [options]
 *
 * Options:
 *   --model <id>        default gpt-image-2.5-sunburst (fallback: gpt-image-2)
 *   --size <WxH>        default 1536x1024; mapped to aspect_ratio for models
 *                       that only accept a ratio (e.g. gemini-*-image)
 *   --quality <q>       low | medium | high | auto (models that support it)
 *   --no-fallback       fail instead of retrying with the fallback model
 *
 * The output format follows the file extension (.jpg/.jpeg → jpeg, .png, .webp)
 * when the model supports output_format. Prefer .jpg for slide backgrounds:
 * several times smaller than PNG once inlined.
 *
 * To embed: reference the file relatively from the deck
 * (<img src="assets/cover.jpg">, or url(assets/cover.jpg) in CSS), then run
 * scripts/inline-assets.js to produce a single-file deck.
 *
 * Environment variables:
 *   AIHUBMIX_API_KEY  — required. Read from the environment only; never hardcode it.
 *
 * Requests go to the native endpoint (/ai/v1/images/generations) and poll the
 * task if the model runs asynchronously. Accounts without async tasks enabled
 * (https://console.aihubmix.com/async-tasks) fall back to the OpenAI-compatible
 * endpoint, which only serves synchronous models.
 * No dependencies: uses the built-in fetch of Node 18+.
 */

import { writeFileSync, mkdirSync } from 'fs'
import { resolve, dirname, extname } from 'path'

const BASE = 'https://aihubmix.com'
const NATIVE = BASE + '/ai/v1/images/generations'
const COMPAT = BASE + '/v1/images/generations'
const DEFAULT_MODEL = 'gpt-image-2.5-sunburst'
const FALLBACK_MODEL = 'gpt-image-2'
const POLL_MS = 5000
const TIMEOUT_MS = 10 * 60 * 1000

// ── CLI args ──────────────────────────────────────────────
const args = process.argv.slice(2)
const opt = (name, dflt) => {
  const i = args.indexOf(name)
  if (i < 0) return dflt
  const v = args[i + 1]
  args.splice(i, 2)
  return v
}
const flag = name => {
  const i = args.indexOf(name)
  if (i < 0) return false
  args.splice(i, 1)
  return true
}

const model      = opt('--model', DEFAULT_MODEL)
const size       = opt('--size', '1536x1024')
const quality    = opt('--quality', null)
const noFallback = flag('--no-fallback')
const [prompt, outArg] = args

if (!prompt || !outArg) {
  console.error('Usage: node imagegen.js "<prompt>" <output.jpg> [--model id] [--size WxH] [--quality q] [--no-fallback]')
  process.exit(1)
}

const key = process.env.AIHUBMIX_API_KEY
if (!key) {
  console.error('AIHUBMIX_API_KEY is not set. Export it in your shell (never put it in the deck).')
  process.exit(1)
}

const auth = { Authorization: `Bearer ${key}` }
const outPath = resolve(outArg)
const wantFormat = { '.jpg': 'jpeg', '.jpeg': 'jpeg', '.png': 'png', '.webp': 'webp' }[extname(outPath).toLowerCase()]

class ApiError extends Error {
  constructor(status, body) {
    super(`HTTP ${status}: ${JSON.stringify(body).slice(0, 300)}`)
    this.code = body?.error?.code
  }
}

// ── API helpers ───────────────────────────────────────────
async function call(url, init = {}) {
  const res = await fetch(url, { ...init, headers: { ...auth, 'Content-Type': 'application/json', ...init.headers } })
  const text = await res.text()
  let body
  try { body = JSON.parse(text) } catch { body = { raw: text.slice(0, 300) } }
  if (!res.ok) throw new ApiError(res.status, body)
  return body
}

// Request properties the model's native endpoint accepts (null if unknown).
async function schemaProps(modelId) {
  try {
    const j = await call(`${BASE}/call/schema/models/${encodeURIComponent(modelId)}/endpoints`)
    const ep = (j.endpoints || []).find(e => e.path === '/ai/v1/images/generations')
    return ep?.request?.schema?.properties ?? null
  } catch { return null }
}

// Closest allowed aspect ratio to WxH.
function nearestRatio(wxh, allowed) {
  const [w, h] = wxh.split('x').map(Number)
  const target = Math.log(w / h)
  let best = null, bestD = Infinity
  for (const r of allowed) {
    if (typeof r !== 'string') continue
    const [a, b] = r.split(':').map(Number)
    const d = Math.abs(Math.log(a / b) - target)
    if (d < bestD) { best = r; bestD = d }
  }
  return best
}

async function buildBody(modelId) {
  const props = await schemaProps(modelId)
  const body = { model: modelId, prompt, n: 1 }
  if (!props || props.size) body.size = size
  else if (props.aspect_ratio) {
    const allowed = props.aspect_ratio.enum ?? props.aspect_ratio.anyOf?.map(x => x.const) ?? []
    const r = nearestRatio(size, allowed)
    if (r) body.aspect_ratio = r
  }
  if (quality && (!props || props.quality)) body.quality = quality
  if (wantFormat && JSON.stringify(props?.output_format ?? '').includes(`"${wantFormat}"`)) body.output_format = wantFormat
  return body
}

// Result shapes: {data:[{b64_json|url}]} or a task {status, output:[{content_url}]}.
function extractImage(body) {
  const item = body?.data?.[0] ?? body?.output?.[0] ?? body?.images?.[0]
  if (!item) return null
  if (typeof item === 'string') return item.startsWith('http') ? { url: item } : { b64: item }
  if (item.b64_json) return { b64: item.b64_json }
  if (item.content_url) return { url: item.content_url, auth: true }
  if (item.url) return { url: item.url }
  return null
}

async function download(img) {
  if (img.b64) return Buffer.from(img.b64, 'base64')
  const res = await fetch(img.url, img.auth ? { headers: auth } : {})
  if (!res.ok) throw new Error(`download failed: HTTP ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

async function generate(modelId) {
  const body = await buildBody(modelId)
  let res
  try {
    res = await call(NATIVE, { method: 'POST', body: JSON.stringify(body) })
  } catch (err) {
    if (err.code !== 'async_not_enabled') throw err
    console.error('Async tasks not enabled on this account; using the synchronous endpoint.')
    const { model, prompt, n, size, quality } = body
    res = await call(COMPAT, { method: 'POST', body: JSON.stringify({ model, prompt, n, size, quality }) })
  }
  const taskId = res?.id ?? res?.task_id
  const deadline = Date.now() + TIMEOUT_MS
  while (!extractImage(res)) {
    const status = String(res?.status ?? '').toLowerCase()
    if (['failed', 'error', 'cancelled'].includes(status))
      throw new Error(`task ${taskId} ${status}: ${JSON.stringify(res.error ?? '').slice(0, 200)}`)
    if (status === 'completed') throw new Error('task completed without an image: ' + JSON.stringify(res).slice(0, 300))
    if (!taskId) throw new Error('no image and no task id in response: ' + JSON.stringify(res).slice(0, 300))
    if (Date.now() > deadline) throw new Error(`task ${taskId} still ${status || 'pending'} after ${TIMEOUT_MS / 60000} min`)
    await new Promise(r => setTimeout(r, POLL_MS))
    res = await call(`${BASE}/ai/v1/images/${taskId}`)
  }
  return download(extractImage(res))
}

function sniff(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) return 'png'
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'jpeg'
  if (buf.slice(8, 12).toString() === 'WEBP') return 'webp'
  return 'unknown'
}

// ── Main ──────────────────────────────────────────────────
async function main() {
  const t0 = Date.now()
  let used = model, buf
  try {
    buf = await generate(model)
  } catch (err) {
    if (noFallback || model === FALLBACK_MODEL) throw err
    console.error(`${model} failed (${err.message}); falling back to ${FALLBACK_MODEL}`)
    used = FALLBACK_MODEL
    buf = await generate(FALLBACK_MODEL)
  }
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, buf)
  const fmt = sniff(buf)
  if (wantFormat && fmt !== wantFormat)
    console.error(`note: ${used} returned ${fmt}, saved as-is (browsers sniff the real type)`)
  console.log(`Saved ${outPath} (${fmt}, ${(buf.length / 1024).toFixed(0)} KB, ${used}, ${((Date.now() - t0) / 1000).toFixed(0)}s)`)
}

main().catch(err => {
  console.error('imagegen failed:', err.message)
  process.exitCode = 1
})
