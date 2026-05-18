let currRoomID = null
let unsubMsgs = null

// showing the app and login page

function showApp(displayName) {
  document.getElementById('login').classList.add('hidden')
  document.getElementById('App').classList.remove('hidden')
  document.getElementById('user-display-name').textContent = displayName
  document.getElementById('user-avatar').textContent = displayName[0].toUpperCase()
}

function showLogin() {
  document.getElementById('App').classList.add('hidden')
  document.getElementById('login').classList.remove('hidden')
  document.querySelector('.guest p').innerHTML = `Or continue as a guest`
}

// selecting a room 
function onClick(room){
  // using the fn msg_chatUpdate created at app.js
  currRoomID = room.id
  // set active room
  activeRoom(currRoomID, room.name)

  // clear messages
  document.getElementById('msgContainer').innerHTML = ''

  // enable input
  document.getElementById('msgInput').disabled = false
  document.getElementById('sendBtn').disabled = false

  // rm the old snapshot, basically to rm the snapshot working on old room
  if (unsubMsgs) unsubMsgs()

  unsubMsgs = msg_chatUpdate(currRoomID, (snapshot) => {
    snapshot.docChanges().forEach(element => {
      if (element.type === 'added')
        showMsg(element.doc.data(), currUser)
    })
  })
  document.getElementById('chatArea').scrollLeft = window.innerWidth
  const p = document.querySelector('#chatHeader p')
  if (p) p.remove()
}
// function to send msg
function sendCurrMsg() {
  const input = document.getElementById('msgInput')
  const text = input.value.trim() //rm whitespace
  if (!text || !currRoomID) return
  sendMsg(currRoomID, currUser, text)
  input.value = ''
}

// starting the app, function to render it all
function startApp() {
  // updating the room list
  nav_roomUpdate((snapshot) => {
    const rooms = snapshot.docs.map(doc => ({ id:doc.id, ...doc.data() }))
    roomList(rooms, onClick)
  })
  document.getElementById('App').scrollLeft=-1
  // creating a room
  const input = document.querySelector('.createRoom input')
  document.querySelector('.createRoom button').addEventListener('click', () => {
    const name = input.value.trim() //rm extra whitespaces
    if (name){
      mkRoom(name)
      input.value = ''
    }
  })
  // sending a msg
  document.getElementById('sendBtn').addEventListener('click', sendCurrMsg)
  document.getElementById('msgInput').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') sendCurrMsg()
  })
}
