var http = require('http')
  , fs = require('fs')

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'image/png' })
  fs.createReadStream('image.png').pipe(res)
}).listen(3000)

