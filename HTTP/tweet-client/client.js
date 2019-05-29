var http = require('http')

/**
 * 在调用玩 request 之后，还需要再调用 end。原因是在创建完一个请求之后，在发送服务期前还可以和 request 对象进行交互。
 */

http.request({
  host: '127.0.0.1',
  port: 3000,
  url: '/',
  method: 'GET'
}, function (res) {
  var body = ''
  res.setEncoding('utf8')
  res.on('data', function (chunk) {
    body += chunk
  })
  res.on('end', function () {
    console.log('\n We got: \033[96m' + body + '\033[39m\n')
  })
}).end()
