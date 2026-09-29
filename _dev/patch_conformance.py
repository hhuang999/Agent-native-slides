"""
patch_conformance.py v4 — bring 35 style previews + 4 component demos into
Runtime API conformance (knowledge/RUNTIME.md §3.1).

Fixes over v3:
 - PRINT_CSS always injected (sentinel guard); adds html/body + .deck-stage
   overflow/height overrides so all slides render as separate PDF pages
 - repair_v2_damage: brace-balanced @media print cleanup (not fragile regex)
 - fix_css: checks .slide.is-active OUTSIDE @media blocks only, fixing H-style
   files that had the rule injected inside @media print by v2

Run:  conda run --no-capture-output -n vb python _dev/patch_conformance.py
"""
import re, os, sys

ROOT      = "D:/HHB/Github_my_project/HHB-HTML-PPT-claude/html_ppt_skill_v5"
STYLE_DIR = os.path.join(ROOT, "knowledge/style")
COMP_DIR  = os.path.join(ROOT, "knowledge/component")

NEEDS_FIX_STYLES = [
    "A01","A02","A03","A04","A05","A06","A07","A08",
    "D02","D03","D04","E03","F02","F03",
    "G02","G03","G04","H01","H02","H03",
    "I01","I02","I03","I04","J01","J02","J03",
    "K03","L02","L03","M01","N01","N02","O01","O02",
]

COMP_DEMOS = [
    "charts-demo.html",
    "ml-visuals-demo.html",
    "code-math-demo.html",
    "presentation-primitives-demo.html",
]

# ── Brace-balanced extractor ──────────────────────────────────────────────────

def extract_brace_block(text, start_pat):
    """
    Find the first match of start_pat, then walk forward balancing braces
    to return the full assignment: 'window.__deckPlan = {...}'.
    Returns (assignment_string, start_pos, end_pos) or None.
    """
    m = re.search(start_pat, text)
    if not m:
        return None
    brace_start = text.index('{', m.end())
    depth = 0
    i = brace_start
    in_str = False
    str_char = None
    while i < len(text):
        c = text[i]
        if in_str:
            if c == '\\':
                i += 2
                continue
            if c == str_char:
                in_str = False
        else:
            if c in ('"', "'", '`'):
                in_str = True
                str_char = c
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
                if depth == 0:
                    return (text[m.start():i+1], m.start(), i+1)
        i += 1
    return None


# ── Brace-balanced @media print block locator ────────────────────────────────

def _find_media_print_blocks(html):
    """
    Return list of (start, end) byte positions of every @media print { ... }
    block in html, brace-balanced. end is exclusive (points past closing }).
    """
    positions = []
    i = 0
    pat = re.compile(r'@media\s+print\s*\{', re.I)
    while i < len(html):
        m = pat.search(html, i)
        if not m:
            break
        depth = 0
        j = m.end() - 1  # position of the opening {
        while j < len(html):
            if html[j] == '{':
                depth += 1
            elif html[j] == '}':
                depth -= 1
                if depth == 0:
                    positions.append((m.start(), j + 1))
                    i = j + 1
                    break
            j += 1
        else:
            break
    return positions


def _remove_rules_from_block(inner, selector_pat):
    """
    Remove all top-level CSS rules whose selector matches selector_pat
    from the string `inner` (the content BETWEEN the outer @media braces).
    Uses brace-balanced extraction to correctly handle nested {} blocks.
    """
    result = []
    i = 0
    while i < len(inner):
        m = re.search(selector_pat, inner[i:])
        if not m:
            result.append(inner[i:])
            break
        abs_sel_start = i + m.start()
        result.append(inner[i:abs_sel_start])
        # find the opening { for this rule (may have whitespace between sel and {)
        brace_pos = inner.find('{', abs_sel_start + len(m.group(0)) - 1)
        if brace_pos < 0:
            # no opening brace found – keep rest as-is
            result.append(inner[abs_sel_start:])
            break
        depth = 0
        j = brace_pos
        while j < len(inner):
            if inner[j] == '{':
                depth += 1
            elif inner[j] == '}':
                depth -= 1
                if depth == 0:
                    i = j + 1
                    break
            j += 1
        else:
            # unterminated – stop
            break
    return ''.join(result)


