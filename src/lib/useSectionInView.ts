import { useRef } from 'react';
import { useInView } from 'framer-motion';

export function useSectionInView(amount: number) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount });

  return { ref, isInView };
}
