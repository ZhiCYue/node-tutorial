## Buffer

启动server.js

然后执行命令：ab -n200 -c10 http://127.0.0.1:8001/

注释掉 
```js
helloworld = new Buffer(helloworld)
```

在此执行：ab -n200 -c10 http://127.0.0.1:8001/

比对结果。