# ── CSS media block splitter ──────────────────────────────────────────────────

def _extract_media_blocks(css):
    """
    Split css into alternating non-media and media-block strings.
    Returns list of (text, is_media_block) tuples.
    """
    parts = []
    i = 0
    while i < len(css):
        m = re.search(r'@media\b', css[i:])
        if not m:
            parts.append((css[i:], False))
            break
        abs_start = i + m.start()
        parts.append((css[i:abs_start], False))
        # brace-balance from @media's opening {
        brace_pos = css.index('{', abs_start)
        depth = 0
        j = brace_pos
        while j < len(css):
            if css[j] == '{':
                depth += 1
            elif css[j] == '}':
                depth -= 1
                if depth == 0:
                    parts.append((css[abs_start:j+1], True))
                    i = j + 1
                    break
            j += 1
        else:
            parts.append((css[abs_start:], True))
            break
    return parts


def _balance_css(css):
    """
    Repair brace imbalance left by earlier block-removal passes.

    Two failure modes, both from deleting an opener but not its body:

      1. STRAY CLOSER — a '}' arriving at depth 0. The text between the last
         balanced boundary and this closer is an orphaned rule tail (no opener).
         Leaving it in place makes the parser pair it with a LATER opener — e.g.
         the injected `@media print {` — so those rules leak to top level and
         the print block silently does nothing. Repair: truncate the orphan.

      2. UNTERMINATED BLOCK — depth > 0 at end of input. The tail of a rule
         survived without its closer. Repair: close it.

    Both are driven by one left-to-right walk; `last_ok` tracks the end of the
    last position where depth was 0, which is the only safe truncation point.
    """
    out = []
    depth = 0
    last_ok = 0          # index into `out` of the last balanced (depth 0) end
    for ch in css:
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
            if depth < 0:
                del out[last_ok:]   # 1. drop the orphaned tail
                depth = 0
                continue
            if depth == 0:
                last_ok = len(out) + 1
        out.append(ch)
    if depth > 0:
        out.append('}' * depth)     # 2. terminate the dangling block
    return ''.join(out)


def _has_is_active_outside_media(html):
    """
    Return True iff .slide.is-active appears outside any @media block in html.
    Scans each <style> block; within each style, uses _extract_media_blocks
    to check only non-media segments.
    """
    for sm in re.finditer(r'<style[^>]*>([\s\S]*?)</style>', html, re.I):
        css = sm.group(1)
        for text, is_media in _extract_media_blocks(css):
            if not is_media and '.slide.is-active' in text:
                return True
    return False


# ── Sentinel & canonical blocks ───────────────────────────────────────────────

# Sentinel comment placed at the END of the injected @media print block so we
# can reliably detect (and replace) a previously-injected v4 print block.
_PRINT_SENTINEL = '/* __PRINT_CSS_V4__ */'

