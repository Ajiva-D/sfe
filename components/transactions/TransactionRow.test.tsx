import { render, screen } from '@testing-library/react'
import type { Transaction } from '@/types/api'
import { TransactionRow } from './TransactionRow'

const tx: Transaction = {
  id: 'txn_1',
  reference: 'ACM-1',
  type: 'withdrawal',
  status: 'successful',
  currency: 'USD',
  amount: 22303,
  fee: 223,
  narration: 'Bill payment <img src="x" onerror="alert(1)">',
  counterparty: null,
  createdAt: '2026-10-05T10:15:00.000Z',
}

describe('TransactionRow', () => {
  it('renders narration as text, not HTML', () => {
    const { container } = render(<TransactionRow transaction={tx} />)
    expect(screen.getByText(tx.narration)).toBeInTheDocument()
    expect(container.querySelector('img')).toBeNull()
  })

  it('shows the fee in the transaction currency', () => {
    render(<TransactionRow transaction={tx} />)
    expect(screen.getByText('$2.23')).toBeInTheDocument()
  })
})
