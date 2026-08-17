'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { createContainerVariants, fadeUpVariants } from '@/lib/motionVariants';
import { useSectionInView } from '@/lib/useSectionInView';
import SectionHeader from './shared/SectionHeader';

const styles = {
  wrapper: 'flex-1 flex flex-col items-center justify-center gap-8 px-5 md:px-10 lg:px-16',
  header: 'w-full max-w-5xl',
  // 3:2로 나눠야 좌측 설명 문장이 한 줄에 들어간다.
  body: 'w-full max-w-5xl grid grid-cols-1 gap-8 lg:grid-cols-[3fr_2fr] lg:gap-0',
  colTitle: 'text-sm font-semibold text-gray-900 dark:text-gray-100',
  colTitleNote: 'ml-2 text-xs font-normal text-gray-400 dark:text-gray-500',
  mainCol: 'flex flex-col gap-6',
  mainList: 'flex flex-col gap-6',
  mainItem: 'flex items-start gap-4 md:gap-6',
  mainIconContainer: 'w-16 h-16 md:w-24 md:h-24 shrink-0 flex items-center justify-center',
  mainIcon: 'w-full h-full object-contain',
  mainText: 'flex flex-col gap-2 pt-1',
  mainName: 'text-xl font-semibold text-gray-900 dark:text-gray-100',
  mainDescs: 'flex flex-col gap-1',
  mainDesc:
    "text-sm text-gray-400 dark:text-gray-300 leading-relaxed before:content-['·'] before:mr-1.5",
  // 두 컬럼 사이 구분선 — 좁은 화면에서는 위쪽 가로선, lg부터는 왼쪽 세로선.
  // lg에서는 아래 목록이 남은 높이를 먹고 스스로 중앙에 서므로 제목과의 간격이 필요 없다.
  etcCol:
    'flex flex-col max-lg:gap-6 border-t border-gray-200 dark:border-gray-600 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8',
  etcList: 'flex flex-col gap-5 lg:flex-1 lg:justify-center',
  etcGroup: 'flex flex-col gap-2.5',
  etcCategory:
    'text-[10px] font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400',
  // 이름 길이 편차가 커서 고정폭 칸에 넣으면 깨진다. 너비가 내용을 따라가는 칩으로 둔다.
  etcRow: 'flex flex-wrap gap-3',
  etcItem: 'flex items-center gap-1.5 rounded-full bg-gray-100 dark:bg-white/10 py-1 pl-2 pr-2.5',
  etcIcon: 'w-4 h-4 object-contain',
  etcName: 'text-xs text-gray-600 dark:text-gray-300 leading-none whitespace-nowrap',
} as const;

const containerVariants = createContainerVariants(0.08);

const mainSkills = [
  {
    name: 'JavaScript',
    icon: '/icons/javascript.svg',
    descs: [
      '비동기 흐름과 요청 상태(로딩·중복 방지)를 직접 다뤘습니다.',
      '재귀 함수와 setTimeout으로 타이핑 인터랙션을 구현했습니다.',
    ],
  },
  {
    name: 'TypeScript',
    icon: '/icons/typescript.svg',
    descs: [
      '유니언 타입으로 잘못된 상태 조합을 원천 차단했습니다.',
      '제네릭 유틸로 흩어진 로직을 한곳에 모은 경험이 있습니다.',
    ],
  },
  {
    name: 'React',
    icon: '/icons/react.svg',
    descs: [
      '반복 로직을 커스텀 훅으로 분리해 컴포넌트를 얇게 유지했습니다.',
      'Zustand selector로 필요한 값만 구독해 리렌더를 줄였습니다.',
    ],
  },
  {
    name: 'Next.js',
    icon: '/icons/next.svg',
    descs: [
      'App Router에서 서버·클라이언트 컴포넌트를 나눠 설계했습니다.',
      '라우트별 메타데이터·사이트맵으로 SEO를 정비했습니다.',
    ],
  },
  {
    name: 'NestJS',
    icon: '/icons/nestjs.svg',
    descs: [
      'REST API를 설계해 Railway에 배포·운영했습니다.',
      'SSE와 외부 API 병렬 호출로 응답 시간을 줄였습니다.',
    ],
  },
] as const;

