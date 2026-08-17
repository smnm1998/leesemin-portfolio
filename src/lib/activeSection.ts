/**
 * 활성 섹션 판정: 뷰포트 세로 중앙선에 걸친 섹션이 활성이다.
 *
 * 첫 렌더에는 동기 계산이, 이후 스크롤 추적에는 IntersectionObserver가 필요해 같은 규칙을
 * 두 방식으로 쓴다. 양쪽에 숫자를 따로 박으면 한쪽만 고쳤을 때 조용히 어긋나므로
 * 비율 하나에서 파생시킨다.
 */
const ACTIVE_LINE_RATIO = 0.5;

/**
 * 옵저버용 rootMargin. 위아래를 깎아 판정선 높이의 띠만 남긴다.
 *
 * threshold("섹션의 n%가 보이는가")로는 뷰포트보다 긴 섹션이 그 비율에 영원히 도달하지
 * 못해 활성화되지 않는다.
 */
export const ACTIVE_LINE_ROOT_MARGIN = `-${ACTIVE_LINE_RATIO * 100}% 0px -${
  100 - ACTIVE_LINE_RATIO * 100
}% 0px`;

/**
 * 현재 스크롤 위치에서 활성 섹션을 즉시 계산한다.
 * @param ids 문서 순서대로 나열한 섹션 엘리먼트 id
 * @param fallback 판정선에 걸린 섹션이 없을 때 쓸 값
 */
export function resolveActiveSection<T extends string>(ids: readonly T[], fallback: T): T {
  const line = window.innerHeight * ACTIVE_LINE_RATIO;

  for (const id of ids) {
    const rect = document.getElementById(id)?.getBoundingClientRect();
    if (rect && rect.top <= line && rect.bottom >= line) return id;
  }

  return fallback;
}
