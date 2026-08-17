import type { MetadataRoute } from 'next';
import { projects } from '@/data/projects';
import { siteConfig } from '@/lib/siteConfig';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteConfig.url,
      lastModified,
      changeFrequency: 'monthly',
      priority: 1,
    },
    // 상세페이지가 실제로 생성되는 조건(description 보유)을 generateStaticParams와 맞춘다.
    ...projects
      .filter((project) => project.description)
      .map((project) => ({
        url: `${siteConfig.url}/projects/${project.slug}`,
        lastModified,
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      })),
  ];
}
