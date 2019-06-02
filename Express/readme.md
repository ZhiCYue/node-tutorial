## Express

鉴于 Connect 基于 Http 模块提供了开发 Web 应用常用的基础功能， Express 基于 Connect 为构建整个网站以及 Web 应用提供了更为方便的 Api。
<br>

Express 基于 Connect 构建而成，因此，它也保持了重用中间件来完成基础任务的想法。

#### 一个小型的 Express 应用

应用虽小但五脏俱全。用户通过查询关键词查询“推文”时，需要返回包含查询结果的 HTML 页面。

/views/index.ejs     提供一个入口让用户提交搜索推文的关键字
/views/search.ejs    用于展示查询结果

Express 支持的方法有 get、put、post、del、patch 以及 head，分别对应 Http 中的 GET、PUT、POST、DELETE、PATCH 以及 HEAD。
<br>
下面是定义路由的例子：
```js
app.get('/', function (req, res, next) {})
app.put('/post/:name', function (req, res, next) {})
app.post('/signup', function (req, res, next) {})
app.del('/user/:id', function (req, res, next) {})
app.patch('/user/:id', function (req, res, next) {})
app.head('/user/:id', function (req, res, next) {})
```

第一个参数是路由，第二个参数是路由处理程序，和中间件一样。
<br>
Express 为 response 提供了 render 方法，该方法完成如下三件事：
- 初始化模板引擎
- 读取视图文件并将其传递给模板引擎
- 获取解析后的 HTML 页面并作为响应发送给客户端

#### 设置

在生产环境下，为了提高性能，可以让 express 将模板缓存起来，以加快响应速度。然而，若在开发环境下开启这个功能，每次对模板稍作改动就需要重新启动 Node 服务才能生效。
<br>
通过如下方式可以达到 Express 对模板进行缓存：
```js
app.configure('production', function () {
  app.enable('view cache')
})
```
```app.enable('view cache')``` 等同于 ```app.set('view cache', true)```

当环境变量 NODE_ENV 设置为 production 时，我们在 app.configure 定义的回调函数才会执行。
<br>
运行代码：
```bash
$ NODE_ENV=production node server
```
若是 NODE_ENV 没有设置，则默认会调用 development 的配置：
```js
app.configure('development', function () {
  // ...
})
```
下面是一些实用的内置设置：
- 大小写敏感
- 严格路由
- jsonp 回调： 启用 res.send() / res.json() 对 jsonp 的支持。JSONP 是一项解决跨域 JSON 请求的技术，它将相应结果包裹在一个用户指定的回调函数中。
- 当有 JSONP 请求时，其 URL 类似这样：/my/route?callback=myCallback。Express 会自动检测 callback 参数，并将相应结果包裹在 myCallback 文本中。要启用该功能，可以调用 ```app.enable('jsonp callback')```。这里要注意，这只作用于 res.send() 和 res.json() 。

#### 模板引擎

使用ejs 引擎，必须完成以下两个步骤：
- 通过 npm 安装 ejs 模块
- 声明 view engine 为 ejs

除了 ejs ，还可以使用其他的模板引擎：
- Haml
- Jade
- CoffeeKup
- jQuery Templates for node

Express 会试着以模板文件扩展名，或者以配置的 view engine 的值为名，去调用 require 方法。
<br>
比如，调用：
```js
res.render('index.html')
```

这时，Express 会尝试去 require html 引擎。找不到引擎，就会报错。
<br>
也可以通过 app.register API 将扩展名匹配到指定的模板引擎。比如：
```js
app.register('.html', require('jade'))
```

>Jade 是最流行的模板语言之一。值得学习。

#### 错误处理

当调用 next 并且对应的处理器无法找到时，默认的 Express 错误处理器就会触发。

#### 快捷方法

Express 为 Node 中的 Request 和 Response 对象提供了一系列扩展来简化开发。
<br>
Request 扩展如下：
<br>
- header 
<br>
此扩展让程序以函数的方式获取头信息，并且还是大小写不敏感。
>```js
>req.header('Host')
>req.header('host')
>```

- accepts
<br>
分析请求总的 Accept 头信息，并根据提供的值返回 true 或者 false。
>```js
>req.accepts('html')
>req.accepts('text/html')
>```

- is
<br>
和 accept 类似，它检查 Content-Type 头信息。
>```js
>req.is('json')
>req.is('text/html')
>```


Response 扩展如下：

- header 
<br>
此扩展接收一个参数来检查对应的头信息是否已经在 response 上设置了，或者两个参数进行设置。
>```js
>res.header('content-type')
>res.header('content-type', 'application/json')
>```

- render
<br>
之前的示例中我们传递了 status 值。这是一个特殊的类型，设置了它就等于为 response 响应对象设置了状态码。
<br>
除此之外，还可以提供第三个参数给 render 方法来获取 HTML 内容而不是直接将其作为响应消息自动传递出去。
>```js
>res.render('template', function (err, html) {
>   // 处理收到的 html
>})
>```

