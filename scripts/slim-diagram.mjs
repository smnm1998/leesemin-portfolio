#!/usr/bin/env node
/**
 * archify가 만든 아키텍처 다이어그램 HTML을 임베드용으로 줄인다.
 *
 * archify 출력은 툴바·가이드·내보내기까지 담은 뷰어(약 640KB)다. 사이트는 `?embed=1`로 열어 그
 * UI를 전부 숨기므로, 그림(SVG)과 그 그림에 쓰이는 CSS만 남겨 수십 KB로 만든다.
 *
 * - 뷰어 JS는 모두 제거한다. 호버 효과(CSS)는 그대로이고, 클릭 확대·포커스 같은 뷰어
 *   상호작용만 없어진다. `?embed=1&theme=light|dark` 규약은 그대로 지원한다.
 * - CSS는 남은 DOM에 존재할 수 있는 규칙만 보수적으로 유지한다(의심스러우면 남긴다).
 *   JS가 런타임에 붙이는 상태(`data-embed`, `data-theme`)는 아래 ROOT_STATE로 직접 알려준다.
 * - 외부 의존성이 없다(Node 18+).
 *
 * 사용: node scripts/slim-diagram.mjs <입력.html> [출력.html]   (출력을 생략하면 입력을 덮어쓴다)
 *
 * 원본(뷰어 전체)은 git 히스토리에 있다: git show 880808e:public/projects/fitfoyo/architecture.html
 */
import fs from 'node:fs';

// 임베드 모드에서 <html>에 붙는 상태. 원본 JS가 붙이던 것을 정적으로 대신 선언한다.
const ROOT_STATE = {
  'data-theme': ['light', 'dark'],
  'data-embed': ['true'],
  'data-preset': ['classic'],
};

/** 의사 클래스/요소 중 정적 DOM에서 판정할 수 없어 무시하는 것들(= 조건 없이 통과시킨다). */
const FUNCTIONAL_PSEUDO = /:(?:not|is|where|has|nth-child|nth-last-child|nth-of-type|lang|dir)\(/gi;

// ───────────────────────── 문자열 유틸 ─────────────────────────

/** 따옴표·괄호·대괄호 안의 구분자는 무시하고 depth 0에서 split한다. */
function splitTopLevel(text, isSeparator) {
  const parts = [];
  let depth = 0;
  let quote = null;
  let start = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = null;
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '(' || c === '[') depth++;
    else if (c === ')' || c === ']') depth--;
    else if (depth === 0 && isSeparator(c)) {
      parts.push(text.slice(start, i));
      start = i + 1;
    }
  }
  parts.push(text.slice(start));
  return parts;
}

/** `:not(...)` 같은 함수형 의사 클래스를 괄호 균형을 맞춰 통째로 제거한다. */
function stripFunctionalPseudo(selector) {
  let out = selector;
  for (;;) {
    FUNCTIONAL_PSEUDO.lastIndex = 0;
    const m = FUNCTIONAL_PSEUDO.exec(out);
    if (!m) return out;
    let depth = 1;
    let i = m.index + m[0].length;
    while (i < out.length && depth > 0) {
      if (out[i] === '(') depth++;
      else if (out[i] === ')') depth--;
      i++;
    }
    out = out.slice(0, m.index) + out.slice(i);
  }
}

// ───────────────────────── HTML 사실 수집 ─────────────────────────

/** 따옴표를 존중하며 시작 태그를 순회한다: cb(tagName, attributeSource) */
function forEachTag(markup, cb) {
  let i = 0;
  while (i < markup.length) {
    const lt = markup.indexOf('<', i);
    if (lt < 0) break;
    if (markup.startsWith('<!--', lt)) {
      const end = markup.indexOf('-->', lt + 4);
      i = end < 0 ? markup.length : end + 3;
      continue;
    }
    const m = /^<([a-zA-Z][\w:.-]*)/.exec(markup.slice(lt, lt + 80));
    if (!m) {
      i = lt + 1;
      continue;
    }
    let j = lt + m[0].length;
    let quote = null;
    for (; j < markup.length; j++) {
      const c = markup[j];
      if (quote) {
        if (c === quote) quote = null;
      } else if (c === '"' || c === "'") quote = c;
      else if (c === '>') break;
    }
    cb(m[1], markup.slice(lt + m[0].length, j));
    i = j + 1;
  }
}

