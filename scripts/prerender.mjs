/* 검색엔진용 정적 페이지 만들기(2026-10-09).
 *   node scripts/prerender.mjs            → 기종·작업·증상·브랜드·안내 화면마다 HTML 파일 + sitemap.xml
 *
 * 왜: 이 사이트는 화면을 스크립트로 그린다. 구글·네이버는 스크립트 전 HTML 도 읽으므로, 주소마다
 *     제목·설명·본문(순서·영상)·구조화 데이터(JSON-LD)가 든 HTML 을 미리 만들어 둔다.
 *     파일이 있으면 Vercel 은 그 파일을 주고(cleanUrls: /m/x.html → /m/x), 없으면 index.html 로 돌린다.
 *     앱은 뜨자마자 같은 화면을 다시 그리므로 사람 눈엔 차이가 없다.
 *
 * 언제: data/manuals.js 가 바뀔 때마다(유튜브 자동 연결 뒤에도). GitHub Actions(sync-youtube.yml)가 함께 돌린다.
 * 주소: SITE_URL 환경변수(없으면 vercel 주소). 도메인이 manual.firstoa.co.kr 로 바뀌면 SITE_URL 만 바꾸면 된다. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SITE = (process.env.SITE_URL || 'https://firstoa-manual-mg.vercel.app').replace(/\/+$/, '');
const read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const load = src => { const g = {}; new Function('window', src)(g); return g.FIRSTOA_MANUAL; };
const D = load(read('data/manuals.js'));
const NEW = (() => { const g = {}; try { new Function('window', read('data/new-videos.js'))(g); } catch {} return g.FIRSTOA_NEW_VIDEOS || []; })();
const TEMPLATE = read('index.html');
const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const BRAND = Object.fromEntries(D.BRANDS.map(b => [b.id, b]));
const TASK = Object.fromEntries(D.TASKS.map(t => [t.id, t]));
const CAT = Object.fromEntries(D.CATEGORIES.map(c => [c.id, c]));
const modelsOf = bid => D.MODELS.filter(m => m.brand === bid);
const tasksOf = m => D.TASKS.filter(t => t.id in (m.videos || {}));
const inScope = (f, m) => !!(f.scope.all || f.scope.brand === m.brand || (f.scope.models || []).includes(m.id));
const fixVidBrand = (f, bid) => (f.videos || {})[bid] || f.video || '';
const fixVid = (f, m) => (f.videos || {})[m.id] || fixVidBrand(f, m.brand);
const fixSteps = (f, m) => { const ov = (f.brands || {})[m.id] || (f.brands || {})[m.brand] || {}; return ov.steps || f.steps || []; };
const fixLive = (f, m) => fixSteps(f, m).length > 0 || !!fixVid(f, m);
const fixesOf = m => (D.FIXES || []).filter(f => inScope(f, m) && fixLive(f, m));
const stepsOf = (m, t) => ((m.steps || {})[t.id]) || t.steps || [];
const official = v => (D.OFFICIAL_VIDEOS || {})[v] || '';
const company = D.meta.legal || D.meta.company;

/* ── 한 장 만들기 ── */
const pages = [];            // { url, title, desc, body, jsonld[], priority, changefreq }
const add = p => pages.push(p);
const link = (href, text) => `<a href="${esc(href)}">${esc(text)}</a>`;
const videoLd = (v, name, desc) => ({
  '@type': 'VideoObject', name, description: desc,
  thumbnailUrl: [`https://i.ytimg.com/vi/${v}/hqdefault.jpg`],
  embedUrl: `https://www.youtube-nocookie.com/embed/${v}`, contentUrl: `https://www.youtube.com/watch?v=${v}`,
  uploadDate: '2026-01-01', publisher: { '@type': 'Organization', name: company },
});
const howToLd = (name, desc, steps, url, v) => ({
  '@context': 'https://schema.org', '@type': 'HowTo', name, description: desc, url,
  totalTime: 'PT5M', inLanguage: 'ko',
  step: steps.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, text: s })),
  ...(v ? { video: videoLd(v, name, desc) } : {}),
});
const crumbLd = items => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, item: SITE + url })) });
const olist = steps => steps.length ? `<ol>${steps.map(s => `<li>${esc(s)}</li>`).join('')}</ol>` : '';
const videoBlock = (v, title) => v ? `<p><a href="https://www.youtube.com/watch?v=${esc(v)}" rel="noopener">${esc(title)} 영상 보기${official(v) ? ` (제조사 공식 영상 · ${esc(official(v))})` : ''}</a></p>` : '';

