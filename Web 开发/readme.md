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

