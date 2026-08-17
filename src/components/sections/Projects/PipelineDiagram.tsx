'use client';

import { ChevronDown } from 'lucide-react';
import type { PipelineStage } from '@/data/projects';

const styles = {
  panel: 'w-full rounded-2xl bg-gray-100 dark:bg-white/5 p-8 md:p-10',
  wrap: 'flex flex-col items-center gap-2 w-full max-w-md mx-auto',
  step: 'flex flex-col items-center gap-2 w-full',
  stage: 'w-full rounded-xl shadow-sm bg-white dark:bg-white/10 px-5 py-3 text-center',
  output:
    'flex-1 max-w-[180px] rounded-xl shadow-sm border-2 border-gray-900 dark:border-gray-100 bg-white dark:bg-white/10 px-4 py-3 text-center',
  label: 'text-sm font-semibold text-gray-900 dark:text-gray-100',
  detail: 'text-xs text-gray-400 dark:text-gray-500 mt-0.5',
  chevron: 'text-gray-300 dark:text-gray-600',
  outputRow: 'flex gap-4 w-full justify-center',
} as const;

function StageBox({ stage, variant }: { stage: PipelineStage; variant: 'stage' | 'output' }) {
  return (
    <div className={variant === 'stage' ? styles.stage : styles.output}>
      <p className={styles.label}>{stage.label}</p>
      {stage.detail && <p className={styles.detail}>{stage.detail}</p>}
    </div>
  );
}

export default function PipelineDiagram({
  stages,
  outputs,
}: {
  stages: PipelineStage[];
  outputs: PipelineStage[];
}) {
  return (
    <div className={styles.panel}>
      <div className={styles.wrap}>
        {stages.map((stage) => (
          <div key={stage.label} className={styles.step}>
            <StageBox stage={stage} variant="stage" />
            <ChevronDown size={18} className={styles.chevron} />
          </div>
        ))}
        <div className={styles.outputRow}>
          {outputs.map((output) => (
            <StageBox key={output.label} stage={output} variant="output" />
          ))}
        </div>
      </div>
    </div>
  );
}
