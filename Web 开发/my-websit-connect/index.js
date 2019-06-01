/**
 * 模块依赖
 */
var connect = require('connect')

/**
 * 创建服务器
 */
var server = connect()

// 使用 use() 方法来添加 static 中间件。

/**
 * 处理静态文件
 */
server.use(connect.static(__dirname + '/static'))

/**
 * 监听
 */
server.listen(3000)

// 事实上，Connect 还可以处理 404 的情况