// 문서 자체가 스크롤 주체이므로 새로고침·뒤로가기의 위치 복원은 브라우저가 네이티브로
// 처리한다. 여기 남은 값들은 SPA 내비게이션(상세페이지 -> 홈)에서만 쓰이는 1회성 마커다.

const SCROLL_KEY = 'portfolio:mainScrollTop';
const SECTION_KEY = 'portfolio:activeSection';
const TARGET_SECTION_KEY = 'portfolio:targetSection';
const TARGET_SCROLL_KEY = 'portfolio:targetScroll';

export function saveMainScroll(scrollTop: number) {
  try {
    sessionStorage.setItem(SCROLL_KEY, String(scrollTop));
  } catch {
    // sessionStorage 접근 불가(프라이빗 모드 등) — 무시
  }
}

export function readMainScroll(): number | null {
  try {
    const raw = sessionStorage.getItem(SCROLL_KEY);
    return raw === null ? null : Number(raw);
  } catch {
    return null;
  }
}

export function saveActiveSection(id: string) {
  try {
    sessionStorage.setItem(SECTION_KEY, id);
  } catch {
    // sessionStorage 접근 불가(프라이빗 모드 등) — 무시
  }
}

// "이 섹션으로 이동" 같은 명시적 이동 요청 전용. URL 해시와 달리 한 번 읽으면 즉시
// 지워지므로, 이후 스크롤로 위치가 바뀌어도 낡은 값으로 남아있지 않는다.
export function saveTargetSection(id: string) {
  try {
    sessionStorage.setItem(TARGET_SECTION_KEY, id);
  } catch {
    // sessionStorage 접근 불가(프라이빗 모드 등) — 무시
  }
}

export function consumeTargetSection(): string | null {
  return consume(TARGET_SECTION_KEY);
}

// "목록으로"처럼 원래 보던 스크롤 위치로 되돌아가야 할 때 쓰는 1회성 마커.
export function saveTargetScroll(scrollTop: number) {
  try {
    sessionStorage.setItem(TARGET_SCROLL_KEY, String(scrollTop));
  } catch {
    // sessionStorage 접근 불가(프라이빗 모드 등) — 무시
  }
}

export function consumeTargetScroll(): number | null {
  const raw = consume(TARGET_SCROLL_KEY);
  return raw === null ? null : Number(raw);
}

function consume(key: string): string | null {
  try {
    const value = sessionStorage.getItem(key);
    if (value !== null) sessionStorage.removeItem(key);
    return value;
  } catch {
    return null;
  }
}
