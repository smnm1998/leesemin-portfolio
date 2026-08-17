import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { projects } from '@/data/projects';
import { siteConfig } from '@/lib/siteConfig';
import ProjectDetailView from '@/components/sections/Projects/ProjectDetailView';

export function generateStaticParams() {
  return projects
    .filter((project) => project.description)
    .map((project) => ({ slug: project.slug }));
}

function findProject(slug: string) {
  return projects.find((p) => p.slug === slug && p.description);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = findProject(slug);

  if (!project) return { title: '프로젝트를 찾을 수 없습니다' };

  const url = `/projects/${project.slug}`;
  // 검색결과 스니펫이 잘리지 않도록 설명을 앞부분만 쓴다.
  const description =
    project.description.length > 155
      ? `${project.description.slice(0, 155).trimEnd()}…`
      : project.description;

  return {
    title: project.name,
    description,
    keywords: [project.name, ...project.tech, ...siteConfig.keywords],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      url,
      siteName: siteConfig.name,
      title: `${project.name} | ${siteConfig.name}`,
      description,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: project.name }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.name} | ${siteConfig.name}`,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = findProject(slug);

  if (!project) notFound();

  return <ProjectDetailView project={project} />;
}
