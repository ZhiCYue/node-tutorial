/**
 * 引入模块
 */
var express = require('express')
  , mongoose = require('mongoose')
  , router = require('./router')

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId
  , User = require('./model').User

/**
 * 创建服务
 */
app = express.createServer()

/**
 * 设置中间件
 */
app.use(express.bodyParser())
app.use(express.cookieParser())
app.use(express.session({ secret: 'my secret' }))

/**
 * 身份验证中间件
 */
app.use(function (req, res, next) {
  if (req.session.loggedIn) {
    res.local('authenticated', true)
    User.findById(req.session.loggedIn, function (err, doc) {
      if (err) return next(err)
      res.local('me', doc)
      next()
    })
  } else {
    res.local('authenticated', false)
    next()
  }
})

/**
 * 指定视图选项
 */
app.set('view engine', 'jade')
app.set('views', __dirname + '/views')
app.set('view options', { layout: false })

/**
 * 设置路由
 */
router(app)

/**
 * 连接数据库
 */
mongoose.connect('mongodb://127.0.0.1/my-website')
app.listen(3000, function () {
  console.log('\033[96m + \033[39m app listening on *3000')
})
