const styles = {
  row: 'flex flex-wrap gap-2',
  tag: 'px-2.5 py-1 rounded-full text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300',
} as const;

export default function TechTags({ tech, className }: { tech: string[]; className?: string }) {
  if (tech.length === 0) return null;

  return (
    <div className={className ? `${styles.row} ${className}` : styles.row}>
      {tech.map((t) => (
        <span key={t} className={styles.tag}>
          {t}
        </span>
      ))}
    </div>
  );
}
