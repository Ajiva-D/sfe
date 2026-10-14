'use client'
import type { Transaction } from '@/types/api'
import { Button, EmptyState, Icon, Money, Skeleton } from '@/components/ui'
import { ApiError } from '@/lib/api/client'
import { useTransaction } from '@/lib/api/queries'
import { formatDateTime, isCredit, narrationText, TRANSACTION_TYPE_LABELS } from '@/lib/format'
import { StatusPill } from './StatusPill'
import { TransactionIcon } from './TransactionIcon'
import styles from './TransactionDetails.module.css'

export interface TransactionDetailsProps {
  id: string
  /** The row from the list, shown while the details load. */
  fallback?: Transaction
  onClose: () => void
}

export function TransactionDetails({ id, fallback, onClose }: TransactionDetailsProps) {
  const { data, error, isFetching, refetch } = useTransaction(id)
  const transaction = data ?? fallback

  if (transaction) return <Details transaction={transaction} />

  if (error instanceof ApiError && error.status === 404) {
    return (
      <EmptyState
        icon="search"
        title="Transaction not found"
        description="It may have been removed, or the link is wrong."
        action={
          <Button variant="secondary" onClick={onClose}>
            Back to transactions
          </Button>
        }
      />
    )
  }

  if (error) {
    return (
      <EmptyState
        icon="alert"
        tone="danger"
        title="We couldn’t load your transactions"
        description="Check your connection and try again."
        action={
          <Button iconLeft="refresh" disabled={isFetching} onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    )
  }

  return <DetailsSkeleton />
}

function headline(tx: Transaction) {
  const type = TRANSACTION_TYPE_LABELS[tx.type]
  if (!tx.counterparty) return type
  return `${type} ${tx.type === 'transfer_in' ? 'from' : 'to'} ${tx.counterparty}`
}

function Details({ transaction: tx }: { transaction: Transaction }) {
  return (
    <div className={styles.details}>
      <div className={styles.hero}>
        <TransactionIcon transaction={tx} className={styles.heroIcon} />
        <p className={styles.headline}>{headline(tx)}</p>
        <Money
          amount={tx.amount}
          currency={tx.currency}
          sign={isCredit(tx.type) ? 'credit' : 'debit'}
          className={styles.amount}
        />
        <StatusPill status={tx.status} />
      </div>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Details</h3>
        <dl className={styles.list}>
          <div className={styles.item}>
            <dt>Reference</dt>
            <dd className={styles.reference}>
              <span className={styles.mono}>{tx.reference}</span>
              <button
                type="button"
                className={styles.copy}
                aria-label="Copy reference"
                onClick={() => navigator.clipboard.writeText(tx.reference)}
              >
                <Icon name="copy" size={16} />
              </button>
            </dd>
          </div>
          <div className={styles.item}>
            <dt>Date</dt>
            <dd>{formatDateTime(tx.createdAt)}</dd>
          </div>
          <div className={styles.item}>
            <dt>Type</dt>
            <dd>{TRANSACTION_TYPE_LABELS[tx.type]}</dd>
          </div>
          {tx.counterparty && (
            <div className={styles.item}>
              <dt>Counterparty</dt>
              <dd>{tx.counterparty}</dd>
            </div>
          )}
          <div className={styles.item}>
            <dt>Narration</dt>
            <dd>{narrationText(tx.narration)}</dd>
          </div>
        </dl>
      </section>

      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Summary</h3>
        <dl className={styles.list}>
          <div className={styles.item}>
            <dt>Amount</dt>
            <dd>
              <Money amount={tx.amount} currency={tx.currency} />
            </dd>
          </div>
          <div className={styles.item}>
            <dt>Fee</dt>
            <dd>
              <Money amount={tx.fee} currency={tx.currency} />
            </dd>
          </div>
          <div className={styles.total}>
            <dt>Total</dt>
            <dd>
              <Money amount={tx.amount + tx.fee} currency={tx.currency} />
            </dd>
          </div>
        </dl>
      </section>
    </div>
  )
}

function DetailsSkeleton() {
  return (
    <div className={styles.details}>
      <div className={styles.hero}>
        <Skeleton className={styles.skeletonIcon} />
        <Skeleton className={styles.skeletonHeadline} />
        <Skeleton className={styles.skeletonAmount} />
        <Skeleton className={styles.skeletonStatus} />
      </div>
      <div className={styles.list}>
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className={styles.item}>
            <Skeleton className={styles.skeletonLabel} />
            <Skeleton className={styles.skeletonValue} />
          </div>
        ))}
      </div>
    </div>
  )
}
