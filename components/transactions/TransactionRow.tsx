import type { ReactNode } from 'react'
import type { Transaction } from '@/types/api'
import { Money } from '@/components/ui'
import { cx } from '@/lib/cx'
import { formatDateTime, formatTime, isCredit, narrationText, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import { StatusDot } from './StatusDot'
import { StatusPill } from './StatusPill'
import { TransactionIcon } from './TransactionIcon'
import styles from './TransactionRow.module.css'

export interface TransactionRowProps {
  transaction: Transaction
  onSelect?: (transaction: Transaction) => void
  /** Dashboard summary: status dot, full date and fee. */
  compact?: boolean
}

export function TransactionRow({ transaction: tx, onSelect, compact = false }: TransactionRowProps) {
  const credit = isCredit(tx.type)

  return (
    <button
      type="button"
      className={cx(styles.row, compact && styles.compact)}
      onClick={() => onSelect?.(tx)}
    >
      <TransactionIcon transaction={tx} className={styles.icon} />
      <span className={styles.main}>
        <span className={styles.title}>{TRANSACTION_TYPE_LABELS[tx.type]}</span>
        <span className={styles.narration}>{narrationText(tx.narration)}</span>
      </span>
      <span className={styles.status}>
        {compact ? <StatusDot status={tx.status} /> : <StatusPill status={tx.status} />}
      </span>
      <Money
        amount={tx.amount}
        currency={tx.currency}
        sign={credit ? 'credit' : 'debit'}
        className={cx(styles.amount, credit && styles.credit)}
      />
      <span className={styles.meta}>
        {compact ? formatDateTime(tx.createdAt) : formatTime(tx.createdAt)}
        {compact && tx.fee > 0 && (
          <>
            {' · Fee '}
            <Money amount={tx.fee} currency={tx.currency} />
          </>
        )}
      </span>
    </button>
  )
}

/** Lines up compact rows' columns (dot, amount) across the list. */
export function CompactTransactionList({ children }: { children: ReactNode }) {
  return <div className={styles.compactList}>{children}</div>
}
