<div align="center">

# 이세민 포트폴리오

프론트엔드 개발자 이세민의 개인 포트폴리오 사이트입니다.

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-433E38?style=flat-square)

</div>

---

## 소개

한 페이지로 이어지는 소개 · 스킬 · 프로젝트 · 연락 섹션과, 프로젝트별 상세페이지로 구성된
포트폴리오입니다. 프로젝트마다 아키텍처 다이어그램과 정량 지표를 함께 싣고, **수치에는
커밋에 고정된 GitHub permalink를 근거로 붙여** 확인 가능하게 만드는 데 중점을 뒀습니다.

- 다크 / 라이트 테마 (새로고침 시 깜빡임 없음)
- 데스크톱 사이드바 ↔ 모바일 하단 탭바 반응형 내비게이션
- 임베드 아키텍처 다이어그램, 타이밍 · 비교 차트, 이미지 · 영상 갤러리

## 담긴 프로젝트

| 프로젝트 | 설명 | 링크 |
| --- | --- | --- |
| **FitFoyo**<br/><sub>2026.05 — 2026.08</sub> | 식단 · 운동을 자연어로 입력하면 AI가 분류 · 정산해 기록하는 헬스케어 캘린더. AI 출력을 실제 영양 DB로 보정하는 신뢰성에 집중 | [GitHub](https://github.com/smnm1998/fit-fo-yo) · [Live](https://fitfoyo.vercel.app) |
| **Artune**<br/><sub>2025.09 — 2026.07</sub> | 일기나 짧은 글의 감정을 분석해 두 가지 모드로 플레이리스트를 큐레이션하는 서비스 | [GitHub](https://github.com/smnm1998/artune) · [Live](https://om-artune.vercel.app) |
| **대한민국 지역문화 챗봇 시스템**<br/><sub>2024.09 — 2025.02</sub> | 지역문화를 대화형으로 안내하는 챗봇. 학생창업 300 선정 (팀 프로젝트, UI · 인터랙션 담당) | [GitHub](https://github.com/smnm1998/culture_chatbot) |

## 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| UI | React 19, Tailwind CSS v4, Framer Motion, lucide-react |
| State | Zustand (+ persist) |

## 구조

```
src/
├── app/
│   ├── page.tsx                 # 메인 페이지(단일 스크롤)
│   └── projects/[slug]/         # 프로젝트 상세페이지 (SSG)
├── components/
│   ├── Aside.tsx                # 내비게이션(사이드바 ↔ 하단 탭바) + 테마 토글
│   └── sections/
│       ├── Hero.tsx / Skills.tsx / Contact.tsx
│       └── Projects/            # 목록 · 상세 · 미디어 · 다이어그램 · 차트
├── data/projects.ts             # 프로젝트 데이터(콘텐츠 · 근거 링크 · 차트 값)
├── lib/                         # 모션 variants, 스크롤 상태 유틸
└── store/themeStore.ts          # 테마 상태
```

화면에 보이는 프로젝트 콘텐츠는 전부 `src/data/projects.ts`에 선언적으로 들어있고,
컴포넌트는 그 데이터를 렌더링하는 역할만 합니다.

## 구현하며 신경 쓴 것들

**SSR 환경의 스크롤 복원**
새로고침 시 화면이 맨 위로 갔다가 원래 위치로 점프하는 문제가 있었습니다. `useLayoutEffect`가
보장하는 건 *React가 만든 변경이* 페인트되기 전이지, 브라우저가 서버 HTML을 처음 그리기
전이 아닙니다. `PerformanceObserver`로 첫 페인트 시점의 스크롤 위치를 찍어보니, 페인트와
하이드레이션 완료 사이에 사용자가 잘못된 위치를 실제로 보고 있었습니다(개발 서버 기준
44ms → 120ms로 **76ms**, 프로덕션 빌드에서는 3.3ms). 원인은 중첩 `overflow-y-auto`
컨테이너로 스크롤 주체를 옮겨둔 탓에 브라우저의 네이티브 스크롤 복원이 차단된 것이었고,
문서 스크롤 구조로 전환해 **첫 페인트부터 정확한 위치**가 나오도록 고쳤습니다.

**정량 지표의 근거 제시**
"응답시간을 줄였다" 같은 서술 대신, 해당 코드와 커밋을 가리키는 permalink를 함께 답니다.
브랜치가 아니라 **커밋 SHA에 고정**해서 이후 코드가 바뀌어도 근거가 유효하도록 했고,
현재 코드와 시점이 어긋나는 주장에는 그 사실을 명시하는 주석을 답니다.

**미디어 최적화**
시연 화면 녹화를 GIF에서 H.264 MP4로 전환해 영상 3개 합계 **907KB**까지 줄였습니다.
영상은 `IntersectionObserver`로 뷰포트에 보일 때만 재생해 화면 밖 디코딩을 막고,
갤러리 썸네일은 자동재생 자체를 끕니다.

**화면 폭에 따른 다이어그램 전환**
아키텍처 다이어그램은 가로로 넓어(최대 1420×652) 좁은 화면에서는 판독이 어렵습니다.
데스크톱에서는 상세 다이어그램을 그대로 싣고, 모바일 · 태블릿에서는 세로로 읽히는 요약을
보여준 뒤 전체화면에서 좌우로 훑어볼 수 있게 했습니다.

**테마 전환 깜빡임 제거**
첫 페인트 전에 실행되는 인라인 스크립트로 테마 클래스를 적용하고, Zustand `persist`의
지연 rehydration이 아이콘 전환 애니메이션을 잘못 트리거하던 문제도 함께 해결했습니다.

## 로컬 실행

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

```bash
pnpm build    # 프로덕션 빌드
pnpm lint     # eslint
```

## 연락

[![Email](https://img.shields.io/badge/Email-EA4335?style=flat-square&logo=gmail&logoColor=white)](mailto:dltpals7498@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/smnm1998)
[![Blog](https://img.shields.io/badge/Blog-EA5504?style=flat-square&logo=tistory&logoColor=white)](https://smnm9812.tistory.com/)
