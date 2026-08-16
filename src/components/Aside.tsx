'use client';

import { useLayoutEffect, useState } from 'react';
import { Home, Briefcase, Code2, Mail, Sun, Moon } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useThemeStore } from '@/store/themeStore';

export type Section = 'home' | 'projects' | 'skills' | 'contact';

const styles = {
  // fixed — 문서(body)가 스크롤 주체가 되도록 레이아웃에서 빼둔다. 이렇게 해야 브라우저의
  // 네이티브 스크롤 복원이 동작한다(중첩 overflow 컨테이너에는 적용되지 않음).
  aside:
    'fixed left-0 top-0 z-20 w-16 h-screen flex flex-col items-center py-10 gap-4 border-r border-gray-200 dark:border-gray-600 bg-[var(--background)] transition-colors duration-300',
  navItem: 'group relative flex items-center',
  buttonActive:
    'p-3 rounded-xl transition-all duration-200 cursor-pointer bg-gray-900 text-white dark:bg-white/90 dark:text-gray-900',
  buttonInactive:
    'p-3 rounded-xl transition-all duration-200 cursor-pointer text-gray-400 hover:text-gray-900 hover:bg-gray-100 dark:hover:text-gray-100 dark:hover:bg-white/10',
  tooltip:
    'absolute left-full ml-3 px-2 py-1 bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10',
  toggleWrapper: 'mt-auto group relative flex items-center',
  toggleButton:
    'group w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 dark:border-gray-500 transition-all duration-200 cursor-pointer text-gray-400 overflow-hidden',
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

  // 서버는 다크 여부를 알 수 없어 항상 라이트로 렌더링하지만, 클라이언트 스토어는 마운트
  // 시점에 이미 실제 값을 동기적으로 읽어온다. Sun/Moon처럼 서로 다른 자식 엘리먼트로
  // 갈리는 콘텐츠는 suppressHydrationWarning으로 못 막는다(텍스트 컨텐츠에만 적용됨).
  // 하이드레이션이 끝난 뒤(레이아웃 이펙트, 페인트 전)에만 아이콘을 처음 마운트해서
  // AnimatePresence의 initial={false}가 "진짜 첫 렌더"에 정상 적용되게 한다.
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  return (
    <aside className={styles.aside}>
      {navItems.map(({ id, icon: Icon, label }) => (
        <div key={id} className={styles.navItem}>
          <button
            onClick={() => onSectionChange(id)}
            // 서버는 사용자의 스크롤 위치를 알 수 없어 항상 첫 섹션을 활성으로 렌더링한다.
            // 그 HTML은 JS보다 훨씬 먼저 페인트되므로, 하이드레이션 전까지는 아예 활성
            // 표시를 하지 않는다 — 틀린 곳(소개)을 켰다가 옮기는 것보다 낫다.
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
    </aside>
  );
}
