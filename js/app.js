let currRoomID = null
let unsubMsgs = null
let unsubMembers = null
let joined = false
// let typeTimeout = null

// showing the app and login page

function showApp(displayName) {
  document.getElementById('login').classList.add('hidden')
  document.getElementById('App').classList.remove('hidden')
  document.getElementById('user-display-name').textContent = displayName
  document.getElementById('user-avatar').textContent = displayName[0].toUpperCase()
  if (isGuest) {
    document.querySelector('.createRoom').style.display = 'none'
  }
}

function showLogin() {
  document.getElementById('App').classList.add('hidden')
  document.getElementById('login').classList.remove('hidden')
  document.querySelector('.guest p').innerHTML = `Or continue as a guest`
  document.getElementById('msgContainer').innerHTML = ''
  document.querySelector('#chatHeader p').innerHTML = ''
  document.getElementById('inputBar').disabled = true
  if (unsubMsgs) unsubMsgs() // rm any msg listener
  document.querySelector('.createRoom').style.display = 'flex'
}

// selecting a room 
function onClick(room){
  // changing the global var to curr id on select
  currRoomID = room.id
  setTimeout(() => db.collection('rooms').doc(currRoomID).collection('members').doc(currUser.uid).set({
        lastSeen: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
  ,3000) // 3s timeout if the user decided to spam around rooms
  // set active room
  activeRoom(currRoomID, room.name)

  // updating the member list
  if (unsubMembers) unsubMembers()
  unsubMembers = memberList(currRoomID, (snapshot) => {
    const members = snapshot.docs.map(doc => doc.data())
    showMember(members)
  })

  // search function on rooms
  const s = document.querySelector('.roomsSection input')
  if (s.value) s.value = ''
  document.querySelectorAll('.room-item').forEach(li => li.style.display = 'block')

// enable texting
  document.getElementById('msgInput').disabled = false
  document.getElementById('sendBtn').disabled = false

// clear msgs of prev room, clear any search value if it exists
  document.getElementById('msgContainer').innerHTML = ''
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
  db.collection('rooms').doc(currRoomID).collection('members').doc(currUser.uid).get().then(doc => {
    if (doc.exists) 
      joined = true
  })
}

// setting the typing context
// document.getElementById('msgInput').addEventListener('input', () => {
//   if (!currRoomID) return
//   setTyping(currRoomID, currUser, true)
//   clearTimeout(typingTimeout)
//   typingTimeout = setTimeout(() => {
//     setTyping(currRoomID, currUser, false)
//   }, 2000)
// })

// function to send msg
function sendCurrMsg() {
  const input = document.getElementById('msgInput')
  const text = input.value.trim() //rm whitespace
  // if there is no text
  if (!text) return
  // joining a room
  if (!joined) {
    db.collection('rooms').doc(currRoomID).collection('members').doc(currUser.uid).set({
      name: currUser.displayName,
      uid: currUser.uid,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true })
  }
  
  // send the msg from the curr user and to this room id
  sendMsg(currRoomID, currUser, text)
  input.value = ''
  input.disabled = true
  setTimeout(() => input.disabled=false, 500) // to prevent spam
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
  document.getElementById('App').scrollLeft=-1 //mobile responsiveness
  // creating a room
  const input = document.querySelector('.createRoom input')
  document.querySelector('.createRoom button').addEventListener('click', () => {
    const name = input.value.trim() //rm extra whitespaces
    if (name){
      mkRoom(name)
      input.value = ''
    }
  })
  input.addEventListener('keydown', (e) => {
    const name = input.value.trim() //rm extra whitespaces
    if (e.key === 'Enter')
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
  setInterval(() => {
    if (currRoomID && currUser) {
      db.collection('rooms').doc(currRoomID).collection('members').doc(currUser.uid).set({
        lastSeen: firebase.firestore.FieldValue.serverTimestamp()
      }, { merge: true })
    }
  }, 30000)
}
