/* 공개 주소가 정해지면 한 번 실행하세요.  node scripts/set-domain.mjs https://manual.firstoa.co.kr
 *
 * 하는 일(2026-10-10 점검 뒤 수정):
 *   ① index.html 의 og:url · og:image · canonical 을 새 주소로
 *   ② scripts/prerender.mjs 의 기본 주소(SITE_URL 없을 때)를 새 주소로 — GitHub Actions 가 매일 돌리는 prerender 가
 *      옛 vercel 주소로 canonical·og:url 을 되돌리지 않게
 *   ③ robots.txt 의 Sitemap 줄
 *   ④ node scripts/prerender.mjs 실행 → 정적 페이지 273장 + sitemap.xml 전부 새 주소로
 * 남는 일: vercel.json 에 옛 주소(vercel.app) → 새 주소 301 추가, 서치콘솔·네이버에 새 주소 등록. */
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const url = (process.argv[2] || '').replace(/\/+$/, '');
if (!/^https?:\/\/.+/.test(url)) {
  console.error('주소를 붙여서 실행하세요.  예: node scripts/set-domain.mjs https://manual.firstoa.co.kr');
  process.exit(1);
}
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const edit = (file, fn) => { const p = path.join(ROOT, file); const before = fs.readFileSync(p, 'utf8'); const after = fn(before); if (after !== before) { fs.writeFileSync(p, after); console.log('고침:', file); } else console.log('그대로:', file); };

edit('index.html', s => {
  const set = (re, line) => (re.test(s) ? s.replace(re, line) : s.replace('</head>', line + '\n</head>'));
  s = set(/<meta property="og:url"[^>]*>/, `<meta property="og:url" content="${url}/">`);
  s = set(/<meta property="og:image"[^>]*>/, `<meta property="og:image" content="${url}/assets/img/og.jpg">`);
  s = set(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}/">`);
  return s;
});
edit('scripts/prerender.mjs', s => s.replace(/process\.env\.SITE_URL \|\| 'https?:\/\/[^']+'/, `process.env.SITE_URL || '${url}'`));
edit('robots.txt', s => (/^Sitemap:.*$/m.test(s) ? s.replace(/^Sitemap:.*$/m, `Sitemap: ${url}/sitemap.xml`) : s.trimEnd() + `\nSitemap: ${url}/sitemap.xml\n`));

console.log('정적 페이지·사이트맵 다시 만드는 중…');
execSync('node scripts/prerender.mjs', { cwd: ROOT, stdio: 'inherit' });
console.log(`\n공개 주소를 ${url} 로 바꿨습니다. 남은 일: vercel.json 에 옛 주소 → 새 주소 301, 서치콘솔·네이버 웹마스터에 새 주소 등록, git commit & push.`);
