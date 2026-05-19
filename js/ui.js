// all the data pulled from chat.js and mods from app.js will be used here to update stuff

// showing msg in the chat
function showMsg(msg, user){
    // creating markup for ts
    const message = document.createElement('div')
    message.classList.add('message-bubble')
    if (msg.uid === user.uid) message.classList.add('mine')
    else message.classList.add('theirs')


    message.innerHTML = `
    <div class="bubble-text">${msg.text}</div>
    <span class="bubble-meta">${msg.sender}_${msg.uid.replace(/\D/g, '').slice(0, 6)} · ${formatTime(msg.timestamp)}</span>
    `
    document.getElementById('msgContainer').appendChild(message)
    scrollToBottom()
}

// room list
function roomList(rooms, onClick){
    // show room list and on clicking on one of them, show it on chat
    const list = document.getElementById('rooms')
    list.innerHTML = ''
    rooms.forEach(room => {
        const li = document.createElement('li')
        li.classList.add('room-item')
        li.textContent = room.name
        li.dataset.id = room.id
        li.addEventListener('click', () => onClick(room))
        list.appendChild(li)
    })
    const search = document.querySelector('.roomsSection input')
    search.addEventListener('input', () => {
    const filter = search.value.toLowerCase().trim()
    document.querySelectorAll('.room-item').forEach(li => {
            if (li.textContent.toLowerCase().includes(filter)) {
            li.style.display = 'block'
            } else {
            li.style.display = 'none'
            }
        })
    })
}

// highlighting selected room
function activeRoom(roomID, roomName){
    document.querySelectorAll('.room-item').forEach(li=> li.classList.remove('active'))
    const item = document.querySelector(`[data-id="${roomID}"]`)
    if (item) item.classList.add('active')
    const header = document.getElementById('chatHeader')
    const p = document.createElement('p')
    p.textContent = '# ' + roomName
    header.appendChild(p)
}

//scroll fn
function scrollToBottom() {
  const container = document.getElementById('msgContainer')
  container.scrollTop = container.scrollHeight
}


document.getElementById('backBtn').addEventListener('click', () =>{
    document.getElementById('App').scrollLeft = -1
})

function formatTime(timestamp) {
  if (!timestamp) return ''
  const date = timestamp.toDate()
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}