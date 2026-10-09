/* 유튜브 채널 ↔ 사이트 연결 (2026-10-06 자동화)
   사용법
     node scripts/fetch-channel.mjs            확인만 — 채널 영상 수, 연결 수, 아직 안 붙은 영상
     node scripts/fetch-channel.mjs --save     기준표 data/channel-videos.json 갱신
     node scripts/fetch-channel.mjs --auto     제목에서 기종·작업을 읽어 data/manuals.js 의 빈 칸에 자동 연결하고,
                                               못 알아본 영상은 data/new-videos.js("새로 올라온 영상" 선반)에 넣는다
   GitHub Actions(.github/workflows/sync-youtube.yml)가 매일 아침 --auto --save 로 돌리고, 바뀐 게 있으면 커밋한다.
   → 유튜브에 올리기만 하면 다음 날 사이트에 나타난다. 제목에 기종 번호(또는 사내 별칭)와 작업명(토너/폐토너통·폐통/드럼/카운터)이
     들어 있으면 그 기종 칸에 바로 붙고, 아니면 홈의 "새로 올라온 영상"에 먼저 보인다.

   제목 규칙 예 — "3220 토너 교체 방법", "k7500 폐통 교체방법", "키슈,세이토 토너 회수통R5 교체 방법", "320,410,420 토너 교체 방법" */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const REF = path.join(ROOT, 'data/channel-videos.json');
const DATA = path.join(ROOT, 'data/manuals.js');
const NEWJS = path.join(ROOT, 'data/new-videos.js');
const ref = JSON.parse(fs.readFileSync(REF, 'utf8'));
const CHANNEL = ref.channel;
const CHANNEL_ID = (CHANNEL.match(/channel\/(UC[\w-]+)/) || [])[1];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36';
const today = new Date().toISOString().slice(0, 10);
const args = new Set(process.argv.slice(2));

/* ── 채널 영상 목록: RSS(공식, 최근 15편·올린 날짜 있음) + 채널 페이지(전체) ── */
async function fetchRss() {
  if (!CHANNEL_ID) return [];
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`, { headers: { 'User-Agent': UA } });
    if (!res.ok) return [];
    const xml = await res.text();
    return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(m => {
      const e = m[1];
      const pick = tag => (e.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`)) || [])[1] || '';
      return { id: pick('yt:videoId'), title: decode(pick('title')), published: pick('published').slice(0, 10) };
    }).filter(v => v.id);
  } catch { return []; }
}
const decode = s => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

async function fetchPage() {
  try {
    const res = await fetch(CHANNEL + '/videos', { headers: { 'User-Agent': UA, 'Accept-Language': 'ko-KR,ko;q=0.9' } });
    const html = await res.text();
    const i = html.indexOf('var ytInitialData = ');
    if (i < 0) return [];
    const rest = html.slice(i + 20);
    const data = JSON.parse(rest.slice(0, rest.indexOf(';</script>')));
    const out = [];
    (function walk(o) {
      if (!o || typeof o !== 'object') return;
      if (o.lockupViewModel?.contentId) {
        out.push({ id: o.lockupViewModel.contentId,
                   title: o.lockupViewModel.metadata?.lockupMetadataViewModel?.title?.content || '' });
      }
      for (const k in o) walk(o[k]);
    })(data);
    return out;
  } catch { return []; }
}

async function fetchVideos() {
  const [rss, page] = await Promise.all([fetchRss(), fetchPage()]);
  const byId = new Map();
  for (const v of [...page, ...rss]) {            // RSS 가 뒤에 와서 제목·날짜를 덮어쓴다(더 정확)
    if (!v.id) continue;
    byId.set(v.id, { ...(byId.get(v.id) || {}), ...v, title: v.title || byId.get(v.id)?.title || '' });
  }
  // 기준표에만 있는 영상(일시적으로 못 받아온 것)도 유지
  for (const v of ref.videos || []) if (!byId.has(v.id)) byId.set(v.id, { ...v, stale: true });
  return [...byId.values()];
}

/* ── 사이트 데이터 ── */
const dataJs = fs.readFileSync(DATA, 'utf8');
const load = src => { const g = {}; new Function('window', src)(g); return g.FIRSTOA_MANUAL; };
const D = load(dataJs);
const wired = new Map();                           // 영상 ID → [기종.작업]
D.MODELS.forEach(m => Object.entries(m.videos || {}).forEach(([t, v]) => { if (v) wired.set(v, [...(wired.get(v) || []), `${m.id}.${t}`]); }));
(D.FIXES || []).forEach(f => {
  if (f.video) wired.set(f.video, [...(wired.get(f.video) || []), `fix.${f.id}`]);
  Object.entries(f.videos || {}).forEach(([b, v]) => { if (v) wired.set(v, [...(wired.get(v) || []), `fix.${f.id}.${b}`]); });
});