- send 
<br>
该扩展会根据参数的类型执行响应的行为。
  - Number: 
    <br>发送状态码
    ```js
    res.send(500)
    ```
    <br>
  - String:
    <br>发送 HTML 内容
    ```js
    res.send('<p>html</p>')
    ```
  - Object/Array:
    <br>序列化成 JSON 对象，并设置相应的 Content-Type 头信息。
    ```js
    res.send({ hello: 'world' });
    res.send([1, 2, 3])
    ```
  - Json:
    <br>显示地将内容作为 JSON 对象发送。
    ```js
    res.json(5)
    ```
    <br>
    在发送值未知的情况下可以使用该方法。```res.send``` 会判断发送值的类型，并且依据判断结果来选择是否调用 JSON.stringify 方法。如果是数字类型，那么会认为发送的是状态码，并直接结束响应。而 res.json 会把数字类型也进行 JSON.stringify 转换。
  - redirect:
    <br>redirect 等效于发送 302（暂时移除）状态码以及 Location 头信息。如下所示：
    ```js
    res.redirect('/some/other/url')
    ```
    等效于：
    ```js
    res.header('Location', '/some/other/url')
    res.send(302)
    ```
    上述代码在 Node.js 内部其实是这样处理的：
    ```js
    res.writeHead(302, { 'Location': '/some/other/url' })
    ```
  - redirect 还可以接收自定义的状态码作为第二个参数。假设你不想发送 302 而是发送表示永    久性移除的 301 状态码，可以采取如下方式：
    ```js
    res.redirect('/some/other/url', 301)
    ```
  - sendfile
    <br>此扩展和 Connect 中的 static 中间件类似，不同之处在于它用于单个文件。
    ```js
    res.sendfile('image.jpg')
    ```



#### 路由

在使用路由时，可以使用自定义参数：
```js
app.get('/post/:name', function () {
  // ...
})
```
上述代码中，name 变量值会注入到 req.params 对象上。比如，当通过浏览器访问```'/post/hello-world'``` 时，```req.params``` 对象会变为如下形式：
```js
app.get('/post/:name', function () {
  // req.params.name === 'hello-world'
})
```
还可以在变量后面添加问号（?）来表示变量是可选的。之前的示例，如果路由为 ```/post```，那么是不会匹配到的。如果要匹配可以变量后添加问号：
```js
app.get('/post/:name?', function () {
  // this will match for /post and /post/a-post-hear
})
```

像这样定义了路由参数，内部会当正则表达式处理。也就是说，定义路由时也可以直接使用 ```RegExp``` 对象。比如，只想匹配字母、数字以及中划线的话，可以这样：
```js
app.get(/^\/post\/([a-z\d\-]*)/, function () {
  // req.params contains the matches set by the RegExp capture groups.
})
```
和中间件一样，在路由处理程序中也可以使用 next。即使当一个路由匹配并得到处理，还是可以强制 Express 去继续匹配其他路由的。比如，让路由只接收以'h' 开头的参数：
```js
app.get('/post/:name', function (req, res, next) {
  if ('h' != req.params.name[0]) return next()
  // ...
})
```

#### 中间件

由于 Express 构建于 Connect 之上，所以，当创建 Express 服务器时可以使用 Connect 兼容的中间件。比如，要托管 images/ 目录下的图片，可以这样：
```js
app.use(express.static(__dirname + '/images'))
```
或者，要想使用 connect 的 session，也很容易，可以这样：
```js
app.use(express.cookieParser())
app.use(express.session())
```
注意了，在引入 Express 之后就可以直接使用 Connect 的中间件了。不需要```require('connect')``` 或者把 connect 作为项目依赖添加到 package.json 文件中。

<br>
中间件容易理解，更有意思的是，和全局中间件（针对每个请求）不同，Express 还允许只在特定匹配到的路由中才使用中间件。
<br>
举个栗子，你需要检查用户是否已经登录，并且这部分检查只在特定受保护的路由中进行。这个时候，就可以定义一个 secure 中间件，判断若  req.session.logged_in 不为 true 时就发送 403 Not Authorized 状态码。
<br>

```js
function secure (req, res, next) {
  if (!req.session.logged_in) {
    return res.send(403)
  }
  next()
}
```

然后将它应用到路由中：
```js
app.get('/home', function () {
  // accessible to everyone
})

app.get('/financials', secure, function () {
  // secure!
})

app.get('/about', function () {
  // accessible to everyone
})

app.get('/roadmap', secure, function () {
  // secure !
})
```

还可以为路由定义多个中间件：
```js
app.post('/route', a, b, c, function () { })
```

有的时候，在中间件中调用 next 就可以跳过该路由的其他中间件，这样 Express 就会紧接着在下一个路由中做相应处理。
<br>
比如，若相比发送 403，你更希望 Express 去检查其他的路由，那么就可以采用如下方式：

```js
function secure (req, res, next) {
  if (!req.session.logged_in) {
    return next('route')
  }

  next()
}
```
通过调用 ```next('route')```，就能够确保当前路由会被跳过。


#### 代码组织策略

对于任意一个 Node.js 应用（包括 Express Web 应用）来说，第一条准则都是模块化。Node.js 通过提供一个简单的 require API 来提供一个强大的代码组织策略。
<br>
比如，一个应用包含三块独立的内容：```/blog、/pages、/tags```。每块都包含各自的路由。例如：```/blog/search、/pages/list、/tags/cloud```。
<br>
好的代码组织方式应当是维护一个```server.js``` 文件，该文件中包含了路由表，同时将每一部分的路由处理器都通过模块化的方式引入，如 ```blog.js, pages.js, tags.js```。首先，定义依赖的模块并初始化 app，引入中间件等：
```js
var express = require('express')
  , blog = require('./blog')
  , pages = require('./pages')
  , tags = require('./tags')

// initialize app
var app = express.createServer()

// here you would include middleware, settings, etc
```
接着，定义路由表：
```js
// blog routes
app.get('/blog', blog.home)
app.get('/blog/search', blog.search)
app.get('/blog/create', blog.create)

// pages routes
app.get('/pages', pages.home)
app.get('/pages/list', pages.list)

// tags routes
app.get('/tags', tags.home)
app.get('/tags/search', tags.search)
```

然后，针对每个模块使用 exports 函数。以 blog.js 为例：
```js
exports.home = function (req, res, next) {
  // home
}

exports.search = function (req, res, next) {
  // search functionality
}
```
