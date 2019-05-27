var http = require('http')
  , fs = require('fs')

http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'image/png' })
  var stream = fs.createReadStream('image.png')

  stream.on('data', function (data) {
    res.write(data)
  })

  stream.on('end', function () {
    res.end()
  })

}).listen(3000)

