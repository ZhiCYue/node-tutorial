var WebSocket = require('./websocket')

var socket = new WebSocket('ws://127.0.0.1:12010/updates')

socket.onopen = function () {
  console.log('client opened.')
}

socket.connect()