/**
 * 引入模块
 */
var redis = require('redis')

/**
 * 导出模块
 */
module.exports = User

/**
 * 创建客户端
 */

var client = redis.createClient()

/**
 * 用户模型
 */
function User (id, data) {
  this.id = id
  this.data = data
}

// 提供静态方法，用来从 Redis 查询结果中构建一个 User 实例
User.find = function (id, fn) {
  client.hgetall('user:' + id + ":data", function (err, obj) {
    if (err) return fn(err)
    fn(null, new User(id, obj))
  })
}

// 添加save 方法，该方法执行 hmset 来创建和修改用户信息：
User.prototype.save = function (fn) {
  if (!this.id) {
    this.id = String(Math.random()).substr(3)
  }
  client.hmset('user:' + this.id + ':data', this.data, fn)
}

// client multi 意味着告诉客户端，所有命令都必须等到exec 执行后再执行，它们视为事务的一部分。
User.prototype.follow = function (user_id, fn) {
  client.multi()
    .sadd('user:' + user_id + ':followers', this.id)
    .sadd('user:' + this.id + ':follows', user_id)
    .exec(fn)
}

User.prototype.unfollow = function (user_id, fn) {
  client.multi()
    .srem('user:' + user_id + ':followers', this.id)
    .srem('user:' + this.id + ':followers', user_id)
}

User.prototype.getFollowers = function (fn) {
  client.smembers('user:' + this.id + ':followers', fn)
}

User.prototype.getFollows = function (fn) {
  client.smembers('user:' + this.id + ':follows', fn)
}

// 计算交集
User.prototype.getFriends = function (fn) {
  client.sinter('user:' + this.id + ':follows', 'user:' + this.id + ':followers', fn)
}