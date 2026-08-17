'use client';

import { useLayoutEffect, useState } from 'react';
import { Home, Briefcase, Code2, Mail, Sun, Moon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';

export type Section = 'home' | 'projects' | 'skills' | 'contact';

const styles = {
  // lg 미만은 하단 탭바, 이상은 좌측 사이드바. fixed로 빼둬야 문서가 스크롤 주체가 되고
  // 브라우저 네이티브 스크롤 복원이 동작한다. z-30은 모달(z-50) 아래, 본문 위.
  nav: [
    'fixed z-30 flex bg-[var(--background)] transition-colors duration-300',
    'bottom-0 left-0 right-0 h-16 flex-row items-center justify-around px-2',
    'lg:top-0 lg:right-auto lg:bottom-auto lg:h-screen lg:w-16 lg:flex-col lg:justify-start lg:gap-4 lg:px-0 lg:py-10 lg:border-r lg:border-gray-200 lg:dark:border-gray-600',
  ].join(' '),
  // 하단 탭바의 상단 구분선 — 양 끝으로 갈수록 사라지게. 사이드바일 때는 lg:border-r가 대신한다.
  topEdge:
    'lg:hidden absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent dark:via-gray-600',
  navItem: 'group relative flex items-center',
  buttonActive:
    'p-3 rounded-xl transition-all duration-200 cursor-pointer bg-gray-900 text-white dark:bg-white/90 dark:text-gray-900',
  buttonInactive:
    'p-3 rounded-xl transition-all duration-200 cursor-pointer text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-white/10',
  // 툴팁은 hover가 있는 데스크톱에서만 — 터치 기기에서는 의미가 없다.
  tooltip:
    'hidden lg:block absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10',
  // 탭바에는 내비게이션만 두고 토글은 우측 상단에 띄운다. lg에서는 relative로 돌려
  // 사이드바 맨 아래로 복귀.
  toggleWrapper:
    'group flex items-center fixed top-4 right-4 z-30 lg:relative lg:top-auto lg:right-auto lg:mt-auto',
  toggleButton:
    'group w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-500 bg-[var(--background)] transition-all duration-200 cursor-pointer text-gray-400 overflow-hidden',
  toggleIconLight:
    'flex items-center justify-center transition-colors duration-200 group-hover:text-yellow-400',
  toggleIconDark:
    'flex items-center justify-center transition-colors duration-200 group-hover:text-orange-500',
} as const;

const navItems: { id: Section; icon: React.ElementType; label: string }[] = [
  { id: 'home', icon: Home, label: '소개' },
  { id: 'skills', icon: Code2, label: '스킬' },
  { id: 'projects', icon: Briefcase, label: '프로젝트' },
  { id: 'contact', icon: Mail, label: '연락' },
];

interface AsideProps {
  activeSection: Section;
  onSectionChange: (section: Section) => void;
}

export default function Aside({ activeSection, onSectionChange }: AsideProps) {
  const { isDark, toggle } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // 서버는 테마도 스크롤 위치도 모른다. 하이드레이션 전까지 테마 아이콘과 활성 표시를
  // 보류해, 틀린 상태를 그렸다가 고치는 대신 확정된 뒤에 한 번만 그린다.
  // (suppressHydrationWarning은 텍스트에만 통해서 Sun/Moon 교체에는 쓸 수 없다.)
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <nav className={styles.nav}>
      <span className={styles.topEdge} />

      {navItems.map(({ id, icon: Icon, label }) => (
        <div key={id} className={styles.navItem}>
          <button
            onClick={() => onSectionChange(id)}
            className={
              mounted && activeSection === id ? styles.buttonActive : styles.buttonInactive
            }
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
          aria-label={isDark ? '라이트 모드' : '다크 모드'}
          suppressHydrationWarning
        >
          {mounted && (
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? 'sun' : 'moon'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className={isDark ? styles.toggleIconDark : styles.toggleIconLight}
              >
                {isDark ? <Sun size={18} /> : <Moon size={18} fill="currentColor" strokeWidth={0} />}
              </motion.span>
            </AnimatePresence>
          )}
        </button>
        <span className={styles.tooltip} suppressHydrationWarning>
          {isDark ? '라이트 모드' : '다크 모드'}
        </span>
      </div>
    </nav>
  );
}
