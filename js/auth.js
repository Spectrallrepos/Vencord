// js/auth.js
let currUser = null //an object storing username, uid, createdAt, etc
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
// stores user info in local db or cache, this fn looks for that
// then auto logs in
onAuthChange((user) => {
  if (isGuest) return //anonymous users should not be affected by auth state changes
  if (user && user.displayName) {
    currUser = user
    startApp()
    showApp(user.displayName)
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
        isGuest:true,
        uid: 'guest_'+ result.user.uid
      }
      startApp()
      showApp(name)
    }).catch((err) => {
      console.error("Guest login error:", err.message)
    })
  }
})

// Logout button
document.getElementById('logout-btn').addEventListener('click', () => {
  logout()
}) //