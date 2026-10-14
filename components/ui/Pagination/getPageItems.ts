export type PageItem = number | 'ellipsis'

/** First, last, and the current page with its neighbours; at least three pages at either end. */
export function getPageItems(page: number, totalPages: number): PageItem[] {
  const pages = new Set([1, page - 1, page, page + 1, totalPages])
  if (page <= 2) pages.add(3)
  if (page >= totalPages - 1) pages.add(totalPages - 2)

  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b)
  return sorted.flatMap((p, i) => (i > 0 && p - sorted[i - 1] > 1 ? ['ellipsis' as const, p] : [p]))
}
