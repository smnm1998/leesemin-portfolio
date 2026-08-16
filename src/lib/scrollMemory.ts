const STORAGE_KEY = 'portfolio:mainScrollTop';

export function saveMainScroll(scrollTop: number) {
  try {
    sessionStorage.setItem(STORAGE_KEY, String(scrollTop));
  } catch {
    // sessionStorage 접근 불가(프라이빗 모드 등) — 무시
  }
}

export function readMainScroll(): number | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw === null ? null : Number(raw);
  } catch {
    return null;
  }
}
