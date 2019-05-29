/**
 * 模块依赖
 */
var connect = require('connect')
    , time = require('./request-time')

/**
 * 创建服务
 */
var server = connect()

// 记录
server.use(connect.logger('dev'))

// 实现时间中间件
server.use(time({ time: 500 }))

/**
 * 快速响应
 */
server.use(function (req, res, next)) {
  if ('/a' == req.url) {
    res.writeHead(200)
    res.end('Fast!')
  } else {
    next()
  }
}

/**
 * 慢速响应
 */
server.use(function (req, res, next) {
  if ('/b' == req.url) {
    setTimeout(function(){
      res.writeHead(200)
      res.end('Slow!')
    })
  } else {
    next()
  }
})
