"use client";

import Image from "next/image";
import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

const styles = {
    wrapper: "h-full flex flex-col items-center justify-center gap-8 px-16",
    header: "w-full max-w-5xl",
    title: "text-sm font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-3",
    divider: "border-t border-gray-200 dark:border-gray-600",
    body: "w-full max-w-5xl flex flex-col gap-8",

    // 2x2 주력
    mainGrid: "grid grid-cols-2 gap-10",
    mainItem: "flex items-start gap-6",
    mainIconContainer: "w-28 h-28 shrink-0 flex items-center justify-center",
    mainIcon: "w-full h-full object-contain",
    mainText: "flex flex-col gap-2 pt-1",
    mainName: "text-xl font-semibold text-gray-900 dark:text-gray-100",
    mainDescs: "flex flex-col gap-1",
    mainDesc:
        "text-sm text-gray-400 dark:text-gray-300 leading-relaxed before:content-['·'] before:mr-1.5",

    // 하단 기타 스킬
    sectionDivider: "border-t border-gray-200 dark:border-gray-600",
    etcGroups: "flex flex-wrap justify-center gap-x-10 gap-y-5",
    etcGroup: "flex flex-col items-center gap-2.5",
    etcCategory:
        "text-[10px] font-semibold tracking-widest uppercase text-gray-500 dark:text-gray-400",
    etcRow: "flex gap-4",
    etcItem: "flex flex-col items-center gap-1.5",
    etcIcon: "w-9 h-9 object-contain",
    etcName: "text-xs text-gray-600 dark:text-gray-300 whitespace-nowrap",
} as const;

const containerVariants: Variants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.08,
        },
    },
};

const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

const mainSkills = [
    {
        name: "JavaScript",
        icon: "/icons/javascript.svg",
        descs: [
            "ES6+ 문법에 익숙합니다.",
            "비동기 처리(Promise, async/await)를 능숙하게 다룹니다.",
        ],
    },
    {
        name: "TypeScript",
        icon: "/icons/typescript.svg",
        descs: [
            "타입 시스템을 활용한 안정적인 개발을 합니다.",
            "제네릭, 유니언 타입 등을 활용한 경험이 있습니다.",
        ],
    },
    {
        name: "React",
        icon: "/icons/react.svg",
        descs: [
            "컴포넌트 기반 설계 및 최적화 경험이 있습니다.",
            "커스텀 훅, Context, Zustand를 활용한 상태관리를 합니다.",
        ],
    },
    {
        name: "Next.js",
        icon: "/icons/next.svg",
        descs: [
            "Vercel, Supabase 조합으로 배포한 경험이 있습니다.",
            "App Router 기반 SSR/SSG 구조를 이해하고 활용합니다.",
        ],
    },
] as const;

const etcSkillGroups = [
    {
        category: "Frontend",
        skills: [
            { name: "HTML5", icon: "/icons/html5.svg" },
            { name: "CSS3", icon: "/icons/css3.svg" },
        ],
    },
    {
        category: "Backend",
        skills: [{ name: "Node.js", icon: "/icons/node.svg" }],
    },
    {
        category: "Database",
        skills: [
            { name: "MariaDB", icon: "/icons/mariadb.svg" },
            { name: "Supabase", icon: "/icons/supabase.svg" },
        ],
    },
    {
        category: "Deployment",
        skills: [{ name: "Vercel", icon: "/icons/vercel.svg" }],
    },
    {
        category: "Design / Tools",
        skills: [
            { name: "Figma", icon: "/icons/figma.svg" },
            { name: "Jira", icon: "/icons/jira.svg" },
            { name: "Notion", icon: "/icons/notion.svg" },
        ],
    },
    {
        category: "API",
        skills: [
            { name: "OpenAI", icon: "/icons/openai.svg" },
            { name: "KakaoMap", icon: "/icons/kakaomap.png" },
        ],
    },
] as const;

export default function Skills() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, amount: 0.3 });

    return (
        <div className={styles.wrapper}>
            <motion.div
                className={styles.header}
                initial={{ opacity: 0, y: 16 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, ease: "easeOut" }}
            >
                <p className={styles.title}>Skills</p>
                <hr className={styles.divider} />
            </motion.div>

            <motion.div
                ref={ref}
                className={styles.body}
                variants={containerVariants}
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
            >
                <motion.div
                    className={styles.mainGrid}
                    variants={containerVariants}
                >
                    {mainSkills.map(({ name, icon, descs }) => (
                        <motion.div
                            key={name}
                            className={styles.mainItem}
                            variants={fadeUpVariants}
                        >
                            <div className={styles.mainIconContainer}>
                                <Image
                                    src={icon}
                                    alt={name}
                                    width={112}
                                    height={112}
                                    className={styles.mainIcon}
                                />
                            </div>
                            <div className={styles.mainText}>
                                <span className={styles.mainName}>{name}</span>
                                <div className={styles.mainDescs}>
                                    {descs.map((desc) => (
                                        <span
                                            key={desc}
                                            className={styles.mainDesc}
                                        >
                                            {desc}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.hr
                    className={styles.sectionDivider}
                    variants={fadeUpVariants}
                />

                <motion.div
                    className={styles.etcGroups}
                    variants={containerVariants}
                >
                    {etcSkillGroups.map(({ category, skills }) => (
                        <motion.div
                            key={category}
                            className={styles.etcGroup}
                            variants={fadeUpVariants}
                        >
                            <span className={styles.etcCategory}>
                                {category}
                            </span>
                            <div className={styles.etcRow}>
                                {skills.map(({ name, icon }) => (
                                    <div key={name} className={styles.etcItem}>
                                        <Image
                                            src={icon}
                                            alt={name}
                                            width={36}
                                            height={36}
                                            className={styles.etcIcon}
                                        />
                                        <span className={styles.etcName}>
                                            {name}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </div>
    );
}
