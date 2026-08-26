/* 퍼스트전산 복합기 사용설명서 — 화면 로직
   주소(#) 하나로 화면이 갈리는 단일 페이지 구성입니다. 빌드 도구 없이 그대로 돕니다.
   화면 구성만 여기서 다루고, 내용은 전부 data/manuals.js 에 있습니다. */

(() => {
  const D = window.FIRSTOA_MANUAL;
  const app = document.getElementById("app");

  /* ── 색인: 데이터를 화면에서 빨리 찾을 수 있게 정리 ────────── */
  const TASK = Object.fromEntries(D.TASKS.map(t => [t.id, t]));
  const CAT = Object.fromEntries(D.CATEGORIES.map(c => [c.id, c]));
  const BRAND = Object.fromEntries(D.BRANDS.map(b => [b.id, b]));
  const MODEL = Object.fromEntries(D.MODELS.map(m => [m.id, m]));

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  // 기종이 가진 작업 목록 (videos 에 열쇠가 있는 것만, TASKS 순서 유지)
  const tasksOf = m => D.TASKS.filter(t => t.id in (m.videos || {}));
  const vidOf = (m, tid) => (m.videos || {})[tid] || "";
  const hasVid = m => tasksOf(m).some(t => vidOf(m, t.id));
  const vidCount = m => tasksOf(m).filter(t => vidOf(m, t.id)).length;
  // 그 작업 영상이 있는 기종들
  const modelsWith = tid => D.MODELS.filter(m => vidOf(m, tid));

  /* ── 부품 ──────────────────────────────────────────────────── */
  const crumb = parts => `<nav class="crumb">${parts.map((p, i) =>
    (i ? '<i>›</i>' : '') + (p.to ? `<a href="#${p.to}">${esc(p.label)}</a>` : `<span>${esc(p.label)}</span>`)
  ).join("")}</nav>`;

  const taskCard = (m, t) => {
    const v = vidOf(m, t.id);
    return `<a class="card ${v ? "" : "soon"}" href="#/m/${m.id}/${t.id}">
      <div class="card-t"><span class="ic">${t.icon}</span>${esc(t.title)}</div>
      <div class="card-d">${esc(t.summary)}</div>
      <div class="card-meta">
        ${v ? '<span class="badge b-vid">영상</span>' : '<span class="badge b-soon">영상 준비 중</span>'}
        <span>· 약 ${t.minutes}분</span>
      </div></a>`;
  };

  const modelRow = m => `<a class="mrow" href="#/m/${m.id}">
      <span>${esc(m.name)}</span>
      <span class="cnt">${vidCount(m) ? `영상 ${vidCount(m)}` : ""}</span>
      <span class="arw">›</span></a>`;

  const contactCta = () => {
    const tel = (D.meta.phone || "").replace(/[^0-9+]/g, "");
    return `<section class="cta">
      <b>해결이 안 되시나요?</b>
      <p>${esc(D.meta.company)} 기사가 도와드립니다 · ${esc(D.meta.hours)}</p>
      ${tel ? `<a class="btn" href="tel:${tel}">전화 문의 ${esc(D.meta.phone)}</a>` : ""}
      ${D.meta.kakao ? ` <a class="btn ghost" href="${esc(D.meta.kakao)}" target="_blank" rel="noopener">카카오톡 문의</a>` : ""}
    </section>`;
  };

  /* ── 화면: 첫 화면 ─────────────────────────────────────────── */
  function viewHome() {
    const popular = ["toner", "waste", "jam", "meter"].map(id => TASK[id]).filter(Boolean);
    const byBrand = D.BRANDS.map(b => {
      const list = D.MODELS.filter(m => m.brand === b.id);
      if (!list.length) return "";
      return `<div class="brand-h"><b>${esc(b.name)}</b><span>${esc(b.full)} · ${list.length}종</span></div>
              <div class="mlist">${list.map(modelRow).join("")}</div>`;
    }).join("");

    return `
    <section class="hero">
      <h1>${esc(D.meta.title)}</h1>
      <p>${esc(D.meta.tagline)}</p>
      <form class="search" onsubmit="return FIRSTOA.submitSearch(event)">
        <input id="q" placeholder="기종명 또는 증상 검색 (예: 3220, 토너, 줄)" autocomplete="off">
        <button type="submit">검색</button>
      </form>
      <div class="chips">${popular.map(t =>
        `<a class="chip" href="#/t/${t.id}">${t.icon} ${esc(t.title)}</a>`).join("")}</div>
    </section>

    <h2>기종으로 찾기 <em>기기 앞면 스티커의 모델명을 확인하세요</em></h2>
    ${byBrand}

    <div class="help">
      <b>내 복합기 기종을 모르겠어요</b>
      <p>기기 앞면이나 옆면에 붙은 스티커, 또는 화면을 켰을 때 나오는 모델명을 확인해 주세요.
         (예: <b>SL-X3220NR</b>, <b>DocuCentre-V C2263</b>) 숫자 몇 자리만 검색창에 넣어도 찾아집니다.
         그래도 모르시면 기기 사진을 찍어 담당자에게 보내주세요.</p>
    </div>
    ${contactCta()}`;
  }

  /* ── 화면: 기종 ────────────────────────────────────────────── */
  function viewModel(id) {
    const m = MODEL[id];
    if (!m) return viewNotFound();
    const list = tasksOf(m);
    const groups = D.CATEGORIES.map(c => {
      const ts = list.filter(t => t.cat === c.id);
      if (!ts.length) return "";
      return `<h2>${c.icon} ${esc(c.name)} <em>${esc(c.desc)}</em></h2>
              <div class="grid">${ts.map(t => taskCard(m, t)).join("")}</div>`;
    }).join("");

    return `${crumb([{ label: "처음", to: "/" }, { label: BRAND[m.brand]?.name || "기종" }, { label: m.name }])}
      <h1>${esc(m.name)}</h1>
      <p class="lead">필요한 작업을 고르면 영상과 순서가 나옵니다.</p>
      ${hasVid(m) ? "" : `<div class="note">이 기종은 영상을 준비하고 있습니다. 아래 순서만으로도 대부분 해결되며, 어려우시면 전화 주세요.</div>`}
      ${groups}
      ${contactCta()}`;
  }

  /* ── 화면: 작업(기종 지정) ─────────────────────────────────── */
  function viewTask(mid, tid) {
    const m = MODEL[mid], t = TASK[tid];
    if (!m || !t) return viewNotFound();
    const v = vidOf(m, tid);
    const note = (m.notes || {})[tid];
    const steps = (m.steps && m.steps[tid]) || t.steps;
    const others = tasksOf(m).filter(x => x.id !== tid && x.cat === t.cat);

    return `${crumb([{ label: "처음", to: "/" }, { label: m.name, to: "/m/" + m.id }, { label: t.title }])}
      <h1>${t.icon} ${esc(t.title)}</h1>
      <p class="lead">${esc(m.name)} · ${esc(t.summary)} · 약 ${t.minutes}분</p>
      ${v ? `<div class="video" id="vid" data-v="${esc(v)}">
               <img class="thumb" src="https://i.ytimg.com/vi/${esc(v)}/hqdefault.jpg" alt="">
               <button class="play" onclick="FIRSTOA.play()" aria-label="영상 재생"><i>▶</i></button>
             </div>`
            : `<div class="novideo"><b>영상 준비 중입니다</b><span>아래 순서를 따라 해주세요</span></div>`}
      ${note ? `<div class="note">${esc(note)}</div>` : ""}

      <h2>따라 하는 순서</h2>
      <div class="panel"><ol class="steps">${steps.map(s => `<li>${esc(s)}</li>`).join("")}</ol></div>

      ${t.cautions?.length ? `<div class="warn"><b>⚠️ 주의하세요</b>
        <ul>${t.cautions.map(c => `<li>${esc(c)}</li>`).join("")}</ul></div>` : ""}

      ${others.length ? `<h2>이 기종의 다른 작업</h2>
        <div class="grid">${others.map(x => taskCard(m, x)).join("")}</div>` : ""}
      ${contactCta()}`;
  }

  /* ── 화면: 작업(기종 미지정) → 기종 고르기 ─────────────────── */
  function viewTaskPick(tid) {
    const t = TASK[tid];
    if (!t) return viewNotFound();
    const withV = modelsWith(tid);
    const rest = D.MODELS.filter(m => (tid in (m.videos || {})) && !vidOf(m, tid));

    return `${crumb([{ label: "처음", to: "/" }, { label: t.title }])}
      <h1>${t.icon} ${esc(t.title)}</h1>
      <p class="lead">${esc(t.summary)} — 사용 중인 기종을 골라 주세요.</p>
      ${withV.length ? `<h2>영상 있는 기종 <em>${withV.length}종</em></h2>
        <div class="mlist">${withV.map(m => `<a class="mrow" href="#/m/${m.id}/${tid}">
          <span>${esc(m.name)}</span><span class="arw">›</span></a>`).join("")}</div>` : ""}
      ${rest.length ? `<h2>영상 준비 중 <em>순서 안내는 볼 수 있습니다</em></h2>
        <div class="mlist">${rest.map(m => `<a class="mrow" href="#/m/${m.id}/${tid}">
          <span>${esc(m.name)}</span><span class="arw">›</span></a>`).join("")}</div>` : ""}
      ${contactCta()}`;
  }

  /* ── 화면: 검색 ────────────────────────────────────────────── */
  function search(q) {
    const k = q.trim().toLowerCase();
    if (!k) return { models: [], tasks: [] };
    const hit = s => String(s).toLowerCase().includes(k);
    const models = D.MODELS.filter(m =>
      hit(m.name) || (m.aka || []).some(hit) || hit(BRAND[m.brand]?.name || "") || hit(BRAND[m.brand]?.full || ""));
    const tasks = D.TASKS.filter(t =>
      hit(t.title) || hit(t.summary) || hit(CAT[t.cat]?.name || "") ||
      (t.steps || []).some(hit) || (t.cautions || []).some(hit));
    return { models, tasks };
  }

  function viewSearch(q) {
    const { models, tasks } = search(q);
    if (!models.length && !tasks.length) {
      return `${crumb([{ label: "처음", to: "/" }, { label: "검색" }])}
        <div class="empty"><b>“${esc(q)}” 결과가 없습니다</b>
        <p>모델명 숫자 몇 자리(예: 3220)나 증상(예: 줄, 걸림)으로 다시 찾아보세요.</p>
        <p><a class="btn ghost" href="#/">처음으로</a></p></div>${contactCta()}`;
    }
    return `${crumb([{ label: "처음", to: "/" }, { label: "검색" }])}
      <h1>“${esc(q)}” 검색 결과</h1>
      ${models.length ? `<h2>기종 <em>${models.length}종</em></h2>
        <div class="mlist">${models.map(modelRow).join("")}</div>` : ""}
      ${tasks.length ? `<h2>작업 <em>${tasks.length}개</em></h2>
        <div class="grid">${tasks.map(t => `<a class="card" href="#/t/${t.id}">
          <div class="card-t"><span class="ic">${t.icon}</span>${esc(t.title)}</div>
          <div class="card-d">${esc(t.summary)}</div>
          <div class="card-meta"><span>영상 있는 기종 ${modelsWith(t.id).length}종</span></div></a>`).join("")}</div>` : ""}
      ${contactCta()}`;
  }

  const viewNotFound = () => `<div class="empty"><b>찾는 쪽이 없습니다</b>
    <p>주소가 바뀌었을 수 있습니다.</p><p><a class="btn" href="#/">처음으로</a></p></div>`;

  /* ── 라우터 ────────────────────────────────────────────────── */
  function render() {
    const raw = decodeURIComponent(location.hash.replace(/^#/, "")) || "/";
    const p = raw.split("/").filter(Boolean);   // ["m","id","task"]
    let html, title = D.meta.company + " " + D.meta.title;

    if (!p.length) html = viewHome();
    else if (p[0] === "m" && p[2]) { html = viewTask(p[1], p[2]); title = `${TASK[p[2]]?.title || ""} · ${MODEL[p[1]]?.name || ""}`; }
    else if (p[0] === "m") { html = viewModel(p[1]); title = MODEL[p[1]]?.name || title; }
    else if (p[0] === "t") { html = viewTaskPick(p[1]); title = TASK[p[1]]?.title || title; }
    else if (p[0] === "s") { html = viewSearch(p.slice(1).join("/")); title = "검색"; }
    else html = viewNotFound();

    app.innerHTML = html;
    document.title = title;
    window.scrollTo(0, 0);
  }

  /* ── 밖에서 부르는 것들 ────────────────────────────────────── */
  window.FIRSTOA = {
    submitSearch(e) {
      e.preventDefault();
      const q = document.getElementById("q").value.trim();
      if (q) location.hash = "/s/" + encodeURIComponent(q);
      return false;
    },
    // 썸네일을 누른 뒤에야 유튜브를 불러옵니다(첫 화면이 빨라지고, 안 본 영상은 기록도 남지 않습니다)
    play() {
      const box = document.getElementById("vid");
      const v = box.dataset.v;
      box.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v}?autoplay=1&rel=0&modestbranding=1"
        allow="accelerometer; autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowfullscreen title="사용 방법 영상"></iframe>`;
    },
  };

  /* ── 머리말·꼬리말 채우기 ──────────────────────────────────── */
  function chrome() {
    const tel = (D.meta.phone || "").replace(/[^0-9+]/g, "");
    document.getElementById("brandName").textContent = D.meta.company;
    document.getElementById("brandSub").textContent = D.meta.title;
    const call = document.getElementById("hdCall");
    if (tel) call.href = "tel:" + tel; else call.style.display = "none";
    document.getElementById("barText").innerHTML =
      `<b>도움이 필요하세요?</b>${esc(D.meta.company)} · ${esc(D.meta.hours)}`;
    const barCall = document.getElementById("barCall");
    if (tel) { barCall.href = "tel:" + tel; barCall.textContent = "전화 " + D.meta.phone; }
    else document.getElementById("callbar").style.display = "none";  // 번호가 없으면 하단바 자체를 감춘다
    document.getElementById("foot").innerHTML =
      `${esc(D.meta.company)} · ${esc(D.meta.title)}` +
      (D.meta.channel ? ` · <a href="${esc(D.meta.channel)}" target="_blank" rel="noopener">유튜브 채널</a>` : "");
  }

  window.addEventListener("hashchange", render);
  chrome();
  render();
})();