// 첫 화면
add({ url: '/', priority: '1.0', changefreq: 'weekly',
  title: `${D.meta.company} ${D.meta.title} — 복합기 토너 교체 · 용지 걸림 · 검침 셀프 가이드`,
  desc: `${D.meta.tagline} 삼성 · 신도리코 · 후지필름(제록스) · 교세라 · 브라더 · HP 복합기 ${D.MODELS.length}종.`,
  body: `<h1>복합기, 직접 해결하세요</h1><p>${esc(D.meta.tagline)}</p>
    <h2>브랜드</h2><ul>${D.BRANDS.filter(b => modelsOf(b.id).length).map(b => `<li>${link('/b/' + b.id, b.name + ' 복합기 ' + modelsOf(b.id).length + '종')}</li>`).join('')}</ul>
    <h2>기종</h2><ul>${D.MODELS.map(m => `<li>${link('/m/' + m.id, m.name + (m.full ? ' (' + m.full + ')' : ''))}</li>`).join('')}</ul>
    <h2>자주 생기는 문제</h2><ul>${D.FIXES.map(f => `<li>${link('/f/' + f.id, f.title)}</li>`).join('')}</ul>
    <h2>안내</h2><ul>${[['/pattern', '4색 패턴 출력'], ['/meter', '사용량 카운터 확인'], ['/notices', '이용 안내'], ['/products', '취급 품목']].map(([u, t]) => `<li>${link(u, t)}</li>`).join('')}</ul>`,
  jsonld: [{ '@context': 'https://schema.org', '@type': 'Organization', name: company, url: SITE, telephone: D.meta.phone, sameAs: [D.meta.homepage, D.meta.channel, D.meta.kakao].filter(Boolean) },
           { '@context': 'https://schema.org', '@type': 'WebSite', name: `${D.meta.company} ${D.meta.title}`, url: SITE }] });

// 브랜드
for (const b of D.BRANDS.filter(b => modelsOf(b.id).length)) {
  add({ url: `/b/${b.id}`, priority: '0.8', changefreq: 'monthly',
    title: `${b.name} 복합기 사용설명서 — 토너 교체 · 용지 걸림 · 검침 | ${D.meta.company}`,
    desc: `${b.full} 복합기 ${modelsOf(b.id).length}종의 토너·폐토너통 교체, 용지 걸림, 검침 카운터 확인 방법. 엔지니어 촬영 영상과 순서.`,
    body: `<h1>${esc(b.name)} 복합기 ${modelsOf(b.id).length}종</h1><ul>${modelsOf(b.id).map(m => `<li>${link('/m/' + m.id, m.name + (m.full ? ' · ' + m.full : ''))}</li>`).join('')}</ul>`,
    jsonld: [crumbLd([['처음', '/'], [b.name, `/b/${b.id}`]])] });
}

