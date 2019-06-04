
// 所有 Socket.IO 暴露出来的方法和类都在 io 命名空间中

window.onload = function () {
  var socket = io.connect()

  socket.on('connect', function () {

    // 通过 json 事件发送昵称
    socket.emit('join', prompt('What is your nickname?'))

    // 显示聊天窗口
    document.getElementById('chat').style.display = 'block'
    
    socket.on('announcement', function (msg) {
      var li = document.createElement('li')
      li.className = 'announcement'
      li.innerHTML = msg
      document.getElementById('messages').appendChild(li)
    })

  })

  function addMessage (from, text) {
    var li = document.createElement('li')
    li.className = 'message'
    li.innerHTML = '<b>' + from + '</b>: ' + text
    document.getElementById('messages').appendChild(li)
    return li
  }

  // 广播聊天消息
  var input = document.getElementById('input')
  document.getElementById('form').onsubmit = function () {
    var li = addMessage('me', input.value)
    socket.emit('text', input.value, function (date) {
      li.className = 'confirmed'
      li.title = date
    })

    // 重置输入框
    input.value = ''
    input.focus()

    return false
  }

  socket.on('text', addMessage)
}