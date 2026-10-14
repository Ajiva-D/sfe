import type { Transaction } from '@/types/api'
import { Card, Skeleton } from '@/components/ui'
import { formatDayLabel } from '@/lib/format'
import { TransactionRow } from './TransactionRow'
import styles from './TransactionList.module.css'

/** Relies on the API's newest-first order. */
function groupByDay(transactions: Transaction[]) {
  const groups: { label: string; items: Transaction[] }[] = []
  for (const tx of transactions) {
    const label = formatDayLabel(tx.createdAt)
    const group = groups.at(-1)
    if (group?.label === label) group.items.push(tx)
    else groups.push({ label, items: [tx] })
  }
  return groups
}

export interface TransactionListProps {
  transactions: Transaction[]
  onSelect: (transaction: Transaction) => void
}

export function TransactionList({ transactions, onSelect }: TransactionListProps) {
  return (
    <Card padding="none">
      {groupByDay(transactions).map((group) => (
        <section key={group.label} className={styles.group}>
          <h2 className={styles.day}>{group.label}</h2>
          {group.items.map((tx) => (
            <TransactionRow key={tx.id} transaction={tx} onSelect={onSelect} />
          ))}
        </section>
      ))}
    </Card>
  )
}

export function TransactionRowsSkeleton({ count }: { count: number }) {
  return Array.from({ length: count }, (_, i) => (
    <div key={i} className={styles.skeletonRow}>
      <Skeleton className={styles.skeletonIcon} />
      <span className={styles.skeletonMain}>
        <Skeleton className={styles.skeletonTitle} />
        <Skeleton className={styles.skeletonNarration} />
      </span>
      <span className={styles.skeletonEnd}>
        <Skeleton className={styles.skeletonAmount} />
        <Skeleton className={styles.skeletonTime} />
      </span>
    </div>
  ))
}

export function TransactionListSkeleton() {
  return (
    <Card padding="none">
      <div className={styles.day}>
        <Skeleton className={styles.skeletonDay} />
      </div>
      <TransactionRowsSkeleton count={6} />
    </Card>
  )
}
