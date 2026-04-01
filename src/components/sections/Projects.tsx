"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion";
import { ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";

const styles = {
    wrapper:
        "h-full flex flex-col items-center justify-center gap-8 px-16 overflow-y-auto py-16",
    header: "w-full max-w-5xl shrink-0",
    title: "text-sm font-semibold tracking-widest text-gray-500 dark:text-gray-400 uppercase mb-3",
    divider: "border-t border-gray-200 dark:border-gray-600",
    body: "w-full max-w-5xl flex flex-col gap-10",

    row: "flex items-center gap-14",

    content: "flex-1 flex flex-col gap-5",
    context:
        "text-xs font-medium tracking-widest uppercase text-gray-400 dark:text-gray-500",
    name: "text-4xl font-semibold text-gray-900 dark:text-gray-100",
    desc: "text-sm text-gray-500 dark:text-gray-400 leading-relaxed",
    techRow: "flex flex-wrap gap-2",
    tech: "px-2.5 py-1 rounded-full text-xs bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300",
    links: "flex gap-3",
    link: "flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors",
    linkDisabled:
        "flex items-center gap-1.5 text-sm text-gray-300 dark:text-gray-600 cursor-default",

    mockupWrap: "w-96 shrink-0",
    mockup: "w-full aspect-video rounded-2xl overflow-hidden shadow-lg",
    mockupBar: "flex items-center gap-1.5 px-4 py-3",
    mockupDot: "w-2.5 h-2.5 rounded-full",
    mockupBody: "flex-1 flex items-center justify-center pb-6",
    mockupProjectName: "text-white/80 text-2xl font-semibold tracking-wide",

    rowDivider: "border-t border-gray-100 dark:border-white/5",
} as const;

const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.15 } },
};

const fadeUpVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.4, ease: "easeOut" },
    },
};

type Project = {
    name: string;
    context: string;
    period: string;
    description: string;
    tech: string[];
    github: string;
    live: string;
    gradient: string;
    images?: string[];
};

const projects: Project[] = [
    {
        name: "Artune",
        context: "우아한테크코스 8기 프리코스",
        period: "2025.09 — 2025.10",
        description:
            "사용자가 입력한 텍스트를 OpenAI로 감성 분석하여 Spotify 플레이리스트와 DALL-E 이미지를 생성하는 서비스입니다. 감정 몰입 / 감정 전환 두 가지 모드를 제공하며, iTunes API로 30초 미리듣기와 fade-out 효과를 구현했습니다. Turborepo 기반 모노레포 구조로 프론트엔드와 백엔드를 함께 관리했습니다.",
        tech: [
            "React 19",
            "Vite",
            "NestJS",
            "Zustand",
            "Framer Motion",
            "OpenAI API",
            "Spotify API",
            "DALL-E",
            "Turborepo",
            "SSE",
        ],
        github: "https://github.com/smnm1998/woowacourse-artune",
        live: "https://om-artune.vercel.app",
        gradient: "from-violet-500 via-purple-600 to-indigo-700",
        images: ["/projects/artune.png", "/projects/artune.png", "/projects/artune.png"],
    },
    {
        name: "프로젝트 2",
        context: "",
        period: "",
        description: "",
        tech: [],
        github: "",
        live: "",
        gradient: "from-gray-400 via-gray-500 to-gray-600",
    },
    {
        name: "프로젝트 3",
        context: "",
        period: "",
        description: "",
        tech: [],
        github: "",
        live: "",
        gradient: "from-gray-400 via-gray-500 to-gray-600",
    },
];

// ── Lightbox ──────────────────────────────────────────────
function Lightbox({
    images,
    initialIndex,
    onClose,
}: {
    images: string[];
    initialIndex: number;
    onClose: () => void;
}) {
    const [idx, setIdx] = useState(initialIndex);

    const prev = useCallback(() => setIdx((i) => Math.max(0, i - 1)), []);
    const next = useCallback(
        () => setIdx((i) => Math.min(images.length - 1, i + 1)),
        [images.length]
    );

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") prev();
            if (e.key === "ArrowRight") next();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
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
                    onClick={(e) => { e.stopPropagation(); prev(); }}
                >
                    <ChevronLeft size={28} />
                </button>
            )}

            {/* 이미지 */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={idx}
                    className="relative max-w-5xl w-full mx-16 rounded-2xl overflow-hidden shadow-2xl"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <Image
                        src={images[idx]}
                        alt={`screenshot ${idx + 1}`}
                        width={1280}
                        height={720}
                        className="w-full h-auto object-contain"
                    />
                </motion.div>
            </AnimatePresence>

            {/* 다음 */}
            {idx < images.length - 1 && (
                <button
                    className="absolute right-5 p-2 rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
                    onClick={(e) => { e.stopPropagation(); next(); }}
                >
                    <ChevronRight size={28} />
                </button>
            )}

            {/* 인디케이터 */}
            {images.length > 1 && (
                <div className="absolute bottom-5 flex gap-2">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            className={`w-2 h-2 rounded-full transition-colors ${
                                i === idx ? "bg-white" : "bg-white/30"
                            }`}
                            onClick={(e) => { e.stopPropagation(); setIdx(i); }}
                        />
                    ))}
                </div>
            )}
        </motion.div>
    );
}

