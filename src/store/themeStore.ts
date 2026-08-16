import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeStore {
  isDark: boolean;
  toggle: () => void;
}

// layout.tsx의 blocking script가 첫 페인트 전에 이미 localStorage 값을 읽어 <html>에
// dark 클래스를 붙여둔다. 여기서 zustand persist의 기본(지연) rehydration에 맡기면,
// 클라이언트 첫 렌더는 SSR과 맞추기 위해 기본값(false)으로 시작했다가 rehydration이
// 끝난 뒤에야 실제 값으로 바뀌는데, 다크 모드 사용자에게는 이 전환이 실제 상태 변화로
// 보여서 Aside의 AnimatePresence 아이콘이 "정적으로 고정"되지 못하고 애니메이션이
// 돌아버렸다(마운트 직후 moon -> sun 전환이 실제로 일어남). skipHydration으로 자동
// rehydration을 끄고, 대신 store 생성 시점에 동기적으로 값을 읽어 처음부터 맞는
// 값으로 시작한다 — 이후엔 상태 변화 자체가 없으니 애니메이션도 없다.
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
