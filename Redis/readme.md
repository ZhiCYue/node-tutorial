## Redis

Redis 是一种数据库，像一台结构化的数据服务器，从定义上讲，较 Mysql 更接近 MongoDB。

支持类型：
- 字符串 string
- 列表 list
- 数据集 set
- 哈希 hash
- 有序数据集 sorted set

Redis 和 MongoDB 最显著的区别是，Redis 中的文档结构总是扁平的。举例来说，即使一个键包含类似哈希的 JavaScript 对象，却不能包含像 MongoDB 支持的那种嵌套结构。

另一个不同点在于持久化数据的方式。Redis 设计的初衷是内存存储，搭配可配置的磁盘持久化思路，所以速度很快。有一点很重要，就是：持久化到磁盘是很重要的。

总的来说，你可以把 Redis 看做是简单、庞大、扁平（键-值）的 JavaScript 对象，其中值可以是特殊的数据类型（哈希、数据集、字符串等），它是为告诉读写数据孕育而生的。

## 安装

略

## 数据类型

Redis 简单的设计带来的最基本的好处之一就是开发者很容易地预测出性能。数据库并不是一个黑盒，而是一个简单的进程，它将某些已知的数据结构存储到内存中，让其他程序通过简单的协议就能够获取到。

HEXISTS 命令的时间复杂度是 O(1)，也就是固定的时长。这意味着，不管数据集有多大，执行 HEXISTS 命令总是需要这些时间。

如果查看 SMEMBERS，就会发现它的时间复杂度是 O(n), 也就是线性的时长，所需时间是随着数据集的大小而改变的。这就意味着 Redis 完成该指令所需的时间直接取决于数据有多少的量。

由于 Redis 的对象模型大致就是一个大的扁平的 JSON 对象，所有，理解不同数据类型最简单的方法就是把它们想象成 JavaScript 中的数据类型。

#### 字符串

字符串类似 Js 中的 Number 和 String。
除了使用 SET 和 GET 外，还可以对数字进行递增、递减：
```js
redis 127.0.0.1:6379> SET online.users 0
OK
redis 127.0.0.1:6379> INCR online.users
(integer) 1
redis 127.0.0.1:6379> INCR online.users
(integer) 2
```

#### 哈希

在 Redis 中，哈希类似于对象。不过和 MongoDB 不同的是，这些子对象只能局限于字符串形式的键值。

要在 Redis 中存储如下信息：
```json
{
  "name": "Guillermo",
  "last": "Rauch",
  "age": "21"
}
```

由于键和值都是字符串（或者数字），所以，用哈希来描述这种数据结构最合适不过了。

要存储用户信息，我们需要将用户 ID 作为键的一部分来唯一确定存储的值。Redis 数据库存储的数据如下所示：

```
{
  "profile:1": { "name": "Guillermo", "last": "Rauch", ... },
  "profile:2": { "name": "Tobi", "last": "Rauch", ... }
}
```

操作哈希的基本命令是 HSET：
```js
redis 127.0.0.1:6379> HSET profile.1 name Guillermo
(integer) 1
```

这个命令等于在 js 中设置了一个键：
```js
obj['profile.1'].name = "Guillermo"
```

要获取一个指定哈希中所有的键和值，可以使用 HGETALL，并提供一个键名：
```bash
redis 127.0.0.1:6379> HGETALL profile.1
1) "name"
2) "Guillermo"
```

Redis 会返回一个包含了修改过的键和值的列表：
```bash
redis 127.0.0.1:6379> HSET profile.1 last Rauch
(integer) 1
redis 127.0.0.1:6379> HGETALL profile.1
1) "name"
2) "Guillermo"
3) "last"
4) "Rauch"
```

要在哈希中删除一个键，可以调用 HDEL：
```bash
redis 127.0.0.1:6379> HSET profile.1 programmer 1
(integer) 1
redis 127.0.0.1:6379> HGETALL profile.1
1) "name"
2) "Guillermo"
3) "last"
4) "Rauch"
5) "programmer"
6) "1"
redis 127.0.0.1:6379> HDEL profile.1 programmer
(integer) 1
redis 127.0.0.1:6379> HGETALL profile.1
1) "name"
2) "Guillermo"
3) "last"
4) "Rauch"
```

还可以使用 HEXISTS 来检查指定的字段是否存在：
```bash
redis 127.0.0.1:6379> HEXISTS profile.1 programmer
(integer) 0
```

#### 列表

Redis 中的列表类似于 js 中的字符串数组。

对于列表，在 Redis 中有两个基本的操作命令是 RPUSH （push 到右侧，也就是列表的尾端）和 LPUSH（push 到左侧，也就是列表的顶端）。

操作列表和操作哈希类似：
```bash
redis 127.0.0.1:6379> RPUSH profile.1.jobs "job 1"
(integer) 1
redis 127.0.0.1:6379> RPUSH profile.1.jobs "job 2"
(integer) 2
```

然后可以获取指定返回的数组：
```bash
redis 127.0.0.1:6379> LRANGE profile.1.jobs 0 -1
1) "job 1"
2) "job 2"
```

LPUSH 类似：
```bash
redis 127.0.0.1:6379> LPUSH profile.1.jobs "job 0"
(integer) 1
redis 127.0.0.1:6379> LRANGE profile.1.jobs 0 -1
1) "job 0"
2) "job 1"
3) "job 2"
```

RPUSH 等同于 js 中数组的 push；LPUSH 等同于 js 中数组的 unshift；

LRANGE 命令返回一个在列表中指定范围的元素。它和 js 中数组的 slice 类似但不完全一样。特别是，当第二个参数是 -1 时，它会返回列表中所有的值。


#### 数据集

数据集处于列表和哈希之间。它拥有哈希的属性，即数据集中的每一项（或者哈希中的键）都是唯一不重复的。

不像哈希但类似列表的是，数据集保存的是单个值（字符串），没有键。不过，数据集还有它专属的有意思的特性。Redis 允许在数据集、联合（union）、获取到的随机元素等之间做交集操作。

要添加一个元素到数据集，可以使用 SADD：
```bash
redis 127.0.0.1:6379> SADD myset "a member"
(integer) 1
```

获取数据集的所有元素，可以使用 SMEMBERS：
```bash
redis 127.0.0.1:6379> SMEMBERS myset
1) "a member"
```

以相同值再次调用 SADD 不会发生任何事情：
```bash
redis 127.0.0.1:6379> SADD myset "a member"
(integer) 0
redis 127.0.0.1:6379> SMEMBERS myset
1) "a member"
```

移除数据集中的某个元素，可以使用 SREM：
```bash
redis 127.0.0.1:6379> SREM myset "a member"
(integer) 1
```


#### 有序数据集

Redis 中使用有序数据集的场景比较少，属于高级用法。

