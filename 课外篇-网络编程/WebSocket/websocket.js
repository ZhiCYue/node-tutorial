var crypto = require('./node_modules/crypto')
var http = require('./node_modules/http')

var WebSocket = function (url) {
  // 伪代码，解析 ws://127.0.0.1:12010/updates，用于请求
  // this.options = parseUrl(url)

  this.options = {
    port: 12010,
    hostname: '127.0.0.1',
    protocolVersion: 13
  }
  this.connect()
}

WebSocket.prototype.onopen = function () {
  // TODO
}

WebSocket.prototype.send = function (data) {
  // this._send(data)
}

WebSocket.prototype.setSocket = function (socket) {
  this.socket = socket
  this.socket.on('data', function(chunck) {
    console.log('receiver.')
  })
}

WebSocket.prototype.connect = function () {
  var that = this
  var key = new Buffer(this.options.protocolVersion + '-' + Date.now()).toString('base64')
  var shasum = crypto.createHash('sha1')
  var expected = shasum.update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64')

  var options = {
    port: this.options.port, // 12010
    host: this.options.hostname, // 127.0.0.1
    headers: {
      'Connection': 'Upgrade',
      'Upgrade': 'websocket',
      'Sec-WebSocket-Version': this.options.protocolVersion,
      'Sec-WebSocket-Key': key
    }
  }

  var req = http.request(options)
  req.end()

  req.on('upgrade', function (res, socket, upgradeHead) {
    // 连接成功
    that.setSocket(socket)
    // 触发 open 事件
    that.onopen()
  })
}

module.exports = WebSocket