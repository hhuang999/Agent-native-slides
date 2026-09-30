#!/usr/bin/env node
/**
 * Generate optional decorative art for a slide deck. Charts use ECharts.
 * Configuration lives in the project-root .env or the process environment.
 * Node 18+ is required; there are no runtime dependencies.
 *
 * node scripts/imagegen.js "<prompt>" <output.jpg> [--model id] [--size WxH]
 *                          [--quality q] [--no-fallback]
 *
 * Providers: AIHubMix native (default, with schema/async/compat fallback) and
 * OpenAI Images API compatible (single synchronous images/generations call).
 */

import { writeFileSync, mkdirSync } from 'node:fs'
import { resolve, dirname, extname } from 'node:path'
import { imageConfig, loadSettings } from './lib/image-config.js'

const FALLBACK_MODEL = 'gpt-image-2'
const POLL_MS = 5000
const TIMEOUT_MS = 10 * 60 * 1000

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

const cliModel = opt('--model', null)
const size = opt('--size', '1536x1024')
const quality = opt('--quality', null)
const noFallback = flag('--no-fallback')
const [prompt, outArg] = args

if (!prompt || !outArg || args.length !== 2) {
  console.error('Usage: node scripts/imagegen.js "<prompt>" <output.jpg> [--model id] [--size WxH] [--quality q] [--no-fallback]')
  process.exit(1)
}

const outPath = resolve(outArg)
const wantFormat = { '.jpg': 'jpeg', '.jpeg': 'jpeg', '.png': 'png', '.webp': 'webp' }[extname(outPath).toLowerCase()]

class ApiError extends Error {
  constructor(status, code) {
    super(`image API returned HTTP ${status}`)
    this.code = code
  }
}

async function call(config, url, init = {}) {
  let res
  try {
    res = await fetch(url, {
      ...init,
      headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json', ...init.headers },
    })
  } catch {
    // fetch errors may contain a URL (or a token in its query); do not print them.
    throw new Error('image API network request failed')
  }
  let body
  try { body = await res.json() } catch { body = null }
  if (!res.ok) throw new ApiError(res.status, body?.error?.code)
  if (!body || typeof body !== 'object') throw new Error('image API returned invalid JSON')
  return body
}

async function schemaProps(config, modelId) {
  try {
    const body = await call(config, `${config.baseUrl}/call/schema/models/${encodeURIComponent(modelId)}/endpoints`)
    const ep = (body.endpoints || []).find(item => item.path === '/ai/v1/images/generations')
    return ep?.request?.schema?.properties ?? null
  } catch { return null }
}

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

async function nativeBody(config, modelId) {
  const props = await schemaProps(config, modelId)
  const body = { model: modelId, prompt, n: 1 }
  if (!props || props.size) body.size = size
  else if (props.aspect_ratio) {
    const allowed = props.aspect_ratio.enum ?? props.aspect_ratio.anyOf?.map(x => x.const) ?? []
    const ratio = nearestRatio(size, allowed)
    if (ratio) body.aspect_ratio = ratio
  }
  if (quality && (!props || props.quality)) body.quality = quality
  if (wantFormat && JSON.stringify(props?.output_format ?? '').includes(`"${wantFormat}"`))
    body.output_format = wantFormat
  return body
}

function extractImage(body, provider) {
  const item = provider === 'aihubmix'
    ? body?.data?.[0] ?? body?.output?.[0] ?? body?.images?.[0]
    : body?.data?.[0]
  if (!item) return null
  if (typeof item === 'string') return item.startsWith('http') ? { url: item } : { b64: item }
  if (item.b64_json) return { b64: item.b64_json }
  if (provider === 'aihubmix' && item.content_url) return { url: item.content_url, auth: true }
  if (item.url) return { url: item.url }
  return null
}

async function download(config, image) {
  if (image.b64) return Buffer.from(image.b64, 'base64')
  let res
  try { res = await fetch(image.url, image.auth ? { headers: { Authorization: `Bearer ${config.apiKey}` } } : {}) }
  catch { throw new Error('image download network request failed') }
  if (!res.ok) throw new Error(`image download returned HTTP ${res.status}`)
  return Buffer.from(await res.arrayBuffer())
}

async function generateAIHubMix(config, modelId) {
  const body = await nativeBody(config, modelId)
  let response
  try {
    response = await call(config, config.apiUrl, { method: 'POST', body: JSON.stringify(body) })
  } catch (error) {
    if (error.code !== 'async_not_enabled') throw error
    console.error('Async tasks are not enabled; using the AIHubMix synchronous endpoint.')
    const { model, prompt, n, size, quality } = body
    response = await call(config, `${config.baseUrl}/v1/images/generations`, {
      method: 'POST', body: JSON.stringify({ model, prompt, n, size, quality }),
    })
  }
  const taskId = response?.id ?? response?.task_id
  const deadline = Date.now() + TIMEOUT_MS
  while (!extractImage(response, 'aihubmix')) {
    const status = String(response?.status ?? '').toLowerCase()
    if (['failed', 'error', 'cancelled'].includes(status)) throw new Error(`image task ${status}`)
    if (status === 'completed') throw new Error('image task completed without an image')
    if (!taskId) throw new Error('AIHubMix response has no image or task ID')
    if (Date.now() > deadline) throw new Error('image task timed out after 10 minutes')
    await new Promise(done => setTimeout(done, POLL_MS))
    response = await call(config, `${config.baseUrl}/ai/v1/images/${encodeURIComponent(taskId)}`)
  }
  return download(config, extractImage(response, 'aihubmix'))
}

async function generateCompatible(config) {
  const body = { model: config.model, prompt, n: 1, size }
  if (quality) body.quality = quality
  const response = await call(config, config.apiUrl, { method: 'POST', body: JSON.stringify(body) })
  const image = extractImage(response, 'openai-compatible')
  if (!image) throw new Error('OpenAI-compatible response has no data[0].b64_json or data[0].url')
  return download(config, image)
}

function sniff(buf) {
  if (buf[0] === 0x89 && buf[1] === 0x50) return 'png'
  if (buf[0] === 0xff && buf[1] === 0xd8) return 'jpeg'
  if (buf.slice(8, 12).toString() === 'WEBP') return 'webp'
  return 'unknown'
}

async function main() {
  const config = imageConfig(loadSettings(), cliModel)
  const start = Date.now()
  let used = config.model, buffer
  if (config.provider === 'aihubmix') {
    try {
      buffer = await generateAIHubMix(config, used)
    } catch (error) {
      if (noFallback || used === FALLBACK_MODEL) throw error
      console.error(`Primary AIHubMix model failed (${error.message}); trying ${FALLBACK_MODEL}.`)
      used = FALLBACK_MODEL
      buffer = await generateAIHubMix(config, used)
    }
  } else {
    buffer = await generateCompatible(config)
  }
  mkdirSync(dirname(outPath), { recursive: true })
  writeFileSync(outPath, buffer)
  const format = sniff(buffer)
  if (wantFormat && format !== wantFormat)
    console.error(`note: provider returned ${format}; saved as-is (browsers detect the real type)`)
  console.log(`Saved ${outPath} (${format}, ${(buffer.length / 1024).toFixed(0)} KB, ${used}, ${((Date.now() - start) / 1000).toFixed(0)}s)`)
}

main().catch(error => {
  console.error('imagegen failed:', error.message)
  process.exitCode = 1
})
