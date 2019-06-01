## Web 开发

#### Connect

Connect 是一个基于 HTTP 服务器的工具集，它提供了一种新的组织代码的方式来与请求、响应对象进行交互，成为中间件（middleware）。

<br>
为了证明通过中间件进行代码复用的好处，假设我们有一个站点，其目录结构如下所示：

```shell
$ ls website
index.html  images/
```

在 images 目录下有四张图片

```shell
$ ls images
1.jpg 2.jpg 3.jpg 4.jpg
```

本示例将以原生的 http api 书写简单的网站，再使用 Connect 来完成同样的事情

#### 使用 HTTP 构建一个简单的网站

见代码 my-website-http

#### 通过 Connect 实现一个简单的网站

基于 http 模块 API 之上的 Connect，提供了一些工具方法能够让这些重复性的处理便于实现，以至于开发者能够专注在应用本身。它很好的体现了 DRY 模式：**不要重复自己（Don't Repeat Yourself）**

<br>
见代码 my-websit-connect

#### 中间件

简单来说，中间件由函数组成，它除了处理 req 和 res 对象之外，还接收一个 next 函数来做流控制。
<br>
```js
server.use(function (req, res, next) {
  // 记录日志
  console.error(' %s  %s  ', req.method, req.url)
  next()
})

server.use(function (req, res, next) {
  if ('GET' == req.method && '/images' == req.url.substr(0, 7)) {
    // 托管图片
  } else {
    // 交给其他的中间件处理
    next()
  }
})
```

使用中间件，能够使代码有更强的表达能力（将应用拆分为更小单元的能力）。
<br>
Connect 已经提供了常见的中间件。


#### 书写可重用的中间件

见 my-websit-connect 目录下的 request-time.js 

#### static 中间件

- **挂载**

Connect 允许中间件挂载到 URL 上。比如 static 允许将任意一个 URL 匹配到文件系统中任意一个目录。
<br>
举个栗子，假设要让 /my-images URL 和名为 /images 的目录对应起来，可以通过如下挂载方式：<br>
```js
server.use('/my-images', connect.static('/path/to/images'))
```

- **maxAge**

static 中间件，接收一个名为 maxAge 的选项，代表一个资源在客户端缓存的时间。<br>
比如，一种 Web 应用常见的实践方式就是将所有的客户端 JavaScript 文件都合并到一个文件中，并在其文件名中加上修订号。

```js
server.use('/js', connect.static('/path/to/bundles', { maxAge: 10000000000000 }))
```


- **hidden**

static 选项 hidden，如果设置 true，Connect 就会托管那些文件名以点（.）开始的在 UNIX 文件系统中被认为是隐藏的文件。

```js
server.use(connect.static('/path/to/resources', { hidden: true }))
```


#### query 中间件

有时候发送服务器的请求中携带参数，比如，url /blog-posts?page=5. 当浏览器中访问该 URL 时，Node 会以字符串的形式将该 URL 存储到 req.url 中
```js
server.use(function(req) {
  // req.url == "/blog-posts?page=5"
})
```

使用 query 中间件，能够通过 req.query 对象自动获取这些数据：
```js
server.use(connect.query)
server.use(function (req) {
  // req.query.page == 5
})
```

> query 中间件在 Express 中默认就是开启的，Express 是一个Web 框架，稍后会介绍


#### logger 中间件

logger 中间件，提供四种日志格式：
- default
- dev
- short
- tiny

使用方式：```server.use(connect.logger('dev'))```

<br>

logger 中间件允许自定义日志输出格式，比如，只想记录请求方法和 IP 地址：
```server.use(connect.log(':method :remote-addr'))```
<br>
另外，还可以通过动态的 req 和 res 来记录头信息。要记录响应的 conntent-length 和 content-type 信息，可以通过如下方式：
```js
server.use(connect.logger('type is :res[content-type], length is ' + ':res[content-length] and it took :response-time ms.'))
```

