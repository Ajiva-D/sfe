'use client'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { getTransaction, getTransactions, type TransactionQuery } from './endpoints'

export function useTransactions(query: TransactionQuery) {
  return useQuery({
    queryKey: ['transactions', query],
    queryFn: ({ signal }) => getTransactions(query, { signal }),
    placeholderData: keepPreviousData,
  })
}

export function useTransaction(id: string) {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: ({ signal }) => getTransaction(id, { signal }).then((res) => res.data),
  })
}
