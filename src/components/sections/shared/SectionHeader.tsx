'use client';

import { motion } from 'framer-motion';

const styles = {
  title: 'text-sm font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-3',
  titleTight:
    'text-sm font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-1',
  hint: 'text-xs text-gray-400 dark:text-gray-500 mb-3',
  divider: 'border-t border-gray-200 dark:border-gray-600',
} as const;

export default function SectionHeader({
  title,
  isInView,
  className,
  hint,
}: {
  title: string;
  isInView: boolean;
  className?: string;
  hint?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <p className={hint ? styles.titleTight : styles.title}>{title}</p>
      {hint && <p className={styles.hint}>{hint}</p>}
      <hr className={styles.divider} />
    </motion.div>
  );
}
