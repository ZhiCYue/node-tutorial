/**
 * 引入依赖
 */
var express = require('express')
  , search = require('./search')

/**
 * 创建app 服务
 */
var app = express.createServer()

// 设置默认配置
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('view options', { layout: false })

// console.log(app.set('view engine'))

/**
 * 添加路由
 */
app.get('/', function (req, res, next) {
  res.render('index')
})

app.get('/search', function (req, res, next) {
  search(req.query.q, function (err, tweets) {
    if (err) return next(err)
    res.render('search', { results: tweets, search: req.query.q })
  })
})

/**
 * 错误处理
 */
app.error(function (err, req, res, next) {
  if ('Bad twitter response' == err.message) {
    res.render('twitter-error')
  } else {
    next()
  }
})

app.error(function (err, req, res, next) {
  res.render('error', { status: 500 })
})

/**
 * 监听
 */
app.listen(3000)