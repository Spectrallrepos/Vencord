
  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyAG1OG2R3ozmCCK-RakO7ADVMsLQTTgtPw",
    authDomain: "chatspace-d84e7.firebaseapp.com",
    projectId: "chatspace-d84e7",
    storageBucket: "chatspace-d84e7.firebasestorage.app",
    messagingSenderId: "506319143724",
    appId: "1:506319143724:web:82df340d59e5f994486289"
  };

  // Initialize Firebase
    firebase.initializeApp(firebaseConfig)

    const auth = firebase.auth()
    const db = firebase.firestore()