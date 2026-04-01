"use client";

import { Home, Briefcase, Code2, Mail, Sun, Moon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";

export type Section = "home" | "projects" | "skills" | "contact";

const styles = {
    aside: "w-16 h-screen flex flex-col items-center py-10 gap-4 border-r border-gray-200 dark:border-gray-600 shrink-0 transition-colors duration-300",
    navItem: "group relative flex items-center",
    buttonActive: "p-3 rounded-xl transition-all duration-200 cursor-pointer bg-gray-900 text-white dark:bg-white/90 dark:text-gray-900",
    buttonInactive: "p-3 rounded-xl transition-all duration-200 cursor-pointer text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-white/10",
    tooltip: "absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10",
    toggleWrapper: "mt-auto group relative flex items-center",
    toggleButton: "group w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-500 transition-all duration-200 cursor-pointer text-gray-400 overflow-hidden",
    toggleIconLight: "flex items-center justify-center transition-colors duration-200 group-hover:text-yellow-400",
    toggleIconDark: "flex items-center justify-center transition-colors duration-200 group-hover:text-orange-500",
} as const;

const navItems: { id: Section; icon: React.ElementType; label: string }[] = [
    { id: "home", icon: Home, label: "소개" },
    { id: "skills", icon: Code2, label: "스킬" },
    { id: "projects", icon: Briefcase, label: "프로젝트" },
    { id: "contact", icon: Mail, label: "연락" },
];

interface AsideProps {
    activeSection: Section;
    onSectionChange: (section: Section) => void;
}

export default function Aside({ activeSection, onSectionChange }: AsideProps) {
    const { isDark, toggle } = useThemeStore();

    return (
        <aside className={styles.aside}>
            {navItems.map(({ id, icon: Icon, label }) => (
                <div key={id} className={styles.navItem}>
                    <button
                        onClick={() => onSectionChange(id)}
                        className={activeSection === id ? styles.buttonActive : styles.buttonInactive}
                        aria-label={label}
                    >
                        <Icon size={20} />
                    </button>
                    <span className={styles.tooltip}>{label}</span>
                </div>
            ))}

            <div className={styles.toggleWrapper}>
                <button
                    onClick={toggle}
                    className={styles.toggleButton}
                    aria-label={isDark ? "라이트 모드" : "다크 모드"}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={isDark ? "sun" : "moon"}
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className={isDark ? styles.toggleIconDark : styles.toggleIconLight}
                        >
                            {isDark
                                ? <Sun size={18} />
                                : <Moon size={18} fill="currentColor" strokeWidth={0} />
                            }
                        </motion.span>
                    </AnimatePresence>
                </button>
                <span className={styles.tooltip}>{isDark ? "라이트 모드" : "다크 모드"}</span>
            </div>
        </aside>
    );
}
