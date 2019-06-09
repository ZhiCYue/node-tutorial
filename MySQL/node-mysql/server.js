/**
 * 模块依赖
 */

var express = require('express')
  , mysql = require('mysql')

/**
 * 创建应用
 */
var app = express.createServer()

/**
 * 创建 MySql
 */
var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  port: 3306,
  database: 'cart-example'
})

/**
 * 配置应用
 */
app.set('view engine', 'jade')
app.set('views', __dirname + '/views')
app.set('view options', { layout: false })

/**
 * 中间件
 */
app.use(express.bodyParser())

/**
 * 首页路由
 */

app.get('/', function (req, res, next) {
  connection.query('SELECT id, title, description FROM item', function (err, results) {
    res.render('index', { items: results })
  })
})

/**
* 创建商品路由
*/
app.post('/create', function (req, res, next) {
  let { title, description } = req.body
  connection.query('INSERT INTO item SET title=?, description=?', [ title, description ], function (err, info) {
    if (err) return next(err)
    // 说明：info 对象
    console.log(' - item created with id %s', info.insertId)
    res.redirect('/')
  })
})

/**
* 查看商品
*/
app.get('/item/:id', function (req, res, next) {

  function getItem (fn) {
    connection.query('SELECT id, title, description FROM item WHERE id = ? LIMIT 1', 
        [ req.params.id ], function (err, results) {
          if (err) return next(err)
          if (!results[0]) return res.send(404)
          fn(results[0])
        })
  }

  function getReviews (item_id, fn) {
    connection.query('SELECT text, stars FROM review WHERE item_id = ?',
        [ item_id ], function (err, results) {
          if (err) return next(err)
          fn(results)
        })
  }

  getItem(function (item) {
    getReviews(item.id, function (reviews) {
      res.render('item', { item: item, reviews: reviews })
    })
  })

})

/**
* 评论路由
*/
app.post('/item/:id/review', function (req, res, next) {
  connection.query('INSERT INTO review SET item_id = ?, stars = ? , text = ?', 
    [req.params.id, req.body.stars, req.body.text], 
    function (err, info) {
      if (err) return next(err)
      console.log(' - review created with id %s', info.insertId)
      res.redirect('/item/' + req.params.id)
    })
})

/**
* 监听
*/
app.listen(3000, function () {
  console.log(' - listening on http://*:3000')
})
