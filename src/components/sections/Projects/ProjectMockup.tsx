'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { fadeUpVariants } from '@/lib/motionVariants';
import type { Project } from '@/data/projects';
import MediaView from './MediaView';

const styles = {
  mockupWrap: 'w-full lg:w-96 lg:shrink-0',
  mockup: 'group relative block w-full aspect-video rounded-2xl overflow-hidden shadow-lg',
} as const;

export default function ProjectMockup({ project }: { project: Project }) {
  return (
    <motion.div className={styles.mockupWrap} variants={fadeUpVariants}>
      {/* 실제 링크여야 키보드 이동·새 탭 열기·크롤링이 된다. 영상 카드는 alt가 없어 이름을 직접 준다. */}
      <Link
        href={`/projects/${project.slug}`}
        className={styles.mockup}
        aria-label={`${project.name} 상세 보기`}
      >
        <MediaView
          item={project.media[0]}
          alt={project.name}
          width={384}
          height={216}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
          <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            자세히 보기
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
