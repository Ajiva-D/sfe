'use client'
import { Button, Select } from '@/components/ui'
import { cx } from '@/lib/cx'
import { TRANSACTION_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import { useMediaQuery } from '@/lib/useMediaQuery'
import { SearchField } from './SearchField'
import {
  TRANSACTION_STATUSES,
  TRANSACTION_TYPES,
  transactionUrl,
  type TransactionParams,
} from './transactionParams'
import styles from './TransactionFilters.module.css'

const ALL = 'all'

const TYPE_OPTIONS = [
  { value: ALL, label: 'All types' },
  ...TRANSACTION_TYPES.map((type) => ({ value: type, label: TRANSACTION_TYPE_LABELS[type] })),
]

const STATUS_OPTIONS = [
  { value: ALL, label: 'All statuses' },
  ...TRANSACTION_STATUSES.map((status) => ({ value: status, label: TRANSACTION_STATUS_LABELS[status] })),
]

export interface TransactionFiltersProps {
  params: Pick<TransactionParams, 'q' | 'type' | 'status'>
  hasFilters: boolean
}

export function TransactionFilters({ params, hasFilters }: TransactionFiltersProps) {
  const narrow = useMediaQuery('(max-width: 640px)')

  return (
    <div className={styles.filters}>
      <SearchField
        q={params.q}
        onSearch={transactionUrl.search}
        placeholder={narrow ? 'Search reference, name…' : 'Search by reference, name or narration'}
        className={styles.search}
      />
      <Select
        label="Type"
        options={TYPE_OPTIONS}
        value={params.type ?? ALL}
        onValueChange={(value) => transactionUrl.filter('type', value === ALL ? '' : value)}
        fieldClassName={styles.type}
      />
      <Select
        label="Status"
        options={STATUS_OPTIONS}
        value={params.status ?? ALL}
        onValueChange={(value) => transactionUrl.filter('status', value === ALL ? '' : value)}
        fieldClassName={styles.status}
      />
      <Button
        variant="ghost"
        onClick={transactionUrl.clearFilters}
        className={cx(styles.clear, !hasFilters && styles.hidden)}
      >
        Clear filters
      </Button>
    </div>
  )
}
