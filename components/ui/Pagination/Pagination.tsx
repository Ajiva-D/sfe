import { cx } from '@/lib/cx'
import { Button } from '../Button'
import { getPageItems } from './getPageItems'
import styles from './Pagination.module.css'

export interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ page, totalPages, onPageChange, className }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className={cx(styles.pagination, className)}>
      <Button
        variant="secondary"
        size="sm"
        iconLeft="chevron-left"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        <span className={styles.wide}>Previous</span>
        <span className={styles.narrow}>Prev</span>
      </Button>

      <ol className={cx(styles.pages, styles.wide)}>
        {getPageItems(page, totalPages).map((item, i) =>
          item === 'ellipsis' ? (
            <li key={`ellipsis-${i}`} className={styles.ellipsis} aria-hidden>
              …
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                className={cx(styles.page, item === page && styles.current)}
                aria-current={item === page ? 'page' : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            </li>
          )
        )}
      </ol>

      <span className={cx(styles.summary, styles.narrow)}>
        Page {page} of {totalPages}
      </span>

      <Button
        variant="secondary"
        size="sm"
        iconRight="chevron-right"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </nav>
  )
}
