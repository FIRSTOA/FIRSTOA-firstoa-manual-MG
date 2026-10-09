/* ============================================================================
 * 퍼스트전산 복합기 사용설명서 — 데이터 파일
 *
 * 여기만 고치면 사이트가 바뀝니다. 빌드·설치 필요 없습니다.
 *
 * ▸ 영상 추가하는 법
 *     유튜브 주소가  https://youtu.be/AbCdEfGhIjK        이면  →  "AbCdEfGhIjK"
 *                   https://www.youtube.com/watch?v=AbCdEfGhIjK  →  "AbCdEfGhIjK"
 *     해당 기종의 videos 안, 작업 이름 옆에 그 글자만 붙여넣으면 끝입니다.
 *     비워두면("") 사이트에서 "영상 준비 중"으로 표시되고 목록에서 흐리게 나옵니다.
 *
 * ▸ 기종 추가하는 법
 *     MODELS 배열에 { id, brand, name, aka, videos } 한 덩어리를 복사해 붙여넣으세요.
 *     id 는 겹치면 안 되고(영문·숫자·하이픈), aka 는 검색용 별칭입니다.
 *
 * ▸ aka(별칭)는 화면에 보이지 않습니다. 검색에만 씁니다.
 *     고객이 치는 말("3220", "복합기 큰거")과 사내 코드명(키슈·세이토·마블)을
 *     여기 넣어두면 검색은 되지만 고객 화면에는 뜨지 않습니다.
 * ========================================================================== */

