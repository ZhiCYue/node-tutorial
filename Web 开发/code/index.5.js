/**
 * 缓存
 */

// If-Modify-Since / Last-Modified
var handle = function (req, res) {
    fs.stat(filename, function (err, stat) {
        var lastModified = stat.mtime.toUTCString();
        if (lastModified === req.headers['if-modified-since']) {
            res.writeHead(304, 'Not Modified');
            res.end();
        } else {
            fs.readFile(filename, function (err, file) {
                var lastModified = stat.mtime.toUTCString();
                res.setHeader('Last-Modified', lastModified);
                res.writeHead(200, 'OK');
                res.end(file);
            })
        }
    })
}

// If-None-Match / ETag
var getHash = function (str) {
    var shasum = crypto.createHash('sha1');
    return shasum.update(str).digest('base64');
}

var handle = function (req, res) {
    fs.readFile(filename, function(err, file) {
        var hash = getHash(file);
        var noneMatch = req.headers['if-none-match'];
        if (hash === noneMatch) {
            res.writeHead(304, 'Not Modified');
            res.end();
        } else {
            res.setHeader('ETag', hash);
            res.writeHead(200, 'OK');
            res.end(file);
        }
    })
}

// 浏览器本地缓存

// Expires 可能存在服务端和客户端时间不一致的缺点
var handle = function (req, res) {
    fs.readFile(filename, function (err, file) {
        var expires = new Date();
        expires.setTime(expires.getTime() + 10 * 365 * 24 * 60 * 60 * 1000);

        res.setHeader('Expires', expires.toUTCString());
        res.writeHead(200, 'OK');
        res.end(file);
    })
}

// Cache-Control
// max-age 会覆盖 Expires，同时出现的话
var handle = function (req, res) {
    fs.readFile(filename, function (err, file) {
        res.setHeader('Cache-Control', 'max-age=' + 10 * 365 * 24 * 60 * 60 * 1000);
        res.writeHead(200, 'OK');
        res.end(file);
    })
}