// 기종 + 작업 + 증상
for (const m of D.MODELS) {
  const b = BRAND[m.brand], tasks = tasksOf(m), fixes = fixesOf(m);
  const mdesc = `${m.name}${m.full ? ' (' + m.full + ')' : ''} 복합기의 ${tasks.map(t => t.title).join(' · ')}, ${fixes.slice(0, 3).map(f => f.title).join(' · ')} 방법. 담당 엔지니어가 직접 찍은 영상과 따라 하는 순서.`;
  add({ url: `/m/${m.id}`, priority: '0.9', changefreq: 'monthly',
    title: `${m.name} 토너 교체 · 용지 걸림 · 검침 방법 | ${D.meta.company} 복합기 사용설명서`, desc: mdesc,
    body: `<h1>${esc(m.name)}</h1>${m.full ? `<p>${esc(m.full)}</p>` : ''}
      <h2>소모품 교체 · 관리</h2><ul>${tasks.map(t => `<li>${link(`/m/${m.id}/${t.id}`, t.title)}${(m.videos || {})[t.id] ? ' (영상)' : ''}</li>`).join('')}</ul>
      <h2>자주 생기는 문제</h2><ul>${fixes.map(f => `<li>${link(`/m/${m.id}/f/${f.id}`, f.title)}${fixVid(f, m) ? ' (영상)' : ''}</li>`).join('')}</ul>
      <p>${link('/b/' + m.brand, b.name + ' 다른 기종')} · ${link('/', '처음으로')}</p>`,
    jsonld: [crumbLd([['처음', '/'], [b.name, `/b/${m.brand}`], [m.name, `/m/${m.id}`]]),
      { '@context': 'https://schema.org', '@type': 'Product', name: m.name, description: mdesc, brand: { '@type': 'Brand', name: b.full || b.name }, ...(m.photo ? { image: SITE + '/' + m.photo } : {}) }] });
  for (const t of tasks) {
    const v = (m.videos || {})[t.id], steps = stepsOf(m, t), url = `/m/${m.id}/${t.id}`;
    const title = `${m.name} ${t.title} 방법${v ? ' (영상)' : ''} | ${D.meta.company}`;
    const desc = `${m.name} 복합기 ${t.title}: ${t.summary}. ${steps.length ? steps.length + '단계 순서' : ''}${v ? ' · 엔지니어 촬영 영상' : ''}.`;
    add({ url, priority: '0.8', changefreq: 'monthly', title, desc,
      body: `<h1>${esc(m.name)} ${esc(t.title)}</h1><p>${esc(t.summary)}</p>${videoBlock(v, `${m.name} ${t.title}`)}<h2>따라 하는 순서</h2>${olist(steps)}
        <p>${link('/m/' + m.id, m.name + ' 전체 작업')}</p>`,
      jsonld: [crumbLd([['처음', '/'], [b.name, `/b/${m.brand}`], [m.name, `/m/${m.id}`], [t.title, url]]), howToLd(`${m.name} ${t.title}`, desc, steps, SITE + url, v)] });
  }
  for (const f of fixes) {
    const v = fixVid(f, m), steps = fixSteps(f, m), url = `/m/${m.id}/f/${f.id}`;
    const title = `${m.name} ${f.title} 해결 방법${v ? ' (영상)' : ''} | ${D.meta.company}`;
    const desc = `${m.name} 복합기에서 ${f.summary}. ${steps.length ? steps.length + '단계 처리 순서' : ''}${v ? ' · 영상' : ''}.`;
    add({ url, priority: '0.7', changefreq: 'monthly', title, desc,
      body: `<h1>${esc(m.name)} ${esc(f.title)}</h1><p>${esc(f.summary)}</p>${videoBlock(v, `${m.name} ${f.title}`)}<h2>따라 하는 순서</h2>${olist(steps)}
        <p>${link('/m/' + m.id, m.name + ' 전체 작업')}</p>`,
      jsonld: [crumbLd([['처음', '/'], [b.name, `/b/${m.brand}`], [m.name, `/m/${m.id}`], [f.title, url]]), howToLd(`${m.name} ${f.title}`, desc, steps, SITE + url, v)] });
  }
}

