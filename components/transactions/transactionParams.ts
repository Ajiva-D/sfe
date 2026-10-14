'use client'
import { useSearchParams } from 'next/navigation'
import { useMemo } from 'react'
import type { TransactionStatus, TransactionType } from '@/types/api'
import { TRANSACTION_STATUS_LABELS, TRANSACTION_TYPE_LABELS } from '@/lib/format'

export const TRANSACTION_TYPES = Object.keys(TRANSACTION_TYPE_LABELS) as TransactionType[]
export const TRANSACTION_STATUSES = Object.keys(TRANSACTION_STATUS_LABELS) as TransactionStatus[]

export interface TransactionParams {
  q: string
  type?: TransactionType
  status?: TransactionStatus
  page: number
  tx: string | null
}

/** Unknown values are dropped rather than sent to the API, which would reject them. */
export function parseTransactionParams(params: Pick<URLSearchParams, 'get'>): TransactionParams {
  const page = Number(params.get('page'))
  return {
    q: params.get('q') ?? '',
    type: TRANSACTION_TYPES.find((type) => type === params.get('type')),
    status: TRANSACTION_STATUSES.find((status) => status === params.get('status')),
    page: Number.isInteger(page) && page > 1 ? page : 1,
    tx: params.get('tx'),
  }
}

export function useTransactionParams() {
  const searchParams = useSearchParams()
  return useMemo(() => parseTransactionParams(searchParams), [searchParams])
}

type ParamChanges = Partial<Record<'q' | 'type' | 'status' | 'page' | 'tx', string | null>>

/**
 * Reads the live URL at write time so a delayed write (debounced search) can't undo a newer change,
 * and keeps params we don't own, like __scenario. The native History API syncs with useSearchParams
 * without re-requesting the server component.
 */
function writeParams(changes: ParamChanges, mode: 'push' | 'replace') {
  const params = new URLSearchParams(window.location.search)
  for (const [key, value] of Object.entries(changes)) {
    if (value) params.set(key, value)
    else params.delete(key)
  }
  const query = params.toString()
  const url = query ? `${window.location.pathname}?${query}` : window.location.pathname
  if (mode === 'push') window.history.pushState(null, '', url)
  else window.history.replaceState(null, '', url)
}

export const transactionUrl = {
  search: (q: string) => writeParams({ q, page: null }, 'replace'),
  filter: (key: 'type' | 'status', value: string) => writeParams({ [key]: value, page: null }, 'push'),
  clearFilters: () => writeParams({ q: null, type: null, status: null, page: null }, 'push'),
  page: (page: number) => writeParams({ page: page > 1 ? String(page) : null }, 'push'),
  correctPage: (page: number) => writeParams({ page: page > 1 ? String(page) : null }, 'replace'),
  open: (id: string) => writeParams({ tx: id }, 'push'),
  close: () => writeParams({ tx: null }, 'replace'),
}
