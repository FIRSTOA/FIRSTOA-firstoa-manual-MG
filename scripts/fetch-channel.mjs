/* 유튜브 채널에서 영상 목록을 다시 받아와, 아직 사이트에 연결되지 않은 영상을 알려줍니다.
   사용법:  node scripts/fetch-channel.mjs          (확인만)
            node scripts/fetch-channel.mjs --save   (기준표 data/channel-videos.json 갱신) */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const REF = path.join(ROOT, 'data/channel-videos.json');
const ref = JSON.parse(fs.readFileSync(REF, 'utf8'));
const CHANNEL = ref.channel;
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36';

async function fetchVideos() {
  const res = await fetch(CHANNEL + '/videos', { headers: { 'User-Agent': UA, 'Accept-Language': 'ko-KR,ko;q=0.9' } });
  const html = await res.text();
  const i = html.indexOf('var ytInitialData = ');
  if (i < 0) throw new Error('유튜브 응답에서 목록을 찾지 못했습니다 (형식이 바뀌었을 수 있습니다)');
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
  const seen = new Set();
  return out.filter(v => v.id && !seen.has(v.id) && seen.add(v.id));
}

// 사이트에 실제로 연결된 영상 모으기
const dataJs = fs.readFileSync(path.join(ROOT, 'data/manuals.js'), 'utf8');
const g = {}; new Function('window', dataJs)(g);
const wired = new Set();
g.FIRSTOA_MANUAL.MODELS.forEach(m => Object.values(m.videos).forEach(v => v && wired.add(v)));

const live = await fetchVideos();
const unwired = live.filter(v => !wired.has(v.id));
const gone = [...wired].filter(id => !live.some(v => v.id === id));

console.log(`채널 영상 ${live.length}편 · 사이트 연결 ${wired.size}편`);
if (unwired.length) {
  console.log(`\n아직 연결 안 된 영상 ${unwired.length}편 — data/manuals.js 의 해당 기종 videos 에 넣으세요:`);
  unwired.forEach(v => console.log(`  ${v.id}   ${v.title}`));
} else console.log('\n모든 영상이 연결돼 있습니다.');
if (gone.length) console.log(`\n채널에서 사라진 영상 ${gone.length}편(비공개·삭제?): ${gone.join(', ')}`);

if (process.argv.includes('--save')) {
  ref.videos = live.map(v => ({ id: v.id, title: v.title }));
  ref.fetchedAt = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(REF, JSON.stringify(ref, null, 2) + '\n');
  console.log('\n기준표를 갱신했습니다: data/channel-videos.json');
}
