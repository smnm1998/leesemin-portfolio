'use client';

const styles = {
  panel: 'w-full rounded-2xl bg-gray-100 dark:bg-white/5 p-6 flex flex-col gap-4',
  legend: 'flex gap-4',
  legendItem: 'flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500',
  dotA: 'w-2 h-2 rounded-sm bg-gray-900 dark:bg-gray-100 shrink-0',
  dotB: 'w-2 h-2 rounded-sm bg-gray-300 dark:bg-gray-600 shrink-0',
  row: 'flex items-center gap-3',
  label: 'w-28 shrink-0 text-xs text-gray-500 dark:text-gray-400',
  track: 'flex-1 h-5 rounded-md bg-white dark:bg-white/10 overflow-hidden flex',
  segA: 'h-full bg-gray-900 dark:bg-gray-100',
  segB: 'h-full bg-gray-300 dark:bg-gray-600',
  total:
    'w-12 shrink-0 text-right text-xs font-mono font-semibold text-gray-900 dark:text-gray-100 tabular-nums',
} as const;

export type TimingRow = {
  label: string;
  segments: { label: string; seconds: number }[];
};

export default function TimingChart({ rows }: { rows: TimingRow[] }) {
  const max = Math.max(...rows.map((row) => row.segments.reduce((sum, seg) => sum + seg.seconds, 0)));

  return (
    <div className={styles.panel}>
      <div className={styles.legend}>
        {rows[0]?.segments.map((seg, i) => (
          <span key={seg.label} className={styles.legendItem}>
            <span className={i === 0 ? styles.dotA : styles.dotB} />
            {seg.label}
          </span>
        ))}
      </div>
      {rows.map((row) => {
        const total = row.segments.reduce((sum, seg) => sum + seg.seconds, 0);
        return (
          <div key={row.label} className={styles.row}>
            <span className={styles.label}>{row.label}</span>
            <div className={styles.track}>
              {row.segments.map((seg, i) => (
                <div
                  key={seg.label}
                  className={i === 0 ? styles.segA : styles.segB}
                  style={{ width: `${(seg.seconds / max) * 100}%` }}
                />
              ))}
            </div>
            <span className={styles.total}>{total.toFixed(1)}s</span>
          </div>
        );
      })}
    </div>
  );
}
