/**
 * 模块依赖
 */
var express = require('express')
  , Sequelize = require('sequelize')

/**
 * 创建应用
 */
var app = express.createServer()

/**
 * 实例化 sequelize
 */
var sequelize = new Sequelize('todo-example', 'root', 'root', { host: '127.0.0.1', port: 3306 })

/**
 * 定义模型
 */
var Project = sequelize.define('Project', {
  title: { type: Sequelize.STRING, defaultValue: '' },
  description: Sequelize.STRING,
  created: Sequelize.DATE
})

var Task = sequelize.define('Task', {
  title: Sequelize.STRING
})

/**
 * 设置模型关联
 */
Task.belongsTo(Project)
Project.hasMany(Task)

/**
 * 同步
 */
sequelize.sync()

/**
 * 配置应用
 */
app.set('view engine', 'jade')
app.set('views', __dirname + '/views')
app.set('view options', { layout: false })

/**
 * 中间件
 */
app.use(express.static(__dirname + '/public'))
app.use(express.bodyParser())

/**
 * 首页路由
 */
app.get('/', function (req, res, next) {
  Project.findAll().success(projects => {
    res.render('index', { projects })
  }).error(next)
})

/**
 * 删除项目路由
 */
app.del('/project/:id', function (req, res, next) {
  Project.find(Number(req.params.id)).success( proj => {
    proj.destroy().success(()=>res.send(200)).error(next)
  }).error(next)
})

/**
 * 创建项目路由
 */
app.post('/projects', function (req, res, next) {
  // Project.build(req.body).save().on('success', function (obj) {
  //   req.send(obj)
  // }).on('failure', next)

  Project.build(req.body).save().success(function (obj) {
    res.send(obj)
  }).error(next)
})

/**
 * 展示指定项目中的任务
 */
app.get('/project/:id/tasks', function (req, res, next) {
  Project.find(Number(req.params.id)).success(function (project) {
    project.getTasks().on('success', function (tasks) {
      res.render('tasks', { project, tasks })
    })
  }).error(next)
})

/**
 * 为指定项目添加任务
 */
app.post('/project/:id/tasks', function (req, res, next) {
  res.body.ProjectId = req.params.id
  Task.build(req.body).save().success(function (obj) {
    res.send(obj)
  }).error(next)
})

/**
 * 删除任务路由
 */
app.del('/task/:id', function (req, res, next) {
  Task.find(Number(req.params.id)).success(task => {
    task.destroy().success(() => res.send(200)).error(next)
  }).next(200)
})

/**
 * 监听
 */
app.listen(3000, function () {
  console.log(' - listening on http://*:3000')
})

// 待测试