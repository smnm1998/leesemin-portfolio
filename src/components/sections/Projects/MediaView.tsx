'use client';

import Image from 'next/image';
import type { MediaItem } from '@/data/projects';

export default function MediaView({
  item,
  alt,
  className,
  width = 1280,
  height = 720,
  controls = false,
}: {
  item: MediaItem;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  controls?: boolean;
}) {
  if (item.type === 'video') {
    return (
      <video
        src={item.src}
        className={className}
        autoPlay
        loop
        muted
        playsInline
        controls={controls}
      />
    );
  }

  return (
    <Image
      src={item.src}
      alt={alt}
      width={item.width ?? width}
      height={item.height ?? height}
      className={className}
    />
  );
}
