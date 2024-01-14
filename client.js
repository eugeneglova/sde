const { PeerRPCClient } = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const OrderBook = require('./OrderBook')

const book = new OrderBook()

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCClient(link, {})
peer.init()

const sendOrder = () => {
  const price = Math.round(Math.random() * 1000)
  const amount = (Math.random() > 0.5 ? 1 : -1) * Math.round(Math.random() * 1000)
  const order = [price, amount]
  book.add(...order)
  peer.request('rpc_test', JSON.stringify(order), { timeout: 10000 }, (err, data) => {
    if (err) {
      console.error(err)
      process.exit(-1)
    }
    // console.log(data) // world
    // console.log('client received:', data) // world
  })
  
  setTimeout(() => {
    sendOrder()
  }, Math.round(Math.random() * 1000 + 500))
}
sendOrder()

