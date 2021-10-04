/**
 * 场景二: 通过查询字符串实现浏览器和服务器数据的对应
 * 
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

//【原理】检查请求的查询字符串，如果没有值，先生成新的带值的 URL，代码如下：
var getURL = function (_url, key, value) {
    var obj = url.parse(_url, true);
    obj.query[key] = value;
    return url.format(obj);
}


// 然后形成跳转，让客户端重新发起请求，如下：
function f(req, res) {
    var redirect = function (url) {
        res.setHeader('Location', url);
        res.writeHeader(302);
        res.end();
    }

    var id = req.query[key];
    if (!id) {
        var session = generate();
        redirect(getURL(req.url, key, session.id));
    } else {
        var session = sessions[id];
        if (session) {
            if (session.cookie.expire > (new Date()).getTime()) {
                // 更新超时时间
                session.cookie.expire = (new Date()).getTime() + EXPIRES;
                req.session = session;
                handle(req, res);
            } else {
                // 超时了
                delete sessions[id];
                req.session = generate();
                redirect(getURL(req.url, key, session.id));
            }
        } else {
            // 如果 session 口令不对
            var session = generate();
            redirect(getURL(req.url, key, session.id));
        }
    }
}