NAV_SCRIPT = """\
<script>
(function () {
  var _slides = Array.from(document.querySelectorAll('.slide'))
  var _total  = _slides.length

  function _goTo(n) {
    n = isNaN(+n) ? 1 : Math.min(Math.max(1, Math.round(+n)), _total)
    _slides.forEach(function (s, i) { s.classList.toggle('is-active', i === n - 1) })
    window.__currentSlide = n
    var cur = document.getElementById('cur')
    if (cur) cur.textContent = n
  }

  window.__goToSlide   = _goTo
  window.__currentSlide = 1

  // Wire existing prev/next buttons if present
  var nb = document.getElementById('next') || document.getElementById('nextBtn')
  var pb = document.getElementById('prev') || document.getElementById('prevBtn')
  if (nb) nb.onclick = function () { _goTo(window.__currentSlide + 1) }
  if (pb) pb.onclick = function () { _goTo(window.__currentSlide - 1) }

  document.addEventListener('keydown', function (e) {
    var k = e.key
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === ' ' || k === 'PageDown') {
      e.preventDefault(); _goTo(window.__currentSlide + 1)
    } else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp') {
      e.preventDefault(); _goTo(window.__currentSlide - 1)
    } else if (k === 'Home') { _goTo(1) }
    else if (k === 'End')  { _goTo(_total) }
  })

  // Normalise __deckPlan: total_slides + per-slide index (1-based)
  if (!window.__deckPlan) {
    window.__deckPlan = {
      title: '', total_slides: _total,
      slides: Array.from({length: _total}, function (_, i) {
        return { index: i + 1, type: 'content', assertion: '' }
      })
    }
  } else {
    // totalSlides alias
    if (window.__deckPlan.totalSlides && !window.__deckPlan.total_slides)
      window.__deckPlan.total_slides = window.__deckPlan.totalSlides
    if (!window.__deckPlan.total_slides)
      window.__deckPlan.total_slides = _total
    // ensure slides array with 1-based index
    if (Array.isArray(window.__deckPlan.slides)) {
      window.__deckPlan.slides.forEach(function (s, i) {
        if (!s.index) s.index = i + 1
      })
    } else {
      window.__deckPlan.slides = Array.from({length: _total}, function (_, i) {
        return { index: i + 1, type: 'content', assertion: '' }
      })
    }
  }

  // Preview / print URL params
  var _q = new URLSearchParams(location.search)
  if (_q.has('print'))   document.documentElement.classList.add('print-mode')
  if (_q.has('preview')) document.documentElement.classList.add('preview-mode')
  _goTo(_q.has('preview') ? (parseInt(_q.get('preview'), 10) || 1) : 1)
})()
</script>"""

# Always replace the @media print block – include html/body and .deck-stage
# overflow overrides so stacked slides are not clipped by the container.
PRINT_CSS = """\
@media print {
  @page { size: 1920px 1080px; margin: 0; }
  *, *::before, *::after {
    animation: none !important; transition: none !important;
  }
  html, body {
    width: 1920px !important; height: auto !important;
    min-height: 0 !important; max-height: none !important;
    overflow: visible !important;
    display: block !important;
    position: static !important;
    align-items: unset !important; justify-content: unset !important;
  }

  /* Reset EVERY element that contains a .slide — by structure, not by name.
     Deck wrappers are called #stage, .stage, #stage-wrapper, #deck-stage, ...
     and any one of them keeping `overflow:hidden` + a fixed height clamps the
     printed document to a single page. `:not(.slide)` keeps this off the
     slides themselves (each .slide is :has()-matched by its own descendants). */
  body *:has(.slide):not(.slide) {
    position: static !important;
    overflow: visible !important;
    height: auto !important;
    min-height: 0 !important; max-height: none !important;
    width: auto !important; max-width: none !important;
    transform: none !important;
    display: block !important;
    align-items: unset !important; justify-content: unset !important;
    flex: none !important;
  }

  /* The slide's own display is preserved (flex/grid/block) — RUNTIME.md §7:
     never `display:none`, or the PDF keeps only the current page. */
  .slide {
    position: relative !important; inset: auto !important;
    display: flex !important;
    visibility: visible !important; opacity: 1 !important;
    pointer-events: auto !important;
    width: 1920px !important; height: 1080px !important;
    min-height: 1080px !important; max-height: 1080px !important;
    overflow: hidden !important;
    break-after: page; page-break-after: always;
    break-inside: avoid; page-break-inside: avoid;
  }
  .slide:last-child { break-after: auto; page-break-after: auto; }

  .slide .reveal, .slide [data-step] {
    opacity: 1 !important; transform: none !important;
    visibility: visible !important;
  }

  .deck-nav, .deck-controls, .wh-ui, .hwp-ui,
  #nav, #nav-bar, #navBar, .nav-bar, .nav-dots, .nav-dot,
  [id*="nav-"], [id*="-nav"], [id*="navBar"], [id*="nav_"],
  #slide-info { display: none !important; }
  /* __PRINT_CSS_V4__ */
}"""

IS_ACTIVE_RULE = """
.slide.is-active {
  visibility: visible; opacity: 1; pointer-events: auto;
}
@media (prefers-reduced-motion: reduce) { .slide { transition: none; } }"""


# ── Helpers ───────────────────────────────────────────────────────────────────

