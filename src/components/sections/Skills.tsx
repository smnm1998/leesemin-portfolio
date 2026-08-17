'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { createContainerVariants, fadeUpVariants } from '@/lib/motionVariants';
import { useSectionInView } from '@/lib/useSectionInView';
import SectionHeader from './shared/SectionHeader';

const styles = {
  wrapper: 'flex-1 flex flex-col items-center justify-center gap-8 px-5 md:px-10 lg:px-16',
  header: 'w-full max-w-5xl',
  // 설명이 붙은 주력 스킬은 왼쪽 세로, 아이콘만 나열하는 기타 스킬은 오른쪽.
  // lg 미만에서는 위아래로 쌓는다.
  body: 'w-full max-w-5xl grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-0',
  mainCol: 'flex flex-col gap-6',
  mainItem: 'flex items-start gap-4 md:gap-6',
  mainIconContainer:
    'w-16 h-16 md:w-24 md:h-24 lg:w-28 lg:h-28 shrink-0 flex items-center justify-center',
  mainIcon: 'w-full h-full object-contain',
  mainText: 'flex flex-col gap-2 pt-1',
  mainName: 'text-xl font-semibold text-gray-900 dark:text-gray-100',
  mainDescs: 'flex flex-col gap-1',
  mainDesc:
    "text-sm text-gray-400 dark:text-gray-300 leading-relaxed before:content-['·'] before:mr-1.5",
  // 두 컬럼 사이 구분선 — 좁은 화면에서는 위쪽 가로선, lg부터는 왼쪽 세로선.
  etcCol:
    'flex flex-col gap-5 border-t border-gray-200 dark:border-gray-600 pt-8 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-12',
  etcGroup: 'flex flex-col gap-2.5',
  etcCategory:
    'text-[10px] font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400',
  etcRow: 'flex flex-wrap gap-x-5 gap-y-3',
  etcItem: 'flex flex-col items-center gap-1.5 w-16',
  etcIcon: 'w-9 h-9 object-contain',
  etcName: 'text-xs text-gray-600 dark:text-gray-300 text-center leading-tight',
} as const;

const containerVariants = createContainerVariants(0.08);

const mainSkills = [
  {
    name: 'JavaScript',
    icon: '/icons/javascript.svg',
    descs: ['ES6+ 문법에 익숙합니다.', '비동기 처리(Promise, async/await)를 능숙하게 다룹니다.'],
  },
  {
    name: 'TypeScript',
    icon: '/icons/typescript.svg',
    descs: [
      '타입 시스템을 활용한 안정적인 개발을 합니다.',
      '제네릭, 유니언 타입 등을 활용한 경험이 있습니다.',
    ],
  },
  {
    name: 'React',
    icon: '/icons/react.svg',
    descs: [
      '컴포넌트 기반 설계 및 최적화 경험이 있습니다.',
      '커스텀 훅, Context, Zustand를 활용한 상태관리를 합니다.',
    ],
  },
  {
    name: 'Next.js',
    icon: '/icons/next.svg',
    descs: [
      'Vercel, Supabase 조합으로 배포한 경험이 있습니다.',
      'App Router 기반 SSR/SSG 구조를 이해하고 활용합니다.',
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
    skills: [
      { name: 'Node.js', icon: '/icons/node.svg' },
      { name: 'NestJS', icon: '/icons/nestjs.svg' },
    ],
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
    category: 'Design / Tools',
    skills: [
      { name: 'turborepo', icon: '/icons/turborepo.svg' },
      { name: 'Claude Code', icon: '/icons/anthropic.svg' },
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
          {mainSkills.map(({ name, icon, descs }) => (
            <motion.div key={name} className={styles.mainItem} variants={fadeUpVariants}>
              <div className={styles.mainIconContainer}>
                <Image src={icon} alt={name} width={112} height={112} className={styles.mainIcon} />
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
        </motion.div>

        <motion.div className={styles.etcCol} variants={containerVariants}>
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
        </motion.div>
      </motion.div>
    </div>
  );
}
