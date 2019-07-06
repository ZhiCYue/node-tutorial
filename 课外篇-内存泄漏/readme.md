## 课外篇-内存泄漏

在 Node 中，由于 V8 的堆内存大小的限制，它对内存泄漏非常敏感。当在线服务的请求量变大时，哪怕一个字节的泄漏都会导致内存占用过高。

如下是一些常见的用于定位 Node 应用的内存泄漏的工具：
- v8-profiler （暂无维护）
- node-heapdump
- node-mtrace
- dtrace
- node-memwatch

#### node-heapdump 说明

想要了解 node-heapdump 对内存泄漏进行排查的方式，我们先构建如下一份包含内存泄漏的代码示例，并保存为 server.js 文件：
```js
var http = require('http')

var leakArray = []
var leak = function () {
  leakArray.push('leak' + Math.random())
}

http.createServer(function (req, res) {
  leak()
  res.writeHead(200, { 'Content-Type': 'text/plain' })
  res.end('Hello World\n')
}).listen(1337)

console.log('Server running at http://127.0.0.1:1337')

```

>安装 heapdump 模块（略）

启动服务，curl 多次访问 http://127.0.0.1:1337 后，可以执行如下命令：

```js
// 找到对应进程号
$ ps -ef | grep server.js
501 14278 13143   0  8:49上午 ttys003    0:00.10 node server.js

// 向服务进程发送SIGUSR2 信号
$ kill -USR2 14278

// 执行后当前目录下会生成一个日志文件 heapdump-xxx.heapsnapshot
```

生成的快照文件需要借助chrome 的开发者工具来查看。

#### node-memwatch 说明

安装之后，在node 代码开头加入下面代码：
```js
var memwatch = require('memwatch')
memwatch.on('leak', function(info){
  console.log('leak')
  console.log(info)
})
memwatch.on('stats', function(stats){
  console.log('stats:')
  console.log(stats)
})

// 其他代码
```

- stats 事件

在进程中使用了node-memwatch 之后，每次进行全堆垃圾回收时，将会触发一次stats 事件，这个事件会传递内存的统计信息。

```
stats: 
{
  num_full_gc: 4, // 第几次全堆垃圾回收
  num_inc_gc: 23, // 第几次增量垃圾回收
  heap_compactions: 4, // 第几次对老生代进行整理
  usage_trend: 0, // 使用趋势
  estimated_base: 7152944, // 预估基数
  current_base: 7152944,   // 当前基数
  min: 6720776,  // 最小
  max: 7152944   // 最大
}
```

- leak 事件

如果连续5 次垃圾回收后，内存仍然没有被释放，这意味着有内存泄漏的产生，node-memwatch会发出一个 leak 事件。

- 堆内存对比

参看 diff.js (暂未正常运行)