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
const nav = (h) => { win.location.hash = h; win.dispatchEvent(new win.Event('hashchange')); };
const junk = s => /undefined|\[object Object\]|NaN|&lt;svg/.test(s);

/* 1. 모든 주소가 그려지는가 */
console.log('\n[1] 화면 그리기');
const routes = ['#/', '#/m/samsung-3220', '#/m/samsung-3220/toner', '#/m/hp-8710/toner',
  '#/fixes', '#/fixes/samsung', '#/fixes/samsung/acr-ctd', '#/fixes/xerox', '#/fixes/xerox/jam', '#/pattern', '#/meter', '#/notices', '#/f/jam', '#/f/acr-ctd', '#/m/samsung-3220/f/jam', '#/m/samsung-3220/f/acr-ctd',
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
const firstIds = D.PRODUCTS.slice(0, 4).map(p => p.id).join(',');
firstIds === 'desktop,laptop,mac,software' ? ok('취급 품목 순서: 데스크탑 → 노트북 → 맥 → 소프트웨어') : bad('취급 품목 순서 어긋남: ' + firstIds);
const staff = D.STATS.find(s => s.label === '전문 인력');
staff && staff.n === '55' ? ok('전문 인력 55명') : bad('전문 인력 수치 ' + (staff && staff.n));
home.includes('55명') ? ok('홈 문구에 55명') : bad('홈 문구에 55명 없음');
// 사진 파일이 실제로 있는지
const imgs = [...doc.querySelectorAll('#app img')].map(i => i.getAttribute('src')).filter(s => s && s.startsWith('assets/'));
const missing = [...new Set(imgs)].filter(p => !fs.existsSync(HOME + '/' + p));
missing.length ? bad('없는 이미지 파일: ' + missing.join(', ')) : ok(`이미지 ${new Set(imgs).size}장 모두 존재`);
// 머리말·꼬리말
const logo = doc.querySelector('.brandmark img.logo');
logo && logo.getAttribute('src').includes('logo-firstoa') ? ok('헤더에 실제 회사 로고') : bad('로고 이미지 없음');
doc.getElementById('navTel')?.innerHTML.includes(D.meta.phone) ? ok('헤더에 대표번호') : bad('헤더 전화번호 없음');
const foot = doc.getElementById('footer').innerHTML;
foot.includes('55명') && !foot.includes('40명') ? ok('꼬리말 문구에 55명') : bad('꼬리말 문구 수치');
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
doc.getElementById('app').textContent.includes('준비') ? ok('내용 없는 항목은 "준비 중"으로 안내') : bad('빈 항목 처리 없음');
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
const mBrands = doc.querySelectorAll('#app .ministeps');
mBrands.length === D.METER.brands.length ? ok(`카운터 안내 ${mBrands.length}개 브랜드`) : bad('카운터 안내 누락');
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
paper && !paper.img ? ok('복사용지는 상표 없는 일러스트') : bad('용지에 특정 상품 사진이 붙어 있음');

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
