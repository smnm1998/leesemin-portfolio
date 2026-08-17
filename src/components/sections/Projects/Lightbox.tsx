'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { MediaItem } from '@/data/projects';
import MediaView from './MediaView';

export default function Lightbox({
  media,
  initialIndex,
  onClose,
}: {
  media: MediaItem[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [idx, setIdx] = useState(initialIndex);

  const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setIdx((i) => Math.min(media.length - 1, i + 1)), [media.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose, prev, next]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      {/* 닫기 */}
      <button
        className="absolute top-5 right-5 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        onClick={onClose}
      >
        <X size={22} />
      </button>

      {/* 이전 */}
      {idx > 0 && (
        <button
          className="absolute left-5 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            prev();
          }}
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* 이미지 */}
      <AnimatePresence mode="wait">
        <motion.div
          key={idx}
          className="relative max-w-5xl max-h-[85vh] mx-4 sm:mx-10 lg:mx-16 rounded-2xl overflow-hidden shadow-2xl"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <MediaView
            item={media[idx]}
            alt={`preview ${idx + 1}`}
            width={1280}
            height={720}
            className="w-auto h-auto max-w-full max-h-[85vh] object-contain block mx-auto"
            controls
          />
        </motion.div>
      </AnimatePresence>

      {/* 다음 */}
      {idx < media.length - 1 && (
        <button
          className="absolute right-5 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            next();
          }}
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* 인디케이터 */}
      {media.length > 1 && (
        <div className="absolute bottom-5 flex gap-2">
          {media.map((_, i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === idx ? 'bg-white' : 'bg-white/30'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setIdx(i);
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