function parseAttributes(source) {
  const attrs = [];
  const re = /([^\s"'<>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;
  let m;
  while ((m = re.exec(source))) attrs.push([m[1].toLowerCase(), m[2] ?? m[3] ?? m[4] ?? '']);
  return attrs;
}

/** 슬림 문서에 실제로 존재하는 태그·클래스·id·속성 값을 모은다. */
function collectFacts(bodyMarkup, htmlTagSource) {
  const facts = {
    tags: new Set(['html', 'head', 'body']),
    classes: new Set(),
    ids: new Set(),
    attrs: new Map(), // 이름 -> 값 집합 (문서 전체)
    root: new Map(), // <html>의 속성
  };
  const add = (map, name, value) => {
    if (!map.has(name)) map.set(name, new Set());
    map.get(name).add(value);
  };

  for (const [name, value] of parseAttributes(htmlTagSource)) add(facts.root, name, value);
  for (const [name, values] of Object.entries(ROOT_STATE)) facts.root.set(name, new Set(values));
  for (const [name, values] of facts.root) for (const v of values) add(facts.attrs, name, v);

  forEachTag(bodyMarkup, (tag, source) => {
    facts.tags.add(tag.toLowerCase());
    for (const [name, value] of parseAttributes(source)) {
      add(facts.attrs, name, value);
      if (name === 'class')
        value
          .split(/\s+/)
          .filter(Boolean)
          .forEach((c) => facts.classes.add(c));
      if (name === 'id') facts.ids.add(value);
    }
  });
  return facts;
}

// ───────────────────────── 셀렉터 판정 ─────────────────────────

/** 복합 셀렉터(공백·결합자 없는 한 덩어리)가 슬림 DOM에 존재할 수 있는가. */
function compoundPossible(compound, facts) {
  if (compound.includes('\\') || compound.includes('&')) return true; // 이스케이프·중첩은 판정 포기

  const isRoot = /^html\b/i.test(compound) || /:root\b/i.test(compound);

  // <html>은 속성을 정확히 알고 있으므로 :not([속성])을 평가해 임베드 전용/비임베드 전용 규칙을 가른다.
  if (isRoot) {
    for (const m of compound.matchAll(
      /:not\(\s*\[([\w-]+)(?:\s*=\s*["']?([^"'\]]*)["']?)?\s*\]\s*\)/gi,
    )) {
      const have = facts.root.get(m[1].toLowerCase());
      if (!have) continue;
      if (m[2] === undefined) return false; // 반드시 있는 속성의 :not([속성])
      if (have.size === 1 && have.has(m[2])) return false; // 값이 하나로 고정된 속성의 :not([속성=값])
    }
  }

  let rest = stripFunctionalPseudo(compound).replace(/::?[a-zA-Z-]+/g, '');
  const attrOf = (name) => (isRoot ? facts.root.get(name) : facts.attrs.get(name));

  const tag = /^(\*|[a-zA-Z][\w-]*)/.exec(rest)?.[1];
  if (tag && tag !== '*' && !facts.tags.has(tag.toLowerCase())) return false;
  if (tag) rest = rest.slice(tag.length);

  for (const m of rest.matchAll(/\.([\w-]+)/g)) if (!facts.classes.has(m[1])) return false;
  for (const m of rest.matchAll(/#([\w-]+)/g)) if (!facts.ids.has(m[1])) return false;
  for (const m of rest.matchAll(
    /\[\s*([\w-]+)\s*(?:([~|^$*]?=)\s*(?:"([^"]*)"|'([^']*)'|([^\]\s]+)))?[^\]]*\]/g,
  )) {
    const values = attrOf(m[1].toLowerCase());
    if (!values) return false;
    const wanted = m[3] ?? m[4] ?? m[5];
    if (m[2] === '=' && wanted !== undefined && !values.has(wanted)) return false;
  }
  return true;
}

function selectorPossible(selector, facts) {
  const compounds = splitTopLevel(selector, (c) => /[\s>+~]/.test(c)).filter(Boolean);
  return compounds.every((c) => compoundPossible(c, facts));
}

// ───────────────────────── CSS 파싱·가지치기 ─────────────────────────

function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '');
}

/** 최상위 블록을 { prelude, body } 목록으로 나눈다. body가 null이면 `@import …;` 같은 문장이다. */
function parseBlocks(css) {
  const items = [];
  let start = 0;
  let depth = 0;
  let bodyStart = -1;
  let quote = null;
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (quote) {
      if (c === '\\') i++;
      else if (c === quote) quote = null;
    } else if (c === '/' && css[i + 1] === '*') {
      const end = css.indexOf('*/', i + 2);
      i = end < 0 ? css.length : end + 1;
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '{') {
      if (depth === 0) bodyStart = i;
      depth++;
    } else if (c === '}') {
      depth--;
      if (depth === 0) {
        items.push({
          prelude: stripComments(css.slice(start, bodyStart)).trim(),
          body: css.slice(bodyStart + 1, i),
        });
        start = i + 1;
      }
    } else if (c === ';' && depth === 0) {
      items.push({ prelude: stripComments(css.slice(start, i)).trim(), body: null });
      start = i + 1;
    }
  }
  return items;
}

const indentLines = (text, pad) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => pad + line)
    .join('\n');

/** @media 같은 조건부 블록은 안쪽을 재귀로 가지치기하고, 비면 버린다. */
function pruneBlocks(items, facts, stats, pad = '') {
  const out = [];
  for (const { prelude, body } of items) {
    if (body === null) {
      out.push(`${pad}${prelude};`);
    } else if (/^@(media|supports|container|layer)\b/i.test(prelude)) {
      const inner = pruneBlocks(parseBlocks(body), facts, stats, pad + '  ');
      if (inner.length) out.push(`${pad}${prelude} {\n${inner.join('\n')}\n${pad}}`);
    } else if (prelude.startsWith('@')) {
      // @keyframes는 나중에 사용 여부로 거르고, @font-face·@property·@page 등은 그대로 둔다.
      out.push(`${pad}${prelude} {\n${indentLines(body, pad + '  ')}\n${pad}}`);
    } else {
      stats.total++;
      const selectors = splitTopLevel(prelude, (c) => c === ',');
      if (selectors.some((s) => selectorPossible(s.trim(), facts))) {
        stats.kept++;
        out.push(
          `${pad}${selectors.map((s) => s.trim()).join(', ')} {\n${indentLines(body, pad + '  ')}\n${pad}}`,
        );
      }
    }
  }
  return out;
}

/** 살아남은 CSS에서 참조하지 않는 @keyframes를 제거한다. */
function dropUnusedKeyframes(blocks) {
  const withoutKeyframes = blocks.filter((b) => !/^\s*@(-\w+-)?keyframes\b/.test(b)).join('\n');
  return blocks.filter((block) => {
    const m = /^\s*@(?:-\w+-)?keyframes\s+([\w-]+)/.exec(block);
    if (!m) return true;
    return new RegExp(`(?<![\\w-])${m[1].replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}(?![\\w-])`).test(
      withoutKeyframes,
    );
  });
}

// ───────────────────────── 조립 ─────────────────────────

/** 중첩을 고려해 다이어그램 <svg>…</svg>를 잘라낸다. */
function extractSvg(html) {
  const start =
    html.search(/<svg\b[^>]*archify-diagram-title/) >= 0
      ? html.search(/<svg\b[^>]*archify-diagram-title/)
      : html.indexOf('<svg');
  if (start < 0) throw new Error('다이어그램 <svg>를 찾지 못했다');
  const re = /<(\/?)svg\b/g;
  re.lastIndex = start;
  let depth = 0;
  let m;
  while ((m = re.exec(html))) {
    depth += m[1] ? -1 : 1;
    if (depth === 0) return html.slice(start, html.indexOf('>', m.index) + 1);
  }
  throw new Error('</svg>를 찾지 못했다');
}

function slimDiagram(html) {
  const styleStart = html.indexOf('<style>');
  const styleEnd = html.indexOf('</style>');
  if (styleStart < 0 || styleEnd < 0)
    throw new Error('<style>을 찾지 못했다 — archify 출력이 맞는지 확인');

  const css = html.slice(styleStart + '<style>'.length, styleEnd);
  const head = html.slice(0, styleStart); // doctype, <html>, 메타, 제목, 테마 스크립트, 폰트 link
  const svg = extractSvg(html);
  const htmlTagSource = /<html\b([^>]*)>/i.exec(head)?.[1] ?? '';
  const container = /<div class="container"[^>]*>/.exec(html)?.[0] ?? '<div class="container">';
  const diagramContainer =
    /<div class="diagram-container"[^>]*>/.exec(html)?.[0] ?? '<div class="diagram-container">';

  const facts = collectFacts(`${container}${diagramContainer}${svg}`, htmlTagSource);
  const stats = { total: 0, kept: 0 };
  const blocks = dropUnusedKeyframes(pruneBlocks(parseBlocks(css), facts, stats));
  const prunedCss = blocks.join('\n');

  const out = `${head}<style>\n${prunedCss}\n</style>\n</head>\n<body>\n${container}\n${diagramContainer}\n${svg}\n</div>\n</div>\n</body>\n</html>\n`;
  return { html: out, stats, cssBytes: [Buffer.byteLength(css), Buffer.byteLength(prunedCss)] };
}

// ───────────────────────── 실행 ─────────────────────────

const [input, output = input] = process.argv.slice(2);
if (!input) {
  console.error('사용법: node scripts/slim-diagram.mjs <입력.html> [출력.html]');
  process.exit(1);
}

const source = fs.readFileSync(input, 'utf8');
const result = slimDiagram(source);
fs.writeFileSync(output, result.html);

const kb = (n) => `${(n / 1024).toFixed(1)}KB`;
console.log(`${input} → ${output}`);
console.log(`  전체  ${kb(Buffer.byteLength(source))} → ${kb(Buffer.byteLength(result.html))}`);
console.log(
  `  CSS   ${kb(result.cssBytes[0])} → ${kb(result.cssBytes[1])} (규칙 ${result.stats.total}개 중 ${result.stats.kept}개 유지)`,
);
console.log('  브라우저에서 ?embed=1&theme=light / dark 로 열어 원본과 같은지 확인하세요.');
