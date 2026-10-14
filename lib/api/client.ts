import type { ApiErrorBody, ApiPage, ApiSuccess } from '@/types/api'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? '/api'

export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function request<R>(path: string, init: RequestInit = {}): Promise<R> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
  })
  if (!res.ok) {
    const body: ApiErrorBody | null = await res.json().catch(() => null)
    throw new ApiError(
      res.status,
      body?.error.code ?? 'UNKNOWN',
      body?.error.message ?? 'Something went wrong. Please try again.'
    )
  }
  return res.json()
}

export const api = {
  get: <T>(path: string, init?: RequestInit) => request<ApiSuccess<T>>(path, init),
  getPage: <T>(path: string, init?: RequestInit) => request<ApiPage<T>>(path, init),
  post: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<ApiSuccess<T>>(path, { ...init, method: 'POST', body: JSON.stringify(body) }),
}
