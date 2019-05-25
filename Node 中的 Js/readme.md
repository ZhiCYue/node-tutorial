## Node 中的 JavaScript

#### Global 对象
- global
- process

#### 实用的全局对象

> setTimeout 并非 ECMAScript 的一部分，该函数是无法通过纯 Js 重写的。<br>
> 在 Node 环境中，setImmediate 的作用和 process.nextTick 相当。

process.nextTick 可以将一个函数的执行规划到下一个事件循环中。

#### 模块系统

Node 摒弃了采用定义一堆全局变量的方式，转而引入了一个简单的模块系统，该模块系统三大核心的全局对象：require、module 和 exports。

#### 绝对和相对模块

绝对模块是指 Node 通过在其内部 node_modules 查找到的模块；<br>
相对模块将 require 指向一个相对工作目录中的 JavaScript 文件。

#### 暴露 API

在默认情况下，每个模块都会暴露出一个空对象。如果你想要在改对象上添加属性，需要使用 exports。

> exports 实质上是 module.exports 的引用，在默认情况下是一个对象。要在该对象上逐个添加属性无法满足要求时，可以彻底重写 module.exports 。

#### 事件

Node 中的基础 API 之一就是 EventEmitter 。

如示例代码中所示，EventEmitter 相比 DOM 要简单些，Node 内部在使用，你也可以很容易地将其添加到自己的类中：
```js
var EventEmitter = process.EventEmitter
  , MyClass = function() {}

MyClass.prototype.__proto__ = EventEmitter.prototype
```
使用时，
```js
var a = new MyClass
a.on('myEvent', function(){
  // do ...
})
```

事件是 Node 非阻塞设计的重要体现。Node 通常不会直接返回数据，而是采用分发事件来传递数据的方式。<br>
以 HTTP 的 post 请求为例，当用户提交表单时，你通常会监听请求的 data 和 end 事件：
```js
http.server(function(req, res){
  var buf = '';
  req.on('data', function(data){
    buf += data;
  })
  req.on('end', function(){
    console.log('end')
  })
})
```

#### buffer

除了模块之外，Node 提供了对二进制数据处理的方式。<br>
buffer 是一个表示固定内存分配的全局对象，该功能一部分作用是可以对数据进行编码转换。比如，可以创建一幅用 base64 表示的图片，然后将其作为二进制 PNG 图片的形式写入文件：
```js
// buffers/index.js
var mybuffer = new Buffer('==ii1j2i3h1i23h', 'base64')
console.log(mybuffer)
require('fs').writeFile('logo.png', mybuffer)
```