/** Dancers shown per directory page — matches the reference federation sites. */
export const PER_PAGE = 20;

/** `[1, 2, 3…]` for a collection of `total` items. */
export function pageNumbers(total: number): number[] {
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  return Array.from({ length: pages }, (_, i) => i + 1);
}
