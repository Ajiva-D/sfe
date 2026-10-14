import { render, screen } from '@testing-library/react'
import { Money } from './Money'

describe('Money', () => {
  it('keeps two decimals', () => {
    render(<Money amount={2500000} currency="NGN" />)
    expect(screen.getByText('₦25,000.00')).toBeInTheDocument()
  })

  it('signs credits and debits', () => {
    render(
      <>
        <Money amount={2500000} currency="NGN" sign="credit" />
        <Money amount={1549} currency="USD" sign="debit" />
      </>
    )
    expect(screen.getByText('+₦25,000.00')).toBeInTheDocument()
    expect(screen.getByText('-$15.49')).toBeInTheDocument()
  })
})
