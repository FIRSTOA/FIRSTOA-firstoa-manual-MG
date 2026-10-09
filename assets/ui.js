/* 퍼스트전산 복합기 사용설명서 — 그림 자산
   아이콘과 기기 일러스트를 SVG 로 직접 그립니다. 이미지 파일이 없으니
   화면 크기·다크모드·브랜드 색을 그대로 따라옵니다. 색은 CSS 변수로 받습니다. */

(() => {
  /* ── 아이콘 (24 격자, 선 굵기 1.7) ─────────────────────────── */
  const P = {
    toner:   '<rect x="2.6" y="7.4" width="14" height="9.2" rx="2.2"/><path d="M7.2 7.4v9.2"/><path d="M16.6 10.2h3.2a1.6 1.6 0 0 1 1.6 1.6v.4a1.6 1.6 0 0 1-1.6 1.6h-3.2"/>',
    waste:   '<path d="M3.5 6.5h17"/><path d="M9.2 6.5V4.2a1.2 1.2 0 0 1 1.2-1.2h3.2a1.2 1.2 0 0 1 1.2 1.2v2.3"/><path d="M5.6 6.5l.9 12.4a2 2 0 0 0 2 1.9h7a2 2 0 0 0 2-1.9l.9-12.4"/><path d="M10 10.5v6M14 10.5v6"/>',
    drum:    '<ellipse cx="12" cy="6.4" rx="7.6" ry="3.1"/><path d="M4.4 6.4v11.2c0 1.7 3.4 3.1 7.6 3.1s7.6-1.4 7.6-3.1V6.4"/><path d="M9 10.2v6.6M12 10.6v6.8M15 10.2v6.6"/>',
    jam:     '<path d="M13.6 2.8H7a2 2 0 0 0-2 2v14.4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.2z"/><path d="M13.4 2.8v5.4H19"/><path d="M12 11.4v3.4"/><path d="M12 17.8h.01"/>',
    paper:   '<path d="M4 9.6h16v9.2a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 18.8z"/><path d="M6.4 9.6V6.4h11.2v3.2"/><path d="M8.8 6.4V3.6h6.4v2.8"/><path d="M9.2 14.6h5.6"/>',
    copy:    '<rect x="8.6" y="2.8" width="12.6" height="14.6" rx="2"/><path d="M15.4 17.4v2.4a2 2 0 0 1-2 2H4.8a2 2 0 0 1-2-2V8.8a2 2 0 0 1 2-2h2.4"/>',
    scan:    '<path d="M3.4 8V5.4a2 2 0 0 1 2-2H8M16 3.4h2.6a2 2 0 0 1 2 2V8M20.6 16v2.6a2 2 0 0 1-2 2H16M8 20.6H5.4a2 2 0 0 1-2-2V16"/><path d="M3.4 12h17.2"/>',
    fax:     '<path d="M6.6 9.4V3.8a1 1 0 0 1 1-1h8.8a1 1 0 0 1 1 1v5.6"/><path d="M6.6 17.6H4.8a2 2 0 0 1-2-2v-4.2a2 2 0 0 1 2-2h14.4a2 2 0 0 1 2 2v4.2a2 2 0 0 1-2 2h-1.8"/><rect x="6.6" y="14.2" width="10.8" height="7" rx="1.2"/><path d="M5.8 12.4h.01"/>',
    meter:   '<path d="M3.4 18.4a8.6 8.6 0 1 1 17.2 0"/><path d="M12 18.4l4.2-5.2"/><path d="M3.4 18.4h2M18.6 18.4h2M12 9.8V7.8"/>',
    clean:   '<path d="M13.4 3.2l1.6 3.8 3.8 1.6-3.8 1.6-1.6 3.8-1.6-3.8L8 8.6l3.8-1.6z"/><path d="M5.6 14.2l1 2.2 2.2 1-2.2 1-1 2.2-1-2.2-2.2-1 2.2-1z"/><path d="M19.4 14.6l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7z"/>',
    quality: '<rect x="3.4" y="3.4" width="17.2" height="17.2" rx="2.4"/><path d="M7 8.2h6.4M7 12h10M7 15.8h4.4"/><path d="M15.6 8.2l3.4 3.4M19 8.2l-3.4 3.4"/>',
    error:   '<path d="M10.3 3.6L2.6 17.2a2 2 0 0 0 1.7 3h15.4a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0z"/><path d="M12 9.4v4.2"/><path d="M12 17.2h.01"/>',
    search:  '<circle cx="10.8" cy="10.8" r="7.2"/><path d="M16 16l4.6 4.6"/>',
    phone:   '<path d="M20.6 16.9v2.8a1.9 1.9 0 0 1-2.1 1.9 18.7 18.7 0 0 1-8.1-2.9 18.4 18.4 0 0 1-5.7-5.7A18.7 18.7 0 0 1 1.8 4.8 1.9 1.9 0 0 1 3.7 2.7h2.8a1.9 1.9 0 0 1 1.9 1.6 12 12 0 0 0 .7 2.6 1.9 1.9 0 0 1-.4 2L7.5 10.1a15 15 0 0 0 5.7 5.7l1.2-1.2a1.9 1.9 0 0 1 2-.4 12 12 0 0 0 2.6.7 1.9 1.9 0 0 1 1.6 2z"/>',
    play:    '<path d="M6.6 3.8l13.6 8.2-13.6 8.2z"/>',
    arrow:   '<path d="M4.4 12h15.2"/><path d="M13.4 5.8l6.2 6.2-6.2 6.2"/>',
    chev:    '<path d="M9 5.4l6.6 6.6L9 18.6"/>',
    close:   '<path d="M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/>',
    check:   '<path d="M4.6 12.4l5 5 9.8-10.8"/>',
    clock:   '<circle cx="12" cy="12" r="9"/><path d="M12 6.8V12l3.4 2.2"/>',
    video:   '<rect x="2.6" y="5.6" width="13" height="12.8" rx="2.4"/><path d="M15.6 10l5.8-3.4v10.8L15.6 14z"/>',
    grid:    '<rect x="3.2" y="3.2" width="7.4" height="7.4" rx="1.8"/><rect x="13.4" y="3.2" width="7.4" height="7.4" rx="1.8"/><rect x="3.2" y="13.4" width="7.4" height="7.4" rx="1.8"/><rect x="13.4" y="13.4" width="7.4" height="7.4" rx="1.8"/>',
    book:    '<path d="M3.6 4.4a1.8 1.8 0 0 1 1.8-1.8h4.2A3 3 0 0 1 12 5.4v14a2.4 2.4 0 0 0-2.4-2.2H3.6z"/><path d="M20.4 4.4a1.8 1.8 0 0 0-1.8-1.8h-4.2A3 3 0 0 0 12 5.4v14a2.4 2.4 0 0 1 2.4-2.2h6z"/>',
    spark:   '<path d="M12 2.6l2.3 5.6 5.6 2.3-5.6 2.3L12 18.4l-2.3-5.6L4.1 10.5l5.6-2.3z"/>',
    kakao:   '<path d="M12 3.4c-5 0-9 3.1-9 6.9 0 2.4 1.6 4.5 4.1 5.7l-1 3.7a.4.4 0 0 0 .6.44l4.3-2.86c.33.03.66.05 1 .05 5 0 9-3.1 9-6.9s-4-7.03-9-7.03z"/>',
    youtube: '<path d="M21.6 7.6a2.5 2.5 0 0 0-1.75-1.77C18.3 5.4 12 5.4 12 5.4s-6.3 0-7.85.43A2.5 2.5 0 0 0 2.4 7.6 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.4 2.5 2.5 0 0 0 1.75 1.77c1.55.43 7.85.43 7.85.43s6.3 0 7.85-.43a2.5 2.5 0 0 0 1.75-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.4z"/><path d="M10.2 15.1l5-3.1-5-3.1z"/>',
    menu:    '<path d="M4 7h16M4 12h16M4 17h16"/>',
    home:    '<path d="M3.4 10.4 12 3.6l8.6 6.8"/><path d="M5.6 12.1v7.3a1.4 1.4 0 0 0 1.4 1.4h10a1.4 1.4 0 0 0 1.4-1.4v-7.3"/><path d="M9.8 21v-6h4.4v6"/>',
    ext:     '<path d="M14.4 3.6h6v6"/><path d="M20.4 3.6 11 13"/><path d="M18.6 14v5.4a1.6 1.6 0 0 1-1.6 1.6H5.2a1.6 1.6 0 0 1-1.6-1.6V7.6A1.6 1.6 0 0 1 5.2 6h5.4"/>',
    shield:  '<path d="M12 2.8 4.4 6v6c0 4.4 3.1 7.9 7.6 9.2 4.5-1.3 7.6-4.8 7.6-9.2V6z"/><path d="M8.8 12.2l2.3 2.3 4.1-4.6"/>',
    users:   '<path d="M16.4 20.4v-1.8a3.6 3.6 0 0 0-3.6-3.6H6.4a3.6 3.6 0 0 0-3.6 3.6v1.8"/><circle cx="9.6" cy="7.6" r="3.6"/><path d="M21.2 20.4v-1.8a3.6 3.6 0 0 0-2.7-3.5"/><path d="M15.6 4.2a3.6 3.6 0 0 1 0 6.9"/>',
    pin:     '<path d="M19.4 10.2c0 5.4-7.4 11-7.4 11s-7.4-5.6-7.4-11a7.4 7.4 0 1 1 14.8 0z"/><circle cx="12" cy="10" r="2.7"/>',
    star:    '<path d="M12 3.2l2.6 5.6 6 .8-4.4 4.2 1.1 6-5.3-2.9-5.3 2.9 1.1-6L3.4 9.6l6-.8z"/>',
    drop:    '<path d="M12 3.2c0 0 6 6.4 6 10.2a6 6 0 0 1-12 0c0-3.8 6-10.2 6-10.2z"/>',
    snow:    '<path d="M12 2.6v18.8M3.9 7.3l16.2 9.4M20.1 7.3 3.9 16.7"/><path d="M9.4 4.6 12 7.2l2.6-2.6M9.4 19.4 12 16.8l2.6 2.6"/>',
    calendar:'<rect x="3.2" y="4.8" width="17.6" height="16" rx="2.2"/><path d="M3.2 9.6h17.6M8.2 2.8v4M15.8 2.8v4"/>',
    box:     '<path d="M20.6 8.4v7.2a1.8 1.8 0 0 1-.9 1.55l-6.8 3.9a1.8 1.8 0 0 1-1.8 0l-6.8-3.9a1.8 1.8 0 0 1-.9-1.55V8.4"/><path d="M3.4 8.4 12 3.4l8.6 5L12 13.4z"/><path d="M12 13.4V21"/>',
    power:   '<path d="M12 3.4v8.4"/><path d="M6.8 6.2a8.4 8.4 0 1 0 10.4 0"/>',
    palette: '<rect x="3" y="3" width="8" height="8" rx="1.5"/><rect x="13" y="3" width="8" height="8" rx="1.5"/><rect x="3" y="13" width="8" height="8" rx="1.5"/><rect x="13" y="13" width="8" height="8" rx="1.5"/>',
    printer: '<path d="M6.4 9V3.6h11.2V9"/><rect x="2.6" y="9" width="18.8" height="7.6" rx="2"/><rect x="6.4" y="14" width="11.2" height="6.4" rx="1.4"/>',
  };
  const icon = (name, size = 24, cls = "") =>
    `<svg class="ic ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"
      aria-hidden="true">${P[name] || ""}</svg>`;

  /* ── 로고 ──────────────────────────────────────────────────── */
  const logo = (size = 34) => `<svg width="${size}" height="${size}" viewBox="0 0 36 36" aria-hidden="true">
    <rect width="36" height="36" rx="10.5" fill="var(--navy)"/>
    <rect x="11" y="7" width="14" height="6.4" rx="2" fill="#fff" opacity=".5"/>
    <rect x="7" y="15" width="22" height="8.6" rx="3" fill="var(--gold)"/>
    <rect x="13.5" y="25.4" width="9" height="4" rx="2" fill="#fff" opacity=".7"/>
  </svg>`;

  /* ── 기기 일러스트 ──────────────────────────────────────────
   * 제조사 제품 사진은 저작권이 있어 쓸 수 없으므로 직접 그립니다.
   * 실제 사진을 넣고 싶으면 data/manuals.js 의 photo 에 파일 경로를 적으면 대체됩니다.
   * ------------------------------------------------------------ */
  const shell = (vb, inner) =>
    `<svg class="dev" viewBox="${vb}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
       <defs>
         <linearGradient id="gBody" x1="0" y1="0" x2="0" y2="1">
           <stop offset="0" stop-color="var(--dev-hi)"/><stop offset="1" stop-color="var(--dev-body)"/>
         </linearGradient>
       </defs>${inner}</svg>`;

  const tray = (x, y, w, h = 30) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="var(--dev-tray)"/>
    <rect x="${x + w / 2 - 22}" y="${y + h / 2 - 2.5}" width="44" height="5" rx="2.5" fill="var(--dev-line)"/>`;

  const panel = (x, y, w = 52, h = 26) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="var(--dev-dark)"/>
    <rect x="${x + 4}" y="${y + 4}" width="${w - 8}" height="${h - 8}" rx="3" fill="var(--accent)" opacity=".92"/>`;

  const sheets = (x, y, w) => `
    <rect x="${x}" y="${y}" width="${w}" height="8" rx="2" fill="var(--dev-paper)" opacity=".75"/>
    <rect x="${x + 6}" y="${y + 5}" width="${w - 12}" height="8" rx="2" fill="var(--dev-paper)"/>`;

  const DEVICES = {
    // 대형 컬러 복합기 (용지함 3단)
    "floor-color": () => shell("0 0 260 282", `
      <ellipse cx="130" cy="266" rx="100" ry="11" fill="var(--dev-shadow)"/>
      <rect x="54" y="22" width="140" height="18" rx="6" fill="var(--dev-shade)"/>
      <rect x="40" y="38" width="180" height="38" rx="9" fill="url(#gBody)"/>
      ${panel(158, 44)}
      <rect x="44" y="74" width="172" height="180" rx="11" fill="url(#gBody)"/>
      <rect x="202" y="74" width="14" height="180" rx="7" fill="var(--dev-shade)"/>
      <rect x="58" y="82" width="122" height="28" rx="4" fill="var(--dev-dark)"/>
      ${sheets(70, 92, 96)}
      <rect x="58" y="118" width="138" height="4" rx="2" fill="var(--accent)" opacity=".85"/>
      ${tray(58, 132, 138)} ${tray(58, 170, 138)} ${tray(58, 208, 138)}
      <rect x="56" y="252" width="152" height="10" rx="4" fill="var(--dev-shade)"/>`),

    // 대형 흑백 복합기 (용지함 2단)
    "floor-mono": () => shell("0 0 260 282", `
      <ellipse cx="130" cy="266" rx="96" ry="11" fill="var(--dev-shadow)"/>
      <rect x="58" y="30" width="132" height="16" rx="6" fill="var(--dev-shade)"/>
      <rect x="44" y="44" width="172" height="36" rx="9" fill="url(#gBody)"/>
      ${panel(154, 50, 48, 24)}
      <rect x="48" y="78" width="164" height="164" rx="11" fill="url(#gBody)"/>
      <rect x="198" y="78" width="14" height="164" rx="7" fill="var(--dev-shade)"/>
      <rect x="62" y="86" width="114" height="26" rx="4" fill="var(--dev-dark)"/>
      ${sheets(72, 95, 90)}
      <rect x="62" y="120" width="130" height="4" rx="2" fill="var(--accent)" opacity=".85"/>
      ${tray(62, 136, 130)} ${tray(62, 180, 130)}
      <rect x="60" y="240" width="140" height="10" rx="4" fill="var(--dev-shade)"/>`),

    // 탁상형 복합기
    "desktop": () => shell("0 0 260 210", `
      <ellipse cx="130" cy="194" rx="84" ry="9" fill="var(--dev-shadow)"/>
      <rect x="62" y="24" width="120" height="15" rx="5" fill="var(--dev-shade)"/>
      <rect x="48" y="37" width="156" height="32" rx="8" fill="url(#gBody)"/>
      ${panel(150, 43, 46, 20)}
      <rect x="52" y="67" width="148" height="102" rx="10" fill="url(#gBody)"/>
      <rect x="188" y="67" width="12" height="102" rx="6" fill="var(--dev-shade)"/>
      <rect x="64" y="74" width="104" height="24" rx="4" fill="var(--dev-dark)"/>
      ${sheets(74, 82, 82)}
      <rect x="64" y="106" width="118" height="3.5" rx="1.75" fill="var(--accent)" opacity=".85"/>
      ${tray(64, 120, 118, 28)}
      <rect x="70" y="169" width="18" height="8" rx="3" fill="var(--dev-shade)"/>
      <rect x="164" y="169" width="18" height="8" rx="3" fill="var(--dev-shade)"/>`),

    // 복사용지 묶음 — 상표 없는 그림입니다.
    // 특정 브랜드 용지 사진을 쓰면 "우리가 받는 것과 다르다"는 항의가 생깁니다.
    "paper-ream": () => shell("0 0 260 200", `
      <ellipse cx="130" cy="182" rx="86" ry="9" fill="var(--dev-shadow)"/>
      <rect x="46" y="112" width="168" height="56" rx="7" fill="var(--dev-shade)"/>
      <rect x="46" y="112" width="168" height="12" rx="6" fill="var(--dev-line)" opacity=".55"/>
      <rect x="40" y="64" width="168" height="56" rx="7" fill="url(#gBody)"/>
      <rect x="40" y="64" width="168" height="12" rx="6" fill="var(--dev-shade)" opacity=".7"/>
      <rect x="62" y="86" width="76" height="5" rx="2.5" fill="var(--accent)" opacity=".75"/>
      <rect x="62" y="97" width="48" height="4" rx="2" fill="var(--dev-line)"/>
      <rect x="86" y="22" width="94" height="42" rx="3" fill="var(--dev-paper)"/>
      <rect x="86" y="22" width="94" height="42" rx="3" fill="none" stroke="var(--dev-line)" stroke-width="1.4"/>
      <rect x="98" y="34" width="58" height="3.4" rx="1.7" fill="var(--dev-line)" opacity=".8"/>
      <rect x="98" y="43" width="70" height="3.4" rx="1.7" fill="var(--dev-line)" opacity=".6"/>
      <rect x="98" y="52" width="44" height="3.4" rx="1.7" fill="var(--dev-line)" opacity=".45"/>`),

    // 소프트웨어 — 모니터 속 창 네 칸 + 문서 한 장. 상표 없는 그림(윈도우·오피스 로고를 그대로 쓰지 않는다).
    "software": () => shell("0 0 260 200", `
      <ellipse cx="130" cy="184" rx="88" ry="9" fill="var(--dev-shadow)"/>
      <rect x="40" y="22" width="180" height="120" rx="11" fill="url(#gBody)"/>
      <rect x="50" y="32" width="160" height="98" rx="6" fill="var(--dev-dark)"/>
      <rect x="64" y="46" width="34" height="34" rx="5" fill="var(--accent)" opacity=".95"/>
      <rect x="104" y="46" width="34" height="34" rx="5" fill="var(--accent)" opacity=".7"/>
      <rect x="64" y="86" width="34" height="34" rx="5" fill="var(--accent)" opacity=".55"/>
      <rect x="104" y="86" width="34" height="34" rx="5" fill="var(--accent)" opacity=".82"/>
      <rect x="150" y="54" width="50" height="64" rx="4" fill="var(--dev-paper)"/>
      <rect x="150" y="54" width="50" height="64" rx="4" fill="none" stroke="var(--dev-line)" stroke-width="1.3"/>
      <rect x="158" y="66" width="30" height="3.6" rx="1.8" fill="var(--accent)" opacity=".8"/>
      <rect x="158" y="76" width="34" height="3.2" rx="1.6" fill="var(--dev-line)" opacity=".8"/>
      <rect x="158" y="85" width="26" height="3.2" rx="1.6" fill="var(--dev-line)" opacity=".6"/>
      <rect x="158" y="94" width="32" height="3.2" rx="1.6" fill="var(--dev-line)" opacity=".5"/>
      <rect x="158" y="103" width="20" height="3.2" rx="1.6" fill="var(--dev-line)" opacity=".4"/>
      <rect x="118" y="142" width="24" height="14" rx="3" fill="var(--dev-shade)"/>
      <rect x="84" y="156" width="92" height="9" rx="4.5" fill="var(--dev-shade)"/>`),

    // 잉크젯 복합기
    "inkjet": () => shell("0 0 260 200", `
      <ellipse cx="130" cy="186" rx="76" ry="9" fill="var(--dev-shadow)"/>
      ${sheets(92, 22, 76)}
      <rect x="66" y="38" width="128" height="20" rx="7" fill="var(--dev-shade)"/>
      <rect x="56" y="54" width="148" height="76" rx="13" fill="url(#gBody)"/>
      <rect x="190" y="54" width="14" height="76" rx="7" fill="var(--dev-shade)"/>
      ${panel(66, 64, 44, 18)}
      <rect x="118" y="68" width="70" height="4" rx="2" fill="var(--accent)" opacity=".8"/>
      <rect x="118" y="78" width="46" height="4" rx="2" fill="var(--dev-line)"/>
      <rect x="70" y="122" width="120" height="14" rx="5" fill="var(--dev-tray)"/>
      <rect x="96" y="134" width="68" height="9" rx="4" fill="var(--dev-shade)"/>
      <rect x="74" y="130" width="16" height="6" rx="3" fill="var(--dev-line)"/>`),
  };

  const device = (kind) => (DEVICES[kind] || DEVICES["floor-color"])();

  window.UI = { icon, logo, device, DEVICE_KINDS: Object.keys(DEVICES) };
})();
