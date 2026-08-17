# 이세민 포트폴리오

프론트엔드 개발자 이세민의 개인 포트폴리오 사이트입니다.

## 스택

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript
- **UI**: React 19, Tailwind CSS v4, Framer Motion, lucide-react
- **State**: Zustand (다크/라이트 테마)

## 구조

한 페이지(Hero → Skills → Projects → Contact)와, 프로젝트별 상세페이지(`/projects/[slug]`)로 구성됩니다.

```
src/
├── app/
│   ├── page.tsx                 # 메인 페이지(단일 스크롤)
│   └── projects/[slug]/         # 프로젝트 상세페이지
├── components/
│   ├── Aside.tsx                # 좌측 네비게이션 + 테마 토글
│   └── sections/
│       ├── Hero.tsx / Skills.tsx / Contact.tsx
│       └── Projects/            # 목록·상세·미디어·차트 컴포넌트
├── data/projects.ts             # 프로젝트 데이터(콘텐츠·근거 링크·차트 값)
├── lib/                         # 모션 variants, 스크롤 상태 유틸
└── store/themeStore.ts          # 테마 상태(zustand + persist)
```

프로젝트 콘텐츠는 전부 `src/data/projects.ts`에 선언적으로 들어있고, 정량적인 주장에는
실제 커밋에 고정된 GitHub permalink를 근거로 붙여둡니다.

## 로컬 실행

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

```bash
pnpm build    # 프로덕션 빌드
pnpm lint     # eslint
```
