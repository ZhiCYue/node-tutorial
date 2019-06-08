/**
 * 引入模块
 */
var express = require('express')
  , mongodb = require('mongodb')
  , router = require('./router')

var oid = mongodb.ObjectId

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
    app.users.findOne({ _id: oid(req.session.loggedIn) }, function (err, doc) {
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
var MongoClient = mongodb.MongoClient

const url = 'mongodb://127.0.0.1:27017';
const dbName = 'my-website';

MongoClient.connect(url, function(err, client) {
  if (err) throw err
  console.log("\033[96m + \033[39m connected to mongodb");
  const db = client.db(dbName);

  // 建立 app 和 server 关联
  app.users = db.collection('users')
  
  // 监听
  app.listen(3000, function () {
    console.log('\033[96m + \033[39m app listening on *:3000')
  })

  // client.close();
});
