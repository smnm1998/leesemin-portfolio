'use client';

import { useThemeStore } from '@/store/themeStore';

export default function ArchitectureDiagram({
  diagram,
  title,
}: {
  diagram: { src: string; width: number; height: number };
  title: string;
}) {
  const isDark = useThemeStore((s) => s.isDark);

  return (
    <div
      className="w-full rounded-2xl overflow-hidden shadow-sm bg-gray-100 dark:bg-white/5"
      style={{ aspectRatio: `${diagram.width} / ${diagram.height}` }}
    >
      <iframe
        src={`${diagram.src}?embed=1&theme=${isDark ? 'dark' : 'light'}`}
        title={title}
        loading="lazy"
        className="w-full h-full border-0"
      />
    </div>
  );
}
