const socket = io()

const numberOfPlayers = 2
const row = 6
const col = 11
const rowsAndCols = row * col
const characters = ['.', '😃', '🎯']
var gameCellState = new Array(rowsAndCols + 1).fill(0)
var playerPosition = new Array(rowsAndCols + 1).fill(0)
var playerNumber = 1
var emojiNumberPerBox = []
const currentPlayers = ['😃', '🎯']

//Game Screen Container
const gameCellsContainer = document.getElementById('game-cells-container')
const gameMainHeading = document.getElementById('game-main-heading')
const gamePlayerOrder = document.getElementById('game-player-order')
const gamePlayerRoom = document.getElementById('game-player-room')

//Modal variable
//Info Modal
const modalInfoHeading = document.getElementById('modal-info-label-heading')
const modalInfoButtons = document.getElementById('modal-info-buttons')
const modalInfoInput = document.getElementById('modal-info-input')

for (var i = 1; i < rowsAndCols + 1; i++) {
  const gameCell = document.createElement('div')
  document.getElementById('game-cells-container').appendChild(gameCell)
  gameCell.id = i
  gameCell.classList.add('btn', 'bg-base-300', 'game-btn')
  gameCell.setAttribute('onClick', 'gameCellClick(this)')
  gameCell.style.position = 'relative'

  if (i % row == 0) {
    var br = document.createElement('div')
    br.setAttribute('style', 'width: 100%')
    document.getElementById('game-cells-container').appendChild(br)
  }

  if (i == 1) gameCell.classList.add('cornerOne')
  else if (i == row) gameCell.classList.add('cornerTwo')
  else if (i == rowsAndCols - row + 1) gameCell.classList.add('cornerThree')
  else if (i == rowsAndCols) gameCell.classList.add('cornerFour')
  else if (i > 1 && i < row) gameCell.classList.add('sideTop')
  else if (i % row == 0 && i != row && i != rowsAndCols)
    gameCell.classList.add('sideRight')
  else if ((i - 1) % row == 0 && i != 1 && i != rowsAndCols - row + 1)
    gameCell.classList.add('sideLeft')
  else if (i > rowsAndCols - row + 1 && i < rowsAndCols)
    gameCell.classList.add('sideDown')
  else gameCell.classList.add('center')
}

function gameCellClick(event) {
  if (
    playerPosition[event.id] == playerNumber ||
    playerPosition[event.id] == 0
  ) {
    socket.emit('playGame', {
      btnInfo: event.id,
      room: gamePlayerRoom.innerHTML,
      playerOrder: gamePlayerOrder.innerHTML,
    })
    chainReaction(event.id)
    chainReactionOutputAndGameOver()
  }
}

