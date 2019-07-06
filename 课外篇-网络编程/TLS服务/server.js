var tls = require('tls')
var fs = require('fs')

var options = {
  key: fs.readFileSync('./keys/server.key'),
  cert: fs.readFileSync('./keys/server.crt'),
  requestCert: true,
  ca: [ fs.readFileSync('./keys/ca.crt') ]
}

var server = tls.createServer(options, function (stream) {
  console.log('server connected', stream.authorized ? 'authorized' : 'unauthorized')
  stream.write('welcome!\n')
  stream.setEncoding('utf8')
  stream.pipe(stream)
})

server.listen(8000, function () {
  console.log('server bound')
})

// 启动服务后，可以通过下面命令测试证书是否正常
// $ openssl s_client -connect 127.0.0.1:8000