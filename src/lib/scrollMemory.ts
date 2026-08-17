/**
 * 홈 페이지의 스크롤 위치 기억.
 *
 * 새로고침·뒤로가기 복원은 브라우저 네이티브 기능이 처리하므로, 여기 값들은
 * SPA 내비게이션(상세페이지 → 홈)에서만 쓰인다.
 */

const SCROLL_KEY = 'portfolio:mainScrollTop';
const RETURN_INTENT_KEY = 'portfolio:returnIntent';

/** 홈으로 돌아갔을 때 있어야 할 위치. 특정 섹션이거나 정확한 스크롤값이거나 둘 중 하나. */
export type ReturnIntent = { section: string } | { scrollY: number };

/** 홈에서 스크롤할 때마다 호출해 마지막 위치를 남긴다. */
export function saveMainScroll(scrollY: number) {
  write(SCROLL_KEY, String(scrollY));
}

/** 기록된 적이 없으면 null. */
export function readMainScroll(): number | null {
  const raw = read(SCROLL_KEY);
  return raw === null ? null : Number(raw);
}

/**
 * 홈으로 이동하기 직전에 목적지를 남긴다. URL 해시를 쓰지 않는 이유는 해시가 홈 안에서
 * 스크롤만 해도 갱신되지 않아 낡은 값으로 남기 때문이다.
 */
export function saveReturnIntent(intent: ReturnIntent) {
  write(RETURN_INTENT_KEY, JSON.stringify(intent));
}

/** 읽는 즉시 삭제해 다음 방문에 영향을 주지 않는다. */
export function consumeReturnIntent(): ReturnIntent | null {
  const raw = read(RETURN_INTENT_KEY);
  if (raw === null) return null;

  remove(RETURN_INTENT_KEY);
  try {
    return JSON.parse(raw) as ReturnIntent;
  } catch {
    return null;
  }
}

// sessionStorage는 프라이빗 모드 등에서 접근이 막힐 수 있어 전부 감싼다.
function write(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // 저장 못 해도 기능이 죽지는 않는다(복원만 생략됨)
  }
}

function read(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function remove(key: string) {
  try {
    sessionStorage.removeItem(key);
  } catch {
    // 무시
  }
}