function chainReaction(eventId) {
  const eventElement = document.getElementById(eventId)
  const className = Array.from(eventElement.classList).pop()
  const elementId = eventId
  if (
    playerPosition[elementId] == playerNumber ||
    playerPosition[elementId] == 0
  ) {
    function cornerOne(id) {
      var element = document.getElementById(id)
      var classes = Array.from(element.classList).pop()
      if (classes == 'cornerOne') {
        var dot = gameCellState[id] + 1
        gameCellState[id] = dot
        playerPosition[id] = playerNumber
        if (dot > 1) {
          dot = 0
          playerPosition[id] = 0
          gameCellState[id] = dot
          var t = 2
          var u = Number(id) + row

          sideTop(t)
          sideLeft(u)
        }
      }
    }

    function sideTop(id) {
      var element = document.getElementById(id)
      var classes = Array.from(element.classList).pop()
      if (classes == 'sideTop') {
        var dot = gameCellState[id] + 1
        gameCellState[id] = dot
        playerPosition[id] = playerNumber
        if (dot > 2) {
          dot = 0
          playerPosition[id] = 0
          gameCellState[id] = dot
          var t = Number(id) + 1
          var u = Number(id) - 1
          var v = Number(id) + row
          cornerOne(u)
          cornerTwo(t)
          sideTop(t)
          sideTop(u)
          center(v)
        }
      }
    }
    function cornerTwo(id) {
      var element = document.getElementById(id)
      var classes = Array.from(element.classList).pop()
      if (classes == 'cornerTwo') {
        var dot = gameCellState[id] + 1
        gameCellState[id] = dot
        playerPosition[id] = playerNumber
        if (dot > 1) {
          dot = 0
          playerPosition[id] = 0
          gameCellState[id] = dot
          var t = Number(id) - 1
          var u = Number(id) + row
          sideTop(t)
          sideRight(u)
        }
      }
    }
    function sideLeft(id) {
      var element = document.getElementById(id)
      var classes = Array.from(element.classList).pop()
      if (classes == 'sideLeft') {
        var dot = gameCellState[id] + 1
        gameCellState[id] = dot
        playerPosition[id] = playerNumber
        if (dot > 2) {
          dot = 0
          playerPosition[id] = 0
          gameCellState[id] = dot
          var t = Number(id) - row
          var u = Number(id) + row
          var v = Number(id) + 1
          cornerOne(t)
          sideLeft(u)
          sideLeft(t)
          center(v)
          cornerThree(u)
        }
      }
    }
    function center(id) {
      var element = document.getElementById(id)

      var classes = Array.from(element.classList).pop()
      if (classes == 'center') {
        var dot = gameCellState[id] + 1
        gameCellState[id] = dot
        playerPosition[id] = playerNumber
        if (dot > 3) {
          dot = 0
          playerPosition[id] = 0
          gameCellState[id] = dot
          var t = Number(id) - row
          var u = Number(id) + row
          var v = Number(id) + 1
          var w = Number(id) - 1
          sideLeft(w)
          center(t)
          center(u)
          center(v)
          center(w)
          sideTop(t)
          sideRight(v)
          sideDown(u)
        }
      }
    }
    function sideRight(id) {
      var element = document.getElementById(id)
      var classes = Array.from(element.classList).pop()
      if (classes == 'sideRight') {
        var dot = gameCellState[id] + 1
        gameCellState[id] = dot
        playerPosition[id] = playerNumber
        if (dot > 2) {
          dot = 0
          playerPosition[id] = 0
          gameCellState[id] = dot
          var t = Number(id) - row
          var u = Number(id) + row
          var v = Number(id) - 1
          cornerTwo(t)
          cornerFour(u)
          center(v)
          sideRight(t)
          sideRight(u)
        }
      }
    }
    function cornerThree(id) {
      var element = document.getElementById(id)
      var classes = Array.from(element.classList).pop()
      if (classes == 'cornerThree') {
        var dot = gameCellState[id] + 1
        gameCellState[id] = dot
        playerPosition[id] = playerNumber
        if (dot > 1) {
          dot = 0
          playerPosition[id] = 0
          gameCellState[id] = dot
          var t = Number(id) + 1
          var u = Number(id) - row
          sideDown(t)
          sideLeft(u)
        }
      }
    }
    function sideDown(id) {
      var element = document.getElementById(id)
      var classes = Array.from(element.classList).pop()
      if (classes == 'sideDown') {
        var dot = gameCellState[id] + 1
        gameCellState[id] = dot
        playerPosition[id] = playerNumber
        if (dot > 2) {
          dot = 0
          playerPosition[id] = 0
          gameCellState[id] = dot
          var t = Number(id) - row
          var u = Number(id) + 1
          var v = Number(id) - 1
          cornerThree(v)
          cornerFour(u)
          sideDown(u)
          sideDown(v)
          center(t)
        }
      }
    }
    function cornerFour(id) {
      var element = document.getElementById(id)
      var classes = Array.from(element.classList).pop()
      if (classes == 'cornerFour') {
        var dot = gameCellState[id] + 1
        gameCellState[id] = dot
        playerPosition[id] = playerNumber
        if (dot > 1) {
          dot = 0
          playerPosition[id] = 0
          gameCellState[id] = dot
          var t = Number(id) - 1
          var u = Number(id) - row
          sideDown(t)
          sideRight(u)
        }
      }
    }

    //calling the functions
    if (className == 'cornerOne') cornerOne(elementId)
    if (className == 'cornerTwo') cornerTwo(elementId)
    if (className == 'cornerThree') cornerThree(elementId)
    if (className == 'cornerFour') cornerFour(elementId)
    if (className == 'sideTop') sideTop(elementId)
    if (className == 'sideLeft') sideLeft(elementId)
    if (className == 'sideRight') sideRight(elementId)
    if (className == 'sideDown') sideDown(elementId)
    if (className == 'center') center(elementId)

    // for (var j = 1; j <= rowsAndCols; j++) {
    //   document.getElementById(j).innerHTML = gameCellState[j]
    // }
    playerNumber++
    if (playerNumber == numberOfPlayers + 1) {
      playerNumber = 1
    }
  }
}

