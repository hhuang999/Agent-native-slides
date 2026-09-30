import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import test from 'node:test'
import { launchChromium } from '../lib/browser.js'
import { auditSlideLayout, waitForFonts } from '../lib/layout-audit.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..')

function runScript(script, args) {
  const child = spawn(process.execPath, [resolve(root, 'scripts', script), ...args], {
    cwd: root, windowsHide: true,
  })
  let output = ''
  child.stdout.on('data', chunk => { output += chunk })
  child.stderr.on('data', chunk => { output += chunk })
  return new Promise((done, reject) => {
    child.on('error', reject)
    child.on('close', code => done({ code, output }))
  })
}

// The three pages exercise Chinese, English, and mixed-script line geometry.
export function fixture(bad = false) {
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><style>
  *{box-sizing:border-box}html,body{margin:0;width:1920px;height:1080px;overflow:hidden}
  .stage{position:relative;width:1920px;height:1080px;overflow:hidden;transform-origin:top left;transform:scale(var(--scale,1))}
  .slide{position:absolute;inset:0;visibility:hidden;opacity:0;padding:90px;background:#f9f8f5;color:#171717;font:28px/1.5 Arial,'Microsoft YaHei',sans-serif}
  .slide.is-active{visibility:visible;opacity:1}.slide h1{font-size:56px;line-height:1.2;margin:0 0 60px}
  .stress{position:absolute;font-size:32px;line-height:1.3;margin:0}
  .overflow{left:1850px;top:300px;width:480px;white-space:nowrap}
  .clip{position:absolute;left:100px;top:300px;width:220px;height:38px;overflow:hidden;white-space:nowrap;font-size:32px}
  .mix-a,.mix-b{left:100px;top:300px;width:700px}
  @media print{@page{size:1920px 1080px;margin:0}html,body{height:auto!important;overflow:visible!important}
    .stage{position:static;transform:none!important;height:auto;overflow:visible}
    .slide{position:relative;inset:auto;width:1920px;height:1080px;visibility:visible!important;opacity:1!important;break-after:page;overflow:hidden}
    .slide:last-child{break-after:auto}}
  </style></head><body><main class="stage">
  <section class="slide" data-slide="1"><h1>中文内容需要清晰可读</h1><p>每页只呈现一个结论和一项证据。</p>${bad ? '<p class="stress overflow">这段中文文字故意超出幻灯片的右边界</p>' : ''}</section>
  <section class="slide" data-slide="2"><h1>English text should remain readable</h1><p>One claim and one visual are enough.</p>${bad ? '<div class="clip">A long English explanation is hidden by this narrow box.</div>' : ''}</section>
  <section class="slide" data-slide="3"><h1>Mixed 中英 content has room to breathe</h1><p>图表 labels should not collide with notes.</p>${bad ? '<p class="stress mix-a">模型 accuracy 提升 28%</p><p class="stress mix-b">模型 accuracy 提升 28%</p>' : ''}</section>
  </main><script>
  const slides=[...document.querySelectorAll('.slide')];
  window.__deckPlan={title:'Layout fixture',total_slides:3,slides:slides.map((_,i)=>({index:i+1,type:'claim-evidence',assertion:'Readable text',speaker_notes:{key_points:['Long explanation belongs here']}}))};
  window.__goToSlide=n=>{n=Math.min(slides.length,Math.max(1,n));slides.forEach((s,i)=>s.classList.toggle('is-active',i===n-1));window.__currentSlide=n};
  window.__goToSlide(1);const q=new URLSearchParams(location.search);
  if(q.has('preview')){document.documentElement.classList.add('preview-mode');window.__goToSlide(Number(q.get('preview'))||1)}
  if(q.has('print'))document.documentElement.classList.add('print-mode');
  const fit=()=>document.documentElement.style.setProperty('--scale',Math.min(innerWidth/1920,innerHeight/1080));
  document.fonts.ready.then(fit);addEventListener('resize',fit);
  addEventListener('keydown',e=>{if(e.key==='ArrowRight')window.__goToSlide(window.__currentSlide+1);
    if(e.key==='ArrowLeft')window.__goToSlide(window.__currentSlide-1);
    if(e.key==='Home')window.__goToSlide(1);if(e.key==='End')window.__goToSlide(slides.length)});
  </script></body></html>`
}

if (process.env.LAYOUT_FIXTURE_DIR) {
  mkdirSync(process.env.LAYOUT_FIXTURE_DIR, { recursive: true })
  writeFileSync(join(process.env.LAYOUT_FIXTURE_DIR, 'layout-good.html'), fixture())
  writeFileSync(join(process.env.LAYOUT_FIXTURE_DIR, 'layout-bad.html'), fixture(true))
}

test('post-font layout audit accepts readable Chinese, English, and mixed slides', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'slides-layout-good-'))
  const file = join(dir, 'deck.html')
  writeFileSync(file, fixture())
  const browser = await launchChromium()
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
    await page.goto(pathToFileURL(file).href)
    for (let i = 1; i <= 3; i++) {
      await page.evaluate(n => window.__goToSlide(n), i)
      assert.equal(await waitForFonts(page), true)
      assert.deepEqual(await auditSlideLayout(page, i), [], `screen slide ${i}`)
    }
    await page.emulateMedia({ media: 'print' })
    assert.equal(await waitForFonts(page), true)
    for (let i = 1; i <= 3; i++) assert.deepEqual(await auditSlideLayout(page, i), [], `print slide ${i}`)
    await page.close()
  } finally { await browser.close(); rmSync(dir, { recursive: true, force: true }) }
})

test('post-font layout audit detects overflow, clipping, and overlap across scripts', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'slides-layout-bad-'))
  const file = join(dir, 'deck.html')
  writeFileSync(file, fixture(true))
  const browser = await launchChromium()
  try {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
    await page.goto(pathToFileURL(file).href)
    for (let i = 1; i <= 3; i++) {
      await page.evaluate(n => window.__goToSlide(n), i)
      assert.equal(await waitForFonts(page), true)
      const issues = await auditSlideLayout(page, i)
      assert.ok(issues.some(issue => issue.type === ['text-overflow', 'text-clipped', 'text-overlap'][i - 1]), `screen slide ${i}: ${JSON.stringify(issues)}`)
    }
    await page.emulateMedia({ media: 'print' })
    assert.equal(await waitForFonts(page), true)
    for (let i = 1; i <= 3; i++) {
      const issues = await auditSlideLayout(page, i)
      assert.ok(issues.some(issue => issue.type === ['text-overflow', 'text-clipped', 'text-overlap'][i - 1]), `print slide ${i}: ${JSON.stringify(issues)}`)
    }
    await page.close()
  } finally { await browser.close(); rmSync(dir, { recursive: true, force: true }) }
})

test('check-deck reports all three layout failures; both exporters reject them', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'slides-layout-cli-'))
  const bad = join(dir, 'bad.html')
  const report = join(dir, 'report.json')
  writeFileSync(bad, fixture(true))
  try {
    const checked = await runScript('check-deck.js', [bad, '--json', report, '--font-fallback'])
    assert.equal(checked.code, 1)
    for (const category of ['text-overflow', 'text-clipped', 'text-overlap'])
      assert.match(checked.output, new RegExp(category))
    assert.ok(!checked.output.includes('这段中文文字故意超出'))
    assert.ok(!readFileSync(report, 'utf8').includes('这段中文文字故意超出'))
    const [pdf, pptx] = await Promise.all([
      runScript('export-pdf.js', [bad]),
      runScript('export-pptx.js', [bad]),
    ])
    assert.equal(pdf.code, 1)
    assert.match(pdf.output, /PDF export stopped: print slide 1/)
    assert.equal(pptx.code, 1)
    assert.match(pptx.output, /PPTX export stopped: screen slide 1/)
  } finally { rmSync(dir, { recursive: true, force: true }) }
})