/* ── 제목 → 작업·기종 ── */
const TASK_RULES = [
  [/잉크/, 'ink'],                                  // 잉크젯(HP 오피스젯)은 토너가 아니라 잉크
  [/폐토너|폐통|회수통|폐\s*토너/, 'waste'],
  [/드럼|이미징/, 'drum'],
  [/토너/, 'toner'],
  [/검침|카운터|미터/, 'meter'],
];
const taskOf = title => (TASK_RULES.find(([re]) => re.test(title)) || [])[1] || null;
// 증상(자주 생기는 문제) 영상 — 제목에 브랜드가 함께 있어야 연결한다(FIXES[].videos[브랜드]). 브랜드가 없으면 "새로 올라온 영상"으로.
const FIX_RULES = [
  [/acr|ctd/i, 'acr-ctd'],
  [/adf.*(가이드|틀어짐)|상\s*틀어짐/i, 'adf-guide'],
  [/adf.*(걸림|이물질)/i, 'adf-jam'],
  [/트레이.*가이드|용지.*틀어짐|틀어짐.*트레이/, 'tray-guide'],
  [/유리|\bpm\b/i, 'line-copy'],
  [/흰\s*줄|연하게|빠진/, 'line-print'],
  [/줄/, 'line-copy'],
  [/걸림|jam|잼/i, 'jam'],
];
const BRAND_RULES = [
  [/삼성|samsung/i, 'samsung'], [/신도/, 'sindoh'], [/제록스|후지|xerox|apeos|docu/i, 'xerox'],
  [/교세라|kyocera/i, 'kyocera'], [/브라더|brother/i, 'brother'], [/\bhp\b/i, 'hp'], [/오키|\boki\b|렉스마크|lexmark|리코|ricoh/i, 'etc'],
];
const fixOf = title => (FIX_RULES.find(([re]) => re.test(title)) || [])[1] || null;
const brandOf = title => (BRAND_RULES.find(([re]) => re.test(title)) || [])[1] || null;
const norm = s => String(s).toLowerCase().replace(/\s+/g, '');
const tokensOf = title => title.toLowerCase().split(/[\s,·/()\[\]\-_:~]+/).filter(Boolean);
function modelsOf(title) {
  const toks = tokensOf(title), flat = norm(title);
  return D.MODELS.filter(m => {
    // 사내 별칭은 두 글자짜리 한글이 많다(쇼부·베니·마블·키슈) — 한글은 2자부터, 숫자·영문은 3자부터 본다
    const keys = [...(m.aka || []), m.name.replace(/^\S+\s+/, '')].map(norm).filter(k => (/[가-힣]/.test(k) ? k.length >= 2 : k.length >= 3));
    return keys.some(k => toks.includes(k) || (flat.includes(k) && (/[가-힣]/.test(k) ? k.length >= 2 : (k.length >= 4 && /[a-z]/.test(k)))));
  });
}

/* ── manuals.js 글자 그대로 고치기(해당 기종 videos 안의 빈 칸만) ── */
function wireInto(src, modelId, task, vid, title) {
  const at = src.indexOf(`id: "${modelId}"`);
  if (at < 0) return null;
  const end = src.indexOf('\n    {', at + 1);                // 다음 기종 시작
  const block = src.slice(at, end < 0 ? undefined : end);
  const vi = block.indexOf('videos:');
  if (vi < 0) return null;
  const re = new RegExp(`(\\b${task}:\\s*)""`);
  const sub = block.slice(vi);
  if (!re.test(sub)) return null;                           // 칸이 없거나 이미 차 있음
  const fixed = sub.replace(re, `$1"${vid}", // ${title.replace(/[\r\n]+/g, ' ')} (자동 연결 ${today})`);
  return src.slice(0, at) + block.slice(0, vi) + fixed + (end < 0 ? '' : src.slice(end));
}