function chainReactionOutputAndGameOver() {
  for (var j = 1; j <= rowsAndCols; j++) {
    if (gameCellState[j] == 0) {
      document.getElementById(j).innerHTML = ''
    }
    if (gameCellState[j] == 1) {
      // document.getElementById(`span-${j}`).style.position = 'absolute'
      document.getElementById(j).innerHTML = `<span id='span-${j}-1'>${
        characters[playerPosition[j]]
      }</span>`
    }
    if (gameCellState[j] == 2) {
      document.getElementById(j).innerHTML = `
      <span id='span-${j}-1'>${characters[playerPosition[j]]}</span>
      <span id='span-${j}-2'>${characters[playerPosition[j]]}</span>`
      document.getElementById(`span-${j}-1`).style.left = '3px'
      document.getElementById(`span-${j}-2`).style.right = '3px'
    }
    if (gameCellState[j] == 3) {
      document.getElementById(j).innerHTML = `
      <span id='span-${j}-1'>${characters[playerPosition[j]]}</span>
      <span id='span-${j}-2'>${characters[playerPosition[j]]}</span>
      <span id='span-${j}-3'>${characters[playerPosition[j]]}</span>`
      document.getElementById(`span-${j}-1`).style.left = '3px'
      document.getElementById(`span-${j}-2`).style.right = '3px'
      document.getElementById(`span-${j}-3`).style.zIndex = '1'
      document.getElementById(`span-${j}-3`).style.top = '-6px'
    }
  }

  emojiNumberPerBox.length = 0
  for (let t = 1; t < row * col + 1; t++) {
    if (document.getElementById(t).children.length > 0) {
      for (let y = 0; y < document.getElementById(t).children.length; y++) {
        for (let q = 0; q < currentPlayers.length; q++) {
          if (
            document.getElementById(t).children[y].innerHTML ==
            currentPlayers[q]
          ) {
            emojiNumberPerBox.push(
              document.getElementById(t).children[y].innerHTML
            )
          }
        }
      }
    }
  }

  if (emojiNumberPerBox.length >= currentPlayers.length) {
    loop1: for (let u = 0; u < emojiNumberPerBox.length; u++) {
      loop2: for (let q = 0; q < currentPlayers.length; q++) {
        if (emojiNumberPerBox.indexOf(currentPlayers[q]) < 0) {
          if (currentPlayers.length == 2) {
            gameOverTwoPlayer(currentPlayers[q])
          }
        }
      }
    }
  }
}

function gameOverTwoPlayer(losePerson) {
  const winner = currentPlayers.filter((a) => a != losePerson)
  store.joinedOrCreated = false
  location.hash = '#info'
  modalInfoHeading.innerHTML = `${winner} Wins`
  document.getElementById('winning-image').style.display = 'block'
  setTimeout(() => {
    document.getElementById('winning-image').style.display = 'none'
  }, 2000)

  document.getElementById('game-main-heading').innerHTML = 'Game Over'
  modalInfoButtons.innerHTML = `
    <a
      href="#"
      class="btn btn-outline btn-primary"
      onclick="location.reload()"
      >New Game</a
    >
  `
}

function createGame() {
  gameCellsContainer.style.pointerEvents = 'none'
  socket.emit('createGame')
  socket.on('createGameSuccess', (data) => {
    if (data.room) {
      const joinCode = data.room
      modalInfoHeading.innerHTML = 'Waiting for others to join...'
      modalInfoInput.setAttribute('value', `Join Code - ${joinCode}`)
      modalInfoInput.setAttribute('disabled', 'true')
      modalInfoButtons.setAttribute('class', '')

      modalInfoButtons.innerHTML = `
        <div class="form-control">
          <input
            id='modalJoinLink'
            
            type="text"
            placeholder="Chat with Friend"
            class="input input-md input-bordered input-primary"
            value='https://chainreaction.herokuapp.com/join=${joinCode}'
            disabled
          />
          <div id='linkCopyTooltip' data-tip="Copy Link" class="tooltip">
          <button id='modalJoinLinkButton' class="btn btn-primary" onClick=copyText('${joinCode}')>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(255, 255, 255, 1);transform: scaleX(-1);msFilter:progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1);"><path d="M20 2H10a2 2 0 0 0-2 2v2h8a2 2 0 0 1 2 2v8h2a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2z"></path><path d="M4 22h10c1.103 0 2-.897 2-2V10c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v10c0 1.103.897 2 2 2zm2-10h6v2H6v-2zm0 4h6v2H6v-2z"></path></svg>
          </button>
          </div>
        </div>
        `
    }
  })
  socket.on('startGame', (data) => {
    store.joinedOrCreated = true
    location.hash = '#'
    document.getElementById('modal-info-input-div').style.display = 'none'
    modalInfoHeading.innerHTML = 'Chain Reaction Multiplayer'
    modalInfoButtons.setAttribute('class', 'modal-action')
    modalInfoButtons.innerHTML = `
      <a
        class="btn btn-outline btn-neutral"
        onclick="location.reload()"
      >New Game</a>
      <a
        href="#chat"
        class="btn btn-outline btn-primary"
        >Open Chat</a
      >
    `
  })
  socket.on('firstPlayer', (data) => {
    gameCellsContainer.style.pointerEvents = 'auto'
    gamePlayerOrder.innerHTML = data.player.order
    gamePlayerRoom.innerHTML = data.room
    gameMainHeading.innerHTML = 'Your Move'
  })
}

