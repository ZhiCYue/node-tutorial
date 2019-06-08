## MongoDB

MongoDB 是一个面向文档，schema 无关的数据库，非常适合于 Node.js 应用以及云端部署。

<br>
与 MySql 和 PostgreSQL 是根据固定的结构设计(schema) 将数据存储在表中不同，MongoDB 可以将任意类型的文档数据存储到集合中(schema无关)。

<br>
例如，创建下面这张为 Web 应用保存用户信息的表：

---
| First | Last | Email | Twitter
|:---|:---|---|---|
| Guillermo | Rouch | rauchg@gmail.com | rauchg
|

在构建应用时，决定将用户信息按照上面的结构设计进行存储。<br>
随着应用的发展、需求发生了改变，或者随着时间的推移，又有了新的需求，可能要增加或删除表中的某些列。
<br>
然而，这样一个基础性问题，若要通过传统的 Sql 数据库来实现，从操作上和性能上来讲都需要耗费非常高的成本来修改表设计。
<br>
比如，在 Mysql 中，每一次修改表的设计结构，都需要运行如下这个命令才能实现添加新的列：
```bash
$ mysql
> alert table profiles and column ...
```

在 MongDB 中，则可将数据都看做文档，其设计非常灵活。当有数据存储后，这些文档就会以一种非常接近（json 格式）的格式存储：
```json
{
  "name": "Guillermo",
  "last": "Rauch",
  "email": "rauchg@gmail.com",
  "age": 21,
  "twitter": "rauchg"
}
```

MongDB 还有一个非常重要的特性，能够将其与其他“键-值”形式的 NoSql 数据库区分开，这就是文档可以是任意深度的。

<br>
例如，可以将社交信息如下结果进行存储，而不是全都将它们直接作为文档的键来存储：

```json
{
  "name": "Guillermo",
  "last": "Rauch",
  "email": "rauchg@gmail.com",
  "age": 21,
  "social_networks": {
    "twitter": "rauchg",
    "facebook": "rauchg@gmail.com",
    "linkedin": 27760647
  }
}
```

#### 使用 MongoDB：一个用户认证的例子

通过 Node.js 操作 MongoDB 文档数据最主要的方式就是通过驱动器（driver）。通常在 Node.js 中驱动器指的就是一些基本的 API，它懂得数据库网络层协议和其通信，并知道如何编码和解码存储的数据。
<br>
示例中使用的驱动是 node-mongodb-native。

见代码：user-auth-example


#### 校验

如示例 user-auth-example

>? 示例中如果没有校验，用户提交的表单太大，该怎么办？直接向数据库中存储吗？
<br>
>? 那我们如何在登录表单数据中进行校验呢


Mongoose 允许在应用层定义 schema 来解决上述问题。它在保持文档灵活性和易改动的前提下，引入了特定的属性对其做了一定的约束，成为模型。

#### 原子性

假设我们基于 Express 和 MongoDB 书写了一个博客引擎。可想而知，其中一部分功能会是允许用户修改博文的标题和内容，可能还有一部分是允许编辑、删除标签。
<br>
面向文档设计的 MongoDB 非常适合这样的场景。在 posts 集合中，文档可能会是这样的：

```json
{
  "title": "I just bought Smashing Node.Js",
  "author": "John Ward",
  "content": "I went to the bookstore and picked up...",
  "tags": ["node.js", "learning", "book"]
}
```

假设这个时候，有两个人，一个更新标题，一个添加标签。则需要确保操作的原子性。

```js
db.blogposts.update({ _id: <id> }, { $set: { title: 'new Title' }})
db.blogposts.update({ _id: <id> }, { tags: { $push: 'new tag' }})
```
Mongoose 则是通过检查要对文档做的修改，并只修改受影响的字段来解决这个问题。就算操作的是数组（包含文档数组），原子性依然能够保证。

#### 安全模式

使用驱动时，允许添加一个可选的 options 传参：

```js
app.users.insert({}, { <options> })
```

