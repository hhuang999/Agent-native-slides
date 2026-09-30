#!/usr/bin/env node
/**
 * imagegen.js — HTML PPT Skill v5
 *
 * Generates a decorative image (cover art, background) via AIHubMix and
 * saves it to disk. Charts/data visuals should use
 * ECharts instead — this is for non-data imagery only.
 *
 * Usage:
 *   node scripts/imagegen.js "<prompt>" [output.png] [--model gpt-image-2] [--size 1536x1024] [--quality low|medium|high]
 *   node scripts/imagegen.js "<prompt>" --base64      (prints a data: URI to stdout for inlining)
 *   node scripts/imagegen.js "<prompt>" --native --model flux-2-pro
 *
 * By default requests go to the synchronous OpenAI-compatible endpoint
 * (/v1/images/generations). --native uses /ai/v1/images/generations with task
 * polling, which async-only models (flux-2-*) need; it requires async tasks to
 * be enabled at https://console.aihubmix.com/async-tasks.
 *
 * Environment variables:
 *   AIHUBMIX_API_KEY  — required. Read from the environment only; never hardcode it.
 *
 * Default model is gpt-image-2; on failure it falls back to dall-e-3.
 * Parameters differ per model — see
 *   https://aihubmix.com/call/schema/models/<model_id>/endpoints
 * No dependencies: uses the built-in fetch of Node 18+.
 */

import { writeFileSync } from 'fs'
import { resolve } from 'path'

const COMPAT_API = 'https://aihubmix.com/v1/images'
const NATIVE_API = 'https://aihubmix.com/ai/v1/images'
const FALLBACK_MODEL = 'dall-e-3'
const POLL_MS = 15000

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

const model  = opt('--model', 'gpt-image-2')
const size    = opt('--size', '1536x1024')
const quality = opt('--quality', null)
const base64  = flag('--base64')
const native  = flag('--native')
const API     = native ? NATIVE_API : COMPAT_API
const [prompt, outArg] = args

if (!prompt) {
  console.error('Usage: node imagegen.js "<prompt>" [output.png] [--model id] [--size WxH] [--quality q] [--base64] [--native]')
  process.exit(1)
}

const key = process.env.AIHUBMIX_API_KEY
if (!key) {
  console.error('AIHUBMIX_API_KEY is not set. Export it in your shell (do not put it in the deck).')
  process.exit(1)
}

const headers = { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }

// ── API helpers ───────────────────────────────────────────
async function call(url, init) {
  const res = await fetch(url, { headers, ...init })
  const text = await res.text()
  let body
  try { body = JSON.parse(text) } catch { body = { raw: text } }
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 300)}`)
  return body
}

// Accepts the common response shapes: OpenAI-style data[], or an async task envelope.
function extractImage(body) {
  const item = body?.data?.[0] ?? body?.output?.[0] ?? body?.images?.[0]
  if (!item) return null
  if (typeof item === 'string') return item.startsWith('http') ? { url: item } : { b64: item }
  if (item.b64_json) return { b64: item.b64_json }
  if (item.url) return { url: item.url }
  return null
}

async function generate(modelId) {
  let body = await call(`${API}/generations`, {
    method: 'POST',
    body: JSON.stringify({ model: modelId, prompt, size, n: 1, ...(quality && { quality }) }),
  })
  // Native async models (e.g. flux-2-*) return a task id to poll.
  const taskId = native ? (body?.task_id ?? body?.id) : null
  while (!extractImage(body) && taskId) {
    const status = String(body?.status ?? '').toLowerCase()
    if (['failed', 'error', 'cancelled'].includes(status)) throw new Error(`task ${taskId} ${status}`)
    await new Promise(r => setTimeout(r, POLL_MS))
    body = await call(`${API}/${taskId}`, { method: 'GET' })
  }
  const img = extractImage(body)
  if (!img) throw new Error('no image in response: ' + JSON.stringify(body).slice(0, 300))
  if (img.b64) return Buffer.from(img.b64, 'base64')
  const res = await fetch(img.url)
  if (!res.ok) throw new Error(`download failed: HTTP ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

// ── Main ──────────────────────────────────────────────────
let buf
try {
  buf = await generate(model)
} catch (err) {
  if (model === FALLBACK_MODEL) throw err
  console.error(`${model} failed (${err.message}); falling back to ${FALLBACK_MODEL}`)
  buf = await generate(FALLBACK_MODEL)
}

if (base64) {
  process.stdout.write(`data:image/png;base64,${buf.toString('base64')}\n`)
} else {
  const outPath = resolve(outArg ?? 'image.png')
  writeFileSync(outPath, buf)
  console.log('Saved', outPath, `(${buf.length} bytes)`)
}
