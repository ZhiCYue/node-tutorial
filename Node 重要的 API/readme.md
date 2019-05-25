## Node 重要的 API

Node 中的一些重量级 API： 处理进程（stdio）的stdin 以及stdout，还有文件系统相关。

> fs 模块是唯一一个同时提供同步和异步 API 的模块。

process 全局对象中包含三个流对象，分别对应三个 UNIX 标准流：
- **stdin** ： 标准输入
- **stdout** ： 标准输出
- **stderr** ： 标准错误

除非有 IO 等待，否则 Node 总是会自动退出。


#### file-explorer

见示例代码

#### argv

process.argv 包含了所有 Node 程序运行时的参数值：

```sh
# example.js
console.log(process.argv);
```
第一个始终是node，第二个元素始终是执行的文件路径。紧接着是命令行后紧跟着的参数。

```sh
# example-2.js
console.log(process.argv.slice(2));
```

#### 工作目录

process.cwd();

#### 环境变量

Node 允许通过 process.env 变量来轻松访问 shell 环境下的变量。

```js
NODE_ENV="production" node
> process.env.NODE_ENV
'production'
> process.env.SHELL
'/bin/zsh'
```


#### 退出

process.exit(1);

#### 信号

[https://nodejs.org/api/dns.html](https://nodejs.org/api/dns.html)

#### ANSI 转移码

[http://en.wikipedia.org/wiki/ansi_escape_code](http://en.wikipedia.org/wiki/ansi_escape_code)

#### Stream

fs 模块允许你通过 Stream Api 来对数据进行读写操作。与 readFile 和 writeFile 不同，它对内存的分配不是一次完成的。

> 比如，考虑这样一个例子，有一个大文件，文件内容有上百个万行逗号分隔文本组成。要完整的读取该文件进行解析，意味着要一次性分配很大的内存。
> 更好的方法是一次只读取一块内容，一行尾结束符（“\n”）来切分，然后进行解析。

fs.createReadStream 方法允许为一个文件创建一个可读的 Stream 对象。

举个栗子：

```js
fs.readFile('my-file.txt', function(err, content){
  // 对文件处理
})
```
上述代码中，回调函数必须要等到整个文件读取完毕、载入到 RAM、可用的情况下触发。
<br>
而下面的例子，每次会读取可变大小的内容块，并且每次读取后会触发回调函数：
```js
var stream = fs.createReadStream('my-file.txt')
stream.on('data', function (chunk) {
  // 处理文件
})
stream.on('end', function (chunk) {
  // 文件读取完毕
})
```

#### 监视

Node 允许监视文件或目录是否发生变化。比如监视sass 文件的变动，自动重新编译为css。
<br>示例见代码。
<br>除了 fs.watchFile 之外，还可以使用 fs.watch 来监视某个目录。