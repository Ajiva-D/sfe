import type { ReactNode } from 'react'
import { cx } from '@/lib/cx'
import { Icon, type IconName } from '../Icon'
import styles from './EmptyState.module.css'

export interface EmptyStateProps {
  icon: IconName
  tone?: 'primary' | 'danger'
  title: string
  description: string
  action?: ReactNode
}

export function EmptyState({ icon, tone = 'primary', title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.state}>
      <span className={cx(styles.icon, styles[tone])}>
        <Icon name={icon} size={24} />
      </span>
      <div className={styles.text}>
        <p className={styles.title}>{title}</p>
        <p className={styles.description}>{description}</p>
      </div>
      {action}
    </div>
  )
}
