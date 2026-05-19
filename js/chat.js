// creating rooms
let isTyping=false

function mkRoom(name){
    if (isGuest) return
    db.collection('rooms').doc(name).set({
        name:name,
        createdAt:firebase.firestore.FieldValue.serverTimestamp()
    })
}
// sending a msg
function sendMsg(roomID, user, text){
    db.collection('rooms').doc(roomID).collection('messages').add({
        text:text,
        sender:user.displayName,
        uid:user.uid,
        timestamp:firebase.firestore.FieldValue.serverTimestamp()
    })
}

// updating sidebar with new rooms,populating
function roomListener(callback) {
    /* the onSnapshot function basically tells firestore to keep watching
    of the current data in the room, whenever a data (msg) update happens,
    execute the dcallback function*/
    //Every time onSnapshot fires it passes a "snapshot" to callback:
    return db.collection('rooms').orderBy('createdAt').onSnapshot(callback)
}

// updating the msgs to the chat, user shd see prev chats
function msgListener(roomID, callback){
    // this function is kinda special
    // whenever the data changes the onsnapshot exexutes the callback
    return db.collection('rooms').doc(roomID).collection('messages')
    .orderBy('timestamp').onSnapshot(callback)
    // returns the function to end the current listener
}

function memberList(roomID, callback){
    // we need to now create a collection of users in a room, check their status
    return db.collection('rooms').doc(roomID).collection('members')
    .orderBy('createdAt').onSnapshot(callback)
}
// setting typing status
function setTyping(roomID, user, isTyping) {
  db.collection('rooms').doc(roomID).collection('members').doc(user.uid).set({
    isTyping: isTyping
  }, { merge: true })
}