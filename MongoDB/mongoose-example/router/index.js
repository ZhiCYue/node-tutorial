/**
 * 路由管理
 * 
 */
var User = require('../model').User

module.exports = function (app) {

  /**
   * 默认路由
   */
  app.get('/', function (req, res) {
    res.render('index')
  })

  /**
   * 登录路由
   */
  app.get('/login', function (req, res) {
    res.render('login', { signupEmail: null })
  })

  app.get('/login/:signupEmail', function (req, res) {
    res.render('login', { signupEmail: req.params.signupEmail })
  })

  app.post('/login', function (req, res, next) {
    User.findOne({ email: req.body.user.email, password: req.body.user.password }, function (err, doc) {
      if (err) next(err)
      if (!doc) return res.send('<p>User not found, Go back and try again.</p>')
      req.session.loggedIn = doc._id.toString()
      res.redirect('/')
    })
  })

  /**
   * 注册路由
   */
  app.get('/signup', function (req, res) {
    res.render('signup')
  })

  app.post('/signup', function (req, res, next) {
    var user = new User(req.body.user).save(function (err) {
      if (err) return next(err)
      // 这里直接使用 user.email 会出错
      res.redirect('/login/' + req.body.user.email)
    })
  })

  /**
   * 退出
   */
  app.get('/logout', function (req, res) {
    // req.session.loggedIn = null
    req.session.regenerate(function () {
      res.redirect('/')
    })
  })

}