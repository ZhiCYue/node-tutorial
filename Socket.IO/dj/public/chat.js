
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

  // 播放歌曲
  var playing = document.getElementById('playing')

  function play (song) {
    if (!song) return
    playing.innerHTML = '<hr><b>Now Playing:</b> ' + song.ArtistName + ' ' + song.SongName + '<br>'
    var iframe = document.createElement('iframe')
    iframe.frameBorder = 0
    iframe.src = song.Url
    playing.appendChild(iframe)
  }

  socket.on('song', play)

  // 查询表单
  var form = document.getElementById('dj')
  var results = document.getElementById('results')
  form.style.display = 'block'
  form.onsubmit = function () {
    results.innerHTML = ''
    socket.emit('search', document.getElementById('s').value, function (songs) {
      // 遍历歌曲列表
      for (var i=0; i<songs.length; i++) {
        // 添加歌曲
        (function (song) {
          var result = document.createElement('li')
          result.innerHTML = song.ArtistName + ' - <b>' + song.SongName + '</b> '
          var a = document.createElement('a')
          a.href = '#'
          a.innerHTML = 'Select'
          a.onclick = function () {
            socket.emit('song', song)
            play(song)
            return false
          }
          result.appendChild(a)
          results.appendChild(result)
        })(songs[i])
      }
    })

    return false
  }

  // elected 事件
  socket.on('elected', function () {
    form.className = 'isDJ'
  })
}