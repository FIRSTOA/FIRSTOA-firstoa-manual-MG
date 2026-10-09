/* 실제 DOM(happy-dom)에 올려서 화면·상호작용을 점검한다 */
import fs from 'fs';
import { Window } from 'happy-dom';
import path from 'path';
import { fileURLToPath } from 'url';
const HOME = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
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
  win.eval(read('assets/chart.js'));
  win.eval(read('assets/app.js'));
} catch (e) { bad('스크립트 실행 실패: ' + e.message); console.log(e.stack); process.exit(1); }

const doc = win.document, D = win.FIRSTOA_MANUAL;
// 경로 주소(2026-10-09): '#/m/x/#sec-fix' 처럼 적어도 되고, 그대로 경로('/m/x#sec-fix')로 바꿔 pushState 한다
const toPath = (h) => { if (h.startsWith('#')) h = h.slice(1); if (h.startsWith('/#')) return '/#' + h.slice(2); const i = h.indexOf('/#'); return i >= 0 ? h.slice(0, i) + '#' + h.slice(i + 2) : h; };
const nav = (h) => { win.history.pushState(null, '', toPath(h)); win.dispatchEvent(new win.Event('popstate')); };
const junk = s => /undefined|\[object Object\]|NaN|&lt;svg/.test(s);

/* 1. 모든 주소가 그려지는가 */
console.log('\n[1] 화면 그리기');
const routes = ['#/', '#/m/samsung-3220', '#/m/samsung-3220/toner', '#/m/hp-8710/ink',
  '#/fixes', '#/fixes/samsung', '#/fixes/samsung/acr-ctd', '#/fixes/xerox', '#/fixes/xerox/jam', '#/pattern', '#/meter', '#/notices', '#/f/jam', '#/f/acr-ctd', '#/m/samsung-3220/f/jam', '#/m/samsung-3220/f/acr-ctd',
  '#/m/xerox-c2263/f/line-copy',
  '#/products', '#/products/#grp-office', '#/b/samsung', '#/qr', '#/qr/samsung-3220', '#/m/samsung-3220?src=qr', '#/m/samsung-3220/#sec-fix', '#/t/toner', '#/t/meter', '#/s/3220', '#/s/줄', '#/s/zzz없음', '#/m/없음', '#/헛주소'];
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
const want = ((D.MODELS.find(m => m.id === 'samsung-3220').steps || {}).toner || D.TASKS.find(t => t.id === 'toner').steps).length;   // 기종별 순서가 있으면 그것(2026-10-09)
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
(D.FIXES || []).forEach(f => { if (f.video) wired.add(f.video); Object.values(f.videos || {}).forEach(v => v && wired.add(v)); });
const idRe = /^[\w-]{11}$/;
const badId = [...wired].filter(v => !idRe.test(v));
badId.length ? bad('형식이 틀린 영상 ID: ' + badId.join(', ')) : ok(`영상 ${wired.size}편 연결, ID 형식 정상`);
const ref = JSON.parse(read('data/channel-videos.json'));
const unwired = ref.videos.filter(v => !wired.has(v.id));
unwired.length ? bad(`채널 영상 ${unwired.length}편이 아직 연결 안 됨: ` + unwired.map(v => v.title).join(', '))
               : ok(`채널 ${ref.videos.length}편 전부 연결됨`);