# Matches top-level slide containers (`<div class="slide …">` or
# `<section class="slide …">`). The class value must be exactly `slide` or
# `slide` followed by whitespace, so inner wrappers such as `slide-header`,
# `slide-content`, `slide-body` and `slide-folio` are NOT matched.
# Groups: (1) tag name, (2) pre-class attrs, (3) class value, (4) post-class attrs
SLIDE_EL_RE = re.compile(
    r'<(div|section)([^>]*?)class="(slide(?:\s[^"]*)?)"([^>]*)', re.I)

# Backwards-compatible alias — other call sites still use the old name.
SLIDE_DIV_RE = SLIDE_EL_RE


def _strip_inner_data_slide(html):
    """
    Remove data-slide="N" from any element that is not a top-level slide.

    Works tag-wise: for every opening tag, decide whether it is a real slide
    (class value is `slide` or starts with `slide `) and drop the attribute if
    not. Splitting on '<' keeps this linear and avoids regex back-tracking over
    deeply nested markup.
    """
    out = []
    pos = 0
    for m in re.finditer(r'<(div|section)(\s[^>]*)?>', html, re.I):
        out.append(html[pos:m.start()])
        tag = m.group(0)
        if 'data-slide' in tag:
            cm = re.search(r'class="([^"]*)"', tag, re.I)
            cls = cm.group(1) if cm else ''
            is_slide = cls == 'slide' or cls.startswith('slide ')
            if not is_slide:
                tag = re.sub(r'\s+data-slide="[0-9]+"', '', tag)
        out.append(tag)
        pos = m.end()
    out.append(html[pos:])
    return ''.join(out)


def repair_v2_damage(html):
    """
    Fix corruption introduced by running v2 on already-partially-patched files:
      - is-is-active  →  is-active
      - duplicate data-slide="N" data-slide="N"  →  data-slide="N"
      - .slide.is-active{} and @media(prefers-reduced-motion){} injected
        inside @media print blocks (use brace-balanced locator + brace-balanced
        rule remover to correctly handle nested braces)
    """
    # 1. is-is-active
    html = re.sub(r'\bis-is-active\b', 'is-active', html)

    # 2. duplicate data-slide attributes
    html = re.sub(r'(data-slide="[^"]+")\s+data-slide="[^"]+"', r'\1', html)

    # 3. Rules injected inside @media print by v2 – brace-balanced cleanup.
    #    Use _remove_rules_from_block (brace-balanced) for selector removal so
    #    nested {} inside the injected rules don't leave dangling braces.
    blocks = _find_media_print_blocks(html)
    # Process in reverse so positions stay valid as we replace
    for start, end in reversed(blocks):
        block = html[start:end]
        inner_start = block.index('{') + 1
        inner = block[inner_start:-1]  # content between outer braces
        # remove .slide.is-active { ... } (no nested braces – regex is fine)
        inner = re.sub(r'\s*\.slide\.is-active\s*\{[^}]*\}', '', inner)
        # remove @media (prefers-reduced-motion) { ... } using brace-balanced
        # remover so nested .slide { } blocks don't leave a stray }
        inner = _remove_rules_from_block(
            inner,
            r'@media\s*\(prefers-reduced-motion[^)]*\)')
        new_block = block[:inner_start] + inner + '}'
        html = html[:start] + new_block + html[end:]
    return html