// 증상(기종 고르기) · 작업(기종 고르기)
for (const f of D.FIXES) {
  const list = D.MODELS.filter(m => inScope(f, m) && fixLive(f, m));
  add({ url: `/f/${f.id}`, priority: '0.6', changefreq: 'monthly',
    title: `복합기 ${f.title} 해결 방법 — 기종별 안내 | ${D.meta.company}`, desc: `${f.summary}. 기종을 고르면 그 기종의 처리 순서와 영상이 나옵니다.`,
    body: `<h1>${esc(f.title)}</h1><p>${esc(f.summary)}</p><ul>${list.map(m => `<li>${link(`/m/${m.id}/f/${f.id}`, m.name)}</li>`).join('')}</ul>`,
    jsonld: [crumbLd([['처음', '/'], [f.title, `/f/${f.id}`]])] });
}
for (const t of D.TASKS) {
  const list = D.MODELS.filter(m => t.id in (m.videos || {}));
  add({ url: `/t/${t.id}`, priority: '0.6', changefreq: 'monthly',
    title: `복합기 ${t.title} 방법 — 기종별 영상 | ${D.meta.company}`, desc: `${t.summary}. 쓰시는 기종을 고르면 영상과 순서가 나옵니다.`,
    body: `<h1>${esc(t.title)}</h1><p>${esc(t.summary)}</p><ul>${list.map(m => `<li>${link(`/m/${m.id}/${t.id}`, m.name)}</li>`).join('')}</ul>`,
    jsonld: [crumbLd([['처음', '/'], [t.title, `/t/${t.id}`]])] });
}

// 안내 화면
add({ url: '/fixes', priority: '0.7', changefreq: 'monthly', title: `복합기 자주 생기는 문제 — 브랜드별 해결 | ${D.meta.company}`, desc: '용지 걸림, 복사·스캔 줄, 출력 흰 줄, 원고 걸림, 센서 에러 — 브랜드와 기종을 고르면 처리 순서와 영상이 나옵니다.',
  body: `<h1>자주 생기는 문제</h1><ul>${D.BRANDS.filter(b => modelsOf(b.id).length).map(b => `<li>${link('/fixes/' + b.id, b.name)}</li>`).join('')}</ul>`, jsonld: [crumbLd([['처음', '/'], ['자주 생기는 문제', '/fixes']])] });
for (const b of D.BRANDS.filter(b => modelsOf(b.id).length)) {
  const list = D.FIXES.filter(f => (f.scope.all || f.scope.brand === b.id) && ((f.steps || []).length || fixVidBrand(f, b.id)));
  add({ url: `/fixes/${b.id}`, priority: '0.6', changefreq: 'monthly', title: `${b.name} 복합기 자주 생기는 문제 | ${D.meta.company}`, desc: `${b.name} 복합기의 ${list.map(f => f.title).join(', ')} 해결 방법.`,
    body: `<h1>${esc(b.name)} 복합기 자주 생기는 문제</h1><ul>${list.map(f => `<li>${link(`/fixes/${b.id}/${f.id}`, f.title)}</li>`).join('')}</ul>`, jsonld: [crumbLd([['처음', '/'], ['자주 생기는 문제', '/fixes'], [b.name, `/fixes/${b.id}`]])] });
  for (const f of list) {
    const ov = (f.brands || {})[b.id] || {}, steps = ov.steps || f.steps || [], v = fixVidBrand(f, b.id), url = `/fixes/${b.id}/${f.id}`;
    add({ url, priority: '0.6', changefreq: 'monthly', title: `${b.name} 복합기 ${f.title} 해결 방법 | ${D.meta.company}`, desc: `${b.name} 복합기에서 ${f.summary}. ${steps.length}단계 순서${v ? ' · 영상' : ''}.`,
      body: `<h1>${esc(b.name)} 복합기 ${esc(f.title)}</h1><p>${esc(f.summary)}</p>${videoBlock(v, `${b.name} ${f.title}`)}<h2>따라 하는 순서</h2>${olist(steps)}`,
      jsonld: [crumbLd([['처음', '/'], ['자주 생기는 문제', '/fixes'], [b.name, `/fixes/${b.id}`], [f.title, url]]), howToLd(`${b.name} 복합기 ${f.title}`, f.summary, steps, SITE + url, v)] });
  }
}
add({ url: '/meter', priority: '0.7', changefreq: 'monthly', title: `복합기 사용량 카운터(검침) 확인 방법 — 브랜드·기종별 | ${D.meta.company}`, desc: D.METER.why,
  body: `<h1>사용량 카운터 확인</h1><p>${esc(D.METER.why)}</p>${(D.METER.brands || []).map(b => `<h2>${esc(b.label)}</h2>${(b.groups || []).map(g => `<h3>${esc(g.models)}</h3>${olist(g.steps || [])}`).join('')}`).join('')}`,
  jsonld: [crumbLd([['처음', '/'], ['사용량 카운터', '/meter']])] });
