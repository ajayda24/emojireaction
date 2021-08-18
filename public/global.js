const updateChatScroll = () => {
  setTimeout(() => {
    var elmnt = document.getElementById('chat-body-id')
    elmnt.scrollTo({
      top: elmnt.scrollHeight,
      behavior: 'smooth',
    })
    // elmnt.scrollTop = elmnt.scrollHeight
  }, 100)
}

const store = {
  joinedOrCreated: false,
}
