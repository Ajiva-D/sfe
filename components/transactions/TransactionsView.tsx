'use client'
import { useEffect, useRef } from 'react'
import type { Transaction } from '@/types/api'
import { Button, Card, Drawer, EmptyState, Pagination } from '@/components/ui'
import { useTransactions } from '@/lib/api/queries'
import { cx } from '@/lib/cx'
import { TransactionDetails } from './TransactionDetails'
import { TransactionFilters } from './TransactionFilters'
import { TransactionList, TransactionListSkeleton } from './TransactionList'
import { transactionUrl, useTransactionParams } from './transactionParams'
import styles from './TransactionsView.module.css'

const PAGE_SIZE = 20

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`

export function TransactionsView() {
  const { q, type, status, page, tx } = useTransactionParams()
  const list = useTransactions({ q, type, status, page, limit: PAGE_SIZE })
  const { data, isPlaceholderData } = list
  const hasFilters = Boolean(q || type || status)
  const openedFromList = useRef(false)

  useEffect(() => {
    if (data && !isPlaceholderData && page > data.meta.totalPages) {
      transactionUrl.correctPage(data.meta.totalPages)
    }
  }, [data, isPlaceholderData, page])

  useEffect(() => {
    if (!tx) openedFromList.current = false
  }, [tx])

  const openDetails = (transaction: Transaction) => {
    openedFromList.current = true
    transactionUrl.open(transaction.id)
  }

  // Opened from the list: step back so the closed drawer doesn't leave a duplicate history entry.
  const closeDetails = () => {
    if (openedFromList.current) window.history.back()
    else transactionUrl.close()
  }

  const changePage = (next: number) => {
    transactionUrl.page(next)
    window.scrollTo({ top: 0 })
  }

  const subtitle = data && plural(data.meta.total, hasFilters ? 'result' : 'transaction')

  return (
    <div className={styles.page}>
      <TransactionsHeader subtitle={subtitle} />
      <TransactionFilters params={{ q, type, status }} hasFilters={hasFilters} />

      <div aria-busy={list.isFetching} className={cx(styles.results, isPlaceholderData && styles.stale)}>
        {data?.meta.total === 0 ? (
          <Card padding="none">
            {hasFilters ? (
              <EmptyState
                icon="search"
                title="No transactions match your filters"
                description="Try a different search term or remove some filters."
                action={
                  <Button variant="secondary" onClick={transactionUrl.clearFilters}>
                    Clear filters
                  </Button>
                }
              />
            ) : (
              <EmptyState
                icon="inbox"
                title="No transactions yet"
                description="When you add money, send a transfer or pay with your card, it will show up here."
              />
            )}
          </Card>
        ) : data?.data.length ? (
          <TransactionList transactions={data.data} onSelect={openDetails} />
        ) : list.isError ? (
          <Card padding="none">
            <EmptyState
              icon="alert"
              tone="danger"
              title="We couldn’t load your transactions"
              description="Check your connection and try again."
              action={
                <Button iconLeft="refresh" disabled={list.isFetching} onClick={() => list.refetch()}>
                  Try again
                </Button>
              }
            />
          </Card>
        ) : (
          <TransactionListSkeleton />
        )}
      </div>

      {data && data.data.length > 0 && (
        <div className={styles.footer}>
          <p className={styles.range}>
            Showing {(data.meta.page - 1) * data.meta.limit + 1}–
            {(data.meta.page - 1) * data.meta.limit + data.data.length} of {data.meta.total}
          </p>
          <Pagination
            page={data.meta.page}
            totalPages={data.meta.totalPages}
            onPageChange={changePage}
            className={styles.pagination}
          />
        </div>
      )}

      <Drawer open={tx !== null} title="Transaction details" onClose={closeDetails}>
        {tx && (
          <TransactionDetails
            key={tx}
            id={tx}
            fallback={data?.data.find((t) => t.id === tx)}
            onClose={closeDetails}
          />
        )}
      </Drawer>
    </div>
  )
}

function TransactionsHeader({ subtitle }: { subtitle?: string }) {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Transactions</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </header>
  )
}

/** Server-rendered stand-in until the URL can be read on the client. */
export function TransactionsFallback() {
  return (
    <div className={styles.page}>
      <TransactionsHeader />
      <TransactionFilters params={{ q: '' }} hasFilters={false} />
      <TransactionListSkeleton />
    </div>
  )
}
