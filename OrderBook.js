const _ = require('lodash')

class OrderBook {
  orders = {}

  get() {
    return this.orders
  }

  set(orders) {
    return this.orders = orders
  }

  add(price, amount) {
    if (!amount) return
    const bids = _.omitBy(this.orders, (amount) => amount < 0)
    const asks = _.omitBy(this.orders, (amount) => amount > 0)
    const bidsPrices = _.map(bids, (amount, price) => +price).sort((a, b) => b - a)
    const asksPrices = _.map(asks, (amount, price) => +price).sort((a, b) => a - b)
    const topBid = _.first(bidsPrices)
    const topAsk = _.first(asksPrices)
    // buy
    if (amount > 0) {
      if (price > topAsk) {
        let quantity = amount
        let priceIndex = 0
        while (quantity > 0) {
          const currentPrice = asksPrices[priceIndex]
          if (!currentPrice) {
            this.orders[price] = quantity
            quantity = 0
          } else if (quantity <= -this.orders[currentPrice]) {
            this.orders[currentPrice] += quantity
            quantity = 0
          } else {
            quantity += this.orders[currentPrice]
            delete this.orders[currentPrice]
            priceIndex++
          }
        }
        return
      } else {
        this.simpleMatch(price, amount)
        return
      }
    }
    // sell
    if (price < topBid) {
      let quantity = amount
      let priceIndex = 0
      while (quantity < 0) {
        const currentPrice = bidsPrices[priceIndex]
        if (!currentPrice) {
          this.orders[price] = quantity
          quantity = 0
        } else if (quantity >= -this.orders[currentPrice]) {
          this.orders[currentPrice] += quantity
          quantity = 0
        } else {
          quantity += this.orders[currentPrice]
          delete this.orders[currentPrice]
          priceIndex++
        }
      }
      return
    }
    this.simpleMatch(price, amount)
  }

  simpleMatch(price, amount) {
    this.orders[price] = (this.orders[price] || 0) + amount
    if (!this.orders[price]) delete this.orders[price]
  }
}

module.exports = OrderBook