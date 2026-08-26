/* 실제 DOM(happy-dom)에 올려서 화면·상호작용을 점검한다 */
import fs from 'fs';
import { Window } from 'happy-dom';
const HOME = process.env.HOME + '/firstoa-manual';
const read = f => fs.readFileSync(HOME + '/' + f, 'utf8');

let html = read('index.html')
  .replace(/<link[^>]*stylesheet[^>]*>/g, '')
  .replace(/<script src="[^"]*"><\/script>/g, '');

const win = new Window({ url: 'http://localhost/', width: 1280, height: 900 });
win.document.write(html);
let fails = 0;
const bad = (msg) => { fails++; console.log('  ✗ ' + msg); };
const ok  = (msg) => console.log('  ✓ ' + msg);

win.addEventListener('error', e => bad('창 오류: ' + e.message));
try {
  win.eval(read('data/manuals.js'));
  win.eval(read('assets/ui.js'));
  win.eval(read('assets/app.js'));
} catch (e) { bad('스크립트 실행 실패: ' + e.message); console.log(e.stack); process.exit(1); }

const doc = win.document, D = win.FIRSTOA_MANUAL;
const nav = (h) => { win.location.hash = h; win.dispatchEvent(new win.Event('hashchange')); };
const junk = s => /undefined|\[object Object\]|NaN|&lt;svg/.test(s);

/* 1. 모든 주소가 그려지는가 */
console.log('\n[1] 화면 그리기');
const routes = ['#/', '#/m/samsung-3220', '#/m/samsung-3220/toner', '#/m/hp-8710/toner',
  '#/fixes', '#/f/jam', '#/f/acr-ctd', '#/m/samsung-3220/f/jam', '#/m/samsung-3220/f/acr-ctd',
  '#/m/xerox-c2263/f/line-copy',
  '#/t/toner', '#/t/meter', '#/s/3220', '#/s/줄', '#/s/zzz없음', '#/m/없음', '#/헛주소'];
for (const r of routes) {
  try {
    nav(r);
    const h = doc.getElementById('app').innerHTML;
    if (!h.length) bad(r + ' → 빈 화면');
    else if (junk(h)) bad(r + ' → 이상한 값: ' + h.match(/.{0,50}(undefined|\[object Object\]|NaN).{0,30}/)[0]);
    else ok(r.padEnd(22) + String(h.length).padStart(6) + '자  ' + doc.title.slice(0, 40));
  } catch (e) { bad(r + ' → ' + e.message); }
}

