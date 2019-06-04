## Socket.IO

要将 WebSocket 用到应用中，并非简单的把 WebSocket 实现就可以。
<br>
Socket.IO 用于解决使用 WebSocket 过程中一系列常见问题。先看一下 API：

---
**Server API**
```js
io.listen(app)
io.sockets.on('connection', function (socket) {
  socket.emit('my event', { my: 'object' })
})
```
---

---
**Browser/ Client API**
```js
var socket = io.connect()
socket.on('my event', function (obj) {
  console.log(obj.my)
})
```
---

#### 传输

Socket.IO 最诱人的特点之一就是消息的传递是基于传输的，而非全部依靠 WebSocket，也就是说，Socket.IO 可以在绝大多数的浏览器和设备上运行。
<br>
例如，在使用一项称为 long polling 技术的时候，可以通过 Ajax 来实现实时消息传输。这项技术是通过持续发送一系列的 Ajax 请求来实现的，但是，当服务器端没有数据返回到客户端时，连接还会持续打开 20~50 s，以确保不再有额外的数据通过 HTTP 请求/响应头传递过来。
<br>
Socket.IO 会自动使用像 long polling 这样复杂的技术，但其 API 保持了与 WebSocket 一样的简洁。


#### 断开 VS 关闭

Socket.IO 另一个基础功能是对超时的支持。我们使用 Socket.IO ，监听的是 connect 事件而非 open 事件，以及 disconnect 事件而不是 close 事件。若客户端停止传输数据，但在一定时间内又没有正常的关闭连接，Socket.IO 就认为它是断开连接了。
<br >
当连接丢失时，Socket.IO 会自动重连。

#### 事件

典型的 Web 通信方式是通过 HTTP 来 收取/发送 文档的。但实时 Web 世界中，都是基于事件传输的。
<br>
Socket.IO 还支持通过分发（emit）和监听（listen）事件来进行 JSON 数据的收发。下面示例展示了 Socket.IO 像 WebSocket 那样进行消息的收发：
```js
io.sockets.on('connect', function (socket) {
  socket.send('a')
  socket.on('message', function (msg) {
    console.log(msg)
  })
})
```

#### 命名空间

Socket.IO 允许监听多个命名空间中的 connect 事件。
```js
io.sockets.on('connection')
io.of('/some/namespace').on('connection')
io.of('/some/other/namespace').on('connection')
```

#### chat.io

Socket.IO 总会尝试选择对用户来说速度最快、对服务器来说性能最好的方法来建立连接。

#### dj

dj 示例是在 chat.io 上面的扩展。
<br>
其中，elect 函数主要完成如下几件事情：
- 将当前用户选为 dj
- 分发公告给所有人 dj 已经选取完毕
- 通过分发 elected 事件，让 dj 知道自己被选中了
- 当 dj 断开连接时，将 dj 的名额留给下一个进来的人


#### 小结

Socket.IO 提供了足够简单但十分强大的 API，用于构建实时消息快速通信的应用。Socket.IO 不仅保证了消息尽可能快的传输，还能在所有的浏览器以及绝大多数移动设备上运行。
<br>


