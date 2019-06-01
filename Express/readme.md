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

