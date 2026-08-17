export type MediaItem =
  | { type: 'image'; src: string; width?: number; height?: number }
  | { type: 'video'; src: string; width?: number; height?: number };

export type Project = {
  slug: string;
  name: string;
  context: string;
  period: string;
  description: string;
  tech: string[];
  github: string;
  live: string;
  gradient: string;
  media?: MediaItem[];
  // width/height는 다이어그램 SVG의 viewBox 크기 — 임베드 시 종횡비를 맞추는 데 쓴다.
  architectureDiagram?: { src: string; width: number; height: number };
  sections?: {
    title: string;
    content: string;
    note?: string;
    evidence?: { label: string; url: string }[];
    timingChart?: { label: string; segments: { label: string; seconds: number }[] }[];
    comparisonChart?: { label: string; before: number; after: number; unit?: string }[];
  }[];
};

export const projects: Project[] = [
  {
    slug: 'fitfoyo',
    name: 'FitFoyo',
    context: '2025 Co-Ed 캡스톤 디자인 장려상 수상작 기반 · 개인 리메이크',
    period: '2026.05 — 2026.08',
    description:
      '식단·운동을 자연어로 입력하면 AI(OpenAI)가 항목을 분류·정산해 기록하고, 달력에서 하루를 한눈에 보여주는 헬스케어 캘린더입니다. AI 출력을 그대로 믿지 않고 실제 영양 DB로 보정하는 신뢰성에 집중했으며, 기획부터 설계·개발·배포·운영까지 단독으로 진행했습니다.',
    tech: [
      'Next.js 16',
      'React 19',
      'TypeScript',
      'TailwindCSS 4',
      'Zustand',
      'React Hook Form',
      'Zod',
      'NestJS 11',
      'Prisma 6',
      'PostgreSQL (Neon)',
      'OpenAI API',
      'Turborepo',
      'Vercel',
      'Railway',
    ],
    github: 'https://github.com/smnm1998/fit-fo-yo',
    live: 'https://fitfoyo.vercel.app',
    gradient: 'from-emerald-500 via-green-600 to-teal-700',
    media: [
      { type: 'video', src: '/projects/fitfoyo/calendar.mp4' },
      { type: 'video', src: '/projects/fitfoyo/ai-chat.mp4' },
      { type: 'video', src: '/projects/fitfoyo/calorie.mp4' },
    ],
    architectureDiagram: {
      src: '/projects/fitfoyo/architecture.html',
      width: 1210,
      height: 654,
    },
    sections: [
      {
        title: 'Introduce',
        content:
          '식단·운동을 자연어로 입력하면 AI가 항목을 분류·정산해 기록하고, 달력에서 하루를 한눈에 보여주는 헬스케어 캘린더입니다. 모놀리식 레거시를 TurboRepo 모노레포 + BFF 패턴으로 재설계했고, AI 출력의 신뢰성·비용·보안까지 단독으로 다뤘습니다.',
      },
      {
        title: 'AI가 잘못 계산한 칼로리를 실제 데이터로 바로잡기',
        content:
          'LLM 단독 추정 시 칼로리가 실제의 약 3.8배(불닭볶음면 4,000kcal)로 과대계산되던 문제를, 등록 음식은 자체 영양 DB(FoodNutrition)를 기준으로 서버에서 재계산하고 미등록 음식만 LLM 추정으로 폴백하는 하이브리드 구조로 해결했습니다. 보정 결과가 1,061kcal로 고정되는지 검증하는 회귀 테스트로 재발을 차단했고, DB 근거 여부를 "추정" 배지로 사용자에게 정직하게 노출했습니다.',
        comparisonChart: [{ label: '불닭볶음면 2개', before: 4000, after: 1061, unit: 'kcal' }],
        evidence: [
          {
            label: '회귀 테스트 (불닭 4000→1061)',
            url: 'https://github.com/smnm1998/fit-fo-yo/blob/997dc98c89065f360bb9ec50c49de1f332f5ec8d/apps/api/src/ai/ai.service.spec.ts#L182-L208',
          },
          {
            label: '서버 재계산 로직 (grounding)',
            url: 'https://github.com/smnm1998/fit-fo-yo/blob/997dc98c89065f360bb9ec50c49de1f332f5ec8d/apps/api/src/ai/ai.service.ts#L237-L296',
          },
        ],
      },
      {
        title: '말하듯 적으면 AI가 식단·운동으로 나눠 기록',
        content:
          'OpenAI Function Calling으로 1차 패스에서 자연어를 해석해 기록 생성·수정·삭제 작업을 결정하고 서버가 실제 DB에 반영한 뒤, 2차 패스에서 자연어 응답과 맞춤 추천을 생성하는 2-pass 에이전트를 설계했습니다. 병렬 tool 호출로 "닭가슴살 먹고 30분 뛰었어" 같은 혼합 입력을 식단·운동 레코드로 각각 분리했고, 대화 히스토리를 DB 대신 sessionStorage로만 유지해 토큰 비용과 UX의 트레이드오프를 명시적으로 선택했습니다.',
        evidence: [
          {
            label: '2-pass chat 에이전트',
            url: 'https://github.com/smnm1998/fit-fo-yo/blob/997dc98c89065f360bb9ec50c49de1f332f5ec8d/apps/api/src/ai/ai.service.ts#L327',
          },
        ],
      },
      {
        title: '달력을 넘겨도 기다림 없이 뜨는 빠른 화면',
        content:
          '월을 이동할 때마다 매번 반복되던 약 500~640ms의 데이터 요청을, Zustand 월별 스냅샷 캐시와 인접 월 백그라운드 프리페치로 재설계해 캐시 히트 시 네트워크 요청 없이 즉시 전환되도록 개선했습니다. 통계 화면에서만 사용하는 차트 라이브러리(recharts)를 next/dynamic으로 코드 스플릿해 약 98KB(gzip)를 초기 로드 번들에서 제외했습니다.',
        note: '월 이동 지연은 배포 환경 Network 탭 실측값(캐시 미스 502~638ms → 캐시 히트 시 요청 0)입니다.',
        comparisonChart: [{ label: '월 이동 지연', before: 640, after: 0, unit: 'ms' }],
        evidence: [
          {
            label: '월별 스냅샷 캐시 + 인접 프리페치',
            url: 'https://github.com/smnm1998/fit-fo-yo/blob/997dc98c89065f360bb9ec50c49de1f332f5ec8d/apps/web/components/dashboard/CalendarWorkspace.tsx#L56-L110',
          },
        ],
      },
    ],
  },
  {
    slug: 'artune',
    name: 'Artune',
    context: '우아한테크코스 8기 프리코스',
    period: '2025.09 — 2026.07',
    description:
      '사용자가 입력한 일기나 짧은 글을 GPT-4.1-mini로 분석해, 감정에 더 깊이 몰입하는 Immerse와 감정을 부드럽게 전환하는 Soothe 두 가지 모드로 플레이리스트를 큐레이션하는 서비스입니다. Last.fm 협업 필터링으로 추천 폭을 넓히고 iTunes Search API로 30초 미리듣기를 제공하며, Turborepo 기반 모노레포로 프론트엔드와 백엔드를 함께 관리했습니다.',
    tech: [
      'React 19',
      'Vite',
      'NestJS',
      'Zustand',
      'Framer Motion',
      'OpenAI API',
      'iTunes Search API',
      'Last.fm API',
      'DALL-E',
      'Turborepo',
      'SSE',
    ],
    github: 'https://github.com/smnm1998/artune',
    live: 'https://om-artune.vercel.app',
    gradient: 'from-violet-500 via-purple-600 to-indigo-700',
    media: [
      { type: 'image', src: '/projects/artune/artune_1.png' },
      { type: 'image', src: '/projects/artune/artune_2.png' },
      { type: 'image', src: '/projects/artune/artune_3.png' },
    ],
    architectureDiagram: {
      src: '/projects/artune/architecture.html',
      width: 1420,
      height: 652,
    },
    sections: [
      {
        title: 'Introduce',
        content:
          '사용자가 입력한 일기나 짧은 글을 GPT-4.1-mini로 분석해, 감정에 더 깊이 몰입하는 Immerse와 감정을 부드럽게 전환하는 Soothe 두 가지 모드로 플레이리스트를 큐레이션하는 서비스입니다. Last.fm 협업 필터링으로 추천 폭을 넓히고 iTunes Search API로 30초 미리듣기를 제공하며, Turborepo 기반 모노레포로 프론트엔드와 백엔드를 함께 관리했습니다.',
      },
      {
        title: '기술적 도전 — Spotify에서 iTunes로',
        content:
          '서비스 운영 중 Spotify가 개발자 정책을 변경(Premium 계정 강제, 신규 앱 심사 제한)하면서, 음악 추천 파이프라인을 iTunes Search API로 완전히 이전했습니다. 이 과정에서 한국→미국→일본 순으로 국가를 폴백하는 로직이 rate limit 상황에서 오히려 호출을 3배로 증폭시키고, 일시적 429 오류가 6시간 캐시에 그대로 저장되어 특정 아티스트가 장시간 추천에서 사라지는 결함을 발견해 수정했습니다. 상태 코드를 정상 / 일시적 오류 / rate limit으로 구분해 처리하도록 재설계한 결과, 트래픽이 몰리는 상황에서도 추천 수율 20/20을 유지합니다.',
        evidence: [
          {
            label: 'itunes.service.ts (현재 코드)',
            url: 'https://github.com/smnm1998/artune/blob/f18d2e51a16b94a414b2d22f98f7bd7bac8246a3/apps/backend/src/itunes/itunes.service.ts#L34-L64',
          },
          {
            label: 'commit fe5ec41 (수정 당시)',
            url: 'https://github.com/smnm1998/artune/commit/fe5ec4142d4b6b94a97142fc6975a0b54e0b2f4f',
          },
        ],
      },
      {
        title: '측정 기반 응답시간 최적화',
        content:
          '체감이 아닌 실측으로 최적화하기 위해 단계별 타이밍 로그를 추가해 병목을 분해했습니다(GPT 호출 52%, 외부 API 순차 호출 48%). SSE 기반 병렬 처리를 도입해 API 호출 구간을 8.6초에서 4.5초로 줄이고, GPT 출력 아티스트 수를 40명에서 25명으로 줄여 응답시간을 17.9초에서 11.6초로 35% 단축했습니다. 최적화 과정 내내 추천 수율(20/20)이 그대로 유지되는지 매 단계 검증했습니다.',
        note: '이 수치는 Last.fm 도입(2026.07.25) 이전, 아티스트를 GPT가 직접 큐레이션하던 구조 기준입니다. [timing] 계측 코드는 지금도 동작하지만, 40→25명 자체는 현재의 시드 기반 구조와는 다릅니다.',
        timingChart: [
          {
            label: 'baseline',
            segments: [
              { label: 'GPT 분석', seconds: 9.3 },
              { label: '병렬 처리', seconds: 8.6 },
            ],
          },
          {
            label: 'SSE 병렬화',
            segments: [
              { label: 'GPT 분석', seconds: 9.4 },
              { label: '병렬 처리', seconds: 4.5 },
            ],
          },
          {
            label: 'GPT 출력 축소',
            segments: [
              { label: 'GPT 분석', seconds: 7.5 },
              { label: '병렬 처리', seconds: 4.1 },
            ],
          },
        ],
        evidence: [
          {
            label: 'commit 8af492d (최적화 diff)',
            url: 'https://github.com/smnm1998/artune/commit/8af492d4a41403b5d90fef9e6458470c549ee819',
          },
          {
            label: '실측 원시 로그',
            url: 'https://github.com/smnm1998/artune/blob/b918beecfd8dcfacbdd7585a5bf62c91a5160236/docs/measurements/2026-07-21-response-timing.log',
          },
          {
            label: '[timing] 계측 코드 (현재도 동작)',
            url: 'https://github.com/smnm1998/artune/blob/f18d2e51a16b94a414b2d22f98f7bd7bac8246a3/apps/backend/src/emotion/emotion.service.ts#L219',
          },
        ],
      },
      {
        title: '정량 지표로 검증한 추천 품질',
        content:
          '"몰입 모드와 완화 모드가 잘 구분되지 않는 것 같다."는 체감 피드백을 검증하기 위해, 두 플레이리스트 간 장르 라벨 중복률을 측정하는 자체 지표(mode-separation)를 만들었습니다. 이 지표로 기쁨·슬픔 감정에서 두 모드가 실제로 30~70%까지 겹친다는 것을 수치로 확인했고, 원인이 City Pop 같은 일부 장르가 iTunes에서 K-Pop·J-Pop으로 라벨링되며 서로 충돌하는 데 있다는 것을 밝혀 수정했습니다. 12개 감정을 전수 재측정해 한 번의 이상치(50%)가 노이즈였음을 확인하는 등, 감이 아니라 재측정으로 결론을 검증하는 원칙을 지켰습니다.',
        note: '로컬에서 실행 후 감정 분석을 요청하면 서버 콘솔에 [mode-separation] 로그로 재현할 수 있습니다.',
        comparisonChart: [
          { label: '기쁨', before: 30, after: 20 },
          { label: '슬픔', before: 70, after: 35 },
          { label: '놀람', before: 35, after: 5 },
        ],
        evidence: [
          {
            label: 'logModeSeparation() (현재 코드)',
            url: 'https://github.com/smnm1998/artune/blob/f18d2e51a16b94a414b2d22f98f7bd7bac8246a3/apps/backend/src/emotion/emotion.service.ts#L46-L68',
          },
          {
            label: 'commit b803f67 (지표 도입)',
            url: 'https://github.com/smnm1998/artune/commit/b803f6776e5eb9e2b5e707ea4d9c4de3d0a6a5a0',
          },
        ],
      },
    ],
  },
  {
    slug: 'sangsang',
    name: '대한민국 지역문화 챗봇 시스템',
    context: '팀 프로젝트 · 학생창업 300 선정',
    period: '2024.09 — 2025.02',
    description:
      '대한민국 지역문화(고궁, 유적지, 전통주 등)를 대화형으로 안내하는 챗봇 서비스입니다. OpenAI API 기반 챗봇에 지역별 콘텐츠 큐레이션을 결합한 팀 프로젝트로, 학생창업 300·경북콘텐츠진흥원 액셀러레이터 선정 등 실제 외부 검증을 받았습니다. 저는 화면 UI·인터랙션과 퍼블리싱을 담당했습니다.',
    tech: [
      'Django',
      'Django REST Framework',
      'OpenAI API',
      'HTML',
      'CSS',
      'jQuery',
      'Swiper',
      'MySQL',
      'NGINX',
      'Gunicorn',
      'Vultr',
    ],
    github: 'https://github.com/smnm1998/culture_chatbot',
    live: '',
    gradient: 'from-yellow-500 via-amber-600 to-orange-700',
    media: [
      { type: 'image', src: '/projects/sangsang/main.png', width: 572, height: 1247 },
      { type: 'image', src: '/projects/sangsang/local.png', width: 576, height: 1245 },
      { type: 'image', src: '/projects/sangsang/chatting.png', width: 572, height: 1247 },
    ],
    sections: [
      {
        title: 'Introduce',
        content:
          '대한민국 지역문화(고궁, 유적지, 전통주 등)를 대화형으로 안내하는 챗봇 서비스입니다. OpenAI API 기반 챗봇에 지역별 콘텐츠 큐레이션을 결합한 팀 프로젝트로, 학생창업 300·경북콘텐츠진흥원 액셀러레이터 선정 등 실제 외부 검증을 받았습니다. 저는 화면 UI·인터랙션과 퍼블리싱을 담당했습니다.',
      },
      {
        title: '타이핑 이펙트와 AJAX 필터링, 그리고 스트리밍 버그 수정',
        content:
          '재귀 함수와 setTimeout으로 실제 대화처럼 한 글자씩 나타나는 타이핑 이펙트를 구현했고, Swiper 기반 추천 질문 카드와 AJAX 기반 도→시/군 계층형 지역 필터를 페이지 새로고침 없이 동작하도록 만들었습니다. API 응답 상태에 따라 입력창을 잠그고 로딩 애니메이션을 넣어 비동기 통신 중 중복 요청이 발생하지 않도록 했습니다. 스트리밍 완료 후 실제 응답 대신 상태값만 반환되는 구조적 버그와 이벤트 핸들러 내 메서드 중복 정의를 원인으로 찾아 수정했습니다.',
        note: '당시 git 사용이 익숙하지 않아 코드를 압축 파일로 직접 전달하며 작업해, 이 작업은 git 커밋 이력에는 반영되어 있지 않습니다.',
      },
      {
        title: '성과',
        content:
          '보드게임과 연계한 "교육+오락" 컨셉으로 학생창업 300에 선정됐고, 경북콘텐츠진흥원 액셀러레이터 사업에도 선정돼 2024 코엑스 에듀테크 페어에 참가했습니다.',
        evidence: [
          {
            label: 'README 주요 성과',
            url: 'https://github.com/smnm1998/culture_chatbot/blob/f1f7b876dab864896df7197601ae8b0c633016b8/README.md#L154-L160',
          },
        ],
      },
    ],
  },
];
