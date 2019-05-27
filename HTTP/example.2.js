var http = require('http')

// 在调用 end 前，我们可以多次调用 write 方法来发送数据。为了尽可能快的响应客户端，在首次调用 write 时，
// Node 就能把所有的响应头信息以及第一块数据（Hello）发送出去。
// 随后，在执行 end 时，又写入了另外一块数据。由于这次不是write，Node 会结束响应，并不再允许往这次响应中发送数据了。

http.createServer(function (req, res) {
  res.writeHead(200)
  res.write('Hello')

  setTimeout(function(){
    res.end('World')
  })

}).listen(3000)

