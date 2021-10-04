/**
    GET /path?foo=bar HTTP/1.1
    
    HTTP_Parse 将其解析成 req.url。一般而言，完整的 url 格式如下：
    http://user:pass@host.com:8080/p/a/t/h?query=string#hash

 */

// 场景一：根据路径查找文件的示例代码
function f(req, res) {
    var pathname = url.parse(req.url).pathname;
    fs.readFile(path.json(__dirname, pathname), function (err, file) {
        if (err) {
            res.writeHead(404);
            res.end('Not find');
            return;
        }
        res.writeHead(200);
        res.end(file);
    })
}

// 场景二：根据路径来选择对应的控制器，请求的预设为控制器和行为的组合，例如：/controller/action/a/b/c
function f(req, res) {
    var pathname = url.parse(req.url).pathname;
    var paths = pathname.split('/');
    var controller = paths[1] || 'index';
    var action = paths[2] || 'index';
    var args = paths.slice(3);
    
    if (handles[controller] && handles[controller][action]) {
        handles[controller][action].apply(null, [req, res].concat(args));
    } else {
        res.writeHead(500);
        res.end('no action.')
    }
}

// 对应业务代码
handles.index = {
    index: (req, res, foo, bar) => {
        res.writeHead(200);
        res.end(foo);
    },
    add: () => {}
};
