import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { createServer } from 'node:http'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { once } from 'node:events'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { imageConfig, loadSettings } from '../lib/image-config.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const script = resolve(root, 'scripts/imagegen.js')
const image = Buffer.from([0xff, 0xd8, 0xff, 0xd9])

function runImagegen(variables, output) {
  const env = {
    ...process.env,
    IMAGE_PROVIDER: '', IMAGE_API_URL: '', IMAGE_API_KEY: '', IMAGE_MODEL: '', AIHUBMIX_API_KEY: '',
    ...variables,
  }
  const child = spawn(process.execPath, [script, 'a cover with empty space, no text', output, '--no-fallback'], {
    cwd: root, env, windowsHide: true,
  })
  let stdout = '', stderr = ''
  child.stdout.on('data', chunk => { stdout += chunk })
  child.stderr.on('data', chunk => { stderr += chunk })
  return new Promise((resolveResult, reject) => {
    child.on('error', reject)
    child.on('close', code => resolveResult({ code, stdout, stderr }))
  })
}

async function mockServer(handler) {
  const server = createServer((req, res) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => handler(req, res, Buffer.concat(chunks)))
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  return { server, url: `http://127.0.0.1:${server.address().port}` }
}

function json(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' })
  res.end(JSON.stringify(body))
}

