import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
}

/**
 * persist의 기본 rehydration은 지연 실행이라 첫 렌더가 기본값(라이트)으로 시작했다가
 * 뒤늦게 실제 값으로 바뀐다. 그 변화가 Aside 아이콘의 전환 애니메이션을 잘못 트리거하므로,
 * skipHydration으로 자동 복원을 끄고 여기서 동기적으로 읽어 처음부터 맞는 값으로 시작한다.
 */
function readPersistedIsDark(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const parsed = JSON.parse(localStorage.getItem('theme') ?? '{}');
    return Boolean(parsed.state?.isDark);
  } catch {
    return false;
  }
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      isDark: readPersistedIsDark(),
      toggle: () => set((state) => ({ isDark: !state.isDark })),
    }),
    { name: 'theme', skipHydration: true },
  ),
);
