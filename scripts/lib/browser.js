/**
 * Shared Playwright helpers for the export / check scripts.
 *
 * launchChromium() tries Playwright's bundled Chromium first; if it has not been
 * downloaded (`npx playwright install chromium`), it falls back to a locally
 * installed Chrome, then Edge, so the scripts work without the extra download.
 */

import { pathToFileURL } from 'url'
import { chromium } from 'playwright'

export async function launchChromium(options = {}) {
  const attempts = [{}, { channel: 'chrome' }, { channel: 'msedge' }]
  let lastErr
  for (const extra of attempts) {
    try {
      return await chromium.launch({ headless: true, ...options, ...extra })
    } catch (err) {
      lastErr = err
    }
  }
  throw lastErr
}

// file:// URL that is valid on Windows too ('file://' + 'D:\\x.html' is not).
export function toFileUrl(absPath, query = '') {
  return pathToFileURL(absPath).href + query
}
