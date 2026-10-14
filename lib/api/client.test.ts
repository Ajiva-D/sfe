import { api, ApiError } from './client'

const mockFetch = (body: string, status: number) =>
  vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(body, { status }))

afterEach(() => {
  vi.restoreAllMocks()
})

describe('api client', () => {
  it('returns the body on success', async () => {
    mockFetch(JSON.stringify({ data: { id: 'txn_1' } }), 200)
    await expect(api.get('/transactions/txn_1')).resolves.toEqual({ data: { id: 'txn_1' } })
  })

  it('throws ApiError with the API error code and message', async () => {
    mockFetch(JSON.stringify({ error: { code: 'INSUFFICIENT_FUNDS', message: 'Not enough money' } }), 422)
    await expect(api.post('/convert', {})).rejects.toEqual(
      new ApiError(422, 'INSUFFICIENT_FUNDS', 'Not enough money')
    )
  })

  it('throws ApiError when the error body is not JSON', async () => {
    mockFetch('<html>Bad Gateway</html>', 502)
    const error = await api.get('/me').catch((e) => e)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 502, code: 'UNKNOWN' })
  })
})