其中一个选项是 safe，它会对数据库进行修改时启动安全模式。
<br>
默认情况下，在操作完成后，如果有错误发生，MongoDB 不会及时通知你。驱动器需要在操作完成后进行一个特殊的函数调用 db.getLastError，来检查数据修改是否成功。

不及时通知异常的原因通常在于，某个操作是否失败，较速度而言不是那么重要。比如，丢了某些日志并不是什么大问题，但是导致性能下降则是大的问题。

Mongoose 默认会对所有操作启用安全模式。

## Mongoose

#### 介绍

在使用时，需要在 package.json 中定义依赖，然后通过 require 将其引入。

相比原生的驱动器，Mongoose 做的第一个简化的事情就是它假定绝大部分的应用程序都是用一个数据库，这大大简化了使用方式。
另外，使用 Mongoose，就无需关心链接是否需真的已经建立了，因为，它会先把数据库操作指令缓存起来，在连接上数据库后在把这些操作发送给 MongoDB。

#### 定义模型

模型是 Schema 类的简单实例。在指定字段时，简单的使用对应类型的 JavaScript 原生的结构选择器即可：

```js
var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var PostSchema = new Schema({
  author: ObjectId,
  title: { type: String, default: 'Jay' },
  body: String,
  date: Date
})
```

创建好 Schema 后，通过 mongoose 注册模型：
```js
var Post = mongoose.model('BlogPost', PostSchema)
```
随后想要获取模型，可以通过调用 mongoose.model 方法并提供模型名：
```js
var Post = mongoose.model('BlogPost')
```

操作模型：

```js
new Post({ title: 'My title' }).save(function (err) {
  console.log('that was easy!')
})
```

#### 定义嵌套的键

考虑到数据组织，有的时候以子结构的形式来组织键也很简单：
```js
var BlogPost = new Schema({
  author: ObjectId,
  title: String,
  body: String,
  meta: {
    votes: Number,
    favs: Number
  }
})
```

#### 定义嵌套文档

示例：
```js
var Comments = new Schema({
  title: String,
  body: String,
  date: Date
})

var BlogPost = new Schema({
  author: ObjectId,
  title: String,
  body: String,
  bug: Buffer,
  date: Date,
  comments: [Comments],
  meta: {
    votes: Number,
    favs: Number
  }
})

```

#### 构建索引

要对指定的键做索引，需要传递一个参数 index，并且设置为 true。

比如，要对 title 键做索引，并将 uid 键设置为唯一，可以这样：

```js
var BlogPost = new Schema({
  author: ObjectId,
  title: { type: String, index: true },
  uid: { type: String, unique: true }
})
```
或：
```js
BlogPost.index({ key: -1, otherKey: 1 })
```

#### 中间件

Mongoose 中间件的工作方式和 Express 中间件非常相似。你可以定义一些方法，在某些特定动作前执行： save 和 remove。

比如，要在博文删除时，发送电子邮件给作者，可以通过以下方式：
```js
Blogpost.pre('remove', function (next) {
  emailAuthor(this.email, 'Blog post removed!')
  next()
})
```

#### 探测模型状态

很多时候，我们需要根据要对当前模型做的不同更改进行不同的操作：
```js
Blogpost.pre('save', function (next) {
  if (this.isNew) {
    // do
  } else {
    // do other
  }
})
```

#### 查询

在 Model 实力上暴露的所有常见操作有：

- find
- findOne
- remove
- update
- count

Mongoose 还添加了 findById，该方法接收一个 ObjectId 去匹配文档的 _id 属性。

#### 扩展查询

如果查询不提供回调，那么知道调用 run 它才会执行：
```js
Post.find({ author: 'xxx' })
  .where('title', 'My title')
  .sort('content', -1)
  .limit(5)
  .run(function (err, post) {
    // ...
  })
```

#### 排序

#### 选择

#### 限制

#### 跳过

要跳过指定数量的文档数据，
```js
query.skip(10)
```

这个功能结合 Model#count 做分页很有用：
```js
Post.count(function (err, totalPosts) {
  var numPages = Math.ceil(totalPost / 10)
})
```

#### 自动产生建