// ── Projects ──────────────────────────────────────────────
export default function Projects() {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { once: false, amount: 0.2 });

    const [lightbox, setLightbox] = useState<{ images: string[]; index: number } | null>(null);

    return (
        <>
            <div className={styles.wrapper}>
                <motion.div
                    className={styles.header}
                    initial={{ opacity: 0, y: 16 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <p className={styles.title}>Projects</p>
                    <hr className={styles.divider} />
                </motion.div>

                <motion.div
                    ref={ref}
                    className={styles.body}
                    variants={containerVariants}
                    initial="hidden"
                    animate={isInView ? "visible" : "hidden"}
                >
                    {projects.map((project, i) => {
                        const isPlaceholder = !project.description;
                        return (
                            <motion.div
                                key={project.name}
                                variants={containerVariants}
                            >
                                {i > 0 && (
                                    <hr className={`${styles.rowDivider} mb-10`} />
                                )}
                                <div className={styles.row}>
                                    {/* 좌측 콘텐츠 */}
                                    <motion.div
                                        className={styles.content}
                                        variants={fadeUpVariants}
                                    >
                                        {isPlaceholder ? (
                                            <p className="text-gray-300 dark:text-gray-600 text-sm">
                                                준비 중입니다.
                                            </p>
                                        ) : (
                                            <>
                                                {project.context && (
                                                    <span className={styles.context}>
                                                        {project.context}
                                                    </span>
                                                )}
                                                <div className="flex items-baseline gap-3">
                                                    <h2 className={styles.name}>
                                                        {project.name}
                                                    </h2>
                                                    {project.period && (
                                                        <span className="text-sm text-gray-400 dark:text-gray-500">
                                                            {project.period}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className={styles.desc}>
                                                    {project.description}
                                                </p>
                                                {project.tech.length > 0 && (
                                                    <div className={styles.techRow}>
                                                        {project.tech.map((t) => (
                                                            <span key={t} className={styles.tech}>
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <div className={styles.links}>
                                                    {project.github ? (
                                                        <a
                                                            href={project.github}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={styles.link}
                                                        >
                                                            <ExternalLink size={14} /> GitHub
                                                        </a>
                                                    ) : (
                                                        <span className={styles.linkDisabled}>
                                                            <ExternalLink size={14} /> GitHub
                                                        </span>
                                                    )}
                                                    {project.live ? (
                                                        <a
                                                            href={project.live}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={styles.link}
                                                        >
                                                            <ExternalLink size={14} /> Live
                                                        </a>
                                                    ) : (
                                                        <span className={styles.linkDisabled}>
                                                            <ExternalLink size={14} /> Live
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </motion.div>

                                    {/* 우측 목업 */}
                                    <motion.div
                                        className={styles.mockupWrap}
                                        variants={fadeUpVariants}
                                    >
                                        <div
                                            className={`${styles.mockup} ${project.images ? "cursor-pointer group relative" : ""}`}
                                            onClick={() =>
                                                project.images &&
                                                setLightbox({ images: project.images, index: 0 })
                                            }
                                        >
                                            {project.images ? (
                                                <>
                                                    <Image
                                                        src={project.images[0]}
                                                        alt={project.name}
                                                        width={384}
                                                        height={216}
                                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                                                        <span className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                            클릭하면 여러 장 볼 수 있습니다
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className={`flex flex-col h-full bg-linear-to-br ${project.gradient}`}>
                                                    <div className={styles.mockupBar}>
                                                        <span className={`${styles.mockupDot} bg-white/30`} />
                                                        <span className={`${styles.mockupDot} bg-white/30`} />
                                                        <span className={`${styles.mockupDot} bg-white/30`} />
                                                    </div>
                                                    <div className={styles.mockupBody}>
                                                        <span className={styles.mockupProjectName}>
                                                            {project.name}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                </div>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>

            <AnimatePresence>
                {lightbox && (
                    <Lightbox
                        images={lightbox.images}
                        initialIndex={lightbox.index}
                        onClose={() => setLightbox(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