test('root .env is loaded; process environment wins; AIHubMix defaults stay intact', () => {
  const dir = mkdtempSync(join(tmpdir(), 'slides-config-'))
  try {
    writeFileSync(join(dir, '.env'), '# local\nIMAGE_PROVIDER=aihubmix\nIMAGE_API_KEY="file-secret"\nIMAGE_MODEL=custom-model # note\n')
    const settings = loadSettings(dir, { IMAGE_API_KEY: 'shell-secret' })
    assert.equal(settings.IMAGE_API_KEY, 'shell-secret')
    assert.equal(settings.IMAGE_MODEL, 'custom-model')
    const config = imageConfig(settings)
    assert.equal(config.apiUrl, 'https://aihubmix.com/ai/v1/images/generations')
    assert.equal(config.apiKey, 'shell-secret')
    assert.equal(imageConfig({ AIHUBMIX_API_KEY: 'legacy-secret' }).model, 'gpt-image-2.5-sunburst')
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test('missing image key reports the setting without exposing secrets', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'slides-missing-'))
  try {
    const result = await runImagegen({}, join(dir, 'cover.jpg'))
    assert.equal(result.code, 1)
    assert.match(result.stderr, /IMAGE_API_KEY or AIHUBMIX_API_KEY/)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test('custom provider rejects incomplete or incompatible configuration', () => {
  assert.throws(() => imageConfig({ IMAGE_PROVIDER: 'unknown' }), /IMAGE_PROVIDER/)
  assert.throws(() => imageConfig({ IMAGE_PROVIDER: 'openai-compatible' }), /IMAGE_API_URL/)
  assert.throws(() => imageConfig({ IMAGE_PROVIDER: 'openai-compatible', IMAGE_API_URL: 'https://example.com/v1/images/generations' }), /IMAGE_API_KEY/)
  assert.throws(() => imageConfig({ IMAGE_PROVIDER: 'openai-compatible', IMAGE_API_URL: 'https://example.com/v1/images/generations', IMAGE_API_KEY: 'secret' }), /IMAGE_MODEL/)
  assert.throws(() => imageConfig({ IMAGE_PROVIDER: 'aihubmix', IMAGE_API_URL: 'https://example.com/v1/images/generations', IMAGE_API_KEY: 'secret' }), /AIHubMix IMAGE_API_URL/)
})

test('deck asset inlining works without an image API key', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'slides-no-key-'))
  try {
    const deck = join(dir, 'deck.html')
    const output = join(dir, 'portable.html')
    writeFileSync(deck, '<!doctype html><title>Plain deck</title><p>Hello</p>')
    const child = spawn(process.execPath, [resolve(root, 'scripts/inline-assets.js'), deck, output], {
      cwd: root,
      env: { ...process.env, IMAGE_API_KEY: '', AIHUBMIX_API_KEY: '' },
      windowsHide: true,
    })
    const [code] = await once(child, 'close')
    assert.equal(code, 0)
    assert.match(readFileSync(output, 'utf8'), /Plain deck/)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})

test('AIHubMix native URL preserves schema lookup and async-disabled sync fallback', async () => {
  const requests = []
  const secret = 'test-aihubmix-secret'
  const { server, url } = await mockServer((req, res, raw) => {
    requests.push({ path: req.url, authorization: req.headers.authorization, body: raw.length ? JSON.parse(raw) : null })
    if (req.url.startsWith('/call/schema/'))
      return json(res, 200, { endpoints: [{ path: '/ai/v1/images/generations', request: { schema: { properties: { size: {} } } } }] })
    if (req.url === '/ai/v1/images/generations')
      return json(res, 400, { error: { code: 'async_not_enabled', message: secret } })
    if (req.url === '/v1/images/generations')
      return json(res, 200, { data: [{ b64_json: image.toString('base64') }] })
    return json(res, 404, {})
  })
  const dir = mkdtempSync(join(tmpdir(), 'slides-native-'))
  try {
    const output = join(dir, 'cover.jpg')
    const result = await runImagegen({ IMAGE_PROVIDER: 'aihubmix', IMAGE_API_URL: `${url}/ai/v1/images/generations`, IMAGE_API_KEY: secret }, output)
    assert.equal(result.code, 0, result.stderr)
    assert.deepEqual(readFileSync(output), image)
    assert.deepEqual(requests.map(item => item.path), [
      '/call/schema/models/gpt-image-2.5-sunburst/endpoints',
      '/ai/v1/images/generations', '/v1/images/generations',
    ])
    assert.equal(requests[1].body.model, 'gpt-image-2.5-sunburst')
    assert.equal(requests[1].body.size, '1536x1024')
    assert.ok(requests.every(item => item.authorization === `Bearer ${secret}`))
    assert.ok(!(result.stdout + result.stderr).includes(secret))
  } finally {
    server.close()
    rmSync(dir, { recursive: true, force: true })
  }
})

test('custom OpenAI-compatible URL sends synchronous Images request and hides server errors', async () => {
  const requests = []
  const secret = 'test-compatible-secret'
  let fail = false
  const { server, url } = await mockServer((req, res, raw) => {
    requests.push({ path: req.url, authorization: req.headers.authorization, body: JSON.parse(raw) })
    if (fail) return json(res, 401, { error: { message: `bad key ${secret}` } })
    return json(res, 200, { data: [{ b64_json: image.toString('base64') }] })
  })
  const dir = mkdtempSync(join(tmpdir(), 'slides-compatible-'))
  try {
    const variables = {
      IMAGE_PROVIDER: 'openai-compatible', IMAGE_API_URL: `${url}/v1/images/generations`,
      IMAGE_API_KEY: secret, IMAGE_MODEL: 'example-image-model',
    }
    const result = await runImagegen(variables, join(dir, 'cover.jpg'))
    assert.equal(result.code, 0, result.stderr)
    assert.deepEqual(readFileSync(join(dir, 'cover.jpg')), image)
    assert.equal(requests[0].path, '/v1/images/generations')
    assert.equal(requests[0].authorization, `Bearer ${secret}`)
    assert.deepEqual(requests[0].body, {
      model: 'example-image-model', prompt: 'a cover with empty space, no text', n: 1, size: '1536x1024',
    })
    fail = true
    const failed = await runImagegen(variables, join(dir, 'failed.jpg'))
    assert.equal(failed.code, 1)
    assert.match(failed.stderr, /HTTP 401/)
    assert.ok(!(failed.stdout + failed.stderr).includes(secret))
  } finally {
    server.close()
    rmSync(dir, { recursive: true, force: true })
  }
})
