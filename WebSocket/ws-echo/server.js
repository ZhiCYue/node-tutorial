/**
 * 初始化 express 并将 websocket.io 绑定到 express 上，这样它就能够处理 WebSocket 的请求了。
 */
var express = require('express')
  , wsio = require('websocket.io')

/**
 * Create express app.
 */

 var app = express.createServer()

 /**
  * Attach websocket server.
  */

var ws = wsio.attach(app)

/**
 * Serve your code
 */

app.use(express.static('public'))

/**
* Listening on connections
*/

ws.on('connection', function (socket) {
  socket.on('message', function (msg) {
    console.log(' \033[96mgot: \033[39m ' + msg)
    socket.send('pong')
  })
})

/**
 * Listen
 */

app.listen(3000)