const officialIds = new Set(Object.keys(D.OFFICIAL_VIDEOS || {}));
const ghost = [...wired].filter(id => !officialIds.has(id) && !ref.videos.some(v => v.id === id));
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
prods.length > 0 && prods.length <= D.PRODUCTS.length ? ok(`홈 취급 품목 맛보기 ${prods.length}개 (전체 ${D.PRODUCTS.length}개는 #/products)`) : bad(`홈 취급 품목 ${prods.length} / ${D.PRODUCTS.length}`);
const packs = doc.querySelectorAll('#app .pcard.pack');
packs.length === D.PACKAGES.length ? ok(`렌탈 패키지 ${packs.length}개 표시`) : bad(`패키지 ${packs.length} ≠ ${D.PACKAGES.length}`);
const stats = doc.querySelectorAll('#app .trust .cell');
stats.length === D.STATS.length ? ok(`실적 ${stats.length}개 표시`) : bad('실적 띠 없음');
const firstIds = D.PRODUCTS.slice(0, 4).map(p => p.id).join(',');
firstIds === 'desktop,laptop,mac,software' ? ok('취급 품목 순서: 데스크탑 → 노트북 → 맥 → 소프트웨어') : bad('취급 품목 순서 어긋남: ' + firstIds);
const staff = D.STATS.find(s => s.label === '전문 인력');
staff && staff.n === '55' ? ok('전문 인력 55명') : bad('전문 인력 수치 ' + (staff && staff.n));
home.includes('55명') ? ok('홈 문구에 55명') : bad('홈 문구에 55명 없음');
// 사진 파일이 실제로 있는지
const imgs = [...doc.querySelectorAll('#app img')].map(i => i.getAttribute('src')).filter(s => s && /^\/?assets\//.test(s));
const missing = [...new Set(imgs)].filter(p => !fs.existsSync(HOME + '/' + p.replace(/^\//, '')));
[...new Set(imgs)].some(p => !p.startsWith('/')) ? bad('상대 경로 이미지(경로 주소에서 깨짐): ' + [...new Set(imgs)].filter(p => !p.startsWith('/')).slice(0,3).join(', ')) : ok('이미지 주소가 모두 절대 경로');
missing.length ? bad('없는 이미지 파일: ' + missing.join(', ')) : ok(`이미지 ${new Set(imgs).size}장 모두 존재`);
// 머리말·꼬리말
const logo = doc.querySelector('.brandmark img.logo');
logo && logo.getAttribute('src').includes('logo-firstoa') ? ok('헤더에 실제 회사 로고') : bad('로고 이미지 없음');
doc.getElementById('navTel')?.innerHTML.includes(D.meta.phone) ? ok('헤더에 대표번호') : bad('헤더 전화번호 없음');
const foot = doc.getElementById('footer').innerHTML;
foot.includes('55명') && !foot.includes('40명') ? ok('꼬리말 문구에 55명') : bad('꼬리말 문구 수치');

/* 15. 2026-10-09: 기종 탭 · 취급 품목 화면 · 안내 상자 줄바꿈 · 카운터 기종별 */
console.log('\n[15] 기종 탭 · 취급 품목 · 카운터');
nav('#/m/samsung-3220');
const jumpHrefs = [...doc.querySelectorAll('#jump a')].map(a => a.getAttribute('href'));
jumpHrefs.length && jumpHrefs.every(h => h.startsWith('/m/samsung-3220#sec-')) ? ok('기종 탭 주소가 화면 안 이동 형식 (' + jumpHrefs.length + '개)') : bad('기종 탭 주소: ' + jumpHrefs.join(' '));
nav('#/m/samsung-3220/#sec-fix');
doc.querySelector('#app .mpage') ? ok('탭 주소로 들어와도 기종 화면이 그려짐') : bad('탭 주소에서 404');
nav('/#sec-manage');
(doc.querySelector('#app .mpage') || win.location.pathname.includes('/m/samsung-3220')) ? ok('옛 탭 주소(#sec-…)는 마지막 기종으로 (' + win.location.pathname + ')') : bad('옛 탭 주소에서 404: ' + win.location.pathname);
nav('#/헛주소');
doc.querySelector('#app .empty a[href="/m/samsung-3220"]') ? ok('404 에 "삼성 3220 화면으로 돌아가기" 단추') : bad('404 에 되돌아가기 단추 없음');
nav('#/products');
const pcards = doc.querySelectorAll('#app .pcard:not(.pack)').length;
pcards === D.PRODUCTS.length ? ok(`취급 품목 화면에 품목 ${pcards}개`) : bad(`취급 품목 화면 ${pcards} ≠ ${D.PRODUCTS.length}`);
const grp = [...doc.querySelectorAll('#app .pgroups .section')].map(x => x.id);
grp.join(',') === D.PRODUCT_GROUPS.map(g => 'grp-' + g.id).join(',') ? ok('묶음 순서: ' + grp.join(' → ')) : bad('묶음 순서: ' + grp.join(','));
['software', 'network'].every(id => D.PRODUCTS.some(p => p.id === id)) ? ok('소프트웨어 · 네트워크 카드 있음') : bad('소프트웨어/네트워크 카드 없음');
[...doc.querySelectorAll('#navLinks a, .nav-links a')].some(a => a.getAttribute('href') === '/products') ? ok('헤더 취급 품목 → 개별 화면') : bad('헤더 취급 품목 링크가 홈 안쪽');
const cssText = fs.readFileSync(HOME + '/assets/style.css', 'utf8');
cssText.includes('.callout > b{') && cssText.includes('.callout li b,.callout p b{display:inline') ? ok('안내 상자 문장 속 굵은 글씨는 inline') : bad('callout b 규칙');
nav('#/meter');
const mg = doc.querySelectorAll('#app .mgroup').length, wantGroups = D.METER.brands.reduce((n, b) => n + (b.groups || [1]).length, 0);
mg === wantGroups ? ok(`카운터 안내 기종 묶음 ${mg}개`) : bad(`카운터 묶음 ${mg} ≠ ${wantGroups}`);
doc.getElementById('app').innerHTML.includes('X3220') && doc.getElementById('app').innerHTML.includes('MX410') ? ok('카운터 안내에 실제 기종명') : bad('카운터 안내 기종명 누락');

/* 16. 2026-10-09: 관리·검침 그림 · 검침 기종별 안내 · 증상 숨김/삼성 영상 · 잉크 · 폐토너통 없음 · 이사 안내 */
console.log('\n[16] 관리·검침 · 증상 영상 · 잉크 · 이사 안내');
const appHtml = () => doc.getElementById('app').innerHTML;
nav('#/m/samsung-3220');
const mArts = doc.querySelectorAll('#sec-manage .ph.art .dev').length;
mArts >= 3 ? ok(`관리·검침 카드 그림 ${mArts}개`) : bad('관리·검침 카드 그림 ' + mArts);
const sFix = [...doc.querySelectorAll('#sec-fix .tcard')];
sFix.length === 7 && sFix.every(c => c.querySelector('img')) ? ok('삼성 3220 증상 7개 모두 영상 썸네일') : bad(`삼성 증상 ${sFix.length}개, 썸네일 ${sFix.filter(c => c.querySelector('img')).length}`);
nav('#/m/xerox-c2263');
const xFix = [...doc.querySelectorAll('#sec-fix .tcard b')].map(b => b.textContent);
xFix.length === 4 && !xFix.some(t => /ACR|틀어짐/.test(t)) ? ok('제록스엔 공통 증상 4개만') : bad('제록스 증상: ' + xFix.join(','));
nav('#/fixes/samsung');
!appHtml().includes('내용 준비 중') ? ok('삼성 증상 목록에 "준비 중" 없음') : bad('삼성 증상 목록에 준비 중 남음');
nav('#/m/samsung-3220/f/acr-ctd');
doc.querySelector('#app .player') && doc.querySelectorAll('#app .steps li').length === 8 ? ok('삼성 ACR·CTD: 영상 + 글 순서 8단계') : bad('ACR·CTD 화면 ' + doc.querySelectorAll('#app .steps li').length);
nav('#/m/samsung-3220/meter');
doc.querySelector('#app .mpanel') && appHtml().includes('X3220') && doc.querySelectorAll('#app .keyflow .key').length === 3 && doc.querySelectorAll('#app .mpanel .ministeps li').length === 3 && doc.querySelectorAll('#app .mpanel kbd').length >= 2 && !appHtml().includes('기종 공통 일반 안내') ? ok('삼성 3220 검침: 단추 흐름 + 번호 순서 + [단추] 키 표시') : bad('검침 화면: 키 ' + doc.querySelectorAll('#app .keyflow .key').length + ' 순서 ' + doc.querySelectorAll('#app .mpanel .ministeps li').length);
nav('#/m/kyocera/meter');
doc.querySelectorAll('#app .mpanel .mgroup').length === 2 ? ok('교세라 검침: 두 묶음(M5521·M5526·MA2100, 2101)') : bad('교세라 검침 묶음 ' + doc.querySelectorAll('#app .mpanel .mgroup').length);
nav('#/m/hp-8710');
appHtml().includes('잉크 보충') && !appHtml().includes('토너 교체') ? ok('HP 오피스젯: 잉크 보충') : bad('HP 오피스젯 작업명');
for (const id of ['kyocera', 'brother-5700', 'brother-8900', 'oki-5473', 'lexmark-mx410']) { nav('#/m/' + id); if ([...doc.querySelectorAll('#sec-consumable .tcard b')].some(b => b.textContent.includes('폐토너통'))) bad(id + ' 에 폐토너통 카드 남음'); }
ok('교세라·브라더·오키·렉스마크 폐토너통 없음');
nav('#/notices');
appHtml().includes('이삿짐') && appHtml().includes('보험') && appHtml().includes('운반비') ? ok('이사 안내: 물류비 · 이삿짐 보험') : bad('이사 안내 문구');
foot.includes(D.meta.bizNo) && foot.includes('유튜브') ? ok('바닥글: 사업자번호·유튜브 채널 포함') : bad('바닥글 내용 누락');
nav('#/m/samsung-3220');
doc.querySelector('#app .msum-art img.photo, #app .phead .art img.photo') ? ok('기종 화면에 실제 제품 사진') : bad('기종 사진 안 붙음');

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
doc.querySelectorAll('#app .steps li').length ? ok('ACR·CTD 에 글 순서 있음(2026-10-09 채움)') : bad('ACR·CTD 글 순서 없음');
// 드럼은 브라더만
const drumModels = D.MODELS.filter(m => 'drum' in m.videos).map(m => m.id);
drumModels.length === 1 && drumModels[0] === 'brother-5700'
  ? ok('드럼 교체는 브라더 5700에만 노출') : bad('드럼 노출 기종: ' + drumModels.join(','));
// 카카오는 채팅 직행이 아니라 채널 홈
nav('#/');
const chatLinks = [...doc.querySelectorAll('#app a[href*="/chat"]')];
chatLinks.length === 0 ? ok('카카오는 채널 홈으로만 연결(로그인 벽 회피)') : bad('채팅 직행 링크 남음 ' + chatLinks.length);

/* 12. 4색 차트 · 카운터 · 이용 안내 */
console.log('\n[12] 새 화면');
nav('#/pattern');
const svg = doc.getElementById('chartSvg');
if (!svg) bad('차트 SVG 없음');
else {
  const h = svg.outerHTML;
  const inks = ['#000000', '#00AEEF', '#EC008C', '#FFF200'].filter(c => h.includes(c));
  inks.length === 4 ? ok('차트에 KCMY 원색 모두 포함') : bad('빠진 원색: ' + (4 - inks.length) + '개');
  h.includes('viewBox="0 0 210 297"') ? ok('A4 비율(210×297mm)로 그려짐') : bad('A4 규격 아님');
  const rects = (h.match(/<rect/g) || []).length;
  rects > 60 ? ok(`차트 도형 ${rects}개 (색 블록·농도 단계·전면)`) : bad('차트가 너무 단순함 ' + rects);
  h.includes('background') ? bad('CSS 배경 사용 — 인쇄에서 빠질 수 있음') : ok('배경색 대신 도형으로만 그려 인쇄 안전');
}
nav('#/meter');
const mBrands = doc.querySelectorAll('#app .mcard');
mBrands.length === D.METER.brands.length ? ok(`카운터 안내 ${mBrands.length}개 브랜드 카드`) : bad(`카운터 안내 카드 ${mBrands.length} ≠ ${D.METER.brands.length}`);
nav('#/notices');
const nCards = doc.querySelectorAll('#app .notice');
nCards.length === D.NOTICES.length ? ok(`이용 안내 ${nCards.length}가지`) : bad('이용 안내 누락');
const nTx = doc.getElementById('app').textContent;
['장마', '정전기', '당일 방문'].every(k => nTx.includes(k))
  ? ok('장마철·정전기·방문 원칙 안내 포함') : bad('요청한 안내문 누락');
// 헤더 5개
const navLinks = [...doc.querySelectorAll('.nav-links a')].map(a => a.textContent.trim());
navLinks.join('/') === '기종 전체/자주 생기는 문제/4색 패턴 출력/사용량 카운터/취급 품목'
  ? ok('헤더: ' + navLinks.join(' · ')) : bad('헤더 구성 다름: ' + navLinks.join(','));
// 용지는 브랜드 사진을 쓰지 않는다
const paper = D.PRODUCTS.find(p => p.id === 'paper');
paper && paper.img === '/assets/img/paper.webp' ? ok('복사용지는 상표 없는 실제 사진(2026-10-09)') : bad('용지 사진이 지정한 상표 없는 사진이 아님');

/* 13. 브랜드별 증상 구조 · 5장 출력 */
console.log('\n[13] 브랜드별 증상 · 출력 5장');
nav('#/fixes');
const bCards = doc.querySelectorAll('#app .btile, #app .mcard');
bCards.length >= 5 ? ok(`브랜드 고르기 타일 ${bCards.length}곳`) : bad('브랜드 카드 부족 ' + bCards.length);
nav('#/fixes/samsung');
const sTiles = [...doc.querySelectorAll('#app .tile')].map(t => t.querySelector('b').textContent);
sTiles.some(t => t.includes('ACR')) ? ok('삼성 전용 증상이 삼성 목록에 있음') : bad('삼성 전용 누락');
nav('#/fixes/xerox');
const xTiles = [...doc.querySelectorAll('#app .tile')].map(t => t.querySelector('b').textContent);
!xTiles.some(t => t.includes('ACR')) ? ok('제록스 목록엔 삼성 전용 없음') : bad('삼성 전용이 제록스로 샘');
xTiles.some(t => t.includes('용지 걸림')) ? ok('공통 증상은 모든 브랜드에 표시') : bad('공통 증상 누락');
nav('#/pattern');
const rows = doc.querySelectorAll('#app .inkrow');
rows.length === 5 ? ok('한 장씩 뽑기 목록 5줄') : bad('출력 목록 ' + rows.length);
const sw = [...doc.querySelectorAll('#app .swatch')].map(e => e.getAttribute('style') || '');
['#000000', '#00AEEF', '#EC008C', '#FFF200'].every(c => sw.some(s2 => s2.includes(c)))
  ? ok('색 견본 네 가지 표시') : bad('색 견본 누락');
doc.querySelector('#app details.peek') ? ok('종합 차트 미리보기는 접어 둠') : bad('미리보기 접기 없음');

/* 인쇄: 화면 CSS 를 타지 않는 별도 문서를 만든다 */
const before = doc.querySelectorAll('iframe').length;
win.FIRSTOA.printChart('all');
const frames = [...doc.querySelectorAll('iframe')];
frames.length === before + 1 ? ok('인쇄용 문서(iframe) 생성됨') : bad('인쇄 문서가 안 만들어짐');
const fd = frames[frames.length - 1].contentDocument;
if (!fd) bad('인쇄 문서를 읽을 수 없음');
else {
  const ph = fd.documentElement.innerHTML;
  const pcount = (ph.match(/class="p"/g) || []).length;
  pcount === 5 ? ok('인쇄 문서에 5장 (K·C·M·Y·종합)') : bad('인쇄 문서 장수 ' + pcount);
  const inks = ['#000000', '#00AEEF', '#EC008C', '#FFF200'].filter(c => ph.includes(c));
  inks.length === 4 ? ok('네 색 전면이 모두 들어감') : bad('빠진 색 ' + (4 - inks.length));
  /margin:0/.test(ph) ? ok('인쇄 문서는 여백 0 (종이 끝까지)') : bad('여백 0 아님');
  /print-color-adjust:exact/.test(ph) ? ok('색 보정 없이 그대로 인쇄') : bad('색 보정 지정 없음');
  ph.includes('210mm') && ph.includes('297mm') ? ok('각 장이 A4 크기로 고정') : bad('A4 크기 지정 없음');
}
// 한 장만 뽑기
win.FIRSTOA.printChart('K');
const last = [...doc.querySelectorAll('iframe')].pop().contentDocument;
last && (last.documentElement.innerHTML.match(/class="p"/g) || []).length === 1
  ? ok('한 장만 고르면 그 장만 인쇄') : bad('한 장 인쇄가 안 걸러짐');
// 화면 CSS 에는 인쇄용 잔재가 없어야 한다
const css = read('assets/style.css');
!css.includes('printing-chart') && !css.includes('#printArea')
  ? ok('화면 CSS 에 인쇄 잔재 없음') : bad('옛 인쇄 규칙이 남아 있음');
(css.match(/@page\{/g) || []).length === 1 ? ok('@page 기본 규칙 하나만') : bad('@page 중복');

/* 14. 폰 하단 탭 · 메뉴판 (2026-10-06) */
console.log('\n[14] 하단 탭');
const tabs2 = doc.querySelectorAll('#tabbar [data-tab]');
tabs2.length === 5 ? ok('하단 탭 5개 (홈·기종·문제 해결·더보기·상담)') : bad('하단 탭 수 ' + tabs2.length);
nav('#/fixes');
doc.querySelector('#tabbar [data-tab="fixes"].on') ? ok('문제 해결 탭 활성 표시') : bad('탭 활성 표시 안 됨');
win.FIRSTOA.sheet('more');
!doc.getElementById('bsheet').hidden && doc.querySelectorAll('#bsheetBody .row').length >= 4 ? ok('더보기 메뉴판 열림 · 항목 ' + doc.querySelectorAll('#bsheetBody .row').length) : bad('더보기 메뉴판 실패');
win.FIRSTOA.sheet('help');
doc.getElementById('bsheetBody').innerHTML.includes('pf.kakao.com/_yCBAj"') && !doc.getElementById('bsheetBody').innerHTML.includes('/chat') ? ok('상담 메뉴판: 카카오 채널 홈으로') : bad('상담 메뉴판 카카오 주소');
nav('#/');
doc.getElementById('bsheet').hidden ? ok('화면 이동하면 메뉴판 닫힘') : bad('메뉴판 안 닫힘');
doc.getElementById('modelGrid').classList.contains('collapsed') && doc.getElementById('showAll') ? ok('기종 목록 접힘 + 모두 보기 단추') : bad('기종 접기 없음');
win.FIRSTOA.showAll();
!doc.getElementById('modelGrid').classList.contains('collapsed') && !doc.getElementById('showAll') ? ok('모두 보기 동작') : bad('모두 보기 실패');
/#callbar/.test(doc.body.innerHTML) ? bad('옛 전화바 잔재') : ok('옛 하단 전화바 제거됨');
/기사/.test(doc.getElementById('app').innerHTML + doc.getElementById('footer').innerHTML) ? bad("'기사' 표현 남음") : ok("'기사' 대신 엔지니어");

console.log(fails ? `\n실패 ${fails}건` : '\n모두 통과');
process.exit(fails ? 1 : 0);

/* 17. 2026-10-09 밤: 증상 제목은 고객 말로, 글 순서 없는 증상 0 */
console.log('\n[17] 증상 제목 · 글 순서');
const noSteps = D.FIXES.filter(f => !(f.steps || []).length).map(f => f.id);
noSteps.length ? bad('글 순서 없는 증상: ' + noSteps.join(', ')) : ok(`증상 ${D.FIXES.length}개 모두 글 순서 있음`);
!D.FIXES.some(f => f.id === 'glass-pm') ? ok('유리 PM 은 "복사/스캔 시 줄 나옴"에 합쳐짐') : bad('glass-pm 남음');
D.FIXES.every(f => !/PM|가이드 조정/.test(f.title)) ? ok('제목에 PM · 가이드 조정 같은 말 없음') : bad('제목: ' + D.FIXES.map(f => f.title).join(' | '));

/* 18. 브랜드별 덮어쓰기 순서(삼성 영상 절차) */
console.log('\n[18] 브랜드별 순서');
nav('#/m/samsung-3220/f/jam');
doc.querySelectorAll('#app .steps li').length === 9 ? ok('삼성 3220 용지 걸림: 삼성 절차 9단계') : bad('삼성 용지 걸림 단계 ' + doc.querySelectorAll('#app .steps li').length);
nav('#/m/xerox-c2263/f/jam');
doc.querySelectorAll('#app .steps li').length === 4 ? ok('제록스 용지 걸림: 공통 절차 4단계') : bad('제록스 용지 걸림 단계 ' + doc.querySelectorAll('#app .steps li').length);
nav('#/fixes/samsung/line-print');
doc.querySelectorAll('#app .steps li').length === 7 ? ok('삼성 브랜드 화면 PC 출력 흰 줄: 청소 막대 7단계') : bad('삼성 흰 줄 단계 ' + doc.querySelectorAll('#app .steps li').length);
nav('#/m/samsung-3220/f/line-copy');
doc.getElementById('app').textContent.includes('물티슈') ? ok('복사/스캔 줄: 영상 순서(오염 자리 찾기 · 물티슈)') : bad('복사/스캔 줄 순서');

/* 19. 취급 품목 추가(PC 유지보수 · 가구 · 용지 사진) · 후지필름 Apeos C2060 */
console.log('\n[19] 취급 품목 추가 · Apeos C2060');
['pc-care', 'furniture', 'paper'].every(id => { const p = D.PRODUCTS.find(x => x.id === id); return p && p.img && fs.existsSync(HOME + '/' + p.img); }) ? ok('PC 유지보수 · 가구 · 용지 카드에 실제 사진') : bad('새 품목 사진 누락');
D.MODELS.find(m => m.id === 'xerox-apeos-c2060' && m.photo && fs.existsSync(HOME + '/' + m.photo)) ? ok('후지필름 Apeos C2060 기종 카드 + 사진') : bad('Apeos C2060 카드 없음');
!D.MODELS.find(m => m.id === 'xerox-c2263').name.includes('2060') ? ok('제록스 C2263 카드에서 2060 분리') : bad('C2263 카드에 2060 남음');
nav('#/m/xerox-apeos-c2060/meter');
appHtml().includes('톱니바퀴') ? ok('Apeos C2060 검침: 톱니바퀴 방법으로 안내') : bad('Apeos C2060 검침 안내');
nav('#/s/2060');
doc.querySelectorAll('#app .mcard').length === 1 ? ok('"2060" 검색 → Apeos 카드 하나') : bad('2060 검색 결과 ' + doc.querySelectorAll('#app .mcard').length);

/* 20. 기종별 따라 하는 순서(영상 27편에서 옮김) */
console.log('\n[20] 기종별 따라 하는 순서');
const withVideo = []; D.MODELS.forEach(m => Object.entries(m.videos || {}).forEach(([t, v]) => { if (v) withVideo.push([m.id, t]); }));
const noOwnSteps = withVideo.filter(([mid, t]) => !((D.MODELS.find(m => m.id === mid).steps || {})[t] || []).length);
noOwnSteps.length ? bad('영상은 있는데 기종별 순서가 없음: ' + noOwnSteps.map(x => x.join('.')).join(', ')) : ok(`영상 있는 ${withVideo.length}칸 모두 기종별 순서 있음`);
nav('#/m/brother-5700/drum');
doc.querySelectorAll('#app .steps li').length === 8 && doc.getElementById('app').textContent.includes('DR') ? ok('브라더 5700 드럼: 영상 순서 8단계') : bad('브라더 드럼 순서 ' + doc.querySelectorAll('#app .steps li').length);
nav('#/m/samsung-3220/toner');
doc.getElementById('app').textContent.includes('칩이 위로') ? ok('삼성 3220 토너: 영상 순서(칩 방향)') : bad('삼성 3220 토너 순서');
nav('#/m/xerox-apeos-c2060/toner');
doc.querySelector('#app .player') && doc.getElementById('app').textContent.includes('움푹 들어간 손잡이') ? ok('Apeos C2060 토너: 마블 영상 + 순서') : bad('Apeos 토너 화면');
nav('#/m/sindoh-d420/waste');
doc.getElementById('app').textContent.includes('마개') && doc.getElementById('app').textContent.includes('새 통에서 뺀 마개') ? ok('신도 D420 폐토너통: 기종별 주의 표시') : bad('신도 D420 주의');

/* 21. 제조사 공식 영상(2026-10-09) */
console.log('\n[21] 제조사 공식 영상');
const usedIds = new Set(); D.MODELS.forEach(m => Object.values(m.videos || {}).forEach(v => v && usedIds.add(v))); D.FIXES.forEach(f => Object.values(f.videos || {}).forEach(v => v && usedIds.add(v)));
const unusedOfficial = Object.keys(D.OFFICIAL_VIDEOS).filter(id => !usedIds.has(id));
unusedOfficial.length ? bad('출처표에만 있고 안 쓰인 공식 영상: ' + unusedOfficial.join(', ')) : ok(`공식 영상 ${Object.keys(D.OFFICIAL_VIDEOS).length}편 모두 화면에 연결`);
nav('#/m/hp-laser/toner');
doc.querySelector('#app .player') && appHtml().includes('제조사 공식 영상 · HP Support') && doc.querySelectorAll('#app .steps li').length === 8 ? ok('HP M501 토너: 공식 영상 + 순서 8단계') : bad('HP M501 화면');
nav('#/m/xerox-sc2022/waste');
appHtml().includes('청소 막대') && appHtml().includes('FUJIFILM') ? ok('SC2022 폐토너: 공식 영상 + 청소 막대 순서') : bad('SC2022 폐토너 화면');
nav('#/m/sindoh-d450/f/jam');
doc.querySelector('#app .player[data-v="Um0Y1RETt1Q"]') && appHtml().includes('신도리코 Sindoh') ? ok('신도 D450 용지 걸림: 기종별 공식 영상') : bad('신도 D450 걸림 화면');
nav('#/m/sindoh-n501/f/jam');
!doc.querySelector('#app .player') ? ok('신도 N501 용지 걸림: 맞는 영상 없음 → 영상 없이 글 순서만') : bad('N501 에 엉뚱한 영상');
nav('#/m/xerox-c2263/f/adf-jam');
doc.querySelector('#app .player[data-v="XJR4QANPOMg"]') ? ok('제록스 원고 걸림: 후지필름 공통 공식 영상') : bad('제록스 ADF 화면');
nav('#/m/kyocera');
appHtml().includes('ECOSYS M5521cdw') ? ok('교세라 카드 실제 모델명') : bad('교세라 모델명');
const offBadges = (() => { nav('#/m/hp-laser'); return doc.querySelectorAll('#app .badge.b-off').length; })();
offBadges >= 1 ? ok('공식 영상 배지 표시') : bad('공식 영상 배지 없음');

/* 22. 기종별 공식 영상 순서(자주 생기는 문제) */
console.log('\n[22] 증상 기종별 순서');
nav('#/m/sindoh-d450/f/jam');
doc.querySelector('#app .player[data-v="Um0Y1RETt1Q"]') && doc.querySelectorAll('#app .steps li').length === 7 ? ok('신도 D450 용지 걸림: 공식 영상 + 7단계') : bad('신도 D450 걸림 ' + doc.querySelectorAll('#app .steps li').length);
nav('#/m/hp-9010/f/adf-jam');
doc.querySelector('#app .player[data-v="XsoTi03l39c"]') && appHtml().includes('분리 패드') ? ok('HP 9010 원고 걸림: 공식 영상 + 영상 순서') : bad('HP 9010 ADF');
nav('#/m/xerox-c2263/f/adf-jam');
appHtml().includes('좁은 유리띠') ? ok('제록스 원고 걸림: 후지필름 공통 순서') : bad('제록스 ADF 순서');
nav('#/m/samsung-3220/f/jam');
doc.querySelectorAll('#app .steps li').length === 9 ? ok('삼성 용지 걸림 순서는 그대로(9단계)') : bad('삼성 걸림 ' + doc.querySelectorAll('#app .steps li').length);

/* 23. QR 스티커 · 브랜드 화면 · QR 연결 안내 (2026-10-09) */
console.log('\n[23] QR · 브랜드 화면');
nav('#/b/samsung');
doc.querySelectorAll('#app .mcard').length === D.MODELS.filter(m => m.brand === 'samsung').length ? ok('삼성 브랜드 화면: 삼성 기종만') : bad('브랜드 화면 기종 수 ' + doc.querySelectorAll('#app .mcard').length);
doc.querySelectorAll('#app .bchips a').length >= 5 ? ok('브랜드 화면에 다른 브랜드 칩') : bad('브랜드 칩 없음');
nav('#/qr');
doc.querySelectorAll('#app .label').length === D.MODELS.length && doc.querySelectorAll('#app .qrbox[data-url]').length === D.MODELS.length ? ok(`QR 스티커 전체 ${D.MODELS.length}장`) : bad('QR 전체 ' + doc.querySelectorAll('#app .label').length);
nav('#/qr/samsung-3220');
doc.querySelectorAll('#app .label').length === 8 && doc.querySelector('#app .qrbox').dataset.url.endsWith('/m/samsung-3220?src=qr') ? ok('삼성 3220 스티커 8장, 주소 /m/samsung-3220?src=qr') : bad('기종 스티커 ' + doc.querySelectorAll('#app .label').length + ' ' + (doc.querySelector('#app .qrbox') || {}).dataset);
nav('#/m/samsung-3220?src=qr');
doc.querySelector('#app .qrhello') && doc.querySelector('#app .mpage') ? ok('QR 주소로 들어오면 기종 화면 + 연결 안내') : bad('QR 연결 안내 없음');
nav('#/m/samsung-3220');
!doc.querySelector('#app .qrhello') ? ok('일반 주소엔 연결 안내 없음') : bad('일반 주소에 QR 안내');
[...doc.querySelectorAll('#bsheet a, .bsheet a, #app a, #footer a')].some(a => a.getAttribute('href') === '/qr') ? ok('더보기·꼬리말에 QR 스티커 메뉴') : bad('QR 메뉴 없음');

/* 24. 경로 주소(2026-10-09) */
console.log('\n[24] 경로 주소');
nav('/m/samsung-3220/toner');
win.location.pathname === '/m/samsung-3220/toner' && doc.querySelector('#app .player') ? ok('경로 주소로 작업 화면') : bad('경로 주소 ' + win.location.pathname);
![...doc.querySelectorAll('#app a[href], #tabbar a[href], #footer a[href]')].some(a => a.getAttribute('href').startsWith('#/')) ? ok('화면·메뉴·꼬리말에 해시 링크 없음') : bad('해시 링크 남음: ' + [...doc.querySelectorAll('a[href^="#/"]')].slice(0,3).map(a => a.getAttribute('href')).join(','));
doc.querySelector('link[rel="canonical"]').getAttribute('href').endsWith('/m/samsung-3220/toner') ? ok('canonical 이 현재 주소') : bad('canonical ' + doc.querySelector('link[rel="canonical"]').getAttribute('href'));
nav('#/m/samsung-3220/#sec-fix');
win.location.pathname === '/m/samsung-3220' && win.location.hash === '#sec-fix' ? ok('옛 해시 주소 → 경로 + 앵커') : bad('옛 해시 변환 ' + win.location.pathname + win.location.hash);
const toner = doc.querySelector('#app a[href="/m/samsung-3220/toner"]');
if (toner) { toner.dispatchEvent(new win.MouseEvent('click', { bubbles: true, cancelable: true, button: 0 })); }
toner && win.location.pathname === '/m/samsung-3220/toner' ? ok('앱 안 링크 클릭 → pushState 이동') : bad('링크 클릭 이동 안 됨 ' + win.location.pathname);