function joinGame() {
  gameCellsContainer.style.pointerEvents = 'none'
  socket.emit('joinGame', { room: modalInfoInput.value })
  socket.on('startGame', (data) => {
    store.joinedOrCreated = true
    location.hash = '#'
    gamePlayerOrder.innerHTML = '2'
    gamePlayerRoom.innerHTML = data.room
    gameMainHeading.innerHTML = "Your Friend's Move"
    document.getElementById('modal-info-input-div').style.display = 'none'
    modalInfoButtons.setAttribute('class', 'modal-action')
    modalInfoHeading.innerHTML = 'Chain Reaction Multiplayer'
    modalInfoButtons.innerHTML = `
      <a
        class="btn btn-outline btn-neutral"
        onclick="location.reload()"
      >New Game</a>
      <a
        href="#chat"
        class="btn btn-outline btn-primary"
        >Open Chat</a
      >
    `
  })
  socket.on('joinFailed', (data) => {
    modalInfoHeading.innerHTML = 'Code Invalid'
  })
}

function copyText(joinCode) {
  const tooltip = document.getElementById('linkCopyTooltip')
  tooltip.classList.add('tooltip')
  tooltip.classList.add('tooltip-open')
  tooltip.setAttribute('data-tip', 'Link Copied')
  setTimeout(() => {
    tooltip.classList.remove('tooltip-open', 'tooltip')
  }, 1500)
  //navigator.clipboard.writeText(`http://localhost:3000/?join=${joinCode}`)
  navigator.clipboard.writeText(
  `https://emojireaction.herokuapp.com/join=${joinCode}`
  )
}

function chatSubmit() {
  const chatInput = document.getElementById('chat-input').value
  socket.emit('newChat', { room: gamePlayerRoom.innerHTML, chat: chatInput })
}

function chatIndicatorToggler() {
  document.getElementById('chat-indicator').style.display = 'none'
}

socket.on('gameBoxClick', (data) => {
  chainReaction(data.btnInfo)
  chainReactionOutputAndGameOver()
})

socket.on('nextPlayer', (data) => {
  gameCellsContainer.style.pointerEvents = 'auto'
  gameMainHeading.innerHTML = 'Your Move'
})
socket.on('playerWhoClicked', (data) => {
  gameCellsContainer.style.pointerEvents = 'none'
  gameMainHeading.innerHTML = "Your Friend's Move"
})
socket.on('playerDisconnect', (data) => {
  location.hash = '#info'
  store.joinedOrCreated = false
  modalInfoHeading.innerHTML = 'Your Friend Left the game'
  modalInfoButtons.innerHTML = `
    <a
      href="#"
      class="btn btn-outline btn-primary"
      onclick="location.reload()"
      >New Game</a
    >
  `
})

socket.on('chatRoom', (data) => {
  document.getElementById('chat-input').value = ''

  const chatBox = document.getElementById('chat-body-id')
  const div = document.createElement('div')
  div.setAttribute('class', 'shadow-lg bg-base-100')
  if (gamePlayerOrder.innerHTML == data.user.order)
    div.classList.add('personal')
  else div.classList.add('other')
  div.innerHTML = `<div class="emoji">${data.user.emoji}</div>${data.chat}`
  chatBox.appendChild(div)
  updateChatScroll()
})

socket.on('showNotification', () => {
  if (location.hash != '#chat')
    document.getElementById('chat-indicator').style.display = 'block'
})
