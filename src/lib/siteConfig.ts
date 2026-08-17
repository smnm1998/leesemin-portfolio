function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return 'http://localhost:3000';
}

export const siteConfig = {
  url: resolveSiteUrl(),
  name: '이세민 포트폴리오',
  title: '개발자 이세민 포트폴리오',
  description:
    '프론트엔드 개발자 이세민의 포트폴리오입니다. React·Next.js·TypeScript로 만든 프로젝트를 아키텍처와 실측 지표, 근거 링크와 함께 정리했습니다.',
  author: '이세민',
  ogImage: '/og.png',
  keywords: [
    '이세민',
    '프론트엔드 개발자',
    '포트폴리오',
    'React',
    'Next.js',
    'TypeScript',
    '신입 프론트엔드',
  ],
} as const;
