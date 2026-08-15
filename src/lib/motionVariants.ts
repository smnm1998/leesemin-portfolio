import type { Variants } from 'framer-motion';

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export function createContainerVariants(staggerChildren: number): Variants {
  return {
    hidden: {},
    visible: { transition: { staggerChildren } },
  };
}
