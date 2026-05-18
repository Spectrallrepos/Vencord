// creating rooms
function mkRoom(name){
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
function nav_roomUpdate(doThis) {
    /* the onSnapshot function basically tells firestore to keep watching
    of the current data in the room, whenever a data (msg) update happens,
    execute the doThis function*/
    return db.collection('rooms').orderBy('createdAt').onSnapshot(doThis)
}

// updating the msgs to the chat, user shd see prev chats
function msg_chatUpdate(roomID, doThis){
    return db.collection('rooms').doc(roomID).collection('messages')
    .orderBy('timestamp').onSnapshot(doThis)
}