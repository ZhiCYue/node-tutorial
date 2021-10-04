/**
    Cookie 的处理分为如下几步：
        1. 服务器向客户端发送 cookie
        2. 浏览器将 cookie 保存
        3. 之后请求，浏览器发请求会携带 cookie

    通过 curl 工具模拟，代码如下：

    curl -v -H "Cookie: foo=bar; baz=val" "http://127.0.0.1:1337/path?foo=bar&foo=baz"

    HTTP_Parse 会将所有请求头字段解析到 req.headers 上，因此可以通过 req.headers.cookie 拿到

 */

// 解析 cookie 的代码
var parseCookie = function (cookie) {
    var cookies = {};
    if (!cookie) {
        return cookies;
    }

    var list = cookie.split(';');
    for (var i=0; i<list.length; i++) {
        var pair = list[i].split('=');
        cookies[pair[0].trim()] = pair[1];
    }

    return cookies;
}

// 业务代码
function f(req, res) {
    req.cookies = parseCookie(req.headers.cookie);
    handle(req, res);
}

var handle = function (req, res) {
    res.writeHead(200);
    if (!req.cookies.isVisit) {
        res.setHeader('Set-Cookie', serialize('isVisite', '1'));
        res.setHeader(200);
        res.end('欢迎第一次来到');
    } else {
        // TODO
        res.setHeader(200);
        res.end('再次欢迎')
    }
}


/**
    响应的 cookie 值在 Set-Cookie 字段中

    格式如下：

    Set-Cookie: name=value; Path=/; Expires=Sun, 23-Apr-23 09:00:22 GMT; Domain=.domain.com

    其中 name=value 必须包含的部分，其余都是可选的

    -- Secure: 当 Secure 值为 true 时，在 HTTP 中是无效的，在 HTTPS 中才有效。
 */

// Cookie 序列化相关代码
var serialize = function (name, val, opt) {
    var pairs = [name + '=' + encode(val)];
    opt = opt || {};

    if (opt.maxAge) pairs.push('Max-Age=' + opt.maxAge);
    if (opt.domain) pairs.push('Domain=' + opt.domain);
    if (opt.path) pairs.push('Path=' + opt.path);
    if (opt.expires) pairs.push('Expires=' + opt.expires.toUTCString());
    if (opt.secure) pairs.push('Secure');

    return pairs.join('; ');
}
