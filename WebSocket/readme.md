## WebSocket

目前，绝大部分网站和 Web 应用开发者都习惯了通过发送 Http 请求来和服务器进行通信，随后接收服务器的 Http 响应。

#### Ajax

Web 2.0 标志着 Web 应用的崛起。其中一个关键因素就是 Ajax，其提高了用户体验，重要的原因：用户再也不用每次都通过交互操作才能从服务器端获取新的 HTML 文档。

<br>

当执行代码发送请求时，浏览器会使用可用的 socket 来进行数据发送，为了提高性能，浏览器会和服务器之间建立多个 socket 通道。举例来说，在下载图片的时候，还是可以同时发送 Ajax 请求。要是浏览器只有一个 socket 通道，那么网站渲染和使用都会非常慢。
<br>
若三个请求分别通过三个不同的 socket 通道发送，就无法保证服务器端接收的顺序了。所以，要解决这个问题，我们需要调整代码，在服务器接收到一个请求后再接着发送第二个请求，这样就能保证接收的顺序了：
```js
var sending = false

$(document).mousemove(function (ev) {
  if (sending) return
  sending = true
  $.post('/position', { x: ev.clientX, y: ev.clientY }, function () {
    sending = false
  })
})
```

作为例子，下面显示了 Firefox 中 TCP 传输消息的内容：

---
**Request**
```
POST / HTTP/1.1
Host: localhost:3000
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.7; rv:8.0.1) Gecko/20100101 Firefox/8.0.1
Accept: */*
Accept-Language: en-us,en;q=0.5
Accept-Encoding: gzip, deflate
Accept-Charset: ISO-8859-1,utf-8;q=0.7,*;q=0.7
Content-Type: application/x-www-form-urlencoded; charset=UTF-8
X-Requested-With: XMLHttpRequest
Referer: http://localhost:3000/
Content-Length: 7
Prama: no-cache
Cache-Control: no-cache

x=6&y=7
```
---

---
**Response**
```
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Lenght: 2
Connection: keep-alive

OK
```
---

如上述例子所示，除了一小段数据，还包含了很多的文本内容。对于上述例子而言，很多不需要的头信息依然被发送了出去，这些头信息的数据量远远超过了真正要发送数据本身的大小。
<br>
尽管可以移除其中一些头信息，但是对于上述例子来说，我们真的需要响应消息吗？在发送一些像鼠标移动这些无关紧要的数据时，其实根本不需要等到响应返回后再接着发送更多的消息。
<br>
对于这类 Web 应用来说，理想解决方案得从 TCP 而非 HTTP 入手（就像之前章节中的聊天程序那样）。理想状态下，我们更希望直接将数据，另外附加最小的消息窗口（就是与真正发送的数据包裹在一起的数据）通过socket 发送。
<br>
拿 telnet 举例的话，我们希望浏览器可以发送如下面这样的数据：
```
x=6&y=7 \n
x=10&y=15 \n
...
```


归功于 HTML5，现在我们有了这样的解决方案：WebSocket。
<br>
WebSocket 是 Web 下的 TCP，一个底层的双向 socket，允许用户对消息传递进行控制。

#### HTML5 WebSocket

每次提到 WebSocket 时，其实是在讲两部分内容：一部分是浏览器实现的 WebSocket API，另一部分是服务器端实现的 WebSocket 协议。这两部分是随着 HTML5 的推动一起被设计和开发的，但是两者都没有成为 HTML5 标准的一部分。前者被 W3C 标准化了，而后者被 IETF 标准化为 RFC 6455。
<br>
浏览器端实现的 API 如下：
```js
var ws = new WebSocket('ws://host/path')

ws.onopen = function () {
  ws.send('data')
}

ws.onclose = function () {}

ws.ondata = function (ev) {
  alert(ev.data)
}
```
上述简单的 API 不禁让我们想起之前写过的 TCP 客户端。 和 XMLHTTPRequest 不同，它并非面向请求和响应，而是可以直接通过 send 方法进行消息传递。通过 data 事件，发送和接收 UTF-8 或者二进制编码的消息都非常简单，另外，通过 open 和 close 事件能够获知链接打开和关闭的状态。
<br>

首先，连接必须通过握手来建立。握手方面和普通的 HTTP 请求类似，但在服务端响应后，客户端和服务器端收发数据时，数据本身之外的信息非常少：

---
**Request**
```
GET /ws HTTP/1.1
Host: example.com
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Version: 6
Sec-WebSocket-Origin: http://pmx
Sec-WebSocket-Extensions: deflate-stream
Sec-WebSocket-Key: x3JJHMbDL1EzLkh9GBhXDw
```
---

---
**Response**
```
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: HSmrc0sM1YUkAGmm5OPpG2HaGWK
```
---

WebSocket 还是建立在 HTTP 之上的，也就说，对于现有的服务器来说，实现 WebSocket 协议非常容易。它和 HTTP 之间的主要区别就是，握手完成后，客户端和服务端就建立了类似 TCP socket 这样的通道。

为了更好地理解，我们来写个示例。