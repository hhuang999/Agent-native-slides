import assert from 'node:assert/strict'
import { readFileSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import test from 'node:test'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')
const read = path => readFileSync(resolve(root, path), 'utf8')
const policy = JSON.parse(read('knowledge/style/font-policy.json'))
const index = JSON.parse(read('knowledge/style/index.json'))

test('every style has matching display, body, and auxiliary font definitions', () => {
  assert.equal(index.styles.length, 53)
  assert.deepEqual(new Set(Object.keys(policy)), new Set(index.styles.map(style => style.id)))
  for (const style of index.styles) {
    const roles = policy[style.id]
    const pair = `${roles.display} + ${roles.body === roles.display ? roles.aux : roles.body}`
    assert.equal(style.font_pair, pair, style.id)
    const design = read(`knowledge/style/${style.id}/design.md`)
    const preview = read(`knowledge/style/${style.id}/preview.html`)
    assert.match(design, /## Screen font compatibility/, style.id)
    assert.match(preview, /href="\.\.\/font-fallback\.css"/, style.id)
    for (const role of ['display', 'body', 'aux']) {
      assert.ok(design.includes(roles[role]), `${style.id} ${role} missing from design`)
      assert.ok(preview.includes(roles[role]), `${style.id} ${role} missing from preview`)
      assert.ok(design.includes(roles[`fallback_${role}`]), `${style.id} ${role} Latin backup missing from design`)
      assert.ok(preview.includes(roles[`fallback_${role}`]), `${style.id} ${role} Latin backup missing from preview`)
      assert.ok(['sans', 'serif', 'wenkai'].includes(roles[`cjk_${role}`]), `${style.id} ${role} CJK class`)
    }
    assert.ok(!preview.includes('api.fontshare.com'), `${style.id} still depends on Fontshare`)
  }
})

test('local CJK fallbacks cover the three intended visual roles', () => {
  const css = read('knowledge/style/font-fallback.css')
  for (const [kind, file] of [['Sans', 'sans.woff2'], ['Serif', 'serif.woff2'], ['WenKai', 'wenkai.woff2']]) {
    assert.ok(css.includes(`font-family: 'Slides CJK ${kind}'`))
    assert.ok(css.includes(`../../assets/fonts/${file}`))
    assert.ok(statSync(resolve(root, 'assets/fonts', file)).size > 100_000)
  }
  assert.match(css, /font-display:\s*swap/)
  assert.match(css, /unicode-range:/)
})