> 注意，在 node 中，请求/响应头都是小写的。

完整的可用 token：

- :req[header] （如 :req[Accept]）
- :res[header] （如 :res[Content-Lenght]）
- :http-version
- :response-time
- :remote-addr
- :date
- :method
- :url
- :referrer
- :user-agent
- :status


#### body parser 中间件

在一个使用 http 模块的例子中，我们用了 qs 模块来解析 POST 请求的消息体。
<br>
Connect 提供了 bodyParser 中间件：
```js
server.use(connect.bodyParser)

server.use(function (req, res) {
  // req.body.myinput
})
```
如果客户端在 POST 请求中使用了 JSON 格式，那么 req.body 也会对应的转换为 JSON 对象，因为 bodyParser 会检测 Content-Type 的值。

 - **处理上传**

bodyParser 另外一个功能就是使用 formidable 模块，它可以让你处理用户上传的文件。我们可以使用 createServer 的快捷方式来创建一个服务器，并将所有要用的中间件都传递给它：
```js
var server = connect(
  connect.bodyParser()
  , connect.static('static')
)
```

> api 好像已废弃

<br>

- **cookie**

当浏览器发送 cookie 时，会将信息写入 Cookie 头信息中。其数据格式和 URL 中的查询字符串类似。看如下头信息：
<br>
```
GET /secret HTTP/1.1
Host: www.mywebsite.org
Cookie: secret1=value; secret2=value2
Accept: */*
```

要访问这些值（secret1 和 secret2），可以使用 cookieParser 中间件:
```js
server.use(connect.cookieParser())

server.use(function (req, res, next) {
  // req.cookies.secret1 == "value"
  // req.cookies.secret2 == "value2"
})
```

- **session**

在大多数 Web 应用中，多个请求共享“用户回会话” 的概念是非常必要的。“登录” 一个网站时，多多稍稍要使用会话系统，它主要是通过在浏览器中设置 cookie 来实现，该 cookie 信息会在随后的所有请求头信息中被带回到服务器。
<br>
Connect 为此也提供了简单的实现方式。作为例子，我们创建一个简单的登录系统，把用户凭证信息存放在一个名为 users.json 的文件中：
```json
{
  "tobi": {
    "password": "ferret",
    "name": "Tobi Holowaychuk"
  }
}
```

见代码 session-example.js
<br>

为了让 session 能够在生产环境中也正常工作，我们需要学习如何通过 Redis 来实现一个持久化的 session。

#### Redis session

之前的登录示例，尝试一件事情：登录后，重启node 服务器，然后刷新浏览器。注意到没，session 丢失了！
<br>
原因在于 session 的默认存储方式是内存。这就意味着 session 数据都是存储在内存中的，当进程退出后，session 数据自然而然就丢失了。
<br>
Redis 是一个既小又快的数据库，有个一 connect-redis 模块使用 Redis 来持久化 session 数据，这样就让 session 驻扎到 Node 进程之外。
<br>
通过如下方式（必须先装好redis）：
```js
var connect = require('connect')
  , RedisStore = require('connect-redis')(connect)
```

然后，将其作为 store 选项的值传递给 session 中间件：
```js
server.use(connect.session({ store: new RedisStore, secret: 'my secret' }))
```

完成！现在 session 已经脱离 Node 进程了。

#### methodOverride 中间件

一些比较早的浏览器并不支持创建如 PUT, DELETE, PATCH 这样的请求（如 Ajax）。常见的解决方案就是在 GET 或者 POST 请求上添加一个 _method 变量来模拟上述请求。
<br>
举个栗子，
```
POST /url?_method=PUT HTTP/1.1
```

为了让后台的处理程序能够觉得这是一个 PUT 请求，可以使用 methodOverride 中间件：
```js
server.use(connect.methodOverride())
```

这里要记住，中间件是串行执行的，所以务必要确保把它放在其他处理请求中间件之前。

#### basicAuth 中间件