// 증상 영상을 FIXES 의 그 증상 videos: { 브랜드: "…" } 에 넣는다(없으면 칸을 만든다)
function wireFix(src, fixId, brand, vid, title) {
  const fa = src.indexOf('FIXES: [');
  const at = fa < 0 ? -1 : src.indexOf(`id: "${fixId}"`, fa);
  if (at < 0) return null;
  let end = src.indexOf('\n    {', at + 1); if (end < 0) end = src.indexOf('\n  ],', at + 1); if (end < 0) end = src.length;
  const block = src.slice(at, end);
  const note = ` // ${brand}: ${title.replace(/[\r\n]+/g, ' ')} (자동 연결 ${today})`;
  let fixed;
  if (block.includes('videos: {')) {
    if (new RegExp(`\\b${brand}:`).test(block)) return null;                 // 이미 그 브랜드 영상이 있음
    fixed = block.replace('videos: {', `videos: { ${brand}: "${vid}",`);
  } else if (block.includes('video: "",')) {
    fixed = block.replace('video: "",', `video: "",\n      videos: { ${brand}: "${vid}" },${note}`);
  } else return null;
  return src.slice(0, at) + fixed + src.slice(end);
}

/* ── 실행 ── */
const live = await fetchVideos();
let src = dataJs, linked = [], skipped = [];
const unwired = live.filter(v => !wired.has(v.id));

if (args.has('--auto')) {
  for (const v of unwired) {
    const task = taskOf(v.title), models = modelsOf(v.title);
    if (!task || !models.length) {
      // 기종·작업이 아니면 증상 영상인지 본다(브랜드 + 증상 낱말)
      const fix = fixOf(v.title), brand = brandOf(v.title);
      const next = fix && brand ? wireFix(src, fix, brand, v.id, v.title) : null;
      if (next) { src = next; linked.push(`fix.${fix}.${brand} ← ${v.id} (${v.title})`); } else skipped.push(v);
      continue;
    }
    let hit = 0;
    for (const m of models) {
      const next = wireInto(src, m.id, task, v.id, v.title);
      if (next) { src = next; hit++; linked.push(`${m.id}.${task} ← ${v.id} (${v.title})`); }
    }
    if (!hit) skipped.push(v);
  }
  if (src !== dataJs) {
    load(src);                                               // 고친 파일이 그대로 실행되는지 확인하고 나서 저장
    fs.writeFileSync(DATA, src);
  }
  // 아직 연결 안 된 영상 → 홈 "새로 올라온 영상"(최신순 12편)
  const fresh = skipped.filter(v => !v.stale).sort((a, b) => (b.published || '').localeCompare(a.published || '')).slice(0, 12)
    .map(v => ({ id: v.id, title: v.title, published: v.published || '' }));
  fs.writeFileSync(NEWJS, `/* scripts/fetch-channel.mjs --auto 가 채웁니다. 유튜브에 올라왔지만 기종 안내에 아직 연결되지 않은 영상(홈 "새로 올라온 영상"). 손으로 고치지 마세요. */\nwindow.FIRSTOA_NEW_VIDEOS = ${JSON.stringify(fresh, null, 2)};\n`);
}

if (args.has('--save')) {
  // 최근 목록(채널 페이지 약 30편 + RSS 15편)에서 밀려난 옛 영상도 유튜브엔 그대로 있으므로 기준표에 남긴다(stale 표시만). 2026-10-09: 삼성 영상 7편이 올라오며 옛 4편이 빠졌던 것
  ref.videos = live.map(v => ({ id: v.id, title: v.title, ...(v.published ? { published: v.published } : {}), ...(v.stale ? { stale: true } : {}) }));
  ref.fetchedAt = today;
  fs.writeFileSync(REF, JSON.stringify(ref, null, 2) + '\n');
}

const wiredNow = new Set([...wired.keys(), ...linked.map(l => l.match(/← (\S+)/)[1])]);
console.log(`채널 영상 ${live.filter(v => !v.stale).length}편 · 사이트 연결 ${live.filter(v => wiredNow.has(v.id)).length}편`);
if (linked.length) console.log(`\n자동 연결 ${linked.length}칸:\n  ` + linked.join('\n  '));
const left = unwired.filter(v => !wiredNow.has(v.id));
if (left.length) {
  console.log(`\n아직 연결 안 된 영상 ${left.length}편${args.has('--auto') ? ' — 홈 "새로 올라온 영상"에 표시' : ''}:`);
  left.forEach(v => console.log(`  ${v.id}   ${v.title}${v.published ? '   ' + v.published : ''}`));
  if (!args.has('--auto')) console.log('  제목에 기종 번호와 작업명이 있으면 --auto 로 자동 연결됩니다.');
} else console.log('\n모든 영상이 연결돼 있습니다.');
if (args.has('--save')) console.log('\n기준표를 갱신했습니다: data/channel-videos.json');
