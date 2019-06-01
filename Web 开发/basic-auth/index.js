/**
 * 引入依赖
 */
var connect = require('connect')

/**
 * 创建服务
 */
var server = connect()

/**
 * 开启用户输入
 */
process.stdin.resume()
process.stdin.setEncoding('ascii')

/**
 * 设置中间件
 */
server.use(connect.basicAuth(function (user, pass, fn) {
  process.stdout.write('Allow user \033[96m' + user + '\033[39m '
          + 'with pass \033[90m' + pass + '\033[39m ? [y/n]: ')
  process.stdin.once('data', function (data) {
    if (data[0] == 'y') {
      fn(null, { username: user })
    } else fn(new Error('Unauthorized'))
  })
}))

server.use(function (req, res) {
  res.writeHead(200)
  res.end('Welcome to the protected area, ' + req.remoteUser.username)
})

/**
 * 服务监听
 */
server.listen(3000)