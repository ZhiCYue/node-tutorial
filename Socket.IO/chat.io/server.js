/**
 * 模块依赖
 */
var express = require('express')
  , sio = require('socket.io')

/**
 * 创建 app
 */
var app = express.createServer(express.bodyParser(), express.static('public'))

/**
 * 监听
 */
app.listen(3000)

/**
 * 将 socket.io 绑定到 app 上
 */
var io = sio.listen(app)

/**
 * 设置连接监听器
 */
io.sockets.on('connection', function (socket) {
  socket.on('join', function (name) {
    socket.nickname = name
    socket.broadcast.emit('announcement', name + ' joined the chat.')
  })

  socket.on('text', function (msg, fn) {
    socket.broadcast.emit('text', socket.nickname, msg)

    // 确认消息已接收
    fn(Date.now())
  })
})
