'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import type { MediaItem } from '@/data/projects';

export default function MediaView({
  item,
  alt,
  className,
  width = 1280,
  height = 720,
  controls = false,
  autoPlay = true,
}: {
  item: MediaItem;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  controls?: boolean;
  /** 화면에 보일 때만 재생. false면 정지 프레임만 보여준다(갤러리 썸네일 등). */
  autoPlay?: boolean;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // 뷰포트에 실제로 보일 때만 재생/일시정지 — 화면 밖 카드가 계속 디코딩되는 것을 막는다.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !autoPlay) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [autoPlay]);

  if (item.type === 'video') {
    return (
      <video
        ref={videoRef}
        src={item.src}
        className={className}
        loop
        muted
        playsInline
        controls={controls}
        preload={autoPlay ? 'auto' : 'metadata'}
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