const etcSkillGroups = [
  {
    category: 'Frontend',
    skills: [
      { name: 'HTML5', icon: '/icons/html5.svg' },
      { name: 'CSS3', icon: '/icons/css3.svg' },
      { name: 'Zustand', icon: '/icons/zustand.svg' },
    ],
  },
  {
    category: 'Backend',
    skills: [{ name: 'Node.js', icon: '/icons/node.svg' }],
  },
  {
    category: 'Database',
    skills: [
      { name: 'MariaDB', icon: '/icons/mariadb.svg' },
      { name: 'PostgreSQL', icon: '/icons/postgresql.svg' },
      { name: 'Prisma', icon: '/icons/prisma.svg' },
      { name: 'Supabase', icon: '/icons/supabase.svg' },
      { name: 'Neon', icon: '/icons/neon-tech.svg' },
    ],
  },
  {
    category: 'Deployment',
    skills: [
      { name: 'Vercel', icon: '/icons/vercel.svg' },
      { name: 'Railway', icon: '/icons/railway.svg' },
    ],
  },
  {
    category: 'Tools / Design',
    skills: [
      { name: 'Claude Code', icon: '/icons/anthropic.svg' },
      { name: 'Turborepo', icon: '/icons/turborepo.svg' },
      { name: 'Jira', icon: '/icons/jira.svg' },
      { name: 'Notion', icon: '/icons/notion.svg' },
      { name: 'Figma', icon: '/icons/figma.svg' },
    ],
  },
  {
    category: 'API',
    skills: [
      { name: 'OpenAI API', icon: '/icons/openai.svg' },
      { name: 'KakaoMap API', icon: '/icons/kakaomap.png' },
      { name: 'Spotify API', icon: '/icons/spotify.svg' },
      { name: 'iTunes Search API', icon: '/icons/applemusic.svg' },
      { name: 'Last.fm API', icon: '/icons/lastfm.svg' },
    ],
  },
] as const;

export default function Skills() {
  const { ref, isInView } = useSectionInView(0.3);

  return (
    <div className={styles.wrapper}>
      <SectionHeader title="Skills" isInView={isInView} className={styles.header} />

      <motion.div
        ref={ref}
        className={styles.body}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
      >
        <motion.div className={styles.mainCol} variants={containerVariants}>
          <motion.h3 className={styles.colTitle} variants={fadeUpVariants}>
            메인 기술 스택
            <span className={styles.colTitleNote}>프로젝트에서 주로 사용하였습니다.</span>
          </motion.h3>

          <div className={styles.mainList}>
            {mainSkills.map(({ name, icon, descs }) => (
              <motion.div key={name} className={styles.mainItem} variants={fadeUpVariants}>
                <div className={styles.mainIconContainer}>
                  <Image src={icon} alt={name} width={96} height={96} className={styles.mainIcon} />
                </div>
                <div className={styles.mainText}>
                  <span className={styles.mainName}>{name}</span>
                  <div className={styles.mainDescs}>
                    {descs.map((desc) => (
                      <span key={desc} className={styles.mainDesc}>
                        {desc}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div className={styles.etcCol} variants={containerVariants}>
          <motion.h3 className={styles.colTitle} variants={fadeUpVariants}>
            경험해본 기술 스택
            <span className={styles.colTitleNote}>프로젝트에서 사용한 경험이 있습니다.</span>
          </motion.h3>

          <div className={styles.etcList}>
            {etcSkillGroups.map(({ category, skills }) => (
              <motion.div key={category} className={styles.etcGroup} variants={fadeUpVariants}>
                <span className={styles.etcCategory}>{category}</span>
                <div className={styles.etcRow}>
                  {skills.map(({ name, icon }) => (
                    <div key={name} className={styles.etcItem}>
                      <Image
                        src={icon}
                        alt={name}
                        width={36}
                        height={36}
                        className={styles.etcIcon}
                      />
                      <span className={styles.etcName}>{name}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