def fix_css(html):
    """
    1. Remove per-slide display:none rules
    2. Remove display:none from bare .slide {} (outside @media)
    3. Remove .slide.active { ... } rule
    4. Ensure .slide has visibility:hidden hiding + opacity transition
    5. Ensure .slide.is-active rule exists OUTSIDE any @media block
    6. Replace (or inject) @media print block with canonical PRINT_CSS
    """
    # 0. Recovery: undo a previous incorrect _demote_inner_slide run that
    #    renamed class="slide is-active …" → class="slide-el is-active …".
    #    The correct demote target is class="slide active-*" (inner wrapper),
    #    NOT class="slide is-active" (real active slide). Any file that was
    #    patched with the old over-broad condition gets its real slide containers
    #    restored here before any other step runs.
    html = re.sub(
        r'\bclass="slide-el(\s+is-active(?:\s[^"]*)?)"',
        r'class="slide\1"', html)

    # 1. per-slide display:none selector rules
    html = re.sub(
        r'\.slide\[data-slide=["\'][0-9]+["\']\]\s*\{[^}]*display\s*:\s*none[^}]*\}\s*',
        '', html)

    # 1b. Orphaned selector heads left by the rule removal above.
    #
    #     The legacy pattern hides slides with a COMMA-SEPARATED selector list:
    #         .slide[data-slide="2"], .slide[data-slide="3"] { display: none }
    #     The regex in step 1 starts matching at the second selector, so removing
    #     it leaves the first one dangling with no declaration block:
    #         .slide[data-slide="2"], /* ── Shared ── */
    #     The parser then attaches the NEXT rule's declarations to that orphan, so
    #     slide 2 silently inherits them (in A07 it picked up `opacity: 0.55` from
    #     `.prism-rule`, which made the slide permanently fail the shown test).
    #
    #     Allow optional trailing /* comment */ on the same line before EOL.
    html = re.sub(
        r'^[ \t]*\.slide\[data-slide=["\'][0-9]+["\']\][ \t]*,[ \t]*(?:/\*[^\n]*)?\r?$',
        '', html, flags=re.M)

    # 1c. ID-scoped legacy slide-hiding rules (I01 and friends):
    #         #slide-2 {          ← multi-line block
    #           display: none;
    #         }
    #         #slide-2.active { display: flex; }
    #     These bypass the `.slide` class entirely, so the rule removals above
    #     never saw them and the slides stay display:none in every mode.
    #     Use re.S so . matches newlines; use \r?\n to handle CRLF files.
    html = re.sub(
        r'^[ \t]*#slide-[0-9]+(?:\.active)?[ \t]*\{[^}]*\}[ \t]*\r?\n',
        '', html, flags=re.M | re.S)

    # 1d. Inner wrappers that carry a real `slide` class token PLUS an
    #     `active-*` modifier (e.g. `slide active-content`, `slide active-header`,
    #     `slide active-number`). querySelectorAll('.slide') counts each one as a
    #     separate slide, inflating the deck total. Demote only those whose second
    #     token starts with `active-`; leave everything else untouched, including:
    #       - class="slide is-active"          ← canonical active slide
    #       - class="slide equation-slide"     ← theme-specific extra token
    #       - class="slide is-active some-mod" ← active + modifiers
    def _demote_inner_slide(m):
        tag, pre, cls, post = m.group(1), m.group(2), m.group(3), m.group(4)
        tokens = cls.split()
        if len(tokens) >= 2 and tokens[0] == 'slide' and tokens[1].startswith('active-'):
            tokens[0] = 'slide-el'
            return f'<{tag}{pre}class="{" ".join(tokens)}"{post}'
        return m.group(0)

    html = SLIDE_EL_RE.sub(_demote_inner_slide, html)

    # 2+3. Operate on <style> block internals with @media protection
    def process_style(sm):
        open_tag, css, close_tag = sm.group(1), sm.group(2), sm.group(3)
        parts = _extract_media_blocks(css)
        new_parts = []
        for text, is_media in parts:
            if not is_media:
                # remove display:none from .slide rule block
                text = re.sub(
                    r'(\.slide\s*\{[^}]*)display\s*:\s*none\s*;([^}]*\})',
                    r'\1\2', text)
                # remove .slide.active { ... }
                text = re.sub(r'\.slide\.active\s*\{[^}]*\}\s*', '', text)
            new_parts.append(text)
        return open_tag + ''.join(new_parts) + close_tag

    html = re.sub(r'(<style[^>]*>)([\s\S]*?)(</style>)', process_style, html, flags=re.I)

    # 4+5. Inject hiding defaults + is-active rule – only if absent outside @media
    if not _has_is_active_outside_media(html):
        def process_style2(sm):
            open_tag, css, close_tag = sm.group(1), sm.group(2), sm.group(3)
            parts = _extract_media_blocks(css)
            injected = False
            new_parts = []
            for text, is_media in parts:
                if not is_media and not injected:
                    def inject_after_slide_rule(m):
                        block = m.group(0)
                        if 'visibility' not in block:
                            block = block.replace(
                                '{',
                                '{\n  visibility: hidden; opacity: 0; pointer-events: none;\n'
                                '  transition: opacity 0.25s ease;',
                                1)
                        return block + IS_ACTIVE_RULE
                    new_text = re.sub(r'\.slide\s*\{[^}]+\}', inject_after_slide_rule, text, count=1)
                    if new_text != text:
                        injected = True
                    new_parts.append(new_text)
                else:
                    new_parts.append(text)
            return open_tag + ''.join(new_parts) + close_tag

        html = re.sub(r'(<style[^>]*>)([\s\S]*?)(</style>)', process_style2, html, flags=re.I)

    # 6. Canonical print CSS is APPENDED as a fresh <style> just before </head>,
    #    not spliced into an existing block.
    #
    #    Why: any <style> block whose braces are unbalanced has its tail silently
    #    discarded by the parser, so an in-place print injection can be swallowed
    #    by damage earlier in the same block. A separate <style> element at the
    #    end of <head> is immune to that AND wins the cascade by source order at
    #    equal specificity, so removing the old blocks is safe even if one of
    #    them can't be located.
    # Remove any print style elements WE injected on a previous run. Only the
    # inner @media print block is found by the scan above, so without this the
    # <style id="deck-print-css"> wrapper survives empty and every re-run stacks
    # another copy (six accumulated before this guard existed).
    html = re.sub(
        r'\s*<style[^>]*id="deck-print-css"[^>]*>[\s\S]*?</style>',
        '', html, flags=re.I)

    blocks = _find_media_print_blocks(html)
    for start, end in reversed(blocks):
        html = html[:start] + html[end:]

    # Balance the braces of every remaining <style> block so orphaned tails left
    # by the removals above can't poison parsing of the rest of the stylesheet.
    def balance_style(sm):
        return sm.group(1) + _balance_css(sm.group(2)) + sm.group(3)

    html = re.sub(r'(<style[^>]*>)([\s\S]*?)(</style>)', balance_style, html, flags=re.I)

    fresh = '\n<style id="deck-print-css">\n' + PRINT_CSS + '\n</style>\n'
    if '</head>' in html:
        html = html.replace('</head>', fresh + '</head>', 1)
    else:
        html = re.sub(r'(<body[^>]*>)', fresh + r'\1', html, count=1, flags=re.I)

    return html


