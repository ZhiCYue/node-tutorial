/**
 * CSRF 示例
 */


// 版本一：存在 CSRF 漏洞；（攻击代码示例，见：forgery.html）
function f(req, res) {
    var content = req.body.content || '';
    var username = req.session.username;
    var feedback = {
        username,
        content,
        updatedAt: Date.now()
    };

    db.save(feedback, function (err) {
        res.writeHead(200);
        res.end('OK');
    })
}



// 版本二：解决 CSRF 攻击方案
var generateRandom = function (len) {
    return crypto.randomBytes(Math.ceil(len * 3 / 4))
        .toString('base64')
        .slice(0, len);
}

var token = req.session._csrf || (req.session._csrf = generateRandom(24));
// 在页面渲染时，将 _csrf 值告知前端，如下示例：
/**
    <form id="test" method="POST" action="http://domain_a.com/guestbook">
        <input type="hidden" name="content" value="字符串" />
        <input type="hidden" name="_csrf" value="<%=_csrf%>" />
    </form>
 */

// 服务端增加校验逻辑
function f(req, res) {
    var token = req.session._csrf || (req.session._csrf = generateRandom(24));

    var _csrf = req.body._csrf;
    if (token !== _csrf) {
        res.writeHead(403);
        res.end('禁止访问');
    } else {
        handle(req, res);
    }
}

// _csrf 也可以在查询字段或者请求头中
