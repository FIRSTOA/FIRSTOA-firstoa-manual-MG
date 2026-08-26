/* ============================================================================
   A4 4색(KCMY) 점검 차트 — SVG 로 그립니다.
   배경색(CSS background)은 브라우저가 인쇄에서 기본적으로 빼버리기 때문에,
   차트를 전부 SVG 도형으로 그려 "내용"으로 만들었습니다. 인쇄 설정을 건드리지
   않아도 색이 그대로 나옵니다.
   단위는 mm (viewBox 0 0 210 297 = A4).
   ========================================================================== */
(() => {
  const INK = { K: "#000000", C: "#00AEEF", M: "#EC008C", Y: "#FFF200" };
  const NAME = { K: "검정 K", C: "파랑 C", M: "빨강 M", Y: "노랑 Y" };

  // 흰색과 섞어 농도(%)를 만든다 — 인쇄기가 그 농도의 망점을 찍는다
  const tint = (hex, pct) => {
    const n = parseInt(hex.slice(1), 16);
    const r = n >> 16, g = (n >> 8) & 255, b = n & 255, k = pct / 100;
    const mix = v => Math.round(255 + (v - 255) * k);
    return `#${[mix(r), mix(g), mix(b)].map(v => v.toString(16).padStart(2, "0")).join("")}`;
  };
  const rect = (x, y, w, h, fill, extra = "") =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" ${extra}/>`;
  const txt = (x, y, s, size = 2.6, fill = "#000", anchor = "start", weight = 400) =>
    `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}"
      font-family="Pretendard, 'Noto Sans KR', sans-serif" font-weight="${weight}">${s}</text>`;

  /* 전면 꽉 찬 한 색 페이지.
     드럼·정착기·롤러 결함은 색이 넓게 깔려야 드러납니다. 세로줄·가로 띠·반복 자국·
     농도 얼룩을 보는 가장 확실한 방법이라 기사들이 실제로 이 장을 뽑습니다. */
  function fullSVG(ink, company = "퍼스트전산") {
    const c = INK[ink];
    // 종이 끝까지 색이 가야 하므로 여백 없이 채우고, 아래쪽에만 아주 작은 확인용 표기를 남깁니다
    const light = ink === "Y";                       // 노랑 위에는 검정 글씨라야 읽힙니다
    const fg = light ? "#000000" : "#FFFFFF";
    return `<svg class="fullpage" data-ink="${ink}" xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 210 297" width="100%" role="img" aria-label="${NAME[ink]} 전면 출력">
      <rect width="210" height="297" fill="${c}"/>
      <g opacity="${light ? .5 : .38}">
        ${txt(8, 291, `${company} · ${NAME[ink]} 전면 점검  ·  기종 __________  출력일 __________`, 3, fg)}
        ${txt(202, 291, ink, 3.6, fg, "end", 700)}
      </g>
    </svg>`;
  }

  function chartSVG(company = "퍼스트전산") {
    const M = 12, W = 210 - M * 2;   // 여백 12mm, 안쪽 폭 186mm
    let o = "";

    // 모서리 맞춤 표시 (네 귀퉁이가 다 찍히는지 = 급지·정렬 확인)
    for (const [cx, cy] of [[M - 4, M - 4], [210 - M + 4, M - 4], [M - 4, 297 - M + 4], [210 - M + 4, 297 - M + 4]])
      o += `<path d="M${cx - 3} ${cy}h6M${cx} ${cy - 3}v6" stroke="#000" stroke-width=".3"/>`;

    // 머리말
    o += txt(M, M + 3, `${company} · 복합기 4색 점검 차트`, 4.6, "#000", "start", 800);
    o += txt(210 - M, M + 3, "A4 · 컬러로 출력하세요", 2.8, "#555", "end");
    o += `<line x1="${M}" y1="${M + 6}" x2="${210 - M}" y2="${M + 6}" stroke="#000" stroke-width=".4"/>`;
    o += txt(M, M + 11, "기종 ______________________   설치 장소 ______________________   출력일 ______________", 3);

    // 1) 4색 원색 블록 — 색이 아예 안 나오는 색이 있는지
    let y = M + 16;
    o += txt(M, y, "① 원색 — 네 가지 색이 모두 진하게 나와야 합니다", 3.2, "#000", "start", 700);
    y += 2.5;
    const bw = (W - 9) / 4;
    ["K", "C", "M", "Y"].forEach((k, i) => {
      const x = M + i * (bw + 3);
      o += rect(x, y, bw, 24, INK[k]);
      o += rect(x, y, bw, 24, "none", 'stroke="#000" stroke-width=".2"');
      o += txt(x + bw / 2, y + 28, NAME[k], 2.8, "#000", "middle", 600);
    });

    // 2) 농도 단계 — 흐리거나 특정 농도가 끊기는지
    y += 33;
    o += txt(M, y, "② 농도 단계 — 왼쪽부터 오른쪽까지 자연스럽게 진해져야 합니다", 3.2, "#000", "start", 700);
    y += 2.5;
    const steps = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const sw = (W - 14) / steps.length;
    ["K", "C", "M", "Y"].forEach((k, r) => {
      const ry = y + r * 12;
      o += txt(M, ry + 6, k, 3.2, "#000", "start", 800);
      steps.forEach((p, i) => {
        o += rect(M + 6 + i * sw, ry, sw - 0.4, 9, tint(INK[k], p));
        if (r === 3) o += txt(M + 6 + i * sw + (sw - 0.4) / 2, ry + 12.4, p + "", 2.2, "#666", "middle");
      });
    });

    // 3) 회색 균형 — 색이 한쪽으로 치우치면 회색이 물들어 보인다
    y += 52;
    o += txt(M, y, "③ 회색 — 붉거나 푸르게 물들면 색 균형이 틀어진 것입니다", 3.2, "#000", "start", 700);
    y += 2.5;
    const gs = 13, gw = W / gs;
    for (let i = 0; i < gs; i++) o += rect(M + i * gw, y, gw - 0.3, 9, tint("#000000", i * 100 / (gs - 1)));
    // 같은 회색을 CMY 세 색을 겹쳐 만든 것 — 위와 색이 같아야 정상
    for (let i = 0; i < gs; i++) {
      const p = i * 100 / (gs - 1);
      o += `<g opacity="1">${rect(M + i * gw, y + 10, gw - 0.3, 9, tint("#7C7C7C", p))}</g>`;
    }
    o += txt(M, y + 25, "위: 검정 토너만 / 아래: 세 가지 색을 섞은 회색 — 두 줄의 색이 비슷해야 합니다", 2.5, "#555");

    // 4) 선 재현 — 세로줄·가로줄·번짐 확인
    y += 30;
    o += txt(M, y, "④ 가는 선 — 끊기거나 겹쳐 보이면 드럼·정착기 쪽 문제일 수 있습니다", 3.2, "#000", "start", 700);
    y += 3;
    const lw = [0.1, 0.15, 0.2, 0.3, 0.4, 0.6];
    ["K", "C", "M", "Y"].forEach((k, r) => {
      const ry = y + r * 7;
      o += txt(M, ry + 3.4, k, 2.8, "#000", "start", 700);
      lw.forEach((w, i) => {
        const x = M + 8 + i * 15;
        for (let j = 0; j < 5; j++)
          o += `<line x1="${x + j * 2.2}" y1="${ry}" x2="${x + j * 2.2}" y2="${ry + 5}" stroke="${INK[k]}" stroke-width="${w}"/>`;
        for (let j = 0; j < 5; j++)
          o += `<line x1="${x + 12}" y1="${ry + j * 1.1}" x2="${x + 26}" y2="${ry + j * 1.1}" stroke="${INK[k]}" stroke-width="${w}"/>`;
      });
    });

    // 5) 글자 선명도
    y += 32;
    o += txt(M, y, "⑤ 글자 — 가장 작은 줄까지 읽히면 정상입니다", 3.2, "#000", "start", 700);
    y += 4;
    [4, 3.2, 2.6, 2.2, 1.8].forEach((sz, i) => {
      o += txt(M, y + i * 5, `가나다라마바사 ABCDEFG 0123456789 — ${sz}mm`, sz);
    });

    // 6) 전면 도포 — 얼룩·띠 확인
    y += 30;
    o += txt(M, y, "⑥ 전면 — 얼룩·가로 띠·번짐이 보이면 사진을 찍어 보내주세요", 3.2, "#000", "start", 700);
    y += 2.5;
    ["C", "M", "Y", "K"].forEach((k, i) => o += rect(M + i * (W / 4), y, W / 4 - 0.4, 14, tint(INK[k], 35)));
    o += rect(M, y + 15, W, 8, tint("#000000", 20));

    // 7) 확인란 — 체크해서 사진 찍어 보내면 방문 전에 원인을 좁힐 수 있다
    y += 27;
    o += rect(M, y, W, 34, "#ffffff", 'stroke="#000" stroke-width=".4"');
    o += txt(M + 4, y + 6, "⑦ 확인란 — 이상한 항목에 표시한 뒤 이 장을 사진으로 찍어 보내주세요", 3, "#000", "start", 700);
    const checks = [
      "네 가지 색이 모두 진하게 나온다", "세로줄 · 가로줄이 없다",
      "얼룩이나 가로 띠가 없다", "가장 작은 글씨까지 읽힌다",
    ];
    checks.forEach((c, i) => {
      const cx = M + 6 + (i % 2) * (W / 2), cy = y + 13 + Math.floor(i / 2) * 8;
      o += rect(cx, cy - 3.4, 4, 4, "#ffffff", 'stroke="#000" stroke-width=".35"');
      o += txt(cx + 6, cy, c, 2.7);
    });
    o += txt(M + 6, y + 31, "이상한 항목 / 하고 싶은 말 ________________________________________________", 2.7);

    // 꼬리말
    o += `<line x1="${M}" y1="278" x2="${210 - M}" y2="278" stroke="#000" stroke-width=".3"/>`;
    o += txt(M, 283, `${company} 복합기 사용설명서에서 출력한 점검 차트입니다.`, 2.6, "#333");
    o += txt(M, 287.5, "이상이 보이면 이 장을 사진으로 찍어 보내주시면 방문 전에 원인을 좁힐 수 있습니다.", 2.6, "#333");
    o += txt(210 - M, 287.5, "1522-1093", 3, "#000", "end", 700);

    return `<svg id="chartSvg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 210 297"
      width="100%" role="img" aria-label="4색 점검 차트">
      <rect width="210" height="297" fill="#ffffff"/>${o}</svg>`;
  }

  window.CHART = { chartSVG, fullSVG, INKS: ["K", "C", "M", "Y"], NAME };
})();
