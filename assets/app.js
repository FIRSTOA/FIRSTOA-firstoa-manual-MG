/* ============================================================================
   퍼스트전산 복합기 사용설명서 — 화면 로직
   주소(#) 하나로 화면이 갈리는 단일 페이지 구성. 빌드 도구 없이 그대로 돕니다.
   내용은 전부 data/manuals.js 에 있고, 여기서는 그리는 일만 합니다.
   ========================================================================== */
(() => {
  const D = window.FIRSTOA_MANUAL, U = window.UI;
  const app  = document.getElementById("app");
  const ic = (n, s = 24, c = "") => U.icon(n, s, c);

  /* ── 색인 ──────────────────────────────────────────────────────────── */
  const TASK  = Object.fromEntries(D.TASKS.map(t => [t.id, t]));
  const CAT   = Object.fromEntries(D.CATEGORIES.map(c => [c.id, c]));
  const BRAND = Object.fromEntries(D.BRANDS.map(b => [b.id, b]));
  const MODEL = Object.fromEntries(D.MODELS.map(m => [m.id, m]));
  // 마지막으로 본 기종 — 엉뚱한 주소나 빈 검색에서 "그 기종 화면으로 돌아가기"에 쓴다(2026-10-09)
  let lastModel = (() => { try { return sessionStorage.getItem("firstoa.lastModel"); } catch { return null; } })();
  const remember = m => { lastModel = m.id; try { sessionStorage.setItem("firstoa.lastModel", m.id); } catch {} };
  const FIX   = Object.fromEntries((D.FIXES || []).map(f => [f.id, f]));

  // 간단 AS 는 기종마다 따로 쓰지 않고 적용 범위(scope)로 붙인다 — 삼성 6기종에 같은 내용을 여섯 번 쓰지 않는다
  const inScope = (f, m) => !!(f.scope.all || f.scope.brand === m.brand || (f.scope.models || []).includes(m.id));
  const fixesOf = m => (D.FIXES || []).filter(f => inScope(f, m) && fixLiveBrand(f, m.brand));
  // 증상 영상: 브랜드별(videos: { samsung: … })이 있으면 그것, 없으면 공통(video).
  // 글 순서도 영상도 없는 증상은 목록에서 뺀다 — "준비 중" 카드가 고객을 헷갈리게 한다(2026-10-09).
  const fixVidBrand = (f, bid) => (f.videos || {})[bid] || f.video || "";
  const fixVid = (f, m) => fixVidBrand(f, m.brand);
  const fixLiveBrand = (f, bid) => (f.steps || []).length > 0 || !!fixVidBrand(f, bid);
  const fixLiveAny = f => (f.steps || []).length > 0 || !!f.video || Object.values(f.videos || {}).some(Boolean);
  const modelsForFix = f => D.MODELS.filter(m => inScope(f, m) && fixLiveBrand(f, m.brand));
  // 브랜드마다 구조가 달라 증상도 브랜드 단위로 본다
  const fixesForBrand = bid => (D.FIXES || []).filter(f => fixLiveBrand(f, bid) &&
    (f.scope.all || f.scope.brand === bid || (f.scope.models || []).some(id => MODEL[id]?.brand === bid)));
  const brandOwn = bid => (D.FIXES || []).filter(f => fixLiveBrand(f, bid) &&
    (f.scope.brand === bid || (f.scope.models || []).some(id => MODEL[id]?.brand === bid)));

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const tasksOf   = m => D.TASKS.filter(t => t.id in (m.videos || {}));
  const vidOf     = (m, tid) => (m.videos || {})[tid] || "";
  const vidCount  = m => tasksOf(m).filter(t => vidOf(m, t.id)).length;
  const modelsOf  = bid => D.MODELS.filter(m => m.brand === bid);
  const modelsWith= tid => D.MODELS.filter(m => vidOf(m, tid));
  const stepsOf   = (m, t) => (m.steps && m.steps[t.id]) || t.steps;
  const totalVideos = D.MODELS.reduce((n, m) => n + vidCount(m), 0);

  const thumb = (v, big) => `https://i.ytimg.com/vi/${v}/${big ? "maxresdefault" : "mqdefault"}.jpg`;
  const fallback = v => `this.onerror=null;this.src='https://i.ytimg.com/vi/${v}/hqdefault.jpg'`;

  // 기종 그림: 사진이 있으면 사진, 없으면 직접 그린 일러스트
  const artOf = m => m.photo
    ? `<img class="photo" src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy">`
    : U.device(m.device);

  /* ── 부품 ──────────────────────────────────────────────────────────── */
  const crumbs = parts => `<nav class="crumbs" aria-label="위치">${parts.map((p, i) =>
    (i ? '<span class="sep">/</span>' : "") +
    (p.to ? `<a href="#${p.to}">${esc(p.label)}</a>` : `<span class="cur">${esc(p.label)}</span>`)).join("")}</nav>`;

  const modelCard = m => {
    const b = BRAND[m.brand], n = vidCount(m);
    return `<a class="mcard" href="#/m/${m.id}" data-rv>
      <div class="art">${artOf(m)}
        <span class="bdot"><i style="background:${esc(b?.accent || "#888")}"></i>${esc(b?.name || "")}</span>
        ${m.photo ? `<span class="real">실제 제품 사진</span>` : ""}</div>
      <div class="info">
        <b>${esc(m.name)}</b>
        ${m.full ? `<span class="sub">${esc(m.full)}</span>` : ""}
        <div class="meta">
          ${n ? `<span class="badge b-vid">${ic("video", 13)}영상 ${n}편</span>`
              : `<span class="badge b-soon">영상 준비 중</span>`}
          <span>작업 ${tasksOf(m).length}</span>
          <span class="go">${ic("arrow", 18)}</span>
        </div>
      </div></a>`;
  };

  const taskCard = (m, t) => {
    const v = vidOf(m, t.id);
    return `<a class="tcard ${v ? "" : "soon"}" href="#/m/${m.id}/${t.id}" data-rv>
      <div class="thumb">
        ${v ? `<img src="${thumb(v)}" onerror="${fallback(v)}" alt="" loading="lazy">
               <span class="playdot"><i>${ic("play", 20)}</i></span>
               <span class="pin">${ic("clock", 13)}${t.minutes}분</span>`
            : `<span class="ph${t.art ? " art" : ""}">${t.art ? U.device(t.art) : ic(t.icon, 38)}</span>
               <span class="pin">${ic("clock", 13)}${t.minutes}분</span>`}
      </div>
      <div class="body">
        <div class="row1">${ic(t.icon, 19)}<b>${esc(t.title)}</b></div>
        <p>${esc(t.summary)}</p>
        <div class="meta">${v ? `<span class="badge b-vid">${ic("video", 13)}영상</span>`
                               : t.id === "meter" ? `<span class="badge b-gold">기종별 안내</span>`
                               : `<span class="badge b-soon">영상 준비 중</span>`}
          <span>${esc(CAT[t.cat]?.name || "")}</span></div>
      </div></a>`;
  };

  // 간단 AS 카드 — 기종마다 복제하지 않고 적용 범위로 붙인다
  const fixCard = (m, f) => {
    const steps = (f.steps || []).length > 0, v = fixVid(f, m), ready = steps || !!v;
    return `<a class="tcard ${ready ? "" : "soon"}" href="#/m/${m.id}/f/${f.id}" data-rv>
      <div class="thumb">
        ${v ? `<img src="${thumb(v)}" onerror="${fallback(v)}" alt="" loading="lazy">
               <span class="playdot"><i>${ic("play", 20)}</i></span>`
            : `<span class="ph">${ic(f.icon, 38)}</span>`}
        <span class="pin">${ic("clock", 13)}${f.minutes}분</span>
      </div>
      <div class="body">
        <div class="row1">${ic(f.icon, 19)}<b>${esc(f.title)}</b></div>
        <p>${esc(f.summary)}</p>
        <div class="meta">${v ? `<span class="badge b-vid">${ic("video", 13)}영상</span>` : ""}${steps ? `<span class="badge b-gold">직접 해보기</span>`
                                  : v ? "" : `<span class="badge b-soon">내용 준비 중</span>`}
          <span>${f.scope.all ? "전 기종 공통" : esc(BRAND[m.brand]?.name || "") + " 공통"}</span></div>
      </div></a>`;
  };

  const tel = () => (D.meta.phone || "").replace(/[^0-9+]/g, "");

  const band = () => `<section class="section"><div class="band" data-rv>
      <h3>그래도 해결이 안 되시나요?</h3>
      <p>${esc(D.meta.company)} 엔지니어가 바로 도와드립니다. ${esc(D.meta.hours)}</p>
      <div class="row">
        ${tel() ? `<a class="btn light" href="tel:${tel()}">${ic("phone", 19)}전화 ${esc(D.meta.phone)}</a>` : ""}
        ${D.meta.kakao ? `<a class="btn kko" href="${esc(D.meta.kakao)}" target="_blank" rel="noopener">
          ${ic("kakao", 19)}카카오톡 상담</a>` : ""}
      </div></div></section>`;

  // 취급 품목 카드 (홍보) — 사진은 본사 쇼핑몰의 실제 제품 사진
  // 사진이 있으면 사진, 없으면 상표 없는 일러스트(용지처럼 브랜드를 특정하면 안 되는 품목)
  const productCard = p => `<a class="pcard" href="${esc(p.link)}" target="_blank" rel="noopener" data-rv>
      <span class="shot">${p.img ? `<img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">`
                                  : U.device(p.art)}</span>
      <span class="tx"><b>${esc(p.name)}${ic("ext", 15)}</b><p>${esc(p.desc)}</p></span></a>`;

  const packCard = p => `<a class="pcard pack" href="${esc(p.link)}" target="_blank" rel="noopener" data-rv>
      <span class="shot"><img src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">
        <span class="pkbadge">묶음 렌탈</span></span>
      <span class="tx"><b>${esc(p.name)}${ic("ext", 15)}</b><p>${esc(p.desc)}</p></span></a>`;

  // 카카오톡 채널 안내
  const kakaoCard = () => `<div class="kko-card" data-rv>
      <div>
        <span class="kko-badge">${ic("kakao", 16)}카카오톡 채널</span>
        <h3>채널 추가하면 <span style="color:var(--blue)">2배 빠른</span> 상담을 받습니다</h3>
        <p>전화가 어려우실 때, 카카오톡으로 사진 한 장만 보내주셔도 됩니다.
           증상을 미리 보면 담당 엔지니어가 부품을 챙겨 한 번에 해결합니다.</p>
        <div class="why">
          <div>${ic("check", 17)}<span>화면의 오류 코드나 인쇄물을 사진으로 바로 전송</span></div>
          <div>${ic("check", 17)}<span>토너·폐토너통 등 소모품 신청도 채팅으로</span></div>
          <div>${ic("check", 17)}<span>방문 일정 조율과 처리 결과를 기록으로 확인</span></div>
        </div>
      </div>
      <div class="kko-side">
        <a class="btn kko wide" href="${esc(D.meta.kakao)}" target="_blank" rel="noopener">
          ${ic("kakao", 19)}채널 추가하기</a>
        <span class="hint">카카오톡 앱에서 <b>퍼스트전산</b> 을 검색해도 됩니다</span>
      </div>
    </div>`;

  // 유튜브에 새로 올라왔지만 아직 기종 안내에 연결되지 않은 영상 — scripts/fetch-channel.mjs --auto 가 data/new-videos.js 에 채운다
  const newVideos = () => {
    const list = (window.FIRSTOA_NEW_VIDEOS || []).slice(0, 8);
    if (!list.length) return "";
    return `<section class="section" style="padding-top:0">
      <div class="sec-head" data-rv>
        <div><span class="eyebrow">새로 올라온 영상</span>
          <h2 class="h2" style="margin-top:10px">유튜브에 방금 올라왔습니다</h2>
          <p class="lead">기종 안내에 연결되기 전 영상입니다. 지금 바로 보실 수 있습니다.</p></div>
        ${D.meta.channel ? `<a class="more" href="${esc(D.meta.channel)}" target="_blank" rel="noopener">채널 전체 ${ic("ext", 16)}</a>` : ""}
      </div>
      <div class="cards rail">${list.map(v => `<a class="tcard" href="https://www.youtube.com/watch?v=${esc(v.id)}" target="_blank" rel="noopener" data-rv>
        <div class="thumb"><img src="${thumb(v.id)}" onerror="${fallback(v.id)}" alt="" loading="lazy">
          <span class="playdot"><i>${ic("play", 20)}</i></span></div>
        <div class="body"><b>${esc(v.title)}</b>
          <div class="meta"><span class="badge b-vid">${ic("video", 13)}새 영상</span><span>${esc((v.published || "").slice(0, 10))}</span></div></div></a>`).join("")}</div>
    </section>`;
  };

  /* ── 화면: 첫 화면 ─────────────────────────────────────────────────── */
  function viewHome() {
    const quick = [
      { to: "#/t/toner", icon: "toner", label: "토너 교체" },
      { to: "#/t/waste", icon: "waste", label: "폐토너통 교체" },
      { to: "#/f/jam",   icon: "jam",   label: "용지 걸림" },
      { to: "#/f/line-copy", icon: "quality", label: "복사 줄 나옴" },
      { to: "#/pattern", icon: "palette", label: "4색 패턴 출력" },
      { to: "#/meter", icon: "meter", label: "사용량 카운터" },
    ];

    return `
    <section class="hero">
      <div class="hero-in">
        <div>
          <span class="eyebrow on-dark">${esc(D.meta.company)} 고객지원</span>
          <h1 class="display">${D.meta.heroTitle || "복합기,<br><em>직접</em> 해결하세요."}</h1>
          <p class="lead">${esc(D.meta.tagline)}</p>
          <form class="searchbar" onsubmit="return FIRSTOA.go(event)">
            ${ic("search", 21)}
            <input id="q" placeholder="기종명 또는 증상 (예: 3220, 토너, 줄)" autocomplete="off" aria-label="검색">
            <button type="submit">검색</button>
          </form>
          <div class="quick">${quick.map(q =>
            `<a href="${q.to}">${ic(q.icon, 17)}${esc(q.label)}</a>`).join("")}</div>
        </div>
        <div class="hero-art">
          <div class="hero-shot">
            <span class="tagchip"><i></i>엔지니어 직접 촬영</span>
            <img src="assets/img/copier.jpg" alt="복합기" loading="eager">
          </div>
          <span class="hero-float f1">${ic("video", 22)}
            <span><b class="num">${totalVideos}</b><span>편의 작업 영상</span></span></span>
          <span class="hero-float f2">${ic("grid", 22)}
            <span><b class="num">${D.MODELS.length}</b><span>종의 기종 안내</span></span></span>
        </div>
      </div>
    </section>

    <section class="trust">
      <div class="trust-in">${(D.STATS || []).map(st => `<div class="cell">
        <b class="num">${esc(st.n)}<em>${esc(st.unit)}</em></b><span>${esc(st.label)}</span></div>`).join("")}</div>
    </section>

    <div class="container">
      <section class="section">
        <div class="sec-head" data-rv>
          <div><span class="eyebrow">시작하기</span>
            <h2 class="h2" style="margin-top:10px">무엇 때문에 오셨나요?</h2>
            <p class="lead">둘 중 하나만 고르시면 됩니다. 기종을 몰라도 찾아 드립니다.</p></div>
        </div>
        <div class="doors">
          <a class="door d1" href="#/t/toner" data-rv>
            <span class="dbox">${ic("toner", 30)}</span>
            <b>소모품이 떨어졌어요</b>
            <p>토너 · 폐토너통 교체. 엔지니어가 직접 촬영한 영상을 보며 3분이면 끝납니다.</p>
            <span class="dgo">기종 고르기 ${ic("arrow", 18)}</span>
          </a>
          <a class="door d2" href="#/fixes" data-rv>
            <span class="dbox">${ic("error", 30)}</span>
            <b>문제가 생겼어요</b>
            <p>복사할 때 줄이 나오거나, 용지가 걸리거나, 화면에 오류가 뜰 때.</p>
            <span class="dgo">증상 고르기 ${ic("arrow", 18)}</span>
          </a>
        </div>
      </section>

      <section class="section" id="models" style="padding-top:0">
        <div class="sec-head" data-rv>
          <div><span class="eyebrow">기종으로 찾기</span>
            <h2 class="h2" style="margin-top:10px">쓰시는 복합기를 고르세요</h2>
            <p class="lead">기기 앞면 스티커의 번호를 확인하세요. 숫자 몇 자리만 검색해도 찾아집니다.</p></div>
          <button class="more" onclick="FIRSTOA.open()">전체 검색 ${ic("arrow", 17)}</button>
        </div>
        <div class="tabs" role="tablist">
          <button class="tab" role="tab" aria-selected="true" data-brand="">전체 <span class="n num">${D.MODELS.length}</span></button>
          ${D.BRANDS.filter(b => modelsOf(b.id).length).map(b =>
            `<button class="tab" role="tab" aria-selected="false" data-brand="${b.id}" style="--bdot:${esc(b.accent)}">
               <i class="dot"></i>${esc(b.name)} <span class="n num">${modelsOf(b.id).length}</span></button>`).join("")}
        </div>
        <div class="models collapsed" id="modelGrid">${D.MODELS.map(modelCard).join("")}</div>
        <button class="btn ghost wide sm showall" id="showAll" onclick="FIRSTOA.showAll()">기종 ${D.MODELS.length}종 모두 보기 ${ic("chev", 16)}</button>
      </section>

      ${newVideos()}

      <section class="section" style="padding-top:0">${kakaoCard()}</section>

      <section class="section" style="padding-top:0">
        <div class="sec-head" data-rv>
          <div><span class="eyebrow">이용 방법</span>
            <h2 class="h2" style="margin-top:10px">세 단계면 끝납니다</h2></div>
        </div>
        <div class="flow">
          <div class="step" data-rv><b>기종을 찾습니다</b>
            <p>기기 앞면·옆면에 붙은 번호를 확인하세요. 예: <b>3220</b>, <b>C2263</b>.
               숫자 몇 자리만 검색창에 넣어도 됩니다.</p></div>
          <div class="step" data-rv><b>작업을 고릅니다</b>
            <p>토너 교체, 폐토너통, 용지 걸림, 검침 카운터까지. 걸리는 시간이 적혀 있어 미리 가늠할 수 있습니다.</p></div>
          <div class="step" data-rv><b>영상을 따라 합니다</b>
            <p>엔지니어가 직접 촬영한 영상과 순서를 보며 하나씩 눌러 체크하세요. 어디까지 했는지 남습니다.</p></div>
        </div>
      </section>

      <section class="section" id="products" style="padding-top:0">
        <div class="sec-head" data-rv>
          <div><span class="eyebrow gold">${esc(D.meta.legal || D.meta.company)}</span>
            <h2 class="h2" style="margin-top:10px">복합기만 하는 게 아닙니다</h2>
            <p class="lead">${esc(D.meta.oneStop)} — 사무실에 필요한 것은 한 곳에서 해결합니다.
               ${esc(D.meta.trust || "")}</p></div>
          <a class="more" href="#/products">취급 품목 전체 보기 ${ic("arrow", 16)}</a>
        </div>
        <div class="promo rail">${(D.PRODUCTS || []).filter(p => ["desktop", "laptop", "mac", "software", "pc-care", "copier"].includes(p.id)).map(productCard).join("")}</div>
      </section>

      <section class="section" id="packages" style="padding-top:0">
        <div class="sec-head" data-rv>
          <div><span class="eyebrow gold">묶어서 빌리면 더 쌉니다</span>
            <h2 class="h2" style="margin-top:10px">가장 많이 나가는 조합</h2>
            <p class="lead">복합기 하나만 놓고 쓰는 사무실은 드뭅니다.
               함께 쓰는 것을 묶으면 계약도 관리도 한 번에 끝납니다.</p></div>
          <a class="more" href="${esc(D.meta.homepage)}/shop.php?goPage=GoodList&cat_no=3"
             target="_blank" rel="noopener">패키지 전체 ${ic("ext", 16)}</a>
        </div>
        <div class="promo packs rail">${(D.PACKAGES || []).map(packCard).join("")}</div>
      </section>

      ${band()}
    </div>`;
  }

  /* ── 화면: 기종 ────────────────────────────────────────────────────── */
  function viewModel(id) {
    const m = MODEL[id];
    if (!m) return view404();
    remember(m);
    const b = BRAND[m.brand], list = tasksOf(m), fixes = fixesOf(m), n = vidCount(m);
    const sup = list.filter(t => t.cat === "consumable");
    const mng = list.filter(t => t.cat === "manage");
    const secs = [];
    if (sup.length)   secs.push({ id: "sec-consumable", cat: { ...CAT.consumable, desc: sup.map(t => t.title.replace(/ 교체$/, "")).join(" · ") }, html: sup.map(t => taskCard(m, t)).join("") });
    if (fixes.length) secs.push({ id: "sec-fix",        cat: CAT.fix,        html: fixes.map(f => fixCard(m, f)).join("") });
    if (mng.length)   secs.push({ id: "sec-manage", cat: CAT.manage,
      html: mng.map(t => taskCard(m, t)).join("") + `
        <a class="tcard" href="#/pattern" data-rv>
          <div class="thumb"><span class="ph art">${U.device("chart-4c")}</span>
            <span class="pin">${ic("clock", 13)}1분</span></div>
          <div class="body"><div class="row1">${ic("palette", 19)}<b>4색 패턴 출력</b></div>
            <p>인쇄 상태를 한 장으로 점검하는 차트</p>
            <div class="meta"><span class="badge b-gold">바로 출력</span><span>전 기종 공통</span></div></div></a>
        <a class="tcard" href="#/notices" data-rv>
          <div class="thumb"><span class="ph art">${U.device("notice-book")}</span></div>
          <div class="body"><div class="row1">${ic("book", 19)}<b>이용 안내</b></div>
            <p>장마철·겨울철 용지, 방문 원칙, 소모품 신청 시점</p>
            <div class="meta"><span class="badge b-soon">읽을거리</span><span>${(D.NOTICES || []).length}가지</span></div></div></a>` });

    return `<div class="container">
      <div class="phead" style="padding-bottom:0">
        ${crumbs([{ label: "처음", to: "/" }, { label: b?.name || "기종", to: "/#models" }, { label: m.name }])}
      </div>
      <div class="mpage">
        <aside class="msum" data-rv>
          <div class="msum-art">${artOf(m)}</div>
          <div class="msum-tx">
            <span class="eyebrow">${esc(b?.name || "")}</span>
            <h1 class="h1">${esc(m.name)}</h1>
            ${m.full ? `<p class="lead">${esc(m.full)}</p>` : ""}
            <div class="statrow">
              ${n ? `<span class="stat">${ic("video", 16)}영상 ${n}편</span>`
                  : `<span class="stat">${ic("video", 16)}영상 준비 중</span>`}
              <span class="stat">${ic("toner", 16)}소모품 ${sup.length}가지</span>
              <span class="stat">${ic("error", 16)}문제 해결 ${fixes.length}가지</span>
            </div>
          </div>
          <div class="msum-help">
            <b>해결이 안 되시면</b>
            <span class="muted">${esc(D.meta.company)} · ${esc(D.meta.hours)}</span>
            ${tel() ? `<a class="btn wide sm" href="tel:${tel()}">${ic("phone", 17)}전화 ${esc(D.meta.phone)}</a>` : ""}
            ${D.meta.kakao ? `<a class="btn kko wide sm" href="${esc(D.meta.kakao)}" target="_blank" rel="noopener">${ic("kakao", 17)}카카오톡 상담</a>` : ""}
          </div>
        </aside>
        <div class="mbody">
          <p class="lead mintro">필요한 것을 고르면 영상과 순서를 함께 보여드립니다.</p>
          <div class="jump" id="jump">${secs.map((x, i) =>
            `<a href="#/m/${m.id}/#${x.id}" data-sec="${x.id}" class="${i ? "" : "on"}">${ic(x.cat.icon, 16)}${esc(x.cat.name)}</a>`).join("")}</div>
          ${secs.map(x => `<section class="section tight" id="${x.id}">
            <div class="sec-head" data-rv><div>
              <span class="eyebrow">${esc(x.cat.desc)}</span>
              <h2 class="h2" style="margin-top:8px">${esc(x.cat.name)}</h2></div></div>
            <div class="cards">${x.html}</div>
          </section>`).join("")}
        </div>
      </div>
      ${band()}
    </div>`;
  }

  /* ── 화면: 간단 AS 처리 ────────────────────────────────────────────── */
  function viewFix(mid, fid) {
    const m = MODEL[mid], f = FIX[fid];
    if (!m || !f || !inScope(f, m)) return view404();
    remember(m);
    const b = BRAND[m.brand], fv = fixVid(f, m), ov = (f.brands || {})[m.brand] || {};   // 브랜드별 덮어쓰기(2026-10-09)
    const fSteps = ov.steps || f.steps || [], fCautions = ov.cautions || f.cautions || [];
    const ready = fSteps.length > 0;
    const others = fixesOf(m).filter(x => x.id !== fid);
    const myTel = tel();

    return `<div class="container">
      <div class="phead">
        ${crumbs([{ label: "처음", to: "/" }, { label: m.name, to: "/m/" + m.id }, { label: f.title }])}
        <h1 class="h1" style="margin-top:14px; display:flex; align-items:center; gap:12px">
          ${ic(f.icon, 30)}${esc(f.title)}</h1>
        <p class="lead">${esc(f.summary)}</p>
        <div class="statrow">
          <span class="stat">${ic("clock", 16)}약 ${f.minutes}분</span>
          <span class="stat">${ic("grid", 16)}${f.scope.all ? "전 기종 같은 방법" : esc(b?.name || "") + " 공통"}</span>
        </div>
      </div>

      <div class="work" style="margin-top:22px">
        <div>
          ${fv ? `<div class="player" id="player" data-v="${esc(fv)}">
                 <img src="${thumb(fv, true)}" onerror="${fallback(fv)}" alt="">
                 <span class="veil"></span>
                 <button class="go" onclick="FIRSTOA.play()" aria-label="영상 재생"><i>${ic("play", 26)}</i></button>
               </div>` : ""}

          ${ready ? `<div class="panel">
              <div class="panel-h">${ic("book", 19)}<b>따라 하는 순서</b>
                <button class="rst" onclick="FIRSTOA.reset()">처음부터</button></div>
              <div class="progress"><i id="bar"></i></div>
              <div class="pmeta"><span id="pnum" class="num">0 / ${fSteps.length}</span> 단계 · 누르면 체크됩니다</div>
              <ol class="steps" id="steps" data-key="${esc(mid + ".f." + fid)}">
                ${fSteps.map((t, k) => `<li data-k="${k}" tabindex="0" role="button" aria-pressed="false">
                  <span class="mark"><span class="num">${k + 1}</span>${ic("check", 16)}</span>
                  <span class="tx">${esc(t)}</span></li>`).join("")}
              </ol></div>`
            : fv ? `<div class="callout info">
                 <b>${ic("video", 17)}영상대로 따라 하시면 됩니다</b>
                 <p>글로 적은 순서는 준비 중입니다. 영상에서 막히는 부분이 있으면 그 장면을 캡처해 카카오톡으로 보내주세요.</p></div>`
            : `<div class="callout info">
                 <b>${ic("spark", 17)}내용을 준비하고 있습니다</b>
                 <p>이 항목은 담당 엔지니어가 처리 방법을 정리하는 중입니다.
                    지금은 전화나 카카오톡으로 연락 주시면 바로 안내해 드립니다.</p></div>`}

          ${fCautions.length ? `<div class="callout warn" style="margin-top:16px">
            <b>${ic("error", 17)}주의하세요</b>
            <ul>${fCautions.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>` : ""}
        </div>

        <aside class="aside">
          ${others.length ? `<div class="box">
            <b>${esc(m.name)}의 다른 간단 처리</b>
            <div class="links">${others.slice(0, 7).map(x =>
              `<a href="#/m/${m.id}/f/${x.id}">${ic(x.icon, 18)}${esc(x.title)}
                 ${(x.steps || []).length ? "" : `<span class="badge b-soon">준비 중</span>`}
                 <span class="arw">${ic("chev", 16)}</span></a>`).join("")}</div>
          </div>` : ""}
          <div class="box">
            <b>해결이 안 되시면</b>
            <p class="muted" style="margin:-6px 0 14px">${esc(D.meta.company)} · ${esc(D.meta.hours)}</p>
            ${myTel ? `<a class="btn wide sm" href="tel:${myTel}">${ic("phone", 17)}전화 ${esc(D.meta.phone)}</a>` : ""}
            ${D.meta.kakao ? `<a class="btn kko wide sm" style="margin-top:8px"
              href="${esc(D.meta.kakao)}" target="_blank" rel="noopener">${ic("kakao", 17)}카카오톡 상담</a>` : ""}
          </div>
        </aside>
      </div>

      <div class="pagenav">
        <a href="#/m/${m.id}">${ic("grid", 18)}<span><span class="lbl">목록</span><b>${esc(m.name)}</b></span></a>
        <a class="next" href="#/f/${f.id}"><span><span class="lbl">다른 기종</span>
          <b>${esc(f.title)} · ${modelsForFix(f).length}종</b></span>${ic("chev", 18)}</a>
      </div>
      ${band()}
    </div>`;
  }

  /* ── 화면: 간단 AS → 기종 고르기 ──────────────────────────────────── */
  function viewFixPick(fid) {
    const f = FIX[fid];
    if (!f) return view404();
    const list = modelsForFix(f);
    return `<div class="container">
      <div class="phead">
        ${crumbs([{ label: "처음", to: "/" }, { label: f.title }])}
        <h1 class="h1" style="margin-top:14px; display:flex; align-items:center; gap:12px">
          ${ic(f.icon, 30)}${esc(f.title)}</h1>
        <p class="lead">${esc(f.summary)} — 쓰시는 기종을 골라 주세요.</p>
      </div>
      <section class="section tight">
        <div class="models">${list.map(m => {
          const b = BRAND[m.brand];
          return `<a class="mcard" href="#/m/${m.id}/f/${f.id}" data-rv>
            <div class="art">${artOf(m)}
              <span class="bdot"><i style="background:${esc(b?.accent || "#888")}"></i>${esc(b?.name || "")}</span></div>
            <div class="info"><b>${esc(m.name)}</b>
              ${m.full ? `<span class="sub">${esc(m.full)}</span>` : ""}
              <div class="meta"><span class="go">${ic("arrow", 18)}</span></div></div></a>`;
        }).join("")}</div>
      </section>
      ${band()}
    </div>`;
  }

  /* ── 검침 카운터: 기종에 맞는 안내 묶음 + 단추 흐름 (2026-10-09) ────────
   * 영상이 없는 검침 작업 화면에서 METER(사용량 카운터 화면과 같은 자료)의 그 브랜드 묶음 중
   * 기종 번호가 맞는 것만 추려 보여준다. 맞는 게 없으면 브랜드 전체를 보여준다. */
  const mnorm = s => String(s || "").toLowerCase().replace(/[^0-9a-z가-힣]/g, "");
  function meterGroupsFor(m) {
    const all = ((D.METER || {}).brands || []).filter(b => b.brand === m.brand)
      .flatMap(b => (b.groups || []).map(g => ({ ...g, label: b.label })));
    const mine = [m.name.replace(/^\S+\s+/, ""), ...(m.aka || [])].map(mnorm).filter(k => k.length >= 3);
    const hit = all.filter(g => String(g.models || "").split(/[·/,]/).map(mnorm).filter(Boolean)
      .some(k => mine.some(a => a === k || (k.length >= 4 && a.length >= 4 && (k.includes(a) || a.includes(k))))));
    return hit.length ? hit : all;
  }
  // [단추] 이름만 키캡으로 늘어놓는다. 그림으로 그려 봤더니 실제 기기와 단추 자리가 달라 더 헷갈렸다(2026-10-09 사용자) — 글 순서를 바로 아래에 둔다
  const bracketsOf = p => (String(p).match(/\[([^\]]+)\]/g) || []).map(k => k.slice(1, -1));
  const kbdText = t => esc(t).replace(/\[([^\]]+)\]/g, "<kbd>$1</kbd>");   // 문장 속 [단추]를 키 모양으로
  const keyflow = steps => {
    const keys = (steps || []).flatMap(bracketsOf);
    if (!keys.length) return "";
    const arrow = `<i class="karr">${ic("chev", 15)}</i>`;
    return `<div class="keyflow"><span class="klabel">누르는 순서</span>${keys.map(k => `<span class="key">${esc(k)}</span>`).join(arrow)}${arrow}<span class="key end">${ic("kakao", 15)}사진 보내기</span></div>`;
  };
  const meterBlock = (m, groups) => `<div class="panel mpanel">
      <div class="panel-h">${ic("meter", 19)}<b>${esc(m.name)} 카운터 뽑는 법</b></div>
      <div class="mbody">
        <p class="mintro">${groups.length > 1 ? "쓰시는 기종의 방법을 따라 주세요. " : ""}네모 안이 누르는 단추 이름입니다. 마지막에 나온 화면이나 출력물을 사진으로 찍어 카카오톡으로 보내주시면 됩니다.</p>
        ${groups.map(g => `<section class="mgroup">
          <h4 class="mmodels">${esc(g.models || g.label)}</h4>
          ${keyflow(g.steps)}
          <ol class="ministeps">${(g.steps || []).map(t => `<li>${kbdText(t)}</li>`).join("")}</ol>
          ${g.tip ? `<p class="mtip">💡 ${kbdText(g.tip)}</p>` : ""}
          ${g.send ? `<span class="msend">${ic("kakao", 14)}보내주실 것 · ${esc(g.send)} 사진</span>` : ""}
        </section>`).join("")}
        ${D.meta.kakao ? `<a class="btn kko wide" href="${esc(D.meta.kakao)}" target="_blank" rel="noopener">${ic("kakao", 19)}카카오톡으로 사진 보내기</a>` : ""}
      </div>
    </div>`;

  /* ── 화면: 작업 ────────────────────────────────────────────────────── */
  function viewTask(mid, tid) {
    const m = MODEL[mid], t = TASK[tid];
    if (!m || !t) return view404();
    remember(m);
    const b = BRAND[m.brand], v = vidOf(m, tid), note = (m.notes || {})[tid], steps = stepsOf(m, t);
    const siblings = tasksOf(m);
    const i = siblings.findIndex(x => x.id === tid);
    const prev = siblings[i - 1], next = siblings[i + 1];
    const myTel = tel();
    const mg = tid === "meter" && !v ? meterGroupsFor(m) : [];   // 검침은 영상 대신 기종별 카운터 뽑는 법

    return `<div class="container">
      <div class="phead">
        ${crumbs([{ label: "처음", to: "/" }, { label: m.name, to: "/m/" + m.id }, { label: t.title }])}
        <h1 class="h1" style="margin-top:14px; display:flex; align-items:center; gap:12px">
          ${ic(t.icon, 30)}${esc(t.title)}</h1>
        <p class="lead">${esc(m.full || m.name)} · ${esc(t.summary)}</p>
      </div>

      <div class="work" style="margin-top:22px">
        <div>
          ${v ? `<div class="player" id="player" data-v="${esc(v)}">
                   <img src="${thumb(v, true)}" onerror="${fallback(v)}" alt="">
                   <span class="veil"></span>
                   <button class="go" onclick="FIRSTOA.play()" aria-label="영상 재생"><i>${ic("play", 26)}</i></button>
                   <span class="cap">${ic("video", 17)}${esc(t.title)} · ${esc(m.name)}</span>
                 </div>`
               : mg.length ? meterBlock(m, mg)
               : `<div class="noplayer">${ic("video", 34)}<b>영상 준비 중입니다</b>
                   <span>아래 순서를 따라 하시면 됩니다</span></div>
                 <div class="callout warn" style="margin-top:16px">
                   <b>${ic("error", 17)}이 순서는 기종 공통 일반 안내입니다</b>
                   <p style="margin:0; font-size:14.5px; line-height:1.6">기기마다 위치와 방법이 다를 수 있습니다.
                   화면과 다르거나 확실하지 않으면 무리하지 마시고 전화 주세요.</p></div>`}

          ${note ? `<div class="callout info" style="margin-top:16px">
                      <b>${ic("spark", 17)}이 기종은 이렇습니다</b><p>${esc(note)}</p></div>` : ""}

          ${mg.length ? "" : `<div class="panel" style="margin-top:18px">
            <div class="panel-h">${ic("book", 19)}<b>따라 하는 순서</b>
              <button class="rst" onclick="FIRSTOA.reset()">처음부터</button></div>
            <div class="progress"><i id="bar"></i></div>
            <div class="pmeta"><span id="pnum" class="num">0 / ${steps.length}</span> 단계 · 누르면 체크됩니다</div>
            <ol class="steps" id="steps" data-key="${esc(mid + "." + tid)}">
              ${steps.map((s, k) => `<li data-k="${k}" tabindex="0" role="button" aria-pressed="false">
                <span class="mark"><span class="num">${k + 1}</span>${ic("check", 16)}</span>
                <span class="tx">${esc(s)}</span></li>`).join("")}
            </ol>
          </div>`}

          ${t.cautions?.length ? `<div class="callout warn" style="margin-top:16px">
            <b>${ic("error", 17)}주의하세요</b>
            <ul>${t.cautions.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>` : ""}
        </div>

        <aside class="aside">
          <div class="box">
            <b>이 작업</b>
            <div class="statrow" style="margin-top:0">
              <span class="stat">${ic("clock", 16)}약 ${t.minutes}분</span>
              <span class="stat">${ic(CAT[t.cat]?.icon || "book", 16)}${esc(CAT[t.cat]?.name || "")}</span>
            </div>
          </div>
          ${siblings.length > 1 ? `<div class="box">
            <b>${esc(m.name)}의 다른 작업</b>
            <div class="links">${siblings.filter(x => x.id !== tid).slice(0, 7).map(x =>
              `<a href="#/m/${m.id}/${x.id}">${ic(x.icon, 18)}${esc(x.title)}
                 ${vidOf(m, x.id) ? "" : `<span class="badge b-soon">준비 중</span>`}
                 <span class="arw">${ic("chev", 16)}</span></a>`).join("")}</div>
          </div>` : ""}
          <div class="box">
            <b>도움이 필요하세요?</b>
            <p class="muted" style="margin:-6px 0 14px">${esc(D.meta.company)} · ${esc(D.meta.hours)}</p>
            ${myTel ? `<a class="btn wide sm" href="tel:${myTel}">${ic("phone", 17)}전화 ${esc(D.meta.phone)}</a>` : ""}
            ${D.meta.kakao ? `<a class="btn kko wide sm" style="margin-top:8px"
              href="${esc(D.meta.kakao)}" target="_blank" rel="noopener">${ic("kakao", 17)}카카오톡 상담</a>` : ""}
            <button class="btn ghost wide sm" style="margin-top:8px" onclick="window.print()">${ic("printer", 17)}순서 인쇄</button>
          </div>
        </aside>
      </div>

      <div class="pagenav">
        ${prev ? `<a href="#/m/${m.id}/${prev.id}">${ic("chev", 18, "flip")}
            <span><span class="lbl">이전</span><b>${esc(prev.title)}</b></span></a>`
          : `<a href="#/m/${m.id}">${ic("grid", 18)}<span><span class="lbl">목록</span><b>${esc(m.name)}</b></span></a>`}
        ${next ? `<a class="next" href="#/m/${m.id}/${next.id}">
            <span><span class="lbl">다음</span><b>${esc(next.title)}</b></span>${ic("chev", 18)}</a>`
          : `<a class="next" href="#/m/${m.id}"><span><span class="lbl">돌아가기</span>
            <b>${esc(b?.name || "")} 전체 작업</b></span>${ic("chev", 18)}</a>`}
      </div>

      ${band()}
    </div>`;
  }

  /* ── 화면: 작업 → 기종 고르기 ──────────────────────────────────────── */
  function viewPick(tid) {
    const t = TASK[tid];
    if (!t) return view404();
    const has = modelsWith(tid);
    const soon = D.MODELS.filter(m => (tid in (m.videos || {})) && !vidOf(m, tid));
    const grid = list => `<div class="models">${list.map(m => {
      const b = BRAND[m.brand];
      return `<a class="mcard" href="#/m/${m.id}/${tid}" data-rv>
        <div class="art">${vidOf(m, tid)
          ? `<img class="photo" src="${thumb(vidOf(m, tid))}" onerror="${fallback(vidOf(m, tid))}" alt="" loading="lazy">`
          : artOf(m)}
          <span class="bdot"><i style="background:${esc(b?.accent || "#888")}"></i>${esc(b?.name || "")}</span></div>
        <div class="info"><b>${esc(m.name)}</b>
          ${m.full ? `<span class="sub">${esc(m.full)}</span>` : ""}
          <div class="meta">${vidOf(m, tid) ? `<span class="badge b-vid">${ic("video", 13)}영상</span>`
                                            : `<span class="badge b-soon">순서 안내</span>`}
            <span class="go">${ic("arrow", 18)}</span></div></div></a>`;
    }).join("")}</div>`;

    return `<div class="container">
      <div class="phead">
        ${crumbs([{ label: "처음", to: "/" }, { label: t.title }])}
        <h1 class="h1" style="margin-top:14px; display:flex; align-items:center; gap:12px">
          ${ic(t.icon, 30)}${esc(t.title)}</h1>
        <p class="lead">${esc(t.summary)} — 쓰시는 기종을 골라 주세요.</p>
      </div>
      ${has.length ? `<section class="section tight">
        <div class="sec-head" data-rv><div><span class="eyebrow">영상 있는 기종</span>
          <h2 class="h2" style="margin-top:8px">${has.length}종</h2></div></div>${grid(has)}</section>` : ""}
      ${soon.length ? `<section class="section tight">
        <div class="sec-head" data-rv><div><span class="eyebrow">영상 준비 중</span>
          <h2 class="h2" style="margin-top:8px">글 순서는 지금도 보실 수 있습니다</h2></div></div>${grid(soon)}</section>` : ""}
      ${band()}
    </div>`;
  }

  /* ── 화면: 4색 패턴 출력 ──────────────────────────────────────────── */
  const INKHEX = { K: "#000000", C: "#00AEEF", M: "#EC008C", Y: "#FFF200" };

  function viewPattern() {
    const pages = [
      ...CHART.INKS.map(k => ({ id: k, kind: "full", title: CHART.NAME[k] + " 전면",
        desc: k === "K" ? "드럼·정착기 자국과 세로줄이 가장 잘 드러납니다"
            : k === "C" ? "파랑 계열 얼룩과 농도 차이를 봅니다"
            : k === "M" ? "빨강 계열 얼룩과 농도 차이를 봅니다"
            : "노랑은 옅어서 흐린 얼룩까지 드러납니다" })),
      { id: "chart", kind: "chart", title: "종합 점검 차트",
        desc: "원색·농도·회색 균형·가는 선·글자·확인란이 한 장에" },
    ];

    return `<div class="container">
      <div class="phead">
        ${crumbs([{ label: "처음", to: "/" }, { label: "4색 패턴 출력" }])}
        <h1 class="h1" style="margin-top:14px; display:flex; align-items:center; gap:12px">
          ${ic("palette", 30)}4색 패턴 출력</h1>
        <p class="lead">각 색을 A4 한 장씩 꽉 채워 뽑습니다. 색이 넓게 깔려야
           줄·얼룩·반복 자국이 드러납니다. 종합 차트까지 모두 <b>5장</b>입니다.</p>
        <div class="statrow">
          <button class="btn" onclick="FIRSTOA.printChart('all')">${ic("printer", 19)}5장 전부 출력</button>
          <button class="btn ghost sm" onclick="FIRSTOA.printChart('chart')">${ic("book", 17)}종합 차트만</button>
        </div>
      </div>

      <section class="section tight">
        <div class="callout warn" data-rv>
          <b>${ic("error", 17)}뽑기 전에</b>
          <ul>
            <li><b>컬러</b>로, <b>A4 한 장씩</b> 설정해 주세요. 흑백 기종은 검정 한 장만 뽑으시면 됩니다.</li>
            <li>전면 출력은 토너를 꽤 씁니다. 증상이 있을 때만 뽑아 주세요.</li>
            <li>이상이 보이면 <b>그 종이를 사진으로 찍어</b> 카카오톡으로 보내주세요.</li>
          </ul>
        </div>
      </section>

      <section class="section tight">
        <div class="sec-head" data-rv><div><span class="eyebrow">한 장씩 뽑기</span>
          <h2 class="h2" style="margin-top:8px">필요한 장만 골라 출력</h2></div></div>
        <div class="inklist" data-rv>${pages.map(p => `
          <button class="inkrow" onclick="FIRSTOA.printChart('${p.id}')">
            <span class="swatch ${p.kind}" ${p.kind === "full"
              ? `style="background:${INKHEX[p.id]}"` : ""}>${p.kind === "chart" ? ic("palette", 15) : ""}</span>
            <span class="itx"><b>${esc(p.title)}</b><span>${esc(p.desc)}</span></span>
            <span class="ibtn">${ic("printer", 17)}<span>출력</span></span>
          </button>`).join("")}
        </div>
      </section>

      <section class="section tight">
        <details class="peek" data-rv>
          <summary>${ic("book", 17)}종합 차트 미리 보기</summary>
          <div class="peekbox">${CHART.chartSVG(D.meta.company)}</div>
        </details>
      </section>

      <section class="section tight">
        <div class="callout info" data-rv>
          <b>${ic("spark", 17)}무엇을 보면 되나요</b>
          <p><b>세로줄</b> — 종이가 나오는 방향으로 길게 난 줄. 유리면이나 드럼 쪽입니다.<br>
             <b>가로 띠</b> — 일정한 간격으로 반복되면 롤러나 정착기 쪽입니다.<br>
             <b>얼룩·농도 차이</b> — 한쪽만 옅으면 토너가 한쪽으로 몰렸거나 드럼 수명입니다.<br>
             <b>색이 안 나옴</b> — 그 색 토너·드럼을 먼저 확인합니다.</p>
        </div>
      </section>

      ${band()}
    </div>`;
  }

  /* ── 화면: 사용량 카운터 ──────────────────────────────────────────── */
  function viewMeter() {
    const M = D.META_ = D.METER;
    return `<div class="container">
      <div class="phead">
        ${crumbs([{ label: "처음", to: "/" }, { label: "사용량 카운터" }])}
        <h1 class="h1" style="margin-top:14px; display:flex; align-items:center; gap:12px">
          ${ic("meter", 30)}사용량 카운터 확인</h1>
        <p class="lead">${esc(M.why)}</p>
      </div>

      <section class="section tight">
        <div class="kko-card" data-rv>
          <div>
            <span class="kko-badge">${ic("kakao", 16)}가장 쉬운 방법</span>
            <h3>화면을 사진으로 찍어 보내주세요</h3>
            <p>${esc(M.best)}</p>
          </div>
          <div class="kko-side">
            ${D.meta.kakao ? `<a class="btn kko wide" href="${esc(D.meta.kakao)}" target="_blank" rel="noopener">
              ${ic("kakao", 19)}카카오톡으로 보내기</a>` : ""}
            <span class="hint">기종과 함께 보내주시면 더 빠릅니다</span>
          </div>
        </div>
      </section>

      <section class="section tight">
        <div class="sec-head" data-rv><div><span class="eyebrow">브랜드 · 기종별</span>
          <h2 class="h2" style="margin-top:8px">화면에서 찾는 법</h2>
          <p class="lead">쓰시는 복합기 제조사와 기종을 찾으세요. 기종명은 기기 앞면 라벨에 있습니다.</p></div></div>
        <div class="cards">${M.brands.map(b => {
          const br = BRAND[b.brand];
          const groups = b.groups || [{ models: "", steps: b.steps || [], tip: b.alt || "" }];
          return `<div class="mcard" style="cursor:default" data-rv>
            <div class="info" style="padding:20px">
              <div style="display:flex; align-items:center; gap:9px; margin-bottom:12px">
                <i style="width:9px;height:9px;border-radius:50%;background:${esc(br?.accent || "#888")};flex:none"></i>
                <b style="font-size:17px">${esc(b.label)}</b></div>
              ${groups.map(g => `<div class="mgroup">
                ${g.models ? `<span class="mmodels">${esc(g.models)}</span>` : ""}
                <ol class="ministeps">${(g.steps || []).map(t => `<li>${kbdText(t)}</li>`).join("")}</ol>
                ${g.tip ? `<p class="mtip">${kbdText(g.tip)}</p>` : ""}
                ${g.send ? `<span class="msend">${ic("kakao", 14)}보내주실 것 · ${esc(g.send)} 사진</span>` : ""}
              </div>`).join("")}
            </div></div>`;
        }).join("")}</div>
      </section>

      <section class="section tight">
        <div class="callout warn" data-rv>
          <b>${ic("error", 17)}알아두세요</b>
          <ul>${M.cautions.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>
      </section>
      ${band()}
    </div>`;
  }

  /* ── 화면: 취급 품목 (2026-10-09: 홈 안쪽 구역이 아니라 개별 화면) ─────── */
  function viewProducts() {
    const all = D.PRODUCTS || [], byId = Object.fromEntries(all.map(p => [p.id, p]));
    const groups = (D.PRODUCT_GROUPS || []).map(g => ({ ...g, items: g.ids.map(id => byId[id]).filter(Boolean) })).filter(g => g.items.length);
    const used = new Set(groups.flatMap(g => g.ids));
    const rest = all.filter(p => !used.has(p.id));
    if (rest.length) groups.push({ id: "etc", name: "그 밖에", desc: rest.map(p => p.name).join(" · "), icon: "box", items: rest });
    return `<div class="container">
      <div class="phead">
        ${crumbs([{ label: "처음", to: "/" }, { label: "취급 품목" }])}
        <span class="eyebrow gold">${esc(D.meta.legal || D.meta.company)}</span>
        <h1 class="h1" style="margin-top:10px">복합기만 하는 게 아닙니다</h1>
        <p class="lead">${esc(D.meta.oneStop)} — 사무실에 필요한 것은 한 곳에서 해결합니다. ${esc(D.meta.trust || "")}</p>
        <div class="jump" id="jump">${groups.map((g, i) =>
          `<a href="#/products/#grp-${g.id}" data-sec="grp-${g.id}" class="${i ? "" : "on"}">${ic(g.icon || "box", 16)}${esc(g.name)}</a>`).join("")}</div>
      </div>
      <div class="pgroups">
        ${groups.map(g => `<section class="section tight" id="grp-${g.id}">
          <div class="sec-head" data-rv><div><span class="eyebrow">${esc(g.desc || "")}</span>
            <h2 class="h2" style="margin-top:8px">${esc(g.name)}</h2></div></div>
          <div class="promo">${g.items.map(productCard).join("")}</div>
        </section>`).join("")}
      </div>
      ${(D.PACKAGES || []).length ? `<section class="section tight" id="grp-packages">
        <div class="sec-head" data-rv><div><span class="eyebrow gold">묶어서 빌리면 더 쌉니다</span>
          <h2 class="h2" style="margin-top:8px">가장 많이 나가는 조합</h2></div></div>
        <div class="promo">${D.PACKAGES.map(packCard).join("")}</div>
      </section>` : ""}
      <section class="section tight">
        <div class="callout info" data-rv>
          <b>${ic("spark", 17)}여기 없는 것도 물어보세요</b>
          <p>사무실에 필요한 것은 대부분 구해 드립니다. 본사 쇼핑몰에서 전체 품목과 가격을 보실 수 있고,
             카카오톡으로 물어보시면 담당자가 맞는 구성을 제안해 드립니다.</p>
          <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:12px">
            <a class="btn sm" href="${esc(D.meta.homepage)}" target="_blank" rel="noopener">본사 쇼핑몰 ${ic("ext", 15)}</a>
            ${D.meta.kakao ? `<a class="btn kko sm" href="${esc(D.meta.kakao)}" target="_blank" rel="noopener">${ic("kakao", 16)}카카오톡 상담</a>` : ""}
          </div>
        </div>
      </section>
      ${band()}
    </div>`;
  }

  /* ── 화면: 이용 안내 (관리 · 검침) ────────────────────────────────── */
  function viewNotices() {
    return `<div class="container">
      <div class="phead">
        ${crumbs([{ label: "처음", to: "/" }, { label: "이용 안내" }])}
        <h1 class="h1" style="margin-top:14px">알아두시면 편한 것들</h1>
        <p class="lead">고장이 아닌데 고장처럼 보이는 것, 그리고 미리 아시면 서로 편한 것들을 모았습니다.</p>
      </div>
      <section class="section tight">
        <div class="notices">${(D.NOTICES || []).map(n => `<article class="notice" data-rv>
          <div class="nhead">
            <span class="nbox">${ic(n.icon, 22)}</span>
            <div><span class="ntag">${esc(n.tag)}</span>
              <b>${esc(n.title)}</b>
              <span class="nlead">${esc(n.lead)}</span></div>
          </div>
          <ul class="nbody">${n.body.map(t => `<li>${esc(t)}</li>`).join("")}</ul>
          ${n.tip ? `<p class="ntip">${ic("spark", 15)}${esc(n.tip)}</p>` : ""}
        </article>`).join("")}</div>
      </section>
      ${band()}
    </div>`;
  }

  /* ── 화면: 증상 목록 (문제가 생겼어요) ───────────────────────────── */
  function viewFixes() {
    const brands = D.BRANDS.filter(b => modelsOf(b.id).length);
    return `<div class="container">
      <div class="phead">
        ${crumbs([{ label: "처음", to: "/" }, { label: "자주 생기는 문제" }])}
        <h1 class="h1" style="margin-top:14px">어느 회사 복합기인가요?</h1>
        <p class="lead">브랜드마다 화면 구성과 커버 여는 방식이 달라, 처리 방법도 다릅니다.
           쓰시는 복합기 제조사를 먼저 골라 주세요.</p>
      </div>
      <section class="section tight">
        <div class="models">${brands.map(b => {
          const own = brandOwn(b.id).length, all = fixesForBrand(b.id).length;
          const rep = D.MODELS.find(m => m.brand === b.id && m.photo);
          return `<a class="mcard" href="#/fixes/${b.id}" data-rv>
            <div class="art">${rep ? `<img class="photo" src="${esc(rep.photo)}" alt="" loading="lazy">`
                                   : U.device("floor-color")}
              <span class="bdot"><i style="background:${esc(b.accent)}"></i>${esc(b.name)}</span></div>
            <div class="info"><b>${esc(b.name)}</b>
              <span class="sub">${esc(b.full)}</span>
              <div class="meta">
                <span class="badge b-gold">증상 ${all}가지</span>
                <span>기종 ${modelsOf(b.id).length}종</span>
                <span class="go">${ic("arrow", 18)}</span></div></div></a>`;
        }).join("")}</div>
      </section>
      <section class="section tight">
        <div class="callout info" data-rv>
          <b>${ic("spark", 17)}브랜드를 모르시겠으면</b>
          <p>기기 앞면에 붙은 제조사 표시(SAMSUNG · Sindoh · FUJIFILM/XEROX · KYOCERA · brother · OKI)를
             확인하시거나, <a href="#/#models" style="color:inherit; text-decoration:underline">기종 전체</a>에서
             모델 번호로 찾으셔도 됩니다.</p>
        </div>
      </section>
      ${band()}
    </div>`;
  }

  /* ── 화면: 브랜드별 증상 목록 ─────────────────────────────────────── */
  function viewFixesBrand(bid) {
    const b = BRAND[bid];
    if (!b) return view404();
    const own = brandOwn(bid), common = (D.FIXES || []).filter(f => f.scope.all && fixLiveBrand(f, bid));
    const tile = f => {
      const ready = (f.steps || []).length > 0, fv = fixVidBrand(f, bid);
      return `<a class="tile" href="#/fixes/${bid}/${f.id}" data-rv>
        <span class="box">${ic(f.icon, 24)}</span>
        <b>${esc(f.title)}</b><p>${esc(f.summary)}</p>
        <span class="foot">${ready || fv ? `${ic(fv ? "video" : "clock", 14)}${fv ? "영상 · " : ""}약 ${f.minutes}분`
                                   : `${ic("spark", 14)}내용 준비 중`}</span></a>`;
    };
    return `<div class="container">
      <div class="phead">
        ${crumbs([{ label: "처음", to: "/" }, { label: "자주 생기는 문제", to: "/fixes" }, { label: b.name }])}
        <h1 class="h1" style="margin-top:14px; display:flex; align-items:center; gap:12px">
          <i style="width:12px;height:12px;border-radius:50%;background:${esc(b.accent)};flex:none"></i>
          ${esc(b.name)} 복합기</h1>
        <p class="lead">${esc(b.full)} · 어떤 증상인지 고르시면 처리 순서를 보여드립니다.</p>
      </div>
      ${own.length ? `<section class="section tight">
        <div class="sec-head" data-rv><div><span class="eyebrow">${esc(b.name)} 전용</span>
          <h2 class="h2" style="margin-top:8px">이 브랜드에서 생기는 증상</h2>
          <p class="lead">화면 구성과 부품이 달라 ${esc(b.name)} 기종에만 해당합니다.</p></div></div>
        <div class="tiles">${own.map(tile).join("")}</div></section>` : `
      <section class="section tight"><div class="callout info" data-rv>
        <b>${ic("spark", 17)}${esc(b.name)} 전용 항목을 준비하고 있습니다</b>
        <p>지금은 전 기종 공통 항목만 있습니다. ${esc(b.name)} 기종에서 자주 생기는 증상은
           엔지니어가 정리하는 대로 이 자리에 올라갑니다.</p></div></section>`}
      ${common.length ? `<section class="section tight">
        <div class="sec-head" data-rv><div><span class="eyebrow">전 기종 공통</span>
          <h2 class="h2" style="margin-top:8px">어느 복합기든 방법이 같습니다</h2></div></div>
        <div class="tiles">${common.map(tile).join("")}</div></section>` : ""}
      <section class="section tight">
        <div class="sec-head" data-rv><div><span class="eyebrow">${esc(b.name)} 기종</span>
          <h2 class="h2" style="margin-top:8px">기종을 골라 소모품 교체도 보기</h2></div></div>
        <div class="models">${modelsOf(bid).map(modelCard).join("")}</div>
      </section>
      ${band()}
    </div>`;
  }

  /* ── 화면: 브랜드 단위 증상 상세 ──────────────────────────────────── */
  function viewFixBrand(bid, fid) {
    const b = BRAND[bid], f = FIX[fid];
    if (!b || !f) return view404();
    const fv = fixVidBrand(f, bid), ov = (f.brands || {})[bid] || {};
    const fSteps = ov.steps || f.steps || [], fCautions = ov.cautions || f.cautions || [];
    const ready = fSteps.length > 0;
    const others = fixesForBrand(bid).filter(x => x.id !== fid);
    const models = modelsOf(bid);
    const myTel = tel();

    return `<div class="container">
      <div class="phead">
        ${crumbs([{ label: "처음", to: "/" }, { label: "자주 생기는 문제", to: "/fixes" },
                  { label: b.name, to: "/fixes/" + bid }, { label: f.title }])}
        <h1 class="h1" style="margin-top:14px; display:flex; align-items:center; gap:12px">
          ${ic(f.icon, 30)}${esc(f.title)}</h1>
        <p class="lead">${esc(b.name)} 복합기 · ${esc(f.summary)}</p>
        <div class="statrow">
          <span class="stat">${ic("clock", 16)}약 ${f.minutes}분</span>
          <span class="stat">${ic("grid", 16)}${f.scope.all ? "전 기종 같은 방법" : esc(b.name) + " 전용"}</span>
        </div>
      </div>

      <div class="work" style="margin-top:22px">
        <div>
          ${fv ? `<div class="player" id="player" data-v="${esc(fv)}">
                 <img src="${thumb(fv, true)}" onerror="${fallback(fv)}" alt="">
                 <span class="veil"></span>
                 <button class="go" onclick="FIRSTOA.play()" aria-label="영상 재생"><i>${ic("play", 26)}</i></button>
               </div>` : ""}
          ${ready ? `<div class="panel">
              <div class="panel-h">${ic("book", 19)}<b>따라 하는 순서</b>
                <button class="rst" onclick="FIRSTOA.reset()">처음부터</button></div>
              <div class="progress"><i id="bar"></i></div>
              <div class="pmeta"><span id="pnum" class="num">0 / ${fSteps.length}</span> 단계 · 누르면 체크됩니다</div>
              <ol class="steps" id="steps" data-key="${esc(bid + ".f." + fid)}">
                ${fSteps.map((t, k) => `<li data-k="${k}" tabindex="0" role="button" aria-pressed="false">
                  <span class="mark"><span class="num">${k + 1}</span>${ic("check", 16)}</span>
                  <span class="tx">${esc(t)}</span></li>`).join("")}
              </ol></div>`
            : fv ? `<div class="callout info">
                 <b>${ic("video", 17)}영상대로 따라 하시면 됩니다</b>
                 <p>글로 적은 순서는 준비 중입니다. 영상에서 막히는 부분이 있으면 그 장면을 캡처해 카카오톡으로 보내주세요.</p></div>`
            : `<div class="callout info">
                 <b>${ic("spark", 17)}내용을 준비하고 있습니다</b>
                 <p>이 항목은 담당 엔지니어가 처리 방법을 정리하는 중입니다.
                    지금은 전화나 카카오톡으로 연락 주시면 바로 안내해 드립니다.</p></div>`}
          ${fCautions.length ? `<div class="callout warn" style="margin-top:16px">
            <b>${ic("error", 17)}주의하세요</b>
            <ul>${fCautions.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>` : ""}
        </div>

        <aside class="aside">
          ${others.length ? `<div class="box">
            <b>${esc(b.name)}의 다른 증상</b>
            <div class="links">${others.slice(0, 8).map(x =>
              `<a href="#/fixes/${bid}/${x.id}">${ic(x.icon, 18)}${esc(x.title)}
                 ${(x.steps || []).length ? "" : `<span class="badge b-soon">준비 중</span>`}
                 <span class="arw">${ic("chev", 16)}</span></a>`).join("")}</div></div>` : ""}
          <div class="box">
            <b>기종별로 보기</b>
            <p class="muted" style="margin:-6px 0 12px">소모품 교체 영상까지 함께 보시려면</p>
            <div class="links">${models.slice(0, 6).map(m =>
              `<a href="#/m/${m.id}/f/${fid}">${ic("grid", 18)}${esc(m.name)}
                 <span class="arw">${ic("chev", 16)}</span></a>`).join("")}</div>
          </div>
          <div class="box">
            <b>해결이 안 되시면</b>
            <p class="muted" style="margin:-6px 0 14px">${esc(D.meta.company)} · ${esc(D.meta.hours)}</p>
            ${myTel ? `<a class="btn wide sm" href="tel:${myTel}">${ic("phone", 17)}전화 ${esc(D.meta.phone)}</a>` : ""}
            ${D.meta.kakao ? `<a class="btn kko wide sm" style="margin-top:8px"
              href="${esc(D.meta.kakao)}" target="_blank" rel="noopener">${ic("kakao", 17)}카카오톡 상담</a>` : ""}
          </div>
        </aside>
      </div>
      ${band()}
    </div>`;
  }

  /* ── 검색 ──────────────────────────────────────────────────────────── */
  function find(q) {
    const k = q.trim().toLowerCase();
    if (!k) return { models: [], tasks: [], fixes: [] };
    const hit = s => String(s).toLowerCase().includes(k);
    return {
      models: D.MODELS.filter(m => hit(m.name) || (m.aka || []).some(hit) ||
        hit(BRAND[m.brand]?.name || "") || hit(BRAND[m.brand]?.full || "")),
      tasks: D.TASKS.filter(t => hit(t.title) || hit(t.summary) || hit(CAT[t.cat]?.name || "") ||
        (t.steps || []).some(hit) || (t.cautions || []).some(hit)),
      fixes: (D.FIXES || []).filter(f => fixLiveAny(f) && (hit(f.title) || hit(f.summary) ||
        (f.steps || []).some(hit) || (f.cautions || []).some(hit))),
    };
  }

  function viewSearch(q) {
    const { models, tasks, fixes } = find(q);
    if (!models.length && !tasks.length && !fixes.length) return `<div class="container"><div class="empty">
      ${ic("search", 44)}<b>“${esc(q)}” 결과가 없습니다</b>
      <p>모델명 숫자 몇 자리(예: 3220)나 증상(예: 줄, 걸림)으로 다시 찾아보세요.</p>
      ${backBtns()}</div>${band()}</div>`;

    return `<div class="container">
      <div class="phead">${crumbs([{ label: "처음", to: "/" }, { label: "검색" }])}
        <h1 class="h1" style="margin-top:14px">“${esc(q)}” 검색 결과</h1>
        <p class="lead">기종 ${models.length}종 · 소모품 ${tasks.length}가지 · 증상 ${fixes.length}가지</p></div>
      ${models.length ? `<section class="section tight">
        <div class="sec-head" data-rv><div><span class="eyebrow">기종</span>
          <h2 class="h2" style="margin-top:8px">${models.length}종</h2></div></div>
        <div class="models">${models.map(modelCard).join("")}</div></section>` : ""}
      ${fixes.length ? `<section class="section tight">
        <div class="sec-head" data-rv><div><span class="eyebrow">증상</span>
          <h2 class="h2" style="margin-top:8px">${fixes.length}가지</h2></div></div>
        <div class="tiles">${fixes.map(f => `<a class="tile" href="#/f/${f.id}" data-rv>
          <span class="box">${ic(f.icon, 24)}</span><b>${esc(f.title)}</b><p>${esc(f.summary)}</p>
          <span class="foot">${ic("clock", 14)}약 ${f.minutes}분</span></a>`).join("")}</div></section>` : ""}
      ${tasks.length ? `<section class="section tight">
        <div class="sec-head" data-rv><div><span class="eyebrow">소모품</span>
          <h2 class="h2" style="margin-top:8px">${tasks.length}가지</h2></div></div>
        <div class="tiles">${tasks.map(t => `<a class="tile" href="#/t/${t.id}" data-rv>
          <span class="box">${ic(t.icon, 24)}</span><b>${esc(t.title)}</b><p>${esc(t.summary)}</p>
          <span class="foot">${ic("video", 14)}영상 ${modelsWith(t.id).length}종</span></a>`).join("")}</div></section>` : ""}
      ${band()}</div>`;
  }

  // 마지막으로 보던 기종이 있으면 그 화면으로 돌아가는 단추를 먼저(2026-10-09: 기종 탭에서 길을 잃고 홈으로 가던 것)
  const backBtns = () => { const m = lastModel && MODEL[lastModel];
    return `<div class="btns">${m ? `<a class="btn" href="#/m/${m.id}">${ic("grid", 17)}${esc(m.name)} 화면으로 돌아가기</a>` : ""}
      <a class="btn ${m ? "ghost" : ""}" href="#/">처음으로</a></div>`; };
  const view404 = () => { return `<div class="container"><div class="empty">
    ${ic("search", 44)}<b>찾는 쪽이 없습니다</b><p>주소가 바뀌었을 수 있습니다.</p>
    ${backBtns()}</div></div>`; };

  /* ── 단계 체크 (기기별로 브라우저에 기억) ──────────────────────────── */
  const KEY = k => "firstoa.steps." + k;
  const readDone = k => { try { return new Set(JSON.parse(localStorage.getItem(KEY(k)) || "[]")); } catch { return new Set(); } };
  const saveDone = (k, set) => { try { localStorage.setItem(KEY(k), JSON.stringify([...set])); } catch {} };

  function bindSteps() {
    const ol = document.getElementById("steps");
    if (!ol) return;
    const key = ol.dataset.key, items = [...ol.children];
    let done = readDone(key);
    const paint = () => {
      items.forEach((li, k) => {
        const on = done.has(k);
        li.classList.toggle("done", on);
        li.setAttribute("aria-pressed", on ? "true" : "false");
      });
      const bar = document.getElementById("bar"), num = document.getElementById("pnum");
      if (bar) bar.style.width = (done.size / items.length * 100) + "%";
      if (num) num.textContent = `${done.size} / ${items.length}`;
    };
    const toggle = li => {
      const k = +li.dataset.k;
      done.has(k) ? done.delete(k) : done.add(k);
      saveDone(key, done); paint();
    };
    items.forEach(li => {
      li.addEventListener("click", () => toggle(li));
      li.addEventListener("keydown", e => {
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggle(li); }
      });
    });
    window.FIRSTOA.reset = () => { done = new Set(); saveDone(key, done); paint(); };
    paint();
  }

  /* ── 브랜드 탭 ─────────────────────────────────────────────────────── */
  function bindTabs() {
    const tabs = [...document.querySelectorAll(".tab")], grid = document.getElementById("modelGrid");
    if (!tabs.length || !grid) return;
    tabs.forEach(tab => tab.addEventListener("click", () => {
      tabs.forEach(x => x.setAttribute("aria-selected", x === tab ? "true" : "false"));
      const b = tab.dataset.brand;
      const list = b ? modelsOf(b) : D.MODELS;
      grid.innerHTML = list.map(modelCard).join("");
      grid.classList.remove("collapsed"); document.getElementById("showAll")?.remove();
      reveal(grid);
    }));
  }

  /* ── 목차 칩 따라다니기 ────────────────────────────────────────────── */
  function bindJump() {
    const wrap = document.getElementById("jump");
    if (!wrap) return;
    const links = [...wrap.querySelectorAll("a")];
    // 누르면 해시를 바꾸지 않고(바꾸면 화면이 다시 그려져 "찾는 쪽이 없습니다"로 가던 버그, 2026-10-09) 그 자리로 부드럽게 내려간다
    links.forEach(a => a.addEventListener("click", e => {
      const target = document.getElementById(a.dataset.sec);
      if (!target) return;
      e.preventDefault();
      links.forEach(x => x.classList.toggle("on", x === a));
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      try { history.replaceState(null, "", a.getAttribute("href")); } catch {}
    }));
    if (!("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(es => {
      es.forEach(e => {
        if (!e.isIntersecting) return;
        links.forEach(a => a.classList.toggle("on", a.dataset.sec === e.target.id));
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    links.forEach(a => { const s = document.getElementById(a.dataset.sec); if (s) io.observe(s); });
  }

  /* ── 등장 효과 ─────────────────────────────────────────────────────── */
  let io;
  function reveal(scope) {
    const els = (scope || document).querySelectorAll("[data-rv]:not(.in)");
    if (!("IntersectionObserver" in window)) return els.forEach(e => e.classList.add("in"));
    if (!io) io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: .05 });
    els.forEach((el, i) => { el.style.transitionDelay = Math.min(i % 6, 5) * 55 + "ms"; io.observe(el); });
  }

  /* ── 검색 창 ───────────────────────────────────────────────────────── */
  const ov = () => document.getElementById("overlay");
  let sel = 0, hits = [];

  function paintHits(q) {
    const box = document.getElementById("res");
    if (!q.trim()) {
      hits = [];
      box.innerHTML = `<div class="grp">자주 찾는 작업</div>` +
        ["toner", "waste", "jam", "meter"].map(id => TASK[id]).filter(Boolean).map(t =>
          `<a class="hit" href="#/t/${t.id}"><span class="thumb">${ic(t.icon, 18)}</span>
             <span class="tx"><b>${esc(t.title)}</b><span>${esc(t.summary)}</span></span>
             <span class="arw">${ic("chev", 16)}</span></a>`).join("");
      return;
    }
    const { models, tasks, fixes } = find(q);
    hits = [...models.map(m => "#/m/" + m.id), ...fixes.map(f => "#/f/" + f.id), ...tasks.map(t => "#/t/" + t.id)];
    sel = 0;
    box.innerHTML =
      (models.length ? `<div class="grp">기종 ${models.length}</div>` + models.map(m =>
        `<a class="hit" href="#/m/${m.id}"><span class="thumb">${m.photo
          ? `<img src="${esc(m.photo)}" alt="" style="width:100%;height:100%;object-fit:cover">` : U.device(m.device)}</span>
          <span class="tx"><b>${esc(m.name)}</b><span>${esc(m.full || BRAND[m.brand]?.name || "")} · 영상 ${vidCount(m)}편</span></span>
          <span class="arw">${ic("chev", 16)}</span></a>`).join("") : "") +
      (fixes.length ? `<div class="grp">증상 ${fixes.length}</div>` + fixes.map(f =>
        `<a class="hit" href="#/f/${f.id}"><span class="thumb">${ic(f.icon, 18)}</span>
          <span class="tx"><b>${esc(f.title)}</b><span>${esc(f.summary)}</span></span>
          <span class="arw">${ic("chev", 16)}</span></a>`).join("") : "") +
      (tasks.length ? `<div class="grp">소모품 ${tasks.length}</div>` + tasks.map(t =>
        `<a class="hit" href="#/t/${t.id}"><span class="thumb">${ic(t.icon, 18)}</span>
          <span class="tx"><b>${esc(t.title)}</b><span>${esc(t.summary)}</span></span>
          <span class="arw">${ic("chev", 16)}</span></a>`).join("") : "") ||
      `<div class="none"><b>결과가 없습니다</b>모델명 숫자(예: 3220)나 증상(예: 줄)으로 찾아보세요.</div>`;
    markSel();
  }
  const markSel = () => {
    const list = [...document.querySelectorAll("#res .hit")];
    list.forEach((a, i) => a.classList.toggle("sel", i === sel));
    list[sel]?.scrollIntoView({ block: "nearest" });
  };

  /* ── 라우터 ────────────────────────────────────────────────────────── */
  function render() {
    const raw = decodeURIComponent(location.hash.replace(/^#/, "")) || "/";
    const cut = raw.indexOf("/#");                                 // "/#models", "/m/samsung-3220/#sec-fix" 같은 화면 안 이동
    const anchor = cut >= 0 ? raw.slice(cut + 2) : null;
    const p = (cut >= 0 ? raw.slice(0, cut) : raw).split("/").filter(Boolean);
    // 탭을 눌러 "#sec-…"만 남은 옛 주소 → 마지막 기종 화면의 그 자리로(2026-10-09)
    if (p.length === 1 && /^sec-/.test(p[0]) && lastModel && MODEL[lastModel]) { location.replace(`#/m/${lastModel}/#${p[0]}`); return; }
    if (p.length === 1 && /^grp-/.test(p[0])) { location.replace(`#/products/#${p[0]}`); return; }
    let html, title = `${D.meta.company} ${D.meta.title}`;

    if (!p.length) html = viewHome();
    else if (p[0] === "m" && p[2] === "f" && p[3]) { html = viewFix(p[1], p[3]); title = `${FIX[p[3]]?.title || ""} · ${MODEL[p[1]]?.name || ""} | ${D.meta.company}`; }
    else if (p[0] === "m" && p[2]) { html = viewTask(p[1], p[2]); title = `${TASK[p[2]]?.title || ""} · ${MODEL[p[1]]?.name || ""} | ${D.meta.company}`; }
    else if (p[0] === "m") { html = viewModel(p[1]); title = `${MODEL[p[1]]?.name || "기종"} | ${D.meta.company}`; }
    else if (p[0] === "t") { html = viewPick(p[1]); title = `${TASK[p[1]]?.title || "작업"} | ${D.meta.company}`; }
    else if (p[0] === "fixes" && p[2]) { html = viewFixBrand(p[1], p[2]); title = `${FIX[p[2]]?.title || ""} · ${BRAND[p[1]]?.name || ""} | ${D.meta.company}`; }
    else if (p[0] === "fixes" && p[1]) { html = viewFixesBrand(p[1]); title = `${BRAND[p[1]]?.name || ""} 자주 생기는 문제 | ${D.meta.company}`; }
    else if (p[0] === "fixes") { html = viewFixes(); title = `자주 생기는 문제 | ${D.meta.company}`; }
    else if (p[0] === "pattern") { html = viewPattern(); title = `4색 패턴 출력 | ${D.meta.company}`; }
    else if (p[0] === "meter") { html = viewMeter(); title = `사용량 카운터 | ${D.meta.company}`; }
    else if (p[0] === "notices") { html = viewNotices(); title = `이용 안내 | ${D.meta.company}`; }
    else if (p[0] === "products") { html = viewProducts(); title = `취급 품목 | ${D.meta.company}`; }
    else if (p[0] === "f") { html = viewFixPick(p[1]); title = `${FIX[p[1]]?.title || "증상"} | ${D.meta.company}`; }
    else if (p[0] === "s") { html = viewSearch(p.slice(1).join("/")); title = `검색 | ${D.meta.company}`; }
    else html = view404();

    app.innerHTML = html;
    document.title = title;
    // 헤더에서 지금 보고 있는 곳 표시
    const key = p[0] === "fixes" ? "#/fixes" : p[0] === "pattern" ? "#/pattern"
              : p[0] === "meter" ? "#/meter" : p[0] === "products" ? "#/products" : p[0] === "m" || p[0] === "t" ? "#/#models" : "";
    document.querySelectorAll("#navLinks a").forEach(el =>
      el.classList.toggle("on", !!key && el.getAttribute("href") === key));
    const tabKey = !p.length ? "home" : p[0] === "m" || p[0] === "t" ? "models"
                 : p[0] === "fixes" || p[0] === "f" ? "fixes"
                 : (p[0] === "pattern" || p[0] === "meter" || p[0] === "notices" || p[0] === "products") ? "more" : "";
    document.querySelectorAll("#tabbar [data-tab]").forEach(el => el.classList.toggle("on", el.dataset.tab === tabKey));
    window.FIRSTOA?.sheetClose?.();
    bindSteps(); bindTabs(); bindJump(); reveal();
    if (anchor) document.getElementById(anchor)?.scrollIntoView({ behavior: "instant", block: "start" });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }

  /* ── 밖에서 부르는 것들 ────────────────────────────────────────────── */
  window.FIRSTOA = {
    go(e) {
      e.preventDefault();
      const q = document.getElementById("q").value.trim();
      if (q) location.hash = "/s/" + encodeURIComponent(q);
      return false;
    },
    // 썸네일을 누른 뒤에야 유튜브를 불러옵니다(첫 화면이 빨라지고, 안 본 영상은 기록도 남지 않습니다)
    play() {
      const box = document.getElementById("player");
      box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${box.dataset.v}?autoplay=1&rel=0&modestbranding=1&playsinline=1"
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen title="사용 방법 영상"></iframe>`;
    },
    open() {
      ov().classList.add("open");
      document.body.style.overflow = "hidden";
      const i = document.getElementById("sq");
      i.value = ""; paintHits(""); setTimeout(() => i.focus(), 30);
    },
    close() { ov().classList.remove("open"); document.body.style.overflow = ""; },
    // 차트는 SVG 라서 배경 인쇄 설정과 무관하게 색이 그대로 나옵니다
    /* 인쇄는 화면 CSS 를 전혀 타지 않도록 별도 문서를 만들어 그것만 인쇄합니다.
       화면용 스타일을 @media print 로 걷어내는 방식은 브라우저마다 결과가 달라
       빈 종이가 나오는 일이 있었습니다. 숨은 iframe 이라 팝업 차단에도 걸리지 않습니다. */
    printChart(which = "all") {
      const inks = CHART.INKS;
      const list = which === "all" ? [...inks, "chart"] : [which];
      const svgs = list.map(id => `<div class="p">${
        id === "chart" ? CHART.chartSVG(D.meta.company) : CHART.fullSVG(id, D.meta.company)
      }</div>`).join("");

      const doc = `<!doctype html><html lang="ko"><head><meta charset="utf-8">
        <title>${esc(D.meta.company)} 4색 점검 차트</title>
        <style>
          @page{ size:A4; margin:0 }
          html,body{ margin:0; padding:0; background:#fff }
          .p{ width:210mm; height:297mm; overflow:hidden; page-break-after:always; break-after:page }
          .p:last-child{ page-break-after:auto; break-after:auto }
          svg{ display:block; width:210mm; height:297mm;
               -webkit-print-color-adjust:exact; print-color-adjust:exact }
        </style></head><body>${svgs}</body></html>`;

      const frame = document.createElement("iframe");
      frame.setAttribute("aria-hidden", "true");
      frame.style.cssText = "position:fixed; right:0; bottom:0; width:0; height:0; border:0; opacity:0";
      document.body.appendChild(frame);
      const fd = frame.contentDocument || frame.contentWindow.document;
      fd.open(); fd.write(doc); fd.close();

      const go = () => {
        try { frame.contentWindow.focus(); frame.contentWindow.print(); }
        catch (e) { /* 인쇄 대화상자를 못 열면 새 창으로 대체 */
          const w = window.open("", "_blank");
          if (w) { w.document.write(doc); w.document.close(); w.focus(); w.print(); }
        }
        setTimeout(() => frame.remove(), 60000);
      };
      // 글꼴·도형이 다 자리 잡은 뒤에 인쇄 대화상자를 연다
      if (fd.readyState === "complete") setTimeout(go, 120);
      else frame.onload = () => setTimeout(go, 120);
    },
    reset() {},
    // 하단 탭 '더보기'·'상담' 메뉴판
    sheet(kind) {
      const wrap = document.getElementById("bsheet"), body = document.getElementById("bsheetBody");
      if (!wrap || !body) return;
      const t = tel(), k = D.meta.kakao;
      const row = (href, icon, label, desc, ext) => `<a class="row" href="${esc(href)}" ${ext ? 'target="_blank" rel="noopener"' : ""}>
        <span class="box">${ic(icon, 20)}</span><span><b>${esc(label)}</b><span>${esc(desc)}</span></span>
        <span class="arw">${ic(ext ? "ext" : "chev", 16)}</span></a>`;
      body.innerHTML = kind === "help"
        ? `<div class="help-h"><b>도움이 필요하세요?</b><span>${esc(D.meta.company)} · ${esc(D.meta.hours)}</span></div>
           ${t ? `<a class="btn wide" href="tel:${t}">${ic("phone", 19)}전화 ${esc(D.meta.phone)}</a>` : ""}
           ${k ? `<a class="btn kko wide" href="${esc(k)}" target="_blank" rel="noopener">${ic("kakao", 19)}카카오톡 채널로 상담</a>` : ""}
           <p class="muted" style="text-align:center; margin:14px 4px 0; line-height:1.55">화면의 오류나 인쇄물을 사진 한 장으로, 기종과 함께 보내주시면 더 빨리 도와드립니다.</p>`
        : `<h3>더보기</h3>
           ${row("#/pattern", "palette", "4색 패턴 출력", "인쇄 상태를 한 장으로 점검")}
           ${row("#/meter", "meter", "사용량 카운터", "검침 숫자 확인하는 법")}
           ${row("#/notices", "book", "이용 안내", "장마철 용지 · 방문 원칙 · 소모품 신청")}
           ${row("#/products", "star", "취급 품목", "컴퓨터 · 소프트웨어 · 사무기기 · 네트워크 · 가전")}
           ${D.meta.channel ? row(D.meta.channel, "youtube", "유튜브 채널", "작업 영상 전체 보기", true) : ""}
           ${D.meta.homepage ? row(D.meta.homepage, "home", "본사 홈페이지", "firstoa.co.kr", true) : ""}`;
      wrap.hidden = false; document.body.style.overflow = "hidden";
    },
    sheetClose() {
      const wrap = document.getElementById("bsheet");
      if (wrap && !wrap.hidden) { wrap.hidden = true; document.body.style.overflow = ""; }
    },
    showAll() {
      document.getElementById("modelGrid")?.classList.remove("collapsed");
      document.getElementById("showAll")?.remove();
    },
  };

  /* ── 붙이기 ────────────────────────────────────────────────────────── */
  function chrome() {
    const t = tel(), k = D.meta.kakaoChat || D.meta.kakao;

    // 상단 바
    document.getElementById("navSearch").innerHTML = `${ic("search", 18)}<span>검색</span><span class="kbd">/</span>`;
    const navK = document.getElementById("navKakao");
    if (k) { navK.href = k; navK.innerHTML = `${ic("kakao", 17)}<span>카카오 상담</span>`; }
    else navK.remove();
    const navT = document.getElementById("navTel");
    if (t) { navT.href = "tel:" + t; navT.innerHTML = `${ic("phone", 15)}<b>${esc(D.meta.phone)}</b>`; }
    else navT.remove();

    // 하단 탭(폰·태블릿) — 가로 스크롤 메뉴는 보이지 않아 고르기 어려웠다(2026-10-06)
    const tb = document.getElementById("tabbar");
    if (tb) {
      tb.innerHTML = `
        <a href="#/" data-tab="home">${ic("home", 22)}<span>홈</span></a>
        <a href="#/#models" data-tab="models">${ic("grid", 22)}<span>기종</span></a>
        <a href="#/fixes" data-tab="fixes">${ic("error", 22)}<span>문제 해결</span></a>
        <button type="button" data-tab="more" onclick="FIRSTOA.sheet('more')">${ic("menu", 22)}<span>더보기</span></button>
        <button type="button" data-tab="help" class="help" onclick="FIRSTOA.sheet('help')">${ic("kakao", 22)}<span>상담</span></button>`;
      document.body.classList.add("has-tabbar");
    }

    // 바닥
    document.getElementById("footer").innerHTML = `
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="fbrand">${U.logo(38)}
              <span><b>${esc(D.meta.legal || D.meta.company)}</b><span>${esc(D.meta.title)}</span></span></div>
            <p class="fdesc">${esc(D.meta.oneStop)}<br>
              ${esc(D.meta.trust || "")}</p>
            <div style="display:flex; gap:8px; flex-wrap:wrap">
              ${k ? `<a class="btn kko sm" href="${esc(k)}" target="_blank" rel="noopener">
                ${ic("kakao", 16)}카카오톡 상담</a>` : ""}
              ${D.meta.channel ? `<a class="btn on-dark sm" href="${esc(D.meta.channel)}" target="_blank" rel="noopener">
                ${ic("youtube", 16)}유튜브 채널</a>` : ""}
            </div>
          </div>
          <div class="fcol">
            <h4>사용설명서</h4>
            <a href="#/#models">${ic("grid", 15)}기종 전체</a>
            <a href="#/fixes">${ic("error", 15)}자주 생기는 문제</a>
            <a href="#/pattern">${ic("palette", 15)}4색 패턴 출력</a>
            <a href="#/meter">${ic("meter", 15)}사용량 카운터</a>
            <a href="#/notices">${ic("book", 15)}이용 안내</a>
          </div>
          <div class="fcol">
            <h4>문의</h4>
            ${t ? `<a href="tel:${t}">${ic("phone", 15)}${esc(D.meta.phone)}</a>` : ""}
            ${D.meta.phone2 ? `<a href="tel:${esc(D.meta.phone2.replace(/[^0-9+]/g, ""))}">
              ${ic("phone", 15)}${esc(D.meta.phone2)}</a>` : ""}
            <div>${ic("clock", 15)}${esc(D.meta.hours)}</div>
            ${D.meta.homepage ? `<a href="${esc(D.meta.homepage)}" target="_blank" rel="noopener">
              ${ic("home", 15)}본사 홈페이지</a>` : ""}
            <a href="#/products">${ic("star", 15)}취급 품목</a>
          </div>
        </div>
        <div class="fbot">
          <span>${esc(D.meta.legal || D.meta.company)}</span>
          ${D.meta.bizNo ? `<span>사업자등록번호 ${esc(D.meta.bizNo)}</span>` : ""}
          ${D.meta.credits ? `<span>${esc(D.meta.credits)}</span>` : ""}
          <span>이 사이트는 고객 안내용입니다. 제조사 상표는 각 사에 있습니다.</span>
        </div>
      </div>`;
  }

  function bindGlobal() {
    // 검색 창 열고 닫기
    document.getElementById("navSearch").addEventListener("click", () => FIRSTOA.open());
    document.getElementById("sClose").addEventListener("click", () => FIRSTOA.close());
    ov().addEventListener("click", e => { if (e.target === ov()) FIRSTOA.close(); });
    document.getElementById("sq").addEventListener("input", e => paintHits(e.target.value));
    document.addEventListener("keydown", e => {
      const open = ov().classList.contains("open");
      if (!open && e.key === "/" && !/^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName)) {
        e.preventDefault(); FIRSTOA.open(); return;
      }
      if (!open) return;
      if (e.key === "Escape") FIRSTOA.close();
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, hits.length - 1); markSel(); }
      if (e.key === "ArrowUp")   { e.preventDefault(); sel = Math.max(sel - 1, 0); markSel(); }
      if (e.key === "Enter" && hits[sel]) { e.preventDefault(); location.hash = hits[sel].slice(1); FIRSTOA.close(); }
    });
    // 검색 결과를 누르면 창이 닫히도록
    document.getElementById("res").addEventListener("click", e => { if (e.target.closest(".hit")) FIRSTOA.close(); });

    // 메뉴판: 바깥·항목 누르면 닫힘, Esc 도
    const sheetWrap = document.getElementById("bsheet");
    sheetWrap?.addEventListener("click", e => { if (e.target === sheetWrap || e.target.closest(".row")) FIRSTOA.sheetClose(); });
    document.addEventListener("keydown", e => { if (e.key === "Escape") FIRSTOA.sheetClose(); });

    // 스크롤에 따른 상단 바 그림자
    const nav = document.getElementById("nav");
    addEventListener("scroll", () => nav.classList.toggle("stuck", scrollY > 8), { passive: true });
  }

  addEventListener("hashchange", render);
  chrome(); bindGlobal(); render();
})();
