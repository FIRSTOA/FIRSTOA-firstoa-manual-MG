/* ============================================================================
   퍼스트전산 복합기 사용설명서 — 화면 로직
   주소(#) 하나로 화면이 갈리는 단일 페이지 구성. 빌드 도구 없이 그대로 돕니다.
   내용은 전부 data/manuals.js 에 있고, 여기서는 그리는 일만 합니다.
   ========================================================================== */
(() => {
  const D = window.FIRSTOA_MANUAL, U = window.UI;
  const app  = document.getElementById("app");
  const root = document.documentElement;
  const ic = (n, s = 24, c = "") => U.icon(n, s, c);

  /* ── 색인 ──────────────────────────────────────────────────────────── */
  const TASK  = Object.fromEntries(D.TASKS.map(t => [t.id, t]));
  const CAT   = Object.fromEntries(D.CATEGORIES.map(c => [c.id, c]));
  const BRAND = Object.fromEntries(D.BRANDS.map(b => [b.id, b]));
  const MODEL = Object.fromEntries(D.MODELS.map(m => [m.id, m]));

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

  // 브랜드 색을 화면 전체 강조색으로
  const setAccent = bid => {
    const c = BRAND[bid]?.accent;
    if (c) root.style.setProperty("--accent", c);
    else root.style.removeProperty("--accent");
  };

  /* ── 부품 ──────────────────────────────────────────────────────────── */
  const crumbs = parts => `<nav class="crumbs" aria-label="위치">${parts.map((p, i) =>
    (i ? '<span class="sep">/</span>' : "") +
    (p.to ? `<a href="#${p.to}">${esc(p.label)}</a>` : `<span class="cur">${esc(p.label)}</span>`)).join("")}</nav>`;

  const modelCard = m => {
    const b = BRAND[m.brand], n = vidCount(m);
    return `<a class="mcard" href="#/m/${m.id}" data-rv>
      <div class="art">${artOf(m)}
        <span class="bdot"><i style="background:${esc(b?.accent || "#888")}"></i>${esc(b?.name || "")}</span></div>
      <div class="info">
        <b>${esc(m.name)}</b>
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
            : `<span class="ph">${ic(t.icon, 38)}</span>
               <span class="pin">${ic("clock", 13)}${t.minutes}분</span>`}
      </div>
      <div class="body">
        <div class="row1">${ic(t.icon, 19)}<b>${esc(t.title)}</b></div>
        <p>${esc(t.summary)}</p>
        <div class="meta">${v ? `<span class="badge b-vid">${ic("video", 13)}영상</span>`
                               : `<span class="badge b-soon">영상 준비 중</span>`}
          <span>${esc(CAT[t.cat]?.name || "")}</span></div>
      </div></a>`;
  };

  const band = () => {
    const tel = (D.meta.phone || "").replace(/[^0-9+]/g, "");
    return `<section class="section"><div class="band" data-rv>
      <h3>그래도 해결이 안 되시나요?</h3>
      <p>${esc(D.meta.company)} 기사가 바로 도와드립니다. ${esc(D.meta.hours)}</p>
      <div class="row">
        ${tel ? `<a class="btn light" href="tel:${tel}">${ic("phone", 19)}전화 ${esc(D.meta.phone)}</a>` : ""}
        ${D.meta.kakao ? `<a class="btn ghost" href="${esc(D.meta.kakao)}" target="_blank" rel="noopener">카카오톡 문의</a>` : ""}
      </div></div></section>`;
  };

  /* ── 화면: 첫 화면 ─────────────────────────────────────────────────── */
  function viewHome() {
    setAccent(null);
    const popular = ["toner", "waste", "jam", "meter"].map(id => TASK[id]).filter(Boolean);
    const firstBrand = D.BRANDS.find(b => modelsOf(b.id).length)?.id;

    return `
    <section class="hero">
      <div class="hero-in">
        <div>
          <span class="eyebrow on-dark">${esc(D.meta.company)} 고객지원</span>
          <h1 class="display">복합기,<br>직접 해결하세요.</h1>
          <p class="lead">${esc(D.meta.tagline)}</p>
          <form class="searchbar" onsubmit="return FIRSTOA.go(event)">
            ${ic("search", 21)}
            <input id="q" placeholder="기종명 또는 증상 (예: 3220, 토너, 줄)" autocomplete="off" aria-label="검색">
            <button type="submit">검색</button>
          </form>
          <div class="quick">${popular.map(t =>
            `<a href="#/t/${t.id}">${ic(t.icon, 17)}${esc(t.title)}</a>`).join("")}</div>
        </div>
        <div class="hero-art">
          ${U.device("floor-color")}
          <span class="float f1"><span class="dot"></span>영상 ${totalVideos}편</span>
          <span class="float f2">${ic("grid", 16)} 기종 ${D.MODELS.length}종</span>
        </div>
      </div>
    </section>

    <div class="container">
      <section class="section">
        <div class="sec-head" data-rv>
          <div><span class="eyebrow">자주 찾는 작업</span>
            <h2 class="h2" style="margin-top:10px">이 네 가지가 가장 많습니다</h2>
            <p class="lead">기종을 몰라도 됩니다. 작업을 고르면 기종을 골라드립니다.</p></div>
        </div>
        <div class="tiles">${popular.map(t => `
          <a class="tile" href="#/t/${t.id}" data-rv>
            <span class="box">${ic(t.icon, 24)}</span>
            <b>${esc(t.title)}</b><p>${esc(t.summary)}</p>
            <span class="foot">${ic("video", 14)}영상 ${modelsWith(t.id).length}종</span>
          </a>`).join("")}</div>
      </section>

      <section class="section" id="models">
        <div class="sec-head" data-rv>
          <div><span class="eyebrow">기종으로 찾기</span>
            <h2 class="h2" style="margin-top:10px">쓰시는 복합기를 고르세요</h2>
            <p class="lead">기기 앞면 스티커의 모델명을 확인하세요. 숫자 몇 자리만 검색해도 찾아집니다.</p></div>
          <button class="more" onclick="FIRSTOA.open()">전체 검색 ${ic("arrow", 17)}</button>
        </div>
        <div class="tabs" role="tablist">
          <button class="tab" role="tab" aria-selected="true" data-brand="">전체 <span class="n num">${D.MODELS.length}</span></button>
          ${D.BRANDS.filter(b => modelsOf(b.id).length).map(b =>
            `<button class="tab" role="tab" aria-selected="false" data-brand="${b.id}" style="--bdot:${esc(b.accent)}">
               <i class="dot"></i>${esc(b.name)} <span class="n num">${modelsOf(b.id).length}</span></button>`).join("")}
        </div>
        <div class="models" id="modelGrid">${D.MODELS.map(modelCard).join("")}</div>
      </section>

      <section class="section">
        <div class="sec-head" data-rv>
          <div><span class="eyebrow">이용 방법</span>
            <h2 class="h2" style="margin-top:10px">세 단계면 끝납니다</h2></div>
        </div>
        <div class="flow">
          <div class="step" data-rv><b>기종을 찾습니다</b>
            <p>기기 앞면·옆면 스티커의 모델명을 확인하세요. 예: <b>SL-X3220NR</b>, <b>DocuCentre-V C2263</b>.
               숫자 몇 자리만 검색창에 넣어도 됩니다.</p></div>
          <div class="step" data-rv><b>작업을 고릅니다</b>
            <p>토너 교체, 폐토너통, 용지 걸림, 검침 카운터까지. 소요 시간이 표시돼 있어 미리 가늠할 수 있습니다.</p></div>
          <div class="step" data-rv><b>영상을 따라 합니다</b>
            <p>기사가 직접 촬영한 영상과 순서를 보며 하나씩 눌러 체크하세요. 어디까지 했는지 남습니다.</p></div>
        </div>
      </section>

      ${band()}
    </div>`;
  }

  /* ── 화면: 기종 ────────────────────────────────────────────────────── */
  function viewModel(id) {
    const m = MODEL[id];
    if (!m) return view404();
    setAccent(m.brand);
    const b = BRAND[m.brand], list = tasksOf(m), n = vidCount(m);
    const cats = D.CATEGORIES.filter(c => list.some(t => t.cat === c.id));

    return `<div class="container">
      <div class="phead">
        ${crumbs([{ label: "처음", to: "/" }, { label: b?.name || "기종", to: "/#models" }, { label: m.name }])}
        <div class="phead-grid" style="margin-top:16px">
          <div>
            <span class="eyebrow">${esc(b?.full || "")}</span>
            <h1 class="h1" style="margin-top:10px">${esc(m.name)}</h1>
            <p class="lead">필요한 작업을 고르면 영상과 순서를 함께 보여드립니다.</p>
            <div class="statrow">
              ${n ? `<span class="stat">${ic("video", 16)}영상 ${n}편</span>`
                  : `<span class="stat">${ic("video", 16)}영상 준비 중</span>`}
              <span class="stat">${ic("book", 16)}작업 ${list.length}가지</span>
              <span class="stat">${ic("grid", 16)}${esc(b?.name || "")}</span>
            </div>
          </div>
          <div class="art">${artOf(m)}</div>
        </div>
      </div>

      <div class="jump" id="jump">${cats.map((c, i) =>
        `<a href="#sec-${c.id}" data-sec="sec-${c.id}" class="${i ? "" : "on"}">${ic(c.icon, 16)}${esc(c.name)}</a>`).join("")}</div>

      ${n ? "" : `<div class="section tight"><div class="callout info" data-rv>
        ${ic("spark", 18)}<p style="margin-top:8px">이 기종은 영상을 준비하고 있습니다.
        아래 순서만으로도 대부분 해결되며, 어려우시면 언제든 전화 주세요.</p></div></div>`}

      ${cats.map(c => `<section class="section tight" id="sec-${c.id}">
        <div class="sec-head" data-rv><div>
          <span class="eyebrow">${esc(c.desc)}</span>
          <h2 class="h2" style="margin-top:8px">${esc(c.name)}</h2></div></div>
        <div class="cards">${list.filter(t => t.cat === c.id).map(t => taskCard(m, t)).join("")}</div>
      </section>`).join("")}

      ${band()}
    </div>`;
  }

  /* ── 화면: 작업 ────────────────────────────────────────────────────── */
  function viewTask(mid, tid) {
    const m = MODEL[mid], t = TASK[tid];
    if (!m || !t) return view404();
    setAccent(m.brand);
    const b = BRAND[m.brand], v = vidOf(m, tid), note = (m.notes || {})[tid], steps = stepsOf(m, t);
    const siblings = tasksOf(m);
    const i = siblings.findIndex(x => x.id === tid);
    const prev = siblings[i - 1], next = siblings[i + 1];
    const tel = (D.meta.phone || "").replace(/[^0-9+]/g, "");

    return `<div class="container">
      <div class="phead">
        ${crumbs([{ label: "처음", to: "/" }, { label: m.name, to: "/m/" + m.id }, { label: t.title }])}
        <h1 class="h1" style="margin-top:14px; display:flex; align-items:center; gap:12px">
          ${ic(t.icon, 30)}${esc(t.title)}</h1>
        <p class="lead">${esc(m.name)} · ${esc(t.summary)}</p>
      </div>

      <div class="work" style="margin-top:22px">
        <div>
          ${v ? `<div class="player" id="player" data-v="${esc(v)}">
                   <img src="${thumb(v, true)}" onerror="${fallback(v)}" alt="">
                   <span class="veil"></span>
                   <button class="go" onclick="FIRSTOA.play()" aria-label="영상 재생"><i>${ic("play", 26)}</i></button>
                   <span class="cap">${ic("video", 17)}${esc(t.title)} · ${esc(m.name)}</span>
                 </div>`
               : `<div class="noplayer">${ic("video", 34)}<b>영상 준비 중입니다</b>
                   <span>아래 순서를 따라 하시면 됩니다</span></div>
                 <div class="callout warn" style="margin-top:16px">
                   <b>${ic("error", 17)}이 순서는 기종 공통 일반 안내입니다</b>
                   <p style="margin:0; font-size:14.5px; line-height:1.6">기기마다 위치와 방법이 다를 수 있습니다.
                   화면과 다르거나 확실하지 않으면 무리하지 마시고 전화 주세요.</p></div>`}

          ${note ? `<div class="callout info" style="margin-top:16px">
                      <b>${ic("spark", 17)}이 기종은 이렇습니다</b><p>${esc(note)}</p></div>` : ""}

          <div class="panel" style="margin-top:18px">
            <div class="panel-h">${ic("book", 19)}<b>따라 하는 순서</b>
              <button class="rst" onclick="FIRSTOA.reset()">처음부터</button></div>
            <div class="progress"><i id="bar"></i></div>
            <div class="pmeta"><span id="pnum" class="num">0 / ${steps.length}</span> 단계 · 누르면 체크됩니다</div>
            <ol class="steps" id="steps" data-key="${esc(mid + "." + tid)}">
              ${steps.map((s, k) => `<li data-k="${k}" tabindex="0" role="button" aria-pressed="false">
                <span class="mark"><span class="num">${k + 1}</span>${ic("check", 16)}</span>
                <span class="tx">${esc(s)}</span></li>`).join("")}
            </ol>
          </div>

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
            ${tel ? `<a class="btn wide sm" href="tel:${tel}">${ic("phone", 17)}전화 ${esc(D.meta.phone)}</a>` : ""}
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
    setAccent(null);
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

  /* ── 검색 ──────────────────────────────────────────────────────────── */
  function find(q) {
    const k = q.trim().toLowerCase();
    if (!k) return { models: [], tasks: [] };
    const hit = s => String(s).toLowerCase().includes(k);
    return {
      models: D.MODELS.filter(m => hit(m.name) || (m.aka || []).some(hit) ||
        hit(BRAND[m.brand]?.name || "") || hit(BRAND[m.brand]?.full || "")),
      tasks: D.TASKS.filter(t => hit(t.title) || hit(t.summary) || hit(CAT[t.cat]?.name || "") ||
        (t.steps || []).some(hit) || (t.cautions || []).some(hit)),
    };
  }

  function viewSearch(q) {
    setAccent(null);
    const { models, tasks } = find(q);
    if (!models.length && !tasks.length) return `<div class="container"><div class="empty">
      ${ic("search", 44)}<b>“${esc(q)}” 결과가 없습니다</b>
      <p>모델명 숫자 몇 자리(예: 3220)나 증상(예: 줄, 걸림)으로 다시 찾아보세요.</p>
      <a class="btn ghost" href="#/">처음으로</a></div>${band()}</div>`;

    return `<div class="container">
      <div class="phead">${crumbs([{ label: "처음", to: "/" }, { label: "검색" }])}
        <h1 class="h1" style="margin-top:14px">“${esc(q)}” 검색 결과</h1>
        <p class="lead">기종 ${models.length}종 · 작업 ${tasks.length}가지</p></div>
      ${models.length ? `<section class="section tight">
        <div class="sec-head" data-rv><div><span class="eyebrow">기종</span>
          <h2 class="h2" style="margin-top:8px">${models.length}종</h2></div></div>
        <div class="models">${models.map(modelCard).join("")}</div></section>` : ""}
      ${tasks.length ? `<section class="section tight">
        <div class="sec-head" data-rv><div><span class="eyebrow">작업</span>
          <h2 class="h2" style="margin-top:8px">${tasks.length}가지</h2></div></div>
        <div class="tiles">${tasks.map(t => `<a class="tile" href="#/t/${t.id}" data-rv>
          <span class="box">${ic(t.icon, 24)}</span><b>${esc(t.title)}</b><p>${esc(t.summary)}</p>
          <span class="foot">${ic("video", 14)}영상 ${modelsWith(t.id).length}종</span></a>`).join("")}</div></section>` : ""}
      ${band()}</div>`;
  }

  const view404 = () => { setAccent(null); return `<div class="container"><div class="empty">
    ${ic("search", 44)}<b>찾는 쪽이 없습니다</b><p>주소가 바뀌었을 수 있습니다.</p>
    <a class="btn" href="#/">처음으로</a></div></div>`; };

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
      reveal(grid);
    }));
  }

  /* ── 목차 칩 따라다니기 ────────────────────────────────────────────── */
  function bindJump() {
    const wrap = document.getElementById("jump");
    if (!wrap || !("IntersectionObserver" in window)) return;
    const links = [...wrap.querySelectorAll("a")];
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
    const { models, tasks } = find(q);
    hits = [...models.map(m => "#/m/" + m.id), ...tasks.map(t => "#/t/" + t.id)];
    sel = 0;
    box.innerHTML =
      (models.length ? `<div class="grp">기종 ${models.length}</div>` + models.map(m =>
        `<a class="hit" href="#/m/${m.id}"><span class="thumb">${m.photo
          ? `<img src="${esc(m.photo)}" alt="" style="width:100%;height:100%;object-fit:cover">` : U.device(m.device)}</span>
          <span class="tx"><b>${esc(m.name)}</b><span>${esc(BRAND[m.brand]?.name || "")} · 영상 ${vidCount(m)}편</span></span>
          <span class="arw">${ic("chev", 16)}</span></a>`).join("") : "") +
      (tasks.length ? `<div class="grp">작업 ${tasks.length}</div>` + tasks.map(t =>
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
    const anchor = raw.startsWith("/#") ? raw.slice(2) : null;   // 첫 화면 안쪽 이동
    const p = (anchor ? "/" : raw).split("/").filter(Boolean);
    let html, title = `${D.meta.company} ${D.meta.title}`;

    if (!p.length) html = viewHome();
    else if (p[0] === "m" && p[2]) { html = viewTask(p[1], p[2]); title = `${TASK[p[2]]?.title || ""} · ${MODEL[p[1]]?.name || ""} | ${D.meta.company}`; }
    else if (p[0] === "m") { html = viewModel(p[1]); title = `${MODEL[p[1]]?.name || "기종"} | ${D.meta.company}`; }
    else if (p[0] === "t") { html = viewPick(p[1]); title = `${TASK[p[1]]?.title || "작업"} | ${D.meta.company}`; }
    else if (p[0] === "s") { html = viewSearch(p.slice(1).join("/")); title = `검색 | ${D.meta.company}`; }
    else html = view404();

    app.innerHTML = html;
    document.title = title;
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
    reset() {},
  };

  /* ── 붙이기 ────────────────────────────────────────────────────────── */
  function chrome() {
    const tel = (D.meta.phone || "").replace(/[^0-9+]/g, "");
    document.getElementById("logo").innerHTML = U.logo(34);
    document.getElementById("bName").textContent = D.meta.company;
    document.getElementById("bSub").textContent = D.meta.title;
    document.getElementById("navSearch").innerHTML = `${ic("search", 18)}<span>검색</span><span class="kbd">/</span>`;
    document.getElementById("sIcon").innerHTML = ic("search", 20);

    const navCall = document.getElementById("navCall");
    if (tel) { navCall.href = "tel:" + tel; navCall.innerHTML = `${ic("phone", 17)}<span>${esc(D.meta.phone)}</span>`; }
    else navCall.remove();

    const bar = document.getElementById("callbar");
    if (tel) {
      document.getElementById("barTx").innerHTML = `<b>도움이 필요하세요?</b>${esc(D.meta.company)} · ${esc(D.meta.hours)}`;
      const a = document.getElementById("barCall");
      a.href = "tel:" + tel; a.innerHTML = `${ic("phone", 17)}전화`;
      document.body.classList.add("has-callbar");
    } else bar.remove();

    document.getElementById("footBrand").innerHTML =
      `${U.logo(30)}<span class="txt"><b>${esc(D.meta.company)}</b><span>${esc(D.meta.title)}</span></span>`;
    document.getElementById("footLinks").innerHTML =
      `<a href="#/">처음</a><a href="#/#models">기종 전체</a><a href="#/t/meter">검침 카운터</a>` +
      (D.meta.channel ? `<a href="${esc(D.meta.channel)}" target="_blank" rel="noopener">유튜브 채널</a>` : "") +
      (tel ? `<a href="tel:${tel}">${esc(D.meta.phone)}</a>` : "");
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

    // 스크롤에 따른 상단 바·전화바
    const nav = document.getElementById("nav"), bar = document.getElementById("callbar");
    let last = 0;
    addEventListener("scroll", () => {
      const y = scrollY;
      nav.classList.toggle("stuck", y > 8);
      if (bar) bar.classList.toggle("show", y > 420 && y < last + 4);
      last = y;
    }, { passive: true });
  }

  addEventListener("hashchange", render);
  chrome(); bindGlobal(); render();
})();
