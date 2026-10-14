import { act, fireEvent, render, screen } from '@testing-library/react'
import { SearchField } from './SearchField'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

const setup = (q = '') => {
  const onSearch = vi.fn()
  const view = render(<SearchField q={q} onSearch={onSearch} placeholder="Search" />)
  const input = screen.getByLabelText('Search')
  return {
    onSearch,
    input,
    type: (value: string) => fireEvent.change(input, { target: { value } }),
    setUrl: (next: string) =>
      view.rerender(<SearchField q={next} onSearch={onSearch} placeholder="Search" />),
  }
}

describe('SearchField', () => {
  it('commits once typing pauses', () => {
    const { onSearch, type } = setup()
    type('net')
    act(() => vi.advanceTimersByTime(200))
    type('netflix')
    expect(onSearch).not.toHaveBeenCalled()
    act(() => vi.advanceTimersByTime(300))
    expect(onSearch).toHaveBeenCalledExactlyOnceWith('netflix')
  })

  it('keeps typing when the URL catches up with an earlier commit', () => {
    const { input, type, setUrl } = setup()
    type('net')
    act(() => vi.advanceTimersByTime(300))
    type('netflix')
    setUrl('net')
    expect(input).toHaveValue('netflix')
  })

  it('takes the URL value on outside changes like Back or Clear filters', () => {
    const { onSearch, input, type, setUrl } = setup('netflix')
    type('netflix!')
    setUrl('')
    expect(input).toHaveValue('')
    act(() => vi.advanceTimersByTime(300))
    expect(onSearch).not.toHaveBeenCalled()
  })
})
