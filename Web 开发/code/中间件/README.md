## 中间件

一个中间件会是如下形式：
```js
var middleware = function (req, res, next) {
    // TODO

    next();
}
```

有了中间件，我们就可以把具体的业务逻辑串联起来，如下所示：
```js
app.use('/user/:username', querystring, cookie, session, function(req, res) {
    // TODO
});

// querystring 解析中间件
var querystring = function (req, res, next) {
    req.query = url.parse(req.url, true).query;
    next();
}

// cookie 解析中间件
var cookie = function (req, res, next) {
    var cookie = req.headers.cookie;
    var cookies = {};
    if (cookie) {
        var list = cookie.split(';');
        for (var i=0; i<list.length; i++) {
            var pair = list[i].split('=');
            cookies[pair[0].trim()] = pair[1];
        }
    }

    req.cookies = cookies;
    next();
}

```

改进“路由解析” 中的 use 方法：
```js
app.use = function (path) {
    var handle = {
        path: pathRegexp(path),
        stack: Array.prototype.slice.call(arguments, 1);
    };
    routes.all.push(handle);
}

var match = function (pathname, routes) {
    for (var i=0; i<routes.length; i++) {
        var route = routes[i];
        var reg = route.path.regexp;
        var matched = reg.exec(pathname);
        if (matched) {
            handle(req, res, route.stack);
            return true;
        }
    }
    return false;
}

var handle = function (req, res, stack) {
    var next = function () {
        var middleware = stack.shift();
        if (middleware) {
            middleware(req, res, next);
        }
    }

    // 启动执行
    next();
}
```

设置路由的代码：
```js
app.get('/user/:username', querystring, cookie, session, () => {
    // add
});
app.get('/user/:username', querystring, cookie, session, () => {
    // update
});
```


可以通过改进代码，使得上述写法更加简洁：
```js
app.use(querystring);
app.use(cookie);
app.use(session);
app.get('/use/:username', () => {/* add */})
app.get('/use/:username', () => {/* update */})
```

改进后的代码如下：
```js
app.use = function (path) {
    var handle;
    if (typeof path === 'string') {
        handle = {
            path: pathRegexp(path),
            stack: Array.prototype.slice.call(arguments, 1)
        };
    } else {
        handle = {
            path: pathRegexp('/'),
            stack: Array.prototype.slice.call(arguments, 0)
        }
    }
    routes.all.push(handle);
}

var match = function (pathname, routes) {
    var stacks = [];
    for (var i=0; i<routes.length; i++) {
        var route = routes[i];
        var reg = route.path.regexp;
        var matched = reg.exec(pathname);
        if (matched) {
            stacks = stacks.concat(route.stack);
        }
    }
    return stacks;
}

function f(req, res) {
    var pathname = url.parse(req.url).pathname;
    var method = req.method.toLowerCase();
    var stacks = match(pathname, routes.all);
    if (routes.hasOwnProperty(method)) {
        stacks.concat(match(pathname, routes[method]));
    }

    if (stacks.length) {
        handle(req, res, stacks);
    } else {
        handle404(req, res);
    }
}
```