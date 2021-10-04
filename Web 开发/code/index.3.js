/**
 * 场景一：基于 Cookie 实现用户和数据的映射
 */


// 生成 session 的代码
var sessions = {};

var key = 'session_uid';
var EXPIRES = 20 * 60 * 1000;

var generate = function () {
    var session = {};
    session.id = (new Date()).getTime() + Math.random();
    session.cookie = {
        expire: (new Date()).getTime() + EXPIRES
    }

    sessions[session.id] = session;
    return session;
}

// 请求到的时候，检查 Cookie 信息
function f(req, res) {
    var id = req.cookies[key];
    if (!id) {
        req.session = generate();
    } else {
        var session = sessions[id];
        if (session) {
            if (session.cookie.expire > (new Date()).getTime()) {
                // 更新超时时间
                session.cookie.expire = (new Date()).getTime() + EXPIRES;
                req.session = session;
            } else {
                // 超时了
                delete sessions[id];
                req.session = generate();
            }
        } else {
            // 口令不对
            req.session = generate();
        }
    }

    handle(req, res);
}

// 仅仅重新生成 session 还不足以完成整个流程，还需要在响应给客户端时设置新的值
var writeHead = res.writeHead;
res.writeHead = function () {
    var cookies = res.getHeader('Set-Cookie');
    var session = serialize(key, req.session.id);
    cookies = Array.isArray(cookies) ? cookies.concat(session) : [cookies, session];
    res.setHeader('Set-Cookie', cookies);
    return writeHead.apply(this, arguments);
}

// 至此，session 在前后端进行对应的过程完成了

var handle = function (req, res) {
    if (!req.session.isVisit) {
        req.session.isVisit = true;
        res.writeHead(200);
        res.end('欢迎第一次');
    } else {
        res.writeHead(200);
        res.end('再次欢迎');
    }
}