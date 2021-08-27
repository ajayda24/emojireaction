const path = require('path')
const http = require('http')
const express = require('express')

const { userJoinHelper, userDeleteHelper, usersObj } = require('./utils/users')

const app = express()

app.use(express.static(path.join(__dirname, 'public')))

const port = process.env.PORT || 3000
const server = app.listen(port, () => {
  console.log(`Server started at port ${port}`)
})

const io = require('socket.io')(server)

io.on('connection', (socket) => {
  console.log('User has connected')

  socket.on('createGame', (data) => {
    const joinCode = Math.floor(Math.random()*100000).toString()
    const user = userJoinHelper(socket.id, joinCode, 1)
    socket.join(joinCode)
    socket.emit('createGameSuccess', user)
  })

  socket.on('joinGame', (data) => {
    const checkRoom = Object.keys(usersObj).find((el) => el == data.room)
    if (checkRoom) {
      if (usersObj[checkRoom].length == 2) return socket.emit('joinFailed')
      const user = userJoinHelper(socket.id, data.room, 2)
      socket.join(data.room)
      const firstPlayer = usersObj[checkRoom].find((el) => el.order == 1)
      io.to(data.room).emit('startGame', { room: data.room, user: user })
      socket
        .to(`${firstPlayer.id}`)
        .emit('firstPlayer', { room: data.room, player: firstPlayer })
      io.to(data.room).emit('gameInfo', {
        order: firstPlayer.order,
        emoji: firstPlayer.emoji,
      })
    } else {
      socket.emit('joinFailed')
    }
  })

  socket.on('playGame', (data) => {
    socket.broadcast
      .to(data.room)
      .emit('gameBoxClick', {
        btnInfo: data.btnInfo,
        room: data.room,
        playerId: socket.id,
      })

    const roomArray = usersObj[data.room]

    const currentPlayer = roomArray.filter(
      (el) => el.order == data.playerOrder
    )[0]
    var nextPlayerNumber = currentPlayer.order + 1
    if (nextPlayerNumber > 2) {
      nextPlayerNumber = 1
    }

    const nextPlayer = roomArray.filter((el) => el.order == nextPlayerNumber)[0]

    socket
      .to(`${nextPlayer.id}`)
      .emit('nextPlayer', {
        btnInfo: data.btnInfo,
        emoji: nextPlayer.emoji,
        room: data.room,
      })
    socket.emit('playerWhoClicked')
    io.to(data.room).emit('gameInfo', {
      action: 'info',
      emoji: nextPlayer.emoji,
    })
  })
  // socket.on('disconnect', () => {
  //   console.log('user disconnected');
  //   userDeleteHelper(socket.id)
  //   io.to(data.room).emit('playerDisconnect')
  // })
  socket.on('disconnecting', function () {
    var rooms = Array.from(socket.rooms)
    userDeleteHelper(rooms[1])
    io.to(rooms[1]).emit('playerDisconnect')
  })

  socket.on('newChat', (data) => {
    const user = usersObj[data.room].filter((el) => el.id == socket.id)[0]
    io.to(data.room).emit('chatRoom', { chat: data.chat, user: user })
    socket.to(data.room).emit('showNotification')
  })

  socket.on('friendOffline',data=>{
    var rooms = Array.from(socket.rooms)
    userDeleteHelper(rooms[1])
    io.to(rooms[1]).emit('playerDisconnect')
  })

  // socket.on('playerTakeMoreTime', (data) => {
  //   socket.broadcast.to(data.room).emit('gameInfo', { action: 'time', emoji: data.emoji })
  // })
})
