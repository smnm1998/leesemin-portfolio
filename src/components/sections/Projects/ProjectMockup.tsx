'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { fadeUpVariants } from '@/lib/motionVariants';
import type { Project } from '@/data/projects';
import MediaView from './MediaView';

const styles = {
  mockupWrap: 'w-full lg:w-96 lg:shrink-0',
  mockup: 'w-full aspect-video rounded-2xl overflow-hidden shadow-lg',
} as const;

export default function ProjectMockup({ project }: { project: Project }) {
  const router = useRouter();

  return (
    <motion.div className={styles.mockupWrap} variants={fadeUpVariants}>
      <div
        className={`${styles.mockup} group relative cursor-pointer`}
        onClick={() => router.push(`/projects/${project.slug}`)}
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
      </div>
    </motion.div>
  );
}
