// js/auth.js
let currUser = null
let isGuest = false

const provider = new firebase.auth.GoogleAuthProvider()

function loginWithGoogle() {
  firebase.auth().signInWithPopup(provider).catch((err) => {
    console.error("Login error:", err.message)
  })
}

// Google login button
document.getElementById('loginBtn').addEventListener('click',loginWithGoogle)

function logout() {
  if (currRoomID)
    db.collection('rooms').doc(currRoomID).collection('members').doc(currUser.uid).set({
      isOnline: false,
    }, { merge: true })

  if (isGuest){
    isGuest = false
    currUser = null
    showLogin()
  }
  else 
    firebase.auth().signOut()
}

function onAuthChange(callback) {
  firebase.auth().onAuthStateChanged(callback)
}

// Firebase login/auth state change, load the app
onAuthChange((user) => {
  if (isGuest) return
  if (user && user.displayName) {
    currUser = user
    showApp(user.displayName)
    startApp()
  } else {
    showLogin()
  }
})

// Guest login button
document.querySelector('.guest button').addEventListener('click', () => {
  const name = document.getElementById('guest-name-input').value.trim()
  if (name.length < 4) {
    document.querySelector('.guest p').innerHTML = `Name must be atleast 4 characters long`
    document.getElementById('guest-name-input').value = ''
    return
  }
  if (name.length > 18) {
    document.querySelector('.guest p').innerHTML = `Name must be under 18 characters`
    return
  }
  if (name) {
    isGuest = true
    firebase.auth().signInAnonymously().then((result) => {
      currUser = {
        displayName: name,
        uid: result.user.uid
      }
      showApp(name)
      startApp()
    }).catch((err) => {
      console.error("Guest login error:", err.message)
    })
  }
})

// Logout button
document.getElementById('logout-btn').addEventListener('click', () => {
  logout()
}) //