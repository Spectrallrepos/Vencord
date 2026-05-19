let currRoomID = null
let unsubMsgs = null // will store a function later

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
  document.getElementById('msgContainer').innerHTML = ''
  document.querySelector('#chatHeader p').innerHTML = ''
  document.getElementById('inputBar').disabled = true
  if (unsubMsgs) unsubMsgs()
}

// selecting a room 
function onClick(room){
  // changing the global var to curr id on select
  currRoomID = room.id
  // set active room
  activeRoom(currRoomID, room.name)

  // clear msgs of prev room, clear any search value if it exists
  document.getElementById('msgContainer').innerHTML = ''
  const s = document.querySelector('.roomsSection input')
  if (s.value) s.value = ''
  document.querySelectorAll('.room-item').forEach(li => li.style.display = 'block')

// enable texting
  document.getElementById('msgInput').disabled = false
  document.getElementById('sendBtn').disabled = false

  // rm the old snapshot, basically to rm the snapshot working on old room
  if (unsubMsgs) unsubMsgs()
// unsubmsgs stores the following function
// actually, it stores the object returned
  unsubMsgs = msgListener(currRoomID, (snapshot) => {
    /* the snapshot contains all msgs, */
    snapshot.docChanges().forEach(element => {
      if (element.type === 'added')
        showMsg(element.doc.data(), currUser)
    })
  })
  // scroll to chat area for smaller width devices
  document.getElementById('App').scrollLeft = window.innerWidth
  // remove the previous room name
  const p = document.querySelector('#chatHeader p')
  if (p) p.remove()
}
// function to send msg
function sendCurrMsg() {
  const input = document.getElementById('msgInput')
  const text = input.value.trim() //rm whitespace
  // if there is no text
  if (!text) return
  // send the msg from the curr user and to this room id
  sendMsg(currRoomID, currUser, text)
  input.value = ''
}

// starting the app, function to render it all
function startApp() {
  // updating the room list
  roomListener((snapshot) => {
    // the snapshot(object)
    const rooms = snapshot.docs.map(doc => ({ id:doc.id, ...doc.data() }))
    // console.log(rooms)
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
