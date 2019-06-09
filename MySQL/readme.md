## MySQL

见示例 node-mysql ，可以了解 SQL 查询语句来操作数据库。

<br>

和 MongoDB 处理方式一样，node-mysql 在真正连接到 MySQL 前可以接收指令，并将它们缓存起来（也就是将他们缓存在内存中），当连接建立后，就一次性将他们全部发送给 Mysql。

所以无需监听 connect 时间而后传入回调函数，只需要简单地初始化客户端，提供相关设置即可。

> 注意示例中，info 对象。代码通过 insertId 来获取创建商品的 ID。只要不发生错误，这一属性一直都在。

#### sequelize

示例中，直接操作 SQL 数据库的方式多少有些问题。
第一个问题就是建表的过程是手动的（耗时），而且表的定义并非项目本身的一部分。应用程序根本无法得知商品的 title 属性只能允许最多 255 个字符。如果能知道，就可以进行对用户输入的校验了。

解决这个问题的方式就是使用 sequelize：通过它可以定义 schema 和模型，同时还可以使用其同步的特性，根据哪些定义来创建要使用的数据库表。（这样一来，就不需要 setup.js 脚本了）

最后一点，就是联合查询。通过使用 sequelize 可以自动获取关联的数据。

示例见：todo-list-example （2019-06-07 待测试）

Sequelize 构造器接收如下参数：
- database (String)
- username (String) - 必须
- password (String) - 可选
- other options (Object) - 可选
  - host (String)
  - post (Number)

在开发阶段，我们会经常对数据库表进行修改操作。因此，我们可以在调用 sync 方法时，可以传递 { force: true } 参数来让 sequelize 始终先删除已有的表，再重新创建，已确保数据变化总能同步到数据库中。
