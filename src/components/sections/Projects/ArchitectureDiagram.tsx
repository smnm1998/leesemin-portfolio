'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2 } from 'lucide-react';
import type { PipelineStage } from '@/data/projects';
import { useThemeStore } from '@/store/themeStore';
import PipelineDiagram from './PipelineDiagram';

type Diagram = { src: string; width: number; height: number };

const styles = {
  frame: 'w-full rounded-2xl overflow-hidden shadow-sm bg-gray-100 dark:bg-white/5',
  iframe: 'w-full h-full border-0',
  detailButton:
    'inline-flex items-center gap-1.5 self-center px-4 py-2 rounded-full border border-gray-200 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors',
  overlay: 'fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col',
  overlayBar: 'flex items-center justify-between px-4 py-3 shrink-0',
  overlayTitle: 'text-sm text-white/70',
  closeButton: 'p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors',
  // 다이어그램이 가로로 넓어서, 높이를 화면에 맞추고 가로로 스크롤해 훑어보게 한다.
  scroller: 'flex-1 overflow-x-auto overflow-y-hidden px-4 pb-4',
  hint: 'text-center text-xs text-white/40 pb-3 shrink-0',
} as const;

export default function ArchitectureDiagram({
  diagram,
  title,
  pipeline,
}: {
  diagram: Diagram;
  title: string;
  pipeline?: { stages: PipelineStage[]; outputs: PipelineStage[] };
}) {
  const isDark = useThemeStore((s) => s.isDark);
  const [expanded, setExpanded] = useState(false);
  const src = `${diagram.src}?embed=1&theme=${isDark ? 'dark' : 'light'}`;

  // 전체화면으로 열려 있는 동안 배경 스크롤을 막고, ESC로 닫는다.
  useEffect(() => {
    if (!expanded) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
    };
  }, [expanded]);

  return (
    <>
      {/* 데스크톱: 상세 다이어그램을 그대로 인라인으로 */}
      <div
        className={`hidden lg:block ${styles.frame}`}
        style={{ aspectRatio: `${diagram.width} / ${diagram.height}` }}
      >
        <iframe src={src} title={title} loading="lazy" className={styles.iframe} />
      </div>

      {/* 모바일·태블릿: 세로로 읽히는 요약 + 전체화면으로 여는 버튼 */}
      <div className="flex flex-col gap-4 lg:hidden">
        {pipeline && <PipelineDiagram stages={pipeline.stages} outputs={pipeline.outputs} />}
        <button type="button" onClick={() => setExpanded(true)} className={styles.detailButton}>
          <Maximize2 size={15} /> 상세하게 보기
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className={styles.overlayBar}>
              <span className={styles.overlayTitle}>{title}</span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                className={styles.closeButton}
                aria-label="닫기"
              >
                <X size={22} />
              </button>
            </div>

            <div className={styles.scroller}>
              <div
                className="h-full rounded-xl overflow-hidden bg-gray-100 dark:bg-white/5"
                style={{ aspectRatio: `${diagram.width} / ${diagram.height}` }}
              >
                <iframe src={src} title={title} className={styles.iframe} />
              </div>
            </div>

            <p className={styles.hint}>좌우로 스크롤해 살펴보세요</p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
