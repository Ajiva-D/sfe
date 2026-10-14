'use client'
import { useEffect, useState } from 'react'
import { Input } from '@/components/ui'

const DEBOUNCE_MS = 300

export interface SearchFieldProps {
  /** Committed value from the URL. */
  q: string
  onSearch: (q: string) => void
  placeholder: string
  className?: string
}

/**
 * Keeps typing local and commits it after a pause. Takes the URL value back only when it changes to
 * something this field didn't write (Back, Clear filters), so a slow URL update never clobbers typing.
 */
export function SearchField({ q, onSearch, placeholder, className }: SearchFieldProps) {
  const [value, setValue] = useState(q)
  const [written, setWritten] = useState(q)
  const [prevQ, setPrevQ] = useState(q)

  if (q !== prevQ) {
    setPrevQ(q)
    if (q !== written) {
      setValue(q)
      setWritten(q)
    }
  }

  useEffect(() => {
    if (value === written) return
    const timer = setTimeout(() => {
      setWritten(value)
      onSearch(value)
    }, DEBOUNCE_MS)
    return () => clearTimeout(timer)
  }, [value, written, onSearch])

  return (
    <Input
      label="Search"
      leadingIcon="search"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      fieldClassName={className}
    />
  )
}
