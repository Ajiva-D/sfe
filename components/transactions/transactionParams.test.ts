import { parseTransactionParams } from './transactionParams'

const parse = (query: string) => parseTransactionParams(new URLSearchParams(query))

describe('parseTransactionParams', () => {
  it('reads valid params', () => {
    expect(parse('q=netflix&type=card_payment&status=pending&page=3&tx=txn_1')).toEqual({
      q: 'netflix',
      type: 'card_payment',
      status: 'pending',
      page: 3,
      tx: 'txn_1',
    })
  })

  it('drops values the API would reject', () => {
    expect(parse('type=foo&status=reversed&page=abc')).toEqual({
      q: '',
      type: undefined,
      status: undefined,
      page: 1,
      tx: null,
    })
    expect(parse('page=-2').page).toBe(1)
    expect(parse('page=2.5').page).toBe(1)
  })
})
