import type { Metadata } from 'next'
import { Suspense } from 'react'
import { TransactionsFallback, TransactionsView } from '@/components/transactions'

export const metadata: Metadata = { title: 'Transactions' }

export default function TransactionsPage() {
  return (
    <Suspense fallback={<TransactionsFallback />}>
      <TransactionsView />
    </Suspense>
  )
}
