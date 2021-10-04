/**
    
    RESTfull

    过去我们的请求通常是如下方式来实现数据的增删改查的：
    
    POST /user/add?username=jack
    GET /user/remove?username=jack
    POST /user/update?username=jack
    GET /user/get?username=jack

    在 RESTful 的设计中，对应的是这样的：（即通过请求方法来区分业务）

    POST /user/jack
    DELETE /user/jack
    PUT /user/jack
    GET /user/jack

 */

var routes = { 'all': [] };

var app = {};

app.use = function (path, action) {
    routes.all.push([pathRegexp(path), action]);
}

['get', 'put', 'delete', 'post'].forEach(function (method) {
    routes[method] = [];
    app[method] = function (path, action) {
        routes[method].push([pathRegexp(path), action]);
    }
})

// 增加用户
app.post('/user/:username', () => {});
// 删除用户
app.delete('/user/:username', () => {});
// 修改用户
app.put('/user/:username', () => {});
// 查询用户
app.get('/user/:username', () => {});

// 匹配代码
var match = function (pathname, routes) {
    for (var i=0; i<routes.length; i++) {
        var route = routes[i];
        // 正则匹配
        var reg = route[0].regexp;
        var keys = route[0].keys;
        var matched = reg.exec(pathname);
        if (matched) {
            // 抽取具体值
            var params = {};
            for (var i=0, l=keys.length; i<l; i++) {
                var value = matched[i + 1];
                if (value) {
                    params[keys[i]] = value;
                }
            }
            req.params = params;

            var action = route[i];
            action(req, res);
            return true;
        }
    }
    return false;
}

// 分发代码
function f(req, res) {
    var pathname = url.parse(req.url).pathname;
    // 将请求方法变为小写
    var method = req.method.toLowerCase();
    if (routes.hasOwnProperty(method)) {
        // 根据请求方法分发
        if (match(pathname, routes.all)) {
            return;
        } else {
            // 如果路径没有匹配成功，尝试让all 来处理
            if (match(pathname, routes.all)) {
                return;
            }
        }
    } else {
        // 直接 all 处理
        if (match(pathname, routes.all)) {
            return;
        }
    }
    handle404(req, res);
}
