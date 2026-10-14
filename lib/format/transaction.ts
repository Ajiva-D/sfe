import type { TransactionStatus, TransactionType } from '@/types/api'

export const TRANSACTION_TYPE_LABELS: Record<TransactionType, string> = {
  deposit: 'Deposit',
  withdrawal: 'Withdrawal',
  transfer_in: 'Transfer in',
  transfer_out: 'Transfer out',
  conversion: 'Conversion',
  card_payment: 'Card payment',
  bill_payment: 'Bill payment',
}

export const TRANSACTION_STATUS_LABELS: Record<TransactionStatus, string> = {
  successful: 'Successful',
  pending: 'Pending',
  failed: 'Failed',
}

const CREDIT_TYPES: TransactionType[] = ['deposit', 'transfer_in', 'conversion']

export const isCredit = (type: TransactionType) => CREDIT_TYPES.includes(type)

/** "Okonkwo-Adeyemi Logistics" -> "OA" */
export const getInitials = (name: string) =>
  name
    .split(/[\s-]+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join('')
    .toUpperCase()

/**
 * Narration comes unsanitised from upstream providers. Keep only its text. DOMParser documents are inert, so
 * nothing in the markup runs or loads, and React escapes the result when it renders.
 */
export const narrationText = (narration: string) =>
  (new DOMParser().parseFromString(narration, 'text/html').body.textContent ?? '').trim()
