/**
 * 模块依赖
 */
var express = require('express')
  , sio = require('socket.io')
  // , request = require('superagent')

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
  , apiKey = '{ your API key }'
  , currentSong
  , dj

function elect (socket) {
  dj = socket
  io.sockets.emit('announcement', socket.nickname + ' is the new dj')
  socket.emit('elected')
  socket.dj = true
  socket.on('disconnect', function () {
    dj = null
    io.sockets.emit('announcement', 'the dj left - next one to join becomes dj')
  })
}

/**
 * 设置连接监听器
 */
io.sockets.on('connection', function (socket) {
  socket.on('join', function (name) {
    socket.nickname = name
    socket.broadcast.emit('announcement', name + ' joined the chat.')

    if (!dj) {
      elect(socket)
    } else {
      socket.emit('song', currentSong)
    }
  })

  socket.on('song', function (song) {
    if (socket.dj) {
      currentSong = song
      socket.broadcast.emit('song', song)
    }
  })

  socket.on('search', function (q, fn) {
    // request('http://tinysong.com/s/' + encodeURIComponent(q)
    //     + '?key=' + apiKey + '&format=json', function (res) {
    //       if (200 === res.status) {
    //         fn(JSON.parse(res.text))
    //       }
    //     }
    // )

    setTimeout(() => {
      let data = [{
        ArtistName: 'Jay',
        SongName: '七里香',
        Url: 'https://cn.amazfit.com/videos/jackets/w1.mp4'
      }]

      fn(data)
    }, 3000)
  })

  socket.on('text', function (msg, fn) {
    socket.broadcast.emit('text', socket.nickname, msg)

    // 确认消息已接收
    fn(Date.now())
  })
})
