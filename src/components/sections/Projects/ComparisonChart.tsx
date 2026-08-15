'use client';

const styles = {
  panel: 'w-full rounded-2xl bg-gray-100 dark:bg-white/5 p-6 flex flex-col gap-5',
  legend: 'flex gap-4',
  legendItem: 'flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500',
  dotBefore: 'w-2 h-2 rounded-sm bg-gray-300 dark:bg-gray-600 shrink-0',
  dotAfter: 'w-2 h-2 rounded-sm bg-gray-900 dark:bg-gray-100 shrink-0',
  group: 'flex flex-col gap-1.5',
  groupLabel: 'text-sm font-semibold text-gray-900 dark:text-gray-100',
  row: 'flex items-center gap-2',
  rowLabel: 'w-12 shrink-0 text-[11px] font-mono text-gray-400 dark:text-gray-500',
  track: 'flex-1 h-3.5 rounded-full bg-white dark:bg-white/10 overflow-hidden',
  fillBefore: 'h-full rounded-full bg-gray-300 dark:bg-gray-600',
  fillAfter: 'h-full rounded-full bg-gray-900 dark:bg-gray-100',
  val: 'w-10 shrink-0 text-right text-[11px] font-mono text-gray-500 dark:text-gray-400 tabular-nums',
} as const;

export type ComparisonRow = {
  label: string;
  before: number;
  after: number;
};

export default function ComparisonChart({ rows }: { rows: ComparisonRow[] }) {
  return (
    <div className={styles.panel}>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.dotBefore} />
          수정 전
        </span>
        <span className={styles.legendItem}>
          <span className={styles.dotAfter} />
          수정 후
        </span>
      </div>
      {rows.map((row) => (
        <div key={row.label} className={styles.group}>
          <p className={styles.groupLabel}>{row.label}</p>
          <div className={styles.row}>
            <span className={styles.rowLabel}>before</span>
            <div className={styles.track}>
              <div className={styles.fillBefore} style={{ width: `${row.before}%` }} />
            </div>
            <span className={styles.val}>{row.before}%</span>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>after</span>
            <div className={styles.track}>
              <div className={styles.fillAfter} style={{ width: `${row.after}%` }} />
            </div>
            <span className={styles.val}>{row.after}%</span>
          </div>
        </div>
      ))}
    </div>
  );
}
