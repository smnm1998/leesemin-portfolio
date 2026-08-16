'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import type { Project } from '@/data/projects';
import Aside, { type Section } from '@/components/Aside';
import { createContainerVariants, fadeUpVariants } from '@/lib/motionVariants';
import { readMainScroll, saveTargetSection, saveTargetScroll } from '@/lib/scrollMemory';
import Lightbox from './Lightbox';
import PipelineDiagram from './PipelineDiagram';
import TimingChart from './TimingChart';
import ComparisonChart from './ComparisonChart';
import MediaView from './MediaView';

const styles = {
  // 홈과 동일하게 문서가 스크롤 주체 — Aside는 fixed, 본문은 그만큼 밀어준다.
  shell: '',
  main: 'ml-16',
  wrapper: 'flex flex-col items-center px-16 py-20',
  inner: 'w-full max-w-5xl flex flex-col gap-10',
  back: 'inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors w-fit',

  header: 'flex flex-col gap-3',
  context: 'text-xs font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500',
  titleRow: 'flex items-end justify-between gap-6 flex-wrap',
  titleMain: 'flex items-baseline gap-3 flex-wrap',
  name: 'text-5xl font-semibold text-gray-900 dark:text-gray-100',
  links: 'flex gap-3 shrink-0',
  link: 'flex items-center gap-2 px-4 py-2.5 rounded-full border border-gray-200 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors',

  techRow: 'flex flex-wrap gap-2 mt-6',
  tech: 'px-2.5 py-1 rounded-full text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300',

  cover: 'w-fit max-w-full self-center rounded-2xl overflow-hidden shadow-lg',

  story: 'flex flex-col gap-11',
  section: 'flex flex-col gap-3',
  sectionTitle: 'text-2xl font-semibold text-gray-900 dark:text-gray-100',
  sectionContent: 'text-[17px] leading-[1.85] text-gray-500 dark:text-gray-400',
  sectionNote: 'text-sm text-gray-400 dark:text-gray-500 italic leading-relaxed',
  evidenceRow: 'flex flex-wrap items-center gap-x-3 gap-y-1.5',
  evidenceLabel: 'text-xs font-mono text-gray-400 dark:text-gray-500',
  evidenceLink:
    'text-xs font-mono text-gray-500 dark:text-gray-400 underline decoration-gray-300 dark:decoration-gray-600 underline-offset-2 hover:text-gray-900 dark:hover:text-gray-100 transition-colors',

  galleryBlock: 'flex flex-col gap-5',
  gallery: 'grid grid-cols-3 gap-4',
  galleryItem: 'group relative aspect-video rounded-xl overflow-hidden shadow-lg cursor-pointer',
} as const;

const containerVariants = createContainerVariants(0.1);

export default function ProjectDetailView({ project }: { project: Project }) {
  const router = useRouter();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // 이동할 섹션을 명시적으로 저장해두고 홈으로 이동한다(URL 해시 대신). 해시는 홈 내부에서
  // Aside를 눌러 스크롤만 해도 갱신되지 않아 낡은 값으로 남을 수 있는데, 그 낡은 해시가
  // 다음 뒤로가기 때 스크롤 복원 로직보다 먼저 적용되며 "엉뚱한 섹션으로 튐" 버그를 만들었다.
  const goToSection = (id: Section) => {
    saveTargetSection(id);
    router.push('/', { scroll: false });
  };

  // router.back()은 쓰지 않는다: 임베드된 아키텍처 다이어그램(iframe)이 테마 전환 등으로
  // 자체 내비게이션을 하면 그것도 브라우저의 조인트 세션 히스토리에 쌓이는데, 그러면 "뒤로가기"가
  // 실제 페이지 이탈이 아니라 그 iframe 안에서 있었던 일을 한 단계씩 되감아버린다(재현 확인함).
  // 대신 홈이 계속 갱신해두는 스크롤 위치를 목적지로 넘기는 forward navigation만 사용한다.
  const goBackToList = () => {
    const previousScroll = readMainScroll();
    if (previousScroll === null) {
      saveTargetSection('projects');
    } else {
      saveTargetScroll(previousScroll);
    }
    router.push('/', { scroll: false });
  };

  return (
    <div className={styles.shell}>
      <Aside activeSection="projects" onSectionChange={goToSection} />

      <main className={styles.main}>
        <div className={styles.wrapper}>
          <motion.div
            className={styles.inner}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeUpVariants}>
              <button type="button" onClick={goBackToList} className={styles.back}>
                <ArrowLeft size={16} /> 목록으로
              </button>
            </motion.div>

            <motion.div className={styles.header} variants={fadeUpVariants}>
              {project.context && <span className={styles.context}>{project.context}</span>}
              <div className={styles.titleRow}>
                <div className={styles.titleMain}>
                  <h1 className={styles.name}>{project.name}</h1>
                  {project.period && (
                    <span className="text-sm text-gray-400 dark:text-gray-500">
                      {project.period}
                    </span>
                  )}
                </div>
                <div className={styles.links}>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      <ExternalLink size={15} /> GitHub
                    </a>
                  )}
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                    >
                      <ExternalLink size={15} /> Live
                    </a>
                  )}
                </div>
              </div>
              {project.tech.length > 0 && (
                <div className={styles.techRow}>
                  {project.tech.map((t) => (
                    <span key={t} className={styles.tech}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>

            {project.media && project.media.length > 0 && (
              <motion.div className={styles.cover} variants={fadeUpVariants}>
                <MediaView
                  item={project.media[0]}
                  alt={project.name}
                  width={1200}
                  height={578}
                  className="block max-w-[680px] max-h-[560px] w-auto h-auto object-contain"
                />
              </motion.div>
            )}

            {project.pipeline && (
              <motion.div className={styles.section} variants={fadeUpVariants}>
                <h2 className={styles.sectionTitle}>Architecture</h2>
                <PipelineDiagram
                  stages={project.pipeline.stages}
                  outputs={project.pipeline.outputs}
                />
              </motion.div>
            )}

            <motion.div className={styles.story} variants={fadeUpVariants}>
              {project.sections?.map((section) => (
                <div key={section.title} className={styles.section}>
                  <h2 className={styles.sectionTitle}>{section.title}</h2>
                  <p className={styles.sectionContent}>{section.content}</p>
                  {section.timingChart && <TimingChart rows={section.timingChart} />}
                  {section.comparisonChart && <ComparisonChart rows={section.comparisonChart} />}
                  {section.note && <p className={styles.sectionNote}>※ {section.note}</p>}
                  {section.evidence && section.evidence.length > 0 && (
                    <div className={styles.evidenceRow}>
                      <span className={styles.evidenceLabel}>근거</span>
                      {section.evidence.map((e) => (
                        <a
                          key={e.url}
                          href={e.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.evidenceLink}
                        >
                          {e.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </motion.div>

            {project.media && project.media.length > 0 && (
              <motion.div className={styles.galleryBlock} variants={fadeUpVariants}>
                <h2 className={styles.sectionTitle}>Gallery</h2>
                <div className={styles.gallery}>
                  {project.media.map((item, i) => (
                    <button
                      key={i}
                      className={styles.galleryItem}
                      onClick={() => setLightboxIndex(i)}
                    >
                      <MediaView
                        item={item}
                        alt={`${project.name} preview ${i + 1}`}
                        width={640}
                        height={360}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        autoPlay={false}
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/45 transition-colors duration-300 flex items-center justify-center">
                        <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          크게 보기
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      <AnimatePresence>
        {lightboxIndex !== null && project.media && (
          <Lightbox
            media={project.media}
            initialIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
