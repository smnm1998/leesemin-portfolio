export type PipelineStage = {
  label: string;
  detail?: string;
};

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
  images?: string[];
  sections?: {
    title: string;
    content: string;
    note?: string;
    evidence?: { label: string; url: string }[];
    timingChart?: { label: string; segments: { label: string; seconds: number }[] }[];
    comparisonChart?: { label: string; before: number; after: number }[];
  }[];
  pipeline?: {
    stages: PipelineStage[];
    outputs: PipelineStage[];
  };
};

export const projects: Project[] = [
  {
    slug: 'project-1',
    name: '프로젝트 1',
    context: '',
    period: '',
    description: '',
    tech: [],
    github: '',
    live: '',
    gradient: 'from-gray-400 via-gray-500 to-gray-600',
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
    images: [
      '/projects/artune/artune_1.png',
      '/projects/artune/artune_2.png',
      '/projects/artune/artune_3.png',
    ],
    pipeline: {
      stages: [
        { label: '사용자 입력', detail: '감정을 담은 글' },
        { label: 'GPT-4.1-mini', detail: '감정 분석 · 시드곡 생성' },
        { label: 'Last.fm', detail: '협업 필터링 확장' },
        { label: 'iTunes Search', detail: '재생 가능 트랙 해석' },
        { label: '지역 쿼터 선정', detail: '한국:팝:일본 6:3:1' },
      ],
      outputs: [
        { label: 'Immerse', detail: '감정 심취 20곡' },
        { label: 'Soothe', detail: '감정 완화 20곡' },
      ],
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
    slug: 'project-3',
    name: '프로젝트 3',
    context: '',
    period: '',
    description: '',
    tech: [],
    github: '',
    live: '',
    gradient: 'from-gray-400 via-gray-500 to-gray-600',
  },
];