add({ url: '/pattern', priority: '0.5', changefreq: 'yearly', title: `복합기 4색 패턴 출력(점검 차트) | ${D.meta.company}`, desc: '검정·파랑·빨강·노랑 전면 출력과 종합 차트로 세로줄·가로 띠·얼룩을 점검합니다. 바로 인쇄.',
  body: '<h1>4색 패턴 출력</h1><p>인쇄 상태를 한 장으로 점검하는 차트입니다. 화면에서 바로 인쇄합니다.</p>', jsonld: [crumbLd([['처음', '/'], ['4색 패턴 출력', '/pattern']])] });
add({ url: '/notices', priority: '0.5', changefreq: 'monthly', title: `복합기 이용 안내 — 장마철 용지 · 겨울 정전기 · 이전 설치 | ${D.meta.company}`, desc: (D.NOTICES || []).map(n => n.title).join(' · '),
  body: `<h1>이용 안내</h1>${(D.NOTICES || []).map(n => `<h2>${esc(n.title)}</h2><p>${esc(n.lead)}</p>${olist(n.body || [])}`).join('')}`, jsonld: [crumbLd([['처음', '/'], ['이용 안내', '/notices']])] });
add({ url: '/products', priority: '0.5', changefreq: 'monthly', title: `취급 품목 — 데스크탑 · 노트북 · 맥 · 소프트웨어 · 복합기 · 네트워크 · 가구 | ${D.meta.company}`, desc: D.meta.oneStop,
  body: `<h1>취급 품목</h1><ul>${(D.PRODUCTS || []).map(p => `<li>${esc(p.name)} — ${esc(p.desc)}</li>`).join('')}</ul>`, jsonld: [crumbLd([['처음', '/'], ['취급 품목', '/products']])] });

/* ── 파일로 쓰기 ── */
const today = new Date().toISOString().slice(0, 10);
let written = 0;
for (const p of pages) {
  const url = SITE + (p.url === '/' ? '/' : p.url);
  let html = TEMPLATE
    .replace(/<title>[^<]*<\/title>/, `<title>${esc(p.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(p.desc)}">`)
    .replace(/<meta property="og:title" content="[^"]*">/, `<meta property="og:title" content="${esc(p.title)}">`)
    .replace(/<meta property="og:description" content="[^"]*">/, `<meta property="og:description" content="${esc(p.desc)}">`)
    .replace(/<meta property="og:url" content="[^"]*">/, `<meta property="og:url" content="${esc(url)}">`)
    .replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${esc(url)}">`);
  const ld = p.jsonld.map(o => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`).join('\n');
  html = html.replace('</head>', `${ld}\n</head>`);
  // 앱이 그리기 전에도 읽히는 본문 — 앱이 뜨면 같은 화면으로 바뀐다
  html = html.replace(/<main id="app">[\s\S]*?<\/main>/, `<main id="app"><div class="container prerender">${p.body}</div></main>`);
  if (p.url === '/') { /* 첫 화면은 index.html(템플릿) 그대로 — 앱이 그린다 */ }
  else {
    const file = path.join(ROOT, p.url.slice(1) + '.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
  }
  written += 1;
}
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map(p =>
  `  <url><loc>${esc(SITE + (p.url === '/' ? '/' : p.url))}</loc><lastmod>${today}</lastmod><changefreq>${p.changefreq}</changefreq><priority>${p.priority}</priority></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap);
console.log(`정적 페이지 ${written - 1}장 + sitemap.xml(${pages.length} 주소) — ${SITE}`);
