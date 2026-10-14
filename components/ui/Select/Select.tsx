'use client'
import * as RadixSelect from '@radix-ui/react-select'
import { useId } from 'react'
import { cx } from '@/lib/cx'
import { Field } from '../Field'
import { Icon } from '../Icon'
import styles from './Select.module.css'

export interface SelectOption {
  /** Must not be empty; Radix reserves "" for "no value". */
  value: string
  label: string
}

export interface SelectProps {
  label: string
  hideLabel?: boolean
  options: readonly SelectOption[]
  value: string
  onValueChange: (value: string) => void
  fieldClassName?: string
  className?: string
}

export function Select({
  label,
  hideLabel,
  options,
  value,
  onValueChange,
  fieldClassName,
  className,
}: SelectProps) {
  const id = useId()
  return (
    <Field label={label} htmlFor={id} hideLabel={hideLabel} className={fieldClassName}>
      <RadixSelect.Root value={value} onValueChange={onValueChange}>
        <RadixSelect.Trigger id={id} className={cx(styles.trigger, className)}>
          <RadixSelect.Value />
          <RadixSelect.Icon className={styles.chevron}>
            <Icon name="chevron-down" size={16} />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Portal>
          <RadixSelect.Content position="popper" sideOffset={4} className={styles.content}>
            <RadixSelect.Viewport>
              {options.map((option) => (
                <RadixSelect.Item key={option.value} value={option.value} className={styles.item}>
                  <RadixSelect.ItemText>{option.label}</RadixSelect.ItemText>
                </RadixSelect.Item>
              ))}
            </RadixSelect.Viewport>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </Field>
  )
}
