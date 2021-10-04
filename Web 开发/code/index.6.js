// 附件下载

const mime = require('mime');
const fs = require('fs');

res.sendfile = function (filepath) {
    fs.stat(filepath, function (err, stat) {
        var stream = fs.createReadStream(filepath);
        res.setHeader('Content-Type', mime.lookup(filepath));
        res.setHeader('Content-Length', stat.size);
        res.setHeader('Content-Disposition', 'attchment; filename="' + path.basename(filepath) + '"');
        res.writeHead(200);
        stream.pipe(res);
    })
}


// 响应json
res.json = function (json) {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify(json));
}

// 响应跳转
res.redirect = function (url) {
    res.setHeader('Location', url);
    res.writeHead(302);
    res.end('Redirect to ' + url);
}
