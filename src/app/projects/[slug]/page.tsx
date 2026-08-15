import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import ProjectDetailView from "@/components/sections/Projects/ProjectDetailView";

export function generateStaticParams() {
    return projects
        .filter((project) => project.description)
        .map((project) => ({ slug: project.slug }));
}

export default async function ProjectDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const project = projects.find((p) => p.slug === slug && p.description);

    if (!project) notFound();

    return <ProjectDetailView project={project} />;
}
