var http = require('http')
var fs = require('fs')
var path = require('path')

var pidfile = path.join(__dirname, 'run/app.pid')
fs.writeFileSync(pidfile, process.pid)

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end('Hello <b>World</b>')
}).listen(3000)

