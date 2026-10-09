/* 오프라인 대비 서비스 워커(2026-10-09).
 * 원칙: 접속되면 항상 서버 것을 먼저 쓴다(HTML·스크립트·데이터는 네트워크 우선 → 옛 화면 고착 없음).
 *       사진·글꼴·유튜브 썸네일은 캐시 우선(바뀌지 않는 파일). 끊기면 저장해 둔 것으로 보여 준다.
 * 버전을 올리면 옛 캐시는 지운다. */
const VERSION = "fm-2026-10-10a";
const SHELL = `${VERSION}-shell`, STATIC = `${VERSION}-static`;
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k)))).then(() => self.clients.claim())));
const isStatic = url => /\/assets\/img\//.test(url.pathname) || /\.(woff2?|png|jpe?g|webp|svg)$/.test(url.pathname);
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.pathname.startsWith("/_vercel/")) return;                       // 통계는 건드리지 않는다
  // 외부(유튜브 썸네일·글꼴 CDN)는 건드리지 않는다 — 서비스 워커가 대신 받으면 보안 정책(connect-src)에 막혀
  // 썸네일이 안 보였다(실사고 2026-10-10). 브라우저가 직접 받게 둔다.
  if (url.origin !== location.origin) return;
  if (isStatic(url)) {
    e.respondWith(caches.open(STATIC).then(async c => { const hit = await c.match(req); if (hit) return hit; const res = await fetch(req); if (res.ok) c.put(req, res.clone()); return res; }));
    return;
  }
  if (url.origin !== location.origin) return;                             // 유튜브 플레이어·외부는 그대로
  // 같은 출처의 화면·스크립트·데이터: 네트워크 우선, 실패하면 캐시(없으면 첫 화면)
  e.respondWith(caches.open(SHELL).then(async c => {
    try { const res = await fetch(req); if (res.ok) c.put(req, res.clone()); return res; }
    catch { return (await c.match(req)) || (req.mode === "navigate" ? (await c.match("/")) : undefined) || Response.error(); }
  }));
});
