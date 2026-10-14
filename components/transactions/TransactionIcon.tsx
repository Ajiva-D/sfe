import type { Transaction, TransactionType } from '@/types/api'
import { Icon, type IconName } from '@/components/ui'
import { cx } from '@/lib/cx'
import { getInitials } from '@/lib/format'
import styles from './TransactionIcon.module.css'

const TYPE_ICONS: Record<TransactionType, IconName> = {
  deposit: 'arrow-down-left',
  transfer_in: 'arrow-down-left',
  withdrawal: 'arrow-up-right',
  transfer_out: 'arrow-up-right',
  conversion: 'swap',
  card_payment: 'card',
  bill_payment: 'receipt',
}

/** Counterparty initials when there is one, otherwise the type icon. */
export function TransactionIcon({
  transaction,
  className,
}: {
  transaction: Transaction
  className?: string
}) {
  return (
    <span className={cx(styles.icon, className)} aria-hidden>
      {transaction.counterparty ? (
        getInitials(transaction.counterparty)
      ) : (
        <Icon name={TYPE_ICONS[transaction.type]} size={18} />
      )}
    </span>
  )
}