/* 2. 아이콘이 전부 실제로 그려지는가 (이름 오타 = 빈 아이콘) */
console.log('\n[2] 아이콘');
const used = new Set([...D.TASKS.map(t => t.icon), ...D.CATEGORIES.map(c => c.icon),
  ...[...read('assets/app.js').matchAll(/ic\("(\w+)"/g)].map(m => m[1])]);
const empty = [...used].filter(n => !/</.test(win.UI.icon(n)));
empty.length ? bad('내용 없는 아이콘: ' + empty.join(', ')) : ok(`${used.size}개 아이콘 모두 그려짐`);

/* 3. 기기 일러스트 */
console.log('\n[3] 기기 일러스트');
const kinds = [...new Set(D.MODELS.map(m => m.device))];
const broken = kinds.filter(k => (win.UI.device(k).match(/<rect|<ellipse|<path/g) || []).length < 5);
broken.length ? bad('덜 그려진 일러스트: ' + broken.join(', ')) : ok(`${kinds.length}종 일러스트 정상 (${kinds.join(', ')})`);

/* 4. 단계 체크리스트 */
console.log('\n[4] 단계 체크');
nav('#/m/samsung-3220/toner');
const items = [...doc.querySelectorAll('#steps li')];
const want = D.TASKS.find(t => t.id === 'toner').steps.length;
items.length === want ? ok(`단계 ${items.length}개 표시`) : bad(`단계 수 불일치 ${items.length} ≠ ${want}`);
items[0].dispatchEvent(new win.Event('click', { bubbles: true }));
items[2].dispatchEvent(new win.Event('click', { bubbles: true }));
const done = doc.querySelectorAll('#steps li.done').length;
done === 2 ? ok('두 단계 체크됨, 진행률 ' + doc.getElementById('bar').style.width) : bad('체크 안 됨(' + done + ')');
const saved = win.localStorage.getItem('firstoa.steps.samsung-3220.toner');
saved === '[0,2]' ? ok('브라우저에 기억됨 ' + saved) : bad('기억 실패: ' + saved);
nav('#/'); nav('#/m/samsung-3220/toner');
doc.querySelectorAll('#steps li.done').length === 2 ? ok('돌아와도 체크 유지') : bad('체크 유실');
win.FIRSTOA.reset();
doc.querySelectorAll('#steps li.done').length === 0 ? ok('처음부터 버튼 동작') : bad('초기화 실패');

/* 5. 브랜드 탭 */
console.log('\n[5] 브랜드 탭');
nav('#/');
const tabs = [...doc.querySelectorAll('.tab')];
const xeroxTab = tabs.find(t => t.dataset.brand === 'xerox');
xeroxTab.dispatchEvent(new win.Event('click', { bubbles: true }));
const shown = doc.querySelectorAll('#modelGrid .mcard').length;
const expect = D.MODELS.filter(m => m.brand === 'xerox').length;
shown === expect ? ok(`제록스 탭 → ${shown}종`) : bad(`탭 걸러내기 실패 ${shown} ≠ ${expect}`);

/* 6. 검색 창 */
console.log('\n[6] 검색 창');
win.FIRSTOA.open();
doc.getElementById('overlay').classList.contains('open') ? ok('창 열림') : bad('안 열림');
const sq = doc.getElementById('sq');
sq.value = '2263'; sq.dispatchEvent(new win.Event('input', { bubbles: true }));
const hits = doc.querySelectorAll('#res .hit');
hits.length ? ok(`"2263" → ${hits.length}건, 첫째: ${hits[0].querySelector('b').textContent}`) : bad('결과 없음');
sq.value = '마블'; sq.dispatchEvent(new win.Event('input', { bubbles: true }));
const aka = doc.querySelector('#res .hit b')?.textContent || '';
aka.includes('C2263') ? ok('사내 코드명 "마블"로도 검색됨 → ' + aka) : bad('별칭 검색 실패: ' + aka);
doc.body.innerHTML.includes('마블') && bad('사내 코드명이 화면에 노출됨');
win.FIRSTOA.close();
!doc.getElementById('overlay').classList.contains('open') ? ok('창 닫힘') : bad('안 닫힘');

/* 7. 고객 화면에 사내 코드명 노출 금지 */
console.log('\n[7] 사내 코드명 비노출');
const secret = ['키슈', '세이토', '마블', '베니', '보탄', '헤라'];
let leak = [];
for (const r of ['#/', '#/m/xerox-dcv-c2263', '#/m/xerox-dcv-c2263/toner', '#/t/toner']) {
  nav(r);
  const txt = doc.getElementById('app').textContent;
  secret.forEach(w => { if (txt.includes(w)) leak.push(`${r}:${w}`); });
}
leak.length ? bad('노출됨 → ' + leak.join(', ')) : ok('전 화면에서 코드명 노출 없음');

/* 8. 영상 링크 형태 */
console.log('\n[8] 영상 연결');
const m = D.MODELS[0]; const keep = m.videos.toner; m.videos.toner = 'dQw4w9WgXcQ';
nav('#/m/' + m.id + '/toner');
const img = doc.querySelector('.player img');
img?.getAttribute('src')?.includes('dQw4w9WgXcQ') ? ok('썸네일 연결 ' + img.getAttribute('src')) : bad('썸네일 없음');
win.FIRSTOA.play();
const fr = doc.querySelector('.player iframe')?.getAttribute('src') || '';
fr.includes('youtube-nocookie.com/embed/dQw4w9WgXcQ') ? ok('재생 전환 정상 (nocookie)') : bad('재생 실패: ' + fr);
m.videos.toner = keep;

/* 9. 영상 연결 빠짐 없음 */
console.log('\n[9] 채널 영상 연결');
const wired = new Set(); D.MODELS.forEach(m => Object.values(m.videos).forEach(v => v && wired.add(v)));
const idRe = /^[\w-]{11}$/;
const badId = [...wired].filter(v => !idRe.test(v));
badId.length ? bad('형식이 틀린 영상 ID: ' + badId.join(', ')) : ok(`영상 ${wired.size}편 연결, ID 형식 정상`);
const ref = JSON.parse(read('data/channel-videos.json'));
const unwired = ref.videos.filter(v => !wired.has(v.id));
unwired.length ? bad(`채널 영상 ${unwired.length}편이 아직 연결 안 됨: ` + unwired.map(v => v.title).join(', '))
               : ok(`채널 ${ref.videos.length}편 전부 연결됨`);
const ghost = [...wired].filter(id => !ref.videos.some(v => v.id === id));
ghost.length ? bad('채널에 없는 영상 ID: ' + ghost.join(', ')) : ok('엉뚱한 영상 ID 없음');
nav('#/m/samsung-3220');
const vbadges = doc.querySelectorAll('#app .b-vid').length;
vbadges >= 2 ? ok(`삼성 3220 화면에 영상 배지 ${vbadges}개`) : bad('영상 배지 없음');

/* 10. 회사 정보·카카오·홍보 */
console.log('\n[10] 회사 정보 · 카카오 · 취급 품목');
nav('#/');
const home = doc.getElementById('app').innerHTML;
const kko = [...doc.querySelectorAll('#app a[href*="pf.kakao.com"]')];
kko.length ? ok(`카카오 채널 링크 ${kko.length}곳 (${kko[0].getAttribute('href')})`) : bad('카카오 링크 없음');
const prods = doc.querySelectorAll('#app .pcard:not(.pack)');
prods.length === D.PRODUCTS.length ? ok(`취급 품목 ${prods.length}개 표시`) : bad(`취급 품목 ${prods.length} ≠ ${D.PRODUCTS.length}`);
const packs = doc.querySelectorAll('#app .pcard.pack');
packs.length === D.PACKAGES.length ? ok(`렌탈 패키지 ${packs.length}개 표시`) : bad(`패키지 ${packs.length} ≠ ${D.PACKAGES.length}`);
const stats = doc.querySelectorAll('#app .trust .cell');
stats.length === D.STATS.length ? ok(`실적 ${stats.length}개 표시`) : bad('실적 띠 없음');
// 사진 파일이 실제로 있는지
const imgs = [...doc.querySelectorAll('#app img')].map(i => i.getAttribute('src')).filter(s => s && s.startsWith('assets/'));
const missing = [...new Set(imgs)].filter(p => !fs.existsSync(HOME + '/' + p));
missing.length ? bad('없는 이미지 파일: ' + missing.join(', ')) : ok(`이미지 ${new Set(imgs).size}장 모두 존재`);
// 머리말·꼬리말
doc.getElementById('topbar').innerHTML.includes('퍼스트전산') ? ok('상단 안내 띠 채워짐') : bad('상단 띠 비어 있음');
const foot = doc.getElementById('footer').innerHTML;
foot.includes(D.meta.bizNo) && foot.includes('유튜브') ? ok('바닥글: 사업자번호·유튜브 채널 포함') : bad('바닥글 내용 누락');
nav('#/m/samsung-3220');
doc.querySelector('#app .mcard .real, #app .phead .art img.photo') ? ok('기종 화면에 실제 제품 사진') : bad('기종 사진 안 붙음');

/* 11. 간단 AS 적용 범위 */
console.log('\n[11] 간단 AS(브랜드 공통) 적용 범위');
nav('#/m/samsung-3220');
const sTx = doc.getElementById('app').textContent;
sTx.includes('ACR') ? ok('삼성 기종에 삼성 전용 처리 표시') : bad('삼성 전용 처리 안 보임');
nav('#/m/xerox-c2263');
const xTx = doc.getElementById('app').textContent;
!xTx.includes('ACR') ? ok('제록스 기종엔 삼성 전용 처리 숨김') : bad('삼성 전용 처리가 제록스에 샜다');
xTx.includes('용지 걸림') ? ok('전 기종 공통 처리는 어디서나 표시') : bad('공통 처리 누락');
nav('#/m/samsung-3220/f/acr-ctd');
doc.getElementById('app').textContent.includes('준비') ? ok('내용 없는 항목은 "준비 중"으로 안내') : bad('빈 항목 처리 없음');
// 드럼은 브라더만
const drumModels = D.MODELS.filter(m => 'drum' in m.videos).map(m => m.id);
drumModels.length === 1 && drumModels[0] === 'brother-5700'
  ? ok('드럼 교체는 브라더 5700에만 노출') : bad('드럼 노출 기종: ' + drumModels.join(','));
// 카카오는 채팅 직행이 아니라 채널 홈
nav('#/');
const chatLinks = [...doc.querySelectorAll('#app a[href*="/chat"]')];
chatLinks.length === 0 ? ok('카카오는 채널 홈으로만 연결(로그인 벽 회피)') : bad('채팅 직행 링크 남음 ' + chatLinks.length);

console.log(fails ? `\n실패 ${fails}건` : '\n전 항목 통과');
process.exit(fails ? 1 : 0);
