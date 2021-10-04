var strict = true;
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

// 测试代码
var flag = pathRegexp('/profile/:username').exec('/profile/jacksontian');
console.log(flag);
/**
 [ '/profile/jacksontian',
  'jacksontian',
  index: 0,
  input: '/profile/jacksontian',
  groups: undefined ]
 */

flag = pathRegexp('/user.:ext').exec('/user.json');
console.log(flag);