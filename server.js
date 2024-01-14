const _ = require('lodash')
const { PeerRPCServer } = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')

const OrderBook = require('./OrderBook')

const book = new OrderBook()

const link = new Link({
  grape: 'http://127.0.0.1:30001'
})
link.start()

const peer = new PeerRPCServer(link, {
  timeout: 300000
})
peer.init()

const service = peer.transport('server')
service.listen(_.random(1000) + 1024)

setInterval(function () {
  link.announce('rpc_test', service.port, {})
}, 1000)

service.on('request', (rid, key, payload, handler) => {
  // console.log(payload) // hello
  // console.log('server received: ' + payload)
  const order = JSON.parse(payload)
  const [price, amount] = order
  console.log('price', price, 'amount', amount)
  book.add(price, amount)
  console.log('book', book.get())
  // handler.reply(null, 'world')
  const bookData = book.get()
  // console.log('server sent:', bookData)
  handler.reply(null, bookData)
})
