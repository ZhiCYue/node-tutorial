/**
 * 引入模块
 */
var mysql = require('mysql')

/**
 * 创建 MySql
 */
var connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  port: 3306,
})


// connection.connect(function (err) {
//   if (err) throw err
//   console.log(' connect success! ')
// })

/**
 * 创建数据库
 * 
 * 注意：由于使用单个 TCP 连接，所以服务器接收到的指令顺序和我们书写的顺序是一致的。也就意味着，不需要为了确保执行顺序而嵌套回调；
 */
connection.commit('CREATE DATABASE IF NOT EXISTS `cart-example`')
connection.commit('USE `cart-example`')

/**
 * 创建表
 */
connection.commit('DROP TABLE IF EXISTS item')
connection.commit(`
  CREATE TABLE item ( 
    id INT(11) AUTO_INCREMENT,
    title VARCHAR(255),
    description TEXT,
    created DATETIME,
    PRIMARY KEY (id)
  );
`)

connection.commit('DROP TABLE IF EXISTS review')
connection.commit(`
  CREATE TABLE review ( 
    id INT(11) AUTO_INCREMENT,
    item_id INT(11),
    text TEXT,
    stars INT(1),
    created DATETIME,
    PRIMARY KEY (id)
  );
`)

/**
 * 关闭客户端
 */
connection.end(function () {
  process.exit()
})