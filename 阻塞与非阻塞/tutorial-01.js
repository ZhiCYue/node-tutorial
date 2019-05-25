/**
 * 共享状态的并发
 */
var books = [
  'Metamorphosis',
  'Crime and punishment'
]

function serveBooks () {
  var html = '<b>' + books.join('</b><br><b>') + '</b>'
  // 状态变化了
  books = []
  return html
}

/**
 * 单线程世界
 */
var start = Date.now()

setTimeout(function () {
  console.log(Date.now() - start)
  for (var i=0; i<1000000000; i++) {}
}, 1000)

setTimeout(function () {
  console.log(Date.now() - start)
}, 2000)

/**
 * 错误处理
 */