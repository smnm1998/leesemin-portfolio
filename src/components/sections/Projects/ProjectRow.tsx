'use client';

import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { fadeUpVariants } from '@/lib/motionVariants';
import type { Project } from '@/data/projects';
import ProjectMockup from './ProjectMockup';
import TechTags from './TechTags';

const styles = {
  // 좁은 화면에서는 목업을 텍스트 위로 올려 한 줄씩 쌓는다.
  row: 'flex flex-col-reverse gap-6 lg:flex-row lg:items-center lg:gap-14',
  content: 'flex-1 flex flex-col gap-5',
  context: 'text-xs font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500',
  name: 'text-3xl lg:text-4xl font-semibold text-gray-900 dark:text-gray-100',
  desc: 'text-sm text-gray-500 dark:text-gray-400 leading-relaxed',
  links: 'flex gap-3',
  link: 'flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors',
  linkDisabled: 'flex items-center gap-1.5 text-sm text-gray-300 dark:text-gray-600 cursor-default',
  rowDivider: 'border-t border-gray-100 dark:border-white/5',
} as const;

export default function ProjectRow({ project, isFirst }: { project: Project; isFirst: boolean }) {
  const isPlaceholder = !project.description;

  return (
    <>
      {!isFirst && <hr className={`${styles.rowDivider} mb-10`} />}
      <div className={styles.row}>
        <motion.div className={styles.content} variants={fadeUpVariants}>
          {isPlaceholder ? (
            <p className="text-gray-300 dark:text-gray-600 text-sm">준비 중입니다.</p>
          ) : (
            <>
              {project.context && <span className={styles.context}>{project.context}</span>}
              <div className="flex items-baseline gap-3">
                <h2 className={styles.name}>{project.name}</h2>
                {project.period && (
                  <span className="text-sm text-gray-400 dark:text-gray-500">{project.period}</span>
                )}
              </div>
              <p className={styles.desc}>{project.description}</p>
              <TechTags tech={project.tech} />
              <div className={styles.links}>
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    <ExternalLink size={14} /> GitHub
                  </a>
                ) : (
                  <span className={styles.linkDisabled}>
                    <ExternalLink size={14} /> GitHub
                  </span>
                )}
                {project.live ? (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.link}
                  >
                    <ExternalLink size={14} /> Live
                  </a>
                ) : (
                  <span className={styles.linkDisabled}>
                    <ExternalLink size={14} /> Live
                  </span>
                )}
              </div>
            </>
          )}
        </motion.div>
        <ProjectMockup project={project} />
      </div>
    </>
  );
}
