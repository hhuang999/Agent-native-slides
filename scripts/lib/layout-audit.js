/** Inspect rendered text, after fonts have loaded, in screen or print media. */
export async function waitForFonts(page) {
  return page.evaluate(async () => {
    const timeout = new Promise(resolve => setTimeout(() => resolve(false), 15000))
    return Promise.race([document.fonts.ready.then(() => document.fonts.status === 'loaded'), timeout])
  })
}

// Inspect/capture the final state of finite entrance animations, not a halfway frame.
export async function settleSlideMotion(page, slideIndex) {
  await page.evaluate(async index => {
    const slide = document.querySelectorAll('.slide')[index - 1]
    for (const animation of slide?.getAnimations({ subtree: true }) || []) {
      if (animation.effect?.getTiming().iterations === Infinity) continue
      try { animation.finish() } catch { /* a cancelled animation has no final frame */ }
    }
    await new Promise(requestAnimationFrame)
  }, slideIndex)
}

export async function auditSlideLayout(page, slideIndex) {
  return page.evaluate(index => {
    const slide = document.querySelectorAll('.slide')[index - 1]
    if (!slide) return [{ type: 'missing-slide', slide: index }]
    const issues = []
    const fragments = []
    const slideBox = slide.getBoundingClientRect()
    const tolerance = 2
    const box = rect => ({ left: rect.left, top: rect.top, right: rect.right, bottom: rect.bottom,
      width: rect.width, height: rect.height })
    const outside = (a, b) => a.left < b.left - tolerance || a.top < b.top - tolerance ||
      a.right > b.right + tolerance || a.bottom > b.bottom + tolerance
    const label = element => {
      const parts = []
      for (let current = element; current && current !== slide; current = current.parentElement) {
        const classes = [...current.classList].slice(0, 2).join('.')
        const siblings = [...(current.parentElement?.children || [])].filter(child => child.tagName === current.tagName)
        const position = siblings.length > 1 ? `:nth-of-type(${siblings.indexOf(current) + 1})` : ''
        parts.unshift(`${current.tagName.toLowerCase()}${current.id ? `#${current.id}` : ''}${classes ? `.${classes}` : ''}${position}`)
      }
      return parts.join(' > ')
    }
    // KaTeX renders a visible HTML copy and a visually clipped MathML copy for accessibility.
    const ignored = element => element.closest('[data-layout-ignore], [aria-hidden="true"], .katex-mathml')
    const textBlock = element => {
      for (let current = element; current && current !== slide; current = current.parentElement) {
        if (/^(block|flex|grid|table|list-item)/.test(getComputedStyle(current).display)) return current
      }
      return element
    }
    const inFlow = (element, block) => {
      for (let current = element; current && current !== block; current = current.parentElement) {
        const css = getComputedStyle(current)
        if (css.position === 'absolute' || css.position === 'fixed' || css.transform !== 'none') return false
      }
      return true
    }
    const visible = element => {
      for (let current = element; current && current !== slide.parentElement; current = current.parentElement) {
        const css = getComputedStyle(current)
        if (css.display === 'none' || css.visibility === 'hidden' || Number(css.opacity) < 0.01) return false
      }
      return true
    }
    const walker = document.createTreeWalker(slide, NodeFilter.SHOW_TEXT)
    let node
    while ((node = walker.nextNode())) {
      const text = node.textContent.trim()
      const parent = node.parentElement
      if (!text || !parent || ignored(parent) || !visible(parent)) continue
      const range = document.createRange()
      range.selectNodeContents(node)
      for (const raw of range.getClientRects()) {
        if (raw.width < 0.5 || raw.height < 0.5) continue
        const rect = box(raw)
        const item = { element: label(parent), rect }
        const block = textBlock(parent)
        fragments.push({ ...item, parent, block, inFlow: inFlow(parent, block) })
        if (outside(rect, slideBox))
          issues.push({ type: 'text-overflow', slide: index, ...item })
        for (let ancestor = parent; ancestor && ancestor !== slide; ancestor = ancestor.parentElement) {
          const css = getComputedStyle(ancestor)
          if (!/(hidden|clip|scroll|auto)/.test(`${css.overflowX} ${css.overflowY}`)) continue
          if (outside(rect, ancestor.getBoundingClientRect())) {
            issues.push({ type: 'text-clipped', slide: index, ...item, clippedBy: label(ancestor) })
            break
          }
        }
      }
    }

    for (let i = 0; i < fragments.length; i++) {
      const a = fragments[i]
      for (let j = i + 1; j < fragments.length; j++) {
        const b = fragments[j]
        if (a.block === b.block && a.inFlow && b.inFlow) continue // adjacent text in one flow
        const width = Math.min(a.rect.right, b.rect.right) - Math.max(a.rect.left, b.rect.left)
        const height = Math.min(a.rect.bottom, b.rect.bottom) - Math.max(a.rect.top, b.rect.top)
        if (width <= 3 || height <= 3) continue
        const ratio = width * height / Math.min(a.rect.width * a.rect.height, b.rect.width * b.rect.height)
        if (ratio >= 0.40)
          issues.push({ type: 'text-overlap', slide: index, element: a.element,
            otherElement: b.element, overlapPx: Math.round(width * height) })
      }
    }
    return issues.slice(0, 40)
  }, slideIndex)
}

export function layoutIssueDetail(issue, mode = 'screen') {
  if (issue.type === 'text-overlap')
    return `${mode} slide ${issue.slide}: ${issue.element} overlaps ${issue.otherElement}`
  if (issue.type === 'text-clipped')
    return `${mode} slide ${issue.slide}: ${issue.element} clipped by ${issue.clippedBy}`
  return `${mode} slide ${issue.slide}: ${issue.element || '.slide'} extends outside the slide`
}
