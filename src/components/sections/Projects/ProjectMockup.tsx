'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { fadeUpVariants } from '@/lib/motionVariants';
import type { Project } from '@/data/projects';
import MediaView from './MediaView';

const styles = {
  mockupWrap: 'w-96 shrink-0',
  mockup: 'w-full aspect-video rounded-2xl overflow-hidden shadow-lg',
  mockupBar: 'flex items-center gap-1.5 px-4 py-3',
  mockupDot: 'w-2.5 h-2.5 rounded-full',
  mockupBody: 'flex-1 flex items-center justify-center pb-6',
  mockupProjectName: 'text-white/80 text-2xl font-semibold tracking-wide',
} as const;

export default function ProjectMockup({ project }: { project: Project }) {
  const router = useRouter();
  const isPlaceholder = !project.description;

  return (
    <motion.div className={styles.mockupWrap} variants={fadeUpVariants}>
      <div
        className={`${styles.mockup} ${isPlaceholder ? '' : 'group relative cursor-pointer'}`}
        onClick={() => !isPlaceholder && router.push(`/projects/${project.slug}`)}
      >
        {project.media ? (
          <>
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
          </>
        ) : (
          <div className={`flex flex-col h-full bg-linear-to-br ${project.gradient}`}>
            <div className={styles.mockupBar}>
              <span className={`${styles.mockupDot} bg-white/30`} />
              <span className={`${styles.mockupDot} bg-white/30`} />
              <span className={`${styles.mockupDot} bg-white/30`} />
            </div>
            <div className={styles.mockupBody}>
              <span className={styles.mockupProjectName}>{project.name}</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