def fix_slide_elements(html):
    """
    - Replace class="slide active" → class="slide is-active"
      (placeholder trick prevents converting is-active → is-is-active)
    - Ensure every top-level slide element has exactly one data-slide="N"
    - Ensure first slide has is-active
    """
    # 0. Strip data-slide from NON-slide elements. An earlier, looser run of this
    #    patcher matched inner wrappers (slide-header, slide-content, …) and
    #    numbered them sequentially, so those files carry bogus data-slide values
    #    on inner divs. Remove them before renumbering, or the canonical count is
    #    measured against polluted markup.
    html = _strip_inner_data_slide(html)

    # 1. Normalise the `active` → `is-active` marker on genuine slide containers,
    #    and undo the `is-` prefix an earlier run wrongly added to a non-slide
    #    class. Both are done as class-TOKEN list edits, not substring regexes:
    #    a bare \bactive\b also matches inside `active-header`, which would turn
    #    O02's inner wrapper `slide active-header` into `slide is-active-header`,
    #    giving it a real `slide` token so querySelectorAll('.slide') counts it
    #    as a slide of its own.
    def _fix_class_attr(m):
        cls = m.group(1)
        tokens = cls.split()
        out = []
        for t in tokens:
            if t.startswith('is-active-'):
                t = t[len('is-'):]          # undo bad prefix: is-active-x → active-x
            out.append(t)
        # `active` is the legacy marker only on a container that also has `slide`
        if 'active' in out and 'slide' in out:
            out = [t for t in out if t != 'active'] + ['is-active']
        return 'class="' + ' '.join(out) + '"'
    html = re.sub(r'class="([^"]*)"', _fix_class_attr, html)

    # 2. Number slides canonically from 1, OVERWRITING any stale value. Existing
    #    data-slide attributes in the tag are removed first — earlier runs left
    #    duplicates (`data-slide="1" data-slide="1"`) and stale trailing values
    #    (`data-slide="2" … data-slide="4"`), and appending without clearing
    #    leaves the last one to win in the DOM.
    counter = [0]
    def add_data_slide(m):
        counter[0] += 1
        tag        = m.group(1)      # 'div' | 'section'
        pre_attrs  = m.group(2)
        cls        = m.group(3)
        post_attrs = m.group(4)
        head = re.sub(r'\s+data-slide="[0-9]+"', '', pre_attrs)
        tail = re.sub(r'\s+data-slide="[0-9]+"', '', post_attrs)
        return ('<' + tag + head + 'class="' + cls + '" data-slide="'
                + str(counter[0]) + '"' + tail)
    html = SLIDE_EL_RE.sub(add_data_slide, html)

    # 3. Ensure the first slide has is-active
    if 'is-active' not in html:
        def add_is_active_first(m):
            tag        = m.group(1)
            pre_attrs  = m.group(2)
            cls        = m.group(3)
            post_attrs = m.group(4)
            rest = cls[5:].strip()          # class value minus leading 'slide'
            return ('<' + tag + pre_attrs + 'class="slide is-active'
                    + ((' ' + rest) if rest else '') + '"' + post_attrs)
        html = SLIDE_EL_RE.sub(add_is_active_first, html, count=1)

    return html


