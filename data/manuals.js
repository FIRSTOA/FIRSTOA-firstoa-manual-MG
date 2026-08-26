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
    phone: "000-0000-0000",          // TODO: 대표 A/S 전화번호
    hours: "평일 09:00 – 18:00",
    kakao: "",                        // 카카오톡 채널 주소(있으면)
    channel: "",                      // 유튜브 채널 주소
  },

  /* ── 작업 분류 ─────────────────────────────────────────────── */
  CATEGORIES: [
    { id: "consumable", name: "소모품 교체", icon: "🧴", desc: "토너·폐토너통·드럼" },
    { id: "paper",      name: "용지·걸림",   icon: "📄", desc: "용지 넣기, 걸린 종이 빼기" },
    { id: "feature",    name: "복사·스캔·팩스", icon: "🖨️", desc: "기본 사용법" },
    { id: "care",       name: "관리·검침",   icon: "📋", desc: "청소, 카운터 확인" },
    { id: "trouble",    name: "문제 해결",   icon: "🛠️", desc: "화질 불량, 오류 표시" },
  ],

  /* ── 작업 종류 ──────────────────────────────────────────────
   * 모든 기종이 공유하는 표준 작업입니다.
   * steps(기본 순서)는 기종이 달라도 대체로 통하는 내용만 적어 두었습니다.
   * 정확한 절차는 영상이 기준이며, 기종마다 다르면 아래 MODELS 의 notes 로 덮어쓸 수 있습니다.
   * ------------------------------------------------------------ */
  TASKS: [
    {
      id: "toner", cat: "consumable", title: "토너 교체", icon: "🧴", minutes: 3,
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
      id: "waste", cat: "consumable", title: "폐토너통 교체", icon: "🗑️", minutes: 3,
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
      id: "drum", cat: "consumable", title: "드럼(이미징 유닛) 교체", icon: "🥁", minutes: 5,
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
      id: "jam", cat: "paper", title: "걸린 용지 빼기", icon: "📛", minutes: 3,
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
      id: "paper", cat: "paper", title: "용지 넣기 · 용지함 설정", icon: "📄", minutes: 2,
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
      id: "copy", cat: "feature", title: "복사 기본 사용법", icon: "📑", minutes: 2,
      summary: "양면, 매수, 확대·축소",
      steps: [
        "원본을 위쪽 급지대에 넣거나 유리면에 올립니다.",
        "매수를 입력하고 양면·컬러 여부를 고릅니다.",
        "시작 버튼을 누릅니다.",
      ],
      cautions: [],
    },
    {
      id: "scan", cat: "feature", title: "스캔해서 메일·USB로 보내기", icon: "📤", minutes: 3,
      summary: "스캔 파일을 메일이나 USB로 받는 방법",
      steps: [
        "원본을 급지대에 넣습니다.",
        "화면에서 스캔을 고르고 받을 곳(메일 주소 / USB)을 선택합니다.",
        "시작 버튼을 누르면 전송됩니다.",
      ],
      cautions: ["메일 주소를 새로 등록해야 하면 연락 주세요. 원격으로 넣어 드립니다."],
    },
    {
      id: "fax", cat: "feature", title: "팩스 보내기 · 받기", icon: "📠", minutes: 2,
      summary: "번호 입력과 수신 확인",
      steps: [
        "원본을 급지대에 넣습니다.",
        "팩스를 고르고 상대 번호를 지역번호부터 누릅니다.",
        "시작 버튼을 누르고 전송 결과를 확인합니다.",
      ],
      cautions: [],
    },
    {
      id: "meter", cat: "care", title: "검침 카운터 확인", icon: "🔢", minutes: 1,
      summary: "매달 알려주셔야 하는 흑백·컬러 장수 보는 법",
      steps: [
        "화면에서 기기 정보 또는 카운터 항목을 찾습니다.",
        "흑백(B/W)과 컬러(Color) 총 매수를 확인합니다.",
        "화면을 사진으로 찍어 담당자에게 보내주시면 가장 정확합니다.",
      ],
      cautions: ["매달 같은 시기에 알려주시면 요금이 정확하게 정산됩니다."],
    },
    {
      id: "clean", cat: "care", title: "유리면 · 급지대 청소", icon: "🧽", minutes: 3,
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
      id: "quality", cat: "trouble", title: "인쇄 화질 문제 (줄·얼룩·흐림)", icon: "🩹", minutes: 5,
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
      id: "error", cat: "trouble", title: "화면에 오류 표시가 뜰 때", icon: "⚠️", minutes: 2,
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
    { id: "samsung", name: "삼성", full: "삼성 / HP 삼성" },
    { id: "sindoh",  name: "신도리코", full: "신도리코 SINDOH" },
    { id: "xerox",   name: "제록스", full: "후지제록스 / 후지필름" },
    { id: "kyocera", name: "교세라", full: "교세라 TASKalfa" },
    { id: "brother", name: "브라더", full: "브라더 Brother" },
    { id: "hp",      name: "HP",     full: "HP OfficeJet / LaserJet" },
    { id: "etc",     name: "그 외",  full: "오키 · 렉스마크 등" },
  ],

  /* ── 기종 ──────────────────────────────────────────────────
   * videos 의 값이 유튜브 영상 ID 입니다. 비우면 "준비 중"으로 표시됩니다.
   * notes 로 그 기종만의 안내를 덧붙일 수 있습니다. (없으면 지워도 됩니다)
   * ------------------------------------------------------------ */
  MODELS: [
    // ── 삼성 ──────────────────────────────────────────────
    {
      id: "samsung-x3", brand: "samsung",
      name: "삼성 SL-X3220NR / X3280NR",
      aka: ["MX3", "3220", "3250", "3255", "3280", "엑스3"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "samsung-x4", brand: "samsung",
      name: "삼성 SL-X4220RX / X4300LX",
      aka: ["MX4", "4220", "4225", "4250", "4255", "4300", "4305", "4350", "4355"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "samsung-x7", brand: "samsung",
      name: "삼성 SL-X7400GX / X7600GX",
      aka: ["MX7", "7400", "7500", "7600"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "samsung-clx9201", brand: "samsung",
      name: "삼성 CLX-9201NA / 9251NA / 9301NA",
      aka: ["9201", "9251", "9301"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "samsung-k", brand: "samsung",
      name: "삼성 SL-K3300 / K4350 (흑백)",
      aka: ["흑백기", "K3300", "K4350", "K7600", "흑백"],
      videos: { toner: "", waste: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    // ── 신도리코 ──────────────────────────────────────────
    {
      id: "sindoh-d420", brand: "sindoh",
      name: "신도리코 D420 / D422",
      aka: ["420", "422"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "sindoh-d450", brand: "sindoh",
      name: "신도리코 D450 / D451 / D452",
      aka: ["450", "451", "452"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "sindoh-n501", brand: "sindoh",
      name: "신도리코 N501 / N502",
      aka: ["501", "502", "N501"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "sindoh-d600", brand: "sindoh",
      name: "신도리코 D600 시리즈",
      aka: ["600", "601"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    // ── 제록스 ────────────────────────────────────────────
    {
      id: "xerox-dcv-c2263", brand: "xerox",
      name: "DocuCentre-V C2263 / C2265",
      aka: ["마블", "2263", "2265", "DCVC2263"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "xerox-dcv-c2276", brand: "xerox",
      name: "DocuCentre-V C2276 / C3375",
      aka: ["세이토", "2276", "3375", "VC3375"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "xerox-apvi", brand: "xerox",
      name: "ApeosPort-VI C2271 / C3371",
      aka: ["베니", "2271", "3371", "APVI"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "xerox-apvii", brand: "xerox",
      name: "ApeosPort-VII C2273 / C3373",
      aka: ["보탄", "2273", "3373", "APVII"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "xerox-apiv", brand: "xerox",
      name: "ApeosPort-IV C2270 / C3370",
      aka: ["키슈", "2270", "3370", "APIV"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "xerox-c5585", brand: "xerox",
      name: "DocuCentre-V C5585 / C6680 (대형)",
      aka: ["헤라", "5580", "5585", "6680"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "xerox-apeos-c2060", brand: "xerox",
      name: "ApeosPort C2060 / C3070",
      aka: ["APEOS", "2060", "3070", "2560"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "xerox-sc2022", brand: "xerox",
      name: "DocuCentre SC2022",
      aka: ["SC2022", "2022"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    // ── 교세라 ────────────────────────────────────────────
    {
      id: "kyocera-2100", brand: "kyocera",
      name: "교세라 TASKalfa 2100 / 2101",
      aka: ["2100", "2101"],
      videos: { toner: "", waste: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "kyocera-5521", brand: "kyocera",
      name: "교세라 TASKalfa 5521ci / 5526ci",
      aka: ["5521", "5526"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    // ── 브라더 ────────────────────────────────────────────
    {
      id: "brother-5700", brand: "brother",
      name: "브라더 MFC-L5700DN",
      aka: ["5700"],
      videos: { toner: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "brother-8900", brand: "brother",
      name: "브라더 MFC-L8900CDW",
      aka: ["8900"],
      videos: { toner: "", waste: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    // ── HP ────────────────────────────────────────────────
    {
      id: "hp-8710", brand: "hp",
      name: "HP OfficeJet Pro 8710 / 8720 / 8730",
      aka: ["8710", "8720", "8730", "8600", "8610"],
      videos: { toner: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: { toner: "이 기종은 가루 토너가 아니라 잉크 카트리지를 씁니다." },
    },
    {
      id: "hp-9010", brand: "hp",
      name: "HP OfficeJet Pro 9010 / 7740",
      aka: ["9010", "7740"],
      videos: { toner: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: { toner: "이 기종은 가루 토너가 아니라 잉크 카트리지를 씁니다." },
    },
    {
      id: "hp-laser", brand: "hp",
      name: "HP LaserJet M477 / M530 / M650",
      aka: ["477", "530", "650"],
      videos: { toner: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    // ── 그 외 ─────────────────────────────────────────────
    {
      id: "oki-5473", brand: "etc",
      name: "오키 OKI MC5473",
      aka: ["5473", "오키"],
      videos: { toner: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
    {
      id: "lexmark-mx410", brand: "etc",
      name: "렉스마크 Lexmark MX410",
      aka: ["MX410", "렉스마크"],
      videos: { toner: "", drum: "", jam: "", paper: "", copy: "", scan: "", fax: "", meter: "", clean: "", quality: "", error: "" },
      notes: {},
    },
  ],
};
