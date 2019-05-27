## HTTP

超文本传输协议，又称为 HTTP，是一种 Web 协议，它是属于 TCP 上层的协议。
<br>

#### HTTP 结构

HTTP 协议构建在请求和响应的概念上，对应在 Node 中就是由 http.ServerRequest 和 http.ServerResponse 这两个构造器构造出来的对象。
<br>

#### 头部信息

HTTP 协议和 IRC 一样流行，其目的就是进行文档交换。它在请求和响应消息前使用头信息（header）来描述不同的消息内容。
<br>
举个栗子，Web 页面会分发许多不同类型的内容：文本（text）、HTML、XML、JSON、PNG 等。发送内容的类型（type）就是Content-Type 头部信息中标注的。
<br>
Node 会自动添加HTTP 响应的头信息-- Transfer-Encoding 和 Connection。
<br>
> Transfer-Encoding 头信息的默认值是 chunked。
<br>

Node 允许以数据块的形式往响应中写数据，同时它又允许以数据块的形式读取文件。所以我们可以使用 ReadStream 文件系统来实现读取。

`example.3.js` 以一些列数据块的形式将图片写入到响应中，有如下好处：
- 高效的内存分配。要是对每个请求在写入前都完全把图片信息读取完（通过 fs.readFile），在处理大量请求时无疑是耗费内存的。
- 数据一旦就绪就可以理解写入。

Node 提供了一个方法，可以使流的对接更加简洁：pipe

#### 连接

对比 TCP 服务器和 HTTP 服务器的实现，他们都调用了 createServer 方法，并且当客户端连入时都会执行一个回调函数。
<br>
不过它们有着本质却别，即回调函数中对象的类型。在 net 服务器中，是个连接（connect）对象，而在 HTTP 服务中，则是请求和响应对象。
<br>
<br>
默认情况下，Node 会告诉浏览器始终保持连接，通过它发送更多的请求。