def strip_old_nav_scripts(html):
    """
    Remove <script> blocks that contain the old navigation logic.
    Keep scripts that are purely animation / canvas / other.
    """
    removed = 0
    parts = re.split(r'(<script(?:\s[^>]*)?>[\s\S]*?</script>)', html, flags=re.I)
    result = []
    for part in parts:
        lo = part.lower()
        if (part.lower().startswith('<script') and
            ('window.__gotoslide' in lo or
             ('goto(' in lo and ('display' in lo or '__currentslide' in lo or 'data-slide' in lo)) or
             ('__deckplan' in lo and 'gotoslide' in lo.replace('_', '')))):
            removed += 1
            continue
        result.append(part)
    return ''.join(result), removed


def patch_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()
    original = html

    # 0. Repair any v2 damage first (idempotent on clean files)
    html = repair_v2_damage(html)

    # 1. Fix CSS
    html = fix_css(html)

    # 2. Fix slide HTML attributes
    html = fix_slide_elements(html)

    # 3. Strip old nav scripts
    html, _ = strip_old_nav_scripts(html)

    # 4. Inject canonical nav script before </body>
    if NAV_SCRIPT not in html:
        if '</body>' in html:
            html = html.replace('</body>', NAV_SCRIPT + '\n</body>', 1)
        else:
            html += '\n' + NAV_SCRIPT

    if html != original:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html)
        return True
    return False


# ── Main ──────────────────────────────────────────────────────────────────────

changed = 0
failed  = []

for style_id in NEEDS_FIX_STYLES:
    path = os.path.join(STYLE_DIR, style_id, 'preview.html')
    if not os.path.exists(path):
        print(f'  SKIP (missing): {style_id}')
        continue
    try:
        ok = patch_file(path)
        print(f'  {"PATCHED" if ok else "ALREADY OK"}: {style_id}')
        if ok: changed += 1
    except Exception as e:
        import traceback; traceback.print_exc()
        print(f'  ERROR: {style_id}: {e}')
        failed.append(style_id)

for demo in COMP_DEMOS:
    path = os.path.join(COMP_DIR, demo)
    if not os.path.exists(path):
        print(f'  SKIP (missing): {demo}')
        continue
    try:
        ok = patch_file(path)
        print(f'  {"PATCHED" if ok else "ALREADY OK"}: {demo}')
        if ok: changed += 1
    except Exception as e:
        import traceback; traceback.print_exc()
        print(f'  ERROR: {demo}: {e}')
        failed.append(demo)

print(f'\nDone. {changed} files patched, {len(failed)} errors: {failed}')
sys.exit(1 if failed else 0)
