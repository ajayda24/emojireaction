const characterArray = require('./emoji')
const usersObj = {}

// var usersObj = {
//   room1: [
//     { id: 1, room: 'room1', players: 3, order: 1 },
//     { id: 2, room: 'room1', players: 3, order: 2 },
//     { id: 3, room: 'room1', players: 3, order: 3 },
//   ],
//   room2: [
//     { id: 1, room: 'room2', players: 2, order: 1 },
//     { id: 2, room: 'room2', players: 2, order: 2 },
//   ],
// }

const userJoinHelper = (id,room,order) => {
  if (!usersObj[room]) {
    usersObj[room] = []
  }
  var emoji = characterArray[order]
  const user = { id,room, order ,emoji}
  usersObj[room].push(user)
  return user
}

const userDeleteHelper = (id,room) => {
  // const index = usersObj[room].findIndex((el) => el.id == id)
  // if (index >= 0) {
  //   usersObj[room].splice(index, 1)
  // }
  delete usersObj[room]
}

module.exports = { userJoinHelper, userDeleteHelper, usersObj }
