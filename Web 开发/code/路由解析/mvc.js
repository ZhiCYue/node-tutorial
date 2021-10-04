/**
    手工映射

    手工映射除了需要手工配置路由外，对 URL 的要求十分灵活，几乎没有格式上的限制。如：

    /user/setting
    /setting/user

 */

// 【第一步】

// 假设已经有一个处理设置用户信息的控制器，如下：
exports.setting = function (req, res) {
    // TODO
}

// 再添加一个映射的方法，为了方便，这个方法名叫 use()，如下：
var routes = [];

var use = function (path, action) {
    routes.push([path, action]);
}

// 程序入口判断 URL，基本就完成了路由映射过程，如下：
function f(req, res) {
    var pathname = url.parse(req.url).pathname;
    for (var i=0; i<routes.length; i++) {
        var route = routes[i];
        if (pathname === route[0]) {
            var action = route[1];
            action(req, res);
            return;
        }
    }
}

// 使用代码
use('/user/setting', exports.setting);
use('/setting/user', exports.setting);

// 如果要实现如下使用方法，可以增加正则匹配
use('/profile/:username', function (req, res) {
    // TODO
});

// 【第二步】：增加正则匹配

var pathRegexp = function (path) {
    path = path.concat(strict ? '' : '/?')
        .replace(/\/\(/g, '(?:/')
        .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function (_, slash, format, key, capture, optional, star) {
            slash = slash || '';
            return '' 
                + (optional ? '' : slash)
                + '(?:'
                + (optional ? slash : '')
                + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
                + (optional || '')
                + (star ? '(/*)?' : '');
        })
        .replace(/([\/.])/g, '\\$1')
        .replace(/\*/g, '(.*)');

    return new RegExp('^' + path + '$');
}

// 上述正则表达式十分复杂，总体而言，能实现如下匹配：
/**
    /profile/:username => /profile/jacksontian, /profile/hoover
    /user.:ext => /user.xml, /user.json
 */

// 重写注册方法
var use = function (path, action) {
    routes.push([pathRegexp(path), action]);
};

function f(req, res) {
    var pathname = url.parse(req.url).pathname;
    for (var i=0; i<routes.length; i++) {
        var route = routes[i];
        if (route[0].exec(pathname)) {
            var action = route[1];
            action(req, res);
            return;
        }
    }
    handle404(req, res);
}

// 【第三步】：增加参数解析

// 需要实现如下代码
use('/profile/:username', function(req, res) {
    var username = req.params.username;
    // TODO
})

// 改造上面的 pathRegexp
var pathRegexp2 = function (path) {
    var keys = [];

    path = path.concat(strict ? '' : '/?')
        .replace(/\/\(/g, '(?:/')
        .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, function (_, slash, format, key, capture, optional, star) {
            // 保存匹配的键值
            keys.push(key);
            
            slash = slash || '';
            return '' 
                + (optional ? '' : slash)
                + '(?:'
                + (optional ? slash : '')
                + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
                + (optional || '')
                + (star ? '(/*)?' : '');
        })
        .replace(/([\/.])/g, '\\$1')
        .replace(/\*/g, '(.*)');

    return {
        keys: keys,
        regexp: new RegExp('^' + path + '$')
    }
}

function f(req, res) {
    var pathname = url.parse(req.url).pathname;
    for (var i=0; i<routes.length; i++) {
        var route = routes[i];

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
            return;
        }
    }
    handle404(req, res);
}


/**
    自然映射

    /controller/action/param1/param2/param3

    已 /user/setting/12/1990 为例，会去找 controllers 目录下的 user 文件，然后调用其 setting 方法
 */

function f(req, res) {
    var pathname = url.parse(req.url).pathname;
    var paths = pathname.split('/');
    var controller = paths[1] || 'index';
    var action = paths[2] || 'index';
    var args = paths.slice(3);

    var module;
    try {
        modeule = require('./controllers/' + controller);
    } catch (e) {
        handle500(req, res);
        return
    }

    var method = module[action];
    if (method) {
        method.apply(null, [req, res].concat(args));
    } else {
        handle500(req, res);
    }
}