window.FIRSTOA_MANUAL = {

  /* ── 회사 정보 ─────────────────────────────────────────────── */
  meta: {
    company: "퍼스트전산",
    legal: "(주)퍼스트전산",
    title: "복합기 사용설명서",
    tagline: "토너 교체부터 검침까지, 담당 엔지니어가 직접 찍은 영상을 보고 그대로 따라 하세요.",
    phone: "1522-1093",
    phone2: "02-464-1095",
    hours: "평일 09:00 – 18:00",
    kakao: "https://pf.kakao.com/_yCBAj",
    // 채팅 직행(/chat)은 카카오 로그인창이 먼저 떠서 쓰지 않습니다(2026-10-06 확인). 모든 상담 단추는 채널 홈으로 갑니다.
    kakaoChat: "https://pf.kakao.com/_yCBAj",
    homepage: "https://firstoa.co.kr",
    channel: "https://www.youtube.com/channel/UCiXGLLxY8xwpcP1_-PQrlJw",
    bizNo: "206-86-78075",
    oneStop: "복합기 · PC · 소프트웨어 · 솔루션 · 가전 · 가구 · 네트워크 One-Stop",
    // 홈 "복합기만 하는 게 아닙니다" 아래 줄과 꼬리말에 같이 쓰입니다. 숫자는 아래 STATS 와 맞춰 주세요.
    // 출처: 본사 홈페이지 실적 띠(20 Yr+ · 렌탈 11,000+ · 전문인력 60+ · 전국유지보수지점 200+). 전문 인력은 2026-10-09 사용자 확인으로 55명.
    trust: "20여 년의 노하우와 55명 이상의 전문 인력, 전국 200개 유지보수 지점.",
  },

  /* ── 회사 실적 (본사 홈페이지 기준) ────────────────────────── */
  STATS: [
    { n: "20", unit: "년+", label: "업력" },
    { n: "11,000", unit: "대", label: "렌탈 대수" },
    { n: "55", unit: "명+", label: "전문 인력" },
    { n: "200", unit: "곳", label: "전국 유지보수 지점" },
  ],

  /* ── 취급 품목 (홍보) ──────────────────────────────────────
   * 사진은 본사 쇼핑몰에서 가져온 실제 제품 사진입니다.
   * link 는 본사 홈페이지의 해당 분류로 이어집니다.
   * ------------------------------------------------------------ */
  PRODUCTS: [
    // 순서가 곧 화면 순서입니다. 2026-10-09: 데스크탑 → 노트북 → 맥 → 소프트웨어를 앞에(사용자 요청), 복합기는 이 사이트 자체가 복합기라 뒤로.
    { id: "desktop", name: "데스크탑 PC", img: "assets/img/desktop.jpg",
      desc: "삼성 · HP 사무용 데스크탑, 모니터까지 한 번에",
      link: "https://firstoa.co.kr/shop.php?goPage=GoodList&cat_no=5" },
    { id: "laptop", name: "노트북", img: "assets/img/pc.jpg",
      desc: "삼성 · LG 그램 · HP 프로북, 오피스 포함 구성",
      link: "https://firstoa.co.kr/shop.php?goPage=GoodList&cat_no=5" },
    { id: "mac", name: "애플 (Mac)", img: "assets/img/mac.jpg",
      desc: "맥북 프로 · 맥 미니 · 맥 스튜디오 · 스튜디오 디스플레이",
      link: "https://firstoa.co.kr/shop.php?goPage=GoodList&cat_no=99" },
    // 소프트웨어는 상표 없는 그림입니다 — 윈도우·오피스 로고를 그대로 쓰지 않습니다.
    { id: "software", name: "소프트웨어", art: "software",
      desc: "윈도우 · 오피스 · 한글 등 정품 라이선스. PC와 함께 신청하시면 설치까지 해드립니다.",
      link: "https://firstoa.co.kr" },
    { id: "copier", name: "복합기", img: "assets/img/copier.jpg",
      desc: "삼성 · 신도리코 · 후지필름 · 교세라 A3 컬러/흑백",
      link: "https://firstoa.co.kr/shop.php?goPage=GoodList&cat_no=6" },
    { id: "workstation", name: "워크스테이션", img: "assets/img/workstation.jpg",
      desc: "디자인 · 영상 · 설계용 고사양 PC",
      link: "https://firstoa.co.kr/shop.php?goPage=GoodList&cat_no=5" },
    { id: "air", name: "공기청정기 · 가전", img: "assets/img/air.jpg",
      desc: "LG 퓨리케어 · 삼성 블루스카이 · 사무실 냉난방",
      link: "https://firstoa.co.kr/shop.php?goPage=GoodList&cat_no=7" },
    { id: "shredder", name: "문서세단기", img: "assets/img/shredder.jpg",
      desc: "신도테크노 · 대진코스탈 · 대형 세단기",
      link: "https://firstoa.co.kr/shop.php?goPage=GoodList&cat_no=9" },
    { id: "board", name: "스마트보드 · 전자칠판", img: "assets/img/board.jpg",
      desc: "삼성 플립2 65 / 55인치 터치스크린",
      link: "https://firstoa.co.kr/shop.php?goPage=GoodList&cat_no=8" },
    { id: "plotter", name: "대형 플로터", img: "assets/img/plotter.jpg",
      desc: "HP T520 · T530 / A0 · A1 도면 출력",
      link: "https://firstoa.co.kr/shop.php?goPage=GoodList&cat_no=8" },
    // 용지는 브랜드를 특정하지 않습니다 — 특정 상품 사진을 걸면 "받은 것과 다르다"는 항의가 생깁니다
    { id: "paper", name: "복사용지", art: "paper-ream",
      desc: "A4 · A3 복사용지 정기 납품. 복합기와 함께 신청하시면 됩니다.",
      link: "https://firstoa.co.kr" },
    { id: "nas", name: "NAS · 네트워크", img: "assets/img/nas.jpg",
      desc: "사내 자료 공유 · 백업 · 보안 솔루션",
      link: "https://firstoa.co.kr/shop.php?goPage=GoodList&cat_no=73" },
    // 네트워크 공사는 상표 없는 그림입니다(2026-10-09 추가, 사용자 요청).
    { id: "network", name: "네트워크 공사 · 보안", art: "network",
      desc: "공유기 · 스위치 · 랜 배선 · 방화벽. 사무실 이전이나 자리 늘릴 때 한 번에 정리해 드립니다.",
      link: "https://firstoa.co.kr/shop.php?goPage=GoodList&cat_no=73" },
  ],

  /* ── 취급 품목 묶음 — 취급 품목 화면(#/products)의 구역과 위쪽 탭 ──
   * ids 에 적힌 순서대로 그 구역에 나옵니다. 어느 묶음에도 없는 품목은 "그 밖에"로 모입니다.
   * icon 은 assets/ui.js 아이콘 이름입니다(grid · spark · printer · shield · box · star …).
   * ------------------------------------------------------------ */
  PRODUCT_GROUPS: [
    { id: "computer",  name: "컴퓨터",     desc: "데스크탑 · 노트북 · 맥 · 워크스테이션", icon: "grid",    ids: ["desktop", "laptop", "mac", "workstation"] },
    { id: "software",  name: "소프트웨어", desc: "윈도우 · 오피스 · 한글 · 보안 프로그램", icon: "spark",   ids: ["software"] },
    { id: "office",    name: "사무기기",   desc: "복합기 · 플로터 · 세단기 · 전자칠판 · 복사용지", icon: "printer", ids: ["copier", "plotter", "shredder", "board", "paper"] },
    { id: "network",   name: "네트워크",   desc: "NAS · 공유기 · 스위치 · 배선 · 보안", icon: "shield",  ids: ["nas", "network"] },
    { id: "appliance", name: "가전",       desc: "공기청정기 · 냉난방", icon: "star",    ids: ["air"] },
  ],

  /* ── 렌탈 패키지 ───────────────────────────────────────────
   * 본사 쇼핑몰의 실제 패키지 상품입니다. 사진도 그 상품 사진 그대로입니다.
   * ------------------------------------------------------------ */
  PACKAGES: [
    { id: "pkg-air", name: "복합기 + 공기청정기", img: "assets/img/pkg-air.jpg",
      desc: "사무실 공기까지 한 번에. 복합기 렌탈에 공기청정기를 묶어 따로 계약할 필요가 없습니다.",
      link: "https://firstoa.co.kr/shop.php?goPage=GoodList&cat_no=23" },
    { id: "pkg-shred", name: "복합기 + 문서세단기", img: "assets/img/pkg-shred.jpg",
      desc: "출력한 문서를 안전하게 폐기까지. 개인정보 관리가 필요한 사무실에 가장 많이 나갑니다.",
      link: "https://firstoa.co.kr/shop.php?goPage=GoodList&cat_no=24" },
    { id: "pkg-nas", name: "복합기 + NAS 네트워크", img: "assets/img/pkg-nas.jpg",
      desc: "스캔한 문서가 바로 사내 저장소로. 2TB · 4TB 구성으로 자료 공유와 백업을 함께 해결합니다.",
      link: "https://firstoa.co.kr/shop.php?goPage=GoodList&cat_no=25" },
  ],

  /* ── 사용량 카운터 확인 방법 ───────────────────────────────
   * 브랜드마다 화면이 다릅니다. 기종별로 쓰지 않고 브랜드 단위로 정리합니다.
   * 같은 브랜드라도 연식에 따라 메뉴 이름이 조금 다를 수 있어, 화면을 사진으로
   * 찍어 보내는 방법을 항상 함께 안내합니다(그게 제일 정확하고 빠릅니다).
   * ------------------------------------------------------------ */
  METER: {
    /* 2026-10-09: CS팀이 실제로 안내하는 기종별 방법으로 교체(이전 일반 안내는 실제와 달랐음).
     * brands[] 한 칸 = 화면의 카드 하나. groups[] = 그 안의 기종 묶음. send = 보내주실 것(출력물 / 화면).
     * 기종 이름은 고객이 보는 이름(앞면 모델명)으로 적고, 사내 별칭(키슈·세이토 등)은 적지 않습니다. */
    why: "복합기 요금은 실제로 출력한 장수로 정산합니다. 매달 흑백·컬러 매수를 알려주셔야 요금이 정확하게 계산됩니다.",
    best: "카운터가 나온 화면이나 출력물을 그대로 사진으로 찍어 카카오톡으로 보내주시는 것이 가장 정확합니다. 숫자를 옮겨 적다 한 자리 틀리는 일이 자주 있습니다.",
    brands: [
      { brand: "samsung", label: "삼성", groups: [
        { models: "MX6 시리즈", send: "출력물",
          steps: ["홈 화면을 오른쪽으로 넘깁니다.",
                  "[보고서] → [구성/상태 페이지] → [사용 페이지]로 들어갑니다.",
                  "프린터 모양(인쇄) 버튼을 눌러 출력한 뒤 사진으로 찍어 보내주세요."] },
        { models: "X3220", send: "출력물",
          steps: ["숫자 키패드 위의 [카운터] 버튼을 누릅니다.",
                  "화면에서 [인쇄]를 누릅니다.",
                  "나온 출력물을 사진으로 찍어 보내주세요."] },
        { models: "X4220 · X7400", send: "출력물",
          steps: ["화면에서 [카운터]를 누릅니다.",
                  "화면 오른쪽 위의 인쇄 모양을 누릅니다.",
                  "나온 출력물을 사진으로 찍어 보내주세요."] },
      ] },
      { brand: "xerox", label: "제록스 · 후지필름", groups: [
        { models: "C2270 · C2275 · C2276 · C3375 / C2263 · C2265 / C2271 · C2273 · C3371 · C3373 / C5585 · C6680", send: "화면",
          steps: ["키패드의 [기계 확인] 버튼을 누릅니다.",
                  "나온 화면을 그대로 사진으로 찍어 보내주세요."],
          tip: "기종에 따라 [사용 매수 확인]을 한 번 더 눌러야 숫자가 보입니다." },
        { models: "C2060 / C3070 · C3570 · C4570 · C5570 · C7070 / Apeos 신형", send: "화면",
          steps: ["화면의 톱니바퀴 모양을 누릅니다.",
                  "[사용 매수 확인]을 누릅니다.",
                  "맨 위 시리얼 번호부터 맨 아래 총 매수까지 한 화면에 나오게 사진으로 찍어 보내주세요."] },
        { models: "DocuPrint CM305", send: "출력물",
          steps: ["[기계 확인 / 사양 설정]을 누릅니다.",
                  "[리포트] → [프린터 사용량] → OK 를 누릅니다.",
                  "나온 리포트를 사진으로 찍어 보내주세요."] },
        { models: "5005", send: "출력물",
          steps: ["[사양 설정] → [리포트] → [기능 설정 리스트]를 출력합니다.",
                  "나온 출력물을 사진으로 찍어 보내주세요."] },
      ] },
      { brand: "sindoh", label: "신도리코", groups: [
        { models: "D320 · D410 · D420 · D450", send: "화면",
          steps: ["[홈] 버튼을 눌러 메인 화면으로 나옵니다.",
                  "화면 왼쪽 위의 [카운터]를 누릅니다.",
                  "나온 화면을 사진으로 찍어 보내주세요."] },
        { models: "410 · 450 (버튼식)", send: "출력물",
          steps: ["기기의 [메뉴] 버튼을 누릅니다.",
                  "화면 위쪽 [카운터] → [목록 인쇄] → [시작]을 누릅니다.",
                  "나온 출력물을 사진으로 찍어 보내주세요."] },
        { models: "400", send: "화면",
          steps: ["[기기 유틸리티 / 카운터] 버튼을 누릅니다.",
                  "왼쪽 위의 [미터 카운트]를 누릅니다.",
                  "총 카운터 · 흑백 카운터 · 컬러 카운터가 나온 화면을 사진으로 찍어 보내주세요."] },
      ] },
      { brand: "kyocera", label: "교세라", groups: [
        { models: "M5521 · M5526 · MA2100", send: "출력물",
          steps: ["왼쪽 아래의 [시스템 메뉴 / 카운터] 버튼을 누릅니다.",
                  "화면에서 [리포트] → [리포트 인쇄] → [스테이터스 페이지]를 출력합니다.",
                  "나온 출력물을 사진으로 찍어 보내주세요."] },
        { models: "2101", send: "화면",
          steps: ["화면 맨 아래 가운데의 점 세 개(…)를 누릅니다.",
                  "아래 화살표 한 번 → [카운터 확인] → [기본 설정] → [인쇄 페이지 수]로 들어갑니다.",
                  "아래 화살표를 한 번 더 내린 뒤 화면을 사진으로 찍어 보내주세요."],
          tip: "시리얼 번호도 필요하면 바로 위의 [상태 페이지 인쇄]를 눌러 주세요." },
      ] },
      { brand: "brother", label: "브라더", groups: [
        { models: "MFC-L5700", send: "출력물",
          steps: ["화면의 공구(도구) 모양을 누릅니다.",
                  "[보고서 인쇄] → [프린터 설정]을 누릅니다.",
                  "4장 중 3번째 장을 사진으로 찍어 보내주세요."] },
        { models: "L5100", send: "출력물",
          steps: ["[+] 버튼을 누르고 [Machine Info] → OK 를 누릅니다.",
                  "[Print Settings] → OK → [Go](시작) 버튼을 누릅니다.",
                  "4장 중 3번째 장만 사진으로 찍어 보내주세요."] },
      ] },
      { brand: "etc", label: "오키", groups: [
        { models: "OKI 5473", send: "출력물",
          steps: ["화면에서 [장치 설정] → [보고서] → [시스템] → [인쇄 집계 결과]를 눌러 출력합니다.",
                  "나온 출력물을 사진으로 찍어 보내주세요."] },
      ] },
      { brand: "etc", label: "리코", groups: [
        { models: "전 기종", send: "출력물 또는 화면",
          steps: ["홈 화면 오른쪽 가운데의 앱(네모) 아이콘을 누릅니다.",
                  "[사용자 도구] → [카운터]로 들어갑니다.",
                  "[카운터 목록 인쇄]로 뽑아 사진을 찍거나, 화면에 나온 사용 매수를 그대로 찍어 보내주세요."] },
      ] },
      { brand: "hp", label: "HP", groups: [
        { models: "OfficeJet · LaserJet (터치 화면)", send: "출력물",
          steps: ["메인 화면 위쪽을 아래로 끌어내립니다.",
                  "톱니바퀴 아이콘 → 목록 아래의 [보고서]를 누릅니다.",
                  "[상태 보고서]를 찾아 인쇄한 뒤 사진으로 찍어 보내주세요."] },
      ] },
      { brand: "etc", label: "렉스마크", groups: [
        { models: "MX410", send: "출력물",
          steps: ["집 모양 → 스패너 모양 → [보고서]를 누릅니다.",
                  "[장치 통계]를 눌러 출력합니다.",
                  "장치 통계 2페이지를 사진으로 찍어 보내주세요."] },
      ] },
    ],
    cautions: [
      "여기 없는 기종은 카카오톡으로 기종명(앞면 라벨)을 보내주시면 바로 안내해 드립니다.",
      "숫자를 손으로 옮겨 적기보다 화면·출력물 사진이 정확합니다. 시리얼 번호가 같이 나오면 더 좋습니다.",
      "매달 같은 시기에 알려주시면 요금이 정확하게 정산됩니다.",
    ],
  },

  /* ── 이용 안내 (관리 · 검침) ────────────────────────────────
   * 고장이 아닌데 고장으로 오해하기 쉬운 것들, 그리고 미리 알면 서로 편한 운영 원칙.
   * ------------------------------------------------------------ */
  NOTICES: [
    { id: "humid", icon: "drop", tag: "장마철 · 여름", title: "장마철에 용지가 자주 걸립니다",
      lead: "고장이 아니라 용지가 습기를 먹은 것입니다.",
      body: ["종이는 습기를 빨아들이면 물결처럼 휘고 서로 달라붙습니다. 그 상태로 급지되면 걸리거나 두 장씩 딸려 들어갑니다.",
             "용지함에 오래 넣어둔 용지를 빼내고, 새 묶음을 뜯어 넣어 보세요. 대부분 바로 좋아집니다.",
             "남은 용지는 포장을 다시 접어 밀봉하고, 바닥이 아니라 선반 위에 보관해 주세요."],
      tip: "새 용지로 바꿔도 계속 걸리면 그때 연락 주세요. 롤러 문제일 수 있습니다." },

    { id: "static", icon: "snow", tag: "겨울철 · 건조할 때", title: "겨울에 용지가 두 장씩 들어갑니다",
      lead: "건조한 공기 때문에 종이끼리 정전기로 붙습니다.",
      body: ["용지 묶음을 손에 쥐고 한쪽 끝을 부채처럼 여러 번 훑어 바람을 넣어 주세요. 붙어 있던 장이 떨어집니다.",
             "용지함에 너무 가득 채우지 마시고, 안쪽 최대선(▽) 아래로 넣어 주세요.",
             "가습기를 쓰는 사무실은 확실히 덜 생깁니다."],
      tip: "두 장씩 들어가면 카운터도 두 장으로 올라갑니다. 자주 생기면 알려주세요." },

    { id: "visit", icon: "calendar", tag: "방문 안내", title: "접수하신 날 바로 방문은 어렵습니다",
      lead: "당일 방문이 원칙이 아닙니다. 순서대로 배정됩니다.",
      body: ["엔지니어 한 명이 하루에 도는 곳이 정해져 있어, 접수 순서와 지역에 따라 일정이 잡힙니다.",
             "업무가 완전히 멈춘 상황(전혀 출력이 안 됨)은 먼저 배정합니다. 접수하실 때 그 점을 꼭 말씀해 주세요.",
             "증상 사진을 미리 보내주시면 부품을 챙겨 한 번에 끝낼 수 있어 방문 횟수가 줄어듭니다."],
      tip: "" },

    { id: "paper-keep", icon: "box", tag: "상시", title: "용지는 이렇게 보관해 주세요",
      lead: "용지 보관 상태가 걸림의 절반을 좌우합니다.",
      body: ["뜯은 묶음은 포장지를 다시 접어 덮어 두세요. 공기에 그대로 두면 눅눅해집니다.",
             "바닥에 직접 두지 마시고 선반이나 캐비닛에 눕혀서 보관하세요. 세워 두면 휩니다.",
             "직사광선이 드는 창가, 난방기 바로 옆은 피해 주세요."],
      tip: "" },

    { id: "supply", icon: "toner", tag: "상시", title: "토너는 미리 신청해 주세요",
      lead: "다 떨어진 뒤에 신청하면 그날 못 씁니다.",
      body: ["화면에 '토너 부족' 이 뜨면 아직 조금 남은 상태입니다. 그때 신청하시면 여유 있게 도착합니다.",
             "완전히 떨어져 인쇄가 멈춘 뒤 신청하시면 배송·방문 시간만큼 업무가 멈춥니다.",
             "다 쓴 토너와 폐토너통은 버리지 마시고 모아두시면 방문 때 수거합니다."],
      tip: "카카오톡으로 기종과 색상만 알려주셔도 접수됩니다." },

    { id: "power", icon: "power", tag: "상시", title: "전원은 끄지 않으셔도 됩니다",
      lead: "절전 모드가 있어 꺼두는 것보다 낫습니다.",
      body: ["복합기는 켜질 때 정착기를 데우느라 전기를 가장 많이 씁니다. 매일 껐다 켜면 오히려 손해입니다.",
             "쓰지 않을 때는 자동으로 절전 모드로 들어갑니다. 그대로 두시면 됩니다.",
             "장기 휴무로 일주일 넘게 비울 때만 전원을 내려주세요."],
      tip: "전원을 내리실 때는 반드시 조작부 전원 버튼으로 먼저 종료한 뒤 콘센트를 빼주세요." },

    { id: "move", icon: "pin", tag: "운영", title: "복합기를 옮기셔야 할 때 (사무실 이전 · 배치 변경)",
      lead: "복합기는 일반 짐처럼 옮기면 고장이 납니다. 옮기실 계획이 잡히면 먼저 알려주세요.",
      body: ["복합기 안에는 토너 가루가 든 부품이 있어 기울이거나 눕히면 내부에 가루가 쏟아지고, 유리와 드럼은 충격에 쉽게 깨집니다.",
             "가장 안전한 방법은 저희에게 맡기시는 것입니다. 운반비(물류비)만 부담하시면 포장 · 운반 · 재설치와 수평 맞춤, 네트워크 연결까지 한 번에 해드립니다.",
             "이삿짐센터로 옮기실 때는 반드시 세운 채로 고정해 옮기고, 운반 중 파손에 대비해 이삿짐센터의 적재물(파손) 보험이 적용되는지 미리 확인해 주세요. 보험이 없으면 파손 수리비를 고객이 부담하시게 될 수 있습니다.",
             "같은 사무실 안에서 조금 미는 정도는 전원을 끄고 바퀴 잠금을 푼 뒤, 기울이지 않게 천천히 밀어 옮기시면 됩니다. 옮긴 뒤 바퀴를 다시 잠가 주세요."],
      tip: "옮긴 뒤 줄 · 얼룩이 생기거나 네트워크 인쇄가 안 되면 그때 연락 주세요." },
  ],

  /* ── 작업 분류 ─────────────────────────────────────────────── */
  CATEGORIES: [
    { id: "consumable", name: "소모품 교체", icon: "toner", desc: "토너 · 폐토너통" },
    { id: "fix",        name: "자주 생기는 문제", icon: "error", desc: "줄 · 걸림 · 에러 표시" },
    { id: "manage",     name: "관리 · 검침",   icon: "meter", desc: "카운터 확인" },
  ],

  /* ── 작업 종류 ──────────────────────────────────────────────
   * 모든 기종이 공유하는 표준 작업입니다.
   * steps(기본 순서)는 기종이 달라도 대체로 통하는 내용만 적어 두었습니다.
   * 정확한 절차는 영상이 기준이며, 기종마다 다르면 아래 MODELS 의 notes 로 덮어쓸 수 있습니다.
   * ------------------------------------------------------------ */
  TASKS: [
    {
      id: "toner", cat: "consumable", title: "토너 교체", icon: "toner", minutes: 3,
      summary: "화면에 토너 부족·교체 표시가 뜰 때",
      steps: [
        "화면에 표시된 색상(K 검정 / C 파랑 / M 빨강 / Y 노랑)을 확인합니다.",
        "복합기 앞쪽 커버를 엽니다. 전원은 켜 둔 상태로 진행합니다.",
        "해당 색상 토너를 앞으로 당겨 빼냅니다.",
        "새 토너를 가로로 눕혀 5~6회 좌우로 흔듭니다.",
        "화살표 방향으로 끝까지 밀어 넣고 커버를 닫습니다.",
        "화면의 교체 안내가 사라지면 정상입니다.",
      ],
      cautions: [
        "토너 가루가 옷에 묻으면 찬물로 터세요. 뜨거운 물은 굳습니다.",
        "다 쓴 토너는 버리지 마시고 모아두면 방문 시 수거합니다.",
      ],
    },
    {
      // 잉크젯(HP 오피스젯)은 토너가 아니라 잉크 카트리지입니다(2026-10-09). 기종의 videos 에 ink 칸이 있으면 이 작업이 나옵니다.
      id: "ink", cat: "consumable", title: "잉크 카트리지 교체", icon: "toner", minutes: 3,
      summary: "화면에 잉크 부족 · 교체 표시가 뜰 때",
      steps: [
        "카트리지 덮개를 열고 카트리지 받침대가 가운데로 움직여 멈출 때까지 기다립니다.",
        "빈 카트리지를 살짝 눌러 걸쇠를 풀고 빼냅니다.",
        "새 카트리지의 보호 테이프를 떼고, 색 표시에 맞춰 딸깍 소리가 날 때까지 밀어 넣습니다.",
        "덮개를 닫고 화면 안내에 따라 정렬 페이지를 인쇄합니다.",
      ],
      cautions: [
        "카트리지의 금색 접점과 노즐은 손으로 만지지 마세요.",
        "카트리지를 뺀 채 오래 두면 노즐이 마릅니다. 새 카트리지를 준비한 뒤 바꿔 주세요.",
      ],
    },
    {
      id: "waste", cat: "consumable", title: "폐토너통 교체", icon: "waste", minutes: 3,
      summary: "폐토너통 가득 참 표시가 뜰 때",
      steps: [
        "앞쪽 커버를 열고 폐토너통 위치를 확인합니다.",
        "통을 수평으로 천천히 당겨 빼냅니다.",
        "빼낸 통은 눕히지 말고 세워서 옆에 둡니다.",
        "새 통을 딸깍 소리가 날 때까지 밀어 넣습니다.",
        "커버를 닫고 표시가 사라지는지 확인합니다.",
      ],
      cautions: [
        "빼낸 폐토너통을 기울이거나 눕히면 가루가 쏟아집니다. 반드시 세워 두세요.",
        "가득 찬 폐토너통은 비워서 재사용하지 마세요. 기기 고장 원인입니다.",
      ],
    },
    {
      id: "drum", cat: "consumable", title: "드럼 교체", icon: "drum", minutes: 5,
      summary: "드럼 교체 안내가 뜰 때",
      steps: [
        "앞쪽 커버를 열고 드럼 위치를 확인합니다.",
        "고정 레버를 풀고 드럼을 수평으로 빼냅니다.",
        "새 드럼의 보호 필름·테이프를 모두 제거합니다.",
        "레일에 맞춰 끝까지 밀어 넣고 레버를 잠급니다.",
      ],
      cautions: [
        "드럼 표면에 손이 닿으면 인쇄에 자국이 남습니다.",
        "밝은 빛에 오래 두지 마세요. 꺼낸 뒤 바로 장착하세요.",
      ],
    },
    {
      id: "meter", cat: "manage", title: "검침 카운터 확인", icon: "meter", minutes: 1, art: "panel-meter", // art: 영상이 없을 때 카드에 그리는 그림(assets/ui.js)
      summary: "매달 알려주셔야 하는 흑백·컬러 장수 보는 법",
      steps: [
        "화면에서 기기 정보 또는 카운터 항목을 찾습니다.",
        "흑백(B/W)과 컬러(Color) 총 매수를 확인합니다.",
        "화면을 사진으로 찍어 담당자에게 보내주시면 가장 정확합니다.",
      ],
      cautions: ["매달 같은 시기에 알려주시면 요금이 정확하게 정산됩니다."],
    },
  ],

  /* ── 간단 AS 처리 ─────────────────────────────────────────
   * 기종마다 따로 쓰지 않습니다. 브랜드가 같으면 방법이 거의 같기 때문에
   * scope 로 적용 범위만 정하면 해당하는 기종 화면에 모두 나타납니다.
   *
   *   scope: { all: true }               모든 기종
   *   scope: { brand: "samsung" }        그 브랜드 전체
   *   scope: { models: ["xerox-c2263"] } 지정한 기종만 (제록스 시스템 설정처럼 갈리는 것)
   *
   * steps 가 비어 있으면 화면에 "내용 준비 중"으로 표시됩니다.
   * 확인되지 않은 절차를 지어내지 않기 위해 일부러 비워 둔 것입니다.
   * ------------------------------------------------------------ */
  FIXES: [
    { id: "jam", scope: { all: true }, title: "용지 걸림", icon: "jam", minutes: 3,
      summary: "용지 걸림 · JAM 표시가 뜰 때", video: "",
      videos: { samsung: "xxPDPqYOViE" }, /* 삼성 AS 영상(2026-10-09): 용지걸림에러, M2 1317 에러 */
      steps: [
        "화면에 표시된 위치 번호를 먼저 확인합니다. 표시된 곳부터 여세요.",
        "용지를 나가던 방향으로 천천히 당겨 뺍니다.",
        "찢어진 조각이 남지 않았는지 확인합니다.",
        "커버를 모두 닫으면 자동으로 다시 시작합니다.",
      ],
      cautions: [
        "억지로 반대 방향으로 당기면 롤러가 상합니다.",
        "정착기(퓨저) 쪽은 뜨겁습니다. 화면에 표시된 부분만 여세요.",
        "종이가 찢어져 안에 남았으면 무리하지 마시고 연락 주세요.",
      ] },

    { id: "adf-jam", scope: { all: true }, title: "ADF 용지 걸림 (이물질)", icon: "jam", minutes: 3,
      summary: "위쪽 자동급지대에서 원본이 걸릴 때", video: "",
      videos: { samsung: "sjxiKdqiYbE" }, /* 삼성 AS 영상(2026-10-09): ADF 용지걸림 이물질 제거 코팅지로 해결 */
      steps: [
        "위쪽 급지대 덮개를 엽니다.",
        "걸린 원본을 나가던 방향으로 천천히 빼냅니다.",
        "스테이플·클립·포스트잇 같은 이물질이 남아 있는지 확인합니다.",
        "덮개를 닫고 다시 시도합니다.",
      ],
      cautions: ["스테이플이 박힌 원본은 급지대에 넣지 마세요. 걸림과 유리 손상의 가장 큰 원인입니다."] },

    { id: "line-copy", scope: { all: true }, title: "복사할 때 줄이 나옴", icon: "quality", minutes: 3,
      summary: "복사물에만 세로줄이 생길 때", video: "",
      videos: { samsung: "R94JAaRZkRE" }, /* 삼성 AS 영상(2026-10-09): 복사,스캔시 줄나옴 증상 유리 PM */
      steps: [
        "덮개를 열고 유리면을 마른 부드러운 천으로 닦습니다.",
        "위쪽 급지대(ADF) 쪽의 좁고 긴 유리띠도 함께 닦습니다.",
        "다시 복사해 줄이 사라졌는지 확인합니다.",
      ],
      cautions: [
        "유리띠에 묻은 작은 이물질 하나가 복사물 전체에 줄을 만듭니다. 여기부터 확인하세요.",
        "닦아도 그대로면 기기 안쪽 문제이니 연락 주세요.",
      ] },

    { id: "line-print", scope: { all: true }, title: "출력할 때 흰 줄이 나옴", icon: "quality", minutes: 3,
      summary: "PC에서 출력한 것에 흰 줄·빠진 부분이 생길 때", video: "",
      videos: { samsung: "X_wbjG8dxKI" }, /* 삼성 AS 영상(2026-10-09): 출력시 흰줄,연하게 출력시 처리 방법 */
      steps: [
        "어느 색에서 빠지는지 확인합니다.",
        "해당 색 토너를 빼서 좌우로 5~6회 흔든 뒤 다시 넣습니다.",
        "몇 장 출력해 보고 그대로면 인쇄물을 사진 찍어 보내주세요.",
      ],
      cautions: ["증상 사진 한 장이면 방문 전에 부품을 챙겨갈 수 있어 훨씬 빨리 해결됩니다."] },

    { id: "glass-pm", scope: { all: true }, title: "유리 PM (유리면 청소)", icon: "clean", minutes: 3,
      summary: "정기적으로 해두면 줄·얼룩이 크게 줄어듭니다", video: "",
      videos: { samsung: "R94JAaRZkRE" }, /* 삼성 AS 영상(2026-10-09): 복사,스캔시 줄나옴 증상 유리 PM (복사 줄과 같은 영상) */
      steps: [
        "덮개를 열고 유리면 전체를 마른 부드러운 천으로 닦습니다.",
        "급지대 쪽 좁고 긴 유리띠를 특히 꼼꼼히 닦습니다.",
        "덮개 안쪽 흰 판도 함께 닦습니다.",
      ],
      cautions: ["알코올·세제를 유리에 직접 뿌리지 마세요. 천에 살짝 묻혀 닦습니다."] },

    /* ↓ 아래 세 가지는 글 순서(steps)가 아직 없습니다. 삼성은 영상이 있어 삼성 기종 화면에만 나오고,
       글 순서도 영상도 없는 브랜드에서는 목록에서 자동으로 빠집니다(2026-10-09). steps 를 채우면 바로 나옵니다.
       증상 영상은 video(공통) 또는 videos: { samsung: "…" }(브랜드별) 에 넣습니다. */
    { id: "adf-guide", scope: { brand: "samsung" }, title: "ADF 가이드 조정", icon: "paper", minutes: 5,
      summary: "원본이 비뚤게 들어가거나 한쪽만 걸릴 때", video: "",
      videos: { samsung: "GJwR5_t-ons" }, /* 삼성 AS 영상(2026-10-09): 복사,스캔 시 상 틀어짐 ADF 가이드조정 */ steps: [], cautions: [] },

    { id: "tray-guide", scope: { brand: "samsung" }, title: "트레이 가이드 조정 (틀어짐)", icon: "paper", minutes: 5,
      summary: "용지함에서 비뚤게 급지되거나 자주 걸릴 때", video: "",
      videos: { samsung: "VVAUqVdQneg" }, /* 삼성 AS 영상(2026-10-09): 출력시 틀어짐 용지 트레이 가이드조정 */ steps: [], cautions: [] },

    { id: "acr-ctd", scope: { brand: "samsung" }, title: "ACR · CTD 센서 에러", icon: "error", minutes: 5,
      summary: "화면에 ACR 또는 CTD 센서 관련 오류가 표시될 때", video: "",
      videos: { samsung: "SaDQsqdgtLA" }, /* 삼성 AS 영상(2026-10-09): ACR,CTD센서 오염 처리 방법 */ steps: [], cautions: [] },
  ],

  /* ── 브랜드 ────────────────────────────────────────────────── */
  BRANDS: [
    { id: "samsung", name: "삼성", full: "삼성 / HP 삼성", accent: "#2F6BFF" },
    { id: "sindoh", name: "신도리코", full: "신도리코 SINDOH", accent: "#0FA3A0" },
    { id: "xerox", name: "제록스", full: "후지제록스 / 후지필름", accent: "#E0393E" },
    { id: "kyocera", name: "교세라", full: "교세라 TASKalfa", accent: "#6D4AFF" },
    { id: "brother", name: "브라더", full: "브라더 Brother", accent: "#1FA55C" },
    { id: "hp", name: "HP", full: "HP OfficeJet / LaserJet", accent: "#0B8FD4" },
    { id: "etc", name: "그 외", full: "오키 · 렉스마크 등", accent: "#64748B" },
  ],

  /* ── 기종 ──────────────────────────────────────────────────
   * 기종 묶음은 유튜브 영상 썸네일에 적힌 모델 번호를 그대로 따랐습니다.
   * (예: 썸네일 "C2263 C2265 C2060" → 한 카드)
   *
   * name  = 고객 화면에 크게 보이는 이름. 기기에 붙은 번호 그대로.
   * full  = 그 아래 작게 보이는 정확한 모델 계열.
   * aka   = 화면에 안 보이는 검색용 별칭. 사내 코드명(키슈·세이토·마블·쇼부)은 여기에만.
   * photo = 직접 찍은 기기 사진 경로. 넣으면 일러스트 대신 사진이 나옵니다.
   * videos = 유튜브 영상 ID. 비우면 "영상 준비 중"으로 표시되고 글 순서만 나옵니다.
   *
   * 사진은 24종 전부 실제 제품 사진입니다(제조사·유통 카탈로그). 직접 찍은 사진으로
   * 바꾸려면 assets/img/ 에 넣고 photo 경로만 고치면 됩니다.
   * ------------------------------------------------------------ */
  MODELS: [
    {
      id: "samsung-3220", brand: "samsung",
      name: "삼성 3220",
      full: "SL-X3220 계열 컬러 복합기",
      aka: ["3220", "3250", "3255", "3280", "MX3", "X3220", "엑스3"],
      device: "floor-color",
      photo: "assets/img/m-samsung-3220.jpg",
      videos: {
        toner: "RODkrd6bfeY", // 3220 토너 교체 방법
        waste: "bBUR7V6VRYs", // 3220,4220 폐통 교체 방법
        meter: "",
      },
      notes: {
        waste: "폐통 교체 영상은 3220과 4220이 같습니다.",
      },
    },
    {
      id: "samsung-4220", brand: "samsung",
      name: "삼성 4220",
      full: "SL-X4220 계열 컬러 복합기",
      aka: ["4220", "4225", "4255", "4300", "4305", "4350", "4355", "MX4", "X4220"],
      device: "floor-color",
      photo: "assets/img/m-samsung-4220.jpg",
      videos: {
        toner: "0ZQ_yvoX85c", // 4220 토너 교체 방법
        waste: "bBUR7V6VRYs", // 3220,4220 폐통 교체 방법
        meter: "",
      },
      notes: {
        waste: "폐통 교체 영상은 3220과 4220이 같습니다.",
      },
    },
    {
      id: "samsung-x7500", brand: "samsung",
      name: "삼성 x7500",
      full: "SL-X7500 계열 컬러 복합기",
      aka: ["7500", "7400", "7600", "MX7", "X7500", "엑스7"],
      device: "floor-color",
      photo: "assets/img/m-samsung-x7500.jpg",
      videos: {
        toner: "moTYQ3usG9c", // x7500 토너 교체 방법
        waste: "2JuxnMC19p8", // x7500 폐통 교체 방법
        meter: "",
      },
      notes: {},
    },
    {
      id: "samsung-k4250", brand: "samsung",
      name: "삼성 K4250",
      full: "SL-K4250 계열 흑백 복합기",
      aka: ["K4250", "4250", "흑백", "케이4250"],
      device: "floor-mono",
      photo: "assets/img/m-samsung-k4250.jpg",
      videos: {
        toner: "Swn0LRQpoi8", // K4250 토너 교체 방법
        waste: "OzhlvZ4f0E8", // K4250 폐통 교체 방법
        meter: "",
      },
      notes: {},
    },
    {
      id: "samsung-k7500", brand: "samsung",
      name: "삼성 K7500",
      full: "SL-K7500 계열 흑백 복합기",
      aka: ["K7500", "흑백", "케이7500"],
      device: "floor-mono",
      photo: "assets/img/m-samsung-k7500.jpg",
      videos: {
        toner: "cythI1d3bwU", // k7500 토너 교체 방법
        waste: "4D9fZRltgMQ", // k7500 폐통 교체방법
        meter: "",
      },
      notes: {},
    },
    {
      id: "samsung-clx9201", brand: "samsung",
      name: "삼성 CLX-9201 · 9251 · 9301",
      full: "대형 컬러 복합기",
      aka: ["9201", "9251", "9301", "CLX"],
      device: "floor-color",
      photo: "assets/img/m-samsung-clx9201.jpg",
      videos: {
        toner: "",
        waste: "",
        meter: "",
      },
      notes: {},
    },
    {
      id: "sindoh-d420", brand: "sindoh",
      name: "신도리코 D420",
      full: "D320 · D410 · D420 공통",
      aka: ["320", "321", "410", "411", "420", "422", "D420", "D410", "D320"],
      device: "floor-color",
      photo: "assets/img/m-sindoh-d420.jpg",
      videos: {
        toner: "us13Br3-aBM", // 320,410,420 토너 교체 방법
        waste: "e_iTXoxXwM8", // 320,410,420 폐통 교체 방법
        meter: "",
      },
      notes: {
        toner: "D320 · D410 · D420 모두 같은 방법입니다.",
      },
    },
    {
      id: "sindoh-d450", brand: "sindoh",
      name: "신도리코 D450",
      full: "D450 · D451 · D452",
      aka: ["450", "451", "452", "D450"],
      device: "floor-color",
      photo: "assets/img/m-sindoh-d450.jpg",
      videos: {
        toner: "JvlmiOwwRo4", // 450 토너 교체 방법
        waste: "R1iJHkdYDes", // 450 폐통 교체 방법
        meter: "",
      },
      notes: {},
    },
    {
      id: "sindoh-n501", brand: "sindoh",
      name: "신도리코 N501",
      full: "N501 · N502",
      aka: ["501", "502", "N501", "엔501"],
      device: "floor-mono",
      photo: "assets/img/m-sindoh-n501.jpg",
      videos: {
        toner: "WYMZ-5k4prs", // N501 토너 교체 방법
        waste: "6Stqgvl5Rf8", // N501 폐통 교체 방법
        meter: "",
      },
      notes: {},
    },
    {
      id: "sindoh-d600", brand: "sindoh",
      name: "신도리코 N600 · D600",
      full: "A3 흑백 복합기",
      aka: ["600", "601", "D600", "N600"],
      device: "floor-color",
      photo: "assets/img/m-sindoh-d600.jpg",
      videos: {
        toner: "",
        waste: "",
        meter: "",
      },
      notes: {},
    },
    {
      id: "xerox-c2270", brand: "xerox",
      name: "제록스 C2270 · C2275 · C2276",
      full: "ApeosPort-IV / DocuCentre-V 계열",
      aka: ["키슈", "세이토", "2270", "2275", "2276", "3370", "3375", "C2270", "C2276"],
      device: "floor-color",
      photo: "assets/img/m-xerox-c2270.jpg",
      videos: {
        toner: "DFJcuPt5yZk", // 키슈,세이토 토너 교체 방법
        waste: "LIhB66g5V6s", // 키슈,세이토 토너 회수통R5 교체 방법
        meter: "",
      },
      notes: {
        waste: "이 기종의 회수통 부품 이름은 R5 입니다. 주문하실 때 이 이름으로 말씀하시면 됩니다.",
      },
    },
    {
      id: "xerox-c2263", brand: "xerox",
      name: "제록스 C2263 · C2265 · C2060",
      full: "DocuCentre-V · ApeosPort 계열",
      aka: ["마블", "2263", "2265", "2060", "C2263", "C2265", "C2060"],
      device: "floor-color",
      photo: "assets/img/m-xerox-c2263.jpg",
      videos: {
        toner: "3XZ7PJaull4", // 마블 토너 교체 방법
        waste: "yBCH8_ouEmM", // 마블 토너 회수통R5 교체 방법
        meter: "",
      },
      notes: {
        waste: "이 기종의 회수통 부품 이름은 R5 입니다. 주문하실 때 이 이름으로 말씀하시면 됩니다.",
      },
    },
    {
      id: "xerox-c2271", brand: "xerox",
      name: "제록스 C2271 · C2273 · C3371 · C3373",
      full: "ApeosPort-VI / VII 계열",
      aka: ["베니", "보탄", "2271", "2273", "3371", "3373", "C2271", "C3371"],
      device: "floor-color",
      photo: "assets/img/m-xerox-c2271.jpg",
      videos: {
        toner: "OG7jeQmpsbs", // 베니 토너 교체 방법
        waste: "WsK67N5FjC4", // 베니 토너 회수통R5 교체 방법
        meter: "",
      },
      notes: {
        waste: "이 기종의 회수통 부품 이름은 R5 입니다. 주문하실 때 이 이름으로 말씀하시면 됩니다.",
      },
    },
    {
      id: "xerox-c3070", brand: "xerox",
      name: "제록스 C3070 · C3570 · C4570 · C5570 · C7070",
      full: "ApeosPort C 시리즈",
      aka: ["쇼부", "3070", "3570", "4570", "5570", "7070", "C3070", "C7070"],
      device: "floor-color",
      photo: "assets/img/m-xerox-c3070.jpg",
      videos: {
        toner: "Gc_NI3IdhuI", // 쇼부 토너 교체 방법
        waste: "P6-hVPSTV8Q", // 쇼부 토너 회수통R5 교체 방법
        meter: "",
      },
      notes: {
        waste: "이 기종의 회수통 부품 이름은 R5 입니다. 주문하실 때 이 이름으로 말씀하시면 됩니다.",
      },
    },
    {
      id: "xerox-c5585", brand: "xerox",
      name: "제록스 C5585 · C6680",
      full: "DocuCentre-V 대형기",
      aka: ["헤라", "5580", "5585", "6680", "C5585"],
      device: "floor-color",
      photo: "assets/img/m-xerox-c5585.jpg",
      videos: {
        toner: "",
        waste: "",
        meter: "",
      },
      notes: {},
    },
    {
      id: "xerox-sc2022", brand: "xerox",
      name: "제록스 SC2022",
      full: "DocuCentre SC2022",
      aka: ["SC2022", "2022"],
      device: "desktop",
      photo: "assets/img/m-xerox-sc2022.jpg",
      videos: {
        toner: "",
        waste: "",
        meter: "",
      },
      notes: {},
    },
    {
      id: "kyocera", brand: "kyocera",
      name: "교세라 5521 · 5526 · 2100",
      full: "TASKalfa 5521ci · 5526ci · 2100",
      aka: ["5521", "5526", "2100", "2101", "교세라", "TASKalfa"],
      device: "floor-color",
      photo: "assets/img/m-kyocera.jpg",
      videos: {
        toner: "pRqyQJ5Lqns", // 교세라 토너 교체 방법
        meter: "",
      },
      notes: {
        toner: "5521 · 5526 · 2100 모두 같은 방법입니다.",
      },
    },
    {
      id: "brother-5700", brand: "brother",
      name: "브라더 5700",
      full: "Brother MFC-L5700DN",
      aka: ["5700", "L5700"],
      device: "desktop",
      photo: "assets/img/m-brother-5700.jpg",
      videos: {
        toner: "3GypB534uSs", // 브라더 토너 교체 방법
        drum: "Vok3STCstrQ",  // 브라더 드럼 교체 방법
        meter: "",
      },
      notes: {
        drum: "드럼 부품 이름은 DR-3455 입니다.",
      },
    },
    {
      id: "brother-8900", brand: "brother",
      name: "브라더 8900",
      full: "Brother MFC-L8900CDW",
      aka: ["8900", "L8900"],
      device: "desktop",
      photo: "assets/img/m-brother-8900.jpg",
      videos: {
        toner: "",
        meter: "",
      },
      notes: {},
    },
    {
      id: "oki-5473", brand: "etc",
      name: "오키 5473",
      full: "OKI ES5473 / MC5473",
      aka: ["5473", "오키", "ES5473", "MC5473"],
      device: "desktop",
      photo: "assets/img/m-oki-5473.jpg",
      videos: {
        toner: "BvbcfG8QZYM", // 오키 토너 교체 방법
        meter: "",
      },
      notes: {},
    },
    {
      id: "lexmark-mx410", brand: "etc",
      name: "렉스마크 MX410",
      full: "Lexmark MX410",
      aka: ["MX410", "렉스마크"],
      device: "desktop",
      photo: "assets/img/m-lexmark-mx410.jpg",
      videos: {
        toner: "",
        meter: "",
      },
      notes: {},
    },
    {
      id: "hp-8710", brand: "hp",
      name: "HP OfficeJet Pro 8710 · 8720 · 8730",
      full: "잉크젯 복합기",
      aka: ["8710", "8720", "8730", "8600", "8610", "오피스젯"],
      device: "inkjet",
      photo: "assets/img/m-hp-8710.jpg",
      videos: {
        ink: "",   // 잉크젯 — 잉크 카트리지 교체(2026-10-09)
        meter: "",
      },
      notes: {},
    },
    {
      id: "hp-9010", brand: "hp",
      name: "HP OfficeJet Pro 9010 · 7740",
      full: "잉크젯 복합기",
      aka: ["9010", "7740"],
      device: "inkjet",
      photo: "assets/img/m-hp-9010.jpg",
      videos: {
        ink: "",   // 잉크젯 — 잉크 카트리지 교체(2026-10-09)
        meter: "",
      },
      notes: {},
    },
    {
      id: "hp-laser", brand: "hp",
      name: "HP LaserJet Pro M501dn",
      full: "A4 흑백 레이저 프린터",
      aka: ["M501", "501", "477", "530", "650", "레이저젯", "LaserJet"],
      device: "desktop",
      photo: "assets/img/m-hp-laser.jpg",
      videos: {
        toner: "",
        meter: "",
      },
      notes: {},
    },
  ],
};
