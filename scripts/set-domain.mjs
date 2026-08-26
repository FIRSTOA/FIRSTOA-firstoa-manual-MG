/* 공개 주소가 정해지면 한 번 실행하세요. 공유 미리보기(카카오톡·문자)에 쓰는
   절대 주소를 index.html 에 박아 넣습니다. 상대 주소면 미리보기가 안 뜨는 곳이 있습니다.

   사용법:  node scripts/set-domain.mjs https://manual.firstoa.co.kr            */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const url = (process.argv[2] || '').replace(/\/+$/, '');
if (!/^https?:\/\/.+/.test(url)) {
  console.error('주소를 붙여서 실행하세요.  예: node scripts/set-domain.mjs https://manual.firstoa.co.kr');
  process.exit(1);
}
const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const file = path.join(ROOT, 'index.html');
let s = fs.readFileSync(file, 'utf8');

const set = (re, line) => { s = re.test(s) ? s.replace(re, line) : s.replace('</head>', line + '\n</head>'); };
set(/<meta property="og:url"[^>]*>/,    `<meta property="og:url" content="${url}/">`);
set(/<meta property="og:image"[^>]*>/,  `<meta property="og:image" content="${url}/assets/img/og.jpg">`);
set(/<link rel="canonical"[^>]*>/,      `<link rel="canonical" href="${url}/">`);

fs.writeFileSync(file, s);
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'),
`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemap.org/schemas/sitemap/0.9">
  <url><loc>${url}/</loc><changefreq>monthly</changefreq><priority>1.0</priority></url>
</urlset>
`);
console.log(`공개 주소를 ${url} 로 박았습니다.`);
console.log('index.html 의 og:url · og:image · canonical, 그리고 sitemap.xml 갱신됨.');
