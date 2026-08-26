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
    title: "복합기 사용설명서",
    tagline: "토너 교체부터 검침까지, 영상 보고 그대로 따라 하세요",
    phone: "1522-1093",
    hours: "평일 09:00 – 18:00",
    kakao: "",                        // 카카오톡 채널 주소(있으면)
    channel: "https://www.youtube.com/channel/UCiXGLLxY8xwpcP1_-PQrlJw",
  },

  /* ── 작업 분류 ─────────────────────────────────────────────── */
  CATEGORIES: [
    { id: "consumable", name: "소모품 교체", icon: "toner", desc: "토너·폐토너통·드럼" },
    { id: "paper", name: "용지·걸림", icon: "paper", desc: "용지 넣기, 걸린 종이 빼기" },
    { id: "feature", name: "복사·스캔·팩스", icon: "printer", desc: "기본 사용법" },
    { id: "care", name: "관리·검침", icon: "spark", desc: "청소, 카운터 확인" },
    { id: "trouble", name: "문제 해결", icon: "error", desc: "화질 불량, 오류 표시" },
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
      id: "drum", cat: "consumable", title: "드럼(이미징 유닛) 교체", icon: "drum", minutes: 5,
      summary: "드럼 수명 경고가 뜨거나 인쇄물에 반복 자국이 생길 때",
      steps: [
        "표시된 색상의 드럼 위치를 확인합니다.",
        "고정 레버를 풀고 드럼을 수평으로 빼냅니다.",
        "새 드럼의 보호 필름·테이프를 모두 제거합니다.",
        "레일에 맞춰 끝까지 밀어 넣고 레버를 잠급니다.",
      ],
      cautions: [
        "드럼 표면(초록색·파란색 원통)에 손이 닿으면 인쇄에 자국이 남습니다.",
        "밝은 빛에 오래 두지 마세요. 꺼낸 뒤 바로 장착하세요.",
      ],
    },
    {
      id: "jam", cat: "paper", title: "걸린 용지 빼기", icon: "jam", minutes: 3,
      summary: "용지 걸림 / JAM 표시가 뜰 때",
      steps: [
        "화면에 표시된 위치 번호를 먼저 확인합니다. 표시된 곳부터 여세요.",
        "용지를 용지가 나가던 방향으로 천천히 당겨 뺍니다.",
        "찢어진 조각이 남지 않았는지 확인합니다.",
        "커버를 모두 닫으면 자동으로 다시 시작합니다.",
      ],
      cautions: [
        "억지로 반대 방향으로 당기면 롤러가 상합니다.",
        "정착기(퓨저) 쪽은 뜨겁습니다. 화면에 표시된 부분만 여세요.",
        "종이가 찢어져 안에 남았으면 무리하지 마시고 연락 주세요.",
      ],
    },
    {
      id: "paper", cat: "paper", title: "용지 넣기 · 용지함 설정", icon: "paper", minutes: 2,
      summary: "A4·A3 넣는 법과 용지함 크기 지정",
      steps: [
        "용지함을 끝까지 당겨 빼냅니다.",
        "용지를 가지런히 추슬러 가이드 안쪽에 넣습니다.",
        "좌우·뒤쪽 가이드를 용지 크기에 딱 맞게 붙입니다.",
        "용지함을 닫고, 화면에 뜨는 용지 크기 확인 창에서 맞는 크기를 선택합니다.",
      ],
      cautions: [
        "가이드가 헐거우면 비뚤게 들어가 걸림의 원인이 됩니다.",
        "용지함 안쪽 최대선(▽ 표시)을 넘겨 넣지 마세요.",
      ],
    },
    {
      id: "copy", cat: "feature", title: "복사 기본 사용법", icon: "copy", minutes: 2,
      summary: "양면, 매수, 확대·축소",
      steps: [
        "원본을 위쪽 급지대에 넣거나 유리면에 올립니다.",
        "매수를 입력하고 양면·컬러 여부를 고릅니다.",
        "시작 버튼을 누릅니다.",
      ],
      cautions: [],
    },
    {
      id: "scan", cat: "feature", title: "스캔해서 메일·USB로 보내기", icon: "scan", minutes: 3,
      summary: "스캔 파일을 메일이나 USB로 받는 방법",
      steps: [
        "원본을 급지대에 넣습니다.",
        "화면에서 스캔을 고르고 받을 곳(메일 주소 / USB)을 선택합니다.",
        "시작 버튼을 누르면 전송됩니다.",
      ],
      cautions: ["메일 주소를 새로 등록해야 하면 연락 주세요. 원격으로 넣어 드립니다."],
    },
    {
      id: "fax", cat: "feature", title: "팩스 보내기 · 받기", icon: "fax", minutes: 2,
      summary: "번호 입력과 수신 확인",
      steps: [
        "원본을 급지대에 넣습니다.",
        "팩스를 고르고 상대 번호를 지역번호부터 누릅니다.",
        "시작 버튼을 누르고 전송 결과를 확인합니다.",
      ],
      cautions: [],
    },
    {
      id: "meter", cat: "care", title: "검침 카운터 확인", icon: "meter", minutes: 1,
      summary: "매달 알려주셔야 하는 흑백·컬러 장수 보는 법",
      steps: [
        "화면에서 기기 정보 또는 카운터 항목을 찾습니다.",
        "흑백(B/W)과 컬러(Color) 총 매수를 확인합니다.",
        "화면을 사진으로 찍어 담당자에게 보내주시면 가장 정확합니다.",
      ],
      cautions: ["매달 같은 시기에 알려주시면 요금이 정확하게 정산됩니다."],
    },
    {
      id: "clean", cat: "care", title: "유리면 · 급지대 청소", icon: "clean", minutes: 3,
      summary: "복사물에 검은 줄이 생길 때 제일 먼저 할 일",
      steps: [
        "덮개를 열고 유리면을 마른 부드러운 천으로 닦습니다.",
        "위쪽 급지대(ADF)의 좁고 긴 유리띠도 함께 닦습니다.",
        "다시 복사해 줄이 사라졌는지 확인합니다.",
      ],
      cautions: [
        "알코올·세제를 유리에 직접 뿌리지 마세요. 천에 살짝 묻혀 닦습니다.",
        "청소해도 줄이 그대로면 기기 안쪽 문제이니 연락 주세요.",
      ],
    },
    {
      id: "quality", cat: "trouble", title: "인쇄 화질 문제 (줄·얼룩·흐림)", icon: "quality", minutes: 5,
      summary: "세로줄, 가로줄, 번짐, 색이 흐릴 때",
      steps: [
        "유리면과 급지대 유리띠를 먼저 닦아 봅니다.",
        "그래도 같으면 어느 색에서 문제가 나는지 확인합니다.",
        "해당 색 토너를 빼서 좌우로 흔든 뒤 다시 넣어 봅니다.",
        "증상이 남으면 인쇄물을 사진으로 찍어 보내주세요.",
      ],
      cautions: ["증상 사진 한 장이면 방문 전에 부품을 챙겨갈 수 있어 훨씬 빨리 해결됩니다."],
    },
    {
      id: "error", cat: "trouble", title: "화면에 오류 표시가 뜰 때", icon: "error", minutes: 2,
      summary: "에러 코드가 떴을 때 대처",
      steps: [
        "화면에 뜬 코드(예: SC-xxx, E-xxx)를 그대로 적거나 사진을 찍습니다.",
        "전원을 껐다가 30초 뒤 다시 켜 봅니다.",
        "같은 코드가 다시 뜨면 코드와 함께 연락 주세요.",
      ],
      cautions: ["전원을 반복해서 껐다 켜지 마세요. 한 번만 시도하고 연락 주시는 편이 안전합니다."],
    },
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
   * ------------------------------------------------------------ */
  MODELS: [
    {
      id: "samsung-3220", brand: "samsung",
      name: "삼성 3220",
      full: "SL-X3220 계열 컬러 복합기",
      aka: ["3220", "3250", "3255", "3280", "MX3", "X3220", "엑스3"],
      device: "floor-color",
      photo: "",            // 직접 찍은 사진: assets/models/samsung-3220.jpg
      videos: {
        toner: "RODkrd6bfeY", // 3220 토너 교체 방법
        waste: "bBUR7V6VRYs", // 3220,4220 폐통 교체 방법
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
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
      photo: "",            // 직접 찍은 사진: assets/models/samsung-4220.jpg
      videos: {
        toner: "0ZQ_yvoX85c", // 4220 토너 교체 방법
        waste: "bBUR7V6VRYs", // 3220,4220 폐통 교체 방법
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
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
      photo: "",            // 직접 찍은 사진: assets/models/samsung-x7500.jpg
      videos: {
        toner: "moTYQ3usG9c", // x7500 토너 교체 방법
        waste: "2JuxnMC19p8", // x7500 폐통 교체 방법
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
      },
      notes: {},
    },
    {
      id: "samsung-k4250", brand: "samsung",
      name: "삼성 K4250",
      full: "SL-K4250 계열 흑백 복합기",
      aka: ["K4250", "4250", "흑백", "케이4250"],
      device: "floor-mono",
      photo: "",            // 직접 찍은 사진: assets/models/samsung-k4250.jpg
      videos: {
        toner: "Swn0LRQpoi8", // K4250 토너 교체 방법
        waste: "OzhlvZ4f0E8", // K4250 폐통 교체 방법
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
      },
      notes: {},
    },
    {
      id: "samsung-k7500", brand: "samsung",
      name: "삼성 K7500",
      full: "SL-K7500 계열 흑백 복합기",
      aka: ["K7500", "흑백", "케이7500"],
      device: "floor-mono",
      photo: "",            // 직접 찍은 사진: assets/models/samsung-k7500.jpg
      videos: {
        toner: "cythI1d3bwU", // k7500 토너 교체 방법
        waste: "4D9fZRltgMQ", // k7500 폐통 교체방법
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
      },
      notes: {},
    },
    {
      id: "samsung-clx9201", brand: "samsung",
      name: "삼성 CLX-9201 · 9251 · 9301",
      full: "대형 컬러 복합기",
      aka: ["9201", "9251", "9301", "CLX"],
      device: "floor-color",
      photo: "",            // 직접 찍은 사진: assets/models/samsung-clx9201.jpg
      videos: {
        toner: "",
        waste: "",
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
      },
      notes: {},
    },
    {
      id: "sindoh-d420", brand: "sindoh",
      name: "신도리코 D420",
      full: "D320 · D410 · D420 공통",
      aka: ["320", "321", "410", "411", "420", "422", "D420", "D410", "D320"],
      device: "floor-color",
      photo: "",            // 직접 찍은 사진: assets/models/sindoh-d420.jpg
      videos: {
        toner: "us13Br3-aBM", // 320,410,420 토너 교체 방법
        waste: "e_iTXoxXwM8", // 320,410,420 폐통 교체 방법
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
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
      photo: "",            // 직접 찍은 사진: assets/models/sindoh-d450.jpg
      videos: {
        toner: "JvlmiOwwRo4", // 450 토너 교체 방법
        waste: "R1iJHkdYDes", // 450 폐통 교체 방법
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
      },
      notes: {},
    },
    {
      id: "sindoh-n501", brand: "sindoh",
      name: "신도리코 N501",
      full: "N501 · N502",
      aka: ["501", "502", "N501", "엔501"],
      device: "floor-mono",
      photo: "",            // 직접 찍은 사진: assets/models/sindoh-n501.jpg
      videos: {
        toner: "WYMZ-5k4prs", // N501 토너 교체 방법
        waste: "6Stqgvl5Rf8", // N501 폐통 교체 방법
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
      },
      notes: {},
    },
    {
      id: "sindoh-d600", brand: "sindoh",
      name: "신도리코 D600",
      full: "D600 계열",
      aka: ["600", "601", "D600"],
      device: "floor-color",
      photo: "",            // 직접 찍은 사진: assets/models/sindoh-d600.jpg
      videos: {
        toner: "",
        waste: "",
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
      },
      notes: {},
    },
    {
      id: "xerox-c2270", brand: "xerox",
      name: "제록스 C2270 · C2275 · C2276",
      full: "ApeosPort-IV / DocuCentre-V 계열",
      aka: ["키슈", "세이토", "2270", "2275", "2276", "3370", "3375", "C2270", "C2276"],
      device: "floor-color",
      photo: "",            // 직접 찍은 사진: assets/models/xerox-c2270.jpg
      videos: {
        toner: "DFJcuPt5yZk", // 키슈,세이토 토너 교체 방법
        waste: "LIhB66g5V6s", // 키슈,세이토 토너 회수통R5 교체 방법
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
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
      photo: "",            // 직접 찍은 사진: assets/models/xerox-c2263.jpg
      videos: {
        toner: "3XZ7PJaull4", // 마블 토너 교체 방법
        waste: "yBCH8_ouEmM", // 마블 토너 회수통R5 교체 방법
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
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
      photo: "",            // 직접 찍은 사진: assets/models/xerox-c2271.jpg
      videos: {
        toner: "OG7jeQmpsbs", // 베니 토너 교체 방법
        waste: "WsK67N5FjC4", // 베니 토너 회수통R5 교체 방법
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
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
      photo: "",            // 직접 찍은 사진: assets/models/xerox-c3070.jpg
      videos: {
        toner: "Gc_NI3IdhuI", // 쇼부 토너 교체 방법
        waste: "P6-hVPSTV8Q", // 쇼부 토너 회수통R5 교체 방법
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
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
      photo: "",            // 직접 찍은 사진: assets/models/xerox-c5585.jpg
      videos: {
        toner: "",
        waste: "",
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
      },
      notes: {},
    },
    {
      id: "xerox-sc2022", brand: "xerox",
      name: "제록스 SC2022",
      full: "DocuCentre SC2022",
      aka: ["SC2022", "2022"],
      device: "desktop",
      photo: "",            // 직접 찍은 사진: assets/models/xerox-sc2022.jpg
      videos: {
        toner: "",
        waste: "",
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
      },
      notes: {},
    },
    {
      id: "kyocera", brand: "kyocera",
      name: "교세라 5521 · 5526 · 2100",
      full: "TASKalfa 5521ci · 5526ci · 2100",
      aka: ["5521", "5526", "2100", "2101", "교세라", "TASKalfa"],
      device: "floor-color",
      photo: "",            // 직접 찍은 사진: assets/models/kyocera.jpg
      videos: {
        toner: "pRqyQJ5Lqns", // 교세라 토너 교체 방법
        waste: "",
        drum: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
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
      photo: "",            // 직접 찍은 사진: assets/models/brother-5700.jpg
      videos: {
        toner: "3GypB534uSs", // 브라더 토너 교체 방법
        waste: "",
        drum: "Vok3STCstrQ",  // 브라더 드럼 교체 방법
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
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
      photo: "",            // 직접 찍은 사진: assets/models/brother-8900.jpg
      videos: {
        toner: "",
        waste: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
      },
      notes: {},
    },
    {
      id: "oki-5473", brand: "etc",
      name: "오키 5473",
      full: "OKI ES5473 / MC5473",
      aka: ["5473", "오키", "ES5473", "MC5473"],
      device: "desktop",
      photo: "",            // 직접 찍은 사진: assets/models/oki-5473.jpg
      videos: {
        toner: "BvbcfG8QZYM", // 오키 토너 교체 방법
        waste: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
      },
      notes: {},
    },
    {
      id: "lexmark-mx410", brand: "etc",
      name: "렉스마크 MX410",
      full: "Lexmark MX410",
      aka: ["MX410", "렉스마크"],
      device: "desktop",
      photo: "",            // 직접 찍은 사진: assets/models/lexmark-mx410.jpg
      videos: {
        toner: "",
        waste: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
      },
      notes: {},
    },
    {
      id: "hp-8710", brand: "hp",
      name: "HP OfficeJet Pro 8710 · 8720 · 8730",
      full: "잉크젯 복합기",
      aka: ["8710", "8720", "8730", "8600", "8610", "오피스젯"],
      device: "inkjet",
      photo: "",            // 직접 찍은 사진: assets/models/hp-8710.jpg
      videos: {
        toner: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
      },
      notes: {},
    },
    {
      id: "hp-9010", brand: "hp",
      name: "HP OfficeJet Pro 9010 · 7740",
      full: "잉크젯 복합기",
      aka: ["9010", "7740"],
      device: "inkjet",
      photo: "",            // 직접 찍은 사진: assets/models/hp-9010.jpg
      videos: {
        toner: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
      },
      notes: {},
    },
    {
      id: "hp-laser", brand: "hp",
      name: "HP LaserJet M477 · M530 · M650",
      full: "레이저 복합기",
      aka: ["477", "530", "650", "레이저젯"],
      device: "desktop",
      photo: "",            // 직접 찍은 사진: assets/models/hp-laser.jpg
      videos: {
        toner: "",
        jam: "",
        paper: "",
        copy: "",
        scan: "",
        fax: "",
        meter: "",
        clean: "",
        quality: "",
        error: "",
      },
      notes: {},
    },
  ],
};
