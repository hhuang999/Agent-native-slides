import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

export const PROJECT_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

// Keep the parser dependency-free. Invalid lines report their number, never their value.
export function parseEnv(text) {
  const values = {}
  for (const [index, line] of text.split(/\r?\n/).entries()) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const match = /^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/.exec(trimmed)
    if (!match) throw new Error(`Invalid .env entry on line ${index + 1}`)
    let value = match[2]
    if (value.startsWith('"') || value.startsWith("'")) {
      const quote = value[0]
      const end = value.indexOf(quote, 1)
      if (end < 0 || value.slice(end + 1).trim().replace(/^#.*$/, '') !== '')
        throw new Error(`Invalid .env entry on line ${index + 1}`)
      value = value.slice(1, end)
      if (quote === '"') value = value.replace(/\\n/g, '\n').replace(/\\r/g, '\r').replace(/\\\\/g, '\\')
    } else {
      value = value.replace(/\s+#.*$/, '').trim()
    }
    values[match[1]] = value
  }
  return values
}

export function loadSettings(root = PROJECT_ROOT, environment = process.env) {
  let fileValues = {}
  try {
    fileValues = parseEnv(readFileSync(resolve(root, '.env'), 'utf8'))
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  // Shell variables take precedence, including an explicitly empty value.
  return { ...fileValues, ...environment }
}

function endpoint(raw, label) {
  let url
  try { url = new URL(raw) } catch { throw new Error(`${label} must be an absolute HTTP(S) URL`) }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.search || url.hash)
    throw new Error(`${label} must be an HTTP(S) URL without credentials, query, or fragment`)
  if (url.protocol === 'http:' && !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname))
    throw new Error(`${label} must use HTTPS except for localhost testing`)
  return url.href
}

export function imageConfig(settings, cliModel) {
  const provider = (settings.IMAGE_PROVIDER || 'aihubmix').toLowerCase()
  if (!['aihubmix', 'openai-compatible'].includes(provider))
    throw new Error('IMAGE_PROVIDER must be aihubmix or openai-compatible')

  if (provider === 'aihubmix') {
    const apiUrl = endpoint(settings.IMAGE_API_URL || 'https://aihubmix.com/ai/v1/images/generations', 'IMAGE_API_URL')
    const suffix = '/ai/v1/images/generations'
    if (!new URL(apiUrl).pathname.endsWith(suffix))
      throw new Error('AIHubMix IMAGE_API_URL must end in /ai/v1/images/generations')
    const apiKey = settings.IMAGE_API_KEY || settings.AIHUBMIX_API_KEY
    if (!apiKey) throw new Error('AIHubMix image generation requires IMAGE_API_KEY or AIHUBMIX_API_KEY in the root .env or shell')
    return {
      provider, apiUrl, apiKey,
      baseUrl: apiUrl.slice(0, -suffix.length),
      model: cliModel || settings.IMAGE_MODEL || 'gpt-image-2.5-sunburst',
    }
  }

  if (!settings.IMAGE_API_URL) throw new Error('IMAGE_API_URL is required for IMAGE_PROVIDER=openai-compatible')
  if (!settings.IMAGE_API_KEY) throw new Error('IMAGE_API_KEY is required for IMAGE_PROVIDER=openai-compatible')
  if (!cliModel && !settings.IMAGE_MODEL) throw new Error('IMAGE_MODEL or --model is required for IMAGE_PROVIDER=openai-compatible')
  return {
    provider,
    apiUrl: endpoint(settings.IMAGE_API_URL, 'IMAGE_API_URL'),
    apiKey: settings.IMAGE_API_KEY,
    model: cliModel || settings.IMAGE_MODEL,
  }
}
