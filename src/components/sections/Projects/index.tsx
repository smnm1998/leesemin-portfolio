"use client";

import { motion } from "framer-motion";
import { createContainerVariants } from "@/lib/motionVariants";
import { useSectionInView } from "@/lib/useSectionInView";
import { projects } from "@/data/projects";
import SectionHeader from "../shared/SectionHeader";
import ProjectRow from "./ProjectRow";

const styles = {
    wrapper:
        "h-full flex flex-col items-center justify-center gap-8 px-16 overflow-y-auto py-16",
    header: "w-full max-w-5xl shrink-0",
    body: "w-full max-w-5xl flex flex-col gap-10",
} as const;

const rowStagger = createContainerVariants(0.15);

export default function Projects() {
    const { ref, isInView } = useSectionInView(0.2);

    return (
        <div className={styles.wrapper}>
            <SectionHeader
                title="Projects"
                isInView={isInView}
                className={styles.header}
                hint="사진을 클릭하면 프로젝트 상세 페이지로 이동합니다."
            />

            <motion.div
                ref={ref}
                className={styles.body}
                variants={rowStagger}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                {projects.map((project, i) => (
                    <motion.div key={project.slug} variants={rowStagger}>
                        <ProjectRow project={project} isFirst={i === 0} />
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
