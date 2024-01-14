const OrderBook = require('./OrderBook')

describe('OrderBook', () => {
  it('is empty on init', () => {
    const ob = new OrderBook()
    expect(ob.get()).toEqual({})
  })

  it('adds bids', () => {
    const ob = new OrderBook()
    ob.add(100, 2)
    ob.add(200, 3)
    ob.add(50, 4)
    expect(ob.get()).toEqual({ 100: 2, 200: 3, 50: 4 })
  })

  it('adds asks', () => {
    const ob = new OrderBook()
    ob.add(100, -2)
    ob.add(200, -2)
    ob.add(50, -2)
    expect(ob.get()).toEqual({ 100: -2, 200: -2, 50: -2 })
  })

  it('matches bids', () => {
    const ob = new OrderBook()
    ob.add(100, 2)
    ob.add(100, -2)
    expect(ob.get()).toEqual({})
  })

  it('matches asks', () => {
    const ob = new OrderBook()
    ob.add(100, -2)
    ob.add(100, 2)
    expect(ob.get()).toEqual({})
  })

  it('matches partially bids', () => {
    const ob = new OrderBook()
    ob.add(100, 2)
    ob.add(100, -1.5)
    expect(ob.get()).toEqual({ 100: 0.5 })
  })

  it('matches partially asks', () => {
    const ob = new OrderBook()
    ob.add(100, -2)
    ob.add(100, 1.5)
    expect(ob.get()).toEqual({ 100: -0.5 })
  })

  it('matches multiple bids', () => {
    const ob = new OrderBook()
    // bids
    ob.add(99, 1)
    ob.add(100, 2)
    // asks
    ob.add(101, -3)
    ob.add(102, -4)
    // market
    ob.add(50, -2.5)
    expect(ob.get()).toEqual({ 99: 0.5, 101: -3, 102: -4 })
  })

  it('matches multiple asks', () => {
    const ob = new OrderBook()
    // bids
    ob.add(99, 1)
    ob.add(100, 2)
    // asks
    ob.add(101, -3)
    ob.add(102, -4)
    // market
    ob.add(200, 3.5)
    expect(ob.get()).toEqual({ 99: 1, 100: 2, 102: -3.5 })
  })

  it('matches multiple bids 2', () => {
    const ob = new OrderBook()
    // bids
    ob.add(99, 1)
    ob.add(100, 2)
    // asks
    ob.add(101, -3)
    ob.add(102, -4)
    // market
    ob.add(99, -2.5)
    expect(ob.get()).toEqual({ 99: 0.5, 101: -3, 102: -4 })
  })

  it('matches multiple asks 2', () => {
    const ob = new OrderBook()
    // bids
    ob.add(99, 1)
    ob.add(100, 2)
    // asks
    ob.add(101, -3)
    ob.add(102, -4)
    // market
    ob.add(102, 3.5)
    expect(ob.get()).toEqual({ 99: 1, 100: 2, 102: -3.5 })
  })

  it('matches multiple bids 3', () => {
    const ob = new OrderBook()
    // bids
    ob.add(99, 1)
    ob.add(100, 2)
    // asks
    ob.add(101, -3)
    ob.add(102, -4)
    // market
    ob.add(99, -3.5)
    expect(ob.get()).toEqual({ 99: -0.5, 101: -3, 102: -4 })
  })

  it('matches multiple asks 3', () => {
    const ob = new OrderBook()
    // bids
    ob.add(99, 1)
    ob.add(100, 2)
    // asks
    ob.add(101, -3)
    ob.add(102, -4)
    // market
    ob.add(102, 7.5)
    expect(ob.get()).toEqual({ 99: 1, 100: 2, 102: 0.5 })
  })

  it('matches multiple bids and adds reminded to the book', () => {
    const ob = new OrderBook()
    // bids
    ob.add(99, 1)
    ob.add(100, 2)
    // asks
    ob.add(101, -3)
    ob.add(102, -4)
    // market
    ob.add(100, -2.5)
    expect(ob.get()).toEqual({ 99: 1, 100: -0.5, 101: -3, 102: -4 })
  })

  it('matches multiple asks and adds reminded to the book', () => {
    const ob = new OrderBook()
    // bids
    ob.add(99, 1)
    ob.add(100, 2)
    // asks
    ob.add(101, -3)
    ob.add(102, -4)
    // market
    ob.add(101, 3.5)
    expect(ob.get()).toEqual({ 99: 1, 100: 2, 101: 0.5, 102: -4 })
  })
})